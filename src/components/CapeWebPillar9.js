import React from 'react';

export const pillar9QuizQuestions = [
  {
    question: 'Profit and cash are the same thing.',
    options: ['True', 'False'],
    correctIndex: 1,
  },
  {
    question: 'The best "source of truth" for a beginner is:',
    options: ['A simple ledger where every sale is recorded', 'Only memory', 'Only Instagram DMs'],
    correctIndex: 0,
  },
  {
    question: 'Screenshots are reliable proof of payment.',
    options: ['Yes', 'No'],
    correctIndex: 1,
  },
  {
    question: 'The best time to record a sale is:',
    options: ['The same day', 'Once a year'],
    correctIndex: 0,
  },
  {
    question: 'Pricing should include:',
    options: ['Costs + time + fees + profit', 'Only competitor prices'],
    correctIndex: 0,
  },
  {
    question: 'For first 100 sales, the simplest online payment option is often:',
    options: ['A payment link + clear next step', 'A custom app with crypto only'],
    correctIndex: 0,
  },
  {
    question: 'A marketplace is best described as:',
    options: ['A platform with existing traffic where you list products', 'A place to store receipts'],
    correctIndex: 0,
  },
  {
    question: 'Policies help your business because:',
    options: ['They reduce confusion and increase trust', 'They make your logo look nicer'],
    correctIndex: 0,
  },
  {
    question: 'Your "monthly money meeting" should include:',
    options: ['Reconciling payments and updating your ledger', 'Only posting content'],
    correctIndex: 0,
  },
  {
    question: 'A clean finance system makes it easier to:',
    options: ['Apply for funding, prove income, and grow safely', 'Avoid customers forever'],
    correctIndex: 0,
  },
];

export function Pillar9Content() {
  return (
    <>
      {/* SECTION 1 */}
      <div className="mastery-section" data-topic="profit cash revenue costs money truth financial systems">
        <h3>1) The Money Truth: Profit is not cash</h3>
        <p>
          New founders often say: "I made sales, but I'm still broke."
          That's because <strong>profit</strong> and <strong>cash</strong> are different.
        </p>

        <div className="comparison-table-wrapper">
          <table className="capeweb-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>Simple meaning</th>
                <th>Example (product + service)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Revenue</strong></td>
                <td>Money that comes in</td>
                <td>Customer pays for the product + setup service</td>
              </tr>
              <tr>
                <td><strong>Costs</strong></td>
                <td>Money that goes out</td>
                <td>Materials, data, transport, packaging</td>
              </tr>
              <tr>
                <td><strong>Profit</strong></td>
                <td>Revenue − costs</td>
                <td>What's left after you paid the basics</td>
              </tr>
              <tr>
                <td><strong>Cash</strong></td>
                <td>What you can use today</td>
                <td>If the customer pays late, you have low cash</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="workbook-section" style={{ background: '#0b0f1a', color: '#fff', border: '1px solid rgba(255,255,255,.12)', padding: '1.25rem', borderRadius: '12px', marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'start' }}>
            <div style={{ flex: '1', minWidth: '280px' }}>
              <h4 style={{ margin: '0 0 .5rem 0' }}>CapeWeb's "Money River" (simple system)</h4>
              <p style={{ margin: 0, color: 'rgba(255,255,255,.85)' }}>
                The goal is not "more sales." The goal is <strong>more safe sales</strong>:
                paid, delivered, recorded, and repeatable.
              </p>

              <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', marginTop: '1rem' }}>
                <input type="checkbox" data-progress="true" />
                <span>I understand profit and cash are different.</span>
              </label>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                <a href="/contact" target="_blank" rel="noopener noreferrer" className="card-cta"
                   style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.6rem .85rem', borderRadius: '999px', background: '#fff', color: '#0b0f1a', textDecoration: 'none', fontWeight: '900' }}>
                  CapeWeb can install my money system <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <MoneyRiverDiagram />
          </div>
        </div>
      </div>

      <Pillar9RemainingContent />
    </>
  );
}

