import React from 'react';

const getPillar8Playbook = (context = {}) => {
  const sector = (context.sector || '').toLowerCase();
  const regulation = (context.regulationFocus || '').toLowerCase();
  if (sector.includes('health') || regulation.includes('health')) {
    return {
      summary: 'Protect patient data (POPIA/HPCSA), encrypt backups, and prepare breach notifications.',
      quickWins: ['Register Information Officer on InfoReg portal', 'Enable MFA on records/email, store consent logs', 'Draft breach notification template + incident contacts.'],
    };
  }
  if (/(commerce|retail|ecommerce|pay)/.test(sector)) {
    return {
      summary: 'Lock down payment portals, marketplace logins, and proof-of-payment workflows; reduce fraud chargebacks.',
      quickWins: ['Enable MFA on payment gateways + courier dashboards', 'Never accept screenshots as payment proof—verify in dashboard', 'Weekly backup of orders + payment exports.'],
    };
  }
  if (/(fintech|saas|technology)/.test(sector)) {
    return {
      summary: 'Adopt zero-trust basics: password managers, SSO, and logging for cloud infrastructure.',
      quickWins: ['Centralise secrets (1Password/Bitwarden)', 'Enable SSO/MFA across GitHub, hosting, analytics', 'Set up incident log + on-call contacts.'],
    };
  }
  return {
    summary: 'List what attackers can hit (email, domains, payments), enable MFA, keep backups, and write a response plan.',
    quickWins: ['Inventory accounts + hardware', 'Turn on MFA everywhere this week', 'Document a simple incident response checklist.'],
  };
};

const getPillar8ComplianceNote = (context = {}) => {
  const location = context.geography || 'your municipality';
  const sector = (context.sector || '').toLowerCase();
  const regulation = (context.regulationFocus || '').toLowerCase();

  if (sector.includes('health') || regulation.includes('health')) {
    return 'Health data falls under POPIA + HPCSA ethical rules. Keep consent logs, encrypt patient files, and draft breach notices using the Information Regulator templates.';
  }
  if (sector.includes('food') || regulation.includes('food') || sector.includes('agri') || sector.includes('agriculture')) {
    return 'Food + agri operators must align with DALRRD / Department of Health hygiene codes. Store supplier audits, cold-chain logs, and recall scripts in your backup plan.';
  }
  if (sector.includes('ngo')) {
    return 'Registered NPOs must protect donor and beneficiary data under POPIA and the NPO Act. Restrict access to beneficiary lists and record approvals before syncing with cloud CRMs.';
  }
  if (sector.includes('technology') || sector.includes('saas') || regulation.includes('data')) {
    return 'SaaS/tech firms should treat CapeWeb Pillar 8 as a POPIA-readiness sprint: appoint an Information Officer, log processor agreements, and keep audit trails for release rollbacks.';
  }
  return `Anchor your POPIA readiness to the Information Regulator of South Africa. Appoint/record your Information Officer and keep breach notification templates for ${location}.`;
};

export const pillar8QuizQuestions = [
  {
    question: 'The "master key" account that attackers use to reset everything is usually:',
    options: ['Your logo file', 'Your email account', 'Your WhatsApp status'],
    correctIndex: 1,
  },
  {
    question: 'MFA means:',
    options: ['Making fonts bigger', 'Adding a second login step so passwords alone aren\'t enough', 'Posting more often'],
    correctIndex: 1,
  },
  {
    question: 'The safest response to "Click this link to verify your account" is:',
    options: ['Click immediately', 'Open the real website/app directly and check there', 'Forward it to friends'],
    correctIndex: 1,
  },
  {
    question: 'A backup that you can\'t restore is:',
    options: ['Still fine', 'Not a real backup', 'Better than MFA'],
    correctIndex: 1,
  },
  {
    question: '"Proof of payment" screenshots are:',
    options: ['Always reliable', 'Not reliable — verify in the real dashboard/bank app', 'Better than bank statements'],
    correctIndex: 1,
  },
  {
    question: 'The first step in incident response is:',
    options: ['Detect and confirm something is wrong', 'Panic', 'Delete everything'],
    correctIndex: 0,
  },
  {
    question: 'HTTPS on a website mainly helps by:',
    options: ['Making your logo bigger', 'Encrypting data between the visitor and your site', 'Ranking #1 instantly'],
    correctIndex: 1,
  },
  {
    question: 'A Risk Register is:',
    options: ['A list of things that could go wrong + what you\'ll do', 'A list of risks + controls + owners + next actions', 'A logo moodboard'],
    correctIndex: 1,
  },
  {
    question: '"Contain" in incident response means:',
    options: ['Stop the spread (log out sessions, isolate accounts)', 'Tell everyone your password', 'Ignore it for 3 days'],
    correctIndex: 0,
  },
  {
    question: 'The most common way small businesses get hacked is:',
    options: ['Hollywood-style brute force only', 'Phishing and social engineering', 'People guessing your brand colors'],
    correctIndex: 1,
  },
  {
    question: 'The best place to verify "urgent account issues" is:',
    options: ['The link inside the message', 'The official website/app you open yourself', 'A random commenter'],
    correctIndex: 1,
  },
  {
    question: '"Security compromises" related to personal info in South Africa may involve:',
    options: ['No action needed', 'POPIA reporting/notification obligations (check official guidance)', 'Only posting a story apology'],
    correctIndex: 1,
  },
];

