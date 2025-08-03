// src/store/checklist.store.ts
import { create } from 'zustand';
import { db } from '../services/db.service';
import type { IChecklist, IChecklistItem } from '../services/db.service';
interface ChecklistState {
  checklist: IChecklist | null;
  checklistItems: IChecklistItem[];
  isLoading: boolean;
  fetchChecklistForAudit: (auditId: number) => Promise<void>;
  updateChecklistItemStatus: (itemId: number, newStatus: IChecklistItem['status']) => Promise<void>;
}
export const useChecklistStore = create<ChecklistState>((set, get) => ({
  checklist: null,
  checklistItems: [],
  isLoading: true,
  fetchChecklistForAudit: async (auditId: number) => {
    set({ isLoading: true, checklist: null, checklistItems: [] });
    const checklist = await db.checklists.where('auditId').equals(auditId).first();
    if (checklist) {
      const items = await db.checklistItems.where('checklistId').equals(checklist.id!).toArray();
      set({ checklist, checklistItems: items, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
  updateChecklistItemStatus: async (itemId, newStatus) => {
    await db.checklistItems.update(itemId, { status: newStatus });
    const currentChecklist = get().checklist;
    if (currentChecklist) {
      const items = await db.checklistItems.where('checklistId').equals(currentChecklist.id!).toArray();
      set({ checklistItems: items });
    }
  },
}));