import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HomeHeader } from '@/components/home/HomeHeader';
import { OrderListCard } from '@/components/orders/OrderListCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ar } from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { useOrders } from '@/hooks/useCatalog';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/stores/authStore';

export default function OrdersScreen() {
  const { colors } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const { data: orders = [], isLoading, refetch, isRefetching } = useOrders();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <HomeHeader onNotifications={() => router.push('/notifications')} />

      <View style={styles.head}>
        <Text style={[styles.title, { color: Colors.primary }]}>{ar.orders.title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          تابع حالة طلباتك من الإرسال حتى التركيب
        </Text>
      </View>

      {!user ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIcon, { backgroundColor: '#EEF0F7' }]}>
            <Ionicons name="log-in-outline" size={32} color={Colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: Colors.primary }]}>سجّل الدخول لعرض طلباتك</Text>
          <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
            استخدم رقم هاتفك للوصول إلى سجل الطلبات ومتابعة حالتها
          </Text>
          <View style={{ width: '100%', maxWidth: 240, marginTop: 8 }}>
            <Button title={ar.profile.login} onPress={() => router.push('/login')} />
          </View>
        </View>
      ) : isLoading ? (
        <View style={styles.listPad}>
          <Skeleton height={120} borderRadius={18} style={{ marginBottom: 12 }} />
          <Skeleton height={120} borderRadius={18} style={{ marginBottom: 12 }} />
          <Skeleton height={120} borderRadius={18} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPad}
          refreshing={isRefetching}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={[styles.emptyIcon, { backgroundColor: '#EEF0F7' }]}>
                <Ionicons name="document-text-outline" size={32} color={Colors.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: Colors.primary }]}>{ar.orders.empty}</Text>
              <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>{ar.orders.emptyBody}</Text>
              <View style={{ width: '100%', maxWidth: 240, marginTop: 8 }}>
                <Button title={ar.orders.startOrder} onPress={() => router.push('/(tabs)/services')} />
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <OrderListCard
              order={item}
              onPress={() => router.push({ pathname: '/order/[id]', params: { id: item.id } })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  head: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 4,
  },
  title: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 24,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  listPad: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    flexGrow: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 8,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 17,
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
  },
});
