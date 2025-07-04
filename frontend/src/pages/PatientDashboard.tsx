import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import api from '../api/axios';

const PatientDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    // Fetch upcoming appointments for the patient
    api.get(`/appointments?upcoming=true&patient=${userId}`).then(res => setAppointments(res.data)).catch(() => setAppointments([]));
    // Fetch recent prescriptions for the patient
    api.get(`/prescriptions/patient/${userId}`).then(res => setPrescriptions(res.data)).catch(() => setPrescriptions([]));
    // Fetch lab test results for the patient
    api.get(`/lab-tests?patient=${userId}`).then(res => setLabTests(res.data)).catch(() => setLabTests([]));
    // Fetch billing summary for the patient
    api.get(`/billing`).then(res => setBills(res.data.filter((b: any) => b.patient_id === userId))).catch(() => setBills([]));
  }, [userId]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
        gap: 4,
        width: '100%',
        mt: 4,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Paper sx={{ minWidth: 280, maxWidth: 400, p: 3, borderRadius: 3, background: '#2d3748', color: '#fff', boxShadow: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', width: '100%' }}>Upcoming Appointments</Typography>
        <List dense sx={{ width: '100%', textAlign: 'center', alignItems: 'center', p: 0 }}>
          {appointments.length === 0 ? (
            <ListItem sx={{ justifyContent: 'center' }}><ListItemText primary="No upcoming appointments." sx={{ textAlign: 'center' }} /></ListItem>
          ) : appointments.map((appt, idx) => (
            <ListItem key={idx} sx={{ justifyContent: 'center' }}><ListItemText primary={`With Dr. ${appt.doctor_name} on ${appt.date} at ${appt.time}`} sx={{ textAlign: 'center' }} /></ListItem>
          ))}
        </List>
      </Paper>
      <Paper sx={{ minWidth: 280, maxWidth: 400, p: 3, borderRadius: 3, background: '#2d3748', color: '#fff', boxShadow: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', width: '100%' }}>Recent Prescriptions</Typography>
        <List dense sx={{ width: '100%', textAlign: 'center', alignItems: 'center', p: 0 }}>
          {prescriptions.length === 0 ? (
            <ListItem sx={{ justifyContent: 'center' }}><ListItemText primary="No recent prescriptions." sx={{ textAlign: 'center' }} /></ListItem>
          ) : prescriptions.slice(0, 3).map((pres, idx) => (
            <ListItem key={idx} sx={{ justifyContent: 'center' }}><ListItemText primary={`Diagnosis: ${pres.diagnosis} (${pres.created_at?.slice(0,10)})`} sx={{ textAlign: 'center' }} /></ListItem>
          ))}
        </List>
      </Paper>
      <Paper sx={{ minWidth: 280, maxWidth: 400, p: 3, borderRadius: 3, background: '#2d3748', color: '#fff', boxShadow: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', width: '100%' }}>Lab Test Results</Typography>
        <List dense sx={{ width: '100%', textAlign: 'center', alignItems: 'center', p: 0 }}>
          {labTests.length === 0 ? (
            <ListItem sx={{ justifyContent: 'center' }}><ListItemText primary="No lab test results." sx={{ textAlign: 'center' }} /></ListItem>
          ) : labTests.slice(0, 3).map((test, idx) => (
            <ListItem key={idx} sx={{ justifyContent: 'center' }}><ListItemText primary={`${test.test_name}: ${test.result || 'Pending'}`} sx={{ textAlign: 'center' }} /></ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2, bgcolor: '#374151' }} />
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', width: '100%' }}>Billing Summary</Typography>
        <List dense sx={{ width: '100%', textAlign: 'center', alignItems: 'center', p: 0 }}>
          {bills.length === 0 ? (
            <ListItem sx={{ justifyContent: 'center' }}><ListItemText primary="No bills yet." sx={{ textAlign: 'center' }} /></ListItem>
          ) : bills.slice(0, 3).map((bill, idx) => (
            <ListItem key={idx} sx={{ justifyContent: 'center' }}><ListItemText primary={`Amount: ₹${bill.total_amount} | Status: ${bill.payment_status}`} sx={{ textAlign: 'center' }} /></ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default PatientDashboard;
