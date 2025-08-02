// src/components/DocumentControlHub.tsx

import { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, Alert, Chip, Stack, Paper } from '@mui/material'; // Import Paper
import { useDocumentStore } from '../store/document.store';
import { AddDocumentModal } from './AddDocumentModal';
import type { IAegisDocument } from '../services/db.service';

export function DocumentControlHub() {
  const { documents, isLoading, alerts, fetchDocuments } = useDocumentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    // --- START OF THE FIX: Use Paper for a better layout ---
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Intelligent Document Control Hub ({documents.length} total)
      </Typography>
      
      <Button variant="contained" onClick={handleOpenModal} sx={{ mb: 2 }}>
        Add New Document
      </Button>
      
      {isLoading ? ( <CircularProgress /> ) : (
        <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {documents.map((doc) => (
            <ListItem key={doc.id} divider sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
              <ListItemText
                primary={`${doc.title} (Rev ${doc.revision})`}
                secondary={`Doc #: ${doc.docNumber} | Owner: ${doc.owner} | Status: ${doc.status} | Review By: ${new Date(doc.nextReviewDate).toLocaleDateString()}`}
              />
              {doc.tags && doc.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {doc.tags.map(tag => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
                </Stack>
              )}
              {doc.id && alerts[doc.id] && (
                <Alert severity="warning" sx={{ width: '100%', mt: 1.5 }}>
                  {alerts[doc.id].join(', ')}
                </Alert>
              )}
            </ListItem>
          ))}
        </List>
      )}
      
      <AddDocumentModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Paper>
    // --- END OF THE FIX ---
  );
}