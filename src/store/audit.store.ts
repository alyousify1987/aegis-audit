// src/store/audit.store.ts

import { create } from 'zustand';
import { db } from '../services/db.service';
import type { IAudit } from '../services/db.service';

// 1. Define the shape of the audit state and actions
interface AuditState {
  audits: IAudit[];
  isLoading: boolean;
  // --- START OF CHANGES ---
  // Add state to hold the currently selected audit
  selectedAudit: IAudit | null;
  // --- END OF CHANGES ---
  fetchAudits: () => Promise<void>;
  addAudit: (newAudit: Omit<IAudit, 'id'>) => Promise<void>;
  // --- START OF CHANGES ---
  // Add actions to select and clear the selected audit
  selectAudit: (auditId: number) => Promise<void>;
  clearSelectedAudit: () => void;
  // --- END OF CHANGES ---
}

// 2. Create the Zustand store for audits
export const useAuditStore = create<AuditState>((set, get) => ({
  // --- STATE ---
  audits: [],
  isLoading: true,
  selectedAudit: null,

  // --- ACTIONS ---
  fetchAudits: async () => {
    set({ isLoading: true });
    const auditsFromDb = await db.audits.toArray();
    set({ audits: auditsFromDb, isLoading: false });
  },

  addAudit: async (newAuditData) => {
    await db.audits.add(newAuditData as IAudit);
    get().fetchAudits();
  },

  // --- START OF CHANGES ---
  // Action to fetch a single audit by its ID and set it as the selected one
  selectAudit: async (auditId: number) => {
    set({ isLoading: true, selectedAudit: null });
    const audit = await db.audits.get(auditId);
    set({ selectedAudit: audit || null, isLoading: false });
  },

  // Action to clear the selection, which will take us back to the main list view
  clearSelectedAudit: () => {
    set({ selectedAudit: null });
  },
  // --- END OF CHANGES ---
}));