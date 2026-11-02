import { useState } from "react"
import { Box, Button, List, ListItem, ListItemText, Typography } from "@mui/material"
import CoffeeOMeter from "./CoffeeOMeter"
import { addCoffeeEvent, loadCoffeeToday, undoCoffeeEvent } from "../coffee"

const MAX_CUPS = 10

export default function CoffeeTab() {
  const [day, setDay] = useState(() => loadCoffeeToday())
  const cups = day.events.length

  return (
    <Box sx={{ py: 2 }}>
      <CoffeeOMeter cups={cups} />
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={() => setDay(undoCoffeeEvent())} disabled={cups <= 0}>
          Undo last
        </Button>
        <Button variant="contained" onClick={() => setDay(addCoffeeEvent())} disabled={cups >= MAX_CUPS}>
          + Cup
        </Button>
      </Box>
      <Typography variant="h6" sx={{ mt: 3 }}>
        Today's events
      </Typography>
      {cups === 0 ? (
        <Typography variant="body2">No coffee logged yet.</Typography>
      ) : (
        <List dense>
          {[...day.events].reverse().map((e, i) => (
            <ListItem key={`${e}-${i}`}>
              <ListItemText primary={`☕ ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
