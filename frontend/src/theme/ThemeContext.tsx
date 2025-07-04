import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as PaletteMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#FB7185', // Coral/Peach
        contrastText: '#fff',
      },
      secondary: {
        main: '#FBBF24', // Amber
        contrastText: '#111827',
      },
      background: {
        default: mode === 'light' ? '#FFF7ED' : '#1F2937', // Sunrise light or deep gray
        paper: mode === 'light' ? '#fff' : '#273449',
      },
      text: {
        primary: mode === 'dark' ? '#F9FAFB' : '#111827', // Soft white or deep gray
        secondary: mode === 'dark' ? '#FBBF24' : '#FB7185', // Amber or Coral for highlights
      },
      error: {
        main: '#FB7185',
      },
      warning: {
        main: '#FBBF24',
      },
      success: {
        main: '#10B981',
      },
      info: {
        main: '#38BDF8',
      },
    },
    typography: {
      fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 700 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 700,
            boxShadow: 'none',
            color: '#fff',
            backgroundColor: '#FB7185',
            '&:hover': {
              backgroundColor: '#FBBF24',
              color: '#111827',
            },
          },
          containedSecondary: {
            color: '#111827',
            backgroundColor: '#FBBF24',
            '&:hover': {
              backgroundColor: '#FB7185',
              color: '#fff',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1F2937' : '#FB7185',
            color: '#fff',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light'
              ? '0 2px 8px rgba(251,113,133,0.08)'
              : '0 2px 8px rgba(251,191,36,0.12)',
            backgroundColor: mode === 'light' ? '#fff' : '#273449',
            color: mode === 'dark' ? '#F9FAFB' : '#111827',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#1F2937' : '#fff7ed',
            color: mode === 'dark' ? '#F9FAFB' : '#111827',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#273449' : '#fff',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? '#FBBF24' : '#FB7185',
            backgroundColor: mode === 'light' ? '#fff' : 'transparent',
            border: mode === 'light' ? '1.5px solid #FBBF24' : 'none',
            boxShadow: mode === 'light' ? '0px 2px 8px rgba(251,191,36,0.10)' : 'none',
            transition: 'background 0.2s, color 0.2s',
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? '#FBBF24' : '#FB7185',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? '#F9FAFB' : '#111827',
          },
        },
      },
    },
  });

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};