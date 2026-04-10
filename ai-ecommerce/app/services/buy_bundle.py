"""
Buy Bundle Service
Bridges the ai-ecommerce product catalog with the eXsite Playwright checkout bot system.

Flow:
1. Receives bundle products from the frontend
2. Looks up real product_url from the ai-ecommerce Supabase via vector search
3. Inserts products + pending jobs into the eXsite bot Supabase
4. The eXsite worker.js picks up pending jobs and launches Playwright bots
"""

from supabase import create_client
from app.core.config import EXSITE_SUPABASE_URL, EXSITE_SUPABASE_KEY
from app.core.database import supabase as catalog_supabase, embedding_model


def _get_exsite_client():
    """Lazy-create the eXsite Supabase client (bot system database)."""
    if not EXSITE_SUPABASE_URL or not EXSITE_SUPABASE_KEY:
        raise ValueError("EXSITE_SUPABASE_URL and EXSITE_SUPABASE_KEY must be set in .env")
    return create_client(EXSITE_SUPABASE_URL, EXSITE_SUPABASE_KEY)


def _detect_platform(retailer: str) -> str:
    """Detect the platform from the retailer name."""
    r = retailer.lower().strip()
    if "amazon" in r:
        return "amazon"
    elif "flipkart" in r:
        return "flipkart"
    elif "jiomart" in r:
        return "jiomart"
    elif "croma" in r:
        return "croma"
    return "amazon"  # default fallback


import requests

def _lookup_product_url(product_name: str, marketplace: str = "") -> str:
    """
    Look up the real product_url from the user's new tracking Supabase.
    As specifically requested, this just grabs ANY url from the extension_price_data table for now.
    """
    try:
        SUPABASE_URL = "https://xzrutoixnjnbrcpdwhgw.supabase.co"
        SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cnV0b2l4bmpuYnJjcGR3aGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTAyMTYsImV4cCI6MjA5MTI4NjIxNn0.k9zmw6Rq9NMC8uul3nG_fx8Aq6AG_BEDdR2cLdRlbfo"
        
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/extension_price_data?select=product_url&limit=1",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}"
            },
            timeout=5
        )
        
        if response.ok:
            data = response.json()
            if data and len(data) > 0 and "product_url" in data[0]:
                return data[0]["product_url"]
                
        return ""
    except Exception as e:
        print(f"[eXsite] Error looking up product URL from new DB: {e}", flush=True)
        return ""


def process_bundle_purchase(products: list[dict]) -> dict:
    """
    Process a bundle purchase request.

    Args:
        products: List of dicts with: name, price, retailer, image (optional)

    Returns:
        Dict with created_jobs list and any errors
    """
    try:
        exsite = _get_exsite_client()
        print(f"[eXsite] Connected to eXsite Supabase", flush=True)
    except Exception as e:
        print(f"[eXsite] FAILED to connect to eXsite Supabase: {e}", flush=True)
        return {
            "success": False,
            "jobs_created": 0,
            "jobs": [],
            "errors": [{"product": "all", "error": f"Database connection failed: {e}"}],
            "message": f"Database connection failed: {e}",
            "error": f"Database connection failed: {e}"
        }
    
    created_jobs = []
    errors = []

    for product in products:
        name = product.get("name", "Unknown")
        price = product.get("price", 0)
        retailer = product.get("retailer", "Amazon")
        platform = _detect_platform(retailer)

        print(f"[eXsite] Processing: {name} ({platform})", flush=True)

        # Look up the real product URL from catalog
        product_url = _lookup_product_url(name, retailer)
        print(f"[eXsite]   Catalog URL: {product_url or '(not found, using fallback)'}", flush=True)

        if not product_url:
            # Build a search URL as fallback
            if platform == "amazon":
                search_query = name.replace(" ", "+")
                product_url = f"https://www.amazon.in/s?k={search_query}"
            elif platform == "flipkart":
                search_query = name.replace(" ", "%20")
                product_url = f"https://www.flipkart.com/search?q={search_query}"
            else:
                product_url = f"https://www.amazon.in/s?k={name.replace(' ', '+')}"
            print(f"[eXsite]   Fallback URL: {product_url}", flush=True)

        try:
            # Insert product into eXsite products table
            print(f"[eXsite]   Inserting product...", flush=True)
            insert_result = exsite.from_("products").insert({
                "name": name,
                "url": product_url,
                "platform": platform,
                "target_price": int(round(price))
            }).execute()

            product_data = insert_result.data
            print(f"[eXsite]   Insert result: {product_data}", flush=True)
            
            if not product_data or len(product_data) == 0:
                errors.append({"product": name, "error": "Failed to insert product (empty response)"})
                continue

            product_id = product_data[0]["id"]
            print(f"[eXsite]   Product ID: {product_id}", flush=True)

            # Create a pending job for the worker to pick up
            print(f"[eXsite]   Creating job...", flush=True)
            job_result = exsite.from_("jobs").insert({
                "product_id": product_id,
                "status": "pending"
            }).execute()

            job_data = job_result.data
            print(f"[eXsite]   Job result: {job_data}", flush=True)
            
            if job_data and len(job_data) > 0:
                created_jobs.append({
                    "job_id": job_data[0]["id"],
                    "product_id": product_id,
                    "product_name": name,
                    "product_url": product_url,
                    "platform": platform,
                    "status": "pending"
                })
            else:
                errors.append({"product": name, "error": "Failed to create job (empty response)"})

        except Exception as e:
            errors.append({"product": name, "error": str(e)})
            print(f"[eXsite] Error processing bundle product '{name}': {e}", flush=True)
            import traceback
            traceback.print_exc()

    return {
        "success": len(created_jobs) > 0,
        "jobs_created": len(created_jobs),
        "jobs": created_jobs,
        "errors": errors,
        "error": "; ".join(e["error"] for e in errors) if errors and len(created_jobs) == 0 else None,
        "message": f"Queued {len(created_jobs)} products for auto-checkout. "
                   f"Start the worker (node worker/worker.js) to begin purchasing."
                   + (f" Errors: {errors}" if errors else "")
    }


def get_job_status(job_ids: list[str]) -> list[dict]:
    """Check the status of jobs by their IDs."""
    exsite = _get_exsite_client()

    try:
        result = exsite.from_("jobs").select("*").in_("id", job_ids).execute()
        return result.data or []
    except Exception as e:
        print(f"[eXsite] Error checking job status: {e}", flush=True)
        return []
