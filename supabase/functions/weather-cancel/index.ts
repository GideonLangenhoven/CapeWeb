import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

var SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
var SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
var WA_TOKEN = Deno.env.get("WA_ACCESS_TOKEN")!;
var WA_PHONE_ID = Deno.env.get("WA_PHONE_NUMBER_ID")!;
var BUSINESS_ID = Deno.env.get("BUSINESS_ID")!;
var supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function fmtTime(iso: any) { return new Date(iso).toLocaleString("en-ZA", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Johannesburg" }); }

async function sendText(to: any, t: any) {
  await fetch("https://graph.facebook.com/v19.0/" + WA_PHONE_ID + "/messages", {
    method: "POST",
    headers: { Authorization: "Bearer " + WA_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: to, type: "text", text: { body: t } }),
  });
}


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
    var slotId = body.slot_id;
    var reason = body.reason || "weather conditions";

    if (!slotId) return new Response("Need slot_id", { status: 400, headers: CORS_HEADERS });

    var slot = await supabase.from("slots").select("*, tours(name)").eq("id", slotId).single();
    if (!slot.data) return new Response("Slot not found", { status: 404, headers: CORS_HEADERS });

    var tourName = (slot.data as any).tours?.name || "Tour";
    var slotTime = fmtTime(slot.data.start_time);

    // Get all bookings for this slot
    var bks = await supabase.from("bookings").select("id, phone, customer_name, email, qty, total_amount, status")
      .eq("slot_id", slotId).in("status", ["PAID", "CONFIRMED"]);

    var bookings = bks.data || [];
    var notified = 0;

    for (var i = 0; i < bookings.length; i++) {
      var b = bookings[i];
      var firstName = (b.customer_name || "").split(" ")[0] || "there";

      // Send WhatsApp
      await sendText(b.phone,
        "*Tour Update*\n\n" +
        "Hi " + firstName + ", unfortunately your *" + tourName + "* on *" + slotTime + "* has been cancelled due to " + reason + ".\n\n" +
        "Your safety is our top priority.\n\n" +
        "*Your options:*\n" +
        "1. Free reschedule to any available date\n" +
        "2. Full refund (5-7 business days)\n\n" +
        "Just reply here or type *menu* to reschedule.\n\n" +
        "Sorry for the inconvenience!"
      );

      // Send email
      if (b.email) {
        try {
          await fetch(SUPABASE_URL + "/functions/v1/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + SUPABASE_KEY },
            body: JSON.stringify({ type: "WEATHER_CANCEL", data: { email: b.email, customer_name: b.customer_name, tour_name: tourName, start_time: slotTime } }),
          });
        } catch(e) { console.log("weather email err"); }
      }

      // Mark booking for refund
      await supabase.from("bookings").update({
        status: "CANCELLED",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: "Weather: " + reason,
        refund_status: "REQUESTED",
        refund_amount: b.total_amount,
        refund_notes: "Full refund - weather cancellation"
      }).eq("id", b.id);

      notified++;
    }

    // Close the slot
    await supabase.from("slots").update({ status: "CLOSED" }).eq("id", slotId);

    // Release seats
    await supabase.from("slots").update({ booked: 0, held: 0 }).eq("id", slotId);

    return new Response(JSON.stringify({ notified: notified, slot: slotTime, tour: tourName }), { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("WEATHER_ERR:", err);
    return new Response("Error", { status: 500, headers: CORS_HEADERS });
  }
});
