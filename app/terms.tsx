import { ScrollView, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { COMPANY } from '@/constants/theme';

export default function TermsScreen() {
  const { colors } = useAppTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.pad}>
      <Text style={[styles.h1, { color: colors.text }]}>الشروط والأحكام</Text>
      <Text style={[styles.p, { color: colors.textSecondary }]}>
        المواصفات المعروضة في التطبيق توضيحية وقد تتغير بعد المعاينة الفنية والموافقة النهائية من فريق {COMPANY.nameAr}.
      </Text>
      <Text style={[styles.p, { color: colors.textSecondary }]}>
        يلتزم العميل بتقديم قياسات صحيحة قدر الإمكان. تحتفظ الشركة بحق إعادة القياس قبل التصنيع.
      </Text>
      <Text style={[styles.p, { color: colors.textSecondary }]}>
        جدول التسليم والتركيب يعتمد على حالة الطلب وتوفر المواد والموقع الجغرافي للمشروع.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 20, gap: 14, paddingBottom: 40 },
  h1: { fontFamily: 'IBMPlexSansArabic_700Bold', fontSize: 22, textAlign: 'right' },
  p: { fontFamily: 'IBMPlexSansArabic_400Regular', fontSize: 15, lineHeight: 26, textAlign: 'right' },
});
