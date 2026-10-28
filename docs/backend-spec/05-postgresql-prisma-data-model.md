# TOOO STORE — PostgreSQL & Prisma Data Architecture

## 1. Architectural Design Principles

The TOOO STORE relational schema is designed for strict referential integrity, financial accuracy, variant-centric inventory management, and high concurrency resilience.

### 1.1 Financial Precision & Decimal Standards
- **Monetary Rule**: Floating-point types (`float`, `real`, `double precision`) are strictly prohibited for currency.
- All monetary fields (`price`, `subtotal`, `discountAmount`, `shippingFee`, `total`, `refundAmount`) are stored as **`DECIMAL(12, 2)`** in PostgreSQL, mapping to Prisma's `Decimal` type.
- Base currency is strictly Nigerian Naira (`NGN`, `₦`). Minor units (kobo) are converted deterministically: $\text{amount\_kobo} = \text{round}(\text{price\_ngn} \times 100)$.

### 1.2 Inventory & Stock Granularity
- In accordance with the observed application structure (`src/types/index.ts`, `src/store/useAdminStore.ts`), stock is owned exclusively by **`ProductVariant`** rows (representing discrete combinations of `size` and `colour`).
- `Product.stock` is a denormalized cache or computed database view representing $\sum \text{variant.stockOnHand}$.
- To prevent overselling under high concurrency, `ProductVariant` tracks both `stockOnHand` (physical units in atelier) and `stockAllocated` (units held in active pending orders). Available stock is computed as:
  $$\text{availableStock} = \text{stockOnHand} - \text{stockAllocated}$$

### 1.3 Timestamps & Soft Deletion
- All tables include `createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW()` and `updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()`.
- Customer-facing entities (`Product`, `Category`, `Collection`, `Customer`) support soft-deletion or status flags (`isArchived`, `status: ARCHIVED`) to maintain historical references in `OrderItem` and `StockMovement`.

---

## 2. Complete Prisma Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearchPostgres"]
}

// -----------------------------------------------------------------------------
// ENUMS
// -----------------------------------------------------------------------------

enum AdminRole {
  OWNER
  ADMINISTRATOR
  STORE_MANAGER
  FULFILMENT_STAFF
  SUPPORT_STAFF
  ANALYST
}

enum StaffStatus {
  ACTIVE
  INVITED
  SUSPENDED
}

enum CustomerStatus {
  NEW
  ACTIVE
  VIP
  INACTIVE
}

enum ProductStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum ProductCategoryEnum {
  OUTERWEAR
  SETS
  TOPS
  BOTTOMS
  ACCESSORIES
}

enum OrderStatus {
  PENDING_PAYMENT
  ORDER_PLACED
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  SUCCESSFUL
  FAILED
  REFUNDED
}

enum PaymentMethod {
  CARD_PAYSTACK
  BANK_TRANSFER_NIP
  CARD_FLUTTERWAVE
  MANUAL_ATELIER
}

enum StockMovementReason {
  RESTOCK
  SALE
  MANUAL_ADJUSTMENT
  RETURN
  DAMAGE_LOSS
  CANCELLATION
}

enum ReturnStatus {
  PENDING_REVIEW
  APPROVED
  RECEIVED_AND_RESTOCKED
  REJECTED
}

enum RefundStatus {
  PENDING_APPROVAL
  APPROVED
  PROCESSING
  COMPLETED
  REJECTED
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
}

enum ReviewStatus {
  PENDING
  APPROVED
  HIDDEN
}

enum SubscriberSource {
  FOOTER
  POPUP_MODAL
  CHECKOUT_OPT_IN
  CAMPAIGN_DROP
}

// -----------------------------------------------------------------------------
// IDENTITY & USERS
// -----------------------------------------------------------------------------

model AdminUser {
  id           String      @id @default(uuid())
  email        String      @unique
  passwordHash String
  name         String
  role         AdminRole   @default(STORE_MANAGER)
  avatar       String?
  status       StaffStatus @default(ACTIVE)
  lastActiveAt DateTime?   @db.Timestamptz
  createdAt    DateTime    @default(now()) @db.Timestamptz
  updatedAt    DateTime    @updatedAt @db.Timestamptz

  auditLogs      AuditLog[]
  stockMovements StockMovement[]
  assignedTickets SupportMessage[]

  @@map("admin_users")
}

