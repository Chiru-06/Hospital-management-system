import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const handleCollapseToggle = () => setCollapsed((prev) => !prev);

  // Sidebar width in px
  const sidebarWidth = collapsed ? 72 : 256;

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        minWidth: 0,
        width: '100vw',
        maxWidth: '100vw',
        maxHeight: '100vh',
        overflowX: 'hidden', // Prevent horizontal scrolling
        overflowY: 'hidden',
        p: 0,
        m: 0,
      }}
    >
      <CssBaseline />
      {/* Sidebar: fixed width, no margin */}
      <Box
        sx={{
          width: { xs: 0, sm: `${sidebarWidth}px` },
          flexShrink: 0,
          p: 0,
          m: 0,
          height: '100vh',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Sidebar collapsed={collapsed} onCollapseToggle={handleCollapseToggle} />
      </Box>
      {/* Main content: flex-grow, no margin, fills remaining space */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          minWidth: 0,
          maxHeight: '100vh',
          width: { xs: '100vw', sm: `calc(100vw - ${sidebarWidth}px)` },
          backgroundColor: 'background.default',
          overflowY: 'auto', // Allow vertical scrolling
          overflowX: 'hidden', // Prevent horizontal scrolling
          p: 0,
          m: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Topbar />
        {/* Responsive vertical spacing to prevent overlap with topbar */}
        <Box sx={{ height: { xs: 56, sm: 64, md: 72 } }} />
        <Box sx={{ flex: 1, width: '100%', overflow: 'auto', p: 0, m: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;