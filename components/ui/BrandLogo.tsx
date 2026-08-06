import { Image } from 'expo-image';
import { StyleSheet, View, ViewStyle } from 'react-native';

type BrandLogoVariant = 'header' | 'hero' | 'mark';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  style?: ViewStyle;
}

const LOGO_FULL = require('../../assets/images/logo-full.png');
const LOGO_MARK = require('../../assets/images/logo-mark.png');

/** Official AQALYM mark, exported from the brand sheet with transparent background. */
export function BrandLogo({ variant = 'header', style }: BrandLogoProps) {
  if (variant === 'hero') {
    return (
      <View style={[styles.hero, style]}>
        <Image source={LOGO_FULL} style={styles.fill} contentFit="contain" />
      </View>
    );
  }

  return (
    <View style={[variant === 'mark' ? styles.mark : styles.header, style]}>
      <Image source={LOGO_MARK} style={styles.fill} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    height: '100%',
    width: '100%',
  },
  header: {
    height: 38,
    width: 38,
  },
  hero: {
    alignSelf: 'center',
    height: 188,
    width: 140,
  },
  mark: {
    alignSelf: 'center',
    height: 72,
    width: 72,
  },
});
