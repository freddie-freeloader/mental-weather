import { QUESTIONNAIRE_KEY, type CheckInKind } from "./storage"

export type QuestionType = "slider" | "number" | "text" | "textarea"

export interface Question {
  id: string
  section: string
  label: string
  type: QuestionType
  min?: number
  max?: number
  step?: number
  placeholder?: string
  // Built-in questions feed the animal analysis; hide them instead of deleting.
  builtin?: boolean
  hidden?: boolean
}

export type Questionnaire = Record<CheckInKind, Question[]>

const S5 = { min: -5, max: 5, step: 1 }
const S4 = { min: 0, max: 4, step: 1 }

function slider(section: string, id: string, label: string, range: { min: number; max: number; step: number }): Question {
  return { id, section, label, type: "slider", ...range, builtin: true }
}

function num(section: string, id: string, label: string, min: number, max: number | undefined, step: number): Question {
  return { id, section, label, type: "number", min, max, step, builtin: true }
}

function area(section: string, id: string, label: string, placeholder: string): Question {
  return { id, section, label, type: "textarea", placeholder, builtin: true }
}

export const MEDICATION_TOKEN = "{medicationName}"

export const DEFAULT_QUESTIONNAIRE: Questionnaire = {
  morning: [
    slider("Sleep Quality", "sleepQuality", "Sleep Quality", S5),
    slider("Sleep Quality", "easyToGetIntoSleep", "Easy to get into sleep", S5),
    slider("Sleep Quality", "noiseWhileSleeping", "Noise above while sleeping", S4),
    slider("Sleep Quality", "earlyWakeUp", "Early wake-up", S4),
    num("Sleep Quality", "earlyWakeUpDueToNoise", "Early wake-up due to noise (hours)", 0, 8.5, 0.5),
    num("Sleep Schedule", "sleepHours", "Sleep hours (e.g., 7.5 or 9.5)", 0, 24, 0.25),
    num("Sleep Schedule", "bedTime", "Bed time (e.g., 22, 22.5, or 22.25)", 0, 24, 0.25),
    num("Sleep Schedule", "wakeUpTime", "Wake-up time (e.g., 6, 8.5, or 8.75)", 0, 24, 0.25),
    { id: "medicationName", section: "Medication & Physical", label: "Medication name", type: "text", builtin: true },
    num("Medication & Physical", "promethazineTaken", `${MEDICATION_TOKEN} taken (mg, e.g., 25 or 50)`, 0, undefined, 1),
    num("Medication & Physical", "weight", "Weight (kg, e.g., 64)", 0, undefined, 0.1),
    slider("Morning Mood & Energy", "morningMood", "Morning Mood", S5),
    slider("Morning Mood & Energy", "morningEnergy", "Morning Energy", S5),
    area("Notes", "otherSleepNotes", "Other sleep notes", "e.g., had a nightmare, intense dream in the morning"),
  ],
  evening: [
    slider("Mood & Energy", "averageMood", "Average Mood", S5),
    slider("Mood & Energy", "averageEnergy", "Average Energy", S5),
    slider("Mood & Energy", "selfWorth", "Self-worth", S5),
    slider("Mood & Energy", "stress", "Stress", S4),
    slider("Mood & Energy", "activityLevel", "Activity level", S4),
    slider("Mood & Energy", "feelingTiredInEvening", "Feeling tired in evening", S5),
    slider("Cognitive & Focus", "fatigueDuringDay", "Fatigue during the day", S4),
    slider("Cognitive & Focus", "muchOnSocialMedia", "Much on social media", S4),
    slider("Cognitive & Focus", "feelingCognitivelyImpaired", "Feeling cognitively impaired", S4),
    slider("Cognitive & Focus", "distractible", "Distractible", S4),
    slider("Cognitive & Focus", "difficultyConcentrating", "Difficulty concentrating", S4),
    slider("Cognitive & Focus", "flightOfIdeas", "Flight of ideas", S4),
    num("Hobby Project", "programmedHobbyProject", "Programmed hobby project (hours, e.g., 4)", 0, undefined, 0.5),
    slider("Hobby Project", "hadFunWithHobbyProject", "Had fun with hobby project", S5),
    slider("Work", "dailyWorkWasFun", "Daily work was fun", S5),
    slider("Work", "dailyWorkWasInteresting", "Daily work was interesting", S5),
    slider("Work", "overwhelmedByWork", "Overwhelmed by work", S4),
    num("Work", "hoursWorked", "Hours worked (e.g., 4)", 0, undefined, 0.5),
    num("Social", "hoursWithOtherPeople", "Hours with other people (e.g., 2.5)", 0, undefined, 0.5),
    slider("Social", "socialIntensity", "Social intensity", S4),
    slider("Social", "qualityOfSocialTime", "Quality of social time", S5),
    slider("Social", "socialInsecurity", "Social insecurity", S4),
    slider("Mental Health", "fearOfGettingManic", "Fear of getting manic", S4),
    slider("Mental Health", "overallAnxiety", "Overall Anxiety", S4),
    slider("Mental Health", "selfCare", "Self-care", S5),
    num("Physical Health", "hadMigraine", "Had migraine (time, e.g., 13.5 for 1:30pm)", 0, 24, 0.25),
    num("Physical Health", "hadDejaVu", "Had deja vu (time, e.g., 13.5 for 1:30pm)", 0, 24, 0.25),
    slider("Physical Health", "beingSick", "Being sick (e.g., having a cold)", { min: 0, max: 5, step: 1 }),
    slider("Physical Health", "drankCoffee", "Drank coffee (cups)", S4),
    area("Notes", "notes", "Notes", "Any additional notes for today..."),
  ],
}