model Customer {
  id           String         @id @default(uuid())
  email        String         @unique
  passwordHash String?        // Nullable to support guest checkout convert-to-account
  fullName     String
  phone        String
  status       CustomerStatus @default(NEW)
  tags         String[]       @default([])
  notes        String?        @db.Text
  createdAt    DateTime       @default(now()) @db.Timestamptz
  updatedAt    DateTime       @updatedAt @db.Timestamptz

  addresses   Address[]
  orders      Order[]
  carts       Cart[]
  reviews     CustomerReview[]
  wishlist    WishlistItem[]

  @@index([email])
  @@index([status])
  @@map("customers")
}

model Address {
  id         String   @id @default(uuid())
  customerId String
  label      String   @default("Residence")
  street     String
  city       String
  state      String
  country    String   @default("Nigeria")
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now()) @db.Timestamptz
  updatedAt  DateTime @updatedAt @db.Timestamptz

  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)

  @@index([customerId])
  @@map("addresses")
}

// -----------------------------------------------------------------------------
// CATALOG & TAXONOMY
// -----------------------------------------------------------------------------

model Category {
  id          String              @id @default(uuid())
  slug        String              @unique
  name        ProductCategoryEnum @unique
  title       String
  description String              @db.Text
  image       String
  isPublished Boolean             @default(true)
  sortOrder   Int                 @default(0)
  createdAt   DateTime            @default(now()) @db.Timestamptz
  updatedAt   DateTime            @updatedAt @db.Timestamptz

  products Product[]

  @@map("categories")
}

model Collection {
  id          String   @id @default(uuid())
  slug        String   @unique
  title       String
  subtitle    String
  description String   @db.Text
  image       String
  isFeatured  Boolean  @default(false)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now()) @db.Timestamptz
  updatedAt   DateTime @updatedAt @db.Timestamptz

  products ProductCollection[]

  @@map("collections")
}

model Product {
  id               String        @id @default(uuid())
  slug             String        @unique
  name             String
  description      String        @db.Text
  shortDescription String?       @db.VarChar(255)
  price            Decimal       @db.Decimal(12, 2)
  compareAtPrice   Decimal?      @db.Decimal(12, 2)
  status           ProductStatus @default(PUBLISHED)
  categoryId       String
  isFeatured       Boolean       @default(false)
  isNew            Boolean       @default(true)
  isBestSeller     Boolean       @default(false)
  fabricCare       String[]      @default([])
  details          String[]      @default([])
  cachedTotalStock Int           @default(0)
  createdAt        DateTime      @default(now()) @db.Timestamptz
  updatedAt        DateTime      @updatedAt @db.Timestamptz

  category    Category            @relation(fields: [categoryId], references: [id])
  collections ProductCollection[]
  images      ProductImage[]
  variants    ProductVariant[]
  reviews     CustomerReview[]

  @@index([slug])
  @@index([categoryId])
  @@index([status])
  @@index([price])
  @@map("products")
}

model ProductCollection {
  productId    String
  collectionId String

  product    Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([productId, collectionId])
  @@map("product_collections")
}

model ProductImage {
  id        String   @id @default(uuid())
  productId String
  url       String
  altText   String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now()) @db.Timestamptz

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId, sortOrder])
  @@map("product_images")
}

model ProductVariant {
  id             String   @id @default(uuid())
  variantId      String   @unique // Public slug identifier: "prod-01-oatmeal-beige-l"
  productId      String
  size           String   // e.g. "S", "M", "L", "XL"
  colourName     String   // e.g. "Oatmeal Beige"
  colourHex      String   // e.g. "#D8D0C5"
  sku            String   @unique
  stockOnHand    Int      @default(0) // Physical units in atelier
  stockAllocated Int      @default(0) // Reserved by pending checkout orders
  createdAt      DateTime @default(now()) @db.Timestamptz
  updatedAt      DateTime @updatedAt @db.Timestamptz

  product        Product         @relation(fields: [productId], references: [id], onDelete: Cascade)
  stockMovements StockMovement[]
  cartItems      CartItem[]
  orderItems     OrderItem[]

  @@unique([productId, size, colourName])
  @@index([variantId])
  @@index([sku])
  @@map("product_variants")
}

// -----------------------------------------------------------------------------
// INVENTORY MOVEMENTS
// -----------------------------------------------------------------------------

model StockMovement {
  id             String              @id @default(uuid())
  variantId      String
  quantityChange Int                 // Positive for additions, negative for deductions
  balanceAfter   Int
  reason         StockMovementReason
  actorId        String?             // AdminUser ID or "SYSTEM / CHECKOUT"
  actorName      String
  notes          String?
  orderId        String?
  createdAt      DateTime            @default(now()) @db.Timestamptz

  variant ProductVariant @relation(fields: [variantId], references: [id], onDelete: Restrict)
  admin   AdminUser?     @relation(fields: [actorId], references: [id])
  order   Order?         @relation(fields: [orderId], references: [id])

  @@index([variantId, createdAt])
  @@map("stock_movements")
}

