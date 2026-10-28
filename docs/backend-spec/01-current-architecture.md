# TOOO STORE — Current Architecture Report (As-Is Codebase Audit)

## 1. System Overview & Technology Stack

The existing TOOO STORE platform is a single-page application (SPA) built with React 19 and Vite 8, featuring Tailwind CSS v4, Lucide React icons, and Motion for animation.

### 1.1 Dependency Audit (`package.json`)
- **Runtime Dependencies**:
  - `react`: `^19.0.1` & `react-dom`: `^19.0.1` — Functional components, React Hooks.
  - `react-router-dom`: `^7.18.4` — Client-side SPA routing (`BrowserRouter`, `Routes`, `Route`, `useLocation`, `useNavigate`).
  - `zustand`: `^5.0.16` — Global client-side state management with `persist` middleware.
  - `lucide-react`: `^0.546.0` — Iconography.
  - `motion`: `^12.23.24` — Declarative UI animations and transitions.
  - `@google/genai`: `^2.4.0` — Google Gemini SDK (present in dependencies, planned for AI service transition).
  - `express`: `^4.21.2` & `dotenv`: `^17.2.3` — Node.js runtime packages installed in preparation for full-stack integration.
- **Build & Development Tools**:
  - `vite`: `^8.3.0` & `@vitejs/plugin-react`: `^6.1.1`.
  - `@tailwindcss/vite`: `^4.3.3` & `tailwindcss`: `^4.3.3`.
  - `typescript`: `^7.0.2` & `tsx`: `^4.21.0`.
  - `vitest`: `^5.0.5` — Unit and integration test runner.

---

## 2. Page & Routing Architecture (`src/App.tsx`)

The application routes are split into two namespaces: the customer-facing storefront and the administrative console under `/admin`.

### 2.1 Customer Storefront Routes
| Route | Component | Source File | Description |
|:---|:---|:---|:---|
| `/` | `HomePage` | `src/pages/HomePage.tsx` | Brand showcase, dynamic CMS hero, categories, new arrivals, story, and lookbook gallery. |
| `/shop` | `ShopPage` | `src/pages/ShopPage.tsx` | Catalog view with category filters, size/colour chips, price slider, and sorting. |
| `/product/:slug` | `ProductDetailsPage` | `src/pages/ProductDetailsPage.tsx` | High-fidelity product view with variant selectors, live stock badges, fabric care, and bag actions. |
| `/collections` | `CollectionsPage` | `src/pages/CollectionsPage.tsx` | Curated seasonal capsule drops and editorial lookbooks. |
| `/collections/:slug`| `CollectionsPage` | `src/pages/CollectionsPage.tsx` | Filtered capsule view. |
| `/cart` | `CartPage` | `src/pages/CartPage.tsx` | Dedicated shopping bag page with quantity modifiers and promo code input. |
| `/checkout` | `CheckoutPage` | `src/pages/CheckoutPage.tsx` | Multi-step checkout (Contact, Delivery Address, Payment method, Order summary). |
| `/account` | `AccountPage` | `src/pages/AccountPage.tsx` | Client portal for login, order history, address book, and profile editing. |
| `/wishlist` | `WishlistPage` | `src/pages/WishlistPage.tsx` | Saved products view with quick-add actions. |
| `/track-order` | `OrderTrackingPage` | `src/pages/OrderTrackingPage.tsx` | Real-time order timeline lookup by order reference. |
| `/about` | `AboutPage` | `src/pages/AboutPage.tsx` | Brand philosophy, atelier craftsmanship, and sustainability commitments. |

### 2.2 Admin Console Routes (`/admin/*`)
Wrapped in `AdminLayout` (`src/components/admin/layout/AdminLayout.tsx`):
- **Authentication**: `/admin/login` (`AdminLoginPage.tsx`)
- **Workspace & Overview**: `/admin` (`AdminOverviewPage.tsx`)
- **Analytics**:
  - `/admin/analytics/sales` (`SalesAnalyticsPage.tsx`)
  - `/admin/analytics/products` (`ProductAnalyticsPage.tsx`)
  - `/admin/analytics/customers` (`CustomerAnalyticsPage.tsx`)
