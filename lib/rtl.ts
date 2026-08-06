import { DevSettings, I18nManager, Platform, TextStyle, ViewStyle } from 'react-native';

/**
 * The UI is authored visually for Arabic: rows use `row-reverse` and text uses
 * `textAlign: 'right'`. Auto-mirroring on top of that would flip everything back,
 * so the layout engine is pinned to LTR and we control direction explicitly.
 * Returns true when a reload is needed to drop a previously forced RTL flag.
 */
export function enableArabicRTL(): boolean {
  if (I18nManager.isRTL) {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    return Platform.OS !== 'web';
  }
  I18nManager.allowRTL(false);
  return false;
}

export function reloadForRTL(): void {
  if (Platform.OS === 'web') return;
  try {
    DevSettings.reload();
  } catch {
    // Production builds without DevSettings — the flag applies on next launch.
  }
}

/** Row read right-to-left: first child renders on the visual right. */
export const rowAr: ViewStyle = {
  flexDirection: 'row-reverse',
  alignItems: 'center',
};

export const rowArBetween: ViewStyle = {
  flexDirection: 'row-reverse',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const textAr: TextStyle = {
  textAlign: 'right',
  writingDirection: 'rtl',
};

export const textArCenter: TextStyle = {
  textAlign: 'center',
  writingDirection: 'rtl',
};
