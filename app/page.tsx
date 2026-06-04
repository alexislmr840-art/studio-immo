export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold text-blue-950">
            Studio <span className="text-amber-500">Immo</span>
          </h1>

          <div className="flex gap-3">
            <button className="rounded-lg border border-blue-900 px-4 py-2 font-medium text-blue-950">
              Connexion
            </button>
            <button className="rounded-lg bg-blue-950 px-4 py-2 font-medium text-white">
              Inscription
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-500">
            Marketing immobilier
          </p>

          <h2 className="mb-6 text-5xl font-bold leading-tight text-blue-950">
            Transformez vos mandats en contenus prêts à publier.
          </h2>

          <p className="mb-8 text-xl leading-relaxed text-slate-700">
            Studio Immo génère des publications Facebook, Instagram et des
            visuels professionnels pour valoriser vos biens.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="rounded-xl bg-blue-950 px-6 py-4 font-semibold text-white shadow-lg">
              Commencer gratuitement
            </button>
            <button className="rounded-xl border border-slate-300 bg-white px-6 py-4 font-semibold text-blue-950">
              Voir un exemple
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <div className="mb-4 rounded-2xl bg-gradient-to-br from-blue-950 to-slate-700 p-16 text-center text-white">
            Aperçu visuel du bien
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border-l-4 border-amber-500 bg-slate-50 p-4">
              <p className="font-bold text-blue-950">Campagne 1 — Découverte</p>
              <p className="text-slate-700">Facebook + Instagram + visuel</p>
            </div>

            <div className="rounded-xl border-l-4 border-blue-950 bg-slate-50 p-4">
              <p className="font-bold text-blue-950">Campagne 2 — Atout principal</p>
              <p className="text-slate-700">Terrasse, jardin, vue ou emplacement.</p>
            </div>

            <div className="rounded-xl border-l-4 border-amber-500 bg-slate-50 p-4">
              <p className="font-bold text-blue-950">Campagne 3 — Contact</p>
              <p className="text-slate-700">Pensée pour générer des demandes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-4xl font-bold text-amber-500">5</p>
            <p className="font-medium text-blue-950">campagnes par bien</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-4xl font-bold text-amber-500">10</p>
            <p className="font-medium text-blue-950">publications générées</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-4xl font-bold text-amber-500">5</p>
            <p className="font-medium text-blue-950">visuels professionnels</p>
          </div>
        </div>
      </section>
    </main>
  );
}