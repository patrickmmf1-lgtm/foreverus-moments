import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// HMAC-SHA256 signature verification
async function verifySignature(payload: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature || !secret) return false;
  
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return signature === expectedSignature || signature === `sha256=${expectedSignature}`;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    console.log('Rejected non-POST request:', req.method);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    
    // Verify webhook signature if secret is configured
    const webhookSecret = Deno.env.get('ABACATEPAY_WEBHOOK_SECRET');
    const signature = req.headers.get('x-webhook-signature') || 
                      req.headers.get('x-signature') || 
                      req.headers.get('x-hub-signature-256');
    
    if (webhookSecret) {
      const isValid = await verifySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature - rejecting request');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('Webhook signature verified successfully');
    } else {
      console.warn('ABACATEPAY_WEBHOOK_SECRET not configured - signature verification skipped');
    }

    const payload = JSON.parse(rawBody);
    console.log('Webhook received:', JSON.stringify(payload, null, 2));

    // AbacatePay envia o evento no formato { event: "billing.paid", data: { ... } }
    const event = payload.event;
    const data = payload.data;

    if (!event || !data) {
      console.log('Invalid webhook payload - missing event or data');
      return new Response(
        JSON.stringify({ received: true, message: 'Invalid payload' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Event type:', event);
    console.log('Billing data:', data);

    // Processar apenas eventos de pagamento aprovado
    if (event === 'billing.paid' || event === 'BILLING_PAID') {
      const billingId = data.id;
      
      // Validate billingId format (basic validation)
      if (!billingId || typeof billingId !== 'string' || billingId.length < 5) {
        console.error('Invalid billing ID format:', billingId);
        return new Response(
          JSON.stringify({ error: 'Invalid billing ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Extrair o slug do externalId dos produtos
      let slug: string | null = null;
      
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        slug = data.products[0].externalId;
      }

      // Validate slug format
      if (slug && (typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug))) {
        console.error('Invalid slug format:', slug);
        return new Response(
          JSON.stringify({ error: 'Invalid slug format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Processing payment for billing:', billingId, 'slug:', slug);

      if (!slug && !billingId) {
        console.error('No slug or billing_id found in webhook data');
        return new Response(
          JSON.stringify({ received: true, message: 'No identifier found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Inicializar Supabase com service role key para bypass RLS
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // SECURITY: Verify the page exists with pending_payment status before updating
      // This prevents activating non-existent or already-active pages
      let verifyQuery;
      if (slug) {
        verifyQuery = await supabase
          .from('pages')
          .select('id, status, slug')
          .eq('slug', slug)
          .single();
      } else {
        verifyQuery = await supabase
          .from('pages')
          .select('id, status, slug')
          .eq('billing_id', billingId)
          .single();
      }

      if (verifyQuery.error || !verifyQuery.data) {
        console.error('Page not found for verification:', slug || billingId);
        return new Response(
          JSON.stringify({ error: 'Page not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if page is in pending_payment status
      if (verifyQuery.data.status !== 'pending_payment') {
        console.log('Page already processed, status:', verifyQuery.data.status);
        return new Response(
          JSON.stringify({ 
            received: true, 
            message: 'Page already processed',
            currentStatus: verifyQuery.data.status
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Atualizar status da página para 'active'
      const updateResult = await supabase
        .from('pages')
        .update({ 
          status: 'active',
          billing_id: billingId 
        })
        .eq('id', verifyQuery.data.id)
        .eq('status', 'pending_payment'); // Double-check status in update

      if (updateResult.error) {
        console.error('Error updating page status:', updateResult.error);
        throw new Error(`Failed to update page: ${updateResult.error.message}`);
      }

      console.log('Page status updated successfully to active for:', verifyQuery.data.slug);

      return new Response(
        JSON.stringify({ 
          received: true, 
          message: 'Payment processed successfully',
          slug: verifyQuery.data.slug,
          billingId: billingId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Para outros eventos, apenas confirmar recebimento
    console.log('Event not processed (not a payment event):', event);
    return new Response(
      JSON.stringify({ received: true, message: `Event ${event} received but not processed` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
