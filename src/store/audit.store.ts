// src/store/audit.store.ts
import { create } from 'zustand';
import { db, addEncrypted, getDecrypted, toArrayDecrypted } from '../services/db.service';
import type { IAudit } from '../services/db.service';
interface AuditState {
  audits: IAudit[];
  isLoading: boolean;
  selectedAudit: IAudit | null;
  fetchAudits: () => Promise<void>;
  addAudit: (newAudit: Omit<IAudit, 'id'>) => Promise<void>;
  selectAudit: (auditId: number) => Promise<void>;
  clearSelectedAudit: () => void;
  startAudit: (auditId: number) => Promise<void>;
  completeAudit: (auditId: number) => Promise<void>;
  reopenAudit: (auditId: number) => Promise<void>;
}
export const useAuditStore = create<AuditState>((set, get) => ({
  audits: [], isLoading: true, selectedAudit: null,
  fetchAudits: async () => { set({ isLoading: true }); const auditsFromDb = await toArrayDecrypted(db.audits); set({ audits: auditsFromDb, isLoading: false }); },
  addAudit: async (newAuditData) => {
    await addEncrypted(db.audits, newAuditData as IAudit);
    await get().fetchAudits();
  },
  selectAudit: async (auditId: number) => { set({ isLoading: true, selectedAudit: null }); const audit = await getDecrypted(db.audits, auditId); set({ selectedAudit: audit || null, isLoading: false }); },
  clearSelectedAudit: () => { set({ selectedAudit: null }); },

  startAudit: async (auditId: number) => {
    await db.audits.update(auditId, { status: 'In Progress' });
    await get().fetchAudits();
    if (get().selectedAudit?.id === auditId) {
      set({ selectedAudit: { ...get().selectedAudit!, status: 'In Progress' } });
    }
  },

  completeAudit: async (auditId: number) => {
    await db.audits.update(auditId, { status: 'Completed' });
    await get().fetchAudits();
    if (get().selectedAudit?.id === auditId) {
      set({ selectedAudit: { ...get().selectedAudit!, status: 'Completed' } });
    }
  },

  reopenAudit: async (auditId: number) => {
    await db.audits.update(auditId, { status: 'Planned' });
    await get().fetchAudits();
    if (get().selectedAudit?.id === auditId) {
      set({ selectedAudit: { ...get().selectedAudit!, status: 'Planned' } });
    }
  },
}));