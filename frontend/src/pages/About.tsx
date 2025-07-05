import React from 'react';
import { Box, Typography, Paper, Container, Grid, Button } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// import Lottie from 'lottie-react';
// import aboutLottie from '../assets/lottie/about-hospital.json'; // Optional Lottie asset

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
    icon: '❤️',
  },
  {
    title: 'Comprehensive Services',
    desc: 'We offer advanced diagnostics, surgical procedures, emergency care, preventive health programs, and more—all delivered by a team of highly qualified professionals.',
    icon: '🩺',
  },
  {
    title: 'Patient-Centered Care',
    desc: 'Every patient receives personalized care in a safe, modern environment. Your health is our priority.',
    icon: '🤝',
  },
];

const About = () => {
  const { mode } = useTheme();
  const bgColor = mode === 'dark' ? SUNRISE.bgDark : SUNRISE.bgLight;
  const cardBg = mode === 'dark' ? '#232b36' : '#fff';
  const cardText = mode === 'dark' ? SUNRISE.textDark : SUNRISE.textLight;
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: bgColor,
        minHeight: '100vh',
        py: 0,
        fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          minHeight: { xs: 260, md: 340 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: `linear-gradient(90deg, #fb7185 0%, #fbbf24 100%)`,
          position: 'relative',
          mb: 6,
        }}
      >
        {/* <Lottie animationData={aboutLottie} loop style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.2, zIndex: 0 }} /> */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ zIndex: 1, textAlign: 'center' }}
        >
          <Typography
            variant="h2"
            fontWeight={900}
            sx={{ color: '#fff', letterSpacing: 2, mb: 1 }}
          >
            HopeSpring Hospital
          </Typography>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ color: '#fff', mb: 2, fontStyle: 'italic' }}
          >
            Inspiring Hope
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#fff',
              color: SUNRISE.primary,
              fontWeight: 700,
              borderRadius: 3,
              px: 4,
              py: 1.5,
              boxShadow: 2,
              '&:hover': { bgcolor: SUNRISE.primary, color: '#fff' },
              mt: 1,
            }}
            onClick={() => navigate('/register')}
          >
            New here? Register as a Patient
          </Button>
        </motion.div>
      </Box>
      {/* About Content Cards */}
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              bgcolor: cardBg,
              boxShadow: '0 8px 32px rgba(251,113,133,0.08)',
            }}
          >
            <Grid container spacing={4}>
              {aboutContent.map((item) => (
                <Grid item xs={12} sm={4} key={item.title}>
                  <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <span style={{ fontSize: 38 }}>{item.icon}</span>
                  </Box>
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
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;
