import React, { useMemo, useRef, useState, useEffect } from 'react';
import '../styles/CapeWebBlueprint.css';

const pillar2Modules = [
  { id: 'module-a', title: 'Module A · Choose Your Legal Setup', description: 'Decide your business structure and "make it real" without wasting money.' },
  { id: 'module-b', title: 'Module B · Register & Tax Basics', description: 'Understand CIPC, SARS, eFiling, VAT, and micro-business options.' },
  { id: 'module-c', title: 'Module C · Customers, POPIA & Online Selling', description: 'Protect your business with policies: CPA, ECTA, POPIA, PAIA.' },
  { id: 'module-d', title: 'Module D · Employers & Ongoing Compliance', description: 'PAYE/UIF/Compensation Fund + annual returns + beneficial ownership.' },
  { id: 'module-bonus', title: 'Bonus · Cape Town Permits & Tenders', description: 'City licences, informal trading permits, B-BBEE basics, CSD & eTenders.' },
];

const SECTOR_COMPLIANCE_GUIDES = {
  health: {
    summary: 'Health, wellness, and clinic operators need HPCSA/SAPC approvals, Department of Health facility licences, and strict POPIA consent logs.',
    links: [
      { label: 'HPCSA', url: 'https://www.hpcsa.co.za/', description: 'Register practitioners, check ethical rules, and download complaint forms.' },
      { label: 'Department of Health: Licencing', url: 'https://www.health.gov.za/certification-and-licensing/', description: 'Facility licences, inspections, and compliance criteria.' },
      { label: 'Information Regulator (POPIA)', url: 'https://inforegulator.org.za/', description: 'Appoint an Information Officer and file breach reports.' },
    ],
  },
  township: {
    summary: 'Township retailers and services rely on municipal permits, informal trading licences, fire safety certificates, and proof of address for banks.',
    links: [
      { label: 'Informal Trading Permits', url: 'https://www.capetown.gov.za/City-Connect/Register/Business-and-trade/Licences-and-permits/Apply-for-a-business-trade-permit', description: 'City of Cape Town example pack with downloadable forms.' },
      { label: 'NYDA Grant Programme', url: 'https://www.nyda.gov.za/Products-Services/NYDA-Grant-Programme.html', description: 'Micro-grants that require CIPC/SARS/CSD evidence up front.' },
      { label: 'SEDA Branch Locator', url: 'https://www.seda.org.za/our-offices/', description: 'Book compliance coaching and municipal liaison support.' },
    ],
  },
  agriculture: {
    summary: 'Agri and food businesses need DALRRD certifications, health inspections, and cold-chain records in addition to standard CIPC/SARS steps.',
    links: [
      { label: 'DALRRD', url: 'https://www.dalrrd.gov.za/', description: 'Food safety, veterinary public health, and agricultural permits.' },
      { label: 'Department of Health: Environmental Health', url: 'https://www.westerncape.gov.za/dept/health', description: 'Food premises inspections and compliance notes.' },
      { label: 'Land Bank / Agri Finance', url: 'https://landbank.co.za/', description: 'Blended finance that expects tax and compliance records.' },
    ],
  },
  ngo: {
    summary: 'NPOs/NPCs must align DSD registration, CIPC filings, Section 18A certificates, and donor POPIA requirements.',
    links: [
      { label: 'Department of Social Development NPO Register', url: 'https://www.dsd.gov.za/npo/', description: 'Register an NPO and submit annual narrative + financial reports.' },
      { label: 'SARS Section 18A Guide', url: 'https://www.sars.gov.za/businesses-and-employers/tax-exempt-institutions/', description: 'Approval process for issuing tax-deductible receipts.' },
      { label: 'NPO Act Resources', url: 'https://www.gov.za/documents/nonprofit-organisations-act', description: 'Governance expectations and compliance dates.' },
    ],
  },
  technology: {
    summary: 'Software/SaaS founders juggle CIPC, IP, data privacy, and in some cases ICASA registrations for communications services.',
    links: [
      { label: 'CIPC IP Online', url: 'https://iponline.cipc.co.za/', description: 'Trade marks and patents to secure core IP once traction appears.' },
      { label: 'ICASA Licensing', url: 'https://www.icasa.org.za/pages/licensing', description: 'Needed if you provide telecom or spectrum-reliant services.' },
      { label: 'POPIA Guidance', url: 'https://inforegulator.org.za/wp-content/uploads/2021/07/Guidance-Note-on-Information-Officers.pdf', description: 'Assign an Information Officer across your product stack.' },
    ],
  },
  tourism: {
    summary: 'Tourism and hospitality operators navigate liquor licences, tourism grading, fire safety, and municipal zoning approvals.',
    links: [
      { label: 'Tourism Grading Council', url: 'https://www.tourismgrading.co.za/', description: 'Quality assurance needed for tour operators/accommodation.' },
      { label: 'Liquor Authority (province-specific)', url: 'https://www.westerncape.gov.za/dept/economic-development-and-tourism', description: 'Check your province’s liquor board for licensing steps.' },
      { label: 'Fire Safety & Occupancy Certificates', url: 'https://www.capetown.gov.za/City-Connect/Apply/Municipal-services/Fire-safety/Apply-for-a-fire-safety-certificate', description: 'Example requirements for venues and guesthouses.' },
    ],
  },
};

const MUNICIPAL_PACKS = [
  {
    matcher: /(cape town|stellenbosch|paarl|western cape)/i,
    label: 'City of Cape Town',
    links: [
      { label: 'Business Hub', url: 'https://www.capetown.gov.za/work%20and%20business/see-all-business-facilities/business-hub/business-hub', description: 'Book advisory sessions for licencing and tenders.' },
      { label: 'Licences & Permits', url: 'https://www.capetown.gov.za/City-Connect/Register/Business-and-trade/Licences-and-permits', description: 'Download food, event, and informal trading forms.' },
      { label: 'Supply Chain Management', url: 'https://www.capetown.gov.za/Work%20and%20business/Doing-business-with-the-City/Procurement', description: 'Local procurement info, RFQs, and supplier registration.' },
    ],
  },
  {
    matcher: /(johannesburg|gauteng|tshwane|ekurhuleni|soweto|pretoria)/i,
    label: 'Gauteng Metros',
    links: [
      { label: 'City of Johannesburg Licences', url: 'https://www.joburg.org.za/services_/Pages/Services/Business-Licences/Business-Licences.aspx', description: 'Health, food, and general trade licences.' },
      { label: 'Gauteng Investment Centre', url: 'https://ggda.co.za/', description: 'One-stop shop for permits, incentives, and export help.' },
      { label: 'Tshwane Informal Trading', url: 'https://www.tshwane.gov.za/sites/Departments/Economic-Development/Pages/Informal-Trading.aspx', description: 'Permits + policy for markets and street trading.' },
    ],
  },
  {
    matcher: /(durban|ethekwini|kwazulu|kzn|umhlanga)/i,
    label: 'eThekwini / KZN',
    links: [
      { label: 'eThekwini Business Licensing', url: 'https://www.durban.gov.za/online-tools/business-licensing/', description: 'Food sales, accommodation, and event licence pack.' },
      { label: 'SmartXchange', url: 'https://www.smartxchange.co.za/', description: 'ICT + creative incubator (permits, grants, compliance).' },
      { label: 'KZN EDTEA', url: 'https://www.kznded.gov.za/', description: 'Provincial incentives and sector desks.' },
    ],
  },
  {
    matcher: /(limpopo|mpumalanga|eastern cape|northern cape|north west|free state|rural)/i,
    label: 'Rural & District Municipalities',
    links: [
      { label: 'SEDA District Offices', url: 'https://www.seda.org.za/our-offices/', description: 'Get help with permits, compliance, and supplier packs.' },
      { label: 'Co-operative Incentive Scheme', url: 'https://www.dsbd.gov.za/programmes/cooperative-incentive-scheme/', description: 'Grant support for rural/co-op formations.' },
      { label: 'Land Bank', url: 'https://landbank.co.za/', description: 'Agri finance that expects compliance documents ready.' },
    ],
  },
];

