import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!endpointSecret) {
      throw new Error('Missing Stripe webhook secret')
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    )

    console.log('Processing event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.user_id

        if (!userId) {
          throw new Error('No user ID in metadata')
        }

        const subscriptionType = session.mode === 'subscription' ? 'premium' : 'lifetime'
        
        await supabaseClient
          .from('user_subscriptions')
          .update({ 
            subscription_type: subscriptionType,
            subscription_status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        
        if (!customer || typeof customer === 'string' || !customer.email) {
          throw new Error('Invalid customer data')
        }

        const { data: users } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('email', customer.email)
          .limit(1)

        if (!users?.length) {
          throw new Error('User not found')
        }

        await supabaseClient
          .from('user_subscriptions')
          .update({ 
            subscription_type: 'free',
            subscription_status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', users[0].id)

        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    )
  }
})