function Pillar9RemainingContent() {
  return (
    <>
      {/* SECTION 2 */}
      <div className="mastery-section" data-topic="r0 finance setup sales ledger source of truth bookkeeping">
        <h3>2) Your R0 Finance Setup (the minimum you must do)</h3>
        <p>
          You don't need fancy tools. You need <strong>one clean system</strong> that you keep updated.
          CapeWeb calls this your "source of truth."
        </p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🧰 Activity 1: Build your "source of truth" (Sales Ledger)</h4>
          <p style={{ marginTop: '.25rem' }}>
            Every sale must be recorded. This is how you protect your profit and prepare for taxes.
          </p>

          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginTop: '.75rem' }}>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" data-progress="true" />
              <span>I will not mix personal money and business money (as soon as possible).</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" data-progress="true" />
              <span>I will record every sale the same day.</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" data-progress="true" />
              <span>I will store receipts safely (cloud folder).</span>
            </label>
          </div>

          <div style={{ marginTop: '1rem', overflow: 'auto', background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
            <table className="capeweb-table" style={{ minWidth: '980px' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Product / Service</th>
                  <th>Amount (R)</th>
                  <th>Payment Method</th>
                  <th>Cost (R)</th>
                  <th>Profit (R)</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody id="p9-ledger-body">
                <tr>
                  <td><input type="date" style={{ width: '100%', padding: '.5rem', border: '1px solid #CED4DA', borderRadius: '8px' }} /></td>
                  <td><input type="text" placeholder="Name" style={{ width: '100%', padding: '.5rem', border: '1px solid #CED4DA', borderRadius: '8px' }} /></td>
                  <td><input type="text" placeholder="Starter Kit + Setup" style={{ width: '100%', padding: '.5rem', border: '1px solid #CED4DA', borderRadius: '8px' }} /></td>
                  <td><input type="number" step="0.01" placeholder="500" className="p9-amt" style={{ width: '100%', padding: '.5rem', border: '1px solid #CED4DA', borderRadius: '8px' }} /></td>
                  <td>
                    <select style={{ width: '100%', padding: '.5rem', border: '1px solid #CED4DA', borderRadius: '8px' }}>
                      <option>Cash</option>
                      <option>EFT</option>
                      <option>Card (in-person)</option>
                      <option>Payment Link</option>
                      <option>Online Checkout</option>
                    </select>
                  </td>
                  <td><input type="number" step="0.01" placeholder="200" className="p9-cost" style={{ width: '100%', padding: '.5rem', border: '1px solid #CED4DA', borderRadius: '8px' }} /></td>
                  <td><input type="number" step="0.01" placeholder="300" className="p9-profit" style={{ width: '100%', padding: '.5rem', border: '1px solid #CED4DA', borderRadius: '8px' }} readOnly /></td>
                  <td><input type="text" placeholder="Delivered / booked" style={{ width: '100%', padding: '.5rem', border: '1px solid #CED4DA', borderRadius: '8px' }} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <button type="button" id="p9-add-row"
              style={{ padding: '.7rem 1rem', borderRadius: '10px', border: '1px solid #0b0f1a', background: '#0b0f1a', color: '#fff', fontWeight: '900', cursor: 'pointer' }}>
              + Add sale row
            </button>
            <button type="button" id="p9-export-ledger"
              style={{ padding: '.7rem 1rem', borderRadius: '10px', border: '1px solid #0b0f1a', background: '#fff', color: '#0b0f1a', fontWeight: '900', cursor: 'pointer' }}>
              Export ledger as CSV
            </button>
            <button type="button" id="p9-recalc"
              style={{ padding: '.7rem 1rem', borderRadius: '10px', border: '1px solid #0B5ED7', background: '#0B5ED7', color: '#fff', fontWeight: '900', cursor: 'pointer' }}>
              Recalculate profits
            </button>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#E7F1FF', border: '1px solid #CFE2FF' }}>
            <strong>CapeWeb tip:</strong> If you do nothing else, do this ledger. It turns chaos into clarity.
          </div>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="mastery-section" data-topic="payments south africa payfast yoco payment gateway links card">
        <h3>3) Getting Paid in South Africa (pick your payment stack)</h3>
        <p>
          Your first 100 sales need one thing: <strong>easy payment</strong>.
          The customer should never struggle to give you money.
        </p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🧩 Activity 2: Choose your payment stack (beginner-friendly)</h4>
          <p style={{ marginTop: '.25rem' }}>
            Pick one. You can upgrade later.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <label style={{ border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', background: '#fff', display: 'block' }}>
              <input type="radio" name="p9-stack" value="starter" data-progress="true" defaultChecked />
              <div style={{ fontWeight: '900', marginTop: '.35rem' }}>R0 Starter</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>EFT + Cash + 1 Payment Link</div>
              <div style={{ marginTop: '.5rem', fontSize: '.9rem' }}>
                Best for: service bookings, IG sales, WhatsApp sales
              </div>
            </label>

            <label style={{ border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', background: '#fff', display: 'block' }}>
              <input type="radio" name="p9-stack" value="inperson" data-progress="true" />
              <div style={{ fontWeight: '900', marginTop: '.35rem' }}>In‑Person Sales</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Card machine + Payment Links</div>
              <div style={{ marginTop: '.5rem', fontSize: '.9rem' }}>
                Best for: markets, popups, deliveries, home visits
              </div>
            </label>

            <label style={{ border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', background: '#fff', display: 'block' }}>
              <input type="radio" name="p9-stack" value="ecom" data-progress="true" />
              <div style={{ fontWeight: '900', marginTop: '.35rem' }}>Online Store</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Checkout + Gateway + Shipping</div>
              <div style={{ marginTop: '.5rem', fontSize: '.9rem' }}>
                Best for: consistent online orders + scale
              </div>
            </label>
          </div>

          <div id="p9-stack-plan" style={{ marginTop: '1rem', background: '#fff', border: '1px dashed #ADB5BD', borderRadius: '10px', padding: '1rem' }}>
            {/* JS fills */}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <a href="https://registration.payfast.io/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: '900', color: '#0B5ED7' }}>PayFast — register</a>
            <a href="https://payfast.io/features/payment-methods/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: '900', color: '#0B5ED7' }}>PayFast — payment methods</a>
            <a href="https://www.yoco.com/za/payment-link/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: '900', color: '#0B5ED7' }}>Yoco — payment links</a>
            <a href="https://www.yoco.com/za/gateway/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: '900', color: '#0B5ED7' }}>Yoco — payment gateway</a>
            <a href="https://www.ikhokha.com/ik-pay-gateway" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: '900', color: '#0B5ED7' }}>iKhokha — iK Pay Gateway</a>
            <a href="https://merchant.getsnapscan.com/users/sign_up?product=snapstore_pro" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: '900', color: '#0B5ED7' }}>SnapScan — merchant signup</a>
            <a href="https://signup.ozow.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: '900', color: '#0B5ED7' }}>Ozow — merchant signup</a>
            <a href="https://www.peachpayments.com/fees" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: '900', color: '#0B5ED7' }}>Peach Payments — fees</a>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#FFF3CD', border: '1px solid #FFECB5' }}>
            <strong>Golden rule:</strong> don't trust screenshots as proof of payment. Verify in the real dashboard/app before delivering value.
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', marginTop: '.75rem' }}>
              <input type="checkbox" data-progress="true" />
              <span>I will verify payments before delivery/service.</span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 4 */}
      <div className="mastery-section" data-topic="pricing calculator unit economics costs margins profit fees">
        <h3>4) Pricing that protects you (simple unit economics)</h3>
        <p>
          Pricing is not a vibe. It's math. If you charge too little, you work hard and stay stuck.
        </p>

        <PricingCalculatorSection />
      </div>

      {/* SECTION 5 */}
      <div className="mastery-section" data-topic="ecommerce store marketplace takealot shopify payment link">
        <h3>5) eCommerce choices (store vs marketplace vs "link in bio")</h3>
        <p>
          You have three ways to sell online. Smart founders choose the one that matches their stage.
        </p>

        <EcommerceChoicesSection />
      </div>

      {/* SECTION 6 */}
      <div className="mastery-section" data-topic="delivery refunds policies returns trust customer service">
        <h3>6) Delivery, refunds, and trust (this is where profit is saved)</h3>
        <p>
          Your customer doesn't just buy your product/service. They buy <strong>peace of mind</strong>.
          Clear policies reduce refunds, arguments, and stress.
        </p>

        <PolicyTemplatesSection />
      </div>

      {/* SECTION 7 */}
      <div className="mastery-section" data-topic="tax sars bookkeeping monthly meeting reconcile revenue">
        <h3>7) Tax readiness (without fear)</h3>
        <p>
          You don't need to become an accountant today. You just need to be <strong>ready</strong>:
          keep records, know where your money went, and use official channels when needed.
        </p>

        <TaxReadinessSection />
      </div>
    </>
  );
}

