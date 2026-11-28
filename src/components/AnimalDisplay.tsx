import { Box, Typography, Paper, Divider, Chip, Button, Stack } from "@mui/material"
import { useState, useMemo } from "react"
import { loadToday } from "../storage"
import { analyzeSet, archetypeCopy, previewArchetype } from "../archetypes"
import ArchetypeSetPicker from "./ArchetypeSetPicker"
import { useArchetypeSet } from "./useArchetypeSet"
import { PansyMark } from "./PansyMark"

function ScoreChip({ label, value }: { label: string; value: number }) {
  return <Chip variant="outlined" label={`${label}: ${value.toFixed(1)}`} />
}

export default function AnimalDisplay({ refreshKey = 0 }: { refreshKey?: number }) {
  const { set } = useArchetypeSet()
  const copy = archetypeCopy(set)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const previewMode = previewIndex !== null

  const saved = useMemo(() => {
    void refreshKey
    const evening = loadToday<Record<string, number>>("evening")
    return evening ? analyzeSet(evening, set) : null
  }, [refreshKey, set])

  const analysis = previewIndex !== null ? previewArchetype(set, previewIndex) : saved
  const currentIndex = previewIndex ?? 0
  const count = set.items.length

  const togglePreview = () => setPreviewIndex(previewMode ? null : 0)
  const handleNext = () => setPreviewIndex((currentIndex + 1) % count)
  const handlePrev = () => setPreviewIndex((currentIndex - 1 + count) % count)
  const handleRandom = () => setPreviewIndex(Math.floor(Math.random() * count))

  const previewToggle = (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <Button variant="outlined" onClick={togglePreview} data-testid="preview-toggle">
        {previewMode ? "Close preview" : copy.previewLabel}
      </Button>
    </Box>
  )

  if (!analysis) {
    return (
      <>
        <ArchetypeSetPicker />
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: "1.35rem",
            bgcolor: "background.paper",
          }}
        >
          <PansyMark />
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {copy.placeholder}
          </Typography>
        </Box>
        {previewToggle}
      </>
    )
  }

  return (
    <Box sx={{ mb: 1 }}>
      <ArchetypeSetPicker />
      <Paper className="letter-card" elevation={0} sx={{ p: { xs: 2, sm: 4 } }}>
        <span className="wax-dot" aria-hidden="true" />
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {copy.cardTitle}
          </Typography>
          {previewMode && <Chip label="Preview" size="small" variant="outlined" sx={{ mb: 2 }} />}
          <Divider sx={{ my: 2 }} />
          <Typography component="p" sx={{ fontSize: "4rem", lineHeight: 1, my: 2 }}>
            {analysis.archetype.emoji}
          </Typography>
          <Typography variant="h3" component="h3" gutterBottom>
            {analysis.archetype.name}
          </Typography>
          <Typography variant="body1" component="p" sx={{ mb: 2 }}>
            {analysis.archetype.message}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="p" sx={{ mb: 2, fontStyle: "italic" }}>
            {analysis.archetype.description}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" component="h4" gutterBottom>
            Today's scores
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(168px, 1fr))",
              gap: 1,
              justifyContent: "center",
              maxWidth: "640px",
              mx: "auto",
            }}
          >
            <ScoreChip label="Energy" value={analysis.energyScore} />
            <ScoreChip label="Mood" value={analysis.moodScore} />
            <ScoreChip label="Cognitive" value={analysis.cognitiveScore} />
            <ScoreChip label="Social" value={analysis.socialScore} />
            <ScoreChip label="Anxiety" value={analysis.anxietyScore} />
          </Box>
          {previewMode && (
            <Stack direction="row" useFlexGap spacing={1} sx={{ mt: 3, justifyContent: "center", flexWrap: "wrap" }}>
              <Button variant="outlined" onClick={handlePrev}>
                Previous
              </Button>
              <Button variant="outlined" onClick={handleRandom}>
                Random
              </Button>
              <Button variant="outlined" onClick={handleNext}>
                Next
              </Button>
            </Stack>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: "block" }}>
            {previewMode
              ? `Preview: ${currentIndex + 1} of ${count}`
              : `Noted ${new Date(analysis.timestamp).toLocaleString()}`}
          </Typography>
        </Box>
      </Paper>
      {previewToggle}
    </Box>
  )
}
