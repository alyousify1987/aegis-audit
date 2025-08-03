// src/components/AuditDetails.tsx

import { useEffect } from 'react';
// --- THE FIX IS HERE: 'Box' has been removed from this import list ---
import { Typography, Button, Paper, CircularProgress, List, ListItem, ListItemText, Select, MenuItem, FormControl } from '@mui/material';
import { useAuditStore } from '../store/audit.store';
import { useChecklistStore } from '../store/checklist.store';
import type { IChecklistItem } from '../services/db.service';

// Helper function to get a color for the checklist item status
const getStatusColor = (status: IChecklistItem['status']) => {
  switch (status) {
    case 'Conforming': return 'success.main';
    case 'Non-Conforming': return 'error.main';
    case 'N/A': return 'text.disabled';
    default: return 'text.secondary';
  }
};

export function AuditDetails() {
  const { selectedAudit, clearSelectedAudit } = useAuditStore();
  const { checklist, checklistItems, isLoading, fetchChecklistForAudit, updateChecklistItemStatus } = useChecklistStore();

  useEffect(() => {
    if (selectedAudit) {
      fetchChecklistForAudit(selectedAudit.id!);
    }
  }, [selectedAudit, fetchChecklistForAudit]);

  const handleStatusChange = (itemId: number, newStatus: IChecklistItem['status']) => {
    updateChecklistItemStatus(itemId, newStatus);
  };

  if (!selectedAudit) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography>No audit selected. Please go back and select an audit.</Typography>
        <Button onClick={clearSelectedAudit} sx={{ mt: 2 }}>Back</Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Button variant="outlined" onClick={clearSelectedAudit} sx={{ mb: 2 }}>
        ← Back to All Audits
      </Button>

      <Typography variant="h5" sx={{ mb: 1 }}>
        Audit Details
      </Typography>
      <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
        {selectedAudit.auditName}
      </Typography>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {checklist ? checklist.name : 'Checklist'}
      </Typography>

      {isLoading ? <CircularProgress /> : (
        <List>
          {checklistItems.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemText
                primary={`Clause ${item.clause}`}
                secondary={item.question}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id!, e.target.value as IChecklistItem['status'])}
                  sx={{
                    color: getStatusColor(item.status),
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: getStatusColor(item.status), },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: getStatusColor(item.status), },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: getStatusColor(item.status), },
                    '& .MuiSelect-icon': { color: getStatusColor(item.status), }
                  }}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Conforming">Conforming</MenuItem>
                  <MenuItem value="Non-Conforming">Non-Conforming</MenuItem>
                  <MenuItem value="N/A">N/A</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}