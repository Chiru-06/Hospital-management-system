import { Theme as MuiTheme, ThemeOptions as MuiThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme extends MuiTheme {
    // Add custom theme properties here if needed
  }
  interface ThemeOptions extends MuiThemeOptions {
    // Add custom theme options here if needed
  }
} 