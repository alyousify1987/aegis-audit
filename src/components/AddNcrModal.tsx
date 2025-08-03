// src/components/NcrCapaHub.tsx

import { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, Chip, Paper } from '@mui/material';
import { useNcrStore } from '../store/ncr.store';
import type { INonConformance } from '../services/db.service';
import { AddNcrModal } from './AddNcrModal'; // This will now import your existing, correct component

const getStatusColor = (status: INonConformance['status']): "warning" | "success" => {
  return status === 'Open' ? 'warning' : 'success';
};

export function NcrCapaHub() {
  const { ncrs, isLoading, fetchNcrs } = useNcrStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNcrs();
  }, [fetchNcrs]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Non-Conformance & CAPA Hub</Typography>
        <Button variant="contained" onClick={handleOpenModal}>
          Raise New NCR
        </Button>
      </Box>

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

      {/* This line now correctly renders your existing modal */}
      <AddNcrModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Paper>
  );
}