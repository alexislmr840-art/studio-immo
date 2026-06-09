import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

async function resolveUser(userId: string) {
  const { data } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();
  return data;
}

async function verifyOwnership(genId: string, dbUserId: string) {
  const { data } = await supabaseAdmin
    .from("generations")
    .select("id")
    .eq("id", genId)
    .eq("user_id", dbUserId)
    .single();
  return data;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ genId: string }> }
) {
  const { genId } = await params;
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const dbUser = await resolveUser(userId);
  if (!dbUser) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const gen = await verifyOwnership(genId, dbUser.id);
  if (!gen) return Response.json({ error: "Génération introuvable" }, { status: 404 });

  const { data } = await supabaseAdmin
    .from("publications_planifiees")
    .select("publication_index, date_planifiee")
    .eq("generation_id", genId)
    .order("publication_index");

  return Response.json(data ?? []);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ genId: string }> }
) {
  const { genId } = await params;
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const dbUser = await resolveUser(userId);
  if (!dbUser) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const gen = await verifyOwnership(genId, dbUser.id);
  if (!gen) return Response.json({ error: "Génération introuvable" }, { status: 404 });

  const body = await req.json();
  const { publication_index, date_planifiee } = body as {
    publication_index: unknown;
    date_planifiee: unknown;
  };

  if (typeof publication_index !== "number" || publication_index < 0 || publication_index > 9) {
    return Response.json({ error: "publication_index invalide." }, { status: 400 });
  }
  if (typeof date_planifiee !== "string" || !date_planifiee) {
    return Response.json({ error: "date_planifiee manquante." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("publications_planifiees")
    .upsert(
      { generation_id: genId, publication_index, date_planifiee },
      { onConflict: "generation_id,publication_index" }
    );

  if (error) {
    console.error("[planification] upsert error:", error);
    return Response.json({ error: "Erreur lors de la sauvegarde." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