const LEGAL_STRUCTURE_LINKS = [
  {
    label: 'Sole Proprietor / Informal Trader',
    fit: 'Fastest start, use tax number + municipal permits + business bank account.',
    compliance: 'Register for tax (SARS), keep sales records, apply for municipal trading licences.',
    linkLabel: 'SARS Small Business Hub',
    link: 'https://www.sars.gov.za/businesses-and-employers/small-businesses-taxpayers/',
  },
  {
    label: 'Private Company (Pty) Ltd',
    fit: 'Needed for tenders, investors, or when you hire staff / sign leases.',
    compliance: 'Register at CIPC, appoint directors, file annual returns, keep share register.',
    linkLabel: 'BizPortal (CIPC)',
    link: 'https://bizportal.gov.za/',
  },
  {
    label: 'Non-Profit Company / NPO / Trust',
    fit: 'Impact ventures, NGOs with grants/donations.',
    compliance: 'Register at CIPC + DSD NPO directorate, apply for SARS tax exemption & Section 18A.',
    linkLabel: 'DSD NPO Portal',
    link: 'https://www.dsd.gov.za/npo/',
  },
  {
    label: 'Co-operative',
    fit: 'Farmer collectives, shared manufacturing, township buying groups.',
    compliance: 'Register via CIPC Co-op unit, adopt constitution, submit annual returns to CIPC + DSBD programme.',
    linkLabel: 'CIPC Co-operatives',
    link: 'https://www.cipc.co.za/?page_id=19773',
  },
];

const EMPLOYER_LINKS = [
  { label: 'UIF & uFiling', url: 'https://www.ufiling.co.za/uif/', description: 'Register employees for UIF via the Department of Employment and Labour.' },
  { label: 'Compensation Fund (COIDA)', url: 'https://www.labour.gov.za/workers-compensation', description: 'Cover staff for workplace injuries; submit ROE annually.' },
  { label: 'SARS PAYE & SDL', url: 'https://www.sars.gov.za/businesses-and-employers/paye/', description: 'Register for PAYE/SDL once payroll crosses thresholds.' },
  { label: 'SETA Skills Plans', url: 'https://www.etdpseta.org.za/education-sector/wsp-atp/', description: 'Workplace skills plans + mandatory grants per sector.' },
];

const DIGITAL_COMPLIANCE_LINKS = [
  { label: 'Consumer Protection Act (CPA)', url: 'https://www.gov.za/documents/consumer-protection-act', description: 'Fair marketing, refunds, disclosure obligations.' },
  { label: 'Electronic Communications & Transactions Act (ECTA)', url: 'https://www.gov.za/documents/electronic-communications-and-transactions-act', description: 'Online contract validity, data retention, cooling-off rules.' },
  { label: 'POPIA Essentials', url: 'https://inforegulator.org.za/wp-content/uploads/2021/09/POPIA-Guidelines.pdf', description: 'Consent, privacy notices, Information Officer duties.' },
  { label: 'PAIA Manuals', url: 'https://www.justice.gov.za/inforeg/docs/InfoRegSA-PAIA-Guidelines.pdf', description: 'Guide your public-facing access to information manual.' },
];

const FUNDING_STACK_LINKS = [
  { label: 'CSD Registration', url: 'https://secure.csd.gov.za/', description: 'Mandatory supplier master list for national/provincial tenders.' },
  { label: 'eTenders Portal', url: 'https://www.etenders.gov.za/', description: 'Monitor government tenders and download documents.' },
  { label: 'SEFA / SEDA Joint Portal', url: 'https://sefa.finfind.co.za/', description: 'Funding finder with compliance checklist uploads.' },
  { label: 'IDC / NEF Opportunity Roadmap', url: 'https://www.idc.co.za/how-to-apply/', description: 'Industrial funding requirements + downloadable forms.' },
];

const getSectorCompliancePack = (context = {}) => {
  const sector = (context.sector || '').toLowerCase();
  if (sector.includes('health')) return SECTOR_COMPLIANCE_GUIDES.health;
  if (sector.includes('township')) return SECTOR_COMPLIANCE_GUIDES.township;
  if (sector.includes('agri') || sector.includes('food')) return SECTOR_COMPLIANCE_GUIDES.agriculture;
  if (sector.includes('ngo') || sector.includes('npo')) return SECTOR_COMPLIANCE_GUIDES.ngo;
  if (sector.includes('tech') || sector.includes('saas') || sector.includes('digital')) return SECTOR_COMPLIANCE_GUIDES.technology;
  if (sector.includes('tourism') || sector.includes('travel')) return SECTOR_COMPLIANCE_GUIDES.tourism;
  return {
    summary: 'Start with CIPC/BizPortal, SARS, municipal permits, and B-BBEE/beneficial ownership records so funding and tenders open up later.',
    links: [
      { label: 'BizPortal', url: 'https://bizportal.gov.za/', description: 'Company registration, bank accounts, B-BBEE affidavits.' },
      { label: 'SARS eFiling', url: 'https://www.sarsefiling.co.za/', description: 'Register for income tax, VAT, PAYE, and submit returns.' },
      { label: 'B-BBEE Commission', url: 'https://www.bbbeecommission.co.za/', description: 'Affidavit templates and reporting rules.' },
    ],
  };
};

const getMunicipalPack = (geography = '') => {
  if (!geography) return null;
  return MUNICIPAL_PACKS.find((pack) => pack.matcher.test(geography)) || null;
};

const getLanguageNote = (language = 'English') =>
  language && language !== 'English'
    ? `Prepare bilingual policies (English + ${language}) for POPIA notices, support scripts, and municipal forms.`
    : null;

const buildPersonaContext = (context = {}) => ({
  sectorLabel: context.sector || 'South African SME',
  geographyLabel: context.geography || 'South Africa',
  stageLabel: context.revenueStage || 'early-stage',
  fundingLabel: context.fundingTarget || 'self-funded / mixed capital',
  regulationLabel: context.regulationFocus || 'general compliance',
});

