import React, { useEffect, useState } from 'react';

const getPillar11SupportPlan = (context = {}) => {
  const sector = (context.sector || '').toLowerCase();
  const geography = context.geography || 'South Africa';
  const language = context.language || 'English';

  if (sector.includes('township') || sector.includes('retail') || sector.includes('commerce') || sector.includes('shop')) {
    return {
      summary: `Most customers will DM or voice-call you. Keep WhatsApp as Support HQ and log proof-of-delivery photos so CPA + municipal inspectors can see your process in ${geography}.`,
      primaryChannel: 'whatsapp',
      primaryChannelLabel: 'WhatsApp Business + voice notes',
      backupChannel: 'phone',
      backupChannelLabel: 'Phone call / hotline',
      serviceStandards: {
        firstResponse: '10 minutes during trading hours',
        resolution: 'Same day for delivery / refund issues',
        tone: 'Warm, bilingual, proof-driven',
      },
      scriptPrompts: [
        `Deepseek, rewrite my delivery delay template in ${language} referencing CPA Section 56 rights.`,
        'Deepseek, craft a WhatsApp refund checklist that lists proof-of-payment, photo evidence, and POPIA consent.',
      ],
      compliance: 'Consumer Protection Act + POPIA require complaint logs, proof-of-purchase, and consent before broadcasting specials. City permits often ask for this register.',
      rituals: [
        { title: 'Daily WhatsApp sweep', description: 'Clear DMs at opening and close; send voice notes for complex cases.' },
        { title: 'Mid-week FAQ update', description: 'Refresh price lists, delivery timelines, and stock photos.' },
        { title: 'Friday loyalty broadcast', description: 'Send restock offers + request reviews via WhatsApp Catalog.' },
      ],
      retentionIdea: 'Offer a “delayed order” voucher and log redemptions in Google Sheets to prove recovery quality.',
    };
  }

  if (sector.includes('health') || sector.includes('clinic')) {
    return {
      summary: `Clinics and health services must triage calmly, protect patient info, and log incidents for HPCSA and the Information Regulator.`,
      primaryChannel: 'phone',
      primaryChannelLabel: 'Nurse line / switchboard',
      backupChannel: 'whatsapp',
      backupChannelLabel: 'WhatsApp (with POPIA consent)',
      serviceStandards: {
        firstResponse: 'Under 5 minutes for emergencies',
        resolution: '24 hours for claims / clinical questions',
        tone: 'Clinical, reassuring, policy-guided',
      },
      scriptPrompts: [
        `Deepseek, translate our triage + informed consent script into ${language}, referencing HPCSA wording.`,
        'Deepseek, outline breach notification steps for DOH + Information Regulator if a patient file is exposed.',
      ],
      compliance: 'HPCSA, DOH, and POPIA expect consent logs, incident registers, and documented escalation paths. Keep hard copies + digital backups for audits.',
      rituals: [
        { title: 'Morning triage huddle', description: 'Review unresolved cases and assign clinician owners.' },
        { title: 'POPIA log check', description: 'Record authorisations + incidents daily for InfoReg readiness.' },
        { title: 'Weekly follow-up sample', description: 'Call/SMS 5 patients to capture satisfaction + address escalations.' },
      ],
      retentionIdea: 'Send 24-hour follow-ups with medication reminders + HPCSA practice number to reinforce trust.',
    };
  }

  if (sector.includes('agri') || sector.includes('logistics')) {
    return {
      summary: `Agri/logistics teams juggle depot calls, truck updates, and export paperwork. Keep one radio/WhatsApp command channel plus an email log for buyers.`,
      primaryChannel: 'whatsapp',
      primaryChannelLabel: 'WhatsApp dispatch group',
      backupChannel: 'email',
      backupChannelLabel: 'Email (buyers + municipal inspectors)',
      serviceStandards: {
        firstResponse: '15 minutes for load / delivery queries',
        resolution: 'Within 1 business day for claims / paperwork',
        tone: 'Direct, timestamped, evidence-first',
      },
      scriptPrompts: [
        'Deepseek, craft a WhatsApp script for cold-chain alerts referencing DALRRD and PPECB requirements.',
        `Deepseek, create an email template for late delivery apologies in ${geography}, citing NRCS / transport permits.`,
      ],
      compliance: 'DALRRD, PPECB, and municipal permits require load numbers, cold-chain logs, and complaint registers. Keep them synced to your CX hub.',
      rituals: [
        { title: 'Morning load confirmation', description: 'Share truck ID, permit number, and ETA with buyers.' },
        { title: 'Incident escalation table', description: 'Record delays, temperature breaches, and who was notified.' },
        { title: 'Weekly buyer check-in', description: 'Summarise deliveries + highlight upcoming risks.' },
      ],
      retentionIdea: 'Send weekly WhatsApp digests with proof-of-delivery photos + SARS-ready POD numbers.',
    };
  }

  if (sector.includes('ngo') || sector.includes('non-profit') || sector.includes('social')) {
    return {
      summary: `Social enterprises serve beneficiaries + donors simultaneously. One WhatsApp hotline plus a donor email desk keeps everyone informed without extra logins.`,
      primaryChannel: 'whatsapp',
      primaryChannelLabel: 'WhatsApp hotline (beneficiaries)',
      backupChannel: 'email',
      backupChannelLabel: 'Email (donor desk)',
      serviceStandards: {
        firstResponse: 'Within 30 minutes during programme hours',
        resolution: '48 hours for donor or beneficiary escalations',
        tone: 'Trauma-informed, clear next steps',
      },
      scriptPrompts: [
        `Deepseek, draft a beneficiary update script in ${language} that includes safeguarding commitments.`,
        'Deepseek, prepare a donor impact update template referencing DSBD / NPO Act reporting metrics.',
      ],
      compliance: 'NPO Act + POPIA require safeguarding logs, consent forms, and incident reporting pathways (DSD, SAPS where applicable).',
      rituals: [
        { title: 'Beneficiary check-in block', description: 'Voice notes or calls twice a week to capture feedback.' },
        { title: 'Donor inbox power hour', description: 'Every Thursday, clear pledges and send receipts.' },
        { title: 'Safeguarding log review', description: 'Update incident tracker + escalate to governance team.' },
      ],
      retentionIdea: 'Share monthly WhatsApp voice notes (bilingual) thanking donors + sharing outcomes.',
    };
  }

  if (sector.includes('technology') || sector.includes('saas') || sector.includes('software')) {
    return {
      summary: `Keep a structured helpdesk (email/chat) and a WhatsApp escalation lane for enterprise clients. Document incidents for POPIA/PAIA and keep uptime comms ready.`,
      primaryChannel: 'email',
      primaryChannelLabel: 'Helpdesk (Help Scout / Zendesk)',
      backupChannel: 'whatsapp',
      backupChannelLabel: 'WhatsApp / Slack escalation',
      serviceStandards: {
        firstResponse: 'Under 30 minutes during business hours',
        resolution: 'Within 1 business day for Sev-2, 4 hours for Sev-1',
        tone: 'Guide energy + technical clarity',
      },
      scriptPrompts: [
        'Deepseek, write a “feature outage” status email that cites PAIA/POPIA obligations and next steps.',
        `Deepseek, create a multilingual onboarding script for ${language} support agents covering tone + escalation.`,
      ],
      compliance: 'POPIA + PAIA require documenting deletion requests, incident comms, and access logs. Keep checklists per release.',
      rituals: [
        { title: 'Daily stand-up with CX + engineering', description: 'Share blockers + customer pain before 09:30.' },
        { title: 'Weekly churn review', description: 'Map support tickets to retention risks and plan fixes.' },
        { title: 'Monthly PAIA/POPIA audit', description: 'Check requests, data deletion, and incident timelines.' },
      ],
      retentionIdea: 'Send a Monday “Success Pack”: feature tips, uptime summary, and CTA for office hours.',
    };
  }

  return {
    summary: `Default service businesses still need one Support HQ, a backup channel, and a CPA/POPIA-ready complaint log. Focus on rapid replies and WhatsApp-ready templates.`,
    primaryChannel: 'email',
    primaryChannelLabel: 'Shared inbox (Gmail/Help Scout)',
    backupChannel: 'whatsapp',
    backupChannelLabel: 'WhatsApp (consent-based)',
    serviceStandards: {
      firstResponse: 'Within 1 business hour',
      resolution: '24–48 hours',
      tone: 'Calm, helpful, next-step oriented',
    },
    scriptPrompts: [
      `Deepseek, write a bilingual (${language}/English) apology + recovery script for missed appointments.`,
      'Deepseek, outline a WhatsApp-ready returns policy referencing the Consumer Protection Act.',
    ],
    compliance: 'Log complaints, refunds, and consents so you can prove CPA/POPIA compliance in any province.',
    rituals: [
      { title: 'Morning inbox triage', description: 'Clear support queue before starting delivery work.' },
      { title: 'Weekly FAQ sync', description: 'Update top questions + publish the answers in your knowledge base.' },
      { title: 'Monthly review drive', description: 'Send review requests + compile testimonials for social proof.' },
    ],
    retentionIdea: 'Every resolved ticket becomes a chance to upsell, invite to a WhatsApp broadcast, or capture a review.',
  };
};

