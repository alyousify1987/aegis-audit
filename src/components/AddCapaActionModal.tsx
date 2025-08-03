// src/components/AddCapaActionModal.tsx

import { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, Stack } from '@mui/material';
import { useCapaStore } from '../store/capa.store';
import type { ICapaAction } from '../services/db.service';

interface AddCapaActionModalProps {
  open: boolean;
  onClose: () => void;
  ncrId: number;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export function AddCapaActionModal({ open, onClose, ncrId }: AddCapaActionModalProps) {
  const { addAction } = useCapaStore();
  
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async () => {
    if (!description || !assignedTo) {
      alert('Please fill out all required fields.');
      return;
    }
    const newAction: Omit<ICapaAction, 'id'> = {
      ncrId,
      description,
      assignedTo,
      dueDate: new Date(dueDate),
      status: 'Open',
    };
    await addAction(newAction);
    onClose();
    setDescription('');
    setAssignedTo('');
    setDueDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography id="add-capa-modal-title" variant="h6" component="h2">
          Add New Corrective Action
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            id="capa-description"
            label="Action Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth required multiline rows={3}
          />
          <TextField
            id="capa-assigned-to"
            label="Assigned To"
            variant="outlined"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            fullWidth required
          />
          <TextField
            id="capa-due-date"
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={onClose} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">Save Action</Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}