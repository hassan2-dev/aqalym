export type OrderStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'sent_to_factory'
  | 'in_production'
  | 'ready'
  | 'transport'
  | 'installation'
  | 'completed'
  | 'cancelled';

export type CategorySlug = 'doors' | 'windows' | 'facades' | 'fixed_glass' | 'shutters';

export type ProductKind = 'ready' | 'custom';

export type OrderKind = 'ready' | 'custom';

export interface User {
  id: string;
  phone: string;
  name?: string;
  governorate?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  image: string;
  order: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

/** Global reusable specification template. */
export interface SpecCatalog {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  specifications: ProductSpec[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  categoryId: string;
  categorySlug: CategorySlug;
  kind: ProductKind;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  images: string[];
  /** For ready products these are the fixed standard dimensions. */
  minimumWidth: number;
  maximumWidth: number;
  minimumHeight: number;
  maximumHeight: number;
  /** Fixed unit price for ready products; unused in custom UI. */
  estimatedPrice: number;
  /** Linked standard catalog; null when unset. */
  catalogId: string | null;
  /** Product-only specification additions. */
  extraSpecifications: ProductSpec[];
  /** Denormalized catalog + extras for display. */
  specifications: ProductSpec[];
  variants: string[];
  glassTypes: string[];
  accessories: string[];
  colors: ProductColor[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductColor {
  id: string;
  name: string;
  nameAr: string;
  hex: string;
}

export interface Variant {
  id: string;
  productId: string;
  name: string;
  nameAr: string;
  priceModifier: number;
}

export interface GlassType {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  pricePerSqm: number;
}

export interface Accessory {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
}

export interface Measurements {
  width: number;
  height: number;
  quantity: number;
}

export interface OrderLocation {
  governorate: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderKind: OrderKind;
  categoryId: string;
  categorySlug: CategorySlug;
  categoryName: string;
  productId: string;
  productName: string;
  productImage?: string;
  measurements: Measurements;
  selectedVariant?: string;
  selectedGlass?: string;
  selectedAccessories: string[];
  selectedColor?: string;
  location: OrderLocation;
  estimatedPrice: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  location: string;
  locationAr: string;
  image: string;
  category: string;
  year: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  orderId?: string;
  read: boolean;
  createdAt: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  orderKind: OrderKind;
  categoryId: string;
  categorySlug: CategorySlug;
  categoryName: string;
  productId: string;
  productName: string;
  productImage?: string;
  measurements: Measurements;
  selectedVariant?: string;
  selectedGlass?: string;
  selectedAccessories: string[];
  selectedColor?: string;
  location: OrderLocation;
  estimatedPrice: number;
  notes?: string;
}
