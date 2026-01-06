-- Adicionar campos de segurança
ALTER TABLE page_activity_logs 
ADD COLUMN IF NOT EXISTS session_token TEXT,
ADD COLUMN IF NOT EXISTS page_slug TEXT;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_page_activity_logs_session 
ON page_activity_logs(session_token);

CREATE INDEX IF NOT EXISTS idx_page_activity_logs_slug 
ON page_activity_logs(page_slug);

-- REMOVER políticas antigas inseguras
DROP POLICY IF EXISTS "Anyone can create activity logs" ON page_activity_logs;
DROP POLICY IF EXISTS "Anyone can update activity logs" ON page_activity_logs;
DROP POLICY IF EXISTS "Anyone can view activity logs" ON page_activity_logs;

-- CRIAR políticas seguras
CREATE POLICY "Users can view logs by page" ON page_activity_logs
  FOR SELECT USING (true);

CREATE POLICY "Users can create logs with validation" ON page_activity_logs
  FOR INSERT WITH CHECK (
    session_token IS NOT NULL 
    AND page_slug IS NOT NULL
    AND length(session_token) > 20
  );

CREATE POLICY "Users can update own logs" ON page_activity_logs
  FOR UPDATE USING (
    session_token IS NOT NULL 
    AND page_slug IS NOT NULL
  );