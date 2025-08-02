// src/components/ExternalAuditorHub.tsx
import { Box, Typography } from '@mui/material';

export function ExternalAuditorHub() {
  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, mt: 2 }}>
      <Typography variant="h6">External Auditor Hub</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        (Third-party audit management will be built here)
      </Typography>
    </Box>
  );
}