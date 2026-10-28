import { loadQuestionnaire, sanitizeQuestionnaire, saveQuestionnaire } from "./questionnaire"
const VERSION = "1.0.0"
const PREFIX = "mental-weather"

export type CheckInKind = "morning" | "evening"

interface Versioned<T> {
  version: string
  data: T
}

import {
  validateVersionedData,
  validateCheckInData,
  MAX_DATA_SIZE,
  MAX_ENTRIES,
  initSecurity,
  safeGetItem,
  safeSetItem,
} from './security'

// Initialize security on module load
initSecurity()

function todayKey(kind: CheckInKind): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  return `${PREFIX}:${kind}_${date}`
}

function validateStorageKey(key: string): boolean {
  return key.startsWith(`${PREFIX}:`)
}

/**
 * Check if storage would exceed limits
 */
function checkStorageLimits(): boolean {
  try {
    // Check total number of entries
    let count = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && validateStorageKey(key)) {
        count++
        if (count > MAX_ENTRIES) {
          console.warn(`[SECURITY] Storage limit exceeded: ${count} entries`)
          return false
        }
      }
    }
    return true
  } catch {
    return false
  }
}

export function loadToday<T>(kind: CheckInKind): T | null {
  try {
    const key = todayKey(kind)
    const raw = safeGetItem(key)
    if (!raw) return null
    
    const versioned = validateVersionedData<T>(raw)
    if (!versioned) {
      console.error("Invalid versioned data format")
      return null
    }
    
    // Validate the actual data structure
    if (!validateCheckInData(versioned.data)) {
      console.error("Invalid check-in data structure")
      return null
    }
    
    return versioned.data
  } catch (error) {
    console.error("Failed to load check-in", error)
    return null
  }
}

export function saveToday<T>(kind: CheckInKind, data: T): void {
  // Validate data before saving
  if (!validateCheckInData(data)) {
    console.error("Invalid data structure, not saving")
    return
  }
  
  // Check storage limits
  if (!checkStorageLimits()) {
    console.error("Storage limit exceeded, not saving")
    return
  }
  
  const key = todayKey(kind)
  const payload: Versioned<T> = { version: VERSION, data }
  
  try {
    const json = JSON.stringify(payload)
    
    // Check size limit
    if (json.length > MAX_DATA_SIZE) {
      console.error("Data size exceeds limit, not saving")
      return
    }
    
    safeSetItem(key, payload)
  } catch (error) {
    console.error("Failed to save check-in", error)
  }
}

export interface Settings {
  medicationName: string
}

export const DEFAULT_SETTINGS: Settings = { medicationName: "Promethazine" }

const SETTINGS_KEY = `${PREFIX}:settings`
export const QUESTIONNAIRE_KEY = `${PREFIX}:questionnaire`

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
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith(prefix)) continue
      
      try {
        const raw = safeGetItem(key)
        if (!raw) continue
        
        const versioned = validateVersionedData<T>(raw)
        if (!versioned) {
          console.error("Invalid versioned data format for key:", key)
          continue
        }
        
        // Validate the data structure
        if (!validateCheckInData(versioned.data)) {
          console.error("Invalid check-in data structure for key:", key)
          continue
        }
        
        out.push({ date: key.slice(prefix.length), data: versioned.data })
      } catch (error) {
        console.error("Failed to read check-in", key, error)
      }
    }
    
    return out.sort((a, b) => b.date.localeCompare(a.date))
  } catch (error) {
    console.error("Failed to list days", error)
    return []
  }
}

export interface Backup {
  app: "mental-weather"
  version: string
  exportedAt: string
  settings: Settings
  entries: Record<string, unknown>
  questionnaire?: unknown
}

export function exportAll(): Backup {
  const entries: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(`${PREFIX}:`) || key === SETTINGS_KEY || key === QUESTIONNAIRE_KEY) continue
    try {
      const raw = localStorage.getItem(key)
      if (raw) entries[key.slice(PREFIX.length + 1)] = (JSON.parse(raw) as Versioned<unknown>).data
    } catch (error) {
      console.error("Failed to export", key, error)
    }
  }
  return { app: "mental-weather", version: VERSION, exportedAt: new Date().toISOString(), settings: loadSettings(), entries, questionnaire: loadQuestionnaire() }
}

const ENTRY_KEY = /^(morning|evening)_\d{4}-\d{2}-\d{2}$/

// Overwrites entries with the same day; returns the number of imported entries.
export function importAll(json: string): number {
  const parsed: unknown = JSON.parse(json)
  if (typeof parsed !== "object" || parsed === null) throw new Error("Invalid backup file")
  const b = parsed as Partial<Backup>
  if (b.app !== "mental-weather" || typeof b.entries !== "object" || b.entries === null) {
    throw new Error("Not a mental-weather backup")
  }
  let count = 0
  for (const [key, data] of Object.entries(b.entries)) {
    if (!ENTRY_KEY.test(key)) continue
    const payload: Versioned<unknown> = { version: VERSION, data }
    localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(payload))
    count++
  }
  if (b.questionnaire) saveQuestionnaire(sanitizeQuestionnaire(b.questionnaire))
  if (b.settings) saveSettings({ ...DEFAULT_SETTINGS, ...b.settings })
  return count
}
