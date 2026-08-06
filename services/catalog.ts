import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  orderBy,
} from 'firebase/firestore';

import {
  SEED_ACCESSORIES,
  SEED_CATALOGS,
  SEED_CATEGORIES,
  SEED_GLASS_TYPES,
  SEED_PRODUCTS,
  SEED_PROJECTS,
} from '@/data/seed';
import type {
  Accessory,
  Category,
  CreateOrderInput,
  GlassType,
  Measurements,
  Order,
  Product,
  Project,
  SpecCatalog,
  User,
} from '@/types/models';
import { getFirebaseAuth, getFirebaseDb, isDemoMode } from '@/services/firebase';
import { resolveProductSpecifications } from '@/utils/product-specs';

const ORDERS_KEY = '@aqalym/orders';
const USERS_KEY = '@aqalym/users';

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateOrderNumber() {
  const stamp = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 90 + 10);
  return `AQ-${stamp}${rand}`;
}

async function loadCatalogs(): Promise<SpecCatalog[]> {
  const db = getFirebaseDb();
  if (!db || isDemoMode) return [...SEED_CATALOGS];
  const snap = await getDocs(collection(db, 'catalogs'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SpecCatalog);
}

function hydrateProduct(product: Product, catalogs: SpecCatalog[]): Product {
  const catalog = catalogs.find((c) => c.id === product.catalogId) ?? null;
  return {
    ...product,
    catalogId: product.catalogId ?? null,
    extraSpecifications: product.extraSpecifications ?? [],
    specifications: resolveProductSpecifications(product, catalog),
  };
}

export async function getCatalogs(): Promise<SpecCatalog[]> {
  await delay(150);
  return loadCatalogs();
}

export async function getCatalogById(id: string): Promise<SpecCatalog | null> {
  const list = await loadCatalogs();
  return list.find((c) => c.id === id) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  await delay(200);
  const db = getFirebaseDb();
  if (!db || isDemoMode) {
    return [...SEED_CATEGORIES].sort((a, b) => a.order - b.order);
  }
  const snap = await getDocs(query(collection(db, 'categories'), orderBy('order')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Category);
}

export async function getProducts(categoryId?: string): Promise<Product[]> {
  await delay(250);
  const catalogs = await loadCatalogs();
  const db = getFirebaseDb();
  if (!db || isDemoMode) {
    const list = SEED_PRODUCTS.map((p) => hydrateProduct(p, catalogs));
    return categoryId ? list.filter((p) => p.categoryId === categoryId) : list;
  }
  const base = collection(db, 'products');
  const q = categoryId ? query(base, where('categoryId', '==', categoryId)) : query(base);
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Product)
    .map((p) => hydrateProduct(p, catalogs));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.kind === 'ready' && p.featured);
}

export async function getReadyProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.kind === 'ready');
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay(200);
  const catalogs = await loadCatalogs();
  const db = getFirebaseDb();
  if (!db || isDemoMode) {
    const found = SEED_PRODUCTS.find((p) => p.id === id);
    return found ? hydrateProduct(found, catalogs) : null;
  }
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) return null;
  return hydrateProduct({ id: snap.id, ...snap.data() } as Product, catalogs);
}

export async function filterCompatibleProducts(
  categoryId: string,
  measurements: Measurements,
): Promise<Product[]> {
  await delay(600);
  const products = await getProducts(categoryId);
  const { width, height } = measurements;
  return products.filter(
    (p) =>
      p.kind === 'custom' &&
      width >= p.minimumWidth &&
      width <= p.maximumWidth &&
      height >= p.minimumHeight &&
      height <= p.maximumHeight,
  );
}

export async function getProjects(): Promise<Project[]> {
  await delay(200);
  const db = getFirebaseDb();
  if (!db || isDemoMode) return SEED_PROJECTS;
  const snap = await getDocs(collection(db, 'projects'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Project);
}

export async function getGlassTypes(): Promise<GlassType[]> {
  const db = getFirebaseDb();
  if (!db || isDemoMode) return SEED_GLASS_TYPES;
  const snap = await getDocs(collection(db, 'glassTypes'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GlassType);
}

export async function getAccessories(): Promise<Accessory[]> {
  const db = getFirebaseDb();
  if (!db || isDemoMode) return SEED_ACCESSORIES;
  const snap = await getDocs(collection(db, 'accessories'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Accessory);
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  await delay(300);
  const db = getFirebaseDb();
  if (!db || isDemoMode) {
    const raw = await AsyncStorage.getItem(ORDERS_KEY);
    const all: Order[] = raw ? JSON.parse(raw) : [];
    return all
      .filter((o) => o.customerId === userId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  const snap = await getDocs(
    query(collection(db, 'orders'), where('customerId', '==', userId), orderBy('createdAt', 'desc')),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
}

export async function getOrderById(id: string): Promise<Order | null> {
  await delay(200);
  const db = getFirebaseDb();
  if (!db || isDemoMode) {
    const raw = await AsyncStorage.getItem(ORDERS_KEY);
    const all: Order[] = raw ? JSON.parse(raw) : [];
    return all.find((o) => o.id === id) ?? null;
  }
  const snap = await getDoc(doc(db, 'orders', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Order;
}

export async function createOrder(userId: string, input: CreateOrderInput): Promise<Order> {
  await delay(700);
  const now = new Date().toISOString();
  const order: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: generateOrderNumber(),
    customerId: userId,
    ...input,
    status: 'submitted',
    createdAt: now,
    updatedAt: now,
  };

  const db = getFirebaseDb();
  if (!db || isDemoMode) {
    const raw = await AsyncStorage.getItem(ORDERS_KEY);
    const all: Order[] = raw ? JSON.parse(raw) : [];
    all.unshift(order);
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(all));
    return order;
  }

  await setDoc(doc(db, 'orders', order.id), order);
  await setDoc(doc(db, 'orderItems', `${order.id}-item`), {
    id: `${order.id}-item`,
    orderId: order.id,
    productId: order.productId,
    measurements: order.measurements,
    estimatedPrice: order.estimatedPrice,
    createdAt: now,
  });
  return order;
}

export async function upsertUser(user: User): Promise<User> {
  const db = getFirebaseDb();
  if (!db || isDemoMode) {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    const map: Record<string, User> = raw ? JSON.parse(raw) : {};
    map[user.id] = user;
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(map));
    return user;
  }
  await setDoc(doc(db, 'users', user.id), user, { merge: true });
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = getFirebaseDb();
  if (!db || isDemoMode) {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    const map: Record<string, User> = raw ? JSON.parse(raw) : {};
    return map[id] ?? null;
  }
  const snap = await getDoc(doc(db, 'users', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as User;
}

export function getCurrentFirebaseUid(): string | null {
  const auth = getFirebaseAuth();
  return auth?.currentUser?.uid ?? null;
}

export function estimatePrice(
  base: number,
  measurements: Measurements,
  accessoriesTotal = 0,
): number {
  const areaFactor = (measurements.width * measurements.height) / 10000;
  const qty = measurements.quantity || 1;
  return Math.round((base * Math.max(areaFactor, 0.6) + accessoriesTotal) * qty);
}
