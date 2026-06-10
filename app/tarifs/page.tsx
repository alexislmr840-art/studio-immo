"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { CheckoutButton } from "./CheckoutButton";

type Feature = string | { label: string; badge: string };

const PLANS: {
  id: "solo" | "equipe"; name: string; price: string; desc: string; highlight: boolean;
  badge: string | null; features: Feature[]; cta: string;
}[] = [
  {
    id: "solo",
    name: "Solo",
    price: "39",
    desc: "L'essentiel pour les agents indépendants qui veulent se démarquer sur les réseaux.",
    highlight: false,
    badge: null,
    features: [
      "10 biens par mois",
      "5 campagnes par bien",
      "Visuels PNG 1080×1350 px",
      "Facebook, Instagram, Stories",
      "Logo agence sur visuels",
      "1 utilisateur",
      "Support par email",
    ],
    cta: "Commencer avec Solo",
  },
  {
    id: "equipe",
    name: "Équipe",
    price: "79",
    desc: "Puissance illimitée pour les agences et équipes qui gèrent plusieurs mandats.",
    highlight: true,
    badge: "Le plus populaire",
    features: [
      "30 biens par mois",
      "5 campagnes par bien",
      "Visuels PNG 1080×1350 px",
      "Facebook, Instagram, Stories",
      "Logo agence sur visuels",
      "Jusqu'à 10 utilisateurs",
      "Historique des campagnes",
      { label: "Analytics réseaux sociaux (vues, j'aime, portée)", badge: "Bientôt disponible" },
      "Support prioritaire",
    ],
    cta: "Commencer avec Équipe",
  },
];

const FAQ = [
  {
    q: "Qu'est-ce qu'une génération ?",
    a: "Une génération = une stratégie complète pour un bien : 5 campagnes, 10 publications et 10 visuels PNG prêts à publier.",
  },
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui. Vous pouvez upgrader ou résilier depuis votre espace paramètres. Le changement est effectif immédiatement, sans pénalité.",
  },
  {
    q: "Les visuels sont-ils vraiment personnalisés ?",
    a: "Absolument. Votre logo, le nom de votre agence, vos photos et les informations du bien sont intégrés automatiquement dans chaque visuel.",
  },
  {
    q: "Qu'est-ce que la garantie 14 jours ?",
    a: "Si Studio Immo ne vous convient pas dans les 14 premiers jours suivant votre abonnement, nous vous remboursons intégralement, sans question.",
  },
];

export default function TarifsPage() {
  const { isSignedIn } = useUser();
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>

      {/* Header */}
      <header
        className="glass sticky top-0 z-50"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--gold)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              </svg>
            </div>
            <span className="font-bold text-white" style={{ fontSize: "15px" }}>
              Studio <span style={{ color: "var(--gold)" }}>Immo</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/connexion" className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: "13px" }}>Connexion</Link>
            <Link href="/connexion" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>Essai gratuit →</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-20">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="label mb-4" style={{ color: "var(--gold)" }}>Tarifs</p>
          <h1 className="font-bold text-white tracking-tight mb-4" style={{ fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-0.03em" }}>
            Choisissez votre plan
          </h1>
          <p style={{ fontSize: "16px", color: "var(--txt-3)", lineHeight: 1.7 }}>
            Sans engagement · Résiliation en un clic · 10 générations gratuites pour commencer
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-6 lg:grid-cols-2 max-w-3xl mx-auto mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col rounded-2xl p-8"
              style={{
                background: plan.highlight
                  ? "linear-gradient(160deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 100%)"
                  : "var(--bg-1)",
                border: plan.highlight ? "1px solid var(--gold-30)" : "1px solid var(--border-s)",
                boxShadow: plan.highlight ? "var(--shadow-gold)" : "none",
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 font-bold"
                  style={{ background: "var(--gold)", color: "#0a0a0a", fontSize: "11px" }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <p className="label mb-2" style={{ color: "var(--txt-4)" }}>{plan.name}</p>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="font-bold text-white" style={{ fontSize: "52px", letterSpacing: "-0.05em", lineHeight: 1 }}>
                    {plan.price}€
                  </span>
                  <span style={{ fontSize: "15px", color: "var(--txt-4)" }}>/ mois</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--txt-3)", lineHeight: 1.6 }}>{plan.desc}</p>
              </div>

              <ul className="flex-1 space-y-3 mb-7">
                {plan.features.map((f, i) => {
                  const label = typeof f === "string" ? f : f.label;
                  const badge = typeof f === "string" ? null : f.badge;
                  return (
                    <li key={i} className="flex items-center gap-3" style={{ fontSize: "13px", color: "var(--txt-2)" }}>
                      <div
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ background: "var(--ok-10)" }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span>{label}</span>
                      {badge && (
                        <span
                          className="rounded-full px-2 py-0.5 font-semibold"
                          style={{ fontSize: "10px", background: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.25)", whiteSpace: "nowrap" }}
                        >
                          {badge}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <CheckoutButton
                plan={plan.id}
                isLoggedIn={isSignedIn ?? false}
                isCurrentPlan={false}
                accent={plan.highlight}
              />
            </div>
          ))}
        </div>

        {/* Free plan mention */}
        <div
          className="rounded-2xl p-5 text-center mb-16"
          style={{ background: "var(--bg-1)", border: "1px solid var(--border-s)" }}
        >
          <p className="font-semibold text-white mb-1" style={{ fontSize: "15px" }}>
            Commencez gratuitement
          </p>
          <p style={{ fontSize: "13px", color: "var(--txt-3)", marginBottom: "14px" }}>
            10 générations offertes dès la création de votre compte. Aucune carte bancaire requise.
          </p>
          <Link href="/connexion" className="btn btn-primary" style={{ padding: "10px 22px" }}>
            Créer un compte gratuit →
          </Link>
        </div>

        {/* Guarantees */}
        <div className="grid gap-4 sm:grid-cols-3 mb-16">
          {[
            { icon: "🔒", title: "Paiement sécurisé", desc: "Transactions chiffrées par Stripe, le leader mondial du paiement en ligne." },
            { icon: "↩️", title: "14 jours satisfait ou remboursé", desc: "Pas convaincu ? On vous rembourse intégralement, sans condition." },
            { icon: "⚡", title: "Accès immédiat", desc: "Votre abonnement est actif dès la confirmation du paiement." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-5 text-center" style={{ background: "var(--bg-1)", border: "1px solid var(--border-s)" }}>
              <div className="text-2xl mb-3">{icon}</div>
              <p className="font-semibold text-white mb-1.5" style={{ fontSize: "13px" }}>{title}</p>
              <p style={{ fontSize: "12px", color: "var(--txt-4)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-bold text-white text-center mb-8" style={{ fontSize: "24px", letterSpacing: "-0.025em" }}>
            Questions fréquentes
          </h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="card p-5">
                <p className="font-semibold text-white mb-2" style={{ fontSize: "14px" }}>{q}</p>
                <p style={{ fontSize: "13px", color: "var(--txt-3)", lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8" style={{ borderTop: "1px solid var(--border-s)" }}>
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: "var(--gold)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
              </svg>
            </div>
            <span className="font-bold text-white text-sm">Studio Immo</span>
          </Link>
          <p style={{ fontSize: "11px", color: "var(--txt-4)" }}>
            © 2026 Studio Immo · Marketing immobilier automatisé
          </p>
        </div>
      </footer>
    </div>
  );
}
