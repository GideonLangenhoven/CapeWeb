import "jsr:@supabase/functions-js/edge-runtime.d.ts";

var RESEND_KEY = Deno.env.get("RESEND_API_KEY")!;
var FROM_EMAIL = "Cape Kayak Adventures <onboarding@resend.dev>";
var MAPS_URL = "https://www.google.com/maps/place/CAPE+KAYAK+ADVENTURES/@-33.9078,18.3978,17z";

async function sendEmail(to: string, subject: string, html: string) {
  var res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + RESEND_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject: subject, html: html }),
  });
  var data = await res.json();
  console.log("EMAIL:" + JSON.stringify(data));
  return data;
}

var HEADER = '<div style="background:#0077b6;color:white;padding:20px;border-radius:8px 8px 0 0;text-align:center;">';
var BODY_START = '<div style="background:#f8f9fa;padding:20px;border:1px solid #dee2e6;border-radius:0 0 8px 8px;">';
var FOOTER = '<hr style="border:none;border-top:1px solid #dee2e6;margin:20px 0;"><p style="color:#999;font-size:12px;text-align:center;">Cape Kayak Adventures | Three Anchor Bay, Beach Road, Sea Point, Cape Town<br>Enterprise Number: 2025/796484/07 | Tax Number: 9301707270<br><a href="' + MAPS_URL + '">Find us on Google Maps</a></p>';
var WRAP = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">';

function bookingConfirmHtml(b: any) {
  return WRAP + HEADER + '<h1 style="margin:0;">Booking Confirmed!</h1></div>' + BODY_START +
    '<p>Hi <strong>' + b.customer_name + '</strong>,</p>' +
    '<p>Your booking is confirmed! Here are the details:</p>' +
    '<table style="width:100%;border-collapse:collapse;margin:15px 0;">' +
    '<tr><td style="padding:8px;border-bottom:1px solid #dee2e6;color:#666;">Reference</td><td style="padding:8px;border-bottom:1px solid #dee2e6;font-weight:bold;">' + b.ref + '</td></tr>' +
    '<tr><td style="padding:8px;border-bottom:1px solid #dee2e6;color:#666;">Tour</td><td style="padding:8px;border-bottom:1px solid #dee2e6;">' + b.tour_name + '</td></tr>' +
    '<tr><td style="padding:8px;border-bottom:1px solid #dee2e6;color:#666;">Date & Time</td><td style="padding:8px;border-bottom:1px solid #dee2e6;">' + b.start_time + '</td></tr>' +
    '<tr><td style="padding:8px;border-bottom:1px solid #dee2e6;color:#666;">Guests</td><td style="padding:8px;border-bottom:1px solid #dee2e6;">' + b.qty + ' people</td></tr>' +
    '<tr><td style="padding:8px;border-bottom:1px solid #dee2e6;color:#666;">Total Paid</td><td style="padding:8px;border-bottom:1px solid #dee2e6;font-weight:bold;">' + b.total_amount + '</td></tr>' +
    '</table>' +
    '<div style="background:#e8f5e9;padding:15px;border-radius:6px;margin:15px 0;">' +
    '<h3 style="margin:0 0 10px 0;">Meeting Point</h3>' +
    '<p style="margin:0;">Three Anchor Bay, Beach Road, Sea Point, Cape Town<br>' +
    '<a href="' + MAPS_URL + '">Open in Google Maps</a></p>' +
    '<p style="margin:10px 0 0 0;"><strong>Arrive 15 minutes early</strong> for your safety briefing.</p></div>' +
    '<div style="background:#fff3e0;padding:15px;border-radius:6px;margin:15px 0;">' +
    '<h3 style="margin:0 0 10px 0;">What to Bring</h3>' +
    '<p style="margin:0;">Sunscreen - Hat & sunglasses - Towel & change of clothes - Water bottle - Light layers</p></div>' +
    '<p>See you on the water!</p><p><strong>Cape Kayak Adventures</strong><br>Cape Town\'s Original Since 1994</p>' +
    FOOTER + '</div></div>';
}

