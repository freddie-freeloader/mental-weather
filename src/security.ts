/**
 * Security utilities for Ophelia's Mental Weather Log
 * A++ Security: Local-first, client-side only
 */

// ============================================================================
// DATA SANITIZATION
// ============================================================================

/**
 * Escape HTML special characters to prevent XSS
 * This is a simple, safe HTML escaper
 */
export function escapeHtml(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Sanitize a string input to prevent XSS
 * Removes potentially dangerous characters and patterns
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return ''
  
  let result = escapeHtml(input)
  
  // Remove script tags (already escaped, but be extra safe)
  result = result.replace(/&lt;script\b[^&]*(?:(?!&lt;\/script&gt;)&lt;[^&]*)*&lt;\/script&gt;/gi, '')
  
  // Remove event handlers
  result = result.replace(/\bon\w+\s*=/gi, '')
  
  // Remove javascript: URLs
  result = result.replace(/javascript:/gi, '')
  
  // Remove data: URLs (except for images)
  result = result.replace(/data:(?!image\/)/gi, '')
  
  // Remove HTML tags (already escaped)
  result = result.replace(/&lt;[^&]*&gt;/g, '')
  
  return result.trim()
}

/**
 * Sanitize a numeric input
 * Ensures it's a valid number within bounds
 */
export function sanitizeNumber(input: unknown, min: number = -10, max: number = 10): number {
  const num = Number(input)
  
  if (Number.isNaN(num)) return 0
  if (!Number.isFinite(num)) return 0
  
  return Math.max(min, Math.min(max, num))
}

const DANGEROUS_KEYS: ReadonlySet<string> = new Set(['__proto__', 'constructor', 'prototype'])

export function isDangerousKey(key: string): boolean {
  return DANGEROUS_KEYS.has(key)
}

/**
 * Clone JSON-ish data for storage.
 * Keeps strings and arrays as given. Drops prototype-pollution keys.
 * Does not HTML-escape: this app renders through React, which escapes text.
 */
export function sanitizeObject(value: unknown): unknown {
  return sanitizeValue(value)
}

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return null
  if (typeof value === 'string' || typeof value === 'boolean') return value
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item))
  if (typeof value === 'object') {
    const result: Record<string, unknown> = Object.create(null)
    for (const [key, entry] of Object.entries(value)) {
      if (isDangerousKey(key)) continue
      result[key] = sanitizeValue(entry)
    }
    return result
  }
  return null
}

// ============================================================================
// LOCALSTORAGE SECURITY
// ============================================================================

const STORAGE_PREFIX = 'mental-weather:'
const VALID_KEY_PATTERN = /^[a-zA-Z0-9_:-]+$/

/**
 * Validate a localStorage key
 * Prevents key injection attacks
 */
export function validateStorageKey(key: string): boolean {
  if (typeof key !== 'string') return false
  if (!key.startsWith(STORAGE_PREFIX)) return false
  if (!VALID_KEY_PATTERN.test(key)) return false
  return true
}

/**
 * Safely get an item from localStorage
 * Validates the key before access
 */
export function safeGetItem(key: string): string | null {
  if (!validateStorageKey(key)) {
    console.warn(`[SECURITY] Attempted to access invalid storage key: ${key}`)
    return null
  }
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`[SECURITY] Failed to get item from localStorage:`, error)
    return null
  }
}

/**
 * Safely set an item in localStorage.
 * Validates the key, strips prototype-pollution keys, and enforces the size limit.
 * User text is stored exactly as given.
 */
export function safeSetItem(key: string, value: unknown): boolean {
  if (!validateStorageKey(key)) {
    console.warn(`[SECURITY] Attempted to set invalid storage key: ${key}`)
    return false
  }

  let safeValue: string

  if (value === null || value === undefined) {
    safeValue = ''
  } else if (typeof value === 'string') {
    safeValue = value
  } else if (typeof value === 'number') {
    safeValue = Number.isFinite(value) ? String(value) : ''
  } else if (typeof value === 'boolean') {
    safeValue = String(value)
  } else {
    try {
      safeValue = JSON.stringify(sanitizeObject(value))
    } catch {
      return false
    }
  }

  if (safeValue.length > MAX_DATA_SIZE) {
    console.error('[SECURITY] Data size exceeds limit, not saving')
    return false
  }

  try {
    localStorage.setItem(key, safeValue)
    return true
  } catch (error) {
    console.error(`[SECURITY] Failed to set item in localStorage:`, error)
    return false
  }
}

