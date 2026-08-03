import { useColorScheme as useSystemScheme } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '@/constants/theme';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: '@aqalym/theme',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useAppTheme() {
  const system = useSystemScheme();
  const mode = useThemeStore((s) => s.mode);
  const isDark = mode === 'dark' || (mode === 'system' && system === 'dark');

  const colors = {
    background: isDark ? Colors.dark.background : Colors.background,
    card: isDark ? Colors.dark.card : Colors.card,
    border: isDark ? Colors.dark.border : Colors.border,
    text: isDark ? Colors.dark.text.primary : Colors.text.primary,
    textSecondary: isDark ? Colors.dark.text.secondary : Colors.text.secondary,
    textMuted: isDark ? Colors.dark.text.muted : Colors.text.muted,
    primary: Colors.primary,
    secondary: Colors.secondary,
    accent: Colors.accent,
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    white: Colors.white,
  };

  return { isDark, colors, mode };
}