function invoiceHtml(inv: any) {
  var discountRow = "";
  if (inv.discount_amount && Number(inv.discount_amount) > 0) {
    discountRow = '<tr><td style="padding:8px;border-bottom:1px solid #dee2e6;">Discount (' + inv.discount_type + ' ' + inv.discount_percent + '%)</td><td style="padding:8px;border-bottom:1px solid #dee2e6;text-align:right;">-R' + Number(inv.discount_amount).toFixed(2) + '</td></tr>';
  }
  var voucherRow = "";
  if (inv.voucher_code) {
    voucherRow = '<tr><td style="padding:8px;border-bottom:1px solid #dee2e6;">Voucher Applied</td><td style="padding:8px;border-bottom:1px solid #dee2e6;text-align:right;">' + inv.voucher_code + '</td></tr>';
  }
  return WRAP +
    '<div style="border:1px solid #dee2e6;border-radius:8px;overflow:hidden;">' +
    '<div style="background:#0077b6;color:white;padding:20px;">' +
    '<div><h1 style="margin:0;font-size:22px;">Cape Kayak Adventures</h1><p style="margin:5px 0 0 0;font-size:13px;opacity:0.9;">Cape Town\'s Original Since 1994</p></div>' +
    '<div style="text-align:right;"><h2 style="margin:10px 0 0 0;font-size:24px;">TAX INVOICE</h2><p style="margin:5px 0 0 0;font-size:14px;">' + inv.invoice_number + '</p></div></div>' +
    '<div style="padding:20px;">' +
    '<table style="width:100%;margin-bottom:20px;"><tr>' +
    '<td style="vertical-align:top;width:50%;"><strong>Bill To:</strong><br>' + inv.customer_name + '<br>' + (inv.customer_email || '') + '<br>' + (inv.customer_phone || '') + '</td>' +
    '<td style="vertical-align:top;width:50%;text-align:right;"><strong>Invoice Date:</strong> ' + inv.invoice_date + '<br><strong>Tour Date:</strong> ' + inv.tour_date + '<br><strong>Payment:</strong> ' + (inv.payment_method || 'Yoco') + '</td>' +
    '</tr></table>' +
    '<table style="width:100%;border-collapse:collapse;margin:15px 0;">' +
    '<thead><tr style="background:#f1f3f5;"><th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Description</th><th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Qty</th><th style="padding:10px;text-align:right;border-bottom:2px solid #dee2e6;">Unit Price</th><th style="padding:10px;text-align:right;border-bottom:2px solid #dee2e6;">Amount</th></tr></thead>' +
    '<tbody><tr><td style="padding:10px;border-bottom:1px solid #dee2e6;">' + inv.tour_name + '</td><td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">' + inv.qty + '</td><td style="padding:10px;text-align:right;border-bottom:1px solid #dee2e6;">R' + Number(inv.unit_price).toFixed(2) + '</td><td style="padding:10px;text-align:right;border-bottom:1px solid #dee2e6;">R' + Number(inv.subtotal).toFixed(2) + '</td></tr></tbody>' +
    '</table>' +
    '<table style="width:100%;border-collapse:collapse;margin-top:10px;">' +
    '<tr><td style="padding:8px;border-bottom:1px solid #dee2e6;">Subtotal</td><td style="padding:8px;border-bottom:1px solid #dee2e6;text-align:right;">R' + Number(inv.subtotal).toFixed(2) + '</td></tr>' +
    discountRow + voucherRow +
    '<tr style="font-weight:bold;font-size:16px;"><td style="padding:10px;border-top:2px solid #0077b6;">Total</td><td style="padding:10px;border-top:2px solid #0077b6;text-align:right;">R' + Number(inv.total_amount).toFixed(2) + '</td></tr>' +
    '</table>' +
    '<div style="background:#e8f5e9;padding:12px;border-radius:6px;margin-top:15px;text-align:center;"><strong>PAID</strong></div>' +
    '<hr style="border:none;border-top:1px solid #dee2e6;margin:20px 0;">' +
    '<p style="color:#666;font-size:11px;text-align:center;">Cape Kayak Adventures<br>Three Anchor Bay, Beach Road, Sea Point, Cape Town<br>Enterprise Number: 2025/796484/07 | Tax Number: 9301707270</p>' +
    '</div></div></div>';
}

