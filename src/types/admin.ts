import { Product, ProductCategory, OrderRecord, OrderStatus, ProductVariant } from './index';

export type AdminRole = 'Owner' | 'Administrator' | 'Store Manager' | 'Fulfilment Staff' | 'Support Staff' | 'Analyst';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  lastActive: string;
  status: 'Active' | 'Invited' | 'Suspended';
}

export interface PermissionMatrix {
  viewProducts: boolean;
  editProducts: boolean;
  manageInventory: boolean;
  processOrders: boolean;
  approveRefunds: boolean;
  viewFinance: boolean;
  manageStaff: boolean;
  editSettings: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  details: string;
}

export interface OperationalNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'payment' | 'return' | 'system';
  read: boolean;
  link?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  size: string;
  colour: string;
  quantityChange: number; // + or -
  reason: 'Restock' | 'Sale' | 'Manual Adjustment' | 'Return' | 'Damage / Loss' | 'Cancellation';
  timestamp: string;
  actor: string;
}

export interface AdminCategory {
  id: string;
  name: ProductCategory;
  title: string;
  description: string;
  itemCount: number;
  image: string;
  slug: string;
  isPublished: boolean;
}

export interface AdminCollection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  slug: string;
  piecesCount: number;
  isFeatured: boolean;
  status: 'Active' | 'Scheduled' | 'Archived';
  productIds: string[];
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: string;
  dimensions: string;
  format: string;
  uploadedAt: string;
  usedIn: string[];
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  city: string;
  state: string;
  status: 'Active' | 'VIP' | 'New' | 'Inactive';
  tags: string[];
  notes?: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Hidden';
  verifiedPurchase: boolean;
}

export interface AbandonedCheckout {
  id: string;
  customerEmail: string;
  customerName?: string;
  itemsCount: number;
  totalValue: number;
  date: string;
  recoveryStatus: 'Unrecovered' | 'Email Sent' | 'Recovered';
  itemsSummary: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // 10 for 10%, or 5000 for ₦5,000
  minOrderValue: number;
  usageCount: number;
  usageLimit?: number;
  startDate: string;
  expiryDate?: string;
  isActive: boolean;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'Active' | 'Draft' | 'Ended';
  startDate: string;
  endDate: string;
  linkedCollection: string;
  impressions: number;
  clicks: number;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: 'Footer' | 'Popup Modal' | 'Checkout Opt-in' | 'Campaign Drop';
  status: 'Subscribed' | 'Unsubscribed';
}

export interface PromoBanner {
  id: string;
  text: string;
  linkText: string;
  linkUrl: string;
  isActive: boolean;
  priority: number;
}

export interface TransactionRecord {
  id: string;
  reference: string;
  orderReference: string;
  customerName: string;
  amount: number;
  paymentMethod: 'Card (Paystack Demo)' | 'Bank Transfer (NIP)' | 'Manual Atelier';
  status: 'Successful' | 'Pending' | 'Failed';
  date: string;
}

export interface RefundRecord {
  id: string;
  refundReference: string;
  orderReference: string;
  customerName: string;
  amount: number;
  reason: 'Sizing Exchange' | 'Order Cancellation' | 'Defective Stitching' | 'Customer Request';
  status: 'Approved' | 'Processing' | 'Completed' | 'Rejected';
  requestedAt: string;
}

export interface ReturnRequest {
  id: string;
  orderReference: string;
  customerName: string;
  productName: string;
  variant: string;
  reason: string;
  condition: 'Unworn with tags' | 'Opened / Tried on' | 'Damaged';
  status: 'Pending Review' | 'Approved' | 'Received & Restocked' | 'Rejected';
  date: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  baseFee: number;
  freeShippingThreshold: number;
  estimatedDelivery: string;
  courierPartner: string;
}

export interface SupportMessage {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  lastMessage: string;
  timestamp: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedTo?: string;
  thread: {
    sender: 'customer' | 'staff';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface HomepageSectionConfig {
  id: string;
  name: string;
  title: string;
  enabled: boolean;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  supportPhone: string;
  atelierAddress: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  vatRate: number;
  instagramUrl: string;
  tiktokUrl: string;
  freeShippingMinNaira: number;
}
