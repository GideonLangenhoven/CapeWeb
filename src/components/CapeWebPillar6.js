import React, { useState, useEffect, useRef } from 'react';

const getPillar6Playbook = (context = {}) => {
  const sector = (context.sector || '').toLowerCase();
  const geography = context.geography || 'South Africa';
  const language = context.language || 'English';

  if (sector.includes('township')) {
    return {
      summary: `Lead with WhatsApp Commerce, Facebook Marketplace, and community radio for ${geography}. Use isiXhosa/isiZulu voice notes for trust.`,
      primaryAction: 'whatsapp',
      homePlatform: 'facebook',
      distPlatform: 'tiktok',
      quickIdeas: [
        'Daily WhatsApp Status with offer + CTA',
        'Facebook Marketplace listings showing delivery radius',
        'TikTok/Reels behind-the-scenes of prep/delivery',
      ],
      languageTip: `Record scripts in ${language} + vernacular for voice notes and captions.`,
    };
  }

  if (/technology|saas|software/.test(sector)) {
    return {
      summary: 'Anchor marketing around LinkedIn + email nurture, share proof-of-value clips, and run webinars for high-consideration buyers.',
      primaryAction: 'call',
      homePlatform: 'linkedin',
      distPlatform: 'youtube',
      quickIdeas: ['Weekly LinkedIn carousel with data', '30-minute demo webinars', 'Short product tips on YouTube Shorts'],
      languageTip: `Keep scripts concise and metric-heavy for ${language}-speaking execs.`,
    };
  }

  if (/tourism|travel|hospitality/.test(sector)) {
    return {
      summary: `Show experiences visually: Instagram/TikTok for discovery, distribute via travel Facebook groups + WhatsApp communities in ${geography}.`,
      primaryAction: 'checkout',
      homePlatform: 'instagram',
      distPlatform: 'facebook',
      quickIdeas: ['Reels showing itineraries', 'Stories with polls ("Which weekend?")', 'Facebook group posts with seasonal promos'],
      languageTip: 'Use bilingual captions (English + top tourist language).',
    };
  }

  if (/ngo|npo/.test(sector)) {
    return {
      summary: 'Tell impact stories, highlight beneficiaries, and nurture donors via WhatsApp + email while recruiting volunteers on Instagram/LinkedIn.',
      primaryAction: 'dm',
      homePlatform: 'instagram',
      distPlatform: 'linkedin',
      quickIdeas: ['Volunteer spotlight posts', 'Impact carousels with donate CTA', 'LinkedIn monthly impact digest'],
      languageTip: 'Alternate between community languages and English for accessibility.',
    };
  }

  return {
    summary: `Pick one "home" platform for deep content and one "distribution" channel to amplify across ${geography}.`,
    primaryAction: 'checkout',
    homePlatform: 'instagram',
    distPlatform: 'facebook',
    quickIdeas: [],
    languageTip: '',
  };
};

// Quiz questions for Pillar 6
export const pillar6QuizQuestions = [
  {
    question: 'Social media should connect to:',
    options: ['Random posting only', 'A clear action + follow-up loop', 'No CTA'],
    correctIndex: 1,
  },
  {
    question: "CapeWeb's beginner platform rule is:",
    options: ['Be on every platform daily', 'One home platform + one distribution platform', 'Only post once a year'],
    correctIndex: 1,
  },
  {
    question: 'A good bio includes:',
    options: ['Only emojis', 'Who you help + result + next step', 'A mystery slogan'],
    correctIndex: 1,
  },
  {
    question: 'Content that converts usually includes:',
    options: ['Education + proof + offer + CTA', 'Only trending dances (always)', 'Only long speeches with no CTA'],
    correctIndex: 0,
  },
  {
    question: 'Proof content helps because it:',
    options: ['Removes doubt', 'Confuses people', 'Replaces your product'],
    correctIndex: 0,
  },
  {
    question: 'The 7-day sprint is designed to:',
    options: ['Make you famous', 'Create consistent trust + sales conversations', 'Avoid talking to customers'],
    correctIndex: 1,
  },
  {
    question: 'Follow-up matters because:',
    options: ['Many people need reminders before buying', 'It is illegal', 'It reduces sales'],
    correctIndex: 0,
  },
  {
    question: 'Ads should be used when:',
    options: ['Your offer is unclear', 'Your offer is clear and your loop already works', 'You feel bored'],
    correctIndex: 1,
  },
  {
    question: 'The best "real" marketing scoreboard includes:',
    options: ['Only follower count', 'Conversations, leads, and sales', 'Only likes'],
    correctIndex: 1,
  },
  {
    question: 'One primary CTA is important because:',
    options: ['It reduces confusion and increases action', 'It reduces trust', 'It makes you look small'],
    correctIndex: 0,
  },
  {
    question: 'Repurposing content means:',
    options: ['Using one idea across multiple platforms', 'Copying other creators', 'Never posting again'],
    correctIndex: 0,
  },
  {
    question: '"Proof" can be:',
    options: ['Only a fancy website', 'Reviews, before/after, numbers, screenshots', 'A slogan'],
    correctIndex: 1,
  },
  {
    question: 'The goal of marketing is:',
    options: ['Entertainment only', 'Conversions (leads/sales) and long-term trust', 'Viral fame as the only outcome'],
    correctIndex: 1,
  },
];

