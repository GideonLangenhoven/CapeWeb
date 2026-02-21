import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

var WA_TOKEN = Deno.env.get("WA_ACCESS_TOKEN")!;
var WA_PHONE_ID = Deno.env.get("WA_PHONE_NUMBER_ID")!;
var SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
var SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
var BUSINESS_ID = Deno.env.get("BUSINESS_ID")!;
var supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: any) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") return new Response("OK", { status: 200, headers: CORS_HEADERS });
  try {
    var body = await req.json();
    var phone = body.phone;
    var message = body.message;
    if (!phone || !message) return new Response("Need phone and message", { status: 400, headers: CORS_HEADERS });

    // Send via WhatsApp
    var res = await fetch("https://graph.facebook.com/v19.0/" + WA_PHONE_ID + "/messages", {
      method: "POST",
      headers: { Authorization: "Bearer " + WA_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: phone, type: "text", text: { body: message } }),
    });
    var data = await res.json();

    // Log to chat_messages
    await supabase.from("chat_messages").insert({
      business_id: BUSINESS_ID, phone: phone, direction: "OUT", body: message, sender: "Admin",
    });

    return new Response(JSON.stringify({ sent: true, data: data }), { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("REPLY_ERR:", err);
    return new Response("Error", { status: 500, headers: CORS_HEADERS });
  }
});
