import { Box, Typography, Paper, Divider, Chip, CircularProgress, Button, Stack, Fade, Zoom } from "@mui/material"
import { useState, useEffect } from "react"
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';
import { loadToday } from "../storage"

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
	color?: string
	bgColor?: string
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

// Sparkle animation
const sparkle = keyframes`
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.7; }
`;

// Bounce animation for emoji
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Glow effect for the animal card
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 182, 193, 0.3); }
  50% { box-shadow: 0 0 30px rgba(255, 182, 193, 0.5); }
`;

// Styled Paper with animation
const AnimatedPaper = styled(Paper)(({ theme }) => ({
	animation: `${glow} 3s ease-in-out infinite`,
	transition: 'all 0.3s ease',
	position: 'relative',
	'&:hover': {
		transform: 'translateY(-4px)',
		boxShadow: '0 12px 32px rgba(255, 182, 193, 0.4)',
	},
}));

// Styled animal emoji with bounce animation
const BounceEmoji = styled(Typography)(({ theme }) => ({
	animation: `${bounce} 2s ease-in-out infinite`,
	display: 'inline-block',
	fontSize: '4rem',
	textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

// Sparkle element
const SparkleDiv = styled('div')({
	position: 'absolute',
	width: '12px',
	height: '12px',
	background: 'radial-gradient(circle, #FFD700 0%, #FFB6C1 100%)',
	borderRadius: '50%',
	animation: `${sparkle} 2s ease-in-out infinite`,
	pointerEvents: 'none',
});

// Kawaii button
const KawaiiButton = styled(Button)(({ theme }) => ({
	borderRadius: '24px',
	padding: '8px 20px',
	fontWeight: 600,
	textTransform: 'none',
	fontSize: '0.9rem',
	transition: 'all 0.3s ease',
	border: '2px solid #FFB6C1',
	background: 'linear-gradient(135deg, #FFF8F0, #FFE4E9)',
	color: '#FF69B4',
	'&:hover': {
		transform: 'translateY(-2px) scale(1.05)',
		boxShadow: '0 6px 16px rgba(255, 182, 193, 0.4)',
		background: 'linear-gradient(135deg, #FFE4E9, #FFF0F5)',
	},
	'&:active': {
		transform: 'translateY(0) scale(0.98)',
	},
}));

// Score badge with kawaii styling
const ScoreBadge = styled(Chip)(({ theme }) => ({
	borderRadius: '16px',
	padding: '8px 12px',
	fontWeight: 600,
	fontSize: '0.85rem',
	transition: 'all 0.2s ease',
	border: '2px solid rgba(255, 255, 255, 0.8)',
	'&:hover': {
		transform: 'scale(1.1) rotate(5deg)',
	},
}));

// All animal archetypes with colors
const allAnimals: AnimalArchetype[] = [
	{
		name: "Dragonfly",
		emoji: "🪲",
		description: "Iridescent, adaptable, and quick to change direction. Dragonflies see the world from many angles and move with precision and grace.",
		message: "Today you are a Dragonfly - your mind is darting between ideas with iridescent clarity. You see patterns others miss. Embrace your ability to shift perspective and adapt quickly. Your mental agility is a superpower! ✨",
		energy: 3.5,
		mood: 3.0,
		cognitive: 4.0,
		social: 2.0,
		anxiety: 3.0,
		color: '#8A2BE2',
		bgColor: 'linear-gradient(135deg, #E6E6FA, #DDA0DD)',
	},
	{
		name: "Owl",
		emoji: "🦉",
		description: "Wise, observant, and calm. Owls see what others cannot in the dark. They are patient and deliberate.",
		message: "Today you are an Owl - wise, observant, and deeply thoughtful. You see patterns and truths that elude others. Your quiet reflection is valuable. Trust your insights and the clarity that comes from stillness. 🌙",
		energy: -1.0,
		mood: 3.5,
		cognitive: 4.5,
		social: -1.0,
		anxiety: 2.0,
		color: '#FFD700',
		bgColor: 'linear-gradient(135deg, #FFF8DC, #FFE4B5)',
	},
	{
		name: "Cheetah",
		emoji: "🐆",
		description: "Fast, focused, and in flow. Cheetahs sprint with incredible intensity and precision.",
		message: "Today you are a Cheetah - in a high-speed flow state. Channel this focused energy into what matters most. Remember that even cheetahs need to rest after their sprint. Honor your need for both speed and recovery. 💨",
		energy: 4.5,
		mood: 3.5,
		cognitive: 3.0,
		social: -0.5,
		anxiety: 2.0,
		color: '#FF8C00',
		bgColor: 'linear-gradient(135deg, #FFE4B5, #FFDAB9)',
	},
	{
		name: "Eagle",
		emoji: "🦅",
		description: "Visionary, goal-oriented, and sharp. Eagles see the big picture from great heights.",
		message: "Today you are an Eagle - seeing the big picture with clarity and focus. Your vision and ability to spot opportunities from afar are gifts. Trust your perspective and soar with confidence. 🌤️",
		energy: 4.0,
		mood: 4.0,
		cognitive: 4.5,
		social: -1.0,
		anxiety: 1.0,
		color: '#4169E1',
		bgColor: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)',
	},
	{
		name: "Dolphin",
		emoji: "🐬",
		description: "Playful, social, and intelligent. Dolphins communicate beautifully and move with joy through their world.",
		message: "Today you are a Dolphin - playful, social, and full of intelligent energy. Your ability to connect with others and find joy in collaboration is a gift. Ride the waves of your social energy! 🌊",
		energy: 3.5,
		mood: 4.0,
		cognitive: 3.5,
		social: 4.5,
		anxiety: 1.5,
		color: '#20B2AA',
		bgColor: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)',
	},
	{
		name: "Lion",
		emoji: "🦁",
		description: "Confident, powerful, and leading. Lions move through their world with natural authority.",
		message: "Today you are a Lion - confident, powerful, and naturally leading. Your presence and ability to guide others are gifts. Roar with authenticity and own your space! 🦁",
		energy: 4.5,
		mood: 4.0,
		cognitive: 3.5,
		social: 2.0,
		anxiety: 1.0,
		color: '#FFD700',
		bgColor: 'linear-gradient(135deg, #FFF8DC, #FFE4B5)',
	},
	{
		name: "Turtle",
		emoji: "🐢",
		description: "Steady, patient, and grounded. Turtles carry their home with them and move at their own wise pace.",
		message: "Today you are a Turtle - steady, patient, and grounded. Your ability to move at your own pace and carry your wisdom with you is a strength. Slow and steady wins the race. Honor your need for stability. 🐚",
		energy: -2.5,
		mood: 1.5,
		cognitive: 2.5,
		social: -1.5,
		anxiety: 1.0,
		color: '#228B22',
		bgColor: 'linear-gradient(135deg, #F0F8FF, #E6E6FA)',
	},
	{
		name: "Sloth",
		emoji: "🦥",
		description: "Slow, resting, and conserving. Sloths are masters of energy conservation and wisdom in stillness.",
		message: "Today you are a Sloth - your body and mind are asking for rest. Sloths are masters of energy conservation. This is a valid and necessary state. Honor what your nervous system needs. Rest is productive. 💤",
		energy: -4.0,
		mood: -1.5,
		cognitive: -1.0,
		social: -2.0,
		anxiety: 0.5,
		color: '#8B4513',
		bgColor: 'linear-gradient(135deg, #F5F5DC, #DEB887)',
	},
	{
		name: "Koala",
		emoji: "🐨",
		description: "Sleepy, low energy, and cozy. Koalas conserve energy and find comfort in rest.",
		message: "Today you are a Koala - sleepy, cozy, and conserving energy. Your need for rest is natural and wise. Koalas know when to slow down and recharge. Listen to your body's wisdom. 🌿",
		energy: -3.0,
		mood: 0.0,
		cognitive: -1.5,
		social: -1.0,
		anxiety: 1.0,
		color: '#A0522D',
		bgColor: 'linear-gradient(135deg, #F5F5DC, #D2B48C)',
	},
	{
		name: "Rabbit",
		emoji: "🐇",
		description: "Jumpy, anxious, and vigilant. Rabbits are quick to respond and always aware of their surroundings.",
		message: "Today you are a Rabbit - alert, vigilant, and perhaps feeling a bit jumpy. Your sensitivity to your environment is a survival skill. Be gentle with yourself. It's okay to feel on edge sometimes. Ground yourself when you can. 🥕",
		energy: 1.5,
		mood: -2.0,
		cognitive: -2.0,
		social: -1.0,
		anxiety: 8.0,
		color: '#FF6347',
		bgColor: 'linear-gradient(135deg, #FFE4E1, #FFA07A)',
	},
	{
		name: "Squirrel",
		emoji: "🐿️",
		description: "Scattered, busy, and distracted. Squirrels gather many things at once and are always preparing.",
		message: "Today you are a Squirrel - busy, scattered, and gathering many things at once. Your ability to multitask and prepare is a skill. Try to focus on one acorn at a time. Your mind works in beautiful, complex ways. 🌰",
		energy: 3.0,
		mood: 0.5,
		cognitive: -2.0,
		social: -0.5,
		anxiety: 7.0,
		color: '#8B4513',
		bgColor: 'linear-gradient(135deg, #F5F5DC, #DEB887)',
	},
	{
		name: "Spider",
		emoji: "🕷️",
		description: "Creative, weaving connections, and seeing patterns. Spiders create intricate webs of thought.",
		message: "Today you are a Spider - weaving intricate connections and seeing patterns others miss. Your creative mind builds beautiful webs of thought. Trust your unique perspective. 🕸️",
		energy: 1.5,
		mood: 2.0,
		cognitive: 4.5,
		social: -1.0,
		anxiety: 4.0,
		color: '#4B0082',
		bgColor: 'linear-gradient(135deg, #F0F8FF, #E6E6FA)',
	},
	{
		name: "Octopus",
		emoji: "🐙",
		description: "Multi-tasking, intelligent, and adaptable. Octopuses solve complex problems with many arms.",
		message: "Today you are an Octopus - handling multiple streams of thought and action with intelligence. Your ability to multitask and adapt is remarkable. Consider focusing your tentacles on what truly matters. 🐚",
		energy: 3.5,
		mood: 2.5,
		cognitive: 4.5,
		social: 1.0,
		anxiety: 2.0,
		color: '#8A2BE2',
		bgColor: 'linear-gradient(135deg, #E6E6FA, #DDA0DD)',
	},
	{
		name: "Butterfly",
		emoji: "🦋",
		description: "Social, transforming, and free. Butterflies move through the world with grace and bring joy to others.",
		message: "Today you are a Butterfly - social, transforming, and moving through the world with grace. Your ability to connect with others and bring joy is a gift. Embrace your beautiful metamorphosis. 🌸",
		energy: 3.0,
		mood: 4.0,
		cognitive: 2.0,
		social: 4.0,
		anxiety: 1.5,
		color: '#FF1493',
		bgColor: 'linear-gradient(135deg, #FFE4E9, #FFF0F5)',
	},
	{
		name: "Snake",
		emoji: "🐍",
		description: "Introspective, shedding, and renewing. Snakes transform through periods of deep reflection.",
		message: "Today you are a Snake - introspective, shedding old patterns, and preparing for renewal. Your periods of withdrawal and reflection are necessary for growth. Trust your process of transformation. 🐍",
		energy: -1.0,
		mood: -1.5,
		cognitive: 3.5,
		social: -2.0,
		anxiety: 6.0,
		color: '#228B22',
		bgColor: 'linear-gradient(135deg, #F0F8FF, #98FB98)',
	},
	{
		name: "Fox",
		emoji: "🦊",
		description: "Clever, adaptable, and cautious. Foxes navigate their world with intelligence and strategy.",
		message: "Today you are a Fox - clever, adaptable, and navigating with intelligence. Your strategic mind and ability to find creative solutions are assets. Trust your instincts. 🦊",
		energy: 2.5,
		mood: 2.5,
		cognitive: 4.0,
		social: -0.5,
		anxiety: 5.0,
		color: '#FF8C00',
		bgColor: 'linear-gradient(135deg, #FFE4B5, #FFDAB9)',
	},
	{
		name: "Giraffe",
		emoji: "🦒",
		description: "Gentle, observant, and seeing the big picture. Giraffes have a tall perspective on the world.",
		message: "Today you are a Giraffe - seeing the world from a tall perspective with gentleness and clarity. Your ability to see the big picture and remain calm is a gift. Trust your elevated view. 🌿",
		energy: 3.0,
		mood: 3.5,
		cognitive: 3.5,
		social: 2.5,
		anxiety: 1.0,
		color: '#FFD700',
		bgColor: 'linear-gradient(135deg, #FFF8DC, #FFE4B5)',
	},
]

const invert = (score: number) => -score
const round1 = (n: number) => Math.round(n * 10) / 10

// Evening check-in values are numeric sliders; missing ones count as 0
export function analyzeEvening(d: Record<string, number>): AnimalAnalysisResult {
	const v = (k: string) => Number(d[k]) || 0
	const energy = (v("averageEnergy") + invert(v("feelingTiredInEvening")) + invert(v("fatigueDuringDay"))) / 3
	const mood = (v("averageMood") + v("selfWorth")) / 2
	const cognitive = (
		invert(v("feelingCognitivelyImpaired")) +
		invert(v("difficultyConcentrating")) +
		v("flightOfIdeas") +
		invert(v("distractible")) +
		v("programmedHobbyProject")
	) / 5
	const social = (v("hoursWithOtherPeople") + v("qualityOfSocialTime") + invert(v("socialInsecurity"))) / 3
	const anxiety = (
		v("overallAnxiety") + v("stress") + v("fearOfGettingManic") + v("overwhelmedByWork") + v("socialInsecurity")
	) / 5 * 2.5

	let best = allAnimals[0]
	let min = Infinity
	for (const a of allAnimals) {
		const dist = Math.sqrt(
			(energy - a.energy) ** 2 * 0.25 +
			(mood - a.mood) ** 2 * 0.25 +
			(cognitive - a.cognitive) ** 2 * 0.2 +
			(social - a.social) ** 2 * 0.15 +
			(anxiety - a.anxiety) ** 2 * 0.15,
		)
		if (dist < min) {
			min = dist
			best = a
		}
	}

	return {
		animal: best,
		energyScore: round1(energy),
		moodScore: round1(mood),
		cognitiveScore: round1(cognitive),
		socialScore: round1(social),
		anxietyScore: round1(anxiety),
		timestamp: new Date().toISOString(),
	}
}

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

// Score chip with kawaii colors
function ScoreChip({ label, value }: { label: string, value: number }) {
	// Determine color based on value
	let bgColor = 'linear-gradient(135deg, #F0F8FF, #E6E6FA)'
	let textColor = '#333333'
	
	if (value >= 3) {
		bgColor = 'linear-gradient(135deg, #D4EDDA, #C3E6CB)'
		textColor = '#155724'
	} else if (value >= 1) {
		bgColor = 'linear-gradient(135deg, #FFF3CD, #FFEAA7)'
		textColor = '#856404'
	} else if (value >= -1) {
		bgColor = 'linear-gradient(135deg, #F8D7DA, #F5C6CB)'
		textColor = '#721C24'
	} else {
		bgColor = 'linear-gradient(135deg, #F5C6CB, #F8D7DA)'
		textColor = '#721C24'
	}

	return (
		<ScoreBadge 
			label={`${label}: ${value.toFixed(1)}`}
			sx={{
				background: bgColor,
				color: textColor,
				border: 'none',
			}}
		/>
	)
}

export default function AnimalDisplay() {
	const [analysis, setAnalysis] = useState<AnimalAnalysisResult | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [previewMode, setPreviewMode] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [showSparkles, setShowSparkles] = useState(true)

	useEffect(() => {
		const evening = loadToday<Record<string, number>>("evening")
		setAnalysis(evening ? analyzeEvening(evening) : null)
		setIsLoading(false)
		
		// Toggle sparkles every 3 seconds
		const sparkleInterval = setInterval(() => {
			setShowSparkles(prev => !prev)
		}, 3000)
		
		return () => clearInterval(sparkleInterval)
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

	// Generate random sparkle positions
	const sparkles = []
	if (showSparkles && analysis) {
		for (let i = 0; i < 8; i++) {
			const angle = (i / 8) * Math.PI * 2
			const distance = 100 + Math.random() * 50
			const x = 50 + Math.cos(angle) * distance
			const y = 50 + Math.sin(angle) * distance
			sparkles.push(
				<SparkleDiv 
					key={i}
					style={{
						left: `${x}%`,
						top: `${y}%`,
						animationDelay: `${Math.random() * 2}s`,
						width: `${8 + Math.random() * 8}px`,
						height: `${8 + Math.random() * 8}px`,
					}}
				/>
			)
		}
	}

	if (isLoading) {
		return (
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<CircularProgress 
					size={60} 
					thickness={4}
					sx={{ color: '#FFB6C1' }}
				/>
				<Typography 
					variant="h6" 
					sx={{ mt: 2, color: '#FF69B4' }}
				>
					Loading your animal archetype...
				</Typography>
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
				<Typography variant="body1" sx={{ color: '#FF69B4' }}>
					Complete your evening check-in to discover your animal archetype for today! 🌸
				</Typography>
			</Box>
		)
	}

	return (
		<Fade in={true} timeout={1000}>
			<Box sx={{ mb: 3 }}>
				<AnimatedPaper 
					elevation={3} 
					sx={{
						p: 4,
						background: analysis.animal.bgColor || 'linear-gradient(135deg, #FFF8F0, #FFE4E9)',
						border: '2px solid #FFB6C1',
						borderRadius: '24px',
						position: 'relative',
						overflow: 'hidden',
					}}
				>
					{sparkles}
					
					<Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
						<Typography 
							variant="h4" 
							gutterBottom
							sx={{
								color: analysis.animal.color || '#FF69B4',
								fontWeight: 700,
								fontSize: '1.8rem',
								textShadow: '0 2px 4px rgba(0,0,0,0.1)',
							}}
						>
							Your Animal Archetype Today
						</Typography>
						
						{previewMode && (
							<Chip 
								label="🎨 Preview Mode" 
								size="small" 
								sx={{
									bgcolor: 'rgba(255, 255, 255, 0.8)',
									color: '#FF69B4',
									fontWeight: 600,
									mb: 2,
								}}
							/>
						)}
						
						<Divider 
							sx={{
								my: 2,
								borderColor: 'rgba(255, 182, 193, 0.5)',
								borderWidth: '2px',
								borderRadius: '4px',
							}}
						/>

						<Zoom in={true} timeout={800} style={{ transitionDelay: '200ms' }}>
							<Box sx={{ 
								my: 3,
								p: 3,
								background: 'rgba(255, 255, 255, 0.3)',
								borderRadius: '16px',
								backdropFilter: 'blur(10px)',
								display: 'inline-block',
							}}
							>
								<BounceEmoji>
									{analysis.animal.emoji}
								</BounceEmoji>
							</Box>
						</Zoom>

						<Typography 
							variant="h3" 
							gutterBottom
							sx={{
								color: analysis.animal.color || '#FF69B4',
								fontWeight: 700,
								fontSize: '2.5rem',
								mt: 1,
							}}
						>
							{analysis.animal.name}
						</Typography>

						<Chip 
							label="✨ Neuro-affirmative insight ✨" 
							size="small" 
							sx={{
								bgcolor: 'rgba(255, 255, 255, 0.8)',
								color: '#FF69B4',
								fontWeight: 600,
								fontSize: '0.9rem',
								mb: 3,
								border: '2px dashed #FFB6C1',
							}}
						/>

						<Box 
							sx={{
								mb: 3,
								p: 3,
								background: 'rgba(255, 255, 255, 0.2)',
								borderRadius: '16px',
								backdropFilter: 'blur(10px)',
							}}
						>
							<Typography 
								variant="body1" 
								paragraph
								sx={{
									color: '#333333',
									fontSize: '1.1rem',
									lineHeight: 1.8,
									fontWeight: 500,
								}}
							>
								{analysis.animal.message}
							</Typography>
							<Typography 
								variant="body2" 
								color="text.secondary" 
								paragraph
								sx={{
									color: 'rgba(0, 0, 0, 0.6)',
									fontSize: '0.95rem',
									lineHeight: 1.7,
									fontStyle: 'italic',
								}}
							>
								{analysis.animal.description}
							</Typography>
						</Box>

						<Divider 
							sx={{
								my: 3,
								borderColor: 'rgba(255, 182, 193, 0.5)',
								borderWidth: '2px',
								borderRadius: '4px',
							}}
						/>

						<Typography 
							variant="h6" 
							gutterBottom
							sx={{
								color: analysis.animal.color || '#FF69B4',
								fontWeight: 600,
								textAlign: 'center',
							}}
						>
							🌈 Your Scores 🌈
						</Typography>

						<Box sx={{
							display: 'grid', 
							gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
							gap: 2,
							justifyContent: 'center',
							maxWidth: '600px',
							mx: 'auto',
						}}
						>
							<ScoreChip label="⚡ Energy" value={analysis.energyScore} />
							<ScoreChip label="💖 Mood" value={analysis.moodScore} />
							<ScoreChip label="🧠 Cognitive" value={analysis.cognitiveScore} />
							<ScoreChip label="👥 Social" value={analysis.socialScore} />
							<ScoreChip label="😰 Anxiety" value={analysis.anxietyScore} />
						</Box>

						{previewMode && (
							<Stack 
								direction="row"} 
								spacing={2} 
								sx={{ mt: 4, justifyContent: 'center' }}
							>
								<KawaiiButton variant="contained" onClick={handlePrev}>
									⬅️ Previous
								</KawaiiButton>
								<KawaiiButton variant="contained" onClick={handleRandom}>
									🎲 Random
								</KawaiiButton>
								<KawaiiButton variant="contained" onClick={handleNext}>
									Next ➡️
								</KawaiiButton>
							</Stack>
						)}

						<Typography 
							variant="caption" 
							color="text.secondary" 
							sx={{
								mt: 3, 
								textAlign: 'center', 
								display: 'block',
								color: 'rgba(0, 0, 0, 0.5)',
								fontWeight: 500,
							}}
						>
							{previewMode ? 
								`🎪 Preview: ${currentIndex + 1} of ${allAnimals.length} 🎪` : 
								`📅 Analysis from: ${new Date(analysis.timestamp).toLocaleString()}`
							}
						</Typography>
					</Box>
				</AnimatedPaper>
			</Box>
		</Fade>
	)
}
