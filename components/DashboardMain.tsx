"use client";

import Link from "next/link";

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
  derniersBiens: BienDashboard[];
  stats: Stats;
}

/* ── Sparkline ───────────────────────────────────────────────── */
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
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#grad-${color.replace("#","")})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="path-draw"/>
      <circle cx={w} cy={h - (data[data.length - 1] / max) * (h - 4) - 2} r="3" fill={color}/>
    </svg>
  );
}

/* ── CreditRing ──────────────────────────────────────────────── */
function CreditRing({ used, total }: { used: number; total: number }) {
  const pct = Math.min(used / total, 1);
  const r = 26, cx = 32, cy = 32;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-4)" strokeWidth="5"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--gold)" strokeWidth="5" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 1s var(--ease-out)" }}/>
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="white">{total - used}</text>
    </svg>
  );
}

/* ── Quick actions data ──────────────────────────────────────── */
const QUICK_ACTIONS = [
  { href: "/nouveau-bien", label: "Nouveau bien",    icon: "🏠" },
  { href: "/dashboard/biens",       label: "Mes biens",      icon: "📋" },
  { href: "/dashboard/statistiques", label: "Statistiques",  icon: "📊" },
  { href: "/dashboard/abonnement",  label: "Mon plan",       icon: "⭐" },
];

