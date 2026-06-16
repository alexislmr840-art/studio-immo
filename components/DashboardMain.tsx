"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { Building2, Sparkles, Zap, Plus, Building, CreditCard, ChevronRight } from "lucide-react";

/* ── Types ───────────────────────────────────────────────────── */
export interface BienDashboard {
  id: string;
  titre: string;
  ville: string | null;
  prix: string | null;
  surface: string | null;
  photo_principale_url: string | null;
  hasGeneration: boolean;
}

interface Props {
  prenom: string;
  greeting: string;
  createdAt: string | null;
  stats: { biens: number; campagnes: number; visuels: number; credits: number };
  derniersBiens?: BienDashboard[];
}

/* ── Constants ───────────────────────────────────────────────── */
const CARD: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1.5px solid #E0E0E8",
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

const CONSEILS = [
  {
    emoji: "📅",
    titre: "Postez le lundi ou mercredi matin",
    texte: "Les publications immobilières publiées entre 8h et 10h le lundi ou mercredi génèrent en moyenne 40% d'engagement de plus.",
  },
  {
    emoji: "📸",
    titre: "La première photo est décisive",
    texte: "80% des clics sur un post immobilier viennent de la première image. Mettez votre pièce la plus lumineuse en premier.",
  },
  {
    emoji: "📱",
    titre: "Une Story par semaine suffit",
    texte: "Une Story hebdomadaire bien ciblée avec prix et CTA direct suffit à maintenir la visibilité de votre agence.",
  },
  {
    emoji: "💬",
    titre: "Répondez aux commentaires en moins d'1h",
    texte: "Les algorithmes favorisent les publications dont les commentaires reçoivent une réponse rapide — portée augmentée de 25 à 60%.",
  },
  {
    emoji: "🎯",
    titre: "Le prix dans l'accroche triple les clics",
    texte: "Mentionner le prix dès la première ligne multiplie par 3 le taux de clics sur Facebook.",
  },
];

const QUICK_ACTIONS = [
  { href: "/nouveau-bien",          label: "Nouveau bien",  sub: "Générer une stratégie", Icon: Plus },
  { href: "/dashboard/biens",       label: "Mes biens",     sub: "Gérer vos mandats",     Icon: Building },
  { href: "/dashboard/abonnement",  label: "Abonnement",    sub: "Crédits & plan",        Icon: CreditCard },
] as const;

