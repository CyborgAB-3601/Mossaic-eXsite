import os
from app.core.config import SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY, EMBEDDING_MODEL, GEMINI_MODEL

# ── Supabase (lightweight, always loads) ────────────────────────
from supabase import create_client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── Gemini (lightweight, always loads) ──────────────────────────
import google.generativeai as genai
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(GEMINI_MODEL)

# ── SentenceTransformer (Eager Load on Startup) ───────────────
print("[eXsite] Loading SentenceTransformer model on server startup...", flush=True)

from sentence_transformers import SentenceTransformer
try:
    embedding_model = SentenceTransformer(EMBEDDING_MODEL)
    print(f"[eXsite] Model '{EMBEDDING_MODEL}' loaded successfully!", flush=True)
except Exception as e:
    print(f"[eXsite] ERROR loading model: {e}", flush=True)
    raise
