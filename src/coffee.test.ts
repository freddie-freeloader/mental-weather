// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { addCoffeeEvent, loadCoffeeToday, sanitizeCoffeeDay, undoCoffeeEvent } from './coffee'
import { exportAll, importAll } from './storage'

describe('coffee events', () => {
  beforeEach(() => localStorage.clear())

  it('starts empty', () => {
    expect(loadCoffeeToday().events).toEqual([])
  })

  it('persists events across loads', () => {
    addCoffeeEvent(new Date('2025-04-01T08:00:00'))
    addCoffeeEvent(new Date('2025-04-01T10:30:00'))
    const day = loadCoffeeToday(new Date('2025-04-01T12:00:00'))
    expect(day.events).toHaveLength(2)
  })

  it('keeps days separate', () => {
    addCoffeeEvent(new Date('2025-04-01T08:00:00'))
    expect(loadCoffeeToday(new Date('2025-04-02T08:00:00')).events).toEqual([])
  })

  it('undoes the last event', () => {
    const t = new Date('2025-04-01T08:00:00')
    addCoffeeEvent(t)
    addCoffeeEvent(t)
    expect(undoCoffeeEvent(t).events).toHaveLength(1)
    expect(undoCoffeeEvent(t).events).toHaveLength(0)
    expect(undoCoffeeEvent(t).events).toHaveLength(0)
  })

  it('caps events per day at 50', () => {
    const t = new Date('2025-04-01T08:00:00')
    for (let i = 0; i < 60; i++) addCoffeeEvent(t)
    expect(loadCoffeeToday(t).events).toHaveLength(50)
  })

  it('drops invalid timestamps and tolerates corrupt storage', () => {
    expect(sanitizeCoffeeDay({ events: 'nope,2025-04-01T08:00:00.000Z' }).events).toEqual(['2025-04-01T08:00:00.000Z'])
    expect(sanitizeCoffeeDay(null).events).toEqual([])
    localStorage.setItem('mental-weather:coffee_2025-04-01', '{not json')
    expect(loadCoffeeToday(new Date('2025-04-01T08:00:00')).events).toEqual([])
  })

  it('survives export and import', () => {
    const t = new Date('2025-04-01T08:00:00')
    addCoffeeEvent(t)
    const backup = JSON.stringify(exportAll())
    localStorage.clear()
    expect(importAll(backup)).toBe(1)
    expect(loadCoffeeToday(t).events).toHaveLength(1)
  })
})
