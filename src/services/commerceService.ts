import { useAdminStore } from '../store/useAdminStore';
import { DEMO_PRODUCTS, CATEGORIES_DATA } from '../data/products';
import { Product, ProductCategory } from '../types';

/**
 * Authoritative Unified Commerce Data Service
 * Bridges customer storefront and admin dashboard catalogue state.
 */
export const commerceService = {
  /**
   * Retrieves all active products from the store with fallback to seed data.
   */
  getProducts: (): Product[] => {
    const adminProducts = useAdminStore.getState().products;
    if (adminProducts && adminProducts.length > 0) {
      return adminProducts;
    }
    return DEMO_PRODUCTS;
  },

  /**
   * Retrieves all published, customer-visible products.
   */
  getPublishedProducts: (): Product[] => {
    const products = commerceService.getProducts();
    return products.filter((p) => (p as any).status !== 'Archived');
  },

  /**
   * Look up a product by URL slug.
   */
  getProductBySlug: (slug: string): Product | undefined => {
    if (!slug) return undefined;
    const clean = slug.toLowerCase().trim();
    const products = commerceService.getProducts();
    return products.find((p) => p.slug.toLowerCase().trim() === clean);
  },

  /**
   * Look up a product by ID.
   */
  getProductById: (id: string): Product | undefined => {
    if (!id) return undefined;
    const products = commerceService.getProducts();
    return products.find((p) => p.id === id);
  },

  /**
   * Look up a variant by product ID and variant ID.
   */
  getVariant: (productId: string, variantId: string) => {
    const product = commerceService.getProductById(productId);
    if (!product) return undefined;
    return product.variants?.find((v) => v.variantId === variantId);
  },

  /**
   * Match variant by product ID, size, and colour name.
   */
  findVariant: (productId: string, size: string, colourName: string) => {
    const product = commerceService.getProductById(productId);
    if (!product || !product.variants) return undefined;
    return product.variants.find(
      (v) =>
        v.size.toLowerCase() === size.toLowerCase() &&
        v.colour.toLowerCase().trim() === colourName.toLowerCase().trim()
    );
  },

  /**
   * Categories taxonomy
   */
  getCategories: () => {
    const adminCategories = useAdminStore.getState().categories;
    if (adminCategories && adminCategories.length > 0) {
      return adminCategories;
    }
    return CATEGORIES_DATA;
  },

  /**
   * Collections
   */
  getCollections: () => {
    return useAdminStore.getState().collections || [];
  },
};

/**
 * Reactive React hook to consume live catalog products in storefront components.
 */
export const useCommerceProducts = (): Product[] => {
  const products = useAdminStore((s) => s.products);
  return products && products.length > 0 ? products : DEMO_PRODUCTS;
};

/**
 * Reactive React hook to consume a single product by slug.
 */
export const useCommerceProduct = (slug?: string): Product | undefined => {
  const products = useCommerceProducts();
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();
  return products.find((p) => p.slug.toLowerCase().trim() === clean);
};
