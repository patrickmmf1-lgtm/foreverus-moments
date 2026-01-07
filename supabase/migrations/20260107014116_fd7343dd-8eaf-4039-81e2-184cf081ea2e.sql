-- Create a public view with only shareable fields (excludes billing_id and status)
CREATE VIEW public.pages_public AS
SELECT 
  id, 
  slug, 
  type, 
  name1, 
  name2, 
  occasion, 
  message, 
  start_date, 
  photo_url, 
  photos, 
  plan, 
  created_at, 
  is_active
FROM public.pages
WHERE is_active = true;

-- Enable RLS on the view
ALTER VIEW public.pages_public SET (security_invoker = on);

-- Drop the current overly permissive SELECT policy on pages table
DROP POLICY IF EXISTS "Anyone can view active pages" ON public.pages;

-- Create a new restrictive policy that only allows SELECT via service role
-- Regular clients should use the pages_public view instead
CREATE POLICY "Pages only accessible via service role or view"
ON public.pages
FOR SELECT
USING (false);

-- Grant SELECT on the public view to anon and authenticated roles
GRANT SELECT ON public.pages_public TO anon;
GRANT SELECT ON public.pages_public TO authenticated;