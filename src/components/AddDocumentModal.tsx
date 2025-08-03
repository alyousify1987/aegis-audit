// src/components/AddDocumentModal.tsx
import { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDocumentStore } from '../store/document.store';
import type { IAegisDocument } from '../services/db.service';
interface AddDocumentModalProps { open: boolean; onClose: () => void; }
const style = { position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4, borderRadius: 2 };
export function AddDocumentModal({ open, onClose }: AddDocumentModalProps) {
  const { addDocument } = useDocumentStore();
  const [title, setTitle] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published' | 'Archived'>('Draft');
  const [revision, setRevision] = useState<number>(1);
  const [tags, setTags] = useState('');
  const handleSubmit = async () => {
    if (!title || !docNumber || !owner) { alert('Please fill out all required fields.'); return; }
    const newDoc: Omit<IAegisDocument, 'id'> = { title, docNumber, owner, status, revision, tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), nextReviewDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) };
    await addDocument(newDoc);
    onClose();
    setTitle(''); setDocNumber(''); setOwner(''); setStatus('Draft'); setRevision(1); setTags('');
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography id="add-doc-modal-title" variant="h6" component="h2">Add New Controlled Document</Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField id="doc-title" label="Document Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          <TextField id="doc-number" label="Document Number" value={docNumber} onChange={(e) => setDocNumber(e.target.value)} fullWidth />
          <TextField id="doc-revision" label="Revision" type="number" value={revision} onChange={(e) => setRevision(parseInt(e.target.value, 10) || 1)} fullWidth />
          <TextField id="doc-tags" label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} fullWidth helperText="Enter comma-separated tags" />
          <TextField id="doc-owner" label="Document Owner" value={owner} onChange={(e) => setOwner(e.target.value)} fullWidth />
          <FormControl fullWidth>
            <InputLabel id="doc-status-label">Status</InputLabel>
            <Select labelId="doc-status-label" id="doc-status-select" value={status} label="Status" onChange={(e) => setStatus(e.target.value as any)}>
              <MenuItem value="Draft">Draft</MenuItem><MenuItem value="Published">Published</MenuItem><MenuItem value="Archived">Archived</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}><Button onClick={onClose} variant="outlined">Cancel</Button><Button onClick={handleSubmit} variant="contained">Save Document</Button></Box>
        </Stack>
      </Box>
    </Modal>
  );
}