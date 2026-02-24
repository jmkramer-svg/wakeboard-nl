-- Wakeboard NL — CMS migratie
-- Voer dit uit in de Supabase SQL Editor (los van het originele schema)

-- ============================================================
-- 1. Obstacles kolom toevoegen aan bestaande spots tabel
-- ============================================================
ALTER TABLE spots ADD COLUMN IF NOT EXISTS obstacles TEXT[] DEFAULT '{}';

-- ============================================================
-- 2. Articles tabel
-- ============================================================
CREATE TABLE IF NOT EXISTS articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  content          TEXT NOT NULL DEFAULT '',
  excerpt          TEXT,
  cover_image_url  TEXT,
  meta_title       TEXT,
  meta_description TEXT,
  focus_keyword    TEXT,
  is_published     BOOLEAN NOT NULL DEFAULT false,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS articles_slug_idx         ON articles(slug);
CREATE INDEX IF NOT EXISTS articles_is_published_idx ON articles(is_published);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles(published_at DESC);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "articles_read_published" ON articles
  FOR SELECT USING (is_published = true);

CREATE POLICY "articles_admin_all" ON articles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. Reviews tabel
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id      UUID REFERENCES spots(id) ON DELETE CASCADE,
  author_name  TEXT NOT NULL,
  author_email TEXT,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content      TEXT NOT NULL,
  is_approved  BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reviews_spot_id_idx     ON reviews(spot_id);
CREATE INDEX IF NOT EXISTS reviews_is_approved_idx ON reviews(is_approved);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_insert_public" ON reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "reviews_read_approved" ON reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "reviews_admin_all" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 4. Storage buckets + policies
-- Maak de buckets eerst aan via Supabase Dashboard > Storage,
-- dan deze policies hier uitvoeren.
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('spot-images', 'spot-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "spot_images_public_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'spot-images');

CREATE POLICY "spot_images_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'spot-images' AND auth.role() = 'authenticated');

CREATE POLICY "spot_images_auth_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'spot-images' AND auth.role() = 'authenticated');

CREATE POLICY "article_images_public_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'article-images');

CREATE POLICY "article_images_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'article-images' AND auth.role() = 'authenticated');

CREATE POLICY "article_images_auth_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'article-images' AND auth.role() = 'authenticated');
