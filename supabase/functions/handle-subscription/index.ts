import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the stripe signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('No stripe signature found')
      throw new Error('No stripe signature found')
    }

    // Get the raw body as text
    const body = await req.text()
    
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Verify the webhook signature
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('Missing webhook secret')
      throw new Error('Missing webhook secret')
    }

    console.log('Constructing event with signature:', signature)
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    console.log('Event type:', event.type)

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('Processing completed checkout session:', session.id)
      
      // Get the user ID from metadata
      const userId = session.metadata?.user_id
      if (!userId) {
        console.error('No user ID in metadata')
        throw new Error('No user ID in metadata')
      }

      console.log('Updating access for user:', userId)

      // Create Supabase client
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )

      // Update user access
      const { error: updateError } = await supabaseClient
        .from('user_access')
        .update({ 
          access_type: 'lifetime',
          stripe_customer_id: session.customer,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error updating user access:', updateError)
        throw updateError
      }

      console.log('Successfully updated access for user:', userId)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})