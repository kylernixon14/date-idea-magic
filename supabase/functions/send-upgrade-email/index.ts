import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UpgradeEmailRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing upgrade confirmation email request");
    const { email, name }: UpgradeEmailRequest = await req.json();
    console.log("Sending upgrade email to:", email);

    const emailResponse = await resend.emails.send({
      from: "DateGen <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to DateGen Premium! 🎉",
      html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #e45e41; margin-bottom: 20px;">Thank you for upgrading to Premium! 🎉</h1>
          <p style="margin-bottom: 15px;">Dear ${name || 'Valued Customer'},</p>
          <p style="margin-bottom: 15px;">Thank you for upgrading to DateGen Premium! You now have lifetime access to all our premium features:</p>
          <ul style="margin-bottom: 20px;">
            <li>✨ Unlimited date idea generations</li>
            <li>💫 Premium features and customization options</li>
            <li>🎯 Priority support</li>
          </ul>
          <p style="margin-bottom: 15px;">Start exploring all the new possibilities for creating amazing dates!</p>
          <p style="margin-bottom: 20px;">If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
          <p style="color: #666;">Best regards,<br>The DateGen Team</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending upgrade confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);