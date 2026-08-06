import { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Radius } from '@/constants/theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = Radius.md, style }: SkeletonProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E8EAEE',
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.productCard}>
      <Skeleton height={160} borderRadius={Radius.xl} />
      <Skeleton height={18} width="70%" style={{ marginTop: 12 }} />
      <Skeleton height={14} width="90%" style={{ marginTop: 8 }} />
      <Skeleton height={14} width="40%" style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    marginBottom: 16,
  },
});