const TYPES: QuestionType[] = ["slider", "number", "text", "textarea"]

function isQuestion(q: unknown): q is Question {
  if (typeof q !== "object" || q === null) return false
  const o = q as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.section === "string" &&
    typeof o.label === "string" &&
    TYPES.includes(o.type as QuestionType)
  )
}

// Keeps unknown-shaped input from breaking the forms; falls back to defaults per kind.
export function sanitizeQuestionnaire(raw: unknown): Questionnaire {
  const src = (typeof raw === "object" && raw !== null ? raw : {}) as Partial<Record<CheckInKind, unknown>>
  const pick = (kind: CheckInKind): Question[] => {
    const list = src[kind]
    if (!Array.isArray(list)) return DEFAULT_QUESTIONNAIRE[kind]
    const seen = new Set<string>()
    const out = list.filter(isQuestion).filter((q) => !seen.has(q.id) && seen.add(q.id))
    return out.length > 0 ? out : DEFAULT_QUESTIONNAIRE[kind]
  }
  return { morning: pick("morning"), evening: pick("evening") }
}

export function loadQuestionnaire(): Questionnaire {
  try {
    const raw = localStorage.getItem(QUESTIONNAIRE_KEY)
    return raw ? sanitizeQuestionnaire(JSON.parse(raw)) : DEFAULT_QUESTIONNAIRE
  } catch (error) {
    console.error("Failed to load questionnaire", error)
    return DEFAULT_QUESTIONNAIRE
  }
}

export function saveQuestionnaire(q: Questionnaire): void {
  localStorage.setItem(QUESTIONNAIRE_KEY, JSON.stringify(q))
}

export function visibleQuestions(list: Question[]): Question[] {
  return list.filter((q) => !q.hidden)
}

export function sectionsOf(list: Question[]): { title: string; questions: Question[] }[] {
  const out: { title: string; questions: Question[] }[] = []
  for (const q of list) {
    const last = out.find((s) => s.title === q.section)
    if (last) last.questions.push(q)
    else out.push({ title: q.section, questions: [q] })
  }
  return out
}

export function defaultValues(list: Question[]): Record<string, number | string> {
  const out: Record<string, number | string> = {}
  for (const q of list) out[q.id] = q.type === "text" || q.type === "textarea" ? "" : q.type === "slider" ? Math.max(q.min ?? 0, Math.min(q.max ?? 0, 0)) : 0
  return out
}

export function makeCustomId(list: Question[]): string {
  let id: string
  do id = `custom_${Math.random().toString(36).slice(2, 8)}`
  while (list.some((q) => q.id === id))
  return id
}
