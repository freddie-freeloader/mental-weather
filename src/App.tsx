import { lazy, Suspense, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Tabs, Tab, Box, Paper, styled } from '@mui/material';
import MorningCheckIn from './components/MorningCheckIn';
import EveningCheckIn from './components/EveningCheckIn';
const History = lazy(() => import('./components/History'));
import AnimalDisplay from './components/AnimalDisplay';
import kawaiiTheme from './theme';

// Custom styled components for kawaii look
const KawaiiContainer = styled(Container)(() => ({
  background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4F5 50%, #E0F7FA 100%)',
  minHeight: '100vh',
  paddingTop: '8px',
  paddingBottom: '24px',
  borderRadius: '0',
  position: 'relative',
  overflow: 'hidden',
}));

const TitleBox = styled(Paper)(() => ({
  background: 'linear-gradient(135deg, #FFF0F5, #FFE4E9)',
  border: '3px solid #FFB6C1',
  borderRadius: '24px',
  padding: 'clamp(12px, 4vw, 24px)',
  marginBottom: '16px',
  boxShadow: '0 8px 24px rgba(255, 182, 193, 0.3)',
  textAlign: 'center',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const TabsContainer = styled(Paper)(() => ({
  background: 'rgba(255, 255, 255, 0.6)',
  borderRadius: '20px',
  padding: '8px',
  marginBottom: '12px',
  boxShadow: '0 4px 12px rgba(255, 182, 193, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid #FFE4E9',
}));

const TabPanelWrapper = styled(Box)(() => ({
  background: 'rgba(255, 255, 255, 0.4)',
  borderRadius: '20px',
  padding: 'clamp(8px, 3vw, 20px)',
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
  fontSize: 'clamp(3rem, 12vw, 8rem)',
  userSelect: 'none',
});

const TABS = [
  '🌅 Morning Check-In',
  '🌙 Evening Check-In',
  '🐾 My Animal',
  '📖 History',
];
const TAB_ANIMAL = 2;

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
  // mornings start on the morning form, afternoons on the evening one
  const [currentTab, setCurrentTab] = useState(() => (new Date().getHours() >= 16 ? 1 : 0));
  const [analysisKey, setAnalysisKey] = useState(0);

  const handleEveningSaved = () => {
    setAnalysisKey((k) => k + 1);
    setCurrentTab(TAB_ANIMAL);
    window.scrollTo({ top: 0 });
  };

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
      
      <KawaiiContainer maxWidth="md" sx={{ px: { xs: 1, sm: 3 } }}>
        <TitleBox elevation={3}>
          <Typography 
            variant="h2" 
            sx={{
              fontWeight: 800,
              color: '#FF69B4',
              textShadow: '2px 2px 4px rgba(255, 105, 180, 0.2)',
              fontSize: { xs: '1.7rem', sm: '2.5rem' },
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
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              fontStyle: 'italic',
            }}
          >
            🌸 Discover your animal archetype today! 🌸
          </Typography>
        </TitleBox>

        <TabsContainer elevation={0}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="check-in forms"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#FF69B4',
                height: '4px',
                borderRadius: '4px',
              },
            }}
          >
            {TABS.map((label, i) => (
              <Tab
                key={label}
                label={label}
                id={`tab-${i}`}
                aria-controls={`tabpanel-${i}`}
                sx={{
                  fontWeight: 600,
                  minHeight: '48px',
                  px: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#FF69B4',
                    borderRadius: '12px',
                  },
                }}
              />
            ))}
          </Tabs>
        </TabsContainer>

        <TabPanelWrapper>
          <TabPanel value={currentTab} index={0}>
            <MorningCheckIn />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <EveningCheckIn onSaved={handleEveningSaved} />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <div data-testid="animal-card">
              <AnimalDisplay refreshKey={analysisKey} />
            </div>
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            <Suspense fallback={null}>
              <History />
            </Suspense>
          </TabPanel>
        </TabPanelWrapper>
      </KawaiiContainer>
    </ThemeProvider>
  );
}
