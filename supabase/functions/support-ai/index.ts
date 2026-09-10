import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let supabase;
  let currentTicketId;
  let debugLog = [];

  const log = (msg) => { debugLog.push(msg); console.log(msg); };

  try {
    log("1. Edge Function Invoked");
    const body = await req.json();
    const { ticketId, message, isNew } = body;
    currentTicketId = ticketId;
    log(`2. Parsed Body. ticketId: ${ticketId}, isNew: ${isNew}`);

    if (!ticketId) {
      return new Response(JSON.stringify({ error: 'Missing ticketId' }), { status: 400, headers: corsHeaders });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    // Auth client
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user }, error: authErr } = await supabaseAuth.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    log("3. Checking Rate Limit...");
    const { data: rlData, error: rlError } = await supabaseAuth.rpc('consume_edge_rate_limit', {
      p_action: 'support_ai',
      p_limit: 100,
      p_window_seconds: 3600
    });
    
    if (rlError) {
      log("Rate limit check failed (non-fatal): " + rlError.message);
    } else if (rlData && !rlData.allowed) {
      log("Rate limit exceeded! Retry after: " + rlData.retry_after);
      return new Response(JSON.stringify({ error: 'RATE_LIMIT_EXCEEDED', retry_after: rlData.retry_after }), { 
        status: 429, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': String(rlData.retry_after) } 
      });
    }

    // Service client for operations
    supabase = createClient(supabaseUrl, supabaseServiceKey);

    log("4. Fetching Ticket...");
    const { data: ticket, error: ticketErr } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (ticketErr) {
       throw new Error("Ticket fetch failed: " + ticketErr.message);
    }
    if (!ticket) {
      return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404, headers: corsHeaders });
    }

    log("5. Fetching Messages...");
    const { data: messages, error: msgErr } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })
      .limit(30);

    if (msgErr) {
       throw new Error("Messages fetch failed: " + msgErr.message);
    }
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error("Missing GROQ_API_KEY in environment");
    }

    const systemPrompt = `You are Arinova's AI Support Consultant.
You provide intelligent, natural, and professional tier-1 technical support for the ARINOVA platform.

CRITICAL SUPPORT FLOW & RULES:
1. Be Conversational: If the user says "hello", "hlo", "i want to talk", etc., respond naturally. Greet them and ask how you can help. DO NOT escalate.
2. Handle Ambiguity: If the user says something ambiguous like "do" or "help", DO NOT escalate. Ask them to clarify what they need help with.
3. Analyze & Solve First: Understand the problem from the conversation context. Actively attempt to solve it. Provide clear troubleshooting steps.
4. Escalation is a LAST RESORT: NEVER escalate or use "connecting you to officials" as a default response. Escalate ONLY if:
   - The issue genuinely requires account-level human intervention (e.g., refunds, backend bugs).
   - The user explicitly demands a human AFTER you have tried to help.
5. Identity: Act as an AI consultant. Do not pretend to be human.

FORMATTING RULES:
- Use Markdown.
- Use numbered lists for steps.
- Be concise.

ONLY output valid JSON in this exact format (do not include markdown \`\`\`json wrappers):
{
  "answer": "Your natural response to the user",
  "should_escalate": false,
  "reason": null
}`;

    const sanitizePII = (text) => {
      if (!text) return "";
      let s = text;
      s = s.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
      s = s.replace(/(?:\d[ -]*?){13,19}/g, (match) => {
        const digits = match.replace(/\D/g, '');
        return (digits.length >= 13 && digits.length <= 19) ? '[REDACTED_CARD]' : match;
      });
      s = s.replace(/(?:(?:\+|00)\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/g, (match) => {
        const digits = match.replace(/\D/g, '');
        return (digits.length >= 7 && digits.length <= 15) ? '[REDACTED_PHONE]' : match;
      });
      return s;
    };

    const conversationContext = messages?.map((m) => {
      const role = m.sender_type === 'ai' ? 'assistant' : (m.sender_type === 'user' ? 'user' : 'assistant');
      return { role, content: sanitizePII(m.message) };
    }) || [];

    // Provide ticket context at the beginning
    if (ticket) {
      conversationContext.unshift({ 
        role: 'user', 
        content: sanitizePII(`[SYSTEM: TICKET CREATED] Category: ${ticket.category}. Subject: ${ticket.subject}. Description: ${ticket.description}`)
      });
    }

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...conversationContext
    ];
    
    // Enforce JSON at the end
    apiMessages.push({ role: 'system', content: 'Remember, you MUST respond ONLY with the required JSON object. No other text.' });

    log("8. Calling Groq API...");
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: apiMessages,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content || '{}';
    
    let jsonContent;
    try {
      // Find the first { and last }
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
        content = content.substring(firstBrace, lastBrace + 1);
      }
      jsonContent = JSON.parse(content);
    } catch (e) {
      jsonContent = { answer: "I'm having trouble processing that. Could you please rephrase?", should_escalate: false };
    }

    const finalAnswer = jsonContent.answer || jsonContent.response || "I am currently offline.";
    const needsEscalation = jsonContent.should_escalate || jsonContent.needsEscalation || jsonContent.escalate === true;

    log(`11. Inserting AI message... reply: ${finalAnswer.substring(0,20)}...`);
    const { error: insertErr } = await supabase.from('support_messages').insert({
      ticket_id: ticketId,
      sender_type: 'ai',
      message: finalAnswer
    });

    if (insertErr) {
      throw new Error("Insert AI msg error: " + insertErr.message);
    }

    if (needsEscalation) {
      await supabase.from('support_tickets').update({ status: 'waiting_for_official' }).eq('id', ticketId);
      await supabase.from('support_messages').insert({
        ticket_id: ticketId,
        sender_type: 'system',
        message: `Ticket has been escalated. An Arinova support official will take over when available.\n\nReason: ${jsonContent.reason || jsonContent.escalationReason || 'Automatic AI escalation'}`
      });
    } else if (jsonContent.resolved) {
      await supabase.from('support_tickets').update({ status: 'closed', resolved_at: new Date().toISOString() }).eq('id', ticketId);
    }

    return new Response(JSON.stringify({ success: true, ai_response: jsonContent }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    log("FATAL ERROR CAUGHT: " + error.message);
    console.error("Server-side error log:", error.message, "\nDebug trace:", debugLog.join('\n'));
    
    // Graceful error handling in case of API failure - no automatic escalation!
    if (supabase && currentTicketId) {
      await supabase.from('support_messages').insert({
        ticket_id: currentTicketId,
        sender_type: 'ai',
        message: "I'm having trouble connecting to my service right now. Please wait a moment and try sending your message again."
      });
    }
    
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});



