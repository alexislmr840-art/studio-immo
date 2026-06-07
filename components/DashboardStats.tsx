"use client";

import { useEffect, useState } from "react";

interface Stats {
  biens: number;
  campagnes: number;
  visuels: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({ biens: 0, campagnes: 0, visuels: 0 });

  useEffect(() => {
    const resultat = localStorage.getItem("studio_immo_resultat");
    if (resultat) {
      try {
        const data = JSON.parse(resultat);
        const nbCampagnes = data?.publications?.length ?? 0;
        setStats({
          biens: 1,
          campagnes: nbCampagnes,
          visuels: nbCampagnes * 2,
        });
      } catch {
        // pas de données valides
      }
    }
  }, []);

  const cards = [
    {
      label: "Biens créés",
      value: stats.biens,
      sub: stats.biens === 0 ? "Aucun bien pour l'instant" : `${stats.biens} mandat actif`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      label: "Campagnes",
      value: stats.campagnes,
      sub: "Facebook & Instagram",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Visuels générés",
      value: stats.visuels,
      sub: "PNG 1080 × 1350 px",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ label, value, sub, icon }) => (
        <div
          key={label}
          className="rounded-2xl p-5 transition-all duration-150"
          style={{ background: "#111111", border: "1px solid #1f1f1f" }}
        >
          <div className="flex items-center justify-between">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.07em" }}
            >
              {label}
            </p>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "rgba(201,168,76,0.1)" }}
            >
              {icon}
            </div>
          </div>
          <p className="mt-4 text-4xl font-bold text-white tabular-nums tracking-tight">
            {value}
          </p>
          <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            {sub}
          </p>
        </div>
      ))}
    </div>
  );
}
