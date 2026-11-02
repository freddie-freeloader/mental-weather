import { useState, useEffect } from "react"
import { Box, Typography, Paper, styled } from "@mui/material"
import WasserOMeter from "./WasserOMeter"
import { getGlassCount } from "../wasser"

// Styled container for the Wasser tab
const WasserTabContainer = styled(Paper)(() => ({
  background: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  padding: 'clamp(8px, 3vw, 20px)',
  boxShadow: '0 2px 8px rgba(255, 182, 193, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid #FFF0F5',
}))

const HeaderBox = styled(Box)(() => ({
  textAlign: 'center',
  marginBottom: '16px',
}))

const StatsBox = styled(Paper)(() => ({
  background: 'linear-gradient(135deg, #FFF8F0, #FFE4F5)',
  border: '2px solid #FFB6C1',
  borderRadius: '16px',
  padding: '12px',
  marginBottom: '16px',
  boxShadow: '0 4px 12px rgba(255, 182, 193, 0.2)',
}))

export default function WasserTab() {
  const [todayCount, setTodayCount] = useState(() => getGlassCount())
  const [totalCount, setTotalCount] = useState(0)
  const [streak, setStreak] = useState(0)

  // Reload data when component mounts or count changes
  useEffect(() => {
    setTodayCount(getGlassCount())
    // Calculate some stats (simplified for now)
    calculateStats()
  }, [])

  const calculateStats = () => {
    // For now, just set some placeholder values
    // In a real implementation, you'd read from localStorage
    setTotalCount(157) // Placeholder
    setStreak(3) // Placeholder
  }

  const handleGlassAdded = () => {
    setTodayCount(getGlassCount())
  }

  const handleGlassRemoved = () => {
    setTodayCount(getGlassCount())
  }

  return (
    <WasserTabContainer>
      <HeaderBox>
        <Typography 
          variant="h5" 
          sx={{
            fontWeight: 700,
            color: '#FF69B4',
            fontSize: { xs: '1.2rem', sm: '1.4rem' },
          }}
        >
          💧 Edgar-o-Wasser Tracker 💧
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{
            color: '#FFB6C1',
            mt: 1,
            fontStyle: 'italic',
          }}
        >
          Track your daily water intake with cuteness!
        </Typography>
      </HeaderBox>

      {/* Main WasserOMeter component */}
      <WasserOMeter 
        onGlassAdded={handleGlassAdded}
        onGlassRemoved={handleGlassRemoved}
      />

      {/* Stats section */}
      <StatsBox elevation={2}>
        <Typography 
          variant="subtitle2" 
          sx={{
            color: '#FF69B4',
            fontWeight: 600,
            mb: 1,
          }}
        >
          📊 Hydration Stats
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FF86DB',
                fontWeight: 700,
              }}
            >
              {todayCount}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#FFB6C1',
                fontStyle: 'italic',
              }}
            >
              Today
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#A0D8FF',
                fontWeight: 700,
              }}
            >
              {totalCount}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#FFB6C1',
                fontStyle: 'italic',
              }}
            >
              Total
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FF99C9',
                fontWeight: 700,
              }}
            >
              {streak}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#FFB6C1',
                fontStyle: 'italic',
              }}
            >
              Day Streak
            </Typography>
          </Box>
        </Box>
      </StatsBox>

      {/* Tips section */}
      <Paper 
        elevation={2} 
        sx={{
          background: 'linear-gradient(135deg, #FFF0F5, #FFE4E9)',
          border: '2px solid #FFD1F2',
          borderRadius: '16px',
          padding: '12px',
          mt: 2,
          boxShadow: '0 4px 12px rgba(255, 182, 193, 0.2)',
        }}
      >
        <Typography 
          variant="body2" 
          sx={{
            color: '#FF69B4',
            fontWeight: 600,
            mb: 1,
          }}
        >
          💡 Hydration Tips:
        </Typography>
        <Typography 
          variant="caption" 
          sx={{
            color: '#8B4513',
            lineHeight: 1.5,
          }}
        >
          • Drink a glass of water first thing in the morning! 🌅
          <br />
          • Carry a cute water bottle everywhere! 💖
          <br />
          • Set reminders on your phone! 📱
          <br />
          • Add lemon or fruit for extra flavor! 🍋
        </Typography>
      </Paper>
    </WasserTabContainer>
  )
}
