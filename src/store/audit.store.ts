// src/store/audit.store.ts
import { create } from 'zustand';
import { db } from '../services/db.service';
import type { IAudit } from '../services/db.service';
interface AuditState { audits: IAudit[]; isLoading: boolean; selectedAudit: IAudit | null; fetchAudits: () => Promise<void>; addAudit: (newAudit: Omit<IAudit, 'id'>) => Promise<void>; selectAudit: (auditId: number) => Promise<void>; clearSelectedAudit: () => void; }
export const useAuditStore = create<AuditState>((set, get) => ({
  audits: [], isLoading: true, selectedAudit: null,
  fetchAudits: async () => { set({ isLoading: true }); const auditsFromDb = await db.audits.toArray(); set({ audits: auditsFromDb, isLoading: false }); },
  addAudit: async (newAuditData) => { await db.audits.add(newAuditData as IAudit); get().fetchAudits(); },
  selectAudit: async (auditId: number) => { set({ isLoading: true, selectedAudit: null }); const audit = await db.audits.get(auditId); set({ selectedAudit: audit || null, isLoading: false }); },
  clearSelectedAudit: () => { set({ selectedAudit: null }); },
}));