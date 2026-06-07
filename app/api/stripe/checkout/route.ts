import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

const PRICES: Record<string, string> = {
  solo: process.env.STRIPE_PRICE_SOLO!,
  equipe: process.env.STRIPE_PRICE_EQUIPE!,
};

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Non authentifié." }, { status: 401 });

  const { plan } = await req.json();
  if (!["solo", "equipe"].includes(plan)) {
    return Response.json({ error: "Plan invalide." }, { status: 400 });
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ");

  // Récupère ou crée le customer Stripe
  const { data: dbUser } = await supabaseAdmin
    .from("users")
    .select("id, stripe_customer_id")
    .eq("clerk_id", userId)
    .single();

  let customerId = dbUser?.stripe_customer_id as string | undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: email ?? undefined,
      name: name || undefined,
      metadata: { clerk_id: userId },
    });
    customerId = customer.id;

    if (dbUser) {
      await supabaseAdmin
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("clerk_id", userId);
    } else {
      await supabaseAdmin.from("users").upsert(
        {
          clerk_id: userId,
          prenom: clerkUser?.firstName ?? null,
          nom: clerkUser?.lastName ?? null,
          email: email ?? null,
          stripe_customer_id: customerId,
        },
        { onConflict: "clerk_id" }
      );
    }
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: PRICES[plan], quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/tarifs`,
    metadata: { clerk_id: userId, plan },
  });

  return Response.json({ url: session.url });
}
