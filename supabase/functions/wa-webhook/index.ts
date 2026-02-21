import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

var SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
var SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
var WA_TOKEN = Deno.env.get("WA_ACCESS_TOKEN")!;
var WA_PHONE_ID = Deno.env.get("WA_PHONE_NUMBER_ID")!;
var VERIFY_TOKEN = Deno.env.get("WA_VERIFY_TOKEN")!;
var BUSINESS_ID = Deno.env.get("BUSINESS_ID")!;
var YOCO_SECRET = "sk_test_b1f890d6xW5kG4R72ab4732b2e87";
var MAPS_URL = "https://www.google.com/maps/place/CAPE+KAYAK+ADVENTURES/@-33.9078,18.3978,17z";
var supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function sendWA(to: any, body: any) {
  var res = await fetch("https://graph.facebook.com/v19.0/" + WA_PHONE_ID + "/messages", {
    method: "POST",
    headers: { Authorization: "Bearer " + WA_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: to, ...body }),
  });
  var data = await res.json();
  console.log("WA:" + JSON.stringify(data));
  return data;
}
async function sendText(to: any, t: any) { return sendWA(to, { type: "text", text: { body: t } }); }
async function sendButtons(to: any, bt: any, btns: any) {
  return sendWA(to, { type: "interactive", interactive: { type: "button", body: { text: bt }, action: { buttons: btns.map(function(b: any) { return { type: "reply", reply: { id: b.id, title: b.title.substring(0, 20) } }; }) } } });
}
async function sendList(to: any, bt: any, btnTxt: any, secs: any) {
  return sendWA(to, { type: "interactive", interactive: { type: "list", body: { text: bt }, action: { button: btnTxt.substring(0, 20), sections: secs } } });
}
async function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
async function typingDelay() { await delay(800 + Math.floor(Math.random() * 1200)); }
var GK = Deno.env.get("GEMINI_API_KEY") || "";
async function gemFallback(msg: string): Promise<string|null> {
  if (!GK) return null;
  try {
    var r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GK, {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        system_instruction: {parts: [{text: "You are a friendly WhatsApp assistant for Cape Kayak Adventures in Cape Town. Keep replies SHORT (2-3 sentences max). Sound like a real person. Use casual language.\nTours: Sea Kayak R600/pp 90min, Sunset Paddle R600/pp 2hrs (sunset+wine). Meet: Three Anchor Bay, Sea Point. 15 min early.\nIf they want to book tell them to type \"book\". If you dont know, suggest they type \"menu\".\nNEVER make up times or availability."}]},
        contents: [{role: "user", parts: [{text: msg}]}],
        generationConfig: {temperature: 0.7, maxOutputTokens: 150}
      })
    });
    var d = await r.json();
    if (d.candidates?.[0]?.content?.parts?.[0]) return d.candidates[0].content.parts[0].text;
    return null;
  } catch(e) { return null; }
}
async function getConvo(phone: any) {
  var r = await supabase.from("conversations").select().eq("business_id", BUSINESS_ID).eq("phone", phone).single();
  if (r.data) return r.data;
  var r2 = await supabase.from("conversations").insert({ business_id: BUSINESS_ID, phone: phone, status: "BOT", current_state: "IDLE", state_data: {} }).select().single();
  return r2.data;
}
async function setConvo(id: any, u: any) { await supabase.from("conversations").update({ ...u, updated_at: new Date().toISOString() }).eq("id", id); }
async function logE(evt: any, p?: any, bid?: any) { await supabase.from("logs").insert({ business_id: BUSINESS_ID, booking_id: bid, event: evt, payload: p }); }
function fmtTime(iso: any) { return new Date(iso).toLocaleString("en-ZA", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Johannesburg" }); }

async function getSlotPrice(slot: any) {
  if (slot.price_per_person_override) return Number(slot.price_per_person_override);
  var t = await supabase.from("tours").select("base_price_per_person").eq("id", slot.tour_id).single();
  return Number(t.data?.base_price_per_person || 600);
}
async function getAvailSlotsForTour(tourId: any, lim: any) {
  var r = await supabase.from("slots").select("id, start_time, capacity_total, booked, held, price_per_person_override, tour_id")
    .eq("business_id", BUSINESS_ID).eq("tour_id", tourId).eq("status", "OPEN").gt("start_time", new Date().toISOString())
    .order("start_time", { ascending: true }).limit(lim || 10);
  return (r.data || []).filter(function(s: any) { return s.capacity_total - s.booked - (s.held || 0) > 0; });
}
async function getAvailSlots(lim: any) {
  var r = await supabase.from("slots").select("id, start_time, capacity_total, booked, held, price_per_person_override, tour_id")
    .eq("business_id", BUSINESS_ID).eq("status", "OPEN").gt("start_time", new Date().toISOString())
    .order("start_time", { ascending: true }).limit(lim || 10);
  return (r.data || []).filter(function(s: any) { return s.capacity_total - s.booked - (s.held || 0) > 0; });
}
async function getActiveTours() {
  var r = await supabase.from("tours").select("id, name, description, base_price_per_person, duration_minutes")
    .eq("business_id", BUSINESS_ID).eq("active", true).order("sort_order", { ascending: true });
  return (r.data || []).filter(function(t: any) { return !t.name.includes("Private"); });
}
async function getLoyaltyCount(phone: any) {
  try { var r = await supabase.rpc("check_loyalty", { p_phone: phone, p_business_id: BUSINESS_ID }); return r.data || 0; } catch(e) { return 0; }
}
async function calcDiscount(qty: any, phone: any) {
  var pol = await supabase.from("policies").select().eq("business_id", BUSINESS_ID).single();
  var p = pol.data; var discount = { type: "", percent: 0 };
  var lc = await getLoyaltyCount(phone);
  if (p && lc >= (p.loyalty_bookings_threshold || 2)) discount = { type: "LOYALTY", percent: p.loyalty_discount_percent || 10 };
  if (p && qty >= (p.group_discount_min_qty || 6)) { var gp = p.group_discount_percent || 5; if (gp > discount.percent) discount = { type: "GROUP", percent: gp }; }
  return discount;
}
function genVoucherCode() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; var code = "";
  for (var i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}
async function hasActiveBookings(phone: any) {
  var r = await supabase.from("bookings").select("id").eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["PAID", "HELD", "CONFIRMED"]).limit(1);
  return (r.data || []).length > 0;
}

// ===== REFERRAL SYSTEM =====
function genReferralCode(name: any) {
  var clean = ((name || "REF") + "").split(" ")[0].toUpperCase().substring(0, 4);
  var rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return clean + rand;
}
async function getOrCreateReferral(phone: any, name: any) {
  var existing = await supabase.from("referrals").select().eq("referrer_phone", phone).eq("business_id", BUSINESS_ID).eq("status", "ACTIVE").single();
  if (existing.data) return existing.data;
  var code = genReferralCode(name);
  var r = await supabase.from("referrals").insert({ business_id: BUSINESS_ID, referrer_phone: phone, referrer_name: name, referral_code: code, discount_percent: 5 }).select().single();
  return r.data;
}
async function validateReferralCode(code: any, phone: any) {
  var r = await supabase.from("referrals").select().eq("referral_code", code.toUpperCase()).eq("status", "ACTIVE").single();
  if (!r.data) return null;
  if (r.data.referrer_phone === phone) return null;
  if (r.data.uses >= r.data.max_uses) return null;
  return r.data;
}

// ===== REPEAT BOOKING =====
async function getLastCompletedBooking(phone: any) {
  var r = await supabase.from("bookings").select("*, tours(id, name, base_price_per_person)").eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["COMPLETED", "PAID"]).order("created_at", { ascending: false }).limit(1).single();
  return r.data;
}

var REVIEW_URL = "https://g.page/r/CWabH9a6u5DbEB0/review";

// ===== SMART AVAILABILITY =====
function parseTimeRef(input: string): { start: Date, end: Date, label: string } | null {
  var i = input.toLowerCase();
  var now = new Date();
  var tzNow = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));
  var today = new Date(tzNow.getFullYear(), tzNow.getMonth(), tzNow.getDate());
  var targetDate: Date | null = null;
  var label = "";
  if (i.includes("tomorrow") || i.includes("tmrw")) { targetDate = new Date(today); targetDate.setDate(targetDate.getDate() + 1); label = "tomorrow"; }
  else if (i.includes("today") || i.includes("this afternoon") || i.includes("this morning")) { targetDate = new Date(today); label = "today"; }
  else {
    var days: string[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (var d = 0; d < days.length; d++) {
      if (i.includes(days[d]) || i.includes(days[d].substring(0, 3))) {
        var currentDay = today.getDay(); var diff = d - currentDay; if (diff <= 0) diff += 7;
        targetDate = new Date(today); targetDate.setDate(targetDate.getDate() + diff);
        label = days[d].charAt(0).toUpperCase() + days[d].slice(1); break;
      }
    }
  }
  if (i.includes("weekend")) {
    var sat = new Date(today); var daysToSat = 6 - sat.getDay(); if (daysToSat <= 0) daysToSat += 7;
    sat.setDate(sat.getDate() + daysToSat);
    var mon = new Date(sat); mon.setDate(mon.getDate() + 2);
    return { start: sat, end: mon, label: "this weekend" };
  }
  if (i.includes("next week")) {
    var nextMon = new Date(today); var toMon = (8 - nextMon.getDay()) % 7 || 7;
    nextMon.setDate(nextMon.getDate() + toMon);
    var nextSun = new Date(nextMon); nextSun.setDate(nextSun.getDate() + 7);
    return { start: nextMon, end: nextSun, label: "next week" };
  }
  if (!targetDate) {
    var dm = i.match(/(\d{1,2})\s*(st|nd|rd|th)/);
    if (dm) {
      targetDate = new Date(today); targetDate.setDate(parseInt(dm[1]));
      if (targetDate < today) targetDate.setMonth(targetDate.getMonth() + 1);
      label = targetDate.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short", timeZone: "Africa/Johannesburg" });
    }
  }
  if (!targetDate) return null;
  var start = new Date(targetDate); var end = new Date(targetDate); end.setDate(end.getDate() + 1);
  if (i.includes("morning") || i.includes("early")) { start.setHours(5, 0, 0, 0); end = new Date(targetDate); end.setHours(12, 0, 0, 0); label += " morning"; }
  else if (i.includes("afternoon")) { start.setHours(12, 0, 0, 0); end = new Date(targetDate); end.setHours(17, 0, 0, 0); label += " afternoon"; }
  else if (i.includes("evening") || i.includes("sunset")) { start.setHours(16, 0, 0, 0); end = new Date(targetDate); end.setHours(21, 0, 0, 0); label += " evening"; }
  var tm = i.match(/(\d{1,2})\s*(am|pm)/);
  if (tm) {
    var hr = parseInt(tm[1]); if (tm[2] === "pm" && hr < 12) hr += 12; if (tm[2] === "am" && hr === 12) hr = 0;
    start.setHours(hr, 0, 0, 0); end = new Date(targetDate); end.setHours(hr + 2, 0, 0, 0);
  }
  return { start: start, end: end, label: label };
}
async function checkWeatherConcern(phone: string, input: string): Promise<boolean> {
  var i = input.toLowerCase();
  var isWeatherQ = (i.includes("trip") || i.includes("tour") || i.includes("paddle")) && (i.includes("still on") || i.includes("go ahead") || i.includes("happening") || i.includes("confirmed"));
  var isWeatherCheck = i.includes("weather") && (i.includes("tomorrow") || i.includes("today") || i.includes("look"));
  if (!isWeatherQ && !isWeatherCheck) return false;

  // Check if they have a booking
  var wBkr = await supabase.from("bookings").select("id, slots(start_time), tours(name)")
    .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["PAID", "CONFIRMED"])
    .order("created_at", { ascending: false }).limit(1).single();
  var bkInfo = "";
  var bkTime = "";
  if (wBkr.data) {
    var wSlot = (wBkr.data as any).slots;
    var wTour = (wBkr.data as any).tours;
    if (wSlot) {
      bkInfo = "Your *" + (wTour?.name || "tour") + "* is on " + fmtTime(wSlot.start_time) + ".\n\n";
      bkTime = wSlot.start_time;
    }
  }

  // Fetch live weather from Open-Meteo (Three Anchor Bay: -33.908, 18.398)
  var weatherMsg = "";
  try {
    var tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    var dateStr = tmr.toISOString().split("T")[0];
    var wUrl = "https://api.open-meteo.com/v1/forecast?latitude=-33.908&longitude=18.398&daily=wind_speed_10m_max,wind_direction_10m_dominant,weather_code&hourly=wind_speed_10m,wind_direction_10m,visibility,temperature_2m&timezone=Africa/Johannesburg&forecast_days=2";
    var mUrl = "https://marine-api.open-meteo.com/v1/marine?latitude=-33.908&longitude=18.398&daily=wave_height_max,wave_period_max&timezone=Africa/Johannesburg&forecast_days=2";
    var [wRes, mRes] = await Promise.all([fetch(wUrl), fetch(mUrl)]);
    var wData = await wRes.json();
    var mData = await mRes.json();

    // Get tomorrow's data (index 1)
    var maxWind = wData?.daily?.wind_speed_10m_max?.[1] || 0;
    var windDir = wData?.daily?.wind_direction_10m_dominant?.[1] || 0;
    var swell = mData?.daily?.wave_height_max?.[1] || 0;
    var weatherCode = wData?.daily?.weather_code?.[1] || 0;

    // Check visibility at tour hours (7-9am = indices 7-9)
    var minVis = 99999;
    var hourlyVis = wData?.hourly?.visibility || [];
    var hourlyTimes = wData?.hourly?.time || [];
    for (var hi = 0; hi < hourlyTimes.length; hi++) {
      if (hourlyTimes[hi].startsWith(dateStr) && hi % 24 >= 6 && hi % 24 <= 10) {
        if (hourlyVis[hi] < minVis) minVis = hourlyVis[hi];
      }
    }
    var foggy = minVis < 1000; // less than 1km visibility

    // Wind direction name
    var dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    var dirName = dirs[Math.round(windDir / 22.5) % 16];
    var isSE = dirName.includes("SE");
    var windLimit = isSE ? 25 : 20;
    var windBad = maxWind > windLimit;
    var swellBad = swell > 2.6;

    var concerns: string[] = [];
    if (swellBad) concerns.push("swell is " + swell.toFixed(1) + "m (above 2.6m)");
    if (windBad) concerns.push("wind gusts up to " + Math.round(maxWind) + "km/h " + dirName + (isSE ? " (limit 25km/h for SE)" : " (limit 20km/h)"));
    if (foggy) concerns.push("low visibility/fog expected");

    if (concerns.length > 0) {
      weatherMsg = "Looking at tomorrow\u2019s forecast, it does look like a challenging paddle \u26A0\uFE0F\n\n" + concerns.map(function(c) { return "\u2022 " + c; }).join("\n") + "\n\nWe\u2019ll let you know for sure tomorrow morning, about an hour before the trip. Please keep your phone nearby \u{1F4F1}\n\nIf we cancel, you get a *full refund or free reschedule*.";
    } else {
      weatherMsg = "Tomorrow\u2019s looking good! \u2600\uFE0F\n\n\u{1F30A} Swell: " + swell.toFixed(1) + "m\n\u{1F4A8} Wind: " + Math.round(maxWind) + "km/h " + dirName + "\n\nConditions look favourable for paddling. We\u2019ll still confirm on the morning of your trip about an hour before launch. Keep your phone nearby \u{1F4F1}";
    }
  } catch (e) {
    console.error("Weather API err:", e);
    weatherMsg = "We check conditions every morning before trips go out. If the swell is high, there\u2019s heavy fog, or strong winds, we may need to postpone.\n\nWe\u2019ll let you know on the morning of your trip, about an hour before launch. Keep your phone nearby \u{1F4F1}";
  }

  await sendText(phone, bkInfo + weatherMsg);
  await sendButtons(phone, "Anything else?", [{ id: "ASK", title: "\u2753 Another Question" }, { id: "IDLE", title: "\u2B05 Menu" }]);
  return true;
}

