export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import DashboardMain, { type BienDashboard } from "@/components/DashboardMain";
import { supabaseAdmin } from "@/lib/supabase";

export default async function DashboardPage() {
  const [{ userId }, user] = await Promise.all([auth(), currentUser()]);

  const prenom = user?.firstName || "Agent";
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bonne après-midi" : "Bonsoir";

  let derniersBiens: BienDashboard[] = [];
  if (userId) {
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (dbUser) {
      const { data: biens } = await supabaseAdmin
        .from("biens")
        .select("id, titre, ville, prix, surface, photo_principale_url")
        .eq("user_id", dbUser.id)
        .order("created_at", { ascending: false })
        .limit(3);

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

      derniersBiens = (biens ?? []).map((b) => ({
        id: b.id,
        titre: b.titre,
        ville: b.ville ?? null,
        prix: b.prix ?? null,
        surface: b.surface ?? null,
        photo_principale_url: b.photo_principale_url ?? null,
        latestGenId: latestGenMap.get(b.id) ?? null,
      }));
    }
  }

  return <DashboardMain prenom={prenom} greeting={greeting} createdAt={createdAt} derniersBiens={derniersBiens} />;
}
