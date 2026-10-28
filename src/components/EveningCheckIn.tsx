import { Box, Paper, Typography } from "@mui/material"
import CheckInForm from "./CheckInForm"
import { analyzeEvening } from "../animals"

export default function EveningCheckIn({ onSaved }: { onSaved?: () => void }) {
  return (
    <CheckInForm kind="evening" title="Evening Check-In" onSaved={() => onSaved?.()}>
      {(saved) => {
        if (!saved) return null
        const { animal } = analyzeEvening(saved)
        return (
          <Box sx={{ mt: 3 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Your Animal Archetype Today
                </Typography>
                <Typography variant="h3" component="div">
                  {animal.emoji}
                </Typography>
                <Typography variant="h6">{animal.name}</Typography>
              </Box>
              <Typography variant="body2" component="p" sx={{ mb: 2 }}>
                {animal.message}
              </Typography>
            </Paper>
          </Box>
        )
      }}
    </CheckInForm>
  )
}
