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
    const { messages, fileData, urls } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const imageCount = fileData?.filter((f: any) => f.type === "image").length || 0;
    const pdfCount = fileData?.filter((f: any) => f.type === "pdf").length || 0;
    console.log(`Processing wine chat request with ${imageCount} images and ${pdfCount} PDFs`);

    // Build the messages array with vision support
    const systemPrompt = {
      role: "system",
      content: `You are enoAI, an expert wine sommelier assistant. When recommending wines, you MUST ALWAYS respond with a structured JSON format wrapped in \`\`\`json code blocks.

RESPONSE FORMAT (ALWAYS use this format when recommending wines):
\`\`\`json
{
  "explanation": "A brief explanation of why you selected these wines based on the user's request, meal, or occasion. 1-2 sentences.",
  "wines": [
    {
      "name": "Wine Name",
      "year": "2020",
      "region": "Region, Country",
      "category": "Red Wine",
      "grape": "Cabernet Sauvignon",
      "price": "€45",
      "style": ["Elegant", "Complex", "Refined"],
      "aromas": ["Blackcurrant", "Violet", "Cedar", "Tobacco"],
      "flavourProfile": ["Smooth", "Balanced", "Silky tannins"],
      "bodyStrength": 4
    }
  ]
}
\`\`\`

IMPORTANT RULES:
- Always recommend EXACTLY 3 wines unless the user specifically asks for a different number
- "style" should have exactly 3 descriptive words
- "aromas" should have 3-5 aromatic notes
- "flavourProfile" should have 2-3 taste descriptors
- "bodyStrength" is a number from 1 to 5 (1=light, 5=full-bodied)
- "category" examples: "Red Wine", "White Wine", "Rosé", "Sparkling", "Dessert Wine"
- "grape" is the grape variety (e.g., "Garnacha", "Cabernet Sauvignon", "Merlot"). Only include if known, otherwise omit.
- "price" is the price from the menu. Only include if visible on the menu, otherwise omit.
- When users provide images of wine lists, only recommend wines FROM that list and include the price if shown

For general conversation that doesn't require wine recommendations, respond naturally without the JSON format.

Always be helpful, knowledgeable, and enthusiastic about wine.`
    };

    // Format the last user message with images if provided
    const formattedMessages: any[] = [systemPrompt];
    
    if (messages && messages.length > 0) {
      // Add all previous messages except the last one
      formattedMessages.push(...messages.slice(0, -1));
      
      // Handle the last message with potential images
      const lastMessage = messages[messages.length - 1];
      
      // Fetch URL contents server-side
      const urlTexts: string[] = [];
      if (urls && Array.isArray(urls) && urls.length > 0) {
        for (const url of urls) {
          try {
            const r = await fetch(url, {
              headers: {
                "User-Agent": "Mozilla/5.0 (compatible; enoAI/1.0)",
                Accept: "text/html,application/xhtml+xml,text/plain,*/*",
              },
            });
            if (!r.ok) {
              urlTexts.push(`Could not fetch ${url}: HTTP ${r.status}`);
              continue;
            }
            const ctype = r.headers.get("content-type") || "";
            const raw = await r.text();
            let text = raw;
            if (ctype.includes("html") || /<html[\s>]/i.test(raw)) {
              text = raw
                .replace(/<script[\s\S]*?<\/script>/gi, " ")
                .replace(/<style[\s\S]*?<\/style>/gi, " ")
                .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
                .replace(/<!--[\s\S]*?-->/g, " ")
                .replace(/<[^>]+>/g, " ")
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/\s+/g, " ")
                .trim();
            }
            if (text.length > 20000) text = text.slice(0, 20000) + "... [truncated]";
            urlTexts.push(`Wine list from ${url}:\n${text}`);
          } catch (e) {
            urlTexts.push(`Could not fetch ${url}: ${e instanceof Error ? e.message : "unknown error"}`);
          }
        }
      }

      const hasFiles = fileData && fileData.length > 0;
      if (hasFiles || urlTexts.length > 0) {
        const content: any[] = [
          {
            type: "text",
            text: lastMessage.content,
          },
        ];

        for (const urlText of urlTexts) {
          content.push({ type: "text", text: urlText });
        }

        if (hasFiles) {
          for (const file of fileData) {
            if (file.type === "image") {
              content.push({
                type: "image_url",
                image_url: { url: file.data },
              });
            } else if (file.type === "pdf") {
              const base64Data = file.data.split(",")[1] || file.data;
              content.push({
                type: "image_url",
                image_url: { url: `data:application/pdf;base64,${base64Data}` },
              });
            }
          }
        }

        formattedMessages.push({
          role: "user",
          content: content,
        });
      } else {
        formattedMessages.push(lastMessage);
      }
    }

    console.log("Calling Lovable AI with", formattedMessages.length, "messages");

    // Call Lovable AI with streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: formattedMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add more credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Return the streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Error in wine-chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
