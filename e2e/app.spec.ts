import { test, expect } from '@playwright/test'

test('loads and switches tabs', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('tab', { name: /Morning Check-In/ })).toBeVisible()
  await page.getByRole('tab', { name: /Evening Check-In/ }).click()
  await expect(page.getByRole('heading', { name: 'Evening Check-In' })).toBeVisible()
  await page.getByRole('tab', { name: /Example Form/ }).click()
  await page.getByRole('tab', { name: /Morning Check-In/ }).click()
  await expect(page.getByRole('heading', { name: 'Morning Check-In' })).toBeVisible()
})

test('morning check-in persists to localStorage', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Submit Morning Check-In' }).click()
  await expect(page.getByText('Morning check-in saved')).toBeVisible()
  const keys = await page.evaluate(() => Object.keys(localStorage))
  expect(keys.some((k) => k.startsWith('mental-weather:morning_'))).toBe(true)

  await page.reload()
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
    if (localStorage.length) return
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
