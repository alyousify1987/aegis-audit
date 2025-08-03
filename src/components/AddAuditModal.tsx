// src/components/AddAuditModal.tsx
import { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAuditStore } from '../store/audit.store';
import type { IAudit } from '../services/db.service';
interface AddAuditModalProps { open: boolean; onClose: () => void; }
const style = { position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4, borderRadius: 2 };
export function AddAuditModal({ open, onClose }: AddAuditModalProps) {
  const { addAudit } = useAuditStore();
  const [auditName, setAuditName] = useState('');
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const handleSubmit = async () => {
    if (!auditName) { alert('Please provide an audit name.'); return; }
    const newAudit: Omit<IAudit, 'id'> = { auditName, riskLevel, scheduledDate: new Date(scheduledDate), status: 'Planned' };
    await addAudit(newAudit);
    onClose();
    setAuditName(''); setRiskLevel('Low'); setScheduledDate(new Date().toISOString().split('T')[0]);
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Plan New Audit</Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField label="Audit Name / Title" variant="outlined" value={auditName} onChange={(e) => setAuditName(e.target.value)} fullWidth required />
          <FormControl fullWidth>
            <InputLabel>Risk Level</InputLabel>
            <Select value={riskLevel} label="Risk Level" onChange={(e) => setRiskLevel(e.target.value as 'Low' | 'Medium' | 'High')}>
              <MenuItem value="Low">Low</MenuItem><MenuItem value="Medium">Medium</MenuItem><MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Scheduled Date" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}><Button onClick={onClose} variant="outlined">Cancel</Button><Button onClick={handleSubmit} variant="contained">Save Audit</Button></Box>
        </Stack>
      </Box>
    </Modal>
  );
}