// -----------------------------------------------------------------------------
// SHOPPING CART
// -----------------------------------------------------------------------------

model Cart {
  id         String    @id @default(uuid())
  sessionId  String    @unique // Browser session UUID
  customerId String?
  discountId String?
  expiresAt  DateTime  @db.Timestamptz
  createdAt  DateTime  @default(now()) @db.Timestamptz
  updatedAt  DateTime  @updatedAt @db.Timestamptz

  customer Customer?  @relation(fields: [customerId], references: [id], onDelete: SetNull)
  discount Discount?  @relation(fields: [discountId], references: [id], onDelete: SetNull)
  items    CartItem[]

  @@map("carts")
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  variantId String
  quantity  Int      @default(1)
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz

  cart    Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  variant ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)

  @@unique([cartId, variantId])
  @@map("cart_items")
}

// -----------------------------------------------------------------------------
// ORDERS & FULFILLMENT
// -----------------------------------------------------------------------------

model Order {
  id             String        @id @default(uuid())
  orderReference String        @unique // e.g. "TOOO-84920"
  customerId     String?
  customerEmail  String
  customerName   String
  customerPhone  String
  shippingStreet String
  shippingCity   String
  shippingState  String
  shippingNotes  String?
  subtotal       Decimal       @db.Decimal(12, 2)
  discountAmount Decimal       @default(0) @db.Decimal(12, 2)
  shippingFee    Decimal       @default(0) @db.Decimal(12, 2)
  totalAmount    Decimal       @db.Decimal(12, 2)
  deliveryStatus OrderStatus   @default(ORDER_PLACED)
  paymentStatus  PaymentStatus @default(PENDING)
  paymentMethod  PaymentMethod
  trackingNumber String?
  courierPartner String?
  createdAt      DateTime      @default(now()) @db.Timestamptz
  updatedAt      DateTime      @updatedAt @db.Timestamptz

  customer       Customer?          @relation(fields: [customerId], references: [id], onDelete: SetNull)
  items          OrderItem[]
  timeline       OrderTimeline[]
  payments       Payment[]
  refunds        Refund[]
  returnRequests ReturnRequest[]
  stockMovements StockMovement[]
  redemptions    DiscountRedemption[]

  @@index([orderReference])
  @@index([customerEmail])
  @@index([deliveryStatus])
  @@index([paymentStatus])
  @@map("orders")
}

model OrderItem {
  id             String   @id @default(uuid())
  orderId        String
  variantId      String
  productName    String   // Preserved snapshot at time of purchase
  size           String
  colour         String
  unitPrice      Decimal  @db.Decimal(12, 2)
  quantity       Int
  totalPrice     Decimal  @db.Decimal(12, 2)
  productImage   String
  createdAt      DateTime @default(now()) @db.Timestamptz

  order   Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variant ProductVariant @relation(fields: [variantId], references: [id], onDelete: Restrict)

  @@index([orderId])
  @@map("order_items")
}

model OrderTimeline {
  id          String      @id @default(uuid())
  orderId     String
  status      OrderStatus
  description String
  actorName   String?
  createdAt   DateTime    @default(now()) @db.Timestamptz

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId, createdAt])
  @@map("order_timelines")
}

// -----------------------------------------------------------------------------
// PAYMENTS & REFUNDS
// -----------------------------------------------------------------------------

model Payment {
  id               String        @id @default(uuid())
  orderId          String
  gatewayReference String        @unique // Paystack / Flutterwave transaction reference
  amount           Decimal       @db.Decimal(12, 2)
  currency         String        @default("NGN")
  method           PaymentMethod
  status           PaymentStatus @default(PENDING)
  gatewayPayload   Json?
  paidAt           DateTime?     @db.Timestamptz
  createdAt        DateTime      @default(now()) @db.Timestamptz
  updatedAt        DateTime      @updatedAt @db.Timestamptz

  order  Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  events PaymentEvent[]

  @@index([orderId])
  @@index([gatewayReference])
  @@map("payments")
}

model PaymentEvent {
  id               String   @id @default(uuid())
  paymentId        String
  externalEventId  String   @unique // For webhook deduplication
  eventType        String   // e.g. "charge.success"
  payload          Json
  processedSuccess Boolean  @default(true)
  createdAt        DateTime @default(now()) @db.Timestamptz

  payment Payment @relation(fields: [paymentId], references: [id], onDelete: Cascade)

  @@index([externalEventId])
  @@map("payment_events")
}

