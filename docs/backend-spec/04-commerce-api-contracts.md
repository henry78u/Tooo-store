# TOOO STORE — Commerce API Contracts & Data Transfer Objects

## 1. Global Request & Response Contracts

### 1.1 Standard JSON Response Envelopes

Every API endpoint under `/api/v1` returns a predictable top-level JSON structure.

#### Success Envelope (Single Entity)
```typescript
export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: string; // ISO 8601
    requestId?: string;
  };
}
```

#### Success Envelope (Paginated Collection)
```typescript
export interface PaginatedApiResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}
```

#### Error Envelope
```typescript
export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: {
      field?: string;
      issue: string;
    }[];
  };
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INSUFFICIENT_STOCK'
  | 'PROMO_CODE_INVALID'
  | 'PROMO_CODE_EXPIRED'
  | 'PROMO_CODE_LIMIT_REACHED'
  | 'ORDER_ALREADY_CANCELLED'
  | 'PAYMENT_FAILED'
  | 'DUPLICATE_SLUG'
  | 'DUPLICATE_SKU'
  | 'IDEMPOTENCY_CONFLICT'
  | 'INTERNAL_SERVER_ERROR';
```

---

## 2. Product Catalog Contracts

### 2.1 Product & Variant DTOs
```typescript
export interface ProductColourDTO {
  name: string;
  hex: string;
}

export interface ProductVariantDTO {
  variantId: string;
  size: string;
  colour: string;
  stock: number;
  sku: string;
}

export interface ProductSummaryDTO {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  price: number; // in NGN
  compareAtPrice?: number;
  category: string;
  collection: string;
  images: string[];
  availableColours: ProductColourDTO[];
  availableSizes: string[];
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
}

export interface ProductDetailDTO extends ProductSummaryDTO {
  description: string;
  variants: ProductVariantDTO[];
  fabricCare: string[];
  details: string[];
  createdAt: string;
}
```

### 2.2 Create/Update Product Request Payload
```typescript
export interface CreateProductRequest {
  name: string;
  slug?: string; // Optional: auto-generated if omitted
  description: string;
  shortDescription?: string;
  price: number; // Positive integer/decimal in NGN
  compareAtPrice?: number;
  category: 'Outerwear' | 'Sets' | 'Tops' | 'Bottoms' | 'Accessories';
  collection: string;
  images: string[]; // At least 1 image URL
  availableColours: { name: string; hex: string }[];
  availableSizes: string[];
  variants: {
    variantId?: string;
    size: string;
    colour: string;
    stock: number;
    sku?: string;
  }[];
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  fabricCare: string[];
  details: string[];
}
```

**Zod Validation Schema**:
```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(10),
  shortDescription: z.string().max(250).optional(),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional(),
  category: z.enum(['Outerwear', 'Sets', 'Tops', 'Bottoms', 'Accessories']),
  collection: z.string().min(2),
  images: z.array(z.string().url()).min(1),
  availableColours: z.array(z.object({ name: z.string().min(1), hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/) })).min(1),
  availableSizes: z.array(z.string().min(1)).min(1),
  variants: z.array(z.object({
    variantId: z.string().optional(),
    size: z.string().min(1),
    colour: z.string().min(1),
    stock: z.number().int().nonnegative(),
    sku: z.string().optional(),
  })).min(1),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  isBestSeller: z.boolean().default(false),
  fabricCare: z.array(z.string()).default([]),
  details: z.array(z.string()).default([]),
});
```

---

## 3. Cart & Discount Contracts

### 3.1 Cart DTO
```typescript
export interface CartItemDTO {
  id: string; // Cart line item ID
  productId: string;
  productName: string;
  slug: string;
  variantId: string;
  selectedSize: string;
  selectedColour: string;
  quantity: number;
  unitPrice: number; // Authoritative DB price
  lineTotal: number;
  image: string;
  availableStock: number;
}

export interface CartDTO {
  id: string;
  items: CartItemDTO[];
  subtotal: number;
  appliedPromoCode: string | null;
  discountPercentage: number;
  discountAmount: number;
  estimatedShipping: number;
  estimatedTotal: number;
}
```

### 3.2 Add to Cart Request
```typescript
export interface AddToCartRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().positive().max(10),
});
```