- **Commerce / Products**:
  - `/admin/products` (`AllProductsPage.tsx`)
  - `/admin/products/new` (`AddProductPage.tsx`)
  - `/admin/products/:id/edit` (`AddProductPage.tsx`)
  - `/admin/products/categories` (`CategoriesPage.tsx`)
  - `/admin/products/collections` (`AdminCollectionsPage.tsx`)
  - `/admin/products/attributes` (`AttributesPage.tsx`)
  - `/admin/products/media` (`MediaLibraryPage.tsx`)
- **Inventory Management**:
  - `/admin/inventory` (`InventoryOverviewPage.tsx`)
  - `/admin/inventory/low-stock` (`LowStockPage.tsx`)
  - `/admin/inventory/movements` (`StockMovementsPage.tsx`)
- **Orders & Fulfillment**:
  - `/admin/orders` (`AllOrdersPage.tsx`)
  - `/admin/orders/:id` (`OrderDetailsPage.tsx`)
  - `/admin/orders/returns` (`ReturnsPage.tsx`)
  - `/admin/orders/abandoned` (`AbandonedCheckoutsPage.tsx`)
- **Customers & CRM**:
  - `/admin/customers` (`AllCustomersPage.tsx`)
  - `/admin/customers/segments` (`CustomerSegmentsPage.tsx`)
  - `/admin/customers/reviews` (`CustomerReviewsPage.tsx`)
- **Marketing & Growth**:
  - `/admin/marketing/discounts` (`DiscountsPage.tsx`)
  - `/admin/marketing/campaigns` (`CampaignsPage.tsx`)
  - `/admin/marketing/subscribers` (`SubscribersPage.tsx`)
  - `/admin/marketing/banners` (`BannersPage.tsx`)
- **Storefront CMS**:
  - `/admin/storefront/homepage` (`HomepageEditorPage.tsx`)
  - `/admin/storefront/navigation` (`NavigationFooterPage.tsx`)
  - `/admin/storefront/pages` (`PagesContentPage.tsx`)
  - `/admin/storefront/seo` (`SeoManagementPage.tsx`)
- **Finance**:
  - `/admin/finance/transactions` (`TransactionsPage.tsx`)
  - `/admin/finance/refunds` (`RefundsPage.tsx`)
  - `/admin/finance/reports` (`FinancialReportsPage.tsx`)
- **Operations & Shipping**:
  - `/admin/shipping/deliveries` (`DeliveriesPage.tsx`)
  - `/admin/shipping/zones` (`ShippingZonesPage.tsx`)
- **Support & Operations Alerts**:
  - `/admin/support/messages` (`MessagesPage.tsx`)
  - `/admin/support/notifications` (`NotificationsPage.tsx`)
- **Team & Security**:
  - `/admin/team/staff` (`StaffManagementPage.tsx`)
  - `/admin/team/audit-logs` (`AuditLogsPage.tsx`)
- **Settings**:
  - `/admin/settings/general` (`GeneralSettingsPage.tsx`)
  - `/admin/settings/checkout` (`CheckoutSettingsPage.tsx`)
  - `/admin/settings/integrations` (`IntegrationsPage.tsx`)

---

## 3. State Management & Data Flow Architecture

The application currently relies on two centralized Zustand stores persisted to browser `localStorage`:

```
               ┌────────────────────────────────────────────────────────┐
               │                  Browser LocalStorage                  │
               └───────────┬────────────────────────────────┬───────────┘
                           │                                │
            (tooo-store-storage)                   (tooo-admin-storage)
                           │                                │
                           ▼                                ▼
              ┌─────────────────────────┐      ┌─────────────────────────┐
              │      useStore.ts        │      │    useAdminStore.ts     │
              │  (Customer Client Store)│      │  (Admin Business Store) │
              └────────────┬────────────┘      └────────────┬────────────┘
                           │                                │
                           │◄───────────────┬───────────────┘
                           │                │
                           ▼                ▼
                     ┌─────────────────────────────┐
                     │     commerceService.ts      │
                     │  (Authoritative Read Svc)   │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────┐
                     │      orderService.ts        │
                     │  (Coordinated Mutations)    │
                     └─────────────────────────────┘
```

