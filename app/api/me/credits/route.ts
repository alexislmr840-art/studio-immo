import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data } = await supabaseAdmin
    .from("users")
    .select("credits, plan")
    .eq("clerk_id", userId)
    .single();

  if (!data) {
    return Response.json({ credits: 0, plan: "gratuit" });
  }

  return Response.json({ credits: data.credits ?? 0, plan: data.plan ?? "gratuit" });
}
