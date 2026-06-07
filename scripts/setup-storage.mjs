/**
 * Script one-shot : crée le bucket photos-biens et applique la migration 004_photos
 * Usage : node scripts/setup-storage.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = "https://ehlyrqmnuqtofqcofujp.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function run() {
  /* 1 — Bucket photos-biens */
  console.log("Création du bucket photos-biens...");
  const { data: buckets } = await admin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === "photos-biens");

  if (exists) {
    console.log("  ✓ Bucket déjà existant.");
  } else {
    const { error } = await admin.storage.createBucket("photos-biens", {
      public: true,
      fileSizeLimit: 10485760, // 10 Mo
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });
    if (error) {
      console.error("  ✗ Erreur création bucket:", error.message);
    } else {
      console.log("  ✓ Bucket créé avec accès public.");
    }
  }

  /* 2 — Colonnes SQL sur la table biens */
  console.log("Application migration SQL 004_photos...");
  const { error: sqlError } = await admin.rpc("exec_sql", {
    sql: `
      ALTER TABLE biens
        ADD COLUMN IF NOT EXISTS photos_urls text[] NOT NULL DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS photo_principale_url text;
    `,
  });

  if (sqlError) {
    // exec_sql n'existe peut-être pas — on passe par l'API REST directement
    console.warn("  exec_sql indisponible, tentative via pg_query...", sqlError.message);

    // Tentative via l'endpoint SQL de Supabase (nécessite service role)
    const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: "ALTER TABLE biens ADD COLUMN IF NOT EXISTS photos_urls text[] NOT NULL DEFAULT '{}', ADD COLUMN IF NOT EXISTS photo_principale_url text;",
      }),
    });

    if (!res.ok) {
      console.log("\n  ⚠️  Appliquez manuellement la migration SQL dans le dashboard Supabase :");
      console.log("  ──────────────────────────────────────────────────────────────────");
      console.log("  ALTER TABLE biens");
      console.log("    ADD COLUMN IF NOT EXISTS photos_urls text[] NOT NULL DEFAULT '{}',");
      console.log("    ADD COLUMN IF NOT EXISTS photo_principale_url text;");
      console.log("  ──────────────────────────────────────────────────────────────────\n");
    } else {
      console.log("  ✓ Migration SQL appliquée.");
    }
  } else {
    console.log("  ✓ Migration SQL appliquée.");
  }

  console.log("\nTerminé.");
}

run().catch(console.error);
