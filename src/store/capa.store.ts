// src/store/capa.store.ts

import { create } from 'zustand';
import { db } from '../services/db.service';
import type { ICapaAction } from '../services/db.service';

// 1. Define the shape of our CAPA state and actions
interface CapaState {
  capaActions: ICapaAction[];
  isLoading: boolean;
  fetchActionsForNcr: (ncrId: number) => Promise<void>;
  updateActionStatus: (actionId: number, newStatus: ICapaAction['status']) => Promise<void>;
  addAction: (newAction: Omit<ICapaAction, 'id'>) => Promise<void>;
}

// 2. Create the Zustand store
export const useCapaStore = create<CapaState>((set, get) => ({
  // --- STATE ---
  capaActions: [],
  isLoading: true,

  // --- ACTIONS ---

  // Fetches all CAPA items that belong to a specific Non-Conformance
  fetchActionsForNcr: async (ncrId: number) => {
    set({ isLoading: true, capaActions: [] });
    const actions = await db.capaActions.where('ncrId').equals(ncrId).toArray();
    set({ capaActions: actions, isLoading: false });
  },

  // Action to update the status of a single CAPA item
  updateActionStatus: async (actionId, newStatus) => {
    await db.capaActions.update(actionId, { status: newStatus });
    
    // After updating, re-fetch the data to ensure the UI is in sync.
    const firstAction = get().capaActions[0];
    if (firstAction) {
      get().fetchActionsForNcr(firstAction.ncrId);
    }
  },
  
  // Action to add a new CAPA item
  addAction: async (newActionData) => {
    await db.capaActions.add(newActionData as ICapaAction);
    get().fetchActionsForNcr(newActionData.ncrId);
  }
}));