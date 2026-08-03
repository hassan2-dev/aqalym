import { Image } from 'expo-image';
import { StyleSheet, View, ViewStyle } from 'react-native';

type BrandLogoVariant = 'header' | 'hero' | 'mark';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  style?: ViewStyle;
}

const LOGO = require('../../assets/logo.jpg');

/**
 * Official AQALYM mark. Source file is dual (Arabic | English);
 * header/hero crop to the Arabic half for RTL UI.
 */
export function BrandLogo({ variant = 'header', style }: BrandLogoProps) {
  if (variant === 'mark') {
    return (
      <View style={[styles.markWrap, style]}>
        <Image source={LOGO} style={styles.markImg} contentFit="contain" />
      </View>
    );
  }

  if (variant === 'hero') {
    return (
      <View style={[styles.heroClip, style]}>
        <Image source={LOGO} style={styles.heroImg} contentFit="contain" />
      </View>
    );
  }

  return (
    <View style={[styles.headerClip, style]}>
      <Image source={LOGO} style={styles.headerImg} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  headerClip: {
    height: 40,
    width: 108,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  headerImg: {
    height: 40,
    width: 216,
  },
  heroClip: {
    height: 120,
    width: 200,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  heroImg: {
    height: 120,
    width: 400,
  },
  markWrap: {
    height: 72,
    width: 72,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  markImg: {
    height: 72,
    // Approximate icon-only crop from the dual sheet
    width: 144,
    transform: [{ translateX: -8 }],
  },
});
