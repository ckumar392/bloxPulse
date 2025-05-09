import { createTheme } from '@mui/material/styles';

// Enhanced color palette with professional tones
const colors = {
  primary: '#2ECC71',
  primaryDark: '#005ea3',
  primaryLight: '#3399FF',
  white: '#FFFFFF',
  darkGray: '#333333',
  lightGray: '#F5F5F5',
  mediumGray: '#999999',
  accent1: '#8DC63F',
  accent1Dark: '#729f32',
  accent2: '#3399FF',
  error: '#FF6B6B',
  warning: '#F39C12',
  success: '#27AE60',
  background: '#F9FAFC',
  cardBg: 'rgba(255, 255, 255, 0.92)',
  borderColor: 'rgba(0, 0, 0, 0.05)',
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      light: colors.primaryLight,
    },
    secondary: {
      main: colors.accent1,
      dark: colors.accent1Dark,
    },
    error: {
      main: colors.error,
    },
    warning: {
      main: colors.warning,
    }, 
    success: {
      main: colors.success,
    },
    background: {
      default: colors.background,
      paper: colors.white,
    },
    text: {
      primary: colors.darkGray,
      secondary: colors.mediumGray,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0, 114, 198, 0.15)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${colors.primary} 30%, ${colors.primaryLight} 90%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.primaryDark} 30%, ${colors.primary} 90%)`,
          }
        },
        containedSecondary: {
          background: `linear-gradient(45deg, ${colors.accent1} 30%, ${colors.accent2} 90%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.accent1Dark} 30%, ${colors.accent1} 90%)`,
          }
        },
        outlined: {
          borderWidth: '1.5px',
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 16px 48px rgba(0, 114, 198, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }
      }
    }
  },
  shape: {
    borderRadius: 8,
  },
});

// Export both the theme and colors for use throughout the app
export { theme, colors };