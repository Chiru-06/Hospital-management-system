import React, { useState } from 'react';
import { Paper, Box, Typography, useTheme, keyframes } from '@mui/material';
import './RoleBasedLogin.css';
import logo from '../../assets/logo1.png';

// Animation keyframes
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: none; }
`;
const shake = keyframes`
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-8px); }
  40%, 60% { transform: translateX(8px); }
`;

const USERS = [
  { username: 'admin', password: '123', role: 'admin' },
  { username: 'doctor', password: '123', role: 'doctor' },
  { username: 'manager', password: '123', role: 'manager' },
  { username: 'patient', password: '123', role: 'patient' },
];

const SUNRISE = {
  primary: '#FB7185', // Coral/Peach
  secondary: '#FBBF24', // Amber
  bgLight: '#FFF7ED', // Soft warm background
  bgDark: '#1F2937', // Deep gray for dark mode
  textLight: '#111827', // Deep gray for light mode text
  textDark: '#F9FAFB', // Soft white for dark mode text
};

const colorVariants = [
  '#1976d2', // blue
  '#dc004e', // pink
  '#388e3c', // green
  '#fbc02d', // yellow
  '#7b1fa2', // purple
];

const RoleBasedLogin: React.FC<{ onLogin: (role: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [colorIdx, setColorIdx] = useState(0);
  const [shakeError, setShakeError] = useState(false);
  const theme = useTheme();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
      setError('');
      setShakeError(false);
      onLogin(user.role);
    } else {
      setError('Invalid credentials');
      setColorIdx((prev) => (prev + 1) % colorVariants.length); // Change color on error
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
    }
  };

  const accentColor = colorVariants[colorIdx];
  const bgColor = theme.palette.mode === 'dark' ? SUNRISE.bgDark : SUNRISE.bgLight;
  const cardBg = theme.palette.mode === 'dark' ? '#232b36' : '#fff';
  const cardText = theme.palette.mode === 'dark' ? SUNRISE.textDark : SUNRISE.textLight;

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ bgcolor: bgColor, width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1300, fontFamily: 'Montserrat, Roboto, Arial, sans-serif' }}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Box component="img" src={logo} alt="HopeSpring Hospital Logo" sx={{ height: 64, width: 64, mb: 1 }} />
        <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: 1, color: cardText, mb: 1 }}>
          HopeSpring Hospital
        </Typography>
      </Box>
      <Paper elevation={6} sx={{
        p: 4,
        minWidth: 340,
        bgcolor: cardBg,
        background: `linear-gradient(135deg, ${accentColor}22 0%, ${cardBg} 100%)`,
        transition: 'background 0.3s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: `2px solid ${accentColor}`,
        boxShadow: `0 4px 32px 0 ${accentColor}44`,
        animation: `${fadeInUp} 0.8s cubic-bezier(0.4,0,0.2,1)`,
        borderRadius: 4,
      }}>
        <form className="login-form" onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" align="center" mb={2} sx={{ color: accentColor, fontFamily: 'Montserrat, Roboto, Arial, sans-serif', fontWeight: 700, letterSpacing: 1 }}>
            Hospital Login
          </Typography>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ fontFamily: 'Montserrat, Roboto, Arial, sans-serif', background: bgColor, color: cardText, border: `1.5px solid ${accentColor}`, width: '100%', marginBottom: 18, padding: 12, borderRadius: 8, fontSize: 16, outline: 'none', transition: 'border 0.2s' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ fontFamily: 'Montserrat, Roboto, Arial, sans-serif', background: bgColor, color: cardText, border: `1.5px solid ${accentColor}`, width: '100%', marginBottom: 18, padding: 12, borderRadius: 8, fontSize: 16, outline: 'none', transition: 'border 0.2s' }}
          />
          {error && (
            <div className="login-error" style={{ color: accentColor, marginBottom: 16, fontWeight: 600, animation: shakeError ? `${shake} 0.6s` : undefined }}>{error}</div>
          )}
          <button type="submit" style={{ background: accentColor, color: '#fff', fontFamily: 'Montserrat, Roboto, Arial, sans-serif', width: '100%', padding: 12, borderRadius: 8, fontWeight: 700, fontSize: 17, border: 'none', cursor: 'pointer', boxShadow: `0 2px 8px 0 ${accentColor}33`, transition: 'background 0.2s', animation: `${fadeInUp} 0.7s 0.5s cubic-bezier(0.4,0,0.2,1) both` }}>
            Login
          </button>
        </form>
        <Box sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
          <Typography variant="body2" sx={{ color: accentColor, fontWeight: 500, fontFamily: 'Montserrat, Roboto, Arial, sans-serif' }}>
            New here?{' '}
            <span
              style={{ color: accentColor, cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
              onClick={() => window.location.href = '/register'}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { window.location.href = '/register'; } }}
            >
              Register as a Patient
            </span>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RoleBasedLogin;
