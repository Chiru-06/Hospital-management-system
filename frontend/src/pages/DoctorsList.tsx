import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, Box, Avatar } from '@mui/material';
import api from '../api/axios';
import doctorImg from '../assets/doctor.jpg';

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    api.get('/doctors').then(res => setDoctors(res.data)).catch(() => setDoctors([]));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom align="center">Our Doctors</Typography>
      <Grid container spacing={4} justifyContent="center">
        {doctors.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ width: '100%', mt: 4 }}>No doctors found.</Typography>
        ) : (
          doctors.map((doc, idx) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id || idx}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: '#f9fafb', height: '100%' }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar src={doctorImg} alt="Doctor" sx={{ width: 64, height: 64, mb: 2 }} />
                    <Typography variant="h6" fontWeight={600}>{doc.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{doc.specialization}</Typography>
                    <Typography variant="body2" color="text.secondary">{doc.email}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default DoctorsList;