export const pillar2QuizQuestions = [
  {
    question: 'CIPC is mainly used for:',
    options: ['Company registration and intellectual property', 'UIF monthly declarations', 'Roadworthy certificates'],
    correctIndex: 0,
  },
  {
    question: 'POPIA is enforced/overseen by:',
    options: ['The Information Regulator', 'The traffic department', 'The weather service'],
    correctIndex: 0,
  },
  {
    question: 'If you hire employees, you must learn about:',
    options: ['Only Instagram marketing', 'PAYE/UIF/Compensation Fund (as applicable)', 'Nothing changes legally'],
    correctIndex: 1,
  },
  {
    question: 'The Consumer Protection Act is about:',
    options: ['Fair marketplace rules and consumer rights', 'Football rules', 'Airline schedules'],
    correctIndex: 0,
  },
  {
    question: 'ECTA is important because:',
    options: [
      'It regulates electronic communications and transactions (e-commerce basics)',
      'It tells you what to post on TikTok',
      "It's a banking app",
    ],
    correctIndex: 0,
  },
  {
    question: '"Compliance Passport" in CapeWeb means:',
    options: [
      'A checklist you complete to be "legal enough to sell" and grow safely',
      'A passport for international travel',
      'A logo file',
    ],
    correctIndex: 0,
  },
  {
    question: 'If you trade in certain categories in Cape Town, you might need:',
    options: ['Nothing, ever', 'City permits/licences depending on your activity', "A driver's licence renewal"],
    correctIndex: 1,
  },
  {
    question: 'A smart founder approach is:',
    options: [
      'Start safe, keep records, and tighten compliance as you grow',
      'Ignore compliance until you have problems',
      'Wait forever before selling',
    ],
    correctIndex: 0,
  },
  {
    question: 'If you want to be tender-ready, you start with:',
    options: ['CSD registration, then eTenders', 'Buying followers', 'Only printing business cards'],
    correctIndex: 0,
  },
  {
    question: 'A trade mark is:',
    options: [
      'Required before your first sale',
      'A way to protect a valuable brand name (usually later)',
      'A delivery service',
    ],
    correctIndex: 1,
  },
];

