"use client";

import { useState } from "react";
import Image from "next/image";
import { buyBundle, type BuyBundleResponse } from "../lib/api";

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
  compact?: boolean;
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
  summary,
  compact
}: ProductCardProps) {
  const [buyState, setBuyState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [buyResult, setBuyResult] = useState<BuyBundleResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleBuy = async () => {
    setBuyState("loading");
    setErrorMsg("");

    try {
      // Pick the lowest price retailer or fallback to first
      const bestRetailer = retailers.find(r => r.lowest) || retailers[0];
      
      const payload = [{
        name: name,
        price: bestRetailer.price,
        retailer: bestRetailer.name,
        image: image,
      }];

      const result = await buyBundle(payload);

      if (result.success) {
        setBuyState("success");
        setBuyResult(result);
      } else {
        setBuyState("error");
        // Surface detailed errors
        const errDetails = result.errors?.map((e: {product: string; error: string}) => `${e.product}: ${e.error}`).join("; ");
        setErrorMsg(result.error || errDetails || "Failed to queue checkout jobs");
      }
    } catch (err: unknown) {
      setBuyState("error");
      setErrorMsg(err instanceof Error ? err.message : "Connection failed");
    }
  };

  return (
    <div className="glass-card anim-fadeup" style={{ 
      padding: compact ? "1rem" : "1.5rem", 
      marginBottom: compact ? "1rem" : "1.5rem",
      position: "relative",
      display: "flex",
      gap: compact ? "1.25rem" : "2rem",
      alignItems: "stretch",
      width: "100%"
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
        width: compact ? "160px" : "240px", 
        height: compact ? "160px" : "240px", 
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
            <h3 style={{ fontSize: compact ? "1.1rem" : "1.5rem", fontWeight: 800, color: "var(--text)" }}>{name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span style={{ color: "#FFB800", display: "flex", alignItems: "center", gap: "4px" }}>
                ★ {rating}
              </span>
              <span>•</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {features.map((feat, i) => (
                  <span key={i}>
                    {feat}
                    {i < features.length - 1 && " • "}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: compact ? "1.25rem" : "1.85rem", fontWeight: 900, color: "var(--text)" }}>₹{price.toLocaleString()}</div>
            {msrp && (
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                MSRP ₹{msrp.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Retailers */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: compact ? "1rem" : "1.5rem" }}>
          {retailers.map((retailer, index) => (
            <div 
              key={index} 
              style={{ 
                flex: 1, 
                background: "var(--surface-alt)", 
                padding: compact ? "0.6rem" : "1rem", 
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                position: "relative"
              }}
            >
              {!compact && (
                <div style={{ 
                    width: "32px", 
                    height: "32px", 
                    background: "rgba(255,255,255,0.05)", 
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.5rem",
                    fontWeight: 900,
                    color: "var(--text-muted)",
                    flexShrink: 0
                }}>
                    {retailer.name.substring(0, 3).toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: compact ? "0.7rem" : "0.8rem", fontWeight: 700, color: "var(--text)" }}>{retailer.name}</div>
                {!compact && <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{retailer.delivery || "Standard Delivery"}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: compact ? "0.9rem" : "1.1rem", fontWeight: 800, color: "var(--text)" }}>₹{retailer.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: compact ? "0.75rem" : "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>
              {summary?.includes("Savings") ? "TOTAL SAVINGS" : "BEST VALUE SUMMARY"}
            </div>
            <div style={{ fontSize: compact ? "0.75rem" : "0.85rem", color: "var(--text)", fontWeight: 500 }}>
              {summary || `Save ₹${(msrp ? msrp - price : 0).toLocaleString()} compared to market average.`}
            </div>
          </div>
          <button 
            onClick={handleBuy}
            disabled={buyState === "loading" || buyState === "success"}
            className="btn-primary" 
            style={{ 
            padding: compact ? "0.5rem 1rem" : "0.75rem 1.5rem", 
            background: buyState === "success" 
              ? "linear-gradient(135deg, #00C853 0%, #00E676 100%)" 
              : buyState === "loading"
              ? "linear-gradient(135deg, #6B5CE7 0%, #8B7AE8 100%)"
              : "var(--navy)", 
            color: "#fff",
            fontWeight: 800,
            border: "none",
            borderRadius: "8px",
            fontSize: compact ? "0.75rem" : "0.85rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            cursor: buyState === "loading" || buyState === "success" ? "default" : "pointer",
            opacity: buyState === "loading" ? 0.85 : 1,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            {buyState === "idle" && (compact ? "Order Now" : "Buy with AI Agent")}
            {buyState === "loading" && (
              <>
                <span style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }} />
                Queueing...
              </>
            )}
            {buyState === "success" && "✓ Bot Launched"}
            {buyState === "error" && "⚠ Retry Buy"}
          </button>
        </div>

        {/* Status Area */}
        {buyState === "success" && buyResult && buyResult.jobs.length > 0 && (
          <div style={{
            marginTop: "1rem",
            background: "rgba(0, 200, 83, 0.08)",
            border: "1px solid rgba(0, 200, 83, 0.2)",
            borderRadius: "0.75rem",
            padding: "0.75rem 1rem",
            fontSize: "0.8rem",
            color: "var(--text)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <span style={{ fontWeight: 800, color: "#00C853", marginRight: "0.5rem" }}>
                🤖 Checkout Bot Launched
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {buyResult.jobs[0].product_name.length > 30 
                  ? buyResult.jobs[0].product_name.substring(0, 30) + "..."
                  : buyResult.jobs[0].product_name}
              </span>
            </div>
            <span style={{ 
              fontSize: "0.65rem", 
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "4px",
              background: "rgba(0,200,83,0.15)",
              color: "#00C853"
            }}>
              {buyResult.jobs[0].platform.toUpperCase()} • {buyResult.jobs[0].status}
            </span>
          </div>
        )}

        {buyState === "error" && (
          <div style={{
            marginTop: "1rem",
            background: "rgba(220, 38, 38, 0.08)",
            border: "1px solid rgba(220, 38, 38, 0.2)",
            borderRadius: "0.75rem",
            padding: "0.75rem 1rem",
            fontSize: "0.8rem",
            color: "#DC2626"
          }}>
            {errorMsg}
          </div>
        )}

        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
