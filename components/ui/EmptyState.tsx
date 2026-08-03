import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/hooks/useAppTheme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'file-tray-outline', title, body, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrap}>
      <View style={[styles.iconWrap, { backgroundColor: colors.border }]}>
        <Ionicons name={icon} size={32} color={colors.textMuted} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {body ? <Text style={[styles.body, { color: colors.textSecondary }]}>{body}</Text> : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: 20, width: '100%', maxWidth: 240 }}>
          <Button title={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { colors } = useAppTheme();
  return (
    <EmptyState
      icon="alert-circle-outline"
      title="حدث خطأ"
      body={message ?? 'تعذر تحميل البيانات'}
      actionLabel={onRetry ? 'إعادة المحاولة' : undefined}
      onAction={onRetry}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 18,
    textAlign: 'center',
  },
  body: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