export default function CapeWebPillar2() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModule, setActiveModule] = useState('module-a');
  const [quizResponses, setQuizResponses] = useState({});
  const [scoreMessage, setScoreMessage] = useState('Not checked yet.');
  const [progress, setProgress] = useState({ done: 0, total: 0, pct: 0 });
  const normalizedQuery = searchTerm.trim().toLowerCase();
  const articleRef = useRef(null);
  const navRef = useRef(null);

  const handleModuleChange = (moduleId) => {
    setActiveModule(moduleId);
    if (articleRef.current) {
      articleRef.current.scrollTop = 0;
    }
  };

  const handleQuizResponse = (questionIndex, optionIndex) => {
    setQuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleScore = () => {
    const correct = pillar2QuizQuestions.reduce((sum, question, index) => {
      return sum + (quizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 7
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 3.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setScoreMessage(message);
  };

  const updateProgress = () => {
    const items = document.querySelectorAll('[data-scroll-section-id="pillar2"] input[data-progress="true"]');
    const total = items.length;
    let done = 0;
    items.forEach((el) => {
      if ((el.type === 'checkbox' || el.type === 'radio') && el.checked) done += 1;
    });
    const pct = total ? Math.round((done / total) * 100) : 0;
    setProgress({ done, total, pct });
  };

  useEffect(() => {
    updateProgress();
    const handleChange = (e) => {
      if (e.target?.matches('input[data-progress="true"]')) {
        updateProgress();
      }
    };
    document.addEventListener('change', handleChange);
    return () => document.removeEventListener('change', handleChange);
  }, []);

  // Scroll isolation for article pane
  useEffect(() => {
    const el = articleRef.current;
    if (!el) return undefined;

    const handleWheel = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((isScrollingDown && !isAtBottom) || (isScrollingUp && !isAtTop)) {
        event.stopPropagation();
      }
    };

    const handleMouseEnter = () => {
      document.body.style.overflow = 'hidden';
    };

    const handleMouseLeave = () => {
      document.body.style.overflow = '';
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.overflow = '';
    };
  }, []);

  // Scroll isolation for navigation pane
  useEffect(() => {
    const el = navRef.current;
    if (!el) return undefined;

    const handleWheel = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((isScrollingDown && !isAtBottom) || (isScrollingUp && !isAtTop)) {
        event.stopPropagation();
      }
    };

    const handleMouseEnter = () => {
      document.body.style.overflow = 'hidden';
    };

    const handleMouseLeave = () => {
      document.body.style.overflow = '';
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.overflow = '';
    };
  }, []);

  const renderModuleContent = () => {
    if (normalizedQuery) {
      // When searching, show all matching content
      return (
        <>
          {activeModule === 'module-a' || normalizedQuery ? <Pillar2ModuleA /> : null}
          {activeModule === 'module-b' || normalizedQuery ? <Pillar2ModuleB /> : null}
          {activeModule === 'module-c' || normalizedQuery ? <Pillar2ModuleC /> : null}
          {activeModule === 'module-d' || normalizedQuery ? <Pillar2ModuleD /> : null}
          {activeModule === 'module-bonus' || normalizedQuery ? <Pillar2ModuleBonus /> : null}
        </>
      );
    }

    // Show only active module when not searching
    switch (activeModule) {
      case 'module-a':
        return <Pillar2ModuleA />;
      case 'module-b':
        return <Pillar2ModuleB />;
      case 'module-c':
        return <Pillar2ModuleC />;
      case 'module-d':
        return <Pillar2ModuleD />;
      case 'module-bonus':
        return <Pillar2ModuleBonus />;
      default:
        return <Pillar2ModuleA />;
    }
  };

  return (
    <div data-scroll-section-id="pillar2">
      <div className="blueprint-heading reveal-text">
        <div className="expand-label">CapeWeb University</div>
        <h2 className="expand-title-section" style={{ marginBottom: '1rem' }}>
          Pillar 2: Make it legal in South Africa — without fear, confusion, or expensive mistakes.
        </h2>
        <p className="expand-text-lg" style={{ maxWidth: '820px' }}>
          You are the founder (25, starting at R0) launching in Cape Town. Your goal is your <strong>first 100 sales</strong>. This pillar
          teaches the legal + compliance basics step-by-step, using a simple example you can adapt to any business: a hybrid business (a{' '}
          <strong>product</strong> + a <strong>service</strong>) selling online and locally in Cape Town. CapeWeb is your guide — we simplify
          the path, give you checklists and templates, and help you avoid rookie mistakes.
        </p>

        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#f8f9fa', maxWidth: '980px' }}>
          <strong>Important (read this once):</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li>This learning content is <strong>general information</strong>, not legal or tax advice.</li>
            <li>For contracts, tax decisions, and high-risk industries, use a qualified attorney/accountant.</li>
            <li>CapeWeb can help you implement the practical parts (compliance pages, policies, workflows, secure web systems).</li>
          </ul>
          <div style={{ marginTop: '.75rem' }}>
            <a
              href="/contact"
              target="_blank"
              rel="noopener"
              style={{
                display: 'inline-block',
                padding: '.65rem 1rem',
                borderRadius: '8px',
                background: '#0b0f1a',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Talk to CapeWeb about a Compliance Setup Pack →
            </a>
          </div>
        </div>
      </div>

      <div className="learn-capeweb-layout">
        <div className="learn-capeweb-toc-wrapper">
          <aside className="learn-capeweb-toc">
            <section className="learn-capeweb-controls">
              <div className="search-bar-wrapper">
                <input
                  id="capeweb-search-p2"
                  type="text"
                  placeholder="🔍 Search CapeWeb topics..."
                  className="learn-capeweb-search"
                  aria-label="Search CapeWeb blueprint content"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <p className="search-hint">Browse by pillar or type what you want to learn.</p>

              <div style={{ marginTop: '.75rem', padding: '.75rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '.75rem' }}>
                  <strong>Compliance Passport</strong>
                  <span style={{ fontSize: '.9rem', color: '#6c757d' }}>
                    {progress.pct}% complete
                  </span>
                </div>
                <div style={{ marginTop: '.5rem', height: '10px', background: '#e9ecef', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '10px', width: `${progress.pct}%`, background: '#0b0f1a' }}></div>
                </div>
                <p style={{ margin: '.5rem 0 0', fontSize: '.9rem', color: '#6c757d' }}>
                  Tick the checkboxes inside the pillar to track your progress.
                </p>
              </div>
            </section>

            <nav className="learn-capeweb-nav" aria-label="CapeWeb Blueprint Navigation" ref={navRef}>
              {pillar2Modules.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  className={`pillar-module ${activeModule === module.id ? 'is-active' : ''}`}
                  aria-current={activeModule === module.id ? 'true' : 'false'}
                  onClick={() => handleModuleChange(module.id)}
                  style={{ marginBottom: '.5rem' }}
                >
                  <div className="module-pill">Pillar 2</div>
                  <div>
                    <div className="module-title">{module.title}</div>
                    <p>{module.description}</p>
                  </div>
                </button>
              ))}
            </nav>
          </aside>
        </div>

        <div className="learn-capeweb-article-pane">
          <div className="learn-capeweb-article" ref={articleRef}>
            <div className="article-eyebrow">Pillar 2 · Legal, Governance & Compliance</div>
            <h1>Legally Ready for Your First 100 Sales (South Africa + Cape Town)</h1>

            <p className="article-summary">
              <strong>Objective:</strong> You will understand the legal basics to trade confidently in South Africa: business structure,
              registration, tax basics, POPIA, consumer rules for online selling, and ongoing compliance. You'll leave with a{' '}
              <strong>Compliance Passport</strong> checklist and a clear "what to do next" plan.
            </p>

            <div className="article-divider"></div>

            {renderModuleContent()}

            {!normalizedQuery && (
              <>
                <Pillar2Quiz quizResponses={quizResponses} onSelect={handleQuizResponse} onScore={handleScore} scoreMessage={scoreMessage} />
                <Pillar2Completion />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Module A: Choose Your Legal Setup
export function Pillar2ModuleA() {
  return (
    <div className="mastery-section" data-topic="legal setup structure sole proprietor pty ltd">
      <h3>Module A · Choose Your Legal Setup (Simple Decision, Big Impact)</h3>

      <p>
        Here's the truth: you can make your first sales while learning — but you must know which legal path you're on. CapeWeb's job is to
        keep you safe while you move fast.
      </p>

      <div style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <strong>Teaching example (adaptable):</strong>
        <p style={{ margin: '.5rem 0 0', color: '#495057' }}>
          A 25-year-old Cape Town founder launches a hybrid business: <strong>a product</strong> (digital starter pack) +{' '}
          <strong>a service</strong> (done-with-you setup). Your business can be totally different — the steps stay the same.
        </p>
      </div>

      <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <LegalStructureDecisionTree />
        <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
          This is not "one right answer" — it's about choosing a safe path for your stage.
        </figcaption>
      </figure>

      <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
        <h4>🧾 Activity: Your "Legal Setup" Snapshot</h4>
        <p>Answer these like a founder, not like a perfectionist.</p>

        <div className="canvas-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="canvas-box">
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '.5rem' }}>What are you selling first?</label>
            <label>
              <input data-progress="true" type="checkbox" /> A product (digital or physical)
            </label>
            <br />
            <label>
              <input data-progress="true" type="checkbox" /> A service (done-for-you or done-with-you)
            </label>
            <br />
            <small style={{ color: '#6c757d' }}>Hybrid is normal in South Africa. Many businesses start like this.</small>
          </div>

          <div className="canvas-box">
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '.5rem' }}>Your risk level right now</label>
            <select id="p2-risk" style={{ width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }}>
              <option value="">Choose…</option>
              <option value="low">Low risk (small orders, simple service)</option>
              <option value="medium">Medium risk (bigger payments, deliveries, refunds)</option>
              <option value="high">High risk (contracts, staff, expensive work)</option>
            </select>
            <small style={{ color: '#6c757d' }}>If you're unsure: pick "Medium".</small>
          </div>

          <div className="canvas-box" style={{ gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '.5rem' }}>Your stage (be honest)</label>
            <label>
              <input data-progress="true" type="radio" name="p2-stage" /> I'm testing first 10–100 sales (speed matters)
            </label>
            <br />
            <label>
              <input data-progress="true" type="radio" name="p2-stage" /> I already have contracts/large orders (structure matters)
            </label>
          </div>
        </div>

        <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
          <strong>✅ CapeWeb guidance:</strong> With a starting budget of <strong>R0</strong>, your mission is <strong>first 100 sales</strong>.
          Don't let paperwork stop progress — but don't ignore compliance either. CapeWeb keeps you moving with a checklist-based approach.
        </div>
      </div>

      <div className="workbook-section" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeeba', padding: '1.25rem', borderRadius: '10px', margin: '1.25rem 0', color: '#856404' }}>
        <h4 style={{ marginTop: 0 }}>⚠️ Rookie Mistake Warning</h4>
        <p style={{ margin: 0 }}>
          Don't confuse "being legal" with "being perfect." The goal is to be <strong>safe enough</strong> to sell and grow. CapeWeb will help
          you tighten compliance as revenue increases.
        </p>
      </div>
    </div>
  );
}

// Module B: Register & Tax Basics
export function Pillar2ModuleB() {
  return (
    <div className="mastery-section" data-topic="cipc bizportal sars efiling vat turnover tax">
      <h3>Module B · Register & Tax Basics (The "Do It Once, Do It Right" Setup)</h3>

      <p>This module gives you the "legal rails" your business runs on. You'll learn what to register, where, and why.</p>

      <div className="comparison-table-wrapper">
        <table className="capeweb-table">
          <thead>
            <tr>
              <th>Goal</th>
              <th>Where</th>
              <th>Link</th>
              <th>What CapeWeb helps with</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Register a company (optional early, common later)</td>
              <td>CIPC / BizPortal</td>
              <td>
                <a href="https://www.cipc.co.za/" target="_blank" rel="noopener">
                  CIPC
                </a>{' '}
                ·{' '}
                <a href="https://bizportal.gov.za/" target="_blank" rel="noopener">
                  BizPortal
                </a>
              </td>
              <td>Explain the steps simply, help you avoid incorrect details that cause delays.</td>
            </tr>
            <tr>
              <td>Understand business tax registration path</td>
              <td>SARS</td>
              <td>
                <a href="https://www.sars.gov.za/businesses-and-employers/small-businesses-taxpayers/starting-a-business-and-tax/registering/" target="_blank" rel="noopener">
                  SARS: Registering
                </a>
              </td>
              <td>Translate tax language into a founder checklist (what to do now vs later).</td>
            </tr>
            <tr>
              <td>VAT (only if you must / or if it benefits you)</td>
              <td>SARS VAT</td>
              <td>
                <a href="https://www.sars.gov.za/types-of-tax/value-added-tax/register-for-vat/" target="_blank" rel="noopener">
                  SARS: Register for VAT
                </a>
              </td>
              <td>Help you avoid VAT mistakes on invoices and pricing (once relevant).</td>
            </tr>
            <tr>
              <td>Micro-business simplified tax option</td>
              <td>SARS Turnover Tax</td>
              <td>
                <a href="https://www.sars.gov.za/types-of-tax/turnover-tax/" target="_blank" rel="noopener">
                  SARS: Turnover Tax
                </a>
              </td>
              <td>Explain if/when simplified tax might fit your stage (with professional referral if needed).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <RegistrationFlowDiagram />
        <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
          Keep it simple: set the rails → sell → improve compliance as you grow.
        </figcaption>
      </figure>

      <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
        <h4>🧭 Activity: Your Registration Plan (Pick ONE path for now)</h4>
        <p>Choose the path that matches your stage (R0 budget + first 100 sales goal).</p>

        <div className="quiz-options">
          <label className="radio-item">
            <input data-progress="true" type="radio" name="p2_path" value="test" />
            <strong>Path 1:</strong> Test Sales Path (start simple, tighten later)
          </label>
          <br />
          <label className="radio-item">
            <input data-progress="true" type="radio" name="p2_path" value="company" />
            <strong>Path 2:</strong> Register Company Path (structure first, sell after)
          </label>
        </div>

        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
            <strong>Test Sales Path Checklist</strong>
            <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>
                <label>
                  <input data-progress="true" type="checkbox" /> Keep a simple sales record (date, customer, amount)
                </label>
              </li>
              <li>
                <label>
                  <input data-progress="true" type="checkbox" /> Use clear terms (refunds + delivery + service scope)
                </label>
              </li>
              <li>
                <label>
                  <input data-progress="true" type="checkbox" /> Set up a "business email" + basic invoices
                </label>
              </li>
              <li>
                <label>
                  <input data-progress="true" type="checkbox" /> Plan when you'll formalise (after 20 sales or big contract)
                </label>
              </li>
            </ul>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
            <strong>Register Company Path Checklist</strong>
            <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>
                <label>
                  <input data-progress="true" type="checkbox" /> Register via{' '}
                  <a href="https://bizportal.gov.za/" target="_blank" rel="noopener">
                    BizPortal
                  </a>
                </label>
              </li>
              <li>
                <label>
                  <input data-progress="true" type="checkbox" /> Confirm SARS steps using{' '}
                  <a href="https://www.sars.gov.za/businesses-and-employers/small-businesses-taxpayers/starting-a-business-and-tax/registering/" target="_blank" rel="noopener">
                    SARS Registering
                  </a>
                </label>
              </li>
              <li>
                <label>
                  <input data-progress="true" type="checkbox" /> Open eFiling profile (for admin & compliance)
                </label>
              </li>
              <li>
                <label>
                  <input data-progress="true" type="checkbox" /> Plan your annual compliance tasks (returns, declarations)
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
          <strong>✅ CapeWeb speed tip:</strong> If you start with the "Test Sales Path", CapeWeb can still set you up with professional
          policies and a fast website later — without slowing down your first 100 sales.
        </div>
      </div>
    </div>
  );
}

// Module C: Tax Responsibilities
export function Pillar2ModuleC() {
  return (
    <div className="mastery-section" data-topic="consumer law ecta cpa refunds returns contracts">
      <h3>Module C · Customers, Online Selling & POPIA (Protect Your Business)</h3>

      <p>
        Your first 100 sales will come from trust. Trust comes from clarity. These basics protect you when things go wrong: refunds,
        complaints, chargebacks, disputes, and data privacy.
      </p>

      <div style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <strong>How CapeWeb helps (practical):</strong>
        <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
          <li>
            <strong>Content that converts</strong>: clear offers and pages (no confusing "fine print").
          </li>
          <li>
            <strong>Automation built-in</strong>: proof of consent, lead tracking, and clean customer communication.
          </li>
          <li>
            <strong>Care plans</strong>: keep your site, policies, and flows updated as you grow.
          </li>
        </ul>
      </div>

      <h4 style={{ marginTop: '1.5rem' }}>1) Consumer Protection Basics (CPA)</h4>
      <p>
        The Consumer Protection Act exists to protect customers and enforce fair business behaviour. Your goal as a founder is simple: be
        clear, be fair, keep records.
      </p>

      <div className="comparison-table-wrapper">
        <table className="capeweb-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Why it matters for your first 100 sales</th>
              <th>Official starting point</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Consumer rights & fair marketing</td>
              <td>Avoid misleading claims and angry customers.</td>
              <td>
                <a href="https://www.gov.za/documents/consumer-protection-act" target="_blank" rel="noopener">
                  Consumer Protection Act (Gov)
                </a>{' '}
                ·{' '}
                <a href="https://thencc.org.za/" target="_blank" rel="noopener">
                  National Consumer Commission
                </a>
              </td>
            </tr>
            <tr>
              <td>E-commerce & online transactions</td>
              <td>Online sales need extra clarity (terms, checkout, proof).</td>
              <td>
                <a href="https://www.gov.za/documents/electronic-communications-and-transactions-act" target="_blank" rel="noopener">
                  ECTA (Gov)
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 style={{ marginTop: '1.5rem' }}>2) POPIA (Data Privacy) — Don't Panic, Just Follow the Rules</h4>
      <p>
        If you collect customer info (names, emails, phone numbers, addresses), you must respect privacy and keep data safe. POPIA is enforced
        by the Information Regulator.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
        <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
          <strong>Official POPIA starts here</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li>
              <a href="https://inforegulator.org.za/" target="_blank" rel="noopener">
                Information Regulator
              </a>
            </li>
            <li>
              <a href="https://inforegulator.bizportal.gov.za/Default.aspx" target="_blank" rel="noopener">
                Information Regulator Services (BizPortal)
              </a>
            </li>
            <li>
              <a href="https://www.gov.za/documents/protection-personal-information-act" target="_blank" rel="noopener">
                POPIA Act (Gov)
              </a>
            </li>
          </ul>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
          <strong>What founders must do (simple)</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li>Collect only what you need</li>
            <li>Tell people why you collect it</li>
            <li>Keep it secure (passwords, access control)</li>
            <li>Don't spam (consent matters)</li>
            <li>Have a privacy policy + process</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Module D: Employers & Ongoing Compliance
export function Pillar2ModuleD() {
  return (
    <div className="mastery-section" data-topic="employer paye uif compensation fund annual returns beneficial ownership governance">
      <h3>Module D · Employers & Ongoing Compliance (Stay in Good Standing)</h3>

      <p>
        As you grow beyond the first 100 sales, you will likely hire help. When that happens, there are employer obligations. Also, registered
        entities have ongoing filing responsibilities. CapeWeb helps you build a simple compliance calendar so nothing surprises you.
      </p>

      <h4>1) If you hire employees (even one)</h4>
      <div className="comparison-table-wrapper">
        <table className="capeweb-table">
          <thead>
            <tr>
              <th>Compliance</th>
              <th>What it's for</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PAYE (Employees' Tax)</td>
              <td>Registering as an employer for Employees' Tax.</td>
              <td>
                <a href="https://www.sars.gov.za/types-of-tax/pay-as-you-earn/registering/" target="_blank" rel="noopener">
                  SARS: PAYE Registering
                </a>
              </td>
            </tr>
            <tr>
              <td>UIF (uFiling)</td>
              <td>Register, declare, and pay UIF contributions online.</td>
              <td>
                <a href="https://ufiling.labour.gov.za/uif/" target="_blank" rel="noopener">
                  UIF uFiling
                </a>
              </td>
            </tr>
            <tr>
              <td>Compensation Fund</td>
              <td>Insurance cover for occupational injuries/diseases for employees.</td>
              <td>
                <a href="https://cfonline.labour.gov.za/OnlineSubmissions/" target="_blank" rel="noopener">
                  Compensation Fund: Online Submissions
                </a>{' '}
                ·{' '}
                <a href="https://www.gov.za/services/compensation-fund/register-compensation-fund" target="_blank" rel="noopener">
                  Gov: Register with Compensation Fund
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 style={{ marginTop: '1.5rem' }}>2) If you registered a company: Annual Returns + Beneficial Ownership</h4>
      <p>Being registered is not "set and forget." CIPC expects ongoing submissions for companies/CCs to stay in good standing.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
        <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
          <strong>CIPC Annual Returns (official tools)</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li>
              <a href="https://annualreturns.cipc.co.za/Login.aspx" target="_blank" rel="noopener">
                Annual Returns Portal
              </a>
            </li>
            <li>
              <a href="https://www.cipc.co.za/wp-content/uploads/2024/07/Step-by-step-guide-on-how-to-file-AR_v4.0.pdf" target="_blank" rel="noopener">
                Step-by-step filing guide (PDF)
              </a>
            </li>
          </ul>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
          <strong>Beneficial Ownership (official guidance)</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li>
              <a href="https://www.cipc.co.za/wp-content/uploads/2023/08/USER-GUIDELINES-BO-LEGISLATIVE-REQUIREMENTS_Aug-23.pdf" target="_blank" rel="noopener">
                Beneficial ownership user guidelines (PDF)
              </a>
            </li>
            <li>
              <a href="https://www.cipc.co.za/" target="_blank" rel="noopener">
                CIPC Home
              </a>
            </li>
          </ul>
        </div>
      </div>

      <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <ComplianceCalendarDiagram />
        <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
          CapeWeb builds compliance like a calendar — not like a panic attack.
        </figcaption>
      </figure>
    </div>
  );
}

