// src/components/AddEvidenceModal.tsx
import { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDocumentStore } from '../store/document.store';
import { useEvidenceStore } from '../store/evidence.store';
import type { IEvidence } from '../services/db.service';
interface AddEvidenceModalProps { open: boolean; onClose: () => void; checklistItemId: number | null; }
const style = { position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4, borderRadius: 2 };
export function AddEvidenceModal({ open, onClose, checklistItemId }: AddEvidenceModalProps) {
  const { documents } = useDocumentStore();
  const { addEvidence } = useEvidenceStore();
  const [documentId, setDocumentId] = useState<number | string>('');
  const [notes, setNotes] = useState('');
  const handleSubmit = async () => {
    if (!checklistItemId || !documentId) { alert('Please select a document.'); return; }
    const newEvidence: Omit<IEvidence, 'id'> = { checklistItemId, documentId: Number(documentId), notes, timestamp: new Date() };
    await addEvidence(newEvidence);
    onClose();
    setDocumentId(''); setNotes('');
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography id="add-evidence-modal-title" variant="h6" component="h2">Link Document as Evidence</Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="evidence-document-select-label">Select Document</InputLabel>
            <Select labelId="evidence-document-select-label" id="evidence-document-select" value={documentId} label="Select Document" onChange={(e) => setDocumentId(e.target.value)}>
              {documents.map(doc => (<MenuItem key={doc.id} value={doc.id}>{doc.title} (Rev {doc.revision})</MenuItem>))}
            </Select>
          </FormControl>
          <TextField id="evidence-notes" label="Auditor Notes" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline rows={4} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}><Button onClick={onClose} variant="outlined">Cancel</Button><Button onClick={handleSubmit} variant="contained">Link Evidence</Button></Box>
        </Stack>
      </Box>
    </Modal>
  );
}