// Main Pillar 6 component
export default function CapeWebPillar6() {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizResponses, setQuizResponses] = useState({});
  const [scoreMessage, setScoreMessage] = useState('Not checked yet.');
  const [progress, setProgress] = useState({ done: 0, total: 0, pct: 0 });

  // Interactive state
  const [primaryAction, setPrimaryAction] = useState('');
  const [homePlatform, setHomePlatform] = useState('');
  const [distPlatform, setDistPlatform] = useState('');
  const [bioName, setBioName] = useState('');
  const [bioWho, setBioWho] = useState('');
  const [bioResult, setBioResult] = useState('');
  const [bioCta, setBioCta] = useState('');
  const [sellType, setSellType] = useState('hybrid');
  const [offerName, setOfferName] = useState('');
  const [offerResult, setOfferResult] = useState('');
  const [ideaCount, setIdeaCount] = useState(0);
  const [currentIdea, setCurrentIdea] = useState('');

  const articleRef = useRef(null);
  const navRef = useRef(null);

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

  // Progress tracking
  useEffect(() => {
    const checkboxes = document.querySelectorAll('input[data-progress="true"]');
    const total = checkboxes.length;
    let done = 0;

    checkboxes.forEach((el) => {
      if ((el.type === 'checkbox' || el.type === 'radio') && el.checked) {
        done += 1;
      }
    });

    const pct = total ? Math.round((done / total) * 100) : 0;
    setProgress({ done, total, pct });
  }, [primaryAction, homePlatform, distPlatform, ideaCount, quizResponses]);

  return null; // This component exports parts for use in CapeWebBlueprint
}

