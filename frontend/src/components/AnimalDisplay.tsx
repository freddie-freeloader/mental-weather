import { Box, Typography, Paper, Divider, Chip, CircularProgress, Button, Stack } from "@mui/material"
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

// All animal archetypes for preview mode
const allAnimals: AnimalArchetype[] = [
	{
		name: "Dragonfly",
		emoji: "🪲",
		description: "Iridescent, adaptable, and quick to change direction. Dragonflies see the world from many angles and move with precision and grace.",
		message: "Today you are a Dragonfly - your mind is darting between ideas with iridescent clarity. You see patterns others miss. Embrace your ability to shift perspective and adapt quickly. Your mental agility is a superpower.",
		energy: 3.5,
		mood: 3.0,
		cognitive: 4.0,
		social: 2.0,
		anxiety: 3.0,
	},
	{
		name: "Owl",
		emoji: "🦉",
		description: "Wise, observant, and calm. Owls see what others cannot in the dark. They are patient and deliberate.",
		message: "Today you are an Owl - wise, observant, and deeply thoughtful. You see patterns and truths that elude others. Your quiet reflection is valuable. Trust your insights and the clarity that comes from stillness.",
		energy: -1.0,
		mood: 3.5,
		cognitive: 4.5,
		social: -1.0,
		anxiety: 2.0,
	},
	{
		name: "Cheetah",
		emoji: "🐆",
		description: "Fast, focused, and in flow. Cheetahs sprint with incredible intensity and precision.",
		message: "Today you are a Cheetah - in a high-speed flow state. Channel this focused energy into what matters most. Remember that even cheetahs need to rest after their sprint. Honor your need for both speed and recovery.",
		energy: 4.5,
		mood: 3.5,
		cognitive: 3.0,
		social: -0.5,
		anxiety: 2.0,
	},
	{
		name: "Eagle",
		emoji: "🦅",
		description: "Visionary, goal-oriented, and sharp. Eagles see the big picture from great heights.",
		message: "Today you are an Eagle - seeing the big picture with clarity and focus. Your vision and ability to spot opportunities from afar are gifts. Trust your perspective and soar with confidence.",
		energy: 4.0,
		mood: 4.0,
		cognitive: 4.5,
		social: -1.0,
		anxiety: 1.0,
	},
	{
		name: "Dolphin",
		emoji: "🐬",
		description: "Playful, social, and intelligent. Dolphins communicate beautifully and move with joy through their world.",
		message: "Today you are a Dolphin - playful, social, and full of intelligent energy. Your ability to connect with others and find joy in collaboration is a gift. Ride the waves of your social energy.",
		energy: 3.5,
		mood: 4.0,
		cognitive: 3.5,
		social: 4.5,
		anxiety: 1.5,
	},
	{
		name: "Lion",
		emoji: "🦁",
		description: "Confident, powerful, and leading. Lions move through their world with natural authority.",
		message: "Today you are a Lion - confident, powerful, and naturally leading. Your presence and ability to guide others are gifts. Roar with authenticity and own your space.",
		energy: 4.5,
		mood: 4.0,
		cognitive: 3.5,
		social: 2.0,
		anxiety: 1.0,
	},
	{
		name: "Turtle",
		emoji: "🐢",
		description: "Steady, patient, and grounded. Turtles carry their home with them and move at their own wise pace.",
		message: "Today you are a Turtle - steady, patient, and grounded. Your ability to move at your own pace and carry your wisdom with you is a strength. Slow and steady wins the race. Honor your need for stability.",
		energy: -2.5,
		mood: 1.5,
		cognitive: 2.5,
		social: -1.5,
		anxiety: 1.0,
	},
	{
		name: "Sloth",
		emoji: "🦥",
		description: "Slow, resting, and conserving. Sloths are masters of energy conservation and wisdom in stillness.",
		message: "Today you are a Sloth - your body and mind are asking for rest. Sloths are masters of energy conservation. This is a valid and necessary state. Honor what your nervous system needs. Rest is productive.",
		energy: -4.0,
		mood: -1.5,
		cognitive: -1.0,
		social: -2.0,
		anxiety: 0.5,
	},
]

// Mock data generator for preview
function generateMockAnalysis(animalIndex: number): AnimalAnalysisResult {
	const animal = allAnimals[animalIndex]
	return {
		animal: animal,
		energyScore: animal.energy,
		moodScore: animal.mood,
		cognitiveScore: animal.cognitive,
		socialScore: animal.social,
		anxietyScore: animal.anxiety,
		timestamp: new Date().toISOString(),
	}
}

export default function AnimalDisplay() {
	const [analysis, setAnalysis] = useState<AnimalAnalysisResult | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [previewMode, setPreviewMode] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)

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
				} else {
					// Backend not available - switch to preview mode
					setPreviewMode(true)
					setAnalysis(generateMockAnalysis(0))
				}
			} catch (err) {
				// Network error - switch to preview mode
				setPreviewMode(true)
				setAnalysis(generateMockAnalysis(0))
			} finally {
				setIsLoading(false)
			}
		}
		fetchAnimalAnalysis()
	}, [])

	const handleNext = () => {
		const nextIndex = (currentIndex + 1) % allAnimals.length
		setCurrentIndex(nextIndex)
		setAnalysis(generateMockAnalysis(nextIndex))
	}

	const handlePrev = () => {
		const prevIndex = (currentIndex - 1 + allAnimals.length) % allAnimals.length
		setCurrentIndex(prevIndex)
		setAnalysis(generateMockAnalysis(prevIndex))
	}

	const handleRandom = () => {
		const randomIndex = Math.floor(Math.random() * allAnimals.length)
		setCurrentIndex(randomIndex)
		setAnalysis(generateMockAnalysis(randomIndex))
	}

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
				{previewMode && <Chip label="Preview Mode" size="small" sx={{ ml: 1 }} color="info" />}
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

			{previewMode && (
				<
					<Stack direction="row" spacing={1} sx={{ mt: 3, justifyContent: 'center' }}>
						<Button variant="outlined" size="small" onClick={handlePrev}>Previous</Button>
						<Button variant="outlined" size="small" onClick={handleRandom}>Random</Button>
						<Button variant="outlined" size="small" onClick={handleNext}>Next</Button>
					</Stack>
				>
			)}

			<Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: 'center', display: 'block' }}>
				{previewMode ? `Preview: ${currentIndex + 1} of ${allAnimals.length}` : `Analysis from: ${new Date(analysis.timestamp).toLocaleString()}`}
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
