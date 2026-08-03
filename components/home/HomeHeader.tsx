import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/ui/BrandLogo';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

interface HomeHeaderProps {
  onNotifications?: () => void;
}

export function HomeHeader({ onNotifications }: HomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8, backgroundColor: colors.card }]}>
      <View style={styles.side} />

      <BrandLogo variant="header" />

      <Pressable onPress={onNotifications} hitSlop={12} style={styles.iconBtn}>
        <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  side: {
    width: 40,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
