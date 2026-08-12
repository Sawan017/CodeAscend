const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { performanceHistory } = await req.json()

    if (!performanceHistory || !Array.isArray(performanceHistory)) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid performanceHistory array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    if (!groqApiKey) {
      console.error("GROQ_API_KEY is not set.")
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const systemPrompt = `You are the Adaptive Learning Engine for a learning platform.
Your ONLY purpose is to analyze a user's recent task performance history and output structured JSON recommending the next task's difficulty.
Do NOT output any conversational text. Output ONLY valid JSON.
The user is NOT a chat participant. Do NOT converse.
Rules:
1. Every user receives the same baseline time. Do not recommend time changes.
2. If the user consistently completes tasks significantly faster than the baseline, recommend a HIGHER DIFFICULTY.
3. If the user consistently struggles, recommend an appropriate LOWER DIFFICULTY.
4. Prevent extreme swings.
5. Output must match this JSON schema exactly:
{
  "difficulty": "Easy" | "Normal" | "Hard" | "Expert",
  "confidence": number (0.0 to 1.0),
  "reason": "short explanation"
}`

    const userPrompt = `Here is the user's recent performance history:\n${JSON.stringify(performanceHistory, null, 2)}\n\nAnalyze this and output the JSON recommendation.`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        response_format: { type: "json_object" }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Groq API error: ${response.status} ${errorText}`)
      return new Response(
        JSON.stringify({ error: 'Failed to generate response from AI' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    try {
      // Parse to ensure it's valid JSON before returning
      const jsonContent = JSON.parse(content)
      return new Response(
        JSON.stringify({ content: jsonContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (parseError) {
      console.error('Groq returned invalid JSON:', content)
      return new Response(
        JSON.stringify({ error: 'AI returned invalid structured data' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Error handling request:', error.message)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
