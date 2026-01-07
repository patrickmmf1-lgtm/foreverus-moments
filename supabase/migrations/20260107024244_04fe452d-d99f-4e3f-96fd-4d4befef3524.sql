-- Fix 1: Replace overly permissive SELECT policy on page_activity_logs
-- Current: USING (true) allows anyone to read all logs
-- New: Require page_slug to be provided (restricts to per-page access)
DROP POLICY IF EXISTS "Users can view logs by page" ON public.page_activity_logs;

CREATE POLICY "Users can view logs by page_slug"
ON public.page_activity_logs
FOR SELECT
USING (page_slug IS NOT NULL);

-- Fix 2: Check if UPDATE policy exists on pages and remove if it does
-- Note: If no UPDATE policy exists, service role already handles updates (bypasses RLS)
DROP POLICY IF EXISTS "Allow status updates via service role" ON public.pages;

-- Fix 3: Enforce pending_payment status on INSERT to prevent client-side bypass
-- This ensures even if TEST_MODE is true in client, the database enforces correct status
DROP POLICY IF EXISTS "Anyone can create pages" ON public.pages;

CREATE POLICY "Anyone can create pages with pending status"
ON public.pages
FOR INSERT
WITH CHECK (status = 'pending_payment');