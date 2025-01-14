import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { priceId, mode } = await req.json()
    console.log('Received request for priceId:', priceId, 'mode:', mode)

    // Verify Stripe key is present
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      console.error('Stripe secret key is not configured')
      return new Response(
        JSON.stringify({ error: 'Stripe configuration error' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    console.log('Auth header present:', !!authHeader)
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      console.error('Error getting user:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    console.log('Creating checkout for user:', user.id)

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })

    try {
      console.log('Attempting to list customers for email:', user.email)
      const { data: customers } = await stripe.customers.list({
        email: user.email,
        limit: 1,
      })

      let customerId = customers.data[0]?.id

      if (!customerId) {
        console.log('Creating new customer for:', user.email)
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            user_id: user.id
          }
        })
        customerId = customer.id
        console.log('Created new customer with ID:', customerId)
      } else {
        console.log('Found existing customer:', customerId)
      }

      console.log('Creating checkout session with:', {
        customerId,
        priceId,
        mode,
        userId: user.id
      })
      
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: mode,
        success_url: `${req.headers.get('origin')}/`,
        cancel_url: `${req.headers.get('origin')}/upgrade`,
        metadata: {
          user_id: user.id
        }
      })

      console.log('Checkout session response:', session)
      
      if (!session?.url) {
        console.error('No URL in session response:', session)
        return new Response(
          JSON.stringify({ 
            error: 'No checkout URL returned',
            details: 'Session created but URL is missing'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      return new Response(
        JSON.stringify({ url: session.url }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError)
      return new Response(
        JSON.stringify({ 
          error: 'Stripe API error',
          details: stripeError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
  } catch (error) {
    console.error('Error in create-checkout:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Server error',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})