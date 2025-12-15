import React, { useState } from 'react';

export const pillar10QuizQuestions = [
  {
    question: 'A funnel helps you find:',
    options: ['Where customers drop off', 'Your favourite font'],
    correctIndex: 0,
  },
  {
    question: 'UTMs help you know:',
    options: ['Which channel/post/campaign drove clicks', 'How to package products'],
    correctIndex: 0,
  },
  {
    question: 'You should track:',
    options: ['50 metrics to be safe', 'A small KPI set you actually use'],
    correctIndex: 1,
  },
  {
    question: 'Conversion rate is:',
    options: ['Purchases (or bookings) ÷ sessions', 'Revenue ÷ packaging'],
    correctIndex: 0,
  },
  {
    question: 'AOV is:',
    options: ['Revenue ÷ orders', 'Orders ÷ revenue'],
    correctIndex: 0,
  },
  {
    question: "CapeWeb's improvement rule is to fix:",
    options: ['The biggest drop-off first', 'Random things daily'],
    correctIndex: 0,
  },
  {
    question: 'A/B testing works best when you change:',
    options: ['7 things at once', 'One thing at a time'],
    correctIndex: 1,
  },
  {
    question: 'Events are:',
    options: ['Recorded actions like "lead_form_submit"', 'Company values'],
    correctIndex: 0,
  },
  {
    question: 'Analytics should be checked:',
    options: ['Weekly', 'Only when things go wrong'],
    correctIndex: 0,
  },
  {
    question: 'If traffic is high but purchases are low, your next action is:',
    options: ['Find the biggest funnel drop-off and fix it', 'Give up and rebrand'],
    correctIndex: 0,
  },
];

