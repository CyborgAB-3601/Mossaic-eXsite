"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductCard from "../components/ProductCard";

// ── PREMIUM SVG ICONS ───────────────────────────────────────────────
const IconDashboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconCart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconOrder = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const IconTracker = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;

export default function IndividualSearchPage() {
  const [searchValue, setSearchValue] = useState("Premium Noise-Cancelling Headphones");
  const [hasSearched, setHasSearched] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [activeTab, setActiveTab] = useState("Search");
  const router = useRouter();

  useEffect(() => {
    // Force light mode on initial load
    setTheme("light");
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setHasSearched(true);
    }
  };

  const sidebarLinks = [
    { label: "Dashboard", Icon: IconDashboard },
    { label: "Search", Icon: IconSearch },
    { label: "Cart", Icon: IconCart },
    { label: "Order", Icon: IconOrder },
    { label: "Tracker", Icon: IconTracker },
  ];

  const results = [
    {
      name: "AcousticPro Elite X1",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
      rating: 4.9,
      features: ["40hr battery life", "Active ANC 2.0"],
      price: 349.00,
      msrp: 399.00,
      badge: "Best Offer",
      retailers: [
        { name: "Amazon", price: 349.00, lowest: true, delivery: "Free Delivery Today" },
        { name: "Flipkart", price: 354.50, delivery: "2-Day Delivery" }
      ],
      summary: "Save $50.00 (12%) compared to market average."
    },
    {
      name: "SonicFlow S5",
      image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
      features: ["35hr battery life", "USB-C Fast Charging"],
      price: 279.99,
      retailers: [
        { name: "Amazon", price: 284.00 },
        { name: "Flipkart", price: 279.99, lowest: true }
      ],
      summary: "Lowest price found on Flipkart."
    }
  ];

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      background: "var(--bg)", 
      color: "var(--text)", 
      overflow: "hidden"
    }}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 250,
        background: theme === "dark" 
          ? "linear-gradient(180deg, #3D1C5C 0%, #180018 100%)" 
          : "linear-gradient(180deg, #FAE5D8 0%, #f2d8cc 100%)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "2.5rem 1.25rem",
        flexShrink: 0,
        zIndex: 50
      }}>
        <div style={{ marginBottom: "3.5rem", paddingLeft: "0.75rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-.04em", color: "var(--text)" }}>
              e<span className="premium-x">X</span>site
            </div>
            <div style={{ fontSize: "0.55rem", opacity: 0.5, fontWeight: 700, letterSpacing: "0.12em", marginTop: "4px", textTransform: "uppercase", color: "var(--text-muted)" }}>
              AI Search Engine
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {sidebarLinks.map(({ label, Icon }) => (
              <li key={label}>
                <button
                  onClick={() => {
                    setActiveTab(label);
                    if (label === "Search") router.push('/search');
                    if (label === "Dashboard") router.push('/');
                    if (label === "Cart") router.push('/cart');
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "0.85rem",
                    background: activeTab === label ? "var(--mauve)" : "transparent",
                    color: activeTab === label ? "#FAE5D8" : "var(--text-muted)",
                    fontWeight: activeTab === label ? 700 : 500,
                    fontSize: "0.9rem",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                >
                  <Icon />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "1rem 0.5rem", borderTop: "1px solid var(--border)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "10px", background: "var(--mauve)", color: "#FAE5D8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 800 }}>A</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--text)" }}>Alex Rivera</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700 }}>PRO</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        position: "relative",
        background: "var(--bg)",
        overflowY: "auto",
        transition: "all 0.4s ease"
      }}>
        {/* Persistent Background Layer */}
        <div className="animated-bg" style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 0,
          pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 10, padding: "2rem 3rem", width: "100%" }}>
          {/* Top Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <form onSubmit={handleSearch} style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
            <div style={{ 
              background: "var(--surface)", 
              borderRadius: "999px", 
              padding: "0.4rem 0.4rem 0.4rem 1.5rem",
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
            }}>
              <span 
                onClick={() => router.push('/bundle')}
                style={{ marginRight: "0.8rem", fontSize: "1.2rem", animation: "pulse 2s infinite", cursor: "pointer" }}
                title="Explore AI-Curated Bundles"
              >✨</span>
              <input 
                type="text" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for products..."
                style={{ flex: 1, background: "transparent", color: "var(--text)", fontSize: "0.95rem", border: "none", outline: "none", marginLeft: "0.75rem" }}
              />
              <button className="btn-primary" style={{ padding: "0.6rem 1.5rem", borderRadius: "999px" }}>Search</button>
            </div>
          </form>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={toggleTheme}
              style={{
                width: 38, height: 38,
                borderRadius: "50%",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem"
              }}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
          </div>
        </div>

        {/* Results Content */}
        {hasSearched && (
          <div style={{ zIndex: 10 }}>
            <div style={{ marginBottom: "2.5rem" }}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text)" }}>Search Results</h1>
              <div style={{ display: "flex", gap: "0.5rem", fontSize: "1rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                <span style={{ color: "var(--mauve)", fontWeight: 700 }}>{results.length} products found</span>
                <span>for "{searchValue}"</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {results.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </div>
        )}

        {!hasSearched && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-muted)" }}>Search for something to see results</h2>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
