import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
})

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
)

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    console.log("Webhook received")

    // 1. Get Stripe signature
    const signature = req.headers.get("stripe-signature")
    if (!signature) {
      console.error("Missing stripe signature")
      return new Response("Missing stripe signature", {
        status: 400,
        headers: corsHeaders,
      })
    }

    // 2. Get webhook secret
    const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")
    if (!endpointSecret) {
      console.error("Missing Stripe webhook secret")
      return new Response("Missing Stripe webhook secret", {
        status: 500,
        headers: corsHeaders,
      })
    }

    // 3. Read raw body as text, convert to Uint8Array
    const rawBody = new TextEncoder().encode(await req.text())

    // 4. Verify event
    const event = await stripe.webhooks.constructEventAsync(rawBody, signature, endpointSecret)
    console.log("Received event:", event.type)

    // 5. Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const userId = session.metadata?.user_id
      if (!userId) {
        throw new Error("No user ID in metadata")
      }

      console.log("Processing completed checkout for user:", userId)

      // Update user access
      const { error: updateError } = await supabaseClient
        .from("user_access")
        .update({
          access_type: "lifetime",
          stripe_customer_id: session.customer,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      if (updateError) {
        console.error("Error updating user access:", updateError)
        throw updateError
      }

      // Get user email
      const { data: userData, error: userError } = await supabaseClient
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single()

      if (userError) {
        console.error("Error fetching user data:", userError)
      }

      // Send confirmation email
      try {
        const emailResponse = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-upgrade-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
            },
            body: JSON.stringify({
              email: session.customer_details?.email,
              name: userData?.full_name,
            }),
          }
        )

        if (!emailResponse.ok) {
          console.error("Error sending confirmation email:", await emailResponse.text())
        } else {
          console.log("Confirmation email sent successfully")
        }
      } catch (emailError) {
        console.error("Error calling send-upgrade-email function:", emailError)
      }

      console.log("Successfully updated user_access for user:", userId)
    }

    // 6. Respond OK
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("Error in webhook:", err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})