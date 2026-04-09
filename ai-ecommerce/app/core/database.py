from supabase import create_client
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from app.core.config import SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY, EMBEDDING_MODEL, GEMINI_MODEL

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

embedding_model = SentenceTransformer(EMBEDDING_MODEL)

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(GEMINI_MODEL)
