import { create } from 'zustand';

import type { Category, Measurements, Product } from '@/types/models';

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface WizardState {
  step: WizardStep;
  category: Category | null;
  measurements: Measurements;
  compatibleProducts: Product[];
  selectedProduct: Product | null;
  selectedVariant: string | null;
  selectedGlass: string | null;
  selectedAccessories: string[];
  selectedColor: string | null;
  customerName: string;
  governorate: string;
  city: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  notes: string;
  submittedOrderId: string | null;
  submittedOrderNumber: string | null;
  setStep: (step: WizardStep) => void;
  next: () => void;
  back: () => void;
  setCategory: (category: Category) => void;
  setMeasurements: (m: Partial<Measurements>) => void;
  setCompatibleProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedVariant: (v: string | null) => void;
  setSelectedGlass: (g: string | null) => void;
  toggleAccessory: (id: string) => void;
  setSelectedColor: (c: string | null) => void;
  setProjectInfo: (info: Partial<Pick<WizardState, 'customerName' | 'governorate' | 'city' | 'address' | 'latitude' | 'longitude' | 'notes'>>) => void;
  setSubmitted: (id: string, orderNumber: string) => void;
  reset: () => void;
}

const initialMeasurements: Measurements = { width: 0, height: 0, quantity: 1 };

export const useWizardStore = create<WizardState>((set, get) => ({
  step: 1,
  category: null,
  measurements: initialMeasurements,
  compatibleProducts: [],
  selectedProduct: null,
  selectedVariant: null,
  selectedGlass: null,
  selectedAccessories: [],
  selectedColor: null,
  customerName: '',
  governorate: '',
  city: '',
  address: '',
  latitude: null,
  longitude: null,
  notes: '',
  submittedOrderId: null,
  submittedOrderNumber: null,
  setStep: (step) => set({ step }),
  next: () => {
    const step = get().step;
    if (step < 8) set({ step: (step + 1) as WizardStep });
  },
  back: () => {
    const step = get().step;
    if (step > 1) set({ step: (step - 1) as WizardStep });
  },
  setCategory: (category) => set({ category, selectedProduct: null, compatibleProducts: [] }),
  setMeasurements: (m) => set({ measurements: { ...get().measurements, ...m } }),
  setCompatibleProducts: (compatibleProducts) => set({ compatibleProducts }),
  setSelectedProduct: (selectedProduct) =>
    set({
      selectedProduct,
      selectedVariant: selectedProduct?.variants[0] ?? null,
      selectedGlass: selectedProduct?.glassTypes[0] ?? null,
      selectedColor: selectedProduct?.colors[0]?.id ?? null,
      selectedAccessories: [],
    }),
  setSelectedVariant: (selectedVariant) => set({ selectedVariant }),
  setSelectedGlass: (selectedGlass) => set({ selectedGlass }),
  toggleAccessory: (id) => {
    const current = get().selectedAccessories;
    set({
      selectedAccessories: current.includes(id)
        ? current.filter((a) => a !== id)
        : [...current, id],
    });
  },
  setSelectedColor: (selectedColor) => set({ selectedColor }),
  setProjectInfo: (info) => set(info),
  setSubmitted: (submittedOrderId, submittedOrderNumber) =>
    set({ submittedOrderId, submittedOrderNumber, step: 8 }),
  reset: () =>
    set({
      step: 1,
      category: null,
      measurements: initialMeasurements,
      compatibleProducts: [],
      selectedProduct: null,
      selectedVariant: null,
      selectedGlass: null,
      selectedAccessories: [],
      selectedColor: null,
      customerName: '',
      governorate: '',
      city: '',
      address: '',
      latitude: null,
      longitude: null,
      notes: '',
      submittedOrderId: null,
      submittedOrderNumber: null,
    }),
}));
