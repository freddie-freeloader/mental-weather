import { useState, useEffect } from "react"
import { Box, Typography, LinearProgress, Paper, styled, keyframes, IconButton } from "@mui/material"
import { AddCircle, RemoveCircle, Opacity } from "@mui/icons-material"
import { addWasserGlass, undoWasserGlass, getGlassCount } from "../wasser"

// Pastel water colors
const WATER_COLORS: Record<number, string> = {
  0: '#FFE0F5', // Very light pink - no water
  1: '#FFD1F2',
  2: '#FFC2EE',
  3: '#FFB3E9',
  4: '#FFA4E5',
  5: '#FF95E0',
  6: '#FF86DB',
  7: '#FF77D6',
  8: '#FF68D1',
  9: '#FF59CC',
  10: '#FF4AC7',
  11: '#FF3BB2',
  12: '#FF2CAD',
  13: '#FF1DA8',
  14: '#FF0EA3',
  15: '#E60D8A',
  16: '#CC0C71',
  17: '#B30B5F',
  18: '#990A4C',
  19: '#80083D',
  20: '#660730',
}

// Bubble floating animation
const bubbleFloat = keyframes`
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
    opacity: 0.8;
  }
  50% { 
    transform: translateY(-15px) rotate(5deg); 
    opacity: 1;
  }
`

// Water wave animation
const waterWave = keyframes`
  0%, 100% { 
    transform: translateX(-5px);
  }
  50% { 
    transform: translateX(5px);
  }
`

// Shimmer effect for water
const shimmer = keyframes`
  0% { 
    background-position: -200% 0;
  }
  100% { 
    background-position: 200% 0;
  }
`

// Styled components
const WasserPaper = styled(Paper)(() => ({
  background: 'linear-gradient(135deg, #FFF8F0, #FFE4F5)',
  border: '3px solid #FFB6C1',
  borderRadius: '24px',
  padding: 'clamp(12px, 4vw, 24px)',
  marginBottom: '16px',
  boxShadow: '0 8px 24px rgba(255, 182, 193, 0.3)',
  position: 'relative',
  overflow: 'hidden',
}))

const WaterDroplet = styled('div')<{ index: number; glasses: number }>(({ index, glasses }) => {
  const size = Math.max(20, 30 - (index * 2))
  const color = WATER_COLORS[Math.min(glasses, 20)] || WATER_COLORS[0]
  const delay = `${index * 0.1}s`
  return {
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, ${color}, #A0D8FF)`,
    borderRadius: '50%',
    position: 'absolute',
    animation: `${bubbleFloat} 3s ease-in-out infinite`,
    animationDelay: delay,
    boxShadow: `0 4px 8px rgba(100, 200, 255, 0.3)`,
    zIndex: 1,
    opacity: 0.9,
  }
})

const WaterWaveOverlay = styled(Box)<{ glasses: number }>(({ glasses }) => {
  const color = WATER_COLORS[Math.min(glasses, 20)] || WATER_COLORS[0]
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
    backgroundSize: '200% 100%',
    animation: `${waterWave} 4s linear infinite`,
    opacity: 0.6,
    zIndex: 0,
  }
})

const ProgressContainer = styled(Box)(() => ({
  margin: '16px 0',
  borderRadius: '12px',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.8)',
  border: '2px solid #FFB6C1',
  position: 'relative',
}))

const StyledProgress = styled(LinearProgress)<{ glasses: number }>(({ glasses }) => {
  const color = WATER_COLORS[Math.min(glasses, 20)] || WATER_COLORS[0]
  return {
    height: '24px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '& .MuiLinearProgress-bar': {
      background: `linear-gradient(90deg, ${color}, #A0D8FF)`,
      transition: 'width 0.5s ease, background-color 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
  }
})

