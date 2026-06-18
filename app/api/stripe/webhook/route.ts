import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { clerkClient } from "@clerk/nextjs/server";
import { Resend } from "resend";
import type Stripe from "stripe";

const resend = new Resend(process.env.RESEND_API_KEY);

const PLAN_LABELS: Record<string, string> = {
  solo: "Solo — 39 €/mois",
  equipe: "Équipe — 79 €/mois",
};

function buildConfirmationEmail(firstName: string, plan: string): string {
  const planLabel = PLAN_LABELS[plan] ?? plan;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenue sur Studio Immo Pro</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#7C3AED;padding:32px 40px;text-align:center;">
              <span style="font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Studio Immo</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">${firstName ? `Bienvenue ${firstName}&nbsp;!` : "Bienvenue&nbsp;!"} 🎉</h1>
              <p style="margin:0 0 24px;font-size:16px;color:#6B7280;line-height:1.6;">
                Votre abonnement <strong style="color:#7C3AED;">${planLabel}</strong> est maintenant actif.<br />
                Vous avez accès à toutes les fonctionnalités de Studio Immo Pro.
              </p>

              <!-- Plan card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#F5F3FF;border:1px solid #DDD6FE;border-radius:8px;padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#7C3AED;text-transform:uppercase;letter-spacing:0.05em;">Plan souscrit</p>
                    <p style="margin:0;font-size:18px;font-weight:700;color:#111827;">${planLabel}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#7C3AED;border-radius:8px;">
                    <a href="https://studioimmo.fr/dashboard"
                       style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;">
                      Accéder à mon dashboard →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#9CA3AF;line-height:1.6;">
                Une question ? Répondez directement à cet email, nous vous répondrons sous 24h.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#9CA3AF;">
                Studio Immo SAS — 12 rue de la Paix, 75001 Paris, France
              </p>
              <p style="margin:0;font-size:12px;color:#9CA3AF;">
                Vous recevez cet email car vous venez de souscrire un abonnement Studio Immo.<br />
                <a href="https://studioimmo.fr/dashboard/parametres" style="color:#7C3AED;text-decoration:underline;">Gérer mes préférences email</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const dynamic = "force-dynamic";

function creditsForPlan(plan: string): number {
  if (plan === "solo") return 5000;
  if (plan === "equipe") return 50000;
  return 500;
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

        // Email de confirmation — erreurs non bloquantes pour le webhook
        try {
          const clerk = await clerkClient();
          const user = await clerk.users.getUser(clerkId);
          const email = user.emailAddresses[0]?.emailAddress;
          const firstName = user.firstName ?? "";

          if (email) {
            await resend.emails.send({
              from: "Studio Immo <noreply@studioimmo.fr>",
              to: email,
              subject: "Bienvenue sur Studio Immo Pro 🎉",
              html: buildConfirmationEmail(firstName, plan),
            });
          }
        } catch (emailErr) {
          console.error("Erreur envoi email de confirmation:", emailErr);
        }

        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.status !== "active") break;

        const priceId = sub.items.data[0]?.price.id;
        let plan: string | null = null;
        if (priceId === process.env.STRIPE_PRICE_SOLO) plan = "solo";
        if (priceId === process.env.STRIPE_PRICE_EQUIPE) plan = "equipe";

        if (!plan) break;

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
          .update({ plan: "gratuit", stripe_subscription_id: null, credits: 500 })
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
