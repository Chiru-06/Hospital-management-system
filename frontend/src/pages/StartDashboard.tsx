import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const StartDashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor={theme.palette.background.default}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 320, textAlign: 'center' }}>
        <Typography variant="h4" mb={2} color="primary">Hospital Management System</Typography>
        <Typography variant="body1" mb={3}>Welcome! Please log in to continue.</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default StartDashboard;
