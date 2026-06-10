"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  plan: "solo" | "equipe";
  isCurrentPlan: boolean;
  isLoggedIn: boolean;
  accent: boolean;
  buttonStyle?: React.CSSProperties;
  label?: string;
}

export function CheckoutButton({ plan, isCurrentPlan, isLoggedIn, accent, buttonStyle, label }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!isLoggedIn) {
      router.push("/inscription");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const { url, error } = await res.json();
      if (url) window.location.href = url;
      else alert(error || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (isCurrentPlan) {
    return (
      <div className={`w-full rounded-xl py-4 text-center font-bold ${accent ? "bg-blue-950/20 text-blue-950" : "bg-green-500/20 text-green-300"}`}>
        ✅ Plan actif
      </div>
    );
  }

  const defaultStyle: React.CSSProperties = buttonStyle ?? (accent
    ? { background: "white", color: "#7C3AED", border: "none", borderRadius: "8px", padding: "12px 24px", width: "100%", fontSize: "14px", fontWeight: 700, cursor: "pointer" }
    : { background: "transparent", color: "#7C3AED", border: "2px solid #7C3AED", borderRadius: "8px", padding: "12px 24px", width: "100%", fontSize: "14px", fontWeight: 700, cursor: "pointer" });

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{ ...defaultStyle, opacity: loading ? 0.6 : 1, transition: "opacity 0.15s" }}
    >
      {loading ? "Redirection…" : (label ?? (isLoggedIn ? "S'abonner →" : "Commencer →"))}
    </button>
  );
}
