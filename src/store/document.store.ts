// src/store/document.store.ts

import { create } from 'zustand';
import { Document } from '../types/document.types';
import { db } from '../services/database.service'; // Now used
import { ocrService } from '../services/ocr.service'; // Now used
import { ruleService } from '../services/rule.service'; // Now used

// Define the interface for the state and actions
interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  alerts: { id: string; message: string; type: 'info' | 'warning' | 'error' }[];
  fetchDocuments: () => Promise<void>;
  addDocument: (newDocData: Omit<Document, 'id' | 'docNumber'>, file: File) => Promise<void>;
  clearAlerts: () => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  isLoading: false,
  alerts: [],

  // Fetches all documents from the IndexedDB
  fetchDocuments: async () => {
    set({ isLoading: true });
    try {
      const documents = await db.documents.toArray();
      set({ documents, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      set({
        isLoading: false,
        alerts: [...get().alerts, { id: 'fetch-error', message: 'Failed to load documents.', type: 'error' }],
      });
    }
  },

  // Adds a new document, performs OCR, and evaluates rules
  addDocument: async (newDocData, file) => {
    set({ isLoading: true });
    try {
      // 1. Perform OCR on the document file
      const textContent = await ocrService.recognize(file);

      // 2. Evaluate rules against the new document data
      const ruleResult = await ruleService.evaluate('document_creation', { ...newDocData, textContent });
      if (ruleResult.some(res => !res.result)) {
         console.warn('Document violates creation rules:', ruleResult);
         // You could create an alert here
      }

      // 3. Construct the full document object
      const fullDocument: Omit<Document, 'id'> = {
        ...newDocData,
        docNumber: `DOC-${Date.now()}`, // Generate a unique document number
        content: textContent,
      };

      // 4. Add the new document to the database
      await db.documents.add(fullDocument as Document);

      // 5. Refresh the document list from the database
      get().fetchDocuments();
       set({
        alerts: [...get().alerts, { id: `add-success-${Date.now()}`, message: 'Document added successfully.', type: 'info' }],
      });
    } catch (error) {
      console.error('Failed to add document:', error);
      set({
        isLoading: false,
        alerts: [...get().alerts, { id: `add-error-${Date.now()}`, message: 'Failed to add document.', type: 'error' }],
      });
    } finally {
        set({ isLoading: false });
    }
  },

  // Clears all alerts
  clearAlerts: () => {
    set({ alerts: [] });
  }
}));