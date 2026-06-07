export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { RelancerButton } from "./RelancerButton";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BienPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/connexion");

  const { data: dbUser } = await supabaseAdmin.from("users").select("id").eq("clerk_id", userId).single();
  if (!dbUser) redirect("/dashboard");

  const { data: bien } = await supabaseAdmin.from("biens").select("*").eq("id", id).eq("user_id", dbUser.id).single();
  if (!bien) notFound();

  const { data: generations } = await supabaseAdmin.from("generations")
    .select("id, created_at, resultat_json")
    .eq("bien_id", id).order("created_at", { ascending: false });

  const genCount = generations?.length ?? 0;
  const latestGen = generations?.[0];

  return (
    <div className="min-h-screen" style={{ background: "#f8f8f8", fontFamily: "'DM Sans','Inter',sans-serif" }}>

      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Dashboard
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-semibold text-gray-900">{bien.titre}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/nouveau-bien" className="rounded-xl px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "#f5f5f5", color: "#1a1a1a", border: "1px solid #ebebeb" }}>
            + Nouveau bien
          </Link>
          {latestGen && (
            <Link href={`/resultats?genId=${latestGen.id}`}
              className="rounded-xl px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #c9a84c, #a07830)" }}>
              Voir la campagne
            </Link>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-8 py-8 space-y-6">

        {/* Carte principale du bien */}
        <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #f0f0f0" }}>
          <div className="grid lg:grid-cols-5">

            {/* Photo */}
            <div className="lg:col-span-2 relative h-64 lg:h-auto">
              {bien.photo_principale_url ? (
                <img src={bien.photo_principale_url} alt={bien.titre} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-64 items-center justify-center text-gray-300 text-sm font-medium"
                  style={{ background: "#f9f9f9" }}>
                  Aucune photo
                </div>
              )}
            </div>

            {/* Infos */}
            <div className="lg:col-span-3 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#c9a84c" }}>Bien immobilier</p>
                    <h1 className="mt-1 text-2xl font-bold text-gray-900">{bien.titre}</h1>
                  </div>
                  <span className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: genCount > 0 ? "#f0fdf4" : "#fef9ec", color: genCount > 0 ? "#16a34a" : "#a07830", border: `1px solid ${genCount > 0 ? "#bbf7d0" : "#e5d5a0"}` }}>
                    {genCount} campagne{genCount > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {bien.ville && (
                    <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600"
                      style={{ background: "#f5f5f5", border: "1px solid #ebebeb" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {bien.ville}
                    </span>
                  )}
                  {bien.surface && (
                    <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600"
                      style={{ background: "#f5f5f5", border: "1px solid #ebebeb" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                      {bien.surface} m²
                    </span>
                  )}
                  {bien.prix && (
                    <span className="rounded-full px-3 py-1.5 text-xs font-bold"
                      style={{ background: "rgba(201,168,76,0.1)", color: "#a07830", border: "1px solid rgba(201,168,76,0.2)" }}>
                      {bien.prix} €
                    </span>
                  )}
                  <span className="rounded-full px-3 py-1.5 text-xs text-gray-400" style={{ background: "#f5f5f5", border: "1px solid #ebebeb" }}>
                    Ajouté le {formatDate(bien.created_at)}
                  </span>
                </div>

                {bien.description && (
                  <p className="mt-5 text-sm leading-relaxed text-gray-500 border-t border-gray-50 pt-5">{bien.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <RelancerButton bien={{
                  titre: bien.titre, ville: bien.ville, prix: bien.prix,
                  surface: bien.surface, description: bien.description, afficher_prix: bien.afficher_prix,
                }} />
                {latestGen && (
                  <Link href={`/resultats?genId=${latestGen.id}`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #c9a84c, #a07830)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Voir la campagne
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Photos du bien */}
        {bien.photos_urls && bien.photos_urls.length > 1 && (
          <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #f0f0f0" }}>
            <h2 className="text-sm font-bold text-gray-900 mb-4">Photos du bien <span className="text-gray-400 font-normal">({bien.photos_urls.length})</span></h2>
            <div className="grid grid-cols-4 gap-2">
              {bien.photos_urls.map((url: string, i: number) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <div className="absolute top-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white"
                      style={{ background: "rgba(201,168,76,0.9)" }}>Principale</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique des générations */}
        <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #f0f0f0" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-gray-900">
              Campagnes générées
              <span className="ml-2 text-gray-400 font-normal">({genCount})</span>
            </h2>
          </div>

          {genCount === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "#f5f5f5" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              </div>
              <p className="text-sm font-semibold text-gray-500">Aucune campagne générée</p>
              <p className="text-xs text-gray-400">Cliquez sur Générer une campagne pour créer votre stratégie IA.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {generations!.map((gen, index) => {
                const resultat = gen.resultat_json as { profilAcheteur?: string; publications?: { titre: string }[] };
                return (
                  <Link key={gen.id} href={`/resultats?genId=${gen.id}`}
                    className="flex items-center justify-between rounded-xl p-4 transition-all hover:bg-gray-50 group"
                    style={{ border: "1px solid #f0f0f0" }}>
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold"
                        style={{ background: index === 0 ? "rgba(201,168,76,0.1)" : "#f5f5f5", color: index === 0 ? "#a07830" : "#9ca3af" }}>
                        #{genCount - index}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Campagne du {formatDate(gen.created_at)}
                          {index === 0 && <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#f0fdf4", color: "#16a34a" }}>Dernière</span>}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400 line-clamp-1 max-w-md">
                          {resultat?.profilAcheteur ?? "Stratégie complète générée"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                        {resultat?.publications?.length ?? 0} publications
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-300 group-hover:text-gray-500 transition-colors">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
