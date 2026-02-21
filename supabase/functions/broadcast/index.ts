import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

var SU = Deno.env.get("SUPABASE_URL")!;
var SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
var WA_TOKEN = Deno.env.get("WA_ACCESS_TOKEN")!;
var WA_PHONE_ID = Deno.env.get("WA_PHONE_NUMBER_ID")!;
var BUSINESS_ID = Deno.env.get("BUSINESS_ID") || "c8b439f5-c11e-4d46-b347-943df6f172b4";
var db = createClient(SU, SK);
var CO = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "POST, OPTIONS" };

async function sendWA(to: string, body: string) {
  try {
    await fetch("https://graph.facebook.com/v19.0/" + WA_PHONE_ID + "/messages", {
      method: "POST",
      headers: { Authorization: "Bearer " + WA_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: to, type: "text", text: { body: body } }),
    });
    return true;
  } catch (e) { return false; }
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

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-ZA", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Johannesburg" });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CO });

  try {
    var body = await req.json();
    var action = body.action;

    // ===== WEATHER CANCELLATION =====
    if (action === "weather_cancel") {
      var date = body.date; // YYYY-MM-DD
      var reason = body.reason || "weather conditions";
      var slotIds = body.slot_ids || []; // specific slots, or empty for all on date

      var query = db.from("bookings")
        .select("id, customer_name, phone, email, qty, total_amount, slot_id, tour_id, slots(start_time), tours(name)")
        .eq("business_id", BUSINESS_ID)
        .in("status", ["PAID", "CONFIRMED"]);

      var { data: bookings } = await query;
      var affected = (bookings || []).filter(function (b: any) {
        if (!b.slots?.start_time) return false;
        var slotDate = new Date(b.slots.start_time).toISOString().split("T")[0];
        if (slotIds.length > 0) return slotIds.includes(b.slot_id);
        return slotDate === date;
      });

      var sent = 0;
      for (var b of affected) {
        var tour = (b as any).tours;
        var slot = (b as any).slots;
        var firstName = (b.customer_name || "").split(" ")[0] || "there";

        var msg = "Hi " + firstName + " \u{1F44B}\n\n" +
          "Unfortunately we need to cancel your " + (tour?.name || "tour") + " on " + fmtTime(slot.start_time) + " due to " + reason + ".\n\n" +
          "We\u2019re really sorry about this! You have two options:\n\n" +
          "\u{1F4B0} *Full refund* \u2014 back to your card in 5-7 days\n" +
          "\u{1F4C5} *Free reschedule* \u2014 pick any future date\n\n" +
          "Just let us know what you\u2019d prefer!";

        if (b.phone) {
          var ok = await sendButtons(b.phone, msg, [
            { id: "ACT_RESCH_" + b.id, title: "\u{1F4C5} Reschedule" },
            { id: "WEATHER_REFUND_" + b.id, title: "\u{1F4B0} Full Refund" },
          ]);
          if (ok) sent++;
        }

        // Professional weather cancellation email
        if (b.email) {
          try {
            var wxRef = b.id.substring(0, 8).toUpperCase();
            var wxHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
              + '<body style="margin:0;padding:0;background:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif">'
              + '<div style="max-width:560px;margin:0 auto;padding:24px">'
              + '<div style="background:#1a1a2e;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center">'
              + '<h1 style="color:#fff;font-size:22px;margin:0">\u26C8 Tour Update</h1>'
              + '<p style="color:#9ca3af;font-size:13px;margin:6px 0 0">Cape Kayak Adventures</p></div>'
              + '<div style="background:#ffffff;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">'
              + '<p style="font-size:16px;color:#1a1a2e;margin:0 0 16px">Hi ' + firstName + ',</p>'
              + '<p style="font-size:15px;color:#374151;line-height:1.7">We\u2019re really sorry, but we need to cancel your upcoming tour due to <strong>' + reason + '</strong>. Your safety is always our top priority.</p>'
              + '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin:20px 0">'
              + '<p style="margin:0;font-size:14px;color:#991b1b"><strong>Cancelled:</strong> ' + (tour?.name || "Tour") + '</p>'
              + '<p style="margin:4px 0 0;font-size:13px;color:#b91c1c">' + fmtTime(slot.start_time) + ' \u2022 Ref: ' + wxRef + '</p></div>'
              + '<p style="font-size:15px;color:#374151;line-height:1.7;margin:16px 0">You have two options:</p>'
              + '<div style="display:flex;gap:12px;margin:16px 0">'
              + '<div style="flex:1;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;text-align:center">'
              + '<p style="margin:0;font-size:24px">\u{1F4C5}</p><p style="margin:8px 0 0;font-size:14px;color:#166534;font-weight:600">Free Reschedule</p>'
              + '<p style="margin:4px 0 0;font-size:12px;color:#15803d">Pick any future date</p></div>'
              + '<div style="flex:1;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;text-align:center">'
              + '<p style="margin:0;font-size:24px">\u{1F4B0}</p><p style="margin:8px 0 0;font-size:14px;color:#1e40af;font-weight:600">Full Refund</p>'
              + '<p style="margin:4px 0 0;font-size:12px;color:#1d4ed8">5-7 business days</p></div></div>'
              + '<p style="font-size:14px;color:#6b7280;margin-top:20px">Reply to this email or WhatsApp us to let us know your preference. We\u2019d love to have you back when the weather plays along!</p>'
              + '<div style="border-top:1px solid #e5e7eb;padding-top:20px;margin-top:24px">'
              + '<p style="font-size:13px;color:#6b7280;margin:0">\u{1F4F1} WhatsApp us anytime</p></div>'
              + '</div>'
              + '<p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px">Cape Kayak Adventures \u2022 Three Anchor Bay \u2022 Cape Town</p>'
              + '</div></body></html>';
            
            await fetch(SU + "/functions/v1/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: "Bearer " + SK },
              body: JSON.stringify({
                type: "WEATHER_CANCEL",
                data: { email: b.email, customer_name: b.customer_name, tour_name: tour?.name, start_time: fmtTime(slot.start_time), reason: reason, ref: wxRef, html: wxHtml, subject: "Tour Update \u2014 " + fmtTime(slot.start_time) }
              }),
            });
          } catch (e) { console.error("wx email err:", e); }
        }
      }

      // Update slot status
      if (slotIds.length > 0) {
        for (var sid of slotIds) await db.from("slots").update({ status: "CANCELLED" }).eq("id", sid);
      } else if (date) {
        var { data: dateSlots } = await db.from("slots").select("id, start_time").eq("business_id", BUSINESS_ID).eq("status", "OPEN");
        for (var ds of (dateSlots || [])) {
          if (new Date(ds.start_time).toISOString().split("T")[0] === date) {
            await db.from("slots").update({ status: "CANCELLED" }).eq("id", ds.id);
          }
        }
      }

      // Log broadcast
      await db.from("broadcasts").insert({
        business_id: BUSINESS_ID, message: "Weather cancel: " + reason, target_group: "AFFECTED_BOOKINGS",
        target_filter: { date: date, slot_ids: slotIds }, status: "SENT", sent_count: sent, sent_at: new Date().toISOString()
      });

      return new Response(JSON.stringify({ ok: true, affected: affected.length, sent: sent }), { headers: CO });
    }

    // ===== GENERAL BROADCAST =====
    if (action === "broadcast_targeted") {
      var message = body.message;
      var slotIds = body.slot_ids || [];
      var doEmail = body.send_email !== false;
      var doWA = body.send_whatsapp !== false;

      var bookings: any[] = [];
      if (slotIds.length > 0) {
        var { data } = await db.from("bookings")
          .select("id, customer_name, phone, email, qty, slot_id, slots(start_time), tours(name)")
          .in("slot_id", slotIds)
          .in("status", ["PAID", "CONFIRMED"]);
        bookings = data || [];
      }

      var seen = new Set();
      var unique: any[] = [];
      for (var bk of bookings) {
        var key = (bk.phone || "") + "|" + (bk.email || "");
        if (!seen.has(key)) { seen.add(key); unique.push(bk); }
      }

      var waSent = 0;
      var emailSent = 0;

      for (var u of unique) {
        var firstName = (u.customer_name || "").split(" ")[0] || "there";
        var personalMsg = message.replace(/\{name\}/g, firstName);
        var tourName = (u as any).tours?.name || "your tour";
        var slotTime = (u as any).slots?.start_time ? fmtTime((u as any).slots.start_time) : "";

        if (doWA && u.phone) {
          var ok = await sendWA(u.phone, personalMsg);
          if (ok) waSent++;
          await new Promise(r => setTimeout(r, 50));
        }

        if (doEmail && u.email) {
          try {
            var emailHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
              + '<body style="margin:0;padding:0;background:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif">'
              + '<div style="max-width:560px;margin:0 auto;padding:24px">'
              + '<div style="background:#1a1a2e;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center">'
              + '<h1 style="color:#fff;font-size:22px;margin:0">\u{1F6F6} Cape Kayak Adventures</h1>'
              + '<p style="color:#9ca3af;font-size:13px;margin:6px 0 0">Cape Town\u2019s Original Since 1994</p></div>'
              + '<div style="background:#ffffff;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">'
              + '<p style="font-size:16px;color:#1a1a2e;margin:0 0 8px">Hi ' + firstName + ',</p>'
              + '<div style="font-size:15px;color:#374151;line-height:1.7;margin:16px 0">' + personalMsg.split('\n').join('<br>') + '</div>';
            if (slotTime) {
              emailHtml += '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin:20px 0">'
                + '<p style="margin:0;font-size:14px;color:#166534"><strong>\u{1F6F6} ' + tourName + '</strong></p>'
                + '<p style="margin:4px 0 0;font-size:13px;color:#15803d">\u{1F4C5} ' + slotTime + '</p></div>';
            }
            emailHtml += '<div style="border-top:1px solid #e5e7eb;padding-top:20px;margin-top:24px">'
              + '<p style="font-size:13px;color:#6b7280;margin:0">\u{1F4CD} Three Anchor Bay, Beach Rd, Sea Point, Cape Town</p>'
              + '<p style="font-size:13px;color:#6b7280;margin:4px 0">\u{1F4F1} WhatsApp us anytime for help</p>'
              + '</div></div>'
              + '<p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px">Cape Kayak Adventures \u2022 Three Anchor Bay \u2022 Cape Town</p>'
              + '</div></body></html>';
            await fetch(SU + "/functions/v1/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: "Bearer " + SK },
              body: JSON.stringify({ type: "BROADCAST", data: { email: u.email, customer_name: u.customer_name, message: personalMsg, html: emailHtml, subject: "Cape Kayak Adventures \u2014 Message about your upcoming paddle" } }),
            });
            emailSent++;
          } catch (e) { console.error("email err:", e); }
        }
      }

      await db.from("broadcasts").insert({
        business_id: BUSINESS_ID, message: message, target_group: "SLOT",
        target_filter: { slot_ids: slotIds }, status: "SENT", sent_count: waSent + emailSent,
        sent_at: new Date().toISOString()
      });

      return new Response(JSON.stringify({ ok: true, total: unique.length, wa_sent: waSent, email_sent: emailSent }), { headers: CO });
    }

    if (action === "broadcast") {
      var message = body.message;
      var targetGroup = body.target_group || "ALL"; // ALL, UPCOMING, PAST, CUSTOM
      var targetPhones = body.phones || [];

      var phones: string[] = [];

      if (targetGroup === "ALL") {
        var { data: allConvos } = await db.from("conversations").select("phone").eq("business_id", BUSINESS_ID);
        phones = (allConvos || []).map((c: any) => c.phone).filter(Boolean);
      } else if (targetGroup === "UPCOMING") {
        var { data: upcoming } = await db.from("bookings")
          .select("phone, slots(start_time)")
          .eq("business_id", BUSINESS_ID).in("status", ["PAID", "CONFIRMED"])
          .gt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
        phones = (upcoming || []).filter((b: any) => b.phone && b.slots?.start_time && new Date(b.slots.start_time) > new Date()).map((b: any) => b.phone);
      } else if (targetGroup === "PAST") {
        var { data: past } = await db.from("bookings")
          .select("phone").eq("business_id", BUSINESS_ID).in("status", ["COMPLETED", "PAID"]);
        phones = (past || []).map((b: any) => b.phone).filter(Boolean);
      } else if (targetGroup === "CUSTOM") {
        phones = targetPhones;
      }

      // Deduplicate
      phones = [...new Set(phones)];

      var sent = 0;
      for (var ph of phones) {
        var ok = await sendWA(ph, message);
        if (ok) sent++;
        // Rate limit - 50ms between messages
        await new Promise(r => setTimeout(r, 50));
      }

      await db.from("broadcasts").insert({
        business_id: BUSINESS_ID, message: message, target_group: targetGroup,
        status: "SENT", sent_count: sent, sent_at: new Date().toISOString()
      });

      return new Response(JSON.stringify({ ok: true, total: phones.length, sent: sent }), { headers: CO });
    }

    // ===== TRIP PHOTOS =====
    if (action === "send_photos") {
      var slotId = body.slot_id;
      var photoUrls = body.photo_urls || [];

      // Save photos
      for (var url of photoUrls) {
        await db.from("trip_photos").insert({ business_id: BUSINESS_ID, slot_id: slotId, photo_url: url });
      }

      // Get all bookings for this slot
      var { data: slotBookings } = await db.from("bookings")
        .select("id, customer_name, phone, email, tours(name), slots(start_time)")
        .eq("slot_id", slotId).eq("business_id", BUSINESS_ID)
        .in("status", ["PAID", "CONFIRMED", "COMPLETED"]);

      var sent = 0;
      for (var sb of (slotBookings || [])) {
        if (!sb.phone) continue;
        var firstName = (sb.customer_name || "").split(" ")[0] || "there";
        var tour = (sb as any).tours;

        var msg = "Hey " + firstName + "! \u{1F4F8} Here are your photos from today\u2019s " + (tour?.name || "paddle") + "!\n\n";
        for (var pi = 0; pi < photoUrls.length; pi++) {
          msg += "\u{1F5BC} Photo " + (pi + 1) + ": " + photoUrls[pi] + "\n";
        }
        msg += "\nFeel free to share them! And if you enjoyed the trip, we\u2019d love a review \u2B50\n" + "https://g.page/r/CWabH9a6u5DbEB0/review";

        var ok = await sendWA(sb.phone, msg);
        if (ok) sent++;
      }

      return new Response(JSON.stringify({ ok: true, sent: sent }), { headers: CO });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: CO });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: CO });
  }
});