export function Pillar8Content({ personalizationContext = {} }) {
  const playbook = getPillar8Playbook(personalizationContext);
  const personaLabel = personalizationContext?.sector || 'Business';
  const geographyLabel = personalizationContext?.geography || 'South Africa';
  const regulationLabel = personalizationContext?.regulationFocus || 'general compliance';
  const stageLabel = personalizationContext?.revenueStage || 'current stage';
  const needsMultilingual = personalizationContext?.language && personalizationContext.language !== 'English';
  const complianceNote = getPillar8ComplianceNote(personalizationContext);
  return (
    <>
      <div
        className="persona-context-card"
        style={{
          background: '#0d1726',
          color: '#fff',
          borderRadius: '14px',
          padding: '1.5rem',
          border: '1px solid rgba(255,255,255,.12)',
          marginBottom: '1.5rem',
        }}
      >
        <p className="panel-eyebrow" style={{ color: 'rgba(255,255,255,.72)', marginBottom: '.35rem' }}>
          Context-aware security focus
        </p>
        <h3 style={{ margin: 0 }}>Security posture plan for {personaLabel || 'your business'}</h3>
        <p style={{ marginTop: '.5rem', color: 'rgba(255,255,255,.82)' }}>
          Sector focus: <strong>{personaLabel}</strong> · Geography: <strong>{geographyLabel}</strong> · Regulation priority:{' '}
          <strong>{regulationLabel}</strong>. Deepseek prioritised Cybersecurity Pillar tasks based on your {stageLabel} profile.
        </p>
        <p style={{ marginTop: '.75rem', color: 'rgba(255,255,255,.82)' }}>{playbook.summary}</p>
        <div
          style={{
            marginTop: '1rem',
            background: 'rgba(255,255,255,.08)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid rgba(255,255,255,.12)',
          }}
        >
          <strong>Quick wins this week</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem', color: 'rgba(255,255,255,.9)' }}>
            {playbook.quickWins.map((win) => (
              <li key={win}>{win}</li>
            ))}
          </ul>
        </div>
        <div
          style={{
            marginTop: '1rem',
            background: '#ffe8cc',
            color: '#7c4700',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid #ffd8a8',
          }}
        >
          <strong>Compliance signal:</strong> {complianceNote}
        </div>
        {needsMultilingual && (
          <div
            style={{
              marginTop: '1rem',
              borderRadius: '12px',
              padding: '1rem',
              background: 'rgba(79,70,229,.15)',
              border: '1px solid rgba(79,70,229,.3)',
            }}
          >
            <strong>Multilingual reminder:</strong> prepare WhatsApp/email incident templates in English + {personalizationContext.language}. CapeWeb recommends labelling both versions in the Security Shield checklist.
          </div>
        )}
      </div>

      <div className="workbook-section" style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h4>📚 Security action library</h4>
        <p>Work through these government-aligned steps. Each item links to the South African regulator or support body responsible for that safeguard.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem', marginTop: '.75rem' }}>
          <div style={{ border: '1px solid #dee2e6', borderRadius: '12px', padding: '1rem', background: '#f8f9fa' }}>
            <strong>Register an Information Officer</strong>
            <p style={{ marginTop: '.4rem', color: '#495057' }}>
              Every company needs an Information Officer per POPIA. File the appointment with the Information Regulator and keep the acknowledgement saved.
            </p>
            <a href="https://www.justice.gov.za/inforeg/docs/InfoRegSA-IO-registration.pdf" target="_blank" rel="noopener noreferrer">
              Download the registration form
            </a>
          </div>
          <div style={{ border: '1px solid #dee2e6', borderRadius: '12px', padding: '1rem', background: '#fff' }}>
            <strong>Connect with CSIRT / SAPS</strong>
            <p style={{ marginTop: '.4rem', color: '#495057' }}>
              Bookmark the national Cybersecurity Hub + SAPS Commercial Crimes Unit. When an attack lands, you must report within 24 hours.
            </p>
            <ul style={{ margin: '.5rem 0 0 1.25rem' }}>
              <li><a href="https://www.cybersecurityhub.gov.za/" target="_blank" rel="noopener noreferrer">South African Cybersecurity Hub</a></li>
              <li><a href="https://www.saps.gov.za/resource_centre/publications/commercial_crime.php" target="_blank" rel="noopener noreferrer">SAPS Commercial Crime Units</a></li>
            </ul>
          </div>
          <div style={{ border: '1px solid #dee2e6', borderRadius: '12px', padding: '1rem', background: '#f8f9fa' }}>
            <strong>Bank + payment escalations</strong>
            <p style={{ marginTop: '.4rem', color: '#495057' }}>
              Fraud on Yoco/Paystack/Ozow must be escalated to the gateway immediately. Keep their abuse desk contacts on your incident checklist.
            </p>
            <ul style={{ margin: '.5rem 0 0 1.25rem' }}>
              <li><a href="https://www.yoco.com/za/blog/yoco-fraud-protection/" target="_blank" rel="noopener noreferrer">Yoco Fraud Protection Desk</a></li>
              <li><a href="https://support.paystack.com/hc/en-us/articles/360009881940-Contact-Paystack-support" target="_blank" rel="noopener noreferrer">Paystack Support</a></li>
            </ul>
          </div>
        </div>
        <details style={{ marginTop: '1rem' }}>
          <summary style={{ fontWeight: 700, color: '#0b7285' }}>Incident notification path</summary>
          <p style={{ marginTop: '.5rem', color: '#495057' }}>
            1) Contain + reset passwords. 2) Log evidence. 3) Report to SAPS (case number). 4) Notify the Information Regulator via{' '}
            <a href="mailto:POPIACompliance@inforegulator.org.za">POPIACompliance@inforegulator.org.za</a>. 5) Inform affected customers in plain language (WhatsApp/email).
          </p>
        </details>
      </div>

      {/* SECTION 1 */}
      <div className="mastery-section" data-topic="cybersecurity basics risk management attack surface accounts devices website payments">
        <h3>1) The real problem: your business has an "attack surface"</h3>
        <p>
          Cybersecurity is not about being scared. It's about being ready.
          Your business has "doors" attackers can try: your email, Instagram, phone, website logins, payment links, and staff accounts.
        </p>

        <BusinessAttackSurfaceDiagram />

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🧭 Mission 1: Your asset list (what you must protect)</h4>
          <p>Tick what you use today. Write what you don't want to lose.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginTop: '.75rem' }}>
            <label><input data-progress="true" type="checkbox" /> Email account (Gmail / Outlook)</label>
            <label><input data-progress="true" type="checkbox" /> Instagram / Facebook Page</label>
            <label><input data-progress="true" type="checkbox" /> Domain name (yourdomain.co.za)</label>
            <label><input data-progress="true" type="checkbox" /> Website admin login (WordPress/Shopify/etc.)</label>
            <label><input data-progress="true" type="checkbox" /> Payment provider dashboard (Pay links / payouts)</label>
            <label><input data-progress="true" type="checkbox" /> Customer list / leads list</label>
          </div>

          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: '900', display: 'block' }}>If I lose my phone, I lose:</label>
              <textarea rows="3" placeholder="Example: WhatsApp chats, banking apps, email, photos..." style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #ced4da', borderRadius: '8px' }}></textarea>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: '900', display: 'block' }}>If my Instagram gets hacked, I lose:</label>
              <textarea rows="3" placeholder="Example: sales DMs, credibility, customers trust..." style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #ced4da', borderRadius: '8px' }}></textarea>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#e7f1ff', padding: '1rem', borderRadius: '8px', border: '1px solid #cfe2ff' }}>
            <strong>🔧 CapeWeb shortcut:</strong> CapeWeb can run a "Security Surface Audit" and give you a simple plan:
            what to lock down first, what can wait, and how to reduce risk fast.
          </div>
        </div>
      </div>

      <Pillar8RemainingContent />
    </>
  );
}

