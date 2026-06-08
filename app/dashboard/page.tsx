export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import DashboardMain, { type BienDashboard } from "@/components/DashboardMain";
import { supabaseAdmin } from "@/lib/supabase";

export interface DashboardStats {
  biens: number;
  campagnes: number;
  visuels: number;
  credits: number;
}

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
  let stats: DashboardStats = { biens: 0, campagnes: 0, visuels: 0, credits: 500 };

  if (userId) {
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("id, credits")
      .eq("clerk_id", userId)
      .single();

    if (dbUser) {
      const [biensResult, gensResult] = await Promise.all([
        supabaseAdmin
          .from("biens")
          .select("id, titre, ville, prix, surface, photo_principale_url", { count: "exact" })
          .eq("user_id", dbUser.id)
          .order("created_at", { ascending: false }),
        supabaseAdmin
          .from("generations")
          .select("id, bien_id", { count: "exact" })
          .eq("user_id", dbUser.id),
      ]);

      const allBiens = biensResult.data ?? [];
      const totalBiens = biensResult.count ?? 0;
      const totalCampagnes = gensResult.count ?? 0;

      // Map latest generation per bien
      const latestGenMap = new Map<string, string>();
      for (const g of gensResult.data ?? []) {
        if (!latestGenMap.has(g.bien_id)) latestGenMap.set(g.bien_id, g.id);
      }

      // 3 most recent for display
      derniersBiens = allBiens.slice(0, 3).map((b) => ({
        id: b.id,
        titre: b.titre,
        ville: b.ville ?? null,
        prix: b.prix ?? null,
        surface: b.surface ?? null,
        photo_principale_url: b.photo_principale_url ?? null,
        latestGenId: latestGenMap.get(b.id) ?? null,
      }));

      stats = {
        biens: totalBiens,
        campagnes: totalCampagnes,
        visuels: totalCampagnes * 2,
        credits: dbUser.credits ?? 500,
      };
    }
  }

  return (
    <DashboardMain
      prenom={prenom}
      greeting={greeting}
      createdAt={createdAt}
      derniersBiens={derniersBiens}
      stats={stats}
    />
  );
}
