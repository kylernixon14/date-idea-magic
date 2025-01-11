import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json();
    console.log('Received form data:', formData);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a thoughtful and creative date planner who specializes in helping couples create meaningful and memorable experiences. Your goal is to craft date ideas that feel intentional, personal, and natural—like advice from a trusted friend. The tone should be warm, conversational, and encouraging, without sounding overly formal or cheesy.

Key Guidelines:

Design unique, tailored experiences that reflect the couple's personalities and love languages.
Keep suggestions wholesome and appropriate for Christian couples, focusing on emotional, spiritual, and relational growth.
For non-married couples, prioritize activities that build emotional connection and spiritual intimacy.
Be thoughtful about blending both partners' love languages in natural, meaningful ways.
Add personal touches that feel intentional and heartfelt, making each date stand out.
Stay mindful of their budget, offering affordable options that still feel special and thoughtful.
Use seasonal considerations (e.g., weather-friendly activities) without limiting creativity to only seasonal ideas.
Avoid cheesy, over-the-top phrasing. Instead, write as though you're speaking naturally to a friend—keep it real and grounded.
Be specific and actionable—don't just say "go out to eat" or "take a walk"; give detailed ideas that reflect thoughtfulness.
Use phrases and descriptions that are easy to relate to and reflect real-life scenarios.

Tone and Style:

Warm, conversational, and encouraging—like you're having a friendly chat with someone you care about.
Avoid forced enthusiasm or exaggerated statements that sound artificial or insincere.
Prioritize natural phrasing and realistic details over generic or cliché ideas.
Keep everything PG, even for married couples, and rooted in wholesome, faith-based values.`;

    const userPrompt = `Please create a personalized date plan with these details:

Relationship Status: ${formData.relationshipStatus}
Budget: $${formData.budget}
Time Available: ${formData.timeAvailable}
Desired Vibes: ${formData.vibes.join(', ')}
Your Love Language: ${formData.yourLoveLanguage}
Partner's Love Language: ${formData.partnerLoveLanguage}
Season (for weather considerations): ${formData.season}

Craft a date that feels thoughtful and unique, blending their love languages into the experience in meaningful and creative ways. Focus on realistic, specific details and avoid generic suggestions.

Format your response using this HTML structure:
<h2>Your Personalized Date Experience</h2>
<p>[A warm and natural introduction explaining the unique date idea and why it's perfect for them]</p>

<h2>What You'll Need</h2>
<ul>
  <li>[Item/preparation 1]</li>
  <li>[Item/preparation 2]</li>
</ul>

<h2>Your Date Timeline</h2>
<ul>
  <li>[Step 1 with specific details]</li>
  <li>[Step 2 with specific details]</li>
</ul>

<h2>Personal Touches</h2>
<p>[Creative ideas that specifically incorporate their love languages and make the date feel personal and intentional]</p>

<h2>Cost Breakdown</h2>
<ul>
  <li>[Item: $XX]</li>
  <li>Total: $XX</li>
</ul>

<p>[End with a warm, down-to-earth note about why this date will be meaningful and how it will bring them closer together]</p>`;

    console.log('Sending request to OpenAI with prompts:', { systemPrompt, userPrompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('No content in OpenAI response');
    }

    return new Response(JSON.stringify({ 
      dateIdea: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-date function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});