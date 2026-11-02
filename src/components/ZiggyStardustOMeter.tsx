import { useState } from "react"
import { Box, LinearProgress, Paper, Typography } from "@mui/material"
import { loadToday } from "../storage"
import { ziggyLevel } from "../ziggy"

type Values = Record<string, unknown>

export default function ZiggyStardustOMeter() {
  const [reading] = useState(() => ziggyLevel(loadToday<Values>("morning"), loadToday<Values>("evening")))

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        ⚡ Ziggy-Stardust-O-Meter ✨
      </Typography>
      {reading === null ? (
        <Typography variant="body2">Fill in a check-in today to read the stardust.</Typography>
      ) : (
        <Box>
          <Typography variant="h3" component="div" aria-label={`Ziggy level ${reading.level} of 10`}>
            {"✨".repeat(Math.max(1, Math.round(reading.level / 2)))}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={reading.level * 10}
            aria-label="Ziggy level"
            sx={{ height: 12, borderRadius: 6, my: 2 }}
          />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {reading.level} / 10
          </Typography>
          <Typography variant="caption" sx={{ fontStyle: "italic", display: "block", mt: 1 }}>
            {reading.message}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}
