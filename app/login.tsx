import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Input } from '@/components/ui/Input';
import { ar } from '@/constants/i18n';
import { Colors, COMPANY } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { formatPhoneDisplay } from '@/lib/format';
import { DEMO_OTP, isValidIraqiPhone } from '@/services/auth';
import { isDemoMode } from '@/services/firebase';
import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const pendingPhone = useAuthStore((s) => s.pendingPhone);

  const [phase, setPhase] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const finish = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/profile');
  };

  const onSend = async () => {
    if (!isValidIraqiPhone(phone)) {
      setError(ar.auth.invalidPhone);
      return;
    }
    try {
      setLoading(true);
      setError('');
      await sendOtp(phone);
      setPhase('otp');
    } catch {
      setError(ar.auth.invalidPhone);
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    try {
      setLoading(true);
      setError('');
      const user = await verifyOtp(otp);
      if (user.name?.trim()) {
        finish();
        return;
      }
      setPhase('name');
    } catch {
      setError(ar.auth.invalidOtp);
    } finally {
      setLoading(false);
    }
  };

  const onSaveName = async () => {
    if (!name.trim()) {
      setError(ar.auth.nameRequired);
      return;
    }
    try {
      setLoading(true);
      setError('');
      await updateProfile({ name: name.trim() });
      finish();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.wrap, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
        style={[styles.close, { top: insets.top + 8 }]}
        hitSlop={12}
      >
        <Ionicons name="close" size={24} color={Colors.primary} />
      </Pressable>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 72, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <BrandLogo variant="hero" />
          <Text style={[styles.welcome, { color: colors.textSecondary }]}>{COMPANY.tagline}</Text>
        </View>

        {phase === 'phone' ? (
          <View style={styles.form}>
            <Text style={styles.label}>{ar.services.phoneLabel}</Text>
            <View
              style={[
                styles.phoneBox,
                {
                  backgroundColor: '#FFFFFF',
                  borderColor: error ? colors.error : '#E4E6EC',
                },
              ]}
            >
              <Text style={styles.code}>{ar.auth.countryCode}</Text>
              <View style={[styles.divider, { backgroundColor: '#E4E6EC' }]} />
              <TextInput
                value={phone}
                onChangeText={(t) => {
                  setPhone(t.replace(/[^\d]/g, '').slice(0, 10));
                  setError('');
                }}
                placeholder={ar.auth.phonePlaceholder}
                placeholderTextColor="#A0A3AB"
                keyboardType="phone-pad"
                style={[styles.phoneInput, { color: Colors.primary }]}
                textAlign="left"
              />
            </View>
            {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
            {isDemoMode ? <Text style={styles.demo}>{ar.auth.demoHint}</Text> : null}
            <Button title={ar.auth.sendOtp} onPress={onSend} loading={loading} style={styles.cta} />
          </View>
        ) : phase === 'name' ? (
          <View style={styles.form}>
            <Text style={styles.label}>{ar.auth.completeProfile}</Text>
            <Text style={[styles.otpHint, { color: colors.textSecondary }]}>
              {ar.auth.completeProfileBody}
            </Text>
            <Input
              label={ar.auth.nameLabel}
              placeholder={ar.auth.namePlaceholder}
              value={name}
              onChangeText={(t) => {
                setName(t);
                setError('');
              }}
              error={error || undefined}
              autoFocus
            />
            <Button
              title={ar.auth.continueLabel}
              onPress={onSaveName}
              loading={loading}
              style={styles.cta}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>{ar.auth.otpTitle}</Text>
            <Text style={[styles.otpHint, { color: colors.textSecondary }]}>
              {ar.auth.otpSubtitle} {formatPhoneDisplay(pendingPhone ?? '')}
            </Text>
            <View
              style={[
                styles.otpBox,
                {
                  backgroundColor: '#FFFFFF',
                  borderColor: error ? colors.error : '#E4E6EC',
                },
              ]}
            >
              <TextInput
                value={otp}
                onChangeText={(t) => {
                  setOtp(t.replace(/[^\d]/g, '').slice(0, 6));
                  setError('');
                }}
                placeholder={isDemoMode ? DEMO_OTP : '••••••'}
                placeholderTextColor="#A0A3AB"
                keyboardType="number-pad"
                maxLength={6}
                style={[styles.otpInput, { color: Colors.primary }]}
                textAlign="center"
              />
            </View>
            {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
            <Button title={ar.auth.verify} onPress={onVerify} loading={loading} style={styles.cta} />
            <Button
              title={ar.auth.resend}
              variant="ghost"
              onPress={async () => {
                if (pendingPhone) await sendOtp(pendingPhone);
              }}
            />
            <Pressable
              onPress={() => {
                setPhase('phone');
                setOtp('');
                setError('');
              }}
            >
              <Text style={[styles.backPhone, { color: colors.textSecondary }]}>تغيير رقم الهاتف</Text>
            </Pressable>
          </View>
        )}

        <Text style={[styles.footer, { color: colors.textMuted }]}>{ar.auth.footer}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  close: {
    position: 'absolute',
    left: 16,
    zIndex: 2,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 36,
  },
  welcome: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 14,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 24,
    marginTop: 12,
  },
  form: {
    gap: 10,
  },
  label: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  phoneBox: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    direction: 'ltr',
  },
  phoneInput: {
    flex: 1,
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 16,
    height: '100%',
  },
  divider: {
    width: 1,
    height: 24,
    marginHorizontal: 12,
  },
  code: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 16,
    color: Colors.primary,
  },
  otpBox: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
  },
  otpInput: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 22,
    letterSpacing: 8,
    height: '100%',
    paddingHorizontal: 16,
  },
  otpHint: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  error: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    textAlign: 'right',
  },
  demo: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    color: Colors.accent,
    textAlign: 'right',
  },
  backPhone: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 40,
  },
  cta: {
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
});
