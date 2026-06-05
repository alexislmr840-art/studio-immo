import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar — masquée sur mobile */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-blue-950">
        <div className="px-6 pt-7 pb-6">
          <Link href="/" className="text-2xl font-bold text-white">
            Studio <span className="text-amber-400">Immo</span>
          </Link>
          <p className="mt-1 text-xs text-white/40">Marketing immobilier IA</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white"
          >
            <span className="text-lg">📊</span>
            Tableau de bord
          </Link>
          <Link
            href="/nouveau-bien"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <span className="text-lg">🏠</span>
            Nouveau bien
          </Link>
          <Link
            href="/connexion"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <span className="text-lg">⚙️</span>
            Paramètres
          </Link>
        </nav>

        <div className="border-t border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-blue-950">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Alexis</p>
              <p className="text-xs text-white/40">Plan Gratuit</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Header */}
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            {/* Logo visible uniquement sur mobile */}
            <Link href="/" className="text-xl font-bold text-blue-950 lg:hidden">
              Studio <span className="text-amber-500">Immo</span>
            </Link>

            <div className="hidden lg:block">
              <p className="text-sm text-slate-400">Bonjour 👋</p>
              <h1 className="text-xl font-bold text-blue-950">Alexis</h1>
            </div>

            <Link
              href="/nouveau-bien"
              className="rounded-xl bg-blue-950 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-900"
            >
              + Nouveau bien
            </Link>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-5xl space-y-8">

            {/* Titre mobile */}
            <div className="lg:hidden">
              <p className="text-sm text-slate-400">Bonjour 👋</p>
              <h1 className="text-2xl font-bold text-blue-950">Alexis</h1>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Biens créés
                  </p>
                  <span className="text-xl">🏠</span>
                </div>
                <p className="mt-3 text-4xl font-bold text-blue-950">0</p>
                <p className="mt-1 text-xs text-slate-400">Aucun bien pour l'instant</p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Campagnes
                  </p>
                  <span className="text-xl">📱</span>
                </div>
                <p className="mt-3 text-4xl font-bold text-blue-950">0</p>
                <p className="mt-1 text-xs text-slate-400">Facebook & Instagram</p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Visuels
                  </p>
                  <span className="text-xl">🎨</span>
                </div>
                <p className="mt-3 text-4xl font-bold text-blue-950">0</p>
                <p className="mt-1 text-xs text-slate-400">PNG 1080×1350 px</p>
              </div>
            </div>

            {/* Biens récents */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="font-bold text-blue-950">Vos biens récents</h2>
              </div>

              <div className="p-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  🏡
                </div>
                <h3 className="font-bold text-blue-950">Aucun bien créé pour le moment</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">
                  Ajoutez un mandat et l'IA génère une stratégie complète en quelques secondes.
                </p>
                <Link
                  href="/nouveau-bien"
                  className="mt-5 inline-block rounded-xl bg-blue-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-900"
                >
                  Créer mon premier bien
                </Link>
              </div>
            </div>

            {/* Onboarding */}
            <div className="rounded-2xl bg-blue-950 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Pour commencer
              </p>
              <h2 className="mt-1 text-lg font-bold">3 étapes pour votre premier visuel</h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    step: "1",
                    title: "Renseignez le bien",
                    desc: "Titre, ville, surface, prix et description du mandat.",
                  },
                  {
                    step: "2",
                    title: "L'IA génère la stratégie",
                    desc: "5 campagnes, 10 publications Facebook & Instagram.",
                  },
                  {
                    step: "3",
                    title: "Téléchargez vos visuels",
                    desc: "PNG 1080×1350 px prêts à publier.",
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3 rounded-xl bg-white/10 p-4">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-blue-950">
                      {step}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/50">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/nouveau-bien"
                className="mt-5 inline-block rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-blue-950 transition-opacity hover:opacity-90"
              >
                Commencer maintenant →
              </Link>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