export const pillar11QuizQuestions = [
  {
    question: "CapeWeb's CX formula is:",
    options: ['Clarity + Speed + Trust', 'More posts + more stress'],
    correctIndex: 0,
  },
  {
    question: 'With R0 budget, the best support setup is usually:',
    options: ['One main support channel + one backup', 'Ten different inboxes'],
    correctIndex: 0,
  },
  {
    question: 'A support promise is:',
    options: ['Clear expectations about reply times and hours', 'A secret rule you never tell customers'],
    correctIndex: 0,
  },
  {
    question: 'Templates help because they:',
    options: ['Save time and keep replies consistent', 'Make customers feel ignored'],
    correctIndex: 0,
  },
  {
    question: 'An FAQ is useful because it:',
    options: ['Reduces repeated questions and increases trust', 'Replaces your product quality'],
    correctIndex: 0,
  },
  {
    question: 'Service recovery begins with:',
    options: ['Calm + listening ("I hear you")', 'Blaming the customer'],
    correctIndex: 0,
  },
  {
    question: 'A customer journey map helps you:',
    options: ['Improve the right moments (discover → buy → support)', 'Choose brand colors'],
    correctIndex: 0,
  },
  {
    question: 'A weekly CX loop should include:',
    options: ['Top questions → update FAQ/templates → choose 1 improvement', 'Ignore support messages until weekend'],
    correctIndex: 0,
  },
  {
    question: 'Reviews help growth because they:',
    options: ['Increase trust and reduce buyer fear', 'Make delivery faster automatically'],
    correctIndex: 0,
  },
  {
    question: 'A good "guide energy" reply sounds like:',
    options: ['"No stress — I\'ll help you. Here\'s what we do next…"', '"Not my problem."'],
    correctIndex: 0,
  },
];

