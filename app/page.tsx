import Link from "next/link";

export default function Home() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>

      {/* Header */}
      <header
        className="flex items-center justify-between px-8 py-5 mx-auto max-w-7xl"
      >
        <h1 className="text-xl font-bold text-white tracking-tight">
          Studio <span style={{ color: "#c9a84c" }}>Immo</span>
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/tarifs"
            className="text-sm font-medium transition-all duration-150 hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Tarifs
          </Link>
          <Link
            href="/connexion"
            className="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.7)", border: "1px solid #2a2a2a" }}
          >
            Connexion
          </Link>
          <Link
            href="/connexion"
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 hover:opacity-90"
            style={{ background: "#c9a84c", color: "#0a0a0a" }}
          >
            Commencer
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-8 pt-20 pb-16 text-center">
        <div
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", color: "#c9a84c" }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#c9a84c" }} />
          Marketing immobilier automatisé par IA
        </div>

        <h2 className="text-5xl font-bold text-white tracking-tight leading-tight mx-auto max-w-3xl lg:text-6xl">
          Transformez vos mandats{" "}
          <span style={{ color: "#c9a84c" }}>en contenus prêts à publier.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          Studio Immo génère des publications Facebook, Instagram et des visuels professionnels
          pour valoriser vos biens en quelques secondes.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/connexion"
            className="rounded-xl px-7 py-3.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ background: "#c9a84c", color: "#0a0a0a" }}
          >
            Commencer gratuitement →
          </Link>
          <Link
            href="/tarifs"
            className="rounded-xl px-7 py-3.5 text-sm font-semibold transition-all duration-150 hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.6)", border: "1px solid #2a2a2a" }}
          >
            Voir les tarifs
          </Link>
        </div>

        <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          Sans carte bancaire · 10 générations gratuites
        </p>
      </section>

      {/* Preview produit */}
      <section className="mx-auto max-w-5xl px-8 pb-20">
        <div
          className="rounded-2xl p-6"
          style={{ background: "#111111", border: "1px solid #1f1f1f" }}
        >
          {/* Fausse UI */}
          <div
            className="rounded-xl p-4 mb-4"
            style={{ background: "#161616", border: "1px solid #1a1a1a" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 rounded-full" style={{ background: "#c9a84c" }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                Stratégie générée — Appartement T3 · Lyon 6e
              </p>
            </div>
            <div className="space-y-3">
              {[
                { num: "01", titre: "Campagne Découverte", reseau: "Facebook + Instagram", desc: "Captez l'attention avec une accroche émotionnelle sur le quartier." },
                { num: "02", titre: "Atout principal", reseau: "Instagram + Story", desc: "Mettez en avant la terrasse et la vue dégagée sur la ville." },
                { num: "03", titre: "Urgence & Contact", reseau: "Facebook", desc: "Créez un sentiment d'urgence avec le nombre de visites déjà planifiées." },
              ].map(({ num, titre, reseau, desc }) => (
                <div
                  key={num}
                  className="flex items-start gap-4 rounded-xl p-4"
                  style={{ background: "#111111", border: "1px solid #1f1f1f" }}
                >
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                    style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}
                  >
                    {num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white">{titre}</p>
                      <span
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{ background: "rgba(201,168,76,0.08)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.2)" }}
                      >
                        {reseau}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Exemple de stratégie générée en 12 secondes
          </p>
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-16"
        style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}
      >
        <div className="mx-auto max-w-5xl px-8">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            {[
              { val: "5", label: "campagnes par bien" },
              { val: "10", label: "publications générées" },
              { val: "~15s", label: "temps de génération" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="text-4xl font-bold text-white">{val}</p>
                <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-8 py-20">
        <p
          className="text-xs font-bold uppercase tracking-widest text-center mb-12"
          style={{ color: "#c9a84c", letterSpacing: "0.12em" }}
        >
          Tout ce dont vous avez besoin
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Stratégie IA complète",
              desc: "5 campagnes ciblées avec objectifs, accroches et textes adaptés à chaque réseau.",
            },
            {
              title: "Facebook & Instagram",
              desc: "Publications longues, courtes, stories — tout est généré et prêt à copier-coller.",
            },
            {
              title: "Visuels PNG 1080×1350",
              desc: "Format Instagram professionnel avec votre logo, vos photos et les informations du bien.",
            },
            {
              title: "Profil acheteur",
              desc: "L'IA identifie et cible le bon acquéreur pour maximiser l'impact de chaque publication.",
            },
            {
              title: "Points forts extraits",
              desc: "Les atouts du bien sont automatiquement identifiés et mis en valeur dans les textes.",
            },
            {
              title: "Variantes A/B",
              desc: "Deux versions de chaque visuel pour tester ce qui performe le mieux sur vos réseaux.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-5"
              style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
            >
              <div
                className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "rgba(201,168,76,0.1)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section
        className="py-20"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        <div className="mx-auto max-w-2xl px-8 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Prêt à publier en 15 secondes ?
          </h2>
          <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Sans engagement. 10 générations gratuites pour commencer.
          </p>
          <Link
            href="/connexion"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ background: "#c9a84c", color: "#0a0a0a" }}
          >
            Créer mon compte gratuitement →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-8 py-8 text-center"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-6">
          <span className="text-sm font-bold text-white">Studio <span style={{ color: "#c9a84c" }}>Immo</span></span>
          <Link href="/tarifs" className="text-xs transition hover:opacity-80" style={{ color: "rgba(255,255,255,0.35)" }}>Tarifs</Link>
          <Link href="/connexion" className="text-xs transition hover:opacity-80" style={{ color: "rgba(255,255,255,0.35)" }}>Connexion</Link>
        </div>
        <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © 2026 Studio Immo · Marketing immobilier automatisé
        </p>
      </footer>

    </div>
  );
}
