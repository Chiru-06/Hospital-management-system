import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';

const PatientProfile: React.FC = () => {
  // Placeholder data; in a real app, fetch from API
  const patient = {
    name: 'John Doe',
    age: 32,
    gender: 'Male',
    email: 'john.doe@example.com',
    phone: '+91-9876543210',
    address: '123 Main St, City, India',
    appointments: [
      { date: '2025-07-01', doctor: 'Dr. Smith', reason: 'Checkup' },
      { date: '2025-06-15', doctor: 'Dr. Williams', reason: 'Lab Test' },
    ],
    prescriptions: [
      { date: '2025-07-01', doctor: 'Dr. Smith', medicine: 'Paracetamol', dosage: '500mg' },
    ],
    labTests: [
      { date: '2025-06-15', test: 'Blood Test', result: 'Normal' },
    ],
    billing: [
      { date: '2025-07-01', amount: 500, status: 'Paid' },
    ],
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary" mb={2}>
          My Profile
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><b>Name:</b> {patient.name}</Typography>
            <Typography variant="subtitle1"><b>Age:</b> {patient.age}</Typography>
            <Typography variant="subtitle1"><b>Gender:</b> {patient.gender}</Typography>
            <Typography variant="subtitle1"><b>Email:</b> {patient.email}</Typography>
            <Typography variant="subtitle1"><b>Phone:</b> {patient.phone}</Typography>
            <Typography variant="subtitle1"><b>Address:</b> {patient.address}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" color="primary" mb={1}>Appointment History</Typography>
        {patient.appointments.map((a, i) => (
          <Typography key={i} variant="body2">{a.date} - {a.doctor} ({a.reason})</Typography>
        ))}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" color="primary" mb={1}>Prescriptions</Typography>
        {patient.prescriptions.map((p, i) => (
          <Typography key={i} variant="body2">{p.date} - {p.doctor}: {p.medicine} ({p.dosage})</Typography>
        ))}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" color="primary" mb={1}>Lab Test Reports</Typography>
        {patient.labTests.map((l, i) => (
          <Typography key={i} variant="body2">{l.date} - {l.test}: {l.result}</Typography>
        ))}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" color="primary" mb={1}>Billing Summary</Typography>
        {patient.billing.map((b, i) => (
          <Typography key={i} variant="body2">{b.date} - ₹{b.amount} ({b.status})</Typography>
        ))}
      </Paper>
    </Box>
  );
};

export default PatientProfile;
