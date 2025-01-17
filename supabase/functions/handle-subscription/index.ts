import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Webhook received')
    
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('Missing stripe signature')
      return new Response('Missing stripe signature', { 
        status: 400,
        headers: corsHeaders
      })
    }

    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!endpointSecret) {
      console.error('Missing Stripe webhook secret')
      return new Response('Missing Stripe webhook secret', { 
        status: 500,
        headers: corsHeaders
      })
    }

    // Read raw body
    const body = await req.text()
    console.log('Request body received')

    // Verify it's really from Stripe
    console.log('Constructing Stripe event with signature:', signature)
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    console.log('Received event:', event.type)

    // Only handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata?.user_id
      if (!userId) {
        throw new Error('No user ID in metadata')
      }

      console.log('Processing completed checkout for user:', userId)

      // Decide if it's lifetime vs. subscription
      const accessType = session.mode === 'subscription' ? 'premium' : 'lifetime'
      console.log('Setting access type to:', accessType)

      // Update user access
      const { error: updateError } = await supabaseClient
        .from('user_access')
        .update({
          access_type: accessType,
          stripe_customer_id: session.customer,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error updating user access:', updateError)
        throw updateError
      }
      
      console.log('Successfully updated user_access for user:', userId)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error in webhook:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), 
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})