import { useState } from "react"
import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Switch,
  FormControlLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import {
  loadQuestionnaire,
  makeCustomId,
  saveQuestionnaire,
  sectionsOf,
  DEFAULT_QUESTIONNAIRE,
  type Question,
  type QuestionType,
  type Questionnaire,
} from "../questionnaire"
import type { CheckInKind } from "../storage"

const NUM = (v: string): number | undefined => (v.trim() === "" || Number.isNaN(Number(v)) ? undefined : Number(v))

export default function QuestionnaireEditor() {
  const [q, setQ] = useState<Questionnaire>(loadQuestionnaire)
  const [kind, setKind] = useState<CheckInKind>("morning")
  const [draft, setDraft] = useState<{ label: string; section: string; type: QuestionType; min: string; max: string; step: string }>({
    label: "",
    section: "",
    type: "slider",
    min: "0",
    max: "4",
    step: "1",
  })
  const list = q[kind]

  const commit = (next: Question[]) => {
    const all = { ...q, [kind]: next }
    setQ(all)
    saveQuestionnaire(all)
  }
  const patch = (id: string, p: Partial<Question>) => commit(list.map((x) => (x.id === id ? { ...x, ...p } : x)))
  const move = (id: string, dir: -1 | 1) => {
    const i = list.findIndex((x) => x.id === id)
    let j = i + dir
    while (j >= 0 && j < list.length && list[j].section !== list[i].section) j += dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[i], next[j]] = [next[j], next[i]]
    commit(next)
  }
  const renameSection = (from: string, to: string) =>
    commit(list.map((x) => (x.section === from ? { ...x, section: to } : x)))

  const add = () => {
    const label = draft.label.trim()
    if (!label) return
    const isNum = draft.type === "slider" || draft.type === "number"
    const question: Question = {
      id: makeCustomId(list),
      section: draft.section.trim() || "Custom",
      label,
      type: draft.type,
      ...(isNum ? { min: NUM(draft.min) ?? 0, max: NUM(draft.max), step: NUM(draft.step) ?? 1 } : {}),
    }
    if (question.type === "slider" && question.max === undefined) question.max = 4
    commit([...list, question])
    setDraft({ ...draft, label: "" })
  }

  const reset = () => {
    if (!window.confirm(`Reset the ${kind} questionnaire to defaults? Custom questions are removed (saved answers are kept).`)) return
    const next = { ...q, [kind]: DEFAULT_QUESTIONNAIRE[kind] }
    setQ(next)
    saveQuestionnaire(next)
  }

  return (
    <Box data-testid="questionnaire-editor" sx={{ display: "grid", gap: 2 }}>
      <Typography variant="h4">Customize questions</Typography>
      <Alert severity="info">
        Hidden questions keep their saved answers. Animal archetypes use the built-in evening questions; hiding them counts as 0.
      </Alert>
      <ToggleButtonGroup exclusive value={kind} onChange={(_, v: CheckInKind | null) => v && setKind(v)}>
        <ToggleButton value="morning">Morning</ToggleButton>
        <ToggleButton value="evening">Evening</ToggleButton>
      </ToggleButtonGroup>

      {sectionsOf(list).map((s) => (
        <Paper key={s.title} elevation={2} sx={{ p: 2 }}>
          <TextField
            label="Section title"
            size="small"
            defaultValue={s.title}
            key={s.title}
            onBlur={(e) => {
              const v = e.target.value.trim()
              if (v && v !== s.title) renameSection(s.title, v)
            }}
            sx={{ mb: 1 }}
          />
          {s.questions.map((x) => (
            <Box key={x.id} sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", py: 0.5 }}>
              <TextField
                size="small"
                label={`${x.type}${x.builtin ? "" : " (custom)"}`}
                value={x.label}
                onChange={(e) => patch(x.id, { label: e.target.value })}
                sx={{ flex: "1 1 220px" }}
              />
              <FormControlLabel
                control={<Switch checked={!x.hidden} onChange={(e) => patch(x.id, { hidden: !e.target.checked })} />}
                label="Show"
              />
              <IconButton aria-label={`Move up ${x.label}`} onClick={() => move(x.id, -1)}>↑</IconButton>
              <IconButton aria-label={`Move down ${x.label}`} onClick={() => move(x.id, 1)}>↓</IconButton>
              {!x.builtin && (
                <IconButton aria-label={`Delete ${x.label}`} onClick={() => commit(list.filter((y) => y.id !== x.id))}>🗑️</IconButton>
              )}
            </Box>
          ))}
        </Paper>
      ))}

      <Paper elevation={2} sx={{ p: 2, display: "grid", gap: 1 }}>
        <Typography variant="h6">Add question</Typography>
        <TextField size="small" label="Question" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
        <TextField
          size="small"
          label="Section"
          value={draft.section}
          placeholder="Custom"
          onChange={(e) => setDraft({ ...draft, section: e.target.value })}
        />
        <TextField select size="small" label="Type" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as QuestionType })}>
          <MenuItem value="slider">Slider</MenuItem>
          <MenuItem value="number">Number</MenuItem>
          <MenuItem value="text">Short text</MenuItem>
          <MenuItem value="textarea">Long text</MenuItem>
        </TextField>
        {(draft.type === "slider" || draft.type === "number") && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField size="small" label="Min" value={draft.min} onChange={(e) => setDraft({ ...draft, min: e.target.value })} />
            <TextField size="small" label="Max" value={draft.max} onChange={(e) => setDraft({ ...draft, max: e.target.value })} />
            <TextField size="small" label="Step" value={draft.step} onChange={(e) => setDraft({ ...draft, step: e.target.value })} />
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={add} disabled={!draft.label.trim()}>Add question</Button>
          <Button color="error" onClick={reset}>Reset {kind} to defaults</Button>
        </Box>
      </Paper>
    </Box>
  )
}
