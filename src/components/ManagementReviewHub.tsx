// src/components/ManagementReviewHub.tsx
import { Box, Typography } from '@mui/material';

export function ManagementReviewHub() {
  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, mt: 2 }}>
      <Typography variant="h6">Management Review Hub</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        (Preparation and documentation of management reviews will be built here)
      </Typography>
    </Box>
  );
}