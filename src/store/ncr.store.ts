// src/store/ncr.store.ts

import { create } from 'zustand';
import { db } from '../services/db.service';
import type { INonConformance } from '../services/db.service';

// 1. Define the shape of the NCR state and its actions
interface NcrState {
  ncrs: INonConformance[];
  isLoading: boolean;
  fetchNcrs: () => Promise<void>;
  addNcr: (newNcr: Omit<INonConformance, 'id'>) => Promise<void>;
}

// 2. Create the Zustand store for Non-Conformances
export const useNcrStore = create<NcrState>((set, get) => ({
  // --- STATE ---
  ncrs: [],
  isLoading: true,

  // --- ACTIONS ---
  fetchNcrs: async () => {
    set({ isLoading: true });
    const ncrsFromDb = await db.nonConformances.toArray();
    set({ ncrs: ncrsFromDb, isLoading: false });
  },

  addNcr: async (newNcrData) => {
    // Save the new NCR to the database
    await db.nonConformances.add(newNcrData as INonConformance);
    // Refresh the state for all components by calling the fetch action
    get().fetchNcrs();
  },
}));