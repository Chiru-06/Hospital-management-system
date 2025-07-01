import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme as useMuiTheme,
  styled,
  Theme,
  ListItemButton,
  Divider,
  Typography,
  useMediaQuery,
  keyframes,
} from '@mui/material';
import {
  People,
  CalendarToday,
  LocalHospital,
  Inventory2,
  Receipt,
  Description,
  Science,
  Dashboard,
  Brightness4,
  Brightness7,
  Menu,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';

const drawerWidth = 240;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const StyledDrawer = styled(Drawer)(({ theme }: { theme: Theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease-in-out',
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }: { theme: Theme }) => ({
  borderRadius: '8px',
  margin: '4px 8px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(5px)',
    '& .MuiListItemIcon-root': {
      transform: 'scale(1.2)',
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main,
      fontWeight: 'bold',
    },
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main,
      fontWeight: 'bold',
    },
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }: { theme: Theme }) => ({
  minWidth: '40px',
  transition: 'all 0.3s ease-in-out',
}));

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Patients', icon: <People />, path: '/patients' },
  { text: 'Appointments', icon: <CalendarToday />, path: '/appointments' },
  { text: 'Doctors', icon: <LocalHospital />, path: '/doctors' },
  { text: 'Inventory', icon: <Inventory2 />, path: '/inventory' },
  { text: 'Billing', icon: <Receipt />, path: '/billing' },
  { text: 'Prescriptions', icon: <Description />, path: '/prescriptions' },
  { text: 'Lab Tests', icon: <Science />, path: '/lab-tests' },
];

const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useMuiTheme();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography 
          variant="h6" 
          component="div"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            animation: `${pulse} 2s infinite`,
          }}
        >
          HMS
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <StyledListItemIcon>{item.icon}</StyledListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    transition: 'all 0.3s ease-in-out',
                  }
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider />
        <ListItem disablePadding>
          <StyledListItemButton onClick={toggleTheme}>
            <StyledListItemIcon>
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </StyledListItemIcon>
            <ListItemText 
              primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              primaryTypographyProps={{
                sx: {
                  transition: 'all 0.3s ease-in-out',
                }
              }}
            />
          </StyledListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <StyledListItemButton onClick={() => {
            localStorage.removeItem('role');
            window.location.href = '/login';
          }}>
            <StyledListItemIcon>
              {/* You can use any icon you like here */}
              <Dashboard />
            </StyledListItemIcon>
            <ListItemText 
              primary="Logout"
              primaryTypographyProps={{
                sx: {
                  transition: 'all 0.3s ease-in-out',
                }
              }}
            />
          </StyledListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            zIndex: 1,
            animation: `${pulse} 2s infinite`,
          }}
        >
          <Menu />
        </IconButton>
      )}
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </StyledDrawer>
    </Box>
  );
};

export default Sidebar;