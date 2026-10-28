# TOOO STORE — Business Rules & State Machines

## 1. Catalog & Product Lifecycle Rules

### 1.1 Product Status Transitions
```
                ┌───────────┐
                │   DRAFT   │
                └─────┬─────┘
                      │ Publish action (requires $\ge 1$ variant, $\ge 1$ image)
                      ▼
               ┌─────────────┐
        ┌─────►│  PUBLISHED  │◄────┐
        │      └──────┬──────┘     │
Unarchive      │      │            │ Re-publish
        │      │      │ Archive action
        │      │      ▼            │
        │      ┌─────────────┐     │
        └──────┤  ARCHIVED   ├─────┘
               └─────────────┘
```

1. **Publication Invariants**:
   - A product can only enter `PUBLISHED` state if:
     - It has at least one active variant (`variants.length >= 1`).
     - It has at least one associated product image (`images.length >= 1`).
     - Its base price is greater than zero (`price > 0`).
     - Its URL slug is unique across the entire product catalog.
2. **Slug Uniqueness & Immutability**:
   - Slugs are generated from product names using lowercase kebab-case (e.g. `Architectural Wool Overcoat` $\rightarrow$ `architectural-wool-overcoat`).
   - If a duplicate slug occurs during creation or duplication, the backend must append a unique suffix: `${slug}-copy-${timestamp}` or `${slug}-${nanoid(4)}`.
   - Changing a published product's slug requires creating an automatic 301 URL redirect mapping from old slug to new slug to prevent broken external links.
3. **Variant & SKU Uniqueness**:
   - Each variant is uniquely identified by the tuple `(productId, size, colourName)`. No duplicate sizes within the same colour are permitted.
   - Every variant must possess an uppercase alphanumeric SKU (e.g. `TOOO-PROD-01-L-OAT`). Duplicate SKUs across the entire database are rejected with HTTP 409 Conflict.
4. **Variant Update Preservation**:
   - When an administrator updates a product's price or description, existing variant stock levels and SKUs must be preserved unless explicitly altered by the user.

---

## 2. Order Fulfillment State Machine

```
  [Customer Places Order]
             │
             ▼
    ┌─────────────────┐
    │ PENDING_PAYMENT │ ──(Timeout: 30 min / Payment Failure)──► [CANCELLED]
    └────────┬────────┘                                            (Release stock)
             │
             │ Webhook: "charge.success" / Transfer Verified
             ▼
    ┌─────────────────┐
    │    CONFIRMED    │ ──(Cancellation / Support Request)──────► [CANCELLED]
    └────────┬────────┘                                            (Replenish stock)
             │
             │ Atelier Staff: Box & Prepare
             ▼
    ┌─────────────────┐
    │   PROCESSING    │ ──(Atelier Cancellation)─────────────────► [CANCELLED]
    └────────┬────────┘                                            (Replenish stock)
             │
             │ Handover to Courier (Requires Tracking Number)
             ▼
    ┌─────────────────┐
    │     SHIPPED     │
    └────────┬────────┘
             │
             │ Doorstep Signature Confirmation
             ▼
    ┌─────────────────┐
    │    DELIVERED    │
    └─────────────────┘
```

### 2.1 Valid State Transitions Table

| Current State | Target State | Triggering Actor | Required Conditions / Invariants | Side Effects |
|:---|:---|:---|:---|:---|
| `PENDING_PAYMENT` | `CONFIRMED` | Payment Webhook / System | Verified gateway signature and payment confirmation. | Transitions `paymentStatus` to `PAID`; commits reserved stock; triggers customer email. |
| `PENDING_PAYMENT` | `CANCELLED` | System (TTL expiration) | 30 minutes elapsed without payment confirmation. | Decrements `stockAllocated`; logs `StockMovementReason.CANCELLATION`. |
| `CONFIRMED` | `PROCESSING` | Store Manager / Fulfilment | Garments retrieved, inspected, and steamed at atelier. | Appends entry to `order_timelines`. |
| `CONFIRMED` | `CANCELLED` | Owner / Manager / Customer | Customer requests cancellation prior to dispatch. | Restores variant stock on hand; initiates full payment refund. |
| `PROCESSING` | `SHIPPED` | Fulfilment Staff | Tracking number and courier partner provided. | Appends tracking info; triggers customer SMS/Email dispatch notice. |
| `SHIPPED` | `DELIVERED` | Courier Webhook / Staff | Courier API marks package delivered with recipient name. | Closes order fulfillment cycle; updates customer lifetime value. |
| `DELIVERED` | `CANCELLED` | **DISALLOWED** | Delivered orders cannot be cancelled directly. | Customer must initiate a formal `ReturnRequest`. |
| `CANCELLED` | Any State | **DISALLOWED** | `CANCELLED` is an immutable terminal state. | Re-activating a cancelled order is forbidden. |

---

## 3. Atomic Order Placement & Inventory Deduction Rules

