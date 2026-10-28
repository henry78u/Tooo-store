# TOOO STORE — Environment, Deployment & Observability Specification

## 1. Environment Variable & Configuration Schema

All configuration values are managed using twelve-factor environment variables validated on server startup via Zod (Node.js) or Pydantic Settings (Python). **Secret values must never be checked into version control or logged in plaintext.**

### 1.1 Node.js Commerce Service Variables (`.env`)

| Variable Name | Type | Example / Format | Required | Description |
|:---|:---:|:---|:---:|:---|
| `NODE_ENV` | String | `production` / `development` | Yes | Runtime environment identifier. |
| `PORT` | Integer | `3000` | Yes | HTTP listening port. |
| `DATABASE_URL` | String | `postgresql://usr:pwd@host:5432/tooo_db?sslmode=require` | Yes | PostgreSQL connection string for Prisma ORM. |
| `DIRECT_URL` | String | `postgresql://usr:pwd@host:5432/tooo_db` | Yes | Direct database connection string for migrations (bypassing PgBouncer). |
| `JWT_ACCESS_SECRET` | String | 64-char hex / base64 string | Yes | Secret key used to sign and verify access JWTs. |
| `JWT_REFRESH_SECRET` | String | 64-char hex / base64 string | Yes | Secret key used to sign and verify refresh JWTs. |
| `PAYSTACK_SECRET_KEY` | String | `sk_live_...` / `sk_test_...` | Yes | Paystack API authorization secret key. |
| `PAYSTACK_PUBLIC_KEY` | String | `pk_live_...` / `pk_test_...` | Yes | Paystack client-side public initialization key. |
| `FLUTTERWAVE_SECRET_KEY`| String | `FLWSECK_...` | No | Secondary card gateway secret key. |
| `FLUTTERWAVE_HASH` | String | Secret string | No | Verification secret hash for Flutterwave webhooks. |
| `CORS_ALLOWED_ORIGINS` | String | `https://tooostore.com,https://admin.tooostore.com` | Yes | Comma-separated list of permitted browser origins. |
| `AI_SERVICE_URL` | String | `http://ai-service:8000` / `https://ai.tooostore.internal` | Yes | Internal URL for the Python AI engineering microservice. |
| `AI_SERVICE_SECRET` | String | 32-char hex string | Yes | Shared secret for internal service-to-service authentication. |
| `STORAGE_BUCKET_NAME` | String | `tooo-store-media-prod` | Yes | Cloud Storage / S3 bucket for product imagery. |

### 1.2 Python AI Service Variables (`.env`)

| Variable Name | Type | Example / Format | Required | Description |
|:---|:---:|:---|:---:|:---|
| `PYTHON_ENV` | String | `production` / `development` | Yes | Python execution environment. |
| `PORT` | Integer | `8000` | Yes | FastAPI HTTP port. |
| `DATABASE_READONLY_URL`| String | `postgresql://ai_ro:pwd@host:5432/tooo_db` | Yes | Read-only connection string for catalog vector retrieval. |
| `GEMINI_API_KEY` | String | `AIzaSy...` | Yes | Google Gemini API key for embedding and model inference. |
| `EMBEDDING_MODEL` | String | `text-embedding-004` | Yes | Name of embedding model used for pgvector indexing. |
| `LLM_MODEL_NAME` | String | `gemini-2.5-flash` | Yes | LLM used for styling agent reasoning and query expansion. |
| `SERVICE_SHARED_SECRET`| String | 32-char hex string | Yes | Must match `AI_SERVICE_SECRET` in Commerce service. |

---

## 2. Containerization & Deployment Architecture

To maintain simplicity, high reliability, and cost-efficiency without unnecessary Kubernetes or Kafka overhead, the architecture uses lightweight OCI containers deployed to **Google Cloud Run** (or AWS ECS / Railway).

```
                            [Internet Ingress]
                                    │
                                    ▼
                         [Cloud Run HTTPS Load Balancer]
                                    │
                 ┌──────────────────┴──────────────────┐
                 │                                     │
                 ▼                                     ▼
      ┌──────────────────────┐              ┌──────────────────────┐
      │ Node Commerce API    │              │ Python AI Service    │
      │ (Docker, Port 3000)  │──(Internal)─►│ (Docker, Port 8000)  │
      └──────────┬───────────┘              └──────────┬───────────┘
                 │                                     │
                 │ (Read / Write)                      │ (Read-Only)
                 ▼                                     ▼
        ┌─────────────────────────────────────────────────────┐
        │       PostgreSQL 16 (Cloud SQL / Neon / Supabase)   │
        │               with pgvector Extension               │
        └─────────────────────────────────────────────────────┘
```

### 2.1 Node.js Commerce Service `Dockerfile`
```dockerfile
# Multi-stage build for minimal production footprint
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### 2.2 Python AI Service `Dockerfile`
```dockerfile
FROM python:3.11-slim AS runner
WORKDIR /app
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
RUN apt-get update && apt-get install -y --no-install-recommends curl libpq-dev gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

---

## 3. Observability, Health Checks & Telemetry

### 3.1 Health & Readiness Endpoints
Both microservices implement standardized probe endpoints:
- `GET /healthz` (Liveness Probe): Returns `HTTP 200 OK` `{ "status": "UP" }` if the process is running.
- `GET /readyz` (Readiness Probe): Verifies that database connections, Redis caches, and external model APIs are reachable. Returns `HTTP 200 OK` or `HTTP 503 Service Unavailable`.

### 3.2 Distributed Tracing & Request Correlation
- Every incoming request is tagged with an `x-request-id` (generated via UUIDv4 or propagated from the Cloud Run header).
- In internal service-to-service calls (`Commerce API` $\rightarrow$ `AI Service`), `x-request-id` is forwarded in HTTP headers to correlate logs across services in Cloud Logging.

### 3.3 Structured JSON Logging
Logs are emitted to `stdout` in newline-delimited JSON format:
```json
{
  "timestamp": "2026-10-28T12:00:00.124Z",
  "level": "info",
  "service": "tooo-commerce",
  "requestId": "req_84920481",
  "method": "POST",
  "path": "/api/v1/checkout/orders",
  "statusCode": 201,
  "durationMs": 142,
  "actorId": "cust_9921",
  "orderReference": "TOOO-84920"
}
```

---

## 4. Privacy, Compliance & Data Governance

1. **Nigeria Data Protection Act (NDPA) & GDPR Compliance**:
   - Customer phone numbers, physical delivery addresses, and emails are stored in encrypted form at rest (AES-256 Cloud SQL storage).
   - Order history and customer accounts support full Data Subject Access Requests (DSAR) via `GET /api/v1/customer/export-data` and Right to Be Forgotten via anonymization (`Customer.status = 'INACTIVE'`, name set to `Deleted Customer`, address redacted).
2. **Payment Card Industry (PCI-DSS) Exemption**:
   - TOOO STORE operates under **PCI-DSS SAQ A**.
   - No primary account numbers (PAN), CVVs, or cardholder credentials touch TOOO STORE application servers. All card entry occurs within Paystack/Flutterwave PCI-compliant hosted iframes or redirect pages.
