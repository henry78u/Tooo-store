import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductCategory, OrderRecord, OrderStatus, ProductVariant } from '../types';
import { DEMO_PRODUCTS, CATEGORIES_DATA, HERO_IMAGE, STORY_IMAGE, OUTERWEAR_CAT_IMAGE, SETS_CAT_IMAGE } from '../data/products';
import {
  AdminUser,
  AuditLogEntry,
  OperationalNotification,
  StockMovement,
  AdminCategory,
  AdminCollection,
  MediaAsset,
  CustomerProfile,
  CustomerReview,
  AbandonedCheckout,
  DiscountCode,
  MarketingCampaign,
  EmailSubscriber,
  PromoBanner,
  TransactionRecord,
  RefundRecord,
  ReturnRequest,
  ShippingZone,
  SupportMessage,
  HomepageSectionConfig,
  StoreSettings,
} from '../types/admin';

interface AdminStoreState {
  // Auth
  isAdminLoggedIn: boolean;
  currentStaff: AdminUser;
  staffList: AdminUser[];
  loginAsStaff: (role: AdminUser['role']) => void;
  logoutAdmin: () => void;
  addStaffMember: (staff: Omit<AdminUser, 'id' | 'lastActive'>) => void;
  updateStaffMember: (id: string, staff: Partial<AdminUser>) => void;
  deleteStaffMember: (id: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  toggleProductStatus: (id: string, key: 'isFeatured' | 'isNew' | 'isBestSeller') => void;
  adjustProductStock: (productId: string, variantId: string, quantityDelta: number, reason: StockMovement['reason']) => void;

  // Categories & Collections
  categories: AdminCategory[];
  addCategory: (cat: Omit<AdminCategory, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;

  collections: AdminCollection[];
  addCollection: (col: Omit<AdminCollection, 'id'>) => void;
  updateCollection: (id: string, col: Partial<AdminCollection>) => void;
  deleteCollection: (id: string) => void;

  // Inventory & Stock Movements
  stockMovements: StockMovement[];
  lowStockThreshold: number;

  // Orders
  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderRef: string, status: OrderStatus, note?: string) => void;
  cancelOrder: (orderRef: string, reason: string) => void;
  refundRequests: RefundRecord[];
  approveRefund: (refundRef: string) => void;
  returnRequests: ReturnRequest[];
  updateReturnStatus: (id: string, status: ReturnRequest['status']) => void;
  abandonedCheckouts: AbandonedCheckout[];
  markAbandonedRecovered: (id: string) => void;

  // Customers
  customers: CustomerProfile[];
  addCustomer: (cust: Omit<CustomerProfile, 'id'>) => void;
  updateCustomer: (id: string, cust: Partial<CustomerProfile>) => void;
  customerReviews: CustomerReview[];
  updateReviewStatus: (id: string, status: CustomerReview['status']) => void;

  // Marketing
  discounts: DiscountCode[];
  addDiscount: (discount: Omit<DiscountCode, 'id' | 'usageCount'>) => void;
  toggleDiscount: (id: string) => void;
  deleteDiscount: (id: string) => void;

  campaigns: MarketingCampaign[];
  addCampaign: (campaign: Omit<MarketingCampaign, 'id' | 'impressions' | 'clicks'>) => void;
  updateCampaign: (id: string, campaign: Partial<MarketingCampaign>) => void;

  subscribers: EmailSubscriber[];
  addSubscriber: (email: string, source: EmailSubscriber['source']) => void;

  promoBanners: PromoBanner[];
  updatePromoBanner: (id: string, banner: Partial<PromoBanner>) => void;

  // Media Library
  mediaAssets: MediaAsset[];
  addMediaAsset: (asset: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
  deleteMediaAsset: (id: string) => void;

  // Storefront CMS
  homepageSections: HomepageSectionConfig[];
  updateHomepageSection: (id: string, section: Partial<HomepageSectionConfig>) => void;
  toggleHomepageSection: (id: string) => void;

  // Finance
  transactions: TransactionRecord[];

  // Shipping
  shippingZones: ShippingZone[];
  updateShippingZone: (id: string, zone: Partial<ShippingZone>) => void;

  // Support
  supportMessages: SupportMessage[];
  replyToMessage: (id: string, replyText: string) => void;
  updateMessageStatus: (id: string, status: SupportMessage['status']) => void;

  // Notifications & Audit Logs
  notifications: OperationalNotification[];
  addNotification: (notif: Omit<OperationalNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, resource: string, details: string) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (settings: Partial<StoreSettings>) => void;
}

// Initial Data
const INITIAL_STAFF: AdminUser[] = [
  {
    id: 'staff-1',
    name: 'Adaeze Okoro',
    email: 'adaeze@tooostore.example',
    role: 'Owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    lastActive: 'Just now',
    status: 'Active',
  },
  {
    id: 'staff-2',
    name: 'Tunde Adeleke',
    email: 'tunde@tooostore.example',
    role: 'Store Manager',
    lastActive: '2 hours ago',
    status: 'Active',
  },
  {
    id: 'staff-3',
    name: 'Ngozi Mensah',
    email: 'ngozi@tooostore.example',
    role: 'Fulfilment Staff',
    lastActive: 'Yesterday',
    status: 'Active',
  },
  {
    id: 'staff-4',
    name: 'Kofi Asare',
    email: 'kofi@tooostore.example',
    role: 'Support Staff',
    lastActive: '3 days ago',
    status: 'Active',
  },
];

const INITIAL_CATEGORIES: AdminCategory[] = CATEGORIES_DATA.map((c, idx) => ({
  id: `cat-${idx + 1}`,
  name: c.name as ProductCategory,
  title: c.title,
  description: c.description,
  itemCount: parseInt(c.itemCount) || 4,
  image: c.image,
  slug: c.slug,
  isPublished: true,
}));

const INITIAL_COLLECTIONS: AdminCollection[] = [
  {
    id: 'col-1',
    title: 'The Monochrome Drop',
    subtitle: 'High-contrast minimalist streetwear and 480 GSM knitwear',
    description: 'Black, graphite, and raw natural textures crafted with sculptural architectural proportions for fluid city navigation.',
    image: HERO_IMAGE,
    slug: 'the-monochrome-drop',
    piecesCount: 6,
    isFeatured: true,
    status: 'Active',
    productIds: ['prod-03', 'prod-08', 'prod-11', 'prod-15'],
  },
  {
    id: 'col-2',
    title: 'Architectural Tailoring',
    subtitle: 'Double-breasted overcoats, deep front pleats, and crisp poplin',
    description: 'Deconstructed suiting and heavy double-faced wool blends that bridge boardroom presence with nonchalant elegance.',
    image: OUTERWEAR_CAT_IMAGE,
    slug: 'architectural-tailoring',
    piecesCount: 5,
    isFeatured: true,
    status: 'Active',
    productIds: ['prod-01', 'prod-04', 'prod-07', 'prod-10', 'prod-16'],
  },
  {
    id: 'col-3',
    title: 'Everyday Essentials',
    subtitle: '300 GSM box tees, French terry coordinate sets, and waxed canvas',
    description: 'Foundational garments with unbreakable collar ribs and tactile organic fibers made to be worn daily.',
    image: SETS_CAT_IMAGE,
    slug: 'everyday-essentials',
    piecesCount: 5,
    isFeatured: true,
    status: 'Active',
    productIds: ['prod-02', 'prod-05', 'prod-06', 'prod-09', 'prod-12', 'prod-14'],
  },
];

const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-1',
    name: 'Chiemeka Davies',
    email: 'c.davies@example.com',
    phone: '+234 803 555 0192',
    totalOrders: 3,
    totalSpent: 420000,
    lastOrderDate: '2026-10-24',
    city: 'Lagos',
    state: 'Lagos',
    status: 'VIP',
    tags: ['Lagos Atelier', 'Tailoring Collector', 'High Value'],
    notes: 'Prefers Size L. Likes dropped shoulder silhouettes.',
  },
  {
    id: 'cust-2',
    name: 'Zainab Bello',
    email: 'zainab.bello@example.com',
    phone: '+234 812 770 4421',
    totalOrders: 2,
    totalSpent: 184000,
    lastOrderDate: '2026-10-22',
    city: 'Abuja',
    state: 'Abuja (FCT)',
    status: 'Active',
    tags: ['Knitwear Enthusiast'],
  },
  {
    id: 'cust-3',
    name: 'Olumide Fashola',
    email: 'olumide.fash@example.com',
    phone: '+234 901 332 9901',
    totalOrders: 1,
    totalSpent: 94000,
    lastOrderDate: '2026-10-25',
    city: 'Port Harcourt',
    state: 'Rivers',
    status: 'New',
    tags: ['Linen Set Buyer'],
  },
  {
    id: 'cust-4',
    name: 'Amara Nwosu',
    email: 'amara.n@example.com',
    phone: '+234 802 888 1234',
    totalOrders: 4,
    totalSpent: 510000,
    lastOrderDate: '2026-10-18',
    city: 'Lagos',
    state: 'Lagos',
    status: 'VIP',
    tags: ['Outerwear Buyer', 'VIP Private List'],
  },
  {
    id: 'cust-5',
    name: 'Damilola Adeleke',
    email: 'damidami@example.com',
    phone: '+234 810 444 3210',
    totalOrders: 1,
    totalSpent: 45000,
    lastOrderDate: '2026-09-12',
    city: 'Ibadan',
    state: 'Oyo',
    status: 'Inactive',
    tags: ['Summer Drop'],
  },
];

