import React, { useRef, useState, useEffect } from 'react';
import '../styles/CapeWebBlueprint.css';

export const pillar5QuizQuestions = [
  {
    question: 'SEO is mainly about:',
    options: ['Tricks and hacks', 'Helping search engines and humans find the best answer', 'Only backlinks'],
    correctIndex: 1,
  },
  {
    question: 'The correct order is:',
    options: ['Discover → Crawl → Index → Rank → Click', 'Rank → Crawl → Index → Discover', 'Click → Discover → Forget'],
    correctIndex: 0,
  },
  {
    question: 'Search intent means:',
    options: ['What the searcher is really trying to do', 'How long the keyword is', 'The logo on your site'],
    correctIndex: 0,
  },
  {
    question: 'A pricing query like "price" usually needs:',
    options: ['A services/pricing page with clarity', 'A random blog post', 'A hidden page'],
    correctIndex: 0,
  },
  {
    question: 'Search Console helps because:',
    options: ['It sells your products automatically', 'It shows indexing + queries + performance', 'It designs your logo'],
    correctIndex: 1,
  },
  {
    question: 'On-page SEO includes:',
    options: ['Title, headings, content structure, internal links', 'Traffic fines', 'VAT registration'],
    correctIndex: 0,
  },
  {
    question: 'A topic cluster is:',
    options: ['One main page + supporting pages linked together', '50 random posts', 'Only social media posts'],
    correctIndex: 0,
  },
  {
    question: 'Local SEO is powered mainly by:',
    options: ['Google Business Profile + reviews + consistency', 'Buying random backlinks', 'A bigger logo'],
    correctIndex: 0,
  },
  {
    question: 'A sitemap helps with:',
    options: ['Making photos larger', 'Discovery of important pages', 'Writing content automatically'],
    correctIndex: 1,
  },
  {
    question: 'Buying "1,000 backlinks" is usually:',
    options: ['A safe strategy', 'Risky and often harmful', 'Required for SEO'],
    correctIndex: 1,
  },
  {
    question: 'CTR is:',
    options: ['Clicks divided by impressions', 'A tax form', 'A payment gateway'],
    correctIndex: 0,
  },
  {
    question: 'The real goal of SEO is:',
    options: ['Ranking only', 'More conversions (leads/sales) from search', 'More plugins'],
    correctIndex: 1,
  },
];

const getPillar5PersonaPlan = (context = {}) => {
  const sector = (context.sector || '').toLowerCase();
  const geography = context.geography || 'South Africa';
  const language = context.language || 'English';
  if (sector.includes('township')) {
    return {
      summary: `Prioritise vernacular SEO + WhatsApp conversions for ${geography}. Translate top pages into isiXhosa/isiZulu and own your Google Business Profile.`,
      quickWins: [
        'Publish isiXhosa/isiZulu FAQs with WhatsApp CTA.',
        'Post weekly on Google Business Profile (specials, testimonials).',
        'List delivery/pickup info (PUDO/PAXI) on every page.',
      ],
    };
  }
  if (/tourism|travel|hospitality/.test(sector)) {
    return {
      summary: `Focus on multi-language landing pages (EN/${language}), schema for tours, and seasonal Google Trends for ${geography}.`,
      quickWins: ['Add hreflang tags + translated CTAs.', 'Publish itineraries with review snippets.', 'Capture multilingual testimonials + embed them.'],
    };
  }
  if (/technology|saas|software/.test(sector)) {
    return {
      summary: 'Invest in product-led SEO: pillar pages, feature comparisons, and local case studies before attempting global keywords.',
      quickWins: ['Ship 1 pillar + 3 supporting articles.', 'Create comparison pages vs incumbents.', 'Add proof blocks with metrics + CTA on each page.'],
    };
  }
  return {
    summary: `Anchor SEO to intent-rich keywords for ${geography} and turn every visit into trust using social proof + policies.`,
    quickWins: [],
  };
};

