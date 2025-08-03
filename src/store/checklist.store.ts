// src/store/checklist.store.ts

import { create } from 'zustand';
import { db } from '../services/db.service';
import type { IChecklist, IChecklistItem } from '../services/db.service';

// 1. Define the shape of our checklist state and actions
interface ChecklistState {
  checklist: IChecklist | null;
  checklistItems: IChecklistItem[];
  isLoading: boolean;
  fetchChecklistForAudit: (auditId: number) => Promise<void>;
  updateChecklistItemStatus: (itemId: number, newStatus: IChecklistItem['status']) => Promise<void>;
}

// 2. Create the Zustand store
export const useChecklistStore = create<ChecklistState>((set, get) => ({
  // --- STATE ---
  checklist: null,
  checklistItems: [],
  isLoading: true,

  // --- ACTIONS ---

  // Fetches the checklist and its items based on the ID of the parent audit
  fetchChecklistForAudit: async (auditId: number) => {
    set({ isLoading: true, checklist: null, checklistItems: [] });

    // Find the checklist that belongs to this audit.
    // In a real app, an audit might have multiple checklists, but for now we'll get the first one.
    const checklist = await db.checklists.where('auditId').equals(auditId).first();

    if (checklist) {
      // If we found a checklist, get all of its items.
      const items = await db.checklistItems.where('checklistId').equals(checklist.id!).toArray();
      set({ checklist, checklistItems: items, isLoading: false });
    } else {
      // If no checklist exists for this audit, set loading to false.
      set({ isLoading: false });
    }
  },

  // Action to update the status of a single checklist item
  updateChecklistItemStatus: async (itemId, newStatus) => {
    await db.checklistItems.update(itemId, { status: newStatus });
    
    // After updating, re-fetch the data to ensure the UI is in sync.
    const currentChecklist = get().checklist;
    if (currentChecklist) {
      const items = await db.checklistItems.where('checklistId').equals(currentChecklist.id!).toArray();
      set({ checklistItems: items });
    }
  },
}));