# TOOO STORE — Backend Requirements Specification & AI Engineering Architecture

## 1. Executive Summary & Purpose

This documentation suite defines the complete, production-grade target backend architecture for **TOOO STORE** (wordmark: **TOOO.**), a contemporary, high-contrast minimalist luxury fashion brand and e-commerce platform.

The TOOO STORE frontend and administrative console have been designed and implemented in React 19, TypeScript, Tailwind CSS, and Zustand. All customer storefront views (homepage, catalog, product details, cart, checkout, order tracking, customer account, wishlist) and operational admin views (analytics, catalog management, inventory movements, order fulfillment, returns, refunds, customer reviews, discount marketing, homepage CMS, shipping zones, support messages, staff permissions, and audit logs) are functional in client-side demonstration mode.

The purpose of this specification is to provide an authoritative, implementation-ready architectural blueprint for a coding agent (such as Codex in VS Code or an enterprise engineering team) to construct the production backend services without modifying existing customer-facing design, breaking working interactions, or introducing security vulnerabilities.

---

## 2. Core Architectural Principles & Boundaries

1. **Dual-Service Target Topology**:
   - **Commerce Backend (Node.js / Express / TypeScript / PostgreSQL / Prisma ORM)**: Authoritative system of record for all products, variants, SKUs, inventory levels, order records, customer accounts, financial transactions, discounts, shipping rules, and admin permissions.
   - **AI Engineering Service (Python 3.11+ / FastAPI / Pydantic / PostgreSQL / pgvector)**: Independent, stateless intelligence service providing semantic search, personalized style recommendations, grounded catalog assistance, and agentic styling consultations.

2. **Strict Authority Boundary**:
   - PostgreSQL via the Node.js Commerce API is the **sole authoritative writer** for business-critical entities.
   - The Python AI service has **read-only access** (or replicated embedding index access) to public catalog metadata.
   - **The AI service must never directly modify commerce tables, mutate inventory levels, authorize payments, or mark orders as paid.**
   - Any consequential operation proposed by an AI agent (e.g., preparing a bag, reserving items) must be submitted to the Commerce API and validated against ordinary business rules, stock availability, and authentication tokens.

3. **Financial Precision & Decimal Storage**:
   - All prices and monetary amounts are denominated in Nigerian Naira (NGN, `₦`).
   - Monies must **never** be stored as floating-point numbers. In PostgreSQL, amounts are stored as integer minor units (kobo, $1 \text{ NGN} = 100 \text{ kobo}$) or `DECIMAL(12, 2)` / `NUMERIC(12, 2)`.

4. **Zero Frontend Regressions**:
   - The existing React application, design tokens (`#171717`, `#F6F3ED`, `#D8D0C5`, `#8A4735`), component hierarchy, and user flows must be preserved.
   - Transition from Zustand local storage persistence to REST API endpoints must occur via unified service adapters (`commerceService.ts`, `orderService.ts`, and dedicated query hooks) with graceful offline/fallback handling.

---

## 3. Specification Index

The backend specification is structured into the following 16 detailed documents and OpenAPI definitions located in `docs/backend-spec/`:

