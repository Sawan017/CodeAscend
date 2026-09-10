import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
serve(async (req) => {
  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + groqApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      messages: [{role: 'user', content: 'hello'}],
    }),
  });
  const text = await response.text();
  return new Response(JSON.stringify({ status: response.status, text }), { headers: { 'Content-Type': 'application/json' } });
});
