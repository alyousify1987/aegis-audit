// src/store/audit.store.ts

import { create } from 'zustand';
import { db } from '../services/db.service';
import type { IAudit } from '../services/db.service';

// 1. Define the shape of the audit state and actions
interface AuditState {
  audits: IAudit[];
  isLoading: boolean;
  fetchAudits: () => Promise<void>;
  addAudit: (newAudit: Omit<IAudit, 'id'>) => Promise<void>;
}

// 2. Create the Zustand store for audits
export const useAuditStore = create<AuditState>((set) => ({
  // --- STATE ---
  audits: [],
  isLoading: true,

  // --- ACTIONS ---
  fetchAudits: async () => {
    set({ isLoading: true });
    const auditsFromDb = await db.audits.toArray();
    set({ audits: auditsFromDb, isLoading: false });
  },

  addAudit: async (newAuditData) => {
    await db.audits.add(newAuditData as IAudit);
    // After adding, call fetchAudits to refresh the state for all components
    useAuditStore.getState().fetchAudits();
  },
}));