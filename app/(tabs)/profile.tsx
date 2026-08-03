import { router } from 'expo-router';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ar } from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { useAppTheme, useThemeStore } from '@/hooks/useAppTheme';
import { formatPhoneDisplay } from '@/lib/format';
import { useAuthStore } from '@/stores/authStore';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const setMode = useThemeStore((s) => s.setMode);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const menu: MenuItem[] = [
    {
      icon: 'receipt-outline',
      label: ar.profile.orderHistory,
      onPress: () => router.push('/(tabs)/orders'),
    },
    {
      icon: 'shield-checkmark-outline',
      label: ar.profile.privacy,
      onPress: () => router.push('/privacy'),
    },
    {
      icon: 'document-text-outline',
      label: ar.profile.terms,
      onPress: () => router.push('/terms'),
    },
    {
      icon: 'call-outline',
      label: ar.profile.contact,
      onPress: () => router.push('/contact'),
    },
    {
      icon: 'business-outline',
      label: ar.profile.about,
      onPress: () => router.push('/about'),
    },
  ];

  if (user) {
    menu.push({
      icon: 'log-out-outline',
      label: ar.profile.logout,
      danger: true,
      onPress: () => {
        Alert.alert(ar.profile.logout, 'هل أنت متأكد؟', [
          { text: ar.common.cancel, style: 'cancel' },
          { text: ar.profile.logout, style: 'destructive', onPress: () => logout() },
        ]);
      },
    });
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 32 }}
    >
      <Text style={[styles.title, { color: Colors.primary }]}>{ar.profile.title}</Text>

      <Card style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
          <Ionicons name="person" size={28} color={Colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: Colors.primary }]}>
            {user?.name || (user ? 'عميل أقاليم' : ar.profile.guest)}
          </Text>
          <Text style={[styles.phone, { color: colors.textSecondary }]}>
            {user ? formatPhoneDisplay(user.phone) : ar.profile.login}
          </Text>
        </View>
      </Card>

      {!user ? (
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <Button title={ar.profile.login} onPress={() => router.push('/login')} />
        </View>
      ) : null}

      <Card style={{ marginHorizontal: 20, marginBottom: 16 }}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>{ar.profile.darkMode}</Text>
          <Switch
            value={isDark}
            onValueChange={(v) => setMode(v ? 'dark' : 'light')}
            trackColor={{ true: Colors.primary, false: colors.border }}
          />
        </View>
      </Card>

      <Card padded={false} style={{ marginHorizontal: 20 }}>
        {menu.map((item, index) => (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            style={[
              styles.menuRow,
              index < menu.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={item.danger ? colors.error : colors.textSecondary}
            />
            <Text style={[styles.menuLabel, { color: item.danger ? colors.error : colors.text }]}>
              {item.label}
            </Text>
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </Card>

      <Text style={[styles.version, { color: colors.textMuted }]}>{ar.auth.footer}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 28,
    textAlign: 'right',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 18,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  phone: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 15,
    writingDirection: 'rtl',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 15,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  version: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});
