import React, { useState, useEffect } from 'react';

const getPillar7Playbook = (context = {}) => {
  const sector = (context.sector || '').toLowerCase();
  const geography = context.geography || 'South Africa';
  if (sector.includes('township') || sector.includes('retail')) {
    return {
      summary: `Start with WhatsApp + Google Forms → Sheet → manual follow-up. Automate proof of payment + booking reminders for ${geography}.`,
      recommendedStack: 'r0',
      quickWins: [
        'Add Google Form + Sheet for every WhatsApp enquiry.',
        'Automate “thanks + next step” with WhatsApp quick replies.',
        'Use a weekly “leads to follow-up” reminder via Google Calendar.',
      ],
    };
  }
  if (/services|agency|consult/.test(sector)) {
    return {
      summary: 'Move into a CRM stack fast: pipelines, templated follow-ups, and calendar automation to cut no-shows.',
      recommendedStack: 'crm',
      quickWins: [
        'Create pipeline stages (New, Qualified, Proposal, Won/Lost).',
        'Automate booking confirmations + reminders.',
        'Use task reminders to chase proposals every 48h.',
      ],
    };
  }
  if (/technology|saas/.test(sector)) {
    return {
      summary: 'Layer automation early: lead scoring, webhook-driven follow-ups, and AI assistants for support.',
      recommendedStack: 'automation',
      quickWins: [
        'Connect product signups → CRM via Zapier/Make.',
        'Trigger onboarding emails/SMS/WhatsApp automatically.',
        'Build Deepseek prompts for support triage.',
      ],
    };
  }
  return {
    summary: 'Pick the simplest stack that removes manual follow-ups. Track every lead in one place and automate reminders.',
    recommendedStack: 'r0',
    quickWins: [],
  };
};

// Quiz questions for Pillar 7
export const pillar7QuizQuestions = [
  {
    question: 'What is the best first automation for a R0 founder?',
    options: ['Lead capture → follow-up', 'Build a custom AI agent with 20 tools', 'Redesign your logo again'],
    correctIndex: 0,
  },
  {
    question: 'What should AI NOT do in customer chat?',
    options: ['Draft a friendly reply', 'Invent facts, prices, or legal claims', 'Summarize a long message'],
    correctIndex: 1,
  },
  {
    question: 'What is a "trigger"?',
    options: ['The event that starts a workflow', 'A discount code', 'Your business name'],
    correctIndex: 0,
  },
  {
    question: 'What is the fastest way to reduce no-shows?',
    options: ['Post more reels', 'Automated reminders + clear booking confirmation', 'Change your brand colors'],
    correctIndex: 1,
  },
  {
    question: 'What should your CRM pipeline do for you?',
    options: ['Stop you from forgetting leads', 'Make coffee', 'Replace your product completely'],
    correctIndex: 0,
  },
  {
    question: 'Before marketing on WhatsApp, what must you have?',
    options: ['Clear opt-in / permission', 'A viral TikTok', 'A 40-page business plan'],
    correctIndex: 0,
  },
];

// Main Pillar 7 component (not used directly, exports parts)
export default function CapeWebPillar7() {
  return null;
}

