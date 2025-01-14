import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { priceId, mode } = await req.json()
    console.log('Received request with:', { priceId, mode })

    // Verify Stripe key is present
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      console.error('Stripe secret key is missing')
      throw new Error('Configuration error')
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header')
      throw new Error('No authorization header')
    }

    // Initialize Supabase client
    console.log('Initializing Supabase client')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get user data
    console.log('Getting user data')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      console.error('User error:', userError)
      throw new Error('Authentication required')
    }

    console.log('User found:', user.id)

    // Initialize Stripe
    console.log('Initializing Stripe')
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })

    // Create or retrieve customer
    console.log('Looking up or creating customer')
    let customerId: string
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    })
    console.log('Customer lookup result:', customers.data.length > 0 ? 'Found existing' : 'None found')

    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      console.log('Creating new customer')
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = newCustomer.id
    }

    // Important: Use 'payment' mode for lifetime access, 'subscription' for recurring
    const checkoutMode = mode || 'payment' // Default to payment mode for lifetime access
    console.log('Creating checkout session with mode:', checkoutMode)
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: checkoutMode,
      success_url: `${req.headers.get('origin')}/`,
      cancel_url: `${req.headers.get('origin')}/`,
      metadata: {
        user_id: user.id,
      },
    })

    console.log('Checkout session created:', session.id)
    console.log('Checkout URL:', session.url)

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in checkout process:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Keeping 200 to allow client-side error handling
      }
    )
  }
})