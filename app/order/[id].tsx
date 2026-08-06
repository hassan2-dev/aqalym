import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ar } from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { useOrder } from '@/hooks/useCatalog';
import { useAppTheme } from '@/hooks/useAppTheme';
import { formatDateAr, formatIQD } from '@/lib/format';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppTheme();
  const { data: order, isLoading, isError, refetch } = useOrder(id ?? '');

  const cardStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    shadowOpacity: 0.06,
  };

  if (isLoading) {
    return (
      <View style={[styles.pad, { backgroundColor: colors.background, flex: 1 }]}>
        <Skeleton height={180} borderRadius={18} />
        <Skeleton height={24} width="60%" style={{ marginTop: 12 }} />
        <Skeleton height={140} borderRadius={18} style={{ marginTop: 12 }} />
      </View>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!order) return <EmptyState title="الطلب غير موجود" />;

  const isReady = order.orderKind === 'ready';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.pad}
      showsVerticalScrollIndicator={false}
    >
      {order.productImage ? (
        <Image source={{ uri: order.productImage }} style={styles.image} contentFit="cover" />
      ) : null}

      <View style={[styles.card, cardStyle]}>
        <View style={styles.row}>
          <Text style={[styles.orderNumber, { color: Colors.primary }]}>{order.orderNumber}</Text>
          <StatusBadge status={order.status} />
        </View>
        <Text style={styles.gold}>
          {isReady ? ar.orders.readyOrder : ar.orders.customOrder}
        </Text>
        <Text style={[styles.product, { color: Colors.primary }]}>{order.productName}</Text>
        <Text style={styles.gold}>{order.categoryName}</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {ar.orders.createdAt}: {formatDateAr(order.createdAt)}
        </Text>
        {isReady && order.estimatedPrice > 0 ? (
          <Text style={styles.price}>
            {formatIQD(order.estimatedPrice)} {ar.orders.iqd}
          </Text>
        ) : null}
      </View>

      <View style={[styles.card, cardStyle]}>
        <Text style={[styles.section, { color: Colors.primary }]}>
          {isReady ? ar.products.standardSize : 'القياسات'}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          العرض {order.measurements.width} سم · الارتفاع {order.measurements.height} سم · الكمية{' '}
          {order.measurements.quantity}
        </Text>
        {order.selectedVariant ? (
          <Text style={[styles.meta, { color: colors.textSecondary }]}>الخيار: {order.selectedVariant}</Text>
        ) : null}
        {order.selectedColor ? (
          <Text style={[styles.meta, { color: colors.textSecondary }]}>اللون: {order.selectedColor}</Text>
        ) : null}
      </View>

      <View style={[styles.card, cardStyle]}>
        <Text style={[styles.section, { color: Colors.primary }]}>موقع المشروع</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {order.location.governorate} — {order.location.city}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>{order.location.address}</Text>
        {order.notes ? (
          <Text style={[styles.meta, { color: colors.textSecondary }]}>ملاحظات: {order.notes}</Text>
        ) : null}
      </View>

      <View style={[styles.card, cardStyle]}>
        <Text style={[styles.section, { color: Colors.primary, marginBottom: 16 }]}>{ar.orders.timeline}</Text>
        <OrderTimeline status={order.status} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 20, paddingBottom: 40, gap: 12 },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 18,
  },
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 8,
    shadowColor: '#1E275E',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 15,
  },
  product: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  gold: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    color: '#B08A5A',
    textAlign: 'right',
  },
  meta: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 22,
  },
  price: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 18,
    color: Colors.primary,
    textAlign: 'right',
    marginTop: 6,
  },
  section: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 15,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
