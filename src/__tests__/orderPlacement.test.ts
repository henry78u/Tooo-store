import { describe, it, expect, beforeEach } from 'vitest';
import { useAdminStore } from '../store/useAdminStore';
import { useStore } from '../store/useStore';
import { orderService } from '../services/orderService';
import { CartItem } from '../types';

describe('Order Placement & Coordinated Inventory Tests', () => {
  beforeEach(() => {
    // Reset stores
    useStore.setState({ cart: [], orders: [] });
  });

  it('successfully places an order, decrements variant stock, and logs stock movements with reason "Sale"', async () => {
    const adminStore = useAdminStore.getState();
    const product = adminStore.products[0];
    expect(product).toBeDefined();

    // Select a variant with known stock
    const variant = product.variants[0];
    const initialVariantStock = variant.stock;
    expect(initialVariantStock).toBeGreaterThan(0);

    const testItem: CartItem = {
      id: `${product.id}-${variant.size}-${variant.colour}`,
      product: { ...product },
      selectedSize: variant.size,
      selectedColour: variant.colour,
      quantity: 2,
      unitPrice: product.price,
    };

    const initialMovementsCount = adminStore.stockMovements.length;

    const result = await orderService.placeOrder({
      customerInfo: {
        fullName: 'Folake Adeyemi',
        email: 'folake@example.com',
        phone: '+234 802 111 2233',
      },
      deliveryAddress: {
        fullName: 'Folake Adeyemi',
        email: 'folake@example.com',
        phone: '+234 802 111 2233',
        street: '7 Victoria Island Crescent',
        city: 'Lagos',
        state: 'Lagos',
      },
      paymentMethod: 'Card (Demo)',
      items: [testItem],
      shippingFee: 5000,
    });

    expect(result.success).toBe(true);
    expect(result.order).toBeDefined();
    const orderRef = result.order!.orderReference;

    // Check variant stock was decremented by 2
    const updatedProduct = useAdminStore.getState().products.find((p) => p.id === product.id);
    const updatedVariant = updatedProduct?.variants.find((v) => v.variantId === variant.variantId);
    expect(updatedVariant?.stock).toBe(initialVariantStock - 2);

    // Verify stock movement record created with reason 'Sale'
    const newMovements = useAdminStore.getState().stockMovements;
    expect(newMovements.length).toBe(initialMovementsCount + 1);
    const latestMovement = newMovements[0];
    expect(latestMovement.productId).toBe(product.id);
    expect(latestMovement.variantId).toBe(variant.variantId);
    expect(latestMovement.quantityChange).toBe(-2);
    expect(latestMovement.reason).toBe('Sale');

    // Verify order is in both stores
    const customerOrders = useStore.getState().orders;
    expect(customerOrders.some((o) => o.orderReference === orderRef)).toBe(true);

    const adminOrders = useAdminStore.getState().orders;
    expect(adminOrders.some((o) => o.orderReference === orderRef)).toBe(true);

    // Verify cart is cleared
    expect(useStore.getState().cart.length).toBe(0);
  });

  it('rejects order placement when requested quantity exceeds available stock', async () => {
    const adminStore = useAdminStore.getState();
    const product = adminStore.products[0];
    const variant = product.variants[0];
    const currentStock = variant.stock;

    const excessItem: CartItem = {
      id: `${product.id}-${variant.size}-${variant.colour}`,
      product: { ...product },
      selectedSize: variant.size,
      selectedColour: variant.colour,
      quantity: currentStock + 50,
      unitPrice: product.price,
    };

    const result = await orderService.placeOrder({
      customerInfo: {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+234 800 000 0000',
      },
      deliveryAddress: {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+234 800 000 0000',
        street: 'Test Street',
        city: 'Lagos',
        state: 'Lagos',
      },
      paymentMethod: 'Card (Demo)',
      items: [excessItem],
      shippingFee: 5000,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Insufficient stock');

    // Stock should not have changed
    const unchangedProduct = useAdminStore.getState().products.find((p) => p.id === product.id);
    const unchangedVariant = unchangedProduct?.variants.find((v) => v.variantId === variant.variantId);
    expect(unchangedVariant?.stock).toBe(currentStock);
  });

  it('replenishes inventory on cancellation and is idempotent against double cancellation', async () => {
    const adminStore = useAdminStore.getState();
    const product = adminStore.products[1];
    const variant = product.variants[0];
    const initialStock = variant.stock;

    // Place an order for 3 units
    const testItem: CartItem = {
      id: `${product.id}-${variant.size}-${variant.colour}`,
      product: { ...product },
      selectedSize: variant.size,
      selectedColour: variant.colour,
      quantity: 3,
      unitPrice: product.price,
    };

    const orderRes = await orderService.placeOrder({
      customerInfo: {
        fullName: 'Cancel Test',
        email: 'cancel@example.com',
        phone: '+234 809 111 2222',
      },
      deliveryAddress: {
        fullName: 'Cancel Test',
        email: 'cancel@example.com',
        phone: '+234 809 111 2222',
        street: 'Cancellation Avenue',
        city: 'Abuja',
        state: 'FCT',
      },
      paymentMethod: 'Card (Demo)',
      items: [testItem],
      shippingFee: 5000,
    });

    expect(orderRes.success).toBe(true);
    const orderRef = orderRes.order!.orderReference;

    // Confirm intermediate stock
    const intermediateProduct = useAdminStore.getState().products.find((p) => p.id === product.id);
    expect(intermediateProduct?.variants.find((v) => v.variantId === variant.variantId)?.stock).toBe(
      initialStock - 3
    );

    // First cancellation
    const cancelRes1 = orderService.cancelOrder(orderRef, 'Customer requested immediate cancellation');
    expect(cancelRes1.success).toBe(true);

    // Stock should be restored to initialStock
    const restoredProduct = useAdminStore.getState().products.find((p) => p.id === product.id);
    expect(restoredProduct?.variants.find((v) => v.variantId === variant.variantId)?.stock).toBe(
      initialStock
    );

    // Check cancellation stock movement recorded
    const movements = useAdminStore.getState().stockMovements;
    const cancellationMovement = movements[0];
    expect(cancellationMovement.reason).toBe('Cancellation');
    expect(cancellationMovement.quantityChange).toBe(3);

    // Second cancellation attempt should fail and not double-replenish
    const cancelRes2 = orderService.cancelOrder(orderRef, 'Duplicate cancellation call');
    expect(cancelRes2.success).toBe(false);
    expect(cancelRes2.message).toContain('already been cancelled');

    // Stock should STILL be initialStock, not initialStock + 3
    const finalProduct = useAdminStore.getState().products.find((p) => p.id === product.id);
    expect(finalProduct?.variants.find((v) => v.variantId === variant.variantId)?.stock).toBe(
      initialStock
    );
  });
});