export function Pillar9Quiz({ quizResponses, onSelect, onScore, scoreMessage }) {
  return (
    <div className="workbook-section" style={{ background: '#0b0f1a', color: '#fff', border: '1px solid rgba(255,255,255,.12)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
      <h3 style={{ margin: '0 0 .75rem 0' }}>🏁 Pillar 9 Boss Battle: Can you run your money system?</h3>
      <p style={{ margin: 0, color: 'rgba(255,255,255,.85)' }}>Score <strong>8/10</strong> to pass.</p>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
        {pillar9QuizQuestions.map((q, index) => (
          <div key={index} className="quiz-question">
            <p><strong>Q{index + 1}:</strong> {q.question}</p>
            {q.options.map((opt, optIndex) => (
              <label key={optIndex} style={{ display: 'block' }}>
                <input
                  type="radio"
                  name={`p9q${index}`}
                  checked={quizResponses[index] === optIndex}
                  onChange={() => onSelect(index, optIndex)}
                /> {opt}
              </label>
            ))}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onScore}
        style={{ marginTop: '1rem', padding: '.75rem .95rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,.2)', background: '#ffffff', color: '#0b0f1a', fontWeight: '900', cursor: 'pointer' }}
      >
        Score my Boss Battle
      </button>

      <div style={{ marginTop: '.75rem', fontWeight: '900' }}>
        {scoreMessage}
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}>
        <strong>CapeWeb upgrade path:</strong> Once you pass, you're ready for Pillar 10 (Analytics).
        That's where we track conversions, AOV, and funnel drop-offs so your revenue compounds.
        <div style={{ marginTop: '.5rem' }}>
          <a href="/contact" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontWeight: '900', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,.35)' }}>
            Want CapeWeb to build + optimize your store monthly? Click here →
          </a>
        </div>
      </div>
    </div>
  );
}

export function Pillar9Completion() {
  return (
    <div className="completion-box" style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed #CED4DA' }}>
      <h3>🎉 Pillar 9 Complete</h3>
      <p style={{ maxWidth: '800px', margin: '.5rem auto 0 auto' }}>
        You now have a payments plan, a pricing calculator, a ledger system, and an eCommerce path.
        Your business is becoming stable and scalable — the CapeWeb way.
      </p>
    </div>
  );
}

function MoneyRiverDiagram() {
  return (
    <div style={{ flex: '1', minWidth: '320px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '12px', padding: '1rem' }}>
      <div style={{ fontWeight: '900', marginBottom: '.5rem' }}>Diagram: Money River</div>
      <svg viewBox="0 0 880 220" width="100%" height="auto" role="img" aria-label="Money river diagram from customer payment to recorded sale">
        <defs>
          <linearGradient id="p9grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#22D3EE" />
            <stop offset="1" stopColor="#FDE047" />
          </linearGradient>
        </defs>

        <rect x="20" y="70" width="170" height="55" rx="14" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.18)" />
        <text x="105" y="104" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">Customer</text>

        <line x1="190" y1="97" x2="265" y2="97" stroke="url(#p9grad)" strokeWidth="4" />
        <polygon points="265,97 250,89 250,105" fill="#FDE047" />

        <rect x="270" y="70" width="190" height="55" rx="14" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.18)" />
        <text x="365" y="104" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">Payment</text>

        <line x1="460" y1="97" x2="535" y2="97" stroke="url(#p9grad)" strokeWidth="4" />
        <polygon points="535,97 520,89 520,105" fill="#FDE047" />

        <rect x="540" y="70" width="150" height="55" rx="14" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.18)" />
        <text x="615" y="104" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">Deliver</text>

        <line x1="690" y1="97" x2="765" y2="97" stroke="url(#p9grad)" strokeWidth="4" />
        <polygon points="765,97 750,89 750,105" fill="#FDE047" />

        <rect x="770" y="70" width="90" height="55" rx="14" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.18)" />
        <text x="815" y="104" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">Record</text>

        <text x="440" y="160" textAnchor="middle" fill="rgba(255,255,255,.85)" fontSize="13">
          If you skip "Record", you build a stressful business.
        </text>
      </svg>
    </div>
  );
}

