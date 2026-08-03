import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ar } from '@/constants/i18n';
import { Colors } from '@/constants/theme';

interface HeroBannerProps {
  onCta: () => void;
}

export function HeroBanner({ onCta }: HeroBannerProps) {
  return (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.wrap}>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80',
        }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={400}
      />
      <LinearGradient
        colors={['rgba(15,20,45,0.25)', 'rgba(15,20,45,0.78)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{ar.home.heroTitle}</Text>
        <Text style={styles.subtitle}>{ar.home.heroSubtitle}</Text>
        <Pressable onPress={onCta} style={styles.cta}>
          <Ionicons name="arrow-back" size={16} color={Colors.primary} />
          <Text style={styles.ctaText}>{ar.home.heroCta}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 340,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 10,
  },
  title: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 26,
    lineHeight: 38,
    color: Colors.white,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  cta: {
    marginTop: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D6DCF5',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ctaText: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },
});