// Content component
export function Pillar7Content({
  personalizationContext = {},
  stack,
  setStack,
  bizName,
  setBizName,
  bizOffer,
  setBizOffer,
  bizArea,
  setBizArea,
  bizLink,
  setBizLink,
  promptRole,
  setPromptRole,
  promptTask,
  setPromptTask,
  promptRules,
  setPromptRules,
  promptFormat,
  setPromptFormat,
}) {
  const [playbookGenerated, setPlaybookGenerated] = useState(false);
  const [promptGenerated, setPromptGenerated] = useState(false);
  const [quiz1Score, setQuiz1Score] = useState(null);
  const [quiz1Q1, setQuiz1Q1] = useState('');
  const [quiz1Q2, setQuiz1Q2] = useState('');
  const playbook = getPillar7Playbook(personalizationContext);
  const personaLabel = personalizationContext?.sector || 'Business';

  useEffect(() => {
    if (!stack && playbook.recommendedStack) {
      setStack(playbook.recommendedStack);
    }
  }, [stack, setStack, playbook.recommendedStack]);

  const getStackOutput = () => {
    const common = (
      <>
        <div style={{ fontWeight: 900, marginBottom: '.35rem' }}>Your setup checklist</div>
        <ul style={{ margin: '.35rem 0 0 1.25rem' }}>
          <li><strong>One inbox:</strong> pick ONE main channel to reply from first (WhatsApp is common).</li>
          <li><strong>One lead list:</strong> every lead goes into ONE place (sheet or CRM).</li>
          <li><strong>One next step:</strong> every reply ends with a clear action (book / buy / reply "YES").</li>
        </ul>
      </>
    );

    const blocks = {
      r0: (
        <>
          {common}
          <hr style={{ border: 'none', borderTop: '1px solid #DEE2E6', margin: '.9rem 0' }} />
          <div style={{ fontWeight: 900 }}>R0 Starter Stack</div>
          <ol style={{ margin: '.35rem 0 0 1.25rem' }}>
            <li>Google Form (lead capture)</li>
            <li>Google Sheet (lead list)</li>
            <li>Gmail templates (follow-ups)</li>
            <li>WhatsApp Business (quick replies + labels)</li>
          </ol>
          <div style={{ marginTop: '.6rem', color: '#6c757d' }}>
            Perfect for: first 10–30 leads when you need speed, not complexity.
          </div>
        </>
      ),
      crm: (
        <>
          {common}
          <hr style={{ border: 'none', borderTop: '1px solid #DEE2E6', margin: '.9rem 0' }} />
          <div style={{ fontWeight: 900 }}>Free CRM Upgrade</div>
          <ol style={{ margin: '.35rem 0 0 1.25rem' }}>
            <li>HubSpot CRM pipeline stages (New → Qualified → Pending → Won/Lost)</li>
            <li>One form on your website/landing page</li>
            <li>Email templates for follow-ups</li>
          </ol>
          <div style={{ marginTop: '.6rem', color: '#6c757d' }}>
            Perfect for: first 100 sales when leads start piling up and you need organization.
          </div>
        </>
      ),
      automation: (
        <>
          {common}
          <hr style={{ border: 'none', borderTop: '1px solid #DEE2E6', margin: '.9rem 0' }} />
          <div style={{ fontWeight: 900 }}>No-Code Automations</div>
          <ol style={{ margin: '.35rem 0 0 1.25rem' }}>
            <li>Pick one tool: Zapier (simple), Make (powerful), or n8n (self-hosted)</li>
            <li>Connect: form → sheet/CRM → email follow-up</li>
            <li>Add logging: keep a "automation log" sheet so you can troubleshoot</li>
          </ol>
          <div style={{ marginTop: '.6rem', color: '#6c757d' }}>
            Perfect for: when you're repeating the same steps every day.
          </div>
        </>
      ),
    };

    const currentStack = stack || playbook.recommendedStack || 'r0';
    return blocks[currentStack] || blocks.r0;
  };

  const generatePlaybook = () => {
    setPlaybookGenerated(true);
  };

  const generatePrompt = () => {
    setPromptGenerated(true);
  };

  const checkQuiz1 = () => {
    let score = 0;
    if (quiz1Q1 === 'true') score++;
    if (quiz1Q2 === 'true') score++;
    setQuiz1Score(score);
  };

  const getPlaybookTemplates = () => {
    const name = bizName.trim() || 'Your Business';
    const offer = bizOffer.trim() || 'your offer';
    const area = bizArea.trim() || 'Cape Town';
    const link = bizLink.trim() || '[your link]';

    return [
      {
        title: '1) Price question',
        text: `Hi 👋 Thanks for messaging ${name}. Quick question so I can price correctly: is this for (A) product only, (B) service only, or (C) product + service?\n\nHere's the next step: ${link}`,
      },
      {
        title: '2) Availability / booking',
        text: `Awesome — we can help. We operate in ${area}. You can book your slot here: ${link}\n\nIf you prefer, tell me: (1) your area, (2) your preferred day/time, and I'll confirm.`,
      },
      {
        title: '3) "I\'m interested but not ready"',
        text: `No stress — most people need a little time. Want me to remind you in 2 days or 7 days?\n\nReply "2" or "7" and I'll follow up.`,
      },
      {
        title: '4) Proof / confidence builder',
        text: `Great choice. Here's what you get with ${offer}:\n• Clear next steps\n• Fast delivery / turnaround\n• Support if you get stuck\n\nReady for the link? ${link}`,
      },
      {
        title: '5) Review request',
        text: `Thank you for choosing ${name} 🙏 If everything was good, could you leave a quick review? It helps a small Cape Town business grow.\n\nReply "YES" and I'll send the review link.`,
      },
    ];
  };

  const getGeneratedPrompt = () => {
    const role = promptRole.trim() || 'You are my assistant for a small business.';
    const task = promptTask.trim() || 'Help me write a customer reply.';
    const rules = promptRules.trim() || 'Keep it short. Ask 1 clarifying question. Do not invent facts. If unsure, ask what you need.';
    const format = promptFormat.trim() || '1 WhatsApp message + 1 follow-up option.';

    return `ROLE:\n${role}\n\nTASK:\n${task}\n\nRULES:\n${rules}\n\nOUTPUT FORMAT:\n${format}`;
  };

  return (
    <>
      {/* SECTION 1 */}
      <div className="mastery-section">
        <h3>1) The 2AM Problem (and why CapeWeb starts here)</h3>
        <p>
          Meet our example founder: <strong>25 years old</strong>, living in <strong>Cape Town</strong>, starting with <strong>R0</strong>.
          They're selling a <strong>product</strong> (a small physical item or digital download) <em>and</em> offering a <strong>service</strong>
          (setup, consulting, delivery, installation, lessons—any service).
        </p>
        <p>
          The problem is never "no ideas". The real problem is this:
          <strong>leads arrive when you're busy</strong> (or asleep), and you lose sales because you reply too late.
        </p>

        <div className="workbook-section" style={{ background: '#0b0f1a', color: '#ffffff', border: '1px solid rgba(255,255,255,.12)', padding: '1.25rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h4 style={{ margin: '0 0 .5rem 0' }}>🧭 CapeWeb's Rule</h4>
              <p style={{ margin: 0, color: 'rgba(255,255,255,.85)' }}>
                If a customer messages you at 2AM, your business should still guide them to the next step:
                <strong>price</strong> → <strong>proof</strong> → <strong>pay / book</strong>.
              </p>
              <p style={{ margin: '.75rem 0 0 0', color: 'rgba(255,255,255,.85)' }}>
                That's what CapeWeb builds: <strong>Automated assistants + booking flows + follow-ups</strong>.
              </p>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                <a href="/contact" target="_blank" rel="noopener noreferrer" className="card-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.65rem .9rem', borderRadius: '999px', background: '#ffffff', color: '#0b0f1a', textDecoration: 'none', fontWeight: 700 }}>
                  Let's Talk <span aria-hidden="true">→</span>
                </a>
                <a href="https://help.openai.com/en/articles/8313428" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.65rem .9rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,.25)', color: '#fff', textDecoration: 'none' }}>
                  Why AI can be wrong
                </a>
              </div>
            </div>

            {/* Diagram */}
            <div style={{ flex: 1, minWidth: '300px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontWeight: 800, marginBottom: '.5rem' }}>Diagram: Manual vs "Always-On"</div>
              <ManualVsAlwaysOnDiagram />
              <p style={{ margin: '.65rem 0 0 0', color: 'rgba(255,255,255,.82)', fontSize: '.95rem' }}>
                Your goal: <strong>shrink time-to-response</strong> and keep the customer moving.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="mastery-section">
        <h3>2) AI vs Automation (simple explanation)</h3>
        <p>
          <strong>Automation</strong> is a set of rules: "When X happens, do Y."<br />
          <strong>AI</strong> is a helper brain for messy tasks: writing, summarizing, categorizing, answering FAQs (with guardrails).
        </p>

        <div className="comparison-table-wrapper">
          <table className="capeweb-table">
            <thead>
              <tr>
                <th>Thing</th>
                <th>Best for</th>
                <th>Example in a Cape Town startup</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Automation</strong></td>
                <td>Repeating tasks</td>
                <td>When a form is submitted → save lead → send a follow-up</td>
              </tr>
              <tr>
                <td><strong>AI</strong></td>
                <td>Language + decisions (with limits)</td>
                <td>Turn a messy WhatsApp voice note into a neat quote request</td>
              </tr>
              <tr>
                <td><strong>AI + Automation</strong></td>
                <td>Scale without chaos</td>
                <td>Auto-triage leads → route to CRM stage → send the right reply</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>📝 Activity 1: Your "Invisible Team" List</h4>
          <p style={{ marginTop: '.25rem' }}>
            Tick what you want your business to do even when you are offline. (This powers your progress bar.)
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '.65rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input data-progress="true" type="checkbox" />
              <span><strong>Capture leads</strong> from IG/website into a list</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input data-progress="true" type="checkbox" />
              <span><strong>Reply fast</strong> with a helpful first message</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input data-progress="true" type="checkbox" />
              <span><strong>Send a booking link</strong> + reminders</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input data-progress="true" type="checkbox" />
              <span><strong>Follow up</strong> if the customer goes quiet</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input data-progress="true" type="checkbox" />
              <span><strong>Collect reviews</strong> after delivery/service</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input data-progress="true" type="checkbox" />
              <span><strong>Tag customers</strong> (new lead / paid / repeat)</span>
            </label>
          </div>

          <details className="quiz-answer" style={{ marginTop: '1rem', cursor: 'pointer' }}>
            <summary style={{ color: '#0B5ED7', fontWeight: 700 }}>Why this matters</summary>
            <div className="answer-content" style={{ marginTop: '.6rem', paddingLeft: '1rem', borderLeft: '3px solid #0B5ED7' }}>
              <p style={{ margin: 0 }}>
                You're building a business with <strong>zero budget</strong>. Time is your currency. Automation gives you time back,
                so you can do the only work that matters early on: <strong>talk to customers</strong> and <strong>make the first 100 sales</strong>.
              </p>
            </div>
          </details>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="mastery-section">
        <h3>3) The CapeWeb Stack (R0 first, then upgrade)</h3>
        <p>
          You don't start with fancy tools. You start with a simple spine, then you add muscle.
          CapeWeb uses the same logic for client builds: <strong>simple → stable → scalable</strong>.
        </p>
        {playbook.summary ? (
          <div className="context-banner">
            <strong>{personaLabel} focus:</strong> {playbook.summary}
          </div>
        ) : null}

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🧰 Activity 2: Pick Your Stack (and get a setup checklist)</h4>
          <p style={{ marginTop: '.25rem' }}>Choose one. Don't overthink. Your first 100 sales do not need a "perfect stack".</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <label style={{ border: '1px solid #DEE2E6', borderRadius: '10px', padding: '.9rem', background: '#fff', display: 'block' }}>
              <input data-progress="true" type="radio" name="p7-stack" value="r0" checked={stack === 'r0'} onChange={(e) => setStack(e.target.value)} />
              <div style={{ fontWeight: 800, marginTop: '.35rem' }}>R0 Starter</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Google Forms + Sheets + Gmail + WhatsApp Business</div>
            </label>

            <label style={{ border: '1px solid #DEE2E6', borderRadius: '10px', padding: '.9rem', background: '#fff', display: 'block' }}>
              <input data-progress="true" type="radio" name="p7-stack" value="crm" checked={stack === 'crm'} onChange={(e) => setStack(e.target.value)} />
              <div style={{ fontWeight: 800, marginTop: '.35rem' }}>Free CRM Upgrade</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>HubSpot CRM + Forms + Email templates</div>
            </label>

            <label style={{ border: '1px solid #DEE2E6', borderRadius: '10px', padding: '.9rem', background: '#fff', display: 'block' }}>
              <input data-progress="true" type="radio" name="p7-stack" value="automation" checked={stack === 'automation'} onChange={(e) => setStack(e.target.value)} />
              <div style={{ fontWeight: 800, marginTop: '.35rem' }}>No-Code Automations</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Zapier / Make / n8n for workflows</div>
            </label>
          </div>
          {playbook.recommendedStack ? (
            <div className="context-tip">
              CapeWeb suggests starting with <strong>{playbook.recommendedStack.toUpperCase()}</strong> for {personaLabel.toLowerCase()} teams. You can upgrade once leads pile up.
            </div>
          ) : null}

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px dashed #ADB5BD', borderRadius: '10px', padding: '1rem' }}>
            {getStackOutput()}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <a href="https://www.hubspot.com/products/crm" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700, color: '#0B5ED7' }}>HubSpot CRM (Free)</a>
            <a href="https://help.zapier.com/hc/en-us/articles/22234847450893-Zaps-quick-start-guide" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700, color: '#0B5ED7' }}>Zapier Quickstart</a>
            <a href="https://help.make.com/webhooks" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700, color: '#0B5ED7' }}>Make Webhooks</a>
            <a href="https://docs.n8n.io/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 700, color: '#0B5ED7' }}>n8n Docs</a>
          </div>
        </div>

        <div className="workbook-section" style={{ background: '#0b0f1a', color: '#fff', border: '1px solid rgba(255,255,255,.12)', padding: '1.25rem', borderRadius: '10px', marginTop: '1.25rem' }}>
          <h4 style={{ margin: '0 0 .5rem 0' }}>CapeWeb Implementation (what we do for clients)</h4>
          <p style={{ margin: 0, color: 'rgba(255,255,255,.85)' }}>
            When you're ready, CapeWeb installs:
            <strong>AI chat + WhatsApp automations</strong>, <strong>lead routing + CRM sync</strong>,
            <strong>booking flows + reminders</strong>, and <strong>reply playbooks + SOPs</strong>
            so your business can keep selling while you build.
          </p>
          <div style={{ marginTop: '.9rem' }}>
            <a href="/contact" target="_blank" rel="noopener noreferrer" className="card-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.65rem .9rem', borderRadius: '999px', background: '#ffffff', color: '#0b0f1a', textDecoration: 'none', fontWeight: 800 }}>
              Get CapeWeb to build it <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 4 - Continue in next part due to length */}
      <div className="mastery-section">
        <h3>4) Build Automation #1: "Lead Capture → Follow-Up"</h3>
        <p>
          This is the first automation CapeWeb uses to help founders reach their first sales.
          It works for <strong>any</strong> business: product, service, or both.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: '1rem', alignItems: 'start' }}>
          <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
            <h4>🧩 Step-by-step (R0 version)</h4>
            <ol style={{ marginTop: '.5rem' }}>
              <li>Create a simple lead form (Name, Phone, What they want, When they want it).</li>
              <li>Connect it to a spreadsheet (your "lead list").</li>
              <li>Auto-send a follow-up message (email first; WhatsApp next).</li>
              <li>Add a "next step" link (book / buy / reply with one word).</li>
            </ol>

            <div style={{ marginTop: '1rem', borderRadius: '10px', background: '#fff', border: '1px solid #DEE2E6', padding: '1rem' }}>
              <div style={{ fontWeight: 800 }}>Diagram: The Simple Spine</div>
              <LeadCaptureFlowDiagram />
              <div style={{ color: '#6c757d', fontSize: '.95rem', marginTop: '.5rem' }}>
                Start with email follow-ups, then add WhatsApp once your flow is stable.
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <a href="https://developers.google.com/apps-script/guides/triggers/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 800, color: '#0B5ED7' }}>
                Google Apps Script Triggers (for automation)
              </a>
            </div>
          </div>

          <div className="workbook-section" style={{ background: '#fff', border: '1px solid #DEE2E6', padding: '1.5rem', borderRadius: '10px' }}>
            <h4>⚙️ Optional: One tiny script (advanced, but copyable)</h4>
            <p style={{ color: '#6c757d', marginTop: '.25rem' }}>
              If you want the spreadsheet to email you every time a lead comes in, this is the idea:
            </p>
            <pre style={{ background: '#0b0f1a', color: '#fff', padding: '1rem', borderRadius: '10px', overflow: 'auto', fontSize: '.9rem' }}><code>{`// Apps Script (concept example)
// Trigger: On form submit (in Google Sheets)
function onFormSubmit(e) {
  var row = e.values; // new submission row
  var name = row[1];
  var phone = row[2];
  var need = row[3];

  MailApp.sendEmail({
    to: "you@yourdomain.com",
    subject: "New lead: " + name,
    htmlBody: "<b>Phone:</b> " + phone + "<br/>" +
              "<b>Need:</b> " + need + "<br/>" +
              "Reply fast. Your first 100 sales need speed."
  });
}`}</code></pre>

            <details style={{ marginTop: '.75rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 800, color: '#0B5ED7' }}>When should you NOT do this?</summary>
              <div style={{ marginTop: '.5rem', borderLeft: '3px solid #0B5ED7', paddingLeft: '1rem', color: '#0b0f1a' }}>
                <p style={{ margin: 0 }}>
                  If you feel overwhelmed, skip code. Use a <strong>simple checklist</strong> and reply manually fast.
                  Automation is powerful—but only when it doesn't block you from selling today.
                </p>
              </div>
            </details>

            <div style={{ marginTop: '1rem', padding: '.9rem', borderRadius: '10px', background: '#E7F1FF', border: '1px solid #CFE2FF' }}>
              <strong>✅ CapeWeb tip:</strong> For early-stage founders, we automate the
              <strong>capture</strong> + <strong>follow-up</strong> first, and only then we add the "smart AI layer."
            </div>
          </div>
        </div>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px', marginTop: '1rem' }}>
          <h4>🧠 Quick Quiz (Automation basics)</h4>

          <div className="quiz-question" style={{ marginTop: '.75rem' }}>
            <p><strong>Q1:</strong> In an automation, what is a <em>trigger</em>?</p>
            <div className="quiz-options" style={{ display: 'grid', gap: '.35rem' }}>
              <label className="radio-item">
                <input type="radio" name="p7-q1" value="false" checked={quiz1Q1 === 'false'} onChange={(e) => setQuiz1Q1(e.target.value)} />
                {' '}The button that turns your phone on
              </label>
              <label className="radio-item">
                <input data-progress="true" type="radio" name="p7-q1" value="true" checked={quiz1Q1 === 'true'} onChange={(e) => setQuiz1Q1(e.target.value)} />
                {' '}The event that starts the workflow (e.g., "new form submitted")
              </label>
              <label className="radio-item">
                <input type="radio" name="p7-q1" value="false2" checked={quiz1Q1 === 'false2'} onChange={(e) => setQuiz1Q1(e.target.value)} />
                {' '}A logo or brand color
              </label>
            </div>
          </div>

          <div className="quiz-question" style={{ marginTop: '1rem' }}>
            <p><strong>Q2:</strong> Why do we automate follow-ups for the first 100 sales?</p>
            <div className="quiz-options" style={{ display: 'grid', gap: '.35rem' }}>
              <label className="radio-item">
                <input type="radio" name="p7-q2" value="false" checked={quiz1Q2 === 'false'} onChange={(e) => setQuiz1Q2(e.target.value)} />
                {' '}Because robots are cooler than humans
              </label>
              <label className="radio-item">
                <input data-progress="true" type="radio" name="p7-q2" value="true" checked={quiz1Q2 === 'true'} onChange={(e) => setQuiz1Q2(e.target.value)} />
                {' '}Because most leads don't buy on the first message
              </label>
              <label className="radio-item">
                <input type="radio" name="p7-q2" value="false2" checked={quiz1Q2 === 'false2'} onChange={(e) => setQuiz1Q2(e.target.value)} />
                {' '}Because customers hate quick replies
              </label>
            </div>
          </div>

          <button type="button" onClick={checkQuiz1} style={{ marginTop: '1rem', padding: '.7rem .9rem', borderRadius: '10px', border: '1px solid #0B5ED7', background: '#0B5ED7', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
            Check Score
          </button>
          {quiz1Score !== null && (
            <div style={{ marginTop: '.75rem', fontWeight: 800, color: quiz1Score === 2 ? '#198754' : '#DC3545' }}>
              Score: {quiz1Score}/2 {quiz1Score === 2 ? '✅ Nice. Keep building.' : '⚠️ Re-read the section and try again.'}
            </div>
          )}
        </div>
      </div>

      {/* Continue with remaining sections... */}
      {/* Due to length, I'll add the rest in the component */}
      <Pillar7RemainingContent
        bizName={bizName}
        setBizName={setBizName}
        bizOffer={bizOffer}
        setBizOffer={setBizOffer}
        bizArea={bizArea}
        setBizArea={setBizArea}
        bizLink={bizLink}
        setBizLink={setBizLink}
        promptRole={promptRole}
        setPromptRole={setPromptRole}
        promptTask={promptTask}
        setPromptTask={setPromptTask}
        promptRules={promptRules}
        setPromptRules={setPromptRules}
        promptFormat={promptFormat}
        setPromptFormat={setPromptFormat}
        playbookGenerated={playbookGenerated}
        generatePlaybook={generatePlaybook}
        getPlaybookTemplates={getPlaybookTemplates}
        promptGenerated={promptGenerated}
        generatePrompt={generatePrompt}
        getGeneratedPrompt={getGeneratedPrompt}
      />
    </>
  );
}

// Remaining content component
function Pillar7RemainingContent({
  bizName,
  setBizName,
  bizOffer,
  setBizOffer,
  bizArea,
  setBizArea,
  bizLink,
  setBizLink,
  promptRole,
  setPromptRole,
  promptTask,
  setPromptTask,
  promptRules,
  setPromptRules,
  promptFormat,
  setPromptFormat,
  playbookGenerated,
  generatePlaybook,
  getPlaybookTemplates,
  promptGenerated,
  generatePrompt,
  getGeneratedPrompt,
}) {
  return (
    <>
      {/* SECTION 5 */}
      <div className="mastery-section">
        <h3>5) Build Automation #2: "Bookings + Reminders" (for services + product demos)</h3>
        <p>
          Even if you sell products, bookings still matter: pickups, installs, consultations, demos, measurements, deliveries.
          Your calendar is a sales tool.
        </p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🗓️ Activity 3: Set up a booking flow</h4>
          <p style={{ marginTop: '.25rem' }}>Choose one path:</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 800 }}>Path A (Simple)</div>
              <ul style={{ margin: '.5rem 0 0 1.25rem' }}>
                <li>Use your phone calendar</li>
                <li>Use WhatsApp quick replies to send "Available times"</li>
                <li>Confirm manually</li>
              </ul>
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 800 }}>Path B (Automated)</div>
              <ul style={{ margin: '.5rem 0 0 1.25rem' }}>
                <li>Create a booking link</li>
                <li>Send reminders automatically</li>
                <li>Reduce no-shows</li>
              </ul>

              <div style={{ marginTop: '.75rem' }}>
                <a href="https://help.calendly.com/hc/en-us/articles/14078580813335-Calendly-scheduling-notifications" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 800, color: '#0B5ED7' }}>
                  Calendly notifications (how it works)
                </a>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#E6F4EA', border: '1px solid #C7E7D1' }}>
            <strong>⚡ CapeWeb tip:</strong> Put your booking link in three places:
            <strong>Instagram bio</strong>, <strong>website header</strong>, and <strong>WhatsApp auto-reply</strong>.
            You want a customer to book in under 60 seconds.
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input data-progress="true" type="checkbox" />
              <span>I placed my booking link in at least 2 places.</span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 6 */}
      <div className="mastery-section">
        <h3>6) WhatsApp + AI (do it safely and within platform rules)</h3>
        <p>
          In South Africa, WhatsApp is often the main sales channel. But automation on WhatsApp must be done carefully:
          you need <strong>permission (opt-in)</strong>, you must avoid spammy behaviour, and you must follow platform policies.
        </p>

        <div className="workbook-section" style={{ background: '#FFF3CD', border: '1px solid #FFECB5', padding: '1.25rem', borderRadius: '10px' }}>
          <h4 style={{ margin: '0 0 .5rem 0' }}>🛑 Important: Opt-In &amp; Policy Basics</h4>
          <p style={{ margin: 0 }}>
            Before you send marketing or follow-ups on WhatsApp, make sure the customer has clearly agreed to receive messages.
            Keep proof (a checkbox, a DM where they asked, a form submission, etc.).
          </p>
          <p style={{ margin: '.65rem 0 0 0' }}>
            Also, WhatsApp policies can change. Build your system so you can adjust fast (CapeWeb does this as part of our care plans).
          </p>

          <div style={{ marginTop: '.9rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <a href="https://www.whatsapp.com/legal/business-policy?l=et&lang=en" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 800, color: '#0B5ED7' }}>
              WhatsApp Business Messaging Policy
            </a>
            <a href="https://www.whatsapp.com/legal/business-solution-terms?l=en" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 800, color: '#0B5ED7' }}>
              WhatsApp Business Solution Terms
            </a>
            <a href="https://inforegulator.org.za/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 800, color: '#0B5ED7' }}>
              SA Information Regulator (POPIA)
            </a>
          </div>
        </div>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px', marginTop: '1rem' }}>
          <h4>💬 Activity 4: Build your WhatsApp "Reply Playbook"</h4>
          <p style={{ marginTop: '.25rem' }}>
            These are the messages that make you money: fast, friendly, and clear. Fill in the blanks and generate your templates.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '.35rem' }}>Business name</label>
              <input type="text" placeholder="e.g., CapeGlow" value={bizName} onChange={(e) => setBizName(e.target.value)} style={{ width: '100%', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} />
            </div>
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '.35rem' }}>Main offer</label>
              <input type="text" placeholder="e.g., Starter Kit (product) + Setup Session (service)" value={bizOffer} onChange={(e) => setBizOffer(e.target.value)} style={{ width: '100%', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} />
            </div>
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '.35rem' }}>Service area</label>
              <input type="text" placeholder="e.g., Cape Town (CBD, Southern Suburbs, Atlantic Seaboard)" value={bizArea} onChange={(e) => setBizArea(e.target.value)} style={{ width: '100%', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} />
            </div>
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '.35rem' }}>Booking / checkout link</label>
              <input type="text" placeholder="https://yourlink..." value={bizLink} onChange={(e) => setBizLink(e.target.value)} style={{ width: '100%', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} />
            </div>
          </div>

          <button type="button" onClick={generatePlaybook} style={{ marginTop: '1rem', padding: '.75rem .95rem', borderRadius: '10px', border: '1px solid #0B5ED7', background: '#0B5ED7', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
            Generate my reply playbook
          </button>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
            {playbookGenerated ? (
              <>
                <div style={{ fontWeight: 900, marginBottom: '.5rem' }}>Your Reply Playbook (copy/paste)</div>
                <div style={{ display: 'grid', gap: '.75rem' }}>
                  {getPlaybookTemplates().map((t, idx) => (
                    <div key={idx} style={{ border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', background: '#fff' }}>
                      <div style={{ fontWeight: 900 }}>{t.title}</div>
                      <textarea rows={4} value={t.text} readOnly style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} />
                      <div style={{ color: '#6c757d', fontSize: '.9rem', marginTop: '.35rem' }}>
                        CapeWeb tip: end every message with 1 clear next step.
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ color: '#6c757d' }}>Your templates will appear here.</div>
            )}
          </div>

          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 900, color: '#0B5ED7' }}>Where to use these templates</summary>
            <div style={{ marginTop: '.5rem', borderLeft: '3px solid #0B5ED7', paddingLeft: '1rem' }}>
              <ul style={{ margin: '.25rem 0 0 1.25rem' }}>
                <li>WhatsApp Business quick replies</li>
                <li>Instagram DM saved replies</li>
                <li>Email templates (Gmail canned responses)</li>
                <li>Website chat assistant (CapeWeb can install an AI layer later)</li>
              </ul>
            </div>
          </details>
        </div>
      </div>

      {/* SECTION 7 */}
      <div className="mastery-section">
        <h3>7) AI Prompts that actually help (without breaking trust)</h3>
        <p>
          AI is powerful, but it can sound confident even when wrong. Use it like a <strong>junior assistant</strong>:
          fast drafts, summaries, options—then you approve the final answer.
        </p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🧠 Activity 5: Build a "safe prompt" (copy/paste)</h4>
          <p style={{ marginTop: '.25rem' }}>
            CapeWeb prompts follow a simple pattern: <strong>Role</strong> → <strong>Task</strong> → <strong>Rules</strong> → <strong>Output format</strong>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <div>
              <label style={{ fontWeight: 900, display: 'block', marginBottom: '.35rem' }}>Role</label>
              <input type="text" placeholder="You are my customer support assistant..." value={promptRole} onChange={(e) => setPromptRole(e.target.value)} style={{ width: '100%', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} />
            </div>
            <div>
              <label style={{ fontWeight: 900, display: 'block', marginBottom: '.35rem' }}>Task</label>
              <input type="text" placeholder="Write a WhatsApp reply to a price question..." value={promptTask} onChange={(e) => setPromptTask(e.target.value)} style={{ width: '100%', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontWeight: 900, display: 'block', marginBottom: '.35rem' }}>Rules (guardrails)</label>
              <textarea rows={3} placeholder="Rules: Keep it under 80 words. Ask 1 clarifying question. Do not invent prices. If unsure, say what you need to confirm." value={promptRules} onChange={(e) => setPromptRules(e.target.value)} style={{ width: '100%', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontWeight: 900, display: 'block', marginBottom: '.35rem' }}>Output format</label>
              <input type="text" placeholder="Format: 1 WhatsApp message + 1 follow-up option" value={promptFormat} onChange={(e) => setPromptFormat(e.target.value)} style={{ width: '100%', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} />
            </div>
          </div>

          <button type="button" onClick={generatePrompt} style={{ marginTop: '1rem', padding: '.75rem .95rem', borderRadius: '10px', border: '1px solid #0B5ED7', background: '#0B5ED7', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
            Generate my prompt
          </button>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontWeight: 900, marginBottom: '.35rem' }}>Your copyable prompt</div>
            <textarea rows={6} value={promptGenerated ? getGeneratedPrompt() : ''} placeholder="Your prompt will appear here..." readOnly style={{ width: '100%', padding: '.65rem', borderRadius: '10px', border: '1px solid #CED4DA' }} />
            <div style={{ marginTop: '.6rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              <a href="https://platform.openai.com/docs/quickstart" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 800, color: '#0B5ED7' }}>OpenAI API quickstart</a>
              <a href="https://openai.com/policies/usage-policies/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 800, color: '#0B5ED7' }}>OpenAI usage policies</a>
              <a href="https://ai.google.dev/gemini-api/docs" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 800, color: '#0B5ED7' }}>Google Gemini API docs</a>
              <a href="https://console.anthropic.com/docs/en/api/getting-started" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 800, color: '#0B5ED7' }}>Claude API docs</a>
            </div>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#E7F1FF', border: '1px solid #CFE2FF' }}>
            <strong>✅ Truth rule:</strong> If the message includes legal, medical, pricing, delivery dates, or contracts—
            <strong>verify before sending</strong>.
          </div>

          <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', marginTop: '1rem' }}>
            <input data-progress="true" type="checkbox" />
            <span>I will never let AI invent facts or prices in customer chats.</span>
          </label>
        </div>
      </div>

      {/* SECTION 8 */}
      <div className="mastery-section">
        <h3>8) Build Automation #3: "CRM Pipeline + Lead Routing" (free)</h3>
        <p>
          A pipeline stops you from forgetting people. If you forget people, you lose sales.
          A simple CRM pipeline is like a "sales to-do list" that updates itself.
        </p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🧱 Your first pipeline (copy this)</h4>
          <div className="comparison-table-wrapper" style={{ marginTop: '.75rem' }}>
            <table className="capeweb-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Meaning</th>
                  <th>Your next action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>New Lead</strong></td>
                  <td>They asked anything</td>
                  <td>Reply within 15 minutes</td>
                </tr>
                <tr>
                  <td><strong>Qualified</strong></td>
                  <td>They want it + can pay</td>
                  <td>Send link / quote / booking</td>
                </tr>
                <tr>
                  <td><strong>Pending</strong></td>
                  <td>Waiting on payment/booking</td>
                  <td>Follow up in 24 hours</td>
                </tr>
                <tr>
                  <td><strong>Won</strong></td>
                  <td>Paid/booked</td>
                  <td>Deliver + ask for review</td>
                </tr>
                <tr>
                  <td><strong>Lost</strong></td>
                  <td>Not now</td>
                  <td>Set a reminder for 30 days</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <a href="https://www.hubspot.com/products/crm" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 900, color: '#0B5ED7' }}>Get HubSpot CRM (free)</a>
            <a href="https://help.brevo.com/hc/en-us/articles/14611647354002-Getting-started-with-Automations" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 900, color: '#0B5ED7' }}>Brevo automations</a>
            <a href="https://mailchimp.com/help/create-customer-journey/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 900, color: '#0B5ED7' }}>Mailchimp automation flows</a>
            <a href="https://www.mailerlite.com/help/how-to-create-an-automation-workflow" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontWeight: 900, color: '#0B5ED7' }}>MailerLite workflows</a>
          </div>

          <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', marginTop: '1rem' }}>
            <input data-progress="true" type="checkbox" />
            <span>I created (or planned) my pipeline stages exactly like above.</span>
          </label>
        </div>
      </div>

      {/* SECTION 9 */}
      <div className="mastery-section">
        <h3>9) Safety &amp; Compliance (POPIA mindset in plain English)</h3>
        <p>
          Automation uses customer data (names, phone numbers, addresses). In South Africa, you must treat that data like a real asset:
          keep it safe, only collect what you need, and stop messaging when someone says stop.
        </p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🔒 Activity 6: The "Data Minimization" Checklist</h4>
          <p style={{ marginTop: '.25rem' }}>Tick what you will follow from today:</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '.65rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input data-progress="true" type="checkbox" />
              <span>I only collect data I need to fulfill the order/service.</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input data-progress="true" type="checkbox" />
              <span>I can prove consent (opt-in) for marketing messages.</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input data-progress="true" type="checkbox" />
              <span>I keep customer data in one "source of truth" (not random notes).</span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input data-progress="true" type="checkbox" />
              <span>If someone opts out, I stop. No arguing. No "but…".</span>
            </label>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#fff', border: '1px solid #DEE2E6' }}>
            <div style={{ fontWeight: 900 }}>Useful official places to start (South Africa)</div>
            <ul style={{ margin: '.5rem 0 0 1.25rem' }}>
              <li><a href="https://inforegulator.org.za/" target="_blank" rel="noopener noreferrer">Information Regulator (POPIA)</a></li>
              <li><a href="https://inforegulator.bizportal.gov.za/Default.aspx" target="_blank" rel="noopener noreferrer">BizPortal – POPIA &amp; PAIA services</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