const ShimmerEffect = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 2s linear infinite`,
  pointerEvents: 'none',
}))

// Hydration messages
const HYDRATION_MESSAGES: Record<number, string> = {
  0: "Oh no! Your water bottle is empty! 😢💧",
  1: "One sip! Good start! 🌸💧",
  2: "Two sips! Keep going! 🌼💧",
  3: "Three sips! You're doing great! 🌺💧",
  4: "Four sips! Almost halfway! 🌸🌸💧",
  5: "Five glasses! Halfway there! 🌈💧",
  6: "Six glasses! Feeling refreshed! 🌊💧",
  7: "Seven glasses! So hydrated! 🌸🌸🌸💧",
  8: "Eight glasses! Almost there! 🌈🌈💧",
  9: "Nine glasses! So close! 🌸🌸🌸🌸💧",
  10: "Ten glasses! Perfect hydration! 🌈🌈🌈💧",
  11: "Eleven glasses! Extra hydrated! ✨💧",
  12: "Twelve glasses! Super hydrated! ✨✨💧",
  13: "Thirteen glasses! Amazing! ✨✨✨💧",
  14: "Fourteen glasses! Incredible! ✨✨✨✨💧",
  15: "Fifteen glasses! Unstoppable! ✨✨✨✨✨💧",
  16: "Sixteen glasses! Legendary! 🌟✨💧",
  17: "Seventeen glasses! Champion! 🌟✨✨💧",
  18: "Eighteen glasses! Superstar! 🌟✨✨✨💧",
  19: "Nineteen glasses! Hydration queen! 🌟✨✨✨✨💧",
  20: "TWENTY GLASSES! Ultimate hydration! 🌟✨✨✨✨✨💧💖",
}

// Encouraging messages based on progress
const getEncouragement = (glasses: number): string => {
  if (glasses >= 20) return "🌟💖 You're a hydration superstar! Keep shining! 🌟💖"
  if (glasses >= 15) return "🌈 Amazing job! Your body is so happy! 🌈"
  if (glasses >= 10) return "✨ Perfect! You're well hydrated! ✨"
  if (glasses >= 5) return "🌸 Keep going! You're halfway there! 🌸"
  if (glasses > 0) return "💧 Every sip counts! You got this! 💧"
  return "😢 Your water bottle misses you! Drink up! 😢"
}

interface WasserOMeterProps {
  onGlassAdded?: () => void
  onGlassRemoved?: () => void
}

export default function WasserOMeter({ onGlassAdded, onGlassRemoved }: WasserOMeterProps) {
  const [glasses, setGlasses] = useState(() => getGlassCount())
  const [animationKey, setAnimationKey] = useState(0)

  // Reload count when component mounts
  useEffect(() => {
    setGlasses(getGlassCount())
  }, [])

  const handleAddGlass = () => {
    addWasserGlass()
    const newCount = getGlassCount()
    setGlasses(newCount)
    setAnimationKey((prev) => prev + 1)
    onGlassAdded?.()
  }

  const handleRemoveGlass = () => {
    undoWasserGlass()
    const newCount = getGlassCount()
    setGlasses(newCount)
    setAnimationKey((prev) => prev + 1)
    onGlassRemoved?.()
  }

  const clampedGlasses = Math.max(0, Math.min(20, glasses))
  const percentage = (clampedGlasses / 20) * 100
  const message = HYDRATION_MESSAGES[clampedGlasses] || HYDRATION_MESSAGES[20]
  const encouragement = getEncouragement(clampedGlasses)

  // Generate water droplets
  const renderWaterDroplets = () => {
    const droplets = []
    const count = Math.min(clampedGlasses, 8) // Max 8 droplets for visual clarity
    
    for (let i = 0; i < count; i++) {
      droplets.push(
        <WaterDroplet
          key={`${animationKey}-${i}`}
          index={i}
          glasses={clampedGlasses}
          style={{
            left: `${10 + i * 12}%`,
            top: `${10 + (i % 3) * 15}%`,
          }}
        />
      )
    }
    return droplets
  }

  return (
    <WasserPaper elevation={2} key={animationKey}>
      <Box sx={{ textAlign: 'center', position: 'relative' }}>
        {/* Floating water droplets */}
        {renderWaterDroplets()}
        
        {/* Title with cute icon */}
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: '#FF69B4',
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Opacity sx={{ color: '#FFB6C1', fontSize: '1.5rem' }} />
          Edgar-o-Wasser Meter
          <Opacity sx={{ color: '#FFB6C1', fontSize: '1.5rem' }} />
        </Typography>

        {/* Glass count display */}
        <Typography 
          variant="h3" 
          component="div"
          sx={{
            fontWeight: 800,
            color: WATER_COLORS[clampedGlasses],
            fontSize: { xs: '2.5rem', sm: '3rem' },
            textShadow: `2px 2px 4px rgba(255, 105, 180, 0.2)`,
            my: 2,
          }}
        >
          {clampedGlasses} / 20
        </Typography>

        {/* Progress bar with shimmer */}
        <ProgressContainer>
          <StyledProgress 
            variant="determinate" 
            value={percentage}
            glasses={clampedGlasses}
          />
          <ShimmerEffect />
          <WaterWaveOverlay glasses={clampedGlasses} />
        </ProgressContainer>

        {/* Percentage text */}
        <Typography 
          variant="body1" 
          sx={{
            color: WATER_COLORS[clampedGlasses],
            fontWeight: 600,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            mt: 1,
          }}
        >
          {Math.round(percentage)}% Hydrated!
        </Typography>

        {/* Fun message */}
        <Typography 
          variant="body2" 
          sx={{
            color: '#FFB6C1',
            fontStyle: 'italic',
            mt: 1,
            display: 'block',
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
          }}
        >
          {message}
        </Typography>

        {/* Encouragement */}
        <Typography 
          variant="caption" 
          sx={{
            color: '#FF99C9',
            fontStyle: 'italic',
            mt: 1,
            display: 'block',
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
          }}
        >
          {encouragement}
        </Typography>

        {/* Action buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2,
          mt: 3,
        }}>
          <IconButton
            onClick={handleRemoveGlass}
            disabled={glasses <= 0}
            aria-label="Remove water glass"
            sx={{
              backgroundColor: 'rgba(255, 182, 193, 0.2)',
              border: '2px solid #FFB6C1',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              '&:hover': {
                backgroundColor: 'rgba(255, 182, 193, 0.4)',
              },
              '&:disabled': {
                opacity: 0.5,
              },
            }}
          >
            <RemoveCircle sx={{ 
              fontSize: '1.8rem', 
              color: '#FF69B4',
            }} />
          </IconButton>

          <IconButton
            onClick={handleAddGlass}
            aria-label="Add water glass"
            sx={{
              backgroundColor: 'rgba(100, 200, 255, 0.2)',
              border: '2px solid #A0D8FF',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              '&:hover': {
                backgroundColor: 'rgba(100, 200, 255, 0.4)',
              },
            }}
          >
            <AddCircle sx={{ 
              fontSize: '1.8rem', 
              color: '#64C8FF',
            }} />
          </IconButton>
        </Box>

        {/* Thirst reminder for low hydration */}
        {glasses < 5 && (
          <Typography 
            variant="caption" 
            sx={{
              color: '#FF69B4',
              fontWeight: 700,
              mt: 2,
              display: 'block',
              animation: `${bubbleFloat} 2s ease-in-out infinite`,
            }}
          >
            💧 P.S. Your body is thirsty! Drink more water! 💧
          </Typography>
        )}

        {/* Celebration for full hydration */}
        {glasses >= 20 && (
          <Typography 
            variant="caption" 
            sx={{
              color: '#FF69B4',
              fontWeight: 700,
              mt: 2,
              display: 'block',
              animation: `${bubbleFloat} 2s ease-in-out infinite`,
            }}
          >
            🌟🎉 CONGRATULATIONS! You're a hydration champion! 🎉🌟
          </Typography>
        )}
      </Box>
    </WasserPaper>
  )
}
