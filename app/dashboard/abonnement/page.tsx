"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AbonnementPage() {
  const [creditsUsed, setCreditsUsed] = useState(0);

  useEffect(() => {
    const r = localStorage.getItem("studio_immo_resultat");
    if (r) {
      try { setCreditsUsed(JSON.parse(r)?.publications?.length ?? 0); } catch { /* ignore */ }
    }
  }, []);

  const total = 10;
  const remaining = Math.max(total - creditsUsed, 0);
  const pct = Math.min((creditsUsed / total) * 100, 100);

  const FEATURES_COMPARE = [
    { label: "Biens / mois", gratuit: "1", solo: "10", equipe: "30" },
    { label: "Campagnes par bien", gratuit: "5", solo: "5", equipe: "5" },
    { label: "Visuels PNG 1080×1350", gratuit: "✓", solo: "✓", equipe: "✓" },
    { label: "Facebook, Instagram, Stories", gratuit: "✓", solo: "✓", equipe: "✓" },
    { label: "Logo agence sur visuels", gratuit: "✓", solo: "✓", equipe: "✓" },
    { label: "Agents simultanés", gratuit: "1", solo: "1", equipe: "10" },
    { label: "Historique des campagnes", gratuit: "—", solo: "—", equipe: "✓" },
    { label: "Support prioritaire", gratuit: "—", solo: "Email", equipe: "Prioritaire" },
  ];

  return (
    <main className="flex-1 px-6 py-8 lg:px-8" style={{ background: "#F4F3F7" }}>
      <div style={{ maxWidth: "900px" }}>

        <div className="mb-8">
          <p className="label mb-1" style={{ color: "#9CA3AF" }}>Compte</p>
          <h1 className="font-bold tracking-tight" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#111827" }}>
            Abonnement
          </h1>
        </div>

        {/* Current plan */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(124,58,237,0.02) 100%)",
            border: "1.5px solid #E0E0E8",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <p className="label mb-1" style={{ color: "#7C3AED" }}>Plan actuel</p>
              <h2 className="font-bold mb-1" style={{ fontSize: "22px", color: "#111827" }}>Gratuit</h2>
              <p style={{ fontSize: "13px", color: "#6B7280" }}>
                {remaining} génération{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""} ce mois
              </p>
            </div>
            <Link href="/tarifs" className="btn" style={{ padding: "10px 18px", background: "#7C3AED", color: "#ffffff" }}>
              Passer à Pro →
            </Link>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <p style={{ fontSize: "12px", color: "#9CA3AF" }}>Générations utilisées</p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: pct > 70 ? "var(--warn)" : "#374151" }}>
                {creditsUsed} / {total}
              </p>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: pct > 70 ? "var(--warn)" : "#7C3AED",
                }}
              />
            </div>
          </div>
        </div>

        {/* Feature comparison */}
        <div className="overflow-hidden mb-6" style={{ background: "#ffffff", border: "1.5px solid #E0E0E8", borderRadius: "14px" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #E0E0E8" }}>
            <h2 className="font-semibold" style={{ fontSize: "14px", color: "#111827" }}>Comparaison des plans</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #E0E0E8" }}>
                  <th className="px-5 py-3.5 text-left label" style={{ color: "#9CA3AF", width: "40%" }}>Fonctionnalité</th>
                  {["Gratuit", "Solo · 39€/mois", "Équipe · 79€/mois"].map((plan, i) => (
                    <th key={plan} className="px-4 py-3.5 text-center"
                        style={{ fontSize: "12px", fontWeight: 700, color: i === 0 ? "#7C3AED" : "#111827" }}>
                      {plan}
                      {i === 0 && (
                        <span className="inline-block ml-1.5" style={{ fontSize: "9px", fontWeight: 600, background: "#EDE9FE", color: "#5B21B6", border: "1px solid #DDD6FE", borderRadius: "20px", padding: "1px 6px" }}>
                          Actuel
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES_COMPARE.map(({ label, gratuit, solo, equipe }, i) => (
                  <tr
                    key={label}
                    style={{
                      borderBottom: i < FEATURES_COMPARE.length - 1 ? "1px solid #E0E0E8" : "none",
                      background: i % 2 === 0 ? "transparent" : "#F9FAFB",
                    }}
                  >
                    <td className="px-5 py-3" style={{ fontSize: "13px", color: "#111827" }}>{label}</td>
                    {[gratuit, solo, equipe].map((val, j) => (
                      <td key={j} className="px-4 py-3 text-center" style={{
                        fontSize: "13px",
                        fontWeight: val === "✓" || val === "Illimité" ? 600 : 400,
                        color: val === "—" ? "#9CA3AF" : val === "✓" ? "#16a34a" : val === "Illimité" ? "#7C3AED" : "#374151",
                      }}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          {[
            {
              name: "Solo", price: "39€", period: "/mois",
              desc: "Pour les agents indépendants",
              highlight: false,
            },
            {
              name: "Équipe", price: "79€", period: "/mois",
              desc: "Pour les agences et équipes",
              highlight: true,
            },
          ].map(({ name, price, period, desc, highlight }) => (
            <div
              key={name}
              className="rounded-2xl p-5 flex flex-col"
              style={{
                background: "#ffffff",
                border: highlight ? "1.5px solid #7C3AED" : "1.5px solid #E0E0E8",
              }}
            >
              {highlight && (
                <div className="mb-3 self-start" style={{ fontSize: "11px", fontWeight: 600, background: "#EDE9FE", color: "#5B21B6", border: "1px solid #DDD6FE", borderRadius: "20px", padding: "3px 10px" }}>
                  Le plus populaire
                </div>
              )}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-bold" style={{ fontSize: "32px", letterSpacing: "-0.04em", color: "#111827" }}>{price}</span>
                <span style={{ fontSize: "13px", color: "#9CA3AF" }}>{period}</span>
              </div>
              <p className="font-medium mb-1" style={{ fontSize: "15px", color: "#111827" }}>{name}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px" }}>{desc}</p>
              <Link
                href="/tarifs"
                className="btn mt-auto"
                style={highlight
                  ? { background: "#7C3AED", color: "#ffffff", padding: "10px" }
                  : { background: "#F9FAFB", color: "#374151", border: "1px solid #E0E0E8", padding: "10px" }
                }
              >
                Choisir {name} →
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center" style={{ fontSize: "12px", color: "#9CA3AF" }}>
          Paiement sécurisé · Sans engagement · Résiliation en un clic · 14 jours satisfait ou remboursé
        </p>
      </div>
    </main>
  );
}
