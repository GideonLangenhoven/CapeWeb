import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

var SU = Deno.env.get("SUPABASE_URL")!;
var SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
var WA_TOKEN = Deno.env.get("WA_ACCESS_TOKEN")!;
var WA_PHONE_ID = Deno.env.get("WA_PHONE_NUMBER_ID")!;
var BUSINESS_ID = Deno.env.get("BUSINESS_ID") || "c8b439f5-c11e-4d46-b347-943df6f172b4";
var REVIEW_URL = "https://g.page/r/CWabH9a6u5DbEB0/review";
var MAPS_URL = "https://www.google.com/maps/place/CAPE+KAYAK+ADVENTURES/@-33.9078,18.3978,17z";
var db = createClient(SU, SK);

async function sendWA(to: string, body: string) {
  try {
    await fetch("https://graph.facebook.com/v19.0/" + WA_PHONE_ID + "/messages", {
      method: "POST",
      headers: { Authorization: "Bearer " + WA_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: to, type: "text", text: { body: body } }),
    });
    return true;
  } catch (e) { console.error("WA send fail:", e); return false; }
}

async function sendButtons(to: string, body: string, btns: any[]) {
  try {
    await fetch("https://graph.facebook.com/v19.0/" + WA_PHONE_ID + "/messages", {
      method: "POST",
      headers: { Authorization: "Bearer " + WA_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp", to: to, type: "interactive",
        interactive: { type: "button", body: { text: body }, action: { buttons: btns.map(b => ({ type: "reply", reply: { id: b.id, title: b.title.substring(0, 20) } })) } }
      }),
    });
    return true;
  } catch (e) { return false; }
}

async function alreadySent(bookingId: string, type: string) {
  var { data } = await db.from("auto_messages").select("id").eq("booking_id", bookingId).eq("type", type).limit(1);
  return (data || []).length > 0;
}

async function logSent(bookingId: string, phone: string, type: string) {
  await db.from("auto_messages").insert({ business_id: BUSINESS_ID, booking_id: bookingId, phone: phone, type: type });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-ZA", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Johannesburg" });
}

// ===== DAY-BEFORE REMINDER =====
async function sendReminders() {
  var now = new Date();
  var tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  var tomorrowStart = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  var tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

  // Get all bookings for tomorrow
  var { data: bookings } = await db.from("bookings")
    .select("id, customer_name, phone, qty, tours(name), slots(start_time)")
    .eq("business_id", BUSINESS_ID)
    .in("status", ["PAID", "CONFIRMED"])
    .not("phone", "is", null);

  var sent = 0;
  for (var b of (bookings || [])) {
    var slot = (b as any).slots;
    var tour = (b as any).tours;
    if (!slot?.start_time || !b.phone) continue;

    var slotDate = new Date(slot.start_time);
    // Check if slot is tomorrow (in SA timezone)
    var saDate = new Date(slotDate.toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));
    var saTomorrow = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));
    saTomorrow.setDate(saTomorrow.getDate() + 1);
    if (saDate.getDate() !== saTomorrow.getDate() || saDate.getMonth() !== saTomorrow.getMonth()) continue;

    if (await alreadySent(b.id, "REMINDER")) continue;

    var firstName = (b.customer_name || "").split(" ")[0] || "there";
    var timeStr = new Date(slot.start_time).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Johannesburg" });

    var msg = "Hey " + firstName + "! \u{1F44B} Just a reminder \u2014 you're paddling with us tomorrow!\n\n" +
      "\u{1F6F6} " + (tour?.name || "Tour") + "\n" +
      "\u23F0 " + timeStr + " (please arrive 15 min early)\n" +
      "\u{1F465} " + b.qty + " " + (b.qty === 1 ? "person" : "people") + "\n\n" +
      "\u{1F4CD} *Meeting Point:* Three Anchor Bay, Beach Rd, Sea Point\n" +
      "\u{1F5FA} " + MAPS_URL + "\n\n" +
      "\u{1F392} *Remember to bring:* Sunscreen, hat, sunnies, towel, water bottle\n\n" +
      "See you on the water! \u{1F30A}";

    var ok = await sendWA(b.phone, msg);
    if (ok) { await logSent(b.id, b.phone, "REMINDER"); sent++; }
  }
  return sent;
}

