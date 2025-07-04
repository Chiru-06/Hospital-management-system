import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  collapsed: boolean;
  selected: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, collapsed, selected, onClick }) => (
  <ListItem disablePadding sx={{ justifyContent: 'center' }}>
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        justifyContent: 'center',
        px: 0,
        minHeight: 48,
        transition: 'all 0.3s',
        width: '100%',
        borderRadius: '8px',
        margin: '4px 8px',
        ...(selected && {
          backgroundColor: 'primary.light',
          '&:hover': { backgroundColor: 'primary.light' },
        }),
      }}
    >
      <ListItemIcon sx={{ justifyContent: 'center', minWidth: 0, color: selected ? 'primary.main' : 'inherit', transition: 'all 0.3s' }}>
        {icon}
      </ListItemIcon>
      {!collapsed && (
        <ListItemText 
          primary={text}
          primaryTypographyProps={{
            sx: {
              transition: 'all 0.3s',
              color: selected ? 'primary.main' : 'inherit',
              fontWeight: selected ? 'bold' : 'normal',
            }
          }}
        />
      )}
    </ListItemButton>
  </ListItem>
);

export default SidebarItem;
