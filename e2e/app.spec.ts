import { test, expect } from '@playwright/test'
import { analyzeSet, getArchetypeSet } from '../src/archetypes'

const SAMPLE = { averageMood: 4, averageEnergy: 4, selfWorth: 4 }
const SAMPLE_ANIMAL = analyzeSet(SAMPLE, getArchetypeSet('animals')).archetype.name
const SAMPLE_FLOWER = analyzeSet(SAMPLE, getArchetypeSet('flowers')).archetype.name

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('ophelia-pansies-seen-welcome', '1')
  })
})

test('loads and switches tabs', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('tab', { name: /Morning Check-In/ })).toBeVisible()
  await page.getByRole('tab', { name: /Evening Check-In/ }).click()
  await expect(page.getByRole('heading', { name: 'Evening Check-In' })).toBeVisible()
  await page.getByRole('tab', { name: /Morning Check-In/ }).click()
  await expect(page.getByRole('heading', { name: 'Morning Check-In' })).toBeVisible()
})

test('morning check-in persists to localStorage', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /Morning Check-In/ }).click()
  await page.getByRole('button', { name: 'Submit Morning Check-In' }).click()
  await expect(page.getByText('Morning check-in saved')).toBeVisible()
  const keys = await page.evaluate(() => Object.keys(localStorage))
  expect(keys.some((k) => k.startsWith('mental-weather:morning_'))).toBe(true)

  await page.reload()
  await page.getByRole('tab', { name: /Morning Check-In/ }).click()
  await expect(page.getByRole('heading', { name: 'Morning Check-In' })).toBeVisible()
})

test('evening check-in saves', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /Evening Check-In/ }).click()
  await page.getByRole('button', { name: /Submit Evening Check-In/ }).click()
  await expect(page.getByTestId('animal-card')).toContainText('Your Animal Archetype Today')
  const keys = await page.evaluate(() => Object.keys(localStorage))
  expect(keys.some((k) => k.startsWith('mental-weather:evening_'))).toBe(true)
})

test('no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await expect(page.getByRole('tab', { name: /Morning Check-In/ })).toBeVisible()
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
  await page.getByRole('tab', { name: /Evening Check-In/ }).click()
  const overflow2 = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow2).toBeLessThanOrEqual(0)
})

test('animal card: placeholder, then appears after evening submit', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.getByRole('tab', { name: /My Animal/ }).click()
  const card = page.getByTestId('animal-card')
  await expect(card).toContainText('animal archetype is waiting')

  await page.getByRole('tab', { name: /Evening Check-In/ }).click()
  await page.getByRole('button', { name: /Submit Evening Check-In/ }).click()

  await expect(page.getByRole('tab', { name: /My Animal/ })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByTestId('animal-card')).toContainText('Your Animal Archetype Today')
})

test('preview mode cycles through animals and exits', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.getByRole('tab', { name: /My Animal/ }).click()
  const card = page.getByTestId('animal-card')
  await page.getByTestId('preview-toggle').click()
  await expect(card).toContainText('Preview: 1 of')
  const name = await card.getByRole('heading', { level: 3 }).innerText()

  await card.getByRole('button', { name: /Next/ }).click()
  await expect(card).toContainText('Preview: 2 of')
  expect(await card.getByRole('heading', { level: 3 }).innerText()).not.toBe(name)

  await card.getByRole('button', { name: /Previous/ }).click()
  await expect(card).toContainText('Preview: 1 of')
  await card.getByRole('button', { name: /Random/ }).click()
  await expect(card).toContainText(/Preview: \d+ of/)

  await page.getByTestId('preview-toggle').click()
  await expect(card).toContainText('animal archetype is waiting')
})

test('history lists past days, newest first', async ({ page }) => {
  await page.addInitScript(() => {
    const entry = { version: '1.0.0', data: { averageMood: 7, averageEnergy: 6 } }
    localStorage.setItem('mental-weather:evening_2025-01-01', JSON.stringify(entry))
    localStorage.setItem('mental-weather:evening_2025-01-03', JSON.stringify(entry))
  })
  await page.goto('/')
  await page.getByRole('tab', { name: /History/ }).click()
  const items = page.getByTestId('history-item')
  await expect(items).toHaveCount(2)
  await expect(items.first()).toContainText('Jan 3')
  await expect(items.last()).toContainText('Jan 1')
})

test('history empty state', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /History/ }).click()
  await expect(page.getByText(/No past check-ins yet/)).toBeVisible()
})

