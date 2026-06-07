import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import DashboardStats from "@/components/DashboardStats";

export default async function DashboardPage() {
  const user = await currentUser();
  const prenom = user?.firstName || "Agent";
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <main className="flex-1 px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* En-tête */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
              Bonjour,
            </p>
            <h1 className="mt-0.5 text-3xl font-bold text-white tracking-tight">
              {prenom}
            </h1>
            {createdAt && (
              <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                Membre depuis le {createdAt}
              </p>
            )}
          </div>

          <Link
            href="/nouveau-bien"
            className="hidden lg:inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ background: "#c9a84c", color: "#0a0a0a" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouveau bien
          </Link>
        </div>

        {/* Stats dynamiques (client — lit localStorage) */}
        <DashboardStats />

        {/* Biens récents — état vide */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#111111", border: "1px solid #1f1f1f" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #1f1f1f" }}>
            <h2 className="font-semibold text-white text-sm tracking-tight">Vos biens récents</h2>
          </div>

          <div className="p-12 text-center">
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <h3 className="font-semibold text-white">Aucun bien pour l'instant</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Ajoutez un mandat et l'IA génère une stratégie complète en quelques secondes.
            </p>
            <Link
              href="/nouveau-bien"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-150 hover:opacity-90"
              style={{ background: "#c9a84c", color: "#0a0a0a" }}
            >
              Créer mon premier bien →
            </Link>
          </div>
        </div>

        {/* Onboarding */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#111111", border: "1px solid #1f1f1f" }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#c9a84c", letterSpacing: "0.1em" }}
          >
            Démarrage rapide
          </p>
          <h2 className="mt-2 text-lg font-bold text-white">
            3 étapes pour votre premier visuel
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Renseignez le bien",
                desc: "Titre, ville, surface, prix et description.",
              },
              {
                step: "02",
                title: "L'IA génère la stratégie",
                desc: "5 campagnes, 10 publications Facebook & Instagram.",
              },
              {
                step: "03",
                title: "Téléchargez vos visuels",
                desc: "PNG 1080 × 1350 px prêts à publier.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="flex gap-4 rounded-xl p-4"
                style={{ background: "#161616", border: "1px solid #222" }}
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                  style={{ background: "rgba(201,168,76,0.15)", color: "#c9a84c", fontVariantNumeric: "tabular-nums" }}
                >
                  {step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/nouveau-bien"
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ background: "#c9a84c", color: "#0a0a0a" }}
          >
            Commencer maintenant →
          </Link>
        </div>

      </div>
    </main>
  );
}
