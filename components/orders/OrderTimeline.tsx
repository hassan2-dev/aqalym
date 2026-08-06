import { StyleSheet, Text, View } from 'react-native';

import { ORDER_STATUS_META, ORDER_TIMELINE_STEPS } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { OrderStatus } from '@/types/models';

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const { colors } = useAppTheme();

  if (status === 'cancelled') {
    const meta = ORDER_STATUS_META.cancelled;
    return (
      <View style={[styles.cancelled, { backgroundColor: meta.bg }]}>
        <Text style={[styles.cancelledText, { color: meta.color }]}>الطلب ملغي</Text>
      </View>
    );
  }

  const currentStep = ORDER_STATUS_META[status]?.step ?? 0;

  return (
    <View style={styles.wrap}>
      {ORDER_TIMELINE_STEPS.map((key, index) => {
        const meta = ORDER_STATUS_META[key];
        const done = index <= currentStep;
        const active = index === currentStep;
        return (
          <View key={key} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: done ? meta.color : colors.border,
                    borderColor: active ? meta.color : 'transparent',
                    borderWidth: active ? 3 : 0,
                    transform: [{ scale: active ? 1.15 : 1 }],
                  },
                ]}
              />
              {index < ORDER_TIMELINE_STEPS.length - 1 ? (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: index < currentStep ? meta.color : colors.border },
                  ]}
                />
              ) : null}
            </View>
            <View style={styles.content}>
              <Text
                style={[
                  styles.label,
                  {
                    color: done ? colors.text : colors.textMuted,
                    fontFamily: active
                      ? 'IBMPlexSansArabic_600SemiBold'
                      : 'IBMPlexSansArabic_400Regular',
                  },
                ]}
              >
                {meta.labelAr}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 0 },
  row: {
    flexDirection: 'row-reverse',
    minHeight: 44,
  },
  rail: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  content: {
    flex: 1,
    paddingStart: 12,
    paddingBottom: 16,
  },
  label: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  cancelled: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelledText: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 15,
    writingDirection: 'rtl',
  },
});