function PricingCalculatorSection() {
  return (
    <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
      <h4>🧮 Activity 3: Pricing Calculator (Product + Service)</h4>
      <p style={{ marginTop: '.25rem' }}>
        Enter your costs. Choose your margin. The calculator suggests a price.
        (This is education, not tax advice — use it as a guide and adjust.)
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '.75rem', marginTop: '1rem' }}>
        <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
          <label style={{ fontWeight: '900', display: 'block' }}>Product cost (R)</label>
          <input id="p9-cost-product" type="number" step="0.01" placeholder="e.g. 120" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
          <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>Materials, packaging, etc.</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
          <label style={{ fontWeight: '900', display: 'block' }}>Service time (hours)</label>
          <input id="p9-service-hours" type="number" step="0.1" placeholder="e.g. 1.5" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
          <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>Setup, delivery, consult, install</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
          <label style={{ fontWeight: '900', display: 'block' }}>Your hourly rate goal (R/hr)</label>
          <input id="p9-hourly-rate" type="number" step="0.01" placeholder="e.g. 150" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
          <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>What you want to earn for time</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
          <label style={{ fontWeight: '900', display: 'block' }}>Delivery / travel cost (R)</label>
          <input id="p9-cost-delivery" type="number" step="0.01" placeholder="e.g. 40" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
          <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>Fuel, taxi, courier, etc.</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
          <label style={{ fontWeight: '900', display: 'block' }}>Payment fee estimate (%)</label>
          <input id="p9-fee-pct" type="number" step="0.1" placeholder="e.g. 3" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
          <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>Card/payment link fees vary</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
          <label style={{ fontWeight: '900', display: 'block' }}>Target profit margin (%)</label>
          <input id="p9-margin-pct" type="number" step="0.1" placeholder="e.g. 30" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
          <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>After costs (goal)</div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
        <button type="button" id="p9-calc-price"
          style={{ padding: '.75rem 1rem', borderRadius: '10px', border: '1px solid #0B5ED7', background: '#0B5ED7', color: '#fff', fontWeight: '900', cursor: 'pointer' }}>
          Calculate suggested price
        </button>
        <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', background: '#fff', border: '1px solid #E9ECEF', padding: '.55rem .8rem', borderRadius: '999px' }}>
          <input type="checkbox" data-progress="true" />
          <span>I will never price below my real costs.</span>
        </label>
      </div>

      <div id="p9-price-output" style={{ marginTop: '1rem', background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
        <div style={{ color: '#6c757d' }}>Enter numbers and click calculate.</div>
      </div>

      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: '900', color: '#0B5ED7' }}>What if my price feels "too high"?</summary>
        <div style={{ marginTop: '.5rem', borderLeft: '3px solid #0B5ED7', paddingLeft: '1rem' }}>
          <p style={{ margin: 0 }}>
            Then your job is to increase value and trust (clear offer, proof, guarantee, fast delivery) — not to destroy your profit.
            CapeWeb helps here with <strong>conversion-first pages</strong>, <strong>performance</strong>, and <strong>messaging that converts</strong>.
          </p>
        </div>
      </details>
    </div>
  );
}

