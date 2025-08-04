// src/store/ncr.store.ts
import { create } from 'zustand';
import { db, addEncrypted, getDecrypted, toArrayDecrypted } from '../services/db.service';
import type { INonConformance } from '../services/db.service';
interface NcrState { ncrs: INonConformance[]; isLoading: boolean; selectedNcr: INonConformance | null; fetchNcrs: () => Promise<void>; addNcr: (newNcr: Omit<INonConformance, 'id'>) => Promise<void>; selectNcr: (ncrId: number) => Promise<void>; clearSelectedNcr: () => void; }
export const useNcrStore = create<NcrState>((set, get) => ({
  ncrs: [], isLoading: true, selectedNcr: null,
  fetchNcrs: async () => { set({ isLoading: true }); const ncrsFromDb = await toArrayDecrypted(db.nonConformances); set({ ncrs: ncrsFromDb, isLoading: false }); },
  addNcr: async (newNcrData) => { await addEncrypted(db.nonConformances, newNcrData as INonConformance); get().fetchNcrs(); },
  selectNcr: async (ncrId: number) => { set({ isLoading: true, selectedNcr: null }); const ncr = await getDecrypted(db.nonConformances, ncrId); set({ selectedNcr: ncr || null, isLoading: false }); },
  clearSelectedNcr: () => { set({ selectedNcr: null }); },
}));