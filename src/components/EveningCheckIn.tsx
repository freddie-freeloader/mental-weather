import { Box, Paper, Typography } from "@mui/material"
import CheckInForm from "./CheckInForm"
import { analyzeSet, archetypeCopy } from "../archetypes"
import { useArchetypeSet } from "./useArchetypeSet"

export default function EveningCheckIn({ onSaved }: { onSaved?: () => void }) {
  const { set } = useArchetypeSet()
  const copy = archetypeCopy(set)
  return (
    <CheckInForm kind="evening" title="Evening Check-In" onSaved={() => onSaved?.()}>
      {(saved) => {
        if (!saved) return null
        const { archetype } = analyzeSet(saved, set)
        return (
          <Box sx={{ mt: 3 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {copy.cardTitle}
                </Typography>
                <Typography variant="h3" component="div">
                  {archetype.emoji}
                </Typography>
                <Typography variant="h6">{archetype.name}</Typography>
              </Box>
              <Typography variant="body2" component="p" sx={{ mb: 2 }}>
                {archetype.message}
              </Typography>
            </Paper>
          </Box>
        )
      }}
    </CheckInForm>
  )
}
