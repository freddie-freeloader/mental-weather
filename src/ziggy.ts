export const ZIGGY_FIELDS = {
  morning: ["morningMood", "morningEnergy"],
  evening: ["averageMood", "averageEnergy", "selfWorth"],
} as const

const MESSAGES = [
  "Major Tom is grounded. Ground control, send snacks.",
  "Low orbit. Gentle gravity today.",
  "Dim glitter. Still a star.",
  "Warming up the platform boots.",
  "Soundcheck on Mars.",
  "Steady glow. Neutral starman.",
  "Lightning bolt forming.",
  "Glam rising.",
  "Spiders from Mars are dancing.",
  "Full Ziggy. Hello, stardust!",
  "Off the charts. Rock'n'roll suicide watch: hydrate.",
]

export interface ZiggyReading {
  level: number
  message: string
}

// Maps mood/energy sliders (-5..5) to a 0..10 level; null when nothing was answered.
export function ziggyLevel(
  morning: Record<string, unknown> | null,
  evening: Record<string, unknown> | null,
): ZiggyReading | null {
  const scores: number[] = []
  const collect = (data: Record<string, unknown> | null, keys: readonly string[]) => {
    if (!data) return
    for (const k of keys) {
      const v = data[k]
      if (typeof v === "number" && Number.isFinite(v)) scores.push(Math.max(-5, Math.min(5, v)))
    }
  }
  collect(morning, ZIGGY_FIELDS.morning)
  collect(evening, ZIGGY_FIELDS.evening)
  if (scores.length === 0) return null
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  const level = Math.round(avg + 5)
  return { level, message: MESSAGES[level] }
}
