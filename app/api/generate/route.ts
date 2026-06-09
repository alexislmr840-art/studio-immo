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

    // Sauvegarde en Supabase
    let generationId: string | null = null;
    try {
      const { userId } = await auth();
      console.log("[generate] clerk userId:", userId);

      if (!userId) {
        console.error("[generate] auth() a retourné null — utilisateur non authentifié dans le contexte API");
      } else {
        // Crée la ligne users si elle n'existe pas encore
        const upsertResult = await supabaseAdmin
          .from("users")
          .upsert({ clerk_id: userId }, { onConflict: "clerk_id", ignoreDuplicates: true });
        console.log("[generate] upsert users:", { data: upsertResult.data, error: upsertResult.error });

        const { data: dbUser, error: selectError } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("clerk_id", userId)
          .single();
        console.log("[generate] SELECT users:", { dbUser, selectError });

        if (!dbUser) {
          console.error("[generate] dbUser null après upsert — INSERT biens annulé");
        } else {
          const { data: bien, error: bienError } = await supabaseAdmin
            .from("biens")
            .insert({
              user_id: dbUser.id,
              titre,
              ville: ville || "",
              prix: prix || null,
              surface: surface || null,
              description: description || null,
              afficher_prix: true,
            })
            .select("id")
            .single();
          console.log("[generate] INSERT biens:", { bien, bienError });

          if (!bien) {
            console.error("[generate] INSERT biens échoué — INSERT generations annulé");
          } else {
            const { data: generation, error: genError } = await supabaseAdmin
              .from("generations")
              .insert({
                bien_id: bien.id,
                user_id: dbUser.id,
                resultat_json: parsed,
              })
              .select("id")
              .single();
            console.log("[generate] INSERT generations:", { generation, genError });
            generationId = generation?.id ?? null;

            revalidatePath("/dashboard");
            console.log("[generate] revalidatePath /dashboard appelé");
          }
        }
      }
    } catch (err) {
      console.error("[generate] Exception dans le bloc Supabase:", err);
    }

    console.log("[generate] réponse finale _generationId:", generationId);
    return Response.json({ ...parsed, _generationId: generationId });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    return Response.json(
      { error: isTimeout ? "La génération a dépassé le délai autorisé. Merci de réessayer." : "La génération a échoué, merci de réessayer." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
