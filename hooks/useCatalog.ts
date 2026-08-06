import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createOrder,
  filterCompatibleProducts,
  getAccessories,
  getCatalogs,
  getCategories,
  getFeaturedProducts,
  getGlassTypes,
  getOrderById,
  getOrdersByUser,
  getProductById,
  getProducts,
  getProjects,
  getReadyProducts,
} from '@/services/catalog';
import type { CreateOrderInput, Measurements } from '@/types/models';
import { useAuthStore } from '@/stores/authStore';

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: getCategories });
}

export function useCatalogs() {
  return useQuery({ queryKey: ['catalogs'], queryFn: getCatalogs });
}

export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: ['products', categoryId ?? 'all'],
    queryFn: () => getProducts(categoryId),
  });
}

export function useFeaturedProducts() {
  return useQuery({ queryKey: ['products', 'featured'], queryFn: getFeaturedProducts });
}

export function useReadyProducts() {
  return useQuery({ queryKey: ['products', 'ready'], queryFn: getReadyProducts });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useCompatibleProducts(categoryId: string | undefined, measurements: Measurements, enabled: boolean) {
  return useQuery({
    queryKey: ['compatible', categoryId, measurements.width, measurements.height],
    queryFn: () => filterCompatibleProducts(categoryId!, measurements),
    enabled: enabled && !!categoryId && measurements.width > 0 && measurements.height > 0,
  });
}

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: getProjects });
}

export function useGlassTypes() {
  return useQuery({ queryKey: ['glassTypes'], queryFn: getGlassTypes });
}

export function useAccessories() {
  return useQuery({ queryKey: ['accessories'], queryFn: getAccessories });
}

export function useOrders() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => getOrdersByUser(userId!),
    enabled: !!userId,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: (input: CreateOrderInput) => {
      if (!userId) throw new Error('NOT_AUTHENTICATED');
      return createOrder(userId, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
