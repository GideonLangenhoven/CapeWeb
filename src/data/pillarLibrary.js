export const PILLAR_LIBRARY = [
  {
    pillar: 1,
    slug: 'pillar1',
    title: 'Strategic Foundation & Brand Identity',
    basePriority: 11,
    quizGoal: 7,
    objectives: [
      'Validate the WHO + PROBLEM + RESULT message with real South African data.',
      'Align StoryBrand messaging, lean canvas, and 30-day sprint around the founder’s capacity.',
    ],
    risks: ['Building random assets without proof', 'Over-spending on branding before first sales'],
    archetypeNotes: {
      'township retail': 'Focus on hyper-local positioning, WhatsApp sales copy, and cash/lay-by hooks.',
      services: 'Use proof (testimonials, before/after) to reduce perceived risk for SMEs and governments.',
    },
    resources: [
      {
        label: 'Lean Canvas Template (Miro)',
        url: 'https://miro.com/templates/lean-canvas/',
        description: 'One-page business model snapshot.',
        tags: ['general', 'technology', 'services'],
      },
      {
        label: 'Stats SA Interactive Data',
        url: 'https://www.statssa.gov.za/',
        description: 'Population, income, and municipal data for sizing your market.',
        tags: ['general', 'township', 'agriculture'],
      },
      {
        label: 'Google Trends (South Africa)',
        url: 'https://trends.google.com/trends/explore?geo=ZA',
        description: 'Spot keyword momentum and seasonal demand.',
        tags: ['general', 'technology', 'commerce'],
      },
    ],
  },
  {
    pillar: 2,
    slug: 'pillar2',
    title: 'Legal, Governance & Compliance',
    basePriority: 10,
    quizGoal: 7,
    objectives: [
      'Pick the right legal form, register, and stay compliant without freezing progress.',
      'Layer POPIA/CPA/PAIA + municipal permits for the chosen trade.',
    ],
    risks: ['Penalties from CIPC/SARS/municipalities', 'Missing B-BBEE/CSD data for tenders'],
    archetypeNotes: {
      'township retail': 'Add informal trading permits, health inspections, and cash-control SOPs.',
      health: 'Map HPCSA/SAPC regulations and patient data handling.',
      ngo: 'Register NPO/Trust, master Section 18A + DSD reporting.',
    },
    resources: [
      { label: 'CIPC', url: 'https://www.cipc.co.za/', description: 'Company, IP, and compliance filings.', tags: ['general'] },
      { label: 'BizPortal', url: 'https://bizportal.gov.za/', description: 'Fast-track registration, bank, B-BBEE affidavits.', tags: ['general'] },
      { label: 'SARS Small Business Hub', url: 'https://www.sars.gov.za/businesses-and-employers/small-businesses-taxpayers/starting-a-business-and-tax/registering/', description: 'Tax registrations and turnover/VAT guides.', tags: ['general'] },
      { label: 'SEDA', url: 'https://www.seda.org.za/', description: 'Non-financial support, incubation, sector experts.', tags: ['general', 'township', 'ngo'] },
      { label: 'sefa Funding Portal', url: 'https://sefa.finfind.co.za/', description: 'Working capital, contract funding, bridging loans.', tags: ['commerce', 'manufacturing', 'township'] },
      { label: 'NYDA Grants', url: 'https://www.nyda.gov.za/Products-Services/NYDA-Grant-Programme.html', description: 'Micro grants for youth-owned businesses.', tags: ['township', 'technology', 'agriculture'] },
      { label: 'CSD + eTender', url: 'https://secure.csd.gov.za/', description: 'Supplier registration for government work.', tags: ['services', 'construction', 'ngo'] },
      { label: 'B-BBEE Commission', url: 'https://www.bbbeecommission.co.za/', description: 'Level affidavits, compliance, scorecards.', tags: ['general', 'commerce'] },
    ],
  },
  {
    pillar: 3,
    slug: 'pillar3',
    title: 'Web Development & Architecture',
    basePriority: 9,
    quizGoal: 8,
    objectives: ['Select the right build mode (R0, service HQ, ecommerce) and ship it fast.', 'Wire Core Web Vitals + lead capture + WhatsApp + analytics.'],
    risks: ['Slow/no mobile performance', 'No trust signals, missing compliance pages'],
    archetypeNotes: {
      'township retail': 'Landing page + WhatsApp + SnapScan/Paxi buttons, highlight delivery radius.',
      manufacturing: 'Product data + catalog download + enquiry workflows.',
      technology: 'Funnel to demos and proof-of-value pages.',
    },
    resources: [
      { label: '.co.za Domain Register', url: 'https://registry.net.za/', description: '.co.za registration and DNS info.', tags: ['general'] },
      { label: 'Gov .za website policies', url: 'https://www.justice.gov.za/legislation/acts/2002-25.pdf', description: 'ECTA compliance for ecommerce pages.', tags: ['general'] },
      { label: 'WhatsApp Business Platform', url: 'https://business.whatsapp.com/', description: 'Forms and automated replies for leads.', tags: ['township', 'services'] },
      { label: 'Shopstar', url: 'https://www.shopstar.co.za/', description: 'Local ecommerce builder for SA SMEs.', tags: ['commerce', 'manufacturing'] },
    ],
  },
  {
    pillar: 4,
    slug: 'pillar4',
    title: 'Mobile Application Development',
    basePriority: 8,
    quizGoal: 8,
    objectives: ['Validate if an app is necessary, outline MVP scope, and ship store-ready builds.', 'Meet Apple/Google policy, content ratings, and privacy requirements.'],
    risks: ['Scope creep', 'App store rejections', 'Unsupported maintenance budgets'],
    archetypeNotes: {
      technology: 'Prototype with Figma/FlutterFlow, release to TestFlight/TestFairy for local testers.',
      health: 'Document POPIA/HPCSA consent flows, offline sync for clinics.',
    },
    resources: [
      { label: 'FlutterFlow', url: 'https://flutterflow.io/', description: 'Visual app builder for MVPs.', tags: ['technology', 'services'] },
      { label: 'Android Testing Tracks', url: 'https://support.google.com/googleplay/android-developer/answer/9844673', description: 'Internal/closed/open testing explained.', tags: ['technology'] },
      { label: 'Apple TestFlight', url: 'https://developer.apple.com/testflight/', description: 'iOS beta distribution requirements.', tags: ['technology'] },
    ],
  },
  {
    pillar: 5,
    slug: 'pillar5',
    title: 'Search Engine Optimization',
    basePriority: 7,
    quizGoal: 9,
    objectives: ['Own demand in SA Google results, local maps, and township/vernacular search.', 'Ship pillar + cluster content and technical fixes tied to real revenue.'],
    risks: ['Ranking walls from technical debt', 'Paying for traffic that never converts'],
    archetypeNotes: {
      'township retail': 'Focus on isiXhosa/isiZulu keyword variants, Google Business Profile posts, WhatsApp CTAs.',
      tourism: 'Local landing pages in English + German + isiXhosa, map pack domination.',
    },
    resources: [
      { label: 'Google Business Profile', url: 'https://www.google.com/business/', description: 'Map pack, reviews, photo updates.', tags: ['township', 'tourism', 'services'] },
      { label: '.Africa SEO Guide (ZACR)', url: 'https://registry.net.za/about/news/news_item/?id=182', description: 'Local domain/SEO best practices.', tags: ['general'] },
      { label: 'Keyword Planner ZA', url: 'https://ads.google.com/home/tools/keyword-planner/', description: 'Identify search demand per province.', tags: ['general'] },
    ],
  },
  {
    pillar: 6,
    slug: 'pillar6',
    title: 'Social Media & Digital Marketing',
    basePriority: 6,
    quizGoal: 10,
    objectives: ['Ship a weekly storytelling loop, channel mix, and WhatsApp/Meta automation for first 100 sales.', 'Create isiXhosa/isiZulu friendly scripts and offline activations.'],
    risks: ['Random posting with no offer', 'Paid spend without attribution'],
    archetypeNotes: {
      'township retail': 'Focus on TikTok, Facebook Marketplace, WhatsApp broadcast lists.',
      ngo: 'Community storytelling + grant/impact reporting content.',
    },
    resources: [
      { label: 'Meta Blueprint (ZA)', url: 'https://www.facebook.com/business/learn', description: 'Ads + community building courses.', tags: ['general'] },
      { label: 'WhatsApp Commerce Guide', url: 'https://www.whatsapp.com/business/', description: 'Catalogs, quick replies, consent flows.', tags: ['township', 'services'] },
      { label: 'Gov Communication Guidance', url: 'https://www.gcis.gov.za/', description: 'Protocols for campaigns with municipalities.', tags: ['ngo', 'services'] },
    ],
  },
  {
    pillar: 7,
    slug: 'pillar7',
    title: 'Artificial Intelligence & Automation',
    basePriority: 5,
    quizGoal: 8,
    objectives: ['Automate lead capture, booking, and fulfilment with Deepseek + low-code stacks.', 'Keep POPIA/Mindustry compliance when deploying agents and workflows.'],
    risks: ['Hallucinating AI, non-compliant data handling', 'Automations without human fail-safes'],
    archetypeNotes: {
      technology: 'CRM + workflow automation, API-first prompts.',
      services: 'WhatsApp chatbots, appointment routing, voice-of-customer summarisation.',
    },
    resources: [
      { label: 'Deepseek Docs', url: 'https://www.deepseek.com/docs', description: 'CapeWeb assistant brain.', tags: ['technology', 'services'] },
      { label: 'Make (Integromat)', url: 'https://www.make.com/en', description: 'Affordable workflow builder with SA integrations.', tags: ['general'] },
      { label: 'POPIA AI Guidance (Info Regulator)', url: 'https://inforegulator.org.za/', description: 'Consent + automated decision notices.', tags: ['general', 'health'] },
    ],
  },
  {
    pillar: 8,
    slug: 'pillar8',
    title: 'Cybersecurity & Risk Management',
    basePriority: 4,
    quizGoal: 8,
    objectives: ['Protect accounts, hosting, payments, and patient/customer data.', 'Document incident response and backup routines.'],
    risks: ['Account hijacks', 'POPIA breaches with fines', 'Lost revenue from downtime'],
    archetypeNotes: {
      health: 'Encrypt patient data, maintain HPCSA-approved breach notifications.',
      commerce: 'PCI-DSS ready payment flows, fraud prevention.',
    },
    resources: [
      { label: 'Information Regulator', url: 'https://inforegulator.org.za/', description: 'POPIA/PAIA compliance and breach reporting.', tags: ['general', 'health'] },
      { label: 'Cybersecurity Hub (CSIRT)', url: 'https://www.cybersecurityhub.gov.za/', description: 'Incident reporting and advisories.', tags: ['general'] },
      { label: 'HPCSA Guidelines', url: 'https://www.hpcsa.co.za/Uploads/Legal/Know_your_Rules/Booklets/Booklet%205.pdf', description: 'Patient confidentiality + data handling.', tags: ['health'] },
    ],
  },
  {
    pillar: 9,
    slug: 'pillar9',
    title: 'Financial Systems & eCommerce',
    basePriority: 3,
    quizGoal: 8,
    objectives: ['Build pricing, cash flow, and payment infrastructure (POS + ecommerce + cross-border).', 'Prep funding packs (sefa, IDC, banks) with live numbers.'],
    risks: ['No view on cash runway', 'Payments failing, compliance gaps for export/VAT'],
    archetypeNotes: {
      'township retail': 'Lay-bys, stokvel, and informal credit tracking with POS integration.',
      manufacturing: 'Costing + landed cost calculators, Forex readiness.',
    },
    resources: [
      { label: 'Yoco / Yoco Portal', url: 'https://www.yoco.com/za/', description: 'POS + online payment links for SMEs.', tags: ['township', 'services'] },
      { label: 'Paystack South Africa', url: 'https://paystack.com/', description: 'Online checkout with multi-currency support.', tags: ['commerce'] },
      { label: 'IDC Funding', url: 'https://www.idc.co.za/', description: 'Industrial finance for scaling manufacturers.', tags: ['manufacturing', 'agriculture'] },
      { label: 'NEF', url: 'https://www.nefcorp.co.za/', description: 'Black industrialist funding, equity, loans.', tags: ['commerce', 'manufacturing'] },
      { label: 'SARS Customs & Excise', url: 'https://www.sars.gov.za/customs-and-excise/', description: 'Export/import duties, VAT on imports.', tags: ['commerce', 'export'] },
    ],
  },
  {
    pillar: 10,
    slug: 'pillar10',
    title: 'Analytics & Business Intelligence',
    basePriority: 2,
    quizGoal: 8,
    objectives: ['Ship a Growth Dashboard (traffic, conversions, finances) and decision rituals.', 'Instrument offline/WhatsApp events and UTM hygiene.'],
    risks: ['Decisions by gut', 'No measurement of campaigns or product usage'],
    archetypeNotes: {
      technology: 'Product analytics + data warehouse + churn tracking.',
      services: 'Attribution for WhatsApp/phone leads, UTM builder adoption.',
    },
    resources: [
      { label: 'Google Analytics 4', url: 'https://analytics.google.com/', description: 'Web + app measurement.', tags: ['general'] },
      { label: 'Looker Studio Templates', url: 'https://lookerstudio.google.com/gallery', description: 'Dashboards for marketing/finance KPIs.', tags: ['general'] },
      { label: 'DataDotOrg ZA Open Data', url: 'https://data.gov.za/', description: 'Public datasets for benchmarking.', tags: ['technology', 'ngo'] },
    ],
  },
  {
    pillar: 11,
    slug: 'pillar11',
    title: 'Customer Experience & Support',
    basePriority: 1,
    quizGoal: 8,
    objectives: ['Build multilingual support playbooks, SLAs, and review loops.', 'Export WhatsApp/email templates that meet POPIA + CPA obligations.'],
    risks: ['Slow replies → lost trust', 'No feedback loops → churn', 'Support missing compliance wording'],
    archetypeNotes: {
      services: 'Offer promise + escalation thresholds + QA loops.',
      'field services': 'Offline forms, airtime rewards for NPS surveys.',
    },
    resources: [
      { label: 'HelloPeter Business Portal', url: 'https://www.hellopeter.com/business/register', description: 'Manage SA reviews + improve ratings.', tags: ['general'] },
      { label: 'Zendesk Foundations', url: 'https://support.zendesk.com/hc/en-us/articles/4408835820186', description: 'Omni-channel support playbooks.', tags: ['technology', 'services'] },
      { label: 'SARB Consumer Credit Guide', url: 'https://www.resbank.co.za/en/home/publications/publication-detail-pages/consumer-education-materials', description: 'Disclosure obligations for credit/lay-by.', tags: ['township', 'commerce'] },
    ],
  },
];

