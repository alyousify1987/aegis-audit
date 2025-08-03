// src/components/ObjectivesKpiHub.tsx

import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Tooltip, Paper, Button, Stack } from '@mui/material';
import { useKpiStore } from '../store/kpi.store';
import type { IKpi } from '../services/db.service';
import { EmptyState } from './EmptyState';
import { UpdateKpiModal } from './UpdateKpiModal'; // Import our new modal

// The KpiProgressBar helper component is now more compact
function KpiProgressBar({ kpi }: { kpi: IKpi }) {
  const percentage = kpi.target > 0 ? Math.min(Math.round((kpi.value / kpi.target) * 100), 100) : 0;
  let progressColor = '#7df9ff';
  if (percentage < 50) progressColor = '#ff9800';
  if (percentage >= 100) progressColor = '#4caf50';

  return (
    <Tooltip title={`${kpi.value} / ${kpi.target} (${percentage}%)`} placement="top" arrow>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ height: '8px', width: '100%', bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: `${percentage}%`, bgcolor: progressColor, borderRadius: '4px', transition: 'width 0.4s ease-in-out' }} />
        </Box>
      </Box>
    </Tooltip>
  );
}

export function ObjectivesKpiHub() {
  const { kpis, isLoading, fetchKpis } = useKpiStore();
  
  // --- START OF CHANGES ---
  // Local state to manage which KPI is selected and if the modal is open
  const [selectedKpi, setSelectedKpi] = useState<IKpi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchKpis();
  }, [fetchKpis]);

  // Handler to open the modal with the correct KPI
  const handleOpenModal = (kpi: IKpi) => {
    setSelectedKpi(kpi);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedKpi(null);
  };
  // --- END OF CHANGES ---

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Objectives & KPI Hub</Typography>
      
      {isLoading ? ( <CircularProgress /> ) : (
        kpis.length === 0 ? (
          <Box sx={{ height: 300, display: 'flex' }}>
            <EmptyState title="No KPIs Defined" message="Key Performance Indicators will be displayed here once they are created." />
          </Box>
        ) : (
          <List>
            {kpis.map((kpi) => (
              <ListItem key={kpi.id} divider sx={{ py: 1.5 }}>
                <ListItemText
                  primary={kpi.name}
                  secondary={`Target: ${kpi.target} | Period: ${kpi.period}`}
                />
                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '40%', ml: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <KpiProgressBar kpi={kpi} />
                  </Box>
                  {/* --- START OF CHANGES --- */}
                  {/* Add an "Update" button for each KPI */}
                  <Button variant="outlined" size="small" onClick={() => handleOpenModal(kpi)}>
                    Update
                  </Button>
                  {/* --- END OF CHANGES --- */}
                </Stack>
              </ListItem>
            ))}
          </List>
        )
      )}

      {/* Render the modal, passing it the selected KPI */}
      <UpdateKpiModal open={isModalOpen} onClose={handleCloseModal} kpi={selectedKpi} />
    </Paper>
  );
}