export function Pillar10Content() {
  const [northStar, setNorthStar] = useState('orders');
  const [sessions, setSessions] = useState('');
  const [views, setViews] = useState('');
  const [checkouts, setCheckouts] = useState('');
  const [purchases, setPurchases] = useState('');
  const [revenue, setRevenue] = useState('');
  const [spend, setSpend] = useState('');
  const [cogs, setCogs] = useState('');
  const [dashboardResult, setDashboardResult] = useState('');

  const [utmUrl, setUtmUrl] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmOutput, setUtmOutput] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const [eventObject, setEventObject] = useState('');
  const [eventAction, setEventAction] = useState('');
  const [eventPlace, setEventPlace] = useState('');
  const [eventOutput, setEventOutput] = useState('');

  const [testChoice, setTestChoice] = useState('headline');

  const calculateDashboard = () => {
    const sess = parseFloat(sessions) || 0;
    const v = parseFloat(views) || 0;
    const chk = parseFloat(checkouts) || 0;
    const pur = parseFloat(purchases) || 0;
    const rev = parseFloat(revenue) || 0;
    const sp = parseFloat(spend) || 0;
    const cg = parseFloat(cogs) || 0;

    const pct = (a, b) => (b ? ((a / b) * 100).toFixed(2) : 0);

    const offerViewRate = pct(v, sess);
    const checkoutRate = pct(chk, v);
    const purchaseRateFromCheckout = pct(pur, chk);
    const conversionRate = pct(pur, sess);

    const aov = pur ? (rev / pur).toFixed(2) : 0;
    const cac = pur ? (sp / pur).toFixed(2) : 0;
    const grossProfit = rev - cg;
    const grossMargin = rev ? ((grossProfit / rev) * 100).toFixed(1) : 0;

    const stepRates = [
      { name: 'Sessions → Offer Views', rate: parseFloat(offerViewRate), hint: 'Improve landing page clarity, speed, and CTA.' },
      { name: 'Offer Views → Checkout', rate: parseFloat(checkoutRate), hint: 'Improve offer, pricing clarity, trust, and button placement.' },
      { name: 'Checkout → Purchase', rate: parseFloat(purchaseRateFromCheckout), hint: 'Reduce checkout friction, add payment options, show trust.' },
    ];
    const worst = stepRates.reduce((min, x) => (x.rate < min.rate ? x : min), stepRates[0]);

    setDashboardResult(`
      <div style="font-weight:900; margin-bottom:.5rem;">Your Growth Dashboard (simple)</div>
      <div style="display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:.75rem;">
        <div style="background:#F8F9FA; border:1px solid #E9ECEF; border-radius:10px; padding:1rem;">
          <div style="color:#6c757d; font-size:.9rem;">Conversion rate</div>
          <div style="font-weight:900; font-size:1.15rem;">${conversionRate}%</div>
          <div style="color:#6c757d; font-size:.85rem; margin-top:.25rem;">Purchases ÷ sessions</div>
        </div>
        <div style="background:#F8F9FA; border:1px solid #E9ECEF; border-radius:10px; padding:1rem;">
          <div style="color:#6c757d; font-size:.9rem;">AOV</div>
          <div style="font-weight:900; font-size:1.15rem;">R ${aov}</div>
          <div style="color:#6c757d; font-size:.85rem; margin-top:.25rem;">Revenue ÷ orders</div>
        </div>
        <div style="background:#F8F9FA; border:1px solid #E9ECEF; border-radius:10px; padding:1rem;">
          <div style="color:#6c757d; font-size:.9rem;">CAC (if ads)</div>
          <div style="font-weight:900; font-size:1.15rem;">R ${cac}</div>
          <div style="color:#6c757d; font-size:.85rem; margin-top:.25rem;">Spend ÷ orders</div>
        </div>
        <div style="background:#F8F9FA; border:1px solid #E9ECEF; border-radius:10px; padding:1rem;">
          <div style="color:#6c757d; font-size:.9rem;">Gross margin (if COGS)</div>
          <div style="font-weight:900; font-size:1.15rem;">${grossMargin}%</div>
          <div style="color:#6c757d; font-size:.85rem; margin-top:.25rem;">(Revenue-COGS) ÷ revenue</div>
        </div>
      </div>

      <div style="margin-top: 1rem; background:#fff; border:1px solid #DEE2E6; border-radius: 10px; padding: 1rem;">
        <div style="font-weight:900;">Funnel health</div>
        <ul style="margin:.6rem 0 0 1.25rem;">
          <li>Sessions → Offer views: <strong>${offerViewRate}%</strong></li>
          <li>Offer views → Checkout: <strong>${checkoutRate}%</strong></li>
          <li>Checkout → Purchase: <strong>${purchaseRateFromCheckout}%</strong></li>
        </ul>

        <div style="margin-top:.75rem; padding: .9rem; border-radius: 10px; background:#FFF3CD; border:1px solid #FFECB5;">
          <strong>Biggest bottleneck:</strong> ${worst.name} (<strong>${worst.rate.toFixed(2)}%</strong>)<br/>
          <strong>What to do next:</strong> ${worst.hint}
        </div>

        <div style="margin-top:.75rem; color:#6c757d;">
          CapeWeb can turn this into a monthly improvement plan (design + performance + testing + reporting).
        </div>
      </div>
    `);
  };

  const buildUTM = () => {
    if (!utmUrl || !utmSource || !utmMedium || !utmCampaign) {
      setUtmOutput('Please fill: Base URL, utm_source, utm_medium, utm_campaign.');
      return;
    }

    try {
      const u = new URL(utmUrl);
      u.searchParams.set('utm_source', utmSource);
      u.searchParams.set('utm_medium', utmMedium);
      u.searchParams.set('utm_campaign', utmCampaign);
      if (utmContent) u.searchParams.set('utm_content', utmContent);
      if (utmTerm) u.searchParams.set('utm_term', utmTerm);
      setUtmOutput(u.toString());
      setCopyMessage('');
    } catch (e) {
      setUtmOutput('Invalid URL. Please use a full URL like https://example.com/page');
    }
  };

  const copyUTM = async () => {
    try {
      await navigator.clipboard.writeText(utmOutput);
      setCopyMessage('Copied!');
    } catch (e) {
      setCopyMessage('Copy failed (select & copy manually).');
    }
  };

  const slug = (s) =>
    (s || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

  const buildEvent = () => {
    const obj = slug(eventObject);
    const act = slug(eventAction);
    const place = slug(eventPlace);

    if (!obj || !act) {
      setEventOutput('Please fill: Object + Action (e.g., lead_form + submit).');
      return;
    }
    setEventOutput(place ? `${obj}_${act}_${place}` : `${obj}_${act}`);
  };

  const northStarContent = {
    orders: `
      <div style="font-weight:900; margin-bottom:.35rem;">North Star: Orders</div>
      <div style="color:#6c757d;">
        Your weekly win is: more orders. Your improvement targets: conversion rate + AOV.
      </div>
      <ul style="margin:.6rem 0 0 1.25rem;">
        <li>Track: sessions → offer views → checkout → purchase</li>
        <li>Increase AOV with bundles (product + service upsell)</li>
      </ul>
    `,
    bookings: `
      <div style="font-weight:900; margin-bottom:.35rem;">North Star: Bookings</div>
      <div style="color:#6c757d;">
        Your weekly win is: more booked calls/appointments. Your improvement targets: lead-to-book rate + show-up rate.
      </div>
      <ul style="margin:.6rem 0 0 1.25rem;">
        <li>Track: sessions → lead form → booking link clicks → booking confirmed</li>
        <li>Reduce no-shows with reminders (CapeWeb automation)</li>
      </ul>
    `,
    revenue: `
      <div style="font-weight:900; margin-bottom:.35rem;">North Star: Revenue</div>
      <div style="color:#6c757d;">
        Revenue is useful, but it can hide low profit. Pair it with profit tracking from Pillar 9.
      </div>
      <ul style="margin:.6rem 0 0 1.25rem;">
        <li>Track: revenue + orders + AOV</li>
        <li>Watch costs so revenue doesn't "lie"</li>
      </ul>
    `,
  };

  const testPlans = {
    headline: `
      <div style="font-weight:900; margin-bottom:.35rem;">Test plan: Headline</div>
      <ol style="margin:.35rem 0 0 1.25rem;">
        <li>Write a clearer headline focused on the customer's result.</li>
        <li>Keep everything else the same.</li>
        <li>Measure conversion rate for 7 days.</li>
        <li>If conversion improves, keep the winner.</li>
      </ol>
      <div style="margin-top:.6rem; color:#6c757d;">
        CapeWeb note: we use StoryBrand-style clarity (teach it, then use it) to reduce confusion and increase action.
      </div>
    `,
    cta: `
      <div style="font-weight:900; margin-bottom:.35rem;">Test plan: CTA button</div>
      <ol style="margin:.35rem 0 0 1.25rem;">
        <li>Change ONE CTA (e.g., "Buy now" → "Get my starter kit").</li>
        <li>Place CTA above the fold + near pricing.</li>
        <li>Measure: checkout starts and purchases.</li>
      </ol>
      <div style="margin-top:.6rem; color:#6c757d;">
        CapeWeb note: fewer choices + clearer next step usually wins.
      </div>
    `,
    checkout: `
      <div style="font-weight:900; margin-bottom:.35rem;">Test plan: Checkout friction</div>
      <ol style="margin:.35rem 0 0 1.25rem;">
        <li>Reduce steps (remove unnecessary fields).</li>
        <li>Add trust: delivery time, refunds policy, secure payments.</li>
        <li>Add payment options customers trust (SA-friendly gateway).</li>
        <li>Measure: checkout → purchase rate.</li>
      </ol>
      <div style="margin-top:.6rem; color:#6c757d;">
        CapeWeb note: performance + trust + easy payments is the conversion combo.
      </div>
    `,
  };

  return (
    <>
      <div className="mastery-section">
        <h3>1) The problem: "I'm busy" is not the same as "I'm growing"</h3>
        <p>
          Our founder (25, Cape Town, R0 budget) is posting content, replying to DMs, delivering, and doing services. They feel busy… but they don't know which actions create sales.
        </p>
        <p>
          Analytics turns your business into a simple question: <strong>What happened?</strong> → <strong>Why?</strong> → <strong>What do we change next?</strong>
        </p>

        <figure style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #E9ECEF', borderRadius: '10px', background: '#fff' }}>
          <div style={{ fontWeight: 900, marginBottom: '.5rem' }}>Diagram: CapeWeb Growth Loop</div>
          <GrowthLoopDiagram />
        </figure>
      </div>

      <div className="mastery-section">
        <h3>2) What to track (simple KPI list for product + service)</h3>
        <p>
          Your dashboard should be small. If you track 50 metrics, you track nothing. CapeWeb recommends starting with <strong>7 metrics</strong>.
        </p>

        <div className="comparison-table-wrapper">
          <table className="capeweb-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>What it tells you</th>
                <th>Why it matters for first 100 sales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Sessions (visits)</strong></td>
                <td>How many people show up</td>
                <td>If traffic is 0, nothing else matters</td>
              </tr>
              <tr>
                <td><strong>Leads</strong></td>
                <td>People who raise their hand</td>
                <td>Leads are future sales</td>
              </tr>
              <tr>
                <td><strong>Conversion rate</strong></td>
                <td>% who buy/book</td>
                <td>Fixing this often beats "posting more"</td>
              </tr>
              <tr>
                <td><strong>Orders / bookings</strong></td>
                <td>Sales count</td>
                <td>This is your momentum</td>
              </tr>
              <tr>
                <td><strong>Revenue (R)</strong></td>
                <td>Money in</td>
                <td>Confirms your offer works</td>
              </tr>
              <tr>
                <td><strong>AOV (Average order value)</strong></td>
                <td>Revenue ÷ orders</td>
                <td>Bundles can increase AOV fast</td>
              </tr>
              <tr>
                <td><strong>Drop-off point</strong></td>
                <td>Where people leave</td>
                <td>Shows what to fix next</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>📝 Activity 1: Choose your "North Star" (one main goal)</h4>
          <p style={{ marginTop: '.25rem' }}>
            Pick one. For beginners, your North Star is often <strong>orders</strong> or <strong>bookings</strong>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <label style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', display: 'block' }}>
              <input type="radio" name="p10-ns" value="orders" checked={northStar === 'orders'} onChange={(e) => setNorthStar(e.target.value)} />
              <div style={{ fontWeight: 900, marginTop: '.35rem' }}>Orders</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Best if product is main</div>
            </label>
            <label style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', display: 'block' }}>
              <input type="radio" name="p10-ns" value="bookings" checked={northStar === 'bookings'} onChange={(e) => setNorthStar(e.target.value)} />
              <div style={{ fontWeight: 900, marginTop: '.35rem' }}>Bookings</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Best if service is main</div>
            </label>
            <label style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', display: 'block' }}>
              <input type="radio" name="p10-ns" value="revenue" checked={northStar === 'revenue'} onChange={(e) => setNorthStar(e.target.value)} />
              <div style={{ fontWeight: 900, marginTop: '.35rem' }}>Revenue</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Good later (can hide low profit)</div>
            </label>
          </div>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px dashed #ADB5BD', borderRadius: '10px', padding: '1rem' }} dangerouslySetInnerHTML={{ __html: northStarContent[northStar] }} />
        </div>
      </div>

      <div className="mastery-section">
        <h3>3) Funnels (the simplest way to find the money leak)</h3>
        <p>
          A funnel is the steps people take to buy: <strong>visit → view offer → start checkout → pay</strong>. If 500 people visit and only 2 buy, you don't need motivation. You need to find the leak.
        </p>

        <figure style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #E9ECEF', borderRadius: '10px', background: '#fff' }}>
          <div style={{ fontWeight: 900, marginBottom: '.5rem' }}>Diagram: eCommerce funnel</div>
          <FunnelDiagram />
        </figure>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🧮 Activity 2: Funnel + KPI Calculator</h4>
          <p style={{ marginTop: '.25rem' }}>Enter your numbers (even guesses). The calculator shows your conversion rate and where to focus.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Sessions</label>
              <input type="number" placeholder="e.g. 500" value={sessions} onChange={(e) => setSessions(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
            </div>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Offer views</label>
              <input type="number" placeholder="e.g. 220" value={views} onChange={(e) => setViews(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
            </div>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Checkouts</label>
              <input type="number" placeholder="e.g. 35" value={checkouts} onChange={(e) => setCheckouts(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
            </div>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Purchases / bookings</label>
              <input type="number" placeholder="e.g. 8" value={purchases} onChange={(e) => setPurchases(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '.75rem', marginTop: '.75rem' }}>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Revenue (R)</label>
              <input type="number" step="0.01" placeholder="e.g. 4800" value={revenue} onChange={(e) => setRevenue(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
            </div>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Ad spend (R) (optional)</label>
              <input type="number" step="0.01" placeholder="e.g. 300" value={spend} onChange={(e) => setSpend(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
            </div>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>COGS (R) (optional)</label>
              <input type="number" step="0.01" placeholder="e.g. 1800" value={cogs} onChange={(e) => setCogs(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="button" onClick={calculateDashboard} style={{ padding: '.75rem 1rem', borderRadius: '10px', border: '1px solid #0B5ED7', background: '#0B5ED7', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
              Calculate my dashboard
            </button>
          </div>

          {dashboardResult && <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }} dangerouslySetInnerHTML={{ __html: dashboardResult }} />}

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#E7F1FF', border: '1px solid #CFE2FF' }}>
            <strong>CapeWeb move:</strong> once we see your drop-off point, we improve it with performance, design, copy, and A/B tests. That's how "Care Plans that Care" create compounding growth.
          </div>
        </div>
      </div>

      <div className="mastery-section">
        <h3>4) UTMs (so you know what channel made the sale)</h3>
        <p>
          A UTM is a simple tag you add to a link so analytics can tell you where clicks came from. Without UTMs, you'll hear: "Instagram worked"… but you won't know which post, which campaign, or which creator.
        </p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🔗 Activity 3: UTM Link Builder (copy/paste)</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Base URL</label>
              <input type="text" placeholder="https://yourdomain.co.za/offer" value={utmUrl} onChange={(e) => setUtmUrl(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
              <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>The page you want people to visit</div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>utm_source</label>
              <input type="text" placeholder="instagram" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
              <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>Where it came from</div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>utm_medium</label>
              <input type="text" placeholder="social" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
              <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>Type of channel</div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>utm_campaign</label>
              <input type="text" placeholder="launch_week_1" value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
              <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>Your campaign name</div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>utm_content (optional)</label>
              <input type="text" placeholder="reel_03" value={utmContent} onChange={(e) => setUtmContent(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
              <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>Which post/ad</div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>utm_term (optional)</label>
              <input type="text" placeholder="bundle_offer" value={utmTerm} onChange={(e) => setUtmTerm(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
              <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>Useful for keywords</div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={buildUTM} style={{ padding: '.75rem 1rem', borderRadius: '10px', border: '1px solid #0B5ED7', background: '#0B5ED7', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
              Build my UTM link
            </button>
          </div>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontWeight: 900 }}>Your UTM link</div>
            <textarea rows="3" value={utmOutput} readOnly style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} placeholder="Your link appears here..." />
            <button type="button" onClick={copyUTM} style={{ marginTop: '.6rem', padding: '.6rem .85rem', borderRadius: '10px', border: '1px solid #0b0f1a', background: '#0b0f1a', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
              Copy link
            </button>
            <span style={{ marginLeft: '.75rem', color: '#198754', fontWeight: 900 }}>{copyMessage}</span>
          </div>
        </div>
      </div>

      <div className="mastery-section">
        <h3>5) Events (so your analytics isn't confusing)</h3>
        <p>
          An <strong>event</strong> is a recorded action: "clicked buy", "submitted form", "booked call". Events become the building blocks of your funnel and dashboard.
        </p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🏷️ Activity 4: Event naming builder</h4>
          <p style={{ marginTop: '.25rem' }}>
            CapeWeb uses simple event names that humans can read. Example: <strong>lead_form_submit</strong>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Object (what)</label>
              <input type="text" placeholder="lead_form" value={eventObject} onChange={(e) => setEventObject(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Action (did what)</label>
              <input type="text" placeholder="submit" value={eventAction} onChange={(e) => setEventAction(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Place (optional)</label>
              <input type="text" placeholder="offer_page" value={eventPlace} onChange={(e) => setEventPlace(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="button" onClick={buildEvent} style={{ padding: '.75rem 1rem', borderRadius: '10px', border: '1px solid #0B5ED7', background: '#0B5ED7', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
              Generate event name
            </button>
          </div>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontWeight: 900 }}>Generated event name</div>
            <input type="text" value={eventOutput} readOnly style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} placeholder="example: lead_form_submit_offer_page" />
            <div style={{ marginTop: '.6rem', color: '#6c757d' }}>CapeWeb tip: You should be able to explain every event to a friend in one sentence.</div>
          </div>

          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 900, color: '#0B5ED7' }}>Beginner event checklist (recommended)</summary>
            <div style={{ marginTop: '.5rem', borderLeft: '3px solid #0B5ED7', paddingLeft: '1rem' }}>
              <ul style={{ margin: '.25rem 0 0 1.25rem' }}>
                <li><strong>page_view</strong></li>
                <li><strong>offer_view</strong></li>
                <li><strong>add_to_cart</strong> (if store)</li>
                <li><strong>checkout_start</strong> (if store)</li>
                <li><strong>purchase</strong> / <strong>booking_confirmed</strong></li>
                <li><strong>lead_form_submit</strong> (if service)</li>
              </ul>
            </div>
          </details>
        </div>
      </div>

      <div className="mastery-section">
        <h3>6) Your weekly dashboard (what to check every Monday)</h3>
        <p>
          Analytics is not a once-off setup. It's a weekly habit. CapeWeb recommends a 20-minute "Monday Check" so you always know what to do next.
        </p>

        <div className="workbook-section" style={{ background: '#0b0f1a', color: '#fff', border: '1px solid rgba(255,255,255,.12)', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 .75rem 0' }}>🗓️ Activity 5: Build your Monday Check</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '.75rem' }}>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span><strong>Traffic:</strong> sessions by channel (Google/IG/Direct)</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span><strong>Sales:</strong> orders/bookings this week</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span><strong>Conversion:</strong> conversion rate (are people buying?)</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span><strong>AOV:</strong> average order value (are bundles working?)</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span><strong>Drop-off:</strong> biggest leak in the funnel</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span><strong>One action:</strong> choose 1 fix for the week</span>
            </label>
          </div>

          <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', padding: '1rem', borderRadius: '12px' }}>
            <strong>CapeWeb's weekly rule:</strong> pick ONE bottleneck to fix. Not ten.
            <div style={{ marginTop: '.5rem', color: 'rgba(255,255,255,.85)' }}>
              Example: "Checkout started but purchase is low" → simplify checkout, add trust badges, improve payment options, speed up page.
            </div>
          </div>
        </div>
      </div>

      <div className="mastery-section">
        <h3>7) A/B testing (simple version)</h3>
        <p>
          A/B testing means you compare two versions of something (A vs B) to see which performs better. In early-stage businesses, you can do "simple A/B testing" by changing one thing and measuring results.
        </p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🧪 Activity 6: Choose your first test</h4>
          <p style={{ marginTop: '.25rem' }}>Pick one. One change. One week. Measure the result.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <label style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', display: 'block' }}>
              <input type="radio" name="p10-test" value="headline" checked={testChoice === 'headline'} onChange={(e) => setTestChoice(e.target.value)} />
              <div style={{ fontWeight: 900, marginTop: '.35rem' }}>Test #1: Headline</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Make value clearer</div>
            </label>

            <label style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', display: 'block' }}>
              <input type="radio" name="p10-test" value="cta" checked={testChoice === 'cta'} onChange={(e) => setTestChoice(e.target.value)} />
              <div style={{ fontWeight: 900, marginTop: '.35rem' }}>Test #2: CTA button</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Reduce fear, increase action</div>
            </label>

            <label style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', display: 'block' }}>
              <input type="radio" name="p10-test" value="checkout" checked={testChoice === 'checkout'} onChange={(e) => setTestChoice(e.target.value)} />
              <div style={{ fontWeight: 900, marginTop: '.35rem' }}>Test #3: Checkout friction</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Fewer steps, more trust</div>
            </label>
          </div>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px dashed #ADB5BD', borderRadius: '10px', padding: '1rem' }} dangerouslySetInnerHTML={{ __html: testPlans[testChoice] }} />

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#E6F4EA', border: '1px solid #C7E7D1' }}>
            <strong>✅ CapeWeb service tie-in:</strong> Our Care Plans include monthly CRO tweaks, A/B testing, analytics, and performance monitoring — so improvements compound.
          </div>
        </div>
      </div>
    </>
  );
}

export function Pillar10Quiz({ quizResponses, onSelect, onScore, scoreMessage }) {
  return (
    <div className="workbook-section" style={{ background: '#0b0f1a', color: '#fff', border: '1px solid rgba(255,255,255,.12)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
      <h3 style={{ margin: '0 0 .75rem 0' }}>🏁 Pillar 10 Boss Battle: Can you run a dashboard?</h3>
      <p style={{ margin: 0, color: 'rgba(255,255,255,.85)' }}>
        Score <strong>8/10</strong> to pass.
      </p>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
        {pillar10QuizQuestions.map((q, qIndex) => (
          <div key={qIndex} className="quiz-question">
            <p>
              <strong>Q{qIndex + 1}:</strong> {q.question}
            </p>
            {q.options.map((option, oIndex) => (
              <label key={oIndex} style={{ display: 'block' }}>
                <input
                  type="radio"
                  name={`p10q${qIndex}`}
                  checked={quizResponses[qIndex] === oIndex}
                  onChange={() => onSelect(qIndex, oIndex)}
                />{' '}
                {option}
              </label>
            ))}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onScore}
        style={{ marginTop: '1rem', padding: '.75rem .95rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,.2)', background: '#ffffff', color: '#0b0f1a', fontWeight: 900, cursor: 'pointer' }}
      >
        Score my Boss Battle
      </button>

      <div style={{ marginTop: '.75rem', fontWeight: 900 }}>{scoreMessage}</div>

      <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}>
        <strong>If you passed:</strong> You're ready for Pillar 11 (Customer Experience &amp; Support) — where support becomes growth.
      </div>
    </div>
  );
}

export function Pillar10Completion() {
  return (
    <div className="completion-box" style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed #CED4DA' }}>
      <h3>🎉 Pillar 10 Complete</h3>
      <p style={{ maxWidth: '820px', margin: '.5rem auto 0 auto' }}>
        You can now track KPIs, build UTMs, understand funnels, name events cleanly, and run a weekly "Monday Check". This is how a CapeWeb business grows: measure → learn → improve.
      </p>
    </div>
  );
}

function GrowthLoopDiagram() {
  return (
    <svg viewBox="0 0 1200 260" width="100%" height="auto" role="img" aria-label="Growth loop diagram: Ship learn improve">
      <defs>
        <style>
          {`
          .bx{fill:#fff;stroke:#0b0f1a;stroke-width:2;rx:18;}
          .tx{font: 18px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900;}
          .sm{font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#6c757d;}
          .ln{stroke:#0b0f1a;stroke-width:3;opacity:.7;}
          `}
        </style>
        <marker id="p10arr" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a" />
        </marker>
      </defs>

      <rect className="bx" x="70" y="70" width="280" height="110" />
      <text className="tx" x="210" y="120" textAnchor="middle">
        SHIP
      </text>
      <text className="sm" x="210" y="145" textAnchor="middle">
        Launch the page, offer, store, or flow
      </text>

      <rect className="bx" x="460" y="70" width="280" height="110" />
      <text className="tx" x="600" y="120" textAnchor="middle">
        LEARN
      </text>
      <text className="sm" x="600" y="145" textAnchor="middle">
        Measure: traffic, conversion, revenue, drop-offs
      </text>

      <rect className="bx" x="850" y="70" width="280" height="110" />
      <text className="tx" x="990" y="120" textAnchor="middle">
        IMPROVE
      </text>
      <text className="sm" x="990" y="145" textAnchor="middle">
        Fix 1 bottleneck. Repeat weekly.
      </text>

      <line className="ln" x1="350" y1="125" x2="460" y2="125" markerEnd="url(#p10arr)" />
      <line className="ln" x1="740" y1="125" x2="850" y2="125" markerEnd="url(#p10arr)" />

      <path d="M 990 180 C 980 235, 240 235, 210 185" fill="none" className="ln" markerEnd="url(#p10arr)" />
    </svg>
  );
}

function FunnelDiagram() {
  return (
    <svg viewBox="0 0 1200 280" width="100%" height="auto" role="img" aria-label="Ecommerce funnel diagram">
      <defs>
        <style>
          {`
          .s{fill:#fff;stroke:#0b0f1a;stroke-width:2;rx:16;}
          .t{font: 16px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900;}
          .m{font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#6c757d;}
          `}
        </style>
      </defs>

      <rect className="s" x="40" y="80" width="220" height="90" />
      <text className="t" x="150" y="122" textAnchor="middle">
        Sessions
      </text>
      <text className="m" x="150" y="145" textAnchor="middle">
        people arrive
      </text>

      <rect className="s" x="310" y="80" width="220" height="90" />
      <text className="t" x="420" y="122" textAnchor="middle">
        Offer view
      </text>
      <text className="m" x="420" y="145" textAnchor="middle">
        product/service page
      </text>

      <rect className="s" x="580" y="80" width="220" height="90" />
      <text className="t" x="690" y="122" textAnchor="middle">
        Checkout
      </text>
      <text className="m" x="690" y="145" textAnchor="middle">
        start paying
      </text>

      <rect className="s" x="850" y="80" width="310" height="90" />
      <text className="t" x="1005" y="122" textAnchor="middle">
        Purchase / Booking
      </text>
      <text className="m" x="1005" y="145" textAnchor="middle">
        money collected
      </text>

      <path d="M260 125 L310 125" stroke="#0b0f1a" strokeWidth="3" opacity=".7" />
      <path d="M530 125 L580 125" stroke="#0b0f1a" strokeWidth="3" opacity=".7" />
      <path d="M800 125 L850 125" stroke="#0b0f1a" strokeWidth="3" opacity=".7" />

      <text className="m" x="600" y="220" textAnchor="middle">
        CapeWeb improvement rule: fix the biggest drop-off first.
      </text>
    </svg>
  );
}
