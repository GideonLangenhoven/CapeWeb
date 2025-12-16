import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import '../styles/CapeWebBlueprint.css';
import { PILLAR_LIBRARY } from '../data/pillarLibrary';
import {
  Pillar2ModuleA,
  Pillar2ModuleB,
  Pillar2ModuleC,
  Pillar2ModuleD,
  Pillar2ModuleBonus,
  Pillar2Quiz,
  Pillar2Completion,
  pillar2QuizQuestions
} from './CapeWebPillar2';
import {
  Pillar3Content,
  Pillar3Quiz,
  Pillar3Completion,
  pillar3QuizQuestions
} from './CapeWebPillar3';
import {
  Pillar4Content,
  Pillar4Quiz,
  Pillar4Completion,
  pillar4QuizQuestions
} from './CapeWebPillar4';
import {
  Pillar5Content,
  Pillar5Quiz,
  Pillar5Completion,
  pillar5QuizQuestions
} from './CapeWebPillar5';
import {
  Pillar6Content,
  Pillar6Quiz,
  Pillar6Completion,
  pillar6QuizQuestions
} from './CapeWebPillar6';
import {
  Pillar7Content,
  Pillar7Quiz,
  Pillar7Completion,
  pillar7QuizQuestions
} from './CapeWebPillar7';
import {
  Pillar8Content,
  Pillar8Quiz,
  Pillar8Completion,
  pillar8QuizQuestions
} from './CapeWebPillar8';
import {
  Pillar9Content,
  Pillar9Quiz,
  Pillar9Completion,
  pillar9QuizQuestions
} from './CapeWebPillar9';
import {
  Pillar10Content,
  Pillar10Quiz,
  Pillar10Completion,
  pillar10QuizQuestions
} from './CapeWebPillar10';
import {
  Pillar11Content,
  Pillar11Quiz,
  Pillar11Completion,
  pillar11QuizQuestions
} from './CapeWebPillar11';

const SOFTWARE_MAP_SUMMARY = [
  '- CapeWebBlueprint (React) renders the 11 pillars with adaptive plan + resource drawers.',
  '- Pillar components (1-11) manage quiz state, worksheets, and mission content.',
  '- Context personalization: cookies store sector, geography, funding, regulation focus.',
  '- Adaptive features: Business DNA intake, resource drawers, contextual action cards, 30/60/90 plan.',
  '- Upcoming: Deepseek integration for personalized syllabus remix and QA checks.',
].join('\n');

const MUNICIPAL_GROUPS = [
  {
    id: 'cape-town',
    label: 'Cape Town',
    matcher: /(cape town|western cape|stellenbosch|paarl|khayelitsha|mitchells plain)/i,
    resources: [
      {
        label: 'City of Cape Town Business Licensing',
        url: 'https://www.capetown.gov.za/City-Connect/Register/Business-and-trade/Licences-and-permits/Apply-for-a-business-trade-permit',
        description: 'Apply for food, health, events, and informal trading permits.',
      },
      {
        label: 'Cape Town Business Hub',
        url: 'https://www.capetown.gov.za/Work%20and%20business/See-all-business-facilities/Business-hub/Business-Hub',
        description: 'Book advisory sessions, procurement bootcamps, and tender coaching.',
      },
      {
        label: 'Invest Cape Town Incentives',
        url: 'https://www.investcapetown.com/how-we-can-help/business/incentives/',
        description: 'Explore Atlantis SEZ, GreenTech, and Clothing/Textile incentives.',
      },
    ],
  },
  {
    id: 'gauteng',
    label: 'Gauteng Metros',
    matcher: /(johannesburg|sandton|soweto|tshwane|pretoria|ekurhuleni|gauteng)/i,
    resources: [
      {
        label: 'City of Johannesburg Business Licences',
        url: 'https://www.joburg.org.za/services_/Pages/Services/Business-Licences/Business-Licences.aspx',
        description: 'Health, food, and general trading licences with downloadable forms.',
      },
      {
        label: 'GGDA One Stop Shop',
        url: 'https://ggda.co.za/',
        description: 'Investment facilitation, township economy programmes, and export help.',
      },
      {
        label: 'Tshwane Informal Trading Permits',
        url: 'https://www.tshwane.gov.za/sites/Departments/Economic-Development/Pages/Informal-Trading.aspx',
        description: 'Guidelines + application packs for markets and street trading.',
      },
    ],
  },
  {
    id: 'durban',
    label: 'eThekwini / Durban',
    matcher: /(durban|ethekwini|kzn|kwazulu)/i,
    resources: [
      {
        label: 'eThekwini Business Licensing',
        url: 'https://www.durban.gov.za/online-tools/business-licensing/',
        description: 'Apply for food sales, accommodation, and event licences.',
      },
      {
        label: 'SmartXchange (Durban/Port Shepstone)',
        url: 'https://www.smartxchange.co.za/',
        description: 'ICT + creative incubator with grants, office space, and compliance help.',
      },
      {
        label: 'KZN Economic Development',
        url: 'https://www.kznded.gov.za/',
        description: 'Provincial incentives, co-ops funding, and supplier development.',
      },
    ],
  },
  {
    id: 'rural',
    label: 'Rural & Districts',
    matcher: /(limpopo|mpumalanga|eastern cape|northern cape|north west|free state|rural|district)/i,
    resources: [
      {
        label: 'SEDA District Offices',
        url: 'https://www.seda.org.za/our-offices/',
        description: 'Find your nearest branch for compliance, funding packs, and coaching.',
      },
      {
        label: 'Co-operative Incentive Scheme (DSBD)',
        url: 'https://www.dsbd.gov.za/programmes/cooperative-incentive-scheme/',
        description: 'Grant support for co-ops and rural collectives.',
      },
      {
        label: 'Land Bank / agri finance',
        url: 'https://landbank.co.za/',
        description: 'Bridging finance, production loans, and blended finance for agri SMEs.',
      },
    ],
  },
];

const REMEDIATION_LIBRARY = {
  pillar8: {
    title: 'Security study pack',
    description: 'Revisit POPIA, SAPS/CSIRT reporting, and MFA basics so breaches are prevented and reported correctly.',
    resources: [
      { label: 'Information Regulator: Breach Templates', url: 'https://www.justice.gov.za/inforeg/docs/PAIA-Manual-Guidelines.pdf', description: 'Pull the official notification format for POPIA incidents.' },
      { label: 'Gov CSIRT Alerts', url: 'https://www.cybersecurityhub.gov.za/', description: 'Track national advisories and reporting channels.' },
      { label: 'Google Workspace Security Center', url: 'https://support.google.com/a/topic/7584356', description: 'Step-by-step MFA + audit guides for email admins.' },
    ],
  },
  pillar9: {
    title: 'Finance mastery pack',
    description: 'Strengthen VAT/export readiness, reconcile payouts, and prep funding numbers using the official portals below.',
    resources: [
      { label: 'SARS Small Business Hub', url: 'https://www.sars.gov.za/businesses-and-employers/small-businesses-taxpayers/', description: 'Guides on VAT, PAYE, and turnover tax with templates.' },
      { label: 'sefa Funding Checklist', url: 'https://sefa.org.za/products-and-services/', description: 'Document list for working-capital or contract finance.' },
      { label: 'IDC Application Pack', url: 'https://www.idc.co.za/how-to-apply/', description: 'Requirements for industrial funding, including cash-flow forecasts.' },
    ],
  },
  pillar10: {
    title: 'Analytics refresher',
    description: 'Replay KPI definitions and SA datasets to ensure every metric ties to a decision.',
    resources: [
      { label: 'Google Analytics 4 Skill Shop', url: 'https://skillshop.exceedlms.com/student/catalog/list?category_ids=53-google-analytics-4', description: 'Free courses covering events, funnels, and exports.' },
      { label: 'Data.gov.za', url: 'https://data.gov.za/', description: 'Benchmark KPIs with public datasets per province.' },
      { label: 'Looker Studio Templates', url: 'https://lookerstudio.google.com/gallery', description: 'Import dashboards to visualise CapeWeb KPI sets quickly.' },
    ],
  },
  pillar11: {
    title: 'CX compliance pack',
    description: 'Deepen CPA/POPIA-ready scripts and dispute processes so customers always know what to expect.',
    resources: [
      { label: 'National Consumer Commission', url: 'https://www.thencc.gov.za/', description: 'Understand complaint handling duties and disclosure rules.' },
      { label: 'HelloPeter Business Portal', url: 'https://www.hellopeter.com/business/register', description: 'Monitor public feedback and publish SA-specific service promises.' },
      { label: 'POPIA Guidance: Direct Marketing', url: 'https://inforegulator.org.za/wp-content/uploads/2021/07/Guidance-Note-on-Processing-of-Special-Personal-Information.pdf', description: 'Ensure scripts respect consent, language, and record-keeping.' },
    ],
  },
};

const PERSONALIZATION_COOKIE = 'capeweb_personalization';
const PROGRESS_COOKIE = 'capeweb_progress';
const DEEPSEEK_PLAN_COOKIE = 'capeweb_deepseek_plan';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const defaultPersonalizationContext = {
  sector: '',
  revenueStage: '',
  fundingTarget: '',
  geography: '',
  language: 'English',
  regulationFocus: '',
  notes: '',
};

const buildPersonaSummary = (context) => {
  const merged = { ...defaultPersonalizationContext, ...context };
  const sectorText = merged.sector || 'business';
  const geographyText = merged.geography || 'South Africa';
  const stageText = merged.revenueStage || 'early-stage';
  const fundingText = merged.fundingTarget ? ` and you’re targeting ${merged.fundingTarget}` : '';
  const regulationText = merged.regulationFocus ? ` Compliance focus: ${merged.regulationFocus}.` : '';
  return `You’re building a ${sectorText} in ${geographyText} at a ${stageText} stage${fundingText}. CapeWeb will adapt checklists, grants, and messaging using this profile.${regulationText}`;
};

const getRecommendedPillar3Mode = (context = {}) => {
  const sector = (context.sector || '').toLowerCase();
  if (sector.includes('township') || sector.includes('ngo') || sector.includes('grassroots')) {
    return 'r0';
  }
  if (sector.includes('manufacturing') || sector.includes('commerce') || sector.includes('agri') || sector.includes('retail') || sector.includes('tourism')) {
    return 'shopify';
  }
  return 'starter';
};

const getPillar3Tracks = (context = {}, recommendedMode) => {
  const geo = context.geography || 'South Africa';
  const language = context.language || 'English';
  const tracks = [
    {
      mode: 'r0',
      title: 'Track · WhatsApp Commerce (R0 Launch)',
      description: `Perfect for township stores, field teams, and NGOs in ${geo}. R0 landing page, ${language} WhatsApp flows, SnapScan/Yoco payment links.`,
    },
    {
      mode: 'starter',
      title: 'Track · Service & SaaS HQ',
      description: `For agencies, clinics, and SaaS founders. Lean WordPress/Wix/Framer builds with Calendly, CRM, and POPIA-ready forms tailored to ${geo}.`,
    },
    {
      mode: 'shopify',
      title: 'Track · Commerce & Manufacturing',
      description: `For product-heavy SMMEs shipping nationwide. Shopify/Shopstar storefront, Paystack/Ozow checkout, and courier plugs (PUDO, Pargo) covering ${geo}.`,
    },
  ];

  return tracks.map((track) => ({
    ...track,
    id: `p3-track-${track.mode}`,
    isRecommended: track.mode === recommendedMode,
  }));
};

const deriveQuizStatus = (message) => {
  if (!message || message === 'Not checked yet.') return 'not-started';
  if (message.includes('✅')) return 'passed';
  if (message.includes('❌')) return 'needs-review';
  return 'not-started';
};

const getQuizStatuses = (messages) => {
  const entries = Object.entries(messages || {}).map(([key, msg]) => [key, deriveQuizStatus(msg)]);
  return Object.fromEntries(entries);
};

const normalise = (value = '') => value.toLowerCase();

const getContextTags = (context = {}) => {
  const tags = ['general'];
  const pushTokens = (value = '') => {
    value
      .toLowerCase()
      .split(/[\s,/&]+/)
      .filter(Boolean)
      .forEach((token) => tags.push(token));
  };
  pushTokens(context.sector);
  pushTokens(context.revenueStage);
  pushTokens(context.fundingTarget);
  pushTokens(context.geography);
  pushTokens(context.language);
  pushTokens(context.regulationFocus);
  return Array.from(new Set(tags));
};

const filterResourcesForContext = (pillarMeta, context) => {
  if (!pillarMeta?.resources?.length) return [];
  const contextTags = getContextTags(context);
  return pillarMeta.resources.filter((resource) => {
    if (!resource.tags?.length) return true;
    if (resource.tags.includes('general')) return true;
    return resource.tags.some((tag) => contextTags.includes(tag));
  });
};

const getMunicipalGroup = (geography = '') => {
  if (!geography) return null;
  return MUNICIPAL_GROUPS.find((group) => group.matcher.test(geography));
};

const getPillarTitle = (slug) => {
  const pillar = PILLAR_LIBRARY.find((item) => item.slug === slug);
  return pillar ? pillar.title : slug;
};

const buildDeepseekPayload = (context, plan, quizStatuses) => ({
  userBrief: context,
  adaptivePlan: plan,
  quizStatuses,
  softwareMap: SOFTWARE_MAP_SUMMARY,
});

const createPayloadSignature = (payload) => JSON.stringify(payload);

const normalizeDeepseekResponse = (response, fallbackPlan = [], signature) => {
  if (!response) {
    return {
      adaptivePillars: fallbackPlan,
      followUpQuestions: [],
      updatedAt: null,
      signature: signature || null,
    };
  }
  const adaptivePillars = Array.isArray(response.adaptivePillars) && response.adaptivePillars.length ? response.adaptivePillars : fallbackPlan;
  const followUpQuestions = Array.isArray(response.followUpQuestions) ? response.followUpQuestions : [];
  return {
    adaptivePillars,
    followUpQuestions,
    updatedAt: response.updatedAt || new Date().toISOString(),
    signature: signature || null,
  };
};

const addWeight = (map, slug, value, reason) => {
  if (!map[slug]) {
    map[slug] = { weight: 0, reasons: [] };
  }
  map[slug].weight += value;
  if (reason) {
    map[slug].reasons.push(reason);
  }
};

const computeAdaptivePlan = (context, quizStatuses) => {
  const sector = normalise(context?.sector);
  const revenue = normalise(context?.revenueStage);
  const funding = normalise(context?.fundingTarget);
  const regulation = normalise(context?.regulationFocus);
  const geography = normalise(context?.geography);
  const adjustments = {};

  if (sector.includes('township')) {
    ['pillar5', 'pillar6', 'pillar9'].forEach((slug) =>
      addWeight(adjustments, slug, 4, 'Township retail needs local SEO, storytelling, and payments.'),
    );
  }
  if (/(retail|commerce|manufactur|agri|export)/.test(sector)) {
    ['pillar3', 'pillar5', 'pillar9'].forEach((slug) =>
      addWeight(adjustments, slug, 3, 'Product-heavy businesses rely on strong web, SEO, and finance ops.'),
    );
  }
  if (/(tech|saas|software|digital)/.test(sector)) {
    ['pillar3', 'pillar7', 'pillar10'].forEach((slug) =>
      addWeight(adjustments, slug, 3, 'Tech/SaaS companies need architecture, automation, and analytics.'),
    );
  }
  if (sector.includes('health')) {
    ['pillar2', 'pillar8', 'pillar11'].forEach((slug) =>
      addWeight(adjustments, slug, 4, 'Health care demands strict compliance, security, and CX.'),
    );
  }
  if (sector.includes('ngo') || sector.includes('npo')) {
    ['pillar1', 'pillar2', 'pillar6', 'pillar11'].forEach((slug) =>
      addWeight(adjustments, slug, 2, 'NPOs thrive on clear messaging, governance, and supporter care.'),
    );
  }
  if (/data|privacy|popia|hpcsa/.test(regulation)) {
    ['pillar2', 'pillar8'].forEach((slug) =>
      addWeight(adjustments, slug, 3, 'Regulation focus highlights compliance and security tasks.'),
    );
  }
  if (/export|cross/.test(sector) || /export|cross/.test(regulation) || /sadc|namibia|botswana|zambia/.test(geography)) {
    addWeight(adjustments, 'pillar9', 3, 'Cross-border operations require finance + customs systems.');
  }
  if (/1m|5m|scal/.test(revenue)) {
    ['pillar8', 'pillar9', 'pillar10', 'pillar11'].forEach((slug) =>
      addWeight(adjustments, slug, 2, 'Scaling revenue elevates security, finance, analytics, and CX.'),
    );
  }
  if (/working|equipment|capital/.test(funding)) {
    ['pillar2', 'pillar9'].forEach((slug) =>
      addWeight(adjustments, slug, 2, 'Funding applications demand compliance packs and financial systems.'),
    );
  }

  const plan = PILLAR_LIBRARY.map((pillar) => {
    const slug = pillar.slug;
    const basePriority = pillar.basePriority ?? 12 - pillar.pillar;
    const quizStatus = quizStatuses[slug] || 'not-started';
    if (quizStatus === 'needs-review') {
      addWeight(adjustments, slug, 1, 'Quiz indicates gaps to revisit.');
    }
    const entry = adjustments[slug] || { weight: 0, reasons: [] };
    const totalWeight = basePriority + entry.weight;
    const reasons = entry.reasons.length ? entry.reasons : ['Core pillar of the CapeWeb blueprint.'];
    return {
      ...pillar,
      priorityScore: totalWeight,
      reasons,
      quizStatus,
    };
  });

  return plan.sort((a, b) => b.priorityScore - a.priorityScore);
};

