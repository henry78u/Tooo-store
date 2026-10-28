# TOOO STORE — Authentication, Authorization & Security Architecture

## 1. Authentication Strategy & Session Lifecycle

The TOOO STORE backend implements a stateless JSON Web Token (JWT) architecture paired with rotated refresh tokens stored in secure `HttpOnly` cookies.

### 1.1 Dual Token Architecture
1. **Access Token**:
   - Short-lived JWT (15 minutes expiration).
   - Transmitted in the `Authorization: Bearer <token>` header.
   - Payload:
     ```json
     {
       "sub": "usr_99812984",
       "email": "adaeze@tooostore.example",
       "type": "ADMIN",
       "role": "OWNER",
       "iat": 1730102400,
       "exp": 1730103300
     }
     ```
2. **Refresh Token**:
   - Long-lived cryptographically secure random token (30 days expiration).
   - Stored in a hashed format in PostgreSQL (`refresh_tokens` table) with device/IP metadata.
   - Delivered to the browser exclusively via a cookie with flags:
     `Set-Cookie: __Secure-tooo-refresh=<token>; Path=/api/v1/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
3. **Token Rotation & Revocation**:
   - Every invocation of `POST /api/v1/auth/refresh` invalidates the previous refresh token and issues a new pair.
   - If a compromised or reused refresh token is detected, the entire session family for that user is immediately revoked.

### 1.2 Password Hashing & Security
- Passwords are encrypted using **Argon2id** (preferred) or **bcrypt** with a work factor of $\ge 12$ salt rounds.
- Plaintext passwords never touch database logs or persistent memory.

---

## 2. Role-Based Access Control (RBAC) Matrix

Administrative actions are protected by granular permission checks mapping to the roles observed in `src/types/admin.ts`.

| Permission Flag / Action | Owner | Administrator | Store Manager | Fulfilment Staff | Support Staff | Analyst | Customer | Public |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **View Storefront Catalog** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Place Orders / Checkout** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **View Own Account / Orders** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No |
| **View All Products (Admin)** | Yes | Yes | Yes | Yes | Yes | Yes | No | No |
| **Create / Edit Products** | Yes | Yes | Yes | No | No | No | No | No |
| **Delete / Archive Products**| Yes | Yes | No | No | No | No | No | No |
| **Adjust Variant Inventory** | Yes | Yes | Yes | Yes | No | No | No | No |
| **Update Order Fulfillment** | Yes | Yes | Yes | Yes | No | No | No | No |
| **Cancel Order & Restock**   | Yes | Yes | Yes | No | No | No | No | No |
| **Process Returns / Exchanges**| Yes | Yes | Yes | Yes | Yes | No | No | No |
| **Approve & Process Refunds**| Yes | Yes | No | No | No | No | No | No |
| **Manage Discount Codes**   | Yes | Yes | Yes | No | No | No | No | No |
| **Edit Homepage CMS**        | Yes | Yes | Yes | No | No | No | No | No |
| **View Financial Reports**   | Yes | Yes | No | No | No | Yes | No | No |
| **Manage Staff & Roles**     | Yes | No | No | No | No | No | No | No |
| **View Immutable Audit Logs**| Yes | Yes | No | No | No | No | No | No |
| **Update Store Global Settings**| Yes | Yes | No | No | No | No | No | No |

---

## 3. Defense-in-Depth Security Controls

### 3.1 Input Validation & Mass Assignment Prevention
- All inbound request payloads are parsed and sanitized using strict **Zod** schemas.
- Extra fields outside the schema are stripped (`strip()` mode) to prevent mass assignment vulnerabilities.
- Prisma ORM prevents SQL injection by utilizing parameterized queries for all operations. Raw SQL queries (`$queryRaw`) are restricted to parameterized template literals only.

### 3.2 Rate Limiting & Abuse Prevention
Implemented via `express-rate-limit` with Redis or in-memory backing:
1. **Public Authentication Endpoints (`/api/v1/auth/login`, `/admin/auth/login`)**:
   - Limit: 5 failed attempts per 15 minutes per IP.
   - Lockout: Account locked for 30 minutes after 10 consecutive failures.
2. **Checkout Order Placement (`/api/v1/checkout/orders`)**:
   - Limit: 10 requests per minute per IP / authenticated user.
3. **Public Catalog Browsing (`/api/v1/products`)**:
   - Limit: 120 requests per minute per IP.
4. **Newsletter Subscription (`/api/v1/marketing/subscribers`)**:
   - Limit: 5 submissions per minute per IP.

### 3.3 HTTP Security Headers (`helmet`)
The Express API applies industry-standard HTTP headers:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 0` (relies on CSP)
- `Content-Security-Policy: default-src 'self'; frame-ancestors 'none';`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 3.4 Cross-Origin Resource Sharing (CORS)
- Allowed origins are strictly whitelist-configured via the `CORS_ALLOWED_ORIGINS` environment variable (e.g. `https://tooostore.com`, `https://admin.tooostore.com`).
- Wildcards (`*`) are strictly forbidden on routes supporting credentials (`credentials: true`).

### 3.5 Media & File Upload Security
- Image uploads to the Media Library (`src/pages/admin/products/MediaLibraryPage.tsx`) must be mediated via pre-signed upload URLs generated by the backend:
  - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.
  - Maximum file size: 5 MB.
  - Image files uploaded to cloud storage are verified using magic-byte headers before being served publicly.

---

## 4. Audit Logging & Sensitive Data Redaction

### 4.1 Immutable Audit Log Engine
Every state-mutating administrative action (`POST`, `PUT`, `PATCH`, `DELETE` under `/api/v1/admin/*`) triggers an automatic audit trail entry:
```typescript
export async function logAdminAction(
  req: Request,
  action: string,
  resource: string,
  details: Record<string, any>
) {
  const actor = (req as any).user;
  await prisma.auditLog.create({
    data: {
      actorId: actor?.id,
      actorName: actor?.name || 'Administrator',
      actorRole: actor?.role || 'STAFF',
      action,
      resource,
      details: JSON.stringify(redactSensitiveFields(details)),
      ipAddress: req.ip || req.headers['x-forwarded-for']?.toString(),
    },
  });
}
```

### 4.2 Logging Redaction Rules
The backend application logger (`pino` / `winston`) redacts the following sensitive keys across all logs:
- `password`, `passwordHash`, `token`, `refreshToken`
- `authorization`, `cookie`, `x-paystack-signature`
- `creditCard`, `cvv`, `accountNumber`
- Plaintext customer street addresses in non-debug logging
