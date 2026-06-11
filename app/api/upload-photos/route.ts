import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("photos") as File[];
  const principaleIdx = Number(formData.get("principale") ?? 0);

  if (files.length === 0) {
    return Response.json({ urls: [], principaleUrl: null });
  }

  const timestamp = Date.now();
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const safeName = `${userId}/${timestamp}-${i}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabaseAdmin.storage
      .from("photos-biens")
      .upload(safeName, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error(`Upload photo ${i} failed:`, error.message);
      continue;
    }

    const { data } = supabaseAdmin.storage
      .from("photos-biens")
      .getPublicUrl(safeName);

    urls.push(data.publicUrl);
  }

  const principaleUrl = urls[principaleIdx] ?? urls[0] ?? null;
  return Response.json({ urls, principaleUrl });
}
