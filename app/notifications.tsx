import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ar } from '@/constants/i18n';
import { Colors, ORDER_STATUS_META } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOrders } from '@/hooks/useCatalog';
import { formatDateAr } from '@/lib/format';
import { useAuthStore } from '@/stores/authStore';

type Feed = {
  id: string;
  orderId: string;
  title: string;
  body: string;
  color: string;
  bg: string;
  createdAt: string;
};

export default function NotificationsScreen() {
  const { colors } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const { data: orders = [], isLoading, refetch, isRefetching } = useOrders();

  const feed = useMemo<Feed[]>(() => {
    return orders
      .map((order) => {
        const meta = ORDER_STATUS_META[order.status] ?? ORDER_STATUS_META.submitted;
        return {
          id: `${order.id}-${order.status}`,
          orderId: order.id,
          title: `طلبك ${order.orderNumber} — ${meta.labelAr}`,
          body: `${order.productName} · ${order.categoryName}`,
          color: meta.color,
          bg: meta.bg,
          createdAt: order.updatedAt || order.createdAt,
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders]);

  if (!user) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={styles.emptyIcon}>
          <Ionicons name="notifications-off-outline" size={32} color={Colors.primary} />
        </View>
        <Text style={[styles.emptyTitle, { color: Colors.primary }]}>سجّل الدخول لعرض إشعاراتك</Text>
        <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
          ستصلك تحديثات حالة طلباتك أولاً بأول
        </Text>
        <View style={{ width: '100%', maxWidth: 240, marginTop: 8 }}>
          <Button title={ar.profile.login} onPress={() => router.push('/login')} />
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 20, gap: 12 }}>
        <Skeleton height={82} borderRadius={16} />
        <Skeleton height={82} borderRadius={16} />
        <Skeleton height={82} borderRadius={16} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.background }}
      data={feed}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshing={isRefetching}
      onRefresh={refetch}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <Ionicons name="notifications-outline" size={32} color={Colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: Colors.primary }]}>لا توجد إشعارات بعد</Text>
          <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
            عند تقديم طلب ستظهر هنا تحديثات حالته
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push({ pathname: '/order/[id]', params: { id: item.orderId } })}
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={[styles.dot, { backgroundColor: item.bg }]}>
            <Ionicons name="notifications" size={18} color={item.color} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.title, { color: Colors.primary }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.body}
            </Text>
            <Text style={[styles.date, { color: colors.textMuted }]}>
              {formatDateAr(item.createdAt)}
            </Text>
          </View>
          <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
    gap: 12,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  dot: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  body: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  date: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 11,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#EEF0F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 17,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  emptyBody: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
