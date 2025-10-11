import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import Stripe from 'npm:stripe@17.5.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, stripe-signature'
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
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeSecretKey || !stripeWebhookSecret || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'No signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();

        if (existingSub) {
          await supabase
            .from('subscriptions')
            .update({
              stripe_subscription_id: subscription.id,
              plan_id: subscription.items.data[0]?.price.lookup_key || 'pro',
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end
            })
            .eq('stripe_customer_id', customerId);

          await supabase
            .from('users')
            .update({
              subscription_tier: subscription.items.data[0]?.price.lookup_key || 'pro',
              subscription_status: subscription.status
            })
            .eq('id', existingSub.user_id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();

        if (existingSub) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              cancel_at_period_end: false
            })
            .eq('stripe_customer_id', customerId);

          await supabase
            .from('users')
            .update({
              subscription_tier: 'free',
              subscription_status: 'canceled'
            })
            .eq('id', existingSub.user_id);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const customerId = paymentIntent.customer as string;

        if (customerId) {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('user_id, id')
            .eq('stripe_customer_id', customerId)
            .maybeSingle();

          if (subscription) {
            await supabase
              .from('payment_history')
              .insert({
                user_id: subscription.user_id,
                subscription_id: subscription.id,
                stripe_payment_intent_id: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: 'succeeded'
              });
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const customerId = paymentIntent.customer as string;

        if (customerId) {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('user_id, id')
            .eq('stripe_customer_id', customerId)
            .maybeSingle();

          if (subscription) {
            await supabase
              .from('payment_history')
              .insert({
                user_id: subscription.user_id,
                subscription_id: subscription.id,
                stripe_payment_intent_id: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: 'failed'
              });

            await supabase
              .from('users')
              .update({
                subscription_status: 'past_due'
              })
              .eq('id', subscription.user_id);
          }
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});