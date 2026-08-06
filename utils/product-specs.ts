import type { ProductSpec, SpecCatalog } from '@/types/models';

export function mergeProductSpecifications(
  catalog: SpecCatalog | null | undefined,
  extraSpecifications: ProductSpec[] | undefined,
): ProductSpec[] {
  return [...(catalog?.specifications ?? []), ...(extraSpecifications ?? [])];
}

export function resolveProductSpecifications(
  product: {
    catalogId?: string | null;
    extraSpecifications?: ProductSpec[];
    specifications?: ProductSpec[];
  },
  catalog?: SpecCatalog | null,
): ProductSpec[] {
  const merged = mergeProductSpecifications(catalog, product.extraSpecifications);
  if (merged.length) return merged;
  return product.specifications ?? [];
}
