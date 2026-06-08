-- Ajout de la colonne crédits
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits integer NOT NULL DEFAULT 500;

-- Fonction atomique pour décrémenter les crédits
-- Retourne les crédits restants, ou NULL si insuffisants
CREATE OR REPLACE FUNCTION use_credits(uid uuid, amount integer DEFAULT 500)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  updated_credits integer;
BEGIN
  UPDATE users
  SET credits = credits - amount
  WHERE id = uid AND credits >= amount
  RETURNING credits INTO updated_credits;
  RETURN updated_credits; -- NULL si aucune ligne mise à jour (crédits insuffisants)
END;
$$;
