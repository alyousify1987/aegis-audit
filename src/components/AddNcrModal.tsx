// src/components/AddNcrModal.tsx
import { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNcrStore } from '../store/ncr.store';
import { useAuditStore } from '../store/audit.store'; // Import the audit store
import type { INonConformance } from '../services/db.service';

interface AddNcrModalProps {
  open: boolean;
  onClose: () => void;
}

const style = { position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4, borderRadius: 2 };

export function AddNcrModal({ open, onClose }: AddNcrModalProps) {
  const { addNcr } = useNcrStore();
  const { selectedAudit } = useAuditStore(); // Get the selected audit
  const [ncrNumber, setNcrNumber] = useState(`NCR-${Math.floor(100 + Math.random() * 900)}`);
  const [classification, setClassification] = useState<'Minor' | 'Major'>('Minor');
  const [processOwner, setProcessOwner] = useState('');

  const handleSubmit = async () => {
    if (!ncrNumber || !processOwner) {
      alert('Please fill out all required fields.');
      return;
    }

    // Use the selected audit's ID, or default to 1 if no audit is selected
    const auditId = selectedAudit ? selectedAudit.id! : 1;

    const newNcr: Omit<INonConformance, 'id'> = { ncrNumber, classification, processOwner, status: 'Open', auditId: auditId };
    await addNcr(newNcr);
    onClose();
    setNcrNumber(`NCR-${Math.floor(100 + Math.random() * 900)}`);
    setClassification('Minor');
    setProcessOwner('');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography id="add-ncr-modal-title" variant="h6" component="h2">Raise New Non-Conformance</Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField id="ncr-number" label="NCR Number" value={ncrNumber} onChange={(e) => setNcrNumber(e.target.value)} fullWidth required />
          <TextField id="ncr-process-owner" label="Process Owner" value={processOwner} onChange={(e) => setProcessOwner(e.target.value)} fullWidth required />
          <FormControl fullWidth>
            <InputLabel id="ncr-classification-label">Classification</InputLabel>
            <Select labelId="ncr-classification-label" id="ncr-classification-select" value={classification} label="Classification" onChange={(e) => setClassification(e.target.value as 'Minor' | 'Major')}>
              <MenuItem value="Minor">Minor</MenuItem>
              <MenuItem value="Major">Major</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={onClose} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">Save NCR</Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}