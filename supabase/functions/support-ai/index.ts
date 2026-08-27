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

    log("3.5 Checking Rate Limit...");
    const { data: rlData, error: rlError } = await supabaseAuth.rpc('consume_edge_rate_limit', {
      p_action: 'support_ai',
      p_limit: 10,
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
       log("Ticket Fetch Error: " + JSON.stringify(ticketErr));
       throw new Error("Ticket fetch failed: " + ticketErr.message);
    }
    if (!ticket) {
      log("Ticket not found");
      return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404, headers: corsHeaders });
    }

    if (ticket.user_id !== user.id) {
       const { data: official } = await supabase.from('support_officials').select('*').eq('user_id', user.id).single();
       if (!official) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
       }
    }

    log(`5. Ticket Fetched: ${ticket.subject}`);
    if (ticket.status === 'closed') {
      log("Ticket is closed, aborting AI.");
      return new Response(JSON.stringify({ error: 'Ticket is closed' }), { status: 400, headers: corsHeaders });
    }

    const { data: messages, error: msgErr } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (msgErr) {
       log("Messages Fetch Error: " + JSON.stringify(msgErr));
       throw new Error("Messages fetch failed: " + msgErr.message);
    }
    
    log(`6. Messages Fetched: count=${messages?.length}`);

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    log(`7. GROQ_API_KEY present: ${!!groqApiKey}`);
    if (!groqApiKey) {
      throw new Error("Missing GROQ_API_KEY in environment");
    }

    const systemPrompt = `You are Arinova's AI Support Assistant.
You provide professional, direct tier-1 technical support for the ARINOVA platform.
RULES:
1. Always clearly act as an AI. NEVER pretend to be a human official.
2. If the user's issue seems complex, requires manual database intervention, or you cannot solve it, output escalate: true.
3. FORMATTING RULES (CRITICAL):
   - Use Markdown to structure your responses professionally.
   - Use numbered lists for step-by-step actions/troubleshooting.
   - Use bullet points for listing options, causes, or requirements.
   - Use headings (###) when a response contains multiple logical sections (e.g., "What happened", "What to do", "If the problem continues").
   - Bold important terms and actions.
   - Use inline code (\`\`) for technical values, error codes, and filenames.
   - Do NOT turn every single sentence into a separate paragraph. Group related sentences into a short paragraph.
   - Answer the user's question directly before giving additional explanation.
   - Keep responses concise and avoid giant walls of text.
4. ONLY output valid JSON in this exact format:
{
  "reply": "Your formatted markdown response to the user",
  "escalate": boolean,
  "resolved": boolean
}`;

    const sanitizePII = (text: string | undefined): string => {
      if (!text) return "";
      let s = text;
      // Emails
      s = s.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
      // Cards
      s = s.replace(/(?:\d[ -]*?){13,19}/g, (match) => {
        const digits = match.replace(/\D/g, '');
        return (digits.length >= 13 && digits.length <= 19) ? '[REDACTED_CARD]' : match;
      });
      // Phones
      s = s.replace(/(?:(?:\+|00)\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/g, (match) => {
        const digits = match.replace(/\D/g, '');
        return (digits.length >= 7 && digits.length <= 15) ? '[REDACTED_PHONE]' : match;
      });
      // Identity Numbers (Aadhaar, PAN, SSN pattern approximation)
      s = s.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[REDACTED_ID]');
      s = s.replace(/\b[A-Z]{5}\d{4}[A-Z]\b/gi, '[REDACTED_ID]');
      // Secrets/Tokens
      s = s.replace(/Bearer\s+[A-Za-z0-9\-\._~+\/]+=*/gi, 'Bearer [REDACTED_TOKEN]');
      s = s.replace(/\b(sk_[a-zA-Z0-9_]{10,})\b/g, '[REDACTED_SECRET]');
      s = s.replace(/(password|passwd|pwd|secret|token)\s*[:=]\s*(\S+)/gi, '$1: [REDACTED_SECRET]');
      return s;
    };

    const conversationContext = messages?.map((m: any) => {
      const role = m.sender_type === 'ai' ? 'assistant' : (m.sender_type === 'user' ? 'user' : 'assistant');
      return { role, content: sanitizePII(m.message) };
    }) || [];

    // Always include the original ticket issue as the starting context
    conversationContext.unshift({ 
      role: 'user', 
      content: sanitizePII(`[TICKET INITIALIZED] Category: ${ticket.category}. Subject: ${ticket.subject}. Description: ${ticket.description}`)
    });

    if (message) {
      conversationContext.push({ role: 'user', content: sanitizePII(message) });
    }

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...conversationContext
    ];

    log("8. Calling Groq API...");
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: apiMessages,
        response_format: { type: "json_object" }
      }),
    });

    log(`9. Groq API Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errText = await response.text();
      log(`Groq API Error Text: ${errText}`);
      throw new Error(`Groq API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    log(`10. Groq API JSON Response parsed. Content length: ${content.length}`);
    
    let jsonContent;
    try {
      jsonContent = JSON.parse(content);
    } catch (e) {
      log("10b. JSON Parse Error: " + e.message);
      jsonContent = { reply: "I'm having trouble processing that. An official will take over.", escalate: true };
    }

    log(`11. Inserting AI message... reply: ${jsonContent.reply?.substring(0,20)}...`);
    const { error: insertErr } = await supabase.from('support_messages').insert({
      ticket_id: ticketId,
      sender_type: 'ai',
      message: jsonContent.reply || "I am currently offline."
    });

    if (insertErr) {
      log("11b. Insert AI Msg Error: " + JSON.stringify(insertErr));
      throw new Error("Insert AI msg error: " + insertErr.message);
    }

    log("12. Inserted AI message successfully.");

    if (jsonContent.escalate) {
      log("13. Escalating ticket...");
      await supabase.from('support_tickets').update({ status: 'waiting_for_official' }).eq('id', ticketId);
      await supabase.from('support_messages').insert({
        ticket_id: ticketId,
        sender_type: 'system',
        message: 'Ticket has been escalated. An Arinova support official will take over when available.'
      });
    } else if (jsonContent.resolved) {
      log("13. Resolving ticket...");
      await supabase.from('support_tickets').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', ticketId);
    }

    log("14. Execution Complete. Returning 200 OK.");
    return new Response(JSON.stringify({ success: true, ai_response: jsonContent }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    log("FATAL ERROR CAUGHT: " + error.message);
    console.error("Server-side error log:", error.message, "\nDebug trace:", debugLog.join('\n'));
    
    // Fallback escalation on error
    if (supabase && currentTicketId) {
      log("Attempting to insert error fallback message...");
      const { error: fallbackErr } = await supabase.from('support_messages').insert({
        ticket_id: currentTicketId,
        sender_type: 'system',
        message: "Sorry, I'm having trouble processing your request right now. An official will take over shortly."
      });
      if (fallbackErr) {
         log("Fallback Insert FAILED: " + JSON.stringify(fallbackErr));
      }
      await supabase.from('support_tickets').update({ status: 'waiting_for_official' }).eq('id', currentTicketId);
    }
    
    // Ensure frontend gets a clean response without leaking internals
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