// Quiz component
export function Pillar7Quiz({ quizResponses, onSelect, onScore, scoreMessage }) {
  return (
    <div className="workbook-section" style={{ background: '#0b0f1a', color: '#fff', border: '1px solid rgba(255,255,255,.12)', padding: '1.5rem', borderRadius: '10px', marginTop: '1.5rem' }}>
      <h3 style={{ margin: '0 0 .75rem 0' }}>🏁 Pillar 7 Boss Battle: Can you run an "always-on" business?</h3>
      <p style={{ margin: 0, color: 'rgba(255,255,255,.85)' }}>
        Answer these 6 questions. Score <strong>5/6</strong> and you pass.
      </p>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
        {pillar7QuizQuestions.map((question, index) => (
          <div key={index} className="quiz-question">
            <p><strong>Q{index + 1}:</strong> {question.question}</p>
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex}>
                <input
                  data-progress="true"
                  type="radio"
                  name={`p7-boss-q${index + 1}`}
                  checked={quizResponses[index] === optionIndex}
                  onChange={() => onSelect(index, optionIndex)}
                />
                {' '}{option}
              </label>
            )).reduce((prev, curr) => [prev, <br key={`br-${index}`} />, curr])}
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

      <div style={{ marginTop: '.75rem', fontWeight: 900 }}>
        {scoreMessage}
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}>
        <strong>🏆 If you passed:</strong> You're ready for the next pillar—because you can now build systems that keep selling.
        <div style={{ marginTop: '.5rem' }}>
          <a href="/contact" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontWeight: 900, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,.35)' }}>
            Want CapeWeb to implement your "Invisible Team"? Click here →
          </a>
        </div>
      </div>
    </div>
  );
}

