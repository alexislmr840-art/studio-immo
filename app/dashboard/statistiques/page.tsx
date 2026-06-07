"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StatData {
  biens: number;
  campagnes: number;
  publications: number;
  visuels: number;
  dernierBien: string | null;
  derniereBien: string | null;
}

export default function StatistiquesPage() {
  const [stats, setStats] = useState<StatData>({
    biens: 0,
    campagnes: 0,
    publications: 0,
    visuels: 0,
    dernierBien: null,
    derniereBien: null,
  });

  useEffect(() => {
    const resultat = localStorage.getItem("studio_immo_resultat");
    const bien = localStorage.getItem("studio_immo_bien");

    if (resultat) {
      try {
        const data = JSON.parse(resultat);
        const nbPub = data?.publications?.length ?? 0;
        const bienData = bien ? JSON.parse(bien) : null;

        setStats({
          biens: 1,
          campagnes: nbPub,
          publications: nbPub * 2,
          visuels: nbPub * 2,
          dernierBien: bienData?.titre ?? null,
          derniereBien: bienData?.ville ?? null,
        });
      } catch {
        // données corrompues
      }
    }
  }, []);

  const hasData = stats.biens > 0;

  const metricCards = [
    { label: "Biens traités", value: stats.biens, desc: "Mandats avec stratégie générée" },
    { label: "Campagnes IA", value: stats.campagnes, desc: "Stratégies FB + IG produites" },
    { label: "Publications", value: stats.publications, desc: "Textes réseaux sociaux" },
    { label: "Visuels PNG", value: stats.visuels, desc: "Formats 1080 × 1350 px" },
  ];

  return (
    <main className="flex-1 px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
            Activité
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white tracking-tight">Statistiques</h1>
        </div>

        {!hasData ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "#111111", border: "1px solid #1f1f1f" }}
          >
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
              </svg>
            </div>
            <h3 className="font-semibold text-white">Aucune statistique disponible</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Générez votre première stratégie pour voir vos métriques d'utilisation.
            </p>
            <Link
              href="/nouveau-bien"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-150 hover:opacity-90"
              style={{ background: "#c9a84c", color: "#0a0a0a" }}
            >
              Créer un bien →
            </Link>
          </div>
        ) : (
          <>
            {/* Métriques */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metricCards.map(({ label, value, desc }) => (
                <div
                  key={label}
                  className="rounded-2xl p-5"
                  style={{ background: "#111111", border: "1px solid #1f1f1f" }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.07em" }}
                  >
                    {label}
                  </p>
                  <p className="mt-3 text-4xl font-bold text-white tabular-nums">{value}</p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Dernier bien */}
            {stats.dernierBien && (
              <div
                className="rounded-2xl p-6"
                style={{ background: "#111111", border: "1px solid #1f1f1f" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}
                >
                  Dernier bien traité
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{stats.dernierBien}</p>
                    {stats.derniereBien && (
                      <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {stats.derniereBien}
                      </p>
                    )}
                  </div>
                  <Link
                    href="/resultats"
                    className="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 hover:opacity-90"
                    style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.25)" }}
                  >
                    Voir les résultats →
                  </Link>
                </div>
              </div>
            )}

            {/* Crédits */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "#111111", border: "1px solid #1f1f1f" }}
            >
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}
                >
                  Crédits ce mois
                </p>
                <span className="text-xs font-medium" style={{ color: "#c9a84c" }}>Plan Gratuit</span>
              </div>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-3xl font-bold text-white">{stats.campagnes}</span>
                <span className="text-sm pb-1" style={{ color: "rgba(255,255,255,0.35)" }}>/ 10 utilisés</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1f1f1f" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.campagnes / 10) * 100, 100)}%`, background: "#c9a84c" }}
                />
              </div>
              <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                {Math.max(10 - stats.campagnes, 0)} générations restantes ce mois
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
