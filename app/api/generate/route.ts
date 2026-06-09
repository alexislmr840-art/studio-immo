import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const body = await request.json();
    const { titre, ville, prix, surface, description } = body;

    const prompt = `
Tu es un expert en marketing immobilier, réseaux sociaux et copywriting.

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
- Les idées visuelles doivent être concrètes.
- Le résultat doit donner l'impression qu'un community manager immobilier a préparé le plan.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content || "{}");

    // Sauvegarde en Supabase (best-effort : ne bloque pas la réponse en cas d'échec)
    try {
      const { userId } = await auth();
      if (userId) {
        const { data: dbUser } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("clerk_id", userId)
          .single();

        if (dbUser) {
          const { data: bien } = await supabaseAdmin
            .from("biens")
            .insert({
              user_id: dbUser.id,
              titre,
              ville: ville || null,
              prix: prix || null,
              surface: surface || null,
              description: description || null,
              afficher_prix: true,
            })
            .select("id")
            .single();

          if (bien) {
            await supabaseAdmin
              .from("generations")
              .insert({
                bien_id: bien.id,
                user_id: dbUser.id,
                resultat_json: parsed,
              });

            revalidatePath("/dashboard");
          }
        }
      }
    } catch {
      // Sauvegarde Supabase échouée — le résultat IA est quand même retourné
    }

    return Response.json(parsed);
  } catch (error) {
    return Response.json(
      { error: "Erreur pendant la génération." },
      { status: 500 }
    );
  }
}
