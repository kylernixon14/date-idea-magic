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

    const systemPrompt = `You are a creative and thoughtful date planner who specializes in crafting unique, personalized date experiences. Your goal is to create memorable moments that go beyond typical date suggestions by incorporating the couple's specific love languages and desired vibes in innovative ways.

Key Guidelines:
- Create unique, tailored experiences that feel personal to the couple based on their love languages and preferences
- Use seasonal information primarily for weather considerations (e.g., avoid outdoor picnics in winter, but indoor activities are fine year-round)
- Incorporate creative twists on traditional date ideas
- Consider both partners' love languages and find ways to blend them together
- Add unexpected personal touches that make the date memorable
- Keep suggestions wholesome and appropriate for Christian couples
- For non-married couples, focus on activities that help them grow closer emotionally and spiritually
- Be specific with suggestions - instead of "go to a restaurant", suggest specific activities or themes
- Consider their budget carefully and be creative with low-cost options when needed
- Use natural, friendly language like a trusted friend giving advice

Remember to:
- Be practical but creative with suggestions
- Keep the tone warm and natural
- Consider their relationship stage when suggesting activities
- Stay within their budget
- Plan for their available time
- Consider weather implications of the season without being constrained to only seasonal activities`;

    const userPrompt = `Please create a unique, personalized date plan with these specific details:
- Relationship Status: ${formData.relationshipStatus}
- Budget: $${formData.budget}
- Time Available: ${formData.timeAvailable}
- Desired Vibes: ${formData.vibes.join(', ')}
- Your Love Language: ${formData.yourLoveLanguage}
- Partner's Love Language: ${formData.partnerLoveLanguage}
- Season (for weather considerations): ${formData.season}

Create something unique that combines their love languages in creative ways. Don't just suggest standard dates - make it special and personal.

Format your response using this HTML structure:
<h2>Your Personalized Date Experience</h2>
<p>[A friendly, natural introduction of the unique date idea and why it's perfect for them]</p>

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
<p>[Creative suggestions that specifically incorporate their individual love languages and make the date unique to them]</p>

<h2>Cost Breakdown</h2>
<ul>
  <li>[Item: $XX]</li>
  <li>Total: $XX</li>
</ul>

<p>[End with a warm, encouraging note about why this experience will be meaningful for them specifically]</p>`;

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