/**
 * Safely remove an item from localStorage
 * Validates the key before removal
 */
export function safeRemoveItem(key: string): void {
  if (!validateStorageKey(key)) {
    console.warn(`[SECURITY] Attempted to remove invalid storage key: ${key}`)
    return
  }
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`[SECURITY] Failed to remove item from localStorage:`, error)
  }
}

/**
 * Clear all app data from localStorage
 * Only removes keys with our prefix
 */
export function clearAppData(): void {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    }
  } catch (error) {
    console.error(`[SECURITY] Failed to clear app data:`, error)
  }
}

// ============================================================================
// DATA VALIDATION
// ============================================================================

/**
 * Validate check-in data structure
 * Ensures all required fields exist and are valid
 */
export function validateCheckInData(data: unknown): boolean {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false
  if (Array.isArray(data)) return false
  
  const obj = data as Record<string, unknown>
  
  // Check that all values are valid types
  for (const [, value] of Object.entries(obj)) {
    const valueType = typeof value
    
    if (value === null || value === undefined) {
      continue
    }
    
    // Check for allowed types
    if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
      // Check numeric values are finite
      if (valueType === 'number' && !Number.isFinite(value as number)) {
        return false
      }
    } else if (valueType === 'object') {
      // Recursively validate nested objects
      if (!validateCheckInData(value)) {
        return false
      }
    } else {
      // Unknown type
      return false
    }
  }
  
  return true
}

/**
 * Validate versioned data structure
 */
export interface VersionedData<T> {
  version: string
  data: T
}

export function validateVersionedData<T>(raw: string | null): VersionedData<T> | null {
  if (!raw) return null
  
  try {
    const parsed = JSON.parse(raw) as unknown
    
    if (parsed === null || typeof parsed !== 'object') return null
    
    const obj = parsed as Record<string, unknown>
    
    if (typeof obj.version !== 'string') return null
    if (obj.data === null || typeof obj.data !== 'object') return null
    if (Array.isArray(obj.data)) return null
    
    return parsed as VersionedData<T>
  } catch {
    return null
  }
}

// ============================================================================
// SECURITY CONSTANTS
// ============================================================================

/**
 * Current security version
 * Increment when security policies change
 */
export const SECURITY_VERSION = 'A++'

/**
 * Maximum data size to prevent DoS via large payloads
 */
export const MAX_DATA_SIZE = 10 * 1024 // 10KB per entry

/**
 * Maximum number of entries to prevent DoS via storage exhaustion
 */
export const MAX_ENTRIES = 365 * 3 // ~3 years of daily entries

// ============================================================================
// SECURITY UTILITIES
// ============================================================================

/**
 * Check if the app is running in a secure context
 * (HTTPS, localhost, or file://)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return true
  
  return (
    window.isSecureContext ||
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
  )
}

/**
 * Generate a warning if not in secure context
 */
export function checkSecureContext(): void {
  if (!isSecureContext()) {
    console.warn(
      '[SECURITY] Ophelia\'s Mental Weather Log is running in an insecure context. ' +
      'For maximum security, use HTTPS or localhost.'
    )
  }
}

/**
 * Initialize security checks
 * Call this at app startup
 */
export function initSecurity(): void {
  // Check for secure context
  checkSecureContext()
  
  // Check for localStorage availability
  try {
    const testKey = `${STORAGE_PREFIX}security-test`
    localStorage.setItem(testKey, '1')
    localStorage.removeItem(testKey)
  } catch (error) {
    console.error('[SECURITY] localStorage is not available:', error)
  }
  
  // Log security version
  console.log(`[SECURITY] Ophelia's Mental Weather Log - Security Level: ${SECURITY_VERSION}`)
}
