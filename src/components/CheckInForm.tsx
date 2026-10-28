import { useForm } from "@tanstack/react-form"
import { Box, Typography, Paper, Divider, Snackbar } from "@mui/material"
import { useState } from "react"
import {
  TextFieldComponent,
  NumberFieldComponent,
  SliderFieldComponent,
  TextAreaFieldComponent,
  SubmitButtonComponent,
} from "./FormFields"
import { DEFAULT_SETTINGS, loadSettings, loadToday, saveSettings, saveToday, type CheckInKind } from "../storage"
import {
  MEDICATION_TOKEN,
  defaultValues,
  loadQuestionnaire,
  sectionsOf,
  visibleQuestions,
  type Question,
} from "../questionnaire"

type Values = Record<string, number | string>
type NumField = Parameters<typeof NumberFieldComponent>[0]["field"]
type StrField = Parameters<typeof TextFieldComponent>[0]["field"]
// The form is schema-driven, so field value types are only known at runtime per question type.
const asNum = (f: unknown) => f as NumField
const asStr = (f: unknown) => f as StrField

interface Props {
  kind: CheckInKind
  title: string
  onSaved?: (values: Values) => void
  children?: (values: Values | null) => React.ReactNode
}

export default function CheckInForm({ kind, title, onSaved, children }: Props) {
  const [questions] = useState(() => visibleQuestions(loadQuestionnaire()[kind]))
  const [existing] = useState(() => loadToday<Values>(kind))
  const [settings] = useState(loadSettings)
  const [snackbarOpen, setSnackbarOpen] = useState(existing !== null)
  const [snackbarMessage, setSnackbarMessage] = useState(existing ? "Loaded existing report for today" : "")
  const [saved, setSaved] = useState<Values | null>(null)

  const initial: Values = { ...defaultValues(questions), ...pickKnown(existing, questions) }
  if ("medicationName" in initial && !existing?.medicationName) initial.medicationName = settings.medicationName

  const form = useForm({
    defaultValues: initial,
    onSubmit: async ({ value }) => {
      try {
        const out: Values = { ...value }
        if (typeof out.medicationName === "string") {
          out.medicationName = out.medicationName.trim() || DEFAULT_SETTINGS.medicationName
          saveSettings({ medicationName: out.medicationName })
        }
        // keep answers to questions that are currently hidden
        saveToday(kind, { ...existing, ...out })
        setSnackbarMessage(`${title} saved`)
        setSaved(out)
        onSaved?.(out)
      } catch (error) {
        console.error("Submission error:", error)
        setSnackbarMessage(`Failed to save ${title.toLowerCase()}`)
      }
      setSnackbarOpen(true)
    },
  })

  const renderQuestion = (q: Question) => (
    <form.Field
      key={q.id}
      name={q.id}
      children={(field) => {
        if (q.type === "slider") {
          return <SliderFieldComponent field={asNum(field)} label={q.label} min={q.min ?? 0} max={q.max ?? 4} step={q.step ?? 1} marks />
        }
        if (q.type === "number") {
          return (
            <form.Subscribe
              selector={(s) => String(s.values.medicationName ?? "")}
              children={(med) => (
                <NumberFieldComponent
                  field={asNum(field)}
                  label={q.label.replace(MEDICATION_TOKEN, med.trim() || DEFAULT_SETTINGS.medicationName)}
                  min={q.min}
                  max={q.max}
                  step={q.step}
                />
              )}
            />
          )
        }
        if (q.type === "textarea") {
          return <TextAreaFieldComponent field={asStr(field)} label={q.label} placeholder={q.placeholder} rows={4} />
        }
        return <TextFieldComponent field={asStr(field)} label={q.label} placeholder={q.placeholder} />
      }}
    />
  )

  return (
    <>
      <Box sx={{ py: 2 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          {sectionsOf(questions).map((s) => (
            <Paper key={s.title} elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom>
                {s.title}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {s.questions.map(renderQuestion)}
            </Paper>
          ))}
          <form.Subscribe
            selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
            children={({ canSubmit, isSubmitting }) => (
              <SubmitButtonComponent canSubmit={canSubmit} isSubmitting={isSubmitting}>
                Submit {title}
              </SubmitButtonComponent>
            )}
          />
        </form>
      </Box>
      {children?.(saved)}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
    </>
  )
}

function pickKnown(data: Values | null, questions: Question[]): Values {
  if (!data) return {}
  const out: Values = {}
  for (const q of questions) if (q.id in data) out[q.id] = data[q.id]
  return out
}
