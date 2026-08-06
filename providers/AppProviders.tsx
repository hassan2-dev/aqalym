import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';

import { enableArabicRTL, reloadForRTL } from '@/lib/rtl';
import { queryClient } from '@/lib/queryClient';
import { registerForPushNotifications } from '@/services/notifications';
import { useAuthStore } from '@/stores/authStore';

const needsRtlReload = enableArabicRTL();

export function AppProviders({ children }: { children: ReactNode }) {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    if (needsRtlReload) {
      reloadForRTL();
      return;
    }
    bootstrap();
    registerForPushNotifications().catch(() => undefined);
  }, [bootstrap]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
