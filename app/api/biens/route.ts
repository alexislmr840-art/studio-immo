import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const { data: dbUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!dbUser) return Response.json({ biens: [] });

  const { data: biens } = await supabaseAdmin
    .from("biens")
    .select("id, titre, ville, prix, surface, created_at, photo_principale_url")
    .eq("user_id", dbUser.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const bienIds = (biens ?? []).map((b) => b.id);
  const latestGenMap = new Map<string, string>();

  if (bienIds.length > 0) {
    const { data: gens } = await supabaseAdmin
      .from("generations")
      .select("id, bien_id")
      .in("bien_id", bienIds)
      .order("created_at", { ascending: false });

    for (const gen of gens ?? []) {
      if (!latestGenMap.has(gen.bien_id)) latestGenMap.set(gen.bien_id, gen.id);
    }
  }

  return Response.json({
    biens: (biens ?? []).map((b) => ({
      ...b,
      latestGenId: latestGenMap.get(b.id) ?? null,
    })),
  });
}
