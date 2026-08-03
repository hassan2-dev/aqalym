import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';

export default function NotFoundScreen() {
  const { colors } = useAppTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'غير موجود' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>هذه الصفحة غير موجودة</Text>
        <Link href="/" style={styles.link}>
          <Text style={{ color: colors.accent, fontFamily: 'IBMPlexSansArabic_500Medium' }}>العودة للرئيسية</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontFamily: 'IBMPlexSansArabic_600SemiBold', fontSize: 18 },
  link: { marginTop: 16 },
});
