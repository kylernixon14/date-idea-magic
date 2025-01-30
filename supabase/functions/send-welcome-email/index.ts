import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: EmailRequest = await req.json();
    console.log("Attempting to send welcome email to:", email);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to DateGen</title>
          <meta name="preheader" content="Welcome to DateGen">
        </head>
        <body style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #fbfaf8;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://dategen.app/lovable-uploads/be1d6851-8a81-4468-812e-7dd1eb1005c6.png" alt="DateGen Logo" style="width: 125px; max-width: 125px;">
            </div>
            
            <p>Hey there!</p>

            <p>We're Britt & Kyler, the founders of <a href="https://loveyourfirstyear.com" style="color: #e45e41; text-decoration: underline;">Love Your First Year</a>, and we wanted to welcome you to DateGen.</p>

            <p>As a couple, we love finding new and unique date ideas.</p>

            <p>DateGen allows you to answer a few simple questions and uses AI to generate a completely custom, completely unique date... So you can finally say "buh-bye" to boring and non-unique dates.</p>

            <p>But so many of the ideas out there were a little… weird? They were either way too sexual, way too expensive, or way too unrealistic.</p>

            <p>Not to mention, most dates were great for one of us but not great for the other (hello, mismatched love languages)</p>

            <p>We figured we couldn't be the only ones frustrated by the lack of great date ideas out there.</p>

            <p>We decided to build an app that would allow us to answer some questions and it would generate a completely custom date idea based on exactly what we need.</p>

            <p>To get started, you can generate 5 dates and will have access to all premium features like bookmarking and advanced options.</p>

            <p>Then, if you'd like to upgrade:</p>
            <ul style="list-style-type: none; padding-left: 0;">
              <li>
                <a href="https://mydategen.com/upgrade" style="color: #e45e41; text-decoration: underline;">
                  - get unlimited LIFETIME access for just $39
                </a>
              </li>
            </ul>

            <p>If you have any questions, issues, or features you'd like to see us add, shoot us a DM on Instagram <a href="https://instagram.com/loveyourfirstyear" style="color: #e45e41; text-decoration: underline;">@loveyourfirstyear</a> or an email at <a href="mailto:hello@loveyourfirstyear.com" style="color: #e45e41; text-decoration: underline;">hello@loveyourfirstyear.com</a></p>

            <p>Happy dating!</p>

            <p>-Britt & Kyler</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "DateGen <onboarding@resend.dev>",
      to: [email],
      subject: "Say buh-bye to boring dates",
      html: emailHtml,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);