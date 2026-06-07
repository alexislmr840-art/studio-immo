-- Colonnes photos sur la table biens
ALTER TABLE biens
  ADD COLUMN IF NOT EXISTS photos_urls        text[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS photo_principale_url text;

-- Bucket Supabase Storage public pour les photos de biens
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos-biens', 'photos-biens', true)
ON CONFLICT (id) DO NOTHING;

-- Tout le monde peut lire (bucket public)
CREATE POLICY IF NOT EXISTS "photos-biens public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos-biens');

-- Seuls les utilisateurs authentifiés peuvent uploader
CREATE POLICY IF NOT EXISTS "photos-biens auth upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'photos-biens');

-- Les utilisateurs peuvent supprimer leurs propres fichiers
CREATE POLICY IF NOT EXISTS "photos-biens auth delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'photos-biens');
