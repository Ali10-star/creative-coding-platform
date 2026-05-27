-- ============================================================================
-- 0003_storage_buckets.sql
-- Storage buckets and their RLS policies.
-- IMPORTANT: create the buckets via the Supabase Dashboard first
-- (Storage → New bucket), then run this file.
-- Buckets needed: "thumbnails" (public), "companion-files" (public)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- THUMBNAILS (public read, admin write)
-- ---------------------------------------------------------------------------
CREATE POLICY "Public can read thumbnails"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING ( bucket_id = 'thumbnails' );

CREATE POLICY "Admins can write thumbnails"
  ON storage.objects FOR ALL
  TO authenticated
  USING ( bucket_id = 'thumbnails' AND (select public.is_admin()) )
  WITH CHECK ( bucket_id = 'thumbnails' AND (select public.is_admin()) );

-- ---------------------------------------------------------------------------
-- COMPANION FILES (public read, admin write)
-- ---------------------------------------------------------------------------
CREATE POLICY "Public can read companion files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING ( bucket_id = 'companion-files' );

CREATE POLICY "Admins can write companion files"
  ON storage.objects FOR ALL
  TO authenticated
  USING ( bucket_id = 'companion-files' AND (select public.is_admin()) )
  WITH CHECK ( bucket_id = 'companion-files' AND (select public.is_admin()) );
