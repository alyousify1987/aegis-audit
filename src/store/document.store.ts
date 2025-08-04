// src/store/document.store.ts
import { create } from 'zustand';
import { db, addEncrypted, toArrayDecrypted } from '../services/db.service';
import type { IAegisDocument } from '../services/db.service';
import { ruleService } from '../services/rule.service';
interface DocumentState { documents: IAegisDocument[]; alerts: Record<number, string[]>; isLoading: boolean; searchTerm: string; statusFilter: 'All' | 'Draft' | 'Published' | 'Archived'; filteredDocuments: () => IAegisDocument[]; fetchDocuments: () => Promise<void>; addDocument: (newDoc: Omit<IAegisDocument, 'id'>) => Promise<void>; setSearchTerm: (term: string) => void; setStatusFilter: (status: 'All' | 'Draft' | 'Published' | 'Archived') => void; }
export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [], alerts: {}, isLoading: true, searchTerm: '', statusFilter: 'All',
  filteredDocuments: () => {
    const { documents, searchTerm, statusFilter } = get();
    if (!documents) return [];
    return documents.filter((doc: IAegisDocument) => (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase())) && (statusFilter === 'All' || doc.status === statusFilter));
  },
  fetchDocuments: async () => { set({ isLoading: true }); const docsFromDb = await toArrayDecrypted(db.documents); const newAlerts: Record<number, string[]> = {}; for (const doc of docsFromDb) { if (doc.id) { const results = await ruleService.checkDocument(doc); if (results.length > 0) { newAlerts[doc.id] = results; } } } set({ documents: docsFromDb, alerts: newAlerts, isLoading: false }); },
  addDocument: async (newDocData) => { await addEncrypted(db.documents, newDocData as IAegisDocument); get().fetchDocuments(); },
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));