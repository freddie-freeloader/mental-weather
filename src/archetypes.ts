import { allAnimals } from "./animals"
import { allFlowers } from "./flowers"
import { analyzeArchetypes, mockArchetype, type Archetype, type ArchetypeAnalysis } from "./archetypeMatch"

export type { Archetype, ArchetypeAnalysis, ArchetypePresentation } from "./archetypeMatch"
export { counterpartSet } from "./archetypeMatch"

export interface ArchetypeSet {
  id: string
  /** Setting label, e.g. "Animals" */
  label: string
  /** Tab emoji, e.g. "🐾" */
  emoji: string
  /** Lowercase singular noun, e.g. "animal" */
  noun: string
  /** Title-case singular, e.g. "Animal" */
  nounTitle: string
  /** Lowercase plural, e.g. "animals" */
  plural: string
  /** Tail of the empty state, e.g. "hatch it 🌸" */
  verbPhrase: string
  placeholderEmoji: string
  items: readonly Archetype[]
}

export interface ArchetypeCopy {
  tabLabel: string
  cardTitle: string
  previewLabel: string
  placeholder: string
  headerSubtitle: string
  editorNote: string
}

// Labels are derived from noun, plural, verb, and emoji.
// A third set is another object in this list. No component needs a new branch.
const animalsSet = {
  id: "animals",
  label: "Animals",
  emoji: "🐾",
  noun: "animal",
  nounTitle: "Animal",
  plural: "animals",
  verbPhrase: "hatch it",
  placeholderEmoji: "🥚",
  items: allAnimals,
} satisfies ArchetypeSet

const flowersSet = {
  id: "flowers",
  label: "Ophelia's Flowers",
  emoji: "🌸",
  noun: "flower",
  nounTitle: "Flower",
  plural: "flowers",
  verbPhrase: "see it bloom",
  placeholderEmoji: "🌱",
  items: allFlowers,
} satisfies ArchetypeSet

export const archetypeSetList = [animalsSet, flowersSet]

export type ArchetypeSetId = (typeof archetypeSetList)[number]["id"]

export const DEFAULT_ARCHETYPE_SET_ID: ArchetypeSetId = "animals"

export function isArchetypeSetId(value: unknown): value is ArchetypeSetId {
  return typeof value === "string" && archetypeSetList.some((set) => set.id === value)
}

export function getArchetypeSet(id: ArchetypeSetId): ArchetypeSet {
  for (const set of archetypeSetList) {
    if (set.id === id) return set
  }
  return archetypeSetList[0]
}

export function archetypeCopy(set: ArchetypeSet): ArchetypeCopy {
  return {
    tabLabel: `My ${set.nounTitle}`,
    cardTitle: `Your ${set.nounTitle} Archetype Today`,
    previewLabel: `Preview all ${set.plural}`,
    placeholder: `Your ${set.noun} archetype is waiting. Complete today's evening check-in to ${set.verbPhrase}.`,
    headerSubtitle: `Pansies, that's for thoughts. Today's ${set.noun} follows your check-in.`,
    editorNote: `${set.nounTitle} archetypes use the built-in evening questions; hiding them counts as 0.`,
  }
}

export function analyzeSet(data: Record<string, unknown>, set: ArchetypeSet): ArchetypeAnalysis {
  return analyzeArchetypes(data, set.items)
}

export function previewArchetype(set: ArchetypeSet, index: number): ArchetypeAnalysis {
  const item = set.items[index] ?? set.items[0]
  if (!item) throw new Error("Archetype set is empty")
  return mockArchetype(item)
}