// Completion component
export function Pillar7Completion() {
  return (
    <div className="completion-box" style={{ textAlign: 'center', marginTop: '2.25rem', paddingTop: '2rem', borderTop: '2px dashed #CED4DA' }}>
      <h3>🎉 Pillar 7 Complete</h3>
      <p style={{ maxWidth: '760px', margin: '.5rem auto 0 auto' }}>
        You now understand AI vs automation, have a simple stack, a reply playbook, and 3 automation blueprints.
        Your business is becoming "always-on"—the CapeWeb way.
      </p>
    </div>
  );
}

// SVG Diagrams
function ManualVsAlwaysOnDiagram() {
  return (
    <svg viewBox="0 0 760 260" width="100%" height="auto" role="img" aria-label="Diagram showing manual reply delays vs automated flow">
      <defs>
        <linearGradient id="p7grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#FDE047"></stop>
          <stop offset="1" stopColor="#22D3EE"></stop>
        </linearGradient>
      </defs>

      {/* Manual lane */}
      <rect x="20" y="30" width="720" height="90" rx="16" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.18)"></rect>
      <text x="40" y="58" fill="#fff" fontSize="16" fontWeight="700">Manual</text>
      <circle cx="170" cy="85" r="10" fill="#F472B6"></circle>
      <text x="190" y="90" fill="rgba(255,255,255,.88)" fontSize="14">Lead messages at 2AM</text>
      <rect x="410" y="70" width="280" height="30" rx="999" fill="rgba(244,114,182,.22)" stroke="rgba(244,114,182,.55)"></rect>
      <text x="430" y="90" fill="#fff" fontSize="13">Waits… (you reply at 10AM)</text>

      {/* Always-on lane */}
      <rect x="20" y="145" width="720" height="90" rx="16" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.18)"></rect>
      <text x="40" y="173" fill="#fff" fontSize="16" fontWeight="700">Always-On (CapeWeb build)</text>
      <circle cx="170" cy="200" r="10" fill="url(#p7grad)"></circle>
      <text x="190" y="205" fill="rgba(255,255,255,.88)" fontSize="14">Lead messages at 2AM</text>
      <rect x="400" y="185" width="140" height="30" rx="10" fill="rgba(34,211,238,.20)" stroke="rgba(34,211,238,.60)"></rect>
      <text x="415" y="205" fill="#fff" fontSize="13">Auto-reply</text>
      <rect x="550" y="185" width="140" height="30" rx="10" fill="rgba(253,224,71,.18)" stroke="rgba(253,224,71,.65)"></rect>
      <text x="566" y="205" fill="#fff" fontSize="13">Book / Pay</text>
    </svg>
  );
}

