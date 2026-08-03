import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrap}>
      {label ? (
        <Text style={[styles.label, { color: Colors.primary }]}>{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
          },
          style,
        ]}
        {...props}
      />
      {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  input: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  error: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
