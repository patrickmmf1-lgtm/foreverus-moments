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

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per hour per IP

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now >= entry.resetTime) {
    // New window or expired window
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }
  
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count, resetIn: entry.resetTime - now };
}

function getClientIP(req: Request): string {
  // Try various headers for client IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  return 'unknown';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = getClientIP(req);
    const rateLimitKey = `create-billing:${clientIP}`;
    const rateLimit = checkRateLimit(rateLimitKey);
    
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP.substring(0, 8)}...`);
      return new Response(
        JSON.stringify({ error: 'Muitas requisições. Tente novamente mais tarde.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetIn / 1000))
          } 
        }
      );
    }

    const abacatePayApiKey = Deno.env.get('ABACATEPAY_API_KEY');
    if (!abacatePayApiKey) {
      console.error('ABACATEPAY_API_KEY not configured');
      throw new Error('Payment service not configured');
    }

    const body = await req.json();
    const { slug, plan, customerEmail } = body;

    // Sanitize and validate email with length limit
    const sanitizedEmail = typeof customerEmail === 'string' ? customerEmail.trim().toLowerCase() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizedEmail || sanitizedEmail.length > 254 || !emailRegex.test(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate plan against known plans
    if (!plan || typeof plan !== 'string' || !PLAN_PRICES[plan]) {
      return new Response(
        JSON.stringify({ error: 'Plano inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate slug with length limits
    if (!slug || typeof slug !== 'string' || slug.length < 3 || slug.length > 100 || !/^[a-z0-9-]+$/.test(slug)) {
      return new Response(
        JSON.stringify({ error: 'Slug inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating billing for:', { slug, plan, email: sanitizedEmail.substring(0, 5) + '***', ip: clientIP.substring(0, 8) + '...' });

    // Initialize Supabase client for page validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify page exists with pending_payment status and no existing billing
    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .select('id, status, billing_id, plan')
      .eq('slug', slug)
      .single();

    if (pageError || !pageData) {
      console.error('Page not found:', slug);
      return new Response(
        JSON.stringify({ error: 'Página não encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (pageData.status !== 'pending_payment') {
      console.error('Page already processed:', slug, pageData.status);
      return new Response(
        JSON.stringify({ error: 'Esta página já foi processada' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (pageData.billing_id) {
      console.error('Page already has billing:', slug);
      return new Response(
        JSON.stringify({ error: 'Já existe um pagamento para esta página' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const planInfo = PLAN_PRICES[plan];

    // Build dynamic return URL with validated origin
    const requestOrigin = req.headers.get('origin');
    const allowedOrigins = [
      'https://msniwdfealteehiywbks.lovableproject.com',
      'https://prasempre.com.br',
      'http://localhost:5173',
      'http://localhost:8080',
    ];
    const origin = requestOrigin && allowedOrigins.some(o => requestOrigin.startsWith(o.replace(/:\d+$/, '')))
      ? requestOrigin
      : 'https://msniwdfealteehiywbks.lovableproject.com';
    const returnUrl = `${origin}/sucesso?slug=${encodeURIComponent(slug)}`;

    console.log('Return URL:', returnUrl);

    // Criar ou buscar cliente na AbacatePay
    let customerId: string | null = null;
    
    console.log('Creating customer...');
    const customerResponse = await fetch(`${ABACATEPAY_API_URL}/customer/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacatePayApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: sanitizedEmail,
        name: 'Cliente PraSempre',
      }),
    });

    const customerData = await customerResponse.json();
    console.log('Customer response:', customerData);

    if (customerData.data?.id) {
      customerId = customerData.data.id;
    }

    // Criar billing na AbacatePay
    const billingPayload: Record<string, unknown> = {
      frequency: 'ONE_TIME',
      methods: ['PIX', 'CREDIT_CARD'],
      products: [
        {
          externalId: slug,
          name: `PraSempre - Plano ${planInfo.name}`,
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

    // Atualizar página com billing_id (reusing supabase client from earlier)
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
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetIn / 1000))
        },
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