### 3.1 `useStore.ts` (`tooo-store-storage`)
- **Cart State**: `cart: CartItem[]`, item ID format `${productId}-${selectedSize}-${selectedColour}`, item quantity, clamped dynamically to variant inventory stock.
- **Promo Code State**: `promoCode: string | null`, `discountPercentage: number`, validated against `useAdminStore.discounts`.
- **Wishlist State**: `wishlist: string[]` (array of product IDs).
- **User Profile State**: `user: UserProfile` (name, email, phone, addresses, mock login boolean).
- **Customer Orders**: `orders: OrderRecord[]` (customer view of placed orders).
- **UI Transient State**: `isCartOpen`, `isSearchOpen`, `quickViewProduct`, `toasts`.

### 3.2 `useAdminStore.ts` (`tooo-admin-storage`)
- **Catalog**: `products: Product[]`, `categories: AdminCategory[]`, `collections: AdminCollection[]`.
- **Inventory**: `stockMovements: StockMovement[]`, `lowStockThreshold: number` (default 5).
- **Fulfillment & CRM**: `orders: OrderRecord[]`, `customers: CustomerProfile[]`, `customerReviews: CustomerReview[]`, `abandonedCheckouts: AbandonedCheckout[]`, `returnRequests: ReturnRequest[]`.
- **Marketing**: `discounts: DiscountCode[]`, `campaigns: MarketingCampaign[]`, `subscribers: EmailSubscriber[]`, `promoBanners: PromoBanner[]`.
- **CMS & Media**: `homepageSections: HomepageSectionConfig[]`, `mediaAssets: MediaAsset[]`.
- **Finance**: `transactions: TransactionRecord[]`, `refunds: RefundRecord[]`.
- **Operations & Team**: `shippingZones: ShippingZone[]`, `supportMessages: SupportMessage[]`, `notifications: OperationalNotification[]`, `staffList: AdminUser[]`, `auditLogs: AuditLogEntry[]`, `settings: StoreSettings`.
- **Admin Auth**: `isAdminLoggedIn: boolean`, `currentStaff: AdminUser`.

### 3.3 Authoritative Bridges
1. `src/services/commerceService.ts`:
   - Replaced static seed imports with reactive hooks (`useCommerceProducts`, `useCommerceProduct`) reading from `useAdminStore.products`.
   - Fallback to `DEMO_PRODUCTS` in `src/data/products.ts` if store is uninitialized.
2. `src/services/orderService.ts`:
   - Bridges customer checkout actions with admin inventory and order lists.
   - `validateCartStock(items)` checks current variant stock.
   - `placeOrder(input)` reserves and deducts variant stock with movement reason `'Sale'`, adds order to both stores, increments discount usage, and fires operational admin notifications.
   - `cancelOrder(orderRef, reason)` restores variant stock with reason `'Cancellation'`, idempotently prevents double-replenishment, and updates order timeline.

---

## 4. Product, Variant, and Inventory Data Modeling in Current Code

### 4.1 Product and Variant Structure (`src/types/index.ts`)
```typescript
export interface ProductVariant {
  variantId: string; // e.g. "prod-01-oatmeal-beige-l"
  size: string;      // e.g. "L"
  colour: string;    // e.g. "Oatmeal Beige"
  stock: number;     // e.g. 12
  sku?: string;      // e.g. "TOOO-PROD-01-L-OAT"
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;              // In Nigerian Naira (NGN, e.g. 115000)
  compareAtPrice?: number;
  category: ProductCategory;  // 'Outerwear' | 'Sets' | 'Tops' | 'Bottoms' | 'Accessories'
  collection: string;         // 'Architectural Tailoring', etc.
  images: string[];
  availableColours: ProductColour[];
  availableSizes: string[];
  variants: ProductVariant[]; // Normalized size x colour combinations
  stock: number;              // Denormalized sum of all variant stocks
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  fabricCare: string[];
  details: string[];
  createdAt: string;
}
```

