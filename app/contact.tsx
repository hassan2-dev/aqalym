import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/ui/Card';
import { COMPANY } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

const items = [
  { icon: 'call-outline' as const, label: 'هاتف', value: COMPANY.phone, href: `tel:${COMPANY.phone}` },
  { icon: 'mail-outline' as const, label: 'بريد', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  {
    icon: 'logo-whatsapp' as const,
    label: 'واتساب',
    value: COMPANY.whatsapp,
    href: `https://wa.me/${COMPANY.whatsapp.replace(/\D/g, '')}`,
  },
  { icon: 'location-outline' as const, label: 'العنوان', value: COMPANY.address },
];

export default function ContactScreen() {
  const { colors } = useAppTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.pad}>
      <Text style={[styles.h1, { color: colors.text }]}>تواصل معنا</Text>
      <Text style={[styles.p, { color: colors.textSecondary }]}>
        فريق أقاليم جاهز لمساعدتكم في الاستشارات والطلبات والمتابعة الفنية.
      </Text>
      <View style={{ gap: 12, marginTop: 8 }}>
        {items.map((item) => (
          <Pressable key={item.label} onPress={() => item.href && Linking.openURL(item.href)}>
            <Card style={styles.row}>
              <Ionicons name={item.icon} size={22} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.textMuted }]}>{item.label}</Text>
                <Text style={[styles.value, { color: colors.text }]}>{item.value}</Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 20, paddingBottom: 40 },
  h1: { fontFamily: 'IBMPlexSansArabic_700Bold', fontSize: 24, textAlign: 'right' },
  p: { fontFamily: 'IBMPlexSansArabic_400Regular', fontSize: 14, lineHeight: 24, textAlign: 'right', marginTop: 8 },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 14 },
  label: { fontFamily: 'IBMPlexSansArabic_400Regular', fontSize: 12, textAlign: 'right', writingDirection: 'rtl' },
  value: { fontFamily: 'IBMPlexSansArabic_600SemiBold', fontSize: 16, textAlign: 'right', writingDirection: 'rtl', marginTop: 2 },
});
