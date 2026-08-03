import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { Product } from '@/types/models';

export function ProductListCard({ product, onPress }: { product: Product; onPress: () => void }) {
  const { colors } = useAppTheme();

  return (
    <Card onPress={onPress} padded={false} style={styles.card}>
      <Image source={{ uri: product.images[0] }} style={styles.image} contentFit="cover" />
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]}>{product.nameAr}</Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>
          {product.descriptionAr}
        </Text>
        <View style={styles.specs}>
          {product.specifications.slice(0, 2).map((s) => (
            <Text key={s.label} style={[styles.spec, { color: colors.textMuted }]}>
              {s.label}: {s.value}
            </Text>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
  },
  body: {
    padding: 16,
    gap: 6,
  },
  title: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 17,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  desc: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  specs: { gap: 2, marginTop: 4 },
  spec: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
