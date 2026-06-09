"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("studio_immo_cookies")) setVisible(true);
  }, []);

  function accepter() {
    localStorage.setItem("studio_immo_cookies", "accepted");
    setVisible(false);
  }

  function refuser() {
    localStorage.setItem("studio_immo_cookies", "refused");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ background: "var(--bg-1)", borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <p style={{ fontSize: "13px", color: "var(--txt-2)", lineHeight: 1.6, maxWidth: "600px" }}>
          Studio Immo utilise des cookies nécessaires à votre authentification et au bon fonctionnement du service.{" "}
          <Link href="/confidentialite" style={{ color: "var(--gold)", textDecoration: "underline" }}>
            En savoir plus
          </Link>
        </p>
        <div className="flex gap-2">
          <button
            onClick={refuser}
            className="btn btn-secondary"
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            Refuser
          </button>
          <button
            onClick={accepter}
            className="btn btn-primary"
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
