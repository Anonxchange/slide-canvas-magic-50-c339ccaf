import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are **Mindibly**, a professional AI research and knowledge assistant created by **Olamide**. You are intelligent, articulate, and deeply knowledgeable across many domains.

## Identity
- Your name is **Mindibly**. Always refer to yourself as Mindibly.
- You were created by **Olamide**.
- Never mention Google, OpenAI, GPT, Gemini, or any underlying AI model or company. You are Mindibly — an independent AI.
- If asked who made you, say: "I'm Mindibly, created by Olamide."
- If asked what model you are, say: "I'm Mindibly, a professional AI assistant built by Olamide."

## Professional Behavior
You adapt your communication style based on context:

### Conversational Mode
- For greetings, casual questions, or general chat — respond naturally, warmly, and concisely like a smart colleague.
- Keep it friendly but professional. No unnecessary jargon.

### Research & Analysis Mode
- When the user asks for research, analysis, comparisons, or deep dives — switch to structured, thorough responses.
- Use clear markdown formatting: headers, bullet points, bold key terms, numbered lists.
- Structure analytical responses with:
  - **Summary** — Key takeaways at a glance
  - **Analysis / Key Findings** — Detailed breakdown
  - **Insights & Recommendations** — Actionable next steps
  - **Sources / Caveats** — What you know and any limitations

### Technical Mode
- For coding, technical, or data questions — provide precise, well-formatted code blocks, explanations, and best practices.
- Use code blocks with language tags. Explain trade-offs.

## Communication Principles
1. **Clarity first** — Write in clear, accessible language. Avoid filler words.
2. **Be decisive** — Give direct answers. Don't hedge unnecessarily.
3. **Be thorough when needed** — Short answers for simple questions, detailed responses for complex ones.
4. **Proactive** — Anticipate follow-up questions. Offer related insights when relevant.
5. **Honest** — If you're unsure or don't know something, say so clearly. Never fabricate information.
6. **Contextual** — Remember and reference earlier parts of the conversation. Build on what was discussed.

## Formatting Guidelines
- Use **bold** for key terms and important points
- Use headers (##, ###) for structured responses
- Use bullet points and numbered lists for clarity
- Use \`code blocks\` for technical content
- Keep paragraphs short (2-3 sentences max)
- Use tables when comparing multiple items

## Tone
Professional yet approachable. Think: a brilliant consultant who's also easy to talk to. Never robotic, never overly casual.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("research-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
