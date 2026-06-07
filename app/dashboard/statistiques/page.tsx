"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StatData {
  biens: number;
  campagnes: number;
  publications: number;
  visuels: number;
  dernierTitre: string | null;
  derniereVille: string | null;
}

function DonutChart({ value, total, color }: { value: number; total: number; color: string }) {
  const r = 38, cx = 48, cy = 48, circumference = 2 * Math.PI * r;
  const pct = Math.min(value / Math.max(total, 1), 1);
  const offset = circumference * (1 - pct);

  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-4)" strokeWidth="8"/>
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 1s var(--ease-out)" }}
      />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="16" fontWeight="800" fill="white">{value}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="var(--txt-4)" fontWeight="600">/ {total}</text>
    </svg>
  );
}

function BarChartFull({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
          <span style={{ fontSize: "10px", color: "var(--txt-4)", fontWeight: 600 }}>
            {v > 0 ? v : ""}
          </span>
          <div className="w-full flex items-end" style={{ height: "90px" }}>
            <div
              className="w-full rounded-t-md bar-animated"
              style={{
                height: `${Math.max((v / max) * 90, v > 0 ? 4 : 1)}px`,
                background: i === data.length - 1
                  ? color
                  : `linear-gradient(to top, ${color}80, ${color}30)`,
                animationDelay: `${i * 0.06}s`,
                transformOrigin: "bottom",
              }}
            />
          </div>
          <span style={{ fontSize: "9px", color: "var(--txt-4)", fontWeight: 700 }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatistiquesPage() {
  const [stats, setStats] = useState<StatData>({
    biens: 0, campagnes: 0, publications: 0, visuels: 0,
    dernierTitre: null, derniereVille: null,
  });

  useEffect(() => {
    const r = localStorage.getItem("studio_immo_resultat");
    const b = localStorage.getItem("studio_immo_bien");
    if (r) {
      try {
        const data = JSON.parse(r);
        const bienData = b ? JSON.parse(b) : null;
        const nb = data?.publications?.length ?? 0;
        setStats({
          biens: 1,
          campagnes: nb,
          publications: nb * 2,
          visuels: nb * 2,
          dernierTitre: bienData?.titre ?? null,
          derniereVille: bienData?.ville ?? null,
        });
      } catch { /* ignore */ }
    }
  }, []);

  const hasData = stats.biens > 0;
  const weekData = [0, 0, 0, 0, stats.campagnes, stats.campagnes, stats.campagnes];
  const weekLabels = ["L", "M", "M", "J", "V", "S", "D"];

  const monthData = [0, 0, 0, stats.campagnes, stats.campagnes, 0, 0, 0, 0, 0, 0, 0];
  const monthLabels = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

  return (
    <main className="flex-1 px-6 py-8 lg:px-8">
      <div style={{ maxWidth: "1000px" }}>

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="label mb-1" style={{ color: "var(--txt-4)" }}>Analyse</p>
            <h1 className="font-bold text-white tracking-tight" style={{ fontSize: "24px", letterSpacing: "-0.025em" }}>
              Statistiques
            </h1>
          </div>
          {hasData && <Link href="/resultats" className="btn btn-secondary" style={{ fontSize: "12px", padding: "8px 14px" }}>Voir résultats →</Link>}
        </div>

        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                 style={{ background: "var(--gold-10)", border: "1px solid var(--gold-20)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2" style={{ fontSize: "16px" }}>Aucune donnée disponible</h3>
            <p style={{ fontSize: "13px", color: "var(--txt-4)", maxWidth: "320px", lineHeight: 1.7, marginBottom: "20px" }}>
              Créez votre première stratégie pour que les statistiques s'affichent ici.
            </p>
            <Link href="/nouveau-bien" className="btn btn-primary">Créer un bien →</Link>
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {[
                { label: "Biens traités", value: stats.biens, color: "var(--gold)", icon: "🏠" },
                { label: "Campagnes IA", value: stats.campagnes, color: "#818cf8", icon: "🎯" },
                { label: "Publications", value: stats.publications, color: "#34d399", icon: "📝" },
                { label: "Visuels PNG", value: stats.visuels, color: "#fb923c", icon: "🖼️" },
              ].map(({ label, value, color, icon }) => (
                <div key={label} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="label" style={{ color: "var(--txt-4)" }}>{label}</p>
                    <span style={{ fontSize: "18px" }}>{icon}</span>
                  </div>
                  <p className="font-bold text-white tabular-nums" style={{ fontSize: "36px", letterSpacing: "-0.04em", lineHeight: 1, color }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid gap-5 lg:grid-cols-3 mb-6">
              {/* Weekly bar */}
              <div className="card p-5 lg:col-span-2">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-semibold text-white" style={{ fontSize: "14px" }}>Activité hebdomadaire</h2>
                    <p style={{ fontSize: "12px", color: "var(--txt-4)" }}>Campagnes générées cette semaine</p>
                  </div>
                  <div className="badge badge-gold">{stats.campagnes} total</div>
                </div>
                <BarChartFull data={weekData} labels={weekLabels} color="var(--gold)" />
              </div>

              {/* Donut */}
              <div className="card p-5 flex flex-col items-center justify-center text-center">
                <h2 className="font-semibold text-white mb-4" style={{ fontSize: "14px" }}>Crédits ce mois</h2>
                <DonutChart value={stats.campagnes} total={10} color="var(--gold)" />
                <p className="mt-3 font-semibold text-white" style={{ fontSize: "20px" }}>
                  {Math.max(10 - stats.campagnes, 0)}
                </p>
                <p style={{ fontSize: "12px", color: "var(--txt-4)", marginTop: "2px" }}>générations restantes</p>
                <Link href="/dashboard/abonnement" className="btn btn-secondary mt-4 w-full" style={{ padding: "9px", fontSize: "12px" }}>
                  Gérer le plan
                </Link>
              </div>
            </div>

            {/* Monthly bar */}
            <div className="card p-5 mb-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-semibold text-white" style={{ fontSize: "14px" }}>Activité annuelle</h2>
                  <p style={{ fontSize: "12px", color: "var(--txt-4)" }}>Campagnes par mois sur 2026</p>
                </div>
              </div>
              <BarChartFull data={monthData} labels={monthLabels} color="#818cf8" />
            </div>

            {/* Last bien */}
            {stats.dernierTitre && (
              <div className="card p-5">
                <h2 className="font-semibold text-white mb-4" style={{ fontSize: "14px" }}>Dernier bien traité</h2>
                <div className="flex items-center justify-between rounded-xl p-4"
                     style={{ background: "var(--bg-2)", border: "1px solid var(--border-s)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                         style={{ background: "var(--gold-10)", border: "1px solid var(--gold-20)" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                        <path d="M9 21V12h6v9"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white" style={{ fontSize: "14px" }}>{stats.dernierTitre}</p>
                      {stats.derniereVille && <p style={{ fontSize: "12px", color: "var(--txt-4)" }}>{stats.derniereVille}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="badge badge-ok">{stats.campagnes} campagnes</div>
                    <Link href="/resultats" className="btn btn-secondary" style={{ padding: "7px 12px", fontSize: "12px" }}>
                      Voir →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