// ===== POST-TRIP REVIEW REQUEST =====
async function sendReviewRequests() {
  var now = new Date();
  var twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  var sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

  // Get bookings where the slot ended 2-6 hours ago
  var { data: bookings } = await db.from("bookings")
    .select("id, customer_name, phone, tours(name, duration_minutes), slots(start_time)")
    .eq("business_id", BUSINESS_ID)
    .in("status", ["PAID", "CONFIRMED", "COMPLETED"])
    .not("phone", "is", null);

  var sent = 0;
  for (var b of (bookings || [])) {
    var slot = (b as any).slots;
    var tour = (b as any).tours;
    if (!slot?.start_time || !b.phone) continue;

    var endTime = new Date(new Date(slot.start_time).getTime() + (tour?.duration_minutes || 90) * 60 * 1000);
    if (endTime > twoHoursAgo || endTime < sixHoursAgo) continue;

    if (await alreadySent(b.id, "REVIEW_REQUEST")) continue;

    // Mark booking as completed
    await db.from("bookings").update({ status: "COMPLETED" }).eq("id", b.id);

    var firstName = (b.customer_name || "").split(" ")[0] || "there";
    var msg = "Hey " + firstName + "! \u{1F60A} Hope you had an amazing time on the water today!\n\n" +
      "We\u2019d love to hear about your experience. A quick Google review helps other adventurers find us and means the world to our guides \u{1F64F}\n\n" +
      "\u2B50 Leave a review: " + REVIEW_URL + "\n\n" +
      "Thanks for paddling with us! \u{1F6F6}";

    var ok = await sendButtons(b.phone, msg, [
      { id: "REVIEW", title: "\u2B50 Leave Review" },
      { id: "BOOK_AGAIN", title: "\u{1F6F6} Book Again" },
    ]);
    if (ok) { await logSent(b.id, b.phone, "REVIEW_REQUEST"); sent++; }
  }
  return sent;
}

// ===== RETURNING CUSTOMER RE-ENGAGEMENT =====
async function sendReEngagement() {
  var now = new Date();
  var threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  var fourMonthsAgo = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);

  // Find customers who booked 3-4 months ago and haven't booked since
  var { data: oldBookings } = await db.from("bookings")
    .select("phone, customer_name, email")
    .eq("business_id", BUSINESS_ID)
    .in("status", ["COMPLETED", "PAID"])
    .lt("created_at", threeMonthsAgo.toISOString())
    .gt("created_at", fourMonthsAgo.toISOString())
    .not("phone", "is", null);

  var sent = 0;
  var seenPhones = new Set();
  for (var ob of (oldBookings || [])) {
    if (!ob.phone || seenPhones.has(ob.phone)) continue;
    seenPhones.add(ob.phone);

    // Check they haven't booked recently
    var { data: recent } = await db.from("bookings").select("id")
      .eq("phone", ob.phone).eq("business_id", BUSINESS_ID)
      .gt("created_at", threeMonthsAgo.toISOString()).limit(1);
    if ((recent || []).length > 0) continue;

    // Check not already sent
    var { data: alreadyEngaged } = await db.from("auto_messages").select("id")
      .eq("phone", ob.phone).eq("type", "RE_ENGAGE")
      .gt("sent_at", fourMonthsAgo.toISOString()).limit(1);
    if ((alreadyEngaged || []).length > 0) continue;

    var firstName = (ob.customer_name || "").split(" ")[0] || "there";
    var msg = "Hey " + firstName + "! \u{1F44B} It\u2019s been a while since your last paddle with us.\n\n" +
      "The ocean\u2019s been beautiful lately and we\u2019d love to have you back! \u{1F30A}\n\n" +
      "Book your next trip and we\u2019ll give you *10% off* as a welcome back \u{1F389}\n\n" +
      "Type *book* to get started!";

    var ok = await sendWA(ob.phone, msg);
    if (ok) {
      await db.from("auto_messages").insert({ business_id: BUSINESS_ID, phone: ob.phone, type: "RE_ENGAGE" });
      sent++;
    }
  }
  return sent;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });

  try {
    var body = await req.json().catch(() => ({}));
    var action = (body as any).action || "all";

    var results: any = {};
    if (action === "all" || action === "reminders") {
      results.reminders = await sendReminders();
    }
    if (action === "all" || action === "reviews") {
      results.reviews = await sendReviewRequests();
    }
    if (action === "all" || action === "re_engage") {
      results.re_engage = await sendReEngagement();
    }

    return new Response(JSON.stringify({ ok: true, results: results }), {
      status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (e) {
    console.error("auto-messages error:", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
});
