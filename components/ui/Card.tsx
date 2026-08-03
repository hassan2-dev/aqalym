import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
}

export function Card({ children, onPress, style, padded = true }: CardProps) {
  const { colors, isDark } = useAppTheme();
  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowOpacity: isDark ? 0 : 0.06,
        },
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#1E275E',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 3,
    overflow: 'hidden',
  },
  padded: {
    padding: 16,
  },
});
