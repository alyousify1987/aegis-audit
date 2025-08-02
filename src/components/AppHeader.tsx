// src/components/AppHeader.tsx

import { Box, Typography, Button } from '@mui/material';
import { useUserStore } from '../store/user.store';

export function AppHeader() {
  const { isLoggedIn, username, login, logout } = useUserStore();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box>
        <Typography variant="h3" component="h1" color="primary">
          Aegis Audit
        </Typography>
        <Typography variant="subtitle1">
          Main Dashboard
        </Typography>
      </Box>
      <Box>
        {isLoggedIn ? (
          <>
            <Typography>Welcome, {username}!</Typography>
            <Button onClick={logout} variant="outlined" size="small">Logout</Button>
          </>
        ) : (
          <Button onClick={() => login('M. Alyousify')} variant="contained">Login</Button>
        )}
      </Box>
    </Box>
  );
}