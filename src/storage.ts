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
