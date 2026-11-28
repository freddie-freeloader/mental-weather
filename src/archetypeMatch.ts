export interface ArchetypePresentation {
  name: string
  emoji: string
  description: string
  message: string
  color?: string
  bgColor?: string
}

export interface Archetype extends ArchetypePresentation {
  energy: number
  mood: number
  cognitive: number
  social: number
  anxiety: number
}

export interface ArchetypeAnalysis {
  archetype: Archetype
  energyScore: number
  moodScore: number
  cognitiveScore: number
  socialScore: number
  anxietyScore: number
  timestamp: string
}

const invert = (score: number) => -score
const round1 = (n: number) => Math.round(n * 10) / 10

// Evening check-in values are numeric sliders; missing ones count as 0
export function analyzeArchetypes(d: Record<string, unknown>, items: readonly Archetype[]): ArchetypeAnalysis {
  const v = (k: string) => Number(d[k]) || 0
  const energy = (v("averageEnergy") + invert(v("feelingTiredInEvening")) + invert(v("fatigueDuringDay"))) / 3
  const mood = (v("averageMood") + v("selfWorth")) / 2
  const cognitive = (
    invert(v("feelingCognitivelyImpaired")) +
    invert(v("difficultyConcentrating")) +
    v("flightOfIdeas") +
    invert(v("distractible")) +
    v("programmedHobbyProject")
  ) / 5
  const social = (v("hoursWithOtherPeople") + v("qualityOfSocialTime") + invert(v("socialInsecurity"))) / 3
  const anxiety = (
    v("overallAnxiety") + v("stress") + v("fearOfGettingManic") + v("overwhelmedByWork") + v("socialInsecurity")
  ) / 5 * 2.5

  return {
    archetype: nearestArchetype({ energy, mood, cognitive, social, anxiety }, items),
    energyScore: round1(energy),
    moodScore: round1(mood),
    cognitiveScore: round1(cognitive),
    socialScore: round1(social),
    anxietyScore: round1(anxiety),
    timestamp: new Date().toISOString(),
  }
}

interface ScorePoint {
  energy: number
  mood: number
  cognitive: number
  social: number
  anxiety: number
}

function nearestArchetype(scores: ScorePoint, items: readonly Archetype[]): Archetype {
  const first = items[0]
  if (!first) throw new Error("Archetype set is empty")
  let best = first
  let min = Infinity
  for (const item of items) {
    const dist = Math.sqrt(
      (scores.energy - item.energy) ** 2 * 0.25 +
      (scores.mood - item.mood) ** 2 * 0.25 +
      (scores.cognitive - item.cognitive) ** 2 * 0.2 +
      (scores.social - item.social) ** 2 * 0.15 +
      (scores.anxiety - item.anxiety) ** 2 * 0.15,
    )
    if (dist < min) {
      min = dist
      best = item
    }
  }
  return best
}

export function mockArchetype(item: Archetype): ArchetypeAnalysis {
  return {
    archetype: item,
    energyScore: item.energy,
    moodScore: item.mood,
    cognitiveScore: item.cognitive,
    socialScore: item.social,
    anxietyScore: item.anxiety,
    timestamp: new Date().toISOString(),
  }
}

// Build a set that keeps each base archetype's five scores and swaps presentation.
// Keys are base names. A missing or extra key is an error, so a new counterpart stays 1:1.
export function counterpartSet(
  bases: readonly Archetype[],
  presentations: Readonly<Record<string, ArchetypePresentation>>,
): Archetype[] {
  const baseNames = new Set(bases.map((base) => base.name))
  if (baseNames.size !== bases.length) throw new Error("Base archetypes need unique names")
  const keys = Object.keys(presentations)
  if (keys.length !== bases.length) throw new Error("Counterpart set must be 1:1 with its base")
  for (const key of keys) {
    if (!baseNames.has(key)) throw new Error(`No base archetype named ${key}`)
  }
  return bases.map((base) => {
    const presentation = presentations[base.name]
    if (!presentation) throw new Error(`No presentation for ${base.name}`)
    return {
      ...presentation,
      energy: base.energy,
      mood: base.mood,
      cognitive: base.cognitive,
      social: base.social,
      anxiety: base.anxiety,
    }
  })
}
