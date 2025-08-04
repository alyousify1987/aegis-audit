// src/components/AppHeader.tsx


import { Box, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { useUserStore } from '../store/user.store';
import { useState } from 'react';

const LOGO_URL = '/vite.svg'; // Use your logo path here

export function AppHeader() {
  const { isLoggedIn, username, login, logout } = useUserStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 2, py: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src={LOGO_URL} alt="Aegis Audit Logo" style={{ height: 40, width: 40, borderRadius: 8 }} />
        <Box>
          <Typography variant="h4" component="h1" color="primary" fontWeight={700} letterSpacing={1}>
            Aegis Audit
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            ISO Audit Management Platform
          </Typography>
        </Box>
      </Box>
      <Box>
        {isLoggedIn ? (
          <>
            <IconButton onClick={handleMenu} size="large" sx={{ ml: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>{username?.[0] || 'U'}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <MenuItem disabled>
                <Typography variant="subtitle2">{username}</Typography>
              </MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button onClick={() => login('M. Alyousify')} variant="contained">Login</Button>
        )}
      </Box>
    </Box>
  );
}