### 3.3 Apply Promo Code Request
```typescript
export interface ApplyPromoCodeRequest {
  code: string;
}

export interface ApplyPromoCodeResponse {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  newSubtotal: number;
  message: string;
}
```

---

## 4. Checkout & Order Contracts

### 4.1 Order Placement Request (`POST /api/v1/checkout/orders`)
```typescript
export interface PlaceOrderRequest {
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  deliveryAddress: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    notes?: string;
  };
  items: {
    productId: string;
    variantId: string;
    quantity: number;
  }[];
  promoCode?: string;
  paymentMethod: 'CARD_PAYSTACK' | 'BANK_TRANSFER_NIP' | 'CARD_FLUTTERWAVE';
}

export const placeOrderSchema = z.object({
  customerInfo: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^\+?[0-9\s-]{10,16}$/),
  }),
  deliveryAddress: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^\+?[0-9\s-]{10,16}$/),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    notes: z.string().max(300).optional(),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    variantId: z.string().min(1),
    quantity: z.number().int().positive().max(10),
  })).min(1),
  promoCode: z.string().trim().toUpperCase().optional(),
  paymentMethod: z.enum(['CARD_PAYSTACK', 'BANK_TRANSFER_NIP', 'CARD_FLUTTERWAVE']),
});
```

### 4.2 Order Placement Response
```typescript
export interface PlaceOrderResponse {
  orderReference: string; // e.g. "TOOO-84920"
  orderId: string;        // UUID
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  paymentStatus: 'PENDING_PAYMENT' | 'PAID';
  deliveryStatus: 'CONFIRMED' | 'PROCESSING';
  paymentDetails: {
    method: string;
    authorizationUrl?: string; // For Paystack redirect
    reference: string;
    transferAccount?: {        // For Bank Transfer (NIP)
      bankName: string;
      accountNumber: string;
      accountName: string;
      expiresAt: string;
    };
  };
}
```

### 4.3 Order Cancellation Request (`POST /api/v1/admin/orders/:id/cancel`)
```typescript
export interface CancelOrderRequest {
  reason: string;
}

export const cancelOrderSchema = z.object({
  reason: z.string().min(3).max(500),
});

export interface CancelOrderResponse {
  orderReference: string;
  status: 'CANCELLED';
  replenishedItems: {
    productId: string;
    variantId: string;
    quantityReplenished: number;
    newStockOnHand: number;
  }[];
  cancelledAt: string;
}
```

---

## 5. Webhook Ingestion Contracts

### 5.1 Paystack Webhook Event (`POST /api/v1/payments/webhooks/paystack`)
```typescript
export interface PaystackWebhookPayload {
  event: 'charge.success' | 'transfer.success' | 'transfer.failed';
  data: {
    id: number;
    reference: string;        // Matches orderReference or transaction reference
    amount: number;           // In kobo (e.g. 15170000 = ₦151,700)
    currency: 'NGN';
    status: 'success';
    channel: 'card' | 'bank_transfer' | 'ussd';
    paid_at: string;
    customer: {
      email: string;
      customer_code: string;
    };
    metadata: {
      orderReference: string;
      customerId?: string;
    };
  };
}
```

---

## 6. Inventory Adjustment Contract (`POST /api/v1/admin/inventory/adjust`)

```typescript
export interface AdjustInventoryRequest {
  productId: string;
  variantId: string;
  quantityDelta: number; // Positive (Restock) or Negative (Deduction/Damage)
  reason: 'Restock' | 'Sale' | 'Manual Adjustment' | 'Return' | 'Damage / Loss' | 'Cancellation';
  notes?: string;
}

export const adjustInventorySchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantityDelta: z.number().int().refine((val) => val !== 0, 'Delta cannot be zero'),
  reason: z.enum(['Restock', 'Sale', 'Manual Adjustment', 'Return', 'Damage / Loss', 'Cancellation']),
  notes: z.string().max(250).optional(),
});

export interface AdjustInventoryResponse {
  movementId: string;
  productId: string;
  variantId: string;
  previousStock: number;
  appliedDelta: number;
  newStock: number;
  reason: string;
  timestamp: string;
}
```
