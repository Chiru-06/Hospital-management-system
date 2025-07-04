import React, { useState } from 'react';
import { AppBar, Typography, IconButton, Box, Menu, MenuItem, useMediaQuery, useTheme as useMuiTheme, Avatar } from '@mui/material';
import { useTheme } from '../../theme/ThemeContext';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../assets/logo1.png';
import adminImg from '../../assets/admin.jpg';
import doctorImg from '../../assets/doctor.jpg';
import managerImg from '../../assets/manager.jpg';
import patientImg from '../../assets/patient1.jpg';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';

const roleToAvatar = {
  admin: adminImg,
  doctor: doctorImg,
  manager: managerImg,
  patient: patientImg,
};

const Topbar: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const { mode, toggleTheme } = useTheme();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const role = localStorage.getItem('role') as keyof typeof roleToAvatar | null;
  const avatarSrc = role ? roleToAvatar[role] : adminImg;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <AppBar position="fixed" color="primary" elevation={1} sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      left: { xs: 0, sm: 0 },
      width: { xs: '100%', sm: 'auto' },
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      pl: { xs: 0, sm: 0 },
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {/* Optionally add a menu icon for mobile */}
      {isMobile && onMenuClick && (
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Box component="img" src={logo} alt="logo" sx={{ height: 36, width: 36, mr: 1 }} />
        <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#fff', letterSpacing: 1.5 }}>
          HopeSpring Hospital
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
        <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <IconButton onClick={handleMenu} size="large">
          <Avatar src={avatarSrc} alt={role || 'user'} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {role && (
            <MenuItem disabled sx={{ fontWeight: 600, color: theme.palette.primary.main, opacity: 1, fontSize: 16, textTransform: 'capitalize' }}>
              {role} (logged in)
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main, fontWeight: 500 }}>Logout</MenuItem>
        </Menu>
      </Box>
    </AppBar>
  );
};

export default Topbar;
