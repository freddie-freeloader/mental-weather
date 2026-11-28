import { Button, Stack, Typography } from "@mui/material"
import { useArchetypeSet } from "./useArchetypeSet"

export default function ArchetypeSetPicker() {
  const { setId, sets, choose } = useArchetypeSet()
  return (
    <Stack
      data-testid="archetype-set"
      role="group"
      aria-label="Archetype set"
      spacing={1}
      sx={{
        mb: 2,
        p: { xs: 1.5, sm: 2 },
        borderRadius: "1.35rem",
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        textAlign: "center",
      }}
    >
      <Typography variant="subtitle1" component="p">
        A likeness for today
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Saved on this device. History uses this set.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} useFlexGap spacing={1} sx={{ justifyContent: "center" }}>
        {sets.map((option) => {
          const selected = option.id === setId
          return (
            <Button
              key={option.id}
              aria-pressed={selected}
              data-testid={`archetype-set-${option.id}`}
              variant={selected ? "contained" : "outlined"}
              color="primary"
              disableElevation
              onClick={() => choose(option.id)}
            >
              {option.emoji} {option.label}
            </Button>
          )
        })}
      </Stack>
    </Stack>
  )
}
