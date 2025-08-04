// src/store/kpi.store.ts

import { create } from 'zustand';
import { db, toArrayDecrypted } from '../services/db.service';
import type { IKpi } from '../services/db.service';

// 1. Define the shape of the KPI state and actions
interface KpiState {
  kpis: IKpi[];
  isLoading: boolean;
  fetchKpis: () => Promise<void>;
  updateKpi: (kpiId: number, newValue: number) => Promise<void>; // Changed newValue type to number
}

// 2. Create the Zustand store
export const useKpiStore = create<KpiState>((set, get) => ({
  kpis: [],
  isLoading: true,
  fetchKpis: async () => {
    set({ isLoading: true });
    try {
      const kpisFromDb = await toArrayDecrypted(db.kpis);
      set({ kpis: kpisFromDb, isLoading: false });
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      set({ isLoading: false });
    }
  },
  updateKpi: async (kpiId, newValue) => {
    try {
      await db.kpis.update(kpiId, { value: newValue }); // Update the value in the database
      // Refresh the state for all components by calling the fetch action
      get().fetchKpis();
    } catch (error) {
      console.error('Error updating KPI:', error);
    }
  },
}));