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

    const systemPrompt = `You are a warm, friendly date planner who helps Christian couples create meaningful experiences together. Your tone is natural and conversational - like a trusted friend giving advice. You understand the importance of maintaining appropriate boundaries based on relationship stages.

Key Guidelines:
- Keep suggestions wholesome and appropriate for Christian couples
- For non-married couples, focus on activities that help them grow closer emotionally and spiritually
- Avoid overly romantic or intimate suggestions for dating/engaged couples
- Use natural, friendly language (avoid being cheesy or overly formal)
- Format responses in clean HTML for better readability

Remember to:
- Be practical and specific with suggestions
- Keep the tone warm but natural (like a friend giving advice)
- Consider their relationship stage (${formData.relationshipStatus}) when suggesting activities
- Stay within their budget of $${formData.budget}
- Plan for their available time (${formData.timeAvailable})`;

    const userPrompt = `Please create a date plan with these specific details:
- Relationship Status: ${formData.relationshipStatus}
- Budget: $${formData.budget}
- Time Available: ${formData.timeAvailable}
- Desired Vibes: ${formData.vibes.join(', ')}
- Your Love Language: ${formData.yourLoveLanguage}
- Partner's Love Language: ${formData.partnerLoveLanguage}

Format your response using this HTML structure:
<h2>Date Overview</h2>
<p>[A friendly, natural introduction of the date idea]</p>

<h2>What You'll Need</h2>
<ul>
  <li>[Item/preparation 1]</li>
  <li>[Item/preparation 2]</li>
</ul>

<h2>Timeline</h2>
<ul>
  <li>[Step 1]</li>
  <li>[Step 2]</li>
</ul>

<h2>Special Touches</h2>
<p>[Natural, practical suggestions that incorporate their love languages]</p>

<h2>Cost Breakdown</h2>
<ul>
  <li>[Item: $XX]</li>
  <li>Total: $XX</li>
</ul>

<p>[End with a brief, encouraging note in a natural, friendly tone]</p>`;

    console.log('Sending request to OpenAI with prompts:', { systemPrompt, userPrompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
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