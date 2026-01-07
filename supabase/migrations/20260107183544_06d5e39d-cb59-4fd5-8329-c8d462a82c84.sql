-- Criar tabela para fotos mensais do Álbum do Ano (Premium)
CREATE TABLE IF NOT EXISTS public.monthly_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  page_slug TEXT NOT NULL,
  month_key TEXT NOT NULL,
  month_number INTEGER NOT NULL CHECK (month_number >= 1 AND month_number <= 12),
  photo_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(page_id, month_key)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_monthly_photos_page_id ON public.monthly_photos(page_id);
CREATE INDEX IF NOT EXISTS idx_monthly_photos_slug ON public.monthly_photos(page_slug);

-- Enable RLS
ALTER TABLE public.monthly_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies - usando session_token e page_slug como nas outras tabelas
CREATE POLICY "Anyone can view monthly photos by page_slug"
ON public.monthly_photos
FOR SELECT
USING (page_slug IS NOT NULL);

CREATE POLICY "Users can insert monthly photos with validation"
ON public.monthly_photos
FOR INSERT
WITH CHECK (page_slug IS NOT NULL);

CREATE POLICY "Users can update monthly photos"
ON public.monthly_photos
FOR UPDATE
USING (page_slug IS NOT NULL);

CREATE POLICY "Users can delete monthly photos"
ON public.monthly_photos
FOR DELETE
USING (page_slug IS NOT NULL);