import { describe, expect, it } from 'vitest'
import { allAnimals, analyzeEvening, generateMockAnalysis } from './animals'

describe('analyzeEvening', () => {
  it('handles empty input without NaN', () => {
    const r = analyzeEvening({})
    for (const n of [r.energyScore, r.moodScore, r.cognitiveScore, r.socialScore, r.anxietyScore]) {
      expect(Number.isFinite(n)).toBe(true)
    }
    expect(allAnimals).toContain(r.animal)
  })

  it('ignores non-numeric values such as notes', () => {
    const r = analyzeEvening({ averageMood: 4, notes: 'hello', selfWorth: 'abc' })
    expect(r.moodScore).toBe(2)
  })

  it('computes scores like the original backend formulas', () => {
    const r = analyzeEvening({
      averageEnergy: 4,
      feelingTiredInEvening: 1,
      fatigueDuringDay: 2,
      averageMood: 3,
      selfWorth: 1,
      overallAnxiety: 4,
      stress: 4,
      fearOfGettingManic: 4,
      overwhelmedByWork: 4,
      socialInsecurity: 4,
    })
    expect(r.energyScore).toBe(0.3) // (4 - 1 - 2) / 3
    expect(r.moodScore).toBe(2)
    expect(r.anxietyScore).toBe(10) // all maxed: 4 * 2.5
  })

  it('picks a different animal for opposite states', () => {
    const high = analyzeEvening({ averageEnergy: 5, averageMood: 5, selfWorth: 5 })
    const low = analyzeEvening({ averageEnergy: -5, averageMood: -5, selfWorth: -5, feelingTiredInEvening: 5, fatigueDuringDay: 5 })
    expect(high.animal.name).not.toBe(low.animal.name)
    expect(high.energyScore).toBeGreaterThan(low.energyScore)
  })
})

describe('animals data', () => {
  it('has unique, complete archetypes', () => {
    const names = allAnimals.map((a) => a.name)
    expect(new Set(names).size).toBe(names.length)
    for (const a of allAnimals) {
      expect(a.emoji && a.description && a.message).toBeTruthy()
    }
  })

  it('mock analysis mirrors the archetype', () => {
    const r = generateMockAnalysis(1)
    expect(r.animal).toBe(allAnimals[1])
    expect(r.energyScore).toBe(allAnimals[1].energy)
  })
})
