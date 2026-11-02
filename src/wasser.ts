import { safeGetItem, safeSetItem, validateVersionedData } from "./security"

const VERSION = "1.0.0"
const MAX_GLASSES_PER_DAY = 20

export interface WasserDay {
  glasses: string[]
}

function dayKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `mental-weather:wasser_${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function sanitizeWasserDay(data: unknown): WasserDay {
  const raw = (data as { glasses?: unknown } | null)?.glasses
  const list = Array.isArray(raw) ? raw : typeof raw === "string" && raw ? raw.split(",") : []
  const glasses = list
    .filter((e): e is string => typeof e === "string" && !Number.isNaN(Date.parse(e)))
    .slice(-MAX_GLASSES_PER_DAY)
  return { glasses }
}

export function loadWasserToday(now = new Date()): WasserDay {
  try {
    const versioned = validateVersionedData<WasserDay>(safeGetItem(dayKey(now)))
    return sanitizeWasserDay(versioned?.data)
  } catch (error) {
    console.error("Failed to load water glasses", error)
    return { glasses: [] }
  }
}

export function saveWasserToday(day: WasserDay, now = new Date()): void {
  safeSetItem(dayKey(now), { version: VERSION, data: { glasses: sanitizeWasserDay(day).glasses.join(",") } })
}

export function addWasserGlass(now = new Date()): WasserDay {
  const day = loadWasserToday(now)
  const next = { glasses: [...day.glasses, now.toISOString()].slice(-MAX_GLASSES_PER_DAY) }
  saveWasserToday(next, now)
  return next
}

export function undoWasserGlass(now = new Date()): WasserDay {
  const day = loadWasserToday(now)
  const next = { glasses: day.glasses.slice(0, -1) }
  saveWasserToday(next, now)
  return next
}

export function getGlassCount(now = new Date()): number {
  return loadWasserToday(now).glasses.length
}
