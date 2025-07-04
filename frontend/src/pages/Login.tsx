import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton, InputAdornment } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SUNRISE = {
  primary: '#FB7185',
  secondary: '#FBBF24',
  bgLight: '#FFF7ED',
  bgDark: '#1F2937',
  textLight: '#111827',
  textDark: '#F9FAFB',
};

const Login = (): React.ReactElement => {
  const { mode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const bgColor = mode === 'dark' ? SUNRISE.bgDark : SUNRISE.bgLight;
  const cardBg = mode === 'dark' ? '#232b36' : '#fff';
  const buttonBg = SUNRISE.primary;
  const buttonText = '#fff';
  const buttonHover = mode === 'dark' ? '#f43f5e' : '#fb7185cc';
  const inputBg = mode === 'dark' ? '#273449' : '#fff';
  const inputText = mode === 'dark' ? SUNRISE.textDark : SUNRISE.textLight;
  const borderColor = mode === 'dark' ? 'rgba(251,113,133,0.4)' : 'rgba(251,113,133,0.5)';
  const shadow = mode === 'dark'
    ? '0 0 0 3px rgba(251,113,133,0.15), 0 2px 16px 0 rgba(31,41,55,0.25)'
    : '0 0 0 3px rgba(251,113,133,0.10), 0 2px 16px 0 rgba(251,113,133,0.08)';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Roboto, Arial, sans-serif' }}>
      <Box
        sx={{
          borderRadius: 3,
          boxShadow: shadow,
          border: `2px solid ${borderColor}`,
          p: { xs: 2, sm: 3 },
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minWidth: 340, maxWidth: 400, width: '100%',
          bgcolor: 'transparent'
        }}
      >
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, bgcolor: cardBg, width: '100%' }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3, color: SUNRISE.primary, textAlign: 'center', letterSpacing: 1 }}>
            Hospital Login
          </Typography>
          <form>
            <TextField
              label="Username"
              type="text"
              fullWidth
              required
              variant="outlined"
              sx={{ mb: 3, bgcolor: inputBg, input: { color: inputText }, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputLabelProps={{ style: { color: '#9ca3af', fontWeight: 500 } }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              variant="outlined"
              sx={{ mb: 3, bgcolor: inputBg, input: { color: inputText }, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputLabelProps={{ style: { color: '#9ca3af', fontWeight: 500 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 1, bgcolor: buttonBg, color: buttonText, fontWeight: 700, borderRadius: 2, py: 1.2, fontSize: 18, boxShadow: 2, '&:hover': { bgcolor: buttonHover } }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
