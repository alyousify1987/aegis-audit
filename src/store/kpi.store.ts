// src/store/kpi.store.ts

import { create } from 'zustand';
import { db } from '../services/db.service';
import type { IKpi } from '../services/db.service';

// 1. Define the shape of the KPI state and actions
interface KpiState {
  kpis: IKpi[];
  isLoading: boolean;
  fetchKpis: () => Promise<void>;
}

// 2. Create the Zustand store for KPIs
export const useKpiStore = create<KpiState>((set) => ({
  // --- STATE ---
  kpis: [],
  isLoading: true,

  // --- ACTIONS ---
  fetchKpis: async () => {
    set({ isLoading: true });
    const kpisFromDb = await db.kpis.toArray();
    set({ kpis: kpisFromDb, isLoading: false });
  },
}));