function giftVoucherHtml(v: any) {
  var personalMsg = v.gift_message ? '<div style="background:#f0f7ff;border-left:4px solid #0077b6;padding:20px;margin:20px 0;border-radius:0 8px 8px 0;"><p style="margin:0;font-style:italic;font-size:16px;color:#333;">"' + v.gift_message + '"</p>' + (v.buyer_name ? '<p style="margin:10px 0 0 0;color:#666;font-size:14px;">- ' + v.buyer_name + '</p>' : '') + '</div>' : '';
  var recipientLine = v.recipient_name ? '<p style="margin:10px 0;font-size:18px;color:white;">For: <strong>' + v.recipient_name + '</strong></p>' : '';
  return WRAP +
    '<div style="border:2px dashed #0077b6;border-radius:12px;overflow:hidden;">' +
    '<div style="background:linear-gradient(135deg, #0077b6, #00b4d8);color:white;padding:30px;text-align:center;">' +
    '<p style="margin:0;font-size:14px;text-transform:uppercase;letter-spacing:2px;">Cape Kayak Adventures</p>' +
    '<h1 style="margin:10px 0;font-size:32px;">GIFT VOUCHER</h1>' +
    recipientLine +
    '<p style="margin:0;font-size:16px;opacity:0.9;">' + (v.tour_name || 'One Free Trip') + ' - Any Date</p></div>' +
    '<div style="padding:30px;text-align:center;background:#f8f9fa;">' +
    personalMsg +
    '<p style="margin:0 0 5px 0;font-size:14px;color:#666;">Voucher Code:</p>' +
    '<div style="background:white;border:2px solid #0077b6;border-radius:8px;padding:15px;display:inline-block;margin:10px 0;">' +
    '<span style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#0077b6;">' + v.code + '</span></div>' +
    '<p style="margin:15px 0 5px 0;color:#666;">Value: <strong>R' + Number(v.value || 0).toFixed(0) + '</strong> | Valid until: <strong>' + v.expires_at + '</strong></p>' +
    '<div style="background:#fff3e0;padding:15px;border-radius:6px;margin:20px 0;text-align:left;">' +
    '<h3 style="margin:0 0 8px 0;">How to Redeem:</h3>' +
    '<p style="margin:0;">1. WhatsApp us at wa.me/27XXXXXXXXXX<br>2. Say "I have a voucher" or type <strong>menu</strong><br>3. Choose <strong>Redeem Voucher</strong><br>4. Enter code: <strong>' + v.code + '</strong><br>5. Pick your tour date and enjoy!</p></div>' +
    '<p style="color:#999;font-size:12px;">This voucher is good for one complete booking (any group size). Cannot be exchanged for cash.</p>' +
    '</div>' +
    '<div style="background:#0077b6;color:white;padding:10px;text-align:center;font-size:12px;">Cape Kayak Adventures | Cape Town\'s Original Since 1994</div>' +
    '</div></div>';
}

