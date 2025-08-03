// src/components/NcrDetails.tsx
import { useEffect } from 'react';
import { Typography, Button, Paper, CircularProgress, List, ListItem, ListItemText, Select, MenuItem, FormControl, Chip, Divider } from '@mui/material';
import { useNcrStore } from '../store/ncr.store';
import { useCapaStore } from '../store/capa.store';
import type { ICapaAction } from '../services/db.service';
const getStatusColor = (status: ICapaAction['status']): "warning" | "success" => {
  return status === 'Open' ? 'warning' : 'success';
};
export function NcrDetails() {
  const { selectedNcr, clearSelectedNcr } = useNcrStore();
  const { capaActions, isLoading, fetchActionsForNcr, updateActionStatus } = useCapaStore();
  useEffect(() => {
    if (selectedNcr) { fetchActionsForNcr(selectedNcr.id!); }
  }, [selectedNcr, fetchActionsForNcr]);
  const handleStatusChange = (actionId: number, newStatus: ICapaAction['status']) => {
    updateActionStatus(actionId, newStatus);
  };
  if (!selectedNcr) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography>No Non-Conformance selected.</Typography>
        <Button onClick={clearSelectedNcr} sx={{ mt: 2 }}>Back to NCRs</Button>
      </Paper>
    );
  }
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Button variant="outlined" onClick={clearSelectedNcr} sx={{ mb: 2 }}>← Back to All NCRs</Button>
      <Typography variant="h5" sx={{ mb: 1 }}>NCR Details</Typography>
      <Typography variant="h6" color="primary" sx={{ mb: 2 }}>{selectedNcr.ncrNumber} ({selectedNcr.classification})</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>Process Owner: {selectedNcr.processOwner} | Status: {selectedNcr.status}</Typography>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" sx={{ mb: 2 }}>Corrective & Preventive Actions (CAPA)</Typography>
      {isLoading ? <CircularProgress /> : (
        <List>
          {capaActions.length === 0 && (<Typography color="text.secondary">No CAPA items found for this NCR.</Typography>)}
          {capaActions.map((action) => (
            <ListItem key={action.id} divider sx={{ alignItems: 'flex-start' }}>
              <ListItemText primary={action.description} secondary={`Assigned to: ${action.assignedTo} | Due: ${new Date(action.dueDate).toLocaleDateString()}`} sx={{ pr: 2 }} />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select value={action.status} onChange={(e) => handleStatusChange(action.id!, e.target.value as ICapaAction['status'])}>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
               <Chip label={action.status} color={getStatusColor(action.status)} size="small" sx={{ ml: 2 }}/>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}