function detectAvailQuery(input: string): boolean {
  var i = input.toLowerCase();
  var hasTime = i.includes("tomorrow") || i.includes("today") || i.includes("weekend") || i.includes("next week") || i.includes("morning") || i.includes("afternoon") || i.includes("evening") || ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].some(function(d) { return i.includes(d); }) || /\d{1,2}(st|nd|rd|th)/.test(i) || /\d{1,2}\s*(am|pm)/.test(i);
  var hasIntent = i.includes("available") || i.includes("space") || i.includes("slot") || i.includes("open") || i.includes("spot") || i.includes("can i") || i.includes("do you have") || i.includes("any tour") || i.includes("what time") || i.includes("book for") || i.includes("free") || i.includes("which") || i.includes("what");
  return hasTime && hasIntent;
}
async function handleSmartAvail(phone: string, input: string): Promise<boolean> {
  var timeRef = parseTimeRef(input);
  if (!timeRef) return false;
  var r = await supabase.from("slots").select("id, start_time, capacity_total, booked, held, tour_id, tours(name, base_price_per_person)")
    .eq("business_id", BUSINESS_ID).eq("status", "OPEN")
    .gte("start_time", timeRef.start.toISOString())
    .lt("start_time", timeRef.end.toISOString())
    .order("start_time", { ascending: true }).limit(15);
  var slots = (r.data || []).filter(function(s: any) { return s.capacity_total - s.booked - (s.held || 0) > 0; });
  if (slots.length === 0) {
    await sendText(phone, "I checked and unfortunately there\u2019s nothing available for " + timeRef.label + ". \u{1F614}\n\nWant me to show you what\u2019s coming up instead?");
    await sendButtons(phone, "Options:", [{ id: "AVAIL", title: "\u{1F4C5} Next Available" }, { id: "BOOK", title: "\u{1F6F6} Pick a Date" }, { id: "IDLE", title: "\u2B05 Menu" }]);
    return true;
  }
  var msg = "Here\u2019s what\u2019s available for *" + timeRef.label + "*:\n\n";
  for (var si = 0; si < slots.length; si++) {
    var s = slots[si]; var tour = (s as any).tours;
    var avail = s.capacity_total - s.booked - (s.held || 0);
    msg += "\u{1F6F6} *" + (tour?.name || "Tour") + "*\n";
    msg += "   " + fmtTime(s.start_time) + " \u2014 " + avail + " spots \u2014 R" + (tour?.base_price_per_person || "600") + "/pp\n\n";
  }
  msg += "Want to book one of these?";
  await sendButtons(phone, msg, [{ id: "BOOK", title: "\u{1F6F6} Book Now" }, { id: "AVAIL", title: "\u{1F4C5} Other Dates" }, { id: "IDLE", title: "\u2B05 Menu" }]);
  return true;
}


// ===== ENHANCED FAQ =====
var FAQ_ANSWERS: any = {
  meeting_point: "We meet at *Three Anchor Bay*, Beach Road, Sea Point, Cape Town. Look for our trailer near the slipway. Please arrive about 15 minutes early so we can get you kitted up!\n\nHere\u2019s the pin: " + MAPS_URL,
  what_to_bring: "Here\u2019s what we recommend:\n\n\u2022 Sunscreen (reef-safe is best!)\n\u2022 Hat & sunglasses with a strap\n\u2022 Towel & change of clothes\n\u2022 Water bottle\n\u2022 Light layers \u2014 it can get breezy on the water\n\nWe provide everything else: life jackets, paddles, and kayaks!",
  cancellation: "Our cancellation policy:\n\n\u2022 *More than 24hrs before:* 95% refund (5% booking fee)\n\u2022 *Less than 24hrs:* Unfortunately no refund\n\u2022 *Weather cancellation by us:* Full refund or free reschedule\n\nYou can cancel easily through *My Bookings* in this chat.",
  duration: "It depends on the tour:\n\n\u2022 *Sea Kayak Tour:* About 90 minutes on the water\n\u2022 *Sunset Paddle:* Around 2 hours (includes sparkling wine!)\n\nAllow an extra 15-20 min for the safety briefing and getting ready.",
  safety: "Absolutely! Your safety is our number one priority. Here\u2019s why you\u2019re in good hands:\n\n\u2022 Our guides are fully qualified and experienced\n\u2022 Life jackets are provided and mandatory\n\u2022 We check weather and sea conditions every single day\n\u2022 We only go out when it\u2019s safe\n\u2022 No experience needed at all \u2014 beginners are very welcome!\n\u2022 We\u2019ve been doing this safely for over 30 years",
  weather: "We\u2019re weather-dependent for your safety. If conditions aren\u2019t suitable:\n\n\u2022 We\u2019ll let you know as early as possible\n\u2022 You\u2019ll get a *full refund* or a *free reschedule*\n\u2022 Check our WhatsApp status for daily updates\n\nCape Town weather can be unpredictable, but that\u2019s part of the adventure!",
  pricing: "Here\u2019s what our tours cost:\n\n\u{1F6F6} *Sea Kayak Tour:* R600/person (90 min)\n\u{1F305} *Sunset Paddle:* R600/person (2 hrs, includes bubbly!)\n\n*Discounts:*\n\u2022 Groups of 6+: 5% off\n\u2022 Loyal paddlers: 10% off\n\nEverything\u2019s included: kayak, paddle, life jacket, and an amazing guide!",
  age: "Great question!\n\n\u2022 *Minimum age:* 6 years old\n\u2022 Kids under 12 must be with an adult\n\u2022 All participants need to be able to swim\n\nIt\u2019s a fantastic family activity \u2014 kids absolutely love it!",
  parking: "There\u2019s free street parking available along Beach Road near Three Anchor Bay. It\u2019s usually easy to find a spot, especially for morning tours. Arrive a few minutes early to park and walk down to the launch point.",
  groups: "We love groups! For groups of 6 or more, you automatically get *5% off*. For large groups or team events, we\u2019d recommend our *Private Tour* option \u2014 it\u2019s fully customisable.\n\nJust start a booking and we\u2019ll sort you out, or type *speak to us* for custom arrangements.",
  camera: "If you have a phone pouch then yes sure! We\u2019ll also be taking photos during the trip and sending them to you afterwards \u{1F4F8}",
  dog: "If your doggie is used to the water, we do make exceptions! Otherwise dogs aren\u2019t always allowed \u2014 send us a message and we\u2019ll let you know \u{1F436}",
  fitness: "We have a weight restriction of 95kg per person. No special fitness is needed though \u2014 our guides set a comfortable pace and beginners are very welcome!",
  pregnant: "It\u2019s up to you! But as they are sit-inside kayaks, we can\u2019t be certain you\u2019ll be able to fit comfortably if heavily pregnant. Chat to your doctor and let us know \u{1F60A}",
  glasses: "Definitely! We recommend bringing your sunnies \u2014 the glare on the water can be strong \u{1F576}\uFE0F",
  food: "We don\u2019t provide food, but we have water bottles for sale at R25 each. We recommend eating a light meal about an hour before your tour \u{1F60A}",
  payment: "We accept VISA and Mastercard through our secure online payment. If you\u2019d like to pay cash, we ask for at least a 50% deposit online to secure your booking \u2014 just let us know and we\u2019ll send you a deposit link!",
  difference: "The early morning trip is a bit cooler and a wonderful way to start the day. Wildlife sightings are about the same on both trips. The Sunset Paddle is more relaxed and includes sparkling wine at sunset \u{1F305}. Besides that, it\u2019s all about the same \u2014 both are incredible!",
  hours: "We provide live support via this chat 24/7! If you need a human response, our team is available 9AM to 5PM.\n\nTour times:\n\u{1F305} Morning: 07:00 and 09:00\n\u{1F307} Sunset: 17:00\n\nWe run every day, weather permitting.",
  holidays: "We operate 365 days a year, weather permitting! Public holidays and festive season are some of our busiest days \u2014 book early to secure your spot \u{1F389}",
  tours_overview: "We run two awesome tours:\n\n\u{1F6F6} *Sea Kayak Tour* \u2014 R600/pp, 90 min. Morning paddle with seals and dolphins.\n\u{1F305} *Sunset Paddle* \u2014 R600/pp, 2 hrs. Evening paddle with sunset and sparkling wine.\n\nBoth include all equipment, a qualified guide, and an unforgettable experience!",
  what_to_expect: "Here\u2019s what a typical trip looks like:\n\n1\uFE0F\u20E3 Arrive 15 min early at Three Anchor Bay\n2\uFE0F\u20E3 Safety briefing & getting kitted up\n3\uFE0F\u20E3 Launch from the slipway\n4\uFE0F\u20E3 Paddle along the stunning Atlantic coastline\n5\uFE0F\u20E3 Look out for seals, dolphins & seabirds!\n6\uFE0F\u20E3 Return to shore feeling amazing\n\nIt\u2019s truly unforgettable!",
};

function matchFAQ(input: any) {
  var i = input.toLowerCase();
  // Meeting point
  if (i.includes("where") && (i.includes("meet") || i.includes("go") || i.includes("find") || i.includes("located"))) return "meeting_point";
  if (i.includes("meeting point") || i.includes("location") || i.includes("address") || i.includes("directions") || i.includes("get there")) return "meeting_point";
  if (i.includes("map") || i.includes("pin") || i.includes("gps")) return "meeting_point";
  // What to bring
  if (i.includes("bring") || i.includes("wear") || i.includes("pack") || i.includes("prepare") || i.includes("need to take") || i.includes("what do i need")) return "what_to_bring";
  if (i.includes("clothes") || i.includes("gear") || i.includes("equipment") || i.includes("sunscreen")) return "what_to_bring";
  // Cancellation
  if ((i.includes("cancel") && (i.includes("policy") || i.includes("what if") || i.includes("can i"))) || (i.includes("refund") && !i.includes("my")) || (i.includes("change") && i.includes("mind"))) return "cancellation";
  if (i.includes("money back") || i.includes("get refund")) return "cancellation";
  // Duration
  if (i.includes("how long") || i.includes("duration") || i.includes("how much time") || i.includes("how many hours") || i.includes("how many minutes")) return "duration";
  if (i.includes("what time") && (i.includes("finish") || i.includes("end") || i.includes("done"))) return "duration";
  // Safety
  if (i.includes("safe") || i.includes("danger") || i.includes("risk") || i.includes("drown") || i.includes("scary")) return "safety";
  if (i.includes("swim") || i.includes("experience") && (i.includes("need") || i.includes("require"))) return "safety";
  if (i.includes("beginner") || i.includes("first time") || i.includes("never") && i.includes("before")) return "safety";
  if (i.includes("can't swim") || i.includes("cant swim") || i.includes("nervous")) return "safety";
  // Weather
  if (i.includes("weather") || i.includes("rain") || i.includes("wind") || i.includes("cold") || i.includes("storm")) return "weather";
  if (i.includes("what if") && (i.includes("rain") || i.includes("bad weather") || i.includes("windy"))) return "weather";
  // Pricing
  if (i.includes("price") || i.includes("cost") || i.includes("how much") || i.includes("rate") || i.includes("fee") || i.includes("charge") || i.includes("rand") || i.includes("expensive")) return "pricing";
  if (i.includes("pay") && !i.includes("payment")) return "pricing";
  if (i.includes("discount") || i.includes("special") || i.includes("deal") || i.includes("promo")) return "pricing";
  // Age
  if (i.includes("age") || i.includes("child") || i.includes("kid") || i.includes("baby") || i.includes("toddler") || i.includes("young") || i.includes("old enough")) return "age";
  if (i.includes("family") || i.includes("families") || i.includes("my son") || i.includes("my daughter") || i.includes("my child")) return "age";
  // Parking
  if (i.includes("park") || i.includes("parking") || i.includes("car")) return "parking";
  // Groups
  if (i.includes("group") || i.includes("team") || i.includes("corporate") || i.includes("birthday") || i.includes("party") || i.includes("event") || i.includes("hen") || i.includes("bachelor")) return "groups";
  // What to expect
  if (i.includes("expect") || i.includes("what happens") || i.includes("what is it like") || i.includes("tell me about") || i.includes("describe") || i.includes("what do you do")) return "what_to_expect";
  if (i.includes("itinerary") || i.includes("programme") || (i.includes("schedule") && !i.includes("reschedule")) || i.includes("typical")) return "what_to_expect";
  // Camera / phone
  if (i.includes("camera") || i.includes("gopro") || i.includes("phone") && (i.includes("bring") || i.includes("take") || i.includes("waterproof"))) return "camera";
  if (i.includes("dry bag")) return "camera";
  // Dog / pet
  if (i.includes("dog") || i.includes("pet") || i.includes("animal")) return "dog";
  // Fitness / weight
  if (i.includes("fitness") || i.includes("fit") && i.includes("need") || i.includes("weight") || i.includes("heavy") || i.includes("overweight") || i.includes("disabled") || i.includes("wheelchair") || i.includes("mobility")) return "fitness";
  // Pregnant
  if (i.includes("pregnant") || i.includes("pregnancy") || i.includes("expecting")) return "pregnant";
  // Glasses
  if (i.includes("glasses") || i.includes("spectacles") || i.includes("contact") && i.includes("lens") || i.includes("contacts")) return "glasses";
  // Food / drinks
  if (i.includes("food") || i.includes("eat") || i.includes("drink") || i.includes("hungry") || i.includes("snack") || i.includes("wine") || i.includes("alcohol") || i.includes("bubbly")) return "food";
  // Payment methods
  if (i.includes("cash") || i.includes("eft") || i.includes("transfer") || (i.includes("pay") && (i.includes("how") || i.includes("method") || i.includes("card") || i.includes("international")))) return "payment";
  if (i.includes("deposit") || i.includes("split") && i.includes("pay")) return "payment";
  // Tour differences
  if ((i.includes("difference") || i.includes("compare") || i.includes("which") && i.includes("tour") || i.includes("which one") || i.includes("best tour")) && !i.includes("book")) return "difference";
  // Hours
  if (i.includes("hours") || i.includes("open") || i.includes("operating") || (i.includes("what time") && !i.includes("finish") && !i.includes("end") && !i.includes("my"))) return "hours";
  // Holidays
  if (i.includes("holiday") || i.includes("public holiday") || i.includes("christmas") || i.includes("new year") || i.includes("easter") || i.includes("festive")) return "holidays";
  // Tours overview
  if ((i.includes("what tour") || i.includes("which tour") || i.includes("tour") && i.includes("offer") || i.includes("options") || i.includes("what do you do")) && !i.includes("book")) return "tours_overview";
  return null;
}

// Detect intent from natural language
function detectIntent(input: any) {
  var i = input.toLowerCase();
  if (i.includes("book") || i.includes("reserve") || i.includes("sign up") || i.includes("join") || i.includes("want to go") || i.includes("interested")) return "BOOK";
  if (i.includes("available") || i.includes("availability") || i.includes("open") || i.includes("slot") || i.includes("when can") || i.includes("next tour") || i.includes("upcoming")) return "AVAIL";
  if (i.includes("my booking") || i.includes("my trip") || i.includes("manage") || i.includes("check booking") || i.includes("booking status")) return "MY_BOOKINGS";
  if (i.includes("voucher") || i.includes("gift") || i.includes("code") || i.includes("coupon") || i.includes("promo code")) return "VOUCHER";
  if (i.includes("speak") || i.includes("human") || i.includes("agent") || i.includes("someone") || i.includes("person") || i.includes("call") || i.includes("phone number") || i.includes("contact")) return "HUMAN";
  if (i.includes("thank") || i.includes("thanks") || i.includes("cheers") || i.includes("awesome") || i.includes("great") || i.includes("perfect") || i.includes("amazing")) return "THANKS";
  return null;
}

