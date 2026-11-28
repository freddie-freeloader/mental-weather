import { describe, expect, it } from 'vitest'
import { allAnimals, analyzeEvening } from './animals'
import { allFlowers } from './flowers'
import {
  analyzeSet,
  archetypeCopy,
  archetypeSetList,
  counterpartSet,
  getArchetypeSet,
  isArchetypeSetId,
  type Archetype,
} from './archetypes'

const FLOWER_FOR: Record<string, string> = {
  Owl: 'Rosemary',
  Spider: 'Pansy',
  Snake: 'Rue',
  Dolphin: 'Daisy',
  Rabbit: 'Violet',
  Cheetah: 'Fennel',
  Dragonfly: 'Columbine',
  Lion: 'Rose',
  Turtle: 'Willow',
  Squirrel: 'Crow-flower',
  Fox: 'Nettle',
  Sloth: 'Poppy',
  Koala: 'Chamomile',
  Octopus: 'Woodbine',
  Butterfly: 'Primrose',
  Eagle: 'Marigold',
  Giraffe: 'Lavender',
}

const SCORE_KEYS = ['energy', 'mood', 'cognitive', 'social', 'anxiety'] as const

function scores(item: Archetype): number[] {
  return SCORE_KEYS.map((key) => item[key])
}

function expectComplete(items: readonly Archetype[]) {
  const names = items.map((item) => item.name)
  const emojis = items.map((item) => item.emoji)
  expect(new Set(names).size).toBe(names.length)
  expect(new Set(emojis).size).toBe(emojis.length)
  for (const item of items) {
    expect(item.emoji.length).toBeGreaterThan(0)
    expect(item.description.length).toBeGreaterThan(0)
    expect(item.message).toMatch(/^Today you are/)
    expect(item.color).toBeTruthy()
    expect(item.bgColor).toMatch(/^linear-gradient/)
    for (const key of SCORE_KEYS) expect(Number.isFinite(item[key])).toBe(true)
  }
}

describe('archetype sets', () => {
  it('lists animals first, then flowers, with derived copy', () => {
    expect(archetypeSetList.map((set) => set.id)).toEqual(['animals', 'flowers'])
    expect(archetypeCopy(getArchetypeSet('animals'))).toEqual({
      tabLabel: '🐾 My Animal',
      cardTitle: 'Your Animal Archetype Today',
      previewLabel: '🎪 Preview all animals',
      placeholder: "Your animal archetype is waiting! Complete today's evening check-in to hatch it 🌸",
      headerSubtitle: '🌸 Discover your animal archetype today! 🌸',
      editorNote: 'Animal archetypes use the built-in evening questions; hiding them counts as 0.',
    })
    expect(archetypeCopy(getArchetypeSet('flowers'))).toEqual({
      tabLabel: '🌸 My Flower',
      cardTitle: 'Your Flower Archetype Today',
      previewLabel: '🎪 Preview all flowers',
      placeholder: "Your flower archetype is waiting! Complete today's evening check-in to see it bloom 🌸",
      headerSubtitle: '🌸 Discover your flower archetype today! 🌸',
      editorNote: 'Flower archetypes use the built-in evening questions; hiding them counts as 0.',
    })
    expect(isArchetypeSetId('animals')).toBe(true)
    expect(isArchetypeSetId('flowers')).toBe(true)
    expect(isArchetypeSetId('dragons')).toBe(false)
  })

  it('keeps both sets complete and unique', () => {
    expectComplete(allAnimals)
    expectComplete(allFlowers)
    expect(allFlowers).toHaveLength(allAnimals.length)
  })

  it('pairs each animal with one flower that has the same five scores', () => {
    expect(Object.keys(FLOWER_FOR)).toHaveLength(allAnimals.length)
    const flowersByName = new Map(allFlowers.map((flower) => [flower.name, flower]))
    const tuples = new Set<string>()
    for (const animal of allAnimals) {
      const flower = flowersByName.get(FLOWER_FOR[animal.name] ?? '')
      expect(flower, animal.name).toBeDefined()
      if (!flower) continue
      expect(scores(flower)).toEqual(scores(animal))
      tuples.add(scores(animal).join(','))
    }
    expect(tuples.size).toBe(allAnimals.length)
    expect(allFlowers.map((flower) => flower.name)).toEqual(allAnimals.map((animal) => FLOWER_FOR[animal.name]))
  })

  it('picks the flower counterpart for the same evening data', () => {
    const samples: Record<string, unknown>[] = [
      {},
      { averageEnergy: 5, averageMood: 5, selfWorth: 5 },
      { averageEnergy: -5, averageMood: -5, selfWorth: -5, feelingTiredInEvening: 5, fatigueDuringDay: 5 },
      { overallAnxiety: 4, stress: 4, fearOfGettingManic: 4, overwhelmedByWork: 4, socialInsecurity: 4 },
    ]
    for (const sample of samples) {
      const animal = analyzeSet(sample, getArchetypeSet('animals'))
      const flower = analyzeSet(sample, getArchetypeSet('flowers'))
      const legacy = analyzeEvening(sample)
      expect(flower.archetype.name).toBe(FLOWER_FOR[animal.archetype.name])
      expect(scores(flower.archetype)).toEqual(scores(animal.archetype))
      expect(flower.energyScore).toBe(animal.energyScore)
      expect(flower.moodScore).toBe(animal.moodScore)
      expect(flower.cognitiveScore).toBe(animal.cognitiveScore)
      expect(flower.socialScore).toBe(animal.socialScore)
      expect(flower.anxietyScore).toBe(animal.anxietyScore)
      expect(legacy.animal).toBe(animal.archetype)
      expect(legacy.energyScore).toBe(animal.energyScore)
    }
  })

  it('rejects a counterpart set that is not 1:1', () => {
    const base = allAnimals[0]
    const presentation = { name: 'X', emoji: '🌸', description: 'd', message: 'm' }
    expect(() => counterpartSet([base], {})).toThrow(/1:1/)
    expect(() => counterpartSet([base], { Extra: presentation })).toThrow(/No base archetype/)
  })
})
