# TOOO STORE — Frontend-to-API Integration Map

## 1. Migration Strategy Overview

The transition from client-side Zustand persistence (`tooo-store-storage`, `tooo-admin-storage`) to the authoritative Node.js/PostgreSQL backend is designed to be **non-disruptive**:
- Existing UI components, Tailwind design tokens, layouts, and animations remain 100% intact.
- The two service layers (`src/services/commerceService.ts` and `src/services/orderService.ts`) and custom React hooks (`useCommerceProducts`, `useCommerceProduct`) serve as the primary integration boundaries.
- Network requests will utilize an Axios/Fetch HTTP client configured with automatic base URL injection (`/api/v1`), credential passing (`credentials: 'include'`), and Bearer token management.

---

## 2. Customer Storefront Component Integration Mappings

### 2.1 Catalog Browsing (`src/pages/ShopPage.tsx`)
- **Existing Symbol**: `const products = useCommerceProducts();` (`ShopPage.tsx:44`).
- **Current Behavior**: Synchronously reads all products from Zustand / `DEMO_PRODUCTS`, filtering locally in memory.
- **Proposed API Call**: `GET /api/v1/products?category=...&size=...&colour=...&minPrice=...&maxPrice=...&sort=...&page=...`
- **Request Type**: Query parameters as defined in `03-commerce-api-endpoint-catalog.md`.
- **Response Type**: `PaginatedApiResponse<ProductSummaryDTO>`.
- **Loading / Error States**: Add skeleton shimmer cards to `ShopPage.tsx` during fetch; display graceful retry banner on network error.
- **Cache Invalidation**: TanStack Query / SWR cache with 5-minute stale-time.
- **Regression Risks**: Preserving multi-filter URL synchronization (`?cat=...&sort=...`).

### 2.2 Product Details & Variant Availability (`src/pages/ProductDetailsPage.tsx`)
- **Existing Symbol**: `useCommerceProduct(slug)` (`ProductDetailsPage.tsx:28`).
- **Current Behavior**: Reads single product by slug from memory; inspects `product.variants` for stock counts.
- **Proposed API Call**: `GET /api/v1/products/:slug`
- **Request Type**: Path parameter `:slug`.
- **Response Type**: `ApiResponse<ProductDetailDTO>`.
- **Loading / Error States**: Full-page skeleton placeholder; 404 view if slug does not exist.
- **Frontend Changes**: Update size chip click handlers to check `variant.stockOnHand - variant.stockAllocated > 0`. Disable "Add to Bag" button when available stock is 0.
- **Regression Risks**: Ensure variant selection doesn't reset when switching between product color swatches.

### 2.3 Shopping Bag & Cart Drawer (`src/components/commerce/CartDrawer.tsx`, `CartPage.tsx`)
- **Existing Symbol**: `useStore.cart`, `addToCart`, `updateQuantity`, `removeFromCart` (`src/store/useStore.ts:164-278`).
- **Current Behavior**: Clamps quantities locally; computes subtotal with client multiplication.
- **Proposed API Calls**:
  - `GET /api/v1/cart` (on drawer open)
  - `POST /api/v1/cart/items` (on add to bag)
  - `PATCH /api/v1/cart/items/:id` (on quantity change)
  - `DELETE /api/v1/cart/items/:id` (on remove)
- **Optimistic Updates**: Optimistically update local cart item counts for instant UI responsiveness; roll back and display toast notification if server returns `INSUFFICIENT_STOCK`.
- **Session Identification**: Store persistent guest session UUID in `localStorage` under `tooo_session_id`, sent via `X-Cart-Session` header.

### 2.4 Promo Code Redemption (`src/store/useStore.ts:applyPromoCode`)
- **Existing Symbol**: `applyPromoCode: (code: string) => ...` (`useStore.ts:284`).
- **Current Behavior**: Compares code string against `useAdminStore.discounts`.
- **Proposed API Call**: `POST /api/v1/cart/apply-discount` `{ "code": "TOOO10" }`
- **Response Type**: `ApiResponse<ApplyPromoCodeResponse>`.
- **Frontend Changes**: Replace synchronous Zustand function with asynchronous API call; show inline spinner inside promo input during validation.

