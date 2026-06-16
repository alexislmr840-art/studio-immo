import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titre, ville, prix, surface, description, photosUrls, photoPrincipaleUrl } = body;

    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Non authentifié." }, { status: 401 });
    }

    await supabaseAdmin
      .from("users")
      .upsert({ clerk_id: userId }, { onConflict: "clerk_id", ignoreDuplicates: true });

    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("id, plan, credits")
      .eq("clerk_id", userId)
      .single();

    if (!dbUser) {
      return Response.json({ error: "Utilisateur introuvable." }, { status: 500 });
    }

    if (dbUser.plan === "free" || dbUser.plan === "gratuit") {
      const { data: creditsRestants } = await supabaseAdmin
        .rpc("use_credits", { uid: dbUser.id, amount: 500 });
      console.log("[generate] crédits restants:", creditsRestants);
      if (creditsRestants === null || creditsRestants === undefined) {
        return Response.json({ error: "Crédits insuffisants. Rechargez votre plan pour continuer." }, { status: 402 });
      }
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Tu es un expert en marketing immobilier, réseaux sociaux et copywriting.

Objectif : créer une stratégie de publication complète pour automatiser la communication d'un bien immobilier.

Bien immobilier :
Titre : ${titre}
Ville : ${ville}
Prix : ${prix}
Surface : ${surface}
Description : ${description}

Réponds uniquement en JSON valide, sans markdown.

Format exact :
{
  "profilAcheteur": "",
  "pointsForts": ["", "", "", ""],
  "strategie": "",
  "publications": [
    {
      "titre": "",
      "objectif": "",
      "reseau": "",
      "jourPublication": "",
      "accroche": "",
      "facebook": "",
      "instagram": "",
      "story": "",
      "ideeVisuelA": "",
      "ideeVisuelB": ""
    }
  ]
}

Règles :
- Crée exactement 5 publications.
- Chaque publication doit avoir un rôle différent.
- Les textes doivent être courts, puissants et faciles à lire.
- Utilise des emojis professionnels.
- Mets des retours à la ligne dans les textes.
- Les accroches doivent arrêter quelqu'un qui scrolle.
- Les publications doivent vendre le bénéfice, pas seulement décrire le bien.
- Instagram doit avoir des hashtags.
- Story doit être très courte et directe.
- Évite les phrases génériques.
- Les idées visuelles doivent être concrètes.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content || "{}");

    let generationId: string | null = null;

    const { data: bien } = await supabaseAdmin
      .from("biens")
      .insert({
        user_id: dbUser.id,
        titre,
        ville: ville || "",
        prix: prix || null,
        surface: surface || null,
        description: description || null,
        afficher_prix: true,
        photos_urls: Array.isArray(photosUrls) ? photosUrls : [],
        photo_principale_url: photoPrincipaleUrl || null,
      })
      .select("id")
      .single();

    if (bien) {
      const { data: generation } = await supabaseAdmin
        .from("generations")
        .insert({ bien_id: bien.id, user_id: dbUser.id, resultat_json: parsed })
        .select("id")
        .single();
      generationId = generation?.id ?? null;
      revalidatePath("/dashboard");
    }

    return Response.json({ ...parsed, _generationId: generationId });

  } catch (error) {
    console.error("[generate] Exception:", error);
    const isTimeout = error instanceof Error && error.name === "AbortError";
    return Response.json(
      { error: isTimeout ? "La génération a dépassé le délai autorisé. Merci de réessayer." : "La génération a échoué, merci de réessayer." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
