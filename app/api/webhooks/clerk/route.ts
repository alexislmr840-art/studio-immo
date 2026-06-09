import { Webhook } from "svix";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email";

type ClerkEmailAddress = { email_address: string; id: string };

type ClerkUserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
    email_addresses: ClerkEmailAddress[];
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
  };
};

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[clerk-webhook] CLERK_WEBHOOK_SECRET manquant");
    return Response.json({ error: "Configuration manquante." }, { status: 500 });
  }

  const headersList = await headers();
  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return Response.json({ error: "En-têtes svix manquants." }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(secret);

  let event: ClerkUserCreatedEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch {
    return Response.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type !== "user.created") {
    return Response.json({ received: true });
  }

  const { id: clerkId, email_addresses, primary_email_address_id, first_name } = event.data;

  const primaryEmail = email_addresses.find((e) => e.id === primary_email_address_id);
  const email = primaryEmail?.email_address ?? email_addresses[0]?.email_address;

  // Crée la ligne users dans Supabase (ignorée si déjà existante via generate)
  try {
    await supabaseAdmin
      .from("users")
      .upsert({ clerk_id: clerkId }, { onConflict: "clerk_id", ignoreDuplicates: true });
  } catch (err) {
    console.error("[clerk-webhook] Erreur upsert users:", err);
  }

  // Envoi email de bienvenue — l'échec ne bloque jamais l'inscription
  if (email) {
    await sendWelcomeEmail(email, first_name ?? undefined);
  } else {
    console.warn("[clerk-webhook] Aucune adresse email trouvée pour", clerkId);
  }

  return Response.json({ received: true });
}
