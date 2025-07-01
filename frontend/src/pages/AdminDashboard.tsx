import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor={theme.palette.background.default}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 320, textAlign: 'center' }}>
        <Typography variant="h4" mb={2} color="primary">Admin Dashboard</Typography>
        <Typography variant="body1">Welcome, Admin!</Typography>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
