import { I18nManager, TextStyle, ViewStyle } from 'react-native';

/** Ensure app layout is Arabic RTL. Call once at startup. */
export function enableArabicRTL(): boolean {
  I18nManager.allowRTL(true);
  if (!I18nManager.isRTL) {
    I18nManager.forceRTL(true);
    return true; // needs reload
  }
  return false;
}

export const isRTL = () => I18nManager.isRTL;

/** Row that respects system RTL (do not use row-reverse). */
export const row: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

export const rowBetween: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

/** Arabic text alignment — physical right. */
export const textAr: TextStyle = {
  textAlign: 'right',
  writingDirection: 'rtl',
};

export const textArCenter: TextStyle = {
  textAlign: 'center',
  writingDirection: 'rtl',
};
