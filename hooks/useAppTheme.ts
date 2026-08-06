import { Colors } from '@/constants/theme';

/** Light-mode only — Arabic retail app does not ship a dark theme. */
export function useAppTheme() {
  const colors = {
    background: Colors.background,
    card: Colors.card,
    border: Colors.border,
    text: Colors.text.primary,
    textSecondary: Colors.text.secondary,
    textMuted: Colors.text.muted,
    primary: Colors.primary,
    secondary: Colors.secondary,
    accent: Colors.accent,
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    white: Colors.white,
  };

  return { colors };
}
