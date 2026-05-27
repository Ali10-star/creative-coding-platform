-- ============================================================================
-- 0002_rls_policies.sql
-- Enable RLS on every public table and define policies.
-- Pattern: anon/authenticated can read published rows; admins do everything.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- ENABLE RLS
-- --------------------------------------------------------------------------
ALTER TABLE public.sketches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sketch_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_sketches ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- SKETCHES
-- ---------------------------------------------------------------------------
CREATE POLICY "Public can read published sketches"
  ON public.sketches FOR SELECT
  TO anon, authenticated
  USING ( published = true );

CREATE POLICY "Admins can read all sketches"
  ON public.sketches FOR SELECT
  TO authenticated
  USING ( (SELECT public.is_admin()) );

CREATE POLICY "Admins can insert sketches"
  ON public.sketches FOR INSERT
  TO authenticated
  WITH CHECK ( (SELECT public.is_admin()) );

CREATE POLICY "Admins can update sketches"
  ON public.sketches FOR UPDATE
  TO authenticated
  USING ( (SELECT public.is_admin()) )
  WITH CHECK ( (SELECT public.is_admin()) );

CREATE POLICY "Admins can delete sketches"
  ON public.sketches FOR DELETE
  TO authenticated
  USING ( (SELECT public.is_admin()) );

-- ---------------------------------------------------------------------------
-- POSTS
-- ---------------------------------------------------------------------------
CREATE POLICY "Public can read published posts"
  ON public.posts FOR SELECT
  TO anon, authenticated
  USING ( published = true );

CREATE POLICY "Admins can read all posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING ( (SELECT public.is_admin()) );

CREATE POLICY "Admin can write posts"
  ON public.posts FOR ALL
  TO authenticated
  USING ( (SELECT public.is_admin()) )
  WITH CHECK ( (SELECT public.is_admin()) );

-- ---------------------------------------------------------------------------
-- TAGS
-- ---------------------------------------------------------------------------
CREATE POLICY "Public can read tags"
  ON public.tags FOR SELECT
  TO anon, authenticated
  USING ( true );

CREATE POLICY "Admins can write tags"
  ON public.tags FOR ALL
  TO authenticated
  USING ( (SELECT public.is_admin()) )
  WITH CHECK ( (SELECT public.is_admin()) );

-- ---------------------------------------------------------------------------
-- JOIN TABLES
-- ---------------------------------------------------------------------------
CREATE POLICY "Public can read sketch_tags" 
  ON public.sketch_tags FOR SELECT 
  TO anon, authenticated 
  USING ( true );

CREATE POLICY "Admins can write sketch_tags"
  ON public.sketch_tags FOR ALL 
  TO authenticated
  USING ( (select public.is_admin()) ) 
  WITH CHECK ( (select public.is_admin()) );
  
CREATE POLICY "Public can read post_tags"
  ON public.post_tags FOR SELECT 
  TO anon, authenticated 
  USING ( true );
  
CREATE POLICY "Admins can write post_tags"
  ON public.post_tags FOR ALL 
  TO authenticated
  USING ( (select public.is_admin()) ) 
  WITH CHECK ( (select public.is_admin()) );
  
CREATE POLICY "Public can read post_sketches"
  ON public.post_sketches FOR SELECT 
  TO anon, authenticated 
  USING ( true );

CREATE POLICY "Admins can write post_sketches"
  ON public.post_sketches FOR ALL 
  TO authenticated
  USING ( (select public.is_admin()) ) 
  WITH CHECK ( (select public.is_admin()) );
  

  