// Pillar 12: Sales & Revenue Quiz
export const pillar12QuizQuestions = [
  {
    question: 'What is the "Bridge" method in a cold call?',
    options: ['Talking about the weather', 'Connecting the prospect\'s problem to your solution immediately', 'Asking for money upfront'],
    correctIndex: 1,
  },
  {
    question: 'If a client says "It is too expensive", what is the likely real problem?',
    options: ['They have no money', 'You have not demonstrated enough Value to outweigh the Friction', 'They hate you'],
    correctIndex: 1,
  },
  {
    question: 'Which form is required to declare conflicts of interest for a Government Tender?',
    options: ['SBD 1', 'SBD 4', 'SBD 6.1'],
    correctIndex: 1,
  },
  {
    question: 'True or False: You should aim to get "No" as often as possible in the beginning.',
    options: ['True - it builds resilience and moves you faster to a Yes', 'False - failure is bad'],
    correctIndex: 0,
  },
  {
    question: 'What is the CSD?',
    options: ['Central Supplier Database - required for Gov work', 'Cape Town Service Department', 'Customer Service Desk'],
    correctIndex: 0,
  }
];

// Pillar 13: HR & Team Quiz
export const pillar13QuizQuestions = [
  {
    question: 'What is the maximum number of ordinary hours an employee can work per week (excluding overtime)?',
    options: ['40 hours', '45 hours', '50 hours'],
    correctIndex: 1,
  },
  {
    question: 'If an employee steals, can you fire them immediately on the spot?',
    options: ['Yes, theft is serious', 'No, you must still hold a disciplinary hearing first', 'Only if you have video proof'],
    correctIndex: 1,
  },
  {
    question: 'What does COIDA cover?',
    options: ['Retirement savings', 'Injuries and diseases contracted on duty', 'Unemployment payouts'],
    correctIndex: 1,
  },
  {
    question: 'Is a verbal contract valid in South Africa?',
    options: ['No, everything must be written', 'Yes, but a written contract is legally required to prove details', 'Only for casual workers'],
    correctIndex: 1, // Technically verbal is binding, but written particulars are required by BCEA. 
  },
  {
    question: 'How often should you hold a "Pulse" meeting with your team?',
    options: ['Once a year', 'Every week (Monday/Friday)', 'Only when there is a problem'],
    correctIndex: 1,
  }
];

