import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const DoctorDashboard: React.FC = () => {
  const theme = useTheme();
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor={theme.palette.background.default}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 320, textAlign: 'center' }}>
        <Typography variant="h4" mb={2} color="primary">Doctor Dashboard</Typography>
        <Typography variant="body1">Welcome, Doctor!</Typography>
      </Paper>
    </Box>
  );
};

export default DoctorDashboard;
