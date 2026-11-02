import { describe, expect, it } from 'vitest'
import { ziggyLevel } from './ziggy'

describe('ziggyLevel', () => {
  it('is null without answers', () => {
    expect(ziggyLevel(null, null)).toBeNull()
    expect(ziggyLevel({ other: 3 }, {})).toBeNull()
  })

  it('maps neutral to 5 and extremes to 0 and 10', () => {
    expect(ziggyLevel({ morningMood: 0, morningEnergy: 0 }, null)?.level).toBe(5)
    expect(ziggyLevel({ morningMood: -5, morningEnergy: -5 }, null)?.level).toBe(0)
    expect(ziggyLevel(null, { averageMood: 5, averageEnergy: 5, selfWorth: 5 })?.level).toBe(10)
  })

  it('averages morning and evening and ignores non-numbers', () => {
    expect(ziggyLevel({ morningMood: 5, morningEnergy: 5 }, { averageMood: -5, selfWorth: 'x' })?.level).toBe(7)
  })
})
