import { Box, Chip, Paper, Typography } from "@mui/material"
import { listDays } from "../storage"
import { analyzeEvening } from "./AnimalDisplay"

function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export default function History() {
  const days = listDays<Record<string, number>>("evening")

  if (days.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography sx={{ color: "#FF69B4" }}>
          No past check-ins yet. Your evening check-ins will show up here 📖
        </Typography>
      </Box>
    )
  }

  return (
    <Box data-testid="history" sx={{ display: "grid", gap: 1.5 }}>
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