// Pillar 14: Investment Quiz
export const pillar14QuizQuestions = [
  {
    question: 'What is "Burn Rate"?',
    options: ['How fast you can make a product', 'The amount of cash your business spends/loses monthly', 'The interest rate on a loan'],
    correctIndex: 1,
  },
  {
    question: 'Which agency provides GRANTS (free money) for youth under 35?',
    options: ['SARS', 'NYDA', 'The Courier Guy'],
    correctIndex: 1,
  },
  {
    question: 'True or False: Banks usually invest in "Idea Stage" businesses.',
    options: ['True', 'False - Banks need financial history'],
    correctIndex: 1,
  },
  {
    question: 'What is the main downside of Equity Funding?',
    options: ['You have to pay it back monthly', 'You give away a portion of ownership/control', 'It is illegal'],
    correctIndex: 1,
  },
  {
    question: 'How long should you expect a government grant application to take?',
    options: ['1 week', '3 to 6 months', '24 hours'],
    correctIndex: 1,
  }
];

// Pillar 15: Supply Chain Quiz
export const pillar15QuizQuestions = [
  {
    question: 'What is "Volumetric Weight"?',
    options: ['The actual weight of the item on a scale', 'The weight calculated based on the package size/dimensions', 'The weight of the truck'],
    correctIndex: 1,
  },
  {
    question: 'Which courier option is generally cheapest for township delivery?',
    options: ['Express Overnight', 'PAXI (Pep Stores)', 'Uber Connect'],
    correctIndex: 1,
  },
  {
    question: 'If you import goods, who charges you VAT and Duties?',
    options: ['The Chinese Supplier', 'SARS (Customs)', 'The Post Office'],
    correctIndex: 1,
  },
  {
    question: 'Why is "Just In Time" (JIT) stock risky?',
    options: ['It costs too much', 'If a customer orders, you might not have stock ready immediately', 'It takes up too much space'],
    correctIndex: 1,
  },
  {
    question: 'What is "Landed Cost"?',
    options: ['Just the price of the product', 'Product Cost + Shipping + Customs + Taxes', 'The price you sell it for'],
    correctIndex: 1,
  }
];

