import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ plan: "free", biensThisMonth: 0 });

  const { data: dbUser } = await supabaseAdmin
    .from("users")
    .select("id, plan, credits")
    .eq("clerk_id", userId)
    .single();

  if (!dbUser) return Response.json({ plan: "free", biensThisMonth: 0, credits: 200 });

  const debut = new Date();
  debut.setDate(1);
  debut.setHours(0, 0, 0, 0);

  const { count } = await supabaseAdmin
    .from("biens")
    .select("id", { count: "exact", head: true })
    .eq("user_id", dbUser.id)
    .gte("created_at", debut.toISOString());

  return Response.json({ plan: dbUser.plan, biensThisMonth: count ?? 0, credits: dbUser.credits ?? 200 });
}
