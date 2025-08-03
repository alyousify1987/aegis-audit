// src/components/UpdateKpiModal.tsx

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, TextField, Stack, Alert } from '@mui/material';
import { useKpiStore } from '../store/kpi.store';
import type { IKpi } from '../services/db.service';

// Define the component's props. It needs to know which KPI is being updated.
interface UpdateKpiModalProps {
  open: boolean;
  onClose: () => void;
  kpi: IKpi | null; // The KPI to be updated
}

// Standard modal styling
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export function UpdateKpiModal({ open, onClose, kpi }: UpdateKpiModalProps) {
  const { updateKpi } = useKpiStore();
  
  // Local state for the new value input
  const [newValue, setNewValue] = useState<number | string>('');

  // When the modal opens or the selected KPI changes, reset the form
  useEffect(() => {
    if (kpi) {
      setNewValue(kpi.value);
    }
  }, [kpi, open]);

  const handleSubmit = async () => {
    // Ensure we have a valid KPI and a valid number
    if (!kpi || typeof newValue !== 'number') {
      alert('Please enter a valid number for the new value.');
      return;
    }

    // Call the update action from our store
    await updateKpi(kpi.id!, newValue);
    onClose(); // Close the modal
  };

  // Don't render anything if there's no KPI selected
  if (!kpi) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography id="update-kpi-modal-title" variant="h6" component="h2">
          Update KPI Progress
        </Typography>
        <Typography sx={{ mt: 1 }}>{kpi.name}</Typography>
        
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            id="kpi-current-value"
            label="Current Value"
            variant="outlined"
            value={kpi.value}
            disabled // The current value is not editable
            fullWidth
          />
          <TextField
            id="kpi-target-value"
            label="Target Value"
            variant="outlined"
            value={kpi.target}
            disabled // The target is not editable here
            fullWidth
          />
           <TextField
            id="kpi-new-value"
            label="New Progress Value"
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
            fullWidth
            required
            autoFocus // Automatically focus this field when the modal opens
          />
          <Alert severity="info">
            Per the RFP, the "upload evidence" feature will be implemented here in a future step.
          </Alert>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={onClose} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">Save Progress</Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}