# TOOO STORE — Codex Implementation Plan

## 1. Guiding Rules for the Implementing Agent

1. **Inspect Before Modifying**: Never overwrite an existing file without inspecting its live contents first.
2. **Preserve Customer-Facing Experience**: The existing React components, styling tokens, and user interactions must remain intact.
3. **Incremental Verification**: At the end of every phase, execute build and test suites to verify zero regressions before advancing.

---

## 2. Phase-by-Phase Roadmap

### Phase A — Baseline & Foundation
- **Scope**: Establish Express server structure under `/server`, configure PostgreSQL connection, install Prisma ORM, generate initial migrations, and set up Zod validation and Pino logging.
- **Prerequisites**: Access to local PostgreSQL instance or Cloud SQL.
- **Files Likely to Change / Create**:
  - `server/server.ts` (new server entrypoint)
  - `server/config/env.ts` (Zod environment parsing)
  - `prisma/schema.prisma` (from `05-postgresql-prisma-data-model.md`)
  - `package.json` (update `"dev": "tsx server/server.ts"` and scripts)
- **Database Changes**: Initial migration creating foundational tables (`admin_users`, `categories`, `collections`, `products`, `product_variants`).
- **Tests**:
  - `tests/unit/env.test.ts` (validates config parsing)
  - `tests/integration/db_connection.test.ts` (verifies DB ping and migration status)
- **Acceptance Criteria**: `npm run dev` starts Express on port 3000 mounting Vite middleware; database connection verified.
- **Risks**: Port collisions on 3000.
- **Rollback**: Revert `package.json` dev script to `vite`.

---

### Phase B — Authentication & Product Catalog
- **Scope**: Implement customer and admin authentication endpoints, password hashing, JWT generation, public catalog read endpoints (`GET /api/v1/products`, `GET /api/v1/products/:slug`), and admin catalog CRUD. Seed catalog using `src/data/products.ts`.
- **Prerequisites**: Phase A completed.
- **Files Likely to Change / Create**:
  - `server/controllers/authController.ts`
  - `server/controllers/productController.ts`
  - `server/routes/authRoutes.ts`, `productRoutes.ts`
  - `prisma/seed.ts` (migrates `DEMO_PRODUCTS` into PostgreSQL)
  - `src/services/commerceService.ts` (switches from local store to `fetch('/api/v1/products')`)
- **Database Changes**: Seed records for categories, collections, products, and admin users (`adaeze@tooostore.example`).
- **Tests**:
  - `tests/integration/auth.test.ts` (login, invalid password, token refresh)
  - `tests/integration/products.test.ts` (catalog filtering, slug lookup, 404 on missing)
- **Acceptance Criteria**: Storefront `/shop` and `/product/:slug` display live database products. Admin can create a new product that immediately appears on the storefront.
- **Risks**: Disruption of storefront rendering if API is down.
- **Rollback**: Service fallback in `commerceService.ts` to `DEMO_PRODUCTS`.

---

### Phase C — Inventory, Cart & Atomic Orders
- **Scope**: Implement server-side shopping cart, variant stock clamping, atomic order placement transaction with row-level locks, and idempotent order cancellation with inventory replenishment.
- **Prerequisites**: Phase B completed.
- **Files Likely to Change / Create**:
  - `server/controllers/cartController.ts`
  - `server/controllers/orderController.ts`
  - `src/services/orderService.ts` (migrates from Zustand to `POST /api/v1/checkout/orders`)
- **Database Changes**: Migration adding `carts`, `cart_items`, `orders`, `order_items`, `stock_movements`.
- **Tests**:
  - `tests/concurrency.test.ts` (parallel checkouts purchasing last remaining variant)
  - `tests/cancellation.test.ts` (idempotent restock verification)
- **Acceptance Criteria**: Placing an order atomically decrements variant stock in PostgreSQL. Two concurrent requests for 1 remaining unit results in 1 success and 1 clean error.
- **Risks**: Database lock contention during heavy traffic drops.
- **Rollback**: Retain client-side simulation fallback in `orderService.ts` behind feature flag.

---

