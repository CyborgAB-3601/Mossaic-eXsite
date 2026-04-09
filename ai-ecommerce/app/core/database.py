from supabase import create_client
import google.generativeai as genai
from app.core.config import SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY, EMBEDDING_MODEL, GEMINI_MODEL

# Supabase: lightweight, loads instantly
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Gemini: lightweight, loads instantly
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(GEMINI_MODEL)

# SentenceTransformer: HEAVY (~400MB). Load lazily so port opens first.
_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        print("Loading SentenceTransformer model (first request)...")
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL)
        print("Model loaded successfully!")
    return _embedding_model

# Keep backward compatibility: create a proxy object
class _LazyEmbeddingModel:
    """Proxy that loads the real model on first use."""
    def encode(self, *args, **kwargs):
        return get_embedding_model().encode(*args, **kwargs)
    def __getattr__(self, name):
        return getattr(get_embedding_model(), name)

embedding_model = _LazyEmbeddingModel()
