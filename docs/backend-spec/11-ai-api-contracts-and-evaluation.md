# TOOO STORE — AI API Contracts & Evaluation Criteria

## 1. Global AI Service Conventions

- **Base URL Prefix**: `/ai/v1`
- **Content-Type**: `application/json; charset=utf-8` (or `text/event-stream` for agent streaming)
- **Service-to-Service Authentication**: Internal shared HMAC secret or mTLS when called via Commerce backend; customer JWT passed through for user-specific interactions.
- **Contract Boundary**: AI endpoints are strictly decoupled from the Commerce API (`/api/v1/*`).

---

## 2. AI Endpoint Contracts

### 2.1 Natural Language Semantic Search (`POST /ai/v1/search`)

- **Method & Path**: `POST /ai/v1/search`
- **Purpose**: Semantic catalog search mapping natural language queries to products using hybrid retrieval.
- **Authentication**: Optional Bearer JWT (Anonymous guests permitted).
- **Rate Limit**: 60 requests/minute per IP.
- **Timeout**: Hard timeout at 1,500ms; falls back to lexical trigram search at 1,000ms.
- **Milestone Status**: [PHASE 1 AI MILESTONE — Backs `SearchOverlay.tsx`].

#### Request Schema (Pydantic / JSON)
```json
{
  "query": "heavyweight boxy tee for layering",
  "filters": {
    "category": "Tops",
    "minPrice": 20000,
    "maxPrice": 50000,
    "inStockOnly": true
  },
  "limit": 8
}
```

#### TypeScript / Pydantic Interface
```python
from pydantic import BaseModel, Field
from typing import Optional, List

class SearchFilters(BaseModel):
    category: Optional[str] = None
    collection: Optional[str] = None
    minPrice: Optional[int] = Field(None, ge=0)
    maxPrice: Optional[int] = Field(None, ge=0)
    inStockOnly: bool = True

class AISearchRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=200)
    filters: Optional[SearchFilters] = None
    limit: int = Field(8, ge=1, le=24)
```

#### Response Schema
```json
{
  "success": true,
  "data": {
    "query": "heavyweight boxy tee for layering",
    "retrievalMethod": "HYBRID_RRF",
    "products": [
      {
        "id": "prod-09",
        "slug": "300-gsm-heavyweight-box-tee",
        "name": "300 GSM Heavyweight Box Tee",
        "price": 24000,
        "category": "Tops",
        "collection": "Everyday Essentials",
        "image": "/src/assets/images/editorial_story_campaign_1793045648712.jpg",
        "relevanceScore": 0.94,
        "matchHighlights": [
          "Crafted from 300 GSM combed cotton with an architectural boxy drop shoulder silhouette."
        ],
        "availableColours": [
          { "name": "Vintage Black", "hex": "#171717" },
          { "name": "Natural Chalk", "hex": "#F6F3ED" }
        ],
        "availableSizes": ["S", "M", "L", "XL"]
      }
    ]
  },
  "meta": {
    "latencyMs": 142,
    "totalMatches": 4
  }
}
```

---

### 2.2 Style & Capsule Recommendations (`POST /ai/v1/recommendations`)

- **Method & Path**: `POST /ai/v1/recommendations`
- **Purpose**: Compute contextual product recommendations based on silhouette co-occurrence and style harmony.
- **Authentication**: Optional Bearer JWT.
- **Rate Limit**: 120 requests/minute per IP.
- **Timeout**: 600ms.
- **Milestone Status**: [PHASE 1 AI MILESTONE — Powers "Complete the Look" on `ProductDetailsPage.tsx`].

#### Request Schema
```json
{
  "targetProductId": "prod-01",
  "strategy": "COMPLETE_THE_LOOK",
  "limit": 4
}
```

#### Response Schema
```json
{
  "success": true,
  "data": {
    "strategy": "COMPLETE_THE_LOOK",
    "recommendations": [
      {
        "id": "prod-04",
        "slug": "wide-leg-pleated-trouser",
        "name": "Wide-Leg Pleated Trouser",
        "price": 68000,
        "category": "Bottoms",
        "image": "/src/assets/images/category_sets_tailored_1793045650324.jpg",
        "stylingRationale": "Pairs fluid drape with the structural dropped shoulder of the overcoat."
      },
      {
        "id": "prod-09",
        "slug": "300-gsm-heavyweight-box-tee",
        "name": "300 GSM Heavyweight Box Tee",
        "price": 24000,
        "category": "Tops",
        "image": "/src/assets/images/editorial_story_campaign_1793045648712.jpg",
        "stylingRationale": "Provides a clean, architectural neckline under tailored outerwear."
      }
    ]
  }
}
```

---

### 2.3 Interactive Styling Consultation Agent (`POST /ai/v1/chat/agent`)

- **Method & Path**: `POST /ai/v1/chat/agent`
- **Protocol**: HTTP POST supporting standard JSON or Server-Sent Events (`Accept: text/event-stream`).
- **Purpose**: Conversational fashion concierge capable of answering garment care questions, sizing recommendations, and assembling capsule bags.
- **Authentication**: Optional Bearer JWT (allows guests to chat; captures user profile if logged in).
- **Rate Limit**: 20 turns per minute per user/IP.
- **Timeout**: 5,000ms streaming timeout.
- **Milestone Status**: [PHASE 2 PORTFOLIO MILESTONE — Concierge Drawer].

#### Request Schema
```json
{
  "conversationId": "conv_99281203",
  "message": "I'm 6'1 and want an oversized look for the wool overcoat. What size should I choose, and is Oatmeal Beige in stock?",
  "currentContext": {
    "activePage": "/product/architectural-wool-overcoat",
    "activeProductId": "prod-01"
  }
}
```

#### Streamed Response Chunks (SSE)
```
event: thinking
data: {"action": "check_variant_stock", "parameters": {"product_slug": "architectural-wool-overcoat", "size": "L", "colour": "Oatmeal Beige"}}

event: tool_result
data: {"availableStock": 8, "sku": "TOOO-PROD-01-L-OAT"}

event: token
data: {"content": "For a 6'1 frame seeking a relaxed, sculptural silhouette, our **Size L** provides the intended dropped-shoulder ease. "}

event: token
data: {"content": "We currently have **8 units** of the Oatmeal Beige in Size L available at our Lagos atelier."}

event: suggestion
data: {"actions": [{"type": "VIEW_PRODUCT", "slug": "architectural-wool-overcoat", "label": "Select Size L"}]}
```

---

## 3. Automated AI Evaluation Protocol

To ensure consistent quality, the evaluation script (`eval/run_evaluation.py`) executes against a versioned test dataset of 200 real fashion queries before any model or prompt promotion.

### 3.1 Evaluation Datasets (`eval/dataset_v1.json`)
Consists of:
1. **Search Relevance Test**: 75 queries with labeled ground-truth product IDs and graded relevance (0-3).
2. **Factuality & Grounding Test**: 50 customer questions with verified fabric compositions, GSM weights, and care instructions.
3. **Tool Calling & Schema Test**: 50 complex multi-turn dialogs verifying tool selection and argument extraction.
4. **Adversarial / Red Team Test**: 25 prompt injection and system jailbreak prompts.

### 3.2 Automated CI Gate Criteria
```bash
python -m eval.run_evaluation \
  --dataset eval/dataset_v1.json \
  --min-ndcg 0.82 \
  --max-hallucination 0.005 \
  --min-tool-accuracy 0.98
```
If any metric drops below the defined threshold, the CI pipeline halts and fails the build.
