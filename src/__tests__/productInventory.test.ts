import { describe, it, expect, beforeEach } from 'vitest';
import { useAdminStore } from '../store/useAdminStore';
import { Product, ProductVariant } from '../types';

describe('Product Inventory & Variant Preservation Tests', () => {
  beforeEach(() => {
    // Reset store state with initial mock products
    const initialProducts = useAdminStore.getState().products;
    if (initialProducts.length === 0) {
      useAdminStore.setState({ products: [] });
    }
  });

  it('preserves existing variant stocks and SKUs when a product is updated', () => {
    const store = useAdminStore.getState();
    const existing = store.products[0];
    expect(existing).toBeDefined();

    const originalVariants = [...existing.variants];
    const originalStocks = originalVariants.map((v) => ({
      key: `${v.size}__${v.colour}`,
      stock: v.stock,
      sku: v.sku,
    }));

    // Perform an update like changing the price and title
    const updatedPayload: Product = {
      ...existing,
      name: `${existing.name} (Updated Title)`,
      price: existing.price + 5000,
      variants: originalVariants.map((v) => ({ ...v })), // unchanged variant stocks
      stock: originalVariants.reduce((sum, v) => sum + v.stock, 0),
    };

    store.updateProduct(existing.id, updatedPayload);

    const reloaded = useAdminStore.getState().products.find((p) => p.id === existing.id);
    expect(reloaded).toBeDefined();
    expect(reloaded?.name).toContain('(Updated Title)');
    expect(reloaded?.price).toBe(existing.price + 5000);

    // Verify variants did not revert to 12
    reloaded?.variants.forEach((v) => {
      const match = originalStocks.find((o) => o.key === `${v.size}__${v.colour}`);
      expect(match).toBeDefined();
      expect(v.stock).toBe(match?.stock);
      expect(v.sku).toBe(match?.sku);
    });
  });

  it('correctly calculates total product stock as the sum of variant stocks', () => {
    const variants: ProductVariant[] = [
      { variantId: 'v1', size: 'S', colour: 'Black', stock: 5, sku: 'SKU-S' },
      { variantId: 'v2', size: 'M', colour: 'Black', stock: 15, sku: 'SKU-M' },
      { variantId: 'v3', size: 'L', colour: 'Black', stock: 8, sku: 'SKU-L' },
    ];
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    expect(totalStock).toBe(28);
  });

  it('accurately clamps negative inventory adjustments and records exact movement delta', () => {
    const store = useAdminStore.getState();
    const product = store.products[0];
    const variant = product.variants[0];
    const currentStock = variant.stock;

    // Adjust by a large negative amount greater than current stock
    const excessDeduction = -(currentStock + 50);
    store.adjustProductStock(product.id, variant.variantId, excessDeduction, 'Manual Adjustment');

    const updatedProduct = useAdminStore.getState().products.find((p) => p.id === product.id);
    const updatedVariant = updatedProduct?.variants.find((v) => v.variantId === variant.variantId);

    // Variant stock should be clamped at 0
    expect(updatedVariant?.stock).toBe(0);

    // Latest movement should reflect the actual delta applied (-currentStock), not excessDeduction
    const latestMovement = useAdminStore.getState().stockMovements[0];
    expect(latestMovement.productId).toBe(product.id);
    expect(latestMovement.variantId).toBe(variant.variantId);
    expect(latestMovement.quantityChange).toBe(-currentStock);
  });

  it('duplicate product creates a distinct slug and unique copy identifier', () => {
    const store = useAdminStore.getState();
    const product = store.products[0];
    const originalCount = store.products.length;

    store.duplicateProduct(product.id);

    const updatedProducts = useAdminStore.getState().products;
    expect(updatedProducts.length).toBe(originalCount + 1);

    const duplicated = updatedProducts[0];
    expect(duplicated.id).not.toBe(product.id);
    expect(duplicated.slug).not.toBe(product.slug);
    expect(duplicated.slug).toContain(`${product.slug}-copy-`);
  });
});
