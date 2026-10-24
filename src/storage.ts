const VERSION = "1.0.0"
const PREFIX = "mental-weather"

export type CheckInKind = "morning" | "evening"

interface Versioned<T> {
  version: string
  data: T
}

function todayKey(kind: CheckInKind): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  return `${PREFIX}:${kind}_${date}`
}

export function loadToday<T>(kind: CheckInKind): T | null {
  try {
    const raw = localStorage.getItem(todayKey(kind))
    if (!raw) return null
    return (JSON.parse(raw) as Versioned<T>).data
  } catch (error) {
    console.error("Failed to load check-in", error)
    return null
  }
}

export function saveToday<T>(kind: CheckInKind, data: T): void {
  const payload: Versioned<T> = { version: VERSION, data }
  localStorage.setItem(todayKey(kind), JSON.stringify(payload))
}

export interface Settings {
  medicationName: string
}

export const DEFAULT_SETTINGS: Settings = { medicationName: "Promethazine" }

const SETTINGS_KEY = `${PREFIX}:settings`

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const data = (JSON.parse(raw) as Versioned<Partial<Settings>>).data
    return { ...DEFAULT_SETTINGS, ...data }
  } catch (error) {
    console.error("Failed to load settings", error)
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings): void {
  const payload: Versioned<Settings> = { version: VERSION, data: settings }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload))
}

export function listDays<T>(kind: CheckInKind): { date: string; data: T }[] {
  const prefix = `${PREFIX}:${kind}_`
  const out: { date: string; data: T }[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(prefix)) continue
    try {
      const raw = localStorage.getItem(key)
      if (raw) out.push({ date: key.slice(prefix.length), data: (JSON.parse(raw) as Versioned<T>).data })
    } catch (error) {
      console.error("Failed to read check-in", key, error)
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date))
}
