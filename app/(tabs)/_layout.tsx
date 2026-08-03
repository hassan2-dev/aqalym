import { Tabs } from 'expo-router';

import { InstagramTabBar } from '@/components/navigation/InstagramTabBar';
import { ar } from '@/constants/i18n';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <InstagramTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: ar.tabs.home }} />
      <Tabs.Screen name="services" options={{ title: ar.tabs.services }} />
      <Tabs.Screen name="orders" options={{ title: ar.tabs.orders }} />
      <Tabs.Screen name="profile" options={{ title: ar.tabs.profile }} />
    </Tabs>
  );
}
