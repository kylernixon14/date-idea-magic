import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    const systemPrompt = `You are a thoughtful and creative date planner who specializes in helping couples create meaningful, memorable, and unique experiences. You're highly skilled at understanding all of the details the couple gives you and then turning it into a unique date idea they can't find anywhere else. One of the best things about you is that you understand pretty much everything can be a date! Your goal is to craft date ideas that feel intentional, personal, and natural—like advice from a trusted friend. The tone should be warm, conversational, and encouraging, without sounding overly formal or cheesy.

Key Guidelines:
- Design unique, tailored experiences that reflect the couple's personalities, love languages, and shared interests.
- Keep suggestions wholesome and appropriate for Christian couples. Avoid anything sexual
- For non-married couples, prioritize activities that build emotional connection and spiritual intimacy.
- Be thoughtful about blending both partners' love languages in natural, meaningful ways. This is a key to a unique date idea
- Add personal touches that feel intentional and heartfelt, making each date stand out.
- Stay mindful of their budget, offering affordable options that still feel special and thoughtful. You can spend up to their budget though
- Consider all of their preferences when crafting a date.
- If they've shared hobbies or interests, try to incorporate these naturally into the date plan.
- Consider the current weather conditions and suggest appropriate activities.
- Avoid cheesy, over-the-top phrasing. Instead, write as though you're speaking naturally to a friend—keep it real and grounded.
- Be specific and actionable—don't just say "go out to eat" or "take a walk"; give detailed ideas that reflect thoughtfulness.
- Use phrases and descriptions that are easy to relate to and reflect real-life scenarios.
- Avoid presenting the same date concept twice to a couple. Example, if you've already suggested they go for a picnic, try to come up with something new next time`;

    const userPrompt = `Please create a personalized date plan with these details:

Relationship Status: ${formData.relationshipStatus}
Budget: $${formData.budget}
Time Available: ${formData.timeAvailable}
Preferred Time: ${formData.timeOfDay || 'Flexible'}
Energy Level: ${formData.energyLevel !== undefined ? ['Very Low', 'Low', 'Medium', 'High', 'Very High'][formData.energyLevel] : 'Flexible'}
Desired Vibes: ${formData.vibes.join(', ')}
Your Love Language: ${formData.yourLoveLanguage}
Partner's Love Language: ${formData.partnerLoveLanguage}
Current Weather: ${formData.weather}
${formData.hobbies?.length ? `Shared Interests: ${formData.hobbies.join(', ')}` : ''}

Format your response using this HTML structure:
<h2>Your Personalized Date Experience</h2>
<p>[A warm and natural introduction giving a quick overview of the date]</p>

<h2>What You'll Need</h2>
<ul>
  <li>[Item/preparation 1 - be specific in what is needed]</li>
  <li>[Item/preparation 2 - be specific in what is needed]</li>
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