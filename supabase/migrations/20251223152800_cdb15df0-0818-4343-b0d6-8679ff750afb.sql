-- Tabela de páginas criadas pelos usuários
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'couple',
  name1 TEXT NOT NULL,
  name2 TEXT,
  occasion TEXT,
  message TEXT NOT NULL,
  start_date DATE NOT NULL,
  photo_url TEXT,
  plan TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Tabela de atividades (biblioteca)
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL,
  emoji TEXT NOT NULL,
  duration INTEGER NOT NULL
);

-- Tabela de logs de atividades por página
CREATE TABLE public.page_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  is_favorited BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para pages (leitura pública de páginas ativas)
CREATE POLICY "Anyone can view active pages" 
ON public.pages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can create pages" 
ON public.pages 
FOR INSERT 
WITH CHECK (true);

-- Políticas para activities (leitura pública)
CREATE POLICY "Anyone can view activities" 
ON public.activities 
FOR SELECT 
USING (true);

-- Políticas para page_activity_logs (leitura/escrita por página)
CREATE POLICY "Anyone can view activity logs" 
ON public.page_activity_logs 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create activity logs" 
ON public.page_activity_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update activity logs" 
ON public.page_activity_logs 
FOR UPDATE 
USING (true);

-- Criar bucket para fotos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('couple-photos', 'couple-photos', true);

-- Política de upload para o bucket
CREATE POLICY "Anyone can upload photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'couple-photos');

CREATE POLICY "Anyone can view photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'couple-photos');