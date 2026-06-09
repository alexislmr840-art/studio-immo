"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{ background: "var(--bg-base)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center", padding: "40px 24px" }}>
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: "var(--err-10)", border: "1px solid rgba(239,68,68,0.25)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--err)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <h1 className="font-bold text-white" style={{ fontSize: "22px", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Une erreur est survenue
        </h1>
        <p style={{ fontSize: "14px", color: "var(--txt-3)", marginBottom: "28px", lineHeight: "1.6" }}>
          Quelque chose s&apos;est mal passé. Vous pouvez réessayer ou retourner à l&apos;accueil.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="btn"
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              background: "var(--gold)",
              color: "#0a0a0a",
              border: "none",
            }}
          >
            Réessayer
          </button>
          <Link
            href="/dashboard"
            className="btn"
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 500,
              background: "var(--bg-3)",
              color: "var(--txt-2)",
              border: "1px solid var(--border)",
            }}
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
