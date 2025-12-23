-- Add photos array column to pages table
ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';