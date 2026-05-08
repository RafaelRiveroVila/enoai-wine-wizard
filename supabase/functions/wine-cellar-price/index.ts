import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, year, region } = await req.json();

    if (!name || typeof name !== "string") {
      return new Response(JSON.stringify({ error: "name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY is not configured");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const query = `${name}${year && year !== "N/A" ? ` ${year}` : ""}${
      region ? ` ${region}` : ""
    } wine bottle price buy`;

    console.log(`[wine-cellar-price] Searching: ${query}`);

    const searchRes = await fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, limit: 6 }),
    });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error("[wine-cellar-price] Firecrawl error", searchRes.status, errText);
      return new Response(
        JSON.stringify({ cellarPrice: null, source: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchData = await searchRes.json();
    // v2 search returns { success, data: { web: [...] } } or { data: [...] }
    const results: Array<{ url?: string; title?: string; description?: string }> =
      searchData?.data?.web ?? searchData?.data ?? [];

    if (!results.length) {
      return new Response(
        JSON.stringify({ cellarPrice: null, source: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const snippets = results
      .slice(0, 6)
      .map(
        (r, i) =>
          `[${i + 1}] URL: ${r.url ?? ""}\nTitle: ${r.title ?? ""}\nDescription: ${
            r.description ?? ""
          }`
      )
      .join("\n\n");

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              'You extract the retail/cellar price of a specific wine from web search snippets. ' +
              'Return ONLY a JSON object: {"price": string | null, "source": string | null}. ' +
              'The "price" must include the currency symbol exactly as shown in the snippet (e.g. "€18.50", "$22", "£15"). ' +
              'The "source" must be the URL from which the price was taken. ' +
              'Only return a price if it clearly refers to the same wine (matching name and, if provided, year). ' +
              'If no clear, real price is found, return {"price": null, "source": null}. NEVER invent a price.',
          },
          {
            role: "user",
            content: `Wine: ${name}${year && year !== "N/A" ? ` ${year}` : ""}${
              region ? ` (${region})` : ""
            }\n\nSearch results:\n${snippets}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      console.error("[wine-cellar-price] AI gateway error", aiRes.status);
      return new Response(
        JSON.stringify({ cellarPrice: null, source: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiRes.json();
    const raw = aiData?.choices?.[0]?.message?.content ?? "{}";
    let parsed: { price?: unknown; source?: unknown } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }

    const priceStr =
      typeof parsed.price === "string" && /\d/.test(parsed.price)
        ? parsed.price.trim()
        : null;
    const sourceStr =
      typeof parsed.source === "string" && parsed.source.startsWith("http")
        ? parsed.source.trim()
        : null;

    console.log(`[wine-cellar-price] ${name} → ${priceStr ?? "null"}`);

    return new Response(
      JSON.stringify({ cellarPrice: priceStr, source: sourceStr }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[wine-cellar-price] error", error);
    return new Response(
      JSON.stringify({
        cellarPrice: null,
        source: null,
        error: error instanceof Error ? error.message : "unknown",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
