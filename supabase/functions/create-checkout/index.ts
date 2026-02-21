import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

var YOCO_SECRET = "sk_test_b1f890d6xW5kG4R72ab4732b2e87";
var SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
var SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
var supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

var CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

Deno.serve(async (req: any) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    var body = await req.json();
    var amount = body.amount;
    var bookingId = body.booking_id;
    var voucherId = body.voucher_id;
    var voucherCode = body.voucher_code;
    var type = body.type || "BOOKING";

    if (!amount) return new Response(JSON.stringify({ error: "Need amount" }), { status: 400, headers: CORS });

    var metadata: any = { type: type };
    var successUrl = "https://book.capekayak.co.za/success";
    var cancelUrl = "https://book.capekayak.co.za/cancelled";

    if (type === "GIFT_VOUCHER") {
      metadata.voucher_id = voucherId;
      metadata.voucher_code = voucherCode;
      successUrl = "https://book.capekayak.co.za/voucher-confirmed?code=" + voucherCode;
    } else {
      metadata.booking_id = bookingId;
      metadata.customer_name = body.customer_name || "";
      metadata.qty = String(body.qty || 1);
      if (body.voucher_codes) metadata.voucher_codes = body.voucher_codes.join(",");
      if (body.voucher_ids) metadata.voucher_ids = body.voucher_ids.join(",");
      successUrl = "https://book.capekayak.co.za/success?ref=" + bookingId;
    }

    console.log("CREATING CHECKOUT: amount=" + amount + " type=" + type);

    var yocoRes = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: { Authorization: "Bearer " + YOCO_SECRET, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(Number(amount) * 100),
        currency: "ZAR",
        successUrl: successUrl,
        cancelUrl: cancelUrl,
        failureUrl: cancelUrl,
        metadata: metadata,
      }),
    });

    var yocoData = await yocoRes.json();
    console.log("CHECKOUT:" + JSON.stringify(yocoData));

    if (yocoData && yocoData.id && yocoData.redirectUrl) {
      if (bookingId) {
        await supabase.from("bookings").update({ yoco_checkout_id: yocoData.id }).eq("id", bookingId);
      }
      if (voucherId) {
        await supabase.from("vouchers").update({ yoco_checkout_id: yocoData.id }).eq("id", voucherId);
      }
      return new Response(JSON.stringify({ id: yocoData.id, redirectUrl: yocoData.redirectUrl }), { status: 200, headers: CORS });
    }

    return new Response(JSON.stringify({ error: "Yoco error", details: yocoData }), { status: 500, headers: CORS });
  } catch (err: any) {
    console.error("CHECKOUT_ERR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
  }
});