// Bonus Module: Cape Town Permits & Tenders
export function Pillar2ModuleBonus() {
  return (
    <div className="mastery-section" data-topic="cape town permits licence informal trading coa">
      <h3>Bonus · Cape Town Permits, Licences & Tender Readiness</h3>

      <p>
        Most online-first businesses won't need special permits at day 1. But Cape Town has specific licences/permits for certain activities
        (especially food, entertainment, hawking, etc.). This section helps you check quickly.
      </p>

      <div className="comparison-table-wrapper">
        <table className="capeweb-table">
          <thead>
            <tr>
              <th>If your business does this…</th>
              <th>You may need…</th>
              <th>Where to check/apply</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Runs certain health/entertainment/meal supply activities</td>
              <td>Business licence (depending on category)</td>
              <td>
                <a href="https://www.capetown.gov.za/City-Connect/Apply/Licences-and-permits/Business-and-trade/Apply-for-a-business-licence/" target="_blank" rel="noopener">
                  City of Cape Town: Apply for a business licence
                </a>
              </td>
            </tr>
            <tr>
              <td>Sells goods in public spaces</td>
              <td>Informal trading permit</td>
              <td>
                <a href="https://www.capetown.gov.za/City-Connect/Apply/Licences-and-permits/Business-and-trade/Apply-for-an-informal-trading-permit" target="_blank" rel="noopener">
                  City of Cape Town: Informal trading permit
                </a>
              </td>
            </tr>
            <tr>
              <td>Handles/sells food (premises or person in charge)</td>
              <td>Certificate of Acceptability (COA)</td>
              <td>
                <a href="https://www.capetown.gov.za/City-Connect/Apply/Health-and-safety/Environmental-health/Apply-for-a-certificate-of-acceptability" target="_blank" rel="noopener">
                  City of Cape Town: COA
                </a>
              </td>
            </tr>
            <tr>
              <td>Sells liquor in Western Cape</td>
              <td>Liquor licensing process</td>
              <td>
                <a href="https://www.wcla.gov.za/" target="_blank" rel="noopener">
                  WCLA
                </a>{' '}
                ·{' '}
                <a href="https://www.wcla.gov.za/licensing/application-forms/new-liquor-licence/" target="_blank" rel="noopener">
                  New Liquor Licence forms
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
        <h4>🏛️ Bonus: Government tenders & supplier registration (optional)</h4>
        <p>If one day you want to supply government (services or products), this is your path:</p>

        <ol style={{ margin: '.75rem 0 0 1.25rem' }}>
          <li>
            <label>
              <input data-progress="true" type="checkbox" /> Register on the Central Supplier Database (CSD)
            </label>
          </li>
          <li>
            <label>
              <input data-progress="true" type="checkbox" /> Use CSD credentials to access eTenders
            </label>
          </li>
          <li>
            <label>
              <input data-progress="true" type="checkbox" /> Prepare B-BBEE documents (where relevant)
            </label>
          </li>
        </ol>

        <p style={{ marginTop: '1rem' }}>
          Links:{' '}
          <a href="https://secure.csd.gov.za/" target="_blank" rel="noopener">
            CSD Portal
          </a>{' '}
          ·{' '}
          <a href="https://secure.csd.gov.za/Account/Register" target="_blank" rel="noopener">
            CSD Register
          </a>{' '}
          ·{' '}
          <a href="https://www.etenders.gov.za/" target="_blank" rel="noopener">
            eTenders
          </a>
        </p>
      </div>
    </div>
  );
}

