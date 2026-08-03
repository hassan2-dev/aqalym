import { ScrollView, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { COMPANY } from '@/constants/theme';

export default function PrivacyScreen() {
  const { colors } = useAppTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.pad}>
      <Text style={[styles.h1, { color: colors.text }]}>سياسة الخصوصية</Text>
      <Text style={[styles.p, { color: colors.textSecondary }]}>
        تحترم شركة {COMPANY.nameAr} خصوصيتكم. نجمع رقم الهاتف واسم العميل ومعلومات المشروع لغرض تنفيذ الطلبات
        ومتابعة حالة التصنيع والتركيب فقط.
      </Text>
      <Text style={[styles.p, { color: colors.textSecondary }]}>
        لا نبيع بياناتكم لأطراف ثالثة. تُستخدم بيانات الموقع الجغرافي عند موافقتكم لتحديد عنوان التركيب بدقة.
      </Text>
      <Text style={[styles.p, { color: colors.textSecondary }]}>
        يمكنكم طلب حذف حسابكم وبياناتكم عبر التواصل مع خدمة العملاء على {COMPANY.email}.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 20, gap: 14, paddingBottom: 40 },
  h1: { fontFamily: 'IBMPlexSansArabic_700Bold', fontSize: 22, textAlign: 'right' },
  p: { fontFamily: 'IBMPlexSansArabic_400Regular', fontSize: 15, lineHeight: 26, textAlign: 'right' },
});
