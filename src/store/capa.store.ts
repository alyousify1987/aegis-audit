// src/store/capa.store.ts
import { create } from 'zustand';
import { db } from '../services/db.service';
import type { ICapaAction } from '../services/db.service';
interface CapaState { capaActions: ICapaAction[]; isLoading: boolean; fetchActionsForNcr: (ncrId: number) => Promise<void>; updateActionStatus: (actionId: number, newStatus: ICapaAction['status']) => Promise<void>; addAction: (newAction: Omit<ICapaAction, 'id'>) => Promise<void>; }
export const useCapaStore = create<CapaState>((set, get) => ({
  capaActions: [], isLoading: true,
  fetchActionsForNcr: async (ncrId: number) => { set({ isLoading: true, capaActions: [] }); const actions = await db.capaActions.where('ncrId').equals(ncrId).toArray(); set({ capaActions: actions, isLoading: false }); },
  updateActionStatus: async (actionId, newStatus) => { await db.capaActions.update(actionId, { status: newStatus }); const firstAction = get().capaActions[0]; if (firstAction) { get().fetchActionsForNcr(firstAction.ncrId); } },
  addAction: async (newActionData) => { await db.capaActions.add(newActionData as ICapaAction); get().fetchActionsForNcr(newActionData.ncrId); }
}));