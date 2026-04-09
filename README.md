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

## Deploying to Production (Vercel & Render)

This project has two parts: a Next.js frontend and a FastAPI backend with heavy machine learning libraries (`torch`, `sentence-transformers`).

### 1. Frontend (Deploy to Vercel)
The Next.js frontend is fully Vercel-ready.
1. Push this entire repository (`Mossaic-eXsite` and `ai-ecommerce`) to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. **CRITICAL**: In the "Root Directory" settings, click Edit and select `Mossaic-eXsite`.
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = (leave blank for now, you will update this after deploying the backend)
6. Click **Deploy**. for deploying

### 2. Backend (Deploy to Render / Railway)
*Note: Vercel serverless functions have a 250MB size limit. The `torch` library required by `sentence-transformers` is ~800MB, so it **will fail** if you try to deploy the backend to Vercel's standard serverless environment. Render or Railway are the standard workarounds.*

**Deploying on Render:**
1. Go to [Render.com](https://render.com/) and click **New Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory**: `ai-ecommerce`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment Variables**, add:
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_KEY` = your Supabase Key
   - `GEMINI_API_KEY` = your Google Gemini API Key
5. Click **Create Web Service**.

### 3. Link them up
1. Once Render finishes deploying the backend, copy its URL (e.g., `https://ai-ecommerce-xyz.onrender.com`).
2. Go back to your Vercel project settings for the frontend.
3. Go to **Settings > Environment Variables**, and set:
   - `NEXT_PUBLIC_API_URL` = `https://ai-ecommerce-xyz.onrender.com`
4. Go to **Deployments** in Vercel and click **Redeploy** so it picks up the new URL.

### 4. Extension (for production)
After the backend is deployed on Render, update `extension/background.js`:
- Change `API_BASE` from `http://127.0.0.1:8000` to your Render backend URL.
- Package the extension folder and load/publish.

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