export function Pillar2Quiz({ quizResponses, onSelect, onScore, scoreMessage }) {
  return (
    <div className="mastery-section">
      <h3>🏁 Boss Battle: Pillar 2 Knowledge Test</h3>
      <p>
        Score <strong>7/10</strong> or higher before moving to Pillar 3.
      </p>
      <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px' }}>
        {pillar2QuizQuestions.map((question, index) => (
          <React.Fragment key={index}>
            <div className="quiz-question">
              <p>
                <strong>{index + 1})</strong> {question.question}
              </p>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="radio-item" style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={`quiz-${index}`}
                    checked={quizResponses[index] === optionIndex}
                    onChange={() => onSelect(index, optionIndex)}
                  />{' '}
                  {option}
                </label>
              ))}
            </div>
            {index < pillar2QuizQuestions.length - 1 && <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '1rem 0' }} />}
          </React.Fragment>
        ))}

        <button
          type="button"
          onClick={onScore}
          style={{
            marginTop: '1rem',
            padding: '.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #0b0f1a',
            background: '#0b0f1a',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Check my score
        </button>

        <div
          style={{
            marginTop: '.75rem',
            padding: '1rem',
            borderRadius: '10px',
            background: '#fff',
            border: scoreMessage.startsWith('✅') ? '1px solid #c3e6cb' : scoreMessage.startsWith('❌') ? '1px solid #f5c6cb' : '1px solid #e9ecef',
          }}
        >
          <strong>Score:</strong> {scoreMessage}
        </div>
      </div>
    </div>
  );
}

export function Pillar2Completion() {
  return (
    <div className="completion-box" style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed #ced4da' }}>
      <h3>🎉 Pillar 2 Complete</h3>
      <p>
        You now understand how South African compliance works at a practical level: structure, registrations, tax basics, customer rules,
        POPIA, and ongoing duties. When you say "continue to Pillar 3", CapeWeb will guide you to build your fast, legal-ready digital HQ
        (website + forms + conversion systems).
      </p>
    </div>
  );
}

