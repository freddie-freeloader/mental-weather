// Current saves store a string array. Older saves used a comma-joined string,
// and the previous sanitizer could also persist an array as {"0": "...", "1": "..."}.
export function readTimestampField(data: unknown, key: string, max: number): string[] {
  return readTimestampList(fieldOf(data, key), max)
}

function readTimestampList(raw: unknown, max: number): string[] {
  return entriesOf(raw)
    .filter((entry): entry is string => typeof entry === "string" && !Number.isNaN(Date.parse(entry)))
    .slice(-max)
}

function fieldOf(data: unknown, key: string): unknown {
  if (typeof data !== "object" || data === null) return undefined
  for (const [entryKey, value] of Object.entries(data)) {
    if (entryKey === key) return value
  }
  return undefined
}

function entriesOf(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw
  if (typeof raw === "string") return raw.length > 0 ? raw.split(",") : []
  if (typeof raw !== "object" || raw === null) return []
  const pairs = Object.entries(raw)
  if (pairs.length === 0 || !pairs.every(([key]) => /^\d+$/.test(key))) return []
  return pairs.sort(([a], [b]) => Number(a) - Number(b)).map(([, value]) => value)
}
