import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  index: { active: 'home', inactive: 'home-outline' },
  services: { active: 'grid-outline', inactive: 'grid-outline' },
  orders: { active: 'document-text-outline', inactive: 'document-text-outline' },
  profile: { active: 'person-outline', inactive: 'person-outline' },
};

export function InstagramTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const bottom = Math.max(insets.bottom, 8);

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.card,
          borderTopColor: '#E8EAEE',
          paddingBottom: bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : typeof options.title === 'string'
              ? options.title
              : route.name;

        const icons = TAB_ICONS[route.name] ?? {
          active: 'ellipse' as IconName,
          inactive: 'ellipse-outline' as IconName,
        };

        const color = focused ? Colors.primary : '#8B8E97';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            Haptics.selectionAsync();
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            style={styles.item}
          >
            <View style={[styles.iconWrap, focused && styles.iconActive]}>
              <Ionicons
                name={focused ? icons.active : icons.inactive}
                size={22}
                color={color}
              />
            </View>
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color,
                  fontFamily: focused
                    ? 'IBMPlexSansArabic_600SemiBold'
                    : 'IBMPlexSansArabic_400Regular',
                },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    // RTL: first tab (الرئيسية) sits on the visual right.
    flexDirection: 'row-reverse',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 6,
    elevation: 0,
    shadowOpacity: 0,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    gap: 2,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: '#D6DCF5',
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
