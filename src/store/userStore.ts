import { create } from "zustand";
import { User, UserRole } from "../types/user";

interface UserStore {
  user: User | null;
  token: string | null;
  isWalletConnected: boolean;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
  setWalletConnected: (connected: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  isWalletConnected: false,
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null, isWalletConnected: false }),
  setWalletConnected: (connected) => set({ isWalletConnected: connected }),
}));