// Pillar 16: Product Strategy Quiz
export const pillar16QuizQuestions = [
  {
    question: 'What is a "Painkiller" product?',
    options: ['Something nice to have', 'A solution to a critical, urgent problem', 'A product sold in pharmacies'],
    correctIndex: 1,
  },
  {
    question: 'Why is the "Mom Test" important?',
    options: ['Moms always know best', 'Friends and family are biased and will lie to protect your feelings', 'It saves money on research'],
    correctIndex: 1,
  },
  {
    question: 'In the prioritization matrix, what should you build first?',
    options: ['Low Impact, High Effort tasks', 'High Impact, Low Effort (Quick Wins)', 'High Impact, High Effort (Major Projects)'],
    correctIndex: 1,
  },
  {
    question: 'What is an MVP?',
    options: ['Most Valuable Player', 'Minimum Viable Product - the smallest version that delivers value', 'Maximum Value Project'],
    correctIndex: 1,
  },
  {
    question: 'Why should SA apps be "Light"?',
    options: ['Because data is expensive and devices are older', 'Because dark mode is better', 'Because coding is easier'],
    correctIndex: 0,
  }
];

// Pillar 17: Partnerships Quiz
export const pillar17QuizQuestions = [
  {
    question: 'What is "Fronting" in a B-BBEE context?',
    options: ['Being the face of the company', 'Faking black ownership/management to get contracts', 'Designing a shop front'],
    correctIndex: 1,
  },
  {
    question: 'Why is a 50/50 partnership share split often risky?',
    options: ['It is too fair', 'It can lead to deadlock where no decision can be made', 'Tax reasons'],
    correctIndex: 1,
  },
  {
    question: 'What is an SLA?',
    options: ['Service Level Agreement - binding contract on deliverables', 'Standard Legal Advice', 'South African Law Association'],
    correctIndex: 0,
  },
  {
    question: 'What does ESD stand for?',
    options: ['Extra Service Delivery', 'Enterprise Supplier Development', 'Essential Sales Data'],
    correctIndex: 1,
  },
  {
    question: 'True or False: A Memorandum of Understanding (MOU) is usually legally binding.',
    options: ['True', 'False - it is usually just an agreement of intent'],
    correctIndex: 1,
  }
];

