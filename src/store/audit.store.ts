// src/store/audit.store.ts
import { create } from 'zustand';
import { db } from '../services/db.service';
import type { IAudit } from '../services/db.service';
interface AuditState { audits: IAudit[]; isLoading: boolean; fetchAudits: () => Promise<void>; addAudit: (newAudit: Omit<IAudit, 'id'>) => Promise<void>; }
export const useAuditStore = create<AuditState>((set, get) => ({
  audits: [], isLoading: true,
  fetchAudits: async () => { set({ isLoading: true }); const auditsFromDb = await db.audits.toArray(); set({ audits: auditsFromDb, isLoading: false }); },
  addAudit: async (newAuditData) => { await db.audits.add(newAuditData as IAudit); get().fetchAudits(); },
}));