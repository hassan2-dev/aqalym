import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { User } from '@/types/models';
import * as authService from '@/services/auth';

interface AuthState {
  user: User | null;
  hydrated: boolean;
  pendingPhone: string | null;
  setUser: (user: User | null) => void;
  setPendingPhone: (phone: string | null) => void;
  bootstrap: () => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hydrated: false,
      pendingPhone: null,
      setUser: (user) => set({ user }),
      setPendingPhone: (pendingPhone) => set({ pendingPhone }),
      bootstrap: async () => {
        const session = await authService.getStoredSession();
        set({ user: session, hydrated: true });
      },
      sendOtp: async (phone) => {
        const result = await authService.sendOtp(phone);
        set({ pendingPhone: result.phone });
      },
      verifyOtp: async (code) => {
        const user = await authService.verifyOtp(code);
        set({ user, pendingPhone: null });
        return user;
      },
      logout: async () => {
        await authService.signOut();
        set({ user: null, pendingPhone: null });
      },
      updateProfile: async (patch) => {
        const current = get().user;
        if (!current) return;
        const updated = { ...current, ...patch, updatedAt: new Date().toISOString() };
        const { upsertUser } = await import('@/services/catalog');
        await upsertUser(updated);
        set({ user: updated });
      },
    }),
    {
      name: '@aqalym/auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hydrated: true });
      },
    },
  ),
);
