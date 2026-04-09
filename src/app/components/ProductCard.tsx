"use client";

import Image from "next/image";

interface Retailer {
  name: string;
  price: number;
  lowest?: boolean;
  delivery?: string;
  logo?: string;
}

interface ProductCardProps {
  name: string;
  image: string;
  rating: number;
  features: string[];
  price: number;
  msrp?: number;
  retailers: Retailer[];
  badge?: string;
  summary?: string;
}

export default function ProductCard({
  name,
  image,
  rating,
  features,
  price,
  msrp,
  retailers,
  badge,
  summary
}: ProductCardProps) {
  return (
    <div className="glass-card anim-fadeup" style={{ 
      padding: "1.5rem", 
      marginBottom: "1.5rem",
      position: "relative",
      display: "flex",
      gap: "2rem",
      alignItems: "stretch"
    }}>
      {badge && (
        <div style={{
          position: "absolute",
          top: "-12px",
          left: "24px",
          background: "var(--navy)",
          color: "#fff",
          padding: "4px 12px",
          borderRadius: "6px",
          fontSize: "0.65rem",
          fontWeight: 800,
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 10
        }}>
          <span>👑</span> {badge.toUpperCase()}
        </div>
      )}

      {/* Product Image */}
      <div style={{ 
        width: "240px", 
        height: "240px", 
        background: "rgba(255,255,255,0.03)", 
        borderRadius: "1rem",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0
      }}>
        <img 
          src={image} 
          alt={name} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>{name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <span style={{ color: "#FFB800", display: "flex", alignItems: "center", gap: "4px" }}>
                ★ {rating}
              </span>
              <span>•</span>
              {features.map((feat, i) => (
                <span key={i}>
                  {feat}
                  {i < features.length - 1 && " • "}
                </span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.85rem", fontWeight: 900, color: "var(--text)" }}>${price.toLocaleString()}</div>
            {msrp && (
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                MSRP ${msrp.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Retailers */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          {retailers.map((retailer, index) => (
            <div 
              key={index} 
              style={{ 
                flex: 1, 
                background: "var(--surface-alt)", 
                padding: "1rem", 
                borderRadius: "1rem",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                position: "relative"
              }}
            >
              <div style={{ 
                width: "40px", 
                height: "40px", 
                background: "rgba(255,255,255,0.05)", 
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6rem",
                fontWeight: 900,
                color: "var(--text-muted)"
              }}>
                {retailer.name.substring(0, 3).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text)" }}>{retailer.name}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{retailer.delivery || "Standard Delivery"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>${retailer.price.toLocaleString()}</div>
                {retailer.lowest && (
                  <div style={{ fontSize: "0.55rem", fontWeight: 900, color: "#00C853", textTransform: "uppercase" }}>Lowest</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
              {summary?.includes("Savings") ? "TOTAL SAVINGS" : "BEST VALUE SUMMARY"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text)", fontWeight: 500 }}>
              {summary || `Save $${(msrp ? msrp - price : 0).toLocaleString()} compared to market average.`}
            </div>
          </div>
          <button className="btn-primary" style={{ 
            padding: "0.75rem 1.5rem", 
            background: "var(--navy)", 
            color: "#fff",
            fontWeight: 800,
            border: "none",
            borderRadius: "10px",
            fontSize: "0.85rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}>
            Buy with AI Agent
          </button>
        </div>
      </div>
    </div>
  );
}
