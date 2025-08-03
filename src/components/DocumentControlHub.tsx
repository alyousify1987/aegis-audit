// src/components/DocumentControlHub.tsx

// --- THE FIX IS HERE: 'useMemo' has been removed from the import list ---
import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, List, ListItem, ListItemText,
  CircularProgress, Alert, Chip, Stack, Paper, TextField,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useDocumentStore } from '../store/document.store';
import { AddDocumentModal } from './AddDocumentModal';

export function DocumentControlHub() {
  const {
    documents, isLoading, alerts, fetchDocuments,
    searchTerm, setSearchTerm, statusFilter, setStatusFilter,
    filteredDocuments: getFilteredDocuments
  } = useDocumentStore();
  
  const filteredDocuments = getFilteredDocuments();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

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
          id="document-search-field"
          label="Search by Title or Doc #"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter-select"
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
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