# TOOO STORE — Payments, Webhooks & Idempotency Specification

## 1. Supported Payment Rails & Architecture

The TOOO STORE checkout and administrative finance console support three primary payment rails tailored to contemporary Nigerian and international luxury e-commerce:

1. **Card Payments via Paystack**:
   - Primary online gateway supporting Visa, Mastercard, and Verve.
   - Hosted payment modal / redirect flow with server-side transaction initialization.
2. **Dedicated Virtual Bank Transfer (NIP - Nigerian Interbank Settlement System)**:
   - Dynamic 10-digit virtual bank accounts generated on-demand per order.
   - Immediate asynchronous webhook notification upon bank credit.
3. **Card Payments via Flutterwave (Secondary / Cross-Border Rail)**:
   - Secondary card processor for international payments (USD/GBP/EUR converted to NGN).

---

## 2. Paystack Gateway Integration Details

### 2.1 Transaction Initialization (`POST /api/v1/checkout/orders`)
When a customer chooses `CARD_PAYSTACK`, the backend initiates a transaction with the Paystack REST API:

- **Endpoint**: `POST https://api.paystack.co/transaction/initialize`
- **Headers**:
  - `Authorization: Bearer ${PAYSTACK_SECRET_KEY}`
  - `Content-Type: application/json`
- **Payload**:
  ```json
  {
    "email": "c.davies@example.com",
    "amount": 15170000,
    "currency": "NGN",
    "reference": "TOOO-84920-1730102400",
    "callback_url": "https://tooostore.com/checkout/confirmation?order=TOOO-84920",
    "metadata": {
      "orderReference": "TOOO-84920",
      "customerName": "Chiemeka Davies",
      "cartItemsCount": 3
    }
  }
  ```
- **Response**: Returns `authorization_url` and `access_code`. The storefront redirects the customer to this URL to complete 3D-Secure authentication.

---

## 3. Webhook Verification & Replay Protection

### 3.1 Signature Verification
Paystack signs every webhook event using an HMAC-SHA512 hash computed over the raw request payload using the secret key.

```typescript
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export function verifyPaystackSignature(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-paystack-signature'];
  if (!signature || typeof signature !== 'string') {
    return res.status(401).json({ error: 'Missing webhook signature' });
  }

  const rawBody = (req as any).rawBody; // Captured before JSON parsing
  const expectedSignature = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  next();
}
```

### 3.2 Webhook Deduplication & Event Idempotency
Gateways frequently retry webhooks if their server experiences network timeouts. Duplicate event ingestion is prevented by tracking `externalEventId`:

```typescript
export async function handlePaystackWebhook(event: PaystackWebhookPayload) {
  const eventId = String(event.data.id);

  // 1. Check if event was already processed
  const existingEvent = await prisma.paymentEvent.findUnique({
    where: { externalEventId: eventId },
  });

  if (existingEvent) {
    // Return 200 OK immediately with no further mutations
    return { status: 'ALREADY_PROCESSED' };
  }

  // 2. Atomic processing transaction
  return await prisma.$transaction(async (tx) => {
    // Record event
    await tx.paymentEvent.create({
      data: {
        paymentId: (await getPaymentIdForReference(event.data.reference, tx)),
        externalEventId: eventId,
        eventType: event.event,
        payload: event as any,
      },
    });

    if (event.event === 'charge.success') {
      const orderRef = event.data.metadata.orderReference;
      const order = await tx.order.findUnique({ where: { orderReference: orderRef } });

      if (!order) throw new Error(`Order ${orderRef} not found.`);

      // Validate payment amount (amount is in kobo)
      const expectedKobo = Number(order.totalAmount) * 100;
      if (event.data.amount < expectedKobo) {
        throw new Error(`Payment underpaid: expected ${expectedKobo}, got ${event.data.amount}`);
      }

      // Update Order & Payment
      await tx.order.update({
        where: { orderReference: orderRef },
        data: {
          paymentStatus: 'SUCCESSFUL',
          deliveryStatus: 'CONFIRMED',
          timeline: {
            create: {
              status: 'CONFIRMED',
              description: `Payment authorized via Paystack (Ref: ${event.data.reference})`,
            },
          },
        },
      });

      // Convert allocated stock to final stock decrement
      await finalizeReservedInventory(order.id, tx);
    }
  });
}
```

---

## 4. Idempotency Key Architecture for Client Operations

To prevent duplicate charges or duplicate stock adjustments caused by network re-transmissions or double-clicking:

1. **Client Headers**:
   - The frontend checkout sends an `Idempotency-Key: <UUIDv4>` header on `POST /api/v1/checkout/orders`.
2. **Backend Processing**:
   - If the key does not exist in the Redis cache or `idempotency_keys` table:
     - The request is executed.
     - The response status code and JSON body are stored with a 24-hour expiration.
   - If the key already exists:
     - If the original request is still `IN_PROGRESS`, return `HTTP 409 Conflict` (`"Request currently processing, please wait"`).
     - If the original request is completed, return the cached status code and response payload directly without touching the database or charging the customer again.

---

## 5. Refunds & Reversals Workflow

### 5.1 Refund Authorization (`POST /api/v1/admin/finance/refunds/:id/process`)
Refunds require explicit authorization from an `Owner` or `Administrator` in the finance console (`RefundsPage.tsx`):

1. **Validation**:
   - Order must have `paymentStatus: 'SUCCESSFUL'`.
   - Cumulative refunded amount must not exceed original `Order.totalAmount`.
2. **Gateway Execution**:
   - Calls Paystack Refund API (`POST https://api.paystack.co/refund`).
   - Body: `{ "transaction": payment.gatewayReference, "amount": refundAmountKobo }`.
3. **Ledger & Audit Entry**:
   - Updates `Refund.status = 'COMPLETED'`.
   - Inserts negative transaction record into `TransactionRecord`.
   - Records audit log entry with actor ID.