const buildDeepseekMasterPrompt = (context, plan, quizStatuses) => {
  const contextStr = JSON.stringify(context, null, 2);
  const planSummary = plan
    .map(
      (item, index) =>
        `${index + 1}. ${item.title} (priority ${item.priorityScore})\n   - Objectives: ${item.objectives?.slice(0, 2).join(' / ')}\n   - Risks: ${item.risks?.slice(0, 2).join(' / ')}\n   - Quiz status: ${item.quizStatus}`,
    )
    .join('\n');
  const quizSummary = JSON.stringify(quizStatuses, null, 2);

  return [
    'You are Deepseek, CapeWeb’s adaptive syllabus strategist.',
    'Inputs:',
    `1. USER_BRIEF → ${contextStr}`,
    '2. SOFTWARE_MAP →',
    SOFTWARE_MAP_SUMMARY,
    '3. PILLAR_LIBRARY (prioritized) →',
    planSummary,
    `Quiz statuses: ${quizSummary}`,
    '',
    'Tasks:',
    '- Diagnose fit between USER_BRIEF and the default pillars.',
    '- Flag gaps in content, tooling, or links for this use case.',
    '- Output ADAPTIVE_PILLARS: ordered list of 11 pillars (keep all, but rename/recluster submodules, duplicate if needed).',
    '- For each pillar include: refreshed objective, key risks, SA-specific resources (links must stay from library), suggested interaction upgrades, and the quiz score needed to “pass”.',
    '- Return FOLLOW_UP_QUESTIONS to clarify missing data.',
    '',
    'Rules:',
    '- Always cite the SA regulation/funding body or marketplace relevant to the user’s province.',
    '- Never drop a pillar; instead deprioritise by tagging as “Later” if it is not immediate.',
    '- Make recommendations executable in the existing UI (buttons, checklists, quizzes).',
  ].join('\n');
};

const buildDeepseekQAPrompt = (context, plan) => {
  const contextStr = JSON.stringify(context, null, 2);
  const planTitles = plan.map((item, index) => `${index + 1}. ${item.title}`).join('\n');

  return [
    'You are Deepseek, reviewing CapeWeb’s code and syllabus quality.',
    `USER_BRIEF:\n${contextStr}`,
    'SOFTWARE_MAP:',
    SOFTWARE_MAP_SUMMARY,
    'Current prioritized pillars:',
    planTitles,
    '',
    'Given SOFTWARE_MAP + latest build notes, list any UX or localisation gaps that block the adaptive plan, note missing datasets/links, and propose specific component-level enhancements (e.g., “CapeWebBlueprint: add personalizationContext prop to PillarNav”). Prioritise work that unlocks SA compliance, funding, or multilingual support.',
  ].join('\n');
};

const getPillarContextualActions = (pillarSlug, context = {}) => {
  const sector = normalise(context.sector);
  const geography = normalise(context.geography);
  const regulation = normalise(context.regulationFocus);
  const actions = [];

  const pushAction = (title, description, checklist = []) => {
    actions.push({ title, description, checklist });
  };

  switch (pillarSlug) {
    case 'pillar3': {
      if (sector.includes('township')) {
        pushAction(
          'Township Digital HQ',
          'Use an R0 landing page + WhatsApp + SnapScan/Paxi pickup info. Highlight delivery radius and vernacular testimonials.',
          ['Google Sites + .co.za domain', 'Primary CTA: WhatsApp order form', 'Cash + lay-by policy block'],
        );
      }
      if (/manufactur|commerce|agri/.test(sector)) {
        pushAction(
          'Product Catalogue Boost',
          'Use Shopify/Shopstar with local courier plugins (PUDO, Pargo, Fastway) and wholesale enquiry forms for B2B leads.',
          ['Install Paystack/Ozow', 'Create B2B enquiry page', 'Display compliance logos (NRCS/SABS if relevant)'],
        );
      }
      break;
    }
    case 'pillar4': {
      if (/health|clinic|medical/.test(sector) || /health/.test(regulation)) {
        pushAction(
          'Health & POPIA Track',
          'Add patient consent screens, offline sync, and encryption notes to your MVP before submitting to stores.',
          ['Map consent + privacy policy in-app', 'Encrypt PHI at rest/in transit', 'Draft breach notification template (HPCSA)'],
        );
      }
      if (/services|field|maintenance|logistics/.test(sector)) {
        pushAction(
          'Field Service Lite App',
          'Prototype job cards + photo uploads + offline checklist. Ship to TestFlight/Play testing for technicians.',
          ['Prototype in FlutterFlow/Glide', 'Add offline-first data storage', 'Plan SMS/WhatsApp fallback when offline'],
        );
      }
      break;
    }
    case 'pillar5': {
      if (sector.includes('township')) {
        pushAction(
          'Vernacular SEO Sprint',
          'Translate top pages into isiXhosa/isiZulu, embed WhatsApp CTAs, and target local “near me” keywords.',
          ['Create isiXhosa FAQ', 'Add WhatsApp Business link to snippets', 'Target Google Business posts weekly'],
        );
      }
      if (/tourism|travel|hospitality/.test(sector)) {
        pushAction(
          'Tourism & Exporter SEO',
          'Add multi-language landing pages (EN/DE/FR), structured data for experiences, and cross-border FAQ (visas, customs).',
          ['Implement hreflang tags', 'Add currency switcher + shipping info', 'Publish itineraries with Schema markup'],
        );
      }
      break;
    }
    case 'pillar6': {
      if (sector.includes('township')) {
        pushAction(
          'WhatsApp Commerce Launch',
          'Use WhatsApp Catalog, broadcast lists, and local influencer barter deals to drive first 100 sales.',
          ['Build isiXhosa/isiZulu scripts', 'Schedule WhatsApp Status drops', 'Collect UGC via airtime rewards'],
        );
      }
      if (sector.includes('ngo')) {
        pushAction(
          'Grant Story Sprint',
          'Use LinkedIn + email nurture to share outcomes, CTA to donation funnels, and build a monthly impact digest.',
          ['Publish monthly impact carousel', 'Automate donor thank-you voice notes', 'Track grant deliverables in Notion'],
        );
      }
      break;
    }
    case 'pillar7': {
      if (/field|maintenance|logistics/.test(sector)) {
        pushAction(
          'Field Automation Stack',
          'Automate job assignment, WhatsApp notifications, and proof-of-work uploads. Sync to Airtable/Notion CRM.',
          ['Deploy WhatsApp bot for job intake', 'Use Make/Zapier for Google Sheets ↔ CRM sync', 'Send photo checklist automatically'],
        );
      }
      if (sector.includes('technology')) {
        pushAction(
          'SaaS AI Ops',
          'Deploy Deepseek prompt libraries for onboarding, ticket triage, and pipeline scoring.',
          ['Build prompt templates for onboarding', 'Sync CRM → Deepseek context store', 'Automate CSAT summaries weekly'],
        );
      }
      break;
    }
    case 'pillar8': {
      if (/health|clinic|medical/.test(sector) || /health/.test(regulation)) {
        pushAction(
          'HPCSA POPIA Shield',
          'Document incident response, encrypted backups, and breach notification workflows tailored to patient data.',
          ['Complete Information Officer registration', 'Run quarterly POPIA drills', 'Enable MFA for all clinical systems'],
        );
      }
      if (/commerce|retail/.test(sector)) {
        pushAction(
          'Ecommerce Fraud Watch',
          'Enable 3DS, monitor chargebacks, and set up weekly security sweeps for CMS/Shopify + staff accounts.',
          ['Add MFA to payment gateways', 'Create suspicious order SOP', 'Schedule automated backups (Updraft/Phoenix)'],
        );
      }
      break;
    }
    case 'pillar9': {
      if (sector.includes('township')) {
        pushAction(
          'Cash + Lay-by Engine',
          'Track stokvel/lay-by in Airtable, reconcile mobile money (MoMo/eWallet), and prep sefa working-capital docs.',
          ['Create lay-by ledger template', 'Integrate Yoco + Excel cashbook', 'Download sefa checklist + start file'],
        );
      }
      if (/manufactur|export|agri/.test(sector) || /export/.test(regulation)) {
        pushAction(
          'Export & Industrial Finance',
          'Build landed-cost calculators, open Forex accounts, and prep IDC/NEF investment decks with CapeWeb financial dashboard.',
          ['Complete SARS customs forms (DA185)', 'Set up Paystack multi-currency checkout', 'Load funding docs to shared drive'],
        );
      }
      break;
    }
    case 'pillar10': {
      if (sector.includes('services')) {
        pushAction(
          'Services Scoreboard',
          'Instrument WhatsApp/phone leads via manual event forms, create weekly pipeline reviews, and tag every booking source.',
          ['Use UTM builder + Linktree', 'Log offline conversions with GA4 Measurement Protocol', 'Run Monday KPI retro'],
        );
      }
      if (sector.includes('technology')) {
        pushAction(
          'Product Analytics Loop',
          'Combine GA4 + PostHog + Supabase/Notion dashboards. Track activation, churn, and LTV for SaaS.',
          ['Implement PostHog identify calls', 'Automate retention cohort exports', 'Add Mixpanel/BigQuery connector'],
        );
      }
      break;
    }
    case 'pillar11': {
      if (/field|maintenance|logistics/.test(sector)) {
        pushAction(
          'Field CX Blueprint',
          'Use SMS/WhatsApp autoresponders, triage macros, and airtime rewards for job-completion feedback.',
          ['Build triage tree by severity', 'Record bilingual voice notes for updates', 'Send airtime reward automation'],
        );
      }
      if (sector.includes('commerce')) {
        pushAction(
          'Retail Service Engine',
          'Deploy HelloPeter/NPS requests post-delivery, manage refunds with CPA wording, and escalate VIP issues via Slack/Teams.',
          ['Automate review requests 48h post delivery', 'Embed CPA-compliant refund script', 'Create CX KPI mini-dashboard'],
        );
      }
      break;
    }
    default:
      break;
  }

  if (!actions.length) {
    const fallback = PILLAR_LIBRARY.find((pillar) => pillar.slug === pillarSlug);
    if (fallback) {
      pushAction('Core CapeWeb Play', fallback.objectives?.[0] || 'Follow the standard module to stay on track.');
    }
  }

  return actions;
};


const readCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};

const writeCookie = (name, value) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
};

const quizQuestions = [
  {
    question: 'The CapeWeb weekly loop is:',
    options: ['Learn → Do → Proof → Improve', 'Learn → Logo → Website → Rich', 'Plan → Panic → Quit → Repeat'],
    correctIndex: 0,
  },
  {
    question: 'Validation means:',
    options: ['Designing a logo and printing flyers', 'Getting proof from real customers before building', 'Waiting until everything is perfect'],
    correctIndex: 1,
  },
  {
    question: 'A strong business statement uses:',
    options: ['WHO + PROBLEM + RESULT', 'Logo + Colours + Slogan', 'Hope + Motivation + Luck'],
    correctIndex: 0,
  },
  {
    question: 'The Lean Canvas is:',
    options: ['A 50-page document', 'A one-page plan that forces clarity', 'A logo design template'],
    correctIndex: 1,
  },
  {
    question: 'Brand identity is mainly:',
    options: ['Just a logo', 'What people believe about you before they buy', 'A long business name'],
    correctIndex: 1,
  },
  {
    question: 'In StoryBrand messaging, the hero is:',
    options: ['Your business', 'The customer', 'The competitor'],
    correctIndex: 1,
  },
  {
    question: 'A great offer makes “Yes” easy by:',
    options: [
      'Giving a clear outcome + simple steps + fair price',
      'Being complicated and mysterious',
      'Hiding the price',
    ],
    correctIndex: 0,
  },
  {
    question: '“Value vs Friction” means:',
    options: [
      'Increase value and reduce steps that annoy customers',
      'Add more forms and more waiting',
      'Only focus on aesthetics',
    ],
    correctIndex: 0,
  },
  {
    question: 'Market research is best done by:',
    options: [
      'Using real data + talking to customers',
      'Guessing what people want',
      'Copying competitors blindly',
    ],
    correctIndex: 0,
  },
  {
    question: 'The first 30-day goal is:',
    options: [
      'Perfect branding everywhere',
      'Proof + progress (first customers + improvements)',
      'Waiting for funding before starting',
    ],
    correctIndex: 1,
  },
];

const sectionBlocks = [
  { id: 'map', keywords: 'journey map roadmap orientation clarity guide', Component: JourneyMapSection },
  { id: 'module-a', keywords: 'founder plan routine mission goals weekly quiz', Component: ModuleASection },
  { id: 'module-b', keywords: 'customer validation market research interviews lean canvas', Component: ModuleBSection },
  { id: 'module-c', keywords: 'offer branding storybrand voice pricing action plan', Component: ModuleCSection },
];