// SVG Diagram: Legal Structure Decision Tree
function LegalStructureDecisionTree() {
  return (
    <svg viewBox="0 0 800 480" style={{ width: '100%', maxWidth: '800px', height: 'auto' }}>
      <defs>
        <linearGradient id="gradStructure1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#c6ff35', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#0b0f1a', stopOpacity: 0.15 }} />
        </linearGradient>
        <linearGradient id="gradStructure2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffc107', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#ff6b35', stopOpacity: 0.2 }} />
        </linearGradient>
      </defs>

      {/* Start node */}
      <rect x="280" y="10" width="240" height="60" rx="12" fill="url(#gradStructure1)" stroke="#0b0f1a" strokeWidth="2" />
      <text x="400" y="35" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0b0f1a">
        Starting Point
      </text>
      <text x="400" y="55" textAnchor="middle" fontSize="13" fill="#495057">
        What's your stage?
      </text>

      {/* Arrow from start */}
      <line x1="400" y1="70" x2="400" y2="110" stroke="#0b0f1a" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Decision: Risk level */}
      <rect x="280" y="110" width="240" height="70" rx="12" fill="#fff" stroke="#0b0f1a" strokeWidth="2" />
      <text x="400" y="135" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0b0f1a">
        Is your risk HIGH?
      </text>
      <text x="400" y="155" textAnchor="middle" fontSize="12" fill="#6c757d">
        (contracts, staff, deliveries,
      </text>
      <text x="400" y="170" textAnchor="middle" fontSize="12" fill="#6c757d">
        expensive work)
      </text>

      {/* Path: Yes - High Risk → Pty Ltd */}
      <line x1="520" y1="145" x2="600" y2="145" stroke="#0b0f1a" strokeWidth="2" />
      <line x1="600" y1="145" x2="600" y2="220" stroke="#0b0f1a" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="565" y="140" fontSize="12" fontWeight="700" fill="#0b0f1a">
        YES
      </text>

      {/* High Risk Result: Pty Ltd */}
      <rect x="530" y="220" width="180" height="90" rx="10" fill="url(#gradStructure2)" stroke="#d32f2f" strokeWidth="2" />
      <text x="620" y="245" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0b0f1a">
        Register Pty Ltd
      </text>
      <text x="620" y="265" textAnchor="middle" fontSize="11" fill="#495057">
        Limited liability,
      </text>
      <text x="620" y="280" textAnchor="middle" fontSize="11" fill="#495057">
        separate legal entity,
      </text>
      <text x="620" y="295" textAnchor="middle" fontSize="11" fill="#495057">
        compliance required
      </text>

      {/* Path: No - Low/Medium Risk */}
      <line x1="280" y1="145" x2="200" y2="145" stroke="#0b0f1a" strokeWidth="2" />
      <line x1="200" y1="145" x2="200" y2="220" stroke="#0b0f1a" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="230" y="140" fontSize="12" fontWeight="700" fill="#0b0f1a">
        NO
      </text>

      {/* Second Decision: First sales or partner? */}
      <rect x="90" y="220" width="220" height="70" rx="10" fill="#fff" stroke="#0b0f1a" strokeWidth="2" />
      <text x="200" y="245" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0b0f1a">
        Need partners?
      </text>
      <text x="200" y="265" textAnchor="middle" fontSize="11" fill="#6c757d">
        More than one owner?
      </text>
      <text x="200" y="280" textAnchor="middle" fontSize="11" fill="#6c757d">
        Profit sharing?
      </text>

      {/* Path: Yes - Partners → CC */}
      <line x1="200" y1="290" x2="200" y2="340" stroke="#0b0f1a" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="210" y="320" fontSize="12" fontWeight="700" fill="#0b0f1a">
        YES
      </text>

      <rect x="110" y="340" width="180" height="80" rx="10" fill="url(#gradStructure2)" stroke="#f57c00" strokeWidth="2" />
      <text x="200" y="365" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0b0f1a">
        Register CC
      </text>
      <text x="200" y="385" textAnchor="middle" fontSize="11" fill="#495057">
        Multiple members,
      </text>
      <text x="200" y="400" textAnchor="middle" fontSize="11" fill="#495057">
        shared governance
      </text>

      {/* Path: No - Solo → Sole Proprietor */}
      <line x1="310" y1="255" x2="380" y2="255" stroke="#0b0f1a" strokeWidth="2" />
      <line x1="380" y1="255" x2="380" y2="340" stroke="#0b0f1a" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="325" y="250" fontSize="12" fontWeight="700" fill="#0b0f1a">
        NO
      </text>

      <rect x="310" y="340" width="180" height="90" rx="10" fill="url(#gradStructure1)" stroke="#388e3c" strokeWidth="2" />
      <text x="400" y="365" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0b0f1a">
        Sole Proprietor
      </text>
      <text x="400" y="385" textAnchor="middle" fontSize="11" fill="#495057">
        Start fast, low cost,
      </text>
      <text x="400" y="400" textAnchor="middle" fontSize="11" fill="#495057">
        you = the business,
      </text>
      <text x="400" y="415" textAnchor="middle" fontSize="11" fill="#495057">
        personal liability
      </text>

      {/* Arrowhead marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" fill="#0b0f1a">
          <polygon points="0 0, 10 3, 0 6" />
        </marker>
      </defs>

      {/* Legend */}
      <text x="20" y="460" fontSize="11" fill="#6c757d" fontStyle="italic">
        Choose the path that matches your risk + stage.
      </text>
    </svg>
  );
}

// SVG Diagram: Registration Flow
function RegistrationFlowDiagram() {
  return (
    <svg viewBox="0 0 700 360" style={{ width: '100%', maxWidth: '700px', height: 'auto' }}>
      <defs>
        <linearGradient id="gradReg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#c6ff35', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#0b0f1a', stopOpacity: 0.2 }} />
        </linearGradient>
        <linearGradient id="gradReg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4fc3f7', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#0277bd', stopOpacity: 0.3 }} />
        </linearGradient>
        <linearGradient id="gradReg3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#81c784', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#388e3c', stopOpacity: 0.3 }} />
        </linearGradient>
      </defs>

      {/* Step 1: CIPC */}
      <rect x="40" y="80" width="180" height="100" rx="12" fill="url(#gradReg1)" stroke="#0b0f1a" strokeWidth="2" />
      <text x="130" y="110" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0b0f1a">
        Step 1
      </text>
      <text x="130" y="135" textAnchor="middle" fontSize="14" fontWeight="600" fill="#0b0f1a">
        CIPC / BizPortal
      </text>
      <text x="130" y="155" textAnchor="middle" fontSize="11" fill="#495057">
        Register company,
      </text>
      <text x="130" y="170" textAnchor="middle" fontSize="11" fill="#495057">
        reserve name
      </text>

      {/* Arrow 1 → 2 */}
      <line x1="220" y1="130" x2="270" y2="130" stroke="#0b0f1a" strokeWidth="2" markerEnd="url(#arrowhead2)" />
      <text x="245" y="120" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0b0f1a">
        THEN
      </text>

      {/* Step 2: SARS */}
      <rect x="270" y="80" width="180" height="100" rx="12" fill="url(#gradReg2)" stroke="#0b0f1a" strokeWidth="2" />
      <text x="360" y="110" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0b0f1a">
        Step 2
      </text>
      <text x="360" y="135" textAnchor="middle" fontSize="14" fontWeight="600" fill="#0b0f1a">
        SARS
      </text>
      <text x="360" y="155" textAnchor="middle" fontSize="11" fill="#495057">
        Get Income Tax number,
      </text>
      <text x="360" y="170" textAnchor="middle" fontSize="11" fill="#495057">
        open eFiling
      </text>

      {/* Arrow 2 → 3 */}
      <line x1="450" y1="130" x2="500" y2="130" stroke="#0b0f1a" strokeWidth="2" markerEnd="url(#arrowhead2)" />
      <text x="475" y="120" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0b0f1a">
        THEN
      </text>

      {/* Step 3: Start Selling */}
      <rect x="500" y="80" width="180" height="100" rx="12" fill="url(#gradReg3)" stroke="#0b0f1a" strokeWidth="2" />
      <text x="590" y="110" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0b0f1a">
        Step 3
      </text>
      <text x="590" y="135" textAnchor="middle" fontSize="14" fontWeight="600" fill="#0b0f1a">
        Start Selling
      </text>
      <text x="590" y="155" textAnchor="middle" fontSize="11" fill="#495057">
        Legally ready,
      </text>
      <text x="590" y="170" textAnchor="middle" fontSize="11" fill="#495057">
        first 100 sales
      </text>

      {/* Alternative path label */}
      <rect x="100" y="220" width="500" height="100" rx="10" fill="#fff" stroke="#e9ecef" strokeWidth="2" strokeDasharray="5,5" />
      <text x="350" y="245" textAnchor="middle" fontSize="13" fontWeight="700" fill="#856404">
        Or: Start with "Test Sales Path"
      </text>
      <text x="350" y="265" textAnchor="middle" fontSize="11" fill="#6c757d">
        Skip registration, use simple invoicing + clear terms,
      </text>
      <text x="350" y="280" textAnchor="middle" fontSize="11" fill="#6c757d">
        plan to formalize after 20 sales or when you get a big contract.
      </text>
      <text x="350" y="300" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#6c757d">
        CapeWeb guides you with the practical parts either way.
      </text>

      {/* Title */}
      <text x="350" y="40" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0b0f1a">
        Registration Flow: "Structure First" Path
      </text>

      {/* Arrowhead marker */}
      <defs>
        <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" fill="#0b0f1a">
          <polygon points="0 0, 10 3, 0 6" />
        </marker>
      </defs>
    </svg>
  );
}

