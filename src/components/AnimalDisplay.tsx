import { Box, Typography, Paper, Divider, Chip, Button, Stack, Fade, Zoom } from "@mui/material"
import { useState, useEffect, useMemo } from "react"
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';
import { loadToday } from "../storage"
import { allAnimals, analyzeEvening, generateMockAnalysis } from "../animals"

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
const AnimatedPaper = styled(Paper)(() => ({
	animation: `${glow} 3s ease-in-out infinite`,
	transition: 'all 0.3s ease',
	position: 'relative',
	'&:hover': {
		transform: 'translateY(-4px)',
		boxShadow: '0 12px 32px rgba(255, 182, 193, 0.4)',
	},
}));

// Styled animal emoji with bounce animation
const BounceEmoji = styled(Typography)(() => ({
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
const KawaiiButton = styled(Button)(() => ({
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
const ScoreBadge = styled(Chip)(() => ({
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

// Score chip with kawaii colors
function ScoreChip({ label, value }: { label: string, value: number }) {
	// Determine color based on value
	let bgColor: string
	let textColor: string
	
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


function makeSparkles() {
	return Array.from({ length: 8 }, (_, i) => {
		const angle = (i / 8) * Math.PI * 2
		const distance = 100 + Math.random() * 50
		return {
			x: 50 + Math.cos(angle) * distance,
			y: 50 + Math.sin(angle) * distance,
			delay: Math.random() * 2,
			size: 8 + Math.random() * 8,
		}
	})
}

export default function AnimalDisplay({ refreshKey = 0 }: { refreshKey?: number }) {
	const [previewIndex, setPreviewIndex] = useState<number | null>(null)
	const [showSparkles, setShowSparkles] = useState(true)
	const [sparkleSeed, setSparkleSeed] = useState(() => makeSparkles())
	const previewMode = previewIndex !== null

	const saved = useMemo(() => {
		// refreshKey forces a re-read after a new check-in is saved
		void refreshKey
		const evening = loadToday<Record<string, number>>("evening")
		return evening ? analyzeEvening(evening) : null
	}, [refreshKey])

	const analysis = previewIndex !== null ? generateMockAnalysis(previewIndex) : saved
	const currentIndex = previewIndex ?? 0

	useEffect(() => {
		// Toggle sparkles every 3 seconds
		const sparkleInterval = setInterval(() => {
			setShowSparkles(prev => !prev)
			setSparkleSeed(makeSparkles())
		}, 3000)
		return () => clearInterval(sparkleInterval)
	}, [])

	const togglePreview = () => setPreviewIndex(previewMode ? null : 0)

	const previewToggle = (
		<Box sx={{ textAlign: 'center', mb: 3 }}>
			<KawaiiButton
				variant="outlined"
				size="small"
				onClick={togglePreview}
				data-testid="preview-toggle"
			>
				{previewMode ? '✖️ Exit preview' : '🎪 Preview all animals'}
			</KawaiiButton>
		</Box>
	)

	const handleNext = () => setPreviewIndex((currentIndex + 1) % allAnimals.length)
	const handlePrev = () => setPreviewIndex((currentIndex - 1 + allAnimals.length) % allAnimals.length)
	const handleRandom = () => setPreviewIndex(Math.floor(Math.random() * allAnimals.length))

	const sparkles = showSparkles && analysis
		? sparkleSeed.map((sp, i) => (
			<SparkleDiv
				key={i}
				style={{
					left: `${sp.x}%`,
					top: `${sp.y}%`,
					animationDelay: `${sp.delay}s`,
					width: `${sp.size}px`,
					height: `${sp.size}px`,
				}}
			/>
		))
		: []

	if (!analysis) {
		return (
			<>
			<Box
				sx={{
					p: { xs: 2, sm: 3 },
					mb: 3,
					textAlign: 'center',
					border: '2px dashed #FFB6C1',
					borderRadius: '24px',
					background: 'rgba(255, 255, 255, 0.5)',
				}}
			>
				<Typography sx={{ fontSize: '2.5rem' }}>🥚</Typography>
				<Typography variant="body1" sx={{ color: '#FF69B4', fontWeight: 600 }}>
					Your animal archetype is waiting! Complete today's evening check-in to hatch it 🌸
				</Typography>
			</Box>
			{previewToggle}
			</>
		)
	}

	return (
		<Fade in={true} timeout={1000}>
			<Box sx={{ mb: 3 }}>
				<AnimatedPaper 
					elevation={3} 
					sx={{
						p: { xs: 2, sm: 4 },
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
								fontSize: { xs: '1.4rem', sm: '1.8rem' },
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
								fontSize: { xs: '1.9rem', sm: '2.5rem' },
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
								component="p"
								sx={{
									mb: 2,
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
								component="p"
								sx={{
									mb: 2,
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
							gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
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
								direction="row"
								useFlexGap
								spacing={1} 
								sx={{ mt: 4, justifyContent: 'center', flexWrap: 'wrap' }}
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
				{previewToggle}
			</Box>
		</Fade>
	)
}
