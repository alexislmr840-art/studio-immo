import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();
  const prenom = user?.firstName || "Agent";

  return (
    <main className="min-h-screen bg-blue-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            Studio <span className="text-amber-400">Immo</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/nouveau-bien"
              className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-blue-950"
            >
              Nouveau bien
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="font-bold uppercase tracking-widest text-amber-400">
          Tableau de bord
        </p>

        <h2 className="mt-3 text-5xl font-bold">
          Bonjour {prenom} 👋
        </h2>

        <p className="mt-4 text-xl text-white">
          Gérez vos biens et préparez vos campagnes réseaux sociaux.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 text-blue-950">
            <p className="font-bold">Biens créés</p>
            <p className="mt-4 text-6xl font-bold text-amber-500">0</p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-blue-950">
            <p className="font-bold">Campagnes générées</p>
            <p className="mt-4 text-6xl font-bold text-amber-500">0</p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-blue-950">
            <p className="font-bold">Visuels créés</p>
            <p className="mt-4 text-6xl font-bold text-amber-500">0</p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-8 text-blue-950">
          <h3 className="text-3xl font-bold">Vos derniers biens</h3>

          <div className="mt-6 rounded-2xl border-2 border-dashed border-blue-200 p-10 text-center">
            <p className="text-xl font-bold">
              Aucun bien créé pour le moment
            </p>

            <p className="mt-3 text-blue-950">
              Commencez par ajouter votre premier mandat immobilier.
            </p>

            <Link
              href="/nouveau-bien"
              className="mt-6 inline-block rounded-xl bg-blue-950 px-6 py-4 font-bold text-white"
            >
              Créer mon premier bien
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
