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
    console.error('No stripe signature found in webhook request')
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!endpointSecret) {
      console.error('Missing Stripe webhook secret')
      throw new Error('Missing Stripe webhook secret')
    }

    console.log('Constructing Stripe event with signature:', signature.substring(0, 20) + '...')
    
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
          console.error('No user ID in metadata')
          throw new Error('No user ID in metadata')
        }

        console.log('Updating subscription for user:', userId)
        const subscriptionType = session.mode === 'subscription' ? 'premium' : 'lifetime'
        
        const { error: updateError } = await supabaseClient
          .from('user_subscriptions')
          .update({ 
            subscription_type: subscriptionType,
            subscription_status: 'active',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (updateError) {
          console.error('Error updating subscription:', updateError)
          throw updateError
        }

        console.log('Successfully updated subscription for user:', userId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        
        if (!customer || typeof customer === 'string' || !customer.email) {
          console.error('Invalid customer data')
          throw new Error('Invalid customer data')
        }

        console.log('Finding user for customer email:', customer.email)
        const { data: users, error: userError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('email', customer.email)
          .limit(1)

        if (userError || !users?.length) {
          console.error('Error finding user:', userError)
          throw new Error('User not found')
        }

        console.log('Updating subscription status for user:', users[0].id)
        const { error: updateError } = await supabaseClient
          .from('user_subscriptions')
          .update({ 
            subscription_type: 'free',
            subscription_status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', users[0].id)

        if (updateError) {
          console.error('Error updating subscription:', updateError)
          throw updateError
        }

        console.log('Successfully updated subscription status for user:', users[0].id)
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    )
  }
})