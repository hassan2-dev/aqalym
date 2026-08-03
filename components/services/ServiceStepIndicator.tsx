import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

/** مؤشر خطوتين: التصنيف → القياسات (مطابق للتصميم) */
export function ServiceStepIndicator({ activeStep }: { activeStep: 1 | 2 }) {
  const { colors } = useAppTheme();

  const Dot = ({ n, label, active }: { n: number; label: string; active: boolean }) => (
    <View style={styles.dotCol}>
      <View style={[styles.dot, { backgroundColor: active ? Colors.primary : '#E4E6EC' }]}>
        <Text style={[styles.dotText, { color: active ? Colors.white : '#9A9CA3' }]}>{n}</Text>
      </View>
      <Text
        style={[
          styles.label,
          {
            color: active ? Colors.primary : colors.textMuted,
            fontFamily: active
              ? 'IBMPlexSansArabic_600SemiBold'
              : 'IBMPlexSansArabic_400Regular',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <View style={styles.wrap}>
      {/* في RTL: الأول يمين */}
      <Dot n={1} label="التصنيف" active={activeStep === 1} />
      <View
        style={[
          styles.line,
          { backgroundColor: activeStep >= 2 ? Colors.primary : colors.border },
        ]}
      />
      <Dot n={2} label="القياسات" active={activeStep === 2} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 48,
    paddingTop: 8,
    paddingBottom: 16,
  },
  line: {
    height: 2,
    flex: 1,
    marginTop: 14,
    marginHorizontal: 10,
  },
  dotCol: {
    alignItems: 'center',
    gap: 6,
    minWidth: 70,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 13,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
