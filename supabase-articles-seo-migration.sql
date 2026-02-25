-- Migratie: SEO + LLM-vindbaarheid kolommen toevoegen aan articles
-- Voer dit uit in de Supabase SQL Editor

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS faq_items JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS table_of_contents JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS target_keywords text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS seo_score integer DEFAULT 0;
