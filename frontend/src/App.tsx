import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Tabs, Tab, Box } from '@mui/material';
import MorningCheckIn from './components/MorningCheckIn';
import EveningCheckIn from './components/EveningCheckIn';
import ExampleForm from './components/ExampleForm';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ py: 3, textAlign: 'center' }}>
          Ophelia's Mental Weather Log
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            centered
            aria-label="check-in forms"
          >
            <Tab label="Morning Check-In" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Evening Check-In" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="Example Form" id="tab-2" aria-controls="tabpanel-2" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <MorningCheckIn />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <EveningCheckIn />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <ExampleForm />
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}
