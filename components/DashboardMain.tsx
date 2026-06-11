"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { Building2, Sparkles, Zap, Plus, LayoutDashboard, CreditCard, ChevronRight } from "lucide-react";

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

interface PubRow {
  id: string;
  bienTitre: string;
  bienVille: string | null;
  bienPhoto: string | null;
  pubTitre: string;
  reseau: string;
  jourPublication: string;
  createdAt: string;
}

interface Props {
  prenom: string;
  greeting: string;
  createdAt: string | null;
  derniersBiens?: BienDashboard[];
  stats?: Stats;
}

const DEFAULT_STATS: Stats = { biens: 0, campagnes: 0, visuels: 0, credits: 500 };

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];
const HEIGHTS = [30, 55, 40, 70, 45, 60, 80];
const TODAY_IDX = 6;

const CARD: React.CSSProperties = {
  background: "#FFFFFF",
  border: "0.5px solid #E5E7EB",
  borderRadius: "12px",
};

/* ── Helpers ─────────────────────────────────────────────────── */
function badgeReseau(reseau: string) {
  const r = reseau.toLowerCase();
  if (r.includes("facebook")) return { bg: "#E7F0FF", color: "#1877F2", label: "Facebook" };
  if (r.includes("instagram")) return { bg: "#FFF0F7", color: "#C13584", label: "Instagram" };
  return { bg: "#F3F4F6", color: "#6B7280", label: reseau };
}