export function Pillar11Content({ personalizationContext = {} }) {
  const personaPlan = getPillar11SupportPlan(personalizationContext);
  const personaLabel = personalizationContext?.sector || 'business';
  const geographyLabel = personalizationContext?.geography || 'South Africa';
  const needsMultilingual = personalizationContext?.language && personalizationContext.language !== 'English';
  const scriptPrompts = personaPlan.scriptPrompts || [];
  const supportRituals = personaPlan.rituals || [];

  const [supportHQ, setSupportHQ] = useState(personaPlan.primaryChannel || 'whatsapp');
  const [hours, setHours] = useState('');
  const [frt, setFrt] = useState('');
  const [promise, setPromise] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const [template1, setTemplate1] = useState('');
  const [template2, setTemplate2] = useState('');
  const [template3, setTemplate3] = useState('');
  const [template4, setTemplate4] = useState('');
  const [template5, setTemplate5] = useState('');
  const [exportMessage, setExportMessage] = useState('');

  const [faqQuestions, setFaqQuestions] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqMessage, setFaqMessage] = useState('');

  useEffect(() => {
    if (personaPlan.primaryChannel) {
      setSupportHQ(personaPlan.primaryChannel);
    }
  }, [personaPlan.primaryChannel]);

  const generatePromise = () => {
    const h = hours || 'Mon–Fri 9:00–17:00';
    const t = frt || 'within 2 hours (during support hours)';
    const text =
      `Thanks for reaching out! We're here to help.\n\n` +
      `Support hours: ${h}.\n` +
      `We reply ${t}.\n\n` +
      `To solve this fast, please share your order number (or a short description + photo if relevant).`;
    setPromise(text);
    setCopyMessage('');
  };

  const copyPromise = async () => {
    try {
      await navigator.clipboard.writeText(promise);
      setCopyMessage('Copied!');
    } catch (e) {
      setCopyMessage('Copy failed (select & copy manually).');
    }
  };

  const getTemplates = () => ({
    first_response: template1.trim(),
    delivery_update: template2.trim(),
    faq_answer: template3.trim(),
    refund_path: template4.trim(),
    review_request: template5.trim(),
  });

  const exportTemplates = () => {
    const data = getTemplates();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capeweb-support-templates.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportMessage('Exported!');
    setTimeout(() => setExportMessage(''), 2500);
  };

  const copyTemplates = async () => {
    const t = getTemplates();
    const text =
      `TEMPLATE 1 (First response)\n${t.first_response}\n\n` +
      `TEMPLATE 2 (Delivery/service update)\n${t.delivery_update}\n\n` +
      `TEMPLATE 3 (FAQ answer)\n${t.faq_answer}\n\n` +
      `TEMPLATE 4 (Refund path)\n${t.refund_path}\n\n` +
      `TEMPLATE 5 (Review request)\n${t.review_request}\n`;
    try {
      await navigator.clipboard.writeText(text);
      setExportMessage('Copied!');
    } catch (e) {
      setExportMessage('Copy failed (select & copy manually).');
    }
    setTimeout(() => setExportMessage(''), 2500);
  };

  const exportFAQ = () => {
    const qsText = faqQuestions.trim();
    const sample = faqAnswer.trim();

    const md =
      `# FAQ\n\n## Questions (draft)\n${qsText ? qsText.split('\n').map((l) => `- ${l}`).join('\n') : '- (Add your questions here)'}\n\n## Sample answer style\n${sample || '(Add a sample answer here)'}\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capeweb-faq-draft.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFaqMessage('FAQ exported!');
    setTimeout(() => setFaqMessage(''), 2500);
  };

  return (
    <>
      <div
        className="persona-context-card"
        style={{
          background: '#04172a',
          color: '#fff',
          borderRadius: '14px',
          padding: '1.5rem',
          border: '1px solid rgba(255,255,255,.12)',
          marginBottom: '1.5rem',
        }}
      >
        <p className="panel-eyebrow" style={{ color: 'rgba(255,255,255,.72)', marginBottom: '.4rem' }}>
          Context-aware CX focus
        </p>
        <h3 style={{ margin: 0 }}>Support blueprint for {personaLabel || 'your business'}</h3>
        <p style={{ marginTop: '.5rem', color: 'rgba(255,255,255,.82)' }}>{personaPlan.summary}</p>
        <div
          style={{
            marginTop: '1rem',
            background: 'rgba(255,255,255,.08)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid rgba(255,255,255,.12)',
          }}
        >
          <strong>Channels</strong>
          <p style={{ marginTop: '.35rem', color: 'rgba(255,255,255,.85)' }}>
            Primary: <strong>{personaPlan.primaryChannelLabel}</strong> • Backup: <strong>{personaPlan.backupChannelLabel}</strong>
          </p>
          <p style={{ marginBottom: 0, color: 'rgba(255,255,255,.7)' }}>Province / municipality focus: {geographyLabel}</p>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <strong>Service standards</strong>
          <ul style={{ margin: '.5rem 0 0 1.25rem', color: 'rgba(255,255,255,.9)' }}>
            <li>First response: {personaPlan.serviceStandards.firstResponse}</li>
            <li>Resolution target: {personaPlan.serviceStandards.resolution}</li>
            <li>Tone: {personaPlan.serviceStandards.tone}</li>
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
          <strong>Compliance reminder:</strong> {personaPlan.compliance}
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
            <strong>Language signal:</strong> Translate templates into English + {personalizationContext.language} so township/rural teams can copy/paste without errors.
          </div>
        )}
        {scriptPrompts.length ? (
          <div
            style={{
              marginTop: '1rem',
              background: 'rgba(255,255,255,.08)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px dashed rgba(255,255,255,.4)',
            }}
          >
            <strong>Deepseek helper prompts</strong>
            <ul style={{ margin: '.5rem 0 0 1.25rem', color: 'rgba(255,255,255,.86)' }}>
              {scriptPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="workbook-section" style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h4>🕒 Support ritual playbooks</h4>
        <p>Instead of logging dates, use these ritual cards as study notes. Each one explains what to do, which regulation it satisfies, and the tools to use.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1rem', marginTop: '.75rem' }}>
          {supportRituals.map((ritual) => (
            <div key={ritual.title} style={{ border: '1px solid #dee2e6', borderRadius: '10px', padding: '.9rem', background: '#f8f9fa' }}>
              <div style={{ fontWeight: 700 }}>{ritual.title}</div>
              <p style={{ marginTop: '.35rem', color: '#495057', fontSize: '.9rem' }}>{ritual.description}</p>
              <ul style={{ margin: '.5rem 0 0 1.25rem', color: '#6c757d' }}>
                <li>Primary channel: {personaPlan.primaryChannelLabel}</li>
                <li>Backup: {personaPlan.backupChannelLabel}</li>
                <li>Compliance ref: {personaPlan.compliance}</li>
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#e7f1ff', border: '1px solid #cfe2ff' }}>
          <strong>Retention idea:</strong> {personaPlan.retentionIdea}
        </div>
        <details style={{ marginTop: '.75rem' }}>
          <summary style={{ fontWeight: 700, color: '#0b7285' }}>Need another prompt?</summary>
          <p style={{ marginTop: '.35rem', color: '#495057' }}>
            Prompt example: “Deepseek, adapt Pillar 11 for a {personaLabel} in {geographyLabel}. I need bilingual scripts, CPA/POPIA compliance steps, and WhatsApp-ready SOPs.”
          </p>
        </details>
      </div>

      <div className="workbook-section" style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h4>📜 South African CX compliance map</h4>
        <p>Bookmark these official resources so you never guess what to send regulators or customers.</p>
        <ul style={{ margin: '.75rem 0 0 1.25rem', color: '#495057' }}>
          <li>
            <strong>Consumer Protection Act (NCC):</strong> register complaints, download Section 56 refund rules. <a href="https://www.thencc.gov.za/" target="_blank" rel="noopener noreferrer">National Consumer Commission</a>.
          </li>
          <li>
            <strong>National Consumer Tribunal:</strong> needed for credit/telco disputes. <a href="https://www.thenct.org.za/" target="_blank" rel="noopener noreferrer">NCT case files</a>.
          </li>
          <li>
            <strong>B-BBEE Commission:</strong> use their template for customer-facing affidavits (esp. supplier development). <a href="https://www.bbbeecommission.co.za/" target="_blank" rel="noopener noreferrer">Download resources</a>.
          </li>
          <li>
            <strong>HPCSA / DOH / NRCS:</strong> health + regulated services need sector-specific complaint forms. <a href="https://www.hpcsa.co.za/" target="_blank" rel="noopener noreferrer">HPCSA complaints</a>,{' '}
            <a href="https://www.nrcs.org.za/" target="_blank" rel="noopener noreferrer">NRCS product safety</a>.
          </li>
          <li>
            <strong>DSBD / SEDA service standards:</strong> align your helpdesk SLA wording to theirs when applying for supplier development support. <a href="https://www.dsbd.gov.za/" target="_blank" rel="noopener noreferrer">DSBD portal</a>.
          </li>
        </ul>
        <p style={{ marginTop: '.75rem', color: '#495057' }}>
          Keep a “CX evidence pack” (PDF folder) with: customer journey map, support promise, CPA-compliant refund script, proof of reply times, and B-BBEE affidavit—this is what municipal procurement officers or funders will ask for.
        </p>
      </div>

      <div className="mastery-section">
        <h3>1) Customer Experience (CX) is what people feel after dealing with you</h3>
        <p>
          Customer experience isn't only "being nice." It's how easy it is to buy, how clear your communication is, how fast you solve problems, and whether customers feel safe paying you.
        </p>

        <div className="workbook-section" style={{ background: '#0b0f1a', color: '#fff', border: '1px solid rgba(255,255,255,.12)', padding: '1.25rem', borderRadius: '12px', marginTop: '1rem' }}>
          <h4 style={{ margin: '0 0 .5rem 0' }}>CapeWeb's CX formula (simple)</h4>
          <p style={{ margin: 0, color: 'rgba(255,255,255,.85)' }}>
            <strong>Clarity</strong> (what happens next) + <strong>Speed</strong> (fast replies) + <strong>Trust</strong> (proof + policies) = customers who come back and tell their friends.
          </p>
        </div>

        <figure style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #E9ECEF', borderRadius: '10px', background: '#fff' }}>
          <div style={{ fontWeight: 900, marginBottom: '.5rem' }}>Diagram: CX Flywheel</div>
          <CXFlywheelDiagram />
        </figure>
      </div>

      <div className="mastery-section">
        <h3>2) Mini-lesson: "The customer is the hero" (StoryBrand principle)</h3>
        <p>
          <strong>Definition:</strong> In StoryBrand-style messaging, the customer is the hero and your business is the guide. People don't want to be "sold." They want to feel understood and guided to a clear result.
        </p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🎭 Example (support reply)</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '.75rem' }}>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Not great (customer feels blamed)</div>
              <p style={{ margin: '.5rem 0 0', color: '#6c757d' }}>"You didn't read the instructions. That's why it's not working."</p>
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>CapeWeb-style (guide energy)</div>
              <p style={{ margin: '.5rem 0 0', color: '#6c757d' }}>"No stress — I'll help you. Send me a photo of the setup and I'll guide you step-by-step. We'll get it working in a few minutes."</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mastery-section">
        <h3>3) Map the customer journey (so you fix the right moments)</h3>
        <p>Your customers interact with you in stages. If you improve one stage, sales and reviews improve too. CapeWeb uses a simple journey map for product + service businesses.</p>

        <figure style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #E9ECEF', borderRadius: '10px', background: '#fff' }}>
          <div style={{ fontWeight: 900, marginBottom: '.5rem' }}>Diagram: Customer Journey (simple)</div>
          <CustomerJourneyDiagram />
        </figure>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🗺️ Activity 1: Fill your journey map (your business)</h4>
          <p style={{ marginTop: '.25rem' }}>Write one sentence per stage. Keep it simple.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Discover</div>
              <textarea rows="3" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} placeholder="Example: they find us on Instagram Reels or Google search." />
            </div>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Understand</div>
              <textarea rows="3" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} placeholder="Example: they land on our offer page and see price + benefits." />
            </div>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Buy / Book</div>
              <textarea rows="3" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} placeholder="Example: they pay via link/checkout and get confirmation." />
            </div>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Delivery</div>
              <textarea rows="3" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} placeholder="Example: they receive delivery updates or a service reminder." />
            </div>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Support</div>
              <textarea rows="3" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} placeholder="Example: they message WhatsApp and we fix it fast." />
            </div>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Review / Repeat</div>
              <textarea rows="3" style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} placeholder="Example: we ask for a review and offer a small bonus for next order." />
            </div>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#E7F1FF', border: '1px solid #CFE2FF' }}>
            <strong>CapeWeb tie-in:</strong> this journey map becomes your improvement roadmap. We then fix bottlenecks using performance, SEO, messaging, and automation.
          </div>
        </div>
      </div>

      <div className="mastery-section">
        <h3>4) Choose your support channels (don't open 10 inboxes)</h3>
        <p>
          With R0 budget, you need one rule: <strong>one main support channel</strong> and one backup. Otherwise you will miss messages and customers will get angry.
        </p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>📬 Activity 2: Pick your "Support HQ"</h4>
          <p style={{ marginTop: '.25rem' }}>Choose your main channel for the next 30 days.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <label style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', display: 'block' }}>
              <input type="radio" name="p11-hq" value="whatsapp" checked={supportHQ === 'whatsapp'} onChange={(e) => setSupportHQ(e.target.value)} />
              <div style={{ fontWeight: 900, marginTop: '.35rem' }}>WhatsApp Business</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Fast for customers in {geographyLabel}</div>
            </label>

            <label style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', display: 'block' }}>
              <input type="radio" name="p11-hq" value="email" checked={supportHQ === 'email'} onChange={(e) => setSupportHQ(e.target.value)} />
              <div style={{ fontWeight: 900, marginTop: '.35rem' }}>Email</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>Good for longer issues + receipts</div>
            </label>

            <label style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', display: 'block' }}>
              <input type="radio" name="p11-hq" value="meta" checked={supportHQ === 'meta'} onChange={(e) => setSupportHQ(e.target.value)} />
              <div style={{ fontWeight: 900, marginTop: '.35rem' }}>Meta Inbox</div>
              <div style={{ color: '#6c757d', fontSize: '.92rem', marginTop: '.25rem' }}>If most customers DM on IG</div>
            </label>
          </div>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px dashed #ADB5BD', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontWeight: 900 }}>Write your "Support Promise" (copy/paste)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginTop: '.75rem' }}>
              <div>
                <label style={{ fontWeight: 900, display: 'block' }}>Support hours</label>
                <input type="text" placeholder="Mon–Fri 9:00–17:00" value={hours} onChange={(e) => setHours(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
              </div>
              <div>
                <label style={{ fontWeight: 900, display: 'block' }}>First reply time goal</label>
                <input type="text" placeholder="Within 2 hours (during support hours)" value={frt} onChange={(e) => setFrt(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} />
              </div>
            </div>

            <label style={{ fontWeight: 900, display: 'block', marginTop: '.75rem' }}>Support promise text</label>
            <textarea rows="4" value={promise} readOnly style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} placeholder="Click 'Generate my promise' to create your support promise..." />

            <div style={{ marginTop: '.75rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              <button type="button" onClick={generatePromise} style={{ padding: '.7rem 1rem', borderRadius: '10px', border: '1px solid #0B5ED7', background: '#0B5ED7', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
                Generate my promise
              </button>
              <button type="button" onClick={copyPromise} style={{ padding: '.7rem 1rem', borderRadius: '10px', border: '1px solid #0b0f1a', background: '#0b0f1a', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
                Copy promise
              </button>
              <span style={{ fontWeight: 900, color: '#198754' }}>{copyMessage}</span>
            </div>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#E6F4EA', border: '1px solid #C7E7D1' }}>
            <strong>✅ CapeWeb automation:</strong> We can add auto-replies, FAQ suggestions, booking links, and follow-ups across chat, email, and WhatsApp so customers feel guided without you being online 24/7.
          </div>
        </div>
      </div>

      <div className="mastery-section">
        <h3>5) Build a support SOP (so you don't "wing it")</h3>
        <p>An SOP is a simple step-by-step process. When you're busy, an SOP protects your customer experience.</p>

        <figure style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #E9ECEF', borderRadius: '10px', background: '#fff' }}>
          <div style={{ fontWeight: 900, marginBottom: '.5rem' }}>Diagram: Support triage decision tree</div>
          <TriageDiagram />
        </figure>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>📋 Activity 3: Create your SOP + templates</h4>
          <p style={{ marginTop: '.25rem' }}>Make 5 templates. You will use them every day. This saves time and keeps customers happy.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Template 1: First response</div>
              <textarea rows="4" value={template1} onChange={(e) => setTemplate1(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} placeholder="Example: Thanks for reaching out! I'm here to help. Can you share your order number (or a screenshot of the issue) so I can solve this fast?" />
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Template 2: Delivery / service update</div>
              <textarea rows="4" value={template2} onChange={(e) => setTemplate2(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} placeholder="Example: Quick update: your order is confirmed. Delivery is scheduled for [date/time]. I'll message you when I'm on the way." />
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Template 3: FAQ answer</div>
              <textarea rows="4" value={template3} onChange={(e) => setTemplate3(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} placeholder="Example: Great question! Here's how it works: (1) … (2) … (3) … If you want, I can help you choose the best option." />
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Template 4: Refund/return path (calm + clear)</div>
              <textarea rows="4" value={template4} onChange={(e) => setTemplate4(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }} placeholder="Example: I hear you. Let's fix this. Please send (1) your order number, (2) a photo of the issue, and (3) your preferred outcome (replacement or refund). I'll confirm the next steps today." />
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem', gridColumn: 'span 2' }}>
              <div style={{ fontWeight: 900 }}>Template 5: Review request (after success)</div>
              <textarea
                rows="4"
                value={template5}
                onChange={(e) => setTemplate5(e.target.value)}
                style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }}
                placeholder={`Example: Thanks again! If you loved the result, would you mind leaving a quick review? It helps a ${geographyLabel} business grow. Here's the link: [review link].`}
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={exportTemplates} style={{ padding: '.7rem 1rem', borderRadius: '10px', border: '1px solid #0b0f1a', background: '#0b0f1a', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
              Export templates (JSON)
            </button>
            <button type="button" onClick={copyTemplates} style={{ padding: '.7rem 1rem', borderRadius: '10px', border: '1px solid #0B5ED7', background: '#0B5ED7', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
              Copy templates (text)
            </button>
            <span style={{ fontWeight: 900, color: '#198754' }}>{exportMessage}</span>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#E7F1FF', border: '1px solid #CFE2FF' }}>
            <strong>CapeWeb automation:</strong> we can connect these templates to chat + WhatsApp + email so you can reply in 5 seconds, with consistent quality.
          </div>
        </div>
      </div>

      <div className="mastery-section">
        <h3>6) Build a simple FAQ (your support team that never sleeps)</h3>
        <p>If you answer the same question 20 times, that question belongs in an FAQ. A good FAQ reduces support messages and increases trust.</p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>📚 Activity 4: Your FAQ outline (copy/paste)</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Top 10 FAQ questions</div>
              <textarea
                rows="10"
                value={faqQuestions}
                onChange={(e) => setFaqQuestions(e.target.value)}
                style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }}
                placeholder={`1) How long does delivery take?\n2) What areas do you deliver to in ${geographyLabel}?\n3) How do I book the service?\n4) What if I chose the wrong option?\n5) What payment methods do you accept?\n...`}
              />
            </div>

            <div style={{ background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontWeight: 900 }}>Answer style guide (CapeWeb-style)</div>
              <ul style={{ margin: '.6rem 0 0 1.25rem', color: '#6c757d' }}>
                <li>Answer in 2–5 short sentences.</li>
                <li>Include "what happens next".</li>
                <li>Link to the next step (pay/book/contact).</li>
                <li>Use calm language (guide energy).</li>
              </ul>

              <div style={{ marginTop: '1rem', fontWeight: 900 }}>One sample answer</div>
              <textarea
                rows="6"
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
                style={{ width: '100%', marginTop: '.5rem', padding: '.65rem', border: '1px solid #CED4DA', borderRadius: '10px' }}
                placeholder={`Example: Delivery in ${geographyLabel} is usually 1–2 business days after payment. If you need it urgently, message us on WhatsApp and we'll confirm the soonest time.`}
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={exportFAQ} style={{ padding: '.7rem 1rem', borderRadius: '10px', border: '1px solid #0b0f1a', background: '#0b0f1a', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
              Export FAQ (Markdown)
            </button>
            <span style={{ fontWeight: 900, color: '#198754' }}>{faqMessage}</span>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#E6F4EA', border: '1px solid #C7E7D1' }}>
            <strong>✅ CapeWeb offer:</strong> We can turn your FAQ into a real help page, optimize it for SEO, and connect it to chat so answers appear instantly.
          </div>
        </div>
      </div>

      <div className="mastery-section">
        <h3>7) Service recovery: how to handle angry customers without losing the sale</h3>
        <p>Mistakes happen. The difference between average and excellent businesses is how they recover. Great service recovery often creates stronger loyalty than "no problem ever."</p>

        <div className="workbook-section" style={{ background: '#FFF3CD', border: '1px solid #FFECB5', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>🧯 CapeWeb's 4-step recovery script</h4>
          <ol style={{ margin: '.5rem 0 0 1.25rem' }}>
            <li>
              <strong>Calm + listen:</strong> "I hear you."
            </li>
            <li>
              <strong>Own the next step:</strong> "Here's what I will do now…"
            </li>
            <li>
              <strong>Give options:</strong> replace / refund / fix / credit (choose what fits)
            </li>
            <li>
              <strong>Close the loop:</strong> confirm resolution + ask if they're satisfied
            </li>
          </ol>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontWeight: 900 }}>Roleplay (interactive)</div>
            <p style={{ margin: '.5rem 0 0', color: '#6c757d' }}>Customer says: "This is terrible. I paid and it's not working. Waste of money."</p>

            <div className="quiz-question" style={{ marginTop: '.75rem' }}>
              <p style={{ margin: '0 0 .5rem 0' }}>
                <strong>Pick the best reply:</strong>
              </p>
              <label style={{ display: 'block' }}>
                <input type="radio" name="p11-recovery" /> "Not our fault. You must have done it wrong."
              </label>
              <label style={{ display: 'block' }}>
                <input type="radio" name="p11-recovery" /> "I hear you — that's frustrating. Let's fix it now. Please send a photo/video and your order number. I'll guide you step-by-step and if we can't solve it today, I'll offer a replacement or refund."
              </label>
              <label style={{ display: 'block' }}>
                <input type="radio" name="p11-recovery" /> "Okay."
              </label>
            </div>

            <details style={{ marginTop: '.75rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 900, color: '#0B5ED7' }}>Why this works</summary>
              <div style={{ marginTop: '.5rem', borderLeft: '3px solid #0B5ED7', paddingLeft: '1rem', color: '#6c757d' }}>
                The customer wants two things: <strong>to be heard</strong> and <strong>to know what happens next</strong>. Calm, clear steps reduce anger immediately.
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="mastery-section">
        <h3>8) CX metrics (simple) + feedback loop to improve the product/service</h3>
        <p>You don't need a big corporate dashboard. You need a weekly check that tells you: are customers happy, and where are they getting stuck?</p>

        <div className="workbook-section" style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', padding: '1.5rem', borderRadius: '10px' }}>
          <h4>📈 Activity 5: Choose your CX metrics</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '.75rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span>
                <strong>First response time:</strong> how fast you reply
              </span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span>
                <strong>Resolution time:</strong> how fast issues are solved
              </span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span>
                <strong>CSAT:</strong> "How satisfied are you?" (1–5)
              </span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span>
                <strong>Top 3 questions:</strong> repeated questions become FAQ items
              </span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span>
                <strong>Refund rate:</strong> if high, fix clarity/quality
              </span>
            </label>
            <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <input type="checkbox" />
              <span>
                <strong>Reviews per week:</strong> proof creates more sales
              </span>
            </label>
          </div>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontWeight: 900 }}>Weekly feedback loop (copy/paste checklist)</div>
            <ol style={{ margin: '.6rem 0 0 1.25rem', color: '#6c757d' }}>
              <li>List top 3 customer questions this week</li>
              <li>Update FAQ or templates to answer them</li>
              <li>Pick one improvement (page clarity, payment step, delivery updates)</li>
              <li>Measure results next week (Pillar 10 analytics)</li>
            </ol>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#0b0f1a', color: '#fff' }}>
            <strong>CapeWeb advantage:</strong> We connect CX → analytics → improvements. Support insights become better pages, better automation, faster checkout, and higher conversions. That's how growth compounds.
          </div>
        </div>
      </div>
    </>
  );
}

