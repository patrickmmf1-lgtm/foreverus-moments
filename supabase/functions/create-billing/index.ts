import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ABACATEPAY_API_URL = 'https://api.abacatepay.com/v1';

// Preços em centavos
const PLAN_PRICES: Record<string, { amount: number; name: string }> = {
  '9_90': { amount: 990, name: 'Presente' },
  '19_90': { amount: 1990, name: 'Interativo' },
  '29_90': { amount: 2990, name: 'Premium' },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const abacatePayApiKey = Deno.env.get('ABACATEPAY_API_KEY');
    if (!abacatePayApiKey) {
      console.error('ABACATEPAY_API_KEY not configured');
      throw new Error('Payment service not configured');
    }

    const { slug, plan, customerEmail } = await req.json();

    console.log('Creating billing for:', { slug, plan, customerEmail });

    if (!slug || !plan) {
      throw new Error('Missing required fields: slug and plan');
    }

    const planInfo = PLAN_PRICES[plan];
    if (!planInfo) {
      throw new Error(`Invalid plan: ${plan}`);
    }

    // Construir URL de retorno dinâmica
    const origin = req.headers.get('origin') || 'https://msniwdfealteehiywbks.lovableproject.com';
    const returnUrl = `${origin}/sucesso?slug=${slug}`;

    console.log('Return URL:', returnUrl);

    // Criar ou buscar cliente na AbacatePay
    let customerId: string | null = null;
    
    if (customerEmail) {
      console.log('Creating customer with email:', customerEmail);
      const customerResponse = await fetch(`${ABACATEPAY_API_URL}/customer/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${abacatePayApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          name: 'Cliente Minha Metade',
        }),
      });

      const customerData = await customerResponse.json();
      console.log('Customer response:', customerData);

      if (customerData.data?.id) {
        customerId = customerData.data.id;
      }
    }

    // Criar billing na AbacatePay
    const billingPayload: Record<string, unknown> = {
      frequency: 'ONE_TIME',
      methods: ['PIX', 'CREDIT_CARD'],
      products: [
        {
          externalId: slug,
          name: `Minha Metade - Plano ${planInfo.name}`,
          quantity: 1,
          price: planInfo.amount,
        }
      ],
      returnUrl: returnUrl,
      completionUrl: returnUrl,
    };

    if (customerId) {
      billingPayload.customerId = customerId;
    }

    console.log('Creating billing with payload:', billingPayload);

    const billingResponse = await fetch(`${ABACATEPAY_API_URL}/billing/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacatePayApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(billingPayload),
    });

    const billingData = await billingResponse.json();
    console.log('Billing response:', billingData);

    if (billingData.error) {
      console.error('AbacatePay error:', billingData.error);
      throw new Error(billingData.error);
    }

    if (!billingData.data?.url) {
      console.error('No billing URL in response:', billingData);
      throw new Error('Failed to create billing - no URL returned');
    }

    // Atualizar página com billing_id
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: updateError } = await supabase
      .from('pages')
      .update({ billing_id: billingData.data.id })
      .eq('slug', slug);

    if (updateError) {
      console.error('Error updating page with billing_id:', updateError);
      // Não vamos falhar aqui, o pagamento ainda pode prosseguir
    }

    return new Response(
      JSON.stringify({
        checkoutUrl: billingData.data.url,
        billingId: billingData.data.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in create-billing function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
