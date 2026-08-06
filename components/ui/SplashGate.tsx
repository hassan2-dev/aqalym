import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';

const LOGO = require('../../assets/images/logo-full.png');

/** Shortest time the brand screen stays up so it never flickers on fast devices. */
const MIN_DURATION = 1400;
const BAR_WIDTH = 132;

export function SplashGate() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const [mounted, setMounted] = useState(true);

  const mountedAt = useRef(Date.now()).current;
  const reveal = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(reveal, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ).start();
  }, [reveal, sweep]);

  useEffect(() => {
    if (!hydrated) return;

    const wait = Math.max(0, MIN_DURATION - (Date.now() - mountedAt));
    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 420,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }, wait);

    return () => clearTimeout(timer);
  }, [hydrated, fade, mountedAt]);

  if (!mounted) return null;

  return (
    <Animated.View
      pointerEvents="auto"
      style={[styles.overlay, { opacity: fade }]}
    >
      <Animated.View
        style={{
          opacity: reveal,
          transform: [
            { scale: reveal.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
            { translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
          ],
        }}
      >
        <View style={styles.logoCard}>
          <Image source={LOGO} style={styles.logo} contentFit="contain" />
        </View>
      </Animated.View>

      <View style={styles.track}>
        <Animated.View
          style={[
            styles.bar,
            {
              transform: [
                {
                  translateX: sweep.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-BAR_WIDTH * 0.55, BAR_WIDTH * 0.55],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.accent,
    borderRadius: 999,
    height: '100%',
    width: '45%',
  },
  logo: {
    height: '100%',
    width: '100%',
  },
  logoCard: {
    height: 236,
    width: 176,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    zIndex: 100,
  },
  track: {
    backgroundColor: Colors.border,
    borderRadius: 999,
    height: 4,
    marginTop: 34,
    overflow: 'hidden',
    width: BAR_WIDTH,
  },
});
