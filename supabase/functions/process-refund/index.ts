import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

var SU = Deno.env.get("SUPABASE_URL")!;
var SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
var YOCO_SECRET = Deno.env.get("YOCO_SECRET_KEY") || "sk_test_b1f890d6xW5kG4R72ab4732b2e87";
var WA_TOKEN = Deno.env.get("WA_ACCESS_TOKEN")!;
var WA_PHONE_ID = Deno.env.get("WA_PHONE_NUMBER_ID")!;
var db = createClient(SU, SK);
var CO = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "POST, OPTIONS" };

async function sendWA(to: string, body: string) {
  try {
    await fetch("https://graph.facebook.com/v19.0/" + WA_PHONE_ID + "/messages", {
      method: "POST",
      headers: { Authorization: "Bearer " + WA_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: to, type: "text", text: { body: body } }),
    });
  } catch (e) { console.error("WA err:", e); }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CO });

  try {
    var body = await req.json();
    var bookingId = body.booking_id;
    if (!bookingId) return new Response(JSON.stringify({ error: "Missing booking_id" }), { status: 400, headers: CO });

    // Get booking with checkout ID
    var { data: booking } = await db.from("bookings")
      .select("id, customer_name, phone, email, total_amount, refund_amount, yoco_checkout_id, refund_status, status")
      .eq("id", bookingId).single();

    if (!booking) return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404, headers: CO });
    if (booking.refund_status === "PROCESSED") return new Response(JSON.stringify({ error: "Already refunded" }), { status: 400, headers: CO });

    var checkoutId = booking.yoco_checkout_id;
    var refundAmount = booking.refund_amount || booking.total_amount;
    var yocoResult: any = null;
    var yocoSuccess = false;

    if (checkoutId) {
      // Call Yoco refund API
      try {
        var yocoRes = await fetch("https://payments.yoco.com/api/checkouts/" + checkoutId + "/refund", {
          method: "POST",
          headers: { Authorization: "Bearer " + YOCO_SECRET, "Content-Type": "application/json" },
        });
        yocoResult = await yocoRes.json();
        yocoSuccess = yocoResult.status === "successful" || yocoRes.status === 200;
        console.log("Yoco refund result:", JSON.stringify(yocoResult));
      } catch (e) {
        console.error("Yoco refund error:", e);
        yocoResult = { error: String(e) };
      }
    } else {
      yocoResult = { note: "No checkout ID - manual refund needed" };
    }

    // Update booking
    var updateData: any = {
      refund_status: yocoSuccess ? "PROCESSED" : "FAILED",
      refund_amount: refundAmount,
      refund_notes: yocoSuccess
        ? "Yoco refund " + (yocoResult.refundId || "") + " processed"
        : "Yoco refund failed: " + JSON.stringify(yocoResult),
    };
    await db.from("bookings").update(updateData).eq("id", bookingId);

    // Notify customer
    if (yocoSuccess) {
      var firstName = (booking.customer_name || "").split(" ")[0] || "there";
      var ref = bookingId.substring(0, 8).toUpperCase();

      // WhatsApp
      if (booking.phone) {
        await sendWA(booking.phone,
          "Hi " + firstName + "! Your refund of *R" + refundAmount + "* for booking " + ref + " has been processed. Expect it back on your card within 5-7 business days.\n\nWe'd love to have you back on the water! Type *book* anytime \u{1F30A}"
        );
      }

      // Email
      if (booking.email) {
        try {
          await fetch(SU + "/functions/v1/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + SK },
            body: JSON.stringify({
              type: "BROADCAST",
              data: {
                email: booking.email,
                customer_name: booking.customer_name,
                subject: "Refund Processed - " + ref + " | Cape Kayak Adventures",
                message: "Your refund of R" + refundAmount + " for booking " + ref + " has been processed.\n\nPlease allow 5-7 business days for the funds to appear on your card.\n\nWe hope to see you back on the water soon!"
              }
            }),
          });
        } catch (e) { console.error("Email err:", e); }
      }
    }

    return new Response(JSON.stringify({
      ok: yocoSuccess,
      yoco: yocoResult,
      refund_amount: refundAmount,
      message: yocoSuccess ? "Refund processed" : "Refund failed - " + JSON.stringify(yocoResult),
    }), { headers: CO });

  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: CO });
  }
});