// Pillar 18: Crisis
export const pillar18QuizQuestions = [
  {
    question: 'What is the "Streisand Effect"?',
    options: ['A marketing strategy', 'When trying to hide something makes it much more public/popular', 'A type of solar panel'],
    correctIndex: 1,
  },
  {
    question: 'What happens during "Business Rescue"?',
    options: ['The company is closed immediately', 'Creditors are frozen while a plan is made to save the company', 'The government gives you free money'],
    correctIndex: 1,
  },
  {
    question: 'Which device is essential to keep internet/Wi-Fi on during load shedding?',
    options: ['A UPS (Uninterruptible Power Supply)', 'A torch', 'A gas stove'],
    correctIndex: 0,
  },
  {
    question: 'True or False: You should delete negative comments on social media.',
    options: ['True, hide the hate', 'False, address them transparently'],
    correctIndex: 1,
  },
  {
    question: 'How many days do you usually have to respond to a legal letter of demand?',
    options: ['24 hours', '10 - 14 business days (usually)', 'You can ignore it'],
    correctIndex: 1,
  }
];

// Pillar 19: Exit
export const pillar19QuizQuestions = [
  {
    question: 'What is a common method for valuing small businesses?',
    options: ['Multiple of SDE (Seller Discretionary Earnings)', 'Number of employees', 'How nice the logo is'],
    correctIndex: 0,
  },
  {
    question: 'What increases the valuation multiple of a business?',
    options: ['The owner doing everything themselves', 'Systems that run without the owner', 'Having a lot of debt'],
    correctIndex: 1,
  },
  {
    question: 'What is a "Trade Sale"?',
    options: ['Selling stock on the street', 'Selling the company to a competitor or another company', 'Trading goods for services'],
    correctIndex: 1,
  },
  {
    question: 'What is "Due Diligence"?',
    options: ['Politeness', 'The investigation/audit period before buying a company', 'Paying taxes on time'],
    correctIndex: 1,
  },
  {
    question: 'What is a "Data Room"?',
    options: ['A server room', 'A secure folder with all business documents for buyers to review', 'A place to store customer data'],
    correctIndex: 1,
  }
];
