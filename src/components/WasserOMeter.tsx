import { useState } from "react"
import { Box, IconButton, LinearProgress, Paper, Typography } from "@mui/material"
import { AddCircle, RemoveCircle } from "@mui/icons-material"
import { addWasserGlass, undoWasserGlass, getGlassCount } from "../wasser"

function note(glasses: number): string {
  if (glasses <= 0) return "No glasses yet. Mark one whenever you drink."
  if (glasses >= 20) return "Twenty glasses. That is plenty for today."
  if (glasses === 1) return "One glass noted."
  return `${glasses} glasses noted.`
}

interface WasserOMeterProps {
  onGlassAdded?: () => void
  onGlassRemoved?: () => void
}

export default function WasserOMeter({ onGlassAdded, onGlassRemoved }: WasserOMeterProps) {
  const [glasses, setGlasses] = useState(() => getGlassCount())
  const clamped = Math.max(0, Math.min(20, glasses))
  const percentage = (clamped / 20) * 100

  const add = () => {
    addWasserGlass()
    const next = getGlassCount()
    setGlasses(next)
    onGlassAdded?.()
  }

  const remove = () => {
    undoWasserGlass()
    const next = getGlassCount()
    setGlasses(next)
    onGlassRemoved?.()
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
      <Typography variant="h3" component="p">
        {clamped} / 20
      </Typography>
      <LinearProgress
        variant="determinate"
        value={percentage}
        aria-label="Glasses of water today"
        sx={{ my: 2, height: 10, borderRadius: 999 }}
      />
      <Typography color="text.secondary">{note(clamped)}</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <IconButton
          onClick={remove}
          disabled={glasses <= 0}
          aria-label="Remove water glass"
          sx={{ border: 1, borderColor: "divider", width: 48, height: 48 }}
        >
          <RemoveCircle />
        </IconButton>
        <IconButton
          onClick={add}
          aria-label="Add water glass"
          sx={{ border: 1, borderColor: "divider", width: 48, height: 48 }}
        >
          <AddCircle />
        </IconButton>
      </Box>
    </Paper>
  )
}
