"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

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

interface Props {
  prenom: string;
  greeting: string;
  createdAt: string | null;
  derniersBiens?: BienDashboard[];
  stats?: Stats;
}

const DEFAULT_STATS: Stats = { biens: 0, campagnes: 0, visuels: 0, credits: 500 };

/* ── Icons ───────────────────────────────────────────────────── */
function IcoHome({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}
function IcoBolt({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
function IcoCoin({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v2m0 8v2M9.5 9.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 2.5-5 2.5-5 5 0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5"/>
    </svg>
  );
}
function IcoPlus() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function IcoArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function DashboardMain({ prenom, greeting, createdAt, derniersBiens: propBiens, stats: propStats }: Props) {
  const { user } = useUser();
  const [biens, setBiens] = useState<BienDashboard[]>(propBiens ?? []);
  const [stats, setStats] = useState<Stats>(propStats ?? DEFAULT_STATS);

  // Client-side Supabase fetch as fallback when server props are absent
  useEffect(() => {
    if (propBiens !== undefined) { setBiens(propBiens); return; }
    if (!user) return;
    (async () => {
      const { data: dbUser } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();
      if (!dbUser) return;
      const { data } = await supabase
        .from("biens")
        .select("id, titre, ville, surface, photo_principale_url, created_at")
        .eq("user_id", dbUser.id)
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) {
        setBiens(data.map((b) => ({
          id: b.id, titre: b.titre, ville: b.ville ?? null,
          prix: null, surface: b.surface ?? null,
          photo_principale_url: b.photo_principale_url ?? null,
          latestGenId: null, createdAt: b.created_at ?? null,
        })));
      }
    })();
  }, [user, propBiens]);

  useEffect(() => {
    if (propStats !== undefined) setStats(propStats);
  }, [propStats]);

  const STATS_CARDS = [
    {
      label: "Biens traités",
      value: stats.biens,
      sub: `${stats.biens} mandat${stats.biens !== 1 ? "s" : ""}`,
      badge: "+12%",
      icon: <IcoHome size={13} />,
    },
    {
      label: "Créations IA",
      value: stats.campagnes,
      sub: "Facebook & Instagram",
      badge: "+12%",
      icon: <IcoBolt size={13} />,
    },
    {
      label: "Crédits restants",
      value: stats.credits,
      sub: "disponibles ce mois",
      badge: null,
      icon: <IcoCoin size={13} />,
    },
  ];

  // Weekly activity bars (mock — last bar = today, active)
  const DAYS = ["L", "M", "M", "J", "V", "S", "D"];
  const HEIGHTS = [30, 55, 40, 70, 45, 60, 80];
  const todayIdx = 6;

  return (
    <main style={{ background: "#F4F4F8", flex: 1, minHeight: "100vh", padding: "28px 28px 40px" }}>
      <div style={{ maxWidth: "100%" }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{greeting},</p>
            <h1 style={{ fontSize: "24px", fontWeight: 500, color: "#111827", margin: "2px 0 0", letterSpacing: "-0.02em" }}>
              {prenom}
            </h1>
            {createdAt && (
              <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0" }}>
                Membre depuis le {createdAt}
              </p>
            )}
          </div>
          <Link
            href="/nouveau-bien"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "#7C3AED", color: "white",
              borderRadius: "8px", padding: "8px 14px",
              fontSize: "13px", fontWeight: 600, textDecoration: "none",
            }}
          >
            <IcoPlus /> Nouveau bien
          </Link>
        </div>

        {/* ── 3 stats cards ──────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
          {STATS_CARDS.map(({ label, value, sub, badge, icon }) => (
            <div
              key={label}
              style={{
                background: "#FFFFFF",
                border: "1px solid #D1D5DB",
                borderRadius: "10px",
                padding: "14px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {/* Label row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ color: "#7C3AED" }}>{icon}</span>
                  <p style={{ fontSize: "10px", color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                    {label}
                  </p>
                </div>
                {badge && (
                  <span style={{
                    background: "#D1FAE5", color: "#065F46",
                    fontSize: "10px", fontWeight: 600,
                    borderRadius: "4px", padding: "1px 6px",
                  }}>
                    {badge}
                  </span>
                )}
              </div>
              {/* Value */}
              <p style={{ fontSize: "28px", fontWeight: 500, color: "#111827", margin: "0 0 2px", lineHeight: 1, letterSpacing: "-0.02em" }}>
                {value}
              </p>
              <p style={{ fontSize: "11px", color: "#6B7280", margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Content grid 1fr 260px ─────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "16px" }}>

          {/* Left : derniers biens */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#111827", margin: 0 }}>
                Mes derniers biens
              </h2>
              <Link href="/dashboard/biens" style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "12px", color: "#7C3AED", fontWeight: 500, textDecoration: "none" }}>
                Voir tous les biens <IcoArrow />
              </Link>
            </div>

            {biens.length === 0 ? (
              /* Onboarding vide */
              <div style={{
                border: "1px dashed #E5E7EB", borderRadius: "10px",
                padding: "36px 24px", textAlign: "center",
              }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#7C3AED" }}>
                  <IcoHome size={20} />
                </div>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Aucun bien pour l'instant</p>
                <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px" }}>Créez votre premier bien et générez une stratégie IA en 15 secondes.</p>
                <Link href="/nouveau-bien" style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  background: "#7C3AED", color: "white", borderRadius: "8px",
                  padding: "8px 16px", fontSize: "12px", fontWeight: 600, textDecoration: "none",
                }}>
                  <IcoPlus /> Créer mon premier bien
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                {biens.map((bien) => (
                  <div key={bien.id} style={{ width: "100%", background: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                    {/* Image zone */}
                    <div style={{ height: "120px", background: "#EDE9FE", position: "relative", overflow: "hidden" }}>
                      {bien.photo_principale_url ? (
                        <img
                          src={bien.photo_principale_url}
                          alt={bien.titre}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#7C3AED" }}>
                          <IcoHome size={22} />
                        </div>
                      )}
                    </div>
                    {/* Body */}
                    <div style={{ padding: "10px" }}>
                      <p style={{ fontSize: "12px", fontWeight: 500, color: "#111827", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {bien.titre}
                      </p>
                      <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 0 8px" }}>
                        {[bien.ville, bien.surface].filter(Boolean).join(" · ")}
                      </p>
                      {/* Footer */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{
                          fontSize: "10px", fontWeight: 600,
                          background: bien.latestGenId ? "#D1FAE5" : "#FEF3C7",
                          color: bien.latestGenId ? "#065F46" : "#92400E",
                          borderRadius: "4px", padding: "1px 6px",
                        }}>
                          {bien.latestGenId ? "Actif" : "Brouillon"}
                        </span>
                        <Link
                          href={bien.latestGenId ? `/biens/${bien.id}/generations/${bien.latestGenId}` : `/biens/${bien.id}`}
                          style={{ fontSize: "11px", color: "#7C3AED", fontWeight: 500, textDecoration: "none" }}
                        >
                          Voir →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right : activity + quick actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* Activity chart */}
            <div style={{ background: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "10px", padding: "14px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", margin: "0 0 14px" }}>Activité cette semaine</p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "60px", gap: "4px" }}>
                {DAYS.map((day, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div
                      style={{
                        width: "100%",
                        height: `${HEIGHTS[i]}%`,
                        borderRadius: "3px",
                        background: i === todayIdx ? "#7C3AED" : "#EDE9FE",
                      }}
                    />
                    <span style={{ fontSize: "9px", color: i === todayIdx ? "#7C3AED" : "#9CA3AF", fontWeight: i === todayIdx ? 600 : 400 }}>
                      {day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ background: "#FFFFFF", border: "1px solid #D1D5DB", borderRadius: "10px", padding: "14px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", margin: "0 0 10px" }}>Actions rapides</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { href: "/nouveau-bien",          label: "Nouveau bien",   sub: "Générer une stratégie", icon: <IcoHome size={13}/> },
                  { href: "/dashboard/biens",        label: "Mes biens",      sub: "Gérer vos mandats",     icon: <IcoBolt size={13}/> },
                  { href: "/dashboard/abonnement",   label: "Abonnement",     sub: "Crédits & plan",        icon: <IcoCoin size={13}/> },
                ].map(({ href, label, sub, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    style={{ display: "flex", alignItems: "center", gap: "9px", padding: "6px 4px", textDecoration: "none", borderRadius: "6px" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: "#EDE9FE", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#7C3AED", flexShrink: 0,
                    }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: 500, color: "#111827", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: "10px", color: "#6B7280", margin: 0 }}>{sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
