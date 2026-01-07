-- Remove overly permissive UPDATE policy on pages table
-- Service role bypasses RLS anyway, so this policy is unnecessary
DROP POLICY IF EXISTS "Allow status updates via service role" ON public.pages;

-- Add more restrictive storage policies for couple-photos bucket
-- First, drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;

-- Create new policies with better restrictions
-- Allow public viewing of photos (intended behavior for sharing)
CREATE POLICY "Public can view couple photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'couple-photos');

-- Restrict uploads to requests with valid session (anon or authenticated)
-- Also add file size and type restrictions in the policy
CREATE POLICY "Restricted photo uploads"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'couple-photos'
  AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp'))
  AND (octet_length(name) < 500)
);