function voucherHtml(v: any) {
  return WRAP +
    '<div style="border:2px dashed #0077b6;border-radius:12px;overflow:hidden;">' +
    '<div style="background:linear-gradient(135deg, #0077b6, #00b4d8);color:white;padding:30px;text-align:center;">' +
    '<p style="margin:0;font-size:14px;text-transform:uppercase;letter-spacing:2px;">Cape Kayak Adventures</p>' +
    '<h1 style="margin:10px 0;font-size:32px;">GIFT VOUCHER</h1>' +
    '<p style="margin:0;font-size:16px;opacity:0.9;">One Free Trip - Any Tour, Any Size</p></div>' +
    '<div style="padding:30px;text-align:center;background:#f8f9fa;">' +
    '<p style="margin:0 0 5px 0;font-size:14px;color:#666;">Your Voucher Code:</p>' +
    '<div style="background:white;border:2px solid #0077b6;border-radius:8px;padding:15px;display:inline-block;margin:10px 0;">' +
    '<span style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#0077b6;">' + v.code + '</span></div>' +
    '<p style="margin:15px 0 5px 0;color:#666;">Valid until: <strong>' + v.expires_at + '</strong></p>' +
    '<div style="background:#fff3e0;padding:15px;border-radius:6px;margin:20px 0;text-align:left;">' +
    '<h3 style="margin:0 0 8px 0;">How to Redeem:</h3>' +
    '<p style="margin:0;">1. WhatsApp us<br>2. Say "I have a voucher"<br>3. Enter code: <strong>' + v.code + '</strong><br>4. Pick your tour and enjoy!</p></div>' +
    '<p style="color:#999;font-size:12px;">This voucher is good for one complete booking (any tour, any group size). Cannot be exchanged for cash.</p>' +
    '</div>' +
    '<div style="background:#0077b6;color:white;padding:10px;text-align:center;font-size:12px;">Cape Kayak Adventures | Cape Town\'s Original Since 1994</div>' +
    '</div></div>';
}

function cancellationHtml(b: any) {
  var refundLine = b.refund_amount ? '<p><strong>Refund of R' + b.refund_amount + '</strong> has been submitted (5-7 business days).</p>' : '<p>As this was within 24 hours, no refund is available per our cancellation policy.</p>';
  return WRAP + HEADER + '<h1 style="margin:0;">Booking Cancelled</h1></div>' + BODY_START +
    '<p>Hi <strong>' + b.customer_name + '</strong>,</p>' +
    '<p>Your booking <strong>' + b.ref + '</strong> for <strong>' + b.tour_name + '</strong> on <strong>' + b.start_time + '</strong> has been cancelled.</p>' +
    refundLine +
    '<p>We hope to see you again!</p><p><strong>Cape Kayak Adventures</strong></p>' +
    FOOTER + '</div></div>';
}

function reminderHtml(b: any) {
  return WRAP + HEADER + '<h1 style="margin:0;">See You Tomorrow!</h1></div>' + BODY_START +
    '<p>Hi <strong>' + b.customer_name + '</strong>,</p><p>Friendly reminder - you\'re paddling tomorrow!</p>' +
    '<table style="width:100%;border-collapse:collapse;margin:15px 0;">' +
    '<tr><td style="padding:8px;border-bottom:1px solid #dee2e6;color:#666;">Tour</td><td style="padding:8px;border-bottom:1px solid #dee2e6;">' + b.tour_name + '</td></tr>' +
    '<tr><td style="padding:8px;border-bottom:1px solid #dee2e6;color:#666;">Date & Time</td><td style="padding:8px;border-bottom:1px solid #dee2e6;">' + b.start_time + '</td></tr>' +
    '<tr><td style="padding:8px;border-bottom:1px solid #dee2e6;color:#666;">Guests</td><td style="padding:8px;border-bottom:1px solid #dee2e6;">' + b.qty + ' people</td></tr></table>' +
    '<div style="background:#e8f5e9;padding:15px;border-radius:6px;margin:15px 0;"><h3 style="margin:0 0 10px 0;">Meeting Point</h3>' +
    '<p style="margin:0;">Three Anchor Bay, Beach Road, Sea Point<br><a href="' + MAPS_URL + '">Google Maps</a></p>' +
    '<p style="margin:10px 0 0 0;"><strong>Arrive 15 minutes early!</strong></p></div>' +
    '<div style="background:#fff3e0;padding:15px;border-radius:6px;margin:15px 0;"><h3 style="margin:0 0 10px 0;">Don\'t Forget</h3>' +
    '<p style="margin:0;">Sunscreen - Hat & sunglasses - Towel - Water bottle</p></div>' +
    '<p>Can\'t wait to see you!</p><p><strong>Cape Kayak Adventures</strong></p>' +
    FOOTER + '</div></div>';
}