### 4.2 Inventory Accounting Logic
- Stock is strictly held at the `ProductVariant` level.
- When an administrator edits a product (`src/pages/admin/products/AddProductPage.tsx` and `src/store/useAdminStore.ts`), existing variants are matched by normalized key (`${size}__${colour.toLowerCase()}`), preserving stock levels and SKUs.
- Total product stock is dynamically computed as:
  $$\text{product.stock} = \sum_{v \in \text{variants}} v.\text{stock}$$
- Stock adjustments (`adjustProductStock`) clamp negative quantities to $0$ and record exact deltas in `stockMovements` with reasons: `'Restock'`, `'Sale'`, `'Manual Adjustment'`, `'Return'`, `'Damage / Loss'`, or `'Cancellation'`.

---

## 5. Critical Gaps & Production Incompatibilities

The current client-side implementation contains several architectural assumptions that cannot be trusted in a production environment:

| Vulnerability / Defect | Current Frontend Behavior | Required Production Backend Solution |
|:---|:---|:---|
| **Client-Side Pricing Authority** | `CartItem.unitPrice` and order totals are calculated in the browser. A malicious user could submit a modified price. | The backend must recalculate all line-item prices, shipping fees, tax, and discount reductions from PostgreSQL. Never trust client prices. |
| **Race Conditions & Overselling** | `validateCartStock` in `orderService.ts` checks stock in the browser immediately before placing an order. Two concurrent shoppers can both purchase the last unit. | Database-level row locking (`SELECT ... FOR UPDATE` in PostgreSQL) or optimistic concurrency control via Prisma transactions. |
| **Unauthenticated Admin Access** | `isAdminLoggedIn` defaults to `true` or can be toggled by picking any role in `AdminLoginPage.tsx`. | Real JWT authentication with cryptographic verification, password hashing (Argon2id/bcrypt), and role authorization middleware. |
| **Insecure Promo Code Valuation** | Promo codes are evaluated locally against `useAdminStore.discounts`. Usage limits can be bypassed by clearing `localStorage`. | Atomic database transaction checking `usageLimit`, `isActive`, `expiryDate`, and incrementing `usageCount` inside the order transaction. |
| **Payment Status Forgery** | Orders are created with `paymentStatus: 'Simulated Paid'` without actual gateway verification. | Payment initialization endpoint creating a pending payment record, followed by HMAC-verified webhook confirmation (Paystack/Flutterwave). |
| **Asset Storage** | Images are loaded from local file paths (e.g. `/src/assets/images/...`) or Unsplash URLs. | S3 / Google Cloud Storage object storage with signed upload URLs and CDN distribution. |

---

## 6. Inventory of Code Symbols Targeted for Backend Migration

The following specific frontend source files and symbols must be migrated to REST API clients:

1. `src/services/commerceService.ts`:
   - `getProducts()`, `getPublishedProducts()`, `getProductBySlug()`, `getProductById()`, `getCategories()`, `getCollections()`.
2. `src/services/orderService.ts`:
   - `validateCartStock()`, `placeOrder()`, `cancelOrder()`.
3. `src/store/useStore.ts`:
   - `addToCart`, `updateQuantity`, `applyPromoCode`, `loginUser`, `addAddress`, `orders`.
4. `src/store/useAdminStore.ts`:
   - Product mutations: `addProduct`, `updateProduct`, `deleteProduct`, `duplicateProduct`, `adjustProductStock`.
   - Order mutations: `updateOrderStatus`, `cancelOrder`, `addReturnRequest`, `updateReturnStatus`.
   - Marketing & CMS: `addDiscount`, `updateHomepageSection`, `updateSettings`.
   - Auth & Staff: `loginAsStaff`, `addStaffMember`, `updateStaffMember`.
