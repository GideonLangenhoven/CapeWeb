import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

var SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
var SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
var WA_TOKEN = Deno.env.get("WA_ACCESS_TOKEN")!;
var WA_PHONE_ID = Deno.env.get("WA_PHONE_NUMBER_ID")!;
var BUSINESS_ID = Deno.env.get("BUSINESS_ID")!;
var ADMIN_EMAIL = "gideon@capeweb.co.za";
var MAPS_URL = "https://www.google.com/maps/place/CAPE+KAYAK+ADVENTURES/@-33.9078,18.3978,17z";
var supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function sendText(to: any, t: any) {
  await fetch("https://graph.facebook.com/v19.0/" + WA_PHONE_ID + "/messages", {
    method: "POST",
    headers: { Authorization: "Bearer " + WA_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: to, type: "text", text: { body: t } }),
  });
}
function fmtTime(iso: any) { return new Date(iso).toLocaleString("en-ZA", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Johannesburg" }); }
function fmtDate(iso: any) { return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Johannesburg" }); }

async function createInvoice(booking: any, tourName: string, slotTime: string, paymentRef: string) {
  var invNumR = await supabase.rpc("next_invoice_number");
  var invNum = invNumR.data || "INV-0";
  var subtotal = Number(booking.original_total || booking.total_amount);
  var discountAmt = subtotal - Number(booking.total_amount);
  if (discountAmt < 0) discountAmt = 0;

  var inv = await supabase.from("invoices").insert({
    business_id: BUSINESS_ID, booking_id: booking.id,
    invoice_number: invNum,
    customer_name: booking.customer_name, customer_email: booking.email, customer_phone: booking.phone,
    tour_name: tourName, tour_date: booking.slots?.start_time || null,
    qty: booking.qty, unit_price: booking.unit_price,
    subtotal: subtotal,
    discount_type: booking.discount_type || null,
    discount_percent: booking.discount_percent || 0,
    discount_amount: discountAmt,
    total_amount: booking.total_amount,
    payment_method: "Yoco", payment_reference: paymentRef,
  }).select().single();

  if (inv.data) {
    await supabase.from("bookings").update({ invoice_id: inv.data.id }).eq("id", booking.id);
  }
  return { ...inv.data, invoice_number: invNum };
}

Deno.serve(async (req: any) => {
  if (req.method !== "POST") return new Response("OK", { status: 200 });
  try {
    var body = await req.json();
    console.log("YOCO_WEBHOOK:" + JSON.stringify(body).substring(0, 500));
    var type = body.type; var payload = body.payload;
    if (type !== "payment.succeeded") { console.log("Ignoring:" + type); return new Response("OK", { status: 200 }); }
    var checkoutId = payload.metadata?.checkoutId || payload.checkoutId || "";
    var yocoPaymentId = payload.id || "";
    if (!checkoutId) { console.log("No checkoutId"); return new Response("OK", { status: 200 }); }
    // Check if this is a gift voucher payment
    var gvr = await supabase.from("vouchers").select("*").eq("yoco_checkout_id", checkoutId).single();
    if (gvr.data && gvr.data.status === "PENDING") {
      var gv = gvr.data;
      await supabase.from("vouchers").update({ status: "ACTIVE" }).eq("id", gv.id);
      // Send voucher email
      try {
        await fetch(SUPABASE_URL + "/functions/v1/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + SUPABASE_KEY },
          body: JSON.stringify({ type: "GIFT_VOUCHER", data: {
            email: gv.buyer_email,
            admin_email: ADMIN_EMAIL,
            code: gv.code,
            recipient_name: gv.recipient_name,
            gift_message: gv.gift_message,
            buyer_name: gv.buyer_name,
            tour_name: gv.tour_name,
            value: gv.value || gv.purchase_amount,
            expires_at: new Date(gv.expires_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" }),
          }}),
        });
      } catch(e) { console.log("gv email err"); }
      // WhatsApp confirmation
      if (gv.buyer_phone) {
        await sendText(gv.buyer_phone,
          "\u{1F389} *Gift Voucher Purchased!*\n\n" +
          "\u{1F39F} Code: *" + gv.code + "*\n" +
          "\u{1F6F6} " + (gv.tour_name || "Any Tour") + "\n" +
          "\u{1F465} For: " + (gv.recipient_name || "Your friend") + "\n" +
          "\u{1F4B0} Value: R" + (gv.value || gv.purchase_amount) + "\n\n" +
          "The voucher has been emailed to " + gv.buyer_email + "\n\n" +
          "Thanks for sharing the adventure! \u{1F30A}"
        );
        await supabase.from("conversations").update({ current_state: "IDLE", state_data: {} }).eq("phone", gv.buyer_phone).eq("business_id", BUSINESS_ID);
      }
      console.log("GV PAYMENT CONFIRMED voucher:" + gv.code);
      return new Response("OK", { status: 200 });
    }

    var br = await supabase.from("bookings").select("*, slots(start_time), tours(name)").eq("yoco_checkout_id", checkoutId).single();
    if (!br.data) { console.log("No booking for:" + checkoutId); return new Response("OK", { status: 200 }); }
    var booking = br.data;
    if (booking.status === "PAID" || booking.status === "COMPLETED") { console.log("Already paid:" + booking.id); return new Response("OK", { status: 200 }); }

    await supabase.from("bookings").update({ status: "PAID", yoco_payment_id: yocoPaymentId }).eq("id", booking.id);
    await supabase.from("holds").update({ status: "CONVERTED" }).eq("booking_id", booking.id).eq("status", "ACTIVE");
    var sr = await supabase.from("slots").select("booked, held").eq("id", booking.slot_id).single();
    if (sr.data) { await supabase.from("slots").update({ booked: sr.data.booked + booking.qty, held: Math.max(0, sr.data.held - booking.qty) }).eq("id", booking.slot_id); }
    await supabase.from("logs").insert({ business_id: BUSINESS_ID, booking_id: booking.id, event: "payment_confirmed", payload: { yoco_payment_id: yocoPaymentId, checkout_id: checkoutId, amount: payload.amount } });
    await supabase.from("conversations").update({ current_state: "IDLE", state_data: {}, updated_at: new Date().toISOString() }).eq("phone", booking.phone).eq("business_id", BUSINESS_ID);

    var ref = booking.id.substring(0, 8).toUpperCase();
    var slotTime = booking.slots?.start_time ? fmtTime(booking.slots.start_time) : "See email";
    var tourName = booking.tours?.name || "Sea Kayak Tour";

    // Create invoice
    var invoice = await createInvoice(booking, tourName, slotTime, yocoPaymentId);

    // WhatsApp confirmation
    await sendText(booking.phone,
      "\u{1F389} *Booking Confirmed!*\n\n" +
      "\u{1F4CB} Ref: " + ref + "\n" +
      "\u{1F6F6} " + tourName + "\n" +
      "\u{1F4C5} " + slotTime + "\n" +
      "\u{1F465} " + booking.qty + " people\n" +
      "\u{1F4B0} R" + booking.total_amount + " paid\n" +
      "\u{1F9FE} Invoice: " + (invoice?.invoice_number || "pending") + "\n\n" +
      "\u{1F4CD} *Meeting Point:*\nThree Anchor Bay, Beach Road, Sea Point\nArrive 15 min early\n\n" +
      "\u{1F5FA} " + MAPS_URL + "\n\n" +
      "\u{1F392} *Bring:* Sunscreen, hat, towel, water bottle\n\n" +
      "We can\u2019t wait to see you! \u{1F30A}\n\n" +
      "Type *menu* anytime to manage your booking."
    );

    // Confirmation email
    try {
      await fetch(SUPABASE_URL + "/functions/v1/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + SUPABASE_KEY },
        body: JSON.stringify({ type: "BOOKING_CONFIRM", data: { email: booking.email, customer_name: booking.customer_name, ref: ref, tour_name: tourName, start_time: slotTime, qty: booking.qty, total_amount: "R" + booking.total_amount } }),
      });
    } catch(e) { console.log("confirm email err"); }

    // Invoice email to customer + admin
    if (invoice) {
      try {
        await fetch(SUPABASE_URL + "/functions/v1/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + SUPABASE_KEY },
          body: JSON.stringify({ type: "INVOICE", data: {
            email: booking.email,
            admin_email: ADMIN_EMAIL,
            invoice_number: invoice.invoice_number,
            invoice_date: fmtDate(new Date().toISOString()),
            customer_name: booking.customer_name,
            customer_email: booking.email,
            customer_phone: booking.phone,
            tour_name: tourName,
            tour_date: booking.slots?.start_time ? fmtDate(booking.slots.start_time) : "TBC",
            qty: booking.qty,
            unit_price: booking.unit_price,
            subtotal: booking.original_total || booking.total_amount,
            discount_type: booking.discount_type,
            discount_percent: booking.discount_percent,
            discount_amount: invoice.discount_amount || 0,
            total_amount: booking.total_amount,
            payment_method: "Yoco",
            payment_reference: yocoPaymentId,
          }}),
        });
      } catch(e) { console.log("invoice email err"); }
    }

    console.log("PAYMENT CONFIRMED booking:" + booking.id + " invoice:" + (invoice?.invoice_number || "none"));
    return new Response("OK", { status: 200 });
  } catch (err) { console.error("YOCO_WEBHOOK_ERROR:", err); return new Response("OK", { status: 200 }); }
});
