import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import Stripe from 'npm:stripe@17.5.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey'
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { userId, planId, successUrl, cancelUrl } = await req.json();

    if (userId !== user.id) {
      throw new Error('User ID mismatch');
    }

    const priceIds: Record<string, string> = {
      pro: Deno.env.get('STRIPE_PRO_PRICE_ID') || '',
      premium: Deno.env.get('STRIPE_PREMIUM_PRICE_ID') || ''
    };

    const priceId = priceIds[planId];
    if (!priceId) {
      throw new Error('Invalid plan ID');
    }

    let customerId: string;

    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingSub?.stripe_customer_id) {
      customerId = existingSub.stripe_customer_id;
    } else {
      const { data: userData } = await supabase
        .from('users')
        .select('email, artist_name')
        .eq('id', userId)
        .single();

      const customer = await stripe.customers.create({
        email: userData?.email,
        metadata: {
          supabase_user_id: userId
        }
      });
      customerId = customer.id;

      await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_customer_id: customerId,
          plan_id: planId,
          status: 'incomplete'
        });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          supabase_user_id: userId
        }
      }
    });

    return new Response(JSON.stringify({ sessionUrl: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Create checkout error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});