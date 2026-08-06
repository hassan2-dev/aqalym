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
      {/* First in RTL row = visual right (start) */}
      <BrandLogo variant="header" />
      <View style={styles.flex} />
      <Pressable onPress={onNotifications} hitSlop={12} style={styles.iconBtn}>
        <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  flex: {
    flex: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