export default function CapeWebBlueprint() {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizResponses, setQuizResponses] = useState({});
  const [scoreMessage, setScoreMessage] = useState('Not checked yet.');
  const [pillar2QuizResponses, setPillar2QuizResponses] = useState({});
  const [pillar2ScoreMessage, setPillar2ScoreMessage] = useState('Not checked yet.');
  const [pillar3QuizResponses, setPillar3QuizResponses] = useState({});
  const [pillar3ScoreMessage, setPillar3ScoreMessage] = useState('Not checked yet.');
  const [pillar3BuildMode, setPillar3BuildMode] = useState('');
  const [pillar4QuizResponses, setPillar4QuizResponses] = useState({});
  const [pillar4ScoreMessage, setPillar4ScoreMessage] = useState('Not checked yet.');
  const [pillar4NeedApp, setPillar4NeedApp] = useState('');
  const [pillar4Stack, setPillar4Stack] = useState('');
  const [pillar4Features, setPillar4Features] = useState([]);
  const [pillar5QuizResponses, setPillar5QuizResponses] = useState({});
  const [pillar5ScoreMessage, setPillar5ScoreMessage] = useState('Not checked yet.');
  const [pillar5SnippetTitle, setPillar5SnippetTitle] = useState('');
  const [pillar5SnippetDesc, setPillar5SnippetDesc] = useState('');
  const [pillar6QuizResponses, setPillar6QuizResponses] = useState({});
  const [pillar6ScoreMessage, setPillar6ScoreMessage] = useState('Not checked yet.');
  const [pillar6PrimaryAction, setPillar6PrimaryAction] = useState('');
  const [pillar6HomePlatform, setPillar6HomePlatform] = useState('');
  const [pillar6DistPlatform, setPillar6DistPlatform] = useState('');
  const [pillar6BioName, setPillar6BioName] = useState('');
  const [pillar6BioWho, setPillar6BioWho] = useState('');
  const [pillar6BioResult, setPillar6BioResult] = useState('');
  const [pillar6BioCta, setPillar6BioCta] = useState('');
  const [pillar6SellType, setPillar6SellType] = useState('hybrid');
  const [pillar6OfferName, setPillar6OfferName] = useState('');
  const [pillar6OfferResult, setPillar6OfferResult] = useState('');
  const [pillar6IdeaCount, setPillar6IdeaCount] = useState(0);
  const [pillar6CurrentIdea, setPillar6CurrentIdea] = useState('');
  const [pillar7QuizResponses, setPillar7QuizResponses] = useState({});
  const [pillar7ScoreMessage, setPillar7ScoreMessage] = useState('Not checked yet.');
  const [pillar7Stack, setPillar7Stack] = useState('r0');
  const [pillar7BizName, setPillar7BizName] = useState('');
  const [pillar7BizOffer, setPillar7BizOffer] = useState('');
  const [pillar7BizArea, setPillar7BizArea] = useState('');
  const [pillar7BizLink, setPillar7BizLink] = useState('');
  const [pillar7PromptRole, setPillar7PromptRole] = useState('');
  const [pillar7PromptTask, setPillar7PromptTask] = useState('');
  const [pillar7PromptRules, setPillar7PromptRules] = useState('');
  const [pillar7PromptFormat, setPillar7PromptFormat] = useState('');
  const [pillar8QuizResponses, setPillar8QuizResponses] = useState({});
  const [pillar8ScoreMessage, setPillar8ScoreMessage] = useState('Not checked yet.');
  const [pillar9QuizResponses, setPillar9QuizResponses] = useState({});
  const [pillar9ScoreMessage, setPillar9ScoreMessage] = useState('Not checked yet.');
  const [pillar10QuizResponses, setPillar10QuizResponses] = useState({});
  const [pillar10ScoreMessage, setPillar10ScoreMessage] = useState('Not checked yet.');
  const [pillar11QuizResponses, setPillar11QuizResponses] = useState({});
  const [pillar11ScoreMessage, setPillar11ScoreMessage] = useState('Not checked yet.');
  const [personalizationContext, setPersonalizationContext] = useState(defaultPersonalizationContext);
  const [cookieWarningDismissed, setCookieWarningDismissed] = useState(false);
  const [activeModule, setActiveModule] = useState('module-a');
  const [activeArticleModule, setActiveArticleModule] = useState('module-a');
  const [isPillar1Expanded, setIsPillar1Expanded] = useState(true);
  const [isPillar2Expanded, setIsPillar2Expanded] = useState(false);
  const [isPillar3Expanded, setIsPillar3Expanded] = useState(false);
  const [isPillar4Expanded, setIsPillar4Expanded] = useState(false);
  const [isPillar5Expanded, setIsPillar5Expanded] = useState(false);
  const [isPillar6Expanded, setIsPillar6Expanded] = useState(false);
  const [isPillar7Expanded, setIsPillar7Expanded] = useState(false);
  const [isPillar8Expanded, setIsPillar8Expanded] = useState(false);
  const [isPillar9Expanded, setIsPillar9Expanded] = useState(false);
  const [isPillar10Expanded, setIsPillar10Expanded] = useState(false);
  const [isPillar11Expanded, setIsPillar11Expanded] = useState(false);
  const [activePillar, setActivePillar] = useState(1);
  const normalizedQuery = searchTerm.trim().toLowerCase();
  const articleRef = useRef(null);
  const navRef = useRef(null);
  const [deepseekRuntime, setDeepseekRuntime] = useState(() => normalizeDeepseekResponse(null, [], null));
  const [isDeepseekLoading, setIsDeepseekLoading] = useState(false);
  const [deepseekError, setDeepseekError] = useState('');
  const [lastAutoSignature, setLastAutoSignature] = useState(null);
  const personaSummary = useMemo(() => buildPersonaSummary(personalizationContext), [personalizationContext]);
  const recommendedPillar3Mode = useMemo(() => getRecommendedPillar3Mode(personalizationContext), [personalizationContext]);
  const pillar3Tracks = useMemo(() => getPillar3Tracks(personalizationContext, recommendedPillar3Mode), [personalizationContext, recommendedPillar3Mode]);
  const quizStatuses = useMemo(
    () =>
      getQuizStatuses({
        pillar1: scoreMessage,
        pillar2: pillar2ScoreMessage,
        pillar3: pillar3ScoreMessage,
        pillar4: pillar4ScoreMessage,
        pillar5: pillar5ScoreMessage,
        pillar6: pillar6ScoreMessage,
        pillar7: pillar7ScoreMessage,
        pillar8: pillar8ScoreMessage,
        pillar9: pillar9ScoreMessage,
        pillar10: pillar10ScoreMessage,
        pillar11: pillar11ScoreMessage,
      }),
    [
      scoreMessage,
      pillar2ScoreMessage,
      pillar3ScoreMessage,
      pillar4ScoreMessage,
      pillar5ScoreMessage,
      pillar6ScoreMessage,
      pillar7ScoreMessage,
      pillar8ScoreMessage,
      pillar9ScoreMessage,
      pillar10ScoreMessage,
      pillar11ScoreMessage,
    ],
  );
  const adaptivePlan = useMemo(() => computeAdaptivePlan(personalizationContext, quizStatuses), [personalizationContext, quizStatuses]);
  const activePillarMeta = useMemo(() => PILLAR_LIBRARY.find((pillar) => pillar.pillar === activePillar), [activePillar]);
  const activeResources = useMemo(() => filterResourcesForContext(activePillarMeta, personalizationContext), [activePillarMeta, personalizationContext]);
  const deepseekStrategyPrompt = useMemo(() => buildDeepseekMasterPrompt(personalizationContext, adaptivePlan, quizStatuses), [personalizationContext, adaptivePlan, quizStatuses]);
  const deepseekQAPrompt = useMemo(() => buildDeepseekQAPrompt(personalizationContext, adaptivePlan), [personalizationContext, adaptivePlan]);
  const deepseekPayload = useMemo(() => buildDeepseekPayload(personalizationContext, adaptivePlan, quizStatuses), [personalizationContext, adaptivePlan, quizStatuses]);
  const deepseekPayloadSignature = useMemo(() => createPayloadSignature(deepseekPayload), [deepseekPayload]);
  const remediationItems = useMemo(() => {
    return Object.entries(REMEDIATION_LIBRARY)
      .map(([slug, config]) => {
        const status = quizStatuses[slug] || 'not-started';
        return { slug, status, config };
      })
      .filter((item) => item.status !== 'passed')
      .map((item) => ({
        slug: item.slug,
        title: item.config.title,
        description: item.config.description,
        resources: item.config.resources,
        quizStatus: item.status,
        pillarTitle: getPillarTitle(item.slug),
      }));
  }, [quizStatuses]);

  useEffect(() => {
    const contextCookie = readCookie(PERSONALIZATION_COOKIE);
    if (contextCookie) {
      try {
        const parsed = JSON.parse(contextCookie);
        setPersonalizationContext({ ...defaultPersonalizationContext, ...parsed });
      } catch (error) {
        console.warn('CapeWeb: Unable to parse personalization cookie', error);
      }
    }

    const progressCookie = readCookie(PROGRESS_COOKIE);
    if (progressCookie) {
      try {
        const parsed = JSON.parse(progressCookie);
        if (parsed.activePillar) setActivePillar(parsed.activePillar);
        if (parsed.activeModule) setActiveModule(parsed.activeModule);
        if (parsed.activeArticleModule) setActiveArticleModule(parsed.activeArticleModule);
        if (parsed.quizResponses) {
          if (parsed.quizResponses.pillar1) setQuizResponses(parsed.quizResponses.pillar1);
          if (parsed.quizResponses.pillar2) setPillar2QuizResponses(parsed.quizResponses.pillar2);
          if (parsed.quizResponses.pillar3) setPillar3QuizResponses(parsed.quizResponses.pillar3);
          if (parsed.quizResponses.pillar4) setPillar4QuizResponses(parsed.quizResponses.pillar4);
          if (parsed.quizResponses.pillar5) setPillar5QuizResponses(parsed.quizResponses.pillar5);
          if (parsed.quizResponses.pillar6) setPillar6QuizResponses(parsed.quizResponses.pillar6);
          if (parsed.quizResponses.pillar7) setPillar7QuizResponses(parsed.quizResponses.pillar7);
          if (parsed.quizResponses.pillar8) setPillar8QuizResponses(parsed.quizResponses.pillar8);
          if (parsed.quizResponses.pillar9) setPillar9QuizResponses(parsed.quizResponses.pillar9);
          if (parsed.quizResponses.pillar10) setPillar10QuizResponses(parsed.quizResponses.pillar10);
          if (parsed.quizResponses.pillar11) setPillar11QuizResponses(parsed.quizResponses.pillar11);
        }
        if (parsed.scoreMessages) {
          if (parsed.scoreMessages.pillar1) setScoreMessage(parsed.scoreMessages.pillar1);
          if (parsed.scoreMessages.pillar2) setPillar2ScoreMessage(parsed.scoreMessages.pillar2);
          if (parsed.scoreMessages.pillar3) setPillar3ScoreMessage(parsed.scoreMessages.pillar3);
          if (parsed.scoreMessages.pillar4) setPillar4ScoreMessage(parsed.scoreMessages.pillar4);
          if (parsed.scoreMessages.pillar5) setPillar5ScoreMessage(parsed.scoreMessages.pillar5);
          if (parsed.scoreMessages.pillar6) setPillar6ScoreMessage(parsed.scoreMessages.pillar6);
          if (parsed.scoreMessages.pillar7) setPillar7ScoreMessage(parsed.scoreMessages.pillar7);
          if (parsed.scoreMessages.pillar8) setPillar8ScoreMessage(parsed.scoreMessages.pillar8);
          if (parsed.scoreMessages.pillar9) setPillar9ScoreMessage(parsed.scoreMessages.pillar9);
          if (parsed.scoreMessages.pillar10) setPillar10ScoreMessage(parsed.scoreMessages.pillar10);
          if (parsed.scoreMessages.pillar11) setPillar11ScoreMessage(parsed.scoreMessages.pillar11);
        }
      } catch (error) {
        console.warn('CapeWeb: Unable to parse progress cookie', error);
      }
    }

    const cachedDeepseek = readCookie(DEEPSEEK_PLAN_COOKIE);
    if (cachedDeepseek) {
      try {
        const parsed = JSON.parse(cachedDeepseek);
        setDeepseekRuntime(normalizeDeepseekResponse(parsed, [], parsed.signature));
      } catch (error) {
        console.warn('CapeWeb: Unable to parse Deepseek cache', error);
      }
    }
  }, []);

  useEffect(() => {
    try {
      writeCookie(PERSONALIZATION_COOKIE, JSON.stringify(personalizationContext));
    } catch (error) {
      console.warn('CapeWeb: Unable to persist personalization cookie', error);
    }
  }, [personalizationContext]);

  useEffect(() => {
    try {
      const payload = {
        activePillar,
        activeModule,
        activeArticleModule,
        quizResponses: {
          pillar1: quizResponses,
          pillar2: pillar2QuizResponses,
          pillar3: pillar3QuizResponses,
          pillar4: pillar4QuizResponses,
          pillar5: pillar5QuizResponses,
          pillar6: pillar6QuizResponses,
          pillar7: pillar7QuizResponses,
          pillar8: pillar8QuizResponses,
          pillar9: pillar9QuizResponses,
          pillar10: pillar10QuizResponses,
          pillar11: pillar11QuizResponses,
        },
        scoreMessages: {
          pillar1: scoreMessage,
          pillar2: pillar2ScoreMessage,
          pillar3: pillar3ScoreMessage,
          pillar4: pillar4ScoreMessage,
          pillar5: pillar5ScoreMessage,
          pillar6: pillar6ScoreMessage,
          pillar7: pillar7ScoreMessage,
          pillar8: pillar8ScoreMessage,
          pillar9: pillar9ScoreMessage,
          pillar10: pillar10ScoreMessage,
          pillar11: pillar11ScoreMessage,
        },
  };
      writeCookie(PROGRESS_COOKIE, JSON.stringify(payload));
    } catch (error) {
      console.warn('CapeWeb: Unable to persist progress cookie', error);
    }
  }, [
    activePillar,
    activeModule,
    activeArticleModule,
    quizResponses,
    pillar2QuizResponses,
    pillar3QuizResponses,
    pillar4QuizResponses,
    pillar5QuizResponses,
    pillar6QuizResponses,
    pillar7QuizResponses,
    pillar8QuizResponses,
    pillar9QuizResponses,
    pillar10QuizResponses,
    pillar11QuizResponses,
    scoreMessage,
    pillar2ScoreMessage,
    pillar3ScoreMessage,
    pillar4ScoreMessage,
    pillar5ScoreMessage,
    pillar6ScoreMessage,
    pillar7ScoreMessage,
    pillar8ScoreMessage,
    pillar9ScoreMessage,
    pillar10ScoreMessage,
    pillar11ScoreMessage,
  ]);

  useEffect(() => {
    try {
      writeCookie(DEEPSEEK_PLAN_COOKIE, JSON.stringify(deepseekRuntime));
    } catch (error) {
      console.warn('CapeWeb: Unable to persist Deepseek cache', error);
    }
  }, [deepseekRuntime]);

  const handleDeepseekRun = useCallback(
    async (signatureOverride) => {
      const signature = signatureOverride || deepseekPayloadSignature;
      if (!signature) return;
      setIsDeepseekLoading(true);
      setDeepseekError('');
      try {
        const requestBody = { ...deepseekPayload, signature };
        const response = await fetch('/api/deepseek/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          throw new Error(`Deepseek API responded with ${response.status}`);
        }
        const data = await response.json();
        setDeepseekRuntime(normalizeDeepseekResponse(data, adaptivePlan, signature));
      } catch (error) {
        console.error('CapeWeb: Deepseek run failed', error);
        setDeepseekError(error.message || 'Deepseek request failed. Copy the prompts manually as a fallback.');
      } finally {
        setIsDeepseekLoading(false);
      }
    },
    [deepseekPayload, adaptivePlan, deepseekPayloadSignature],
  );

  useEffect(() => {
    if (!deepseekPayloadSignature || isDeepseekLoading) return;
    const runtimeSignature = deepseekRuntime?.signature;
    if (runtimeSignature === deepseekPayloadSignature) return;
    if (lastAutoSignature === deepseekPayloadSignature) return;
    setLastAutoSignature(deepseekPayloadSignature);
    handleDeepseekRun(deepseekPayloadSignature);
  }, [deepseekPayloadSignature, deepseekRuntime?.signature, isDeepseekLoading, lastAutoSignature, handleDeepseekRun]);

  useEffect(() => {
    if (!pillar3BuildMode && recommendedPillar3Mode) {
      setPillar3BuildMode(recommendedPillar3Mode);
    }
  }, [pillar3BuildMode, recommendedPillar3Mode]);

  const visibleSections = useMemo(() => {
    // If searching, show all matching sections
    if (normalizedQuery) {
      return sectionBlocks.filter((section) => section.keywords.toLowerCase().includes(normalizedQuery));
    }
    // Otherwise, show only the active module
    return sectionBlocks.filter((section) => section.id === activeArticleModule);
  }, [normalizedQuery, activeArticleModule]);

  const handleModuleChange = (moduleId, articleModuleId, options = {}) => {
    setActiveModule(moduleId);
    setActiveArticleModule(articleModuleId || moduleId);
    if (options.scroll !== false && articleRef.current) {
      articleRef.current.scrollTop = 0;
    }
  };

  const handlePillar3TrackSelect = (mode, options = {}) => {
    if (!mode) return;
    setPillar3BuildMode(mode);
    setActivePillar(3);
    setIsPillar3Expanded(true);
    handleModuleChange(`p3-track-${mode}`, 'p3-main', options);
  };

  const renderActiveResources = () => {
    if (!activePillarMeta) return null;
    const municipalGroup = getMunicipalGroup(personalizationContext?.geography || '');
    return (
      <AdaptiveResourceDrawer
        key={activePillarMeta.slug}
        pillarMeta={activePillarMeta}
        resources={activeResources}
        quizStatus={quizStatuses[activePillarMeta.slug]}
        context={personalizationContext}
        municipalGroup={municipalGroup}
      />
    );
  };

  const renderContextualActions = (pillarSlug) => (
    <ContextualActionsList key={`${pillarSlug}-actions`} pillarSlug={pillarSlug} context={personalizationContext} />
  );

  const handleQuizResponse = (questionIndex, optionIndex) => {
    setQuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleScore = () => {
    const correct = quizQuestions.reduce((sum, question, index) => {
      return sum + (quizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 7
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 2 when you are.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setScoreMessage(message);
  };

  const handlePillar2QuizResponse = (questionIndex, optionIndex) => {
    setPillar2QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar2Score = () => {
    const correct = pillar2QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar2QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 7
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 3.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar2ScoreMessage(message);
  };

  const handlePillar3QuizResponse = (questionIndex, optionIndex) => {
    setPillar3QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar3Score = () => {
    const correct = pillar3QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar3QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 4.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar3ScoreMessage(message);
  };

  const handlePillar4QuizResponse = (questionIndex, optionIndex) => {
    setPillar4QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar4Score = () => {
    const correct = pillar4QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar4QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 5.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar4ScoreMessage(message);
  };

  const handlePillar5QuizResponse = (questionIndex, optionIndex) => {
    setPillar5QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar5Score = () => {
    const correct = pillar5QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar5QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 9
        ? `✅ Pass! You scored ${correct}/12. You're ready for Pillar 6.`
        : `❌ ${correct}/12. Revisit the sections you missed and try again.`;
    setPillar5ScoreMessage(message);
  };

  const handlePillar6QuizResponse = (questionIndex, optionIndex) => {
    setPillar6QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar6Score = () => {
    const correct = pillar6QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar6QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 10
        ? `✅ Pass! You scored ${correct}/13. You're ready for Pillar 7.`
        : `❌ ${correct}/13. Revisit the sections you missed and try again.`;
    setPillar6ScoreMessage(message);
  };

  const handlePillar7QuizResponse = (questionIndex, optionIndex) => {
    setPillar7QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar7Score = () => {
    const correct = pillar7QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar7QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 5
        ? `✅ Pass! You scored ${correct}/6. You're ready for Pillar 8.`
        : `❌ ${correct}/6. Revisit the sections you missed and try again.`;
    setPillar7ScoreMessage(message);
  };

  const handlePillar8QuizResponse = (questionIndex, optionIndex) => {
    setPillar8QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar8Score = () => {
    const correct = pillar8QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar8QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 9
        ? `✅ Pass! You scored ${correct}/12. You're ready for Pillar 9.`
        : `❌ ${correct}/12. Revisit the sections you missed and try again.`;
    setPillar8ScoreMessage(message);
  };

  const handlePillar9QuizResponse = (questionIndex, optionIndex) => {
    setPillar9QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar9Score = () => {
    const correct = pillar9QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar9QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 10.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar9ScoreMessage(message);
  };

  const handlePillar10QuizResponse = (questionIndex, optionIndex) => {
    setPillar10QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar10Score = () => {
    const correct = pillar10QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar10QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 11.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar10ScoreMessage(message);
  };

  const handlePillar11QuizResponse = (questionIndex, optionIndex) => {
    setPillar11QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar11Score = () => {
    const correct = pillar11QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar11QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. CapeWeb University complete!`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar11ScoreMessage(message);
  };

  const getBuildModePlan = (mode) => {
    switch (mode) {
      case 'r0':
        return (
          <>
            <strong>R0 Mode Plan:</strong>
            <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>Launch a 1-page offer (Google Sites / GitHub Pages / simple hosted page)</li>
              <li>Add a WhatsApp button as your primary CTA</li>
              <li>Use a payment link for getting paid without full ecommerce</li>
            </ul>
          </>
        );
      case 'starter':
        return (
          <>
            <strong>Starter Mode Plan:</strong>
            <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>Launch a clean landing page + FAQ + policies</li>
              <li>Add forms + lead routing + basic automations</li>
              <li>Implement GA4 + conversion tracking</li>
            </ul>
          </>
        );
      case 'shopify':
        return (
          <>
            <strong>Shopify Mode Plan:</strong>
            <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>Build product pages + collections + checkout</li>
              <li>Keep theme lean and performance-aware</li>
              <li>Integrate tracking + email/WhatsApp follow-ups</li>
            </ul>
          </>
        );
      default:
        return (
          <>
            <strong>Your build mode plan will appear here.</strong>
            <p style={{ margin: '.5rem 0 0', color: '#495057' }}>Choose a mode above.</p>
          </>
        );
    }
  };

  // Scroll isolation for article pane
  useEffect(() => {
    const el = articleRef.current;
    if (!el) return undefined;

    const handleWheel = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;

      // Prevent page scroll only if we're not at the boundaries
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

      // Prevent page scroll only if we're not at the boundaries
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

  return (
    <div className="capeweb-blueprint-shell">
      <PersonalizationPanel context={personalizationContext} onSave={setPersonalizationContext} />
      {!cookieWarningDismissed && (
        <CookieNotice onDismiss={() => setCookieWarningDismissed(true)} />
      )}
      <AdaptivePlanSummary plan={adaptivePlan} />
      <DeepseekPromptPanel strategyPrompt={deepseekStrategyPrompt} qaPrompt={deepseekQAPrompt} runtime={deepseekRuntime} isLoading={isDeepseekLoading} error={deepseekError} />
      <KnowledgeGapPanel gapItems={remediationItems} />
      <div className="learn-capeweb-layout">
        <div className="learn-capeweb-toc-wrapper">
          <aside className="learn-capeweb-toc">
            <section className="learn-capeweb-controls">
              <div className="search-bar-wrapper">
                <input
                  id="capeweb-search-p1"
                  type="text"
                  placeholder="🔍 Search CapeWeb topics..."
                  className="learn-capeweb-search"
                  aria-label="Search CapeWeb blueprint content"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <p className="search-hint">Browse by pillar or type what you want to learn.</p>
            </section>

            <nav className="learn-capeweb-nav" aria-label="CapeWeb Blueprint Navigation" ref={navRef}>
              <div className="toc-pillar-group">
                <button
                  type="button"
                  className={`toc-pillar-title-button ${isPillar1Expanded ? 'is-open' : ''}`}
                  aria-expanded={isPillar1Expanded}
                  onClick={() => {
                    setActivePillar(1);
                    setIsPillar1Expanded(!isPillar1Expanded);
                    setIsPillar2Expanded(false);
                    if (!isPillar1Expanded) {
                      handleModuleChange('module-a');
                    }
                  }}
                >
                  <div>
                    <div className="pillar-title">Pillar 1 · Strategic Foundation &amp; Brand Identity</div>
                    <div className="pillar-subtitle">Turn your idea into a clear plan + a brand people trust.</div>
                  </div>
                  <span className="toc-expander-icon" aria-hidden="true">
                    {isPillar1Expanded ? '▼' : '►'}
                  </span>
                </button>

                {isPillar1Expanded && (
                  <div className="pillar-modules" id="pillar-content-pillar-strategy">
                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'module-a' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'module-a' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('module-a')}
                  >
                    <div className="module-pill">Pillar 1</div>
                    <div>
                      <div className="module-title">Module A · The Founder Game Plan</div>
                      <p>Build your "founder operating system": goals, time, focus, and a simple weekly routine.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'module-b' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'module-b' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('module-b')}
                  >
                    <div className="module-pill">Pillar 1</div>
                    <div>
                      <div className="module-title">Module B · Problem, Customer &amp; Market</div>
                      <p>Pick the right customer, validate a real problem, and research the SA market using data.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'module-c' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'module-c' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('module-c')}
                  >
                    <div className="module-pill">Pillar 1</div>
                    <div>
                      <div className="module-title">Module C · Offer, Brand &amp; First 30 Days</div>
                      <p>Create a clear offer, a memorable brand, and a 30-day action plan to your first sale.</p>
                    </div>
                  </button>
                </div>
                )}
              </div>

              {/* Pillar 2 - Functional */}
              <div className="toc-pillar-group">
                <button
                  type="button"
                  className={`toc-pillar-title-button ${isPillar2Expanded ? 'is-open' : ''}`}
                  aria-expanded={isPillar2Expanded}
                  onClick={() => {
                    setActivePillar(2);
                    setIsPillar2Expanded(!isPillar2Expanded);
                    setIsPillar1Expanded(false);
                    if (!isPillar2Expanded) {
                      handleModuleChange('p2-module-a');
                    }
                  }}
                >
                  <div>
                    <div className="pillar-title">Pillar 2 · Legal, Governance & Compliance</div>
                    <div className="pillar-subtitle">Registrations, tax, contracts, POPIA, and doing it properly.</div>
                  </div>
                  <span className="toc-expander-icon" aria-hidden="true">
                    {isPillar2Expanded ? '▼' : '►'}
                  </span>
                </button>

                {isPillar2Expanded && (
                  <div className="pillar-modules" id="pillar-content-pillar-legal">
                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p2-module-a' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p2-module-a' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p2-module-a')}
                    >
                      <div className="module-pill">Pillar 2</div>
                      <div>
                        <div className="module-title">Module A · Choose Your Legal Setup</div>
                        <p>Decide your business structure and "make it real" without wasting money.</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p2-module-b' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p2-module-b' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p2-module-b')}
                    >
                      <div className="module-pill">Pillar 2</div>
                      <div>
                        <div className="module-title">Module B · Register & Tax Basics</div>
                        <p>Understand CIPC, SARS, eFiling, VAT, and micro-business options.</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p2-module-c' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p2-module-c' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p2-module-c')}
                    >
                      <div className="module-pill">Pillar 2</div>
                      <div>
                        <div className="module-title">Module C · Customers, POPIA & Online Selling</div>
                        <p>Protect your business with policies: CPA, ECTA, POPIA, PAIA.</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p2-module-d' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p2-module-d' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p2-module-d')}
                    >
                      <div className="module-pill">Pillar 2</div>
                      <div>
                        <div className="module-title">Module D · Employers & Ongoing Compliance</div>
                        <p>PAYE/UIF/Compensation Fund + annual returns + beneficial ownership.</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p2-module-bonus' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p2-module-bonus' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p2-module-bonus')}
                    >
                      <div className="module-pill">Pillar 2</div>
                      <div>
                        <div className="module-title">Bonus · Cape Town Permits & Tenders</div>
                        <p>City licences, informal trading permits, B-BBEE basics, CSD & eTenders.</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Pillar 3 - Functional */}
              <div className="toc-pillar-group">
                <button
                  type="button"
                  className={`toc-pillar-title-button ${isPillar3Expanded ? 'is-open' : ''}`}
                  aria-expanded={isPillar3Expanded}
                  onClick={() => {
                    setActivePillar(3);
                    const nextExpanded = !isPillar3Expanded;
                    setIsPillar3Expanded(nextExpanded);
                    setIsPillar1Expanded(false);
                    setIsPillar2Expanded(false);
                    setIsPillar4Expanded(false);
                    if (nextExpanded) {
                      handlePillar3TrackSelect(pillar3BuildMode || recommendedPillar3Mode, { scroll: false });
                    }
                  }}
                >
                  <div>
                    <div className="pillar-title">Pillar 3 · Web Development & Architecture</div>
                    <div className="pillar-subtitle">Build a fast digital HQ that converts visitors into customers.</div>
                  </div>
                  <span className="toc-expander-icon" aria-hidden="true">
                    {isPillar3Expanded ? '▼' : '►'}
                  </span>
                </button>

                {isPillar3Expanded && (
                  <div className="pillar-modules" id="pillar-content-pillar-web">
                    {pillar3Tracks.map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        className={`pillar-module ${activeModule === track.id ? 'is-active' : ''}`}
                        aria-current={activeModule === track.id ? 'true' : 'false'}
                        onClick={() => {
                          setActivePillar(3);
                          setIsPillar1Expanded(false);
                          setIsPillar2Expanded(false);
                          setIsPillar4Expanded(false);
                          handlePillar3TrackSelect(track.mode);
                        }}
                      >
                        <div className="module-pill">{track.isRecommended ? 'Recommended' : 'Track'}</div>
                        <div>
                          <div className="module-title">{track.title}</div>
                          <p>{track.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pillar 4 - Functional */}
              <div className="toc-pillar-group">
                <button
                  type="button"
                  className={`toc-pillar-title-button ${isPillar4Expanded ? 'is-open' : ''}`}
                  aria-expanded={isPillar4Expanded}
                  onClick={() => {
                    setActivePillar(4);
                    setIsPillar4Expanded(!isPillar4Expanded);
                    setIsPillar1Expanded(false);
                    setIsPillar2Expanded(false);
                    setIsPillar3Expanded(false);
                    if (!isPillar4Expanded) {
                      handleModuleChange('p4-main');
                    }
                  }}
                >
                  <div>
                    <div className="pillar-title">Pillar 4 · Mobile Application Development</div>
                    <div className="pillar-subtitle">Go from idea to app store-ready product.</div>
                  </div>
                  <span className="toc-expander-icon" aria-hidden="true">
                    {isPillar4Expanded ? '▼' : '►'}
                  </span>
                </button>

                {isPillar4Expanded && (
                  <div className="pillar-modules" id="pillar-content-pillar-mobile">
                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p4-main' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p4-main' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p4-main')}
                    >
                      <div className="module-pill">Pillar 4</div>
                      <div>
                        <div className="module-title">The Store-Ready MVP</div>
                        <p>Decide if you need an app, prototype it, build MVP scope, test, and submit to stores.</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Pillar 5 - Functional */}
              <div className="toc-pillar-group">
                <button
                  type="button"
                  className={`toc-pillar-title-button ${isPillar5Expanded ? 'is-open' : ''}`}
                  aria-expanded={isPillar5Expanded}
                  onClick={() => {
                    setActivePillar(5);
                    setIsPillar5Expanded(!isPillar5Expanded);
                    setIsPillar1Expanded(false);
                    setIsPillar2Expanded(false);
                    setIsPillar3Expanded(false);
                    setIsPillar4Expanded(false);
                    if (!isPillar5Expanded) {
                      handleModuleChange('p5-main');
                    }
                  }}
                >
                  <div>
                    <div className="pillar-title">Pillar 5 · Search Engine Optimization</div>
                    <div className="pillar-subtitle">Own organic demand across South Africa.</div>
                  </div>
                  <span className="toc-expander-icon" aria-hidden="true">
                    {isPillar5Expanded ? '▼' : '►'}
                  </span>
                </button>

                {isPillar5Expanded && (
                  <div className="pillar-modules" id="pillar-content-pillar-seo">
                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p5-main' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p5-main' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p5-main')}
                    >
                      <div className="module-pill">Pillar 5</div>
                      <div>
                        <div className="module-title">SEO for Real Revenue</div>
                        <p>Rank in local searches, get organic customers, and own demand in your market.</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Pillar 6 - Functional */}
              <div className="toc-pillar-group">
                <button
                  type="button"
                  className={`toc-pillar-title-button ${isPillar6Expanded ? 'is-open' : ''}`}
                  aria-expanded={isPillar6Expanded}
                  onClick={() => {
                    setActivePillar(6);
                    setIsPillar6Expanded(!isPillar6Expanded);
                    setIsPillar1Expanded(false);
                    setIsPillar2Expanded(false);
                    setIsPillar3Expanded(false);
                    setIsPillar4Expanded(false);
                    setIsPillar5Expanded(false);
                    if (!isPillar6Expanded) {
                      handleModuleChange('p6-main');
                    }
                  }}
                >
                  <div>
                    <div className="pillar-title">Pillar 6 · Social Media &amp; Digital Marketing</div>
                    <div className="pillar-subtitle">Storytell at the speed of social.</div>
                  </div>
                  <span className="toc-expander-icon" aria-hidden="true">
                    {isPillar6Expanded ? '▼' : '►'}
                  </span>
                </button>

                {isPillar6Expanded && (
                  <div className="pillar-modules" id="pillar-content-pillar-marketing">
                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p6-main' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p6-main' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p6-main')}
                    >
                      <div className="module-pill">Pillar 6</div>
                      <div>
                        <div className="module-title">The First 100 Sales Engine</div>
                        <p>Pick channels, set up profiles, publish content, run campaigns, and track what converts.</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Pillar 7 - Functional */}
              <div className="toc-pillar-group">
                <button
                  type="button"
                  className={`toc-pillar-title-button ${isPillar7Expanded ? 'is-open' : ''}`}
                  aria-expanded={isPillar7Expanded}
                  onClick={() => {
                    setActivePillar(7);
                    setIsPillar7Expanded(!isPillar7Expanded);
                    setIsPillar1Expanded(false);
                    setIsPillar2Expanded(false);
                    setIsPillar3Expanded(false);
                    setIsPillar4Expanded(false);
                    setIsPillar5Expanded(false);
                    setIsPillar6Expanded(false);
                    if (!isPillar7Expanded) {
                      handleModuleChange('p7-main');
                    }
                  }}
                >
                  <div>
                    <div className="pillar-title">Pillar 7 · Artificial Intelligence &amp; Automation</div>
                    <div className="pillar-subtitle">Scale with automations and AI assistants.</div>
                  </div>
                  <span className="toc-expander-icon" aria-hidden="true">
                    {isPillar7Expanded ? '▼' : '►'}
                  </span>
                </button>

                {isPillar7Expanded && (
                  <div className="pillar-modules" id="pillar-content-pillar-ai">
                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p7-main' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p7-main' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p7-main')}
                    >
                      <div className="module-pill">Pillar 7</div>
                      <div>
                        <div className="module-title">AI-Powered Growth Systems</div>
                        <p>Automate lead capture, bookings, follow-ups, and customer workflows using AI.</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Pillar 8 - Functional */}
              <div className="toc-pillar-group">
                <button
                  type="button"
                  className={`toc-pillar-title-button ${isPillar8Expanded ? 'is-open' : ''}`}
                  aria-expanded={isPillar8Expanded}
                  onClick={() => {
                    setActivePillar(8);
                    setIsPillar8Expanded(!isPillar8Expanded);
                    setIsPillar1Expanded(false);
                    setIsPillar2Expanded(false);
                    setIsPillar3Expanded(false);
                    setIsPillar4Expanded(false);
                    setIsPillar5Expanded(false);
                    setIsPillar6Expanded(false);
                    setIsPillar7Expanded(false);
                    if (!isPillar8Expanded) {
                      handleModuleChange('p8-main');
                    }
                  }}
                >
                  <div>
                    <div className="pillar-title">Pillar 8 · Cybersecurity &amp; Risk Management</div>
                    <div className="pillar-subtitle">Protect your accounts, website, customers, and reputation.</div>
                  </div>
                  <span className="toc-expander-icon" aria-hidden="true">
                    {isPillar8Expanded ? '▼' : '►'}
                  </span>
                </button>

                {isPillar8Expanded && (
                  <div className="pillar-modules" id="pillar-content-pillar-security">
                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p8-main' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p8-main' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p8-main')}
                    >
                      <div className="module-pill">Pillar 8</div>
                      <div>
                        <div className="module-title">The CapeWeb Security Shield</div>
                        <p>Stop hacks, reduce fraud, back up your business, and know what to do in an incident.</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Pillar 9 - Functional */}
              <div className="toc-pillar-group">
                <button
                  type="button"
                  className={`toc-pillar-title-button ${isPillar9Expanded ? 'is-open' : ''}`}
                  aria-expanded={isPillar9Expanded}
                  onClick={() => {
                    setActivePillar(9);
                    setIsPillar9Expanded(!isPillar9Expanded);
                    setIsPillar1Expanded(false);
                    setIsPillar2Expanded(false);
                    setIsPillar3Expanded(false);
                    setIsPillar4Expanded(false);
                    setIsPillar5Expanded(false);
                    setIsPillar6Expanded(false);
                    setIsPillar7Expanded(false);
                    setIsPillar8Expanded(false);
                    if (!isPillar9Expanded) {
                      handleModuleChange('p9-main');
                    }
                  }}
                >
                  <div>
                    <div className="pillar-title">Pillar 9 · Financial Systems &amp; eCommerce</div>
                    <div className="pillar-subtitle">Money, payments, pricing, bookkeeping, and selling online.</div>
                  </div>
                  <span className="toc-expander-icon" aria-hidden="true">
                    {isPillar9Expanded ? '▼' : '►'}
                  </span>
                </button>

                {isPillar9Expanded && (
                  <div className="pillar-modules" id="pillar-content-pillar-money">
                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p9-main' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p9-main' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p9-main')}
                    >
                      <div className="module-pill">Pillar 9</div>
                      <div>
                        <div className="module-title">The CapeWeb Money Machine</div>
                        <p>Build a financial system that helps you price, sell, collect, and track every rand.</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Pillar 10 - Functional */}
              <div className="toc-pillar-group">
                <button
                  type="button"
                  className={`toc-pillar-title-button ${isPillar10Expanded ? 'is-open' : ''}`}
                  aria-expanded={isPillar10Expanded}
                  onClick={() => {
                    setActivePillar(10);
                    setIsPillar10Expanded(!isPillar10Expanded);
                    setIsPillar1Expanded(false);
                    setIsPillar2Expanded(false);
                    setIsPillar3Expanded(false);
                    setIsPillar4Expanded(false);
                    setIsPillar5Expanded(false);
                    setIsPillar6Expanded(false);
                    setIsPillar7Expanded(false);
                    setIsPillar8Expanded(false);
                    setIsPillar9Expanded(false);
                    if (!isPillar10Expanded) {
                      handleModuleChange('p10-main');
                    }
                  }}
                >
                  <div>
                    <div className="pillar-title">Pillar 10 · Analytics &amp; Business Intelligence</div>
                    <div className="pillar-subtitle">Run the business on data, not vibes.</div>
                  </div>
                  <span className="toc-expander-icon" aria-hidden="true">
                    {isPillar10Expanded ? '▼' : '►'}
                  </span>
                </button>

                {isPillar10Expanded && (
                  <div className="pillar-modules" id="pillar-content-pillar-analytics">
                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p10-main' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p10-main' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p10-main')}
                    >
                      <div className="module-pill">Pillar 10</div>
                      <div>
                        <div className="module-title">The Growth Dashboard</div>
                        <p>Track conversions, revenue, and drop-offs. Decide what to fix every week.</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Pillar 11 - Functional */}
              <div className="toc-pillar-group">
                <button
                  type="button"
                  className={`toc-pillar-title-button ${isPillar11Expanded ? 'is-open' : ''}`}
                  aria-expanded={isPillar11Expanded}
                  onClick={() => {
                    setActivePillar(11);
                    setIsPillar11Expanded(!isPillar11Expanded);
                    setIsPillar1Expanded(false);
                    setIsPillar2Expanded(false);
                    setIsPillar3Expanded(false);
                    setIsPillar4Expanded(false);
                    setIsPillar5Expanded(false);
                    setIsPillar6Expanded(false);
                    setIsPillar7Expanded(false);
                    setIsPillar8Expanded(false);
                    setIsPillar9Expanded(false);
                    setIsPillar10Expanded(false);
                    if (!isPillar11Expanded) {
                      handleModuleChange('p11-main');
                    }
                  }}
                >
                  <div>
                    <div className="pillar-title">Pillar 11 · Customer Experience &amp; Support</div>
                    <div className="pillar-subtitle">Turn support into a growth lever.</div>
                  </div>
                  <span className="toc-expander-icon" aria-hidden="true">
                    {isPillar11Expanded ? '▼' : '►'}
                  </span>
                </button>

                {isPillar11Expanded && (
                  <div className="pillar-modules" id="pillar-content-pillar-cx">
                    <button
                      type="button"
                      className={`pillar-module ${activeModule === 'p11-main' ? 'is-active' : ''}`}
                      aria-current={activeModule === 'p11-main' ? 'true' : 'false'}
                      onClick={() => handleModuleChange('p11-main')}
                    >
                      <div className="module-pill">Pillar 11</div>
                      <div>
                        <div className="module-title">The CX Flywheel</div>
                        <p>Great support creates trust → reviews → more sales → easier growth.</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </aside>
        </div>

        <div className="learn-capeweb-article-pane">
          <div className="learn-capeweb-article" ref={articleRef}>
            {activePillar === 1 ? (
              <>
                <div className="article-eyebrow">Pillar 1 · Strategic Foundation &amp; Brand Identity</div>
                <h1>From Idea to a Real Business Plan (CapeWeb Style)</h1>
                <p className="article-summary">
                  <strong>Objective:</strong> Turn your raw idea into a clear plan: who you serve, what you sell, why people trust you,
                  and what your next 30 days look like. You will leave this pillar with: <strong>(1)</strong> a Lean Canvas, <strong>(2)</strong> a validated customer + problem, and <strong>(3)</strong> a brand message people understand.
                </p>
                {renderActiveResources()}
                {renderContextualActions('pillar3')}
                <div className="article-divider" />

                <JourneyMapSection />

                {visibleSections.length === 0 && !normalizedQuery && (
                  <div style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '8px', background: '#fff3cd', color: '#856404' }}>
                    No sections match that search. Try another keyword like "canvas", "offer", or "storybrand".
                  </div>
                )}

                {visibleSections.map(({ id, Component }) => (
                  <Component key={id} />
                ))}

                {!normalizedQuery && (
                  <>
                    <BossBattleSection quizResponses={quizResponses} onSelect={handleQuizResponse} onScore={handleScore} scoreMessage={scoreMessage} />
                    <CompletionSection />
                  </>
                )}
              </>
            ) : activePillar === 2 ? (
              <>
                <div className="article-eyebrow">Pillar 2 · Legal, Governance & Compliance</div>
                <h1>Legally Ready for Your First 100 Sales (South Africa + Cape Town)</h1>
                <p className="article-summary">
                  <strong>Objective:</strong> You will understand the legal basics to trade confidently in South Africa: business structure,
                  registration, tax basics, POPIA, consumer rules for online selling, and ongoing compliance. You'll leave with a{' '}
                  <strong>Compliance Passport</strong> checklist and a clear "what to do next" plan.
                </p>
                <div className="context-banner">
                  <strong>Personalised view:</strong> {personaSummary}
                </div>
                {renderActiveResources()}
                {renderContextualActions('pillar4')}
                <div className="article-divider" />

                {activeArticleModule === 'p2-module-a' && <Pillar2ModuleA personalizationContext={personalizationContext} />}
                {activeArticleModule === 'p2-module-b' && <Pillar2ModuleB personalizationContext={personalizationContext} />}
                {activeArticleModule === 'p2-module-c' && <Pillar2ModuleC personalizationContext={personalizationContext} />}
                {activeArticleModule === 'p2-module-d' && <Pillar2ModuleD personalizationContext={personalizationContext} />}
                {activeArticleModule === 'p2-module-bonus' && <Pillar2ModuleBonus personalizationContext={personalizationContext} />}

                {!normalizedQuery && (
                  <>
                    <Pillar2Quiz quizResponses={pillar2QuizResponses} onSelect={handlePillar2QuizResponse} onScore={handlePillar2Score} scoreMessage={pillar2ScoreMessage} />
                    <Pillar2Completion />
                  </>
                )}
              </>
            ) : activePillar === 3 ? (
              <>
                <div className="article-eyebrow">Pillar 3 · Web Development &amp; Architecture</div>
                <h1>The Digital HQ That Converts</h1>
                <p className="article-summary">
                  <strong>Objective:</strong> You will create a simple, fast website system that can earn money without you being online 24/7.
                  You'll learn structure (pages + content), build choices (R0-friendly options), performance (Core Web Vitals),
                  lead capture (forms + WhatsApp), and launch testing. By the end, you'll be ready to build or commission your site with confidence.
                </p>
                {renderActiveResources()}
                {renderContextualActions('pillar5')}
                <div className="article-divider" />

                {activeArticleModule === 'p3-main' && (
                  <Pillar3Content
                    buildMode={pillar3BuildMode}
                    setBuildMode={setPillar3BuildMode}
                    getBuildModePlan={getBuildModePlan}
                    onTrackChange={(mode) => handlePillar3TrackSelect(mode, { scroll: false })}
                  />
                )}

                {!normalizedQuery && (
                  <>
                    <Pillar3Quiz quizResponses={pillar3QuizResponses} onSelect={handlePillar3QuizResponse} onScore={handlePillar3Score} scoreMessage={pillar3ScoreMessage} />
                    <Pillar3Completion />
                  </>
                )}
              </>
            ) : activePillar === 4 ? (
              <>
                <div className="article-eyebrow">Pillar 4 · Mobile Application Development</div>
                <h1>The Store-Ready MVP</h1>
                <p className="article-summary">
                  <strong>Objective:</strong> Build an app plan you can actually finish. You will:
                  <strong> (1)</strong> decide if an app is the right move,
                  <strong> (2)</strong> create a clickable prototype,
                  <strong> (3)</strong> choose a beginner-friendly build path,
                  <strong> (4)</strong> learn the basics of mobile architecture,
                  <strong> (5)</strong> test properly,
                  <strong> (6)</strong> prep store assets + compliance,
                  and <strong> (7)</strong> submit like a pro.
                </p>
                {renderActiveResources()}
                {renderContextualActions('pillar6')}
                <div className="article-divider" />

                {activeArticleModule === 'p4-main' && (
                  <Pillar4Content
                    personalizationContext={personalizationContext}
                    needAppChoice={pillar4NeedApp}
                    setNeedAppChoice={setPillar4NeedApp}
                    stackChoice={pillar4Stack}
                    setStackChoice={setPillar4Stack}
                    selectedFeatures={pillar4Features}
                    setSelectedFeatures={setPillar4Features}
                  />
                )}

                {!normalizedQuery && (
                  <>
                    <Pillar4Quiz quizResponses={pillar4QuizResponses} onSelect={handlePillar4QuizResponse} onScore={handlePillar4Score} scoreMessage={pillar4ScoreMessage} />
                    <Pillar4Completion />
                  </>
                )}
              </>
            ) : activePillar === 5 ? (
              <>
                <div className="article-eyebrow">Pillar 5 · Search Engine Optimization</div>
                <h1>SEO for Real Revenue</h1>
                <p className="article-summary">
                  <strong>Objective:</strong> Learn how Google (and other search engines) find you, rank you, and send customers to your door.
                  You will understand: <strong>(1)</strong> keywords and search intent, <strong>(2)</strong> on-page optimization,{' '}
                  <strong>(3)</strong> technical SEO basics, <strong>(4)</strong> local SEO for Cape Town, <strong>(5)</strong> content systems
                  that compound, <strong>(6)</strong> link-building that won't harm you, and <strong>(7)</strong> measurement that matters.
                  By the end, you'll have an SEO action plan to own organic demand in your market.
                </p>
                {renderActiveResources()}
                {renderContextualActions('pillar7')}
                <div className="article-divider" />

                {activeArticleModule === 'p5-main' && (
                  <Pillar5Content
                    personalizationContext={personalizationContext}
                    snippetTitle={pillar5SnippetTitle}
                    setSnippetTitle={setPillar5SnippetTitle}
                    snippetDesc={pillar5SnippetDesc}
                    setSnippetDesc={setPillar5SnippetDesc}
                  />
                )}

                {!normalizedQuery && (
                  <>
                    <Pillar5Quiz quizResponses={pillar5QuizResponses} onSelect={handlePillar5QuizResponse} onScore={handlePillar5Score} scoreMessage={pillar5ScoreMessage} />
                    <Pillar5Completion />
                  </>
                )}
              </>
            ) : activePillar === 6 ? (
              <>
                <div className="article-eyebrow">Pillar 6 · Social Media &amp; Digital Marketing</div>
                <h1>Storytelling at the Speed of Social</h1>
                <p className="article-summary">
                  <strong>Objective:</strong> Build a marketing system that gets your <strong>first 100 sales</strong>.
                  You will learn the CapeWeb method: pick the right platforms, set up profiles that convert, create content that earns trust,
                  run simple campaigns (even with R0), and track what leads to money.
                  You'll finish with a <strong>7-day launch sprint</strong> and a <strong>weekly marketing scoreboard</strong>.
                </p>
                {renderActiveResources()}
                {renderContextualActions('pillar8')}
                <div className="article-divider" />

                {activeArticleModule === 'p6-main' && (
                  <Pillar6Content
                    personalizationContext={personalizationContext}
                    primaryAction={pillar6PrimaryAction}
                    setPrimaryAction={setPillar6PrimaryAction}
                    homePlatform={pillar6HomePlatform}
                    setHomePlatform={setPillar6HomePlatform}
                    distPlatform={pillar6DistPlatform}
                    setDistPlatform={setPillar6DistPlatform}
                    bioName={pillar6BioName}
                    setBioName={setPillar6BioName}
                    bioWho={pillar6BioWho}
                    setBioWho={setPillar6BioWho}
                    bioResult={pillar6BioResult}
                    setBioResult={setPillar6BioResult}
                    bioCta={pillar6BioCta}
                    setBioCta={setPillar6BioCta}
                    sellType={pillar6SellType}
                    setSellType={setPillar6SellType}
                    offerName={pillar6OfferName}
                    setOfferName={setPillar6OfferName}
                    offerResult={pillar6OfferResult}
                    setOfferResult={setPillar6OfferResult}
                    ideaCount={pillar6IdeaCount}
                    setIdeaCount={setPillar6IdeaCount}
                    currentIdea={pillar6CurrentIdea}
                    setCurrentIdea={setPillar6CurrentIdea}
                  />
                )}

                {!normalizedQuery && (
                  <>
                    <Pillar6Quiz quizResponses={pillar6QuizResponses} onSelect={handlePillar6QuizResponse} onScore={handlePillar6Score} scoreMessage={pillar6ScoreMessage} />
                    <Pillar6Completion />
                  </>
                )}
              </>
            ) : activePillar === 7 ? (
              <>
                <div className="article-eyebrow">Pillar 7 · Artificial Intelligence &amp; Automation</div>
                <h1>Scale with Automations and AI Assistants</h1>
                <p className="article-summary">
                  <strong>Objective:</strong> Build an always-on system that captures leads, books meetings, and follows up—without you.
                  You will learn where automation fits (lead capture, WhatsApp replies, bookings), how to choose your stack (R0, CRM, or custom automation),
                  when to add AI (prompts, chatbots, workflows), and how to stay compliant (POPIA, opt-ins, consent).
                  You'll finish with a <strong>playbook library</strong>, an <strong>AI prompt builder</strong>, and a <strong>pipeline template</strong>.
                </p>
                {renderActiveResources()}
                {renderContextualActions('pillar9')}
                <div className="article-divider" />

                {activeArticleModule === 'p7-main' && (
                  <Pillar7Content
                    personalizationContext={personalizationContext}
                    stack={pillar7Stack}
                    setStack={setPillar7Stack}
                    bizName={pillar7BizName}
                    setBizName={setPillar7BizName}
                    bizOffer={pillar7BizOffer}
                    setBizOffer={setPillar7BizOffer}
                    bizArea={pillar7BizArea}
                    setBizArea={setPillar7BizArea}
                    bizLink={pillar7BizLink}
                    setBizLink={setPillar7BizLink}
                    promptRole={pillar7PromptRole}
                    setPromptRole={setPillar7PromptRole}
                    promptTask={pillar7PromptTask}
                    setPromptTask={setPillar7PromptTask}
                    promptRules={pillar7PromptRules}
                    setPromptRules={setPillar7PromptRules}
                    promptFormat={pillar7PromptFormat}
                    setPromptFormat={setPillar7PromptFormat}
                  />
                )}

                {!normalizedQuery && (
                  <>
                    <Pillar7Quiz quizResponses={pillar7QuizResponses} onSelect={handlePillar7QuizResponse} onScore={handlePillar7Score} scoreMessage={pillar7ScoreMessage} />
                    <Pillar7Completion />
                  </>
                )}
              </>
            ) : activePillar === 8 ? (
              <>
                <div className="article-eyebrow">Pillar 8 · Cybersecurity &amp; Risk Management</div>
                <h1>Cybersecurity for Normal People (CapeWeb Edition)</h1>
                <p className="article-summary">
                  <strong>Objective:</strong> Build a simple, strong security foundation for a Cape Town business that sells a <strong>product + service</strong>.
                  You'll protect your email, social accounts, website, payments, devices, and customer data — and you'll create a "what to do if hacked" plan.
                  You'll finish with a <strong>Risk Register</strong> and a <strong>Security Shield Checklist</strong>.
                </p>
                {renderActiveResources()}
                {renderContextualActions('pillar10')}
                <div className="article-divider" />

                {activeArticleModule === 'p8-main' && <Pillar8Content personalizationContext={personalizationContext} />}

                {!normalizedQuery && (
                  <>
                    <Pillar8Quiz quizResponses={pillar8QuizResponses} onSelect={handlePillar8QuizResponse} onScore={handlePillar8Score} scoreMessage={pillar8ScoreMessage} />
                    <Pillar8Completion />
                  </>
                )}
              </>
            ) : activePillar === 9 ? (
              <>
                <div className="article-eyebrow">Pillar 9 · Financial Systems &amp; eCommerce</div>
                <h1>CapeWeb Money 101</h1>
                <p className="article-summary">
                  <strong>Objective:</strong> Build a financial system that works from Day 1. You'll track every sale, understand pricing, set up local payments,
                  choose your eCommerce path, write fair policies, and prepare for tax season. By the end, you'll have a <strong>simple ledger</strong>, a
                  <strong> pricing calculator</strong>, and a <strong>financial dashboard</strong> you can trust.
                </p>
                {renderActiveResources()}
                {renderContextualActions('pillar11')}
                <div className="article-divider" />

                {activeArticleModule === 'p9-main' && <Pillar9Content personalizationContext={personalizationContext} />}

                {!normalizedQuery && (
                  <>
                    <Pillar9Quiz quizResponses={pillar9QuizResponses} onSelect={handlePillar9QuizResponse} onScore={handlePillar9Score} scoreMessage={pillar9ScoreMessage} />
                    <Pillar9Completion />
                  </>
                )}
              </>
            ) : activePillar === 10 ? (
              <>
                <div className="article-eyebrow">Pillar 10 · Analytics &amp; Business Intelligence</div>
                <h1>The Growth Dashboard (Measure → Learn → Improve)</h1>
                <p className="article-summary">
                  <strong>Objective:</strong> Build a beginner-friendly measurement system for a product + service business in Cape Town.
                  You'll learn what to track, how to track it (free tools), how to interpret it, and how to choose your next improvement.
                </p>
                {renderActiveResources()}
                <div className="article-divider" />

                {activeArticleModule === 'p10-main' && <Pillar10Content personalizationContext={personalizationContext} />}

                {!normalizedQuery && (
                  <>
                    <Pillar10Quiz quizResponses={pillar10QuizResponses} onSelect={handlePillar10QuizResponse} onScore={handlePillar10Score} scoreMessage={pillar10ScoreMessage} />
                    <Pillar10Completion />
                  </>
                )}
              </>
            ) : activePillar === 11 ? (
              <>
                <div className="article-eyebrow">Pillar 11 · Customer Experience &amp; Support</div>
                <h1>The CX Flywheel (Support → Trust → Reviews → More Sales)</h1>
                <p className="article-summary">
                  <strong>Objective:</strong> Build a customer experience that feels like a "real company" from day one:
                  fast replies, clear expectations, simple policies, and a system that learns from customer questions.
                  This is how CapeWeb clients build businesses that run smoothly and grow.
                </p>
                {renderActiveResources()}
                <div className="article-divider" />

                {activeArticleModule === 'p11-main' && <Pillar11Content personalizationContext={personalizationContext} />}

                {!normalizedQuery && (
                  <>
                    <Pillar11Quiz quizResponses={pillar11QuizResponses} onSelect={handlePillar11QuizResponse} onScore={handlePillar11Score} scoreMessage={pillar11ScoreMessage} />
                    <Pillar11Completion />
                  </>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalizationPanel({ context, onSave }) {
  const [draft, setDraft] = useState(context);

  useEffect(() => {
    setDraft(context);
  }, [context]);

  const hasChanges = useMemo(() => JSON.stringify(draft) !== JSON.stringify(context), [draft, context]);

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(draft);
  };

  const handleReset = () => {
    setDraft(defaultPersonalizationContext);
    onSave(defaultPersonalizationContext);
  };

  return (
    <section className="personalization-panel" aria-labelledby="personalization-heading">
      <div className="personalization-panel__header">
        <div>
          <p className="panel-eyebrow">Adaptive syllabus onboarding</p>
          <h2 id="personalization-heading">Business DNA (no login required)</h2>
          <p className="panel-subtext">
            We store this profile in your browser cookies. Deepseek uses it to remix the 11 pillars each time you return.
          </p>
        </div>
        <div className="persona-chip">
          <span>Current focus</span>
          <strong>{context.sector || 'General SMME'}</strong>
        </div>
      </div>
      <form className="personalization-grid" onSubmit={handleSubmit}>
        <label className="personalization-field">
          <span>Primary sector</span>
          <select value={draft.sector} onChange={(event) => handleChange('sector', event.target.value)}>
            <option value="">Select…</option>
            <option value="township retail">Township retail</option>
            <option value="services">Services / agency</option>
            <option value="agriculture">Agriculture / agri-processing</option>
            <option value="health">Health & care</option>
            <option value="tourism">Tourism & hospitality</option>
            <option value="manufacturing">Light manufacturing</option>
            <option value="technology">Software / SaaS</option>
            <option value="ngo">Non-profit / social enterprise</option>
            <option value="other">Other / mixed</option>
          </select>
        </label>
        <label className="personalization-field">
          <span>Revenue stage</span>
          <select value={draft.revenueStage} onChange={(event) => handleChange('revenueStage', event.target.value)}>
            <option value="">Select…</option>
            <option value="idea validation">Idea validation</option>
            <option value="0-100k">R0 – R100k / yr</option>
            <option value="100k-1m">R100k – R1m / yr</option>
            <option value="1m-5m">R1m – R5m / yr</option>
            <option value="5m+">R5m+ / yr</option>
          </select>
        </label>
        <label className="personalization-field">
          <span>Funding need</span>
          <select value={draft.fundingTarget} onChange={(event) => handleChange('fundingTarget', event.target.value)}>
            <option value="">Select…</option>
            <option value="self-funded">Self-funded / bootstrapping</option>
            <option value="micro-grants">Micro-grants (NYDA, SmartXchange)</option>
            <option value="working-capital">Working capital / purchase orders</option>
            <option value="equipment finance">Equipment / asset finance</option>
            <option value="growth equity">Growth equity / VC</option>
          </select>
        </label>
        <label className="personalization-field">
          <span>Province / municipality</span>
          <input
            type="text"
            value={draft.geography}
            onChange={(event) => handleChange('geography', event.target.value)}
            placeholder="e.g., Cape Town Metro / eThekwini / Limpopo rural"
          />
        </label>
        <label className="personalization-field">
          <span>Home language</span>
          <select value={draft.language} onChange={(event) => handleChange('language', event.target.value)}>
            <option value="English">English</option>
            <option value="isiXhosa">isiXhosa</option>
            <option value="isiZulu">isiZulu</option>
            <option value="Sesotho">Sesotho</option>
            <option value="Setswana">Setswana</option>
            <option value="Afrikaans">Afrikaans</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="personalization-field">
          <span>Regulation focus</span>
          <select value={draft.regulationFocus} onChange={(event) => handleChange('regulationFocus', event.target.value)}>
            <option value="">General</option>
            <option value="health & safety">Health & safety</option>
            <option value="food">Food handling / agriculture</option>
            <option value="financial services">Financial services</option>
            <option value="data privacy">Data privacy (POPIA/HPCSA)</option>
            <option value="construction">Construction / CIDB</option>
            <option value="export">Export / customs</option>
          </select>
        </label>
        <label className="personalization-field personalization-field--wide">
          <span>Notes / nuance (optional)</span>
          <textarea
            rows={2}
            value={draft.notes}
            onChange={(event) => handleChange('notes', event.target.value)}
            placeholder="Any nuance we should feed Deepseek? (e.g., tender-ready, cross-border, cooperative)"
          />
        </label>
        <div className="personalization-panel__actions">
          <button type="submit" className="primary" disabled={!hasChanges}>
            Save profile
          </button>
          <button type="button" className="ghost" onClick={handleReset}>
            Reset profile
          </button>
        </div>
        <p className="persona-summary-text">{buildPersonaSummary(context)}</p>
      </form>
    </section>
  );
}

function CookieNotice({ onDismiss }) {
  return (
    <div className="cookie-notice" role="region" aria-live="polite">
      <div>
        <strong>Heads up:</strong> CapeWeb keeps your personalization + quiz progress in browser cookies only. Refreshing the page or
        clearing cookies will reset everything.
      </div>
      <button type="button" onClick={onDismiss}>
        Got it
      </button>
    </div>
  );
}

function AdaptivePlanSummary({ plan }) {
  if (!plan?.length) return null;
  const topThree = plan.slice(0, 3);
  const timelineLabels = ['Day 0–30', 'Day 30–60', 'Day 60–90'];

  return (
    <section className="adaptive-plan" aria-labelledby="adaptive-plan-heading">
      <div className="adaptive-plan__intro">
        <div>
          <p className="panel-eyebrow">Needs analysis → Adaptive Pillars</p>
          <h2 id="adaptive-plan-heading">Your Deepseek-powered focus stack</h2>
          <p className="panel-subtext">
            We keep all 11 pillars, but these are your next sprints. When you pass a quiz or change your profile, CapeWeb reshuffles this list.
          </p>
        </div>
      </div>
      <div className="adaptive-plan__list">
        {topThree.map((item, index) => (
          <article key={item.slug} className="adaptive-plan__item">
            <header>
              <span className="adaptive-plan__phase">{timelineLabels[index] || 'Later'}</span>
              <div className="adaptive-plan__title">
                <strong>{item.title}</strong>
                <span className={`status-badge status-badge--${item.quizStatus}`}>{item.quizStatus.replace('-', ' ')}</span>
              </div>
              <p className="adaptive-plan__objective">{item.objectives[0]}</p>
            </header>
            <ul className="adaptive-plan__reasons">
              {item.reasons.slice(0, 2).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <footer>
              <small>Target score: {item.quizGoal}/10 • Priority score: {item.priorityScore}</small>
            </footer>
          </article>
        ))}
      </div>
      <div className="adaptive-plan__note">
        <strong>30/60/90 loop:</strong> Focus on these sprints first. Deepseek will update the rest of the pillars after each quiz or profile change.
      </div>
    </section>
  );
}

function AdaptiveResourceDrawer({ pillarMeta, resources, context, quizStatus, municipalGroup }) {
  if (!pillarMeta) return null;
  const visibleResources = (resources && resources.length ? resources : pillarMeta.resources || []).slice(0, 4);
  const sectorLabel = context?.sector || 'SMMEs';
  return (
    <div className="adaptive-resource-drawer" aria-live="polite">
      <div className="adaptive-resource-drawer__intro">
        <div>
          <p className="panel-eyebrow">Context-aware resources</p>
          <strong>{pillarMeta.title}</strong>
          <p className="panel-subtext">Tailored for {sectorLabel}. Quiz status: {quizStatus?.replace('-', ' ') || 'not started'}.</p>
        </div>
        <small>Links stay within South Africa’s ecosystem.</small>
      </div>
      {visibleResources.length ? (
        <ul className="adaptive-resource-drawer__list">
          {visibleResources.map((resource) => (
            <li key={resource.url}>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                {resource.label}
              </a>
              <p>{resource.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ margin: 0, color: '#6c757d' }}>No contextual resources yet.</p>
      )}
      {municipalGroup?.resources?.length ? (
        <div className="adaptive-resource-drawer__municipal">
          <p className="panel-eyebrow">Municipal focus</p>
          <strong>{municipalGroup.label}</strong>
          <ul>
            {municipalGroup.resources.map((resource) => (
              <li key={`${municipalGroup.id}-${resource.label}`}>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.label}
                </a>
                <p>{resource.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ContextualActionsList({ pillarSlug, context }) {
  const actions = getPillarContextualActions(pillarSlug, context);
  if (!actions.length) return null;
  return (
    <div className="contextual-actions">
      <h4>Context-aware playbooks ({context?.sector || 'General'})</h4>
      <div className="contextual-actions__grid">
        {actions.map((action) => (
          <div key={`${pillarSlug}-${action.title}`} className="contextual-action-card">
            <strong>{action.title}</strong>
            <p>{action.description}</p>
            {action.checklist?.length ? (
              <ul>
                {action.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function DeepseekPromptPanel({ strategyPrompt, qaPrompt, runtime, isLoading, error }) {
  const formattedUpdatedAt = runtime?.updatedAt ? new Date(runtime.updatedAt).toLocaleString('en-ZA') : null;
  const adaptivePillars = runtime?.adaptivePillars || [];
  return (
    <section className="deepseek-panel" aria-labelledby="deepseek-panel-heading">
      <div className="deepseek-panel__intro">
        <div>
          <p className="panel-eyebrow">Deepseek integration</p>
          <h2 id="deepseek-panel-heading">AI prompt pack</h2>
          <p className="panel-subtext">
            Copy these prompts into Deepseek to remix the syllabus or audit the current build. Each prompt updates automatically using your Business DNA + adaptive plan.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', gap: '.25rem' }}>
          <span className={`status-badge status-badge--${isLoading ? 'not-started' : 'passed'}`}>
            {isLoading ? 'Refreshing plan…' : 'Adaptive plan up to date'}
          </span>
          {formattedUpdatedAt && <small>Last refresh: {formattedUpdatedAt}</small>}
        </div>
      </div>
      {error ? (
        <p style={{ color: '#c92a2a', marginTop: '.5rem' }}>{error}</p>
      ) : null}
      <div className="deepseek-panel__grid">
        <PromptCard title="Personalization master prompt" prompt={strategyPrompt} />
        <PromptCard title="Software & syllabus QA prompt" prompt={qaPrompt} />
      </div>
      {adaptivePillars.length ? (
        <div className="deepseek-panel__results">
          <div>
            <p className="panel-eyebrow">Latest AI plan</p>
            <strong>{adaptivePillars[0]?.title || 'Adaptive stack'}</strong>
          </div>
          <div className="deepseek-panel__results-grid">
            {adaptivePillars.slice(0, 3).map((pillar) => (
              <article key={pillar.title || pillar.slug} className="deepseek-panel__result-card">
                <header>
                  <span className="status-badge">Priority</span>
                  <strong>{pillar.title || pillar.slug}</strong>
                </header>
                {pillar.objectives?.length ? <p>{pillar.objectives[0]}</p> : null}
                {pillar.keyRisks?.length ? (
                  <ul>
                    {pillar.keyRisks.slice(0, 2).map((risk) => (
                      <li key={risk}>{risk}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
          {runtime?.followUpQuestions?.length ? (
            <div className="deepseek-panel__followups">
              <p className="panel-eyebrow">Follow-up questions</p>
              <ul>
                {runtime.followUpQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <p style={{ marginTop: '.75rem', color: '#6c757d' }}>Complete the Business DNA form or retake a quiz to refresh your adaptive pillar recommendations automatically.</p>
      )}
    </section>
  );
}

function KnowledgeGapPanel({ gapItems = [] }) {
  if (!gapItems.length) return null;
  return (
    <section className="action-deck" aria-labelledby="knowledge-gap-heading">
      <div className="action-deck__intro">
        <div>
          <p className="panel-eyebrow">Quiz follow-ups</p>
          <h2 id="knowledge-gap-heading">Learning reinforcement packs</h2>
          <p className="panel-subtext">If a quiz isn’t passed yet, revisit the official South African resources below before continuing.</p>
        </div>
      </div>
      <article className="action-card-stack">
        <ul>
          {gapItems.map((item) => (
            <li key={item.slug}>
              <div>
                <p className="panel-eyebrow">{item.pillarTitle}</p>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <ul>
                {item.resources.map((resource) => (
                  <li key={`${item.slug}-${resource.url}`}>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.label}
                    </a>
                    <p>{resource.description}</p>
                  </li>
                ))}
              </ul>
              <div className="action-card-meta">
                <span className={`status-badge status-badge--${item.quizStatus}`}>{item.quizStatus.replace('-', ' ')}</span>
                <small>Study each resource, then retake the quiz to unlock the next pillar.</small>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

function PromptCard({ title, prompt }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('CapeWeb: unable to copy prompt', error);
    }
  };

  return (
    <article className="prompt-card">
      <header>
        <strong>{title}</strong>
        <button type="button" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </header>
      <textarea readOnly value={prompt} />
    </article>
  );
}

function JourneyMapSection() {
  return (
    <div className="mastery-section" data-topic="journey map steps roadmap">
      <h3>0. The CapeWeb Map (So You Never Feel Lost)</h3>
      <p>
        Think of entrepreneurship like a trip. You don’t need “business school”. You need a map and a guide.
        <strong> CapeWeb is the guide</strong> — you are the builder.
      </p>
      <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <JourneyMapSvg />
        <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
          CapeWeb roadmap: we start with clarity (Pillar 1), then legality (Pillar 2), then building + growth.
        </figcaption>
      </figure>
      <div style={{ padding: '1rem', borderLeft: '4px solid #0b0f1a', background: '#f8f9fa', borderRadius: '8px' }}>
        <strong>CapeWeb rule #1:</strong> We only build what we can explain simply. If we can’t explain it, we don’t understand it yet.
      </div>
    </div>
  );
}

function ModuleASection() {
  return (
    <div className="mastery-section" data-topic="founder plan goals time management routine">
      <h3>Module A · The Founder Game Plan (Your Weekly Routine)</h3>
      <p>Many people fail in business for one reason: <strong>they do random things</strong>. CapeWeb fixes this by giving you a simple weekly routine.</p>
      <div className="workbook-section" style={sectionBoxStyle}>
        <h4>🧭 Setup Mission: Your Founder Profile</h4>
        <p>Fill this in. It becomes your “North Star” for the entire course.</p>
        <div style={gridTwoColumn}>
          <div className="canvas-box">
            <label htmlFor="p1-founder-name" style={labelStyle}>
              Founder Name
            </label>
            <input id="p1-founder-name" type="text" placeholder="e.g., Thando" style={inputStyle} />
          </div>
          <div className="canvas-box">
            <label htmlFor="p1-business-idea" style={labelStyle}>
              Business Idea (1 sentence)
            </label>
            <input id="p1-business-idea" type="text" placeholder="e.g., I help busy parents..." style={inputStyle} />
          </div>
          <div className="canvas-box">
            <label htmlFor="p1-why" style={labelStyle}>
              Why do you want this business?
            </label>
            <textarea id="p1-why" rows={3} placeholder="e.g., steady income, independence..." style={textareaStyle} />
          </div>
          <div className="canvas-box">
            <label htmlFor="p1-time" style={labelStyle}>
              Weekly time available
            </label>
            <select id="p1-time" style={inputStyle}>
              <option value="">Choose…</option>
              <option>2–4 hours / week</option>
              <option>5–10 hours / week</option>
              <option>10–20 hours / week</option>
              <option>20+ hours / week</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
          <strong>✅ CapeWeb Win Condition:</strong> If you can commit to <strong>5 hours/week</strong> consistently, you can build a real business — even starting from zero.
        </div>
      </div>
      <h4 style={{ marginTop: '1.5rem' }}>The CapeWeb Weekly Loop (Simple + Powerful)</h4>
      <p>Every successful entrepreneur has a loop. Here’s the CapeWeb loop:</p>
      <figure style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <WeeklyLoopSvg />
        <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
          Learn → Do → Proof → Improve. Repeat weekly. That’s how CapeWeb turns beginners into experts.
        </figcaption>
      </figure>
      <div className="workbook-section" style={sectionBoxStyle}>
        <h4>🎯 Mini-Quiz: Are you “building” or “dreaming”?</h4>
        <div className="quiz-question">
          <p>
            <strong>Question:</strong> Which one creates progress fastest?
          </p>
          <div className="quiz-options">
            <label className="radio-item">
              <input type="radio" name="p1_q_mindset" value="videos" /> Watching 10 hours of videos about business.
            </label>
            <label className="radio-item">
              <input type="radio" name="p1_q_mindset" value="action" /> Doing 1 hour of research + 1 real customer conversation.
            </label>
            <label className="radio-item">
              <input type="radio" name="p1_q_mindset" value="logo" /> Designing a logo before talking to customers.
            </label>
          </div>
          <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
            <summary style={{ color: '#0066cc', fontWeight: 700 }}>Check Answer</summary>
            <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
              <p>
                <strong>Correct:</strong> “1 hour research + 1 customer conversation.”
              </p>
              <p>
                CapeWeb builds skill through <strong>action</strong>. You’ll learn faster with one real conversation than with 10 random videos.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

function ModuleBSection() {
  return (
    <div className="mastery-section" data-topic="customer problem market research interviews lean canvas">
      <h3>Module B · Problem, Customer &amp; Market (The Truth Serum)</h3>
      <p>A business is simple: <strong>you solve a painful problem</strong> for a specific person, and they pay you because you made their life easier.</p>
      <h4>1) The 3 Words That Decide Everything</h4>
      <p>
        Your business must be clear in 3 words:
        <strong> WHO</strong> + <strong>PROBLEM</strong> + <strong>RESULT</strong>.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
        {['WHO', 'PROBLEM', 'RESULT'].map((title, index) => (
          <div key={title} style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
            <strong>{title}</strong>
            <p style={{ margin: '.5rem 0 0', color: '#6c757d' }}>
              {index === 0 ? 'A specific group' : index === 1 ? 'A daily pain (time, money, stress)' : 'What changes after you help?'}
            </p>
            <input
              type="text"
              placeholder={
                index === 0 ? 'e.g., salon owners in Khayelitsha' : index === 1 ? 'e.g., clients cancel last minute' : 'e.g., more bookings + fewer no-shows'
              }
              style={{ ...inputStyle, marginTop: '.75rem' }}
            />
          </div>
        ))}
      </div>
      <div style={{ padding: '1rem', borderLeft: '4px solid #0b0f1a', background: '#f8f9fa', borderRadius: '8px' }}>
        <strong>CapeWeb tip:</strong> If you say “everyone”, you’re saying “no one”.
      </div>
      <h4 style={{ marginTop: '1.5rem' }}>2) Validation: Proof Before Perfection</h4>
      <p>Most beginners build first and ask questions later. CapeWeb flips it: <strong>We get proof first</strong>, then we build.</p>
      <div className="workbook-section" style={sectionBoxStyle}>
        <h4>🗣️ Activity: The 5-Question Customer Interview Script</h4>
        <p>Talk to <strong>5 real people</strong> in your target group. Use WhatsApp voice notes if you’re shy. Ask these questions exactly (don’t “sell” — just learn).</p>
        <ol style={{ margin: '.75rem 0 0 1.25rem' }}>
          <li>“What’s the most frustrating part of <em>[problem area]</em> for you?”</li>
          <li>“When did this happen last?”</li>
          <li>“What do you do right now to fix it?”</li>
          <li>“How much does it cost you (money/time/stress)?”</li>
          <li>“If this was solved tomorrow, what would change?”</li>
        </ol>
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="p1-interview-notes" style={labelStyle}>
            Interview Notes (paste key quotes)
          </label>
          <textarea id="p1-interview-notes" rows={5} placeholder="Write exactly what people said. Their words become your marketing later." style={textareaStyle} />
        </div>
        <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
          <summary style={{ color: '#0066cc', fontWeight: 700 }}>Why this works (CapeWeb explanation)</summary>
          <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
            <p>People don’t buy your idea. They buy relief. This interview finds the real pain, the real language, and the real willingness to pay.</p>
          </div>
        </details>
      </div>
      <h4>3) Market Research (South Africa) — The “Don’t Guess” Toolkit</h4>
      <p>You don’t need expensive research. CapeWeb uses free tools to avoid building a business nobody wants.</p>
      <div className="comparison-table-wrapper">
        <table className="capeweb-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>What it helps you do</th>
              <th>Link</th>
              <th>Mini-mission</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Stats SA</strong>
              </td>
              <td>Find population, income, employment, industry data.</td>
              <td>
                <a href="https://www.statssa.gov.za/" target="_blank" rel="noopener noreferrer">
                  Open Stats SA
                </a>
              </td>
              <td>Find 2 numbers about your target area and write them below.</td>
            </tr>
            <tr>
              <td>
                <strong>Census Portal</strong>
              </td>
              <td>Explore Census data (municipal profiles, demographics).</td>
              <td>
                <a href="https://census.statssa.gov.za/" target="_blank" rel="noopener noreferrer">
                  Open Census Dissemination
                </a>
              </td>
              <td>Pick 1 municipality and note population + age trends.</td>
            </tr>
            <tr>
              <td>
                <strong>Google Trends (ZA)</strong>
              </td>
              <td>See what South Africans search for (interest over time).</td>
              <td>
                <a href="https://trends.google.com/trends/explore?geo=ZA&hl=en-US" target="_blank" rel="noopener noreferrer">
                  Open Google Trends ZA
                </a>
              </td>
              <td>Search 3 keywords. Which one is rising?</td>
            </tr>
            <tr>
              <td>
                <strong>Google Trends Help</strong>
              </td>
              <td>Learn how to interpret Trends correctly (avoid wrong conclusions).</td>
              <td>
                <a href="https://support.google.com/trends/answer/6248105?hl=en-ZA" target="_blank" rel="noopener noreferrer">
                  Open Guide
                </a>
              </td>
              <td>Learn “Topics vs Search Terms”. Then redo your search.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="workbook-section" style={sectionBoxStyle}>
        <h4>📊 Activity: Your Market Evidence (No Guessing)</h4>
        <div style={gridTwoColumn}>
          <div className="canvas-box">
            <label htmlFor="p1-market-number-1" style={labelStyle}>
              Evidence #1 (a number)
            </label>
            <input id="p1-market-number-1" type="text" placeholder="e.g., 120,000 people in X municipality" style={inputStyle} />
          </div>
          <div className="canvas-box">
            <label htmlFor="p1-market-number-2" style={labelStyle}>
              Evidence #2 (a trend)
            </label>
            <input id="p1-market-number-2" type="text" placeholder="e.g., “lunchbox ideas” searches rising in ZA" style={inputStyle} />
          </div>
          <div className="canvas-box" style={{ gridColumn: 'span 2' }}>
            <label htmlFor="p1-market-conclusion" style={labelStyle}>
              So what? (one sentence)
            </label>
            <textarea id="p1-market-conclusion" rows={2} placeholder="e.g., Demand exists and my customer group is large enough to test." style={textareaStyle} />
          </div>
        </div>
      </div>
      <h4>4) The Lean Canvas (Your One-Page Business Plan)</h4>
      <p>A Lean Canvas forces clarity. It’s not about fancy words — it’s about the truth.</p>
      <figure style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <LeanCanvasSvg />
        <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
          Lean Canvas: your business on one page. Clear beats complicated.
        </figcaption>
      </figure>
      <div className="workbook-section" style={sectionBoxStyle}>
        <h4>📝 Activity: Fill Your Lean Canvas (CapeWeb Edition)</h4>
        <p>Don’t try to be perfect. Try to be clear. You’ll improve it later.</p>
        <div style={gridTwoColumn}>
          {['Problem (top 3)', 'Customer (who exactly?)', 'Solution (top 3 features)', 'Channels'].map((label, index) => (
            <div className="canvas-box" key={label} style={index < 2 ? undefined : {}}>
              <label style={labelStyle}>{label}</label>
              <textarea rows={4} placeholder="Write your answer..." style={textareaStyle} />
            </div>
          ))}
          <div className="canvas-box" style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Unique Value Proposition (fill the sentence)</label>
            <p style={{ margin: '.25rem 0 .75rem', color: '#6c757d' }}>
              “[My business] helps [WHO] to [RESULT] without [PAIN], using [HOW].”
            </p>
            <textarea rows={2} placeholder="Explain your UVP..." style={textareaStyle} />
          </div>
          <div className="canvas-box">
            <label style={labelStyle}>Revenue</label>
            <textarea rows={3} placeholder="e.g., R299/week subscription" style={textareaStyle} />
          </div>
          <div className="canvas-box">
            <label style={labelStyle}>Costs</label>
            <textarea rows={3} placeholder="e.g., packaging, transport, marketing" style={textareaStyle} />
          </div>
          <div className="canvas-box">
            <label style={labelStyle}>Key Metrics (weekly)</label>
            <textarea rows={3} placeholder="e.g., leads, orders, repeat customers" style={textareaStyle} />
          </div>
          <div className="canvas-box">
            <label style={labelStyle}>Unfair Advantage</label>
            <textarea rows={3} placeholder="e.g., community access, unique skills" style={textareaStyle} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleCSection() {
  return (
    <div className="mastery-section" data-topic="offer pricing storybrand brand plan">
      <h3>Module C · Offer, Brand &amp; First 30 Days (Make it Real)</h3>
      <h4>1) Offer Design: Make “Yes” Easy</h4>
      <p>A brand-new founder often sells “a service”. CapeWeb teaches you to sell an <strong>offer</strong>: a clear package with a clear outcome.</p>
      <figure style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <ValueFrictionSvg />
        <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
          CapeWeb rule: Increase value, reduce friction. That’s how you win with beginners and busy customers.
        </figcaption>
      </figure>
      <div className="workbook-section" style={sectionBoxStyle}>
        <h4>🧱 Activity: Build Your First Offer (in 10 minutes)</h4>
        <div style={gridTwoColumn}>
          {['Result you deliver', 'Who it’s for'].map((label) => (
            <div className="canvas-box" key={label}>
              <label style={labelStyle}>{label}</label>
              <input type="text" placeholder="Type here..." style={inputStyle} />
            </div>
          ))}
          <div className="canvas-box">
            <label style={labelStyle}>What you will do (simple steps)</label>
            <textarea rows={4} placeholder="1) … 2) … 3) …" style={textareaStyle} />
          </div>
          <div className="canvas-box">
            <label style={labelStyle}>Price (first test price)</label>
            <input type="text" placeholder="e.g., R499 once-off" style={inputStyle} />
            <p style={{ margin: '.5rem 0 0', color: '#6c757d' }}>CapeWeb note: your first price is a <strong>test</strong>, not a tattoo.</p>
          </div>
        </div>
      </div>
      <h4>2) Brand Identity: Make Trust Visible</h4>
      <p>Branding is not “a logo”. Branding is <strong>what people believe about you</strong> before they buy.</p>
      <div style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <h5 style={{ margin: 0, marginBottom: '.75rem' }}>A simple brand identity checklist (CapeWeb starter)</h5>
        <ul style={{ margin: 0, marginLeft: '1.25rem' }}>
          <li>
            <strong>Name:</strong> easy to say, easy to spell
          </li>
          <li>
            <strong>Promise:</strong> the result you deliver
          </li>
          <li>
            <strong>Proof:</strong> testimonials, screenshots, before/after, numbers
          </li>
          <li>
            <strong>Personality:</strong> friendly, professional, bold, calm (choose 2)
          </li>
          <li>
            <strong>Consistency:</strong> same message everywhere
          </li>
        </ul>
      </div>
      <div className="workbook-section" style={sectionBoxStyle}>
        <h4>🎭 Activity: Pick Your Brand Personality (2 only)</h4>
        <p>Pick 2. More than 2 becomes confusing.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.75rem' }}>
          {['Friendly', 'Premium', 'Bold', 'Calm', 'Funny', 'Serious', 'Modern', 'Traditional', 'Luxury'].map((trait) => (
            <label key={trait}>
              <input type="checkbox" /> {trait}
            </label>
          ))}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="p1-tone-notes" style={labelStyle}>
            Write 1 sentence in your brand voice
          </label>
          <input id="p1-tone-notes" type="text" placeholder="e.g., ‘We make bookings simple, so you never stress again.’" style={inputStyle} />
        </div>
      </div>
      <h4>3) StoryBranding — The Message That Sells Without Begging</h4>
      <p>
        StoryBranding is a messaging method where the customer is the hero, your business is the guide, and the offer is the plan.
        <strong> CapeWeb example:</strong> You (the founder) are the hero trying to build a business. CapeWeb is the guide. The plan is the pillars. The success is a real business that runs well.
      </p>
      <figure style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <StoryBrandSvg />
        <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
          StoryBranding: customer = hero, you = guide, offer = plan. Clear messaging builds trust fast.
        </figcaption>
      </figure>
      <div className="workbook-section" style={sectionBoxStyle}>
        <h4>🧾 Activity: Write Your Brand Message (Copy/Paste Ready)</h4>
        <p>Fill these blanks. This becomes your website homepage, WhatsApp bio, and pitch.</p>
        <div style={gridTwoColumn}>
          {['Hero (customer)', 'Problem', 'Guide (your brand)'].map((label) => (
            <div className="canvas-box" key={label}>
              <label style={labelStyle}>{label}</label>
              <input type="text" placeholder="Type here..." style={inputStyle} />
            </div>
          ))}
          <div className="canvas-box">
            <label style={labelStyle}>Plan (3 steps)</label>
            <textarea rows={3} placeholder="1) … 2) … 3) …" style={textareaStyle} />
          </div>
          <div className="canvas-box" style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Final Message (auto-build it)</label>
            <textarea
              rows={4}
              placeholder="[Guide] helps [Hero] who struggle with [Problem] by using a simple plan: [Step 1], [Step 2], [Step 3]. Start today and get [Result]."
              style={textareaStyle}
            />
          </div>
        </div>
        <div style={{ marginTop: '1rem', background: '#fff3cd', padding: '1rem', borderRadius: '8px', color: '#856404', border: '1px solid #ffeeba' }}>
          <strong>⚠️ Beginner mistake:</strong> talking about yourself. <strong>CapeWeb fix:</strong> talk about the customer’s pain, then your plan, then proof.
        </div>
      </div>
      <h4>4) The First 30 Days Plan (No Overthinking)</h4>
      <p>Your goal is not a perfect brand — your goal is <strong>proof and progress</strong>.</p>
      <div className="workbook-section" style={sectionBoxStyle}>
        <h4>🗓️ CapeWeb 30-Day Sprint Checklist</h4>
        <div style={gridTwoColumn}>
          {[
            { title: 'Week 1: Proof', checklist: ['Talk to 5 customers', 'Write Lean Canvas (draft)', 'Identify 1 keyword trend'] },
            { title: 'Week 2: Offer', checklist: ['Build 1 clear offer', 'Test price with 3 people', 'Write your brand message'] },
            { title: 'Week 3: First Sales', checklist: ['Post offer to 2 channels', 'DM 10 prospects', 'Collect 1 testimonial'] },
            { title: 'Week 4: Improve', checklist: ['Improve offer based on feedback', 'Track 3 metrics weekly', 'Prepare to register in Pillar 2'] },
          ].map((item) => (
            <div key={item.title} style={smallCardStyle}>
              <strong>{item.title}</strong>
              <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
                {item.checklist.map((task) => (
                  <li key={task}>
                    <label>
                      <input type="checkbox" /> {task}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <h4>5) South Africa “Support &amp; Funding Map” (Preview + Links)</h4>
      <p>Here are the real South African portals you’ll use (we’ll teach the details in later pillars).</p>
      <div className="comparison-table-wrapper">
        <table className="capeweb-table">
          <thead>
            <tr>
              <th>What you need</th>
              <th>Portal / Resource</th>
              <th>Link</th>
              <th>When you’ll use it</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Company registration', 'CIPC', 'https://www.cipc.co.za/', 'Pillar 2'],
              ['Fast online registration', 'BizPortal (CIPC)', 'https://bizportal.gov.za/', 'Pillar 2'],
              ['Tax (business + eFiling)', 'SARS', 'https://www.sars.gov.za/', 'Pillar 2'],
              ['Starting a business & tax info', 'SARS guidance', 'https://www.sars.gov.za/businesses-and-employers/small-businesses-taxpayers/starting-a-business-and-tax/registering/', 'Pillar 2'],
              ['Non-financial support', 'SEDA (DSBD)', 'https://www.dsbd.gov.za/small-enterprise-development-agency-seda', 'Any time'],
              ['Funding / loans', 'sefa', 'https://www.sefa.org.za/', 'Pillar 9 + growth'],
              ['Online funding application portal', 'sefa portal', 'https://sefa.finfind.co.za/', 'When ready to apply'],
              ['Youth grants (18–35)', 'NYDA Grant Programme', 'https://www.nyda.gov.za/Products-Services/NYDA-Grant-Programme.html', 'When eligible'],
              ['Industrial / bigger funding', 'IDC', 'https://www.idc.co.za/', 'Scaling (later)'],
              ['Black economic participation support', 'NEF', 'https://www.nefcorp.co.za/', 'Funding pathways'],
              ['Innovation funding', 'TIA (funding solutions)', 'https://www.tia.org.za/funding-solutions/', 'If you’re building innovation/tech'],
              ['Seed fund (dtic)', 'the dtic seed fund', 'https://www.thedtic.gov.za/financial-and-non-financial-support/incentives/seed-fund/', 'When applying to programmes'],
              ['Government overview for small business', 'Gov.za small business development', 'https://www.gov.za/about-government/small-business-development', 'Orientation + links'],
            ].map((row) => (
              <tr key={row[1]}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>
                  <a href={row[2]} target="_blank" rel="noopener noreferrer">
                    Visit
                  </a>
                </td>
                <td>{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
        <strong>CapeWeb note:</strong> Funding is not magic. Most applications require proof of:
        <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
          <li>Clear customer + problem</li>
          <li>Simple business plan (Lean Canvas helps)</li>
          <li>Basic finances (costs, revenue, pricing)</li>
          <li>Compliance readiness (we do this in Pillar 2)</li>
        </ul>
      </div>
    </div>
  );
}

function BossBattleSection({ quizResponses, onSelect, onScore, scoreMessage }) {
  return (
    <div className="mastery-section" data-topic="test exam assessment boss battle">
      <h3>🏁 Boss Battle: Pillar 1 Knowledge Test</h3>
      <p>
        Don’t skip this. Score <strong>7/10</strong> or higher before moving on.
      </p>
      <div className="workbook-section" style={sectionBoxStyle}>
        {quizQuestions.map((question, index) => (
          <React.Fragment key={question.question}>
            <div className="quiz-question">
              <p>
                <strong>{index + 1})</strong> {question.question}
              </p>
              {question.options.map((option, optionIndex) => (
                <label key={option} className="radio-item">
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
            {index < quizQuestions.length - 1 && <hr style={dividerStyle} />}
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

function CompletionSection() {
  return (
    <div className="completion-box" style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed #ced4da' }}>
      <h3>🎉 Pillar 1 Complete</h3>
      <p>
        You now have a validated direction, a Lean Canvas, a clear offer, and a brand message.
        When you say “continue to Pillar 2”, CapeWeb will guide you through registrations, tax, and compliance in South Africa.
      </p>
    </div>
  );
}

const sectionBoxStyle = { backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' };
const gridTwoColumn = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
const inputStyle = { width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' };
const textareaStyle = { width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' };
const labelStyle = { fontWeight: 700, display: 'block', marginBottom: '.5rem' };
const smallCardStyle = { background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' };
const dividerStyle = { border: 'none', borderTop: '1px solid #e9ecef', margin: '1rem 0' };

function JourneyMapSvg() {
  return (
    <svg width="100%" viewBox="0 0 1100 180" role="img" aria-label="CapeWeb roadmap from idea to a well-run business">
      <defs>
        <style>
          {`.cw-box { fill: #ffffff; stroke: #0b0f1a; stroke-width: 2; rx: 10; }
            .cw-text { font: 18px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill: #0b0f1a; }
            .cw-sub { font: 14px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill: #495057; }
            .cw-arrow { stroke: #0b0f1a; stroke-width: 3; marker-end: url(#arrowhead); }`}
        </style>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a" />
        </marker>
      </defs>
      <rect className="cw-box" x="20" y="40" width="180" height="90"></rect>
      <text className="cw-text" x="110" y="78" textAnchor="middle">
        Idea
      </text>
      <text className="cw-sub" x="110" y="105" textAnchor="middle">
        What you want to build
      </text>
      <line className="cw-arrow" x1="200" y1="85" x2="260" y2="85"></line>
      <rect className="cw-box" x="260" y="40" width="220" height="90"></rect>
      <text className="cw-text" x="370" y="78" textAnchor="middle">
        Validate
      </text>
      <text className="cw-sub" x="370" y="105" textAnchor="middle">
        Real people, real proof
      </text>
      <line className="cw-arrow" x1="480" y1="85" x2="540" y2="85"></line>
      <rect className="cw-box" x="540" y="40" width="220" height="90"></rect>
      <text className="cw-text" x="650" y="78" textAnchor="middle">
        Build &amp; Launch
      </text>
      <text className="cw-sub" x="650" y="105" textAnchor="middle">
        MVP + first customers
      </text>
      <line className="cw-arrow" x1="760" y1="85" x2="820" y2="85"></line>
      <rect className="cw-box" x="820" y="40" width="260" height="90"></rect>
      <text className="cw-text" x="950" y="78" textAnchor="middle">
        Systems &amp; Scale
      </text>
      <text className="cw-sub" x="950" y="105" textAnchor="middle">
        Marketing, finance, automation
      </text>
    </svg>
  );
}

function WeeklyLoopSvg() {
  return (
    <svg width="100%" viewBox="0 0 980 260" role="img" aria-label="CapeWeb weekly loop diagram">
      <defs>
        <style>
          {`.cw2 { fill:#ffffff; stroke:#0b0f1a; stroke-width:2; rx:12; }
            .tx { font: 18px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; }
            .sub { font: 14px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .arr { stroke:#0b0f1a; stroke-width:3; marker-end:url(#ah2); }`}
        </style>
        <marker id="ah2" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a"></polygon>
        </marker>
      </defs>
      <rect className="cw2" x="40" y="40" width="260" height="90"></rect>
      <text className="tx" x="170" y="78" textAnchor="middle">
        Learn
      </text>
      <text className="sub" x="170" y="105" textAnchor="middle">
        New concept (small)
      </text>
      <rect className="cw2" x="340" y="40" width="260" height="90"></rect>
      <text className="tx" x="470" y="78" textAnchor="middle">
        Do
      </text>
      <text className="sub" x="470" y="105" textAnchor="middle">
        One mission (real)
      </text>
      <rect className="cw2" x="640" y="40" width="300" height="90"></rect>
      <text className="tx" x="790" y="78" textAnchor="middle">
        Get Proof
      </text>
      <text className="sub" x="790" y="105" textAnchor="middle">
        Customer feedback / data
      </text>
      <line className="arr" x1="300" y1="85" x2="340" y2="85"></line>
      <line className="arr" x1="600" y1="85" x2="640" y2="85"></line>
      <rect className="cw2" x="340" y="155" width="260" height="90"></rect>
      <text className="tx" x="470" y="192" textAnchor="middle">
        Improve
      </text>
      <text className="sub" x="470" y="220" textAnchor="middle">
        Make it simpler
      </text>
      <line className="arr" x1="790" y1="130" x2="560" y2="155"></line>
      <line className="arr" x1="340" y1="200" x2="170" y2="130"></line>
    </svg>
  );
}

function LeanCanvasSvg() {
  return (
    <svg width="100%" viewBox="0 0 1100 520" role="img" aria-label="Lean Canvas simplified diagram">
      <defs>
        <style>
          {`.lc { fill:#ffffff; stroke:#0b0f1a; stroke-width:2; }
            .lct { font: 16px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight: 700; }
            .lcs { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }`}
        </style>
      </defs>
      <rect className="lc" x="20" y="20" width="260" height="160"></rect>
      <text className="lct" x="40" y="55">
        Problem
      </text>
      <text className="lcs" x="40" y="82">
        Top 3 pains
      </text>
      <rect className="lc" x="300" y="20" width="260" height="160"></rect>
      <text className="lct" x="320" y="55">
        Customer
      </text>
      <text className="lcs" x="320" y="82">
        Who suffers?
      </text>
      <rect className="lc" x="580" y="20" width="500" height="160"></rect>
      <text className="lct" x="600" y="55">
        Unique Value Proposition
      </text>
      <text className="lcs" x="600" y="82">
        Why you? Why now?
      </text>
      <rect className="lc" x="20" y="200" width="260" height="140"></rect>
      <text className="lct" x="40" y="235">
        Solution
      </text>
      <text className="lcs" x="40" y="262">
        Top 3 features
      </text>
      <rect className="lc" x="300" y="200" width="260" height="140"></rect>
      <text className="lct" x="320" y="235">
        Channels
      </text>
      <text className="lcs" x="320" y="262">
        Where you find customers
      </text>
      <rect className="lc" x="580" y="200" width="260" height="140"></rect>
      <text className="lct" x="600" y="235">
        Revenue
      </text>
      <text className="lcs" x="600" y="262">
        How you make money
      </text>
      <rect className="lc" x="860" y="200" width="220" height="140"></rect>
      <text className="lct" x="880" y="235">
        Costs
      </text>
      <text className="lcs" x="880" y="262">
        What you spend
      </text>
      <rect className="lc" x="20" y="360" width="540" height="140"></rect>
      <text className="lct" x="40" y="395">
        Key Metrics
      </text>
      <text className="lcs" x="40" y="422">
        What you track weekly
      </text>
      <rect className="lc" x="580" y="360" width="500" height="140"></rect>
      <text className="lct" x="600" y="395">
        Unfair Advantage
      </text>
      <text className="lcs" x="600" y="422">
        Why you can win long-term
      </text>
    </svg>
  );
}

function ValueFrictionSvg() {
  return (
    <svg width="100%" viewBox="0 0 980 420" role="img" aria-label="Value vs Friction 2x2 grid">
      <defs>
        <style>
          {`.grid { fill:#ffffff; stroke:#0b0f1a; stroke-width:2; }
            .gt { font: 16px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:700; }
            .gs { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }`}
        </style>
      </defs>
      <rect className="grid" x="40" y="40" width="900" height="320"></rect>
      <line x1="490" y1="40" x2="490" y2="360" stroke="#0b0f1a" strokeWidth="2"></line>
      <line x1="40" y1="200" x2="940" y2="200" stroke="#0b0f1a" strokeWidth="2"></line>
      <text className="gt" x="120" y="120">
        ✅ Easy + Valuable
      </text>
      <text className="gs" x="120" y="145">
        Best zone. Customers stay.
      </text>
      <text className="gt" x="560" y="120">
        ⚠️ Hard + Not Valuable
      </text>
      <text className="gs" x="560" y="145">
        Customers leave fast.
      </text>
      <text className="gt" x="120" y="280">
        🧠 Easy but weak
      </text>
      <text className="gs" x="120" y="305">
        Needs stronger results.
      </text>
      <text className="gt" x="560" y="280">
        💎 Valuable but hard
      </text>
      <text className="gs" x="560" y="305">
        Reduce steps. Simplify.
      </text>
    </svg>
  );
}

function StoryBrandSvg() {
  return (
    <svg width="100%" viewBox="0 0 1100 260" role="img" aria-label="Simple storybranding message framework diagram">
      <defs>
        <style>
          {`.sb { fill:#ffffff; stroke:#0b0f1a; stroke-width:2; rx:12; }
            .sbt { font: 17px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:700; }
            .sbs { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .sba { stroke:#0b0f1a; stroke-width:3; marker-end:url(#sbm); }`}
        </style>
        <marker id="sbm" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a"></polygon>
        </marker>
      </defs>
      <rect className="sb" x="40" y="60" width="220" height="140"></rect>
      <text className="sbt" x="150" y="105" textAnchor="middle">
        Hero
      </text>
      <text className="sbs" x="150" y="135" textAnchor="middle">
        Your customer
      </text>
      <text className="sbs" x="150" y="160" textAnchor="middle">
        wants success
      </text>
      <line className="sba" x1="260" y1="130" x2="320" y2="130"></line>
      <rect className="sb" x="320" y="60" width="220" height="140"></rect>
      <text className="sbt" x="430" y="105" textAnchor="middle">
        Problem
      </text>
      <text className="sbs" x="430" y="135" textAnchor="middle">
        pain / risk
      </text>
      <line className="sba" x1="540" y1="130" x2="600" y2="130"></line>
      <rect className="sb" x="600" y="60" width="220" height="140"></rect>
      <text className="sbt" x="710" y="105" textAnchor="middle">
        Guide
      </text>
      <text className="sbs" x="710" y="135" textAnchor="middle">
        Your business brings clarity
      </text>
      <line className="sba" x1="820" y1="130" x2="880" y2="130"></line>
      <rect className="sb" x="880" y="60" width="180" height="140"></rect>
      <text className="sbt" x="970" y="105" textAnchor="middle">
        Plan
      </text>
      <text className="sbs" x="970" y="135" textAnchor="middle">
        steps + CTA
      </text>
    </svg>
  );
}
