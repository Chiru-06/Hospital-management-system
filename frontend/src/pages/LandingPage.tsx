import React from 'react';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  Link as MuiLink,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import logo from '../assets/logo1.png';
import FullScreenImageCarousel from '../components/FullScreenImageCarousel';

// Declare lottie-player as a custom element for TypeScript
// (Place this after all imports)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { src: string; background?: string; speed?: string; loop?: boolean; autoplay?: boolean; style?: React.CSSProperties };
    }
  }
}

// SUNRISE THEME COLORS
const SUNRISE = {
  primary: '#FB7185', // Coral/Peach
  secondary: '#FBBF24', // Amber
  bgLight: '#FFF7ED', // Soft warm background
  bgDark: '#1F2937', // Deep gray for dark mode
  textLight: '#111827', // Deep gray for light mode text
  textDark: '#F9FAFB', // Soft white for dark mode text
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();

  // Dynamic colors for Sunrise Theme
  const bgColor = mode === 'dark' ? SUNRISE.bgDark : SUNRISE.bgLight;
  const appBarColor = mode === 'dark' ? SUNRISE.bgDark : SUNRISE.primary;
  const cardBg = mode === 'dark' ? '#232b36' : '#fff';
  const cardText = mode === 'dark' ? SUNRISE.textDark : SUNRISE.textLight;
  const cardDesc = mode === 'dark' ? '#E5E7EB' : '#6B7280';
  const heroTitle = mode === 'dark' ? SUNRISE.textDark : SUNRISE.textLight;
  const heroSub = mode === 'dark' ? SUNRISE.secondary : SUNRISE.primary;
  const footerBg = mode === 'dark' ? SUNRISE.bgDark : SUNRISE.primary;
  const footerText = mode === 'dark' ? '#E5E7EB' : '#fff';
  const buttonText = mode === 'dark' ? SUNRISE.textDark : '#fff';
  const buttonBg = SUNRISE.primary;
  const buttonHover = mode === 'dark' ? '#f43f5e' : '#fb7185cc';
  const toggleBg = mode === 'light' ? '#fff' : 'transparent';
  const toggleColor = mode === 'light' ? SUNRISE.textLight : SUNRISE.primary;
  const toggleBorder = mode === 'light' ? '1.5px solid #fbbf24' : 'none';

  return (
    <Box sx={{ fontFamily: 'Montserrat, Roboto, Arial, sans-serif', bgcolor: bgColor, minHeight: '100vh' }}>
      {/* Header/Navbar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: appBarColor, color: mode === 'dark' ? SUNRISE.textDark : '#fff' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '64px', px: 0 }}>
            <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate('/') }>
              <Box component="img" src={logo} alt="HopeSpring Hospital Logo" sx={{ height: 48, width: 48, mr: 1 }} />
              <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: 1, color: mode === 'dark' ? SUNRISE.textDark : '#fff' }}>
                HopeSpring Hospital
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
              <MuiLink component="a" underline="none" color="inherit" href="/" sx={{ fontWeight: 500, color: mode === 'dark' ? SUNRISE.textDark : SUNRISE.textLight, display: 'flex', alignItems: 'center', height: '64px', px: 2 }}>
                Home
              </MuiLink>
              <MuiLink component="a" underline="none" color="inherit" href="/about" sx={{ fontWeight: 500, color: mode === 'dark' ? SUNRISE.textDark : SUNRISE.textLight, display: 'flex', alignItems: 'center', height: '64px', px: 2 }}>
                About
              </MuiLink>
              <MuiLink href="#contact" underline="none" color="inherit" sx={{ fontWeight: 500, color: mode === 'dark' ? SUNRISE.textDark : SUNRISE.textLight, display: 'flex', alignItems: 'center', height: '64px', px: 2 }}>
                Contact
              </MuiLink>
              <Button
                variant="contained"
                sx={{ ml: 2, borderRadius: 3, fontWeight: 700, boxShadow: 2, bgcolor: buttonBg, color: buttonText, px: 3, height: '48px', display: 'flex', alignItems: 'center', '&:hover': { bgcolor: buttonHover } }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <IconButton
                onClick={toggleTheme}
                sx={{ ml: 1, bgcolor: toggleBg, color: toggleColor, border: toggleBorder, boxShadow: mode === 'light' ? 2 : 'none', transition: 'background 0.2s, color 0.2s', height: '48px', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:hover': { bgcolor: mode === 'light' ? '#ffe4e6' : '#374151' } }}
                aria-label="Toggle theme"
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton color="inherit">
                {/* MenuIcon can be re-added here if you want a mobile menu */}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Image Carousel Section - now below topbar */}
      <Box sx={{ width: '100vw', maxWidth: '100%', mb: 8, px: 0, mt: 0 }}>
        <FullScreenImageCarousel />
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 10 }, mb: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h3" fontWeight={900} gutterBottom sx={{ fontSize: { xs: 32, md: 44 }, color: heroTitle, letterSpacing: 1, textShadow: '0 2px 16px #fb718555' }}>
                <span style={{ display: 'inline-block', position: 'relative' }}>
                  Your Health, Our Priority
                  <span style={{ position: 'absolute', left: 0, bottom: -8, width: '100%', height: 6, background: 'linear-gradient(90deg,#fb7185,#fbbf24)', borderRadius: 3, opacity: 0.3 }} />
                </span>
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 500, color: heroSub }}>
                HopeSpring Hospital empowers hospitals and clinics with seamless appointment management, secure records, and expert care.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ px: 5, py: 1.5, borderRadius: 3, fontWeight: 700, fontSize: 20, boxShadow: 3, bgcolor: buttonBg, color: buttonText, '&:hover': { bgcolor: buttonHover, transform: 'scale(1.08)' }, transition: 'transform 0.2s' }}
                onClick={() => navigate('/login')}
              >
                Book Appointment
              </Button>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Lottie hospital animation in hero */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <lottie-player
                  src={require('../assets/hospital.json')}
                  background="transparent"
                  speed="1"
                  style={{ width: '320px', height: '320px', margin: '0 auto', maxWidth: '100%' }}
                  loop
                  autoplay
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Feature 1: Appointment Scheduling (medical-lottie.json) */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <Card elevation={3} sx={{ borderRadius: 4, p: 2, minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: cardBg, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8, cursor: 'pointer', transform: 'scale(1.03)' } }}
                onClick={() => navigate('/login')}
                tabIndex={0}
                role="button"
                aria-label="Go to Appointment Scheduling"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { navigate('/login'); } }}
              >
                <Box mb={1} mt={1} sx={{ fontSize: 36, textAlign: 'center' }}>🗓️</Box>
                <Box mb={2}>
                  <lottie-player
                    src={require('../assets/medical-lottie.json')}
                    background="transparent"
                    speed="1"
                    style={{ width: '80px', height: '80px' }}
                    loop
                    autoplay
                  />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: cardText }}>
                  Appointment Scheduling
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, textAlign: 'center', color: cardDesc }}>
                  Book, manage, and track appointments with ease.
                </Typography>
              </Card>
            </motion.div>
          </Grid>
          {/* Feature 2: Medical Records (doctor.json) */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Card elevation={3} sx={{ borderRadius: 4, p: 2, minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: cardBg, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8, cursor: 'pointer', transform: 'scale(1.03)' } }}
                onClick={() => navigate('/login')}
                tabIndex={0}
                role="button"
                aria-label="Go to Medical Records"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { navigate('/login'); } }}
              >
                <Box mb={1} mt={1} sx={{ fontSize: 36, textAlign: 'center' }}>📋</Box>
                <Box mb={2}>
                  <lottie-player
                    src={require('../assets/doctor.json')}
                    background="transparent"
                    speed="1"
                    style={{ width: '80px', height: '80px' }}
                    loop
                    autoplay
                  />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: cardText }}>
                  Medical Records
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, textAlign: 'center', color: cardDesc }}>
                  Access and update patient records securely anytime.
                </Typography>
              </Card>
            </motion.div>
          </Grid>
          {/* Feature 3: Qualified Doctors (doctor.json) */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Card
                elevation={3}
                sx={{ borderRadius: 4, p: 2, minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: cardBg, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8, cursor: 'pointer', transform: 'scale(1.03)' } }}
                onClick={() => navigate('/doctors-list')}
                tabIndex={0}
                role="button"
                aria-label="View Qualified Doctors"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { navigate('/doctors-list'); } }}
              >
                <Box mb={1} mt={1} sx={{ fontSize: 36, textAlign: 'center' }}>🩺</Box>
                <Box mb={2}>
                  <lottie-player
                    src={require('../assets/doctor.json')}
                    background="transparent"
                    speed="1"
                    style={{ width: '80px', height: '80px' }}
                    loop
                    autoplay
                  />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: cardText }}>
                  Qualified Doctors
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, textAlign: 'center', color: cardDesc }}>
                  Consult with experienced and certified professionals.
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Slogan Section */}
      <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Typography variant="h4" fontWeight={800} color={SUNRISE.primary} sx={{ letterSpacing: 2 }}>
            Inspiring Hope
          </Typography>
        </motion.div>
      </Box>

      {/* Patient Stories Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: heroTitle, textAlign: 'center' }}>
            Patient Stories
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Example patient story cards */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: 4, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: cardBg }}>
                <Box mb={2}>
                  <lottie-player src={require('../assets/medical-lottie.json')} background="transparent" speed="1" style={{ width: '60px', height: '60px' }} loop autoplay />
                </Box>
                <Typography variant="body1" sx={{ color: cardDesc, mb: 1 }}>
                  “HopeSpring Hospital gave me a new lease on life. The care and compassion were unmatched.”
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: cardText }}>
                  – Priya S.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: 4, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: cardBg }}>
                <Box mb={2}>
                  <lottie-player src={require('../assets/doctor.json')} background="transparent" speed="1" style={{ width: '60px', height: '60px' }} loop autoplay />
                </Box>
                <Typography variant="body1" sx={{ color: cardDesc, mb: 1 }}>
                  “The doctors listened to me and explained everything. I felt safe and hopeful throughout my treatment.”
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: cardText }}>
                  – Rahul M.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Doctor Stories Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: heroTitle, textAlign: 'center' }}>
            Doctor Stories
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: 4, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: cardBg }}>
                <Box mb={2}>
                  <lottie-player src={require('../assets/doctor.json')} background="transparent" speed="1" style={{ width: '60px', height: '60px' }} loop autoplay />
                </Box>
                <Typography variant="body1" sx={{ color: cardDesc, mb: 1 }}>
                  “Every day, I see hope restored in my patients’ eyes. That’s why I love working at HopeSpring.”
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: cardText }}>
                  – Dr. Meera K.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: heroTitle, textAlign: 'center' }}>
            What Our Patients Say
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: 4, minHeight: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: cardBg }}>
                <Typography variant="body1" sx={{ color: cardDesc, mb: 1 }}>
                  “The staff was so friendly and the process was smooth. I recommend HopeSpring to everyone.”
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: cardText }}>
                  – Anjali T.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: 4, minHeight: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: cardBg }}>
                <Typography variant="body1" sx={{ color: cardDesc, mb: 1 }}>
                  “HopeSpring truly lives up to its name. I felt inspired and cared for every step of the way.”
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: cardText }}>
                  – Suresh P.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Contact Us Section */}
      <Box id="contact" sx={{ bgcolor: footerBg, color: '#fff', py: 5, mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Contact Us
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon sx={{ mr: 1, color: SUNRISE.secondary }} />
                <Typography variant="body1">+123-456-789</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <EmailIcon sx={{ mr: 1, color: SUNRISE.secondary }} />
                <Typography variant="body1">hopespringhospital@example.com</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 3, md: 0 } }}>
              <Typography variant="body2" sx={{ color: footerText }}>
                &copy; {new Date().getFullYear()} HopeSpring Hospital. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
