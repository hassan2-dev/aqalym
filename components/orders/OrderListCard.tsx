import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { ar } from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { formatDateAr, formatIQD } from '@/lib/format';
import type { Order } from '@/types/models';

export function OrderListCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const { colors, isDark } = useAppTheme();
  const isReady = order.orderKind === 'ready';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowOpacity: isDark ? 0 : 0.06,
        },
      ]}
    >
      <View style={styles.top}>
        <View style={styles.topRight}>
          <Text style={[styles.orderNumber, { color: Colors.primary }]}>{order.orderNumber}</Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>{formatDateAr(order.createdAt)}</Text>
          <Text style={styles.kindBadge}>
            {isReady ? ar.orders.readyOrder : ar.orders.customOrder}
          </Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.body}>
        {order.productImage ? (
          <Image source={{ uri: order.productImage }} style={styles.thumb} contentFit="cover" />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder, { backgroundColor: isDark ? '#2A2D36' : '#F0F1F5' }]}>
            <Ionicons name="cube-outline" size={24} color={Colors.primary} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={[styles.product, { color: Colors.primary }]} numberOfLines={1}>
            {order.productName}
          </Text>
          <Text style={styles.category}>{order.categoryName}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            {isReady
              ? `${ar.products.standardSize} ${order.measurements.width}×${order.measurements.height} سم · الكمية ${order.measurements.quantity}`
              : `${order.measurements.width}×${order.measurements.height} سم · الكمية ${order.measurements.quantity}`}
          </Text>
          {isReady && order.estimatedPrice > 0 ? (
            <Text style={styles.price}>
              {formatIQD(order.estimatedPrice)} {ar.orders.iqd}
            </Text>
          ) : null}
        </View>

        <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#1E275E',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  topRight: {
    flex: 1,
    gap: 2,
  },
  orderNumber: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  date: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 11,
    textAlign: 'right',
  },
  kindBadge: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 11,
    color: '#B08A5A',
    textAlign: 'right',
    marginTop: 2,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  product: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 15,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  category: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    color: '#B08A5A',
    textAlign: 'right',
  },
  meta: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 11,
    textAlign: 'right',
  },
  price: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 13,
    color: Colors.primary,
    textAlign: 'right',
    marginTop: 2,
  },
});
