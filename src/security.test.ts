import { describe, it, expect, beforeEach } from 'vitest'
import {
  escapeHtml,
  sanitizeString,
  sanitizeNumber,
  sanitizeObject,
  validateStorageKey,
  validateCheckInData,
  validateVersionedData,
  SECURITY_VERSION,
  MAX_DATA_SIZE,
  MAX_ENTRIES,
} from './security'

describe('Security Utilities', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
      expect(escapeHtml('&')).toBe('&amp;')
      expect(escapeHtml('"')).toBe('&quot;')
      expect(escapeHtml("'")).toBe('&#x27;')
      expect(escapeHtml('<div>test</div>')).toBe('&lt;div&gt;test&lt;/div&gt;')
    })

    it('should handle empty string', () => {
      expect(escapeHtml('')).toBe('')
    })

    it('should handle non-string input', () => {
      expect(escapeHtml(null as unknown as string)).toBe('')
      expect(escapeHtml(undefined as unknown as string)).toBe('')
    })
  })

  describe('sanitizeString', () => {
    it('should escape HTML special characters', () => {
      const result = sanitizeString('<script>alert("xss")</script>')
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('</script>')
      expect(result).toContain('alert')
    })

    it('should remove event handlers', () => {
      const result = sanitizeString('<img onerror="alert(1)" src="x">')
      expect(result).not.toContain('onerror=')
      expect(result).toContain('src=')
    })

    it('should remove javascript: URLs', () => {
      const result = sanitizeString('<a href="javascript:alert(1)">click</a>')
      expect(result).not.toContain('javascript:')
      expect(result).toContain('click')
    })

    it('should remove HTML tags', () => {
      const result = sanitizeString('<div>test</div>')
      expect(result).not.toContain('<div>')
      expect(result).not.toContain('</div>')
      expect(result).toContain('test')
    })

    it('should trim whitespace', () => {
      expect(sanitizeString('  test  ')).toBe('test')
    })

    it('should handle non-string input', () => {
      expect(sanitizeString(null as unknown as string)).toBe('')
      expect(sanitizeString(undefined as unknown as string)).toBe('')
    })
  })

  describe('sanitizeNumber', () => {
    it('should sanitize valid numbers', () => {
      expect(sanitizeNumber(5)).toBe(5)
      expect(sanitizeNumber(-3)).toBe(-3)
      expect(sanitizeNumber(3.14)).toBe(3.14)
    })

    it('should clamp to min/max bounds', () => {
      expect(sanitizeNumber(100, -10, 10)).toBe(10)
      expect(sanitizeNumber(-100, -10, 10)).toBe(-10)
    })

    it('should return 0 for NaN', () => {
      expect(sanitizeNumber(NaN)).toBe(0)
    })

    it('should return 0 for Infinity', () => {
      expect(sanitizeNumber(Infinity)).toBe(0)
      expect(sanitizeNumber(-Infinity)).toBe(0)
    })

    it('should return 0 for non-numeric input', () => {
      expect(sanitizeNumber('not a number')).toBe(0)
      expect(sanitizeNumber(null)).toBe(0)
      expect(sanitizeNumber(undefined)).toBe(0)
    })
  })

  describe('sanitizeObject', () => {
    it('should sanitize all string values', () => {
      const input = { name: '<script>test</script>' }
      const result = sanitizeObject(input)
      expect(result.name).not.toContain('<script>')
      expect(result.name).toContain('test')
    })

    it('should preserve valid number values', () => {
      const input = { value: 1000 }
      const result = sanitizeObject(input)
      expect(result.value).toBe(1000)
    })

    it('should handle nested objects', () => {
      const input = { 
        user: { 
          name: '<script>test</script>',
          age: 150 
        } 
      }
      const result = sanitizeObject(input)
      expect((result.user as Record<string, unknown>).name).not.toContain('<script>')
      expect((result.user as Record<string, unknown>).age).toBe(150)
    })

    it('should preserve null and undefined', () => {
      const input = { a: null, b: undefined }
      const result = sanitizeObject(input)
      expect(result.a).toBe(null)
      expect(result.b).toBe(null)
    })

    it('should preserve booleans', () => {
      const input = { flag: true }
      const result = sanitizeObject(input)
      expect(result.flag).toBe(true)
    })
  })

  describe('validateStorageKey', () => {
    it('should accept valid keys with prefix', () => {
      expect(validateStorageKey('mental-weather:morning_2024-01-01')).toBe(true)
      expect(validateStorageKey('mental-weather:evening_2024-01-01')).toBe(true)
    })

    it('should reject keys without prefix', () => {
      expect(validateStorageKey('other-key')).toBe(false)
      expect(validateStorageKey('')).toBe(false)
    })

    it('should reject keys with invalid characters', () => {
      expect(validateStorageKey('mental-weather:<script>')).toBe(false)
      expect(validateStorageKey('mental-weather:key"onerror')).toBe(false)
    })

    it('should reject non-string keys', () => {
      expect(validateStorageKey(null as unknown as string)).toBe(false)
      expect(validateStorageKey(undefined as unknown as string)).toBe(false)
    })
  })

  describe('validateCheckInData', () => {
    it('should accept valid check-in data', () => {
      const validData = {
        mood: 3,
        energy: 4,
        notes: 'test note'
      }
      expect(validateCheckInData(validData)).toBe(true)
    })

    it('should accept data with null/undefined values', () => {
      const data = {
        mood: null,
        energy: undefined,
        notes: null
      }
      expect(validateCheckInData(data)).toBe(true)
    })

    it('should reject null/undefined data', () => {
      expect(validateCheckInData(null)).toBe(false)
      expect(validateCheckInData(undefined)).toBe(false)
    })

    it('should reject non-object data', () => {
      expect(validateCheckInData('string')).toBe(false)
      expect(validateCheckInData(123)).toBe(false)
    })

    it('should reject arrays', () => {
      expect(validateCheckInData([])).toBe(false)
    })

    it('should reject data with invalid numeric values', () => {
      const data = {
        mood: Infinity,
        energy: NaN
      }
      expect(validateCheckInData(data)).toBe(false)
    })

    it('should accept data with valid types', () => {
      const data = {
        notes: 'test',
        mood: 5,
        flag: true
      }
      expect(validateCheckInData(data)).toBe(true)
    })
  })

  describe('validateVersionedData', () => {
    it('should accept valid versioned data', () => {
      const valid = JSON.stringify({
        version: '1.0.0',
        data: { mood: 3 }
      })
      const result = validateVersionedData<Record<string, unknown>>(valid)
      expect(result).not.toBeNull()
      expect(result!.version).toBe('1.0.0')
      expect((result!.data as Record<string, unknown>).mood).toBe(3)
    })

    it('should reject null input', () => {
      expect(validateVersionedData(null)).toBeNull()
    })

    it('should reject invalid JSON', () => {
      expect(validateVersionedData('not json')).toBeNull()
    })

    it('should reject missing version', () => {
      const invalid = JSON.stringify({ data: {} })
      expect(validateVersionedData(invalid)).toBeNull()
    })

    it('should reject invalid version type', () => {
      const invalid = JSON.stringify({ version: 123, data: {} })
      expect(validateVersionedData(invalid)).toBeNull()
    })

    it('should reject missing data', () => {
      const invalid = JSON.stringify({ version: '1.0.0' })
      expect(validateVersionedData(invalid)).toBeNull()
    })

    it('should reject invalid data type', () => {
      const invalid = JSON.stringify({ version: '1.0.0', data: 'string' })
      expect(validateVersionedData(invalid)).toBeNull()
    })

    it('should reject arrays as data', () => {
      const invalid = JSON.stringify({ version: '1.0.0', data: [] })
      expect(validateVersionedData(invalid)).toBeNull()
    })
  })

  describe('Constants', () => {
    it('should have A++ security version', () => {
      expect(SECURITY_VERSION).toBe('A++')
    })

    it('should have reasonable max data size', () => {
      expect(MAX_DATA_SIZE).toBeGreaterThan(0)
      expect(MAX_DATA_SIZE).toBeLessThan(100 * 1024) // Less than 100KB
    })

    it('should have reasonable max entries', () => {
      expect(MAX_ENTRIES).toBeGreaterThan(0)
      expect(MAX_ENTRIES).toBeLessThan(10000) // Less than 10k entries
    })
  })
})
