import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useNetwork } from '@/hooks/useNetwork';

export function OfflineBanner() {
  const { isOffline } = useNetwork();
  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={16} color={Colors.white} />
      <Text style={styles.text}>أنت غير متصل بالإنترنت</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: Colors.white,
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 13,
    writingDirection: 'rtl',
  },
});
