// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { exportAll, importAll, listDays, loadSettings, loadToday, saveSettings, saveToday } from './storage'

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

  it('defaults the archetype set to animals for existing settings', () => {
    expect(loadSettings()).toEqual({ medicationName: 'Promethazine', archetypeSet: 'animals' })
    localStorage.setItem('mental-weather:settings', JSON.stringify({ version: '1.0.0', data: { medicationName: 'Lithium' } }))
    expect(loadSettings()).toEqual({ medicationName: 'Lithium', archetypeSet: 'animals' })
  })

  it('persists the archetype set and keeps it when medication is saved', () => {
    saveSettings({ archetypeSet: 'flowers' })
    expect(loadSettings().archetypeSet).toBe('flowers')
    saveSettings({ medicationName: 'Lithium' })
    expect(loadSettings()).toEqual({ medicationName: 'Lithium', archetypeSet: 'flowers' })
  })

  it('falls back when the stored archetype set is unknown', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorage.setItem(
      'mental-weather:settings',
      JSON.stringify({ version: '1.0.0', data: { medicationName: 'Lithium', archetypeSet: 'dragons' } }),
    )
    expect(loadSettings()).toEqual({ medicationName: 'Lithium', archetypeSet: 'animals' })
    localStorage.setItem('mental-weather:settings', '{nope')
    expect(loadSettings().archetypeSet).toBe('animals')
    spy.mockRestore()
  })

  it('round-trips the archetype set through a backup', () => {
    saveSettings({ medicationName: 'Lithium', archetypeSet: 'flowers' })
    const json = JSON.stringify(exportAll())
    localStorage.clear()
    expect(importAll(json)).toBe(0)
    expect(loadSettings()).toEqual({ medicationName: 'Lithium', archetypeSet: 'flowers' })
    importAll(JSON.stringify({ app: 'mental-weather', entries: {}, settings: { medicationName: 'Lithium', archetypeSet: 'dragons' } }))
    expect(loadSettings()).toEqual({ medicationName: 'Lithium', archetypeSet: 'animals' })
  })

  it('round-trips a backup and rejects foreign files', () => {
    localStorage.setItem('mental-weather:morning_2025-01-01', JSON.stringify({ version: '1.0.0', data: { a: 1 } }))
    const json = JSON.stringify(exportAll())
    localStorage.clear()
    expect(importAll(json)).toBe(1)
    expect(listDays('morning')).toEqual([{ date: '2025-01-01', data: { a: 1 } }])
    expect(() => importAll('{"x":1}')).toThrow()
  })
})
