// src/store/evidence.store.ts

import { create } from 'zustand';
import { db } from '../services/db.service';
import type { IEvidence, IAegisDocument } from '../services/db.service';

interface EvidenceState {
  evidenceMap: Map<number, IEvidence[]>; // Maps checklistItemId to its evidence
  isLoading: boolean;
  fetchEvidenceForChecklistItem: (checklistItemId: number) => Promise<void>;
  addEvidence: (newEvidence: Omit<IEvidence, 'id'>) => Promise<void>;
  getLinkedDocument: (documentId: number) => Promise<IAegisDocument | undefined>;
}

export const useEvidenceStore = create<EvidenceState>((set, get) => ({
  evidenceMap: new Map(),
  isLoading: false,

  fetchEvidenceForChecklistItem: async (checklistItemId: number) => {
    set({ isLoading: true });
    const evidenceItems = await db.evidence.where('checklistItemId').equals(checklistItemId).toArray();
    set(state => ({
      evidenceMap: new Map(state.evidenceMap).set(checklistItemId, evidenceItems),
      isLoading: false,
    }));
  },

  addEvidence: async (newEvidenceData) => {
    await db.evidence.add(newEvidenceData as IEvidence);
    // Re-fetch evidence for the specific item that was updated
    get().fetchEvidenceForChecklistItem(newEvidenceData.checklistItemId);
  },

  // Helper to get document details from the document table
  getLinkedDocument: async (documentId: number) => {
    return await db.documents.get(documentId);
  },
}));