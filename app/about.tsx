import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandLogo } from '@/components/ui/BrandLogo';
import { useAppTheme } from '@/hooks/useAppTheme';
import { COMPANY } from '@/constants/theme';
import { ar } from '@/constants/i18n';

export default function AboutScreen() {
  const { colors } = useAppTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.pad}>
      <View style={styles.logoWrap}>
        <BrandLogo variant="hero" />
      </View>
      <Text style={[styles.brand, { color: colors.primary }]}>{COMPANY.tagline}</Text>
      <Text style={[styles.p, { color: colors.textSecondary }]}>{ar.home.introBody}</Text>
      <Text style={[styles.p, { color: colors.textSecondary }]}>
        نقدّم حلولاً متكاملة للأبواب والنوافذ والواجهات والزجاج الثابت والشاتر، بتجربة رقمية شفافة من الطلب حتى التركيب.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 20, gap: 12, paddingBottom: 40 },
  logoWrap: { alignItems: 'center', marginBottom: 8 },
  brand: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 15,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  p: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 15,
    lineHeight: 26,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