export default function CapeWebPillar5() {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizResponses, setQuizResponses] = useState({});
  const [scoreMessage, setScoreMessage] = useState('Not checked yet.');
  const [progress, setProgress] = useState({ done: 0, total: 0, pct: 0 });
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetDesc, setSnippetDesc] = useState('');
  const articleRef = useRef(null);
  const navRef = useRef(null);

  const handleQuizResponse = (questionIndex, optionIndex) => {
    setQuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleScore = () => {
    const correct = pillar5QuizQuestions.reduce((sum, question, index) => {
      return sum + (quizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 9
        ? `✅ Pass! You scored ${correct}/12. You're ready for Pillar 6.`
        : `❌ ${correct}/12. Revisit the sections you missed and try again.`;
    setScoreMessage(message);
  };

  const updateProgress = () => {
    const items = document.querySelectorAll('[data-scroll-section-id="pillar5"] input[data-progress="true"]');
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

  return (
    <div data-scroll-section-id="pillar5">
      <div className="blueprint-heading reveal-text">
        <div className="expand-label">CapeWeb University</div>
        <h2 className="expand-title-section" style={{ marginBottom: '1rem' }}>
          Pillar 5: Search Engine Optimization — own organic demand across South Africa.
        </h2>
        <p className="expand-text-lg" style={{ maxWidth: '920px' }}>
          SEO is how your business gets customers from Google without paying for every click.
          CapeWeb's approach is <strong>"SEO that sticks"</strong>: technical foundations + fast pages + content systems — so your traffic compounds.
          This pillar is beginner-friendly, practical, and built for getting to your <strong>first 100 sales</strong> while laying long-term growth foundations.
        </p>

        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#f8f9fa', maxWidth: '980px' }}>
          <strong>What CapeWeb does differently (why you'll win):</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li><strong>Structured &amp; Fast:</strong> clean site structure, Core Web Vitals thinking, fewer "SEO plugins", more real performance.</li>
            <li><strong>Technical SEO &amp; schema:</strong> indexability, sitemaps, canonical tags, structured data (when it matters).</li>
            <li><strong>Content briefs &amp; outlines:</strong> you won't stare at a blank page — you'll follow a system.</li>
            <li><strong>Internal linking &amp; sitemaps:</strong> content that supports each other, not random blog posts.</li>
            <li><strong>Local &amp; international SEO:</strong> Cape Town visibility first, then scale.</li>
          </ul>
          <div style={{ marginTop: '.85rem' }}>
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '.65rem 1rem', borderRadius: '8px', background: '#0b0f1a', color: '#fff', textDecoration: 'none', fontWeight: 900 }}
            >
              Talk to CapeWeb about an SEO Foundations Pack →
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
                  id="capeweb-search-p5"
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
                  <strong>SEO Passport</strong>
                  <span style={{ fontSize: '.9rem', color: '#6c757d' }}>
                    {progress.pct}% complete
                  </span>
                </div>
                <div style={{ marginTop: '.5rem', height: '10px', background: '#e9ecef', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '10px', width: `${progress.pct}%`, background: '#0b0f1a' }}></div>
                </div>
                <p style={{ margin: '.5rem 0 0', fontSize: '.9rem', color: '#6c757d' }}>
                  Tick checkboxes + activities to track mastery.
                </p>
              </div>

              <div style={{ marginTop: '.75rem', padding: '.75rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
                <strong>Quick links (open in new tab)</strong>
                <ul style={{ margin: '.6rem 0 0 1.25rem' }}>
                  <li><a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener noreferrer">Google SEO Starter Guide</a></li>
                  <li><a href="https://search.google.com/search-console/about" target="_blank" rel="noopener noreferrer">Google Search Console</a></li>
                  <li><a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">PageSpeed Insights</a></li>
                  <li><a href="https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" target="_blank" rel="noopener noreferrer">Structured data intro</a></li>
                  <li><a href="https://www.google.com/business/" target="_blank" rel="noopener noreferrer">Google Business Profile (Local)</a></li>
                </ul>
              </div>
            </section>

            <nav className="learn-capeweb-nav" aria-label="CapeWeb Blueprint Navigation" ref={navRef}>
              <div className="pillar-modules">
                <button type="button" className="pillar-module is-active" aria-current="true">
                  <div className="module-pill">Pillar 5</div>
                  <div>
                    <div className="module-title">SEO that Sticks</div>
                    <p>Technical foundations, local SEO, content systems, and measurement that compound.</p>
                  </div>
                </button>
              </div>
            </nav>
          </aside>
        </div>

        <div className="learn-capeweb-article-pane">
          <div className="learn-capeweb-article" ref={articleRef}>
            <Pillar5Content
              snippetTitle={snippetTitle}
              setSnippetTitle={setSnippetTitle}
              snippetDesc={snippetDesc}
              setSnippetDesc={setSnippetDesc}
            />
            <Pillar5Quiz quizResponses={quizResponses} onSelect={handleQuizResponse} onScore={handleScore} scoreMessage={scoreMessage} />
            <Pillar5Completion />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Pillar5Content({ personalizationContext = {}, snippetTitle, setSnippetTitle, snippetDesc, setSnippetDesc }) {
  const personaPlan = getPillar5PersonaPlan(personalizationContext);
  const personaLabel = personalizationContext?.sector || 'Business';

  return (
    <>
      <div className="article-eyebrow">Pillar 5 · Search Engine Optimization</div>
      <h1>SEO that Sticks (CapeWeb Method)</h1>

      <p className="article-summary">
        <strong>Objective:</strong> You'll learn SEO from zero to confident:
        how search engines work, how to choose keywords, how to structure pages, how to do local SEO in Cape Town,
        how to publish content that ranks, and how to measure what leads to sales.
        You'll finish with a practical <strong>SEO Passport</strong> and a "first 100 sales" SEO plan.
      </p>

      {personaPlan.summary ? (
        <div className="context-banner">
          <strong>{personaLabel} focus:</strong> {personaPlan.summary}
        </div>
      ) : null}
      {personaPlan.quickWins?.length ? (
        <div className="context-tip">
          <strong>Quick wins:</strong>
          <ul style={{ margin: '.4rem 0 0 1.25rem' }}>
            {personaPlan.quickWins.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="article-divider"></div>

      {/* Section 1: SEO in plain English */}
      <div className="mastery-section" data-topic="seo basics crawl index rank google how it works">
        <h3>1) SEO in plain English: how Google finds you</h3>
        <p>
          SEO is not magic. It's a system.
          Search engines: <strong>discover</strong> pages, <strong>crawl</strong> them, <strong>index</strong> them, and then <strong>rank</strong> them.
          Your job is to make this easy — and to be the best answer for your customer.
        </p>

        <SEOPipelineDiagram />

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🧭 Mission 1: Create your SEO "home base" accounts</h4>
          <p>These are free and they make your SEO real (not guessing).</p>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li>
              <label><input data-progress="true" type="checkbox" /> Create / access Google Search Console</label>
              — <a href="https://search.google.com/search-console/about" target="_blank" rel="noopener noreferrer">Open Search Console</a>
            </li>
            <li>
              <label><input data-progress="true" type="checkbox" /> Create / access Google Analytics (GA4)</label>
              — <a href="https://support.google.com/analytics/answer/9304153?hl=en" target="_blank" rel="noopener noreferrer">GA4 setup guide</a>
            </li>
            <li>
              <label><input data-progress="true" type="checkbox" /> Run a PageSpeed test on your main page</label>
              — <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">PageSpeed Insights</a>
            </li>
          </ul>

          <div style={{ marginTop: '1rem', background: '#e7f1ff', padding: '1rem', borderRadius: '8px', border: '1px solid #cfe2ff' }}>
            <strong>🔧 CapeWeb shortcut:</strong> CapeWeb can connect Search Console + GA4 + conversion tracking properly (no messy duplication),
            and set up a clean measurement baseline.
          </div>
        </div>
      </div>

      {/* Section 2: Keywords & Search Intent */}
      <div className="mastery-section" data-topic="keywords search intent cape town local sa keyword research">
        <h3>2) Keywords &amp; Search Intent (the "customer mind-reading" skill)</h3>
        <p>
          A keyword is what a person types into Google.
          Search intent is what they <strong>really want</strong>.
          If your page matches intent, you win.
        </p>

        <div style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
          <strong>4 types of intent (simple):</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li><strong>Learn:</strong> "how to…" "what is…"</li>
            <li><strong>Compare:</strong> "best…" "vs…" "price…"</li>
            <li><strong>Buy/Book:</strong> "buy…" "near me" "quote"</li>
            <li><strong>Navigate:</strong> "CapeWeb contact" "brand name + login"</li>
          </ul>
        </div>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🎯 Mission 2: Intent Match Game</h4>
          <p>Pick the best page type for each search.</p>

          <div className="quiz-question">
            <p><strong>1)</strong> "website designer Cape Town price" should lead to:</p>
            <div className="quiz-options">
              <label><input type="radio" name="p5_intent_1" /> A long history page</label><br />
              <label><input type="radio" name="p5_intent_1" /> A blog about "what is a website"</label><br />
              <label><input type="radio" name="p5_intent_1" data-progress="true" /> A services/pricing page (with clear packages)</label>
            </div>
            <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
              <summary style={{ color: '#0066cc', fontWeight: 900 }}>Check Answer</summary>
              <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
                <p><strong>Correct:</strong> services/pricing page. That person wants to compare and decide.</p>
              </div>
            </details>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '1rem 0' }} />

          <div className="quiz-question">
            <p><strong>2)</strong> "how to choose a payment gateway in South Africa" should lead to:</p>
            <div className="quiz-options">
              <label><input type="radio" name="p5_intent_2" data-progress="true" /> A helpful guide article (with next steps)</label><br />
              <label><input type="radio" name="p5_intent_2" /> A checkout page</label><br />
              <label><input type="radio" name="p5_intent_2" /> A blank page</label>
            </div>
            <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
              <summary style={{ color: '#0066cc', fontWeight: 900 }}>Check Answer</summary>
              <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
                <p><strong>Correct:</strong> a guide. That person is learning before buying.</p>
              </div>
            </details>
          </div>

          <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb rule:</strong> don't force "Buy Now" intent onto a "Learn" search. Build the right page for the right moment.
          </div>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
          <strong>Free keyword tools (beginner-friendly):</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li><a href="https://trends.google.com/trends/" target="_blank" rel="noopener noreferrer">Google Trends</a> (see interest over time)</li>
            <li><a href="https://ads.google.com/home/tools/keyword-planner/" target="_blank" rel="noopener noreferrer">Keyword Planner</a> (requires Google Ads account)</li>
            <li><a href="https://support.google.com/websearch/answer/106230?hl=en" target="_blank" rel="noopener noreferrer">Google autocomplete tips</a> (use suggestions as real-language clues)</li>
          </ul>
          <small style={{ color: '#6c757d' }}>CapeWeb can turn your keyword list into a content plan + landing pages that convert.</small>
        </div>
      </div>

      {/* Section 3: On-page SEO */}
      <div className="mastery-section" data-topic="on page seo title tags meta description h1 headings internal links images">
        <h3>3) On-page SEO: make one page the best answer</h3>
        <p>
          On-page SEO is the stuff you control on the page:
          your title, headings, content structure, images, and internal links.
          CapeWeb focuses on clarity first — because clarity converts.
        </p>

        <OnPageAnatomyDiagram />

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🧪 Activity: Snippet Simulator (title + description)</h4>
          <p>Write a title + description that makes a human want to click.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Title (aim for clarity)</label>
              <input
                type="text"
                placeholder="Example: Website Design in Cape Town | Fast, Conversion-Ready Builds"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }}
              />
              <label style={{ marginTop: '.75rem', fontWeight: 900, display: 'block' }}>Meta Description (promise + proof + next step)</label>
              <textarea
                rows="4"
                placeholder="Example: Get a fast website that turns visitors into customers. Transparent packages, quick turnarounds. Book a call today."
                value={snippetDesc}
                onChange={(e) => setSnippetDesc(e.target.value)}
                style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }}
              ></textarea>
              <label style={{ marginTop: '.75rem' }}>
                <input data-progress="true" type="checkbox" /> I wrote a title + description for 1 page
              </label>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Preview</strong>
              <div style={{ marginTop: '.75rem', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
                <div style={{ fontWeight: 900, color: '#1a0dab', fontSize: '1.05rem' }}>
                  {snippetTitle || 'Your Title Appears Here'}
                </div>
                <div style={{ color: '#006621', fontSize: '.9rem' }}>yourdomain.co.za › page</div>
                <div style={{ color: '#545454', marginTop: '.35rem' }}>
                  {snippetDesc || 'Your description appears here.'}
                </div>
              </div>

              <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
                <summary style={{ color: '#0066cc', fontWeight: 900 }}>CapeWeb checklist for a good snippet</summary>
                <div style={{ marginTop: '.5rem', paddingLeft: '1rem', borderLeft: '3px solid #0066cc' }}>
                  <ul style={{ margin: '.5rem 0 0 1.25rem' }}>
                    <li>Clear topic (no clever mystery)</li>
                    <li>Location only when relevant (Cape Town / South Africa)</li>
                    <li>Small proof (fast, reviews, "from" pricing)</li>
                    <li>Next step (book, buy, WhatsApp)</li>
                  </ul>
                </div>
              </details>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb offer:</strong> CapeWeb can rewrite your top pages for conversion-first SEO (clear + fast + structured).
            <a href="/contact" target="_blank" rel="noopener noreferrer" style={{ color: '#1e7e34', fontWeight: 900, textDecoration: 'underline' }}>Open CapeWeb →</a>
          </div>
        </div>
      </div>

      {/* Section 4: Technical SEO */}
      <div className="mastery-section" data-topic="technical seo sitemap robots canonical schema core web vitals structured data">
        <h3>4) Technical SEO (the foundation that makes ranking possible)</h3>
        <p>
          Technical SEO is about making your website easy for search engines to understand:
          clean structure, fast pages, proper indexing, and correct signals (like canonical tags).
          CapeWeb focuses on technical SEO because it prevents invisible problems.
        </p>

        <div className="comparison-table-wrapper">
          <table className="capeweb-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #0b0f1a' }}>
                <th style={{ padding: '.75rem', textAlign: 'left', borderRight: '1px solid #e9ecef' }}>Thing</th>
                <th style={{ padding: '.75rem', textAlign: 'left', borderRight: '1px solid #e9ecef' }}>Why it matters</th>
                <th style={{ padding: '.75rem', textAlign: 'left' }}>Where to learn / test</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Search Console</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Shows indexing, errors, and what queries bring traffic</td>
                <td style={{ padding: '.75rem' }}><a href="https://search.google.com/search-console/about" target="_blank" rel="noopener noreferrer">Search Console</a></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Page speed (Core Web Vitals thinking)</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Speed impacts UX and conversions</td>
                <td style={{ padding: '.75rem' }}><a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">PageSpeed Insights</a></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Sitemaps</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Helps discovery for important pages</td>
                <td style={{ padding: '.75rem' }}><a href="https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview" target="_blank" rel="noopener noreferrer">Sitemaps overview</a></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Robots.txt</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Controls crawling (easy to break SEO if wrong)</td>
                <td style={{ padding: '.75rem' }}><a href="https://developers.google.com/search/docs/crawling-indexing/robots/intro" target="_blank" rel="noopener noreferrer">Robots.txt intro</a></td>
              </tr>
              <tr>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Structured data (schema)</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Helps search engines understand details; can enable rich results</td>
                <td style={{ padding: '.75rem' }}>
                  <a href="https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" target="_blank" rel="noopener noreferrer">Structured data intro</a> ·
                  <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer">Rich Results Test</a> ·
                  <a href="https://schema.org/" target="_blank" rel="noopener noreferrer">Schema.org</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🧰 Mission 3: The CapeWeb Technical SEO Checklist (beginner version)</h4>
          <p>Tick what you can do today. This is "SEO that sticks."</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Indexing foundations</strong>
              <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
                <li><label><input data-progress="true" type="checkbox" /> My site is accessible (not password-blocked)</label></li>
                <li><label><input data-progress="true" type="checkbox" /> I can open my site on mobile with no layout issues</label></li>
                <li><label><input data-progress="true" type="checkbox" /> I submitted a sitemap (or I know where it is)</label></li>
                <li><label><input data-progress="true" type="checkbox" /> I checked Search Console for obvious errors</label></li>
              </ul>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>Performance foundations</strong>
              <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
                <li><label><input data-progress="true" type="checkbox" /> Images are compressed before upload</label></li>
                <li><label><input data-progress="true" type="checkbox" /> I don't load 6 different fonts</label></li>
                <li><label><input data-progress="true" type="checkbox" /> I removed heavy scripts I don't need</label></li>
                <li><label><input data-progress="true" type="checkbox" /> I ran a PageSpeed test and noted my score</label></li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#e7f1ff', padding: '1rem', borderRadius: '8px', border: '1px solid #cfe2ff' }}>
            <strong>🔧 CapeWeb power move:</strong> technical SEO + speed is where most DIY SEO fails.
            CapeWeb fixes the foundations so your content actually has a chance to rank.
          </div>
        </div>
      </div>

      {/* Section 5: Local SEO */}
      <div className="mastery-section" data-topic="local seo google business profile cape town reviews map pack nap citations">
        <h3>5) Local SEO (Cape Town): show up when people search "near me"</h3>
        <p>
          Local SEO is the fastest path to high-intent customers — because they already want a solution nearby.
          The core asset is your <strong>Google Business Profile</strong> (GBP).
        </p>

        <LocalSEODiagram />

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>📍 Mission 4: Set up or improve your Google Business Profile</h4>
          <p>This is a "registration" step that can produce leads faster than blogging.</p>

          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li>
              <label><input data-progress="true" type="checkbox" /> Create or claim your Google Business Profile</label>
              — <a href="https://www.google.com/business/" target="_blank" rel="noopener noreferrer">Open Google Business Profile</a>
            </li>
            <li><label><input data-progress="true" type="checkbox" /> Add correct category + services</label></li>
            <li><label><input data-progress="true" type="checkbox" /> Add photos (real ones beat stock)</label></li>
            <li><label><input data-progress="true" type="checkbox" /> Create a simple review request message</label></li>
          </ul>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
            <strong>Copy/paste review request message:</strong>
            <textarea
              rows="4"
              style={{ marginTop: '.5rem', width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }}
              placeholder="Hi! Thanks for choosing us. If you were happy with the service/product, could you leave a quick Google review? It helps a small Cape Town business grow. Thank you!"
            ></textarea>
          </div>

          <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb upgrade:</strong> CapeWeb can optimize your GBP, build local landing pages, and connect local leads to automations (WhatsApp + email follow-up).
          </div>
        </div>
      </div>

      {/* Section 6: Content systems */}
      <div className="mastery-section" data-topic="content strategy topic clusters internal linking seo briefs outlines content calendar">
        <h3>6) Content systems: build "topic clusters" that compound</h3>
        <p>
          Random blog posts don't compound. Systems do.
          A topic cluster is one main page (the big topic) + supporting pages (the smaller questions),
          all linked together. This helps Google and humans understand what you do.
        </p>

        <TopicClusterDiagram />

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🗓️ Mission 5: Build your first topic cluster (template)</h4>
          <p>Write 1 pillar page + 3 supporting pages. Keep it beginner-simple.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: 900, display: 'block', marginBottom: '.5rem' }}>Pillar page topic</label>
              <input type="text" placeholder="Example: [Your service/product] in Cape Town" style={{ width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />
              <label style={{ marginTop: '.75rem', fontWeight: 900, display: 'block' }}>Support page #1 (How to)</label>
              <input type="text" placeholder="Example: How to choose a [thing] in South Africa" style={{ width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />
            </div>

            <div>
              <label style={{ fontWeight: 900, display: 'block', marginBottom: '.5rem' }}>Support page #2 (Pricing / packages)</label>
              <input type="text" placeholder="Example: [Service] pricing: what affects cost" style={{ width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />
              <label style={{ marginTop: '.75rem', fontWeight: 900, display: 'block' }}>Support page #3 (Mistakes)</label>
              <input type="text" placeholder="Example: Common mistakes when buying [thing]" style={{ width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontWeight: 900, display: 'block', marginBottom: '.5rem' }}>Your CTA (one next step)</label>
              <input type="text" placeholder="Example: WhatsApp for a quote / Book a call / Buy now" style={{ width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />
              <label style={{ marginTop: '.75rem' }}>
                <input data-progress="true" type="checkbox" /> I drafted my topic cluster (1 + 3 pages)
              </label>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb deliverable:</strong> CapeWeb can produce content briefs + outlines for your cluster so you publish faster (and better).
          </div>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
          <strong>Helpful reading:</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li><a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noopener noreferrer">Create helpful, reliable, people-first content</a></li>
            <li><a href="https://developers.google.com/search/docs/fundamentals/what-is-seo" target="_blank" rel="noopener noreferrer">What is SEO (Google)</a></li>
          </ul>
        </div>
      </div>

      {/* Section 7: Links & authority */}
      <div className="mastery-section" data-topic="backlinks authority link building digital pr spam safe links partnerships">
        <h3>7) Links &amp; authority (safe growth, not spam)</h3>
        <p>
          Links are like reputation signals. But buying spammy links can destroy trust.
          CapeWeb uses "safe authority" methods: partnerships, real mentions, and useful resources.
        </p>

        <div className="workbook-section" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeeba', padding: '1.25rem', borderRadius: '10px', margin: '1.25rem 0', color: '#856404' }}>
          <h4 style={{ marginTop: 0 }}>⚠️ SEO Safety Rule</h4>
          <p style={{ margin: 0 }}>
            Don't buy "1,000 backlinks for R199". That's how people get burned.
            Build authority like a real business: real relationships + real value.
          </p>
        </div>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🤝 Mission 6: The "5 real links" plan (beginner version)</h4>
          <p>Pick 5 sources that could realistically mention your business.</p>
          <ol style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li><label><input data-progress="true" type="checkbox" /> 1 local community / directory relevant to your customers</label></li>
            <li><label><input data-progress="true" type="checkbox" /> 1 partnership (supplier, collaborator, venue, school, coach)</label></li>
            <li><label><input data-progress="true" type="checkbox" /> 1 client testimonial page (they link back)</label></li>
            <li><label><input data-progress="true" type="checkbox" /> 1 guest contribution (real, helpful)</label></li>
            <li><label><input data-progress="true" type="checkbox" /> 1 "resource" page you create (so people reference it)</label></li>
          </ol>

          <div style={{ marginTop: '1rem', background: '#e7f1ff', padding: '1rem', borderRadius: '8px', border: '1px solid #cfe2ff' }}>
            <strong>🔧 CapeWeb upgrade:</strong> CapeWeb can help you build linkable assets (tools, guides, calculators, templates) that earn links naturally.
          </div>
        </div>
      </div>

      {/* Section 8: Measurement */}
      <div className="mastery-section" data-topic="measurement seo reporting clicks impressions ctr conversions ga4 search console dashboard">
        <h3>8) Measurement: stop guessing, start improving</h3>
        <p>
          SEO becomes fun when you can see what's working.
          In Search Console you'll see <strong>queries</strong> (what people searched),
          <strong>clicks</strong> (who came),
          and <strong>impressions</strong> (how often you appeared).
          In Analytics you'll see actions (leads, purchases, WhatsApp clicks).
        </p>

        <div className="comparison-table-wrapper">
          <table className="capeweb-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #0b0f1a' }}>
                <th style={{ padding: '.75rem', textAlign: 'left', borderRight: '1px solid #e9ecef' }}>Metric</th>
                <th style={{ padding: '.75rem', textAlign: 'left', borderRight: '1px solid #e9ecef' }}>What it means</th>
                <th style={{ padding: '.75rem', textAlign: 'left' }}>What you do with it</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Impressions</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>How often you appeared in search</td>
                <td style={{ padding: '.75rem' }}>Growing? Good. Stuck? Improve relevance + content.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Clicks</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>How many people visited from search</td>
                <td style={{ padding: '.75rem' }}>Low? Improve snippet + ranking + intent match.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>CTR</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Click-through rate (clicks ÷ impressions)</td>
                <td style={{ padding: '.75rem' }}>Low? Rewrite title/description and strengthen trust.</td>
              </tr>
              <tr>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Conversions</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Leads/sales (WhatsApp clicks, forms, purchases)</td>
                <td style={{ padding: '.75rem' }}>This is the real score. SEO exists to convert.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>📊 Mission 7: Set your "SEO Scoreboard"</h4>
          <p>Pick 3 numbers you will check weekly (simple).</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Weekly #1</label>
              <input type="text" placeholder="Example: Search clicks" style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />
              <label style={{ marginTop: '.75rem', fontWeight: 900, display: 'block' }}>Weekly #2</label>
              <input type="text" placeholder="Example: WhatsApp CTA clicks" style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />
            </div>

            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontWeight: 900, display: 'block' }}>Weekly #3</label>
              <input type="text" placeholder="Example: Form submissions / purchases" style={{ width: '100%', marginTop: '.5rem', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />
              <label style={{ marginTop: '.75rem' }}>
                <input data-progress="true" type="checkbox" /> I chose my 3 SEO scoreboard metrics
              </label>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb Care Plan:</strong> Once your SEO is live, CapeWeb can run monthly iterations:
            audit → improve → report → repeat.
          </div>
        </div>
      </div>
    </>
  );
}

export function Pillar5Quiz({ quizResponses, onSelect, onScore, scoreMessage }) {
  return (
    <div className="mastery-section">
      <h3>🏁 Boss Battle: Pillar 5 Knowledge Test</h3>
      <p>
        Score <strong>9/12</strong> or higher before moving to Pillar 6.
        CapeWeb wants you confident — not guessing.
      </p>
      <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px' }}>
        {pillar5QuizQuestions.map((question, index) => (
          <React.Fragment key={index}>
            <div className="quiz-question">
              <p>
                <strong>{index + 1})</strong> {question.question}
              </p>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={`quiz-p5-${index}`}
                    checked={quizResponses[index] === optionIndex}
                    onChange={() => onSelect(index, optionIndex)}
                  />{' '}
                  {option}
                </label>
              ))}
            </div>
            {index < pillar5QuizQuestions.length - 1 && <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '1rem 0' }} />}
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

export function Pillar5Completion() {
  return (
    <div className="completion-box" style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed #ced4da' }}>
      <h3>🎉 Pillar 5 Complete</h3>
      <p>
        You can now build SEO the CapeWeb way: technical foundations, local SEO, content systems, safe authority, and real measurement.
        When you say "continue to Pillar 6," CapeWeb will teach Social Media &amp; Digital Marketing — turning content into daily attention and sales.
      </p>
    </div>
  );
}

// SVG Diagrams
function SEOPipelineDiagram() {
  return (
    <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
      <svg width="100%" viewBox="0 0 1200 260" role="img" aria-label="Diagram: SEO pipeline discovery to click to sale">
        <defs>
          <style>{`
            .bx { fill:#fff; stroke:#0b0f1a; stroke-width:2; rx:14; }
            .tx { font: 17px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900; }
            .sm { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .ar { stroke:#0b0f1a; stroke-width:3; marker-end:url(#arrP5a); }
          `}</style>
          <marker id="arrP5a" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a"></polygon>
          </marker>
        </defs>

        <rect className="bx" x="20" y="70" width="180" height="120"></rect>
        <text className="tx" x="110" y="118" textAnchor="middle">Discover</text>
        <text className="sm" x="110" y="145" textAnchor="middle">Links &amp; sitemaps</text>

        <line className="ar" x1="200" y1="130" x2="260" y2="130"></line>

        <rect className="bx" x="260" y="70" width="180" height="120"></rect>
        <text className="tx" x="350" y="118" textAnchor="middle">Crawl</text>
        <text className="sm" x="350" y="145" textAnchor="middle">Reads your pages</text>

        <line className="ar" x1="440" y1="130" x2="500" y2="130"></line>

        <rect className="bx" x="500" y="70" width="180" height="120"></rect>
        <text className="tx" x="590" y="118" textAnchor="middle">Index</text>
        <text className="sm" x="590" y="145" textAnchor="middle">Stores &amp; understands</text>

        <line className="ar" x1="680" y1="130" x2="740" y2="130"></line>

        <rect className="bx" x="740" y="70" width="180" height="120"></rect>
        <text className="tx" x="830" y="118" textAnchor="middle">Rank</text>
        <text className="sm" x="830" y="145" textAnchor="middle">Chooses best answer</text>

        <line className="ar" x1="920" y1="130" x2="980" y2="130"></line>

        <rect className="bx" x="980" y="70" width="200" height="120"></rect>
        <text className="tx" x="1080" y="110" textAnchor="middle">Click</text>
        <text className="sm" x="1080" y="135" textAnchor="middle">Your site gets a chance</text>
        <text className="sm" x="1080" y="160" textAnchor="middle">to make a sale</text>
      </svg>
      <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
        CapeWeb focuses on the whole chain: not just rankings — sales.
      </figcaption>
    </figure>
  );
}

function OnPageAnatomyDiagram() {
  return (
    <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
      <svg width="100%" viewBox="0 0 1200 420" role="img" aria-label="Diagram: Anatomy of a well-optimized page">
        <defs>
          <style>{`
            .blk { fill:#fff; stroke:#0b0f1a; stroke-width:2; rx:14; }
            .tx { font: 18px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900; }
            .sm { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
          `}</style>
        </defs>

        <rect className="blk" x="80" y="40" width="1040" height="70"></rect>
        <text className="tx" x="120" y="85">Title Tag</text>
        <text className="sm" x="320" y="85">Clear topic + location + value (if relevant)</text>

        <rect className="blk" x="80" y="130" width="1040" height="70"></rect>
        <text className="tx" x="120" y="175">H1 Heading</text>
        <text className="sm" x="320" y="175">Matches what the user searched for</text>

        <rect className="blk" x="80" y="220" width="1040" height="70"></rect>
        <text className="tx" x="120" y="265">Body Content</text>
        <text className="sm" x="340" y="265">Simple sections, examples, answers to objections</text>

        <rect className="blk" x="80" y="310" width="1040" height="70"></rect>
        <text className="tx" x="120" y="355">Internal Links</text>
        <text className="sm" x="340" y="355">Guide users (and Google) to your important pages</text>

        <text className="sm" x="80" y="400">CapeWeb tip: The best SEO page also has a clean CTA ("Book", "Buy", "WhatsApp").</text>
      </svg>
      <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
        On-page SEO is where "rank" and "convert" meet.
      </figcaption>
    </figure>
  );
}

function LocalSEODiagram() {
  return (
    <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
      <svg width="100%" viewBox="0 0 1200 340" role="img" aria-label="Diagram: Local SEO signals that influence local visibility">
        <defs>
          <style>{`
            .bx { fill:#fff; stroke:#0b0f1a; stroke-width:2; rx:14; }
            .tx { font: 18px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900; }
            .sm { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .ar { stroke:#0b0f1a; stroke-width:3; marker-end:url(#arrP5b); }
          `}</style>
          <marker id="arrP5b" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a"></polygon>
          </marker>
        </defs>

        <rect className="bx" x="450" y="30" width="300" height="90"></rect>
        <text className="tx" x="600" y="70" textAnchor="middle">Local Visibility</text>
        <text className="sm" x="600" y="95" textAnchor="middle">(Map pack + local results)</text>

        <line className="ar" x1="600" y1="120" x2="600" y2="170"></line>

        <rect className="bx" x="60" y="170" width="320" height="140"></rect>
        <text className="tx" x="220" y="215" textAnchor="middle">Google Business Profile</text>
        <text className="sm" x="220" y="240" textAnchor="middle">categories, services, photos</text>
        <text className="sm" x="220" y="265" textAnchor="middle">hours, location, posts</text>

        <rect className="bx" x="440" y="170" width="320" height="140"></rect>
        <text className="tx" x="600" y="215" textAnchor="middle">Reviews</text>
        <text className="sm" x="600" y="240" textAnchor="middle">quantity + quality</text>
        <text className="sm" x="600" y="265" textAnchor="middle">freshness</text>

        <rect className="bx" x="820" y="170" width="320" height="140"></rect>
        <text className="tx" x="980" y="215" textAnchor="middle">Consistency</text>
        <text className="sm" x="980" y="240" textAnchor="middle">Name, Address, Phone</text>
        <text className="sm" x="980" y="265" textAnchor="middle">(same everywhere)</text>
      </svg>
      <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
        Local SEO is about trust and consistency. CapeWeb helps you set it up cleanly.
      </figcaption>
    </figure>
  );
}

function TopicClusterDiagram() {
  return (
    <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
      <svg width="100%" viewBox="0 0 1200 420" role="img" aria-label="Diagram: Topic cluster with pillar page and supporting articles">
        <defs>
          <style>{`
            .bx { fill:#fff; stroke:#0b0f1a; stroke-width:2; rx:16; }
            .tx { font: 17px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:900; }
            .sm { font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .ln { stroke:#0b0f1a; stroke-width:2.5; }
          `}</style>
        </defs>

        <rect className="bx" x="430" y="40" width="340" height="110"></rect>
        <text className="tx" x="600" y="85" textAnchor="middle">Pillar Page</text>
        <text className="sm" x="600" y="112" textAnchor="middle">"Main topic: what you offer"</text>

        <rect className="bx" x="120" y="250" width="260" height="110"></rect>
        <text className="tx" x="250" y="295" textAnchor="middle">Support Page 1</text>
        <text className="sm" x="250" y="322" textAnchor="middle">"How to…" question</text>

        <rect className="bx" x="470" y="250" width="260" height="110"></rect>
        <text className="tx" x="600" y="295" textAnchor="middle">Support Page 2</text>
        <text className="sm" x="600" y="322" textAnchor="middle">"Price / package"</text>

        <rect className="bx" x="820" y="250" width="260" height="110"></rect>
        <text className="tx" x="950" y="295" textAnchor="middle">Support Page 3</text>
        <text className="sm" x="950" y="322" textAnchor="middle">"Mistakes to avoid"</text>

        <line className="ln" x1="520" y1="150" x2="310" y2="250"></line>
        <line className="ln" x1="600" y1="150" x2="600" y2="250"></line>
        <line className="ln" x1="680" y1="150" x2="890" y2="250"></line>

        <text className="sm" x="600" y="400" textAnchor="middle">CapeWeb tip: Internal links are the glue that makes this work.</text>
      </svg>
      <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
        One topic cluster can outperform 20 random posts.
      </figcaption>
    </figure>
  );
}
