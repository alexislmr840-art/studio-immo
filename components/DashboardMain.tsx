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

/* ── Bar chart ────────────────────────────────────────────── */
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
              background: i === data.length - 1 ? color : `${color}40`,
              animationDelay: `${i * 0.08}s`,
              transformOrigin: "bottom",
            }}
          />
          <span style={{ fontSize: "8px", color: "#9CA3AF", fontWeight: 600 }}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Credit donut ─────────────────────────────────────────── */
function CreditRing({ used, total }: { used: number; total: number }) {
  const pct = Math.min(used / total, 1);
  const r = 26, cx = 32, cy = 32;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);

  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDE9FE" strokeWidth="6" />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#7C3AED"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="#111827">
        {total - used}
      </text>
    </svg>
  );
}

/* ── Stat icon chips ──────────────────────────────────────── */
const IconHouse = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconImage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

/* ── Styles constants ─────────────────────────────────────── */
const card: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "14px",
  border: "1px solid #E5E7EB",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
};

export default function DashboardMain({ prenom, greeting, createdAt, derniersBiens, stats }: Props) {
  const weekData = [0, 0, 0, stats.campagnes > 0 ? 2 : 0, stats.campagnes, stats.campagnes, stats.campagnes];

  const STATS = [
    {
      label: "Biens traités",
      value: stats.biens,
      sub: stats.biens === 0 ? "Créez votre premier bien" : `${stats.biens} mandat${stats.biens > 1 ? "s" : ""} actif${stats.biens > 1 ? "s" : ""}`,
      color: "#7C3AED",
      iconBg: "#EDE9FE",
      icon: <IconHouse />,
      chart: null,
      href: "/dashboard/biens",
    },
    {
      label: "Campagnes IA",
      value: stats.campagnes,
      sub: "Facebook & Instagram",
      color: "#6366F1",
      iconBg: "#EEF2FF",
      icon: <IconStar />,
      chart: null,
      href: "/dashboard/statistiques",
    },
    {
      label: "Visuels générés",
      value: stats.visuels,
      sub: "PNG 1080×1350 px",
      color: "#059669",
      iconBg: "#D1FAE5",
      icon: <IconImage />,
      chart: null,
      href: "/dashboard/statistiques",
    },
    {
      label: "Crédits restants",
      value: stats.credits,
      sub: "disponibles",
      color: "#7C3AED",
      iconBg: "#EDE9FE",
      icon: <IconZap />,
      chart: <CreditRing used={Math.max(500 - stats.credits, 0)} total={500} />,
      href: "/dashboard/abonnement",
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto" style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <div className="px-6 py-8 lg:px-10" style={{ maxWidth: "1140px" }}>

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p style={{ fontSize: "13px", color: "#6B7280", fontWeight: 500, marginBottom: "4px" }}>
              {greeting},
            </p>
            <h1 style={{ fontSize: "clamp(22px, 2.5vw, 30px)", fontWeight: 700, color: "#111827", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              {prenom} 👋
            </h1>
            {createdAt && (
              <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                Membre depuis le {createdAt}
              </p>
            )}
          </div>
          <Link
            href="/nouveau-bien"
            className="hidden lg:inline-flex items-center gap-2"
            style={{
              background: "#7C3AED",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "14px",
              padding: "10px 20px",
              borderRadius: "10px",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouveau bien
          </Link>
        </div>

        {/* ── Stats cards ─────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {STATS.map(({ label, value, sub, color, iconBg, icon, chart, href }) => (
            <Link
              key={label}
              href={href}
              style={{ ...card, padding: "20px", display: "block", textDecoration: "none", transition: "box-shadow 0.2s ease, transform 0.2s ease" }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = card.boxShadow as string;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {icon}
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#111827", lineHeight: 1, letterSpacing: "-0.04em", marginBottom: "6px" }}>
                {value.toLocaleString("fr-FR")}
              </p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "2px" }}>{label}</p>
              <p style={{ fontSize: "11.5px", color: "#9CA3AF" }}>{sub}</p>
              {chart && (
                <div style={{ marginTop: "14px" }}>
                  {chart}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* ── Main grid ───────────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-3 mb-5">

          {/* Activity chart */}
          <div className="lg:col-span-2" style={{ ...card, padding: "24px" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111827" }}>Activité cette semaine</h2>
                <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "3px" }}>Campagnes générées par jour</p>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#7C3AED", background: "#EDE9FE", padding: "4px 12px", borderRadius: "20px" }}>
                {stats.campagnes} total
              </span>
            </div>
            <BarChart data={weekData} color="#7C3AED" />
          </div>

          {/* Quick actions */}
          <div style={{ ...card, padding: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", marginBottom: "14px" }}>Actions rapides</h2>
            <div className="space-y-1.5">
              {[
                {
                  href: "/nouveau-bien",
                  label: "Nouveau bien",
                  desc: "Générer une stratégie",
                  iconBg: "#EDE9FE",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                },
                {
                  href: "/dashboard/biens",
                  label: "Mes biens",
                  desc: "Voir tous les biens",
                  iconBg: "#EEF2FF",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
                },
                {
                  href: "/dashboard/statistiques",
                  label: "Statistiques",
                  desc: "Suivre l'activité",
                  iconBg: "#D1FAE5",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
                },
                {
                  href: "/dashboard/abonnement",
                  label: "Mon plan",
                  desc: "Gérer l'abonnement",
                  iconBg: "#FEF3C7",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                },
              ].map(({ href, label, desc, iconBg, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-xl group"
                  style={{ padding: "10px 10px", textDecoration: "none", transition: "background 0.12s", border: "1px solid transparent", borderRadius: "10px" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#F5F3FF";
                    e.currentTarget.style.borderColor = "#EDE9FE";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{label}</p>
                    <p style={{ fontSize: "11px", color: "#9CA3AF" }}>{desc}</p>
                  </div>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Derniers biens / Onboarding ─────────────────────── */}
        {derniersBiens.length === 0 ? (

          /* Onboarding banner */
          <div style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)", borderRadius: "16px", padding: "40px 40px", overflow: "hidden", position: "relative" }}>
            {/* Decorative blobs */}
            <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-60px", right: "120px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

            <div className="grid gap-8 lg:grid-cols-2 lg:items-center" style={{ position: "relative" }}>
              <div>
                <span style={{ display: "inline-block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C4B5FD", background: "rgba(255,255,255,0.12)", padding: "4px 12px", borderRadius: "20px", marginBottom: "18px" }}>
                  Démarrage rapide
                </span>
                <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff", lineHeight: 1.35, marginBottom: "12px" }}>
                  Créez votre première stratégie
                </h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: "24px" }}>
                  Renseignez un mandat et l'IA génère en 15 secondes une stratégie complète avec
                  5 campagnes, 10 publications et des visuels prêts à publier.
                </p>
                <Link
                  href="/nouveau-bien"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#ffffff",
                    color: "#7C3AED",
                    fontWeight: 700,
                    fontSize: "14px",
                    padding: "12px 24px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Créer mon premier bien →
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: "01", title: "Saisissez le bien", desc: "Titre, ville, prix, description" },
                  { n: "02", title: "IA génère", desc: "5 campagnes en 15s" },
                  { n: "03", title: "Publiez", desc: "Copiez & téléchargez" },
                ].map(({ n, title, desc }) => (
                  <div
                    key={n}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      padding: "16px 12px",
                      textAlign: "center",
                      border: "1px solid rgba(255,255,255,0.15)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: "11px", fontWeight: 800, color: "#ffffff" }}>
                      {n}
                    </div>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>{title}</p>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        ) : (

          /* Derniers biens */
          <div style={{ ...card, padding: "24px" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111827" }}>Derniers biens traités</h2>
                <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>{derniersBiens.length} bien{derniersBiens.length > 1 ? "s" : ""} récent{derniersBiens.length > 1 ? "s" : ""}</p>
              </div>
              <Link
                href="/dashboard/biens"
                style={{ fontSize: "12px", fontWeight: 600, color: "#7C3AED", textDecoration: "none", background: "#EDE9FE", padding: "5px 14px", borderRadius: "20px", transition: "background 0.12s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#DDD6FE")}
                onMouseLeave={e => (e.currentTarget.style.background = "#EDE9FE")}
              >
                Voir tous →
              </Link>
            </div>

            <div className="space-y-2.5">
              {derniersBiens.map((bien) => (
                <div
                  key={bien.id}
                  className="flex items-center gap-4"
                  style={{ padding: "12px 14px", borderRadius: "10px", background: "#F9FAFB", border: "1px solid #F3F4F6", transition: "background 0.12s, border-color 0.12s" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#F5F3FF";
                    e.currentTarget.style.borderColor = "#EDE9FE";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#F9FAFB";
                    e.currentTarget.style.borderColor = "#F3F4F6";
                  }}
                >
                  {/* Photo */}
                  {bien.photo_principale_url ? (
                    <img
                      src={bien.photo_principale_url}
                      alt={bien.titre}
                      style={{ height: "52px", width: "76px", flexShrink: 0, borderRadius: "8px", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ height: "52px", width: "76px", flexShrink: 0, borderRadius: "8px", background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                  )}

                  {/* Infos */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "5px" }}>
                      {bien.titre}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {bien.ville && (
                        <span style={{ fontSize: "11px", color: "#6B7280", display: "flex", alignItems: "center", gap: "3px" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {bien.ville}
                        </span>
                      )}
                      {bien.surface && (
                        <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#7C3AED", background: "#EDE9FE", padding: "2px 8px", borderRadius: "20px" }}>
                          {bien.surface}
                        </span>
                      )}
                      {bien.prix && (
                        <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#7C3AED", background: "#EDE9FE", padding: "2px 8px", borderRadius: "20px" }}>
                          {bien.prix}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Statut */}
                  {bien.latestGenId ? (
                    <span style={{ flexShrink: 0, fontSize: "11px", fontWeight: 600, color: "#059669", background: "#D1FAE5", padding: "4px 10px", borderRadius: "20px", whiteSpace: "nowrap", border: "1px solid #A7F3D0" }}>
                      ✓ Campagne générée
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
