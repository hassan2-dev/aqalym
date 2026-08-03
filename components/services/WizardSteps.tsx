import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductListCard } from '@/components/products/ProductCards';
import { ar } from '@/constants/i18n';
import { Colors, IRAQ_GOVERNORATES, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { formatPhoneDisplay } from '@/lib/format';
import { DEMO_OTP } from '@/services/auth';
import { isDemoMode } from '@/services/firebase';
import { useAuthStore } from '@/stores/authStore';
import { useWizardStore } from '@/stores/wizardStore';
import type { Product } from '@/types/models';

export function WizardProgress({ step, total = 7 }: { step: number; total?: number }) {
  // kept for later wizard steps â€” early steps use ServiceStepIndicator
  const { colors } = useAppTheme();
  const displayStep = Math.min(step, total);
  return (
    <View style={styles.progressWrap}>
      <Text style={[styles.progressText, { color: colors.textSecondary }]}>
        {ar.services.step} {displayStep} {ar.services.of} {total}
      </Text>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: Colors.primary,
              width: `${(displayStep / total) * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

// StepCategory / StepProductDetails moved to dedicated files
export { StepCategory } from '@/components/services/StepCategory';
export { StepProductDetails } from '@/components/services/StepProductDetails';

export function StepMeasurements({
  onNext,
}: {
  onNext: () => void;
}) {
  const { colors } = useAppTheme();
  const measurements = useWizardStore((s) => s.measurements);
  const setMeasurements = useWizardStore((s) => s.setMeasurements);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!measurements.width || measurements.width <= 0) next.width = ar.common.invalidNumber;
    if (!measurements.height || measurements.height <= 0) next.height = ar.common.invalidNumber;
    if (!measurements.quantity || measurements.quantity < 1) next.quantity = ar.common.invalidNumber;
    if (measurements.width > 1000) next.width = ar.common.maxValue;
    if (measurements.height > 1000) next.height = ar.common.maxValue;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <ScrollView contentContainerStyle={styles.stepPad} keyboardShouldPersistTaps="handled">
      <Text style={[styles.stepTitle, { color: colors.text }]}>{ar.services.measurements}</Text>
      <View style={{ gap: 14 }}>
        <Input
          label={ar.services.width}
          keyboardType="numeric"
          value={measurements.width ? String(measurements.width) : ''}
          onChangeText={(t) => setMeasurements({ width: Number(t) || 0 })}
          error={errors.width}
        />
        <Input
          label={ar.services.height}
          keyboardType="numeric"
          value={measurements.height ? String(measurements.height) : ''}
          onChangeText={(t) => setMeasurements({ height: Number(t) || 0 })}
          error={errors.height}
        />
        <Input
          label={ar.services.quantity}
          keyboardType="numeric"
          value={String(measurements.quantity || '')}
          onChangeText={(t) => setMeasurements({ quantity: Number(t) || 0 })}
          error={errors.quantity}
        />
      </View>
      <View style={{ marginTop: 28 }}>
        <Button
          title={ar.services.next}
          onPress={() => {
            if (validate()) onNext();
          }}
        />
      </View>
    </ScrollView>
  );
}

export function StepMatching({
  loading,
  products,
  onReady,
  onEmpty,
}: {
  loading: boolean;
  products: Product[];
  onReady: () => void;
  onEmpty: () => void;
}) {
  const { colors } = useAppTheme();

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      if (products.length) onReady();
      else onEmpty();
    }, 500);
    return () => clearTimeout(t);
  }, [loading, products, onReady, onEmpty]);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={[styles.matchingText, { color: colors.textSecondary }]}>
        {ar.services.findingProducts}
      </Text>
    </View>
  );
}

export function StepProductList({
  products,
  onSelect,
  onRetry,
}: {
  products: Product[];
  onSelect: (p: Product) => void;
  onRetry: () => void;
}) {
  const { colors } = useAppTheme();

  if (!products.length) {
    return (
      <EmptyState
        icon="search-outline"
        title={ar.services.noProducts}
        body={ar.services.tryDifferent}
        actionLabel={ar.services.tryDifferent}
        onAction={onRetry}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.stepPad} showsVerticalScrollIndicator={false}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>{ar.services.products}</Text>
      {products.map((p) => (
        <ProductListCard key={p.id} product={p} onPress={() => onSelect(p)} />
      ))}
    </ScrollView>
  );
}


export function StepAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { colors } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phase, setPhase] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) onAuthenticated();
  }, [user, onAuthenticated]);

  if (user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.stepPad} keyboardShouldPersistTaps="handled">
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        {phase === 'phone' ? ar.services.authTitle : ar.services.otpTitle}
      </Text>
      {phase === 'otp' ? (
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          {ar.services.otpSubtitle} {formatPhoneDisplay(pendingPhone ?? '')}
        </Text>
      ) : (
        <Text style={[styles.body, { color: colors.textSecondary }]}>{ar.auth.subtitle}</Text>
      )}

      {phase === 'phone' ? (
        <View style={{ gap: 12, marginTop: 12 }}>
          <Text style={[styles.fieldLabel, { color: Colors.primary }]}>{ar.services.phoneLabel}</Text>
          <View
            style={[
              styles.phoneBox,
              {
                backgroundColor: colors.card,
                borderColor: error ? colors.error : colors.border,
              },
            ]}
          >
            <Text style={[styles.phoneCode, { color: Colors.primary }]}>{ar.auth.countryCode}</Text>
            <View style={[styles.phoneDivider, { backgroundColor: colors.border }]} />
            <TextInput
              value={phone}
              onChangeText={(t) => {
                setPhone(t.replace(/[^\d]/g, '').slice(0, 10));
                setError('');
              }}
              placeholder={ar.auth.phonePlaceholder}
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              style={[styles.phoneInput, { color: colors.text }]}
              textAlign="left"
            />
          </View>
          {error ? (
            <Text style={{ color: colors.error, textAlign: 'right', fontFamily: 'IBMPlexSansArabic_400Regular', fontSize: 12 }}>
              {error}
            </Text>
          ) : null}
          {isDemoMode ? (
            <Text style={{ color: Colors.accent, textAlign: 'right', fontFamily: 'IBMPlexSansArabic_400Regular', fontSize: 12 }}>
              {ar.auth.demoHint}
            </Text>
          ) : null}
          <Button
            title={ar.auth.sendOtp}
            loading={loading}
            onPress={async () => {
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
            }}
          />
        </View>
      ) : (
        <View style={{ gap: 14, marginTop: 12 }}>
          <Input
            label={ar.services.otpTitle}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            error={error}
            placeholder={isDemoMode ? DEMO_OTP : '••••••'}
          />
          <Button
            title={ar.services.verify}
            loading={loading}
            onPress={async () => {
              try {
                setLoading(true);
                setError('');
                await verifyOtp(otp);
                onAuthenticated();
              } catch {
                setError(ar.auth.invalidOtp);
              } finally {
                setLoading(false);
              }
            }}
          />
          <Button
            title={ar.services.resend}
            variant="ghost"
            onPress={async () => {
              if (pendingPhone) await sendOtp(pendingPhone);
            }}
          />
        </View>
      )}
    </ScrollView>
  );
}

export function StepProjectInfo({
  onSubmit,
  loading,
}: {
  onSubmit: () => void;
  loading?: boolean;
}) {
  const { colors } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const state = useWizardStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locating, setLocating] = useState(false);

  const cities = useMemo(() => {
    const gov = IRAQ_GOVERNORATES.find((g) => g.name === state.governorate);
    return gov?.cities ?? [];
  }, [state.governorate]);

  useEffect(() => {
    if (user?.phone && !state.customerName) {
      // keep phone from auth; name filled by user
    }
  }, [user, state.customerName]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!state.customerName.trim()) next.customerName = ar.common.required;
    if (!state.governorate) next.governorate = ar.common.required;
    if (!state.city) next.city = ar.common.required;
    if (!state.address.trim()) next.address = ar.common.required;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const pickLocation = async () => {
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      state.setProjectInfo({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } finally {
      setLocating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.stepPad} keyboardShouldPersistTaps="handled">
      <Text style={[styles.stepTitle, { color: colors.text }]}>{ar.services.projectInfo}</Text>
      <View style={{ gap: 14 }}>
        <Input
          label={ar.services.customerName}
          value={state.customerName}
          onChangeText={(t) => state.setProjectInfo({ customerName: t })}
          error={errors.customerName}
        />
        <Input
          label={ar.services.phoneLabel}
          value={formatPhoneDisplay(user?.phone ?? '')}
          editable={false}
        />

        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{ar.services.governorate}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {IRAQ_GOVERNORATES.map((g) => (
            <Pressable
              key={g.id}
              onPress={() => state.setProjectInfo({ governorate: g.name, city: '' })}
              style={[
                styles.chip,
                {
                  backgroundColor: state.governorate === g.name ? Colors.primary : colors.card,
                  borderColor: errors.governorate ? colors.error : colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: state.governorate === g.name ? Colors.white : colors.text,
                  fontFamily: 'IBMPlexSansArabic_500Medium',
                  fontSize: 13,
                }}
              >
                {g.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {cities.length ? (
          <>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{ar.services.city}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {cities.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => state.setProjectInfo({ city: c })}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: state.city === c ? Colors.primary : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: state.city === c ? Colors.white : colors.text,
                      fontFamily: 'IBMPlexSansArabic_500Medium',
                      fontSize: 13,
                    }}
                  >
                    {c}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        ) : null}

        <Input
          label={ar.services.address}
          value={state.address}
          onChangeText={(t) => state.setProjectInfo({ address: t })}
          error={errors.address}
        />

        <Card>
          <View style={styles.locRow}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontFamily: 'IBMPlexSansArabic_500Medium', textAlign: 'right', writingDirection: 'rtl' }}>
                {ar.services.mapsLocation}
              </Text>
              <Text style={{ color: colors.textSecondary, fontFamily: 'IBMPlexSansArabic_400Regular', textAlign: 'right', fontSize: 12, marginTop: 4, writingDirection: 'rtl' }}>
                {state.latitude && state.longitude
                  ? `${state.latitude.toFixed(5)}, ${state.longitude.toFixed(5)}`
                  : 'لم يتم التحديد بعد'}
              </Text>
            </View>
            <Button
              title={locating ? '...' : ar.services.pickLocation}
              onPress={pickLocation}
              variant="outline"
              fullWidth={false}
              loading={locating}
              style={{ minWidth: 120 }}
            />
          </View>
        </Card>

        <Input
          label={ar.services.notes}
          value={state.notes}
          onChangeText={(t) => state.setProjectInfo({ notes: t })}
          multiline
          style={{ height: 100, textAlignVertical: 'top', paddingTop: 14 }}
        />
      </View>

      <View style={{ marginTop: 28, marginBottom: 20 }}>
        <Button
          title={ar.services.submitOrder}
          loading={loading}
          onPress={() => {
            if (validate()) onSubmit();
          }}
        />
      </View>
    </ScrollView>
  );
}

export function StepSuccess({
  orderNumber,
  onViewOrders,
  onNew,
}: {
  orderNumber: string;
  onViewOrders: () => void;
  onNew: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.center}>
      <View style={[styles.successIcon, { backgroundColor: '#E4F5EA' }]}>
        <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>{ar.services.orderSuccess}</Text>
      <Text style={[styles.body, { color: colors.textSecondary, textAlign: 'center' }]}>
        {ar.services.orderSuccessBody}
      </Text>
      <Text style={[styles.orderNum, { color: colors.accent }]}>{orderNumber}</Text>
      <View style={{ width: '100%', gap: 12, marginTop: 24, paddingHorizontal: 24 }}>
        <Button title={ar.services.viewOrders} onPress={onViewOrders} />
        <Button title="طلب جديد" variant="outline" onPress={onNew} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressWrap: { gap: 8, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  progressText: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 13,
    textAlign: 'right',
  },
  track: { height: 4, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
  stepPad: { padding: 20, paddingBottom: 40 },
  stepTitle: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 24,
    textAlign: 'right',
    marginBottom: 16,
  },
  body: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'right',
  },
  catGrid: { gap: 12 },
  catTile: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    paddingBottom: 14,
  },
  catImg: { width: '100%', height: 120 },
  catName: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 16,
    textAlign: 'right',
    paddingHorizontal: 14,
    marginTop: 12,
  },
  catDesc: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    textAlign: 'right',
    paddingHorizontal: 14,
    marginTop: 4,
    lineHeight: 18,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  matchingText: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 15,
    textAlign: 'center',
  },
  galleryImage: {
    width: 280,
    height: 200,
    borderRadius: Radius.xl,
    marginHorizontal: 6,
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
  phoneCode: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 16,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    marginHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 16,
    height: '100%',
  },
  blockTitle: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 16,
    textAlign: 'right',
    marginTop: 22,
    marginBottom: 10,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  accRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  fieldLabel: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  orderNum: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 20,
    marginTop: 8,
  },
});
