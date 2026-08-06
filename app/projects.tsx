import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Skeleton } from '@/components/ui/Skeleton';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useProjects } from '@/hooks/useCatalog';

export default function ProjectsScreen() {
  const { colors } = useAppTheme();
  const { data: projects = [], isLoading } = useProjects();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        نماذج من مشاريعنا المنفذة في مختلف المحافظات
      </Text>

      {isLoading ? (
        <View style={{ gap: 16 }}>
          <Skeleton height={220} borderRadius={18} />
          <Skeleton height={220} borderRadius={18} />
        </View>
      ) : (
        <View style={{ gap: 16 }}>
          {projects.map((project) => (
            <View
              key={project.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Image source={{ uri: project.image }} style={styles.image} contentFit="cover" />
              <View style={styles.info}>
                <Text style={[styles.title, { color: Colors.primary }]}>{project.titleAr}</Text>
                <Text style={[styles.desc, { color: colors.textSecondary }]}>
                  {project.descriptionAr}
                </Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={14} color={Colors.accent} />
                    <Text style={styles.metaText}>{project.locationAr}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.accent} />
                    <Text style={styles.metaText}>{project.year}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  subtitle: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 18,
  },
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  info: {
    padding: 14,
    gap: 6,
  },
  title: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  desc: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  metaRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 12,
    color: Colors.accent,
    writingDirection: 'rtl',
  },
});