// Content component
export function Pillar6Content({
  personalizationContext = {},
  primaryAction,
  setPrimaryAction,
  homePlatform,
  setHomePlatform,
  distPlatform,
  setDistPlatform,
  bioName,
  setBioName,
  bioWho,
  setBioWho,
  bioResult,
  setBioResult,
  bioCta,
  setBioCta,
  sellType,
  setSellType,
  offerName,
  setOfferName,
  offerResult,
  setOfferResult,
  ideaCount,
  setIdeaCount,
  currentIdea,
  setCurrentIdea,
}) {
  const playbook = getPillar6Playbook(personalizationContext);
  const personaLabel = personalizationContext?.sector || 'Business';

  const postIdeas = [
    "Hook: \"Most people waste money on [thing]. Here's the simple fix.\" → 3 tips → CTA",
    "Proof post: show a result (before/after) and explain what changed",
    "FAQ post: \"How much does [thing] cost in Cape Town?\" (simple explanation + CTA)",
    "Behind-the-scenes: \"Come with me while I prepare an order / deliver a service.\"",
    "Offer post: \"This week only: [offer]. DM 'ORDER' or WhatsApp to claim.\"",
    "Education: \"3 mistakes people make when buying [product] / booking [service].\"",
    "Comparison: \"Cheap vs quality — how to spot the difference.\"",
    "Story post: \"Why I started this in Cape Town with R0 (and what I learned).\"",
    "Customer spotlight: \"Meet [customer type]. Here's what they wanted + what we delivered.\"",
    "Objection handler: \"No time? No problem. Here's the quick option.\"",
    "Mini tutorial: \"How to use [product] in 30 seconds.\"",
    "Checklist: \"Before you book/buy, check these 5 things.\"",
    "Myth buster: \"You don't need [popular belief] to get [result].\"",
    "Pricing anchor: \"What affects the price of [service/product]?\"",
    "Local angle: \"Best time to get [service] / buy [product] in Cape Town.\"",
    "Trust builder: \"What happens after you order/book (step-by-step).\""
  ];

  const generateIdea = () => {
    const idx = Math.floor(Math.random() * postIdeas.length);
    setCurrentIdea(postIdeas[idx]);
    setIdeaCount(ideaCount + 1);
  };

  const getActionPlan = () => {
    const plans = {
      whatsapp: {
        title: 'WhatsApp CTA plan',
        steps: [
          'Add a WhatsApp button/link everywhere (bio, stories, website).',
          'Create 3 quick replies: price, how to order, delivery/booking steps.',
          'Reply speed goal: under 15 minutes during business hours.'
        ],
        tip: 'CapeWeb can automate WhatsApp follow-ups so you don\'t lose late-night leads.'
      },
      dm: {
        title: 'DM CTA plan',
        steps: [
          'Use one keyword: DM "START" or "ORDER".',
          'Reply with a short menu (3 options max).',
          'Move hot leads to WhatsApp or checkout to finalize payment.'
        ],
        tip: 'CapeWeb can connect DM leads to a tracking + follow-up system.'
      },
      checkout: {
        title: 'Checkout CTA plan',
        steps: [
          'Send people to one fast landing page (mobile-first).',
          'Make the next step obvious (buy/book).',
          'Track clicks and conversions (GA4 + events).'
        ],
        tip: 'CapeWeb builds fast conversion pages that don\'t waste attention.'
      },
      call: {
        title: 'Book-a-call CTA plan',
        steps: [
          'Use one booking link and one calendar flow.',
          'Answer objections on your page before the call.',
          'Confirm booking with reminders (reduce no-shows).'
        ],
        tip: 'CapeWeb can set up booking flows + reminders.'
      }
    };
    return plans[primaryAction] || null;
  };

  const getPlatformPlan = () => {
    if (!homePlatform || !distPlatform) return null;
    const pretty = (v) => v.charAt(0).toUpperCase() + v.slice(1);
    return {
      home: pretty(homePlatform),
      dist: pretty(distPlatform)
    };
  };

  const getScripts = () => {
    if (!offerName.trim() && !offerResult.trim()) return null;

    let opener = "Hey! Thanks for reaching out 🙌 What are you looking for — the product, the service, or both?";
    if (sellType === "product") opener = "Hey! Thanks for reaching out 🙌 Which product are you interested in?";
    if (sellType === "service") opener = "Hey! Thanks for reaching out 🙌 What service do you need and when do you need it?";

    return {
      opener,
      clarifier: "Quick question so I can help you fast: 1) what outcome do you want? 2) what's your timeline?",
      pitch: `Perfect. Our ${offerName || '[offer]'} helps you get ${offerResult || '[result]'}. Here's the simple plan: (1) confirm details (2) I send pricing/options (3) you confirm + we deliver.`,
      close: `Want me to send options + the next step? Reply with: your name + what you want + your area in Cape Town.`,
      followUp: `Quick follow-up 🙂 Do you want to go ahead with ${offerName || '[offer]'} today? I can hold a slot/stock for you. (No stress if not.)`,
      proof: "If it helps: most people choose us because it's simple and clear. We guide you step-by-step, and you'll know exactly what happens next."
    };
  };

  const actionPlan = getActionPlan();
  const platformPlan = getPlatformPlan();
  const scripts = getScripts();
  const formatLabel = (value) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : '');
  const recommendedCtaLabel = formatLabel(playbook.primaryAction);
  const recommendedHome = formatLabel(playbook.homePlatform);
  const recommendedDist = formatLabel(playbook.distPlatform);

  return (
    <>
      {/* SECTION 1 */}
      <div className="mastery-section">
        <h3>1) The real game: attention → trust → action → follow-up → sale</h3>
        <p>
          Here's the beginner truth: people don't buy the first time they see you.
          They buy after they understand you and trust you.
          CapeWeb builds a simple loop that turns posts into sales conversations.
        </p>
        {playbook.summary ? (
          <div className="context-banner">
            <strong>{personaLabel} playbook:</strong> {playbook.summary}
          </div>
        ) : null}
        {playbook.quickIdeas?.length ? (
          <div className="context-tip">
            <strong>Quick wins:</strong>
            <ul style={{ margin: '.35rem 0 0 1.1rem' }}>
              {playbook.quickIdeas.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
          <AttentionToSaleLoopDiagram />
          <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
            If you post without a loop, you stay "busy" but broke. If you build the loop, sales become predictable.
          </figcaption>
        </figure>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🧭 Mission 1: Choose your ONE primary action (don't confuse people)</h4>
          <p>Pick the single action you want people to take after seeing your content.</p>

          <div className="quiz-options">
            <label>
              <input data-progress="true" type="radio" name="p6_primary_action" value="whatsapp" checked={primaryAction === 'whatsapp'} onChange={(e) => setPrimaryAction(e.target.value)} />
              {' '}WhatsApp me to order/book
            </label><br />
            <label>
              <input data-progress="true" type="radio" name="p6_primary_action" value="dm" checked={primaryAction === 'dm'} onChange={(e) => setPrimaryAction(e.target.value)} />
              {' '}DM me "START" to get details
            </label><br />
            <label>
              <input data-progress="true" type="radio" name="p6_primary_action" value="checkout" checked={primaryAction === 'checkout'} onChange={(e) => setPrimaryAction(e.target.value)} />
              {' '}Click to buy/book on my website
            </label><br />
            <label>
              <input data-progress="true" type="radio" name="p6_primary_action" value="call" checked={primaryAction === 'call'} onChange={(e) => setPrimaryAction(e.target.value)} />
              {' '}Book a call
            </label>
          </div>
          {recommendedCtaLabel ? (
            <div className="context-tip">
              CapeWeb suggests leading with <strong>{recommendedCtaLabel}</strong> as your main CTA for {personaLabel.toLowerCase()} audiences. Lock it in, then add secondary options later.
            </div>
          ) : null}

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
            {actionPlan ? (
              <>
                <strong>{actionPlan.title}:</strong>
                <ol style={{ margin: '.75rem 0 0 1.25rem' }}>
                  {actionPlan.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                </ol>
                <p style={{ margin: '.75rem 0 0', color: '#495057' }}><strong>CapeWeb tip:</strong> {actionPlan.tip}</p>
              </>
            ) : (
              <>
                <strong>Your CapeWeb CTA plan will appear here.</strong>
                <p style={{ margin: '.5rem 0 0', color: '#495057' }}>Choose one action above.</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="mastery-section">
        <h3>2) Pick platforms like a pro (not like a distracted person)</h3>
        <p>
          CapeWeb's beginner rule: pick <strong>one "home platform"</strong> (where you post consistently)
          and <strong>one "distribution platform"</strong> (where you repurpose).
          That's how you stay consistent with real life.
        </p>

        <div className="comparison-table-wrapper">
          <table className="capeweb-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Best for</th>
                <th>Beginner move</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Instagram</td>
                <td>Local product/service discovery (visual)</td>
                <td>Reels + stories + DM</td>
                <td><a href="https://business.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram for business</a></td>
              </tr>
              <tr>
                <td>TikTok</td>
                <td>Fast reach (short video)</td>
                <td>3 simple videos/week</td>
                <td><a href="https://www.tiktok.com/business/" target="_blank" rel="noopener noreferrer">TikTok for Business</a></td>
              </tr>
              <tr>
                <td>Facebook</td>
                <td>Local groups + community trust</td>
                <td>Join groups + post offers carefully</td>
                <td><a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer">Meta Business Suite</a></td>
              </tr>
              <tr>
                <td>LinkedIn</td>
                <td>B2B services and credibility</td>
                <td>Proof + case studies</td>
                <td><a href="https://www.linkedin.com/business/" target="_blank" rel="noopener noreferrer">LinkedIn for business</a></td>
              </tr>
              <tr>
                <td>YouTube</td>
                <td>Evergreen authority (long-form)</td>
                <td>1 helpful video/month</td>
                <td><a href="https://creatoracademy.youtube.com/" target="_blank" rel="noopener noreferrer">YouTube Creator Academy</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🎮 Mission 2: Choose your "Home + Distribution" combo</h4>
          <p>Pick one home platform, then one distribution platform.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Home platform</strong>
              <div style={{ marginTop: '.75rem' }}>
                <label><input data-progress="true" type="radio" name="p6_home_platform" value="instagram" checked={homePlatform === 'instagram'} onChange={(e) => setHomePlatform(e.target.value)} /> Instagram</label><br />
                <label><input data-progress="true" type="radio" name="p6_home_platform" value="tiktok" checked={homePlatform === 'tiktok'} onChange={(e) => setHomePlatform(e.target.value)} /> TikTok</label><br />
                <label><input data-progress="true" type="radio" name="p6_home_platform" value="linkedin" checked={homePlatform === 'linkedin'} onChange={(e) => setHomePlatform(e.target.value)} /> LinkedIn</label><br />
                <label><input data-progress="true" type="radio" name="p6_home_platform" value="facebook" checked={homePlatform === 'facebook'} onChange={(e) => setHomePlatform(e.target.value)} /> Facebook</label>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Distribution platform</strong>
              <div style={{ marginTop: '.75rem' }}>
                <label><input data-progress="true" type="radio" name="p6_dist_platform" value="instagram" checked={distPlatform === 'instagram'} onChange={(e) => setDistPlatform(e.target.value)} /> Instagram</label><br />
                <label><input data-progress="true" type="radio" name="p6_dist_platform" value="tiktok" checked={distPlatform === 'tiktok'} onChange={(e) => setDistPlatform(e.target.value)} /> TikTok</label><br />
                <label><input data-progress="true" type="radio" name="p6_dist_platform" value="youtube" checked={distPlatform === 'youtube'} onChange={(e) => setDistPlatform(e.target.value)} /> YouTube Shorts</label><br />
                <label><input data-progress="true" type="radio" name="p6_dist_platform" value="facebook" checked={distPlatform === 'facebook'} onChange={(e) => setDistPlatform(e.target.value)} /> Facebook</label>
              </div>
            </div>
          </div>
          {(recommendedHome || recommendedDist) ? (
            <div className="context-tip">
              CapeWeb suggests <strong>{recommendedHome || 'Instagram'}</strong> as your home base and <strong>{recommendedDist || 'Facebook'}</strong> for distribution for this profile.
            </div>
          ) : null}

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
            {platformPlan ? (
              <>
                <strong>Your combo:</strong> {platformPlan.home} (home) + {platformPlan.dist} (distribution)
                <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
                  <li>Post 3 times/week on <strong>{platformPlan.home}</strong> (education, proof, offer).</li>
                  <li>Repurpose the best post to <strong>{platformPlan.dist}</strong> within 24 hours.</li>
                  <li>Weekly goal: 20+ conversations started from CTAs.</li>
                </ul>
                <p style={{ margin: '.75rem 0 0', color: '#495057' }}><strong>CapeWeb tip:</strong> Consistency beats creativity. Ship weekly.</p>
              </>
            ) : (
              <>
                <strong>Your CapeWeb consistency plan will appear here.</strong>
                <p style={{ margin: '.5rem 0 0', color: '#495057' }}>Pick both options above.</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="mastery-section">
        <h3>3) Set up profiles that convert (your bio is your mini-website)</h3>
        <p>
          Most beginners write a bio that says "We do amazing things."
          CapeWeb writes bios that answer the customer's question:
          <strong>"Can you help me? How do I buy?"</strong>
        </p>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🛠️ Bio Builder (fill it in, see a preview)</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Business name</label>
              <input type="text" placeholder="Example: CapeGlow" value={bioName} onChange={(e) => setBioName(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />

              <label style={{ marginTop: '.75rem', fontWeight: 900, display: 'block' }}>Who you help (simple)</label>
              <input type="text" placeholder="Example: Busy Cape Town professionals" value={bioWho} onChange={(e) => setBioWho(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />

              <label style={{ marginTop: '.75rem', fontWeight: 900, display: 'block' }}>What result you deliver</label>
              <input type="text" placeholder="Example: calm homes + relaxing vibes" value={bioResult} onChange={(e) => setBioResult(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />

              <label style={{ marginTop: '.75rem', fontWeight: 900, display: 'block' }}>Primary CTA</label>
              <input type="text" placeholder="Example: WhatsApp to order / Book a workshop" value={bioCta} onChange={(e) => setBioCta(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />

              <label style={{ marginTop: '.75rem' }}>
                <input data-progress="true" type="checkbox" /> I filled in my bio builder
              </label>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Preview</strong>
              <div style={{ marginTop: '.75rem', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
                <div style={{ fontWeight: 900, fontSize: '1.05rem' }}>{bioName.trim() || 'Your Business Name'}</div>
                <div style={{ marginTop: '.5rem', color: '#495057', lineHeight: 1.5 }}>
                  Helping {bioWho.trim() || '[who]'} get {bioResult.trim() || '[result]'}.<br />
                  📍 Cape Town<br />
                  👉 {bioCta.trim() || '[CTA]'}
                </div>
              </div>

              <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
                <summary style={{ color: '#0066cc', fontWeight: 900 }}>CapeWeb profile checklist</summary>
                <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
                  <ul style={{ margin: '.5rem 0 0 1.25rem' }}>
                    <li>Clear promise (who + result)</li>
                    <li>Location if local (Cape Town)</li>
                    <li>One CTA (WhatsApp/DM/Buy)</li>
                    <li>Pin 3 posts: Offer • Proof • How it works</li>
                    <li>Highlights: Prices • Reviews • FAQ • Delivery/Booking</li>
                  </ul>
                </div>
              </details>

              <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
                <strong>✅ CapeWeb upgrade:</strong> CapeWeb can rewrite your profile + build a conversion landing page that matches your bio CTA.
                <a href="/contact" target="_blank" rel="noopener noreferrer" style={{ color: '#1e7e34', fontWeight: 900, textDecoration: 'underline' }}> Open CapeWeb →</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 */}
      <div className="mastery-section">
        <h3>4) Content that converts (not just content that exists)</h3>
        <p>
          You don't need to be an influencer.
          You need to answer questions, show proof, and invite action.
          CapeWeb uses a simple content mix so people trust you fast.
        </p>

        <div className="comparison-table-wrapper">
          <table className="capeweb-table">
            <thead>
              <tr>
                <th>Content type</th>
                <th>What it does</th>
                <th>Example (product + service)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Education</td>
                <td>Builds trust (you know your stuff)</td>
                <td>"How to choose the right [product]" / "How to prepare for a [service]"</td>
              </tr>
              <tr>
                <td>Proof</td>
                <td>Removes doubt</td>
                <td>Before/after, testimonials, numbers, client screenshots</td>
              </tr>
              <tr>
                <td>Behind-the-scenes</td>
                <td>Makes you human + believable</td>
                <td>Making the product / delivering the service</td>
              </tr>
              <tr>
                <td>Offer</td>
                <td>Creates sales</td>
                <td>"This week: [offer] — DM 'ORDER'" / "Book 3 slots left"</td>
              </tr>
              <tr>
                <td>Community</td>
                <td>Creates loyalty</td>
                <td>Polls, questions, customer spotlight, reposts</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1.25rem', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
          <strong>Definition (StoryBrand messaging):</strong> a way of speaking where the customer is the hero, you are the guide,
          and you clearly show (1) the problem, (2) the plan, and (3) the next step.
          <div style={{ marginTop: '.75rem', color: '#495057' }}>
            <strong>Example (generic, easy to copy):</strong><br />
            "If you're dealing with <em>[problem]</em>, you're not alone. Here's the simple plan: <strong>Step 1</strong>…, <strong>Step 2</strong>…, <strong>Step 3</strong>….
            Want help? <strong>DM/WhatsApp</strong> and we'll guide you."
          </div>
        </div>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🎁 CapeWeb Hook Generator (press a button, get a post idea)</h4>
          <p>Use these to create posts fast. Replace the brackets with your business.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', alignItems: 'center' }}>
            <button type="button" onClick={generateIdea} style={{ padding: '.7rem 1rem', borderRadius: '8px', border: '1px solid #0b0f1a', background: '#0b0f1a', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
              Generate a post idea
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', background: '#fff', border: '1px solid #e9ecef', borderRadius: '999px', padding: '.4rem .75rem' }}>
              <input data-progress="true" type="checkbox" checked={ideaCount >= 3} readOnly />
              I generated at least 3 ideas
            </label>
          </div>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
            {currentIdea ? (
              <>
                <strong>Post idea:</strong>
                <p style={{ margin: '.5rem 0 0', color: '#495057' }}>{currentIdea}</p>
              </>
            ) : (
              <>
                <strong>Your post idea appears here.</strong>
                <p style={{ margin: '.5rem 0 0', color: '#495057' }}>Press "Generate a post idea".</p>
              </>
            )}
          </div>

          <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
            <summary style={{ color: '#0066cc', fontWeight: 900 }}>CapeWeb caption template (copy/paste)</summary>
            <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
              <p><strong>Hook:</strong> (one sentence that makes them stop)</p>
              <p><strong>Value:</strong> (2–4 quick points)</p>
              <p><strong>Proof:</strong> (result, review, photo, number)</p>
              <p><strong>CTA:</strong> (one action: DM/WhatsApp/Buy)</p>
            </div>
          </details>
        </div>
      </div>

      {/* SECTION 5 */}
      <div className="mastery-section">
        <h3>5) The "First 100 Sales" plan (R0-friendly)</h3>
        <p>
          If you have R0, your best move is not paid ads.
          Your best move is <strong>consistent content + direct conversations + fast follow-up</strong>.
          CapeWeb calls this the <strong>7-day launch sprint</strong>.
        </p>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🚀 Mission 3: 7-Day Launch Sprint (tick daily)</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Days 1–3: Build trust</strong>
              <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
                <li><label><input data-progress="true" type="checkbox" /> Day 1: Post an "education" reel + CTA</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Day 2: Post proof (review/result) + CTA</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Day 3: Behind-the-scenes + CTA</label></li>
              </ul>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Days 4–7: Ask for the sale</strong>
              <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
                <li><label><input data-progress="true" type="checkbox" /> Day 4: Offer post (limited slots/stock)</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Day 5: FAQ post (answer objections)</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Day 6: Offer reminder + proof</label></li>
                <li><label><input data-progress="true" type="checkbox" /> Day 7: Final call + "what happens next"</label></li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb tip:</strong> Your CTA should match your setup. If your CTA is WhatsApp, your WhatsApp replies must be fast and clear.
            CapeWeb can build your follow-up automation in Pillar 7.
          </div>
        </div>
      </div>

      {/* SECTION 6 */}
      <div className="mastery-section">
        <h3>6) DM/WhatsApp scripts that close (without being pushy)</h3>
        <p>
          Most sales are won in the follow-up.
          CapeWeb keeps the script simple, kind, and clear — because the customer wants confidence.
        </p>
        {playbook.languageTip ? <div className="context-tip">{playbook.languageTip}</div> : null}

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>💬 Script Builder (copy/paste messages)</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>What do you sell?</label>
              <select value={sellType} onChange={(e) => setSellType(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }}>
                <option value="hybrid">Both (product + service)</option>
                <option value="product">Product only</option>
                <option value="service">Service only</option>
              </select>

              <label style={{ marginTop: '.75rem', fontWeight: 900, display: 'block' }}>Your main offer name</label>
              <input type="text" placeholder="Example: CapeGlow Candle Set / Workshop Booking" value={offerName} onChange={(e) => setOfferName(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />

              <label style={{ marginTop: '.75rem', fontWeight: 900, display: 'block' }}>Your main result</label>
              <input type="text" placeholder="Example: a calmer home + relaxing vibe" value={offerResult} onChange={(e) => setOfferResult(e.target.value)} style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />

              <label style={{ marginTop: '.75rem' }}>
                <input data-progress="true" type="checkbox" /> I built a DM/WhatsApp script
              </label>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Generated scripts</strong>
              <div style={{ marginTop: '.75rem', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
                {scripts ? (
                  <div style={{ display: 'grid', gap: '.75rem' }}>
                    <div><strong>1) Opener</strong><div style={{ marginTop: '.35rem', color: '#495057' }}>{scripts.opener}</div></div>
                    <div><strong>2) Clarifying question</strong><div style={{ marginTop: '.35rem', color: '#495057' }}>{scripts.clarifier}</div></div>
                    <div><strong>3) Simple pitch</strong><div style={{ marginTop: '.35rem', color: '#495057' }}>{scripts.pitch}</div></div>
                    <div><strong>4) Close (next step)</strong><div style={{ marginTop: '.35rem', color: '#495057' }}>{scripts.close}</div></div>
                    <div><strong>5) Follow-up message</strong><div style={{ marginTop: '.35rem', color: '#495057' }}>{scripts.followUp}</div></div>
                    <div><strong>Optional proof line</strong><div style={{ marginTop: '.35rem', color: '#495057' }}>{scripts.proof}</div></div>
                  </div>
                ) : (
                  <p style={{ margin: 0, color: '#495057' }}>Fill the left side to generate scripts.</p>
                )}
              </div>

              <div style={{ marginTop: '1rem', background: '#e7f1ff', padding: '1rem', borderRadius: '8px', border: '1px solid #cfe2ff' }}>
                <strong>🔧 CapeWeb upgrade:</strong> connect these scripts to automations (auto-replies, reminders, booking flows).
                <a href="/contact" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 900, textDecoration: 'underline' }}> Open CapeWeb →</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7 */}
      <div className="mastery-section">
        <h3>7) Digital marketing basics (paid ads) — only after your offer is ready</h3>
        <p>
          Ads do one thing: they amplify what already works.
          If your offer is unclear, ads amplify confusion.
          CapeWeb makes you "ad-ready" before you spend money.
        </p>

        <div className="comparison-table-wrapper">
          <table className="capeweb-table">
            <thead>
              <tr>
                <th>Stage</th>
                <th>What you do</th>
                <th>Goal</th>
                <th>Tools</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>R0 stage</td>
                <td>Content + DM + WhatsApp + follow-up</td>
                <td>First 10–30 sales</td>
                <td>IG/TikTok + WhatsApp</td>
              </tr>
              <tr>
                <td>Small budget stage</td>
                <td>Boost best post OR run simple conversion campaign</td>
                <td>More consistent leads</td>
                <td><a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer">Meta Business Suite</a></td>
              </tr>
              <tr>
                <td>Scale stage</td>
                <td>Retargeting + creative testing</td>
                <td>Lower cost per sale</td>
                <td>
                  <a href="https://www.facebook.com/business/help/952192354843755" target="_blank" rel="noopener noreferrer">Meta Pixel</a> ·
                  <a href="https://ads.google.com/" target="_blank" rel="noopener noreferrer">Google Ads</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
          <strong>Helpful official links:</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li><a href="https://www.facebook.com/business/learn" target="_blank" rel="noopener noreferrer">Meta Blueprint (learn marketing)</a></li>
            <li><a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer">Meta Business Suite</a></li>
            <li><a href="https://www.facebook.com/business/help/952192354843755" target="_blank" rel="noopener noreferrer">Meta Pixel basics</a></li>
            <li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener noreferrer">Google Skillshop</a></li>
            <li><a href="https://ga-dev-tools.google/campaign-url-builder/" target="_blank" rel="noopener noreferrer">Google Campaign URL Builder (UTMs)</a></li>
          </ul>
          <small style={{ color: '#6c757d' }}>Platforms change often. CapeWeb keeps your setup clean and current.</small>
        </div>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🧠 Mini-Quiz: When should you run paid ads?</h4>
          <div className="quiz-question">
            <p><strong>Question:</strong> You should spend money on ads when…</p>
            <div className="quiz-options">
              <label><input type="radio" name="p6_ads_q" /> You have no clear offer and no proof</label><br />
              <label><input type="radio" name="p6_ads_q" data-progress="true" /> Your offer is clear, you have proof, and you know your CTA loop works</label><br />
              <label><input type="radio" name="p6_ads_q" /> You feel bored</label>
            </div>
            <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
              <summary style={{ color: '#0066cc', fontWeight: 900 }}>Check Answer</summary>
              <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
                <p><strong>Correct:</strong> ads amplify what already works. Build the loop first.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* SECTION 8 */}
      <div className="mastery-section">
        <h3>8) Your marketing scoreboard (measure what makes money)</h3>
        <p>
          Views feel good. Sales feed you.
          CapeWeb uses a scoreboard that keeps you focused on what matters.
        </p>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>📊 Mission 4: Choose your weekly marketing scoreboard (3 numbers)</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>#1 Conversations started (DM/WhatsApp)</label>
              <input type="text" placeholder="Example: 25" style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />

              <label style={{ marginTop: '.75rem', fontWeight: 900, display: 'block' }}>#2 Leads captured (forms/bookings)</label>
              <input type="text" placeholder="Example: 12" style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />
            </div>

            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>#3 Sales (paid orders/bookings)</label>
              <input type="text" placeholder="Example: 7" style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />

              <label style={{ marginTop: '.75rem' }}>
                <input data-progress="true" type="checkbox" /> I chose my 3 scoreboard numbers
              </label>
              <p style={{ margin: '.75rem 0 0', color: '#6c757d' }}>
                CapeWeb rule: if these 3 go up, your business grows — even if followers don't.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb Care Plan:</strong> CapeWeb can set up tracking and reporting so you can see: posts → clicks → leads → sales.
          </div>
        </div>
      </div>
    </>
  );
}

// Quiz component
export function Pillar6Quiz({ quizResponses, onSelect, onScore, scoreMessage }) {
  return (
    <div className="mastery-section">
      <h3>🏁 Boss Battle: Pillar 6 Knowledge Test</h3>
      <p>
        Score <strong>10/13</strong> or higher before moving to Pillar 7.
        (Pillar 7 will automate your follow-up so you stop losing leads.)
      </p>

      <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
        {pillar6QuizQuestions.map((question, index) => (
          <React.Fragment key={question.question}>
            <div className="quiz-question">
              <p>
                <strong>{index + 1})</strong> {question.question}
              </p>
              {question.options.map((option, optionIndex) => (
                <label key={option} className="radio-item">
                  <input
                    type="radio"
                    name={`p6-quiz-${index}`}
                    checked={quizResponses[index] === optionIndex}
                    onChange={() => onSelect(index, optionIndex)}
                  />{' '}
                  {option}
                </label>
              ))}
            </div>
            {index < pillar6QuizQuestions.length - 1 && <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '1rem 0' }} />}
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
            fontWeight: 900,
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

// Completion component
export function Pillar6Completion() {
  return (
    <div className="completion-box" style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed #ced4da' }}>
      <h3>🎉 Pillar 6 Complete</h3>
      <p>
        You now have a simple marketing engine: platform choice, conversion profile, content system, DM scripts, and a weekly scoreboard.
        When you say "continue," CapeWeb will move you to Pillar 7 (AI &amp; Automation) — so you stop losing leads and start scaling.
      </p>
    </div>
  );
}

// SVG Diagram
function AttentionToSaleLoopDiagram() {
  return (
    <svg width="100%" viewBox="0 0 1200 320" role="img" aria-label="Diagram: attention to sale loop">
      <defs>
        <style>
          {`.bx { fill:#fff; stroke:#0b0f1a; stroke-width:2; rx:14; }
            .tx { font: 17px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900; }
            .sm { font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .ar { stroke:#0b0f1a; stroke-width:3; marker-end:url(#arrP6a); }`}
        </style>
        <marker id="arrP6a" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a"></polygon>
        </marker>
      </defs>

      <rect className="bx" x="40" y="90" width="210" height="140"></rect>
      <text className="tx" x="145" y="140" textAnchor="middle">Attention</text>
      <text className="sm" x="145" y="165" textAnchor="middle">Reels / posts</text>
      <text className="sm" x="145" y="188" textAnchor="middle">+ search + shares</text>

      <line className="ar" x1="250" y1="160" x2="340" y2="160"></line>

      <rect className="bx" x="340" y="90" width="210" height="140"></rect>
      <text className="tx" x="445" y="140" textAnchor="middle">Trust</text>
      <text className="sm" x="445" y="165" textAnchor="middle">Proof + clarity</text>
      <text className="sm" x="445" y="188" textAnchor="middle">reviews + examples</text>

      <line className="ar" x1="550" y1="160" x2="640" y2="160"></line>

      <rect className="bx" x="640" y="90" width="210" height="140"></rect>
      <text className="tx" x="745" y="140" textAnchor="middle">Action</text>
      <text className="sm" x="745" y="165" textAnchor="middle">DM / WhatsApp</text>
      <text className="sm" x="745" y="188" textAnchor="middle">book / buy</text>

      <line className="ar" x1="850" y1="160" x2="940" y2="160"></line>

      <rect className="bx" x="940" y="90" width="220" height="140"></rect>
      <text className="tx" x="1050" y="135" textAnchor="middle">Follow-up</text>
      <text className="sm" x="1050" y="160" textAnchor="middle">reminders + offers</text>
      <text className="sm" x="1050" y="183" textAnchor="middle">simple automation</text>

      <text className="sm" x="600" y="270" textAnchor="middle">CapeWeb promise: build the loop once — then run it weekly.</text>
    </svg>
  );
}
