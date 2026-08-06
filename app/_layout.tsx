import '../global.css';

import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
  useFonts,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { SplashGate } from '@/components/ui/SplashGate';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AppProviders } from '@/providers/AppProviders';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <RootNavigator />
        <SplashGate />
      </AppProviders>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { colors } = useAppTheme();

  return (
    <>
      <StatusBar style="dark" />
      <OfflineBanner />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: 'IBMPlexSansArabic_600SemiBold',
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
          headerBackTitle: 'رجوع',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="product/[id]" options={{ title: 'تفاصيل المنتج' }} />
        <Stack.Screen name="order/[id]" options={{ title: 'تفاصيل الطلب' }} />
        <Stack.Screen name="ready-products" options={{ title: 'المنتجات الجاهزة' }} />
        <Stack.Screen name="projects" options={{ title: 'مشاريع منجزة' }} />
        <Stack.Screen name="notifications" options={{ title: 'الإشعارات' }} />
        <Stack.Screen name="privacy" options={{ title: 'سياسة الخصوصية' }} />
        <Stack.Screen name="terms" options={{ title: 'الشروط والأحكام' }} />
        <Stack.Screen name="about" options={{ title: 'عن أقاليم' }} />
        <Stack.Screen name="contact" options={{ title: 'تواصل معنا' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