| Index | Document File | Subject / Domain |
|:---:|:---|:---|
| **01** | [`01-current-architecture.md`](./01-current-architecture.md) | As-Is codebase audit: frontend framework, Zustand stores, state persistence, mock data, and architectural delta. |
| **02** | [`02-feature-and-data-inventory.md`](./02-feature-and-data-inventory.md) | Exhaustive matrix of all storefront and admin features, frontend routes, backing code evidence, and backend requirements. |
| **03** | [`03-commerce-api-endpoint-catalog.md`](./03-commerce-api-endpoint-catalog.md) | Catalog of all RESTful `/api/v1` commerce endpoints across auth, catalog, inventory, cart, orders, finance, and CMS. |
| **04** | [`04-commerce-api-contracts.md`](./04-commerce-api-contracts.md) | Strict TypeScript interfaces, JSON request/response payloads, validation rules, HTTP status codes, and error envelopes. |
| **05** | [`05-postgresql-prisma-data-model.md`](./05-postgresql-prisma-data-model.md) | Production PostgreSQL schema with Prisma ORM definitions, relations, constraints, indexes, migrations, and concurrency safeguards. |
| **06** | [`06-business-rules-and-state-machines.md`](./06-business-rules-and-state-machines.md) | Explicit lifecycle state machines for orders, payments, refunds, returns, inventory reservations, and audit logging. |
| **07** | [`07-authentication-authorization-and-security.md`](./07-authentication-authorization-and-security.md) | JWT + HttpOnly cookie session lifecycle, RBAC matrix, bcrypt hashing, rate limiting, CORS, and security controls. |
| **08** | [`08-payments-webhooks-and-idempotency.md`](./08-payments-webhooks-and-idempotency.md) | Paystack & Flutterwave integration specs, HMAC-SHA512 webhook signature verification, replay protection, and idempotency. |
| **09** | [`09-frontend-to-api-integration-map.md`](./09-frontend-to-api-integration-map.md) | Component-by-component migration plan from Zustand `localStorage` to server-backed REST API endpoints. |
| **10** | [`10-python-ai-service-architecture.md`](./10-python-ai-service-architecture.md) | FastAPI microservice architecture, embedding pipelines, pgvector similarity search, and model provider isolation. |
| **11** | [`11-ai-api-contracts-and-evaluation.md`](./11-ai-api-contracts-and-evaluation.md) | AI endpoint schemas (`/ai/v1/search`, `/recommendations`, `/chat/agent`), tool definitions, and quantitative evaluation criteria. |
| **12** | [`12-environment-deployment-and-observability.md`](./12-environment-deployment-and-observability.md) | Configuration schemas, environment variables, Dockerfiles, Cloud Run / Container deployment, health checks, and tracing. |
| **13** | [`13-testing-and-acceptance-criteria.md`](./13-testing-and-acceptance-criteria.md) | Rigorous testing pyramid: unit tests, database concurrency tests (anti-overselling), webhook replays, and prompt injection suites. |
| **14** | [`14-codex-implementation-plan.md`](./14-codex-implementation-plan.md) | Step-by-step 8-phase implementation roadmap for Codex (Phases A through H) with prerequisites, risk mitigations, and checkpoints. |
| **15** | [`openapi-commerce.yaml`](./openapi-commerce.yaml) | Valid OpenAPI 3.1 specification for the Node.js / Express Commerce API (`/api/v1`). |
| **16** | [`openapi-ai.yaml`](./openapi-ai.yaml) | Valid OpenAPI 3.1 specification for the Python / FastAPI AI Engineering Service (`/ai/v1`). |

---

## 4. Key Architectural Findings & Open Decisions

During inspection of the live repository (`/src/`), several operational patterns and assumptions were identified:

1. **Variant-Centric Inventory**:
   - In `src/types/index.ts` and `src/data/products.ts`, inventory stock belongs strictly to individual variants (`size` $\times$ `colour`), while `product.stock` is a computed sum.
   - The backend Prisma model must reflect this: `ProductVariant` owns `stockOnHand` and `stockAllocated`, while `Product` exposes virtual or denormalized aggregated stock.
2. **Current Authentication Mocking**:
   - The admin console currently relies on client-side state in `useAdminStore.ts` with quick-login role switching (`Adaeze Okoro` - Owner, `Tunde Adeleke` - Store Manager, etc.).
   - The customer storefront in `AccountPage.tsx` allows passwordless email sign-in for demo purposes.
   - **Target**: Production will implement secure Argon2id/bcrypt hashed passwords, refresh-token rotation in `HttpOnly; SameSite=Lax` cookies, and a strict role-based access control (RBAC) middleware.
3. **Open Product Questions (`OPEN QUESTION`)**:
   - *Payment Gateway Priority*: Paystack is referenced in transaction mocks (`Card (Paystack Demo)`), but Bank Transfer via Nigerian Interbank Settlement System (NIP) is also simulated. The backend must support modular payment providers via an adapter pattern.
   - *Inventory Reservation vs Direct Deduction*: Currently, stock is decremented immediately upon checkout submission in `orderService.ts`. In production with hosted checkout/redirect gateways, a 15-minute temporary reservation lock (`stockAllocated`) should be implemented prior to webhook payment confirmation.