### Phase D — Payment Rails & Webhook Ingestion
- **Scope**: Implement Paystack checkout integration, HMAC-SHA512 webhook signature verification, replay protection, and refund processing.
- **Prerequisites**: Phase C completed; Paystack test keys configured.
- **Files Likely to Change / Create**:
  - `server/controllers/paymentWebhookController.ts`
  - `server/services/paystackService.ts`
  - `server/middleware/verifyWebhookSignature.ts`
- **Database Changes**: Migration adding `payments`, `payment_events`, `refunds`.
- **Tests**:
  - `tests/webhooks.test.ts` (valid signature, invalid signature rejected, duplicate delivery ignored)
- **Acceptance Criteria**: Customer redirected to Paystack checkout modal; upon test payment completion, order transitions to `CONFIRMED` and customer receives confirmation.
- **Risks**: Webhook delivery delays from third-party gateway.
- **Rollback**: Support manual transfer verification option in admin console.

---

### Phase E — Storefront CMS, Shipping & Support
- **Scope**: Implement dynamic homepage section editor, promotional banner endpoints, shipping rate calculators, and customer contact message threads.
- **Prerequisites**: Phase D completed.
- **Files Likely to Change / Create**:
  - `server/controllers/cmsController.ts`
  - `server/controllers/shippingController.ts`
  - `src/pages/HomePage.tsx` (connect to `GET /api/v1/storefront/homepage`)
  - `src/pages/admin/storefront/HomepageEditorPage.tsx`
- **Database Changes**: Migration adding `homepage_sections`, `promo_banners`, `shipping_zones`, `support_messages`.
- **Tests**:
  - `tests/integration/cms.test.ts` (updating hero headline reflects immediately on storefront)
- **Acceptance Criteria**: Admin edits hero headline or toggles section off; homepage reflects changes in real-time.

---

### Phase F — Python AI Service & Semantic Search
- **Scope**: Initialize FastAPI service container, set up pgvector on PostgreSQL, build embedding indexing script, implement `/ai/v1/search` and hybrid Reciprocal Rank Fusion.
- **Prerequisites**: PostgreSQL with `pgvector` enabled.
- **Files Likely to Create**:
  - `ai-service/app/main.py`
  - `ai-service/app/api/v1/search.py`
  - `ai-service/app/engine/embeddings.py`
  - `src/components/commerce/SearchOverlay.tsx` (connect to `/ai/v1/search`)
- **Database Changes**: `CREATE EXTENSION IF NOT EXISTS vector;` and embedding column on `products`.
- **Tests**:
  - `ai-service/tests/test_search.py` (semantic query returns expected silhouettes)
- **Acceptance Criteria**: Searching *"heavyweight boxy tee"* in `SearchOverlay.tsx` returns `300 GSM Heavyweight Box Tee` with high relevance score.

---

### Phase G — Styling Concierge Agent & Evaluation
- **Scope**: Implement conversational styling agent with strictly typed tools (`search_catalog`, `check_variant_stock`), streaming SSE response, prompt injection guardrails, and evaluation suite.
- **Prerequisites**: Phase F completed; Gemini API key configured.
- **Files Likely to Create**:
  - `ai-service/app/api/v1/agent.py`
  - `ai-service/app/engine/tools.py`
  - `ai-service/eval/run_evaluation.py`
  - `ai-service/eval/dataset_v1.json`
- **Tests**:
  - `ai-service/tests/test_prompt_injection.py` (verifies zero privilege escalation)
  - Execution of `run_evaluation.py` verifying NDCG $\ge 0.82$.
- **Acceptance Criteria**: Agent accurately answers garment questions and checks size stock without hallucinations.

---

### Phase H — Production Hardening & CI/CD
- **Scope**: Finalize Dockerfiles, set up GitHub Actions CI workflow, configure automated migrations on deployment, run security vulnerability scans (`npm audit`, `pip-audit`), and verify health probes.
- **Prerequisites**: All preceding phases completed.
- **Files Likely to Create**:
  - `.github/workflows/ci.yml`
  - `Dockerfile.commerce`, `Dockerfile.ai`
  - `scripts/deploy.sh`
- **Tests**: Full end-to-end regression run across customer and admin workflows.
- **Acceptance Criteria**: 100% test pass rate, clean TypeScript compilation, zero High/Critical security vulnerabilities.
