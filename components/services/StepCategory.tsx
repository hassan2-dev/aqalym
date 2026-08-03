import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ar } from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { Category } from '@/types/models';

const { width: SCREEN_W } = Dimensions.get('window');
const PAD = 20;
const GAP = 12;
const CARD_W = (SCREEN_W - PAD * 2 - GAP) / 2;

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  doors: 'exit-outline',
  windows: 'grid-outline',
  facades: 'business-outline',
  fixed_glass: 'apps-outline',
  shutters: 'menu-outline',
};

interface StepCategoryProps {
  categories: Category[];
  onSelect: (c: Category) => void;
}

export function StepCategory({ categories, onSelect }: StepCategoryProps) {
  const { colors, isDark } = useAppTheme();
  const grid = categories.filter((c) => c.slug !== 'shutters').slice(0, 4);
  const shutters = categories.find((c) => c.slug === 'shutters');

  const cardShadow = {
    shadowColor: '#1E275E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0 : 0.06,
    shadowRadius: 12,
    elevation: isDark ? 0 : 2,
  };

  const renderCard = (cat: Category, fullWidth = false) => (
    <Pressable
      key={cat.id}
      onPress={() => onSelect(cat)}
      style={[
        fullWidth ? styles.wideCard : styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        cardShadow,
        fullWidth && styles.wideInner,
      ]}
    >
      <View style={[styles.iconBox, fullWidth && styles.iconBoxWide]}>
        <Ionicons name={ICONS[cat.slug] ?? 'cube-outline'} size={26} color={Colors.primary} />
      </View>
      <View style={fullWidth ? styles.wideText : undefined}>
        <Text style={[styles.title, { color: Colors.primary }, fullWidth && styles.titleWide]}>
          {cat.nameAr}
        </Text>
        <Text style={[styles.subtitle, fullWidth && styles.subtitleWide]}>{cat.descriptionAr}</Text>
      </View>
    </Pressable>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.pad}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.heading, { color: Colors.primary }]}>{ar.services.selectTitle}</Text>
      <Text style={[styles.lead, { color: colors.textSecondary }]}>{ar.services.selectSubtitle}</Text>

      <View style={styles.grid}>
        {grid.map((cat) => renderCard(cat))}
      </View>

      {shutters ? <View style={{ marginTop: GAP }}>{renderCard(shutters, true)}</View> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: {
    paddingHorizontal: PAD,
    paddingBottom: 28,
  },
  heading: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 24,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },
  lead: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  card: {
    width: CARD_W,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 22,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 10,
  },
  wideCard: {
    width: '100%',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  wideInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F0F1F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxWide: {
    marginBottom: 0,
  },
  wideText: {
    flex: 1,
  },
  title: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 16,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  titleWide: {
    textAlign: 'right',
  },
  subtitle: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    color: '#B08A5A',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  subtitleWide: {
    textAlign: 'right',
    marginTop: 2,
  },
});
