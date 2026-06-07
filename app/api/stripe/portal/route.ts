import Stripe from "stripe";
import { auth, currentUser } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Non authentifié" }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  if (!email) return Response.json({ error: "Email introuvable" }, { status: 400 });

  // Recherche du customer Stripe par email, création si inexistant
  const existing = await stripe.customers.list({ email, limit: 1 });
  let customerId: string;

  if (existing.data.length > 0) {
    customerId = existing.data[0].id;
  } else {
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
    const customer = await stripe.customers.create({ email, name: fullName || undefined });
    customerId = customer.id;
  }

  const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/parametres`;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return Response.json({ url: session.url });
}
