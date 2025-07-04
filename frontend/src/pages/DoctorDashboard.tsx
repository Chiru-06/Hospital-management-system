import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import api from '../api/axios';

const DoctorDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    // Fetch today's appointments for the doctor
    api.get('/appointments?today=true&doctor=self').then(res => setAppointments(res.data)).catch(() => setAppointments([]));
    // Fetch assigned patients for the doctor
    api.get('/patients?doctor=self').then(res => setPatients(res.data)).catch(() => setPatients([]));
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 4,
        width: '100%',
        mt: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          minWidth: 300,
          maxWidth: 400,
          p: 3,
          borderRadius: 3,
          background: '#2d3748',
          color: '#fff',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Today's Appointments
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: '#374151' }} />
        <List dense>
          {appointments.length === 0 ? (
            <ListItem><ListItemText primary="No appointments for today." /></ListItem>
          ) : appointments.map((appt, idx) => (
            <ListItem key={idx}><ListItemText primary={`Patient: ${appt.patient_name} at ${appt.time}`} /></ListItem>
          ))}
        </List>
      </Paper>
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          minWidth: 300,
          maxWidth: 400,
          p: 3,
          borderRadius: 3,
          background: '#2d3748',
          color: '#fff',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Assigned Patients
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: '#374151' }} />
        <List dense>
          {patients.length === 0 ? (
            <ListItem><ListItemText primary="No assigned patients." /></ListItem>
          ) : patients.map((pat, idx) => (
            <ListItem key={idx}><ListItemText primary={`${pat.first_name} ${pat.last_name}`} /></ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default DoctorDashboard;
