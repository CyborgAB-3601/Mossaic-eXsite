"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BundleCard from "../components/BundleCard";

// ── PREMIUM SVG ICONS ───────────────────────────────────────────────
const IconDashboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconCart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconOrder = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const IconTracker = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;

export default function BundlePage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState("Bundle");

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") as "dark" | "light";
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const sidebarLinks = [
    { label: "Dashboard", Icon: IconDashboard },
    { label: "Search", Icon: IconSearch },
    { label: "Cart", Icon: IconCart },
    { label: "Order", Icon: IconOrder },
    { label: "Tracker", Icon: IconTracker },
  ];

  const bundles = [
    {
      title: "Ultimate Workspace Pack",
      discount: "15%",
      isBest: true,
      products: [
        { name: "Samsung 34\" Odyssey Monitor", price: 34999, retailer: "Amazon", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80" },
        { name: "Logitech MX Master Mouse", price: 8495, retailer: "Flipkart", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=300&q=80" }
      ],
      totalPrice: 40899,
      originalTotal: 43494
    },
    {
      title: "Amazon Elite Combo (Amazon Only)",
      discount: "10%",
      products: [
        { name: "Samsung 34\" Odyssey Monitor", price: 36500, retailer: "Amazon", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80" },
        { name: "Logitech MX Master Mouse", price: 9200, retailer: "Amazon", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=300&q=80" }
      ],
      totalPrice: 45700,
      originalTotal: 49200
    },
    {
      title: "Flipkart Pro Station (Flipkart Only)",
      discount: "12%",
      products: [
        { name: "Samsung 34\" Odyssey Monitor", price: 35800, retailer: "Flipkart", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80" },
        { name: "Logitech MX Master Mouse", price: 8495, retailer: "Flipkart", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=300&q=80" }
      ],
      totalPrice: 44295,
      originalTotal: 47990
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
                  onClick={() => setActiveTab(label)}
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

        <div style={{ position: "relative", zIndex: 10, padding: "0.5rem 3rem", width: "100%" }}>
          {/* Top Header */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", alignItems: "center", marginBottom: "0.5rem" }}>
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

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <h1 style={{ fontSize: "2.8rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-.02em" }}>AI-Curated Combo Bundles</h1>
                <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "0.5rem", maxWidth: "600px" }}>
                  NEXACART Intelligence: High-precision peripheral matching for elite efficiency.
                </p>
              </div>
              <div style={{ 
                background: "var(--pill-bg)", 
                padding: "0.6rem 1.25rem", 
                borderRadius: "99px", 
                fontSize: "0.75rem", 
                fontWeight: 800, 
                color: "var(--mauve)",
                border: "1px solid var(--border)"
              }}>
                3 BEST MATCHES FOUND
              </div>
            </div>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
            gap: "2.5rem",
            maxWidth: "1200px" 
          }}>
            {bundles.map((bundle, index) => (
              <BundleCard key={index} {...bundle} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
