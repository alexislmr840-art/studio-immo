"use client";
import { useState } from "react";

interface BienPrefill {
  titre: string; ville: string; prix: string | null;
  surface: string | null; description: string | null; afficher_prix: boolean;
}

export function RelancerButton({ bien }: { bien: BienPrefill }) {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    localStorage.setItem("studio_immo_prefill", JSON.stringify(bien));
    window.location.href = "/nouveau-bien";
  }

  return (
    <button onClick={handleClick} disabled={loading}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7) ", border: "1px solid rgba(255,255,255,0.1)" }}>
      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Redirection...
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
          </svg>
          Relancer
        </>
      )}
    </button>
  );
}
