"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/* ── Types ───────────────────────────────────────────────────── */
export interface BienDashboard {
  id: string;
  titre: string;
  ville: string | null;
  prix: string | null;
  surface: string | null;
  photo_principale_url: string | null;
  latestGenId: string | null;
  createdAt: string | null;
}

interface Stats {
  biens: number;
  campagnes: number;
  visuels: number;
  credits: number;
}

interface StoredData {
  biens: BienDashboard[];
  stats: Stats;
}

interface Props {
  prenom: string;
  greeting: string;
  createdAt: string | null;
  derniersBiens?: BienDashboard[];
  stats?: Stats;
}

/* ── SVG Icons ───────────────────────────────────────────────── */
function IcoHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}
function IcoBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
function IcoImage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}
function IcoStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function IcoPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function IcoArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}
function IcoChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function IcoFile() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

/* ── Shared styles ───────────────────────────────────────────── */
const CARD: React.CSSProperties = {
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  border: "1px solid rgba(124,58,237,0.25)",
  borderRadius: "16px",
  padding: "20px",
};

const CARD_DARK: React.CSSProperties = {
  background: "#111118",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "16px",
  padding: "24px",
};

const ICON_WRAP: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "rgba(124,58,237,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#a78bfa",
  flexShrink: 0,
};

/* ── Quick actions config ────────────────────────────────────── */
const ACTIONS = [
  { href: "/nouveau-bien",           label: "Nouveau bien",    sub: "Générer une stratégie IA", icon: <IcoHome /> },
  { href: "/dashboard/biens",        label: "Mes biens",       sub: "Gérer vos mandats",         icon: <IcoFile /> },
  { href: "/dashboard/statistiques", label: "Statistiques",   sub: "Performances & analyses",   icon: <IcoChart /> },
  { href: "/dashboard/abonnement",   label: "Mon plan",        sub: "Crédits & abonnement",      icon: <IcoStar /> },
];

/* ── Default stats ───────────────────────────────────────────── */
const DEFAULT_STATS: Stats = { biens: 0, campagnes: 0, visuels: 0, credits: 500 };

