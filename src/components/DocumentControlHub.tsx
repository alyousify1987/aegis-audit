// src/components/DocumentControlHub.tsx

import { useEffect, useState, useMemo } from 'react';
import {
  Box, Typography, Button, List, ListItem, ListItemText,
  CircularProgress, Alert, Chip, Stack, Paper, TextField,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useDocumentStore } from '../store/document.store';
import { AddDocumentModal } from './AddDocumentModal';
// The unused 'IAegisDocument' type import has been removed from this file.

export function DocumentControlHub() {
  const {
    documents, isLoading, alerts, fetchDocuments,
    searchTerm, setSearchTerm, statusFilter, setStatusFilter
  } = useDocumentStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = doc.title.toLowerCase().includes(lowerSearchTerm) ||
                            doc.docNumber.toLowerCase().includes(lowerSearchTerm);
      const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [documents, searchTerm, statusFilter]);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Intelligent Document Control Hub ({filteredDocuments.length} of {documents.length} total)
        </Typography>
        <Button variant="contained" onClick={handleOpenModal}>
          Add New Document
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search by Title or Doc #"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select value={statusFilter} label="Filter by Status" onChange={(e) => setStatusFilter(e.target.value as any)}>
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Published">Published</MenuItem>
            <MenuItem value="Archived">Archived</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      
      {isLoading ? ( <CircularProgress /> ) : (
        <List sx={{ maxHeight: 'calc(60vh - 80px)', overflowY: 'auto' }}>
          {filteredDocuments.map((doc) => (
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
  );
}