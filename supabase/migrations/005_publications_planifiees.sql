-- Table de planification des publications
CREATE TABLE IF NOT EXISTS publications_planifiees (
  generation_id      UUID     NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  publication_index  INTEGER  NOT NULL CHECK (publication_index >= 0 AND publication_index <= 9),
  date_planifiee     TEXT     NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (generation_id, publication_index)
);

CREATE INDEX IF NOT EXISTS publications_planifiees_generation_id_idx
  ON publications_planifiees(generation_id);
