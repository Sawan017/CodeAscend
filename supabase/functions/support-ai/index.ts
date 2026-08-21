import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let supabase;
  let currentTicketId;

  try {
    const { ticketId, message, isNew } = await req.json();
    currentTicketId = ticketId;

    if (!ticketId) {
      return new Response(JSON.stringify({ error: 'Missing ticketId' }), { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: ticket, error: ticketErr } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (ticketErr || !ticket) {
      return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404, headers: corsHeaders });
    }

    const { data: messages, error: msgErr } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error("Missing GROQ_API_KEY");
    }

    const systemPrompt = `You are Arinova's AI Support Assistant.
You provide friendly, direct tier-1 technical support for the ARINOVA platform.
RULES:
1. Always clearly act as an AI. NEVER pretend to be a human official.
2. If the user's issue seems complex, requires manual database intervention, account deletion bypass, or you've failed to solve it, you MUST output escalate: true.
3. Be concise and helpful.
4. ONLY output valid JSON in this exact format:
{
  "reply": "Your message to the user",
  "escalate": boolean,
  "resolved": boolean
}`;

    const conversationContext = messages?.map((m: any) => {
      const role = m.sender_type === 'ai' ? 'assistant' : (m.sender_type === 'user' ? 'user' : 'assistant');
      return { role, content: m.message };
    }) || [];

    if (isNew) {
      conversationContext.unshift({ role: 'user', content: `[TICKET INITIALIZED] Category: ${ticket.category}. Description: ${ticket.description}` });
    }

    if (message) {
      conversationContext.push({ role: 'user', content: message });
    }

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...conversationContext
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: apiMessages,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    
    let jsonContent;
    try {
      jsonContent = JSON.parse(content);
    } catch (e) {
      jsonContent = { reply: "I'm having trouble processing that. An official will take over.", escalate: true };
    }

    // Insert AI message
    await supabase.from('support_messages').insert({
      ticket_id: ticketId,
      sender_type: 'ai',
      message: jsonContent.reply
    });

    if (jsonContent.escalate) {
      await supabase.from('support_tickets').update({ status: 'waiting_for_official' }).eq('id', ticketId);
      await supabase.from('support_messages').insert({
        ticket_id: ticketId,
        sender_type: 'system',
        message: 'Ticket has been escalated. An Arinova support official will take over when available.'
      });
    } else if (jsonContent.resolved) {
      await supabase.from('support_tickets').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', ticketId);
    }

    return new Response(JSON.stringify({ success: true, ai_response: jsonContent }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('Support AI error:', error);
    
    // Fallback escalation on error
    if (supabase && currentTicketId) {
      await supabase.from('support_tickets').update({ status: 'waiting_for_official' }).eq('id', currentTicketId);
      await supabase.from('support_messages').insert({
        ticket_id: currentTicketId,
        sender_type: 'system',
        message: 'AI Support encountered an error and is currently offline. An Arinova support official will take over when available.'
      });
    }
    
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
