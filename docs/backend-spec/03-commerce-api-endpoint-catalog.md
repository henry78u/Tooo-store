# TOOO STORE — Commerce API Endpoint Catalog

## 1. Global Conventions & Standards

All Commerce API endpoints conform to the following architectural standards:
- **Base URL Prefix**: `/api/v1`
- **Content-Type**: `application/json; charset=utf-8`
- **Authentication**: Bearer JWT in the `Authorization` header (`Authorization: Bearer <token>`) or signed `HttpOnly` session cookies.
- **Pagination Standard**: Cursor-based or limit-offset: `?page=1&limit=20` (maximum limit: 100).
- **Sorting Standard**: `?sort=<field>:<asc|desc>` (e.g. `?sort=createdAt:desc`, `?sort=price:asc`).
- **Standard Success Response Envelope**:
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { "timestamp": "2026-10-28T12:00:00Z" }
  }
  ```
- **Standard Paginated Response Envelope**:
  ```json
  {
    "success": true,
    "data": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 48,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
  ```
- **Standard Error Response Envelope**:
  ```json
  {
    "success": false,
    "error": {
      "code": "INSUFFICIENT_STOCK",
      "message": "Requested quantity exceeds available stock.",
      "details": [
        { "field": "variants[0].quantity", "issue": "Available stock is 2, requested 4" }
      ]
    }
  }
  ```

---

## 2. Authentication & Customer Identity

### 2.1 `POST /api/v1/auth/register`
- **Purpose**: Register a new customer account.
- **Caller**: Public Storefront Visitor.
- **Auth**: None.
- **Request Body**:
  ```json
  {
    "fullName": "Adebayo Johnson",
    "email": "adebayo@example.com",
    "password": "Password123!",
    "phone": "+2348035550192"
  }
  ```
- **Response**: `201 Created` with customer profile and JWT token.
- **Validation**: Email uniqueness, password complexity ($\ge 8$ chars, 1 number, 1 uppercase), E.164 phone format.
- **Entities**: `Customer`, `CustomerCredential`.
- **Status**: [PROPOSED FOR PRODUCTION] (Replaces mock registration in `AccountPage.tsx:55`).

### 2.2 `POST /api/v1/auth/login`
- **Purpose**: Authenticate customer and issue session/tokens.
- **Caller**: Registered Customer.
- **Auth**: None.
- **Request Body**: `{ "email": "adebayo@example.com", "password": "Password123!" }`
- **Response**: `200 OK` with customer profile and access token.
- **Entities**: `Customer`, `CustomerCredential`.
- **Status**: [CONFIRMED BY UI] (`AccountPage.tsx:24`).

### 2.3 `POST /api/v1/auth/logout`
- **Purpose**: Revoke active refresh token and clear session cookies.
- **Caller**: Authenticated Customer / Staff.
- **Auth**: Required.
- **Response**: `200 OK` `{ "success": true }`.
- **Status**: [CONFIRMED BY UI] (`AccountPage.tsx:8`).

### 2.4 `GET /api/v1/customer/profile`
- **Purpose**: Fetch profile data for the authenticated customer.
- **Caller**: Authenticated Customer (`ROLE_CUSTOMER`).
- **Auth**: Bearer JWT.
- **Response**: `200 OK` with `name`, `email`, `phone`, `addresses`, `ordersCount`.
- **Status**: [CONFIRMED BY UI] (`AccountPage.tsx:10`).

### 2.5 `POST /api/v1/customer/addresses`
- **Purpose**: Add a saved delivery address to the customer's address book.
- **Caller**: Authenticated Customer.
- **Request Body**:
  ```json
  {
    "label": "Residence",
    "street": "14 Admiralty Way, Lekki Phase 1",
    "city": "Lagos",
    "state": "Lagos",
    "isDefault": true
  }
  ```
- **Response**: `201 Created` with address record including database ID.
- **Status**: [CONFIRMED BY UI] (`AccountPage.tsx:30-43`).

---

## 3. Product Catalog & Taxonomy

### 3.1 `GET /api/v1/products`
- **Purpose**: Retrieve customer-facing catalog with filtering, sorting, and pagination.
- **Caller**: Public Storefront.
- **Auth**: None.
- **Query Parameters**:
  - `category`: string (e.g. `Outerwear`, `Sets`, `Tops`)
  - `collection`: string (e.g. `architectural-tailoring`)
  - `size`: string (e.g. `S`, `M`, `L`)
  - `colour`: string (e.g. `Oatmeal Beige`)
  - `minPrice`: integer (NGN)
  - `maxPrice`: integer (NGN)
  - `inStockOnly`: boolean (`true`/`false`)
  - `sort`: `featured` | `newest` | `price:asc` | `price:desc`
  - `page`: integer (default `1`)
  - `limit`: integer (default `20`)
- **Response**: `200 OK` with array of published products and pagination metadata. Only returns products with `status: "PUBLISHED"`.
- **Entities**: `Product`, `ProductVariant`, `Category`, `Collection`.
- **Status**: [CONFIRMED BY UI] (`ShopPage.tsx:44-98`).

### 3.2 `GET /api/v1/products/:slug`
- **Purpose**: Retrieve full details of a single product by URL slug.
- **Caller**: Public Storefront.
- **Auth**: None.
- **Response**: `200 OK` with product details, image gallery, fabric care list, available colors, available sizes, and variant stock records.
- **Error Cases**: `404 Not Found` if product does not exist or is in `ARCHIVED` status.
- **Status**: [CONFIRMED BY UI] (`ProductDetailsPage.tsx:28`).

### 3.3 `GET /api/v1/categories`
- **Purpose**: Retrieve all categories with active product counts.
- **Caller**: Public Storefront.
- **Response**: `200 OK` with array of categories (`name`, `title`, `description`, `image`, `slug`, `itemCount`).
- **Status**: [CONFIRMED BY UI] (`commerceService.ts:73`).

### 3.4 `GET /api/v1/collections`
- **Purpose**: Retrieve all active seasonal collections/capsules.
- **Caller**: Public Storefront.
- **Response**: `200 OK` with active collections (`title`, `subtitle`, `description`, `image`, `slug`, `piecesCount`).
- **Status**: [CONFIRMED BY UI] (`CollectionsPage.tsx:35-44`).

---

## 4. Shopping Cart & Price Validation

### 4.1 `GET /api/v1/cart`
- **Purpose**: Fetch current cart contents with re-validated database pricing and current stock availability.
- **Caller**: Customer or Guest (via `X-Cart-Session` header).
- **Response**: `200 OK` with items, recalculating `unitPrice`, line item subtotal, warnings if price changed or stock is insufficient.
- **Status**: [CONFIRMED BY UI] (`CartPage.tsx:18`).

### 4.2 `POST /api/v1/cart/items`
- **Purpose**: Add an item to the shopping bag.
- **Caller**: Customer or Guest.
- **Request Body**:
  ```json
  {
    "productId": "prod-01",
    "variantId": "prod-01-oatmeal-beige-l",
    "quantity": 1
  }
  ```
- **Validation**: Variant must exist and have `availableStock >= currentCartQuantity + quantity`.
- **Response**: `200 OK` with updated cart summary.
- **Status**: [CONFIRMED BY UI] (`useStore.ts:164-220`).

### 4.3 `PATCH /api/v1/cart/items/:id`
- **Purpose**: Update item quantity in cart.
- **Caller**: Customer or Guest.
- **Request Body**: `{ "quantity": 2 }`
- **Validation**: If `quantity <= 0`, item is removed. If `quantity > variant.availableStock`, clamp or error.
- **Status**: [CONFIRMED BY UI] (`useStore.ts:230-264`).

### 4.4 `DELETE /api/v1/cart/items/:id`
- **Purpose**: Remove an item from the cart.
- **Response**: `200 OK` with updated cart.
- **Status**: [CONFIRMED BY UI] (`useStore.ts:266-278`).

### 4.5 `POST /api/v1/cart/apply-discount`
- **Purpose**: Validate and apply a coupon or promotional code.
- **Caller**: Customer or Guest.
- **Request Body**: `{ "code": "TOOO10" }`
- **Response**: `200 OK` with discount percentage/amount, updated cart total.
- **Errors**: `400 Bad Request` if expired, limit reached, or cart does not meet `minOrderValue`.
- **Status**: [CONFIRMED BY UI] (`useStore.ts:284-332`).

---

## 5. Checkout, Orders & Payments

### 5.1 `POST /api/v1/checkout/orders`
- **Purpose**: Atomically create an order record, reserve variant inventory, and initialize payment.
- **Caller**: Customer or Guest.
- **Idempotency**: Requires `Idempotency-Key` header (UUIDv4) to prevent double billing.
- **Request Body**:
  ```json
  {
    "customerInfo": {
      "fullName": "Chiemeka Davies",
      "email": "c.davies@example.com",
      "phone": "+2348035550192"
    },
    "deliveryAddress": {
      "fullName": "Chiemeka Davies",
      "email": "c.davies@example.com",
      "phone": "+2348035550192",
      "street": "14 Admiralty Way, Lekki Phase 1",
      "city": "Lagos",
      "state": "Lagos",
      "notes": "Ring bell upon arrival"
    },
    "items": [
      {
        "productId": "prod-01",
        "variantId": "prod-01-oatmeal-beige-l",
        "quantity": 1
      }
    ],
    "promoCode": "TOOO10",
    "paymentMethod": "CARD_PAYSTACK",
    "shippingFee": 3500
  }
  ```
- **Backend Responsibility**:
  1. Acquire row-level locks on requested variants (`SELECT ... FOR UPDATE`).
  2. Verify all quantities are in stock.
  3. Re-calculate subtotal from DB prices, re-validate promo code against DB rule.
  4. Create `Order` in `PENDING_PAYMENT` state with reference `TOOO-XXXXX`.
  5. Initialize payment transaction with gateway (Paystack / Flutterwave), returning authorization URL or transfer account.
  6. Increment discount usage count.
- **Response**: `201 Created` with `orderReference`, `total`, `paymentStatus`, `authorizationUrl`.
- **Status**: [CONFIRMED BY UI] (`orderService.ts:71-220`, `CheckoutPage.tsx:75`).

### 5.2 `GET /api/v1/orders/:reference/track`
- **Purpose**: Public order tracking lookup.
- **Caller**: Public.
- **Query Parameters**: `?email=c.davies@example.com` (required for PII verification).
- **Response**: `200 OK` with order status, masked items, shipping courier, and chronological timeline steps.
- **Status**: [CONFIRMED BY UI] (`OrderTrackingPage.tsx:25-80`).

### 5.3 `POST /api/v1/payments/webhooks/paystack`
- **Purpose**: Receive asynchronous payment confirmation webhook from Paystack.
- **Caller**: Paystack Gateway IP addresses.
- **Auth**: HMAC-SHA512 signature in `x-paystack-signature` header verified against `PAYSTACK_SECRET_KEY`.
- **Idempotency**: Checked against `PaymentEvent.externalEventId`. Duplicate events return `200 OK` immediately without side effects.
- **Backend Responsibility**:
  - Verify signature.
  - Parse `event: "charge.success"`.
  - Atomically update `Payment.status = "SUCCESSFUL"` and `Order.paymentStatus = "PAID"`.
  - Transition order status to `CONFIRMED`.
  - Dispatch customer receipt email and admin operational notification.
- **Status**: [PROPOSED FOR PRODUCTION] (Replaces simulated payment).

### 5.4 `POST /api/v1/payments/webhooks/flutterwave`
- **Purpose**: Receive asynchronous payment confirmation webhook from Flutterwave.
- **Caller**: Flutterwave Gateway.
- **Auth**: Secret hash verified against `verif-hash` header.
- **Status**: [PROPOSED FOR PRODUCTION].

---

## 6. Shipping & Storefront Configuration

### 6.1 `GET /api/v1/shipping/rates`
- **Purpose**: Calculate authoritative shipping fee given destination state and cart value.
- **Caller**: Public Storefront.
- **Query Parameters**: `?state=Lagos&subtotal=115000`
- **Response**: `200 OK` `{ "baseFee": 3500, "freeShippingEligible": true, "finalFee": 0, "estimatedDelivery": "24–48 Hours" }`.
- **Status**: [CONFIRMED BY UI] (`useAdminStore.shippingZones`, `CheckoutPage.tsx:45`).

### 6.2 `GET /api/v1/storefront/homepage`
- **Purpose**: Retrieve dynamic homepage section configurations.
- **Caller**: Public Storefront.
- **Response**: `200 OK` with array of active sections, headlines, image URLs, and button destinations.
- **Status**: [CONFIRMED BY UI] (`HomePage.tsx:32-45`).

### 6.3 `GET /api/v1/storefront/banners`
- **Purpose**: Retrieve active promotional announcement banners.
- **Caller**: Public Storefront.
- **Response**: `200 OK` with list of priority-ordered active announcement banners.
- **Status**: [CONFIRMED BY UI] (`AnnouncementBar.tsx:15`).

---

## 7. Administrative API (`/api/v1/admin/*`)

### 7.1 Admin Auth & Staff
- `POST /api/v1/admin/auth/login`: Staff email/password authentication.
- `GET /api/v1/admin/staff`: List all staff members (Owner, Admin only).
- `POST /api/v1/admin/staff/invite`: Send staff invite with assigned role.
- `PATCH /api/v1/admin/staff/:id/role`: Update staff role (Owner only).
- `DELETE /api/v1/admin/staff/:id`: Remove staff account.

### 7.2 Catalog Management
- `GET /api/v1/admin/products`: List all products with draft/archived status, stock count, and variant summary.
- `POST /api/v1/admin/products`: Create a new product with variants and images.
- `PUT /api/v1/admin/products/:id`: Update existing product; preserves variant stock and SKUs.
- `DELETE /api/v1/admin/products/:id`: Soft-delete/archive product.
- `POST /api/v1/admin/products/:id/duplicate`: Clone product with `-copy-XXXX` slug.

### 7.3 Inventory & Stock Movements
- `GET /api/v1/admin/inventory`: Complete variant inventory table with filter by stock level.
- `GET /api/v1/admin/inventory/low-stock`: Variants below threshold.
- `POST /api/v1/admin/inventory/adjust`: Manually increment/decrement variant stock with reason code (`Restock`, `Manual Adjustment`, `Damage / Loss`).
- `GET /api/v1/admin/inventory/movements`: Historical audit log of all stock movements.

### 7.4 Orders & Fulfillment
- `GET /api/v1/admin/orders`: List all orders with filters by status, search, and date range.
- `GET /api/v1/admin/orders/:id`: Full order details, timeline, and customer contact.
- `PATCH /api/v1/admin/orders/:id/status`: Transition fulfillment status (`Processing`, `Shipped`, `Delivered`).
- `POST /api/v1/admin/orders/:id/cancel`: Cancel order with mandatory reason; replenishes variant inventory idempotently.
- `GET /api/v1/admin/orders/returns`: List return requests.
- `PATCH /api/v1/admin/returns/:id/status`: Approve return or restock inventory upon receipt.

### 7.5 Marketing & CMS
- `GET /api/v1/admin/discounts`: List all discount rules.
- `POST /api/v1/admin/discounts`: Create a new discount rule.
- `PUT /api/v1/admin/discounts/:id`: Update discount rule.
- `DELETE /api/v1/admin/discounts/:id`: Delete or deactivate discount.
- `PUT /api/v1/admin/storefront/homepage-sections`: Save updated homepage CMS layout.
- `GET /api/v1/admin/marketing/subscribers`: List email newsletter subscribers (with CSV export).

### 7.6 Finance & Refunds
- `GET /api/v1/admin/finance/transactions`: Audit ledger of all gateway transactions.
- `GET /api/v1/admin/finance/refunds`: List refund requests.
- `POST /api/v1/admin/finance/refunds/:id/process`: Authorize and execute refund via payment provider.

### 7.7 Operations, Support & Audit
- `GET /api/v1/admin/support/messages`: Customer contact inquiry threads.
- `POST /api/v1/admin/support/messages/:id/reply`: Send staff response email.
- `GET /api/v1/admin/notifications`: Operational alerts inbox.
- `PATCH /api/v1/admin/notifications/:id/read`: Mark alert as read.
- `GET /api/v1/admin/audit-logs`: Query immutable administrative activity trail.
- `GET /api/v1/admin/settings`: Retrieve global store configuration.
- `PUT /api/v1/admin/settings`: Update VAT rate, contact details, currency symbol, and shipping thresholds.
