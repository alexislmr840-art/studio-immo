import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const SOCIALAPI_KEY = process.env.SOCIALAPI_KEY;
  const SOCIALAPI_TEST_ACCOUNT_ID = process.env.SOCIALAPI_TEST_ACCOUNT_ID;
  if (!SOCIALAPI_KEY || !SOCIALAPI_TEST_ACCOUNT_ID) {
    return Response.json({ error: "Configuration SocialAPI manquante" }, { status: 500 });
  }

  const { text, imageUrl } = await request.json() as { text: string; imageUrl?: string };
  if (!text?.trim()) {
    return Response.json({ error: "Texte requis" }, { status: 400 });
  }

  const body: Record<string, unknown> = {
    text,
    publish_now: true,
    targets: [{ account_id: SOCIALAPI_TEST_ACCOUNT_ID }],
  };
  if (imageUrl) {
    body.media = [{ url: imageUrl }];
  }

  const res = await fetch("https://api.social-api.ai/v1/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SOCIALAPI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("[publish] SocialAPI error:", data);
    return Response.json({ error: "Échec de la publication", details: data }, { status: 500 });
  }

  return Response.json({ success: true, post: data });
}
