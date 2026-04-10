"use client";

import { useState } from "react";
import { buyBundle, type BuyBundleResponse } from "../lib/api";

interface Product {
  name: string;
  price: number;
  retailer: string;
  image: string;
}

interface BundleCardProps {
  title: string;
  discount: string;
  products: Product[];
  totalPrice: number;
  originalTotal: number;
  isBest?: boolean;
}

export default function BundleCard({
  title,
  discount,
  products,
  totalPrice,
  originalTotal,
  isBest
}: BundleCardProps) {
  const [buyState, setBuyState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [buyResult, setBuyResult] = useState<BuyBundleResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleBuyBundle = async () => {
    setBuyState("loading");
    setErrorMsg("");

    try {
      const payload = products.map(p => ({
        name: p.name,
        price: p.price,
        retailer: p.retailer,
        image: p.image,
      }));

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
    <div 
      className={`glass-card anim-fadeup ${isBest ? 'best-bundle-glow' : ''}`}
      style={{ 
        padding: "2rem", 
        display: "flex", 
        flexDirection: "column",
        gap: "1.5rem",
        position: "relative",
        height: "100%",
        border: isBest ? "2px solid #FFD700" : "1px solid var(--border)",
        background: "var(--surface)",
        boxShadow: isBest ? "0 0 30px rgba(255, 215, 0, 0.15)" : "var(--card-shadow)"
      }}
    >
      {/* Save Tag */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        background: "rgba(0, 200, 83, 0.1)",
        color: "#00C853",
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "0.7rem",
        fontWeight: 800,
        textAlign: "center"
      }}>
        SAVE<br />{discount}
      </div>

      <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", maxWidth: "80%" }}>{title}</h3>

      {/* Product Miniatures */}
      <div style={{ display: "flex", gap: "1rem" }}>
        {products.map((p, i) => (
          <div key={i} style={{ 
            width: "100px", 
            height: "100px", 
            background: "rgba(255,255,255,0.03)", 
            borderRadius: "0.75rem",
            overflow: "hidden",
            border: "1px solid var(--border)"
          }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        ))}
      </div>

      {/* Product Details List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {products.map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>{p.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)" }}>₹{p.price.toLocaleString()}</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{p.retailer}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
          BUNDLE TOTAL
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--text)" }}>₹{totalPrice.toLocaleString()}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textDecoration: "line-through", marginBottom: "5px" }}>
            ₹{originalTotal.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Buy Bundle Button */}
      <button
        onClick={handleBuyBundle}
        disabled={buyState === "loading" || buyState === "success"}
        className="btn-primary"
        style={{ 
          width: "100%", 
          justifyContent: "center",
          padding: "1rem",
          marginTop: "1rem",
          background: buyState === "success" 
            ? "linear-gradient(135deg, #00C853 0%, #00E676 100%)" 
            : buyState === "loading"
            ? "linear-gradient(135deg, #6B5CE7 0%, #8B7AE8 100%)"
            : "var(--navy)",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: 800,
          fontSize: "1rem",
          border: "none",
          cursor: buyState === "loading" || buyState === "success" ? "default" : "pointer",
          opacity: buyState === "loading" ? 0.85 : 1,
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        {buyState === "idle" && "Buy Bundle →"}
        {buyState === "loading" && (
          <>
            <span style={{
              display: "inline-block",
              width: 16,
              height: 16,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }} />
            Queueing Checkout...
          </>
        )}
        {buyState === "success" && "✓ Checkout Bots Launched"}
        {buyState === "error" && "⚠ Retry Buy Bundle"}
      </button>

      {/* Success Status */}
      {buyState === "success" && buyResult && (
        <div style={{
          background: "rgba(0, 200, 83, 0.08)",
          border: "1px solid rgba(0, 200, 83, 0.2)",
          borderRadius: "0.75rem",
          padding: "1rem",
          fontSize: "0.8rem",
          color: "var(--text)"
        }}>
          <div style={{ fontWeight: 800, marginBottom: "0.5rem", color: "#00C853" }}>
            🤖 {buyResult.jobs_created} Checkout Bot{buyResult.jobs_created > 1 ? "s" : ""} Launched
          </div>
          {buyResult.jobs.map((job, i) => (
            <div key={i} style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "0.4rem 0",
              borderBottom: i < buyResult.jobs.length - 1 ? "1px solid rgba(0,200,83,0.1)" : "none"
            }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{job.product_name}</span>
              <span style={{ 
                fontSize: "0.65rem", 
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: "4px",
                background: "rgba(0,200,83,0.15)",
                color: "#00C853"
              }}>
                {job.platform.toUpperCase()} • {job.status}
              </span>
            </div>
          ))}
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
            💡 Playwright browsers will open and navigate to checkout automatically.
          </div>
        </div>
      )}

      {/* Error Status */}
      {buyState === "error" && (
        <div style={{
          background: "rgba(220, 38, 38, 0.08)",
          border: "1px solid rgba(220, 38, 38, 0.2)",
          borderRadius: "0.75rem",
          padding: "0.75rem",
          fontSize: "0.8rem",
          color: "#DC2626"
        }}>
          {errorMsg}
        </div>
      )}

      <style jsx>{`
        .best-bundle-glow {
          animation: gold-glow 3s infinite;
        }
        @keyframes gold-glow {
          0% { border-color: #FFD700; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); }
          50% { border-color: #FFFACD; box-shadow: 0 0 25px rgba(255, 215, 0, 0.4); }
          100% { border-color: #FFD700; box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
