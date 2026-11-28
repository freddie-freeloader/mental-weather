import { Box, Typography } from "@mui/material"
import WasserOMeter from "./WasserOMeter"

export default function WasserTab() {
  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Water
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Mark a glass when you drink one. There is no number you have to reach.
      </Typography>
      <WasserOMeter />
    </Box>
  )
}
