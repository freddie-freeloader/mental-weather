// @vitest-environment jsdom
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import CheckInForm from './CheckInForm'
import { DEFAULT_QUESTIONNAIRE, saveQuestionnaire, type Questionnaire } from '../questionnaire'

function questionnaire(label: string): Questionnaire {
  return {
    morning: [{ id: 'q1', section: 'Custom', label, type: 'text' }],
    evening: DEFAULT_QUESTIONNAIRE.evening.slice(0, 1),
  }
}

describe('CheckInForm questionnaire updates', () => {
  let root: Root
  let host: HTMLDivElement

  beforeEach(() => {
    localStorage.clear()
    host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)
  })

  afterEach(() => {
    act(() => root.unmount())
    host.remove()
  })

  it('shows questionnaire edits while the form stays mounted', async () => {
    saveQuestionnaire(questionnaire('Only'))
    await act(async () => {
      root.render(createElement(CheckInForm, { kind: 'morning', title: 'Morning Check-In' }))
    })
    expect(host.textContent).toContain('Only')
    expect(host.textContent).not.toContain('Rain check')

    await act(async () => {
      saveQuestionnaire(questionnaire('Rain check'))
    })
    expect(host.textContent).toContain('Rain check')
    expect(host.textContent).not.toContain('Only')
  })
})
