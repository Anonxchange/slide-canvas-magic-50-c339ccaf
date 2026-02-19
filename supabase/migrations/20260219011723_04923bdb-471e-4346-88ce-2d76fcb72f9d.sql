
-- Fix presenter_notes overly permissive policy
DROP POLICY IF EXISTS "Allow all access to presenter_notes" ON public.presenter_notes;

CREATE POLICY "Public read access to presenter_notes"
  ON public.presenter_notes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert presenter_notes"
  ON public.presenter_notes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update presenter_notes"
  ON public.presenter_notes FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete presenter_notes"
  ON public.presenter_notes FOR DELETE
  USING (auth.role() = 'authenticated');