const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    productId: 'prod-01',
    productName: 'Architectural Wool Overcoat',
    variantId: 'prod-01-oatmeal-beige-l',
    size: 'L',
    colour: 'Oatmeal Beige',
    quantityChange: -1,
    reason: 'Sale',
    timestamp: '2026-10-24 09:40 AM',
    actor: 'Storefront Checkout (TOOO-84920)',
  },
  {
    id: 'mov-2',
    productId: 'prod-09',
    productName: '300 GSM Heavyweight Box Tee',
    variantId: 'prod-09-vintage-black-l',
    size: 'L',
    colour: 'Vintage Black',
    quantityChange: -2,
    reason: 'Sale',
    timestamp: '2026-10-24 09:40 AM',
    actor: 'Storefront Checkout (TOOO-84920)',
  },
  {
    id: 'mov-3',
    productId: 'prod-03',
    productName: 'Heavyweight Minimalist Hoodie',
    variantId: 'prod-03-graphite-grey-m',
    size: 'M',
    colour: 'Graphite Grey',
    quantityChange: 15,
    reason: 'Restock',
    timestamp: '2026-10-22 03:15 PM',
    actor: 'Adaeze Okoro',
  },
  {
    id: 'mov-4',
    productId: 'prod-04',
    productName: 'Wide-Leg Pleated Trouser',
    variantId: 'prod-04-pitch-black-s',
    size: 'S',
    colour: 'Pitch Black',
    quantityChange: 10,
    reason: 'Restock',
    timestamp: '2026-10-20 11:30 AM',
    actor: 'Tunde Adeleke',
  },
];

const INITIAL_DISCOUNTS: DiscountCode[] = [
  {
    id: 'disc-1',
    code: 'TOOO10',
    type: 'percentage',
    value: 10,
    minOrderValue: 40000,
    usageCount: 24,
    usageLimit: 500,
    startDate: '2026-10-01',
    expiryDate: '2026-12-31',
    isActive: true,
  },
  {
    id: 'disc-2',
    code: 'FIRSTLOOK',
    type: 'percentage',
    value: 15,
    minOrderValue: 50000,
    usageCount: 42,
    usageLimit: 200,
    startDate: '2026-09-15',
    expiryDate: '2026-11-30',
    isActive: true,
  },
  {
    id: 'disc-3',
    code: 'ATELIER20',
    type: 'fixed',
    value: 20000,
    minOrderValue: 120000,
    usageCount: 8,
    usageLimit: 50,
    startDate: '2026-10-10',
    expiryDate: '2026-11-15',
    isActive: true,
  },
];

const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp-1',
    title: 'Volume 01: Contemporary Expression',
    description: 'Autumn capsule launch featuring oversized outerwear and bespoke tailoring.',
    image: HERO_IMAGE,
    status: 'Active',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    linkedCollection: 'Architectural Tailoring',
    impressions: 14200,
    clicks: 1840,
  },
  {
    id: 'camp-2',
    title: 'The Heavyweight Foundation',
    description: 'Spotlighting our 480 GSM loopback cotton and 300 GSM box tee essentials.',
    image: STORY_IMAGE,
    status: 'Active',
    startDate: '2026-10-15',
    endDate: '2026-12-15',
    linkedCollection: 'Everyday Essentials',
    impressions: 9800,
    clicks: 1120,
  },
];