// SVG Diagram: Compliance Calendar
function ComplianceCalendarDiagram() {
  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', maxWidth: '800px', height: 'auto' }}>
      <defs>
        <linearGradient id="gradCal1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#c6ff35', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#c6ff35', stopOpacity: 0.15 }} />
        </linearGradient>
        <linearGradient id="gradCal2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4fc3f7', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#4fc3f7', stopOpacity: 0.15 }} />
        </linearGradient>
        <linearGradient id="gradCal3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ff6b6b', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#ff6b6b', stopOpacity: 0.15 }} />
        </linearGradient>
      </defs>

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0b0f1a">
        Compliance Calendar: What Happens When
      </text>

      {/* Column 1: Weekly/As-You-Go */}
      <rect x="40" y="70" width="220" height="380" rx="12" fill="url(#gradCal1)" stroke="#0b0f1a" strokeWidth="2" />
      <text x="150" y="100" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0b0f1a">
        Weekly / As-You-Go
      </text>

      <g transform="translate(60, 120)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Record all sales
        </text>
      </g>

      <g transform="translate(60, 145)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Issue invoices
        </text>
      </g>

      <g transform="translate(60, 170)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Track expenses
        </text>
      </g>

      <g transform="translate(60, 195)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Save receipts
        </text>
      </g>

      <g transform="translate(60, 220)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Respond to customers
        </text>
      </g>

      <g transform="translate(60, 245)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Update privacy policy
        </text>
        <text x="15" y="25" fontSize="10" fill="#6c757d">
          (as business changes)
        </text>
      </g>

      <rect x="60" y="280" width="180" height="60" rx="8" fill="#fff" stroke="#0b0f1a" strokeWidth="1" />
      <text x="150" y="300" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0b0f1a">
        Why it matters:
      </text>
      <text x="150" y="318" textAnchor="middle" fontSize="10" fill="#495057">
        Build habits early —
      </text>
      <text x="150" y="332" textAnchor="middle" fontSize="10" fill="#495057">
        compliance = good records
      </text>

      {/* Column 2: Monthly */}
      <rect x="290" y="70" width="220" height="380" rx="12" fill="url(#gradCal2)" stroke="#0b0f1a" strokeWidth="2" />
      <text x="400" y="100" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0b0f1a">
        Monthly
      </text>

      <g transform="translate(310, 120)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          VAT return (if registered)
        </text>
      </g>

      <g transform="translate(310, 145)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          PAYE submission
        </text>
        <text x="15" y="25" fontSize="10" fill="#6c757d">
          (if you have employees)
        </text>
      </g>

      <g transform="translate(310, 180)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          UIF declaration
        </text>
        <text x="15" y="25" fontSize="10" fill="#6c757d">
          (if you have employees)
        </text>
      </g>

      <g transform="translate(310, 215)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Review cash flow
        </text>
      </g>

      <g transform="translate(310, 240)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Reconcile bank statements
        </text>
      </g>

      <rect x="310" y="280" width="180" height="60" rx="8" fill="#fff" stroke="#0b0f1a" strokeWidth="1" />
      <text x="400" y="300" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0b0f1a">
        Why it matters:
      </text>
      <text x="400" y="318" textAnchor="middle" fontSize="10" fill="#495057">
        Stay on top of taxes,
      </text>
      <text x="400" y="332" textAnchor="middle" fontSize="10" fill="#495057">
        avoid penalties
      </text>

      {/* Column 3: Annual */}
      <rect x="540" y="70" width="220" height="380" rx="12" fill="url(#gradCal3)" stroke="#0b0f1a" strokeWidth="2" />
      <text x="650" y="100" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0b0f1a">
        Annual
      </text>

      <g transform="translate(560, 120)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Income tax return
        </text>
      </g>

      <g transform="translate(560, 145)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          CIPC Annual Return
        </text>
        <text x="15" y="25" fontSize="10" fill="#6c757d">
          (if company/CC registered)
        </text>
      </g>

      <g transform="translate(560, 180)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Beneficial ownership
        </text>
        <text x="15" y="25" fontSize="10" fill="#6c757d">
          (if required)
        </text>
      </g>

      <g transform="translate(560, 215)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Compensation Fund return
        </text>
        <text x="15" y="25" fontSize="10" fill="#6c757d">
          (if employees)
        </text>
      </g>

      <g transform="translate(560, 250)">
        <circle cx="5" cy="5" r="4" fill="#0b0f1a" />
        <text x="15" y="10" fontSize="12" fill="#0b0f1a">
          Renew licences/permits
        </text>
        <text x="15" y="25" fontSize="10" fill="#6c757d">
          (if applicable)
        </text>
      </g>

      <rect x="560" y="290" width="180" height="60" rx="8" fill="#fff" stroke="#0b0f1a" strokeWidth="1" />
      <text x="650" y="310" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0b0f1a">
        Why it matters:
      </text>
      <text x="650" y="328" textAnchor="middle" fontSize="10" fill="#495057">
        Stay in good standing,
      </text>
      <text x="650" y="342" textAnchor="middle" fontSize="10" fill="#495057">
        avoid deregistration
      </text>

      {/* Bottom note */}
      <text x="400" y="480" textAnchor="middle" fontSize="11" fontStyle="italic" fill="#6c757d">
        CapeWeb helps you build this calendar into your workflow — not as panic, but as rhythm.
      </text>
    </svg>
  );
}
