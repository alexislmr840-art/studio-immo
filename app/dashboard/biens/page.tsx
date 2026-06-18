export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default async function BiensPage() {
  const { userId } = await auth();
  if (!userId) redirect("/connexion");

  const dbResult = await supabaseAdmin.from("users").select("id, plan").eq("clerk_id", userId).single();
  const dbUser = dbResult.data;
  if (!dbUser) redirect("/dashboard");

  const { data: biens, count } = await supabaseAdmin
    .from("biens")
    .select("id, titre, ville, prix, surface, created_at, photo_principale_url", { count: "exact" })
    .eq("user_id", dbUser.id)
    .order("created_at", { ascending: false });

  const bienIds = (biens ?? []).map((b) => b.id);
  const latestGenMap = new Map<string, string>();
  if (bienIds.length > 0) {
    const { data: gens } = await supabaseAdmin
      .from("generations")
      .select("id, bien_id")
      .in("bien_id", bienIds)
      .order("created_at", { ascending: false });
    for (const g of gens ?? []) {
      if (!latestGenMap.has(g.bien_id)) latestGenMap.set(g.bien_id, g.id);
    }
  }

  return (
    <main className="flex-1" style={{ background: "#F4F3F7" }}>

      {/* Header sticky */}
      <header
        className="sticky top-0 z-30 flex h-16 items-center justify-between px-8"
        style={{ background: "rgba(244,243,247,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E0E0E8" }}
      >
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 font-medium transition-colors hover:text-[#111827]"
            style={{ color: "#6B7280" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Dashboard
          </Link>
          <span style={{ color: "#D1D5DB" }}>/</span>
          <span className="font-semibold" style={{ color: "#111827" }}>Tous les biens</span>
        </div>
        <Link
          href="/nouveau-bien"
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-opacity hover:opacity-90"
          style={{ background: "#7C3AED", color: "#ffffff" }}
        >
          + Nouveau bien
        </Link>
      </header>

      <div className="px-8 py-8">

        {/* Stat total */}
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-xl font-bold" style={{ color: "#111827" }}>Vos biens</h1>
          <span
            className="flex items-center justify-center rounded-full px-3 py-0.5 text-sm font-semibold"
            style={{ background: "#EDE9FE", color: "#5B21B6", border: "1px solid #DDD6FE" }}
          >
            {count ?? 0}
          </span>
        </div>

        {/* Empty state */}
        {(biens ?? []).length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-5 rounded-2xl py-24"
            style={{ background: "#ffffff", border: "1.5px solid #E0E0E8" }}
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "#EDE9FE", border: "1px solid #DDD6FE" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold" style={{ color: "#111827" }}>Aucun bien créé pour le moment</p>
              <p className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>
                Ajoutez votre premier mandat pour générer une campagne IA.
              </p>
            </div>
            <Link
              href="/nouveau-bien"
              className="rounded-xl px-6 py-2.5 text-sm font-bold transition-opacity hover:opacity-90"
              style={{ background: "#7C3AED", color: "#ffffff" }}
            >
              Créer mon premier bien
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {(biens ?? []).map((bien) => {
              const genId = latestGenMap.get(bien.id);
              return (
                <div
                  key={bien.id}
                  className="group flex items-center gap-5 rounded-2xl p-4 transition-all duration-200"
                  style={{ background: "#ffffff", border: "1.5px solid #E0E0E8" }}
                >
                  {/* Photo */}
                  {bien.photo_principale_url ? (
                    <img
                      src={bien.photo_principale_url}
                      alt={bien.titre}
                      className="h-24 w-32 flex-shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-24 w-32 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{ background: "#F3F4F6", border: "1px solid #E5E7EB" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                  )}

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-base font-bold truncate" style={{ color: "#111827" }}>{bien.titre}</p>
                      {genId ? (
                        <span
                          className="rounded-full px-2.5 py-0.5 font-semibold flex-shrink-0"
                          style={{ fontSize: "11px", background: "#EDE9FE", color: "#5B21B6", border: "1px solid #DDD6FE" }}
                        >
                          Campagne générée
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {bien.ville && (
                        <span className="text-sm" style={{ color: "#6B7280" }}>
                          {bien.ville}
                        </span>
                      )}
                      {bien.surface && (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{ background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" }}
                        >
                          {bien.surface}
                        </span>
                      )}
                      {bien.prix && (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{ background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" }}
                        >
                          {bien.prix}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs" style={{ color: "#9CA3AF" }}>
                      Créé le {formatDate(bien.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <Link
                      href={`/biens/${bien.id}`}
                      className="rounded-xl px-4 py-2 text-xs font-semibold transition-all"
                      style={{ border: "1px solid #E0E0E8", color: "#374151", background: "transparent" }}
                    >
                      Détails
                    </Link>
                    {genId ? (
                      <Link
                        href={`/resultats?genId=${genId}`}
                        className="rounded-xl px-4 py-2 text-xs font-bold transition-opacity hover:opacity-90"
                        style={{ background: "#7C3AED", color: "#ffffff" }}
                      >
                        Campagne
                      </Link>
                    ) : (
                      <Link
                        href={`/biens/${bien.id}`}
                        className="rounded-xl px-4 py-2 text-xs font-bold transition-opacity hover:opacity-80"
                        style={{ background: "#EDE9FE", color: "#5B21B6", border: "1px solid #DDD6FE" }}
                      >
                        Générer
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
