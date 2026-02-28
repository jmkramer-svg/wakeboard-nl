-- Trickgids: tricks tabel met gestructureerde trick-database
-- Uitgevoerd op 2026-02-28

CREATE TABLE IF NOT EXISTS tricks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'beginner',
  image_url text,
  video_url text,
  is_current boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  category text,
  difficulty_level integer DEFAULT 1,
  direction text DEFAULT 'regular',
  trick_type text DEFAULT 'both',
  prerequisites jsonb DEFAULT '{"tricks":[],"physical":[],"mental":[]}',
  equipment jsonb DEFAULT '{}',
  steps jsonb DEFAULT '{}',
  common_mistakes jsonb DEFAULT '[]',
  exercise_progression jsonb DEFAULT '[]',
  safety jsonb DEFAULT '{"injury_risks":[],"safe_falling":"","when_to_stop":""}',
  variations jsonb DEFAULT '[]'
);

ALTER TABLE tricks ENABLE ROW LEVEL SECURITY;

CREATE POLICY tricks_read_published ON tricks FOR SELECT USING (is_published = true);
CREATE POLICY tricks_admin_all ON tricks FOR ALL USING (auth.role() = 'authenticated');