function EcommerceChoicesSection() {
  return (
    <>
      <div className="comparison-table-wrapper">
        <table className="capeweb-table">
          <thead>
            <tr>
              <th>Path</th>
              <th>Best for</th>
              <th>Trade-off</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Payment Link + WhatsApp</strong></td>
              <td>Fast first sales, simple setup</td>
              <td>More manual admin</td>
            </tr>
            <tr>
              <td><strong>Marketplace</strong></td>
              <td>Big traffic, faster trust</td>
              <td>Fees + less brand control</td>
            </tr>
            <tr>
              <td><strong>Your own Store</strong></td>
              <td>Brand + repeat customers</td>
              <td>Needs setup + marketing</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
        <h4>🧭 Activity 4: Choose your eCommerce path</h4>
        <p style={{ marginTop: '.25rem' }}>Pick one for the next 30 days. You can add the others later.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '.75rem', marginTop: '1rem' }}>
          <label style={{ border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', background: '#fff', display: 'block' }}>
            <input type="radio" name="p9-ecom" value="link" data-progress="true" defaultChecked />
            <div style={{ fontWeight: '900', marginTop: '.35rem' }}>Link-in-bio commerce</div>
            <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Payment link + booking link</div>
            <div style={{ marginTop: '.5rem', fontSize: '.9rem' }}>
              Tools: <a href="https://www.yoco.com/za/payment-link/" target="_blank" rel="noopener noreferrer">Yoco link</a> or
              <a href="https://registration.payfast.io/" target="_blank" rel="noopener noreferrer">PayFast</a>
            </div>
          </label>

          <label style={{ border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', background: '#fff', display: 'block' }}>
            <input type="radio" name="p9-ecom" value="market" data-progress="true" />
            <div style={{ fontWeight: '900', marginTop: '.35rem' }}>Marketplace</div>
            <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Sell where traffic already exists</div>
            <div style={{ marginTop: '.5rem', fontSize: '.9rem' }}>
              <a href="https://www.takealot.com/sell" target="_blank" rel="noopener noreferrer">Takealot</a> •
              <a href="https://www.bobshop.co.za/content/153/Sell_on_Bob_Shop.html" target="_blank" rel="noopener noreferrer">Bob Shop</a> •
              <a href="https://sellercentral.amazon.co.za/" target="_blank" rel="noopener noreferrer">Amazon.co.za</a>
            </div>
          </label>

          <label style={{ border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', background: '#fff', display: 'block' }}>
            <input type="radio" name="p9-ecom" value="store" data-progress="true" />
            <div style={{ fontWeight: '900', marginTop: '.35rem' }}>Your own store</div>
            <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Best long-term control</div>
            <div style={{ marginTop: '.5rem', fontSize: '.9rem' }}>
              Example: <a href="https://www.shopstar.co.za/" target="_blank" rel="noopener noreferrer">Shopstar</a> / Shopify / WooCommerce
            </div>
          </label>
        </div>

        <div id="p9-ecom-plan" style={{ marginTop: '1rem', background: '#fff', border: '1px dashed #ADB5BD', borderRadius: '10px', padding: '1rem' }}>
          {/* JS fills */}
        </div>

        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#0b0f1a', color: '#fff' }}>
          <strong>CapeWeb advantage:</strong> we build <strong>performance-first stores</strong> (Core Web Vitals),
          connect the right payment gateway, and set up tracking so you can improve sales monthly.
          <div style={{ marginTop: '.75rem' }}>
            <a href="/contact" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.6rem .85rem', borderRadius: '999px', background: '#fff', color: '#0b0f1a', textDecoration: 'none', fontWeight: '900' }}>
              Build my fast store with CapeWeb <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      <EcommerceFlowDiagram />
    </>
  );
}

function EcommerceFlowDiagram() {
  return (
    <figure style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #E9ECEF', borderRadius: '10px', background: '#fff' }}>
      <div style={{ fontWeight: '900', marginBottom: '.5rem' }}>Diagram: eCommerce flow that converts</div>
      <svg viewBox="0 0 1200 250" width="100%" height="auto" role="img" aria-label="Ecommerce conversion flow diagram">
        <defs>
          <style>{`
            .bx{fill:#fff;stroke:#0b0f1a;stroke-width:2;}
            .tx{font: 16px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900;}
            .sm{font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#6c757d;}
          `}</style>
          <marker id="p9arr" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a" />
          </marker>
        </defs>

        <rect className="bx" x="30" y="70" width="170" height="70" rx="16" />
        <text className="tx" x="115" y="105" textAnchor="middle">Traffic</text>
        <text className="sm" x="115" y="127" textAnchor="middle">IG / Google / ads</text>

        <line x1="200" y1="105" x2="270" y2="105" stroke="#0b0f1a" strokeWidth="3" markerEnd="url(#p9arr)" />

        <rect className="bx" x="270" y="70" width="210" height="70" rx="16" />
        <text className="tx" x="375" y="105" textAnchor="middle">Offer page</text>
        <text className="sm" x="375" y="127" textAnchor="middle">clear benefits</text>

        <line x1="480" y1="105" x2="550" y2="105" stroke="#0b0f1a" strokeWidth="3" markerEnd="url(#p9arr)" />

        <rect className="bx" x="550" y="70" width="210" height="70" rx="16" />
        <text className="tx" x="655" y="105" textAnchor="middle">Checkout</text>
        <text className="sm" x="655" y="127" textAnchor="middle">fast + trusted</text>

        <line x1="760" y1="105" x2="830" y2="105" stroke="#0b0f1a" strokeWidth="3" markerEnd="url(#p9arr)" />

        <rect className="bx" x="830" y="70" width="160" height="70" rx="16" />
        <text className="tx" x="910" y="105" textAnchor="middle">Pay</text>
        <text className="sm" x="910" y="127" textAnchor="middle">link/gateway</text>

        <line x1="990" y1="105" x2="1100" y2="105" stroke="#0b0f1a" strokeWidth="3" markerEnd="url(#p9arr)" />

        <rect className="bx" x="1100" y="70" width="70" height="70" rx="16" />
        <text className="tx" x="1135" y="105" textAnchor="middle">Win</text>
        <text className="sm" x="1135" y="127" textAnchor="middle">sale</text>

        <text className="sm" x="600" y="190" textAnchor="middle">
          CapeWeb builds this flow with speed + trust + tracking, then improves it every month.
        </text>
      </svg>

      <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', marginTop: '.75rem' }}>
        <input type="checkbox" data-progress="true" />
        <span>I understand the conversion flow: traffic → offer → checkout → pay → deliver → record.</span>
      </label>
    </figure>
  );
}

function PolicyTemplatesSection() {
  return (
    <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
      <h4>🧾 Activity 5: Copy/paste policy templates (edit to fit your business)</h4>
      <p style={{ marginTop: '.25rem' }}>Keep them short. Keep them honest. Put them on your website or send via WhatsApp.</p>

      <details style={{ marginTop: '.75rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: '900', color: '#0B5ED7' }}>Payment policy (simple)</summary>
        <div style={{ marginTop: '.5rem', borderLeft: '3px solid #0B5ED7', paddingLeft: '1rem' }}>
          <p><strong>Payments:</strong> We accept payments through our official payment link / checkout and verified EFT details.</p>
          <p><strong>Proof:</strong> We do not accept screenshots as proof of payment. We confirm payment in our dashboard/bank before delivery.</p>
          <p><strong>Safety:</strong> We will never DM random payment links from personal accounts.</p>
        </div>
      </details>

      <details style={{ marginTop: '.75rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: '900', color: '#0B5ED7' }}>Delivery / service policy (simple)</summary>
        <div style={{ marginTop: '.5rem', borderLeft: '3px solid #0B5ED7', paddingLeft: '1rem' }}>
          <p><strong>Delivery area:</strong> We operate in Cape Town.</p>
          <p><strong>Time:</strong> Delivery/service times depend on stock and schedule. We confirm by message after payment.</p>
          <p><strong>Missed appointments:</strong> If you miss a booked time, we reschedule once at no cost (optional).</p>
        </div>
      </details>

      <details style={{ marginTop: '.75rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: '900', color: '#0B5ED7' }}>Refunds / returns policy (simple)</summary>
        <div style={{ marginTop: '.5rem', borderLeft: '3px solid #0B5ED7', paddingLeft: '1rem' }}>
          <p><strong>Returns:</strong> Returns are accepted for faulty items within a reasonable period (define your period).</p>
          <p><strong>Condition:</strong> Items must be returned in original condition (unless faulty).</p>
          <p><strong>Services:</strong> For services already delivered, refunds are not offered unless agreed in writing.</p>
        </div>
      </details>

      <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', marginTop: '1rem' }}>
        <input type="checkbox" data-progress="true" />
        <span>I created (or copied) a payment + delivery + refunds policy.</span>
      </label>

      <div style={{ marginTop: '1rem', background: '#E6F4EA', border: '1px solid #C7E7D1', padding: '1rem', borderRadius: '10px' }}>
        <strong>✅ CapeWeb move:</strong> We can write your policy pages clearly and integrate them into your store checkout, so customers trust faster.
      </div>
    </div>
  );
}

function TaxReadinessSection() {
  return (
    <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
      <h4>🗓️ Activity 6: Your monthly "money meeting" (30 minutes)</h4>
      <p style={{ marginTop: '.25rem' }}>Do this monthly and your business will feel calm.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '.75rem', marginTop: '1rem' }}>
        <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
          <input type="checkbox" data-progress="true" />
          <span>I reconciled: my bank/payments match my ledger.</span>
        </label>
        <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
          <input type="checkbox" data-progress="true" />
          <span>I listed: who still owes me money (if any).</span>
        </label>
        <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
          <input type="checkbox" data-progress="true" />
          <span>I calculated: how much profit I made (not just revenue).</span>
        </label>
        <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
          <input type="checkbox" data-progress="true" />
          <span>I saved a small buffer for tax/fees (even if small).</span>
        </label>
      </div>

      <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #DEE2E6', padding: '1rem', borderRadius: '10px' }}>
        <strong>Official SA resources (use these, not random guesses):</strong>
        <ul style={{ margin: '.6rem 0 0 1.25rem' }}>
          <li><a href="https://www.sars.gov.za/businesses-and-employers/small-businesses-taxpayers/" target="_blank" rel="noopener noreferrer">SARS — Small business taxpayers</a></li>
          <li><a href="https://www.sars.gov.za/businesses-and-employers/small-businesses-taxpayers/starting-a-business-and-tax/registering/" target="_blank" rel="noopener noreferrer">SARS — registering + eFiling</a></li>
        </ul>
        <p style={{ margin: '.75rem 0 0', color: '#6c757d' }}>
          If you're unsure about tax obligations, speak to a registered professional. CapeWeb can connect you with the right next step,
          but this course content is educational.
        </p>
      </div>
    </div>
  );
}
