// src/components/AuditManagementHub.tsx

import { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItemButton, ListItemText, CircularProgress, Chip, Paper, Alert } from '@mui/material';
import { useAuditStore } from '../store/audit.store';
import { useDocumentStore } from '../store/document.store';
import { seedInitialData } from '../services/db.service';
import { AddAuditModal } from './AddAuditModal';

const getRiskColor = (riskLevel: 'High' | 'Medium' | 'Low'): "error" | "warning" | "success" | "default" => {
  switch (riskLevel) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'default';
  }
};

export function AuditManagementHub() {
  const { audits, isLoading, fetchAudits, selectAudit } = useAuditStore();
  const { fetchDocuments } = useDocumentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingestionStatus, setIngestionStatus] = useState('');

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSeedDatabase = async () => {
    setIngestionStatus('Seeding sample data...');
    await seedInitialData();
    await fetchDocuments();
    await fetchAudits();
    setTimeout(() => setIngestionStatus(''), 2000);
  };

  const handleClearDatabase = async () => {
    setIngestionStatus('Clearing all data...');
    // Clear the database
    // Refresh the state for all components by calling the fetch action
    fetchDocuments();
    fetchAudits();
    setTimeout(() => setIngestionStatus(''), 2000);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Automated Audit Management Hub</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={handleOpenModal}>Plan New Audit</Button>
        <Button variant="outlined" color="secondary" disabled>
          'One-Click Audit' (Coming Soon)
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSeedDatabase}>
          Seed Sample Data
        </Button>
        <Button variant="contained" color="error" onClick={handleClearDatabase}>
          Clear All Data
        </Button>
      </Box>

      {ingestionStatus && <Alert severity="info" sx={{ mb: 2 }}>{ingestionStatus}</Alert>}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <List>
          {audits.map((audit, idx) => (
            <ListItemButton
              key={audit.id ?? `audit-${idx}`}
              onClick={() => audit.id && selectAudit(audit.id)}
              sx={{ my: 0.5, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
            >
              <ListItemText
                primary={audit.auditName}
                secondary={`Status: ${audit.status} | Scheduled for: ${new Date(audit.scheduledDate).toLocaleDateString()}`}
              />
              <Chip label={audit.riskLevel} color={getRiskColor(audit.riskLevel)} size="small" />
            </ListItemButton>
          ))}
        </List>
      )}

      <AddAuditModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Paper>
  );
}