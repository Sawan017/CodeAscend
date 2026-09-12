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
    log("[ARINOVA SUPPORT 4] EDGE FUNCTION START");
    const body = await req.json();
    const { ticketId, messageId, message } = body;
    if (!ticketId) {
      return new Response(JSON.stringify({ error: 'Missing ticketId' }), { status: 400, headers: corsHeaders });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      log("[SUPPORT-AI AUTH] AUTHORIZATION HEADER PRESENT: false");
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), { status: 401, headers: corsHeaders });
    }
    log("[SUPPORT-AI AUTH] AUTHORIZATION HEADER PRESENT: true");

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      log("[SUPPORT-AI AUTH] TOKEN EXTRACTION FAILED");
      return new Response(JSON.stringify({ error: 'Unauthorized: Empty token' }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    
    log("[SUPPORT-AI AUTH] CALLING getUser(token)");
    const { data: { user }, error: authErr } = await supabaseAuth.auth.getUser(token);
    
    if (authErr) {
      log("[SUPPORT-AI AUTH] getUser ERROR: " + authErr.message);
      return new Response(JSON.stringify({ error: 'Unauthorized', details: authErr.message, hint: 'Verify the token is valid.' }), { status: 401, headers: corsHeaders });
    }
    
    if (!user) {
      log("[SUPPORT-AI AUTH] getUser FAILED: No user object returned");
      return new Response(JSON.stringify({ error: 'Unauthorized: No user found' }), { status: 401, headers: corsHeaders });
    }
    
    log("[SUPPORT-AI AUTH] USER AUTHENTICATED: true (" + user.id + ")");

    supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: ticket, error: ticketErr } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (ticketErr) throw new Error("Ticket fetch failed: " + ticketErr.message);
    if (!ticket) return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404, headers: corsHeaders });

    const { data: messages, error: msgErr } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })
      .limit(30);

    if (msgErr) throw new Error("Messages fetch failed: " + msgErr.message);
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) throw new Error("Missing GROQ_API_KEY in environment");

    const systemPrompt = `You are ARINOVA AI Support.
You are a tier-1 technical support consultant strictly for the ARINOVA platform.

CRITICAL SCOPE RULE:
Your ONLY purpose is to assist users with the ARINOVA platform itself. 
You MUST politely decline to answer ANY general knowledge questions, general coding tutorials, math problems, homework help, or unrelated requests.
If a user asks an out-of-scope question, politely explain that you are ARINOVA Support and ask them to describe their ARINOVA-related issue instead. Do NOT escalate out-of-scope questions merely because they are unrelated.

IN-SCOPE TOPICS (Help with these):
- ARINOVA account/login issues, privacy, settings
- ARINOVA Learn section, Projects, Achievements, Badges, Skill Mastery
- ARINOVA Chat, Future/Career, Goals & To Do, Notifications
- Bugs, errors, or usability issues encountered ON the ARINOVA platform

ESCALATION RULES:
You have the ability to forward the ticket to a human official.
Set "should_escalate": true ONLY for these TWO reasons:
1. USER REQUESTS HUMAN SUPPORT: The user clearly indicates their intent to speak with, contact, or be helped by an ARINOVA official, human, or support staff member.
2. AI CANNOT RESOLVE: You have genuinely tried to understand and solve an ARINOVA-related issue but determine that you cannot reliably resolve it with your available capabilities/information (e.g., account actions, critical backend bugs).

Do NOT escalate simply because:
- the question is difficult
- the user asks a follow-up question
- you need clarification (ask clarifying questions instead!)
- the user sends a short message
- you don't immediately know the answer

If you must escalate, provide an honest parting message (e.g., "I've tried to help, but this issue appears to require assistance from the ARINOVA support team. I've forwarded this ticket so an official can take a closer look.") and briefly summarize the issue in the JSON "reason" field.

SUPPORT GUIDELINES:
- Understand the user's messages naturally using the conversation history.
- Ask clarifying questions when the problem is unclear.
- Give practical step-by-step solutions when possible.
- Do not invent platform features or claim that you performed actions you cannot perform.

Return ONLY valid JSON.
Do not use Markdown or code fences.
Use exactly this structure:
{
  "answer": "your support response",
  "should_escalate": false,
  "reason": "why escalation is or is not needed"
}`;

    const conversationContext = [];
    let foundCurrentMessage = false;

    let hasImage = false;

    // Provide ticket context at the beginning
    if (ticket) {
      const ticketContentStr = `[SYSTEM: TICKET CREATED] Category: ${ticket.category}. Subject: ${ticket.subject}. Description: ${ticket.description}`;
      
      if (ticket.screenshot_path) {
        hasImage = true;
        const { data: ticketSignedData } = await supabase.storage.from('support_attachments').createSignedUrl(ticket.screenshot_path, 3600);
        
        if (ticketSignedData?.signedUrl) {
          conversationContext.push({ 
            role: 'user', 
            content: [
              { type: "text", text: ticketContentStr },
              { type: "image_url", image_url: { url: ticketSignedData.signedUrl } }
            ]
          });
        } else {
          conversationContext.push({ 
            role: 'user', 
            content: ticketContentStr + "\n[Original attachment omitted - could not load]"
          });
        }
      } else {
        conversationContext.push({ 
          role: 'user', 
          content: ticketContentStr
        });
      }
    }

    if (messages) {
      // Sort messages to ensure the user's initial message comes BEFORE the AI's initial greeting
      // If timestamps are exactly equal, 'user' comes before 'ai'
      const sortedMessages = [...messages].sort((a, b) => {
        const timeDiff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (timeDiff !== 0) return timeDiff;
        if (a.sender_type === 'user' && b.sender_type === 'ai') return -1;
        if (a.sender_type === 'ai' && b.sender_type === 'user') return 1;
        return 0;
      });

      for (const m of sortedMessages) {
        const role = m.sender_type === 'ai' ? 'assistant' : (m.sender_type === 'user' ? 'user' : 'assistant');
        
        if (m.attachment_path) {
          hasImage = true;
          const { data: signedData } = await supabase.storage.from('support_attachments').createSignedUrl(m.attachment_path, 3600);
          
          if (signedData?.signedUrl) {
            conversationContext.push({
              role,
              content: [
                { type: "text", text: m.message || "(Attachment provided)" },
                { type: "image_url", image_url: { url: signedData.signedUrl } }
              ]
            });
          } else {
            conversationContext.push({ role, content: m.message + "\n[Attachment omitted - could not load]" });
          }
        } else {
          conversationContext.push({ role, content: m.message });
        }
        
        if (messageId && m.id === messageId) {
          foundCurrentMessage = true;
        }
      }
    }

    if (messageId && !foundCurrentMessage && message) {
      // Append the explicit message if DB replication lagged
      conversationContext.push({ role: 'user', content: message });
    }
    
    // TEMPORARY LOGS FOR CONTEXT VERIFICATION
    log(`[SUPPORT CONTEXT] ticketId: ${ticketId}`);
    log(`[SUPPORT CONTEXT] originalIssue: ${ticket?.description}`);
    log(`[SUPPORT CONTEXT] messageCount: ${conversationContext.length}`);
    log(`[SUPPORT CONTEXT] latestUserMessage: ${message}`);
    log(`[SUPPORT CONTEXT] attachments: ${messages?.filter(m => m.attachment_path).length || 0}`);
    log(`[SUPPORT CONTEXT] hasImage: ${hasImage}`);

    // Force the last user message to explicitly ask for JSON to prevent the model from adding conversational filler.
    if (conversationContext.length > 0) {
      const lastMsg = conversationContext[conversationContext.length - 1];
      if (lastMsg.role === 'user') {
        if (typeof lastMsg.content === 'string') {
          lastMsg.content += "\n\nCRITICAL INSTRUCTION: You must respond ONLY with a valid JSON object starting with '{'. Do not output any conversational filler or markdown.";
        } else if (Array.isArray(lastMsg.content)) {
          lastMsg.content.push({ type: "text", text: "\n\nCRITICAL INSTRUCTION: You must respond ONLY with a valid JSON object starting with '{'. Do not output any conversational filler or markdown." });
        }
      }
    }

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...conversationContext
    ];

    log(`[SUPPORT] AI REQUEST ${messageId}`);
    
    const requestBody = {
      model: hasImage ? 'qwen/qwen3.6-27b' : 'openai/gpt-oss-20b',
      messages: apiMessages,
      max_tokens: 800,
      response_format: { type: "json_object" }
    };
    
    log(`[SUPPORT-AI] MODEL: ${requestBody.model}`);
    log(`[SUPPORT-AI] RESPONSE FORMAT: ${JSON.stringify(requestBody.response_format)}`);
    log(`[SUPPORT-AI] HAS IMAGE: ${hasImage}`);
    log(`[SUPPORT-AI] MESSAGE COUNT: ${apiMessages.length}`);
    
    // For GPT-OSS models without vision support, we MUST stringify all array contents to prevent a 400 Bad Request
    if (!hasImage && requestBody.model === 'openai/gpt-oss-20b') {
      for (const msg of requestBody.messages) {
        if (Array.isArray(msg.content)) {
          // This should never happen now that we set hasImage=true if an attachment exists,
          // but strictly enforce it as a fallback safeguard.
          msg.content = msg.content.map(c => c.text || '').join('\n');
        }
      }
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content || '{}';
    
    let jsonContent;
    try {
      // Strip possible markdown fences just in case
      let cleanContent = content.trim();
      const firstBrace = cleanContent.indexOf('{');
      const lastBrace = cleanContent.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
        cleanContent = cleanContent.substring(firstBrace, lastBrace + 1);
      }
      
      jsonContent = JSON.parse(cleanContent);
      
      // Strict type validation per requirements
      if (typeof jsonContent.answer !== 'string') {
        throw new Error("Validation failed: 'answer' must be a string");
      }
      if (typeof jsonContent.should_escalate !== 'boolean') {
        throw new Error("Validation failed: 'should_escalate' must be a boolean");
      }
      if (typeof jsonContent.reason !== 'string') {
        jsonContent.reason = String(jsonContent.reason || "");
      }
    } catch (e) {
      log("JSON parse/validate error: " + e.message);
      return new Response(JSON.stringify({ 
        error: 'Failed to parse AI response. Please try again.',
        details: e.message 
      }), { status: 400, headers: corsHeaders });
    }

    const finalAnswer = jsonContent.answer || "I am currently offline.";
    const needsEscalation = jsonContent.should_escalate === true;

    const aiMessageId = crypto.randomUUID();
    log(`[SUPPORT] AI INSERT ${aiMessageId}`);

    const { error: insertErr } = await supabase.from('support_messages').insert({
      id: aiMessageId,
      ticket_id: ticketId,
      sender_type: 'ai',
      message: finalAnswer
    });

    if (insertErr) throw new Error("Insert AI msg error: " + insertErr.message);

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

    return new Response(JSON.stringify({ answer: finalAnswer, id: aiMessageId }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    
  } catch (error) {
    log("FATAL ERROR CAUGHT: " + error.message);
    console.error("Server-side error log:", error.message, "\nDebug trace:", debugLog.join('\n'));
    // Return 200 with error details so the frontend doesn't swallow the body
    return new Response(JSON.stringify({ error: "Edge Function Error: " + error.message, trace: debugLog.join('\n') }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});












