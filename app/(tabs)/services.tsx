import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { HomeHeader } from '@/components/home/HomeHeader';
import { ServiceStepIndicator } from '@/components/services/ServiceStepIndicator';
import { StepCategory } from '@/components/services/StepCategory';
import {
  StepAuth,
  StepMatching,
  StepMeasurements,
  StepProductDetails,
  StepProductList,
  StepProjectInfo,
  StepSuccess,
  WizardProgress,
} from '@/components/services/WizardSteps';
import { ar } from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import {
  useCategories,
  useCompatibleProducts,
  useCreateOrder,
} from '@/hooks/useCatalog';
import { useAppTheme } from '@/hooks/useAppTheme';
import { notifyOrderSubmitted } from '@/services/notifications';
import { useAuthStore } from '@/stores/authStore';
import { useWizardStore } from '@/stores/wizardStore';

export default function ServicesScreen() {
  const { colors } = useAppTheme();
  const step = useWizardStore((s) => s.step);
  const category = useWizardStore((s) => s.category);
  const measurements = useWizardStore((s) => s.measurements);
  const compatibleProducts = useWizardStore((s) => s.compatibleProducts);
  const selectedProduct = useWizardStore((s) => s.selectedProduct);
  const back = useWizardStore((s) => s.back);
  const next = useWizardStore((s) => s.next);
  const setStep = useWizardStore((s) => s.setStep);
  const setCategory = useWizardStore((s) => s.setCategory);
  const setCompatibleProducts = useWizardStore((s) => s.setCompatibleProducts);
  const setSelectedProduct = useWizardStore((s) => s.setSelectedProduct);
  const setSubmitted = useWizardStore((s) => s.setSubmitted);
  const reset = useWizardStore((s) => s.reset);
  const wizard = useWizardStore();

  const { data: categories = [] } = useCategories();

  const matchingEnabled = step === 3 && !!category;
  const compatibleQuery = useCompatibleProducts(category?.id, measurements, matchingEnabled);

  const createOrder = useCreateOrder();
  const user = useAuthStore((s) => s.user);

  const onMatchingReady = useCallback(() => {
    const products = compatibleQuery.data ?? [];
    setCompatibleProducts(products);
    setStep(4);
  }, [compatibleQuery.data, setCompatibleProducts, setStep]);

  const onMatchingEmpty = useCallback(() => {
    setCompatibleProducts([]);
    setStep(4);
  }, [setCompatibleProducts, setStep]);

  const submit = async () => {
    if (!selectedProduct || !category || !user) return;

    const colorName = selectedProduct.colors.find((c) => c.id === wizard.selectedColor)?.nameAr;

    const order = await createOrder.mutateAsync({
      customerName: wizard.customerName,
      customerPhone: user.phone,
      categoryId: category.id,
      categorySlug: category.slug,
      categoryName: category.nameAr,
      productId: selectedProduct.id,
      productName: selectedProduct.nameAr,
      productImage: selectedProduct.images[0],
      measurements,
      selectedVariant: wizard.selectedVariant ?? undefined,
      selectedGlass: wizard.selectedGlass ?? undefined,
      selectedAccessories: wizard.selectedAccessories,
      selectedColor: colorName,
      location: {
        governorate: wizard.governorate,
        city: wizard.city,
        address: wizard.address,
        latitude: wizard.latitude ?? undefined,
        longitude: wizard.longitude ?? undefined,
      },
      estimatedPrice: 0,
      orderKind: 'custom' as const,
      notes: wizard.notes || undefined,
    });

    await notifyOrderSubmitted(order.orderNumber);
    await useAuthStore.getState().updateProfile({
      name: wizard.customerName,
      governorate: wizard.governorate,
      city: wizard.city,
    });
    setSubmitted(order.id, order.orderNumber);
  };

  const isEarly = step === 1 || step === 2;
  const progressStep = step === 8 ? 7 : step === 3 ? 3 : Math.min(step, 7);

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      {isEarly ? (
        <HomeHeader
          onNotifications={() => router.push('/(tabs)/orders')}
        />
      ) : (
        <View style={styles.header}>
          {step > 1 && step < 8 ? (
            <Pressable onPress={back} hitSlop={12} style={styles.backBtn}>
              <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
            </Pressable>
          ) : (
            <View style={{ width: 24 }} />
          )}
          <Text style={[styles.title, { color: Colors.primary }]}>{ar.services.title}</Text>
          <View style={{ width: 24 }} />
        </View>
      )}

      {step === 1 || step === 2 ? (
        <ServiceStepIndicator activeStep={step === 1 ? 1 : 2} />
      ) : step < 8 ? (
        <WizardProgress step={progressStep} />
      ) : null}

      <View style={{ flex: 1 }}>
        {step === 1 && (
          <StepCategory
            categories={categories}
            onSelect={(c) => {
              setCategory(c);
              next();
            }}
          />
        )}
        {step === 2 && <StepMeasurements onNext={() => setStep(3)} />}
        {step === 3 && (
          <StepMatching
            loading={compatibleQuery.isFetching || compatibleQuery.isLoading}
            products={compatibleQuery.data ?? []}
            onReady={onMatchingReady}
            onEmpty={onMatchingEmpty}
          />
        )}
        {step === 4 && (
          <StepProductList
            products={compatibleProducts}
            onSelect={(p) => {
              setSelectedProduct(p);
              setStep(5);
            }}
            onRetry={() => setStep(2)}
          />
        )}
        {step === 5 && (
          <StepProductDetails
            onRequest={() => {
              if (user) setStep(7);
              else setStep(6);
            }}
          />
        )}
        {step === 6 && <StepAuth onAuthenticated={() => setStep(7)} />}
        {step === 7 && <StepProjectInfo onSubmit={submit} loading={createOrder.isPending} />}
        {step === 8 && (
          <StepSuccess
            orderNumber={wizard.submittedOrderNumber ?? ''}
            onViewOrders={() => {
              reset();
              router.push('/(tabs)/orders');
            }}
            onNew={() => reset()}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 52,
  },
  title: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 20,
    writingDirection: 'rtl',
  },
  backBtn: {
    padding: 4,
  },
});
