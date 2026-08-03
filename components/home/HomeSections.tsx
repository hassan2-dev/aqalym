import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import { ar } from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { formatIQD } from '@/lib/format';
import type { Category, Product, Project } from '@/types/models';

const { width: SCREEN_W } = Dimensions.get('window');
const PAD = 20;
const GAP = 12;
const CARD_W = (SCREEN_W - PAD * 2 - GAP) / 2;

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  doors: 'exit-outline',
  windows: 'tablet-landscape-outline',
  facades: 'business-outline',
  fixed_glass: 'square-outline',
  shutters: 'options-outline',
};

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function CategoryCircle({
  category,
  onPress,
}: {
  category: Category;
  onPress: () => void;
}) {
  const { colors, isDark } = useAppTheme();
  const icon = CATEGORY_ICONS[category.slug] ?? 'cube-outline';

  return (
    <Pressable onPress={onPress} style={styles.catItem}>
      <View
        style={[
          styles.catCircle,
          {
            backgroundColor: colors.card,
            shadowOpacity: isDark ? 0 : 0.08,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons name={icon} size={28} color={Colors.primary} />
      </View>
      <Text style={[styles.catLabel, { color: colors.text }]} numberOfLines={1}>
        {category.nameAr}
      </Text>
    </Pressable>
  );
}

export function FeaturedGridCard({ product, onPress }: { product: Product; onPress: () => void }) {
  const { colors } = useAppTheme();
  return (
    <Pressable onPress={onPress} style={styles.gridCard}>
      <Image source={{ uri: product.images[0] }} style={styles.gridImage} contentFit="cover" />
      {product.kind === 'ready' ? (
        <View style={styles.readyTag}>
          <Text style={styles.readyTagText}>{ar.home.readyBadge}</Text>
        </View>
      ) : null}
      <Text style={[styles.gridTitle, { color: colors.text }]} numberOfLines={1}>
        {product.nameAr}
      </Text>
      <Text style={[styles.gridDesc, { color: colors.textSecondary }]} numberOfLines={1}>
        {product.kind === 'ready'
          ? `${product.minimumWidth}×${product.minimumHeight} سم`
          : product.descriptionAr}
      </Text>
      {product.kind === 'ready' ? (
        <Text style={styles.gridPrice}>
          {formatIQD(product.estimatedPrice)} {ar.orders.iqd}
        </Text>
      ) : null}
    </Pressable>
  );
}

export function ProjectsGallery({ projects }: { projects: Project[] }) {
  const main = projects[0];
  const side = projects.slice(1, 3);
  if (!main) return null;

  return (
    <View style={styles.gallery}>
      <View style={styles.galleryMain}>
        <Image source={{ uri: main.image }} style={styles.galleryMainImg} contentFit="cover" />
        <View style={styles.galleryOverlay}>
          <Text style={styles.galleryCaption}>{main.titleAr}</Text>
        </View>
      </View>
      {side.length > 0 ? (
        <View style={styles.galleryRow}>
          {side.map((p) => (
            <View key={p.id} style={styles.gallerySmall}>
              <Image source={{ uri: p.image }} style={styles.gallerySmallImg} contentFit="cover" />
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function WhySection() {
  const { colors, isDark } = useAppTheme();
  return (
    <View style={styles.section}>
      <View
        style={[
          styles.whyBox,
          { backgroundColor: isDark ? colors.card : '#EEF0F4' },
        ]}
      >
        <Text style={[styles.whyHeading, { color: colors.text }]}>{ar.home.whyTitle}</Text>
        <View style={styles.whyList}>
          {ar.why.map((item) => (
            <View key={item.title} style={styles.whyRow}>
              <View style={styles.whyIcon}>
                <Ionicons name={item.icon} size={20} color={Colors.white} />
              </View>
              <View style={styles.whyText}>
                <Text style={[styles.whyTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.whyBody, { color: colors.textSecondary }]}>{item.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: PAD,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 18,
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
  action: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 13,
    color: '#9A8B78',
  },
  catItem: {
    width: 84,
    alignItems: 'center',
    gap: 8,
  },
  catCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#1E275E',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  catLabel: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 12,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  gridCard: {
    width: CARD_W,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: CARD_W * 1.15,
    borderRadius: 14,
    marginBottom: 8,
  },
  readyTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(30,39,94,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  readyTagText: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 10,
    color: Colors.white,
  },
  gridTitle: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  gridDesc: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 11,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 2,
  },
  gridPrice: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 13,
    color: Colors.primary,
    textAlign: 'right',
    marginTop: 4,
  },
  gallery: {
    gap: 10,
  },
  galleryMain: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  galleryMainImg: {
    width: '100%',
    height: '100%',
  },
  galleryOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  galleryCaption: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 14,
    color: Colors.white,
    textAlign: 'right',
  },
  galleryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  gallerySmall: {
    flex: 1,
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
  },
  gallerySmallImg: {
    width: '100%',
    height: '100%',
  },
  whyBox: {
    borderRadius: 20,
    padding: 18,
    gap: 16,
  },
  whyHeading: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 18,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  whyList: {
    gap: 16,
  },
  whyRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  whyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyText: {
    flex: 1,
    gap: 4,
  },
  whyTitle: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  whyBody: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
