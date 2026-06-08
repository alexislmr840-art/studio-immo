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
    <main className="flex-1 px-6 py-8 lg:px-8">
      <div style={{ maxWidth: "900px" }}>

        <div className="mb-8">
          <p className="label mb-1" style={{ color: "var(--txt-4)" }}>Compte</p>
          <h1 className="font-bold text-white tracking-tight" style={{ fontSize: "24px", letterSpacing: "-0.025em" }}>
            Abonnement
          </h1>
        </div>

        {/* Current plan */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 100%)",
            border: "1px solid var(--gold-20)",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <p className="label mb-1" style={{ color: "var(--gold)" }}>Plan actuel</p>
              <h2 className="font-bold text-white mb-1" style={{ fontSize: "22px" }}>Gratuit</h2>
              <p style={{ fontSize: "13px", color: "var(--txt-3)" }}>
                {remaining} génération{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""} ce mois
              </p>
            </div>
            <Link href="/tarifs" className="btn btn-primary" style={{ padding: "10px 18px" }}>
              Passer à Pro →
            </Link>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <p style={{ fontSize: "12px", color: "var(--txt-4)" }}>Générations utilisées</p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: pct > 70 ? "var(--warn)" : "var(--txt-3)" }}>
                {creditsUsed} / {total}
              </p>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-4)" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: pct > 70 ? "var(--warn)" : "var(--gold)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Feature comparison */}
        <div className="card overflow-hidden mb-6">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border-s)" }}>
            <h2 className="font-semibold text-white" style={{ fontSize: "14px" }}>Comparaison des plans</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-s)" }}>
                  <th className="px-5 py-3.5 text-left label" style={{ color: "var(--txt-4)", width: "40%" }}>Fonctionnalité</th>
                  {["Gratuit", "Solo · 39€/mois", "Équipe · 79€/mois"].map((plan, i) => (
                    <th key={plan} className="px-4 py-3.5 text-center"
                        style={{ fontSize: "12px", fontWeight: 700, color: i === 0 ? "var(--gold)" : "var(--txt-3)" }}>
                      {plan}
                      {i === 0 && <div className="inline-block ml-1.5 badge badge-gold" style={{ fontSize: "9px" }}>Actuel</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES_COMPARE.map(({ label, gratuit, solo, equipe }, i) => (
                  <tr
                    key={label}
                    style={{
                      borderBottom: i < FEATURES_COMPARE.length - 1 ? "1px solid var(--border-s)" : "none",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                    }}
                  >
                    <td className="px-5 py-3" style={{ fontSize: "13px", color: "var(--txt-2)" }}>{label}</td>
                    {[gratuit, solo, equipe].map((val, j) => (
                      <td key={j} className="px-4 py-3 text-center" style={{
                        fontSize: "13px",
                        fontWeight: val === "✓" || val === "Illimité" ? 600 : 400,
                        color: val === "—" ? "var(--txt-4)" : val === "✓" ? "var(--ok)" : val === "Illimité" ? "var(--gold)" : "var(--txt-2)",
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
                background: highlight ? "var(--bg-2)" : "var(--bg-1)",
                border: highlight ? "1px solid var(--gold-30)" : "1px solid var(--border-s)",
              }}
            >
              {highlight && (
                <div className="badge badge-gold mb-3 self-start">Le plus populaire</div>
              )}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-bold text-white" style={{ fontSize: "32px", letterSpacing: "-0.04em" }}>{price}</span>
                <span style={{ fontSize: "13px", color: "var(--txt-4)" }}>{period}</span>
              </div>
              <p className="font-medium text-white mb-1" style={{ fontSize: "15px" }}>{name}</p>
              <p style={{ fontSize: "12px", color: "var(--txt-4)", marginBottom: "16px" }}>{desc}</p>
              <Link
                href="/tarifs"
                className="btn mt-auto"
                style={highlight
                  ? { background: "var(--gold)", color: "#0a0a0a", padding: "10px" }
                  : { background: "var(--bg-3)", color: "var(--txt-1)", border: "1px solid var(--border)", padding: "10px" }
                }
              >
                Choisir {name} →
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center" style={{ fontSize: "12px", color: "var(--txt-4)" }}>
          Paiement sécurisé · Sans engagement · Résiliation en un clic · 14 jours satisfait ou remboursé
        </p>
      </div>
    </main>
  );
}
