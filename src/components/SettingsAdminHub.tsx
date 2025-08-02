// src/components/SettingsAdminHub.tsx
import { Box, Typography } from '@mui/material';

export function SettingsAdminHub() {
  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, mt: 2 }}>
      <Typography variant="h6">Settings & Administration</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        (Application configuration will be built here)
      </Typography>
    </Box>
  );
}