### 2.5 Checkout & Order Creation (`src/pages/CheckoutPage.tsx`)
- **Existing Symbol**: `orderService.placeOrder(input)` (`src/services/orderService.ts:71`).
- **Current Behavior**: Client-side simulated order placement; immediately subtracts variant stock in browser storage.
- **Proposed API Call**: `POST /api/v1/checkout/orders` with `Idempotency-Key: <uuid>`.
- **Response Type**: `ApiResponse<PlaceOrderResponse>`.
- **Loading / Processing State**: Full-screen modal overlay: *"Securing your atelier order and reserving inventory..."* with disabled submit button to prevent double clicks.
- **Redirect Behavior**: If Paystack selected, redirect browser to `authorizationUrl`. If Bank Transfer selected, navigate to confirmation page displaying virtual account number and countdown timer.

### 2.6 Order Tracking Timeline (`src/pages/OrderTrackingPage.tsx`)
- **Existing Symbol**: `useStore.getOrder(reference)` (`OrderTrackingPage.tsx:25`).
- **Current Behavior**: Finds order in browser `localStorage`.
- **Proposed API Call**: `GET /api/v1/orders/:reference/track?email=...`
- **Response Type**: `ApiResponse<PublicOrderTrackingDTO>`.
- **Frontend Changes**: Require user to input both order reference (e.g. `TOOO-84920`) and billing email to look up live status.

---

## 3. Administrative Console Integration Mappings

### 3.1 Admin Authentication (`src/pages/admin/AdminLoginPage.tsx`)
- **Existing Symbol**: `loginAsStaff(role)` (`AdminLoginPage.tsx:16`).
- **Current Behavior**: Bypasses credentials; selects a mock staff profile and sets `isAdminLoggedIn = true`.
- **Proposed API Call**: `POST /api/v1/admin/auth/login` `{ "email": "...", "password": "..." }`
- **Response Type**: `ApiResponse<{ user: AdminUserDTO, accessToken: string }>`.
- **Frontend Changes**: Remove quick-role buttons in production mode; attach JWT to Axios interceptor; store token in memory.

### 3.2 Product Catalog Mutations (`src/pages/admin/products/AddProductPage.tsx`)
- **Existing Symbol**: `addProduct(product)`, `updateProduct(id, product)` (`useAdminStore.ts:727-738`).
- **Current Behavior**: Pushes directly into Zustand products array; computes variants in client loop.
- **Proposed API Calls**:
  - Create: `POST /api/v1/admin/products`
  - Update: `PUT /api/v1/admin/products/:id`
  - Duplicate: `POST /api/v1/admin/products/:id/duplicate`
- **Form State**: Submit payload matches `CreateProductRequest` schema. On success, navigate to `/admin/products` and invalidate catalog queries.

### 3.3 Inventory Adjustments (`src/pages/admin/inventory/StockMovementsPage.tsx`)
- **Existing Symbol**: `adjustProductStock(...)` (`useAdminStore.ts:805`).
- **Current Behavior**: Clamps stock locally and appends to local movements array.
- **Proposed API Call**: `POST /api/v1/admin/inventory/adjust`
- **Request Type**: `AdjustInventoryRequest` (`productId`, `variantId`, `quantityDelta`, `reason`).
- **Response Type**: `ApiResponse<AdjustInventoryResponse>`.

### 3.4 Order Cancellation & Fulfillment (`src/pages/admin/orders/OrderDetailsPage.tsx`)
- **Existing Symbol**: `cancelOrder(orderRef, reason)` (`orderService.ts:223`).
- **Current Behavior**: Transitions local order state and increments variant stock in memory.
- **Proposed API Call**: `POST /api/v1/admin/orders/:id/cancel` `{ "reason": "Customer sizing request" }`
- **Backend Coordination**: Backend atomically executes cancellation in PostgreSQL, restores inventory, and logs audit trail.