function Pillar8RemainingContent() {
  return (
    <>
      {/* SECTION 2 */}
      <div className="mastery-section" data-topic="passwords mfa 2fa passkeys password manager recovery codes">
        <h3>2) Passwords + MFA: your first shield</h3>
        <p>
          A strong password is good. A strong password <strong>plus MFA</strong> is much better.
          MFA (Multi‑Factor Authentication) means: even if someone knows your password, they still can't log in.
        </p>

        <div className="comparison-table-wrapper">
          <table className="capeweb-table">
            <thead>
              <tr>
                <th>Security option</th>
                <th>Simple meaning</th>
                <th>CapeWeb advice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Password only</td>
                <td>One key</td>
                <td>Not enough for email or social</td>
              </tr>
              <tr>
                <td>Password + SMS code</td>
                <td>Extra code via phone</td>
                <td>Better than nothing (but not best)</td>
              </tr>
              <tr>
                <td>Authenticator app</td>
                <td>Codes from an app</td>
                <td><strong>Great baseline</strong> for small businesses</td>
              </tr>
              <tr>
                <td>Passkeys / Security keys</td>
                <td>Modern login method</td>
                <td>Excellent if you can set it up</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🛡️ Mission 2: Lock down the "master key" (email)</h4>
          <p>Do this first. If email is hacked, attackers can reset everything else.</p>

          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li><label><input data-progress="true" type="checkbox" /> Turn on MFA for your email</label> — <a href="https://myaccount.google.com/security-checkup" target="_blank" rel="noopener noreferrer">Google Security Checkup</a></li>
            <li><label><input data-progress="true" type="checkbox" /> Save your recovery codes somewhere safe</label> (not in the same inbox)</li>
            <li><label><input data-progress="true" type="checkbox" /> Update your recovery phone + email</label></li>
            <li><label><input data-progress="true" type="checkbox" /> Use a password manager (optional but powerful)</label></li>
          </ul>

          <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
            <summary style={{ color: '#0066cc', fontWeight: '900' }}>Password manager options (starter-friendly)</summary>
            <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
              <ul style={{ margin: '.5rem 0 0 1.25rem' }}>
                <li><a href="https://bitwarden.com/" target="_blank" rel="noopener noreferrer">Bitwarden</a></li>
                <li><a href="https://1password.com/" target="_blank" rel="noopener noreferrer">1Password</a></li>
                <li><a href="https://support.apple.com/en-za/guide/iphone/iphf9219d8c3/ios" target="_blank" rel="noopener noreferrer">iPhone Passwords (Apple)</a></li>
                <li><a href="https://support.google.com/chrome/answer/95606?hl=en" target="_blank" rel="noopener noreferrer">Chrome Password Manager</a></li>
              </ul>
              <p style={{ margin: '.75rem 0 0', color: '#495057' }}>
                CapeWeb rule: <strong>unique passwords</strong> for email, domain registrar, website admin, and payments.
              </p>
            </div>
          </details>

          <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb check:</strong> If you do just one thing today, do MFA on email + Instagram.
          </div>
        </div>

        <div className="workbook-section" style={{ background: '#fff', border: '1px solid #e9ecef', padding: '1.25rem', borderRadius: '10px' }}>
          <h4>Quick Links: lock down your key accounts</h4>
          <ul style={{ margin: '.6rem 0 0 1.25rem' }}>
            <li><a href="https://www.facebook.com/security/2fac/settings" target="_blank" rel="noopener noreferrer">Meta (Facebook/Instagram) 2FA settings</a></li>
            <li><a href="https://support.tiktok.com/en/safety-hc/account-and-user-safety/2-step-verification" target="_blank" rel="noopener noreferrer">TikTok 2‑step verification</a></li>
            <li><a href="https://support.google.com/accounts/answer/185839?hl=en" target="_blank" rel="noopener noreferrer">Google 2‑Step Verification</a></li>
          </ul>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="mastery-section" data-topic="phishing scams social engineering fake invoices dms">
        <h3>3) Phishing: the #1 way small businesses get hacked</h3>
        <p>
          Phishing is a trick message designed to steal your login or money.
          It can arrive via email, WhatsApp, Instagram DM, or even a fake "invoice".
        </p>

        <div className="workbook-section" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeeba', padding: '1.25rem', borderRadius: '10px', margin: '1.25rem 0', color: '#856404' }}>
          <h4 style={{ marginTop: 0 }}>⚠️ The 5 red flags</h4>
          <ol style={{ margin: '.5rem 0 0 1.25rem' }}>
            <li><strong>Urgency:</strong> "Do this now or you'll lose access."</li>
            <li><strong>Unexpected link:</strong> "Click here to verify."</li>
            <li><strong>Weird sender:</strong> close to a real address, but not the same.</li>
            <li><strong>Attachment you didn't ask for:</strong> "invoice.pdf.exe" vibes.</li>
            <li><strong>Secret request:</strong> "Don't tell anyone."</li>
          </ol>
        </div>

        <div className="workbook-section" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🎮 Phishing Spotter Game</h4>
          <p>Pick the safest response.</p>

          <div className="quiz-question">
            <p><strong>Scenario A:</strong> "Hi, we're your payment provider. Your account will be suspended. Click this link to log in."</p>
            <div className="quiz-options">
              <label><input data-progress="true" type="radio" name="p8_phish_a" value="a" /> Click the link and log in fast</label><br />
              <label><input data-progress="true" type="radio" name="p8_phish_a" value="b" /> Reply and ask for their password</label><br />
              <label><input data-progress="true" type="radio" name="p8_phish_a" value="c" /> Ignore the link, open the real website/app directly, check there</label>
            </div>
            <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
              <summary style={{ color: '#0066cc', fontWeight: '900' }}>Check Answer</summary>
              <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
                <p><strong>Best:</strong> open the real website/app directly. Never trust surprise links.</p>
              </div>
            </details>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '1rem 0' }} />

          <div className="quiz-question">
            <p><strong>Scenario B:</strong> You get a WhatsApp message: "This is the courier. Pay R35 here to release your parcel."</p>
            <div className="quiz-options">
              <label><input data-progress="true" type="radio" name="p8_phish_b" value="a" /> Pay, it's only R35</label><br />
              <label><input data-progress="true" type="radio" name="p8_phish_b" value="b" /> Verify using the courier's official tracking page or call the official number</label><br />
              <label><input data-progress="true" type="radio" name="p8_phish_b" value="c" /> Forward it to everyone</label>
            </div>
            <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
              <summary style={{ color: '#0066cc', fontWeight: '900' }}>Check Answer</summary>
              <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
                <p><strong>Best:</strong> verify using official channels. Small fees are how scams "feel believable".</p>
              </div>
            </details>
          </div>

          <div style={{ marginTop: '1rem', background: '#e7f1ff', padding: '1rem', borderRadius: '8px', border: '1px solid #cfe2ff' }}>
            <strong>🔧 CapeWeb suggestion:</strong> build a simple "payments policy" page and link it in your bio:
            "We only accept payments through our official link. We never DM payment links."
          </div>
        </div>
      </div>

      {/* SECTION 4 */}
      <div className="mastery-section" data-topic="backups device security updates encryption wifi 3-2-1">
        <h3>4) Backups + device security (so you don't lose the business)</h3>
        <p>
          A business can survive a hack. It struggles to survive <strong>lost data</strong>.
          Backups are your time machine.
        </p>

        <SimpleBackupStrategyDiagram />

        <div className="workbook-section" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🧰 Mission 3: Build your backup plan (simple)</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Pick where your backup lives:</strong>
              <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
                <li><label><input data-progress="true" type="checkbox" /> Cloud drive (Google Drive / OneDrive / iCloud)</label></li>
                <li><label><input data-progress="true" type="checkbox" /> External hard drive / USB (offline)</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Website backups (if you have a site)</label></li>
              </ul>

              <div style={{ marginTop: '.75rem' }}>
                <strong>Helpful links:</strong>
                <ul style={{ margin: '.5rem 0 0 1.25rem' }}>
                  <li><a href="https://support.google.com/drive/answer/2424384?hl=en" target="_blank" rel="noopener noreferrer">Google Drive basics</a></li>
                  <li><a href="https://support.microsoft.com/en-us/onedrive" target="_blank" rel="noopener noreferrer">OneDrive support</a></li>
                  <li><a href="https://support.apple.com/en-za/icloud" target="_blank" rel="noopener noreferrer">iCloud support</a></li>
                </ul>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Pick a schedule:</strong>
              <div style={{ marginTop: '.75rem' }}>
                <label style={{ display: 'block' }}><input data-progress="true" type="radio" name="p8_backup_schedule" value="daily" /> Daily</label>
                <label style={{ display: 'block' }}><input data-progress="true" type="radio" name="p8_backup_schedule" value="weekly" /> Weekly</label>
                <label style={{ display: 'block' }}><input data-progress="true" type="radio" name="p8_backup_schedule" value="monthly" /> Monthly</label>
              </div>

              <label style={{ marginTop: '.75rem', fontWeight: '900', display: 'block' }}>When will you test a restore?</label>
              <select id="p8_restore_test" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #ced4da', borderRadius: '8px' }}>
                <option value="">Choose one…</option>
                <option value="weekly">Every week</option>
                <option value="monthly">Once a month</option>
                <option value="quarterly">Every 3 months</option>
              </select>
              <label style={{ marginTop: '.75rem' }}><input data-progress="true" type="checkbox" /> I will test a restore (I understand why)</label>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb Care Plan:</strong> CapeWeb can set up automated website backups + uptime monitoring + quick rollback if something breaks.
          </div>
        </div>

        <div className="workbook-section" style={{ background: '#fff', border: '1px solid #e9ecef', padding: '1.25rem', borderRadius: '10px', marginTop: '1rem' }}>
          <h4>Device safety checklist (R0)</h4>
          <ul style={{ margin: '.6rem 0 0 1.25rem' }}>
            <li><label><input data-progress="true" type="checkbox" /> Turn on phone lock (PIN/biometrics)</label></li>
            <li><label><input data-progress="true" type="checkbox" /> Turn on "Find My Phone" / "Find My Device"</label></li>
            <li><label><input data-progress="true" type="checkbox" /> Enable automatic updates</label></li>
            <li><label><input data-progress="true" type="checkbox" /> Don't run the business on public Wi‑Fi without caution</label></li>
          </ul>
        </div>
      </div>

      {/* SECTION 5 */}
      <div className="mastery-section" data-topic="website security https ssl updates wordpress shopify cloudflare waf forms spam">
        <h3>5) Website security (even if your "website" is just a landing page)</h3>
        <p>
          Your website is a trust machine. If it's hacked or slow, customers leave.
          CapeWeb secures websites with simple, proven steps: HTTPS, updates, secure forms, and protective layers.
        </p>

        <div className="workbook-section" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🧱 Mission 4: The CapeWeb Website Security Baseline</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Must-haves</strong>
              <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
                <li><label><input data-progress="true" type="checkbox" /> HTTPS is on (lock icon)</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Admin accounts use MFA</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Updates are applied monthly</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Website has backups</label></li>
              </ul>

              <div style={{ marginTop: '.75rem' }}>
                <strong>Tools:</strong>
                <ul style={{ margin: '.5rem 0 0 1.25rem' }}>
                  <li><a href="https://letsencrypt.org/" target="_blank" rel="noopener noreferrer">Let's Encrypt (HTTPS)</a></li>
                  <li><a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">Cloudflare (basic WAF + bot protection)</a></li>
                </ul>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Quick scans (safe)</strong>
              <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
                <li><label><input data-progress="true" type="checkbox" /> Ran a Security Headers scan</label> — <a href="https://securityheaders.com/" target="_blank" rel="noopener noreferrer">securityheaders.com</a></li>
                <li><label><input data-progress="true" type="checkbox" /> Ran a Mozilla Observatory scan</label> — <a href="https://observatory.mozilla.org/" target="_blank" rel="noopener noreferrer">observatory.mozilla.org</a></li>
                <li><label><input data-progress="true" type="checkbox" /> Checked my site for common web risks</label> — <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer">OWASP Top 10</a></li>
              </ul>
              <p style={{ marginTop: '.75rem', color: '#6c757d' }}>
                Don't panic if you see warnings. Use the results as a checklist, not a judgment.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#e7f1ff', padding: '1rem', borderRadius: '8px', border: '1px solid #cfe2ff' }}>
            <strong>🔧 CapeWeb offer:</strong> We can harden your website: secure hosting, WAF setup, backups, updates, and monitoring —
            so you focus on sales, not fires.
          </div>
        </div>
      </div>

      {/* SECTION 6 */}
      <div className="mastery-section" data-topic="payments fraud chargebacks scams invoices links">
        <h3>6) Fraud prevention (payments, invoices, and "fake proof")</h3>
        <p>
          Risk management isn't only hacking. It's also money risk: fake payments, chargebacks, and scams.
          The CapeWeb rule is: <strong>verify money before releasing value</strong>.
        </p>

        <div className="workbook-section" style={{ background: '#fff', border: '1px solid #e9ecef', padding: '1.25rem', borderRadius: '10px' }}>
          <h4>✅ Simple fraud rules (works for any business)</h4>
          <ul style={{ margin: '.6rem 0 0 1.25rem' }}>
            <li><label><input data-progress="true" type="checkbox" /> I don't trust screenshots as proof of payment</label></li>
            <li><label><input data-progress="true" type="checkbox" /> I verify payment in the real dashboard / bank app</label></li>
            <li><label><input data-progress="true" type="checkbox" /> I use one official payment link / provider</label></li>
            <li><label><input data-progress="true" type="checkbox" /> I document delivery/collection (even a photo + date)</label></li>
          </ul>

          <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
            <summary style={{ color: '#0066cc', fontWeight: '900' }}>Simple example</summary>
            <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
              <p style={{ margin: 0 }}>
                Customer says: "I paid, here's a screenshot."<br />
                <strong>Your reply:</strong> "Thanks! I'll confirm it in our payment dashboard now. Once it reflects, we deliver/book immediately."
              </p>
            </div>
          </details>

          <div style={{ marginTop: '1rem', background: '#fff3cd', border: '1px solid #ffeeba', padding: '1rem', borderRadius: '8px', color: '#856404' }}>
            <strong>⚠️ Safety note:</strong> Don't post your bank details publicly in a way that can be edited or spoofed.
            Use a secure payment link when possible.
          </div>
        </div>
      </div>

      {/* SECTION 7 */}
      <div className="mastery-section" data-topic="incident response hacked account breach popia cybersecurity hub report">
        <h3>7) Incident response: what to do if you get hacked</h3>
        <p>
          If something goes wrong, your job is not to panic. Your job is to follow a plan.
          CapeWeb uses a simple 5‑step incident plan that normal people can execute.
        </p>

        <IncidentResponseDiagram />

        <div className="workbook-section" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🧯 Mission 5: Your "If hacked…" checklist</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Immediate actions</strong>
              <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
                <li><label><input data-progress="true" type="checkbox" /> Change passwords (start with email)</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Turn on / re-check MFA</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Log out other sessions/devices</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Check forwarding rules in email</label></li>
              </ul>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>When customer data might be involved</strong>
              <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
                <li><label><input data-progress="true" type="checkbox" /> Create an incident log (what/when/who)</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Get support (hosting/payment provider)</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Check reporting obligations (POPIA)</label></li>
              </ul>
              <p style={{ marginTop: '.75rem', color: '#6c757d' }}>
                If personal information is involved, you may have legal duties. When unsure, get professional advice.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
            <strong>Helpful reporting channels (South Africa):</strong>
            <ul style={{ margin: '.6rem 0 0 1.25rem' }}>
              <li><a href="https://www.cybersecurityhub.gov.za/report-an-incident" target="_blank" rel="noopener noreferrer">Report an incident to the Cybersecurity Hub (CSIRT)</a></li>
              <li><a href="https://inforegulator.org.za/" target="_blank" rel="noopener noreferrer">Information Regulator (POPIA)</a> — <a href="https://eservices.inforegulator.org.za/compromises/default.aspx" target="_blank" rel="noopener noreferrer">Security compromise portal</a></li>
            </ul>
          </div>

          <div style={{ marginTop: '1rem', background: '#e7f1ff', padding: '1rem', borderRadius: '8px', border: '1px solid #cfe2ff' }}>
            <strong>🔧 CapeWeb emergency support:</strong> If your site is compromised, CapeWeb can help: isolate, restore from backup, patch, and harden.
          </div>
        </div>
      </div>

      {/* SECTION 8 */}
      <div className="mastery-section" data-topic="risk register likelihood impact controls risk management">
        <h3>8) Risk management: build a simple Risk Register (so you don't forget)</h3>
        <p>
          A Risk Register is just a list of "things that could go wrong" and what you'll do about them.
          This is how real businesses stay calm.
        </p>

        <div className="workbook-section" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🗂️ Mission 6: Your Risk Register (interactive)</h4>
          <p style={{ marginTop: '.25rem' }}>Start with 3 risks. Add more later. Keep it simple.</p>

          <div style={{ overflow: 'auto', background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
            <table className="capeweb-table" style={{ minWidth: '920px' }}>
              <thead>
                <tr>
                  <th>Risk</th>
                  <th>Likelihood</th>
                  <th>Impact</th>
                  <th>Control (what you do)</th>
                  <th>Owner</th>
                  <th>Next action</th>
                </tr>
              </thead>
              <tbody id="p8-risk-body">
                <tr>
                  <td><input type="text" placeholder="Instagram hacked" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                  <td>
                    <select style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }}>
                      <option>Low</option><option defaultValue>Medium</option><option>High</option>
                    </select>
                  </td>
                  <td>
                    <select style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }}>
                      <option>Low</option><option>Medium</option><option defaultValue>High</option>
                    </select>
                  </td>
                  <td><input type="text" placeholder="MFA + recovery codes + admin access checks" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                  <td><input type="text" placeholder="Me" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                  <td><input type="text" placeholder="Turn on MFA today" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                </tr>
                <tr>
                  <td><input type="text" placeholder="Lost phone / stolen laptop" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                  <td>
                    <select style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }}>
                      <option defaultValue>Low</option><option>Medium</option><option>High</option>
                    </select>
                  </td>
                  <td>
                    <select style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }}>
                      <option>Low</option><option defaultValue>Medium</option><option>High</option>
                    </select>
                  </td>
                  <td><input type="text" placeholder="Device lock + Find My Device + backups" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                  <td><input type="text" placeholder="Me" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                  <td><input type="text" placeholder="Enable Find My Device" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                </tr>
                <tr>
                  <td><input type="text" placeholder="Fake proof of payment" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                  <td>
                    <select style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }}>
                      <option>Low</option><option defaultValue>Medium</option><option>High</option>
                    </select>
                  </td>
                  <td>
                    <select style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }}>
                      <option>Low</option><option defaultValue>Medium</option><option>High</option>
                    </select>
                  </td>
                  <td><input type="text" placeholder="Verify in dashboard; no screenshots" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                  <td><input type="text" placeholder="Me" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                  <td><input type="text" placeholder="Write payment policy and pin it" style={{ width: '100%', padding: '.5rem', border: '1px solid #ced4da', borderRadius: '8px' }} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <button type="button" id="p8-add-risk" style={{ padding: '.7rem 1rem', borderRadius: '8px', border: '1px solid #0b0f1a', background: '#0b0f1a', color: '#fff', fontWeight: '900', cursor: 'pointer' }}>
              + Add risk row
            </button>
            <button type="button" id="p8-export-risk" style={{ padding: '.7rem 1rem', borderRadius: '8px', border: '1px solid #0b0f1a', background: '#fff', color: '#0b0f1a', fontWeight: '900', cursor: 'pointer' }}>
              Export as CSV
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', background: '#fff', border: '1px solid #e9ecef', borderRadius: '999px', padding: '.4rem .75rem' }}>
              <input data-progress="true" type="checkbox" /> I created my first risk register
            </label>
          </div>

          <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb move:</strong> We turn your Risk Register into a monthly "shield routine" (updates, backups, access checks, scans).
          </div>
        </div>
      </div>
    </>
  );
}

