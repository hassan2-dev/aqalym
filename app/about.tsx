import { ScrollView, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { COMPANY } from '@/constants/theme';
import { ar } from '@/constants/i18n';

export default function AboutScreen() {
  const { colors } = useAppTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.pad}>
      <Text style={[styles.h1, { color: colors.text }]}>{COMPANY.nameAr}</Text>
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
  brand: { fontFamily: 'IBMPlexSansArabic_700Bold', fontSize: 14, textAlign: 'right', letterSpacing: 2 },
  h1: { fontFamily: 'IBMPlexSansArabic_700Bold', fontSize: 28, textAlign: 'right' },
  p: { fontFamily: 'IBMPlexSansArabic_400Regular', fontSize: 15, lineHeight: 26, textAlign: 'right' },
});
