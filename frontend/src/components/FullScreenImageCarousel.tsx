import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const images = [
  require('../assets/img1.jpg'),
  require('../assets/img2.jpg'),
  require('../assets/img3.jpg'),
  require('../assets/img4.jpg'),
  require('../assets/img5.jpg'),
];

const FullScreenImageCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  const handlePrev = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{
      width: { xs: '95vw', md: '80vw' }, // Reduce horizontal size
      maxWidth: 1400,
      height: { xs: '32vh', md: '60vh' },
      position: 'relative',
      background: '#f5f5f5',
      mb: 4,
      mt: { xs: 8, md: 10 },
      overflow: 'hidden',
      display: 'block',
      mx: 'auto', // Center horizontally
    }}>
      <IconButton
        onClick={handlePrev}
        sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: '#fff8', '&:hover': { bgcolor: '#fff' } }}
        aria-label="Previous image"
      >
        <ArrowBackIosNewIcon fontSize="large" />
      </IconButton>
      <Box
        sx={{
          width: '100%',
          height: { xs: '32vh', md: '60vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={images[index]}
          alt={`Hospital ${index + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 0,
            boxShadow: 'none',
            display: 'block',
          }}
        />
      </Box>
      <IconButton
        onClick={handleNext}
        sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: '#fff8', '&:hover': { bgcolor: '#fff' } }}
        aria-label="Next image"
      >
        <ArrowForwardIosIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default FullScreenImageCarousel;
