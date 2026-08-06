import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ar } from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { useCreateOrder, useProduct } from '@/hooks/useCatalog';
import { useAppTheme } from '@/hooks/useAppTheme';
import { formatIQD } from '@/lib/format';
import { notifyOrderSubmitted } from '@/services/notifications';
import { useAuthStore } from '@/stores/authStore';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { data: product, isLoading, isError, refetch } = useProduct(id ?? '');
  const user = useAuthStore((s) => s.user);
  const createOrder = useCreateOrder();
  const [qty, setQty] = useState(1);
  const [ordering, setOrdering] = useState(false);

  if (isLoading) {
    return (
      <View style={[styles.pad, { backgroundColor: colors.background, flex: 1 }]}>
        <Skeleton height={260} borderRadius={18} />
        <Skeleton height={28} width="70%" style={{ marginTop: 16 }} />
        <Skeleton height={80} borderRadius={14} style={{ marginTop: 12 }} />
      </View>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!product || product.kind !== 'ready') {
    return <EmptyState title="المنتج غير موجود" />;
  }

  const unitPrice = product.estimatedPrice;
  const total = unitPrice * qty;
  const w = product.minimumWidth;
  const h = product.minimumHeight;

  const cardBg = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    shadowOpacity: 0.06,
  };

  const onOrder = async () => {
    if (!user) {
      Alert.alert(ar.products.loginRequired, undefined, [
        { text: ar.common.cancel, style: 'cancel' },
        { text: ar.profile.login, onPress: () => router.push('/login') },
      ]);
      return;
    }

    try {
      setOrdering(true);
      const order = await createOrder.mutateAsync({
        customerName: user.name || 'عميل أقاليم',
        customerPhone: user.phone,
        orderKind: 'ready',
        categoryId: product.categoryId,
        categorySlug: product.categorySlug,
        categoryName: ar.products.readyTitle,
        productId: product.id,
        productName: product.nameAr,
        productImage: product.images[0],
        measurements: { width: w, height: h, quantity: qty },
        selectedAccessories: [],
        selectedVariant: product.variants[0],
        location: {
          governorate: user.governorate || 'بغداد',
          city: user.city || 'المركز',
          address: 'يُحدد لاحقاً مع فريق أقاليم',
        },
        estimatedPrice: total,
        notes: `طلب منتج جاهز · الكمية ${qty}`,
      });
      await notifyOrderSubmitted(order.orderNumber);
      Alert.alert(ar.products.orderSuccess, order.orderNumber, [
        {
          text: ar.services.viewOrders,
          onPress: () => router.replace('/(tabs)/orders'),
        },
        { text: ar.common.close, onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert(ar.common.error);
    } finally {
      setOrdering(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={[styles.pad, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: product.images[0] }} style={styles.image} contentFit="cover" />

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{ar.home.readyBadge}</Text>
          </View>
          <View style={[styles.badge, styles.badgeGold]}>
            <Text style={styles.badgeGoldText}>{ar.home.fixedPrice}</Text>
          </View>
        </View>

        <Text style={[styles.name, { color: Colors.primary }]}>{product.nameAr}</Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>{product.descriptionAr}</Text>

        <View style={[styles.priceCard, cardBg]}>
          <Text style={styles.priceLabel}>{ar.products.fixedPrice}</Text>
          <Text style={styles.priceValue}>
            {formatIQD(unitPrice)} <Text style={styles.currency}>{ar.orders.iqd}</Text>
          </Text>
          <Text style={[styles.dimHint, { color: colors.textMuted }]}>
            {ar.products.standardSize}: {w}×{h} سم
          </Text>
        </View>

        <View style={[styles.sectionCard, cardBg]}>
          <Text style={[styles.sectionTitle, { color: Colors.primary }]}>{ar.products.specs}</Text>
          {product.specifications.map((s, idx) => (
            <View
              key={s.label}
              style={[
                styles.specRow,
                idx < product.specifications.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.specLabel, { color: Colors.primary }]}>{s.label}</Text>
              <Text style={[styles.specValue, { color: colors.textSecondary }]}>{s.value}</Text>
            </View>
          ))}
        </View>

        {product.variants.length ? (
          <View style={[styles.sectionCard, cardBg]}>
            <Text style={[styles.sectionTitle, { color: Colors.primary }]}>الخيارات</Text>
            <View style={styles.chips}>
              {product.variants.map((v) => (
                <View key={v} style={[styles.chip, { backgroundColor: '#F0F1F5' }]}>
                  <Text style={{ color: Colors.primary, fontFamily: 'IBMPlexSansArabic_500Medium', fontSize: 13 }}>
                    {v}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={[styles.sectionCard, cardBg]}>
          <Text style={[styles.sectionTitle, { color: Colors.primary }]}>{ar.products.quantity}</Text>
          <View style={styles.qtyRow}>
            <Pressable
              onPress={() => setQty((q) => Math.max(1, q - 1))}
              style={[styles.qtyBtn, { borderColor: colors.border }]}
            >
              <Ionicons name="remove" size={20} color={Colors.primary} />
            </Pressable>
            <Text style={[styles.qtyValue, { color: Colors.primary }]}>{qty}</Text>
            <Pressable
              onPress={() => setQty((q) => Math.min(50, q + 1))}
              style={[styles.qtyBtn, { borderColor: colors.border }]}
            >
              <Ionicons name="add" size={20} color={Colors.primary} />
            </Pressable>
          </View>
          {qty > 1 ? (
            <Text style={[styles.totalHint, { color: colors.textSecondary }]}>
              الإجمالي: {formatIQD(total)} {ar.orders.iqd}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.footerLabel, { color: colors.textMuted }]}>{ar.orders.price}</Text>
          <Text style={styles.footerPrice}>
            {formatIQD(total)} {ar.orders.iqd}
          </Text>
        </View>
        <View style={{ flex: 1.4 }}>
          <Button title={ar.products.orderCta} onPress={onOrder} loading={ordering} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 20 },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 18,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#EEF0F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 11,
    color: Colors.primary,
  },
  badgeGold: {
    backgroundColor: '#F8F4EF',
  },
  badgeGoldText: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 11,
    color: '#B08A5A',
  },
  name: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  desc: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 6,
    marginBottom: 14,
  },
  priceCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1E275E',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  priceLabel: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    color: '#B08A5A',
    textAlign: 'right',
  },
  priceValue: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 26,
    color: Colors.primary,
    textAlign: 'right',
    marginTop: 4,
  },
  currency: {
    fontSize: 14,
    fontFamily: 'IBMPlexSansArabic_500Medium',
  },
  dimHint: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
    writingDirection: 'rtl',
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1E275E',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 15,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  specLabel: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 13,
    writingDirection: 'rtl',
  },
  specValue: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    writingDirection: 'rtl',
  },
  chips: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  qtyRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 22,
    minWidth: 40,
    textAlign: 'center',
  },
  totalHint: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerLabel: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 11,
    textAlign: 'right',
  },
  footerPrice: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'right',
  },
});