/* ── Main component ──────────────────────────────────────────── */
export default function DashboardMain({ prenom, greeting, createdAt, stats }: Props) {
  const { user } = useUser();
  const [biens,   setBiens]  = useState<BienDashboard[]>([]);
  const [conseil, setConseil] = useState(0);

  /* ── Fetch data ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: dbUser, error: dbUserError } = await supabase
        .from("users").select("id, credits").eq("clerk_id", user.id).single();
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
          .select("bien_id")
          .eq("user_id", dbUser.id),
      ]);

      const genBienIds = new Set((gensRes.data ?? []).map((g) => g.bien_id as string));
      if (biensRes.data) {
        setBiens(biensRes.data.map((b) => ({
          id: b.id,
          titre: b.titre,
          ville: b.ville ?? null,
          prix: b.prix ?? null,
          surface: b.surface ?? null,
          photo_principale_url: b.photo_principale_url ?? null,
          hasGeneration: genBienIds.has(b.id),
        })));
      }
    })();
  }, [user]);

  /* ── Carousel auto-advance ──────────────────────────────────── */
  useEffect(() => {
    const t = setInterval(() => setConseil((i) => (i + 1) % CONSEILS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const STATS_CARDS = [
    { label: "Biens",     value: stats.biens,     sub: `${stats.biens} mandat${stats.biens !== 1 ? "s" : ""}`, badge: "+12%", Icon: Building2 },
    { label: "Créations", value: stats.campagnes, sub: "Facebook & Instagram", badge: "+12%",                          Icon: Sparkles  },
    { label: "Crédits",   value: stats.credits, sub: "disponibles ce mois",  badge: null,               Icon: Zap       },
  ];

  return (
    <main style={{ background: "#F5F5F8", flex: 1, minHeight: "100vh", padding: "24px 26px" }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 2px" }}>{greeting},</p>
          <h1 style={{ fontSize: "23px", fontWeight: 500, color: "#111827", margin: 0, letterSpacing: "-0.01em" }}>
            {prenom}
          </h1>
          {createdAt && (
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "3px 0 0" }}>
              Membre depuis le {createdAt}
            </p>
          )}
        </div>
        <Link
          href="/nouveau-bien"
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "#7C3AED", color: "white", borderRadius: "9px",
            padding: "9px 16px", fontSize: "12.5px", fontWeight: 500, textDecoration: "none",
          }}
        >
          <Plus size={13} /> Nouveau bien
        </Link>
      </div>

      {/* ── 3 stat cards ────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "18px" }}>
        {STATS_CARDS.map(({ label, value, sub, badge, Icon }) => (
          <div key={label} style={{ ...CARD, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <Icon size={14} color="#7C3AED" style={{ flexShrink: 0 }} />
              <span style={{
                fontSize: "10.5px", color: "#6B7280", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.07em", marginLeft: "6px", flex: 1,
              }}>
                {label}
              </span>
              {badge && (
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#059669", marginLeft: "auto" }}>
                  {badge}
                </span>
              )}
            </div>
            <p style={{ fontSize: "30px", fontWeight: 500, color: "#111827", margin: 0, lineHeight: 1 }}>
              {value}
            </p>
            <p style={{ fontSize: "11.5px", color: "#374151", margin: "4px 0 0" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main grid 1fr + 252px ───────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 252px", gap: "14px", marginBottom: "14px" }}>

        {/* Left : derniers biens */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 500, color: "#111827", margin: 0 }}>Mes derniers biens</h2>
            <Link href="/dashboard/biens" style={{ fontSize: "12px", color: "#7C3AED", fontWeight: 500, textDecoration: "none" }}>
              Voir tous →
            </Link>
          </div>

          {biens.length === 0 ? (
            <div style={{ ...CARD, padding: "36px 24px", textAlign: "center", border: "1.5px dashed #E0E0E8" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#F1EBFF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Building2 size={20} color="#7C3AED" />
              </div>
              <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Aucun bien pour l'instant</p>
              <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "16px" }}>
                Créez votre premier bien et générez une stratégie IA en 15 secondes.
              </p>
              <Link href="/nouveau-bien" style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                background: "#7C3AED", color: "white", borderRadius: "8px",
                padding: "8px 16px", fontSize: "12px", fontWeight: 600, textDecoration: "none",
              }}>
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
                    <span style={{
                      position: "absolute", top: "8px", right: "8px",
                      background: bien.hasGeneration ? "#DCFCE7" : "#FEF3C7",
                      color: bien.hasGeneration ? "#15803D" : "#B45309",
                      fontSize: "9.5px", fontWeight: 600,
                      borderRadius: "20px", padding: "2px 8px",
                    }}>
                      {bien.hasGeneration ? "Actif" : "Brouillon"}
                    </span>
                    {bien.prix && (
                      <span style={{
                        position: "absolute", bottom: "8px", left: "8px",
                        background: "rgba(17,24,39,0.78)", color: "white",
                        fontSize: "10.5px", fontWeight: 500, borderRadius: "6px", padding: "3px 8px",
                      }}>
                        {bien.prix}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: "12px" }}>
                    <p style={{ fontSize: "12.5px", fontWeight: 500, color: "#111827", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {bien.titre}
                    </p>
                    <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 10px" }}>
                      {[bien.ville, bien.surface].filter(Boolean).join(" · ")}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ background: "#F1EBFF", color: "#6D28D9", borderRadius: "20px", fontSize: "10px", padding: "2px 9px", fontWeight: 500 }}>
                        {bien.hasGeneration ? "IA générée" : "Sans stratégie"}
                      </span>
                      <Link href={`/dashboard/biens`} style={{ fontSize: "11.5px", color: "#7C3AED", fontWeight: 500, textDecoration: "none" }}>
                        Voir →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right : actions rapides */}
        <div>
          <h2 style={{ fontSize: "14px", fontWeight: 500, color: "#111827", margin: "0 0 12px" }}>Actions rapides</h2>
          <div style={{ ...CARD, padding: "16px" }}>
            {QUICK_ACTIONS.map(({ href, label, sub, Icon }, idx) => (
              <div key={href}>
                <Link href={href} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", textDecoration: "none" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#F1EBFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} color="#7C3AED" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#111827", margin: 0 }}>{label}</p>
                    <p style={{ fontSize: "10.5px", color: "#374151", margin: 0 }}>{sub}</p>
                  </div>
                  <ChevronRight size={13} color="#6B7280" style={{ flexShrink: 0 }} />
                </Link>
                {idx < QUICK_ACTIONS.length - 1 && (
                  <div style={{ borderBottom: "1px solid #F3F3F6" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Conseils du moment ──────────────────────────────────── */}
      <div style={{ ...CARD, padding: "24px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#111827", margin: 0 }}>💡 Conseils du moment</p>
        </div>

        <div key={conseil} className="animate-fade-in" style={{ display: "flex", alignItems: "flex-start", gap: "14px", minHeight: "120px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "10px",
            background: "linear-gradient(135deg,#F1EBFF,#EDE4FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", flexShrink: 0,
          }}>
            {CONSEILS[conseil].emoji}
          </div>
          <div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>
              {CONSEILS[conseil].titre}
            </p>
            <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: 1.55 }}>
              {CONSEILS[conseil].texte}
            </p>
          </div>
        </div>

        {/* Navigation dots */}
        <div style={{ display: "flex", gap: "5px", marginTop: "14px", justifyContent: "center" }}>
          {CONSEILS.map((_, i) => (
            <button
              key={i}
              onClick={() => setConseil(i)}
              style={{
                width: i === conseil ? "16px" : "6px",
                height: "6px",
                borderRadius: i === conseil ? "3px" : "50%",
                background: i === conseil ? "#7C3AED" : "#E0E0E8",
                border: "none", padding: 0, cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>

    </main>
  );
}
