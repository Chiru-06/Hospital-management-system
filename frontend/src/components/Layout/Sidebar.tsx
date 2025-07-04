import React, { useState } from 'react';
import {
  Drawer,
  List,
  Divider,
  IconButton,
  Box,
  useTheme as useMuiTheme,
  styled,
  Theme,
  useMediaQuery,
  keyframes,
} from '@mui/material';
import {
  Menu,
  Dashboard,
  People,
  CalendarToday,
  LocalHospital,
  Inventory2,
  Receipt,
  Description,
  Science,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import logo from '../../assets/logo1.png';

const drawerWidth = 256;

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
    borderRight: 'none',
    transition: 'all 0.3s ease-in-out',
  },
}));

const getMenuItemsForRole = (role: string | null) => {
  switch (role) {
    case 'admin':
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard/admin' },
        { text: 'Patients', icon: <People />, path: '/patients' },
        { text: 'Appointments', icon: <CalendarToday />, path: '/appointments' },
        { text: 'Doctors', icon: <LocalHospital />, path: '/doctors' },
        { text: 'Inventory', icon: <Inventory2 />, path: '/inventory' },
        { text: 'Billing', icon: <Receipt />, path: '/billing' },
        { text: 'Prescriptions', icon: <Description />, path: '/prescriptions' },
        { text: 'Lab Tests', icon: <Science />, path: '/lab-tests' },
      ];
    case 'doctor':
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard/doctor' },
        { text: 'Appointments', icon: <CalendarToday />, path: '/appointments' },
        { text: 'Patients', icon: <People />, path: '/patients' },
        { text: 'Lab Tests', icon: <Science />, path: '/lab-tests' },
        { text: 'Prescriptions', icon: <Description />, path: '/prescriptions' },
      ];
    case 'manager':
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard/manager' },
        { text: 'Inventory', icon: <Inventory2 />, path: '/inventory' },
        { text: 'Billing', icon: <Receipt />, path: '/billing' },
      ];
    case 'patient':
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard/patient' },
        { text: 'Appointments', icon: <CalendarToday />, path: '/appointments' },
        { text: 'Lab Tests', icon: <Science />, path: '/lab-tests' },
        { text: 'Prescriptions', icon: <Description />, path: '/prescriptions' },
        { text: 'Billing', icon: <Receipt />, path: '/billing' }
      ];
    default:
      return [];
  }
};

// Add props for collapsed state and collapse toggle
interface SidebarProps {
  collapsed: boolean;
  onCollapseToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapseToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useMuiTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const role = localStorage.getItem('role');
  const menuItems = getMenuItemsForRole(role);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      {/* Logo only at the top */}
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        minHeight: 64,
        minWidth: 0,
        width: '100%',
        transition: 'all 0.3s',
        overflow: 'visible',
      }}>
        <Box
          component="img"
          src={logo}
          alt="HopeSpring Hospital Logo"
          sx={{ height: 40, width: 40, transition: 'all 0.3s', flexShrink: 0 }}
        />
      </Box>
      {/* Toggle button below logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
        <IconButton onClick={onCollapseToggle} size="large" sx={{ transition: 'transform 0.3s', transform: collapsed ? 'rotate(180deg)' : 'none' }}>
          <Menu />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            collapsed={collapsed}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 1 }}>
        <Divider />
        {/* Removed theme toggle and logout from sidebar, now in Topbar */}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minWidth: 0 }}>
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
        PaperProps={{
          sx: {
            width: collapsed ? 72 : drawerWidth,
            minWidth: collapsed ? 72 : drawerWidth,
            maxWidth: collapsed ? 72 : drawerWidth,
            overflow: 'hidden',
            transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
            borderRight: 'none',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            zIndex: 1200,
          },
        }}
      >
        {drawer}
      </StyledDrawer>
      {/* Main content wrapper, shifts right when sidebar is open */}
      <Box component="main" sx={{
        flexGrow: 1,
        ml: 0, // Remove all margin between sidebar and content
        transition: 'none', // No margin animation needed
        minWidth: 0,
        p: 0,
        width: '100%',
        // Ensure content is flush with sidebar
      }}>
        {/* ...main content goes here... */}
      </Box>
    </Box>
  );
};

export default Sidebar;