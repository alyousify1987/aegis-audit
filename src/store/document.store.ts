// src/store/document.store.ts

import { create } from 'zustand';
import { db } from '../services/db.service';
import type { IAegisDocument } from '../services/db.service';
import { ruleService } from '../services/rule.service';

// 1. DEFINE THE STATE AND ACTIONS
interface DocumentState {
  documents: IAegisDocument[];
  alerts: Record<number, string[]>;
  isLoading: boolean;
  fetchDocuments: () => Promise<void>;
  addDocument: (newDoc: Omit<IAegisDocument, 'id'>) => Promise<void>;
}

// 2. CREATE THE ZUSTAND STORE
export const useDocumentStore = create<DocumentState>((set) => ({
  // --- STATE ---
  documents: [],
  alerts: {},
  isLoading: true,

  // --- ACTIONS ---
  fetchDocuments: async () => {
    set({ isLoading: true });
    const docsFromDb = await db.documents.toArray();
    
    const newAlerts: Record<number, string[]> = {};
    for (const doc of docsFromDb) {
      if (doc.id) {
        const results = await ruleService.checkDocument(doc);
        if (results.length > 0) {
          newAlerts[doc.id] = results;
        }
      }
    }
    
    set({ documents: docsFromDb, alerts: newAlerts, isLoading: false });
  },

  addDocument: async (newDocData) => {
    await db.documents.add(newDocData as IAegisDocument);
    // After adding, call the fetch action to get the latest state for all components
    useDocumentStore.getState().fetchDocuments();
  },
}));