-- Wakeboard NL — Supabase schema
-- Voer dit uit in de Supabase SQL Editor

-- Tabel voor wakeboardspots
CREATE TABLE IF NOT EXISTS spots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT NOT NULL,
  province      TEXT NOT NULL,
  city          TEXT NOT NULL,
  address       TEXT,
  latitude      DOUBLE PRECISION NOT NULL,
  longitude     DOUBLE PRECISION NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('kabel', 'boot', 'beide')),
  difficulty    TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'gevorderd', 'alle niveaus')),
  website       TEXT,
  phone         TEXT,
  email         TEXT,
  image_url     TEXT,
  features      TEXT[] DEFAULT '{}',
  price_info    TEXT,
  opening_hours TEXT,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index voor sneller filteren
CREATE INDEX IF NOT EXISTS spots_province_idx ON spots(province);
CREATE INDEX IF NOT EXISTS spots_type_idx ON spots(type);
CREATE INDEX IF NOT EXISTS spots_is_published_idx ON spots(is_published);
CREATE INDEX IF NOT EXISTS spots_slug_idx ON spots(slug);

-- Row Level Security
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;

-- Iedereen mag gepubliceerde spots lezen
CREATE POLICY "spots_read_published" ON spots
  FOR SELECT USING (is_published = true);

-- Alleen ingelogde admins mogen alles lezen/schrijven
CREATE POLICY "spots_admin_all" ON spots
  FOR ALL USING (auth.role() = 'authenticated');

-- Updated_at automatisch bijwerken
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER spots_updated_at
  BEFORE UPDATE ON spots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- CMS uitbreiding: obstacles, articles, reviews
-- ============================================================

-- Obstacles kolom aan spots toevoegen
ALTER TABLE spots ADD COLUMN IF NOT EXISTS obstacles TEXT[] DEFAULT '{}';

-- Articles tabel
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

-- Reviews tabel
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

CREATE INDEX IF NOT EXISTS reviews_spot_id_idx    ON reviews(spot_id);
CREATE INDEX IF NOT EXISTS reviews_is_approved_idx ON reviews(is_approved);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Iedereen mag reviews indienen (niet-goedgekeurd)
CREATE POLICY "reviews_insert_public" ON reviews
  FOR INSERT WITH CHECK (true);

-- Iedereen mag goedgekeurde reviews lezen
CREATE POLICY "reviews_read_approved" ON reviews
  FOR SELECT USING (is_approved = true);

-- Admin mag alles
CREATE POLICY "reviews_admin_all" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Voorbeelddata (optioneel)
INSERT INTO spots (name, slug, description, province, city, address, latitude, longitude, type, difficulty, website, features, price_info, opening_hours, is_published)
VALUES
  (
    'WakePark Breda',
    'wakepark-breda',
    'Het grootste kabelpark van Noord-Brabant met een professionele kabel voor beginners en gevorderden. Moderne rails en kickers voor de tricks.',
    'Noord-Brabant',
    'Breda',
    'Mastweg 1, 4813 BK Breda',
    51.5719,
    4.7683,
    'kabel',
    'alle niveaus',
    'https://voorbeeld.nl',
    ARRAY['Verhuur', 'Lessen', 'Horeca', 'Parkeren', 'Kleedkamers', 'Douches'],
    'Dagkaart €30 | Seizoenskaart €250',
    'Ma-vr: 10:00-20:00' || chr(10) || 'Za-zo: 09:00-21:00',
    true
  ),
  (
    'Wakeboard Utrecht',
    'wakeboard-utrecht',
    'Prachtig gelegen kabelpark in het hart van Nederland, direct aan het water. Geschikt voor families en serieuze riders.',
    'Utrecht',
    'Utrecht',
    'Stadionplein 10, 3521 AZ Utrecht',
    52.0907,
    5.1214,
    'beide',
    'beginner',
    null,
    ARRAY['Verhuur', 'Lessen', 'Parkeren'],
    'Sessie van 1 uur €20',
    'Ma-zo: 10:00-19:00',
    true
  );