/* ── Main component ──────────────────────────────────────────── */
export default function DashboardMain({ prenom, greeting, createdAt, derniersBiens: propBiens, stats: propStats }: Props) {
  const [stored, setStored] = useState<StoredData>({ biens: [], stats: DEFAULT_STATS });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("studio_immo_dashboard");
      if (raw) {
        const parsed: StoredData = JSON.parse(raw);
        setStored(parsed);
      }
    } catch {
      // ignore malformed data
    }
    setMounted(true);
  }, []);

  // Server props take priority over localStorage when available
  const biens: BienDashboard[] = propBiens ?? (mounted ? stored.biens : []);
  const stats: Stats = propStats ?? (mounted ? stored.stats : DEFAULT_STATS);

  const STATS_CARDS = [
    { label: "Biens traités",  value: stats.biens,     sub: `${stats.biens} mandat${stats.biens !== 1 ? "s" : ""}`,  color: "#7C3AED", icon: <IcoHome /> },
    { label: "Campagnes IA",   value: stats.campagnes, sub: "Facebook & Instagram",                                   color: "#3b82f6", icon: <IcoBolt /> },
    { label: "Visuels générés",value: stats.visuels,   sub: "PNG 1080×1350 px",                                       color: "#06b6d4", icon: <IcoImage /> },
    { label: "Crédits",        value: stats.credits,   sub: "disponibles ce mois",                                    color: "#a78bfa", icon: <IcoStar /> },
  ];

  return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh", padding: "32px 32px 48px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "36px" }}>
          <div>
            <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500, marginBottom: "4px" }}>
              {greeting}
            </p>
            <h1 style={{ fontSize: "32px", fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
              {prenom}
            </h1>
            {createdAt && (
              <p style={{ fontSize: "12px", color: "#4b5563", marginTop: "6px" }}>
                Membre depuis le {createdAt}
              </p>
            )}
          </div>
          <Link
            href="/nouveau-bien"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#7C3AED",
              color: "white",
              borderRadius: "10px",
              padding: "10px 18px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              border: "none",
              boxShadow: "0 0 20px rgba(124,58,237,0.3)",
            }}
          >
            <IcoPlus />
            Nouveau bien
          </Link>
        </div>

        {/* ── 4 stat cards ───────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {STATS_CARDS.map(({ label, value, sub, color, icon }) => (
            <div key={label} style={{ ...CARD }}>
              {/* Icon circle */}
              <div style={{ ...ICON_WRAP, marginBottom: "16px" }}>
                {icon}
              </div>

              {/* Label */}
              <p style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: "8px" }}>
                {label}
              </p>

              {/* Value */}
              <p style={{ fontSize: "42px", fontWeight: 800, color, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "4px" }}>
                {value}
              </p>

              {/* Sub */}
              <p style={{ fontSize: "12px", color: "#6b7280" }}>
                {sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Main block ─────────────────────────────────────── */}
        {biens.length === 0 ? (

          /* ── Onboarding ── */
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(59,130,246,0.05) 100%)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: "20px",
              padding: "48px 40px",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(124,58,237,0.3)",
                    borderRadius: "20px",
                    padding: "4px 12px",
                    fontSize: "11px",
                    color: "#a78bfa",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "20px",
                  }}
                >
                  <IcoBolt />
                  Démarrage rapide
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white", letterSpacing: "-0.025em", marginBottom: "12px" }}>
                  Créez votre première stratégie
                </h2>
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7, marginBottom: "24px" }}>
                  Renseignez un mandat et l'IA génère en 15 secondes une stratégie complète avec 5 campagnes, 10 publications et des visuels prêts à publier.
                </p>
                <Link
                  href="/nouveau-bien"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#7C3AED",
                    color: "white",
                    borderRadius: "10px",
                    padding: "12px 22px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                    boxShadow: "0 0 24px rgba(124,58,237,0.35)",
                  }}
                >
                  Créer mon premier bien
                  <IcoArrow />
                </Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {[
                  { n: "01", title: "Saisissez le bien",  desc: "Titre, ville, prix, description" },
                  { n: "02", title: "L'IA génère",        desc: "5 campagnes en 15 secondes" },
                  { n: "03", title: "Publiez",            desc: "Copiez & téléchargez" },
                ].map(({ n, title, desc }) => (
                  <div
                    key={n}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "12px",
                      padding: "16px 12px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "rgba(124,58,237,0.15)",
                        border: "1px solid rgba(124,58,237,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#a78bfa",
                      }}
                    >
                      {n}
                    </div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "white", marginBottom: "4px" }}>{title}</p>
                    <p style={{ fontSize: "10.5px", color: "#6b7280", lineHeight: 1.5 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        ) : (

          /* ── Biens + Actions : 2 colonnes 2fr / 1fr ─────── */
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>

            {/* Colonne gauche : Mes derniers biens */}
            <div style={{ ...CARD_DARK }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "15px", fontWeight: 600, color: "white", margin: 0 }}>Mes derniers biens</h2>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "3px" }}>
                    {biens.length} bien{biens.length > 1 ? "s" : ""} récent{biens.length > 1 ? "s" : ""}
                  </p>
                </div>
                <Link
                  href="/dashboard/biens"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#a78bfa",
                    textDecoration: "none",
                    background: "rgba(124,58,237,0.1)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: "8px",
                    padding: "5px 10px",
                  }}
                >
                  Voir tous <IcoArrow />
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {biens.map((bien) => (
                  <div
                    key={bien.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "12px",
                      padding: "12px 14px",
                    }}
                  >
                    {/* Miniature */}
                    {bien.photo_principale_url ? (
                      <img
                        src={bien.photo_principale_url}
                        alt={bien.titre}
                        style={{ width: "64px", height: "48px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "64px",
                          height: "48px",
                          borderRadius: "8px",
                          background: "rgba(124,58,237,0.1)",
                          border: "1px solid rgba(124,58,237,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          color: "#a78bfa",
                        }}
                      >
                        <IcoHome />
                      </div>
                    )}

                    {/* Infos */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "14px", color: "white", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {bien.titre}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                        {bien.ville && (
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>{bien.ville}</span>
                        )}
                        {bien.surface && (
                          <span style={{ fontSize: "11px", color: "#93c5fd", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "20px", padding: "1px 8px" }}>
                            {bien.surface}
                          </span>
                        )}
                        {bien.createdAt && (
                          <span style={{ fontSize: "11px", color: "#4b5563" }}>
                            {new Date(bien.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Badge campagnes */}
                    {bien.latestGenId && (
                      <span
                        style={{
                          background: "rgba(124,58,237,0.2)",
                          color: "#a78bfa",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "2px 10px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        5 campagnes
                      </span>
                    )}

                    {/* Bouton Voir */}
                    {bien.latestGenId ? (
                      <Link
                        href={`/biens/${bien.id}/generations/${bien.latestGenId}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          background: "#7C3AED",
                          color: "white",
                          borderRadius: "8px",
                          padding: "6px 14px",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        Voir
                      </Link>
                    ) : (
                      <Link
                        href={`/biens/${bien.id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          background: "rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.5)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "8px",
                          padding: "6px 14px",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        Ouvrir
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite : Actions rapides */}
            <div style={{ ...CARD_DARK }}>
              <h2 style={{ fontSize: "15px", fontWeight: 600, color: "white", marginBottom: "18px", marginTop: 0 }}>
                Actions rapides
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {ACTIONS.map(({ href, label, sub, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      textDecoration: "none",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(124,58,237,0.08)";
                      el.style.borderColor = "rgba(124,58,237,0.2)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(255,255,255,0.02)";
                      el.style.borderColor = "rgba(255,255,255,0.05)";
                    }}
                  >
                    {/* Cercle icône violet */}
                    <div style={{ ...ICON_WRAP }}>{icon}</div>

                    {/* Label + sous-titre */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "white", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>{sub}</p>
                    </div>

                    {/* Flèche */}
                    <span style={{ color: "#4b5563", flexShrink: 0 }}><IcoArrow /></span>
                  </Link>
                ))}
              </div>

              {/* Mobile CTA */}
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }} className="lg:hidden">
                <Link
                  href="/nouveau-bien"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "#7C3AED",
                    color: "white",
                    borderRadius: "10px",
                    padding: "11px",
                    fontSize: "13px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <IcoPlus /> Nouveau bien
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
