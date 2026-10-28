// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_QUESTIONNAIRE, defaultValues, loadQuestionnaire, saveQuestionnaire, sanitizeQuestionnaire } from './questionnaire'
import { exportAll, importAll } from './storage'

beforeEach(() => localStorage.clear())

describe('questionnaire', () => {
  it('defaults to built-in questions', () => {
    expect(loadQuestionnaire()).toEqual(DEFAULT_QUESTIONNAIRE)
    expect(defaultValues(DEFAULT_QUESTIONNAIRE.evening).averageMood).toBe(0)
  })

  it('persists customizations', () => {
    const custom = { ...DEFAULT_QUESTIONNAIRE, morning: [{ id: 'c1', section: 'X', label: 'Water', type: 'number' as const }] }
    saveQuestionnaire(custom)
    expect(loadQuestionnaire().morning).toHaveLength(1)
    expect(loadQuestionnaire().evening).toEqual(DEFAULT_QUESTIONNAIRE.evening)
  })

  it('sanitizes garbage and duplicate ids', () => {
    expect(sanitizeQuestionnaire('x')).toEqual(DEFAULT_QUESTIONNAIRE)
    const q = sanitizeQuestionnaire({ morning: [{ id: 'a', section: 's', label: 'l', type: 'text' }, { id: 'a', section: 's', label: 'l', type: 'text' }, { bad: 1 }] })
    expect(q.morning).toHaveLength(1)
  })

  it('is included in backups', () => {
    const custom = { ...DEFAULT_QUESTIONNAIRE, morning: [{ id: 'c1', section: 'X', label: 'Water', type: 'number' as const }] }
    saveQuestionnaire(custom)
    const json = JSON.stringify(exportAll())
    localStorage.clear()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    importAll(json)
    expect(loadQuestionnaire().morning[0].label).toBe('Water')
  })
})
