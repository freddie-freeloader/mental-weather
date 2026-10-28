import { useRef, useState } from "react"
import { Alert, Box, Button, Chip, Paper, Typography } from "@mui/material"
import { exportAll, importAll, listDays } from "../storage"
import { analyzeEvening } from "../animals"

function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function BackupControls({ onImported }: { onImported: () => void }) {
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
          type="file"
          accept="application/json,.json"
          hidden
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
  const [, refresh] = useState(0)
  const days = listDays<Record<string, number>>("evening")
  const backup = <BackupControls onImported={() => refresh((n) => n + 1)} />

  if (days.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        {backup}
        <Typography sx={{ color: "#FF69B4" }}>
          No past check-ins yet. Your evening check-ins will show up here 📖
        </Typography>
      </Box>
    )
  }

  return (
    <Box data-testid="history" sx={{ display: "grid", gap: 1.5 }}>
      {backup}
      {days.map(({ date, data }) => {
        const a = analyzeEvening(data)
        return (
          <Paper
            key={date}
            data-testid="history-item"
            elevation={1}
            sx={{ p: 2, borderRadius: "16px", background: a.animal.bgColor }}
          >
            <Typography sx={{ fontWeight: 700, color: a.animal.color }}>
              {a.animal.emoji} {a.animal.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(date)}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
              <Chip size="small" label={`⚡ ${a.energyScore}`} />
              <Chip size="small" label={`💖 ${a.moodScore}`} />
              <Chip size="small" label={`🧠 ${a.cognitiveScore}`} />
              <Chip size="small" label={`👥 ${a.socialScore}`} />
              <Chip size="small" label={`😰 ${a.anxietyScore}`} />
            </Box>
          </Paper>
        )
      })}
    </Box>
  )
}
