// src/components/AuditManagementHub.tsx

import { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, Chip, Alert, Paper } from '@mui/material';
import { useAuditStore } from '../store/audit.store';
import { useDocumentStore } from '../store/document.store';
import { clearTransactionalData, seedInitialData, db } from '../services/db.service';
import type { IAegisDocument } from '../services/db.service';
import { ocrService } from '../services/ocr.service';
import { nlpService } from '../services/nlp.service';
import { AddAuditModal } from './AddAuditModal';

const getRiskColor = (riskLevel: 'High' | 'Medium' | 'Low'): "error" | "warning" | "success" | "default" => {
  switch (riskLevel) {
    case 'High': return 'error';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'default';
  }
};

async function getAllFiles(directoryHandle: any, path: string = ''): Promise<File[]> {
    const files: File[] = [];
    for await (const entry of directoryHandle.values()) {
        const newPath = path ? `${path}/${entry.name}` : entry.name;
        if (entry.kind === 'file') {
            const file = await entry.getFile();
            (file as any).fullPath = newPath;
            files.push(file);
        } else if (entry.kind === 'directory') {
            files.push(...await getAllFiles(entry, newPath));
        }
    }
    return files;
}

export function AuditManagementHub() {
  const { audits, isLoading, fetchAudits } = useAuditStore();
  const { fetchDocuments } = useDocumentStore();
  const [ingestionStatus, setIngestionStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]); // Corrected the typo 'fetchAudots' to 'fetchAudits'

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleClearDatabase = async () => {
    setIngestionStatus("Clearing all transactional data...");
    await clearTransactionalData();
    setIngestionStatus("Database cleared. Refreshing all hubs...");
    fetchDocuments();
    fetchAudits();
    setTimeout(() => setIngestionStatus(''), 4000);
  };
  
  const handleSeedDatabase = async () => {
    setIngestionStatus("Seeding sample data...");
    await seedInitialData();
    setIngestionStatus("Sample data added. Refreshing all hubs...");
    fetchDocuments();
    fetchAudits();
    setTimeout(() => setIngestionStatus(''), 4000);
  };
  
  const handleOneClickAudit = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      setIngestionStatus('Reading files...');
      const allFiles = await getAllFiles(directoryHandle);
      setIngestionStatus(`Found ${allFiles.length} files. Deleting old ingested documents first...`);

      await db.transaction('rw', db.documents, async () => {
        const oldIngestedDocs = await db.documents.where('owner').equals('Ingested').primaryKeys();
        if (oldIngestedDocs.length > 0) {
          await db.documents.bulkDelete(oldIngestedDocs);
        }
      });

      setIngestionStatus(`Old documents cleared. Processing ${allFiles.length} new files...`);
      const newDocuments: IAegisDocument[] = [];
      let processedCount = 0;

      for (const file of allFiles) {
        processedCount++;
        setIngestionStatus(`(${processedCount}/${allFiles.length}) Processing: ${file.name}`);
        let extractedText = '';
        if (file.type.startsWith('image/') && ocrService.isReady) {
            try {
                extractedText = await ocrService.recognize(file);
            } catch (ocrError) {
                console.warn(`OCR failed for ${file.name}, proceeding without text.`);
            }
        }
        const combinedTextForNlp = `${file.name.replace(/[._-]/g, ' ')} ${extractedText}`;
        const entities = nlpService.extractEntities(combinedTextForNlp);
        const tags = entities.map(e => e.text.toLowerCase());

        newDocuments.push({
          title: file.name.split('.').slice(0, -1).join('.'),
          docNumber: `INGEST-${(file as any).fullPath}`,
          revision: 1,
          owner: 'Ingested', status: 'Draft', nextReviewDate: new Date(),
          tags: tags.length > 0 ? [...new Set(tags)] : ['ingested'],
        });
      }
      
      await db.documents.bulkAdd(newDocuments);
      setIngestionStatus(`Complete! ${allFiles.length} documents added.`);
      fetchDocuments();
      setTimeout(() => setIngestionStatus(''), 4000);

    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setIngestionStatus('Folder selection cancelled.');
      } else {
        console.error('One-Click Audit failed:', err);
        setIngestionStatus('Ingestion failed. See console for details.');
      }
      setTimeout(() => setIngestionStatus(''), 4000);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Automated Audit Management Hub</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={handleOpenModal}>Plan New Audit</Button>
        <Button variant="outlined" color="primary" onClick={handleOneClickAudit}>
          'One-Click Audit' from Folder
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSeedDatabase}>
          Seed Sample Data
        </Button>
        <Button variant="contained" color="error" onClick={handleClearDatabase}>
          Clear All Data
        </Button>
      </Box>

      {ingestionStatus && <Alert severity="info" sx={{ mb: 2 }}>{ingestionStatus}</Alert>}

      {isLoading ? ( <CircularProgress /> ) : (
        <List>
          {audits.map((audit) => (
            <ListItem key={audit.id} divider>
              <ListItemText
                primary={audit.auditName}
                secondary={`Status: ${audit.status} | Scheduled for: ${new Date(audit.scheduledDate).toLocaleDateString()}`}
              />
              <Chip label={audit.riskLevel} color={getRiskColor(audit.riskLevel)} size="small" />
            </ListItem>
          ))}
        </List>
      )}
      
      <AddAuditModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Paper>
  );
}