model Refund {
  id              String       @id @default(uuid())
  refundReference String       @unique // e.g. "REF-2026-001"
  orderId         String
  amount          Decimal      @db.Decimal(12, 2)
  reason          String
  status          RefundStatus @default(PENDING_APPROVAL)
  processedAt     DateTime?    @db.Timestamptz
  createdAt       DateTime     @default(now()) @db.Timestamptz
  updatedAt       DateTime     @updatedAt @db.Timestamptz

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@map("refunds")
}

model ReturnRequest {
  id             String       @id @default(uuid())
  orderId        String
  productName    String
  variantSummary String
  reason         String
  condition      String
  status         ReturnStatus @default(PENDING_REVIEW)
  createdAt      DateTime     @default(now()) @db.Timestamptz
  updatedAt      DateTime     @updatedAt @db.Timestamptz

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@map("return_requests")
}

// -----------------------------------------------------------------------------
// MARKETING, DISCOUNTS & CRM
// -----------------------------------------------------------------------------

model Discount {
  id            String       @id @default(uuid())
  code          String       @unique
  type          DiscountType @default(PERCENTAGE)
  value         Decimal      @db.Decimal(12, 2) // e.g. 10.00 for 10%, or 20000.00 for ₦20,000
  minOrderValue Decimal      @default(0) @db.Decimal(12, 2)
  usageLimit    Int?
  usageCount    Int          @default(0)
  startDate     DateTime     @db.Timestamptz
  expiryDate    DateTime?    @db.Timestamptz
  isActive      Boolean      @default(true)
  createdAt     DateTime     @default(now()) @db.Timestamptz
  updatedAt     DateTime     @updatedAt @db.Timestamptz

  redemptions DiscountRedemption[]
  carts       Cart[]

  @@index([code])
  @@map("discounts")
}

model DiscountRedemption {
  id         String   @id @default(uuid())
  discountId String
  orderId    String
  amount     Decimal  @db.Decimal(12, 2)
  createdAt  DateTime @default(now()) @db.Timestamptz

  discount Discount @relation(fields: [discountId], references: [id], onDelete: Restrict)
  order    Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@unique([discountId, orderId])
  @@map("discount_redemptions")
}

model CustomerReview {
  id               String       @id @default(uuid())
  productId        String
  customerId       String?
  customerName     String
  customerEmail    String
  rating           Int          // 1 to 5
  title            String
  comment          String       @db.Text
  status           ReviewStatus @default(PENDING)
  verifiedPurchase Boolean      @default(false)
  createdAt        DateTime     @default(now()) @db.Timestamptz
  updatedAt        DateTime     @updatedAt @db.Timestamptz

  product  Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  customer Customer? @relation(fields: [customerId], references: [id], onDelete: SetNull)

  @@index([productId, status])
  @@map("customer_reviews")
}

model WishlistItem {
  id         String   @id @default(uuid())
  customerId String
  productId  String
  createdAt  DateTime @default(now()) @db.Timestamptz

  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)

  @@unique([customerId, productId])
  @@map("wishlist_items")
}

model EmailSubscriber {
  id           String           @id @default(uuid())
  email        String           @unique
  source       SubscriberSource @default(FOOTER)
  isSubscribed Boolean          @default(true)
  createdAt    DateTime         @default(now()) @db.Timestamptz

  @@map("email_subscribers")
}

// -----------------------------------------------------------------------------
// CMS & STORE CONFIGURATION
// -----------------------------------------------------------------------------

model HomepageSection {
  id          String   @id // e.g. "sec-hero", "sec-campaign", "sec-story"
  name        String
  title       String
  enabled     Boolean  @default(true)
  sortOrder   Int      @default(0)
  headline    String?
  subheadline String?
  ctaText     String?
  ctaLink     String?
  image       String?
  updatedAt   DateTime @updatedAt @db.Timestamptz

  @@map("homepage_sections")
}

model PromoBanner {
  id        String   @id @default(uuid())
  text      String
  linkText  String
  linkUrl   String
  isActive  Boolean  @default(true)
  priority  Int      @default(0)
  createdAt DateTime @default(now()) @db.Timestamptz

  @@map("promo_banners")
}