export function Pillar8Quiz({ quizResponses, onSelect, onScore, scoreMessage }) {
  return (
    <div className="mastery-section" data-topic="pillar 8 test cybersecurity quiz mfa phishing backups incident response website">
      <h3>🏁 Boss Battle: Cybersecurity &amp; Risk Test</h3>
      <p>Score <strong>9/12</strong> or higher before moving to Pillar 9.</p>

      <div id="p8-test" className="workbook-section" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
        {pillar8QuizQuestions.map((q, index) => (
          <div key={index}>
            {index > 0 && <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '1rem 0' }} />}
            <div className="quiz-question">
              <p><strong>{index + 1})</strong> {q.question}</p>
              {q.options.map((opt, optIndex) => (
                <label key={optIndex} style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={`p8q${index}`}
                    checked={quizResponses[index] === optIndex}
                    onChange={() => onSelect(index, optIndex)}
                  /> {opt}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onScore}
          style={{ marginTop: '1rem', padding: '.75rem 1rem', borderRadius: '8px', border: '1px solid #0b0f1a', background: '#0b0f1a', color: '#fff', fontWeight: '900', cursor: 'pointer' }}
        >
          Check my score
        </button>

        <div style={{ marginTop: '.75rem', padding: '1rem', borderRadius: '10px', background: '#fff', border: '1px solid #e9ecef' }}>
          <strong>Score:</strong> {scoreMessage}
        </div>
      </div>
    </div>
  );
}

export function Pillar8Completion() {
  return (
    <div className="completion-box" style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed #ced4da' }}>
      <h3>🎉 Pillar 8 Complete</h3>
      <p>
        You can now protect your business like a pro: MFA, phishing awareness, backups, website baseline, fraud rules, incident plan, and a risk register.
        When you say "continue," we'll move to Pillar 9 (Financial Systems &amp; eCommerce) — so you can get paid cleanly and track profit.
      </p>
    </div>
  );
}

function BusinessAttackSurfaceDiagram() {
  return (
    <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
      <svg width="100%" viewBox="0 0 1200 430" role="img" aria-label="Diagram: Business attack surface map">
        <defs>
          <style>{`
            .bx { fill:#fff; stroke:#0b0f1a; stroke-width:2; }
            .tx { font: 18px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900; }
            .sm { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .ln { stroke:#0b0f1a; stroke-width:2; opacity:.25; }
          `}</style>
        </defs>

        <rect className="bx" x="430" y="40" width="340" height="100" rx="16" />
        <text className="tx" x="600" y="85" textAnchor="middle">Your Business</text>
        <text className="sm" x="600" y="110" textAnchor="middle">Protect the "doors"</text>

        <rect className="bx" x="70" y="200" width="220" height="90" rx="16" />
        <text className="tx" x="180" y="245" textAnchor="middle">Email</text>
        <text className="sm" x="180" y="270" textAnchor="middle">(the master key)</text>

        <rect className="bx" x="330" y="200" width="220" height="90" rx="16" />
        <text className="tx" x="440" y="245" textAnchor="middle">Social</text>
        <text className="sm" x="440" y="270" textAnchor="middle">(IG / FB / TikTok)</text>

        <rect className="bx" x="590" y="200" width="220" height="90" rx="16" />
        <text className="tx" x="700" y="245" textAnchor="middle">Website</text>
        <text className="sm" x="700" y="270" textAnchor="middle">(logins / forms)</text>

        <rect className="bx" x="850" y="200" width="280" height="90" rx="16" />
        <text className="tx" x="990" y="245" textAnchor="middle">Payments</text>
        <text className="sm" x="990" y="270" textAnchor="middle">(links / fraud)</text>

        <rect className="bx" x="250" y="320" width="260" height="90" rx="16" />
        <text className="tx" x="380" y="365" textAnchor="middle">Devices</text>
        <text className="sm" x="380" y="390" textAnchor="middle">(phones / laptops)</text>

        <rect className="bx" x="540" y="320" width="420" height="90" rx="16" />
        <text className="tx" x="750" y="365" textAnchor="middle">People + Process</text>
        <text className="sm" x="750" y="390" textAnchor="middle">(phishing, habits, training)</text>

        <line className="ln" x1="600" y1="140" x2="180" y2="200" />
        <line className="ln" x1="600" y1="140" x2="440" y2="200" />
        <line className="ln" x1="600" y1="140" x2="700" y2="200" />
        <line className="ln" x1="600" y1="140" x2="990" y2="200" />
        <line className="ln" x1="600" y1="140" x2="380" y2="320" />
        <line className="ln" x1="600" y1="140" x2="750" y2="320" />
      </svg>
      <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
        CapeWeb security starts with the "master key": your email. If email is safe, everything becomes easier.
      </figcaption>
    </figure>
  );
}

function SimpleBackupStrategyDiagram() {
  return (
    <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
      <svg width="100%" viewBox="0 0 1200 360" role="img" aria-label="Diagram: Simple backup strategy">
        <defs>
          <style>{`
            .bx { fill:#fff; stroke:#0b0f1a; stroke-width:2; }
            .tx { font: 18px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900; }
            .sm { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .ln { stroke:#0b0f1a; stroke-width:2.5; }
          `}</style>
          <marker id="arrP8a" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a" />
          </marker>
        </defs>

        <rect className="bx" x="70" y="70" width="300" height="110" rx="16" />
        <text className="tx" x="220" y="120" textAnchor="middle">Copy #1</text>
        <text className="sm" x="220" y="145" textAnchor="middle">Your working files</text>

        <rect className="bx" x="450" y="70" width="300" height="110" rx="16" />
        <text className="tx" x="600" y="120" textAnchor="middle">Copy #2</text>
        <text className="sm" x="600" y="145" textAnchor="middle">Cloud backup</text>

        <rect className="bx" x="830" y="70" width="300" height="110" rx="16" />
        <text className="tx" x="980" y="120" textAnchor="middle">Copy #3</text>
        <text className="sm" x="980" y="145" textAnchor="middle">Offline / external backup</text>

        <line className="ln" x1="370" y1="125" x2="450" y2="125" markerEnd="url(#arrP8a)" />
        <line className="ln" x1="750" y1="125" x2="830" y2="125" markerEnd="url(#arrP8a)" />

        <rect className="bx" x="240" y="220" width="720" height="110" rx="16" />
        <text className="tx" x="600" y="265" textAnchor="middle">Rule: test restores</text>
        <text className="sm" x="600" y="290" textAnchor="middle">A backup you can't restore is not a real backup.</text>
      </svg>
      <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
        You don't need fancy. You need consistent.
      </figcaption>
    </figure>
  );
}

function IncidentResponseDiagram() {
  return (
    <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
      <svg width="100%" viewBox="0 0 1200 280" role="img" aria-label="Diagram: Incident response steps">
        <defs>
          <style>{`
            .bx { fill:#fff; stroke:#0b0f1a; stroke-width:2; }
            .tx { font: 16px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900; }
            .sm { font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .ar { stroke:#0b0f1a; stroke-width:3; }
          `}</style>
          <marker id="arrP8b" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a" />
          </marker>
        </defs>

        <rect className="bx" x="30" y="80" width="210" height="120" rx="16" />
        <text className="tx" x="135" y="120" textAnchor="middle">1) Detect</text>
        <text className="sm" x="135" y="145" textAnchor="middle">something is wrong</text>

        <line className="ar" x1="240" y1="140" x2="300" y2="140" markerEnd="url(#arrP8b)" />

        <rect className="bx" x="300" y="80" width="210" height="120" rx="16" />
        <text className="tx" x="405" y="120" textAnchor="middle">2) Contain</text>
        <text className="sm" x="405" y="145" textAnchor="middle">stop the spread</text>

        <line className="ar" x1="510" y1="140" x2="570" y2="140" markerEnd="url(#arrP8b)" />

        <rect className="bx" x="570" y="80" width="210" height="120" rx="16" />
        <text className="tx" x="675" y="120" textAnchor="middle">3) Fix</text>
        <text className="sm" x="675" y="145" textAnchor="middle">reset access</text>

        <line className="ar" x1="780" y1="140" x2="840" y2="140" markerEnd="url(#arrP8b)" />

        <rect className="bx" x="840" y="80" width="210" height="120" rx="16" />
        <text className="tx" x="945" y="120" textAnchor="middle">4) Notify</text>
        <text className="sm" x="945" y="145" textAnchor="middle">customers/regulator</text>

        <line className="ar" x1="1050" y1="140" x2="1110" y2="140" markerEnd="url(#arrP8b)" />

        <rect className="bx" x="1110" y="80" width="60" height="120" rx="16" />
        <text className="tx" x="1140" y="120" textAnchor="middle">5)</text>
        <text className="tx" x="1140" y="145" textAnchor="middle">Learn</text>
      </svg>
      <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
        A plan beats panic. CapeWeb installs this process in your SOPs.
      </figcaption>
    </figure>
  );
}
