import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();
  const { supabaseId, nomAgence } = body as { supabaseId?: string; nomAgence?: string };

  if (!supabaseId || typeof nomAgence !== "string") {
    return Response.json({ error: "Données invalides" }, { status: 400 });
  }

  // Vérification sécurité : le supabaseId doit appartenir au clerk userId connecté
  const { data: dbUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .eq("id", supabaseId)
    .single();

  if (!dbUser) return Response.json({ error: "Accès refusé" }, { status: 403 });

  const { error } = await supabaseAdmin
    .from("users")
    .update({ nom_agence: nomAgence.trim() || null })
    .eq("id", supabaseId);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true });
}
