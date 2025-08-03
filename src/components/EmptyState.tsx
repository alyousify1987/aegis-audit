// src/components/EmptyState.tsx
import { Box, Typography } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
interface EmptyStateProps { title: string; message: string; }
export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', textAlign: 'center', p: 3 }}>
      <AnalyticsIcon sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h6" component="p" sx={{ mb: 1 }}>{title}</Typography>
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
}