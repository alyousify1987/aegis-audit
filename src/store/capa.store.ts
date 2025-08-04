// src/store/capa.store.ts
import { create } from 'zustand';
import { db, addEncrypted, whereDecrypted } from '../services/db.service';
import type { ICapaAction } from '../services/db.service';

interface CapaState {
  capaActions: ICapaAction[];
  isLoading: boolean;
  fetchActionsForNcr: (ncrId: number) => Promise<void>;
  updateActionStatus: (actionId: number, newStatus: ICapaAction['status']) => Promise<void>;
  addAction: (newAction: Omit<ICapaAction, 'id'>) => Promise<void>;
}

export const useCapaStore = create<CapaState>((set, get) => ({
  capaActions: [],
  isLoading: true,
  fetchActionsForNcr: async (ncrId: number) => {
    set({ isLoading: true, capaActions: [] });
    try {
      const actions = await whereDecrypted(db.capaActions, 'ncrId', ncrId);
      set({ capaActions: actions, isLoading: false });
    } catch (error) {
      console.error('Error fetching CAPA actions:', error);
      set({ isLoading: false }); // Ensure isLoading is set to false even on error
    }
  },
  updateActionStatus: async (actionId, newStatus) => {
    try {
      await db.capaActions.update(actionId, { status: newStatus });
      // Use set to update the state directly based on the previous state
      set(state => {
        // Find the updated action in the current state
        const updatedCapaActions = state.capaActions.map(action =>
          action.id === actionId ? { ...action, status: newStatus } : action
        );
        return { capaActions: updatedCapaActions };
      });

      // Fetch the updated actions to ensure data consistency
      const currentActions = get().capaActions;
      if (currentActions.length > 0) {
        const firstAction = currentActions[0];
        get().fetchActionsForNcr(firstAction.ncrId);
      }
    } catch (error) {
      console.error('Error updating CAPA action status:', error);
    }
  },
  addAction: async (newActionData) => {
    try {
      await addEncrypted(db.capaActions, newActionData as ICapaAction);
      get().fetchActionsForNcr(newActionData.ncrId);
    } catch (error) {
      console.error('Error adding CAPA action:', error);
    }
  },
}));