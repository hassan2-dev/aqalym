import { StyleSheet, Text, View } from 'react-native';

import { ORDER_STATUS_META } from '@/constants/theme';
import type { OrderStatus } from '@/types/models';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status] ?? ORDER_STATUS_META.submitted;

  return (
    <View style={[styles.badge, { backgroundColor: meta.bg }]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.text, { color: meta.color }]}>{meta.labelAr}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 12,
    writingDirection: 'rtl',
  },
});
