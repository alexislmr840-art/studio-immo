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
  const w = 100, h = 36;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 6) - 3;
    return `${x},${y}`;
  }).join(" ");
  const area = `${0},${h} ${pts} ${w},${h}`;
  const gradId = `sg-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - (data[data.length - 1] / max) * (h - 6) - 3} r="2.5" fill={color} />
    </svg>
  );
}

/* ── CreditRing ──────────────────────────────────────────────── */
function CreditRing({ used, total }: { used: number; total: number }) {
  const pct = Math.min(used / total, 1);
  const r = 26, cx = 32, cy = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#7C3AED" strokeWidth="5" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="white">{total - used}</text>
    </svg>
  );
}

/* ── Stat icons ──────────────────────────────────────────────── */
function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IconImage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/* ── Quick actions ───────────────────────────────────────────── */
const QUICK_ACTIONS = [
  {
    href: "/nouveau-bien", label: "Nouveau bien",
    icon: <IconHome />, accent: true,
  },
  {
    href: "/dashboard/biens", label: "Mes biens",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ), accent: false,
  },
  {
    href: "/dashboard/statistiques", label: "Statistiques",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ), accent: false,
  },
  {
    href: "/dashboard/abonnement", label: "Mon plan",
    icon: <IconStar />, accent: false,
  },
];

/* ── Card base style ─────────────────────────────────────────── */
const cardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "16px",
};

/* ── Main component ──────────────────────────────────────────── */
export default function DashboardMain({ prenom, greeting, createdAt, derniersBiens, stats }: Props) {

  const STATS = [
    {
      label: "Biens traités",
      value: stats.biens,
      sub: stats.biens === 0 ? "Créez votre premier bien" : `${stats.biens} mandat${stats.biens > 1 ? "s" : ""} actif${stats.biens > 1 ? "s" : ""}`,
      color: "#7C3AED",
      icon: <IconHome />,
      chart: <Sparkline data={[0, 0, 0, 0, 1, 1, stats.biens]} color="#7C3AED" />,
      href: "/dashboard/biens",
    },
    {
      label: "Campagnes IA",
      value: stats.campagnes,
      sub: "Facebook & Instagram",
      color: "#3b82f6",
      icon: <IconBolt />,
      chart: <Sparkline data={[0, 0, 1, 1, stats.campagnes, stats.campagnes, stats.campagnes]} color="#3b82f6" />,
      href: "/dashboard/statistiques",
    },
    {
      label: "Visuels générés",
      value: stats.visuels,
      sub: "PNG 1080×1350 px",
      color: "#06b6d4",
      icon: <IconImage />,
      chart: <Sparkline data={[0, 0, 2, 2, stats.visuels, stats.visuels, stats.visuels]} color="#06b6d4" />,
      href: "/dashboard/statistiques",
    },
    {
      label: "Crédits restants",
      value: stats.credits,
      sub: "disponibles ce mois",
      color: "#a78bfa",
      icon: <IconStar />,
      chart: <CreditRing used={Math.max(500 - stats.credits, 0)} total={500} />,
      href: "/dashboard/abonnement",
    },
  ];

  return (
    <main
      className="flex-1 px-6 py-8 lg:px-8"
      style={{ background: "#0a0a0f", minHeight: "100vh" }}
    >
      <div style={{ maxWidth: "1100px" }} className="space-y-8">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {greeting}
            </p>
            <h1
              className="font-black text-white"
              style={{ fontSize: "clamp(26px, 3vw, 38px)", letterSpacing: "-0.035em", lineHeight: 1.1, marginTop: "4px" }}
            >
              {prenom}
            </h1>
            {createdAt && (
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)", marginTop: "6px" }}>
                Membre depuis le {createdAt}
              </p>
            )}
          </div>
          <Link
            href="/nouveau-bien"
            className="hidden lg:inline-flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #6d28d9)",
              color: "white",
              borderRadius: "12px",
              padding: "11px 20px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 0 28px rgba(124,58,237,0.35)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouveau bien
          </Link>
        </div>

        {/* ── Stats cards ────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ label, value, sub, color, icon, chart, href }) => (
            <Link
              key={label}
              href={href}
              className="block group"
              style={{ ...cardStyle, padding: "20px", textDecoration: "none" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${color}20`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Icon + label */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width: "38px", height: "38px", background: `${color}18`, color, flexShrink: 0 }}
                >
                  {icon}
                </div>
                <p style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "right", marginTop: "2px" }}>
                  {label}
                </p>
              </div>

              {/* Value */}
              <p
                className="font-black tabular-nums"
                style={{ fontSize: "42px", lineHeight: 1, color, letterSpacing: "-0.04em", marginBottom: "4px" }}
              >
                {value}
              </p>
              <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.32)", marginBottom: "16px" }}>{sub}</p>

              {/* Chart */}
              <div className="opacity-55 group-hover:opacity-100 transition-opacity">{chart}</div>
            </Link>
          ))}
        </div>

        {/* ── Main block ─────────────────────────────────────── */}
        {derniersBiens.length === 0 ? (

          /* Onboarding */
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(59,130,246,0.04) 100%)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "20px",
              padding: "40px",
            }}
          >
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-5"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", fontSize: "11px", color: "#a78bfa", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Démarrage rapide
                </div>
                <h2 className="font-bold text-white mb-3" style={{ fontSize: "22px", letterSpacing: "-0.025em" }}>
                  Créez votre première stratégie
                </h2>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "24px" }}>
                  Renseignez un mandat et l'IA génère en 15 secondes une stratégie complète avec
                  5 campagnes, 10 publications et des visuels prêts à publier.
                </p>
                <Link
                  href="/nouveau-bien"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "linear-gradient(135deg, #7C3AED, #6d28d9)",
                    color: "white",
                    borderRadius: "12px",
                    padding: "12px 22px",
                    fontSize: "13px",
                    fontWeight: 600,
                    textDecoration: "none",
                    boxShadow: "0 0 28px rgba(124,58,237,0.4)",
                  }}
                >
                  Créer mon premier bien
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: "01", title: "Saisissez le bien", desc: "Titre, ville, prix, description" },
                  { n: "02", title: "IA génère",         desc: "5 campagnes en 15s" },
                  { n: "03", title: "Publiez",           desc: "Copiez & téléchargez" },
                ].map(({ n, title, desc }) => (
                  <div
                    key={n}
                    className="rounded-xl p-4 text-center"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl font-bold"
                      style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)", fontSize: "13px" }}
                    >
                      {n}
                    </div>
                    <p className="font-semibold text-white" style={{ fontSize: "11.5px" }}>{title}</p>
                    <p style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)", marginTop: "3px" }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        ) : (

          /* Derniers biens + actions rapides */
          <div className="grid gap-5 lg:grid-cols-3">

            {/* ── Mes derniers biens ─ 2 cols ───────────────── */}
            <div style={{ ...cardStyle, padding: "24px" }} className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-white" style={{ fontSize: "15px", letterSpacing: "-0.015em" }}>
                    Mes derniers biens
                  </h2>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
                    {derniersBiens.length} bien{derniersBiens.length > 1 ? "s" : ""} récent{derniersBiens.length > 1 ? "s" : ""}
                  </p>
                </div>
                <Link
                  href="/dashboard/biens"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11.5px",
                    color: "#a78bfa",
                    fontWeight: 600,
                    textDecoration: "none",
                    background: "rgba(124,58,237,0.1)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: "8px",
                    padding: "5px 10px",
                  }}
                >
                  Voir tous
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              {/* Table header */}
              <div
                className="grid px-3 mb-2"
                style={{
                  gridTemplateColumns: "80px 1fr 90px 90px",
                  gap: "12px",
                  fontSize: "10.5px",
                  color: "rgba(255,255,255,0.28)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  paddingBottom: "10px",
                }}
              >
                <span>Photo</span>
                <span>Bien</span>
                <span style={{ textAlign: "center" }}>Campagnes</span>
                <span style={{ textAlign: "right" }}>Action</span>
              </div>

              <div className="space-y-1.5">
                {derniersBiens.map((bien) => (
                  <div
                    key={bien.id}
                    className="grid items-center rounded-xl px-3 py-3"
                    style={{
                      gridTemplateColumns: "80px 1fr 90px 90px",
                      gap: "12px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.06)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  >
                    {/* Photo */}
                    {bien.photo_principale_url ? (
                      <img
                        src={bien.photo_principale_url}
                        alt={bien.titre}
                        className="rounded-lg object-cover flex-shrink-0"
                        style={{ height: "52px", width: "80px" }}
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ height: "52px", width: "80px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                          <path d="M9 21V12h6v9" />
                        </svg>
                      </div>
                    )}

                    {/* Infos */}
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate" style={{ fontSize: "13px" }}>{bien.titre}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {bien.ville && (
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)" }}>
                            {bien.ville}
                          </span>
                        )}
                        {bien.surface && (
                          <span
                            className="rounded-full px-2 py-0.5 font-semibold"
                            style={{ fontSize: "10px", background: "rgba(59,130,246,0.12)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" }}
                          >
                            {bien.surface}
                          </span>
                        )}
                      </div>
                      {bien.createdAt && (
                        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.22)", marginTop: "3px" }}>
                          {new Date(bien.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>

                    {/* Badge campagnes */}
                    <div style={{ textAlign: "center" }}>
                      {bien.latestGenId ? (
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold"
                          style={{ fontSize: "10.5px", background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }}
                        >
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          5 camps.
                        </span>
                      ) : (
                        <span
                          className="inline-flex rounded-full px-2.5 py-1 font-semibold"
                          style={{ fontSize: "10.5px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.28)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          —
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div style={{ textAlign: "right" }}>
                      {bien.latestGenId ? (
                        <Link
                          href={`/biens/${bien.id}/generations/${bien.latestGenId}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            background: "linear-gradient(135deg, #7C3AED, #6d28d9)",
                            color: "white",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            fontSize: "11px",
                            fontWeight: 600,
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Voir
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                          </svg>
                        </Link>
                      ) : (
                        <Link
                          href={`/biens/${bien.id}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.45)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            fontSize: "11px",
                            fontWeight: 600,
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Ouvrir
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Colonne droite ─────────────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* Actions rapides */}
              <div style={{ ...cardStyle, padding: "20px", flex: 1 }}>
                <h2 className="font-bold text-white mb-4" style={{ fontSize: "13px", letterSpacing: "-0.01em" }}>
                  Actions rapides
                </h2>
                <div className="space-y-1.5">
                  {QUICK_ACTIONS.map(({ href, label, icon, accent }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 rounded-xl group"
                      style={{
                        padding: "10px 12px",
                        background: accent ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
                        border: accent ? "1px solid rgba(124,58,237,0.2)" : "1px solid rgba(255,255,255,0.05)",
                        textDecoration: "none",
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = accent ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.06)";
                        el.style.borderColor = accent ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.1)";
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = accent ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)";
                        el.style.borderColor = accent ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)";
                      }}
                    >
                      <span style={{ color: accent ? "#a78bfa" : "rgba(255,255,255,0.45)", flexShrink: 0 }}>{icon}</span>
                      <span className="flex-1 font-semibold" style={{ fontSize: "12.5px", color: accent ? "white" : "rgba(255,255,255,0.65)" }}>
                        {label}
                      </span>
                      <svg
                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-4 pt-4 lg:hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <Link
                    href="/nouveau-bien"
                    className="flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #6d28d9)",
                      color: "white",
                      borderRadius: "10px",
                      padding: "11px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    + Nouveau bien
                  </Link>
                </div>
              </div>

              {/* Crédit ring */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, #16213e 100%)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: "16px",
                  padding: "20px",
                }}
              >
                <p className="font-bold text-white mb-1" style={{ fontSize: "13px" }}>Crédits restants</p>
                <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.35)", marginBottom: "16px" }}>
                  Ce mois-ci
                </p>
                <div className="flex items-center gap-4">
                  <CreditRing used={Math.max(500 - stats.credits, 0)} total={500} />
                  <div>
                    <p className="font-black text-white" style={{ fontSize: "30px", lineHeight: 1, letterSpacing: "-0.035em" }}>
                      {stats.credits}
                    </p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.32)", marginTop: "2px" }}>
                      sur 500 dispo.
                    </p>
                    <Link
                      href="/dashboard/abonnement"
                      style={{ fontSize: "11px", color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}
                    >
                      Voir le plan →
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}
