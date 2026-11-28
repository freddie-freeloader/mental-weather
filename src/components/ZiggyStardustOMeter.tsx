import { useState } from "react"
import { Box, LinearProgress, Paper, Typography } from "@mui/material"
import { loadToday } from "../storage"
import { ziggyLevel } from "../ziggy"

type Values = Record<string, unknown>

export default function ZiggyStardustOMeter() {
  const [reading] = useState(() => ziggyLevel(loadToday<Values>("morning"), loadToday<Values>("evening")))

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Ziggy
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        A small reading of today's check-in.
      </Typography>
      {reading === null ? (
        <Typography>Fill in a check-in today, whenever you are ready.</Typography>
      ) : (
        <Box>
          <LinearProgress
            variant="determinate"
            value={reading.level * 10}
            aria-label="Ziggy level"
            sx={{ height: 10, borderRadius: 999, my: 2 }}
          />
          <Typography variant="h3" component="p" aria-label={`Ziggy level ${reading.level} of 10`}>
            {reading.level} / 10
          </Typography>
          <Typography color="text.secondary" sx={{ display: "block", mt: 1 }}>
            {reading.message}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}
