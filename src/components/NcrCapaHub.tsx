// src/components/NcrCapaHub.tsx
import { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItemText, CircularProgress, Chip, Paper, ListItemButton } from '@mui/material';
import { useNcrStore } from '../store/ncr.store';
import type { INonConformance } from '../services/db.service';
import { AddNcrModal } from './AddNcrModal';
const getStatusColor = (status: INonConformance['status']): "warning" | "success" => {
  return status === 'Open' ? 'warning' : 'success';
};
export function NcrCapaHub() {
  const { ncrs, isLoading, fetchNcrs, selectNcr } = useNcrStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => { fetchNcrs(); }, [fetchNcrs]);
  const handleOpenModal = () => { setIsModalOpen(true); };
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Non-Conformance & CAPA Hub</Typography>
        <Button variant="contained" onClick={handleOpenModal}>Raise New NCR</Button>
      </Box>
      {isLoading ? ( <CircularProgress /> ) : (
        <List>
          {ncrs.map((ncr) => (
            <ListItemButton key={ncr.id} onClick={() => selectNcr(ncr.id!)} sx={{ my: 0.5, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' }}}>
              <ListItemText primary={`NCR #: ${ncr.ncrNumber} (${ncr.classification})`} secondary={`Process Owner: ${ncr.processOwner} | From Audit ID: ${ncr.auditId}`} />
              <Chip label={ncr.status} color={getStatusColor(ncr.status)} size="small" />
            </ListItemButton>
          ))}
        </List>
      )}
      <AddNcrModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Paper>
  );
}