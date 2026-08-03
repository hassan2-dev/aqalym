import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { I18nManager } from 'react-native';

import { enableArabicRTL } from '@/lib/rtl';
import { queryClient } from '@/lib/queryClient';
import { registerForPushNotifications } from '@/services/notifications';
import { useAuthStore } from '@/stores/authStore';

enableArabicRTL();

export function AppProviders({ children }: { children: ReactNode }) {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    I18nManager.allowRTL(true);
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
    }
    bootstrap();
    registerForPushNotifications().catch(() => undefined);
  }, [bootstrap]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
