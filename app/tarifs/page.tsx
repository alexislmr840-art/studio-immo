import Link from "next/link";

const PLANS = [
  {
    name: "Solo",
    price: "29",
    desc: "Pour les agents indépendants qui veulent se démarquer.",
    highlight: false,
    features: [
      "50 générations IA / mois",
      "5 campagnes par bien",
      "Visuels PNG 1080 × 1350 px",
      "Facebook, Instagram, Stories",
      "Logo agence sur visuels",
      "Support par email",
    ],
    cta: "Commencer avec Solo",
    href: "/connexion",
  },
  {
    name: "Équipe",
    price: "79",
    desc: "Pour les agences et équipes qui gèrent plusieurs mandats.",
    highlight: true,
    features: [
      "Générations illimitées",
      "5 campagnes par bien",
      "Visuels PNG 1080 × 1350 px",
      "Facebook, Instagram, Stories",
      "Logo agence sur visuels",
      "Jusqu'à 5 agents",
      "Support prioritaire",
      "Historique des campagnes",
    ],
    cta: "Commencer avec Équipe",
    href: "/connexion",
  },
];

export default function TarifsPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        <Link href="/" className="text-xl font-bold text-white">
          Studio <span style={{ color: "#c9a84c" }}>Immo</span>
        </Link>
        <Link
          href="/connexion"
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:opacity-80"
          style={{ border: "1px solid #2a2a2a" }}
        >
          Connexion
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-20">

        {/* Hero */}
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#c9a84c", letterSpacing: "0.12em" }}
          >
            Tarifs simples
          </p>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Un plan pour chaque agence
          </h1>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Sans engagement. Résiliez quand vous voulez.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-6 lg:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl p-8 flex flex-col"
              style={{
                background: plan.highlight ? "#111111" : "#0d0d0d",
                border: plan.highlight ? "1px solid rgba(201,168,76,0.4)" : "1px solid #1f1f1f",
                position: "relative",
              }}
            >
              {plan.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold"
                  style={{ background: "#c9a84c", color: "#0a0a0a" }}
                >
                  Le plus populaire
                </div>
              )}

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}
                >
                  {plan.name}
                </p>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-5xl font-bold text-white tracking-tight">
                    {plan.price}€
                  </span>
                  <span className="mb-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                    / mois
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {plan.desc}
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="mt-8 block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
                style={
                  plan.highlight
                    ? { background: "#c9a84c", color: "#0a0a0a" }
                    : { background: "#1a1a1a", color: "#ffffff", border: "1px solid #2a2a2a" }
                }
              >
                {plan.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Garantie */}
        <div
          className="mt-12 rounded-2xl p-6 text-center"
          style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
        >
          <p className="text-sm font-semibold text-white">
            ✦ Satisfait ou remboursé — 14 jours sans question
          </p>
          <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            Paiement sécurisé par Stripe · Aucun engagement · Résiliation en un clic
          </p>
        </div>

        {/* FAQ rapide */}
        <div className="mt-12 space-y-4">
          {[
            {
              q: "Qu'est-ce qu'une génération ?",
              a: "Une génération correspond à la création d'une stratégie complète pour un bien : 5 campagnes, 10 publications et 10 visuels PNG.",
            },
            {
              q: "Puis-je changer de plan à tout moment ?",
              a: "Oui, vous pouvez upgrader ou résilier depuis votre espace paramètres. Le changement est effectif immédiatement.",
            },
            {
              q: "Mes visuels sont-ils personnalisés à mon agence ?",
              a: "Oui. Votre logo et les couleurs de votre agence sont intégrés automatiquement dans chaque visuel généré.",
            },
          ].map(({ q, a }) => (
            <div
              key={q}
              className="rounded-2xl px-6 py-5"
              style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
            >
              <p className="text-sm font-semibold text-white">{q}</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                {a}
              </p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
