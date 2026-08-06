import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { ar } from '@/constants/i18n';
import { Colors, Radius } from '@/constants/theme';
import { useAccessories, useGlassTypes } from '@/hooks/useCatalog';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useWizardStore } from '@/stores/wizardStore';

const { width: SCREEN_W } = Dimensions.get('window');

export function StepProductDetails({ onRequest }: { onRequest: () => void }) {
  const { colors } = useAppTheme();
  const product = useWizardStore((s) => s.selectedProduct);
  const measurements = useWizardStore((s) => s.measurements);
  const selectedVariant = useWizardStore((s) => s.selectedVariant);
  const selectedGlass = useWizardStore((s) => s.selectedGlass);
  const selectedAccessories = useWizardStore((s) => s.selectedAccessories);
  const selectedColor = useWizardStore((s) => s.selectedColor);
  const setSelectedVariant = useWizardStore((s) => s.setSelectedVariant);
  const setSelectedGlass = useWizardStore((s) => s.setSelectedGlass);
  const toggleAccessory = useWizardStore((s) => s.toggleAccessory);
  const setSelectedColor = useWizardStore((s) => s.setSelectedColor);
  const { data: glassTypes = [] } = useGlassTypes();
  const { data: accessories = [] } = useAccessories();
  const [imageIndex, setImageIndex] = useState(0);

  if (!product) return null;

  const productGlass = glassTypes.filter((g) => product.glassTypes.includes(g.id));
  const productAcc = accessories.filter((a) => product.accessories.includes(a.id));
  const selectedColorName = product.colors.find((c) => c.id === selectedColor)?.nameAr;

  const cardBg = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    shadowOpacity: 0.06,
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.pad} showsVerticalScrollIndicator={false}>
        <View style={styles.galleryWrap}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const i = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_W - 40));
              setImageIndex(i);
            }}
          >
            {product.images.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.galleryImage} contentFit="cover" />
            ))}
          </ScrollView>
          {product.images.length > 1 ? (
            <View style={styles.dots}>
              {product.images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, { backgroundColor: i === imageIndex ? Colors.primary : '#C8CBD4' }]}
                />
              ))}
            </View>
          ) : null}
        </View>

        <Text style={[styles.name, { color: Colors.primary }]}>{product.nameAr}</Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>{product.descriptionAr}</Text>

        <View style={[styles.measureCard, cardBg]}>
          <Text style={[styles.measureHint, { color: colors.textMuted }]}>
            القياسات المطلوبة: {measurements.width}×{measurements.height} سم · الكمية {measurements.quantity}
          </Text>
        </View>

        <View style={[styles.sectionCard, cardBg]}>
          <Text style={[styles.sectionTitle, { color: Colors.primary }]}>{ar.services.specifications}</Text>
          {product.specifications.map((s, idx) => (
            <View
              key={s.label}
              style={[
                styles.specRow,
                idx < product.specifications.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.specLabel, { color: Colors.primary }]}>{s.label}</Text>
              <Text style={[styles.specValue, { color: colors.textSecondary }]}>{s.value}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.sectionCard, cardBg]}>
          <Text style={[styles.sectionTitle, { color: Colors.primary }]}>{ar.services.dimensions}</Text>
          <View style={styles.dimRow}>
            <View style={[styles.dimBox, { backgroundColor: '#F0F1F5' }]}>
              <Text style={styles.dimLabel}>العرض</Text>
              <Text style={[styles.dimValue, { color: Colors.primary }]}>
                {product.minimumWidth}–{product.maximumWidth} سم
              </Text>
            </View>
            <View style={[styles.dimBox, { backgroundColor: '#F0F1F5' }]}>
              <Text style={styles.dimLabel}>الارتفاع</Text>
              <Text style={[styles.dimValue, { color: Colors.primary }]}>
                {product.minimumHeight}–{product.maximumHeight} سم
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, cardBg]}>
          <View style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, { color: Colors.primary, marginBottom: 0 }]}>
              {ar.services.colors}
            </Text>
            {selectedColorName ? <Text style={styles.goldText}>{selectedColorName}</Text> : null}
          </View>
          <View style={styles.colorRow}>
            {product.colors.map((c) => {
              const active = selectedColor === c.id;
              return (
                <Pressable key={c.id} onPress={() => setSelectedColor(c.id)} style={styles.colorItem}>
                  <View
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor: c.hex,
                        borderColor: active ? Colors.primary : colors.border,
                        borderWidth: active ? 3 : 1,
                      },
                    ]}
                  />
                  <Text
                    style={[styles.colorName, { color: active ? Colors.primary : colors.textMuted }]}
                    numberOfLines={1}
                  >
                    {c.nameAr}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {product.variants.length ? (
          <View style={[styles.sectionCard, cardBg]}>
            <Text style={[styles.sectionTitle, { color: Colors.primary }]}>الخيارات</Text>
            <View style={styles.chips}>
              {product.variants.map((v) => {
                const active = selectedVariant === v;
                return (
                  <Pressable
                    key={v}
                    onPress={() => setSelectedVariant(v)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? Colors.primary : '#F0F1F5',
                        borderColor: active ? Colors.primary : 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: active ? Colors.white : Colors.primary,
                        fontFamily: 'IBMPlexSansArabic_500Medium',
                        fontSize: 13,
                      }}
                    >
                      {v}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {productGlass.length ? (
          <View style={[styles.sectionCard, cardBg]}>
            <Text style={[styles.sectionTitle, { color: Colors.primary }]}>{ar.services.glassTypes}</Text>
            <View style={styles.chips}>
              {productGlass.map((g) => {
                const active = selectedGlass === g.id;
                return (
                  <Pressable
                    key={g.id}
                    onPress={() => setSelectedGlass(g.id)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? Colors.primary : '#F0F1F5',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: active ? Colors.white : Colors.primary,
                        fontFamily: 'IBMPlexSansArabic_500Medium',
                        fontSize: 13,
                      }}
                    >
                      {g.nameAr}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {productAcc.length ? (
          <View style={[styles.sectionCard, cardBg]}>
            <Text style={[styles.sectionTitle, { color: Colors.primary }]}>{ar.services.accessories}</Text>
            {productAcc.map((a) => {
              const active = selectedAccessories.includes(a.id);
              return (
                <Pressable
                  key={a.id}
                  onPress={() => toggleAccessory(a.id)}
                  style={[
                    styles.accRow,
                    {
                      backgroundColor: '#F7F8FA',
                      borderColor: active ? Colors.accent : 'transparent',
                    },
                  ]}
                >
                  <Ionicons
                    name={active ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={active ? Colors.accent : colors.textMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.accName, { color: Colors.primary }]}>{a.nameAr}</Text>
                    {a.descriptionAr ? (
                      <Text style={[styles.goldText, { marginTop: 2 }]}>{a.descriptionAr}</Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Button title={ar.services.requestProduct} onPress={onRequest} variant="primary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  galleryWrap: {
    marginBottom: 16,
  },
  galleryImage: {
    width: SCREEN_W - 40,
    height: 240,
    borderRadius: 18,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  name: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  desc: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 6,
    marginBottom: 14,
  },
  measureCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#1E275E',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  measureHint: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1E275E',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  sectionHead: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 15,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  specLabel: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 13,
    writingDirection: 'rtl',
  },
  specValue: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    writingDirection: 'rtl',
  },
  dimRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  dimBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  dimLabel: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 11,
    color: '#B08A5A',
    textAlign: 'right',
  },
  dimValue: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 13,
    textAlign: 'right',
  },
  colorRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorItem: {
    alignItems: 'center',
    width: 52,
    gap: 4,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorName: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 10,
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  accRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  accName: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  goldText: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    color: '#B08A5A',
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
