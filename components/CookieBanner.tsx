"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("studio_immo_cookies")) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem("studio_immo_cookies", "acknowledged");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ background: "var(--bg-1)", borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <p style={{ fontSize: "13px", color: "var(--txt-2)", lineHeight: 1.6, maxWidth: "640px" }}>
          Ce site utilise uniquement des cookies essentiels au fonctionnement du service (authentification, session).
          Aucun cookie publicitaire ni outil de tracking n&apos;est utilisé.{" "}
          <Link href="/confidentialite" style={{ color: "var(--gold)", textDecoration: "underline" }}>
            Politique de confidentialité
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="btn btn-secondary"
          style={{ padding: "8px 20px", fontSize: "13px", flexShrink: 0 }}
        >
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}
