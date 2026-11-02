import { Box, Typography, LinearProgress, Paper, styled, keyframes } from "@mui/material"

// Coffee cup colors based on caffeine level
const COFFEE_COLORS = {
  0: '#F5F5DC', // Cream - no coffee
  1: '#FFA07A', // Light Salmon - 1 cup
  2: '#FF8C00', // Dark Orange - 2 cups
  3: '#FF4500', // Orange Red - 3 cups
  4: '#B22222', // Fire Brick - 4 cups
  5: '#8B0000', // Dark Red - 5 cups
  6: '#660000', // Very dark red - 6 cups
  7: '#4B0082', // Indigo - 7 cups (getting dangerous!)
  8: '#800080', // Purple - 8 cups (very jittery!)
  9: '#FF00FF', // Magenta - 9 cups (seeing things!)
  10: '#FF0000', // Red - 10 cups (heart attack imminent!)
}

// Steaming animation
const steam = keyframes`
  0%, 100% { 
    transform: translateY(0) scale(1); 
    opacity: 0.3;
  }
  50% { 
    transform: translateY(-10px) scale(1.2); 
    opacity: 0.6;
  }
`

// Pulsing animation for the progress bar
const pulse = keyframes`
  0%, 100% { 
    transform: scaleX(1);
  }
  50% { 
    transform: scaleX(1.05);
  }
`

// Styled components
const CoffeePaper = styled(Paper)(() => ({
  background: 'linear-gradient(135deg, #F5F5DC, #FFF8DC)',
  border: '2px solid #D2691E',
  borderRadius: '16px',
  padding: '16px',
  marginBottom: '16px',
  boxShadow: '0 4px 8px rgba(210, 105, 30, 0.2)',
}))

const CoffeeCup = styled('div')<{ cups: number, size?: number }>(({ cups, size = 60 }) => {
  const color = COFFEE_COLORS[Math.min(cups, 10)] || COFFEE_COLORS[0]
  return {
    fontSize: `${size}px`,
    color: color,
    display: 'inline-block',
    animation: cups > 0 ? `${steam} 2s ease-in-out infinite` : 'none',
    filter: cups > 0 ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
  }
})

const ProgressContainer = styled(Box)(() => ({
  margin: '12px 0',
  borderRadius: '8px',
  overflow: 'hidden',
  background: 'rgba(210, 105, 30, 0.1)',
  border: '1px solid #D2691E',
}))

const StyledProgress = styled(LinearProgress)<{ cups: number }>(({ cups }) => {
  const color = COFFEE_COLORS[Math.min(cups, 10)] || COFFEE_COLORS[0]
  return {
    height: '20px',
    borderRadius: '8px',
    backgroundColor: 'rgba(210, 105, 30, 0.1)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: color,
      transition: 'width 0.5s ease, background-color 0.3s ease',
      animation: cups > 0 ? `${pulse} 2s ease-in-out infinite` : 'none',
    },
  }
})

// Caffeine level messages
const CAFFEINE_MESSAGES = {
  0: "No coffee today? Feeling brave! ☕️",
  1: "Just one cup - nice and gentle! ☕",
  2: "Two cups - getting productive! ☕☕",
  3: "Three cups - in the zone! ☕☕☕",
  4: "Four cups - buzzing! ☕☕☕☕",
  5: "Five cups - eyes wide open! ☕☕☕☕☕",
  6: "Six cups - heart racing! ❤️‍🔥☕☕☕☕☕☕",
  7: "Seven cups - hands shaking! 🤲☕☕☕☕☕☕☕",
  8: "Eight cups - seeing double! 👀☕☕☕☕☕☕☕☕",
  9: "Nine cups - talking to walls! 🗣️☕☕☕☕☕☕☕☕☕",
  10: "TEN CUPS - CALL 911! 🚑☕☕☕☕☕☕☕☕☕☕",
}

interface CoffeeOMeterProps {
  cups: number
  showMessage?: boolean
}

export default function CoffeeOMeter({ cups, showMessage = true }: CoffeeOMeterProps) {
  const clampedCups = Math.max(0, Math.min(10, Math.round(cups)))
  const percentage = (clampedCups / 10) * 100

  // Generate coffee cup emojis
  const renderCoffeeCups = () => {
    const cupEmojis = []
    for (let i = 0; i < clampedCups; i++) {
      cupEmojis.push(
        <CoffeeCup 
          key={i} 
          cups={i + 1}
          size={24}
          style={{ margin: '0 2px' }}
        >
          ☕
        </CoffeeCup>
      )
    }
    // Add empty cups for remaining
    for (let i = clampedCups; i < 10; i++) {
      cupEmojis.push(
        <span 
          key={`empty-${i}`} 
          style={{ 
            display: 'inline-block',
            fontSize: '24px',
            color: '#E0E0E0',
            margin: '0 2px'
          }}
        >
          ☕
        </span>
      )
    }
    return cupEmojis
  }

  return (
    <CoffeePaper elevation={2} >
      <Box sx={{ textAlign: 'center' }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: '#8B4513',
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
          }}
        >
          Coffee-O-Meter
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
          gap: 1,
        }}>
          {renderCoffeeCups()}
        </Box>

        <ProgressContainer>
          <StyledProgress 
            variant="determinate" 
            value={percentage}
            cups={clampedCups}
          />
        </ProgressContainer>

        <Typography 
          variant="body2" 
          sx={{
            color: COFFEE_COLORS[clampedCups],
            fontWeight: 600,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            mt: 1,
          }}
        >
          {clampedCups} / 10 cups ({percentage}% caffeine power!)
        </Typography>

        {showMessage && clampedCups in CAFFEINE_MESSAGES && (
          <Typography 
            variant="caption" 
            sx={{
              color: '#8B4513',
              fontStyle: 'italic',
              mt: 1,
              display: 'block',
            }}
          >
            {CAFFEINE_MESSAGES[clampedCups]}
          </Typography>
        )}

        {/* Warning for high caffeine */}
        {clampedCups >= 6 && (
          <Typography 
            variant="caption" 
            sx={{
              color: '#D32F2F',
              fontWeight: 700,
              mt: 1,
              display: 'block',
            }}
          >
            {clampedCups >= 8 ? '⚠️  DANGER: Heart rate elevated!' : '⚠️  Caution: Getting jittery!'} 
          </Typography>
        )}
      </Box>
    </CoffeePaper>
  )
}
