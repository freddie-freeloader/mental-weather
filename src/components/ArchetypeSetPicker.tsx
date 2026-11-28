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
        borderRadius: "20px",
        border: "2px solid #FFB6C1",
        background: "rgba(255, 255, 255, 0.75)",
        textAlign: "center",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#FF69B4" }}>
        Archetype set
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        Saved on this device. History uses this set.
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        useFlexGap
        spacing={1}
        sx={{ justifyContent: "center" }}
      >
        {sets.map((option) => {
          const selected = option.id === setId
          return (
            <Button
              key={option.id}
              aria-pressed={selected}
              data-testid={`archetype-set-${option.id}`}
              variant="outlined"
              color="primary"
              disableElevation
              onClick={() => choose(option.id)}
              style={{
                backgroundColor: selected ? "#FFB6C1" : "#FFFFFF",
                color: selected ? "#333333" : "#C2185B",
              }}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "16px",
                border: "2px solid #FFB6C1",
                boxShadow: "none",
                "&:hover": {
                  border: "2px solid #FFB6C1",
                  boxShadow: "none",
                  backgroundColor: selected ? "#FF9AAB" : "#FFF0F5",
                },
              }}
            >
              {option.emoji} {option.label}
            </Button>
          )
        })}
      </Stack>
    </Stack>
  )
}
