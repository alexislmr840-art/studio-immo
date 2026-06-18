"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AbonnementPage() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/me/credits")
      .then((r) => r.json())
      .then((data) => setCredits(data.credits ?? 0))
      .catch(() => setCredits(0));
  }, []);

  const FEATURES_COMPARE = [
    { label: "Biens / mois", gratuit: "1", solo: "10", equipe: "30" },
    { label: "Campagnes par bien", gratuit: "5", solo: "5", equipe: "5" },
    { label: "Visuels PNG 1080×1350", gratuit: "✓", solo: "✓", equipe: "✓" },
    { label: "Facebook, Instagram, Stories", gratuit: "✓", solo: "✓", equipe: "✓" },
    { label: "Logo agence sur visuels", gratuit: "✓", solo: "✓", equipe: "✓" },
    { label: "Agents simultanés", gratuit: "1", solo: "1", equipe: "10" },
    { label: "Historique des campagnes", gratuit: "—", solo: "—", equipe: "✓" },
    { label: "Support prioritaire", gratuit: "—", solo: "Email", equipe: "Prioritaire" },
  ];

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "1px" }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  const CrossIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "1px" }}>
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  const Feature = ({ text, ok, bold = false }: { text: string; ok: boolean; bold?: boolean }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12.5px", color: ok ? "#374151" : "#C4B5FD", lineHeight: 1.4, fontWeight: bold ? 600 : 400 }}>
      {ok ? <CheckIcon /> : <CrossIcon />}
      {text}
    </div>
  );

  return (
    <main style={{ background: "#F4F3F7", flex: 1 }}>
      <style>{`
        .pricing-card { transition: all 0.25s ease; }
        .pricing-card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(124,58,237,0.12) !important; border-color: #C4B5FD !important; }
        .pricing-card-featured { transition: all 0.25s ease; }
        .pricing-card-featured:hover { transform: translateY(-10px); box-shadow: 0 20px 48px rgba(124,58,237,0.28) !important; }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ position: "relative", padding: "40px 32px 90px", textAlign: "center", overflow: "hidden" }}>
        {/* Layer 1 — dégradé de fond */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #2D1B69, #1E1B2E)" }} />
        {/* Layer 2 — photo immobilier floutée */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=60)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.18, filter: "blur(2px)",
        }} />
        {/* Layer 3 — overlay coloré */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(30,27,46,0.85))" }} />

        {/* Contenu hero */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <span style={{
            display: "inline-block", marginBottom: "18px",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", fontSize: "11px", fontWeight: 600,
            padding: "5px 14px", borderRadius: "20px",
            textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            Choisissez votre formule
          </span>

          <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 700, marginBottom: "12px", lineHeight: 1.3 }}>
            Transformez chaque bien en campagne
          </h1>

          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", maxWidth: "420px", margin: "0 auto 28px", lineHeight: 1.6 }}>
            Des publications prêtes à poster en quelques secondes. Sans designer, sans agence.
          </p>

          {/* Toggle Mensuel / Annuel */}
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.1)", borderRadius: "10px", padding: "3px", gap: "2px" }}>
            <button style={{ padding: "7px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, background: "#fff", color: "#1E1B2E", border: "none", cursor: "pointer" }}>
              Mensuel
            </button>
            <button
              disabled
              style={{ padding: "7px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, background: "transparent", color: "rgba(255,255,255,0.5)", border: "none", cursor: "not-allowed", opacity: 0.6, display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              Annuel
              <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "1px 7px", borderRadius: "10px" }}>
                Bientôt
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Contenu principal ────────────────────────────────── */}
      <div style={{ padding: "0 24px 48px", maxWidth: "980px", margin: "0 auto" }}>

        {/* Cards pricing — flottent sur le hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginTop: "-60px", position: "relative", zIndex: 3, marginBottom: "28px" }}>

          {/* ── Card Gratuit ── */}
          <div className="pricing-card" style={{ background: "#fff", border: "1.5px solid #E0E0E8", borderRadius: "16px", padding: "24px 20px", position: "relative" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Gratuit</p>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ fontSize: "34px", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>0€</span>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>/mois</span>
            </div>
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "18px" }}>Pour tester</p>
            <button style={{ width: "100%", padding: "10px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 600, marginBottom: "20px", cursor: "default" }}>
              Plan actuel
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              <Feature text="1 bien/mois" ok={true} />
              <Feature text="5 campagnes par bien" ok={true} />
              <Feature text="Visuels PNG 1080×1350" ok={true} />
              <Feature text="Facebook, Instagram, Stories" ok={true} />
              <Feature text="Plusieurs agents" ok={false} />
              <Feature text="Analytics" ok={false} />
            </div>
          </div>

          {/* ── Card Solo ── */}
          <div className="pricing-card" style={{ background: "#fff", border: "1.5px solid #E0E0E8", borderRadius: "16px", padding: "24px 20px", position: "relative" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Solo</p>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ fontSize: "34px", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>39€</span>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>/mois</span>
            </div>
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "18px" }}>Pour l&apos;agent indépendant</p>
            <Link
              href="/tarifs"
              style={{ display: "block", textAlign: "center", padding: "10px", background: "#fff", color: "#7C3AED", border: "1.5px solid #7C3AED", borderRadius: "10px", fontSize: "13px", fontWeight: 600, marginBottom: "20px", textDecoration: "none" }}
            >
              Choisir Solo
            </Link>
            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              <Feature text="10 biens/mois" ok={true} />
              <Feature text="5 campagnes par bien" ok={true} />
              <Feature text="Visuels PNG 1080×1350" ok={true} />
              <Feature text="Facebook, Instagram, Stories" ok={true} />
              <Feature text="Logo agence sur visuels" ok={true} />
              <Feature text="Analytics" ok={false} />
            </div>
          </div>

          {/* ── Card Équipe (featured) ── */}
          <div className="pricing-card-featured" style={{ background: "#fff", border: "2px solid #7C3AED", borderRadius: "16px", padding: "24px 20px", position: "relative", boxShadow: "0 8px 24px rgba(124,58,237,0.18)" }}>
            {/* Badge flottant */}
            <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#7C3AED", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "4px 14px", borderRadius: "20px", textTransform: "uppercase", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>
              ★ Le plus populaire
            </div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Équipe</p>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ fontSize: "34px", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>79€</span>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>/mois</span>
            </div>
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "18px" }}>Soit 7,90€ par agent</p>
            <Link
              href="/tarifs"
              style={{ display: "block", textAlign: "center", padding: "10px", background: "#7C3AED", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 600, marginBottom: "20px", textDecoration: "none" }}
            >
              Choisir Équipe →
            </Link>
            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              <Feature text="30 biens/mois" ok={true} />
              <Feature text="5 campagnes par bien" ok={true} />
              <Feature text="Visuels PNG 1080×1350" ok={true} />
              <Feature text="Facebook, Instagram, Stories" ok={true} />
              <Feature text="Logo agence sur visuels" ok={true} />
              <Feature text="Jusqu'à 10 agents" ok={true} bold={true} />
              <Feature text="Analytics & historique" ok={true} bold={true} />
            </div>
          </div>
        </div>

        {/* ── Barre de progression plan actuel ── */}
        <div style={{ background: "#ffffff", border: "1.5px solid #E0E0E8", borderRadius: "14px", padding: "20px 24px", marginBottom: "24px" }}>
          {(() => {
            const generationsDispo = credits === null ? null : Math.floor(credits / 500);
            const barWidth = credits === null ? "0%" : credits >= 500 ? "100%" : `${Math.min((credits / 500) * 100, 100)}%`;
            return (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", marginBottom: "2px" }}>Plan actuel — Gratuit</p>
                    <p style={{ fontSize: "12px", color: "#6B7280" }}>
                      {credits === null ? "Chargement…" : `${credits} crédits restants · 500 crédits par génération`}
                    </p>
                  </div>
                  <span style={{ fontSize: "20px", fontWeight: 700, color: "#111827" }}>
                    {generationsDispo === null ? "—" : `${generationsDispo} génération${generationsDispo > 1 ? "s" : ""}`}
                  </span>
                </div>
                <div style={{ height: "6px", borderRadius: "99px", background: "#F3F4F6", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: "99px", width: barWidth, background: "#7C3AED", transition: "width 1s ease" }} />
                </div>
              </>
            );
          })()}
        </div>

        {/* ── Footer ── */}
        <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Paiement sécurisé · Sans engagement · Résiliation immédiate
        </p>
      </div>
    </main>
  );
}