function LeadCaptureFlowDiagram() {
  return (
    <svg viewBox="0 0 760 190" width="100%" height="auto" role="img" aria-label="Lead capture workflow diagram">
      <defs>
        <filter id="p7shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,.18)" />
        </filter>
      </defs>

      <rect x="20" y="40" width="170" height="55" rx="14" fill="#ffffff" stroke="#0B5ED7" filter="url(#p7shadow)"></rect>
      <text x="42" y="74" fontSize="14" fontWeight="800" fill="#0b0f1a">IG / Website</text>

      <line x1="190" y1="67" x2="265" y2="67" stroke="#0B5ED7" strokeWidth="3"></line>
      <polygon points="265,67 250,59 250,75" fill="#0B5ED7"></polygon>

      <rect x="270" y="40" width="190" height="55" rx="14" fill="#ffffff" stroke="#22C55E" filter="url(#p7shadow)"></rect>
      <text x="292" y="74" fontSize="14" fontWeight="800" fill="#0b0f1a">Google Form</text>

      <line x1="460" y1="67" x2="535" y2="67" stroke="#22C55E" strokeWidth="3"></line>
      <polygon points="535,67 520,59 520,75" fill="#22C55E"></polygon>

      <rect x="540" y="40" width="200" height="55" rx="14" fill="#ffffff" stroke="#F97316" filter="url(#p7shadow)"></rect>
      <text x="562" y="74" fontSize="14" fontWeight="800" fill="#0b0f1a">Leads Sheet</text>

      <line x1="140" y1="95" x2="140" y2="140" stroke="#0b0f1a" strokeWidth="2" opacity=".25"></line>
      <line x1="365" y1="95" x2="365" y2="140" stroke="#0b0f1a" strokeWidth="2" opacity=".25"></line>
      <line x1="640" y1="95" x2="640" y2="140" stroke="#0b0f1a" strokeWidth="2" opacity=".25"></line>

      <rect x="180" y="125" width="400" height="48" rx="14" fill="#0b0f1a"></rect>
      <text x="205" y="155" fontSize="14" fontWeight="800" fill="#ffffff">Auto-follow-up message + next step link</text>
    </svg>
  );
}
