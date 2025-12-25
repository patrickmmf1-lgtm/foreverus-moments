-- Add status and billing_id columns to pages table
ALTER TABLE public.pages 
ADD COLUMN status text NOT NULL DEFAULT 'pending_payment',
ADD COLUMN billing_id text;

-- Add constraint for valid status values
ALTER TABLE public.pages 
ADD CONSTRAINT pages_status_check CHECK (status IN ('pending_payment', 'active'));

-- Update RLS policy to allow updates to status and billing_id
CREATE POLICY "Allow status updates via service role" 
ON public.pages 
FOR UPDATE 
USING (true)
WITH CHECK (true);