const INITIAL_SUBSCRIBERS: EmailSubscriber[] = [
  { id: 'sub-1', email: 'c.davies@example.com', subscribedAt: '2026-10-12', source: 'Footer', status: 'Subscribed' },
  { id: 'sub-2', email: 'zainab.bello@example.com', subscribedAt: '2026-10-14', source: 'Checkout Opt-in', status: 'Subscribed' },
  { id: 'sub-3', email: 'tariq.alabi@example.com', subscribedAt: '2026-10-18', source: 'Popup Modal', status: 'Subscribed' },
  { id: 'sub-4', email: 'fola.k@example.com', subscribedAt: '2026-10-20', source: 'Footer', status: 'Subscribed' },
  { id: 'sub-5', email: 'somto.o@example.com', subscribedAt: '2026-10-23', source: 'Campaign Drop', status: 'Subscribed' },
];

const INITIAL_PROMO_BANNERS: PromoBanner[] = [
  { id: 'ban-1', text: 'Discover the latest arrivals at TOOO STORE.', linkText: 'Explore New In', linkUrl: '/shop?sort=newest', isActive: true, priority: 1 },
  { id: 'ban-2', text: 'Complimentary shipping across Lagos on orders over ₦100,000.', linkText: 'Learn More', linkUrl: '/track-order', isActive: true, priority: 2 },
  { id: 'ban-3', text: 'Editorial Campaign: Wear Your Confidence · Use code TOOO10 for 10% off.', linkText: 'Shop Collection', linkUrl: '/shop', isActive: true, priority: 3 },
];

const INITIAL_MEDIA: MediaAsset[] = [
  { id: 'med-1', name: 'Hero Campaign Fashion', url: HERO_IMAGE, size: '420 KB', dimensions: '1920x1080', format: 'JPG', uploadedAt: '2026-10-26', usedIn: ['Homepage Hero', 'The Monochrome Drop'] },
  { id: 'med-2', name: 'Editorial Story Campaign', url: STORY_IMAGE, size: '380 KB', dimensions: '1440x1080', format: 'JPG', uploadedAt: '2026-10-26', usedIn: ['Brand Story', 'Tops Category'] },
  { id: 'med-3', name: 'Category Outerwear Studio', url: OUTERWEAR_CAT_IMAGE, size: '390 KB', dimensions: '1440x1080', format: 'JPG', uploadedAt: '2026-10-26', usedIn: ['Architectural Wool Overcoat', 'Outerwear Category'] },
  { id: 'med-4', name: 'Category Sets Loungewear', url: SETS_CAT_IMAGE, size: '410 KB', dimensions: '1440x1080', format: 'JPG', uploadedAt: '2026-10-26', usedIn: ['Coordinate Set', 'Sets Category'] },
];

const INITIAL_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  { id: 'sec-announcement', name: 'Announcement Bar', title: 'Top Banner Strip', enabled: true, headline: 'Discover the latest arrivals at TOOO STORE.' },
  { id: 'sec-hero', name: 'Full-Width Hero', title: 'Campaign Hero Banner', enabled: true, headline: 'STYLE WITHOUT LIMITS.', subheadline: 'Discover pieces that define your everyday expression.', ctaText: 'Shop the Collection', ctaLink: '/shop', image: HERO_IMAGE },
  { id: 'sec-categories', name: 'Curated Categories', title: 'Category Cards Grid', enabled: true, headline: 'Shop by Category', subheadline: 'Curated Taxonomy' },
  { id: 'sec-new-arrivals', name: 'New Arrivals Grid', title: 'Latest Product Drops', enabled: true, headline: 'New Arrivals', subheadline: 'Fresh Release' },
  { id: 'sec-campaign', name: 'Editorial Campaign', title: 'Mid-Page Story Banner', enabled: true, headline: 'WEAR YOUR CONFIDENCE.', subheadline: 'Everyday essentials. Elevated expression.', ctaText: 'Discover the Collection', ctaLink: '/collections', image: STORY_IMAGE },
  { id: 'sec-bestsellers', name: 'Bestselling Silhouettes', title: 'Client Favorites Showcase', enabled: true, headline: 'Bestselling Silhouettes', subheadline: 'Client Favorites' },
  { id: 'sec-story', name: 'Brand Story Split', title: 'Atelier Origin Story', enabled: true, headline: 'More Than What You Wear.', subheadline: 'The TOOO Story', ctaText: 'Discover Our Story', ctaLink: '/about', image: STORY_IMAGE },
  { id: 'sec-gallery', name: 'The TOOO Edit', title: 'Editorial Lookbook Gallery', enabled: true, headline: 'THE TOOO EDIT', subheadline: 'Visual Journal' },
  { id: 'sec-newsletter', name: 'Newsletter Section', title: 'Email Capture Strip', enabled: true, headline: 'BE FIRST FOR THE NEXT DROP.', subheadline: 'Stay in the Loop' },
];

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  { id: 'tx-1', reference: 'PAY-884920-A', orderReference: 'TOOO-84920', customerName: 'Chiemeka Davies', amount: 151700, paymentMethod: 'Card (Paystack Demo)', status: 'Successful', date: '2026-10-24 09:32 AM' },
  { id: 'tx-2', reference: 'PAY-773192-B', orderReference: 'TOOO-77319', customerName: 'Zainab Bello', amount: 98000, paymentMethod: 'Bank Transfer (NIP)', status: 'Successful', date: '2026-10-22 02:15 PM' },
  { id: 'tx-3', reference: 'PAY-665120-C', orderReference: 'TOOO-66512', customerName: 'Olumide Fashola', amount: 94000, paymentMethod: 'Card (Paystack Demo)', status: 'Successful', date: '2026-10-25 10:45 AM' },
  { id: 'tx-4', reference: 'PAY-551980-D', orderReference: 'TOOO-55198', customerName: 'Amara Nwosu', amount: 235000, paymentMethod: 'Card (Paystack Demo)', status: 'Successful', date: '2026-10-18 04:20 PM' },
];

