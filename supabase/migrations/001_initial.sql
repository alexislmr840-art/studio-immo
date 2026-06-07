-- 1. Table des utilisateurs (synchronisée depuis Clerk)
CREATE TABLE IF NOT EXISTS users (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id    TEXT        UNIQUE NOT NULL,
  prenom      TEXT,
  nom         TEXT,
  email       TEXT,
  plan        TEXT        NOT NULL DEFAULT 'free',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table des biens immobiliers
CREATE TABLE IF NOT EXISTS biens (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titre        TEXT        NOT NULL,
  ville        TEXT        NOT NULL,
  prix         TEXT,
  surface      TEXT,
  description  TEXT,
  afficher_prix BOOLEAN    NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table des générations IA
CREATE TABLE IF NOT EXISTS generations (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  bien_id      UUID        NOT NULL REFERENCES biens(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resultat_json JSONB      NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les requêtes par utilisateur
CREATE INDEX IF NOT EXISTS biens_user_id_idx       ON biens(user_id);
CREATE INDEX IF NOT EXISTS generations_user_id_idx ON generations(user_id);
CREATE INDEX IF NOT EXISTS generations_bien_id_idx ON generations(bien_id);
