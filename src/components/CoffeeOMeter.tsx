import { Box, Typography, LinearProgress, Paper } from "@mui/material"

const NOTES = [
  "No coffee yet.",
  "One cup. Easy does it.",
  "Two cups.",
  "Three cups.",
  "Four cups.",
  "Five cups. A full pot's worth.",
  "Six cups. Quite a few.",
  "Seven cups. Be gentle with the rest of the day.",
  "Eight cups. That is a lot of coffee.",
  "Nine cups. That is a lot of coffee.",
  "Ten cups. Be gentle with the rest of the day.",
]

interface CoffeeOMeterProps {
  cups: number
  showMessage?: boolean
}

export default function CoffeeOMeter({ cups, showMessage = true }: CoffeeOMeterProps) {
  const clampedCups = Math.max(0, Math.min(10, Math.round(cups)))
  const percentage = (clampedCups / 10) * 100
  const note = NOTES[clampedCups] ?? NOTES[0]

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2, textAlign: "center" }}>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2, gap: 0.5, flexWrap: "wrap" }}>
        {Array.from({ length: 10 }, (_, index) => (
          <Box
            key={index}
            component="span"
            aria-hidden="true"
            sx={{ fontSize: 24, opacity: index < clampedCups ? 1 : 0.28 }}
          >
            ☕
          </Box>
        ))}
      </Box>
      <LinearProgress variant="determinate" value={percentage} aria-label={`${clampedCups} of 10 cups`} />
      <Typography sx={{ mt: 1.5, fontWeight: 650 }}>
        {clampedCups} / 10 cups
      </Typography>
      {showMessage && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {note}
        </Typography>
      )}
      {clampedCups >= 6 && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {clampedCups >= 8 ? "That is a lot of coffee." : "Quite a few cups today."}
        </Typography>
      )}
    </Paper>
  )
}