```
                      [Customer Submits Checkout]
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │  Begin Prisma $transaction   │
                    └──────────────┬───────────────┘
                                   │
                     Acquire Row Locks on Variants
                    ┌──────────────▼───────────────┐
                    │ SELECT ... FOR UPDATE        │
                    └──────────────┬───────────────┘
                                   │
                     Stock Sufficiency Check
                     Is available >= requested for all items?
                                  / \
                            No   /   \   Yes
                                /     \
                               ▼       ▼
                    [Rollback & 409]  Re-calculate Line Items, Subtotal,
                                      Shipping & Taxes from DB Tables
                                       │
                                       ▼
                                      Re-validate Promo Code:
                                      isActive && now() <= expiry &&
                                      usageCount < limit && subtotal >= min
                                       │
                                       ▼
                                      Create Order Record (PENDING_PAYMENT)
                                      Create OrderItems & Timeline
                                      Increment stockAllocated
                                      Increment Discount.usageCount
                                       │
                                       ▼
                    ┌──────────────────────────────┐
                    │      Commit Transaction      │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    [Initialize Gateway Transaction]
                    (Return Paystack Authorization URL)
```

1. **Client Price Disregard**:
   - The backend **never** relies on `unitPrice`, `subtotal`, or `discount` sent in the request body. All prices are read from the `products` table, discounts from `discounts`, and shipping rates from `shipping_zones`.
2. **Double-Click & Replay Protection**:
   - Order creation endpoints enforce mandatory `Idempotency-Key` headers. If an order with the same idempotency key was received within 60 seconds, the previously created order payload is returned without re-processing.
3. **Inventory Replenishment on Cancellation**:
   - Cancellation must be strictly idempotent. Calling `cancelOrder` twice on the same order must not restock inventory twice.
   - Handled via SQL status assertion:
     ```sql
     UPDATE "orders"
     SET "deliveryStatus" = 'CANCELLED'
     WHERE "orderReference" = $1 AND "deliveryStatus" != 'CANCELLED'
     RETURNING "id";
     ```
   - Only if a row was updated does the service increment `ProductVariant.stockOnHand` and record a `StockMovement` with reason `'Cancellation'`.

---

## 4. Payment & Webhook Reconciliation Rules

```
               [Gateway Webhook Ingestion]
                            │
                            ▼
               Verify HMAC-SHA512 Signature
             (x-paystack-signature vs Secret)
                           / \
                     No   /   \   Yes
                         /     \
                        ▼       ▼
              [Reject HTTP 401] Check payment_events for
                                externalEventId (Deduplication)
                                       / \
                           Duplicate  /   \  New Event
                                     /     \
                                    ▼       ▼
                          [Return HTTP 200] Record payment_event
                           (No side effects) Update Payment.status = SUCCESSFUL
                                            Update Order.paymentStatus = PAID
                                            Transition Order -> CONFIRMED
                                            Convert stockAllocated to StockMovement (Sale)
                                            Emit Admin Alert & Customer Email
```

1. **Replay Protection**:
   - Paystack and Flutterwave occasionally deliver duplicate webhook deliveries.
   - The backend checks `payment_events.externalEventId`. If the ID exists, the webhook responds with `HTTP 200 OK` immediately without modifying the order or ledger.
2. **Amount Reconciliation**:
   - The paid amount reported by the webhook (`data.amount` in kobo) must match $\text{order.totalAmount} \times 100$. If there is a discrepancy, the payment is flagged as `SUSPICIOUS_UNDERPAID` and placed on administrative hold.

---

## 5. Open Product Decisions (`OPEN QUESTION`)

1. **`OPEN QUESTION 1: Inventory Reservation TTL`**:
   - *Current Observation*: The frontend prototype decrements stock immediately at checkout (`orderService.ts:131`).
   - *Production Dilemma*: In a real payment redirect flow, shoppers may abandon the Paystack checkout page. If stock is deducted permanently, inventory is lost. If stock is not deducted, two users may pay for the same item.
   - *Architectural Recommendation*: Implement a 15-minute `stockAllocated` reservation TTL with a scheduled cleanup worker that releases expired reservations.
2. **`OPEN QUESTION 2: Bank Transfer Verification Method`**:
   - *Current Observation*: The frontend supports `Bank Transfer (Demo)`.
   - *Production Dilemma*: Should bank transfers use virtual dynamic accounts generated via Paystack Dedicated Virtual Accounts (DVA) with instant webhook reconciliation, or manual manual staff verification at the atelier?
   - *Architectural Recommendation*: Implement automated Paystack Dedicated Virtual NIP Accounts for instant reconciliation, with manual atelier fallback for private VIP clients.
3. **`OPEN QUESTION 3: Guest Checkout vs Forced Account Creation`**:
   - *Current Observation*: The checkout allows both guest checkout and logged-in accounts.
   - *Architectural Recommendation*: Allow guest checkout; automatically link orders to a customer profile if the email address matches an existing account.
