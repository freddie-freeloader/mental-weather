import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography } from '@mui/material';
import ExampleForm from './components/ExampleForm';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography variant="h1">Hello World</Typography>
        <ExampleForm />
      </Container>
    </ThemeProvider>
  );
}
