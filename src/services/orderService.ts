import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/useAdminStore';
import { CartItem, OrderAddress, OrderRecord, OrderStatus } from '../types';

let isSubmitting = false;

export interface PlaceOrderInput {
  customerInfo: { fullName: string; email: string; phone: string };
  deliveryAddress: OrderAddress;
  paymentMethod: 'Card (Demo)' | 'Bank Transfer (Demo)';
  items: CartItem[];
  promoCode?: string | null;
  discountPercentage?: number;
  shippingFee: number;
}

export interface PlaceOrderResult {
  success: boolean;
  order?: OrderRecord;
  error?: string;
}

/**
 * Coordinated Order Placement & Lifecycle Service
 * Bridges customer checkout and admin inventory, notifications, and accounting.
 */
export const orderService = {
  /**
   * Validate that all items in the cart are in stock with their chosen size & colour.
   */
  validateCartStock: (items: CartItem[]): { valid: boolean; error?: string } => {
    const products = useAdminStore.getState().products;

    for (const item of items) {
      const prod = products.find((p) => p.id === item.product.id);
      if (!prod) {
        return {
          valid: false,
          error: `Product "${item.product.name}" is no longer available in the catalogue.`,
        };
      }

      const variant = prod.variants.find(
        (v) =>
          v.size.toLowerCase() === item.selectedSize.toLowerCase() &&
          v.colour.toLowerCase().trim() === item.selectedColour.toLowerCase().trim()
      );

      if (!variant) {
        return {
          valid: false,
          error: `Variant ${item.selectedSize} / ${item.selectedColour} for "${item.product.name}" is no longer available.`,
        };
      }

      if (variant.stock < item.quantity) {
        return {
          valid: false,
          error: `Insufficient stock for "${item.product.name}" (${item.selectedSize} · ${item.selectedColour}). Only ${variant.stock} unit${variant.stock === 1 ? '' : 's'} available.`,
        };
      }
    }

    return { valid: true };
  },

  /**
   * Coordinated Order Placement
   * Handles stock deduction, double-click prevention, promo code counting, customer & admin sync.
   */
  placeOrder: async (input: PlaceOrderInput): Promise<PlaceOrderResult> => {
    // Idempotency lock to prevent double-submit
    if (isSubmitting) {
      return { success: false, error: 'An order is already being processed. Please wait.' };
    }

    if (!input.items || input.items.length === 0) {
      return { success: false, error: 'Your shopping bag is empty.' };
    }

    try {
      isSubmitting = true;

      // 1. Strict Stock Validation against authoritative products
      const stockCheck = orderService.validateCartStock(input.items);
      if (!stockCheck.valid) {
        return { success: false, error: stockCheck.error };
      }

      const adminStore = useAdminStore.getState();
      const customerStore = useStore.getState();

      // 2. Authoritative Price & Subtotal Calculation
      const subtotal = input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

      // 3. Discount Validation & Calculation
      let appliedDiscountAmount = 0;
      const appliedDiscountCode = input.promoCode || null;

      if (appliedDiscountCode) {
        const discountRule = adminStore.discounts.find(
          (d) => d.code.toUpperCase() === appliedDiscountCode.toUpperCase()
        );

        if (discountRule && discountRule.isActive) {
          if (discountRule.type === 'percentage') {
            appliedDiscountAmount = Math.round((subtotal * discountRule.value) / 100);
          } else {
            appliedDiscountAmount = Math.min(subtotal, discountRule.value);
          }
        } else if (input.discountPercentage && input.discountPercentage > 0) {
          appliedDiscountAmount = Math.round((subtotal * input.discountPercentage) / 100);
        }
      }

      const total = Math.max(0, subtotal - appliedDiscountAmount + input.shippingFee);
      const orderRef = `TOOO-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const dateString = now.toISOString().split('T')[0];
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // 4. Reserve & Deduct Variant Inventory with Audit Trail
      for (const item of input.items) {
        const prod = adminStore.products.find((p) => p.id === item.product.id);
        const variant = prod?.variants.find(
          (v) =>
            v.size.toLowerCase() === item.selectedSize.toLowerCase() &&
            v.colour.toLowerCase().trim() === item.selectedColour.toLowerCase().trim()
        );
        if (prod && variant) {
          adminStore.adjustProductStock(prod.id, variant.variantId, -item.quantity, 'Sale');
        }
      }

      // 5. Construct Order Record
      const orderRecord: OrderRecord = {
        orderReference: orderRef,
        date: dateString,
        items: input.items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          size: i.selectedSize,
          colour: i.selectedColour,
          quantity: i.quantity,
          price: i.unitPrice,
          image: i.product.images[0],
        })),
        subtotal,
        shippingFee: input.shippingFee,
        discount: appliedDiscountAmount,
        total,
        address: input.deliveryAddress,
        paymentMethod: input.paymentMethod,
        paymentStatus: 'Simulated Paid',
        deliveryStatus: 'Confirmed',
        timeline: [
          {
            status: 'Order Placed',
            timestamp: `${dateString} · ${timeString}`,
            completed: true,
            description: `Order ${orderRef} recorded in customer portal (Demo Verification)`,
          },
          {
            status: 'Confirmed',
            timestamp: `${dateString} · ${timeString}`,
            completed: true,
            description: 'Payment authorized and atelier inventory reserved',
          },
          {
            status: 'Processing',
            timestamp: 'Scheduled for tomorrow',
            completed: false,
            description: 'Garments steamed, wrapped in recycled tissue, and boxed',
          },
          {
            status: 'Shipped',
            timestamp: 'Pending Dispatch',
            completed: false,
            description: 'Courier dispatch handover with live SMS tracking',
          },
          {
            status: 'Delivered',
            timestamp: 'Pending Delivery',
            completed: false,
            description: 'Doorstep signature confirmation',
          },
        ],
      };

      // 6. Update Customer Store
      customerStore.addOrder(orderRecord);
      customerStore.clearCart();
      customerStore.removePromoCode();

      // 7. Update Admin Store
      adminStore.addOrder(orderRecord);

      // Increment discount usage if applicable
      if (appliedDiscountCode) {
        const updatedDiscounts = adminStore.discounts.map((d) =>
          d.code.toUpperCase() === appliedDiscountCode.toUpperCase()
            ? { ...d, usageCount: d.usageCount + 1 }
            : d
        );
        useAdminStore.setState({ discounts: updatedDiscounts });
      }

      // 8. Operational Notification to Admin
      adminStore.addNotification({
        title: 'New Customer Order',
        message: `Order ${orderRef} placed by ${input.deliveryAddress.fullName} (₦${total.toLocaleString()}).`,
        type: 'order',
        link: `/admin/orders/${orderRef}`,
      });

      return { success: true, order: orderRecord };
    } finally {
      isSubmitting = false;
    }
  },

  /**
   * Coordinated Order Cancellation
   * Releases allocated variant inventory exactly once and transitions status.
   */
  cancelOrder: (orderRef: string, reason: string): { success: boolean; message: string } => {
    const adminStore = useAdminStore.getState();
    const customerStore = useStore.getState();

    const order = adminStore.orders.find((o) => o.orderReference === orderRef);
    if (!order) {
      return { success: false, message: `Order ${orderRef} not found.` };
    }

    if (order.deliveryStatus === 'Cancelled') {
      return { success: false, message: `Order ${orderRef} has already been cancelled.` };
    }

    // Call admin store cancel order which replenishes stock safely
    adminStore.cancelOrder(orderRef, reason);

    // Sync status in customer store
    const updatedCustomerOrders = customerStore.orders.map((o) => {
      if (o.orderReference !== orderRef) return o;
      return {
        ...o,
        deliveryStatus: 'Cancelled' as OrderStatus,
        timeline: [
          ...o.timeline,
          {
            status: 'Cancelled' as OrderStatus,
            timestamp: 'Just now',
            completed: true,
            description: reason || 'Order cancelled by customer or support',
          },
        ],
      };
    });
    useStore.setState({ orders: updatedCustomerOrders });

    return {
      success: true,
      message: `Order ${orderRef} successfully cancelled and stock replenished.`,
    };
  },
};