const INITIAL_SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'zone-lagos',
    name: 'Lagos Metropolitan (Atelier Local)',
    regions: ['Lagos Island', 'Lekki Phase 1', 'Ikoyi', 'Victoria Island', 'Ikeja GRA', 'Surulere', 'Yaba'],
    baseFee: 3500,
    freeShippingThreshold: 100000,
    estimatedDelivery: '24–48 Hours',
    courierPartner: 'TOOO Dedicated Atelier Courier',
  },
  {
    id: 'zone-southwest',
    name: 'South-West Interstate',
    regions: ['Oyo', 'Ogun', 'Osun', 'Ondo', 'Ekiti'],
    baseFee: 5000,
    freeShippingThreshold: 120000,
    estimatedDelivery: '2–3 Business Days',
    courierPartner: 'GIG Logistics / Red Star Express',
  },
  {
    id: 'zone-abuja',
    name: 'Abuja & North Central Express',
    regions: ['Abuja (FCT)', 'Kwara', 'Plateau', 'Niger'],
    baseFee: 6500,
    freeShippingThreshold: 150000,
    estimatedDelivery: '2–4 Business Days',
    courierPartner: 'DHL Express Nigeria',
  },
  {
    id: 'zone-east-south',
    name: 'South-South & South-East Priority',
    regions: ['Rivers', 'Delta', 'Edo', 'Enugu', 'Anambra', 'Akwa Ibom', 'Imo', 'Abia', 'Bayelsa'],
    baseFee: 6500,
    freeShippingThreshold: 150000,
    estimatedDelivery: '2–4 Business Days',
    courierPartner: 'FedEx Nigeria / GIG Priority',
  },
];

const INITIAL_SUPPORT_MESSAGES: SupportMessage[] = [
  {
    id: 'msg-1',
    customerName: 'Chiemeka Davies',
    customerEmail: 'c.davies@example.com',
    subject: 'Overcoat Sleeve Sizing Inquiry',
    lastMessage: 'Good afternoon, is the dropped shoulder cut on the Architectural Wool Overcoat true to size or oversized?',
    timestamp: 'Today, 10:14 AM',
    status: 'Open',
    assignedTo: 'Tunde Adeleke',
    thread: [
      {
        sender: 'customer',
        senderName: 'Chiemeka Davies',
        text: 'Good afternoon, is the dropped shoulder cut on the Architectural Wool Overcoat true to size or oversized?',
        timestamp: '10:14 AM',
      },
      {
        sender: 'staff',
        senderName: 'Tunde Adeleke',
        text: 'Hello Chiemeka, it is cut with a relaxed contemporary ease. If you prefer a tailored profile, we recommend true-to-size or sizing down one step.',
        timestamp: '10:35 AM',
      },
    ],
  },
  {
    id: 'msg-2',
    customerName: 'Zainab Bello',
    customerEmail: 'zainab.bello@example.com',
    subject: 'Delivery Dispatch to Maitama, Abuja',
    lastMessage: 'Will my shipment arrive by Friday afternoon for a weekend event?',
    timestamp: 'Yesterday, 04:30 PM',
    status: 'In Progress',
    assignedTo: 'Ngozi Mensah',
    thread: [
      {
        sender: 'customer',
        senderName: 'Zainab Bello',
        text: 'Will my shipment arrive by Friday afternoon for a weekend event?',
        timestamp: 'Yesterday, 04:30 PM',
      },
    ],
  },
];

const INITIAL_NOTIFICATIONS: OperationalNotification[] = [
  {
    id: 'notif-1',
    timestamp: '10 min ago',
    title: 'New Order Received',
    message: 'Order TOOO-84920 placed by Chiemeka Davies (₦151,700).',
    type: 'order',
    read: false,
    link: '/admin/orders/TOOO-84920',
  },
  {
    id: 'notif-2',
    timestamp: '1 hour ago',
    title: 'Low Stock Alert',
    message: 'Technical Mac Trench Coat in Midnight Ink (Size S) has 2 units remaining.',
    type: 'inventory',
    read: false,
    link: '/admin/inventory/low-stock',
  },
  {
    id: 'notif-3',
    timestamp: '3 hours ago',
    title: 'Return Request Filed',
    message: 'Return request for Monochome Coordinate Set filed for sizing exchange.',
    type: 'return',
    read: true,
    link: '/admin/orders/returns',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-10-27 09:30 AM',
    actor: 'Adaeze Okoro',
    actorRole: 'Owner',
    action: 'RESTOCK_VARIANT',
    resource: '300 GSM Heavyweight Box Tee',
    details: 'Adjusted stock +15 for variant prod-09-vintage-black-l',
  },
  {
    id: 'aud-2',
    timestamp: '2026-10-27 08:15 AM',
    actor: 'Tunde Adeleke',
    actorRole: 'Store Manager',
    action: 'UPDATE_STATUS',
    resource: 'Order TOOO-84920',
    details: 'Transitioned fulfillment state to Processing',
  },
  {
    id: 'aud-3',
    timestamp: '2026-10-26 05:40 PM',
    actor: 'Adaeze Okoro',
    actorRole: 'Owner',
    action: 'UPDATE_HOMEPAGE',
    resource: 'Announcement Bar',
    details: 'Updated promotion banner with TOOO10 discount copy',
  },
];

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Chiemeka D.',
    customerEmail: 'c.davies@example.com',
    productId: 'prod-01',
    productName: 'Architectural Wool Overcoat',
    rating: 5,
    title: 'Impeccable structural drape and warmth',
    comment: 'The double-faced wool has exceptional weight and the dropped shoulder is perfectly engineered. Better quality than European luxury brands at twice the price.',
    date: '2026-10-25',
    status: 'Approved',
    verifiedPurchase: true,
  },
  {
    id: 'rev-2',
    customerName: 'Amara N.',
    customerEmail: 'amara.n@example.com',
    productId: 'prod-02',
    productName: 'Monochrome Coordinate Set',
    rating: 5,
    title: 'The perfect Sunday luxury loungewear',
    comment: 'Brushed French terry feels cloud-soft. Cut is modern and generous.',
    date: '2026-10-20',
    status: 'Approved',
    verifiedPurchase: true,
  },
  {
    id: 'rev-3',
    customerName: 'Kelechi O.',
    customerEmail: 'kelechi@example.com',
    productId: 'prod-09',
    productName: '300 GSM Heavyweight Box Tee',
    rating: 4,
    title: 'Collar rib does not stretch out',
    comment: 'Dense cotton that holds its boxy geometry. Heavy fabric, great for cool evenings.',
    date: '2026-10-18',
    status: 'Approved',
    verifiedPurchase: true,
  },
];

