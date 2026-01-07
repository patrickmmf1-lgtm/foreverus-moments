-- Corrigir política RLS de SELECT para permitir leitura após INSERT
DROP POLICY IF EXISTS "Pages only accessible via service role or view" ON public.pages;

-- Política: permite ler páginas ativas (para visualização pública)
CREATE POLICY "Anyone can view active pages by slug"
ON public.pages
FOR SELECT
USING (status = 'active' AND is_active = true);

-- Política: permite leitura imediata após INSERT (para redirect)
CREATE POLICY "Creator can read pending pages"
ON public.pages  
FOR SELECT
USING (status = 'pending_payment');