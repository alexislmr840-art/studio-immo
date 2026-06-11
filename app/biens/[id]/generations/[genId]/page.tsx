export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { GenerationClient } from "./GenerationClient";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function GenerationPage({
  params,
}: {
  params: Promise<{ id: string; genId: string }>;
}) {
  const { id, genId } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/connexion");

  const { data: dbUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!dbUser) redirect("/dashboard");

  // Vérification de la propriété via le bien
  const { data: bien } = await supabaseAdmin
    .from("biens")
    .select("id, titre, ville, prix, surface, afficher_prix")
    .eq("id", id)
    .eq("user_id", dbUser.id)
    .single();

  if (!bien) notFound();

  const { data: generation } = await supabaseAdmin
    .from("generations")
    .select("id, created_at, resultat_json")
    .eq("id", genId)
    .eq("bien_id", id)
    .single();

  if (!generation) notFound();

  return (
    <GenerationClient
      resultat={generation.resultat_json as Parameters<typeof GenerationClient>[0]["resultat"]}
      bien={bien}
      bienId={id}
      dateGeneration={formatDate(generation.created_at)}
    />
  );
}