export function Pillar11Quiz({ quizResponses, onSelect, onScore, scoreMessage }) {
  return (
    <div className="workbook-section" style={{ background: '#0b0f1a', color: '#fff', border: '1px solid rgba(255,255,255,.12)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
      <h3 style={{ margin: '0 0 .75rem 0' }}>🏁 Pillar 11 Boss Battle: Can you run customer experience?</h3>
      <p style={{ margin: 0, color: 'rgba(255,255,255,.85)' }}>
        Score <strong>8/10</strong> to pass.
      </p>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
        {pillar11QuizQuestions.map((q, qIndex) => (
          <div key={qIndex} className="quiz-question">
            <p>
              <strong>Q{qIndex + 1}:</strong> {q.question}
            </p>
            {q.options.map((option, oIndex) => (
              <label key={oIndex} style={{ display: 'block' }}>
                <input type="radio" name={`p11q${qIndex}`} checked={quizResponses[qIndex] === oIndex} onChange={() => onSelect(qIndex, oIndex)} /> {option}
              </label>
            ))}
          </div>
        ))}
      </div>

      <button type="button" onClick={onScore} style={{ marginTop: '1rem', padding: '.75rem .95rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,.2)', background: '#ffffff', color: '#0b0f1a', fontWeight: 900, cursor: 'pointer' }}>
        Score my Boss Battle
      </button>

      <div style={{ marginTop: '.75rem', fontWeight: 900 }}>{scoreMessage}</div>

      <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}>
        <strong>Finish line:</strong> If you pass this, your course journey is complete — you now have a full "start to finish" system. Your next move is execution: weekly improvements + CapeWeb care plans for compounding growth.
      </div>
    </div>
  );
}

export function Pillar11Completion() {
  return (
    <div className="completion-box" style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed #CED4DA' }}>
      <h3>🎉 Pillar 11 Complete</h3>
      <p style={{ maxWidth: '860px', margin: '.5rem auto 0 auto' }}>
        You now have a customer journey map, a support promise, templates, an FAQ outline, a recovery script, and a weekly CX feedback loop. This is how a CapeWeb business becomes "well run" and trusted — even with R0 budget.
      </p>
    </div>
  );
}

function CXFlywheelDiagram() {
  return (
    <svg viewBox="0 0 1200 280" width="100%" height="auto" role="img" aria-label="CX flywheel diagram">
      <defs>
        <style>
          {`
          .bx{fill:#fff;stroke:#0b0f1a;stroke-width:2;rx:18;}
          .tx{font: 16px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900;}
          .sm{font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#6c757d;}
          .ln{stroke:#0b0f1a;stroke-width:3;opacity:.75;}
          `}
        </style>
        <marker id="p11arr" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a" />
        </marker>
      </defs>

      <rect className="bx" x="60" y="80" width="250" height="90" />
      <text className="tx" x="185" y="118" textAnchor="middle">
        Support
      </text>
      <text className="sm" x="185" y="142" textAnchor="middle">
        fast + helpful
      </text>

      <rect className="bx" x="360" y="80" width="250" height="90" />
      <text className="tx" x="485" y="118" textAnchor="middle">
        Trust
      </text>
      <text className="sm" x="485" y="142" textAnchor="middle">
        policies + proof
      </text>

      <rect className="bx" x="660" y="80" width="250" height="90" />
      <text className="tx" x="785" y="118" textAnchor="middle">
        Reviews
      </text>
      <text className="sm" x="785" y="142" textAnchor="middle">
        social proof
      </text>

      <rect className="bx" x="960" y="80" width="180" height="90" />
      <text className="tx" x="1050" y="118" textAnchor="middle">
        More sales
      </text>
      <text className="sm" x="1050" y="142" textAnchor="middle">
        easier growth
      </text>

      <line className="ln" x1="310" y1="125" x2="360" y2="125" markerEnd="url(#p11arr)" />
      <line className="ln" x1="610" y1="125" x2="660" y2="125" markerEnd="url(#p11arr)" />
      <line className="ln" x1="910" y1="125" x2="960" y2="125" markerEnd="url(#p11arr)" />

      <path d="M 1050 170 C 1020 240, 240 240, 185 170" fill="none" className="ln" markerEnd="url(#p11arr)" />
    </svg>
  );
}

function CustomerJourneyDiagram() {
  return (
    <svg viewBox="0 0 1200 260" width="100%" height="auto" role="img" aria-label="Customer journey map diagram">
      <defs>
        <style>
          {`
          .bx{fill:#fff;stroke:#0b0f1a;stroke-width:2;rx:16;}
          .tx{font: 14px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900;}
          .sm{font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#6c757d;}
          .ln{stroke:#0b0f1a;stroke-width:3;opacity:.7;}
          `}
        </style>
        <marker id="p11arr2" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a" />
        </marker>
      </defs>

      <rect className="bx" x="30" y="80" width="170" height="90" />
      <text className="tx" x="115" y="118" textAnchor="middle">
        Discover
      </text>
      <text className="sm" x="115" y="142" textAnchor="middle">
        IG / Google
      </text>

      <rect className="bx" x="230" y="80" width="170" height="90" />
      <text className="tx" x="315" y="118" textAnchor="middle">
        Understand
      </text>
      <text className="sm" x="315" y="142" textAnchor="middle">
        Offer page
      </text>

      <rect className="bx" x="430" y="80" width="170" height="90" />
      <text className="tx" x="515" y="118" textAnchor="middle">
        Buy / Book
      </text>
      <text className="sm" x="515" y="142" textAnchor="middle">
        Checkout
      </text>

      <rect className="bx" x="630" y="80" width="170" height="90" />
      <text className="tx" x="715" y="118" textAnchor="middle">
        Delivery
      </text>
      <text className="sm" x="715" y="142" textAnchor="middle">
        Updates
      </text>

      <rect className="bx" x="830" y="80" width="170" height="90" />
      <text className="tx" x="915" y="118" textAnchor="middle">
        Support
      </text>
      <text className="sm" x="915" y="142" textAnchor="middle">
        Fix issues
      </text>

      <rect className="bx" x="1030" y="80" width="140" height="90" />
      <text className="tx" x="1100" y="118" textAnchor="middle">
        Review
      </text>
      <text className="sm" x="1100" y="142" textAnchor="middle">
        Repeat
      </text>

      <line className="ln" x1="200" y1="125" x2="230" y2="125" markerEnd="url(#p11arr2)" />
      <line className="ln" x1="400" y1="125" x2="430" y2="125" markerEnd="url(#p11arr2)" />
      <line className="ln" x1="600" y1="125" x2="630" y2="125" markerEnd="url(#p11arr2)" />
      <line className="ln" x1="800" y1="125" x2="830" y2="125" markerEnd="url(#p11arr2)" />
      <line className="ln" x1="1000" y1="125" x2="1030" y2="125" markerEnd="url(#p11arr2)" />
    </svg>
  );
}

function TriageDiagram() {
  return (
    <svg viewBox="0 0 1200 320" width="100%" height="auto" role="img" aria-label="Support triage decision tree diagram">
      <defs>
        <style>
          {`
          .bx{fill:#fff;stroke:#0b0f1a;stroke-width:2;rx:16;}
          .tx{font: 14px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900;}
          .sm{font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#6c757d;}
          .ln{stroke:#0b0f1a;stroke-width:3;opacity:.75;}
          `}
        </style>
        <marker id="p11arr3" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a" />
        </marker>
      </defs>

      <rect className="bx" x="490" y="30" width="220" height="70" />
      <text className="tx" x="600" y="60" textAnchor="middle">
        New message
      </text>
      <text className="sm" x="600" y="82" textAnchor="middle">
        DM / WhatsApp / Email
      </text>

      <rect className="bx" x="140" y="140" width="260" height="80" />
      <text className="tx" x="270" y="170" textAnchor="middle">
        Is it urgent?
      </text>
      <text className="sm" x="270" y="195" textAnchor="middle">
        Safety / payment / access
      </text>

      <rect className="bx" x="470" y="140" width="260" height="80" />
      <text className="tx" x="600" y="170" textAnchor="middle">
        Question?
      </text>
      <text className="sm" x="600" y="195" textAnchor="middle">
        FAQ / how-to
      </text>

      <rect className="bx" x="800" y="140" width="260" height="80" />
      <text className="tx" x="930" y="170" textAnchor="middle">
        Complaint?
      </text>
      <text className="sm" x="930" y="195" textAnchor="middle">
        Angry / unhappy
      </text>

      <rect className="bx" x="140" y="250" width="260" height="60" />
      <text className="tx" x="270" y="285" textAnchor="middle">
        Respond now
      </text>

      <rect className="bx" x="470" y="250" width="260" height="60" />
      <text className="tx" x="600" y="285" textAnchor="middle">
        Use template
      </text>

      <rect className="bx" x="800" y="250" width="260" height="60" />
      <text className="tx" x="930" y="285" textAnchor="middle">
        Service recovery
      </text>

      <line className="ln" x1="600" y1="100" x2="270" y2="140" markerEnd="url(#p11arr3)" />
      <line className="ln" x1="600" y1="100" x2="600" y2="140" markerEnd="url(#p11arr3)" />
      <line className="ln" x1="600" y1="100" x2="930" y2="140" markerEnd="url(#p11arr3)" />

      <line className="ln" x1="270" y1="220" x2="270" y2="250" markerEnd="url(#p11arr3)" />
      <line className="ln" x1="600" y1="220" x2="600" y2="250" markerEnd="url(#p11arr3)" />
      <line className="ln" x1="930" y1="220" x2="930" y2="250" markerEnd="url(#p11arr3)" />
    </svg>
  );
}