test('saved check-ins reload on revisit', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /Morning Check-In/ }).click()
  await page.getByRole('button', { name: 'Submit Morning Check-In' }).click()
  await expect(page.getByText('Morning check-in saved')).toBeVisible()

  await page.reload()
  await page.getByRole('tab', { name: /Morning Check-In/ }).click()
  await expect(page.getByText('Loaded existing report for today')).toBeVisible()
})

test('saved evening result shows on My Animal after reload and in History', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /Evening Check-In/ }).click()
  await page.getByRole('button', { name: /Submit Evening Check-In/ }).click()
  await page.reload()
  await page.getByRole('tab', { name: /My Animal/ }).click()
  await expect(page.getByTestId('animal-card')).toContainText('Your Animal Archetype Today')
  await page.getByRole('tab', { name: /History/ }).click()
  await expect(page.getByTestId('history-item')).toHaveCount(1)
})

test('switching archetype set updates labels, the card, and history', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.addInitScript((sample) => {
    const entry = { version: '1.0.0', data: sample }
    localStorage.setItem('mental-weather:evening_2025-06-01', JSON.stringify(entry))
  }, SAMPLE)
  await page.goto('/')
  await expect(page.getByText("Pansies, that's for thoughts. Today's animal follows your check-in.")).toBeVisible()

  await page.getByRole('tab', { name: /My Animal/ }).click()
  const card = page.getByTestId('animal-card')
  const setPicker = page.getByTestId('archetype-set')
  await expect(setPicker.getByRole('button', { name: 'Animals' })).toHaveAttribute('aria-pressed', 'true')
  await expect(card).toContainText('hatch it')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)

  await setPicker.getByRole('button', { name: "Ophelia's Flowers" }).click()
  await expect(page.getByText("Pansies, that's for thoughts. Today's flower follows your check-in.")).toBeVisible()
  await expect(page.getByRole('tab', { name: /My Flower/ })).toHaveAttribute('aria-selected', 'true')
  await expect(card).toContainText('see it bloom')
  await expect(card).not.toContainText('hatch it')
  await expect(page.getByTestId('preview-toggle')).toContainText('Preview all flowers')

  await page.getByTestId('preview-toggle').click()
  await expect(card).toContainText('Your Flower Archetype Today')
  await expect(card.getByRole('heading', { level: 3 })).toHaveText(getArchetypeSet('flowers').items[0].name)
  await page.getByTestId('preview-toggle').click()

  await page.getByRole('tab', { name: /History/ }).click()
  await expect(page.getByTestId('history-item')).toContainText(SAMPLE_FLOWER)
  await expect(page.getByTestId('history-item')).not.toContainText(SAMPLE_ANIMAL)

  await page.reload()
  await expect(page.getByText("Pansies, that's for thoughts. Today's flower follows your check-in.")).toBeVisible()
  await page.getByRole('tab', { name: /My Flower/ }).click()
  await expect(page.getByTestId('archetype-set').getByRole('button', { name: "Ophelia's Flowers" })).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('tab', { name: /Evening Check-In/ }).click()
  await page.getByRole('button', { name: /Submit Evening Check-In/ }).click()
  await expect(page.getByRole('tab', { name: /My Flower/ })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByTestId('animal-card')).toContainText('Your Flower Archetype Today')

  await page.getByTestId('archetype-set').getByRole('button', { name: 'Animals' }).click()
  await expect(page.getByRole('tab', { name: /My Animal/ })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByTestId('animal-card')).toContainText('Your Animal Archetype Today')
  await expect(page.getByTestId('animal-card').getByRole('heading', { level: 3 })).not.toHaveText(SAMPLE_FLOWER)

  await page.getByRole('tab', { name: /History/ }).click()
  const past = page.getByTestId('history-item').filter({ hasText: 'Jun 1' })
  await expect(past).toContainText(SAMPLE_ANIMAL)
  await expect(past).not.toContainText(SAMPLE_FLOWER)

  await page.reload()
  await expect(page.getByText("Pansies, that's for thoughts. Today's animal follows your check-in.")).toBeVisible()
  await page.getByRole('tab', { name: /History/ }).click()
  await expect(page.getByTestId('history-item').filter({ hasText: 'Jun 1' })).toContainText(SAMPLE_ANIMAL)
})

test('works when served from a sub-path (GitHub Pages)', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.route('**/mental-weather/**', (route) => {
    const url = new URL(route.request().url())
    return route.continue({ url: url.origin + url.pathname.replace('/mental-weather', '') + url.search })
  })
  await page.goto('/mental-weather/')
  await expect(page.getByRole('tab', { name: /Morning Check-In/ })).toBeVisible()
  expect(errors).toEqual([])
})

