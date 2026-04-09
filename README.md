# eXsite — AI-Powered E-Commerce Search Engine

A full-stack AI e-commerce platform with **RAG-based product search**, **Gemini-powered intent parsing**, a premium Next.js frontend, and a **Chrome extension** for real-time cross-marketplace price comparison.

## Architecture

```
eXsite/
├── ai-ecommerce/              ← Backend (FastAPI, Python)
│   ├── app/
│   │   ├── main.py                  # FastAPI app + /api/search + /api/compare
│   │   ├── core/
│   │   │   ├── config.py            # Env vars, categories, model names
│   │   │   └── database.py          # Supabase + Gemini + SentenceTransformer
│   │   └── services/
│   │       ├── intent_parser.py     # Gemini AI: query → product|goal intent
│   │       ├── search.py            # Vector search via Supabase RPC
│   │       └── ranking.py           # Price/rating sorting
│   └── .env                        # SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY
│
├── Mossaic-eXsite/            ← Frontend (Next.js 16, React 19)
│   ├── src/app/
│   │   ├── lib/api.ts               # ⭐ API service: fetch + data mappers
│   │   ├── search/page.tsx          # Search hub: calls API, routes by intent
│   │   ├── individual-search/      # Product results (type: "product")
│   │   ├── bundle/                 # Bundle combos (type: "goal")
│   │   └── components/
│   │       ├── ProductCard.tsx      # Single product with retailer comparison
│   │       └── BundleCard.tsx       # Bundle combo card
│   ├── extension/               # ⭐ Chrome Extension (unified)
│   │   ├── manifest.json            # MV3, background worker, content scripts
│   │   ├── background.js           # Supabase storage + AI compare proxy
│   │   ├── content.js              # Product scraping + auto-store
│   │   ├── popup.html              # Extension UI
│   │   ├── popup.css               # Premium eXsite styling
│   │   └── popup.js                # Orchestrator: scrape → compare → render
│   └── .env.local                  # NEXT_PUBLIC_API_URL
│
└── README.md                  ← This file
```

---

## API Integration Map

### Backend Endpoints

| Endpoint | Method | Consumer | Purpose |
|---|---|---|---|
| `POST /api/search` | POST `{query}` | Website `/search` | Determine intent (product vs goal) |
| `POST /api/search` | POST `{query}` | Website `/individual-search` | Fetch product results |
| `POST /api/search` | POST `{query}` | Website `/bundle` | Fetch bundle/goal results |
| `POST /api/compare` | POST `{product_name, current_marketplace, current_price}` | Chrome Extension | Cross-marketplace price comparison |
| `GET /api/categories` | GET | Website `/search` | Load suggestion categories |
| `GET /api/health` | GET | `lib/api.ts` | Health check |

### Website Search Flow

```
User types query on /search
        │
        ▼
POST /api/search { query }
        │
        ▼
Backend: Gemini AI intent parsing
        │
    ┌───┴───┐
    │       │
 product   goal
    │       │
    ▼       ▼
/individual-search?q=...    /bundle?q=...
    │                        │
    ▼                        ▼
mapProductResults()         mapBundleResults()
    │                        │
    ▼                        ▼
ProductCard components      BundleCard components
```

### Chrome Extension Flow

```
User visits Amazon/Flipkart product page
        │
        ▼
content.js: Scrape product data (robust selectors)
        │
    ┌───┴───┐
    │       │
    ▼       ▼
Auto-store to         User clicks extension icon
Supabase via              │
background.js             ▼
                    popup.js: getProductInfo
                          │
                          ▼
                    Show current product card
                          │
                          ▼
                    background.js: COMPARE_PRODUCT
                          │
                          ▼
                    POST /api/compare (AI Backend)
                          │
                          ▼
                    Vector search for similar products
                    on OTHER marketplaces
                          │
                          ▼
                    popup.js renders:
                    ├── 🏆 Best deal card (clickable URL)
                    ├── 💰 Savings badge
                    └── 📋 Other competitor cards (clickable)
```

---

## Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- Chrome/Edge browser (for extension)
- Supabase project with products table + vector embeddings
- Gemini API key

### 1. Start Backend

```bash
cd ai-ecommerce
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Backend: `http://127.0.0.1:8000`

### 2. Start Frontend

```bash
cd Mossaic-eXsite
npm install
npm run dev
```

Frontend: `http://localhost:3000`

### 3. Load Chrome Extension

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer Mode** (top right)
3. Click **Load unpacked**
4. Select: `Mossaic-eXsite/extension/`
5. Browse any Amazon.in or Flipkart product page
6. Click the eXsite extension icon to see price comparison

### 4. Test It

| Action | URL/Location |
|---|---|
| Product search | `http://localhost:3000/search` → type "best laptop under 50000" |
| Bundle search | `http://localhost:3000/search` → type "home setup under 200000" |
| Extension comparison | Visit any Amazon/Flipkart product page → click extension |
| AI Search from extension | Click "AI Search ⚡" button in extension popup |

---

## Deploying to Vercel

### Frontend (Mossaic-eXsite)
1. Push `Mossaic-eXsite/` to GitHub
2. Connect to Vercel
3. Set `NEXT_PUBLIC_API_URL` = deployed backend URL
4. Deploy

### Backend (ai-ecommerce)
Deploy to Railway/Render/Fly.io/Cloud Run:
1. Ensure CORS allows your Vercel domain
2. Set `SUPABASE_URL`, `SUPABASE_KEY`, `GEMINI_API_KEY`

### Extension (for production)
After backend is deployed, update `background.js`:
- Change `API_BASE` from `http://127.0.0.1:8000` to your deployed URL
- Package and publish to Chrome Web Store

---

## Environment Variables

### Backend (`ai-ecommerce/.env`)
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJ...
GEMINI_API_KEY=AIza...
```

### Frontend (`Mossaic-eXsite/.env.local`)
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Extension (`extension/background.js`)
```
SUPABASE_URL (hardcoded in background.js)
API_BASE = http://127.0.0.1:8000 (change for production)
```
