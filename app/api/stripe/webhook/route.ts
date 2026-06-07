import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import type Stripe from "stripe";

export const config = { api: { bodyParser: false } };

function creditsForPlan(plan: string): number {
  if (plan === "solo") return 1000;
  if (plan === "equipe") return 999999;
  return 200;
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return Response.json({ error: "Signature manquante." }, { status: 400 });

  let event: Stripe.Event;
  if (process.env.NODE_ENV === "development") {
    event = JSON.parse(body) as Stripe.Event;
  } else {
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch {
      return Response.json({ error: "Signature invalide." }, { status: 400 });
    }
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const clerkId = session.metadata?.clerk_id;
        const plan = session.metadata?.plan;

        if (!clerkId || !plan) break;

        const { data: existing } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("clerk_id", clerkId)
          .single();

        if (existing) {
          await supabaseAdmin
            .from("users")
            .update({
              plan,
              stripe_subscription_id: session.subscription as string,
              stripe_customer_id: session.customer as string,
              credits: creditsForPlan(plan),
            })
            .eq("clerk_id", clerkId);
        } else {
          await supabaseAdmin.from("users").insert({
            clerk_id: clerkId,
            plan,
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string,
            credits: creditsForPlan(plan),
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.status !== "active") break;

        const priceId = sub.items.data[0]?.price.id;
        let plan = "free";
        if (priceId === process.env.STRIPE_PRICE_SOLO) plan = "solo";
        if (priceId === process.env.STRIPE_PRICE_EQUIPE) plan = "equipe";

        await supabaseAdmin
          .from("users")
          .update({ plan })
          .eq("stripe_customer_id", sub.customer as string);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from("users")
          .update({ plan: "free", stripe_subscription_id: null })
          .eq("stripe_customer_id", sub.customer as string);
        break;
      }
    }
  } catch (err) {
    console.error("Erreur webhook Stripe:", err);
    return Response.json({ error: "Erreur interne." }, { status: 500 });
  }

  return Response.json({ received: true });
}
