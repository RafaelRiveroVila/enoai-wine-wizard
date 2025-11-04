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
    const { messages, imageData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing wine chat request with images:", imageData?.length || 0);

    // Build the messages array with vision support
    const systemPrompt = {
      role: "system",
      content: `You are enoAI, an expert wine sommelier assistant. When users provide images or PDFs of wine lists:
1. Carefully analyze the wine list content
2. Only recommend wines that are actually present in the provided wine list
3. Consider the user's preferences, occasion, and budget
4. Provide detailed pairing suggestions
5. Explain your recommendations clearly

If no wine list is provided, give general wine recommendations.
Always be helpful, knowledgeable, and enthusiastic about wine.`
    };

    // Format the last user message with images if provided
    const formattedMessages: any[] = [systemPrompt];
    
    if (messages && messages.length > 0) {
      // Add all previous messages except the last one
      formattedMessages.push(...messages.slice(0, -1));
      
      // Handle the last message with potential images
      const lastMessage = messages[messages.length - 1];
      
      if (imageData && imageData.length > 0) {
        // Create a multimodal message with text and images
        const content: any[] = [
          {
            type: "text",
            text: lastMessage.content
          }
        ];
        
        // Add all images
        for (const image of imageData) {
          content.push({
            type: "image_url",
            image_url: {
              url: image.data // base64 data URL
            }
          });
        }
        
        formattedMessages.push({
          role: "user",
          content: content
        });
      } else {
        // Regular text message
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