function weatherCancelHtml(b: any) {
  return WRAP + HEADER + '<h1 style="margin:0;">Tour Update - Weather</h1></div>' + BODY_START +
    '<p>Hi <strong>' + b.customer_name + '</strong>,</p>' +
    '<p>Unfortunately, due to weather conditions, your <strong>' + b.tour_name + '</strong> on <strong>' + b.start_time + '</strong> has been cancelled for safety reasons.</p>' +
    '<div style="background:#e8f5e9;padding:15px;border-radius:6px;margin:15px 0;">' +
    '<h3 style="margin:0 0 10px 0;">Your Options:</h3>' +
    '<p style="margin:0;">1. <strong>Free reschedule</strong> to any available date<br>2. <strong>Full refund</strong> - processed within 5-7 business days</p></div>' +
    '<p>Just reply to this email or WhatsApp us to let us know your preference.</p>' +
    '<p>We\'re sorry for the inconvenience and hope to see you on the water soon!</p>' +
    '<p><strong>Cape Kayak Adventures</strong></p>' +
    FOOTER + '</div></div>';
}

Deno.serve(async (req: any) => {
  if (req.method !== "POST") return new Response("OK", { status: 200 });
  try {
    var body = await req.json();
    var type = body.type;
    var b = body.data;
    if (!b || !b.email) { console.log("No email"); return new Response("No email", { status: 400 }); }

    var subject = "";
    var html = "";

    if (type === "BOOKING_CONFIRM") {
      subject = "Booking Confirmed - " + b.tour_name + " | Cape Kayak Adventures";
      html = bookingConfirmHtml(b);
    } else if (type === "INVOICE") {
      subject = "Tax Invoice " + b.invoice_number + " | Cape Kayak Adventures";
      html = invoiceHtml(b);
    } else if (type === "GIFT_VOUCHER") {
      subject = "Your Gift Voucher for Cape Kayak Adventures!";
      html = giftVoucherHtml(b);
    } else if (type === "VOUCHER") {
      subject = "Your Gift Voucher | Cape Kayak Adventures";
      html = voucherHtml(b);
    } else if (type === "CANCELLATION") {
      subject = "Booking Cancelled - " + b.ref + " | Cape Kayak Adventures";
      html = cancellationHtml(b);
    } else if (type === "REMINDER") {
      subject = "Reminder: You're paddling tomorrow! | Cape Kayak Adventures";
      html = reminderHtml(b);
    } else if (type === "WEATHER_CANCEL") {
      subject = "Tour Cancelled (Weather) - " + b.tour_name + " | Cape Kayak Adventures";
      html = b.html || weatherCancelHtml(b);
    } else if (type === "BROADCAST") {
      subject = b.subject || "Cape Kayak Adventures";
      if (b.html) { html = b.html; } else {
        var bfn = (b.customer_name || "there").split(" ")[0];
        var bmsg = (b.message || "").split("\n").join("<br>");
        html = WRAP + HEADER + '<h1 style="margin:0;">Cape Kayak Adventures</h1></div>' + BODY_START + '<p>Hi <strong>' + bfn + '</strong>,</p><div style="margin:15px 0;line-height:1.7;">' + bmsg + '</div>' + FOOTER + '</div></div>';
      }
    } else {
      return new Response("Unknown type", { status: 400 });
    }

    var result = await sendEmail(b.email, subject, html);

    if ((type === "INVOICE" || type === "GIFT_VOUCHER") && b.admin_email) {
      await sendEmail(b.admin_email, "[Admin] " + subject, html);
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("EMAIL_ERR:", err);
    return new Response("Error", { status: 500 });
  }
});