const INITIAL_ABANDONED: AbandonedCheckout[] = [
  {
    id: 'ab-1',
    customerEmail: 'femi.lawal@example.com',
    customerName: 'Femi Lawal',
    itemsCount: 2,
    totalValue: 167000,
    date: '2026-10-26 11:20 PM',
    recoveryStatus: 'Unrecovered',
    itemsSummary: 'Architectural Wool Overcoat (Oatmeal Beige · L), 300 GSM Box Tee (Vintage Black · L)',
  },
  {
    id: 'ab-2',
    customerEmail: 'folake.b@example.com',
    customerName: 'Folake Balogun',
    itemsCount: 1,
    totalValue: 68000,
    date: '2026-10-25 04:15 PM',
    recoveryStatus: 'Email Sent',
    itemsSummary: 'Monochrome Coordinate Set (Caramel Camel · M)',
  },
];

const INITIAL_RETURNS: ReturnRequest[] = [
  {
    id: 'ret-1',
    orderReference: 'TOOO-84920',
    customerName: 'Chiemeka Davies',
    productName: '300 GSM Heavyweight Box Tee',
    variant: 'Vintage Black / L',
    reason: 'Exchanging for XL for more oversized drape',
    condition: 'Unworn with tags',
    status: 'Pending Review',
    date: '2026-10-26',
  },
];

