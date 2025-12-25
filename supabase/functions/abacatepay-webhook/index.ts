import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
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
      
      // Extrair o slug do externalId dos produtos
      let slug: string | null = null;
      
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        slug = data.products[0].externalId;
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

      // Atualizar status da página para 'active'
      let updateResult;
      
      if (slug) {
        console.log('Updating page by slug:', slug);
        updateResult = await supabase
          .from('pages')
          .update({ 
            status: 'active',
            billing_id: billingId 
          })
          .eq('slug', slug);
      } else if (billingId) {
        console.log('Updating page by billing_id:', billingId);
        updateResult = await supabase
          .from('pages')
          .update({ status: 'active' })
          .eq('billing_id', billingId);
      }

      if (updateResult?.error) {
        console.error('Error updating page status:', updateResult.error);
        throw new Error(`Failed to update page: ${updateResult.error.message}`);
      }

      console.log('Page status updated successfully to active');

      return new Response(
        JSON.stringify({ 
          received: true, 
          message: 'Payment processed successfully',
          slug: slug,
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
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
