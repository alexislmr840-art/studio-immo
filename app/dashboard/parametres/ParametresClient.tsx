"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";

interface Props {
  supabaseId: string;
  plan: string;
  credits: number;
  nomAgence: string;
  prenom: string;
  nom: string;
  email: string;
}

const SECTION: React.CSSProperties = {
  background: "#141414",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  padding: "24px",
};

const LABEL: React.CSSProperties = {
  fontSize: "11px",
  color: "rgba(255,255,255,0.38)",
  display: "block",
  marginBottom: "6px",
};

const INPUT: React.CSSProperties = {
  width: "100%",
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "14px",
  color: "white",
  outline: "none",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxSizing: "border-box",
};

export default function ParametresClient({
  supabaseId, plan, credits, nomAgence: initialNomAgence, prenom, nom, email,
}: Props) {
  const router = useRouter();
  const { signOut } = useClerk();

  const [nomAgence, setNomAgence] = useState(initialNomAgence);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const planLabel =
    plan === "equipe" ? "Plan Équipe" :
    plan === "solo"   ? "Plan Solo"   :
                        "Plan Gratuit";

  async function sauvegarderAgence() {
    setSaving(true);
    try {
      await fetch("/api/parametres/agence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supabaseId, nomAgence }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function ouvrirPortail() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setPortalLoading(false);
    }
  }

  async function deconnecter() {
    await signOut();
    router.push("/");
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Profil agence ── */}
      <section style={SECTION}>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "white", margin: "0 0 20px" }}>Profil agence</h2>
        <div style={{ marginBottom: "16px" }}>
          <label style={LABEL}>Nom de l&apos;agence</label>
          <input
            value={nomAgence}
            onChange={(e) => setNomAgence(e.target.value)}
            placeholder="Ex : Agence Dupont Immobilier"
            style={INPUT}
          />
        </div>
        <button
          onClick={sauvegarderAgence}
          disabled={saving}
          style={{
            borderRadius: "12px",
            padding: "10px 20px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            border: "none",
            color: "#0a0a0a",
            opacity: saving ? 0.6 : 1,
            background: saved
              ? "rgba(34,197,94,0.85)"
              : "linear-gradient(135deg, #c9a84c, #a07830)",
            transition: "opacity 0.15s",
          }}
        >
          {saved ? "✓ Sauvegardé" : saving ? "Sauvegarde…" : "Sauvegarder"}
        </button>
      </section>

      {/* ── Crédits & Plan ── */}
      <section style={SECTION}>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "white", margin: "0 0 20px" }}>Crédits &amp; Plan</h2>
        <div style={{ display: "flex", gap: "32px", marginBottom: "20px" }}>
          <div>
            <span style={LABEL}>Plan actuel</span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#c9a84c" }}>{planLabel}</span>
          </div>
          <div>
            <span style={LABEL}>Crédits restants</span>
            <span style={{ fontSize: "26px", fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>{credits}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {plan !== "free" && (
            <button
              onClick={ouvrirPortail}
              disabled={portalLoading}
              style={{
                borderRadius: "12px",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: portalLoading ? "not-allowed" : "pointer",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.10)",
                opacity: portalLoading ? 0.6 : 1,
              }}
            >
              {portalLoading ? "Chargement…" : "Gérer ma facturation"}
            </button>
          )}
          {plan === "free" && (
            <Link
              href="/tarifs"
              style={{
                display: "inline-block",
                borderRadius: "12px",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                color: "#0a0a0a",
                background: "linear-gradient(135deg, #c9a84c, #a07830)",
              }}
            >
              Passer à un plan payant
            </Link>
          )}
        </div>
      </section>

      {/* ── Compte ── */}
      <section style={SECTION}>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "white", margin: "0 0 20px" }}>Compte</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
          <div>
            <span style={LABEL}>Nom complet</span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>{prenom} {nom}</span>
          </div>
          <div>
            <span style={LABEL}>Email</span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>{email}</span>
          </div>
        </div>
        <button
          onClick={deconnecter}
          style={{
            borderRadius: "12px",
            padding: "10px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            background: "rgba(239,68,68,0.08)",
            color: "#f87171",
            border: "1px solid rgba(239,68,68,0.18)",
          }}
        >
          Se déconnecter
        </button>
      </section>

    </div>
  );
}