test('coffee events are logged, persisted and undoable', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /Coffee/ }).click()
  await expect(page.getByText('No coffee logged yet.')).toBeVisible()
  await page.getByRole('button', { name: '+ Cup' }).click()
  await page.getByRole('button', { name: '+ Cup' }).click()
  await expect(page.getByText('2 / 10 cups')).toBeVisible()

  await page.reload()
  await page.getByRole('tab', { name: /Coffee/ }).click()
  await expect(page.getByText('2 / 10 cups')).toBeVisible()
  const keys = await page.evaluate(() => Object.keys(localStorage))
  expect(keys.some((k) => k.startsWith('mental-weather:coffee_'))).toBe(true)

  await page.getByRole('button', { name: 'Undo last' }).click()
  await expect(page.getByText('1 / 10 cups')).toBeVisible()
})

test('importing a backup updates the archetype set without a reload', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText("Pansies, that's for thoughts. Today's animal follows your check-in.")).toBeVisible()
  await page.getByRole('tab', { name: /History/ }).click()

  const file = (name: string, settings: { medicationName: string; archetypeSet?: string }) => ({
    name,
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ app: 'mental-weather', entries: {}, settings })),
  })

  await page.getByTestId('import-input').setInputFiles(
    file('flowers.json', { medicationName: 'Promethazine', archetypeSet: 'flowers' }),
  )
  await expect(page.getByText('Imported 0 entries')).toBeVisible()
  await expect(page.getByText("Pansies, that's for thoughts. Today's flower follows your check-in.")).toBeVisible()
  await page.getByRole('tab', { name: /My Flower/ }).click()
  await expect(page.getByRole('button', { name: "Ophelia's Flowers" })).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('tab', { name: /History/ }).click()
  await page.getByTestId('import-input').setInputFiles(file('legacy.json', { medicationName: 'Promethazine' }))
  await expect(page.getByText("Pansies, that's for thoughts. Today's animal follows your check-in.")).toBeVisible()
  await page.getByRole('tab', { name: /My Animal/ }).click()
  await expect(page.getByTestId('archetype-set').getByRole('button', { name: 'Animals' })).toHaveAttribute('aria-pressed', 'true')
})

test('ziggy meter reads today\'s check-in', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /Ziggy/ }).click()
  await expect(page.getByText('Fill in a check-in today')).toBeVisible()

  await page.getByRole('tab', { name: /Morning Check-In/ }).click()
  await page.getByRole('button', { name: 'Submit Morning Check-In' }).click()
  await expect(page.getByText('Morning Check-In saved')).toBeVisible()
  await page.getByRole('tab', { name: /Ziggy/ }).click()
  await expect(page.getByText('5 / 10')).toBeVisible()
})

test('welcome greets a first visit', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-06-15T10:00:00') })
  await page.addInitScript(() => {
    localStorage.removeItem('ophelia-pansies-seen-welcome')
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()
  await expect(page.getByText("Pansies, that's for thoughts.")).toBeVisible()
  await page.getByRole('button', { name: "Begin today's check-in" }).click()
  await expect(page.getByRole('heading', { name: 'Morning Check-In' })).toBeVisible()
  const seen = await page.evaluate(() => localStorage.getItem('ophelia-pansies-seen-welcome'))
  expect(seen).toBe('1')
})

test('greeting follows the day when the page is visible again', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-06-15T10:00:00') })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Good morning' })).toBeVisible()
  await page.clock.setFixedTime(new Date('2026-06-16T20:00:00'))
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))
  await expect(page.getByRole('heading', { name: 'Good evening' })).toBeVisible()
  await expect(page.locator('.today')).toContainText('16')
})

test('theme toggle keeps the choice', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Light' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: 'Dark' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('more menu reaches coffee on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('tab', { name: /Coffee/ })).toBeHidden()
  await page.getByRole('button', { name: 'More' }).click()
  await page.getByRole('tab', { name: /Coffee/ }).click()
  await expect(page.getByRole('button', { name: 'More' })).toBeFocused()
  await expect(page.getByText('No coffee logged yet.')).toBeVisible()
})

test('more menu stays open while arrowing and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const more = page.getByRole('button', { name: 'More' })
  await more.click()
  const coffee = page.getByRole('tab', { name: /Coffee/ })
  await coffee.focus()
  await page.keyboard.press('ArrowDown')
  await expect(coffee).toBeVisible()
  await expect(page.getByRole('tab', { name: /Wasser/ })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(coffee).toBeHidden()
  await expect(more).toBeFocused()
})
