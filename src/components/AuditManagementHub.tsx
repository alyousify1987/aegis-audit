// src/components/AuditManagementHub.tsx

import { useEffect, useState } from 'react'; // Keep useState for ingestionStatus
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, Chip, Alert } from '@mui/material';
// --- START OF CHANGES ---
// Import our new audit store and the document store for refresh
import { useAuditStore } from '../store/audit.store';
import { useDocumentStore } from '../store/document.store';
// Keep db services for utility functions, but not for fetching data in this component
import { clearTransactionalData, seedInitialData, db } from '../services/db.service';
import type { IAegisDocument } from '../services/db.service'; // Keep for one-click audit
// Other services remain the same
import { ocrService } from '../services/ocr.service';
import { nlpService } from '../services/nlp.service';
// eventBus is no longer needed for data refresh
// --- END OF CHANGES ---


// Helper functions (getRiskColor, getAllFiles) remain unchanged
const getRiskColor = (riskLevel: 'High' | 'Medium' | 'Low') => {
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
  // --- START OF CHANGES ---
  // 1. Get state and actions from the Zustand store.
  const { audits, isLoading, fetchAudits, addAudit } = useAuditStore();
  // We also need the document fetch action for our utility buttons
  const fetchDocuments = useDocumentStore(state => state.fetchDocuments);

  // We only keep local state for things specific to this component, like the ingestion status message.
  const [ingestionStatus, setIngestionStatus] = useState('');

  // 2. The useEffect is now simple and only fetches audits on mount.
  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  // 3. The handler now calls the simple 'addAudit' action from the store.
  const handleAddAudit = async () => {
    const newAudit = {
      auditName: `New Department Audit #${Math.floor(Math.random() * 100)}`,
      status: 'Planned',
      riskLevel: 'Low' as 'Low' | 'Medium' | 'High',
      scheduledDate: new Date(),
    };
    await addAudit(newAudit);
  };

  // 4. Utility functions now call the store actions directly instead of using eventBus.
  //    This is more explicit and robust.
  const handleClearDatabase = async () => {
    setIngestionStatus("Clearing all transactional data...");
    await clearTransactionalData();
    setIngestionStatus("Database cleared. Refreshing all hubs...");
    fetchDocuments(); // Refresh documents
    fetchAudits();    // Refresh audits
    setTimeout(() => setIngestionStatus(''), 4000);
  };
  
  const handleSeedDatabase = async () => {
    setIngestionStatus("Seeding sample data...");
    await seedInitialData();
    setIngestionStatus("Sample data added. Refreshing all hubs...");
    fetchDocuments(); // Refresh documents
    fetchAudits();    // Refresh audits
    setTimeout(() => setIngestionStatus(''), 4000);
  };
  
  // 5. One-Click Audit now refreshes the document store directly.
  const handleOneClickAudit = async () => {
    // This function's internal logic remains the same
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
          owner: 'Ingested', status: 'Draft', nextReviewDate: new Date(),
          tags: tags.length > 0 ? [...new Set(tags)] : ['ingested'],
        });
      }
      
      await db.documents.bulkAdd(newDocuments);
      setIngestionStatus(`Complete! ${allFiles.length} documents added.`);
      fetchDocuments(); // Refresh documents directly
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
  // --- END OF CHANGES ---

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, mt: 2 }}>
      <Typography variant="h6">Automated Audit Management Hub</Typography>
      <Box sx={{ display: 'flex', gap: 2, my: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={handleAddAudit}>Plan New Audit</Button>
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

      {ingestionStatus && <Alert severity="info" sx={{ mt: 2 }}>{ingestionStatus}</Alert>}

      {/* The JSX display logic is now driven by the central store */}
      {isLoading ? ( <CircularProgress /> ) : (
        <List>
          {audits.map((audit) => (
            <ListItem key={audit.id} divider>
              <ListItemText
                primary={audit.auditName}
                secondary={`Status: ${audit.status} | Scheduled for: ${audit.scheduledDate.toLocaleDateString()}`}
              />
              <Chip label={audit.riskLevel} color={getRiskColor(audit.riskLevel)} size="small" />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

declare global {
  interface Window { showDirectoryPicker(): Promise<any>; }
}