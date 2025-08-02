// src/components/NcrCapaHub.tsx

import { useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, Chip } from '@mui/material';
// --- START OF CHANGES ---
// We no longer need the db service or eventBus here. We only need our new store.
import { useNcrStore } from '../store/ncr.store';
import type { INonConformance } from '../services/db.service';
// --- END OF CHANGES ---


const getStatusColor = (status: INonConformance['status']) => {
  return status === 'Open' ? 'warning' : 'success';
};

export function NcrCapaHub() {
  // --- START OF CHANGES ---
  // 1. Get all state and actions directly from the Zustand store.
  const { ncrs, isLoading, fetchNcrs, addNcr } = useNcrStore();

  // 2. The useEffect simply tells the store to fetch data on mount.
  useEffect(() => {
    fetchNcrs();
  }, [fetchNcrs]);

  // 3. The handler now calls the simple 'addNcr' action from the store.
  const handleRaiseNcr = async () => {
    const newNcr: Omit<INonConformance, 'id'> = {
        ncrNumber: `NCR-${Math.floor(100 + Math.random() * 900)}`,
        status: 'Open',
        classification: 'Minor',
        auditId: 1, // Placeholder for now
        processOwner: 'Operations',
    };
    await addNcr(newNcr);
  };
  // --- END OF CHANGES ---

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, mt: 2 }}>
      <Typography variant="h6">Non-Conformance & CAPA Hub</Typography>
      <Button variant="contained" onClick={handleRaiseNcr} sx={{ my: 2 }}>
        Raise New NCR
      </Button>

      {/* The JSX display logic below remains UNCHANGED. */}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <List>
          {ncrs.map((ncr) => (
            <ListItem key={ncr.id} divider>
              <ListItemText
                primary={`NCR #: ${ncr.ncrNumber} (${ncr.classification})`}
                secondary={`Process Owner: ${ncr.processOwner} | From Audit ID: ${ncr.auditId}`}
              />
              <Chip label={ncr.status} color={getStatusColor(ncr.status)} size="small" />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}