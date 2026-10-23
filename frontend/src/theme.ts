import { createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material/styles';

// Kawaii pastel color palette
const pastelPalette = {
  // Primary pastel colors
  primary: {
    main: '#FFB6C1', // Light pink
    light: '#FFE4E9',
    dark: '#FF85A2',
    contrastText: '#333333',
  },
  
  // Secondary pastel colors
  secondary: {
    main: '#B5EAD7', // Mint green
    light: '#E8F8F5',
    dark: '#88D8B8',
    contrastText: '#333333',
  },
  
  // Additional pastel colors
  pastel: {
    lavender: '#E6E6FA',
    babyBlue: '#C7CEEA',
    peach: '#FFDAB9',
    lemon: '#FFF4C1',
    lilac: '#D8BFD8',
    coral: '#FF9966',
    sky: '#B0E0E6',
    cream: '#FFF8DC',
  },
  
  // Background colors
  background: {
    default: '#FFF8F0', // Very light cream
    paper: '#FFFFFF',
  },
  
  // Text colors
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
  },
};

// Custom shadows for kawaii softness
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      soft: string;
      medium: string;
      floating: string;
    };
  }
  interface ThemeOptions {
    customShadows?: {
      soft?: string;
      medium?: string;
      floating?: string;
    };
  }
}

// Create kawaii theme
const kawaiiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: pastelPalette.primary,
    secondary: pastelPalette.secondary,
    background: pastelPalette.background,
    text: pastelPalette.text,
    // Custom pastel colors for components
    info: {
      main: pastelPalette.pastel.babyBlue,
      light: pastelPalette.pastel.sky,
      dark: '#87CEEB',
      contrastText: '#333333',
    },
    success: {
      main: pastelPalette.secondary.main,
      light: pastelPalette.secondary.light,
      dark: pastelPalette.secondary.dark,
      contrastText: '#333333',
    },
    warning: {
      main: pastelPalette.pastel.peach,
      light: '#FFE5B4',
      dark: '#FFB347',
      contrastText: '#333333',
    },
    error: {
      main: pastelPalette.pastel.coral,
      light: '#FFCCAA',
      dark: '#FF6600',
      contrastText: '#333333',
    },
    // Override divider
    divider: '#FFE4E9',
  },
  
  customShadows: {
    soft: '0 2px 8px rgba(255, 182, 193, 0.15)',
    medium: '0 4px 12px rgba(255, 182, 193, 0.2)',
    floating: '0 8px 24px rgba(255, 182, 193, 0.25)',
  },
  
  typography: {
    fontFamily: ['"Comic Sans MS"', 'cursive', 'sans-serif'].join(','),
    h1: {
      fontWeight: 700,
      color: pastelPalette.primary.dark,
    },
    h2: {
      fontWeight: 600,
      color: pastelPalette.primary.dark,
    },
    h3: {
      fontWeight: 600,
      color: pastelPalette.primary.main,
    },
    h4: {
      fontWeight: 600,
      color: pastelPalette.secondary.dark,
    },
    h5: {
      fontWeight: 600,
      color: pastelPalette.secondary.main,
    },
    h6: {
      fontWeight: 500,
      color: pastelPalette.text.secondary,
    },
    body1: {
      color: pastelPalette.text.primary,
    },
    body2: {
      color: pastelPalette.text.secondary,
    },
    button: {
      fontWeight: 600,
    },
    subtitle1: {
      color: pastelPalette.primary.dark,
    },
    subtitle2: {
      color: pastelPalette.secondary.dark,
    },
  },
  
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: pastelPalette.background.paper,
          boxShadow: '0 2px 12px rgba(255, 182, 193, 0.15)',
          borderRadius: '16px',
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          border: `1px solid ${pastelPalette.primary.light}`,
        },
      },
    },
    
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(255, 182, 193, 0.3)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          backgroundColor: pastelPalette.primary.main,
          color: pastelPalette.text.primary,
          '&:hover': {
            backgroundColor: pastelPalette.primary.dark,
          },
        },
        containedSecondary: {
          backgroundColor: pastelPalette.secondary.main,
          color: pastelPalette.text.primary,
          '&:hover': {
            backgroundColor: pastelPalette.secondary.dark,
          },
        },
        outlined: {
          borderColor: pastelPalette.primary.main,
          color: pastelPalette.primary.main,
          '&:hover': {
            borderColor: pastelPalette.primary.dark,
            backgroundColor: 'rgba(255, 182, 193, 0.1)',
          },
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: pastelPalette.pastel.lavender,
          borderRadius: '12px',
          padding: '8px',
        },
        indicator: {
          backgroundColor: pastelPalette.primary.main,
          height: '4px',
          borderRadius: '2px',
        },
      },
    },
    
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          minHeight: '48px',
          fontWeight: 500,
          '&.Mui-selected': {
            backgroundColor: pastelPalette.background.paper,
            color: pastelPalette.primary.dark,
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
        },
      },
    },
    
    MuiSlider: {
      styleOverrides: {
        root: {
          color: pastelPalette.primary.main,
        },
        thumb: {
          width: 24,
          height: 24,
          backgroundColor: pastelPalette.primary.main,
          border: `2px solid ${pastelPalette.background.paper}`,
          boxShadow: '0 2px 8px rgba(255, 182, 193, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255, 182, 193, 0.4)',
          },
          '&.Mui-active': {
            boxShadow: '0 6px 16px rgba(255, 182, 193, 0.5)',
          },
        },
        track: {
          height: 8,
          borderRadius: 4,
        },
        rail: {
          height: 8,
          borderRadius: 4,
          backgroundColor: pastelPalette.pastel.lavender,
        },
        valueLabel: {
          backgroundColor: pastelPalette.primary.main,
          color: pastelPalette.text.primary,
          borderRadius: '8px',
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            borderColor: pastelPalette.primary.light,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: pastelPalette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: pastelPalette.primary.dark,
              borderWidth: 2,
            },
          },
        },
      },
    },
    
    MuiSnackbar: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundColor: pastelPalette.primary.main,
          color: pastelPalette.text.primary,
        },
      },
    },
    
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: pastelPalette.primary.light,
          height: 2,
        },
      },
    },
    
    MuiContainer: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${pastelPalette.pastel.cream} 0%, ${pastelPalette.pastel.lavender} 50%, ${pastelPalette.pastel.lemon} 100%)`,
          minHeight: '100vh',
          paddingTop: '20px',
          paddingBottom: '20px',
        },
      },
    },
  },
});

export default kawaiiTheme;
