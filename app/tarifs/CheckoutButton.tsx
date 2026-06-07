"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  plan: "solo" | "equipe";
  isCurrentPlan: boolean;
  isLoggedIn: boolean;
  accent: boolean;
}

export function CheckoutButton({ plan, isCurrentPlan, isLoggedIn, accent }: Props) {
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

  const btnClass = accent
    ? "bg-blue-950 text-white hover:bg-blue-900"
    : "bg-amber-400 text-blue-950 hover:opacity-90";

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full rounded-xl py-4 font-bold transition-all disabled:opacity-60 ${btnClass}`}
    >
      {loading ? "Redirection..." : isLoggedIn ? "S'abonner" : "Créer un compte"}
    </button>
  );
}