/* ── Main component ──────────────────────────────────────────── */
export default function DashboardMain({ prenom, greeting, createdAt, derniersBiens: propBiens, stats: propStats }: Props) {
  const { user } = useUser();
  const [biens, setBiens] = useState<BienDashboard[]>(propBiens ?? []);
  const [stats, setStats] = useState<Stats>(propStats ?? DEFAULT_STATS);
  const [pubs, setPubs] = useState<PubRow[]>([]);

  useEffect(() => {
    if (propBiens !== undefined) { setBiens(propBiens); return; }
    if (!user) return;
    (async () => {
      const { data: dbUser } = await supabase.from("users").select("id").eq("clerk_id", user.id).single();
      if (!dbUser) return;

      const [biensRes, gensRes] = await Promise.all([
        supabase
          .from("biens")
          .select("id, titre, ville, prix, surface, photo_principale_url, created_at")
          .eq("user_id", dbUser.id)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("generations")
          .select("id, bien_id")
          .eq("user_id", dbUser.id)
          .order("created_at", { ascending: false }),
      ]);

      const latestGenMap = new Map<string, string>();
      for (const g of gensRes.data ?? []) {
        if (!latestGenMap.has(g.bien_id)) latestGenMap.set(g.bien_id, g.id);
      }

      if (biensRes.data) {
        setBiens(biensRes.data.map((b) => ({
          id: b.id, titre: b.titre, ville: b.ville ?? null,
          prix: b.prix ?? null, surface: b.surface ?? null,
          photo_principale_url: b.photo_principale_url ?? null,
          latestGenId: latestGenMap.get(b.id) ?? null,
          createdAt: b.created_at ?? null,
        })));
      }
    })();
  }, [user, propBiens]);

  useEffect(() => {
    if (propStats !== undefined) setStats(propStats);
  }, [propStats]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: dbUser } = await supabase.from("users").select("id").eq("clerk_id", user.id).single();
      if (!dbUser) return;

      const { data } = await supabase
        .from("generations")
        .select("id, resultat_json, created_at, biens(titre, ville, photo_principale_url)")
        .eq("user_id", dbUser.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!data) return;

      const rows: PubRow[] = data.flatMap((g) => {
        const bienRaw = g.biens as unknown as { titre: string; ville: string | null; photo_principale_url: string | null } | null;
        const json = g.resultat_json as { publications?: Array<{ titre: string; reseau: string; jourPublication: string }> } | null;
        const firstPub = json?.publications?.[0];
        if (!firstPub) return [];
        return [{
          id: g.id,
          bienTitre: bienRaw?.titre ?? "—",
          bienVille: bienRaw?.ville ?? null,
          bienPhoto: bienRaw?.photo_principale_url ?? null,
          pubTitre: firstPub.titre,
          reseau: firstPub.reseau,
          jourPublication: firstPub.jourPublication,
          createdAt: new Date(g.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
        }];
      });

      setPubs(rows);
    })();
  }, [user]);

  const STATS_CARDS = [
    { label: "Biens traités",  value: stats.biens,     sub: `${stats.biens} mandat${stats.biens !== 1 ? "s" : ""}`,  badge: "+12%", Icon: Building2 },
    { label: "Créations IA",   value: stats.campagnes, sub: "Facebook & Instagram", badge: "+12%", Icon: Sparkles },
    { label: "Crédits restants", value: stats.credits, sub: "disponibles ce mois",  badge: null,   Icon: Zap },
  ];

  const QUICK_ACTIONS = [
    { href: "/nouveau-bien",        label: "Nouveau bien", sub: "Générer une stratégie", Icon: Building2 },
    { href: "/dashboard/biens",     label: "Mes biens",    sub: "Gérer vos mandats",     Icon: LayoutDashboard },
    { href: "/dashboard/abonnement", label: "Abonnement",  sub: "Crédits & plan",        Icon: CreditCard },
  ];

  return (
    <main style={{ background: "#F5F5F8", flex: 1, minHeight: "100vh", padding: "24px" }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{greeting},</p>
          <h1 style={{ fontSize: "24px", fontWeight: 500, color: "#111827", margin: "2px 0 0", letterSpacing: "-0.02em" }}>
            {prenom}
          </h1>
          {createdAt && (
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "3px 0 0" }}>
              Membre depuis le {createdAt}
            </p>
          )}
        </div>
        <Link
          href="/nouveau-bien"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#7C3AED", color: "white", borderRadius: "9px", padding: "9px 16px", fontSize: "12.5px", fontWeight: 500, textDecoration: "none" }}
        >
          <Plus size={13} /> Nouveau bien
        </Link>
      </div>

      {/* ── 3 stat cards ────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {STATS_CARDS.map(({ label, value, sub, badge, Icon }) => (
          <div key={label} style={{ ...CARD, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Icon size={14} color="#7C3AED" />
                <span style={{ fontSize: "11px", color: "#6B7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {label}
                </span>
              </div>
              {badge && (
                <span style={{ background: "#DCFCE7", color: "#15803D", fontSize: "10px", fontWeight: 600, borderRadius: "4px", padding: "1px 6px" }}>
                  {badge}
                </span>
              )}
            </div>
            <p style={{ fontSize: "30px", fontWeight: 500, color: "#111827", margin: "0 0 2px", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {value}
            </p>
            <p style={{ fontSize: "11.5px", color: "#6B7280", margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main grid 1fr + 260px ───────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "16px", marginBottom: "16px" }}>

        {/* Left : derniers biens */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#111827", margin: 0 }}>Mes derniers biens</h2>
            <Link href="/dashboard/biens" style={{ display: "inline-flex", alignItems: "center", gap: "2px", fontSize: "12px", color: "#7C3AED", fontWeight: 500, textDecoration: "none" }}>
              Voir tous <ChevronRight size={13} />
            </Link>
          </div>

          {biens.length === 0 ? (
            <div style={{ ...CARD, padding: "36px 24px", textAlign: "center", border: "1px dashed #E5E7EB" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#F1EBFF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Building2 size={20} color="#7C3AED" />
              </div>
              <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Aucun bien pour l'instant</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px" }}>
                Créez votre premier bien et générez une stratégie IA en 15 secondes.
              </p>
              <Link href="/nouveau-bien" style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#7C3AED", color: "white", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
                <Plus size={13} /> Créer mon premier bien
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {biens.map((bien) => (
                <div key={bien.id} style={{ ...CARD, overflow: "hidden" }}>
                  {/* Image */}
                  <div style={{ height: "110px", background: "#F1EBFF", position: "relative", overflow: "hidden" }}>
                    {bien.photo_principale_url ? (
                      <img
                        src={bien.photo_principale_url}
                        alt={bien.titre}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Building2 size={24} color="#7C3AED" />
                      </div>
                    )}
                    {/* Badge actif/brouillon */}
                    <span style={{
                      position: "absolute", top: "8px", right: "8px",
                      background: bien.latestGenId ? "#DCFCE7" : "#FEF3C7",
                      color: bien.latestGenId ? "#15803D" : "#B45309",
                      fontSize: "9.5px", fontWeight: 600,
                      borderRadius: "4px", padding: "2px 6px",
                    }}>
                      {bien.latestGenId ? "Actif" : "Brouillon"}
                    </span>
                    {/* Prix overlay */}
                    {bien.prix && (
                      <span style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(17,24,39,0.75)", color: "white", fontSize: "10.5px", borderRadius: "6px", padding: "3px 8px" }}>
                        {bien.prix}
                      </span>
                    )}
                  </div>
                  {/* Body */}
                  <div style={{ padding: "12px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#111827", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {bien.titre}
                    </p>
                    <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 10px" }}>
                      {[bien.ville, bien.surface ? `${bien.surface}` : null].filter(Boolean).join(" · ")}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ background: "#F1EBFF", color: "#6D28D9", fontSize: "10.5px", fontWeight: 500, borderRadius: "20px", padding: "2px 9px" }}>
                        {bien.latestGenId ? "IA générée" : "Sans stratégie"}
                      </span>
                      <Link
                        href={bien.latestGenId ? `/biens/${bien.id}/generations/${bien.latestGenId}` : `/biens/${bien.id}`}
                        style={{ fontSize: "11.5px", color: "#7C3AED", fontWeight: 500, textDecoration: "none" }}
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

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Activité */}
          <div style={{ ...CARD, padding: "16px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: "0 0 2px" }}>Activité cette semaine</p>
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 14px" }}>Campagnes générées</p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "56px", gap: "4px" }}>
              {DAYS.map((day, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "100%", height: `${HEIGHTS[i]}%`, borderRadius: "3px", background: i === TODAY_IDX ? "#7C3AED" : "#EDE9FE" }} />
                  <span style={{ fontSize: "10px", color: i === TODAY_IDX ? "#7C3AED" : "#9CA3AF" }}>{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions rapides */}
          <div style={{ ...CARD, padding: "16px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: "0 0 12px" }}>Actions rapides</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {QUICK_ACTIONS.map(({ href, label, sub, Icon }, idx) => (
                <div key={href}>
                  <Link
                    href={href}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 4px", textDecoration: "none" }}
                  >
                    <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#F1EBFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={14} color="#7C3AED" />
                    </div>
                    <div>
                      <p style={{ fontSize: "12.5px", fontWeight: 500, color: "#111827", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: "10.5px", color: "#6B7280", margin: 0 }}>{sub}</p>
                    </div>
                  </Link>
                  {idx < QUICK_ACTIONS.length - 1 && (
                    <div style={{ borderBottom: "0.5px solid #E5E7EB", margin: "0 4px" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Dernières publications générées ─────────────────────── */}
      <div style={{ ...CARD, padding: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#111827", margin: 0 }}>Dernières publications générées</h2>
          <Link href="/dashboard/biens" style={{ display: "inline-flex", alignItems: "center", gap: "2px", fontSize: "12px", color: "#7C3AED", fontWeight: 500, textDecoration: "none" }}>
            Voir toutes <ChevronRight size={13} />
          </Link>
        </div>

        {pubs.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#9CA3AF", textAlign: "center", padding: "20px 0" }}>
            Aucune publication générée pour l'instant.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {pubs.map((pub, idx) => {
              const badge = badgeReseau(pub.reseau);
              return (
                <div key={pub.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0" }}>
                    {/* Miniature */}
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#F1EBFF", overflow: "hidden", flexShrink: 0 }}>
                      {pub.bienPhoto ? (
                        <img src={pub.bienPhoto} alt={pub.bienTitre} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Building2 size={14} color="#7C3AED" />
                        </div>
                      )}
                    </div>
                    {/* Titre + ville */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {pub.pubTitre}
                      </p>
                      <p style={{ fontSize: "11px", color: "#6B7280", margin: 0 }}>
                        {[pub.bienVille, pub.createdAt].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {/* Badge réseau */}
                    <span style={{ background: badge.bg, color: badge.color, fontSize: "10.5px", fontWeight: 600, borderRadius: "4px", padding: "2px 7px", flexShrink: 0 }}>
                      {badge.label}
                    </span>
                    {/* Jour */}
                    <span style={{ fontSize: "11px", color: "#6B7280", flexShrink: 0, whiteSpace: "nowrap" }}>
                      {pub.jourPublication}
                    </span>
                  </div>
                  {idx < pubs.length - 1 && <div style={{ borderBottom: "0.5px solid #E5E7EB" }} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </main>
  );
}
