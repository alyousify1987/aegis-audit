// src/store/kpi.store.ts

import { create } from 'zustand';
import { db } from '../services/db.service';
import type { IKpi } from '../services/db.service';

// 1. Define the shape of the KPI state and actions
interface KpiState {
  kpis: IKpi[];
  isLoading: boolean;
  fetchKpis: () => Promise<void>;
  // --- START OF CHANGE ---
  // Add the new action for updating a KPI
  updateKpi: (kpiId: number, newValue: number) => Promise<void>;
  // --- END OF CHANGE ---
}

// 2. Create the Zustand store for KPIs
export const useKpiStore = create<KpiState>((set, get) => ({
  // --- STATE ---
  kpis: [],
  isLoading: true,

  // --- ACTIONS ---
  fetchKpis: async () => {
    set({ isLoading: true });
    const kpisFromDb = await db.kpis.toArray();
    set({ kpis: kpisFromDb, isLoading: false });
  },

  // --- START OF CHANGE ---
  // Implement the new updateKpi action
  updateKpi: async (kpiId, newValue) => {
    // Use Dexie's update method to change only the 'value' of the specified KPI
    await db.kpis.update(kpiId, { value: newValue });
    // Refresh the state for all components by calling the fetch action
    get().fetchKpis();
  },
  // --- END OF CHANGE ---
}));