async function handleMsg(phone: any, text: any, msgType: any, interactive?: any) {
  var convo = await getConvo(phone);
  if (!convo) return;
  // Log incoming message before HUMAN check
  var _rt = (text || "").trim();
  var _ri = (msgType === "interactive" && interactive) ? ((interactive.button_reply && interactive.button_reply.id) || (interactive.list_reply && interactive.list_reply.id) || "") : "";
  try { await supabase.from("chat_messages").insert({ business_id: BUSINESS_ID, phone: phone, direction: "IN", body: _rt || _ri || "[non-text]", sender: convo.customer_name || phone }); } catch(e) {}
  if (convo.status === "HUMAN") return;
  var state = convo.current_state || "IDLE";
  var sd = convo.state_data || {};
  var input = (text || "").trim().toLowerCase();
  var rawText = (text || "").trim();
  var rid = "";
  if (msgType === "interactive" && interactive) {
    rid = (interactive.button_reply && interactive.button_reply.id) || (interactive.list_reply && interactive.list_reply.id) || "";
  }

    // Log incoming message for chat
    try { await supabase.from("chat_messages").insert({ business_id: BUSINESS_ID, phone: phone, direction: "IN", body: rawText || rid || "[non-text]", sender: convo?.customer_name || phone }); } catch(e) {}
  console.log("S:" + state + " I:" + input + " R:" + rid);

  // Global reset
  if (input === "menu" || input === "start" || input === "restart") {
    await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
    state = "IDLE";
  }

  // Greetings trigger welcome
  if ((input === "hi" || input === "hello" || input === "hey" || input === "howzit" || input === "hiya" || input === "yo" || input === "sup" || input === "good morning" || input === "good afternoon" || input === "good evening") && state !== "IDLE") {
    await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
    state = "IDLE";
  }

  // ===== NATURAL LANGUAGE FROM ANY STATE =====
  if (state === "IDLE" || state === "MENU") {
    // Check smart availability first
    if (!rid && detectAvailQuery(input)) {
      var handled = await handleSmartAvail(phone, input);
      if (handled) { await setConvo(convo.id, { current_state: "MENU" }); return; }
    }

    // Check FAQ
    var faqKey = matchFAQ(input);
    if (faqKey && !rid) {
      await typingDelay();
      await sendText(phone, FAQ_ANSWERS[faqKey]);
      await typingDelay();
      await sendText(phone, "Anything else I can help with?");
      await sendButtons(phone, "Quick actions:", [
        { id: "BOOK", title: "\u{1F6F6} Book a Tour" },
        { id: "MORE", title: "\u{1F4AC} More Options" },
      ]);
      await setConvo(convo.id, { current_state: "MENU" });
      return;
    }

    // Check intent
    var intent = detectIntent(input);
    if (intent === "THANKS" && !rid) {
      await sendText(phone, "You\u2019re welcome! \u{1F60A} Feel free to ask anything else or type *menu* to see your options.");
      await setConvo(convo.id, { current_state: "MENU" });
      return;
    }
    if (intent && !rid) { rid = intent; }
  }

  // ===== IDLE =====
  if (state === "IDLE") {
    var lc = await getLoyaltyCount(phone);
    var hasBookings = await hasActiveBookings(phone);
    var welcome = "";

    if (lc >= 2) {
      welcome = "Hey, welcome back! \u{1F44B} Great to see you again. What can I do for you?";
    } else if (lc === 1 || hasBookings) {
      welcome = "Hey, welcome back to Cape Kayak Adventures! \u{1F6F6}\n\nWhat can I help you with?";
    } else {
      welcome = "Hey there! \u{1F44B} Welcome to *Cape Kayak Adventures*! How can I help you today?";
    }

    // Returning customers see My Bookings first
    if (hasBookings) {
      await sendButtons(phone, welcome, [
        { id: "MY_BOOKINGS", title: "\u{1F4CB} My Bookings" },
        { id: "BOOK", title: "\u{1F6F6} Book a Tour" },
        { id: "ASK", title: "\u2753 Ask a Question" },
      ]);
    } else {
      await sendButtons(phone, welcome, [
        { id: "BOOK", title: "\u{1F6F6} Book a Tour" },
        { id: "ASK", title: "\u2753 Ask a Question" },
        { id: "MORE", title: "\u{1F4AC} More Options" },
      ]);
    }
    await setConvo(convo.id, { current_state: "MENU" });
  }

  // ===== MENU =====
  else if (state === "MENU") {
    var c = rid || input;

    // BOOK
    if (c === "BOOK" || c.includes("book")) {
      var tours = await getActiveTours();
      if (tours.length === 0) { await sendText(phone, "No tours available at the moment \u2014 check back soon!"); await setConvo(convo.id, { current_state: "IDLE" }); return; }
      if (tours.length === 1) {
        await sendText(phone, "How many people will be joining? (1\u201330)");
        await setConvo(convo.id, { current_state: "ASK_QTY", state_data: { tour_id: tours[0].id } });
      } else {
        var trows: any[] = [];
        for (var ti = 0; ti < tours.length; ti++) {
          var tr = tours[ti];
          trows.push({ id: "TOUR_" + tr.id, title: tr.name, description: "R" + tr.base_price_per_person + "/pp \u2022 " + tr.duration_minutes + " min" });
        }
        await sendText(phone, "Awesome, let\u2019s get you on the water! \u{1F30A}\n\nWhich tour catches your eye?");
        await sendList(phone, "We have " + tours.length + " incredible options:", "Choose a Tour", [{ title: "Our Tours", rows: trows }]);
        await setConvo(convo.id, { current_state: "PICK_TOUR", state_data: {} });
      }
    }

    // AVAILABILITY
    else if (c === "AVAIL" || c.includes("avail")) {
      var tours2 = await getActiveTours();
      if (tours2.length <= 1) {
        var slots = await getAvailSlots(8);
        if (slots.length === 0) { await sendText(phone, "Nothing open right now, but check back soon \u2014 we add new slots regularly!"); await setConvo(convo.id, { current_state: "IDLE" }); }
        else {
          var msg = "Here\u2019s what\u2019s coming up:\n\n";
          for (var ai = 0; ai < slots.length; ai++) {
            var as2 = slots[ai]; var aav = as2.capacity_total - as2.booked - (as2.held || 0); var apr = await getSlotPrice(as2);
            msg += "\u2022 " + fmtTime(as2.start_time) + " \u2014 " + aav + " spots \u2014 R" + apr + "/pp\n";
          }
          await sendButtons(phone, msg, [{ id: "BOOK", title: "\u{1F6F6} Book Now" }, { id: "IDLE", title: "\u2B05 Back" }]);
        }
      } else {
        var availMsg = "Here\u2019s what\u2019s available:\n\n";
        for (var ati = 0; ati < tours2.length; ati++) {
          var at2 = tours2[ati];
          var atSlots = await getAvailSlotsForTour(at2.id, 3);
          availMsg += "*" + at2.name + "* (R" + at2.base_price_per_person + "/pp)\n";
          if (atSlots.length === 0) { availMsg += "  Fully booked for now\n\n"; }
          else {
            for (var asi = 0; asi < atSlots.length; asi++) {
              var ats = atSlots[asi]; availMsg += "  \u2022 " + fmtTime(ats.start_time) + " \u2014 " + (ats.capacity_total - ats.booked - (ats.held || 0)) + " spots\n";
            }
            availMsg += "\n";
          }
        }
        await sendButtons(phone, availMsg, [{ id: "BOOK", title: "\u{1F6F6} Book Now" }, { id: "IDLE", title: "\u2B05 Back" }]);
      }
    }

    // MY BOOKINGS
    else if (c === "MY_BOOKINGS" || c.includes("my booking") || c.includes("manage")) {
      var bkr = await supabase.from("bookings").select("id, status, qty, total_amount, slot_id, slots(start_time), tours(name)")
        .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["PAID", "HELD", "CONFIRMED"])
        .order("created_at", { ascending: false }).limit(5);
      var bookings = bkr.data || [];
      if (bookings.length === 0) {
        await sendText(phone, "You don\u2019t have any active bookings at the moment.");
        await sendButtons(phone, "Want to book your next adventure?", [{ id: "BOOK", title: "\u{1F6F6} Book a Tour" }, { id: "IDLE", title: "\u2B05 Main Menu" }]);
        await setConvo(convo.id, { current_state: "MENU" });
      } else {
        var bmsg = "Here are your bookings:\n\n"; var brows: any[] = [];
        for (var bi = 0; bi < bookings.length; bi++) {
          var b = bookings[bi]; var bslot = (b as any).slots; var btour = (b as any).tours;
          var bref = b.id.substring(0, 8).toUpperCase(); var btime = bslot ? fmtTime(bslot.start_time) : "TBC";
          bmsg += (bi + 1) + ". *" + bref + "* \u2014 " + (btour?.name || "Tour") + "\n   " + btime + " \u2022 " + b.qty + " pax \u2022 R" + b.total_amount + " \u2022 " + b.status + "\n\n";
          brows.push({ id: "BK_" + b.id, title: bref + " - " + b.status, description: (btour?.name || "Tour").substring(0, 20) + " " + (btime || "").substring(0, 15) });
        }
        await sendList(phone, bmsg + "Tap to manage a booking:", "My Bookings", [{ title: "Your Bookings", rows: brows }]);
        await setConvo(convo.id, { current_state: "MY_BOOKINGS_LIST" });
      }
    }

    // ASK A QUESTION
    else if (c === "ASK" || c === "ask" || c.includes("question")) {
      await typingDelay();
      await sendText(phone, "Go ahead, ask me anything! \u{1F60A}\n\nI can answer things like:\n\u2022 \"What should I bring?\"\n\u2022 \"Where do we meet?\"\n\u2022 \"Is it safe for beginners?\"\n\u2022 \"Can I reschedule my booking?\"\n\u2022 \"What\'s available tomorrow?\"\n\nOr ask about your specific booking \u2014 I can look it up!");
      await setConvo(convo.id, { current_state: "ASK_MODE" });
      return;
    }

    // MORE OPTIONS
    else if (c === "MORE") {
      await sendList(phone, "What else can I help with?", "Options", [{ title: "More Options", rows: [
        { id: "AVAIL", title: "\u{1F4C5} Availability", description: "See upcoming tour times" },
        { id: "MY_BOOKINGS", title: "\u{1F4CB} My Bookings", description: "View & manage bookings" },
        { id: "VOUCHER", title: "\u{1F381} Gift Vouchers", description: "Buy or redeem vouchers" },
        { id: "REFERRAL", title: "\u{1F91D} Refer a Friend", description: "You both get 5% off" },
        { id: "HUMAN", title: "\u{1F4AC} Speak to Our Team", description: "Chat with a real person" },
      ]}]);
    }

    // FAQ LIST
    else if (c === "FAQ_LIST") {
      await sendList(phone, "What would you like to know? (Or just ask me in your own words!)", "Browse Topics", [{
        title: "Common Questions",
        rows: [
          { id: "FAQ_MEET", title: "Meeting Point", description: "Where to find us" },
          { id: "FAQ_BRING", title: "What to Bring", description: "Gear and prep" },
          { id: "FAQ_CANCEL", title: "Cancellation Policy", description: "Refund info" },
          { id: "FAQ_DURATION", title: "Tour Duration", description: "How long is it" },
          { id: "FAQ_SAFE", title: "Safety", description: "Is it safe for beginners" },
          { id: "FAQ_WEATHER", title: "Weather Policy", description: "What if it rains" },
          { id: "FAQ_PRICE", title: "Pricing & Discounts", description: "What it costs" },
          { id: "FAQ_AGE", title: "Kids & Families", description: "Age requirements" },
          { id: "FAQ_PARKING", title: "Parking", description: "Where to park" },
          { id: "FAQ_EXPECT", title: "What to Expect", description: "The full experience" },
        ],
      }]);
      await setConvo(convo.id, { current_state: "FAQ_LIST" });
    }

    // VOUCHER
    else if (c === "VOUCHER" || c.includes("voucher") || c.includes("gift")) {
      await sendButtons(phone, "\u{1F39F} *Vouchers*\n\nWhat would you like to do?", [
        { id: "BUY_VOUCHER", title: "\u{1F381} Buy a Gift Voucher" },
        { id: "REDEEM_VOUCHER", title: "\u{1F39F} Redeem a Code" },
        { id: "IDLE", title: "\u2B05 Back" },
      ]);
    }

    // BUY GIFT VOUCHER
    else if (c === "BUY_VOUCHER" || c.includes("buy") && c.includes("voucher")) {
      var tours = await getActiveTours();
      var trows = [];
      for (var ti = 0; ti < tours.length; ti++) {
        var tr = tours[ti];
        trows.push({ id: "GV_" + tr.id, title: tr.name, description: "R" + tr.base_price_per_person + " voucher" });
      }
      await sendText(phone, "\u{1F381} *Buy a Gift Voucher*\n\nGreat idea! Pick which tour the voucher is for:");
      await sendList(phone, "Each voucher has a credit value applied to your booking.", "Choose Tour", [{ title: "Tours", rows: trows }]);
      await setConvo(convo.id, { current_state: "GV_PICK_TOUR", state_data: {} });
    }

    // REDEEM
    else if (c === "REDEEM_VOUCHER") {
      await sendText(phone, "Got a voucher? Nice! \u{1F389}\n\nPlease type your 8-character voucher code:");
      await setConvo(convo.id, { current_state: "REDEEM_VOUCHER" });
    }

    
    // REDEEM
    else if (c === "REDEEM_VOUCHER") {
      await sendText(phone, "Got a voucher? Nice! \u{1F389}\n\nPlease type your 8-character voucher code:");
      await setConvo(convo.id, { current_state: "REDEEM_VOUCHER" });
    }

    // HUMAN
    // REFERRAL
    else if (c === "REFERRAL" || (c.includes("refer") && !c.includes("refund"))) {
      var cname = convo.customer_name || "Friend";
      var ref = await getOrCreateReferral(phone, cname);
      if (ref) {
        await sendText(phone, "\u{1F91D} *Share the adventure!*\n\nHere\u2019s your personal referral code:\n\n\u{1F3AF} Code: *" + ref.referral_code + "*\n\n\u2022 Your friend gets *5% off* their first booking\n\u2022 You get *5% off* your next booking\n\nJust tell them to mention your code when booking!\n\nShare this message:\n_Hey! Use my code *" + ref.referral_code + "* to get 5% off a kayak tour with Cape Kayak Adventures. WhatsApp them to book: wa.me/27XXXXXXXXXX_");
        await sendButtons(phone, "Anything else?", [{ id: "BOOK", title: "\u{1F6F6} Book a Tour" }, { id: "IDLE", title: "\u2B05 Menu" }]);
      } else {
        await sendText(phone, "Something went wrong generating your code. Type *speak to us* for help.");
      }
    }

    // REPEAT BOOKING
    else if (c === "BOOK_AGAIN") {
      var lastBk = await getLastCompletedBooking(phone);
      if (lastBk) {
        var lbTour = lastBk.tours;
        await sendText(phone, "\u{1F6F6} Let\u2019s book you on *" + (lbTour ? lbTour.name : "a tour") + "* again!\n\nHow many people this time?");
        await setConvo(convo.id, { current_state: "ASK_QTY", state_data: { tour_id: lbTour ? lbTour.id : lastBk.tour_id } });
      } else {
        await setConvo(convo.id, { current_state: "MENU" });
        rid = "BOOK";
      }
    }

    else if (c === "HUMAN" || c.includes("speak") || c.includes("human") || c.includes("agent") || c.includes("contact")) {
      await sendText(phone, "No problem! I\u2019m connecting you to our team now. They\u2019ll get back to you shortly \u{1F64F}\n\nIn the meantime, feel free to type *menu* if you want to chat with me again.");
      await setConvo(convo.id, { current_state: "IDLE", status: "HUMAN" });
      await logE("human_takeover", { phone: phone });
    }

    // BACK
    else if (c === "IDLE" || c === "back" || c === "main menu") {
      await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
      await handleMsg(phone, "hi", "text");
    }

    // FALLBACK — try to be helpful
    else {
      await typingDelay();
      var gemReply = await gemFallback(input || rawText);
      if (gemReply) {
        await sendText(phone, gemReply);
        await sendButtons(phone, "Anything else?", [
          { id: "BOOK", title: "\u{1F6F6} Book a Tour" },
          { id: "MORE", title: "\u{1F4AC} More Options" },
        ]);
      } else {
        await sendText(phone, "I\u2019m not quite sure what you mean \u{1F60A} You can ask me things like \"where do we meet\" or \"how much does it cost\" \u2014 or pick an option below:");
        await sendButtons(phone, "Quick actions:", [
          { id: "BOOK", title: "\u{1F6F6} Book a Tour" },
          { id: "MY_BOOKINGS", title: "\u{1F4CB} My Bookings" },
          { id: "MORE", title: "\u{1F4AC} More Options" },
        ]);
      }
    }
  }

  // ===== PICK TOUR =====
  else if (state === "PICK_TOUR") {
    var tourId = rid ? rid.replace("TOUR_", "") : "";
    if (!tourId) { await sendText(phone, "Please pick a tour from the list above."); return; }
    var tourInfo = await supabase.from("tours").select("*").eq("id", tourId).single();
    if (!tourInfo.data) { await sendText(phone, "Hmm, can\u2019t find that tour. Let\u2019s try again."); await setConvo(convo.id, { current_state: "IDLE" }); return; }
    var t = tourInfo.data;
    await sendText(phone, "*" + t.name + "* \u{1F6F6}\n\n" + t.description + "\n\n\u23F1 " + t.duration_minutes + " minutes\n\u{1F4B0} R" + t.base_price_per_person + " per person\n\nHow many people will be joining?");
    await setConvo(convo.id, { current_state: "ASK_QTY", state_data: { tour_id: tourId } });
  }

  // ===== MY BOOKINGS LIST =====
  else if (state === "MY_BOOKINGS_LIST") {
    var bookingId = rid ? rid.replace("BK_", "") : "";
    if (!bookingId) { await sendText(phone, "Please select a booking from the list."); return; }
    var bkd = await supabase.from("bookings").select("*, slots(start_time), tours(name)").eq("id", bookingId).single();
    if (!bkd.data) { await sendText(phone, "Can\u2019t find that booking."); await setConvo(convo.id, { current_state: "IDLE" }); return; }
    var bk = bkd.data; var bkref = bk.id.substring(0, 8).toUpperCase();
    var bkslot = (bk as any).slots; var bktour = (bk as any).tours;
    var bkhrs = bkslot ? (new Date(bkslot.start_time).getTime() - Date.now()) / (1000 * 60 * 60) : 0;
    var detail = "*Booking " + bkref + "*\n\n\u{1F6F6} " + (bktour?.name || "Tour") + "\n\u{1F4C5} " + (bkslot ? fmtTime(bkslot.start_time) : "TBC") + "\n\u{1F465} " + bk.qty + " people\n\u{1F4B0} R" + bk.total_amount + "\n\u{1F4CC} " + bk.status + "\n\nWhat would you like to do?";
    var actions: any[] = [];
    if (bk.status === "PAID" && bkhrs >= 24) {
      actions = [{ id: "ACT_CANCEL_" + bk.id, title: "\u274C Cancel" }, { id: "ACT_RESCH_" + bk.id, title: "\u{1F504} Reschedule" }, { id: "ACT_VOUCHER_" + bk.id, title: "\u{1F39F} To Voucher" }];
    } else if (bk.status === "PAID") {
      actions = [{ id: "ACT_CANCEL_" + bk.id, title: "\u274C Cancel (no refund)" }, { id: "IDLE", title: "\u2B05 Back" }];
    } else { actions = [{ id: "ACT_CANCEL_" + bk.id, title: "\u274C Cancel" }, { id: "IDLE", title: "\u2B05 Back" }]; }
    await sendButtons(phone, detail, actions);
    await setConvo(convo.id, { current_state: "BOOKING_ACTIONS", state_data: { booking_id: bk.id, slot_id: bk.slot_id, qty: bk.qty, total: bk.total_amount, hours_before: bkhrs, tour_id: bk.tour_id } });
  }

  // ===== BOOKING ACTIONS =====
  else if (state === "BOOKING_ACTIONS") {
    var action = rid || "";
    if (action.startsWith("ACT_CANCEL_")) {
      if (sd.hours_before >= 24) {
        var rAmt = Math.round(Number(sd.total) * 0.95 * 100) / 100;
        await sendButtons(phone, "Are you sure you want to cancel?\n\nYou\u2019ll get a *95% refund (R" + rAmt + ")*. A small 5% booking fee applies.", [{ id: "CONFIRM_CANCEL", title: "\u2705 Yes, Cancel" }, { id: "IDLE", title: "\u274C Keep It" }]);
      } else {
        await sendButtons(phone, "Are you sure? This booking is within 24 hours, so unfortunately *no refund* is available.", [{ id: "CONFIRM_CANCEL", title: "\u2705 Yes, Cancel" }, { id: "IDLE", title: "\u274C Keep It" }]);
      }
      await setConvo(convo.id, { current_state: "CONFIRM_CANCEL_ACTION" });
    }
    else if (action.startsWith("ACT_RESCH_")) {
      if (sd.hours_before < 24) { await sendText(phone, "Sorry, rescheduling is only available more than 24 hours before your tour."); await setConvo(convo.id, { current_state: "IDLE" }); return; }
      var cbk2 = await supabase.from("bookings").select("reschedule_count").eq("id", sd.booking_id).single();
      if (cbk2.data && cbk2.data.reschedule_count >= 2) { await sendText(phone, "You\u2019ve already rescheduled twice. Let me connect you to our team for help."); await setConvo(convo.id, { current_state: "IDLE", status: "HUMAN" }); return; }
      var rslots = sd.tour_id ? await getAvailSlotsForTour(sd.tour_id, 60) : await getAvailSlots(60);
      var rfitting = rslots.filter(function(s: any) { return s.capacity_total - s.booked - (s.held || 0) >= sd.qty && s.id !== sd.slot_id; });
      if (rfitting.length === 0) { await sendText(phone, "No alternative slots available at the moment. Type *speak to us* and our team can help."); await setConvo(convo.id, { current_state: "IDLE" }); return; }
      var rDateGroups: any = {};
      for (var k = 0; k < rfitting.length; k++) {
        var rs = rfitting[k]; var rsDate = new Date(rs.start_time);
        var rwStart = new Date(rsDate); rwStart.setDate(rwStart.getDate() - rwStart.getDay());
        var rwLabel = rwStart.toLocaleDateString("en-ZA", { day: "numeric", month: "short", timeZone: "Africa/Johannesburg" });
        var rwKey = rwStart.toISOString().split("T")[0];
        if (!rDateGroups[rwKey]) rDateGroups[rwKey] = { label: "Week of " + rwLabel, rows: [] };
        if (rDateGroups[rwKey].rows.length < 10) {
          rDateGroups[rwKey].rows.push({ id: "RSLOT_" + rs.id, title: fmtTime(rs.start_time).substring(0, 24), description: (rs.capacity_total - rs.booked - (rs.held || 0)) + " spots" });
        }
      }
      var rSections: any[] = []; var rKeys = Object.keys(rDateGroups).sort();
      var rTotal = 0;
      for (var rk = 0; rk < rKeys.length && rTotal < 10; rk++) {
        var rg = rDateGroups[rKeys[rk]]; var rRem = 10 - rTotal;
        if (rg.rows.length > rRem) rg.rows = rg.rows.slice(0, rRem);
        rTotal += rg.rows.length; rSections.push({ title: rg.label.substring(0, 24), rows: rg.rows });
      }
      await typingDelay();
      await sendText(phone, "No problem! Pick a new date:");
      await sendList(phone, "Scroll through the weeks to find a time that works:", "View Dates", rSections);
      await setConvo(convo.id, { current_state: "RESCHEDULE_PICK", state_data: { ...sd, reschedule_count: cbk2.data?.reschedule_count || 0 } });
    }
    else if (action.startsWith("ACT_VOUCHER_")) {
      if (sd.hours_before < 24) { await sendText(phone, "Voucher conversion is only available more than 24 hours before the tour."); await setConvo(convo.id, { current_state: "IDLE" }); return; }
      await sendButtons(phone, "Convert this booking to a *gift voucher*?\n\nYou\u2019ll get a voucher code good for *one free trip* on any tour. Valid for 12 months.\n\nYour current seats will be released.", [{ id: "CONFIRM_VOUCHER", title: "\u2705 Yes, Convert" }, { id: "IDLE", title: "\u274C Keep Booking" }]);
      await setConvo(convo.id, { current_state: "CONFIRM_VOUCHER_CONVERT" });
    }
    else { await setConvo(convo.id, { current_state: "IDLE", state_data: {} }); await handleMsg(phone, "hi", "text"); }
  }

  // ===== CONFIRM CANCEL =====
  else if (state === "CONFIRM_CANCEL_ACTION") {
    if (rid === "CONFIRM_CANCEL" || input === "yes") {
      await supabase.from("bookings").update({ status: "CANCELLED", cancelled_at: new Date().toISOString(), cancellation_reason: "Customer cancelled" }).eq("id", sd.booking_id);
      if (sd.slot_id) { var slr = await supabase.from("slots").select("booked").eq("id", sd.slot_id).single(); if (slr.data) await supabase.from("slots").update({ booked: Math.max(0, slr.data.booked - sd.qty) }).eq("id", sd.slot_id); }
      if (sd.hours_before >= 24) {
        var refAmt = Math.round(Number(sd.total) * 0.95 * 100) / 100;
        await supabase.from("bookings").update({ refund_status: "REQUESTED", refund_amount: refAmt, refund_notes: "95% refund" }).eq("id", sd.booking_id);
        await logE("refund_requested", { booking_id: sd.booking_id, amount: refAmt }, sd.booking_id);
        await sendText(phone, "Done! Your booking has been cancelled.\n\nA refund of *R" + refAmt + "* has been submitted \u2014 expect it within 5\u20137 business days.\n\nWe\u2019d love to have you back on the water soon! \u{1F6F6}");
      } else {
        await logE("booking_cancelled_no_refund", { booking_id: sd.booking_id }, sd.booking_id);
        await sendText(phone, "Your booking has been cancelled.\n\nAs it was within 24 hours, no refund is available per our policy.\n\nHope to see you again! \u{1F6F6}");
      }
      // Send cancellation email
      try {
        var cbkData = await supabase.from("bookings").select("*, slots(start_time), tours(name)").eq("id", sd.booking_id).single();
        if (cbkData.data && cbkData.data.email) {
          await fetch(SUPABASE_URL + "/functions/v1/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + SUPABASE_KEY },
            body: JSON.stringify({ type: "CANCELLATION", data: { email: cbkData.data.email, customer_name: cbkData.data.customer_name, ref: sd.booking_id.substring(0, 8).toUpperCase(), tour_name: (cbkData.data as any).tours?.name || "Tour", start_time: (cbkData.data as any).slots?.start_time ? fmtTime((cbkData.data as any).slots.start_time) : "", refund_amount: sd.hours_before >= 24 ? refAmt : null } }),
          });
        }
      } catch(e) { console.log("cancel email err"); }
      await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
    } else { await sendText(phone, "Great, your booking is safe! \u{1F389}"); await setConvo(convo.id, { current_state: "IDLE", state_data: {} }); }
  }

  // ===== CONFIRM VOUCHER =====
  else if (state === "CONFIRM_VOUCHER_CONVERT") {
    if (rid === "CONFIRM_VOUCHER" || input === "yes") {
      var vcode = genVoucherCode();
      var vr = await supabase.from("vouchers").insert({ business_id: BUSINESS_ID, code: vcode, status: "ACTIVE", type: "FREE_TRIP", source_booking_id: sd.booking_id, expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() }).select().single();
      if (vr.error) { await sendText(phone, "Something went wrong. Let me connect you to our team."); await setConvo(convo.id, { current_state: "IDLE", status: "HUMAN" }); return; }
      await supabase.from("bookings").update({ status: "CANCELLED", cancelled_at: new Date().toISOString(), cancellation_reason: "Converted to voucher " + vcode, converted_to_voucher_id: vr.data.id }).eq("id", sd.booking_id);
      if (sd.slot_id) { var svr = await supabase.from("slots").select("booked").eq("id", sd.slot_id).single(); if (svr.data) await supabase.from("slots").update({ booked: Math.max(0, svr.data.booked - sd.qty) }).eq("id", sd.slot_id); }
      await logE("voucher_from_booking", { booking_id: sd.booking_id, code: vcode }, sd.booking_id);
      // Email voucher to customer
      try {
        var vEmail = await supabase.from("bookings").select("email").eq("id", sd.booking_id).single();
        if (vEmail.data && vEmail.data.email) {
          await fetch(SUPABASE_URL + "/functions/v1/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + SUPABASE_KEY },
            body: JSON.stringify({ type: "VOUCHER", data: { email: vEmail.data.email, code: vcode, expires_at: fmtTime(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()) } }),
          });
        }
      } catch(e) { console.log("voucher email err"); }
      await sendText(phone, "All done! Here\u2019s your voucher:\n\n\u{1F39F} Code: *" + vcode + "*\n\u{1F381} Good for: *One free trip* (any tour, any group size)\n\u{1F4C5} Valid until: " + fmtTime(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()) + "\n\nShare it with a friend or use it yourself \u2014 just type *menu* and select *Redeem Voucher* when you\u2019re ready!");
      await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
    } else { await sendText(phone, "No worries, your booking stays as is! \u{1F389}"); await setConvo(convo.id, { current_state: "IDLE", state_data: {} }); }
  }

  // ===== FAQ LIST =====
  else if (state === "FAQ_LIST") {
    var faqMap: any = { FAQ_MEET: "meeting_point", FAQ_BRING: "what_to_bring", FAQ_CANCEL: "cancellation", FAQ_DURATION: "duration", FAQ_SAFE: "safety", FAQ_WEATHER: "weather", FAQ_PRICE: "pricing", FAQ_AGE: "age", FAQ_PARKING: "parking", FAQ_EXPECT: "what_to_expect" };
    var key = faqMap[rid];
    if (key && FAQ_ANSWERS[key]) {
      await sendText(phone, FAQ_ANSWERS[key]);
      await sendText(phone, "Anything else? Just ask, or:");
      await sendButtons(phone, "Quick actions:", [{ id: "BOOK", title: "\u{1F6F6} Book a Tour" }, { id: "FAQ_LIST", title: "\u2753 More Questions" }, { id: "IDLE", title: "\u2B05 Main Menu" }]);
      await setConvo(convo.id, { current_state: "MENU" });
    } else {
      // Try natural language match even in FAQ state
      var fk = matchFAQ(input);
      if (fk) {
        await sendText(phone, FAQ_ANSWERS[fk]);
        await sendButtons(phone, "Anything else?", [{ id: "BOOK", title: "\u{1F6F6} Book a Tour" }, { id: "FAQ_LIST", title: "\u2753 More Questions" }, { id: "IDLE", title: "\u2B05 Main Menu" }]);
        await setConvo(convo.id, { current_state: "MENU" });
      } else {
        await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
        await handleMsg(phone, "hi", "text");
      }
    }
  }

  // ===== ASK QTY =====
  else if (state === "ASK_QTY") {
    var qty = parseInt(input);
    if (isNaN(qty) || qty < 1 || qty > 30) { await sendText(phone, "Just need a number between 1 and 30 \u{1F60A}"); return; }
    var tourSlots = sd.tour_id ? await getAvailSlotsForTour(sd.tour_id, 60) : await getAvailSlots(60);
    var fitting = tourSlots.filter(function(s: any) { return s.capacity_total - s.booked - (s.held || 0) >= qty; });
    if (fitting.length === 0) {
      await sendText(phone, "Ah, those dates are fully booked for " + qty + " people. Want me to add you to the waitlist? I\u2019ll message you as soon as a spot opens up!");
      await sendButtons(phone, "Options:", [{ id: "WAITLIST_YES", title: "\u{1F4CB} Join Waitlist" }, { id: "BOOK", title: "\u{1F6F6} Try Another" }, { id: "IDLE", title: "\u2B05 Back" }]);
      await setConvo(convo.id, { current_state: "WAITLIST_OFFER", state_data: { ...sd, qty: qty } }); return;
    }
    // Group slots by DATE for compact display
    var dateMap: any = {};
    for (var j = 0; j < fitting.length; j++) {
      var sl = fitting[j];
      var dk = new Date(sl.start_time).toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short", timeZone: "Africa/Johannesburg" });
      var diso = new Date(sl.start_time).toLocaleDateString("en-CA", { timeZone: "Africa/Johannesburg" });
      if (!dateMap[diso]) dateMap[diso] = { label: dk, count: 0, totalSpots: 0, slots: [] };
      var davl = sl.capacity_total - sl.booked - (sl.held || 0);
      dateMap[diso].count++;
      dateMap[diso].totalSpots += davl;
      dateMap[diso].slots.push(sl);
    }
    var dateKeys = Object.keys(dateMap).sort();
    var dateRows: any[] = [];
    for (var di = 0; di < Math.min(dateKeys.length, 10); di++) {
      var dd = dateMap[dateKeys[di]];
      dateRows.push({ id: "DATE_" + dateKeys[di], title: dd.label, description: dd.count + (dd.count === 1 ? " slot" : " slots") + " \u2022 " + dd.totalSpots + " spots open" });
    }
    var hasMore = dateKeys.length > 10;
    await typingDelay();
    await sendText(phone, qty + " " + (qty === 1 ? "person" : "people") + " \u2014 nice! Pick a date \ud83d\udcc5" + (hasMore ? "\n\n(Showing next 10 days with availability)" : ""));
    await typingDelay();
    await sendList(phone, "Which date works for you?", "Pick a Date", [{ title: "Available Dates", rows: dateRows }]);
    await setConvo(convo.id, { current_state: "PICK_DATE", state_data: { ...sd, qty: qty, fitting: fitting.map(function(s: any) { return { id: s.id, start_time: s.start_time, capacity_total: s.capacity_total, booked: s.booked, held: s.held || 0, is_peak: s.is_peak, price_per_person_override: s.price_per_person_override }; }) } });
  }

  // ===== PICK DATE (new step) =====
  else if (state === "PICK_DATE") {
    var pickedDate = rid ? rid.replace("DATE_", "") : "";
    if (!pickedDate) { await sendText(phone, "Please pick a date from the list."); return; }
    // Filter slots for this date
    var daySlots = (sd.fitting || []).filter(function(s: any) {
      return new Date(s.start_time).toLocaleDateString("en-CA", { timeZone: "Africa/Johannesburg" }) === pickedDate;
    });
    if (daySlots.length === 0) { await sendText(phone, "No slots found for that date. Try again."); return; }
    // If only 1 slot, auto-select
    if (daySlots.length === 1) {
      var autoSlot = daySlots[0];
      var autoAvl = autoSlot.capacity_total - autoSlot.booked - (autoSlot.held || 0);
      var autoPri = autoSlot.price_per_person_override || sd.unit_price;
      var autoTimeStr = new Date(autoSlot.start_time).toLocaleString("en-ZA", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Johannesburg" });
      await typingDelay();
      await sendText(phone, autoTimeStr + " \u2014 great pick! \ud83c\udf1f\n\n" + autoAvl + " spots available \u2022 R" + autoPri + "/pp");
      await setConvo(convo.id, { current_state: "ASK_NAME_EMAIL", state_data: { ...sd, slot_id: autoSlot.id, slot_time: autoSlot.start_time, unit_price: autoPri } });
      await typingDelay();
      await sendText(phone, "Brilliant! Just need your details \ud83d\udcdd\n\nPlease send your *full name* and *email address*, e.g.:\n\nJohn Smith\njohn@email.com");
      return;
    }
    // Multiple slots — show time picker
    var timeRows: any[] = [];
    for (var ti = 0; ti < daySlots.length; ti++) {
      var ts = daySlots[ti];
      var tavl = ts.capacity_total - ts.booked - (ts.held || 0);
      var tpri = ts.price_per_person_override || sd.unit_price;
      var ttime = new Date(ts.start_time).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Johannesburg" });
      timeRows.push({ id: "SLOT_" + ts.id, title: ttime, description: tavl + " spots \u2022 R" + tpri + "/pp" });
    }
    var dateLbl = new Date(pickedDate + "T12:00:00").toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Johannesburg" });
    await typingDelay();
    await sendList(phone, dateLbl + " \u2014 pick a time:", "Pick Time", [{ title: "Available Times", rows: timeRows }]);
    await setConvo(convo.id, { current_state: "PICK_SLOT", state_data: sd });
    return;
  }

  // ===== PICK SLOT =====
  else if (state === "PICK_SLOT") {
    var slotId = rid ? rid.replace("SLOT_", "") : "";
    if (!slotId) { await sendText(phone, "Please pick a slot from the list."); return; }
    var sr2 = await supabase.from("slots").select("*").eq("id", slotId).single();
    var slot = sr2.data;
    if (!slot) { await sendText(phone, "That slot is no longer available. Let\u2019s try again."); await setConvo(convo.id, { current_state: "IDLE" }); return; }
    var price = await getSlotPrice(slot);
    var baseTotal = price * sd.qty;
    var disc = await calcDiscount(sd.qty, phone);
    var finalTotal = baseTotal; var discountMsg = "";
    if (disc.percent > 0) {
      var saving = Math.round(baseTotal * disc.percent / 100); finalTotal = baseTotal - saving;
      if (disc.type === "GROUP") discountMsg = "\n\u{1F389} *5% group discount applied!* You save R" + saving;
      if (disc.type === "LOYALTY") discountMsg = "\n\u{1F31F} *10% loyalty discount!* You save R" + saving;
    }
    // Check if voucher booking — subtract voucher value from total
    var voucherDeduction = 0;
    if (sd.voucher_id) {
      var voucherValue = Number(sd.voucher_value || 0);
      voucherDeduction = Math.min(voucherValue, finalTotal);
      finalTotal = Math.max(0, finalTotal - voucherDeduction);
      if (finalTotal === 0) {
        discountMsg = "\n\u{1F39F} *Voucher applied \u2014 this trip is on us!*";
      } else {
        discountMsg = "\n\u{1F39F} *Voucher applied \u2014 R" + voucherDeduction + " off!*";
      }
    }
    var tourName2 = await supabase.from("tours").select("name").eq("id", slot.tour_id).single();
    var summary = "Here\u2019s your booking summary:\n\n\u{1F6F6} *" + (tourName2.data?.name || "Tour") + "*\n\u{1F4C5} " + fmtTime(slot.start_time) + "\n\u{1F465} " + sd.qty + " " + (sd.qty === 1 ? "person" : "people") + "\n\u{1F4B0} R" + price + " \u00D7 " + sd.qty + " = R" + baseTotal;
    if (sd.voucher_id && finalTotal === 0) summary += discountMsg + "\n*Total: FREE*";
    else if (sd.voucher_id && finalTotal > 0) summary += discountMsg + "\n*Remaining: R" + finalTotal + "*";
    else if (disc.percent > 0) summary += discountMsg + "\n*Total: R" + finalTotal + "*";
    else summary += "\n*Total: R" + finalTotal + "*";
    summary += "\n\nLook good?";
    var confirmBtns = [{ id: "CONFIRM", title: finalTotal > 0 ? "\u2705 Pay R" + finalTotal : "\u2705 Confirm (FREE)" }, { id: "IDLE", title: "\u274C Cancel" }];
    if (finalTotal > 0) confirmBtns.splice(1, 0, { id: "ADD_VOUCHER", title: "\u{1F39F} Add Voucher" });
    await sendButtons(phone, summary, confirmBtns);
    await setConvo(convo.id, { current_state: "CONFIRM_BOOKING", state_data: { ...sd, slot_id: slotId, tour_id: slot.tour_id, unit_price: price, base_total: baseTotal, total: finalTotal, discount_type: disc.type, discount_percent: disc.percent, voucher_deduction: voucherDeduction || 0 } });
  }

  // ===== CONFIRM BOOKING =====
  else if (state === "CONFIRM_BOOKING") {
    if (rid === "IDLE" || input === "no" || input === "cancel") { await sendText(phone, "No worries, cancelled! Type *menu* whenever you\u2019re ready."); await setConvo(convo.id, { current_state: "IDLE", state_data: {} }); return; }
    if (rid === "ADD_VOUCHER") {
      await sendText(phone, "Enter your voucher code:");
      await setConvo(convo.id, { current_state: "ADD_EXTRA_VOUCHER" });
      return;
    }
    if (rid === "CONFIRM" || input === "yes") {
      await typingDelay();
      await sendText(phone, "Brilliant! Just need a couple of details.\n\nWhat\u2019s your full name?");
      await setConvo(convo.id, { current_state: "ASK_NAME" });
    }
  }

  // ===== ASK NAME =====
  else if (state === "ASK_NAME") {
    if (rawText.length < 2) { await sendText(phone, "Please type your full name:"); return; }
    await setConvo(convo.id, { current_state: "ASK_EMAIL", state_data: { ...sd, customer_name: rawText } });
    await typingDelay();
    await sendText(phone, "Thanks " + rawText.split(" ")[0] + "! And your email address? (We\u2019ll send your confirmation there)");
  }

  // ===== ASK EMAIL =====
  else if (state === "ASK_EMAIL") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawText)) { await sendText(phone, "Hmm, that doesn\u2019t look like a valid email. Try again?"); return; }
    var email = rawText.toLowerCase();
    var br2 = await supabase.from("bookings").insert({
      business_id: BUSINESS_ID, tour_id: sd.tour_id, slot_id: sd.slot_id,
      customer_name: sd.customer_name, phone: phone, email: email,
      qty: sd.qty, unit_price: sd.unit_price, total_amount: sd.total,
      original_total: sd.base_total, discount_type: sd.discount_type || null, discount_percent: sd.discount_percent || 0,
      status: "PENDING", source: "WHATSAPP",
    }).select().single();
    if (br2.error || !br2.data) { console.error("Err:", JSON.stringify(br2.error)); await sendText(phone, "Something went wrong. Let me connect you to our team."); await setConvo(convo.id, { current_state: "IDLE", status: "HUMAN" }); return; }
    var booking = br2.data;

    // VOUCHER BOOKING — skip payment
    if (sd.voucher_id && sd.total <= 0) {
      await supabase.from("bookings").update({ status: "PAID", yoco_payment_id: "VOUCHER_" + sd.voucher_code }).eq("id", booking.id);
      // Mark voucher as used
      // Redeem all vouchers
      var allVIds = sd.voucher_ids || [sd.voucher_id];
      for (var vi = 0; vi < allVIds.length; vi++) {
        if (allVIds[vi]) await supabase.from("vouchers").update({ status: "REDEEMED", redeemed_at: new Date().toISOString(), redeemed_by_phone: phone, redeemed_booking_id: booking.id }).eq("id", allVIds[vi]);
      }
      // Update slot booked count
      var svr2 = await supabase.from("slots").select("booked").eq("id", sd.slot_id).single();
      if (svr2.data) await supabase.from("slots").update({ booked: svr2.data.booked + sd.qty }).eq("id", sd.slot_id);
      var vref = booking.id.substring(0, 8).toUpperCase();
      var vslot = await supabase.from("slots").select("start_time").eq("id", sd.slot_id).single();
      var vtour = await supabase.from("tours").select("name").eq("id", sd.tour_id).single();
      await logE("voucher_booking_confirmed", { booking_id: booking.id, voucher_code: sd.voucher_code }, booking.id);
      // Upsell second trip
      var otherTours2 = (await getActiveTours()).filter(function(t: any) { return t.id !== sd.tour_id; });
      if (otherTours2.length > 0) {
        var upsellTour = otherTours2[0];
        setTimeout(async function() {
          try {
            await sendText(phone, "\u{1F4A1} Psst! How about adding a *" + upsellTour.name + "* to your trip? Book both and enjoy even more of Cape Town\u2019s coastline!\n\nJust type *book* to add another tour.");
          } catch(e) {}
        }, 5000);
      }
      await sendText(phone,
        "\u{1F389} *You\u2019re all set!*\n\n" +
        "\u{1F4CB} Ref: " + vref + "\n" +
        "\u{1F6F6} " + (vtour.data?.name || "Tour") + "\n" +
        "\u{1F4C5} " + (vslot.data ? fmtTime(vslot.data.start_time) : "TBC") + "\n" +
        "\u{1F465} " + sd.qty + " people\n" +
        "\u{1F39F} Paid with voucher *" + sd.voucher_code + "*\n\n" +
        "\u{1F4CD} *Meeting Point:*\nThree Anchor Bay, Beach Road, Sea Point\nArrive 15 min early\n\n" +
        "\u{1F5FA} " + MAPS_URL + "\n\n" +
        "\u{1F392} *Bring:* Sunscreen, hat, towel, water bottle\n\n" +
        "See you on the water! \u{1F30A}"
      );
      // Send confirmation email
      try {
        await fetch(SUPABASE_URL + "/functions/v1/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + SUPABASE_KEY },
          body: JSON.stringify({ type: "BOOKING_CONFIRM", data: { email: email, customer_name: sd.customer_name, ref: vref, tour_name: vtour.data?.name || "Tour", start_time: vslot.data ? fmtTime(vslot.data.start_time) : "TBC", qty: sd.qty, total_amount: "FREE (voucher)" } }),
        });
      } catch(e) {}
      await setConvo(convo.id, { current_state: "IDLE", state_data: {}, last_booking_id: booking.id, customer_name: sd.customer_name, email: email });
      return;
    }

    // PAID BOOKING — create hold + Yoco checkout
    var hr2 = await supabase.from("holds").insert({ booking_id: booking.id, slot_id: sd.slot_id, expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), status: "ACTIVE" }).select().single();
    if (hr2.error) { await supabase.from("bookings").update({ status: "CANCELLED", cancellation_reason: "Hold failed" }).eq("id", booking.id); await sendText(phone, "Those spots were just snapped up! Let\u2019s try again."); await setConvo(convo.id, { current_state: "IDLE", state_data: {} }); return; }
    try { var sn = await supabase.from("slots").select("held").eq("id", sd.slot_id).single(); await supabase.from("slots").update({ held: Number(sn.data?.held || 0) + sd.qty }).eq("id", sd.slot_id); } catch(e) {}
    await supabase.from("bookings").update({ status: "HELD" }).eq("id", booking.id);
    await logE("hold_created", { booking_id: booking.id }, booking.id);

    console.log("YOCO_CALL: key_len=" + YOCO_SECRET.length + " amount=" + Math.round(sd.total * 100)); var yocoRes = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST", headers: { Authorization: "Bearer " + YOCO_SECRET, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(sd.total * 100), currency: "ZAR",
        successUrl: "https://book.capekayak.co.za/success?ref=" + booking.id,
        cancelUrl: "https://book.capekayak.co.za/cancelled",
        failureUrl: "https://book.capekayak.co.za/cancelled",
        metadata: { booking_id: booking.id, customer_name: sd.customer_name, qty: String(sd.qty) },
      }),
    });
    var yocoData = await yocoRes.json();
    console.log("YOCO:" + JSON.stringify(yocoData));
    var payUrl = "";
    if (yocoData && yocoData.id && yocoData.redirectUrl) {
      await supabase.from("bookings").update({ yoco_checkout_id: yocoData.id }).eq("id", booking.id);
      payUrl = yocoData.redirectUrl;
    } else { payUrl = "Payment link unavailable \u2014 type *speak to us* for help"; }
    var ref = booking.id.substring(0, 8).toUpperCase();
    await sendText(phone, "Almost there, " + sd.customer_name.split(" ")[0] + "! \u{1F389}\n\n\u{1F4CB} Ref: " + ref + "\n\u{1F4B0} Total: R" + sd.total + "\n\nComplete your payment here:\n" + payUrl + "\n\n\u23F0 Your spots are held for 15 minutes.");
    await setConvo(convo.id, { current_state: "AWAITING_PAYMENT", state_data: { booking_id: booking.id }, last_booking_id: booking.id, customer_name: sd.customer_name, email: email });
    await logE("payment_link_sent", { booking_id: booking.id }, booking.id);
  }

  // ===== AWAITING PAYMENT =====
  else if (state === "AWAITING_PAYMENT") {
    if (input === "help" || input === "speak" || input === "human" || input.includes("speak to")) { await sendText(phone, "Connecting you to our team..."); await setConvo(convo.id, { status: "HUMAN" }); }
    else { await sendText(phone, "Just waiting for your payment to come through! \u{1F4B3}\n\nAlready paid? It can take a moment to process.\n\nNeed help? Type *speak to us*\nStart over? Type *menu*"); }
  }

  // ===== REDEEM VOUCHER =====

  // ===== GIFT VOUCHER PURCHASE =====
  else if (state === "GV_PICK_TOUR") {
    var tourId = rid ? rid.replace("GV_", "") : "";
    if (!tourId) { await sendText(phone, "Please pick a tour from the list."); return; }
    var tourInfo = await supabase.from("tours").select("*").eq("id", tourId).single();
    if (!tourInfo.data) { await sendText(phone, "Can't find that tour. Let's try again."); await setConvo(convo.id, { current_state: "IDLE" }); return; }
    var t = tourInfo.data;
    await sendText(phone, "\u{1F381} *" + t.name + " Gift Voucher*\nValue: R" + t.base_price_per_person + "\n\nWho is this voucher for? Type their name (e.g. Sarah):");
    await setConvo(convo.id, { current_state: "GV_RECIPIENT_NAME", state_data: { tour_id: tourId, tour_name: t.name, value: t.base_price_per_person } });
  }

  else if (state === "GV_RECIPIENT_NAME") {
    if (rawText.length < 1) { await sendText(phone, "Please type the recipient's name:"); return; }
    await sendText(phone, "Nice! And would you like to add a personal message?\n\nType your message (e.g. \"Happy Birthday! Enjoy the adventure!\")\n\nOr type *skip* to skip:");
    await setConvo(convo.id, { current_state: "GV_MESSAGE", state_data: { ...sd, recipient_name: rawText } });
  }

  else if (state === "GV_MESSAGE") {
    var giftMsg = (input === "skip" || input === "no") ? "" : rawText;
    await sendText(phone, "Almost done! I just need your details.\n\nWhat's your full name?");
    await setConvo(convo.id, { current_state: "GV_BUYER_NAME", state_data: { ...sd, gift_message: giftMsg } });
  }

  else if (state === "GV_BUYER_NAME") {
    if (rawText.length < 2) { await sendText(phone, "Please type your full name:"); return; }
    await sendText(phone, "Thanks " + rawText.split(" ")[0] + "! And your email address? (We'll send the voucher here)");
    await setConvo(convo.id, { current_state: "GV_BUYER_EMAIL", state_data: { ...sd, buyer_name: rawText } });
  }

  else if (state === "GV_BUYER_EMAIL") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawText)) { await sendText(phone, "That doesn't look like a valid email. Try again?"); return; }
    var buyerEmail = rawText.toLowerCase();
    var summary = "\u{1F381} *Gift Voucher Summary*\n\n" +
      "\u{1F6F6} " + sd.tour_name + "\n" +
      "\u{1F4B0} R" + sd.value + "\n" +
      "\u{1F465} For: " + sd.recipient_name + "\n";
    if (sd.gift_message) summary += "\u{1F4AC} Message: \"" + sd.gift_message + "\"\n";
    summary += "\u{1F4E7} Send to: " + buyerEmail + "\n\nLook good?";
    await sendButtons(phone, summary, [{ id: "GV_CONFIRM", title: "\u2705 Pay R" + sd.value }, { id: "IDLE", title: "\u274C Cancel" }]);
    await setConvo(convo.id, { current_state: "GV_CONFIRM", state_data: { ...sd, buyer_email: buyerEmail } });
  }

  else if (state === "GV_CONFIRM") {
    if (rid === "IDLE" || input === "no" || input === "cancel") {
      await sendText(phone, "No worries, cancelled! Type *menu* whenever you're ready.");
      await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
      return;
    }
    if (rid === "GV_CONFIRM" || input === "yes") {
      // Create voucher in PENDING status
      var vcode = genVoucherCode();
      var vr = await supabase.from("vouchers").insert({
        business_id: BUSINESS_ID, code: vcode, status: "PENDING", type: "FREE_TRIP",
        recipient_name: sd.recipient_name, gift_message: sd.gift_message || null,
        buyer_name: sd.buyer_name, buyer_email: sd.buyer_email, buyer_phone: phone,
        tour_name: sd.tour_name, value: sd.value, purchase_amount: sd.value,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }).select().single();

      if (vr.error || !vr.data) {
        console.error("GV_ERR:", JSON.stringify(vr.error));
        await sendText(phone, "Something went wrong. Let me connect you to our team.");
        await setConvo(convo.id, { current_state: "IDLE", status: "HUMAN" });
        return;
      }

      // Create Yoco checkout
      // Uses global YOCO_SECRET
      var yocoRes = await fetch("https://payments.yoco.com/api/checkouts", {
        method: "POST",
        headers: { Authorization: "Bearer " + YOCO_SECRET, "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(Number(sd.value) * 100), currency: "ZAR",
          successUrl: "https://book.capekayak.co.za/voucher-confirmed?code=" + vcode,
          cancelUrl: "https://book.capekayak.co.za/cancelled",
          failureUrl: "https://book.capekayak.co.za/cancelled",
          metadata: { voucher_id: vr.data.id, voucher_code: vcode, type: "GIFT_VOUCHER" },
        }),
      });
      var yocoData = await yocoRes.json();
      console.log("YOCO_GV:" + JSON.stringify(yocoData));

      if (yocoData && yocoData.id && yocoData.redirectUrl) {
        await supabase.from("vouchers").update({ yoco_checkout_id: yocoData.id }).eq("id", vr.data.id);
        await sendText(phone,
          "\u{1F381} Great! Complete your payment to generate the voucher:\n\n" +
          "\u{1F4B0} Amount: R" + sd.value + "\n" +
          "\u{1F517} " + yocoData.redirectUrl + "\n\n" +
          "Once paid, the voucher will be emailed to " + sd.buyer_email
        );
      } else {
        await sendText(phone, "Payment link unavailable. Type *speak to us* for help.");
      }
      await setConvo(convo.id, { current_state: "GV_AWAITING_PAYMENT", state_data: { voucher_id: vr.data.id, voucher_code: vcode, buyer_email: sd.buyer_email } });
    }
  }

  else if (state === "GV_AWAITING_PAYMENT") {
    if (input === "help" || input.includes("speak to")) {
      await sendText(phone, "Connecting you to our team...");
      await setConvo(convo.id, { status: "HUMAN" });
    } else {
      await sendText(phone, "Just waiting for your payment to come through!\n\nAlready paid? It can take a moment to process.\n\nNeed help? Type *speak to us*\nStart over? Type *menu*");
    }
  }


    else if (state === "REDEEM_VOUCHER") {
    var code = rawText.toUpperCase().replace(/\s/g, "");
    if (code.length !== 8) { await sendText(phone, "Voucher codes are 8 characters long. Double-check and try again:"); return; }
    var vr2 = await supabase.from("vouchers").select().eq("code", code).eq("status", "ACTIVE").single();
    if (!vr2.data) {
      // Check if redeemed
      var vUsed = await supabase.from("vouchers").select("status").eq("code", code).single();
      if (vUsed.data && vUsed.data.status === "REDEEMED") {
        await sendText(phone, "This voucher has already been redeemed. Each voucher code can only be used once.");
        await sendButtons(phone, "Options:", [{ id: "ADD_VOUCHER", title: "\u{1F39F} Try Another" }, { id: "CONFIRM", title: "\u2705 Continue" }, { id: "IDLE", title: "\u2B05 Back" }]);
        await setConvo(convo.id, { current_state: "CONFIRM_BOOKING" }); return;
      }
      await sendText(phone, "Hmm, that code doesn\u2019t seem to be valid. Check for typos and try again, or type *speak to us* for help.");
      await sendButtons(phone, "Options:", [{ id: "VOUCHER", title: "\u{1F39F} Try Again" }, { id: "HUMAN", title: "\u{1F4AC} Get Help" }, { id: "IDLE", title: "\u2B05 Back" }]);
      await setConvo(convo.id, { current_state: "MENU" }); return;
    }
    if (vr2.data.expires_at && new Date(vr2.data.expires_at) < new Date()) { await sendText(phone, "Unfortunately this voucher has expired. Type *speak to us* if you think this is a mistake."); await setConvo(convo.id, { current_state: "IDLE" }); return; }

    // Get voucher value
    var vVal = Number(vr2.data.value || vr2.data.purchase_amount || 0);
    var tours3 = await getActiveTours();
    if (tours3.length === 1) {
      await sendText(phone, "\u{1F389} Voucher accepted! (R" + vVal + " credit)\n\nHow many people will be joining?");
      await setConvo(convo.id, { current_state: "ASK_QTY", state_data: { voucher_code: code, voucher_id: vr2.data.id, voucher_value: vVal, tour_id: tours3[0].id } });
    } else {
      var vtrows: any[] = [];
      for (var vti = 0; vti < tours3.length; vti++) {
        var vtr = tours3[vti];
        vtrows.push({ id: "TOUR_" + vtr.id, title: vtr.name, description: vtr.duration_minutes + " min \u2022 normally R" + vtr.base_price_per_person + "/pp" });
      }
      await sendText(phone, "\u{1F389} Voucher accepted! (R" + vVal + " credit)\n\nWhich tour would you like?");
      await sendList(phone, "Pick your adventure:", "Choose Tour", [{ title: "Tours", rows: vtrows }]);
      await setConvo(convo.id, { current_state: "PICK_TOUR", state_data: { voucher_code: code, voucher_id: vr2.data.id, voucher_value: vVal } });
    }
  }


  // ===== ADD EXTRA VOUCHER =====
  else if (state === "ADD_EXTRA_VOUCHER") {
    var xcode = rawText.toUpperCase().replace(/\s/g, "");
    if (xcode.length !== 8) { await sendText(phone, "Voucher codes are 8 characters long. Try again:"); return; }
    var xvr = await supabase.from("vouchers").select().eq("code", xcode).eq("status", "ACTIVE").single();
    if (!xvr.data) {
      var xUsed = await supabase.from("vouchers").select("status").eq("code", xcode).single();
      if (xUsed.data && xUsed.data.status === "REDEEMED") {
        await sendText(phone, "This voucher has already been redeemed. Each code can only be used once.");
      } else {
        await sendText(phone, "That code doesn\u2019t seem valid. Check for typos and try again.");
      }
      await sendButtons(phone, "Options:", [{ id: "ADD_VOUCHER", title: "\u{1F39F} Try Again" }, { id: "CONFIRM", title: "\u2705 Continue" }, { id: "IDLE", title: "\u274C Cancel" }]);
      await setConvo(convo.id, { current_state: "CONFIRM_BOOKING" });
      return;
    }
    if (xvr.data.expires_at && new Date(xvr.data.expires_at) < new Date()) {
      await sendText(phone, "This voucher has expired.");
      await setConvo(convo.id, { current_state: "CONFIRM_BOOKING" });
      return;
    }
    // Stack the voucher value
    var xVal = Number(xvr.data.value || xvr.data.purchase_amount || 0);
    var existingVoucherValue = Number(sd.voucher_value || 0);
    var newVoucherValue = existingVoucherValue + xVal;
    // Store multiple voucher codes and IDs
    var vCodes = (sd.voucher_codes || [sd.voucher_code].filter(Boolean));
    vCodes.push(xcode);
    var vIds = (sd.voucher_ids || [sd.voucher_id].filter(Boolean));
    vIds.push(xvr.data.id);
    // Recalculate total
    var newDeduction = Math.min(newVoucherValue, Number(sd.base_total));
    var newTotal = Math.max(0, Number(sd.base_total) - newDeduction);
    // Apply any other discounts too
    if (sd.discount_percent > 0 && !sd.voucher_id) {
      var discSaving = Math.round(Number(sd.base_total) * sd.discount_percent / 100);
      newTotal = Math.max(0, newTotal - discSaving);
    }
    var xMsg = "\u{1F39F} *Second voucher applied!* (R" + xVal + " credit)\n\n";
    if (newTotal === 0) xMsg += "Your trip is now *completely FREE!*";
    else xMsg += "Remaining balance: *R" + newTotal + "*";
    await sendText(phone, xMsg);
    var updatedSd = { ...sd, voucher_value: newVoucherValue, voucher_codes: vCodes, voucher_ids: vIds, voucher_deduction: newDeduction, total: newTotal };
    var cBtns = [{ id: "CONFIRM", title: newTotal > 0 ? "\u2705 Pay R" + newTotal : "\u2705 Confirm (FREE)" }, { id: "IDLE", title: "\u274C Cancel" }];
    if (newTotal > 0) cBtns.splice(1, 0, { id: "ADD_VOUCHER", title: "\u{1F39F} Add Voucher" });
    await sendButtons(phone, "Ready to proceed?", cBtns);
    await setConvo(convo.id, { current_state: "CONFIRM_BOOKING", state_data: updatedSd });
  }

  // ===== RESCHEDULE PICK =====
  else if (state === "RESCHEDULE_PICK") {
    var nsid = rid ? rid.replace("RSLOT_", "") : "";
    if (!nsid) { await sendText(phone, "Please pick a slot from the list."); return; }
    await supabase.from("bookings").update({ slot_id: nsid, reschedule_count: (sd.reschedule_count || 0) + 1 }).eq("id", sd.booking_id);
    if (sd.old_slot_id || sd.slot_id) {
      var oldSid = sd.old_slot_id || sd.slot_id;
      var osr = await supabase.from("slots").select("booked").eq("id", oldSid).single();
      if (osr.data) await supabase.from("slots").update({ booked: Math.max(0, osr.data.booked - sd.qty) }).eq("id", oldSid);
    }
    var nsr = await supabase.from("slots").select("booked").eq("id", nsid).single();
    if (nsr.data) await supabase.from("slots").update({ booked: nsr.data.booked + sd.qty }).eq("id", nsid);
    var nsd = await supabase.from("slots").select("start_time").eq("id", nsid).single();
    await logE("rescheduled", { booking_id: sd.booking_id, new_slot: nsid }, sd.booking_id);
    await sendText(phone, "All sorted! \u2705\n\nYour new time: *" + fmtTime(nsd.data?.start_time) + "*\n\nSee you then! \u{1F30A}");
    await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
  }

  // ===== ASK MODE =====
  else if (state === "ASK_MODE") {
    // Smart context-aware answering with database lookups
    await typingDelay();
    
    // PRIORITY 1: Check booking-related intents first (before FAQ!)
    var wantReschedule = input.includes("reschedule") || input.includes("move") && (input.includes("booking") || input.includes("trip")) || (input.includes("change") && (input.includes("date") || input.includes("time") || input.includes("booking") || input.includes("day")));
    var wantCancel = (input.includes("cancel") && !input.includes("cancellation") && !input.includes("policy")) || (input.includes("refund") && input.includes("my"));
    var wantMyBooking = input.includes("my booking") || input.includes("my trip") || input.includes("my tour") || (input.includes("booking") && (input.includes("today") || input.includes("made") || input.includes("check") || input.includes("status") || input.includes("when") || input.includes("detail") || input.includes("info"))) || (input.includes("when") && (input.includes("my") || input.includes("trip") || input.includes("tour") || input.includes("paddle"))) || (input.includes("what time") && input.includes("my")) || (input.includes("how many") && input.includes("my")) || (input.includes("ref") && (input.includes("my") || input.includes("booking")));
    var wantBook = input.includes("book") && (input.includes("want") || input.includes("like") || input.includes("can i"));
    var wantAddPeople = (input.includes("add") || input.includes("more") || input.includes("extra")) && (input.includes("people") || input.includes("person") || input.includes("pax") || input.includes("guest") || input.includes("friend"));
    var wantReducePeople = (input.includes("reduce") || input.includes("remove") || input.includes("less") || input.includes("fewer")) && (input.includes("people") || input.includes("person") || input.includes("pax"));
    var wantChangeTour = (input.includes("change") || input.includes("switch") || input.includes("swap")) && (input.includes("tour") || input.includes("sea") || input.includes("sunset"));
    var wantChangeName = (input.includes("change") || input.includes("update") || input.includes("wrong")) && (input.includes("name") || input.includes("person"));
    var wantPaymentLink = input.includes("payment") && (input.includes("link") || input.includes("pay") || input.includes("again") || input.includes("new")) || (input.includes("didn") && input.includes("pay")) || input.includes("resend");
    var wantConfirmEmail = (input.includes("email") || input.includes("confirmation")) && (input.includes("resend") || input.includes("again") || input.includes("didn") || input.includes("not received") || input.includes("haven"));
    var wantReceipt = input.includes("receipt") || input.includes("invoice") || input.includes("proof") && input.includes("payment");
    var wantWrongDate = (input.includes("wrong") && (input.includes("date") || input.includes("day") || input.includes("time"))) || (input.includes("booked") && input.includes("wrong"));
    
    // If they want to book, go straight to booking flow
    if (wantBook && !wantReschedule && !wantCancel) {
      await setConvo(convo.id, { current_state: "MENU" });
      await handleMsg(phone, "book", "text");
      return;
    }
    
    // Handle wrong date as reschedule
    if (wantWrongDate) { wantReschedule = true; }
    
    // Handle add/reduce people, change tour, change name — connect to team
    if (wantAddPeople) {
      var addBkr = await supabase.from("bookings").select("id, qty, total_amount, unit_price, slot_id, tour_id, slots(start_time, capacity_total, booked, held), tours(name)")
        .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["PAID", "CONFIRMED"])
        .order("created_at", { ascending: false }).limit(1).single();
      if (addBkr.data) {
        var addBk = addBkr.data; var addRef = addBk.id.substring(0, 8).toUpperCase();
        var addSlot = (addBk as any).slots; var addTour = (addBk as any).tours;
        var addAvail = addSlot ? addSlot.capacity_total - addSlot.booked - (addSlot.held || 0) : 0;
        await sendText(phone, "Your booking *" + addRef + "* currently has " + addBk.qty + " people on " + (addTour?.name || "Tour") + " \u2014 " + (addSlot ? fmtTime(addSlot.start_time) : "TBC") + ".\n\n" + (addAvail > 0 ? "There are " + addAvail + " extra spots available.\n\n" : "This slot is full unfortunately.\n\n") + "How many people total would you like? (Currently " + addBk.qty + ")");
        await setConvo(convo.id, { current_state: "MODIFY_QTY", state_data: { booking_id: addBk.id, slot_id: addBk.slot_id, tour_id: addBk.tour_id, current_qty: addBk.qty, unit_price: addBk.unit_price, max_avail: addBk.qty + addAvail } });
      } else {
        await sendText(phone, "I couldn\u2019t find an active booking. Try My Bookings or contact our team.");
        await sendButtons(phone, "Options:", [{ id: "MY_BOOKINGS", title: "\u{1F4CB} My Bookings" }, { id: "IDLE", title: "\u2B05 Menu" }]);
        await setConvo(convo.id, { current_state: "MENU" });
      }
      return;
    }
    
    if (wantReducePeople) {
      var redBkr = await supabase.from("bookings").select("id, qty, total_amount, unit_price, slot_id, tour_id, slots(start_time), tours(name)")
        .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["PAID", "CONFIRMED"])
        .order("created_at", { ascending: false }).limit(1).single();
      if (redBkr.data) {
        var redBk = redBkr.data; var redRef = redBk.id.substring(0, 8).toUpperCase();
        var redSlot = (redBk as any).slots; var redTour = (redBk as any).tours;
        var redHrs = redSlot ? (new Date(redSlot.start_time).getTime() - Date.now()) / (1000 * 60 * 60) : 0;
        var refundNote = redHrs >= 24 ? "You\u2019ll get a refund for the difference." : "As it\u2019s within 24 hours, the refund policy applies.";
        await sendText(phone, "Your booking *" + redRef + "* has " + redBk.qty + " people on " + (redTour?.name || "Tour") + ".\n\n" + refundNote + "\n\nHow many people total would you like? (Currently " + redBk.qty + ")");
        await setConvo(convo.id, { current_state: "MODIFY_QTY", state_data: { booking_id: redBk.id, slot_id: redBk.slot_id, tour_id: redBk.tour_id, current_qty: redBk.qty, unit_price: redBk.unit_price, max_avail: 30, hours_before: redHrs } });
      } else {
        await sendText(phone, "No active booking found. Try My Bookings.");
        await setConvo(convo.id, { current_state: "MENU" });
      }
      return;
    }
    
    if (wantChangeTour) {
      var ctBkr = await supabase.from("bookings").select("id, qty, total_amount, unit_price, slot_id, tour_id, slots(start_time), tours(name)")
        .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["PAID", "CONFIRMED"])
        .order("created_at", { ascending: false }).limit(1).single();
      if (ctBkr.data) {
        var ctBk = ctBkr.data; var ctRef = ctBk.id.substring(0, 8).toUpperCase();
        var ctTour = (ctBk as any).tours;
        var ctSlot = (ctBk as any).slots;
        var tours = await getActiveTours();
        var otherTours = tours.filter(function(t: any) { return t.id !== ctBk.tour_id; });
        if (otherTours.length > 0) {
          await sendText(phone, "Your booking *" + ctRef + "* is for *" + (ctTour?.name || "Tour") + "* on " + (ctSlot ? fmtTime(ctSlot.start_time) : "TBC") + ".\n\nWhich tour would you like to switch to?");
          var ctRows = otherTours.map(function(t: any) { return { id: "CHTOUR_" + t.id, title: t.name, description: "R" + t.base_price_per_person + "/pp \u2022 " + t.duration_minutes + " min" }; });
          await sendList(phone, "Pick a new tour:", "Choose Tour", [{ title: "Available Tours", rows: ctRows }]);
          await setConvo(convo.id, { current_state: "CHANGE_TOUR_PICK", state_data: { booking_id: ctBk.id, slot_id: ctBk.slot_id, tour_id: ctBk.tour_id, qty: ctBk.qty, current_tour: ctTour?.name } });
        } else {
          await sendText(phone, "No other tours available right now.");
          await setConvo(convo.id, { current_state: "MENU" });
        }
      } else {
        await sendText(phone, "No active booking found.");
        await setConvo(convo.id, { current_state: "MENU" });
      }
      return;
    }
    
    if (wantChangeName) {
      var nmBkr = await supabase.from("bookings").select("id, customer_name, slots(start_time), tours(name)")
        .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["PAID", "CONFIRMED"])
        .order("created_at", { ascending: false }).limit(1).single();
      if (nmBkr.data) {
        var nmBk = nmBkr.data; var nmRef = nmBk.id.substring(0, 8).toUpperCase();
        await sendText(phone, "The booking *" + nmRef + "* is currently under *" + nmBk.customer_name + "*. What should the new name be?");
        await setConvo(convo.id, { current_state: "CHANGE_NAME", state_data: { booking_id: nmBk.id } });
      } else {
        await sendText(phone, "No active booking found.");
        await setConvo(convo.id, { current_state: "MENU" });
      }
      return;
    }
    
    // Handle payment link resend
    if (wantPaymentLink) {
      var payBkr = await supabase.from("bookings").select("id, status, total_amount, yoco_checkout_id, slots(start_time), tours(name)")
        .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["HELD", "PENDING"])
        .order("created_at", { ascending: false }).limit(1).single();
      if (payBkr.data && payBkr.data.yoco_checkout_id) {
        // Create new checkout
        var rpBk = payBkr.data;
        var rpRef = rpBk.id.substring(0, 8).toUpperCase();
        var rpYoco = await fetch("https://payments.yoco.com/api/checkouts", {
          method: "POST", headers: { Authorization: "Bearer " + YOCO_SECRET, "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Math.round(Number(rpBk.total_amount) * 100), currency: "ZAR",
            successUrl: "https://book.capekayak.co.za/success?ref=" + rpBk.id,
            cancelUrl: "https://book.capekayak.co.za/cancelled",
            failureUrl: "https://book.capekayak.co.za/cancelled",
            metadata: { booking_id: rpBk.id, type: "RESEND" },
          }),
        });
        var rpYocoData = await rpYoco.json();
        if (rpYocoData?.redirectUrl) {
          await supabase.from("bookings").update({ yoco_checkout_id: rpYocoData.id }).eq("id", rpBk.id);
          await sendText(phone, "Here\u2019s a fresh payment link for booking *" + rpRef + "* (R" + rpBk.total_amount + "):\n\n" + rpYocoData.redirectUrl + "\n\n\u23F0 Your spots are held for 15 minutes.");
        } else {
          await sendText(phone, "Couldn\u2019t generate a new link. Let me connect you to our team.");
          await setConvo(convo.id, { status: "HUMAN" });
        }
      } else {
        await sendText(phone, "I couldn\u2019t find an unpaid booking. If you\u2019ve already paid, your confirmation email should be on the way! Check your spam folder too.");
        await sendButtons(phone, "Options:", [{ id: "MY_BOOKINGS", title: "\u{1F4CB} My Bookings" }, { id: "IDLE", title: "\u2B05 Menu" }]);
      }
      await setConvo(convo.id, { current_state: "MENU" });
      return;
    }
    
    // Handle confirmation email resend
    if (wantConfirmEmail) {
      var emBkr = await supabase.from("bookings").select("id, email, customer_name, qty, total_amount, status, slots(start_time), tours(name)")
        .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["PAID", "CONFIRMED"])
        .order("created_at", { ascending: false }).limit(1).single();
      if (emBkr.data) {
        var emBk = emBkr.data; var emRef = emBk.id.substring(0, 8).toUpperCase();
        try {
          await fetch(SUPABASE_URL + "/functions/v1/send-email", {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + SUPABASE_KEY },
            body: JSON.stringify({ type: "BOOKING_CONFIRM", data: { email: emBk.email, customer_name: emBk.customer_name, ref: emRef, tour_name: (emBk as any).tours?.name || "Tour", start_time: (emBk as any).slots?.start_time ? fmtTime((emBk as any).slots.start_time) : "TBC", qty: emBk.qty, total_amount: "R" + emBk.total_amount } }),
          });
          await sendText(phone, "Done! I\u2019ve resent the confirmation to *" + emBk.email + "* \u2709\uFE0F\n\nCheck your inbox (and spam folder). Ref: " + emRef);
        } catch(e) {
          await sendText(phone, "Something went wrong sending the email. Let me connect you to our team.");
        }
      } else {
        await sendText(phone, "I couldn\u2019t find a confirmed booking to resend. Check My Bookings or contact our team.");
      }
      await sendButtons(phone, "Anything else?", [{ id: "ASK", title: "\u2753 Another Question" }, { id: "IDLE", title: "\u2B05 Menu" }]);
      await setConvo(convo.id, { current_state: "MENU" });
      return;
    }
    
    // Handle split payment
    var wantSplit = (input.includes("split") && input.includes("pay")) || (input.includes("separate") && input.includes("pay"));
    if (wantSplit) {
      var spBkr = await supabase.from("bookings").select("id, total_amount, status")
        .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["HELD", "PENDING"])
        .order("created_at", { ascending: false }).limit(1).single();
      if (spBkr.data) {
        await sendText(phone, "Sure! Your total is R" + spBkr.data.total_amount + ". How many people are splitting the payment? (2-10)");
        await setConvo(convo.id, { current_state: "SPLIT_PAYMENT_COUNT", state_data: { booking_id: spBkr.data.id, split_total: spBkr.data.total_amount } });
      } else {
        await sendText(phone, "No unpaid booking found. Start a new booking first!");
        await setConvo(convo.id, { current_state: "MENU" });
      }
      return;
    }
    
    // Handle cash/deposit request
    var wantCash = input.includes("cash") || (input.includes("deposit") && !input.includes("refund"));
    if (wantCash) {
      var cashBkr = await supabase.from("bookings").select("id, total_amount, status")
        .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["HELD", "PENDING"])
        .order("created_at", { ascending: false }).limit(1).single();
      if (cashBkr.data) {
        var depAmount = Math.round(Number(cashBkr.data.total_amount) * 0.5);
        var depYoco = await fetch("https://payments.yoco.com/api/checkouts", {
          method: "POST", headers: { Authorization: "Bearer " + YOCO_SECRET, "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Math.round(depAmount * 100), currency: "ZAR",
            successUrl: "https://book.capekayak.co.za/success?ref=" + cashBkr.data.id,
            cancelUrl: "https://book.capekayak.co.za/cancelled",
            metadata: { booking_id: cashBkr.data.id, type: "DEPOSIT_50" },
          }),
        });
        var depData = await depYoco.json();
        if (depData?.redirectUrl) {
          await sendText(phone, "No problem! Pay a 50% deposit (R" + depAmount + ") to secure your booking, and settle the rest in cash on the day:\n\n" + depData.redirectUrl);
        } else {
          await sendText(phone, "Couldn\u2019t generate deposit link. Contact our team.");
        }
      } else {
        await sendText(phone, "We ask for at least a 50% deposit online to secure your booking. Start a booking and I\u2019ll send you a deposit link!");
      }
      await setConvo(convo.id, { current_state: "MENU" });
      return;
    }
    
    // Handle receipt request
    if (wantReceipt) {
      await sendText(phone, "Your confirmation email serves as your receipt. I can resend it if you need it! Just say \"resend my confirmation email\"\n\nFor a formal tax invoice, let me connect you to our team.");
      await sendButtons(phone, "Options:", [{ id: "HUMAN", title: "\u{1F4AC} Get Invoice" }, { id: "ASK", title: "\u2753 Another Question" }, { id: "IDLE", title: "\u2B05 Menu" }]);
      await setConvo(convo.id, { current_state: "MENU" });
      return;
    }
    
    // Check weather concern
    if (!wantReschedule && !wantCancel && !wantMyBooking) {
      var weatherHandled = await checkWeatherConcern(phone, input);
      if (weatherHandled) { await setConvo(convo.id, { current_state: "MENU" }); return; }
    }
    
    // Check smart availability before FAQ
    if (!wantReschedule && !wantCancel && !wantMyBooking && detectAvailQuery(input)) {
      var askHandled = await handleSmartAvail(phone, input);
      if (askHandled) { await setConvo(convo.id, { current_state: "MENU" }); return; }
    }
    
    if (wantReschedule || wantCancel || wantMyBooking) {
      // Look up their bookings
      var askBkr = await supabase.from("bookings").select("id, status, qty, total_amount, slot_id, tour_id, created_at, slots(start_time), tours(name)")
        .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["PAID", "HELD", "CONFIRMED"])
        .order("created_at", { ascending: false }).limit(5);
      var askBookings = askBkr.data || [];
      
      if (askBookings.length === 0) {
        await sendText(phone, "I couldn\u2019t find any active bookings linked to this phone number. If you booked with a different number, try the My Bookings page on our website with your email.");
        await sendButtons(phone, "What else?", [{ id: "BOOK", title: "\u{1F6F6} Book a Tour" }, { id: "ASK", title: "\u2753 Another Question" }, { id: "IDLE", title: "\u2B05 Menu" }]);
        await setConvo(convo.id, { current_state: "MENU" });
        return;
      }
      
      // If they want to reschedule
      if (wantReschedule) {
        if (askBookings.length === 1) {
          var rb = askBookings[0]; var rbSlot = (rb as any).slots; var rbTour = (rb as any).tours;
          var rbRef = rb.id.substring(0, 8).toUpperCase();
          var rbHrs = rbSlot ? (new Date(rbSlot.start_time).getTime() - Date.now()) / (1000 * 60 * 60) : 0;
          
          if (rbHrs < 24) {
            await sendText(phone, "Your booking *" + rbRef + "* for " + (rbTour?.name || "the tour") + " on " + (rbSlot ? fmtTime(rbSlot.start_time) : "TBC") + " is within 24 hours, so rescheduling isn\u2019t available anymore. You can contact our team for help.");
            await sendButtons(phone, "Options:", [{ id: "HUMAN", title: "\u{1F4AC} Speak to Team" }, { id: "IDLE", title: "\u2B05 Menu" }]);
            await setConvo(convo.id, { current_state: "MENU" });
            return;
          }
          
          // Check reschedule count
          var rCount = await supabase.from("bookings").select("reschedule_count").eq("id", rb.id).single();
          if (rCount.data && rCount.data.reschedule_count >= 2) {
            await sendText(phone, "You\u2019ve already rescheduled this booking twice. Let me connect you to our team.");
            await setConvo(convo.id, { current_state: "IDLE", status: "HUMAN" });
            return;
          }
          
          // Load slots for reschedule
          var askRSlots = rb.tour_id ? await getAvailSlotsForTour(rb.tour_id, 60) : await getAvailSlots(60);
          var askRFitting = askRSlots.filter(function(s: any) { return s.capacity_total - s.booked - (s.held || 0) >= rb.qty && s.id !== rb.slot_id; });
          
          if (askRFitting.length === 0) {
            await sendText(phone, "No alternative slots with enough space right now. Let me connect you to our team.");
            await setConvo(convo.id, { current_state: "IDLE", status: "HUMAN" });
            return;
          }
          
          await sendText(phone, "Sure! I found your booking:\n\n\u{1F6F6} *" + (rbTour?.name || "Tour") + "*\n\u{1F4C5} " + (rbSlot ? fmtTime(rbSlot.start_time) : "TBC") + "\n\u{1F465} " + rb.qty + " people\n\nPick a new date:");
          
          // Group by week
          var askRGroups: any = {};
          for (var ari = 0; ari < askRFitting.length; ari++) {
            var ars = askRFitting[ari]; var arsDate = new Date(ars.start_time);
            var arwStart = new Date(arsDate); arwStart.setDate(arwStart.getDate() - arwStart.getDay());
            var arwLabel = arwStart.toLocaleDateString("en-ZA", { day: "numeric", month: "short", timeZone: "Africa/Johannesburg" });
            var arwKey = arwStart.toISOString().split("T")[0];
            if (!askRGroups[arwKey]) askRGroups[arwKey] = { label: "Week of " + arwLabel, rows: [] };
            if (askRGroups[arwKey].rows.length < 10) {
              askRGroups[arwKey].rows.push({ id: "RSLOT_" + ars.id, title: fmtTime(ars.start_time).substring(0, 24), description: (ars.capacity_total - ars.booked - (ars.held || 0)) + " spots" });
            }
          }
          var askRSecs: any[] = []; var askRKeys = Object.keys(askRGroups).sort(); var askRTotal = 0;
          for (var ark = 0; ark < askRKeys.length && askRTotal < 10; ark++) {
            var arg = askRGroups[askRKeys[ark]]; var arRem = 10 - askRTotal;
            if (arg.rows.length > arRem) arg.rows = arg.rows.slice(0, arRem);
            askRTotal += arg.rows.length; askRSecs.push({ title: arg.label.substring(0, 24), rows: arg.rows });
          }
          await sendList(phone, "Scroll through weeks:", "View Dates", askRSecs);
          await setConvo(convo.id, { current_state: "RESCHEDULE_PICK", state_data: { booking_id: rb.id, slot_id: rb.slot_id, qty: rb.qty, total: rb.total_amount, tour_id: rb.tour_id, reschedule_count: rCount.data?.reschedule_count || 0 } });
          return;
        } else {
          // Multiple bookings — let them pick
          var rbMsg = "I found " + askBookings.length + " active bookings. Which one do you want to reschedule?\n\n";
          var rbRows: any[] = [];
          for (var rbi = 0; rbi < askBookings.length; rbi++) {
            var rbb = askBookings[rbi]; var rbbSlot = (rbb as any).slots; var rbbTour = (rbb as any).tours;
            var rbbRef = rbb.id.substring(0, 8).toUpperCase();
            rbMsg += (rbi+1) + ". *" + rbbRef + "* \u2014 " + (rbbTour?.name || "Tour") + "\n   " + (rbbSlot ? fmtTime(rbbSlot.start_time) : "TBC") + "\n\n";
            rbRows.push({ id: "BK_" + rbb.id, title: rbbRef + " - " + (rbbTour?.name || "").substring(0, 15), description: rbbSlot ? fmtTime(rbbSlot.start_time).substring(0, 24) : "TBC" });
          }
          await sendList(phone, rbMsg, "Select Booking", [{ title: "Your Bookings", rows: rbRows }]);
          await setConvo(convo.id, { current_state: "MY_BOOKINGS_LIST" });
          return;
        }
      }
      
      // If they want to cancel
      if (wantCancel) {
        if (askBookings.length === 1) {
          var cb = askBookings[0]; var cbSlot = (cb as any).slots; var cbTour = (cb as any).tours;
          var cbRef = cb.id.substring(0, 8).toUpperCase();
          var cbHrs = cbSlot ? (new Date(cbSlot.start_time).getTime() - Date.now()) / (1000 * 60 * 60) : 0;
          var cbDetail = "I found your booking:\n\n\u{1F6F6} *" + (cbTour?.name || "Tour") + "*\n\u{1F4C5} " + (cbSlot ? fmtTime(cbSlot.start_time) : "TBC") + "\n\u{1F465} " + cb.qty + " people\n\n";
          if (cbHrs >= 24) {
            var cbRefund = Math.round(Number(cb.total_amount) * 0.95 * 100) / 100;
            cbDetail += "You\u2019ll get a *95% refund (R" + cbRefund + ")*. Cancel?";
          } else {
            cbDetail += "This is within 24 hours so *no refund* is available. Still cancel?";
          }
          await sendButtons(phone, cbDetail, [{ id: "CONFIRM_CANCEL", title: "\u2705 Yes, Cancel" }, { id: "IDLE", title: "\u274C Keep It" }]);
          await setConvo(convo.id, { current_state: "CONFIRM_CANCEL_ACTION", state_data: { booking_id: cb.id, slot_id: cb.slot_id, qty: cb.qty, total: cb.total_amount, hours_before: cbHrs } });
          return;
        } else {
          // Multiple — show list
          var cbMsg = "Which booking do you want to cancel?\n\n";
          var cbRows: any[] = [];
          for (var cbi = 0; cbi < askBookings.length; cbi++) {
            var cbb = askBookings[cbi]; var cbbSlot = (cbb as any).slots; var cbbTour = (cbb as any).tours;
            var cbbRef = cbb.id.substring(0, 8).toUpperCase();
            cbRows.push({ id: "BK_" + cbb.id, title: cbbRef + " - " + (cbbTour?.name || "").substring(0, 15), description: cbbSlot ? fmtTime(cbbSlot.start_time).substring(0, 24) : "TBC" });
          }
          await sendList(phone, cbMsg, "Select Booking", [{ title: "Your Bookings", rows: cbRows }]);
          await setConvo(convo.id, { current_state: "MY_BOOKINGS_LIST" });
          return;
        }
      }
      
      // General booking inquiry
      var bMsg = "Here are your active bookings:\n\n";
      for (var abi = 0; abi < askBookings.length; abi++) {
        var ab = askBookings[abi]; var abSlot = (ab as any).slots; var abTour = (ab as any).tours;
        bMsg += "\u{1F6F6} *" + (abTour?.name || "Tour") + "*\n\u{1F4C5} " + (abSlot ? fmtTime(abSlot.start_time) : "TBC") + "\n\u{1F465} " + ab.qty + " people \u2022 " + ab.status + "\nRef: " + ab.id.substring(0, 8).toUpperCase() + "\n\n";
      }
      bMsg += "Need to change anything?";
      await sendButtons(phone, bMsg, [{ id: "MY_BOOKINGS", title: "\u{1F4CB} Manage Bookings" }, { id: "ASK", title: "\u2753 Another Question" }, { id: "IDLE", title: "\u2B05 Menu" }]);
      await setConvo(convo.id, { current_state: "MENU" });
      return;
    }
    
    // PRIORITY 2: Check FAQ (after booking intents)
    var askFaq = matchFAQ(input);
    if (askFaq) {
      await sendText(phone, FAQ_ANSWERS[askFaq]);
      await sendButtons(phone, "Anything else?", [{ id: "ASK", title: "\u2753 Another Question" }, { id: "BOOK", title: "\u{1F6F6} Book a Tour" }, { id: "IDLE", title: "\u2B05 Menu" }]);
      await setConvo(convo.id, { current_state: "MENU" });
      return;
    }
    
    // PRIORITY 3: Try Gemini with database context
    var gemContext = "";
    // Get their bookings for context
    var ctxBkr = await supabase.from("bookings").select("id, status, qty, total_amount, slots(start_time), tours(name)")
      .eq("phone", phone).eq("business_id", BUSINESS_ID).in("status", ["PAID", "HELD", "CONFIRMED"])
      .order("created_at", { ascending: false }).limit(3);
    var ctxBookings = ctxBkr.data || [];
    if (ctxBookings.length > 0) {
      gemContext = "\nUser has these active bookings: ";
      for (var ci = 0; ci < ctxBookings.length; ci++) {
        var cb2 = ctxBookings[ci]; var cb2Slot = (cb2 as any).slots; var cb2Tour = (cb2 as any).tours;
        gemContext += (cb2Tour?.name || "Tour") + " on " + (cb2Slot ? fmtTime(cb2Slot.start_time) : "TBC") + " (" + cb2.qty + " ppl, " + cb2.status + "), ";
      }
    }
    
    // Get next available slots for context
    var ctxSlots = await getAvailSlots(5);
    if (ctxSlots.length > 0) {
      gemContext += "\nNext available: ";
      for (var csi = 0; csi < ctxSlots.length; csi++) {
        var cs = ctxSlots[csi];
        gemContext += fmtTime(cs.start_time) + " (" + (cs.capacity_total - cs.booked - (cs.held || 0)) + " spots), ";
      }
    }
    
    // Call Gemini with full context
    if (GK) {
      try {
        var ctxR = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GK, {
          method: "POST", headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            system_instruction: {parts: [{text: "You are a friendly WhatsApp assistant for Cape Kayak Adventures in Cape Town. Keep replies SHORT (2-3 sentences). Sound human and casual.\nTours: Sea Kayak R600/pp 90min, Sunset Paddle R600/pp 2hrs (sunset+wine). Meet: Three Anchor Bay, Sea Point. 15 min early.\nBring: Sunscreen, hat, sunnies, towel, water.\nCancel: 24h+ = 95% refund. Under 24h = no refund. Weather = full refund.\nSafety: Experienced guides, life jackets, stable kayaks. No experience needed. Ages 6+.\nFor booking/rescheduling/cancelling, tell them to type \"book\", \"reschedule\", or \"cancel\".\nNEVER make up times." + gemContext}]},
            contents: [{role: "user", parts: [{text: rawText}]}],
            generationConfig: {temperature: 0.7, maxOutputTokens: 200}
          })
        });
        var ctxD = await ctxR.json();
        if (ctxD.candidates?.[0]?.content?.parts?.[0]) {
          await sendText(phone, ctxD.candidates[0].content.parts[0].text);
          await sendButtons(phone, "Anything else?", [{ id: "ASK", title: "\u2753 Another Question" }, { id: "BOOK", title: "\u{1F6F6} Book a Tour" }, { id: "IDLE", title: "\u2B05 Menu" }]);
          await setConvo(convo.id, { current_state: "MENU" });
          return;
        }
      } catch(e) { console.log("Gem err:", e); }
    }
    
    // Fallback
    await sendText(phone, "Hmm, I\u2019m not sure about that one. Try asking in a different way, or pick an option below:");
    await sendButtons(phone, "Options:", [{ id: "ASK", title: "\u2753 Try Again" }, { id: "BOOK", title: "\u{1F6F6} Book a Tour" }, { id: "IDLE", title: "\u2B05 Menu" }]);
    await setConvo(convo.id, { current_state: "MENU" });
  }

  // ===== MODIFY QTY =====
  else if (state === "MODIFY_QTY") {
    var newQty = parseInt(input);
    if (isNaN(newQty) || newQty < 1 || newQty > 30) { await sendText(phone, "Just need a number between 1 and 30:"); return; }
    if (newQty === sd.current_qty) { await sendText(phone, "That\u2019s the same as your current booking! No changes needed \u{1F60A}"); await setConvo(convo.id, { current_state: "IDLE", state_data: {} }); return; }
    if (newQty > sd.max_avail) { await sendText(phone, "Only " + sd.max_avail + " spots available. Try a smaller number:"); return; }
    var qtyDiff = newQty - sd.current_qty;
    var newTotal = newQty * Number(sd.unit_price);
    var oldTotal = sd.current_qty * Number(sd.unit_price);
    var diffAmount = Math.abs(newTotal - oldTotal);
    // Update booking
    await supabase.from("bookings").update({ qty: newQty, total_amount: newTotal }).eq("id", sd.booking_id);
    // Update slot booked count
    var mqSlot = await supabase.from("slots").select("booked").eq("id", sd.slot_id).single();
    if (mqSlot.data) await supabase.from("slots").update({ booked: Math.max(0, mqSlot.data.booked + qtyDiff) }).eq("id", sd.slot_id);
    if (qtyDiff > 0) {
      // Added people - need additional payment
      var addYoco = await fetch("https://payments.yoco.com/api/checkouts", {
        method: "POST", headers: { Authorization: "Bearer " + YOCO_SECRET, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(diffAmount * 100), currency: "ZAR",
          successUrl: "https://book.capekayak.co.za/success?ref=" + sd.booking_id,
          cancelUrl: "https://book.capekayak.co.za/cancelled",
          failureUrl: "https://book.capekayak.co.za/cancelled",
          metadata: { booking_id: sd.booking_id, type: "ADD_PEOPLE" },
        }),
      });
      var addYocoData = await addYoco.json();
      if (addYocoData?.redirectUrl) {
        await sendText(phone, "Updated to " + newQty + " people! \u2705\n\nYou need to pay an extra *R" + diffAmount + "* for the " + qtyDiff + " additional " + (qtyDiff === 1 ? "person" : "people") + ":\n\n" + addYocoData.redirectUrl);
      } else {
        await sendText(phone, "Updated to " + newQty + " people! Please contact our team to arrange the additional payment of R" + diffAmount + ".");
      }
    } else {
      // Reduced people
      if (sd.hours_before >= 24) {
        await supabase.from("bookings").update({ refund_status: "REQUESTED", refund_amount: diffAmount, refund_notes: "Qty reduced from " + sd.current_qty + " to " + newQty }).eq("id", sd.booking_id);
        await sendText(phone, "Updated to " + newQty + " people! \u2705\n\nA refund of *R" + diffAmount + "* has been submitted \u2014 expect it within 5-7 business days.");
      } else {
        await sendText(phone, "Updated to " + newQty + " people! \u2705\n\nAs this is within 24 hours, the refund policy applies for the difference.");
      }
    }
    await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
  }

  // ===== CHANGE TOUR PICK =====
  else if (state === "CHANGE_TOUR_PICK") {
    var newTourId = rid ? rid.replace("CHTOUR_", "") : "";
    if (!newTourId) { await sendText(phone, "Please pick a tour from the list."); return; }
    var newTourInfo = await supabase.from("tours").select("*").eq("id", newTourId).single();
    if (!newTourInfo.data) { await sendText(phone, "Can\u2019t find that tour."); await setConvo(convo.id, { current_state: "IDLE" }); return; }
    var nt = newTourInfo.data;
    // Find a slot for the new tour on a similar date
    var newSlots = await getAvailSlotsForTour(newTourId, 60);
    var fitting2 = newSlots.filter(function(s: any) { return s.capacity_total - s.booked - (s.held || 0) >= sd.qty; });
    if (fitting2.length === 0) { await sendText(phone, "No available slots for " + nt.name + " with " + sd.qty + " spots. Contact our team for help."); await setConvo(convo.id, { current_state: "IDLE" }); return; }
    // Group by week
    var ctGroups: any = {};
    for (var cti = 0; cti < fitting2.length; cti++) {
      var cts = fitting2[cti]; var ctsDate = new Date(cts.start_time);
      var ctwStart = new Date(ctsDate); ctwStart.setDate(ctwStart.getDate() - ctwStart.getDay());
      var ctwLabel = ctwStart.toLocaleDateString("en-ZA", { day: "numeric", month: "short", timeZone: "Africa/Johannesburg" });
      var ctwKey = ctwStart.toISOString().split("T")[0];
      if (!ctGroups[ctwKey]) ctGroups[ctwKey] = { label: "Week of " + ctwLabel, rows: [] };
      if (ctGroups[ctwKey].rows.length < 10) {
        ctGroups[ctwKey].rows.push({ id: "CTSLOT_" + cts.id, title: fmtTime(cts.start_time).substring(0, 24), description: (cts.capacity_total - cts.booked - (cts.held || 0)) + " spots" });
      }
    }
    var ctSecs: any[] = []; var ctKeys2 = Object.keys(ctGroups).sort(); var ctTotal2 = 0;
    for (var ctk = 0; ctk < ctKeys2.length && ctTotal2 < 10; ctk++) {
      var ctg = ctGroups[ctKeys2[ctk]]; var ctRem = 10 - ctTotal2;
      if (ctg.rows.length > ctRem) ctg.rows = ctg.rows.slice(0, ctRem);
      ctTotal2 += ctg.rows.length; ctSecs.push({ title: ctg.label.substring(0, 24), rows: ctg.rows });
    }
    await sendText(phone, "Switching to *" + nt.name + "* (R" + nt.base_price_per_person + "/pp). Pick a date:");
    await sendList(phone, "Available times:", "View Dates", ctSecs);
    await setConvo(convo.id, { current_state: "CHANGE_TOUR_SLOT", state_data: { ...sd, new_tour_id: newTourId, new_tour_name: nt.name, new_price: nt.base_price_per_person } });
  }

  // ===== CHANGE TOUR SLOT =====
  else if (state === "CHANGE_TOUR_SLOT") {
    var ctSlotId = rid ? rid.replace("CTSLOT_", "") : "";
    if (!ctSlotId) { await sendText(phone, "Please pick a slot."); return; }
    // Release old slot
    var oldSlotR = await supabase.from("slots").select("booked").eq("id", sd.slot_id).single();
    if (oldSlotR.data) await supabase.from("slots").update({ booked: Math.max(0, oldSlotR.data.booked - sd.qty) }).eq("id", sd.slot_id);
    // Book new slot
    var newSlotR = await supabase.from("slots").select("booked, start_time").eq("id", ctSlotId).single();
    if (newSlotR.data) await supabase.from("slots").update({ booked: newSlotR.data.booked + sd.qty }).eq("id", ctSlotId);
    var newTotal2 = sd.qty * Number(sd.new_price);
    await supabase.from("bookings").update({ tour_id: sd.new_tour_id, slot_id: ctSlotId, unit_price: sd.new_price, total_amount: newTotal2 }).eq("id", sd.booking_id);
    await sendText(phone, "All done! \u2705 Switched to *" + sd.new_tour_name + "* on " + (newSlotR.data ? fmtTime(newSlotR.data.start_time) : "TBC") + ".\n\nSee you on the water! \u{1F30A}");
    await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
  }

  // ===== CHANGE NAME =====
  else if (state === "CHANGE_NAME") {
    if (rawText.length < 2) { await sendText(phone, "Please type the new name:"); return; }
    await supabase.from("bookings").update({ customer_name: rawText }).eq("id", sd.booking_id);
    await sendText(phone, "Updated! The booking is now under *" + rawText + "* \u2705");
    await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
  }

  // ===== SPLIT PAYMENT =====
  else if (state === "SPLIT_PAYMENT_COUNT") {
    var splitCount = parseInt(input);
    if (isNaN(splitCount) || splitCount < 2 || splitCount > 10) { await sendText(phone, "How many payment links do you need? (2-10)"); return; }
    var splitAmount = Math.round(Number(sd.split_total) / splitCount * 100) / 100;
    var splitLinks = "";
    for (var spi = 0; spi < splitCount; spi++) {
      var spYoco = await fetch("https://payments.yoco.com/api/checkouts", {
        method: "POST", headers: { Authorization: "Bearer " + YOCO_SECRET, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(splitAmount * 100), currency: "ZAR",
          successUrl: "https://book.capekayak.co.za/success?ref=" + sd.booking_id,
          cancelUrl: "https://book.capekayak.co.za/cancelled",
          metadata: { booking_id: sd.booking_id, type: "SPLIT_" + (spi+1) + "_OF_" + splitCount },
        }),
      });
      var spData = await spYoco.json();
      if (spData?.redirectUrl) splitLinks += "\nPayment " + (spi+1) + " (R" + splitAmount + "): " + spData.redirectUrl;
    }
    if (splitLinks) {
      await sendText(phone, "Here are your " + splitCount + " payment links (R" + splitAmount + " each):" + splitLinks);
    } else {
      await sendText(phone, "Couldn\u2019t generate split links. Contact our team for help.");
    }
    await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
  }

  // ===== WAITLIST OFFER =====
  else if (state === "WAITLIST_OFFER") {
    if (rid === "WAITLIST_YES" || input.includes("yes") || input.includes("waitlist")) {
      var wlName = convo.customer_name || null;
      await supabase.from("waitlist").insert({
        business_id: BUSINESS_ID, tour_id: sd.tour_id, phone: phone,
        customer_name: wlName, qty: sd.qty, status: "WAITING"
      });
      await sendText(phone, "You\u2019re on the waitlist! \u2705 I\u2019ll message you as soon as " + sd.qty + " spots open up. You can also try a different date or tour in the meantime.");
      await sendButtons(phone, "Anything else?", [{ id: "BOOK", title: "\u{1F6F6} Try Different Date" }, { id: "IDLE", title: "\u2B05 Menu" }]);
      await setConvo(convo.id, { current_state: "MENU", state_data: {} });
    } else {
      await setConvo(convo.id, { current_state: "MENU", state_data: {} });
      if (rid === "BOOK") await handleMsg(phone, "book", "text");
      else await handleMsg(phone, "hi", "text");
    }
  }

  // ===== WEATHER REFUND =====
  else if (state === "MENU" && rid && rid.startsWith("WEATHER_REFUND_")) {
    var wrBkId = rid.replace("WEATHER_REFUND_", "");
    var wrBk = await supabase.from("bookings").select("id, total_amount, slot_id, qty").eq("id", wrBkId).single();
    if (wrBk.data) {
      await supabase.from("bookings").update({ status: "CANCELLED", cancellation_reason: "Weather cancellation", refund_status: "REQUESTED", refund_amount: wrBk.data.total_amount }).eq("id", wrBkId);
      if (wrBk.data.slot_id) {
        var wrSl = await supabase.from("slots").select("booked").eq("id", wrBk.data.slot_id).single();
        if (wrSl.data) await supabase.from("slots").update({ booked: Math.max(0, wrSl.data.booked - wrBk.data.qty) }).eq("id", wrBk.data.slot_id);
      }
      await sendText(phone, "Full refund of R" + wrBk.data.total_amount + " submitted \u2705 Expect it back on your card within 5-7 business days.\n\nWe\u2019d love to have you back when the weather plays along! Type *book* anytime \u{1F30A}");
    }
    await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
  }

  // ===== FALLBACK =====
  else {
    // Try FAQ match from any state
    var fallbackFaq = matchFAQ(input);
    if (fallbackFaq) {
      await sendText(phone, FAQ_ANSWERS[fallbackFaq]);
      await sendButtons(phone, "Anything else?", [{ id: "BOOK", title: "\u{1F6F6} Book a Tour" }, { id: "MY_BOOKINGS", title: "\u{1F4CB} My Bookings" }, { id: "IDLE", title: "\u2B05 Menu" }]);
      await setConvo(convo.id, { current_state: "MENU" });
    } else {
      await setConvo(convo.id, { current_state: "IDLE", state_data: {} });
      await handleMsg(phone, "hi", "text");
    }
  }
}

Deno.serve(async (req: any) => {
  var url = new URL(req.url);
  if (req.method === "GET") {
    var mode = url.searchParams.get("hub.mode"); var token = url.searchParams.get("hub.verify_token"); var challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token === VERIFY_TOKEN) return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
    return new Response("Forbidden", { status: 403 });
  }
  if (req.method === "POST") {
    try {
      var body = await req.json();
      var message = body.entry && body.entry[0] && body.entry[0].changes && body.entry[0].changes[0] && body.entry[0].changes[0].value && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0];
      if (!message) return new Response("OK", { status: 200 });
      var ph = message.from; var mt = message.type; var txt = ""; var inter = null;
      if (mt === "text") txt = (message.text && message.text.body) || "";
      else if (mt === "interactive") { inter = message.interactive; txt = (inter.button_reply && inter.button_reply.title) || (inter.list_reply && inter.list_reply.title) || ""; }
      else txt = "[" + mt + "]";
      console.log("F:" + ph + " T:" + txt);
      await handleMsg(ph, txt, mt, inter);
      return new Response("OK", { status: 200 });
    } catch (err) { console.error("E:", err); return new Response("OK", { status: 200 }); }
  }
  return new Response("Not allowed", { status: 405 });
});
