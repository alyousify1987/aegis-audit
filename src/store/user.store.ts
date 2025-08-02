// src/store/user.store.ts

import { create } from 'zustand';

// 1. Define the shape of our state and the actions that can change it
interface UserState {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

// 2. Create the store
export const useUserStore = create<UserState>((set) => ({
  // Initial state
  isLoggedIn: false,
  username: null,
  
  // Actions
  login: (username) => set({ isLoggedIn: true, username: username }),
  logout: () => set({ isLoggedIn: false, username: null }),
}));