/* ── Main component ──────────────────────────────────────────── */
export default function DashboardMain({ prenom, greeting, createdAt, derniersBiens, stats }: Props) {
  const STATS = [
    {
      label: "Biens traités",
      value: stats.biens,
      sub: stats.biens === 0 ? "Créez votre premier bien" : `${stats.biens} mandat${stats.biens > 1 ? "s" : ""} actif${stats.biens > 1 ? "s" : ""}`,
      color: "var(--gold)",
      chart: <Sparkline data={[0, 0, 0, 0, 1, 1, stats.biens]} color="var(--gold)" />,
      href: "/dashboard/biens",
    },
    {
      label: "Campagnes IA",
      value: stats.campagnes,
      sub: "Facebook & Instagram",
      color: "#818cf8",
      chart: <Sparkline data={[0, 0, 1, 1, stats.campagnes, stats.campagnes, stats.campagnes]} color="#818cf8" />,
      href: "/dashboard/statistiques",
    },
    {
      label: "Visuels générés",
      value: stats.visuels,
      sub: "PNG 1080×1350 px",
      color: "#34d399",
      chart: <Sparkline data={[0, 0, 2, 2, stats.visuels, stats.visuels, stats.visuels]} color="#34d399" />,
      href: "/dashboard/statistiques",
    },
    {
      label: "Crédits restants",
      value: stats.credits,
      sub: "disponibles",
      color: "var(--gold)",
      chart: <CreditRing used={Math.max(500 - stats.credits, 0)} total={500} />,
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

        {/* ── Stats cards ────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {STATS.map(({ label, value, sub, color, chart, href }) => (
            <Link key={label} href={href} className="card p-5 block group" style={{ cursor: "pointer" }}>
              <div className="flex items-start justify-between mb-4">
                <p className="label" style={{ color: "var(--txt-4)" }}>{label}</p>
              </div>
              <p className="font-bold text-white tabular-nums mb-1 tracking-tight stat-number"
                 style={{ fontSize: "38px", lineHeight: 1, color }}>
                {value}
              </p>
              <p style={{ fontSize: "11.5px", color: "var(--txt-4)", marginBottom: "12px" }}>{sub}</p>
              <div className="opacity-70 group-hover:opacity-100 transition-opacity">{chart}</div>
            </Link>
          ))}
        </div>

        {/* ── Derniers biens + Actions rapides / Onboarding ──── */}
        {derniersBiens.length === 0 ? (

          /* Onboarding */
          <div className="rounded-2xl p-8" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 100%)", border: "1px solid var(--gold-20)" }}>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="label mb-3" style={{ color: "var(--gold)" }}>Démarrage rapide</p>
                <h2 className="font-bold text-white mb-2" style={{ fontSize: "20px" }}>Créez votre première stratégie</h2>
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
                  { n: "02", title: "IA génère",         desc: "5 campagnes en 15s" },
                  { n: "03", title: "Publiez",           desc: "Copiez & téléchargez" },
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

          /* Derniers biens + actions rapides */
          <div className="grid gap-5 lg:grid-cols-3">

            {/* ── Mes derniers biens ─ 2 cols ───────────────── */}
            <div className="card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-white" style={{ fontSize: "14px" }}>Mes derniers biens</h2>
                  <p style={{ fontSize: "12px", color: "var(--txt-4)", marginTop: "2px" }}>
                    {derniersBiens.length} bien{derniersBiens.length > 1 ? "s" : ""} récent{derniersBiens.length > 1 ? "s" : ""}
                  </p>
                </div>
                <Link href="/dashboard/biens" className="badge badge-gold" style={{ cursor: "pointer", fontSize: "11px" }}>
                  Voir tous →
                </Link>
              </div>

              <div className="space-y-3">
                {derniersBiens.map((bien) => (
                  <div
                    key={bien.id}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors"
                    style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--gold-20)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-s)")}
                  >
                    {/* Photo */}
                    {bien.photo_principale_url ? (
                      <img
                        src={bien.photo_principale_url}
                        alt={bien.titre}
                        className="flex-shrink-0 rounded-lg object-cover"
                        style={{ height: "60px", width: "88px" }}
                      />
                    ) : (
                      <div
                        className="flex flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ height: "60px", width: "88px", background: "var(--bg-3)", border: "1px solid var(--border-s)" }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--txt-4)" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                          <path d="M9 21V12h6v9"/>
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
                          <span className="rounded-full px-2 py-0.5 font-semibold"
                                style={{ fontSize: "10px", background: "var(--gold-10)", color: "var(--gold)", border: "1px solid var(--gold-20)" }}>
                            {bien.surface}
                          </span>
                        )}
                      </div>
                      {bien.createdAt && (
                        <p style={{ fontSize: "10.5px", color: "var(--txt-4)", marginTop: "3px" }}>
                          Ajouté le {new Date(bien.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex-shrink-0">
                      {bien.latestGenId ? (
                        <Link
                          href={`/biens/${bien.id}/generations/${bien.latestGenId}`}
                          className="btn btn-primary"
                          style={{ padding: "6px 12px", fontSize: "11px", whiteSpace: "nowrap" }}
                        >
                          Voir les résultats
                        </Link>
                      ) : (
                        <Link
                          href={`/biens/${bien.id}`}
                          className="btn"
                          style={{ padding: "6px 12px", fontSize: "11px", whiteSpace: "nowrap", background: "var(--bg-3)", color: "var(--txt-2)", border: "1px solid var(--border)" }}
                        >
                          Voir le bien
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Actions rapides compactes ─ 1 col ─────────── */}
            <div className="card p-4">
              <h2 className="font-semibold text-white mb-3" style={{ fontSize: "13px" }}>Actions rapides</h2>
              <div className="space-y-1">
                {QUICK_ACTIONS.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 group transition-all duration-150"
                    style={{ background: "var(--bg-2)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-3)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-2)")}
                  >
                    <span style={{ fontSize: "14px", lineHeight: 1 }}>{icon}</span>
                    <span className="flex-1 font-medium text-white" style={{ fontSize: "12.5px" }}>{label}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--txt-4)" strokeWidth="2" strokeLinecap="round"
                         className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Link>
                ))}
              </div>

              {/* Séparateur + nouveau bien CTA mobile */}
              <div className="mt-4 pt-4 lg:hidden" style={{ borderTop: "1px solid var(--border-s)" }}>
                <Link href="/nouveau-bien" className="btn btn-primary w-full" style={{ padding: "10px", fontSize: "12px", textAlign: "center" }}>
                  + Nouveau bien
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
