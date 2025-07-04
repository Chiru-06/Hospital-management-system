import React, { useState } from 'react';
import { Paper, Box, Typography, useTheme, keyframes } from '@mui/material';
import './RoleBasedLogin.css';

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

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ bgcolor: theme.palette.background.default, width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1300 }}>
      <Paper elevation={6} sx={{
        p: 4,
        minWidth: 340,
        background: `linear-gradient(135deg, ${accentColor}22 0%, ${theme.palette.background.paper} 100%)`,
        transition: 'background 0.3s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: `2px solid ${accentColor}`,
        boxShadow: `0 4px 32px 0 ${accentColor}44`,
        animation: `${fadeInUp} 0.8s cubic-bezier(0.4,0,0.2,1)`,
      }}>
        <form className="login-form" onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" align="center" mb={2} sx={{ color: accentColor, fontFamily: theme.typography.fontFamily, fontWeight: 700, letterSpacing: 1 }}>
            Hospital Login
          </Typography>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ fontFamily: theme.typography.fontFamily, background: theme.palette.background.default, color: theme.palette.text.primary, border: `1.5px solid ${accentColor}`, width: '100%', marginBottom: 18, padding: 12, borderRadius: 6, fontSize: 16, outline: 'none', transition: 'border 0.2s' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ fontFamily: theme.typography.fontFamily, background: theme.palette.background.default, color: theme.palette.text.primary, border: `1.5px solid ${accentColor}`, width: '100%', marginBottom: 18, padding: 12, borderRadius: 6, fontSize: 16, outline: 'none', transition: 'border 0.2s' }}
          />
          {error && (
            <div className="login-error" style={{ color: accentColor, marginBottom: 16, fontWeight: 600, animation: shakeError ? `${shake} 0.6s` : undefined }}>{error}</div>
          )}
          <button type="submit" style={{ background: accentColor, color: '#fff', fontFamily: theme.typography.fontFamily, width: '100%', padding: 12, borderRadius: 6, fontWeight: 700, fontSize: 17, border: 'none', cursor: 'pointer', boxShadow: `0 2px 8px 0 ${accentColor}33`, transition: 'background 0.2s', animation: `${fadeInUp} 0.7s 0.5s cubic-bezier(0.4,0,0.2,1) both` }}>
            Login
          </button>
        </form>
      </Paper>
    </Box>
  );
};

export default RoleBasedLogin;
