import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FeaturedGridCard } from '@/components/home/HomeSections';
import { Skeleton } from '@/components/ui/Skeleton';
import { ar } from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useReadyProducts } from '@/hooks/useCatalog';

export default function ReadyProductsScreen() {
  const { colors } = useAppTheme();
  const { data: products = [], isLoading } = useReadyProducts();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        منتجات جاهزة بمقاسات قياسية وأسعار محددة، جاهزة للطلب مباشرة
      </Text>

      {isLoading ? (
        <View style={styles.grid}>
          <Skeleton height={200} style={{ flex: 1, borderRadius: 14 }} />
          <Skeleton height={200} style={{ flex: 1, borderRadius: 14 }} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="cube-outline" size={32} color={Colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: Colors.primary }]}>
            لا توجد منتجات جاهزة حالياً
          </Text>
          <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
            تابعنا قريباً، أو اطلب منتجاً حسب القياس من صفحة الخدمات
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {products.map((p) => (
            <FeaturedGridCard
              key={p.id}
              product={p}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  subtitle: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 18,
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 64,
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
