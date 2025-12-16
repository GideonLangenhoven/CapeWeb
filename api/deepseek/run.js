const DEFAULT_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

const fetchFn =
  typeof globalThis.fetch === 'function'
    ? globalThis.fetch.bind(globalThis)
    : (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const ensureJson = (value) => {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return {};
  }
};

const buildUserPrompt = ({ userBrief, adaptivePlan, quizStatuses, softwareMap }) => {
  return [
    'USER_BRIEF:',
    JSON.stringify(userBrief, null, 2),
    '',
    'SOFTWARE_MAP:',
    softwareMap || 'CapeWeb Blueprint',
    '',
    'ADAPTIVE_PLAN:',
    JSON.stringify(adaptivePlan, null, 2),
    '',
    'QUIZ_STATUSES:',
    JSON.stringify(quizStatuses, null, 2),
    '',
    'Please return JSON with "adaptivePillars" (array of 11 entries: slug/title/objectives/keyRisks/suggestedInteractions) and "followUpQuestions".',
    'Use South African compliance/funding details wherever possible.',
  ].join('\n');
};

const normalizeResponse = (rawContent, fallbackPlan = []) => {
  if (typeof rawContent === 'string') {
    try {
      const parsed = JSON.parse(rawContent);
      return normalizeResponse(parsed, fallbackPlan);
    } catch (error) {
      // fall through
    }
  }

  if (rawContent && typeof rawContent === 'object') {
    const adaptivePillars = Array.isArray(rawContent.adaptivePillars) && rawContent.adaptivePillars.length ? rawContent.adaptivePillars : fallbackPlan;
    const followUpQuestions = Array.isArray(rawContent.followUpQuestions) ? rawContent.followUpQuestions : [];
    return { adaptivePillars, followUpQuestions };
  }

  return {
    adaptivePillars: fallbackPlan,
    followUpQuestions: ['Deepseek response could not be parsed, so we are using the client-side adaptive plan.'],
  };
};

const buildFallbackPlan = (plan = []) =>
  plan.map((pillar) => ({
    slug: pillar.slug,
    title: pillar.title,
    objectives: pillar.objectives,
    keyRisks: pillar.risks || pillar.keyRisks || [],
    suggestedInteractions: pillar.reasons || pillar.suggestedInteractions || [],
  }));

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = ensureJson(req.body);
  const {
    userBrief = {},
    adaptivePlan = [],
    quizStatuses = {},
    softwareMap = '',
    signature = null,
  } = body;

  const fallbackPlan = buildFallbackPlan(adaptivePlan);

  if (!process.env.DEEPSEEK_API_KEY) {
    return res.status(200).json({
      adaptivePillars: fallbackPlan,
      followUpQuestions: ['Set DEEPSEEK_API_KEY to enable live AI remixing.'],
      updatedAt: new Date().toISOString(),
      signature,
      mocked: true,
    });
  }

  try {
    const response = await fetchFn(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are Deepseek, CapeWeb’s adaptive syllabus strategist. Always respond with JSON containing adaptivePillars (11 entries) and followUpQuestions.',
          },
          {
            role: 'user',
            content: buildUserPrompt({ userBrief, adaptivePlan, quizStatuses, softwareMap }),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Deepseek API error', errorText);
      return res.status(response.status).json({
        adaptivePillars: fallbackPlan,
        followUpQuestions: ['Deepseek API error, used fallback plan instead.'],
        updatedAt: new Date().toISOString(),
        signature,
        error: errorText,
      });
    }

    const apiPayload = await response.json();
    const content = apiPayload?.choices?.[0]?.message?.content || null;
    const normalized = normalizeResponse(content, fallbackPlan);

    return res.status(200).json({
      adaptivePillars: normalized.adaptivePillars,
      followUpQuestions: normalized.followUpQuestions,
      updatedAt: new Date().toISOString(),
      signature,
    });
  } catch (error) {
    console.error('Deepseek handler failure', error);
    return res.status(500).json({
      adaptivePillars: fallbackPlan,
      followUpQuestions: ['Deepseek handler exception, used fallback plan.'],
      updatedAt: new Date().toISOString(),
      signature,
      error: error.message,
    });
  }
};
