import { createTheme } from '@mui/material/styles';

// Modern Moroccan-inspired color palette
const moroccanColors = {
  primary: {
    main: '#00695c', // Modern Moroccan teal
    light: '#26a69a',
    dark: '#004d40',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ff6f00', // Vibrant amber
    light: '#ffa040',
    dark: '#c43e00',
    contrastText: '#ffffff',
  },
  accent: {
    main: '#e91e63', // Modern pink accent
    light: '#ff6090',
    dark: '#b0003a',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    moroccan: 'linear-gradient(135deg, #00695c 0%, #26a69a 100%)',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  }
};

// Typography system with Arabic support
const typography = {
  fontFamily: [
    '"Noto Sans Arabic"',
    '"Roboto"',
    '"Helvetica"',
    '"Arial"',
    'sans-serif'
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.6,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
  },
};

// Custom shadows
const shadows = [
  'none',
  '0px 2px 4px rgba(0,0,0,0.1)',
  '0px 4px 8px rgba(0,0,0,0.12)',
  '0px 8px 16px rgba(0,0,0,0.14)',
  '0px 12px 24px rgba(0,0,0,0.16)',
  '0px 16px 32px rgba(0,0,0,0.18)',
  '0px 20px 40px rgba(0,0,0,0.20)',
  // ... extend as needed
];

// Create light theme
export const createCustomTheme = (mode = 'light', direction = 'ltr') => {
  const isLight = mode === 'light';
  
  return createTheme({
    direction,
    palette: {
      mode,
      primary: moroccanColors.primary,
      secondary: moroccanColors.secondary,
      background: {
        default: isLight ? '#fafafa' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: isLight ? '#212121' : '#ffffff',
        secondary: isLight ? '#757575' : '#b3b3b3',
      },
      divider: isLight ? '#e0e0e0' : '#333333',
      action: {
        hover: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
        selected: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)',
      },
      // Custom colors
      accent: moroccanColors.accent,
      neutral: moroccanColors.neutral,
    },
    typography,
    shadows: shadows.concat(Array(18).fill('none')), // Extend to 24 items
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            },
          },
          contained: {
            boxShadow: '0px 2px 8px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0px 2px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'all 0.3s ease',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: moroccanColors.primary.light,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: moroccanColors.primary.main,
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(8px)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 500,
          },
        },
      },
    },
  });
};

// Animation variants
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 }
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

export default createCustomTheme;
