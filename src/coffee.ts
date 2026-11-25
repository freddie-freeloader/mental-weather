import { safeGetItem, safeSetItem, validateVersionedData } from "./security"
import { readTimestampField } from "./timestamps"

const VERSION = "1.0.0"
const MAX_EVENTS_PER_DAY = 50

export interface CoffeeDay {
  events: string[]
}

function dayKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `mental-weather:coffee_${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function sanitizeCoffeeDay(data: unknown): CoffeeDay {
  return { events: readTimestampField(data, "events", MAX_EVENTS_PER_DAY) }
}

export function loadCoffeeToday(now = new Date()): CoffeeDay {
  try {
    const versioned = validateVersionedData<CoffeeDay>(safeGetItem(dayKey(now)))
    return sanitizeCoffeeDay(versioned?.data)
  } catch (error) {
    console.error("Failed to load coffee events", error)
    return { events: [] }
  }
}

export function saveCoffeeToday(day: CoffeeDay, now = new Date()): void {
  safeSetItem(dayKey(now), { version: VERSION, data: { events: sanitizeCoffeeDay(day).events } })
}

export function addCoffeeEvent(now = new Date()): CoffeeDay {
  const day = loadCoffeeToday(now)
  const next = { events: [...day.events, now.toISOString()].slice(-MAX_EVENTS_PER_DAY) }
  saveCoffeeToday(next, now)
  return next
}

export function undoCoffeeEvent(now = new Date()): CoffeeDay {
  const day = loadCoffeeToday(now)
  const next = { events: day.events.slice(0, -1) }
  saveCoffeeToday(next, now)
  return next
}
