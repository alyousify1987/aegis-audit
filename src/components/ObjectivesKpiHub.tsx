// src/components/ObjectivesKpiHub.tsx

import { useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Tooltip, Paper } from '@mui/material';
import { useKpiStore } from '../store/kpi.store';
import type { IKpi } from '../services/db.service';
import { EmptyState } from './EmptyState';

// This is the new, custom progress bar component built to your specifications.
// It fulfills the RFP's requirement for an "aesthetically pleasing visualization".
function KpiProgressBar({ kpi }: { kpi: IKpi }) {
  // Calculate percentage, ensuring it's between 0 and 100.
  const percentage = kpi.target > 0 ? Math.min(Math.round((kpi.value / kpi.target) * 100), 100) : 0;
  
  // Use colors that align with the application's theme and provide clear status.
  let progressColor = '#7df9ff'; // Primary Accent Color (Electric Blue)
  if (percentage < 50) progressColor = '#ff9800'; // Warning Orange
  if (percentage >= 100) progressColor = '#4caf50'; // Success Green

  return (
    <Tooltip title={`${kpi.value} / ${kpi.target} (${percentage}%)`} placement="top" arrow>
      <Box sx={{ width: '100%' }}>
        <Typography variant="body2" sx={{ textAlign: 'right', mb: 0.5, color: 'text.secondary' }}>
          {percentage}%
        </Typography>
        {/* The Track: The full-height, light-grey background you envisioned. */}
        <Box sx={{
          height: '8px',
          width: '100%',
          bgcolor: 'rgba(255, 255, 255, 0.1)', // A subtle, semi-transparent white for the track
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          {/* The Fill: The vibrant blue bar showing progress. */}
          <Box sx={{
            height: '100%',
            width: `${percentage}%`,
            bgcolor: progressColor,
            borderRadius: '4px',
            transition: 'width 0.4s ease-in-out', // A smooth animation for a modern feel
          }} />
        </Box>
      </Box>
    </Tooltip>
  );
}

export function ObjectivesKpiHub() {
  const { kpis, isLoading, fetchKpis } = useKpiStore();

  useEffect(() => {
    fetchKpis();
  }, [fetchKpis]);

  return (
    // Using the Paper component provides the consistent "Card/Surface Background" from the RFP.
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Objectives & KPI Hub</Typography>
      
      {isLoading ? ( 
        <CircularProgress /> 
      ) : (
        // Handle the "zero data" case gracefully.
        kpis.length === 0 ? (
          <Box sx={{ height: 300, display: 'flex' }}>
            <EmptyState title="No KPIs Defined" message="Key Performance Indicators will be displayed here once they are created." />
          </Box>
        ) : (
          <List>
            {kpis.map((kpi) => (
              <ListItem key={kpi.id} divider sx={{ py: 2 }}>
                <ListItemText
                  primary={kpi.name}
                  secondary={`Period: ${kpi.period}`}
                />
                <Box sx={{ width: '30%', ml: 2 }}>
                  <KpiProgressBar kpi={kpi} />
                </Box>
              </ListItem>
            ))}
          </List>
        )
      )}
    </Paper>
  );
}