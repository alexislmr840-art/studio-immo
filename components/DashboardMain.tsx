"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface BienDashboard {
  id: string;
  titre: string;
  ville: string | null;
  prix: string | null;
  surface: string | null;
  photo_principale_url: string | null;
  latestGenId: string | null;
}

interface Props {
  prenom: string;
  greeting: string;
  createdAt: string | null;
  derniersBiens: BienDashboard[];
}

interface StoredData {
  biens: number;
  campagnes: number;
  visuels: number;
  dernierTitre: string | null;
  derniereVille: string | null;
}

/* SVG Sparkline */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const w = 120, h = 40;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const area = `${0},${h} ${pts} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#grad-${color})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="path-draw"/>
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - (data[data.length - 1] / max) * (h - 4) - 2} r="3" fill={color}/>
    </svg>
  );
}

/* Bar chart */
function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const days = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <div className="flex items-end gap-1.5 h-12">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-sm bar-animated"
            style={{
              height: `${Math.max((v / max) * 40, 2)}px`,
              background: i === data.length - 1 ? color : `${color}44`,
              animationDelay: `${i * 0.08}s`,
              transformOrigin: "bottom",
            }}
          />
          <span style={{ fontSize: "8px", color: "var(--txt-4)", fontWeight: 600 }}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* Credit donut */
function CreditRing({ used, total }: { used: number; total: number }) {
  const pct = Math.min(used / total, 1);
  const r = 26, cx = 32, cy = 32;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);

  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-4)" strokeWidth="5"/>
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 1s var(--ease-out)" }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="white">
        {total - used}
      </text>
    </svg>
  );
}

export default function DashboardMain({ prenom, greeting, createdAt, derniersBiens }: Props) {
  const [data, setData] = useState<StoredData>({
    biens: 0, campagnes: 0, visuels: 0, dernierTitre: null, derniereVille: null,
  });

  useEffect(() => {
    const resultat = localStorage.getItem("studio_immo_resultat");
    const bien = localStorage.getItem("studio_immo_bien");

    if (resultat) {
      try {
        const parsed = JSON.parse(resultat);
        const bienData = bien ? JSON.parse(bien) : null;
        const nbCampagnes = parsed?.publications?.length ?? 0;
        setData({
          biens: 1,
          campagnes: nbCampagnes,
          visuels: nbCampagnes * 2,
          dernierTitre: bienData?.titre ?? null,
          derniereVille: bienData?.ville ?? null,
        });
      } catch { /* ignore */ }
    }
  }, []);

  const weekData = [0, 0, 0, data.campagnes > 0 ? 2 : 0, data.campagnes, data.campagnes, data.campagnes];

  const STATS = [
    {
      label: "Biens traités",
      value: data.biens,
      sub: data.biens === 0 ? "Créez votre premier bien" : `${data.biens} mandat actif`,
      color: "var(--gold)",
      chart: <Sparkline data={[0,0,0,0,1,1,data.biens]} color="var(--gold)" />,
      href: "/dashboard/biens",
    },
    {
      label: "Campagnes IA",
      value: data.campagnes,
      sub: "Facebook & Instagram",
      color: "#818cf8",
      chart: <Sparkline data={[0,0,1,1,data.campagnes,data.campagnes,data.campagnes]} color="#818cf8" />,
      href: "/dashboard/statistiques",
    },
    {
      label: "Visuels générés",
      value: data.visuels,
      sub: "PNG 1080×1350 px",
      color: "#34d399",
      chart: <Sparkline data={[0,0,2,2,data.visuels,data.visuels,data.visuels]} color="#34d399" />,
      href: "/dashboard/statistiques",
    },
    {
      label: "Crédits restants",
      value: Math.max(10 - data.campagnes, 0),
      sub: "sur 10 ce mois",
      color: "var(--gold)",
      chart: <CreditRing used={data.campagnes} total={10} />,
      href: "/dashboard/abonnement",
    },
  ];

  return (
    <main className="flex-1 px-6 py-8 lg:px-8 space-y-8">
      <div style={{ maxWidth: "1100px" }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p style={{ fontSize: "13px", color: "var(--txt-4)", fontWeight: 500 }}>{greeting},</p>
            <h1 className="font-bold text-white tracking-tight" style={{ fontSize: "clamp(22px, 2.5vw, 30px)", letterSpacing: "-0.025em" }}>
              {prenom}
            </h1>
            {createdAt && (
              <p style={{ fontSize: "11.5px", color: "var(--txt-4)", marginTop: "2px" }}>Membre depuis le {createdAt}</p>
            )}
          </div>
          <Link href="/nouveau-bien" className="btn btn-primary hidden lg:inline-flex" style={{ padding: "10px 18px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouveau bien
          </Link>
        </div>

        {/* ── Stats cards ─────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {STATS.map(({ label, value, sub, color, chart, href }) => (
            <Link key={label} href={href} className="card p-5 block group" style={{ cursor: "pointer" }}>
              <div className="flex items-start justify-between mb-4">
                <p className="label" style={{ color: "var(--txt-4)" }}>{label}</p>
              </div>
              <p
                className="font-bold text-white tabular-nums mb-1 tracking-tight stat-number"
                style={{ fontSize: "38px", lineHeight: 1, color }}
              >
                {value}
              </p>
              <p style={{ fontSize: "11.5px", color: "var(--txt-4)", marginBottom: "12px" }}>{sub}</p>
              <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                {chart}
              </div>
            </Link>
          ))}
        </div>

        {/* ── Main grid ───────────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Activity chart */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-white" style={{ fontSize: "14px" }}>Activité cette semaine</h2>
                <p style={{ fontSize: "12px", color: "var(--txt-4)", marginTop: "2px" }}>Campagnes générées par jour</p>
              </div>
              <div className="badge badge-gold">{data.campagnes} total</div>
            </div>
            <BarChart data={weekData} color="var(--gold)" />
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h2 className="font-semibold text-white mb-4" style={{ fontSize: "14px" }}>Actions rapides</h2>
            <div className="space-y-2">
              {[
                { href: "/nouveau-bien", label: "Nouveau bien", icon: "🏠", desc: "Générer une stratégie" },
                { href: "/dashboard/biens", label: "Mes biens", icon: "📋", desc: "Voir tous les biens" },
                { href: "/dashboard/statistiques", label: "Statistiques", icon: "📊", desc: "Suivre l'activité" },
                { href: "/dashboard/abonnement", label: "Mon plan", icon: "⭐", desc: "Gérer l'abonnement" },
              ].map(({ href, label, icon, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 group"
                  style={{ background: "var(--bg-2)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-3)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-2)")}
                >
                  <span style={{ fontSize: "16px" }}>{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate" style={{ fontSize: "13px" }}>{label}</p>
                    <p style={{ fontSize: "11px", color: "var(--txt-4)" }}>{desc}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--txt-4)" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Derniers biens + onboarding ─────────────────────── */}
        {derniersBiens.length === 0 ? (
          <div
            className="mt-5 rounded-2xl p-8"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 100%)",
              border: "1px solid var(--gold-20)",
            }}
          >
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="label mb-3" style={{ color: "var(--gold)" }}>Démarrage rapide</p>
                <h2 className="font-bold text-white mb-2" style={{ fontSize: "20px" }}>
                  Créez votre première stratégie
                </h2>
                <p style={{ fontSize: "13px", color: "var(--txt-3)", lineHeight: 1.7, marginBottom: "20px" }}>
                  Renseignez un mandat et l'IA génère en 15 secondes une stratégie complète avec
                  5 campagnes, 10 publications et des visuels prêts à publier.
                </p>
                <Link href="/nouveau-bien" className="btn btn-primary" style={{ padding: "11px 20px" }}>
                  Créer mon premier bien →
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: "01", title: "Saisissez le bien", desc: "Titre, ville, prix, description" },
                  { n: "02", title: "IA génère", desc: "5 campagnes en 15s" },
                  { n: "03", title: "Publiez", desc: "Copiez & téléchargez" },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="rounded-xl p-3 text-center" style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}>
                    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg font-bold text-xs"
                         style={{ background: "var(--gold-10)", color: "var(--gold)", border: "1px solid var(--gold-20)" }}>
                      {n}
                    </div>
                    <p className="font-semibold text-white" style={{ fontSize: "11px" }}>{title}</p>
                    <p style={{ fontSize: "10px", color: "var(--txt-4)", marginTop: "2px" }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white" style={{ fontSize: "14px" }}>Derniers biens traités</h2>
              <Link href="/dashboard/biens" className="badge badge-gold text-xs" style={{ cursor: "pointer" }}>
                Voir tous →
              </Link>
            </div>
            <div className="space-y-3">
              {derniersBiens.map((bien) => (
                <div
                  key={bien.id}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}
                >
                  {/* Photo */}
                  {bien.photo_principale_url ? (
                    <img
                      src={bien.photo_principale_url}
                      alt={bien.titre}
                      className="h-14 w-20 flex-shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-14 w-20 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "var(--bg-3)", border: "1px solid var(--border-s)" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--txt-4)" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                  )}

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate" style={{ fontSize: "13px" }}>{bien.titre}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {bien.ville && (
                        <span style={{ fontSize: "11px", color: "var(--txt-4)" }}>📍 {bien.ville}</span>
                      )}
                      {bien.surface && (
                        <span className="rounded-full px-2 py-0.5 font-semibold" style={{ fontSize: "10px", background: "var(--gold-10)", color: "var(--gold)", border: "1px solid var(--gold-20)" }}>
                          {bien.surface}
                        </span>
                      )}
                      {bien.prix && (
                        <span className="rounded-full px-2 py-0.5 font-semibold" style={{ fontSize: "10px", background: "var(--gold-10)", color: "var(--gold)", border: "1px solid var(--gold-20)" }}>
                          {bien.prix}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Statut */}
                  {bien.latestGenId ? (
                    <span
                      className="flex-shrink-0 rounded-full px-2.5 py-1 font-semibold"
                      style={{ fontSize: "10px", background: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.2)", whiteSpace: "nowrap" }}
                    >
                      Campagne générée
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
