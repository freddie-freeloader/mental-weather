import { useRef, useState } from "react"
import { Alert, Box, Button, Chip, Paper, Typography } from "@mui/material"
import { exportAll, importAll, listDays } from "../storage"
import { analyzeSet } from "../archetypes"
import { useArchetypeSet } from "./useArchetypeSet"

function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function BackupControls({ onImported }: { onImported: () => void }) {
  const { reload } = useArchetypeSet()
  const input = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<{ severity: "success" | "error"; text: string } | null>(null)

  const download = () => {
    const blob = new Blob([JSON.stringify(exportAll(), null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mental-weather-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const upload = async (file: File) => {
    try {
      const n = importAll(await file.text())
      reload()
      setMsg({ severity: "success", text: `Imported ${n} entries` })
      onImported()
    } catch (error) {
      setMsg({ severity: "error", text: error instanceof Error ? error.message : "Import failed" })
    }
  }

  return (
    <Box sx={{ display: "grid", gap: 1, mb: 2 }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" onClick={download}>Export backup</Button>
        <Button variant="outlined" onClick={() => input.current?.click()}>Import backup</Button>
        <input
          ref={input}
          id="import-backup"
          type="file"
          accept="application/json,.json"
          hidden
          aria-label="Import backup file"
          data-testid="import-input"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void upload(f)
            e.target.value = ""
          }}
        />
      </Box>
      {msg && <Alert severity={msg.severity}>{msg.text}</Alert>}
    </Box>
  )
}

export default function History() {
  const { set } = useArchetypeSet()
  const [, refresh] = useState(0)
  const days = listDays<Record<string, number>>("evening")
  const backup = <BackupControls onImported={() => refresh((n) => n + 1)} />

  if (days.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        {backup}
        <Typography color="text.secondary">
          No past check-ins yet. Evening notes will gather here.
        </Typography>
      </Box>
    )
  }

  return (
    <Box data-testid="history" sx={{ display: "grid", gap: 1.5 }}>
      {backup}
      {days.map(({ date, data }) => {
        const a = analyzeSet(data, set)
        return (
          <Paper
            key={date}
            data-testid="history-item"
            elevation={0}
            sx={{ p: 2 }}
          >
            <Typography sx={{ fontWeight: 650 }}>
              {a.archetype.emoji} {a.archetype.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(date)}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
              <Chip size="small" variant="outlined" label={`Energy ${a.energyScore}`} />
              <Chip size="small" variant="outlined" label={`Mood ${a.moodScore}`} />
              <Chip size="small" variant="outlined" label={`Cognitive ${a.cognitiveScore}`} />
              <Chip size="small" variant="outlined" label={`Social ${a.socialScore}`} />
              <Chip size="small" variant="outlined" label={`Anxiety ${a.anxietyScore}`} />
            </Box>
          </Paper>
        )
      })}
    </Box>
  )
}
