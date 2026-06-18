import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { data: dbUser } = await supabaseAdmin
    .from("users")
    .select("id, plan, credits")
    .eq("clerk_id", userId)
    .single();

  if (!dbUser) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

  // Totaux globaux
  const [biensResult, gensResult] = await Promise.all([
    supabaseAdmin
      .from("biens")
      .select("id, titre, ville, created_at", { count: "exact" })
      .eq("user_id", dbUser.id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("generations")
      .select("id, created_at", { count: "exact" })
      .eq("user_id", dbUser.id),
  ]);

  const totalBiens = biensResult.count ?? 0;
  const totalCampagnes = gensResult.count ?? 0;

  // Dernière génération (pour dernier bien traité)
  const dernierBien = biensResult.data?.[0] ?? null;

  // Activité par mois sur l'année en cours
  const annee = new Date().getFullYear();
  const parMois = Array(12).fill(0);
  for (const g of gensResult.data ?? []) {
    const d = new Date(g.created_at);
    if (d.getFullYear() === annee) parMois[d.getMonth()]++;
  }

  // Activité sur les 7 derniers jours
  const today = new Date();
  const parJour = Array(7).fill(0);
  for (const g of gensResult.data ?? []) {
    const d = new Date(g.created_at);
    const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) parJour[6 - diffDays]++;
  }

  // Crédits
  const maxCredits = dbUser.plan === "equipe" ? 50000 : dbUser.plan === "solo" ? 5000 : 500;

  return Response.json({
    totalBiens,
    totalCampagnes,
    totalPublications: totalCampagnes * 5,
    totalVisuels: totalCampagnes * 2,
    credits: dbUser.credits ?? 200,
    maxCredits,
    plan: dbUser.plan ?? "free",
    dernierBien,
    parMois,
    parJour,
  });
}
