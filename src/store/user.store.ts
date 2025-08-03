// src/store/user.store.ts

import { create } from 'zustand';

interface UserState {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  username: null,
  
  login: (username) => set({ isLoggedIn: true, username: username }),
  logout: () => {
    // Also clear the selected items from other stores upon logout
    useAuditStore.getState().clearSelectedAudit();
    useNcrStore.getState().clearSelectedNcr();
    set({ isLoggedIn: false, username: null });
  },
}));

// We need to import the other stores here to avoid circular dependency issues
import { useAuditStore } from './audit.store';
import { useNcrStore } from './ncr.store';