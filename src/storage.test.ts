// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addCoffeeEvent, loadCoffeeToday } from './coffee'
import { exportAll, importAll, listDays, loadToday, saveToday } from './storage'
import { addWasserGlass, loadWasserToday } from './wasser'

beforeEach(() => localStorage.clear())

describe('storage', () => {
  it('round-trips today\'s check-in per kind', () => {
    expect(loadToday('morning')).toBeNull()
    saveToday('morning', { a: 1 })
    expect(loadToday('morning')).toEqual({ a: 1 })
    expect(loadToday('evening')).toBeNull()
  })

  it('stores a versioned payload under a dated key', () => {
    saveToday('evening', { a: 1 })
    const [key] = Object.keys(localStorage)
    expect(key).toMatch(/^mental-weather:evening_\d{4}-\d{2}-\d{2}$/)
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual({ version: '1.0.0', data: { a: 1 } })
  })

  it('returns null for corrupted data', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    saveToday('morning', {})
    localStorage.setItem(Object.keys(localStorage)[0], '{nope')
    expect(loadToday('morning')).toBeNull()
    spy.mockRestore()
  })

  it('lists days newest first, only for the requested kind', () => {
    const v = (data: unknown) => JSON.stringify({ version: '1.0.0', data })
    localStorage.setItem('mental-weather:evening_2025-01-01', v({ mood: 1 }))
    localStorage.setItem('mental-weather:evening_2025-03-01', v({ mood: 3 }))
    localStorage.setItem('mental-weather:evening_2025-02-01', v({ mood: 2 }))
    localStorage.setItem('mental-weather:morning_2025-04-01', v({ mood: 4 }))
    localStorage.setItem('other', 'x')
    expect(listDays('evening').map((d) => d.date)).toEqual(['2025-03-01', '2025-02-01', '2025-01-01'])
    expect(listDays('morning')).toHaveLength(1)
  })

  it('skips corrupted entries when listing', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorage.setItem('mental-weather:evening_2025-01-01', '{bad')
    expect(listDays('evening')).toEqual([])
    spy.mockRestore()
  })

  it('round-trips a backup and rejects foreign files', () => {
    localStorage.setItem('mental-weather:morning_2025-01-01', JSON.stringify({ version: '1.0.0', data: { a: 1 } }))
    const json = JSON.stringify(exportAll())
    localStorage.clear()
    expect(importAll(json)).toBe(1)
    expect(listDays('morning')).toEqual([{ date: '2025-01-01', data: { a: 1 } }])
    expect(() => importAll('{"x":1}')).toThrow()
  })

  it('stores free text as typed', () => {
    saveToday('evening', { notes: 'I felt <angry> today', aside: 'tired & wired' })
    expect(loadToday('evening')).toEqual({ notes: 'I felt <angry> today', aside: 'tired & wired' })
    const raw = localStorage.getItem(Object.keys(localStorage)[0])
    expect(raw).toContain('I felt <angry> today')
    expect(raw).toContain('tired & wired')
    expect(raw).not.toContain('&amp;')
    expect(raw).not.toContain('&lt;')
  })

  it('still loads previously stored text', () => {
    localStorage.setItem(
      'mental-weather:evening_2025-01-01',
      JSON.stringify({ version: '1.0.0', data: { notes: 'tired &amp; wired' } }),
    )
    expect(listDays('evening')).toEqual([{ date: '2025-01-01', data: { notes: 'tired &amp; wired' } }])
  })

  it('round-trips every exported entry, including wasser', () => {
    const when = new Date('2025-06-01T12:00:00Z')
    addWasserGlass(when)
    addCoffeeEvent(when)
    saveToday('morning', { notes: 'I felt <angry> today' })
    const exported = exportAll()
    const wasser = Object.entries(exported.entries).find(([key]) => key.startsWith('wasser_'))
    expect(wasser?.[1]).toEqual({ glasses: [when.toISOString()] })
    const json = JSON.stringify(exported)
    localStorage.clear()
    expect(importAll(json)).toBe(3)
    expect(loadWasserToday(when).glasses).toEqual([when.toISOString()])
    expect(loadCoffeeToday(when).events).toEqual([when.toISOString()])
    expect(loadToday('morning')).toEqual({ notes: 'I felt <angry> today' })
  })

  it('imports legacy comma-joined wasser glasses', () => {
    const json = JSON.stringify({
      app: 'mental-weather',
      entries: {
        'wasser_2025-06-01': { glasses: '2025-06-01T08:00:00.000Z,2025-06-01T09:00:00.000Z' },
      },
    })
    expect(importAll(json)).toBe(1)
    expect(loadWasserToday(new Date('2025-06-01T12:00:00')).glasses).toEqual([
      '2025-06-01T08:00:00.000Z',
      '2025-06-01T09:00:00.000Z',
    ])
  })

  it('skips unsafe or oversized backup entries', () => {
    const entries: Record<string, unknown> = Object.create(null)
    entries['__proto__'] = { admin: true }
    entries['wasser_<script>'] = { glasses: ['2025-06-01T12:00:00.000Z'] }
    entries['morning_2025-01-01'] = { notes: 'x'.repeat(20_000) }
    entries['wasser_2025-06-01'] = { glasses: ['2025-06-01T12:00:00.000Z'] }
    const json = JSON.stringify({ app: 'mental-weather', entries })
    expect(importAll(json)).toBe(1)
    expect(localStorage.getItem('mental-weather:wasser_2025-06-01')).toContain('2025-06-01T12:00:00.000Z')
    expect(Object.keys(localStorage).some((key) => key.includes('script') || key.includes('proto'))).toBe(false)
    expect(Object.prototype).not.toHaveProperty('admin')
  })
})
