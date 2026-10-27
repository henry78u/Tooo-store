export type ProductCategory = 'Outerwear' | 'Sets' | 'Tops' | 'Bottoms' | 'Accessories';

export interface ProductVariant {
  variantId: string;
  size: string;
  colour: string;
  stock: number;
  sku?: string;
}

export interface ProductColour {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number; // in Naira (NGN)
  compareAtPrice?: number;
  category: ProductCategory;
  collection: string;
  images: string[];
  availableColours: ProductColour[];
  availableSizes: string[];
  variants: ProductVariant[];
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  fabricCare: string[];
  details: string[];
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id = `${productId}-${selectedSize}-${selectedColour}`
  product: Product;
  selectedSize: string;
  selectedColour: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  notes?: string;
}

export interface OrderItemSummary {
  productId: string;
  productName: string;
  size: string;
  colour: string;
  quantity: number;
  price: number;
  image: string;
}

export type OrderStatus = 'Order Placed' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';

export interface OrderRecord {
  orderReference: string;
  date: string;
  items: OrderItemSummary[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  address: OrderAddress;
  paymentMethod: 'Card (Demo)' | 'Bank Transfer (Demo)';
  paymentStatus: 'Simulated Paid' | 'Pending Verification';
  deliveryStatus: OrderStatus;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    completed: boolean;
    description: string;
  }[];
}

export interface FilterState {
  category: string;
  size: string;
  colour: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc';
}
