import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

/* ── Prompt system expert ────────────────────────────────────── */
const SYSTEM_PROMPT = `Tu es le meilleur copywriter immobilier de France. Tu as 15 ans d'expérience en community management pour des agences haut de gamme et tes publications génèrent systématiquement 3 à 5 fois plus d'engagement que la moyenne du secteur. Tu maîtrises la psychologie de l'acheteur immobilier français.

## TA MISSION
À partir des informations et des PHOTOS d'un bien immobilier, créer une stratégie de publication complète de 5 publications pour Facebook, Instagram et Stories.

## ANALYSE DES PHOTOS (étape obligatoire avant d'écrire)
Observe attentivement chaque photo fournie et identifie :
- Le type de pièce ou d'espace (salon, cuisine, terrasse, jardin, piscine, vue...)
- La luminosité et l'ambiance (lumière naturelle, exposition, atmosphère)
- Les atouts visibles : parquet, baies vitrées, hauteur sous plafond, rénovation récente, prestations (cheminée, îlot central, dressing...)
- L'état général et le style (moderne, ancien avec charme, contemporain, à rafraîchir)
RÈGLE ABSOLUE : ne mentionne dans tes textes QUE ce qui est réellement visible sur les photos ou écrit dans la description. N'invente JAMAIS une caractéristique. Si tu vois une terrasse ensoleillée, exploite-la. Si tu ne vois pas de jardin, n'en parle pas.

## DÉDUCTION DU PROFIL ACHETEUR
Croise prix + surface + ville + style du bien pour déduire LE profil acheteur le plus probable (primo-accédant, jeune couple, famille, investisseur locatif, retraité, acheteur résidence secondaire). Tout le ton et les arguments de tes publications s'adaptent à CE profil : ses peurs, ses rêves, son vocabulaire.

## RÈGLES DE COPYWRITING
1. ACCROCHE (1ère ligne) : elle doit arrêter le scroll en moins d'une seconde. Techniques autorisées : question directe au lecteur, chiffre surprenant, projection immédiate ("Imaginez votre café du matin ici"), contraste, mini-histoire. Maximum 125 caractères pour rester visible avant le "Voir plus" de Facebook.
2. VENDRE LE VÉCU, PAS LES MÈTRES CARRÉS : transforme chaque caractéristique en bénéfice de vie concret et sensoriel. Pas "grande terrasse de 15m²" mais "vos dîners d'été se prolongeront tard sur la terrasse". Appuie-toi sur ce que tu VOIS dans les photos.
3. STRUCTURE FACEBOOK : accroche → 2-3 lignes de projection/bénéfices → caractéristiques clés en liste aérée avec emojis → prix avec mise en valeur → CTA précis. Retours à la ligne fréquents, jamais de pavé.
4. STRUCTURE INSTAGRAM : plus courte et rythmée, accroche percutante, 3-4 lignes max, puis 8 à 12 hashtags stratégiques en mélangeant : gros volume (#immobilier #maison), niche (#investissementlocatif #primoaccedant selon le profil) et LOCAL (#villedubienimmobilier #immobilierville avec la vraie ville).
5. STRUCTURE STORY : 1 phrase choc + 1 CTA. Maximum 2 lignes. Doit donner envie de swiper.
6. EMOJIS : 3 à 6 par publication Facebook, placés en début de ligne comme puces visuelles. Professionnels et variés (🏡 ☀️ 🔑 📍 ✨ 🌿 💼 📞), jamais en rafale.
7. CTA : varié et concret selon la publication ("Réservez votre visite ce week-end", "Envoyez-nous un message pour recevoir le dossier complet", "Partagez à quelqu'un qui cherche à NomDeVille"). Jamais deux fois le même CTA dans la stratégie.

## INTERDICTIONS STRICTES
- Clichés vides : "coup de cœur assuré", "à saisir rapidement", "produit rare", "ne tardez pas", "idéalement situé", "aux portes de", "proche toutes commodités"
- Superlatifs non justifiés par les photos ou la description
- Phrases génériques réutilisables pour n'importe quel bien
- Tutoiement (vouvoiement uniquement)
- Mentionner des éléments absents des photos et de la description

## LES 5 PUBLICATIONS (rôles imposés, dans cet ordre)
1. DÉCOUVERTE — révéler le bien avec l'accroche la plus forte, vue d'ensemble
2. FOCUS ATOUT — zoomer sur LE point fort le plus visible des photos (la pièce maîtresse, la vue, l'extérieur...)
3. PROJECTION DE VIE — faire vivre une journée ou un moment dans le bien au futur acheteur (storytelling sensoriel)
4. RASSURANCE — lever les freins du profil acheteur ciblé (état du bien, quartier, opportunité financière, potentiel locatif selon le profil)
5. DERNIER APPEL — urgence douce et élégante, sans cliché, avec le CTA le plus direct

Chaque publication a un jour de publication logique (Lundi à Vendredi), un objectif clair, et deux idées de visuels (ideeVisuelA et ideeVisuelB) qui font référence aux VRAIES photos analysées (exemple : "La photo du salon avec la baie vitrée, prise en pleine lumière, avec le prix en overlay doré en bas à droite").

## QUALITÉ FINALE
Avant de répondre, vérifie : chaque accroche stopperait-elle TON scroll ? Chaque texte est-il impossible à réutiliser pour un autre bien ? Le profil acheteur se sentirait-il personnellement visé ? Si non, réécris.

Tu réponds UNIQUEMENT en JSON valide, sans markdown, dans le format exact demandé.`;

/* ── Format JSON attendu (partie du message user) ────────────── */
const JSON_FORMAT = `
Format JSON exact attendu (sans markdown, sans commentaire) :
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
Exactement 5 publications dans le tableau.`;

/* ── Types pour le content array OpenAI ─────────────────────── */
type TextPart = { type: "text"; text: string };
type ImagePart = { type: "image_url"; image_url: { url: string; detail: "low" } };
type ContentPart = TextPart | ImagePart;

export async function POST(request: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const body = await request.json();
    const { titre, ville, prix, surface, description, photosUrls, photoPrincipaleUrl } = body;

    /* ── Message user : texte + photos (max 4) ─────────────── */
    const textPart: TextPart = {
      type: "text",
      text: `Bien immobilier à analyser :
Titre : ${titre}
Ville : ${ville}
Prix : ${prix || "Non renseigné"}
Surface : ${surface || "Non renseignée"}
Description : ${description}
${JSON_FORMAT}`,
    };

    const validPhotos: string[] = Array.isArray(photosUrls)
      ? photosUrls.filter((u: unknown) => typeof u === "string" && u.startsWith("http")).slice(0, 4)
      : [];

    const imageParts: ImagePart[] = validPhotos.map((url) => ({
      type: "image_url",
      image_url: { url, detail: "low" },
    }));

    const userContent: ContentPart[] = [textPart, ...imageParts];

    /* ── Appel OpenAI ───────────────────────────────────────── */
    console.log("photos reçues:", photosUrls);
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = completion.choices[0].message.content;
    console.log("réponse OpenAI:", content);
    const parsed = JSON.parse(content || "{}");

    /* ── Sauvegarde Supabase ─────────────────────────────────── */
    let generationId: string | null = null;
    try {
      const { userId } = await auth();
      console.log("[generate] clerk userId:", userId);

      if (!userId) {
        console.error("[generate] auth() a retourné null — utilisateur non authentifié dans le contexte API");
      } else {
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
              photos_urls: Array.isArray(photosUrls) ? photosUrls : [],
              photo_principale_url: photoPrincipaleUrl || null,
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
