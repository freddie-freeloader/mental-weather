import { Box, Typography, Paper, Divider, Chip, CircularProgress } from "@mui/material"
import { useState, useEffect } from "react"

interface AnimalArchetype {
	name: string
	emoji: string
	description: string
	message: string
	energy: number
	mood: number
	cognitive: number
	social: number
	anxiety: number
}

interface AnimalAnalysisResult {
	animal: AnimalArchetype
	energyScore: number
	moodScore: number
	cognitiveScore: number
	socialScore: number
	anxietyScore: number
	timestamp: string
}

export default function AnimalDisplay() {
	const [analysis, setAnalysis] = useState<AnimalAnalysisResult | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchAnimalAnalysis = async () => {
			try {
				const response = await fetch("/api/animal-analysis")
				if (response.status === 200) {
					const data = await response.json()
					setAnalysis(data)
				} else if (response.status === 204) {
					// No content - no evening check-in yet today
					setAnalysis(null)
				}
			} catch (err) {
				setError("Failed to load animal analysis")
			} finally {
				setIsLoading(false)
			}
		}
		fetchAnimalAnalysis()
	}, [])

	if (isLoading) {
		return (
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<CircularProgress />
				<Typography>Loading animal analysis...</Typography>
			</Box>
		)
	}

	if (error) {
		return (
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<Typography color="error">{error}</Typography>
			</Box>
		)
	}

	if (!analysis) {
		return (
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<Typography variant="body1">
					Complete your evening check-in to discover your animal archetype for today!
				</Typography>
			</Box>
		)
	}

	return (
		<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
			<Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
				Your Animal Archetype Today
			</Typography>
			<Divider sx={{ mb: 2 }} />

			<Box sx={{ textAlign: 'center', my: 3 }}>
				<Typography variant="h2" component="div">
					{analysis.animal.emoji}
				</Typography>
				<Typography variant="h4" gutterBottom>
					{analysis.animal.name}
				</Typography>
				<Chip 
					label="Neuro-affirmative insight" 
					size="small" 
					sx={{ mb: 2 }}
				/>
			</Box>

			<Box sx={{ mb: 3 }}>
				<Typography variant="body1" paragraph>
					{analysis.animal.message}
				</Typography>
				<Typography variant="body2" color="text.secondary" paragraph>
					{analysis.animal.description}
				</Typography>
			</Box>

			<Divider sx={{ my: 2 }} />

			<Typography variant="subtitle2" gutterBottom>
				Your Scores:
			</Typography>

			<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
				<ScoreChip label="Energy" value={analysis.energyScore} />
				<ScoreChip label="Mood" value={analysis.moodScore} />
				<ScoreChip label="Cognitive" value={analysis.cognitiveScore} />
				<ScoreChip label="Social" value={analysis.socialScore} />
				<ScoreChip label="Anxiety" value={analysis.anxietyScore} />
			</Box>

			<Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: 'center', display: 'block' }}>
				Analysis from: {new Date(analysis.timestamp).toLocaleString()}
			</Typography>
		</Paper>
	)
}

interface ScoreChipProps {
	label: string
	value: number
}

function ScoreChip({ label, value }: ScoreChipProps) {
	// Determine color based on value
	let color = "default"
	if (value >= 3) color = "success"
	else if (value >= 1) color = "primary"
	else if (value >= -1) color = "warning"
	else color = "error"

	return (
		<Chip 
			label={`${label}: ${value.toFixed(1)}`}
			color={color as any}
			size="small"
			sx={{ width: '100%' }}
		/>
	)
}