const INITIAL_REFUNDS: RefundRecord[] = [
  {
    id: 'ref-1',
    refundReference: 'REF-2026-001',
    orderReference: 'TOOO-77319',
    customerName: 'Zainab Bello',
    amount: 39000,
    reason: 'Sizing Exchange',
    status: 'Processing',
    requestedAt: '2026-10-24',
  },
];

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set, get) => ({
      // Auth
      isAdminLoggedIn: true, // Default true for prototype accessibility, toggleable via AdminLogin
      currentStaff: INITIAL_STAFF[0],
      staffList: INITIAL_STAFF,

      loginAsStaff: (role) => {
        const found = get().staffList.find((s) => s.role === role) || INITIAL_STAFF[0];
        set({ isAdminLoggedIn: true, currentStaff: found });
        get().addAuditLog('STAFF_LOGIN', 'Authentication', `Staff signed in as ${found.name} (${role})`);
      },

      logoutAdmin: () => {
        set({ isAdminLoggedIn: false });
        get().addAuditLog('STAFF_LOGOUT', 'Authentication', 'Staff signed out from admin portal');
      },

      addStaffMember: (staff) => {
        const newStaff: AdminUser = {
          ...staff,
          id: `staff-${Date.now()}`,
          lastActive: 'Just invited',
        };
        set({ staffList: [...get().staffList, newStaff] });
        get().addAuditLog('INVITE_STAFF', 'Staff', `Invited ${staff.name} as ${staff.role}`);
      },

      updateStaffMember: (id, staffData) => {
        set({
          staffList: get().staffList.map((s) => (s.id === id ? { ...s, ...staffData } : s)),
        });
        get().addAuditLog('UPDATE_STAFF', 'Staff', `Updated staff member ${id}`);
      },

      deleteStaffMember: (id) => {
        set({ staffList: get().staffList.filter((s) => s.id !== id) });
        get().addAuditLog('DELETE_STAFF', 'Staff', `Removed staff member ${id}`);
      },

      // Products
      products: DEMO_PRODUCTS,

      addProduct: (newProduct) => {
        set({ products: [newProduct, ...get().products] });
        get().addAuditLog('CREATE_PRODUCT', 'Catalogue', `Added new product: ${newProduct.name}`);
      },

      updateProduct: (id, patch) => {
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        });
        get().addAuditLog('UPDATE_PRODUCT', 'Catalogue', `Updated product attributes for ${id}`);
      },

      deleteProduct: (id) => {
        const prod = get().products.find((p) => p.id === id);
        set({ products: get().products.filter((p) => p.id !== id) });
        get().addAuditLog('DELETE_PRODUCT', 'Catalogue', `Deleted product: ${prod?.name || id}`);
      },

      duplicateProduct: (id) => {
        const prod = get().products.find((p) => p.id === id);
        if (!prod) return;
        const copyTimestamp = Date.now().toString().slice(-4);
        const copySlug = `${prod.slug}-copy-${copyTimestamp}`;
        const copy: Product = {
          ...prod,
          id: `prod-${copyTimestamp}`,
          slug: copySlug,
          name: `${prod.name} (Copy)`,
          variants: (prod.variants || []).map((v) => ({
            ...v,
            variantId: `${copySlug}-${v.size.toLowerCase()}-${v.colour.toLowerCase().replace(/\s+/g, '-')}`,
            sku: v.sku ? `${v.sku}-CPY` : undefined,
          })),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set({ products: [copy, ...get().products] });
        get().addAuditLog('DUPLICATE_PRODUCT', 'Catalogue', `Duplicated ${prod.name} to ${copy.name}`);
      },

      toggleProductStatus: (id, key) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, [key]: !p[key] } : p
          ),
        });
        get().addAuditLog('TOGGLE_STATUS', 'Catalogue', `Toggled ${key} on product ${id}`);
      },

      adjustProductStock: (productId, variantId, quantityDelta, reason) => {
        const products = get().products;
        const targetProd = products.find((p) => p.id === productId);
        if (!targetProd) return;

        let variantInfo = { size: 'Standard', colour: 'Standard', name: targetProd.name };
        let actualDeltaApplied = quantityDelta;

        const updatedProducts = products.map((p) => {
          if (p.id !== productId) return p;
          const updatedVariants = p.variants.map((v) => {
            if (v.variantId === variantId) {
              variantInfo = { size: v.size, colour: v.colour, name: p.name };
              const originalStock = v.stock;
              const newStock = Math.max(0, originalStock + quantityDelta);
              actualDeltaApplied = newStock - originalStock;
              return { ...v, stock: newStock };
            }
            return v;
          });
          const totalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
          return { ...p, variants: updatedVariants, stock: totalStock };
        });

        const newMovement: StockMovement = {
          id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          productId,
          productName: targetProd.name,
          variantId,
          size: variantInfo.size,
          colour: variantInfo.colour,
          quantityChange: actualDeltaApplied,
          reason,
          timestamp: new Date().toLocaleString(),
          actor: get().currentStaff.name,
        };

        set({
          products: updatedProducts,
          stockMovements: [newMovement, ...get().stockMovements],
        });

        get().addAuditLog(
          'STOCK_ADJUSTMENT',
          'Inventory',
          `${actualDeltaApplied >= 0 ? '+' : ''}${actualDeltaApplied} units for ${targetProd.name} (${variantInfo.size} / ${variantInfo.colour}) - ${reason}`
        );
      },

      // Categories
      categories: INITIAL_CATEGORIES,
      addCategory: (cat) => {
        const newCat: AdminCategory = { ...cat, id: `cat-${Date.now()}` };
        set({ categories: [...get().categories, newCat] });
        get().addAuditLog('CREATE_CATEGORY', 'Taxonomy', `Created category: ${cat.title}`);
      },
      updateCategory: (id, patch) => {
        set({ categories: get().categories.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
        get().addAuditLog('UPDATE_CATEGORY', 'Taxonomy', `Updated category ${id}`);
      },
      deleteCategory: (id) => {
        set({ categories: get().categories.filter((c) => c.id !== id) });
        get().addAuditLog('DELETE_CATEGORY', 'Taxonomy', `Deleted category ${id}`);
      },

      // Collections
      collections: INITIAL_COLLECTIONS,
      addCollection: (col) => {
        const newCol: AdminCollection = { ...col, id: `col-${Date.now()}` };
        set({ collections: [...get().collections, newCol] });
        get().addAuditLog('CREATE_COLLECTION', 'Taxonomy', `Created collection: ${col.title}`);
      },
      updateCollection: (id, patch) => {
        set({ collections: get().collections.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
        get().addAuditLog('UPDATE_COLLECTION', 'Taxonomy', `Updated collection ${id}`);
      },
      deleteCollection: (id) => {
        set({ collections: get().collections.filter((c) => c.id !== id) });
        get().addAuditLog('DELETE_COLLECTION', 'Taxonomy', `Deleted collection ${id}`);
      },

      // Inventory
      stockMovements: INITIAL_STOCK_MOVEMENTS,
      lowStockThreshold: 5,

      // Orders
      orders: [
        {
          orderReference: 'TOOO-84920',
          date: '2026-10-24',
          items: [
            {
              productId: 'prod-01',
              productName: 'Architectural Wool Overcoat',
              size: 'L',
              colour: 'Oatmeal Beige',
              quantity: 1,
              price: 115000,
              image: OUTERWEAR_CAT_IMAGE,
            },
            {
              productId: 'prod-09',
              productName: '300 GSM Heavyweight Box Tee',
              size: 'L',
              colour: 'Vintage Black',
              quantity: 2,
              price: 24000,
              image: STORY_IMAGE,
            },
          ],
          subtotal: 163000,
          shippingFee: 5000,
          discount: 16300,
          total: 151700,
          address: {
            fullName: 'Chiemeka Davies',
            email: 'c.davies@example.com',
            phone: '+234 803 555 0192',
            street: '14 Admiralty Way, Lekki Phase 1',
            city: 'Lagos',
            state: 'Lagos',
            notes: 'Please ring bell upon arrival.',
          },
          paymentMethod: 'Card (Demo)',
          paymentStatus: 'Simulated Paid',
          deliveryStatus: 'Processing',
          timeline: [
            { status: 'Order Placed', timestamp: '2026-10-24 09:32 AM', completed: true, description: 'Order created with reference TOOO-84920' },
            { status: 'Confirmed', timestamp: '2026-10-24 09:40 AM', completed: true, description: 'Payment authorized and inventory reserved' },
            { status: 'Processing', timestamp: '2026-10-25 11:15 AM', completed: true, description: 'Garments steamed, wrapped in recycled tissue, and boxed at Lagos Atelier' },
            { status: 'Shipped', timestamp: 'Estimated Oct 27', completed: false, description: 'Handover to dedicated courier dispatch' },
            { status: 'Delivered', timestamp: 'Pending Delivery', completed: false, description: 'Delivery to customer doorstep' },
          ],
        },
        {
          orderReference: 'TOOO-77319',
          date: '2026-10-22',
          items: [
            {
              productId: 'prod-10',
              productName: 'Tailored Linen Coordinate Set',
              size: 'M',
              colour: 'Natural Sand',
              quantity: 1,
              price: 94000,
              image: SETS_CAT_IMAGE,
            },
          ],
          subtotal: 94000,
          shippingFee: 6500,
          discount: 0,
          total: 100500,
          address: {
            fullName: 'Zainab Bello',
            email: 'zainab.bello@example.com',
            phone: '+234 812 770 4421',
            street: 'Plot 104, Aminu Kano Crescent, Wuse II',
            city: 'Abuja',
            state: 'Abuja (FCT)',
          },
          paymentMethod: 'Bank Transfer (Demo)',
          paymentStatus: 'Simulated Paid',
          deliveryStatus: 'Shipped',
          timeline: [
            { status: 'Order Placed', timestamp: '2026-10-22 02:15 PM', completed: true, description: 'Order created' },
            { status: 'Confirmed', timestamp: '2026-10-22 02:25 PM', completed: true, description: 'Transfer confirmed' },
            { status: 'Processing', timestamp: '2026-10-23 10:00 AM', completed: true, description: 'Boxed and labeled' },
            { status: 'Shipped', timestamp: '2026-10-24 01:30 PM', completed: true, description: 'Dispatched via DHL Express Abuja' },
            { status: 'Delivered', timestamp: 'In Transit', completed: false, description: 'Out for delivery' },
          ],
        },
        {
          orderReference: 'TOOO-66512',
          date: '2026-10-25',
          items: [
            {
              productId: 'prod-02',
              productName: 'Monochrome Coordinate Set',
              size: 'XL',
              colour: 'Caramel Camel',
              quantity: 1,
              price: 68000,
              image: SETS_CAT_IMAGE,
            },
            {
              productId: 'prod-12',
              productName: 'Washed Twill Low-Profile Cap',
              size: 'ONE SIZE',
              colour: 'Stone Grey',
              quantity: 1,
              price: 18000,
              image: STORY_IMAGE,
            },
          ],
          subtotal: 86000,
          shippingFee: 6500,
          discount: 8600,
          total: 83900,
          address: {
            fullName: 'Olumide Fashola',
            email: 'olumide.fash@example.com',
            phone: '+234 901 332 9901',
            street: '22 Peter Odili Road',
            city: 'Port Harcourt',
            state: 'Rivers',
          },
          paymentMethod: 'Card (Demo)',
          paymentStatus: 'Simulated Paid',
          deliveryStatus: 'Confirmed',
          timeline: [
            { status: 'Order Placed', timestamp: '2026-10-25 10:45 AM', completed: true, description: 'Order placed' },
            { status: 'Confirmed', timestamp: '2026-10-25 10:50 AM', completed: true, description: 'Payment verified' },
            { status: 'Processing', timestamp: 'Pending', completed: false, description: 'Awaiting packing' },
            { status: 'Shipped', timestamp: 'Pending', completed: false, description: 'Pending dispatch' },
            { status: 'Delivered', timestamp: 'Pending', completed: false, description: 'Pending delivery' },
          ],
        },
      ],

      addOrder: (newOrder) => {
        set({ orders: [newOrder, ...get().orders] });
        get().addAuditLog(
          'ORDER_PLACED',
          'Orders',
          `Order ${newOrder.orderReference} received from ${newOrder.address.fullName} (₦${newOrder.total.toLocaleString()})`
        );
      },

      updateOrderStatus: (orderRef, status, note) => {
        const orders = get().orders.map((o) => {
          if (o.orderReference !== orderRef) return o;
          const updatedTimeline = o.timeline.map((step) => {
            if (step.status === status) {
              return { ...step, completed: true, timestamp: 'Just now', description: note || step.description };
            }
            return step;
          });
          return { ...o, deliveryStatus: status, timeline: updatedTimeline };
        });
        set({ orders });
        get().addAuditLog('ORDER_STATUS', 'Orders', `Transitioned ${orderRef} to ${status}`);
      },

      cancelOrder: (orderRef, reason) => {
        const target = get().orders.find((o) => o.orderReference === orderRef);
        // Idempotency check: if already cancelled, do not replenish again
        if (!target || target.deliveryStatus === 'Cancelled') {
          return;
        }

        // Restore inventory for each item in the order exactly once
        target.items.forEach((item) => {
          const prod = get().products.find((p) => p.id === item.productId);
          const variant = prod?.variants.find(
            (v) =>
              v.size.toLowerCase() === item.size.toLowerCase() &&
              v.colour.toLowerCase().trim() === item.colour.toLowerCase().trim()
          );
          if (prod && variant) {
            get().adjustProductStock(prod.id, variant.variantId, item.quantity, 'Cancellation');
          }
        });

        const updatedOrders = get().orders.map((o) => {
          if (o.orderReference !== orderRef) return o;
          const cancelTimelineStep = {
            status: 'Cancelled' as OrderStatus,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            completed: true,
            description: reason || 'Order cancelled and allocated inventory replenished',
          };
          return {
            ...o,
            deliveryStatus: 'Cancelled' as OrderStatus,
            timeline: [...o.timeline, cancelTimelineStep],
          };
        });

        set({ orders: updatedOrders });

        get().addNotification({
          title: 'Order Cancelled',
          message: `Order ${orderRef} cancelled: ${reason}. Inventory restored to atelier stock.`,
          type: 'order',
          link: `/admin/orders/${orderRef}`,
        });

        get().addAuditLog('CANCEL_ORDER', 'Orders', `Cancelled order ${orderRef} (${reason}) - inventory replenished`);
      },

      refundRequests: INITIAL_REFUNDS,
      approveRefund: (refundRef) => {
        set({
          refundRequests: get().refundRequests.map((r) =>
            r.refundReference === refundRef ? { ...r, status: 'Completed' } : r
          ),
        });
        get().addAuditLog('APPROVE_REFUND', 'Finance', `Approved refund ${refundRef}`);
      },

      returnRequests: INITIAL_RETURNS,
      updateReturnStatus: (id, status) => {
        set({
          returnRequests: get().returnRequests.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        });
        get().addAuditLog('RETURN_STATUS', 'Orders', `Return ${id} status set to ${status}`);
      },

      abandonedCheckouts: INITIAL_ABANDONED,
      markAbandonedRecovered: (id) => {
        set({
          abandonedCheckouts: get().abandonedCheckouts.map((a) =>
            a.id === id ? { ...a, recoveryStatus: 'Recovered' } : a
          ),
        });
        get().addAuditLog('ABANDONED_RECOVERED', 'Marketing', `Marked session ${id} as recovered`);
      },

      // Customers
      customers: INITIAL_CUSTOMERS,
      addCustomer: (cust) => {
        const newCust: CustomerProfile = { ...cust, id: `cust-${Date.now()}` };
        set({ customers: [newCust, ...get().customers] });
        get().addAuditLog('CREATE_CUSTOMER', 'Customers', `Created customer profile: ${cust.name}`);
      },
      updateCustomer: (id, patch) => {
        set({ customers: get().customers.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
        get().addAuditLog('UPDATE_CUSTOMER', 'Customers', `Updated customer profile ${id}`);
      },
      customerReviews: INITIAL_REVIEWS,
      updateReviewStatus: (id, status) => {
        set({
          customerReviews: get().customerReviews.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        });
        get().addAuditLog('REVIEW_MODERATION', 'Customers', `Set review ${id} status to ${status}`);
      },

      // Marketing
      discounts: INITIAL_DISCOUNTS,
      addDiscount: (disc) => {
        const newDisc: DiscountCode = { ...disc, id: `disc-${Date.now()}`, usageCount: 0 };
        set({ discounts: [newDisc, ...get().discounts] });
        get().addAuditLog('CREATE_DISCOUNT', 'Marketing', `Created discount promo ${disc.code}`);
      },
      toggleDiscount: (id) => {
        set({
          discounts: get().discounts.map((d) =>
            d.id === id ? { ...d, isActive: !d.isActive } : d
          ),
        });
        get().addAuditLog('TOGGLE_DISCOUNT', 'Marketing', `Toggled discount ${id}`);
      },
      deleteDiscount: (id) => {
        set({ discounts: get().discounts.filter((d) => d.id !== id) });
        get().addAuditLog('DELETE_DISCOUNT', 'Marketing', `Deleted discount ${id}`);
      },

      campaigns: INITIAL_CAMPAIGNS,
      addCampaign: (camp) => {
        const newCamp: MarketingCampaign = { ...camp, id: `camp-${Date.now()}`, impressions: 0, clicks: 0 };
        set({ campaigns: [newCamp, ...get().campaigns] });
        get().addAuditLog('CREATE_CAMPAIGN', 'Marketing', `Launched campaign: ${camp.title}`);
      },
      updateCampaign: (id, patch) => {
        set({ campaigns: get().campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
        get().addAuditLog('UPDATE_CAMPAIGN', 'Marketing', `Updated campaign ${id}`);
      },

      subscribers: INITIAL_SUBSCRIBERS,
      addSubscriber: (email, source) => {
        const newSub: EmailSubscriber = {
          id: `sub-${Date.now()}`,
          email,
          subscribedAt: new Date().toISOString().split('T')[0],
          source,
          status: 'Subscribed',
        };
        set({ subscribers: [newSub, ...get().subscribers] });
      },

      promoBanners: INITIAL_PROMO_BANNERS,
      updatePromoBanner: (id, patch) => {
        set({ promoBanners: get().promoBanners.map((b) => (b.id === id ? { ...b, ...patch } : b)) });
        get().addAuditLog('UPDATE_BANNER', 'Storefront', `Updated promo banner ${id}`);
      },

      // Media
      mediaAssets: INITIAL_MEDIA,
      addMediaAsset: (asset) => {
        const newAsset: MediaAsset = { ...asset, id: `med-${Date.now()}`, uploadedAt: new Date().toISOString().split('T')[0] };
        set({ mediaAssets: [newAsset, ...get().mediaAssets] });
        get().addAuditLog('UPLOAD_MEDIA', 'Media Library', `Uploaded asset ${asset.name}`);
      },
      deleteMediaAsset: (id) => {
        set({ mediaAssets: get().mediaAssets.filter((m) => m.id !== id) });
        get().addAuditLog('DELETE_MEDIA', 'Media Library', `Removed asset ${id}`);
      },

      // Storefront CMS
      homepageSections: INITIAL_HOMEPAGE_SECTIONS,
      updateHomepageSection: (id, patch) => {
        set({
          homepageSections: get().homepageSections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        });
        get().addAuditLog('UPDATE_HOMEPAGE_SECTION', 'Storefront', `Edited CMS section: ${id}`);
      },
      toggleHomepageSection: (id) => {
        set({
          homepageSections: get().homepageSections.map((s) =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
          ),
        });
        get().addAuditLog('TOGGLE_HOMEPAGE_SECTION', 'Storefront', `Toggled CMS section ${id}`);
      },

      // Finance
      transactions: INITIAL_TRANSACTIONS,

      // Shipping
      shippingZones: INITIAL_SHIPPING_ZONES,
      updateShippingZone: (id, patch) => {
        set({
          shippingZones: get().shippingZones.map((z) => (z.id === id ? { ...z, ...patch } : z)),
        });
        get().addAuditLog('UPDATE_SHIPPING_ZONE', 'Shipping', `Updated shipping zone ${id}`);
      },

      // Support
      supportMessages: INITIAL_SUPPORT_MESSAGES,
      replyToMessage: (id, replyText) => {
        const author = get().currentStaff.name;
        set({
          supportMessages: get().supportMessages.map((m) => {
            if (m.id !== id) return m;
            return {
              ...m,
              status: 'In Progress',
              lastMessage: replyText,
              thread: [
                ...m.thread,
                {
                  sender: 'staff',
                  senderName: author,
                  text: replyText,
                  timestamp: 'Just now',
                },
              ],
            };
          }),
        });
        get().addAuditLog('REPLY_SUPPORT', 'Support', `Replied to inquiry ${id}`);
      },
      updateMessageStatus: (id, status) => {
        set({
          supportMessages: get().supportMessages.map((m) => (m.id === id ? { ...m, status } : m)),
        });
      },

      // Notifications
      notifications: INITIAL_NOTIFICATIONS,
      addNotification: (notif) => {
        const newNotif: OperationalNotification = {
          ...notif,
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: 'Just now',
          read: false,
        };
        set({ notifications: [newNotif, ...get().notifications] });
      },
      markNotificationRead: (id) => {
        set({
          notifications: get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        });
      },
      markAllNotificationsRead: () => {
        set({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
        });
      },

      // Audit logs
      auditLogs: INITIAL_AUDIT_LOGS,
      addAuditLog: (action, resource, details) => {
        const user = get().currentStaff;
        const entry: AuditLogEntry = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          actor: user?.name || 'Administrator',
          actorRole: user?.role || 'Staff',
          action,
          resource,
          details,
        };
        set({ auditLogs: [entry, ...get().auditLogs.slice(0, 99)] });
      },

      // Settings
      settings: {
        storeName: 'TOOO STORE',
        tagline: 'Your Style. Your Statement.',
        contactEmail: 'atelier@tooostore.example',
        supportPhone: '+234 803 555 0192',
        atelierAddress: '14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
        currency: 'NGN',
        currencySymbol: '₦',
        timezone: 'Africa/Lagos',
        vatRate: 7.5,
        instagramUrl: 'https://instagram.com/tooostore',
        tiktokUrl: 'https://tiktok.com/@tooostore',
        freeShippingMinNaira: 100000,
      },
      updateSettings: (patch) => {
        set({ settings: { ...get().settings, ...patch } });
        get().addAuditLog('UPDATE_SETTINGS', 'Settings', 'Updated store global configuration');
      },
    }),
    {
      name: 'tooo-admin-storage',
      partialize: (state) => ({
        isAdminLoggedIn: state.isAdminLoggedIn,
        currentStaff: state.currentStaff,
        staffList: state.staffList,
        products: state.products,
        categories: state.categories,
        collections: state.collections,
        stockMovements: state.stockMovements,
        orders: state.orders,
        customers: state.customers,
        customerReviews: state.customerReviews,
        discounts: state.discounts,
        campaigns: state.campaigns,
        subscribers: state.subscribers,
        promoBanners: state.promoBanners,
        mediaAssets: state.mediaAssets,
        homepageSections: state.homepageSections,
        shippingZones: state.shippingZones,
        supportMessages: state.supportMessages,
        auditLogs: state.auditLogs,
        settings: state.settings,
      }),
    }
  )
);
