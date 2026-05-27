--  ============================================================================
-- 0001_initial_schema.sql
-- Tables, enums, indexes, triggers, and the is_admin() helper.
-- No RLS or storage here — those are in subsequent migrations.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- HELPER: is_admin()
-- Reads role from app_metadata, which users CANNOT modify themselves.
-- (Never use user_metadata for authorization — users can change it.)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role' ) = 'admin',
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- UPDATED_AT TRIGGER FUNCTION
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$;

-- ---------------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------------
CREATE TABLE public.sketches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  runtime TEXT NOT NULL DEFAULT 'p5',
  code TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '[]'::JSONB,
  actions JSONB NOT NULL DEFAULT '[]'::JSONB,
  extra_imports JSONB NOT NULL DEFAULT '{}'::JSONB,
  companion_files JSONB NOT NULL DEFAULT '[]'::JSONB,
  thumbnail_path TEXT,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX sketches_published_created_idx
  ON public.sketches (published, created_at DESC);

CREATE INDEX sketches_slug_idx ON public.sketches (slug);

CREATE TRIGGER sketches_set_updated_at
  BEFORE UPDATE ON public.sketches
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_path TEXT,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX posts_published_created_idx
  ON public.posts (published, created_at DESC);

CREATE INDEX posts_slug_idx ON public.posts (slug);

CREATE TRIGGER posts_set_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

-- Join Tables
CREATE TABLE public.sketch_tags (
  sketch_id UUID REFERENCES public.sketches(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (sketch_id, tag_id)
);

CREATE TABLE public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE public.post_sketches (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  sketch_id UUID REFERENCES public.sketches(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, sketch_id)
);