model ShippingZone {
  id                    String   @id @default(uuid())
  name                  String
  regions               String[] // Array of state or city names
  baseFee               Decimal  @db.Decimal(12, 2)
  freeShippingThreshold Decimal  @db.Decimal(12, 2)
  estimatedDelivery     String
  courierPartner        String
  createdAt             DateTime @default(now()) @db.Timestamptz
  updatedAt             DateTime @updatedAt @db.Timestamptz

  @@map("shipping_zones")
}

model SupportMessage {
  id            String   @id @default(uuid())
  customerName  String
  customerEmail String
  subject       String
  status        String   @default("OPEN") // OPEN, IN_PROGRESS, RESOLVED
  assignedToId  String?
  createdAt     DateTime @default(now()) @db.Timestamptz
  updatedAt     DateTime @updatedAt @db.Timestamptz

  assignedStaff AdminUser?             @relation(fields: [assignedToId], references: [id])
  thread        SupportMessageThread[]

  @@map("support_messages")
}

model SupportMessageThread {
  id        String   @id @default(uuid())
  messageId String
  sender    String   // "CUSTOMER" or "STAFF"
  actorName String
  text      String   @db.Text
  createdAt DateTime @default(now()) @db.Timestamptz

  parentMessage SupportMessage @relation(fields: [messageId], references: [id], onDelete: Cascade)

  @@index([messageId])
  @@map("support_message_threads")
}

model StoreSettings {
  id                  String   @id @default("singleton")
  storeName           String   @default("TOOO STORE")
  tagline             String   @default("Your Style. Your Statement.")
  contactEmail        String   @default("atelier@tooostore.example")
  supportPhone        String   @default("+234 803 555 0192")
  atelierAddress      String   @default("14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria")
  currency            String   @default("NGN")
  currencySymbol      String   @default("₦")
  timezone            String   @default("Africa/Lagos")
  vatRate             Decimal  @default(7.5) @db.Decimal(5, 2)
  freeShippingMinNaira Decimal @default(100000.00) @db.Decimal(12, 2)
  instagramUrl        String   @default("https://instagram.com/tooostore")
  tiktokUrl           String   @default("https://tiktok.com/@tooostore")
  updatedAt           DateTime @updatedAt @db.Timestamptz

  @@map("store_settings")
}

// -----------------------------------------------------------------------------
// AUDIT LOGS & NOTIFICATIONS
// -----------------------------------------------------------------------------

model AuditLog {
  id        String   @id @default(uuid())
  actorId   String?
  actorName String
  actorRole String
  action    String   // e.g. "RESTOCK_VARIANT", "UPDATE_PRODUCT", "CANCEL_ORDER"
  resource  String   // e.g. "Product:prod-01", "Order:TOOO-84920"
  details   String   @db.Text
  ipAddress String?
  createdAt DateTime @default(now()) @db.Timestamptz

  admin AdminUser? @relation(fields: [actorId], references: [id], onDelete: SetNull)

  @@index([resource])
  @@index([createdAt])
  @@map("audit_logs")
}

model OperationalNotification {
  id        String   @id @default(uuid())
  title     String
  message   String
  type      String   // "order", "inventory", "payment", "return", "system"
  isRead    Boolean  @default(false)
  linkUrl   String?
  createdAt DateTime @default(now()) @db.Timestamptz

  @@index([isRead, createdAt])
  @@map("operational_notifications")
}
```

---

## 3. Concurrency Protection & Anti-Overselling Strategy

In fashion e-commerce drops with limited stock per variant, multiple customers frequently attempt to purchase the same inventory simultaneously. The following implementation pattern guarantees zero overselling:

```typescript
// Example: Atomic Inventory Reservation in Prisma Transaction
export async function reserveVariantStock(
  tx: Prisma.TransactionClient,
  items: { variantId: string; quantity: number }[]
) {
  for (const item of items) {
    // 1. SELECT ... FOR UPDATE locks the variant row until transaction commits
    const [variant] = await tx.$queryRaw<ProductVariant[]>`
      SELECT * FROM "product_variants"
      WHERE "variantId" = ${item.variantId}
      FOR UPDATE
    `;

    if (!variant) {
      throw new Error(`Variant ${item.variantId} not found.`);
    }

    const available = variant.stockOnHand - variant.stockAllocated;
    if (available < item.quantity) {
      throw new Error(
        `Insufficient stock for variant ${variant.variantId}. Available: ${available}, requested: ${item.quantity}`
      );
    }

    // 2. Increment allocated stock
    await tx.productVariant.update({
      where: { variantId: item.variantId },
      data: {
        stockAllocated: { increment: item.quantity },
      },
    });
  }
}
```
