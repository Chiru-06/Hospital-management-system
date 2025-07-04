import React from 'react';
import { Box, Typography, Paper, Container, Grid } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

const SUNRISE = {
  primary: '#FB7185',
  secondary: '#FBBF24',
  bgLight: '#FFF7ED',
  bgDark: '#1F2937',
  textLight: '#111827',
  textDark: '#F9FAFB',
};

const aboutContent = [
  {
    title: 'Our Mission',
    desc: 'HopeSpring Hospital is dedicated to providing world-class healthcare with compassion, innovation, and excellence. We empower our community to live healthier, happier lives.',
  },
  {
    title: 'Comprehensive Services',
    desc: 'We offer advanced diagnostics, surgical procedures, emergency care, preventive health programs, and more—all delivered by a team of highly qualified professionals.',
  },
  {
    title: 'Patient-Centered Care',
    desc: 'Every patient receives personalized care in a safe, modern environment. Your health is our priority.',
  },
];

const About = () => {
  const { mode } = useTheme();
  const bgColor = mode === 'dark' ? SUNRISE.bgDark : SUNRISE.bgLight;
  const cardBg = mode === 'dark' ? '#232b36' : '#fff';
  const cardText = mode === 'dark' ? SUNRISE.textDark : SUNRISE.textLight;

  return (
    <Box
      sx={{
        bgcolor: bgColor,
        minHeight: '100vh',
        py: 8,
        fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            bgcolor: cardBg,
          }}
        >
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              color: SUNRISE.primary,
              mb: 3,
              textAlign: 'center',
              letterSpacing: 1,
            }}
          >
            About HopeSpring Hospital
          </Typography>
          <Grid container spacing={4}>
            {aboutContent.map((item) => (
              <Grid item xs={12} sm={4} key={item.title}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    color: SUNRISE.secondary,
                    mb: 1,
                    textAlign: 'center',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: cardText,
                    fontSize: 17,
                    textAlign: 'center',
                  }}
                >
                  {item.desc}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
