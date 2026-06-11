import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ genId: string }> }
) {
  const { genId } = await params;
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { data: dbUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!dbUser) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const { data: generation } = await supabaseAdmin
    .from("generations")
    .select("id, resultat_json, bien_id, biens(titre, ville, prix, surface, afficher_prix)")
    .eq("id", genId)
    .eq("user_id", dbUser.id)
    .single();

  if (!generation) return Response.json({ error: "Génération introuvable" }, { status: 404 });

  const bienRaw = generation.biens as unknown as {
    titre: string;
    ville: string;
    prix: string | null;
    surface: string | null;
    afficher_prix: boolean;
  } | null;

  return Response.json({
    resultat: generation.resultat_json,
    bien: {
      titre: bienRaw?.titre ?? "",
      ville: bienRaw?.ville ?? "",
      prix: bienRaw?.prix ?? "",
      surface: bienRaw?.surface ?? "",
      description: "",
      afficherPrix: bienRaw?.afficher_prix ?? true,
    },
  });
}
