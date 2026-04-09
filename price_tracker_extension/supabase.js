const SUPABASE_URL = "https://xzrutoixnjnbrcpdwhgw.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cnV0b2l4bmpuYnJjcGR3aGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTAyMTYsImV4cCI6MjA5MTI4NjIxNn0.k9zmw6Rq9NMC8uul3nG_fx8Aq6AG_BEDdR2cLdRlbfo"

async function storeProduct(data) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/extension_price_data`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error("Supabase Error:", response.status, errText)
            return { error: `[Status ${response.status}] ${errText}` };
        }

        console.log("Stored in Supabase:", data)
        return { error: null };
    } catch (err) {
        console.error("Fetch failed:", err)
        return { error: err.message };
    }
}