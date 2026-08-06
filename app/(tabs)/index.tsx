import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HeroBanner } from '@/components/home/HeroBanner';
import { HomeHeader } from '@/components/home/HomeHeader';
import {
  CategoryCircle,
  FeaturedGridCard,
  ProjectsGallery,
  SectionHeader,
  WhySection,
} from '@/components/home/HomeSections';
import { Skeleton } from '@/components/ui/Skeleton';
import { ar } from '@/constants/i18n';
import { useCategories, useProjects, useReadyProducts } from '@/hooks/useCatalog';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useWizardStore } from '@/stores/wizardStore';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { data: categories = [], isLoading: catLoading } = useCategories();
  const { data: readyProducts = [], isLoading: readyLoading } = useReadyProducts();
  const { data: projects = [], isLoading: projLoading } = useProjects();
  const setCategory = useWizardStore((s) => s.setCategory);
  const setStep = useWizardStore((s) => s.setStep);
  const reset = useWizardStore((s) => s.reset);

  const goServices = () => router.push('/(tabs)/services');

  const openCategory = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;
    reset();
    setCategory(cat);
    setStep(2);
    goServices();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HomeHeader onNotifications={() => router.push('/notifications')} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeroBanner onCta={goServices} />

        <View style={styles.block}>
          <View style={styles.pad}>
            <SectionHeader
              title={ar.home.categoriesTitle}
              actionLabel={ar.home.viewAll}
              onAction={goServices}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catList}
          >
            {catLoading
              ? [1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} width={72} height={72} borderRadius={20} />
                ))
              : categories.map((cat) => (
                  <CategoryCircle
                    key={cat.id}
                    category={cat}
                    onPress={() => openCategory(cat.id)}
                  />
                ))}
          </ScrollView>
        </View>

        <View style={[styles.block, styles.pad]}>
          <SectionHeader
            title={ar.home.featuredTitle}
            actionLabel={ar.home.viewAll}
            onAction={() => router.push('/ready-products')}
          />
          {readyLoading ? (
            <View style={styles.grid}>
              <Skeleton height={180} style={{ flex: 1, borderRadius: 14 }} />
              <Skeleton height={180} style={{ flex: 1, borderRadius: 14 }} />
            </View>
          ) : (
            <View style={styles.gridWrap}>
              {readyProducts.slice(0, 4).map((p) => (
                <FeaturedGridCard
                  key={p.id}
                  product={p}
                  onPress={() =>
                    router.push({ pathname: '/product/[id]', params: { id: p.id } })
                  }
                />
              ))}
            </View>
          )}
        </View>

        <View style={[styles.block, styles.pad]}>
          <SectionHeader
            title={ar.home.projectsTitle}
            actionLabel={ar.home.viewAll}
            onAction={() => router.push('/projects')}
          />
          {projLoading ? (
            <Skeleton height={300} borderRadius={16} />
          ) : (
            <ProjectsGallery projects={projects} />
          )}
        </View>

        <WhySection />

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 16,
  },
  block: {
    marginTop: 28,
  },
  pad: {
    paddingHorizontal: 20,
  },
  catList: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 20,
    gap: 14,
  },
  grid: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  gridWrap: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
