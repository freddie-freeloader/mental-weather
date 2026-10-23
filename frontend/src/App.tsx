import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Tabs, Tab, Box, Paper, styled } from '@mui/material';
import MorningCheckIn from './components/MorningCheckIn';
import EveningCheckIn from './components/EveningCheckIn';
import ExampleForm from './components/ExampleForm';
import AnimalDisplay from './components/AnimalDisplay';
import kawaiiTheme from './theme';

// Custom styled components for kawaii look
const KawaiiContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4F5 50%, #E0F7FA 100%)',
  minHeight: '100vh',
  paddingTop: '16px',
  paddingBottom: '32px',
  borderRadius: '0',
  position: 'relative',
  overflow: 'hidden',
}));

const TitleBox = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FFF0F5, #FFE4E9)',
  border: '3px solid #FFB6C1',
  borderRadius: '24px',
  padding: '24px',
  marginBottom: '24px',
  boxShadow: '0 8px 24px rgba(255, 182, 193, 0.3)',
  textAlign: 'center',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const TabsContainer = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.6)',
  borderRadius: '20px',
  padding: '12px',
  boxShadow: '0 4px 12px rgba(255, 182, 193, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid #FFE4E9',
}));

const TabPanelWrapper = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.4)',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 2px 8px rgba(255, 182, 193, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid #FFF0F5',
}));

// Custom theme with kawaii fonts
const customKawaiiTheme = {
  ...kawaiiTheme,
  typography: {
    ...kawaiiTheme.typography,
    fontFamily: ['"Comic Sans MS"', '"KaiTi"', 'cursive', 'sans-serif'].join(','),
  },
};

// Floating decoration elements
const CloudDecoration = styled('div')({
  position: 'fixed',
  opacity: 0.15,
  pointerEvents: 'none',
  zIndex: 0,
  fontSize: '8rem',
  userSelect: 'none',
});

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={customKawaiiTheme}>
      <CssBaseline />
      
      {/* Floating decorations */}
      <CloudDecoration style={{ top: '20%', left: '5%', transform: 'scale(0.8)' }}>☁️</CloudDecoration>
      <CloudDecoration style={{ top: '15%', right: '8%', transform: 'scale(1.2)' }}>☁️</CloudDecoration>
      <CloudDecoration style={{ bottom: '30%', left: '10%', transform: 'scale(0.6)' }}>🌸</CloudDecoration>
      <CloudDecoration style={{ bottom: '20%', right: '5%', transform: 'scale(0.9)' }}>✨</CloudDecoration>
      <CloudDecoration style={{ top: '50%', left: '2%', transform: 'scale(0.5)' }}>💖</CloudDecoration>
      <CloudDecoration style={{ top: '60%', right: '2%', transform: 'scale(0.5)' }}>🌈</CloudDecoration>
      
      <KawaiiContainer maxWidth="md">
        <TitleBox elevation={3}>
          <Typography 
            variant="h2" 
            sx={{
              fontWeight: 800,
              color: '#FF69B4',
              textShadow: '2px 2px 4px rgba(255, 105, 180, 0.2)',
              fontSize: '2.5rem',
              letterSpacing: '1px',
            }}
          >
            Ophelia's Mental Weather Log
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{
              color: '#FFB6C1',
              mt: 1,
              fontSize: '1.1rem',
              fontStyle: 'italic',
            }}
          >
            🌸 Discover your animal archetype today! 🌸
          </Typography>
        </TitleBox>

        <AnimalDisplay />

        <TabsContainer elevation={0}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            centered
            aria-label="check-in forms"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#FF69B4',
                height: '4px',
                borderRadius: '4px',
              },
            }}
          >
            <Tab 
              label="🌅 Morning Check-In" 
              id="tab-0" 
              aria-controls="tabpanel-0"
              sx={{
                fontWeight: 600,
                minHeight: '48px',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: '#FF69B4',
                  borderRadius: '12px',
                },
              }}
            />
            <Tab 
              label="🌙 Evening Check-In" 
              id="tab-1" 
              aria-controls="tabpanel-1"
              sx={{
                fontWeight: 600,
                minHeight: '48px',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: '#FF69B4',
                  borderRadius: '12px',
                },
              }}
            />
            <Tab 
              label="📝 Example Form" 
              id="tab-2" 
              aria-controls="tabpanel-2"
              sx={{
                fontWeight: 600,
                minHeight: '48px',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: '#FF69B4',
                  borderRadius: '12px',
                },
              }}
            />
          </Tabs>
        </TabsContainer>

        <TabPanelWrapper>
          <TabPanel value={currentTab} index={0}>
            <MorningCheckIn />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <EveningCheckIn />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <ExampleForm />
          </TabPanel>
        </TabPanelWrapper>
      </KawaiiContainer>
    </ThemeProvider>
  );
}
