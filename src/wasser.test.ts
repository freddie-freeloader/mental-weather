import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  loadWasserToday,
  saveWasserToday,
  addWasserGlass,
  undoWasserGlass,
  getGlassCount,
  sanitizeWasserDay,
} from "./wasser"
import type { WasserDay } from "./wasser"

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  }
})()

vi.stubGlobal("localStorage", mockLocalStorage)

// Mock security module
vi.mock("./security", () => ({
  safeGetItem: vi.fn((key: string) => mockLocalStorage.getItem(key)),
  safeSetItem: vi.fn((key: string, value: unknown) => {
    mockLocalStorage.setItem(key, JSON.stringify(value))
  }),
  validateVersionedData: vi.fn(<T,>(data: unknown) => {
    if (!data) return null
    try {
      const parsed = JSON.parse(data as string) as { version?: string; data?: T }
      return parsed?.data ? { version: parsed.version ?? "1.0.0", data: parsed.data } : null
    } catch {
      return null
    }
  }),
}))

describe("Wasser Module", () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })

  describe("sanitizeWasserDay", () => {
    it("should handle valid glass array", () => {
      const input = { glasses: ["2024-01-01T10:00:00.000Z", "2024-01-01T11:00:00.000Z"] }
      const result = sanitizeWasserDay(input)
      expect(result.glasses).toEqual(["2024-01-01T10:00:00.000Z", "2024-01-01T11:00:00.000Z"])
    })

    it("should handle comma-separated string", () => {
      const input = { glasses: "2024-01-01T10:00:00.000Z,2024-01-01T11:00:00.000Z" }
      const result = sanitizeWasserDay(input)
      expect(result.glasses).toEqual(["2024-01-01T10:00:00.000Z", "2024-01-01T11:00:00.000Z"])
    })

    it("should handle empty input", () => {
      const result = sanitizeWasserDay(null)
      expect(result.glasses).toEqual([])
    })

    it("should filter invalid timestamps", () => {
      const input = { glasses: ["2024-01-01T10:00:00.000Z", "invalid", "2024-01-01T11:00:00.000Z"] }
      const result = sanitizeWasserDay(input)
      expect(result.glasses).toEqual(["2024-01-01T10:00:00.000Z", "2024-01-01T11:00:00.000Z"])
    })

    it("should limit to max glasses per day", () => {
      const glasses = Array.from({ length: 30 }, (_, i) => `2024-01-01T10:${i}:00.000Z`)
      const result = sanitizeWasserDay({ glasses })
      expect(result.glasses.length).toBeLessThanOrEqual(20)
    })
  })

  describe("loadWasserToday", () => {
    it("should return empty glasses when no data exists", () => {
      const now = new Date("2024-01-01T12:00:00.000Z")
      const result = loadWasserToday(now)
      expect(result.glasses).toEqual([])
    })

    it("should return saved glasses", () => {
      const now = new Date("2024-01-01T12:00:00.000Z")
      const day: WasserDay = { glasses: ["2024-01-01T10:00:00.000Z", "2024-01-01T11:00:00.000Z"] }
      saveWasserToday(day, now)
      const result = loadWasserToday(now)
      expect(result.glasses).toEqual(["2024-01-01T10:00:00.000Z", "2024-01-01T11:00:00.000Z"])
    })

    it("should handle corrupted data gracefully", () => {
      const now = new Date("2024-01-01T12:00:00.000Z")
      mockLocalStorage.setItem(
        "mental-weather:wasser_2024-01-01",
        JSON.stringify({ version: "1.0.0", data: { glasses: "not-a-string" } })
      )
      const result = loadWasserToday(now)
      expect(result.glasses).toEqual([])
    })
  })

  describe("addWasserGlass", () => {
    it("should add a glass", () => {
      const now = new Date("2024-01-01T12:00:00.000Z")
      const result = addWasserGlass(now)
      expect(result.glasses.length).toBe(1)
    })

    it("should add multiple glasses", () => {
      const now = new Date("2024-01-01T12:00:00.000Z")
      addWasserGlass(now)
      addWasserGlass(now)
      const result = addWasserGlass(now)
      expect(result.glasses.length).toBe(3)
    })

    it("should respect max glasses limit", () => {
      const now = new Date("2024-01-01T12:00:00.000Z")
      for (let i = 0; i < 25; i++) {
        addWasserGlass(now)
      }
      const result = loadWasserToday(now)
      expect(result.glasses.length).toBeLessThanOrEqual(20)
    })
  })

  describe("undoWasserGlass", () => {
    it("should remove a glass", () => {
      const now = new Date("2024-01-01T12:00:00.000Z")
      addWasserGlass(now)
      addWasserGlass(now)
      const result = undoWasserGlass(now)
      expect(result.glasses.length).toBe(1)
    })

    it("should handle empty list", () => {
      const now = new Date("2024-01-01T12:00:00.000Z")
      const result = undoWasserGlass(now)
      expect(result.glasses.length).toBe(0)
    })
  })

  describe("getGlassCount", () => {
    it("should return 0 when no glasses", () => {
      const now = new Date("2024-01-01T12:00:00.000Z")
      expect(getGlassCount(now)).toBe(0)
    })

    it("should return correct count", () => {
      const now = new Date("2024-01-01T12:00:00.000Z")
      addWasserGlass(now)
      addWasserGlass(now)
      addWasserGlass(now)
      expect(getGlassCount(now)).toBe(3)
    })
  })
})
