import React, { useRef, useState, useEffect } from 'react';
import '../styles/CapeWebBlueprint.css';

export const pillar3QuizQuestions = [
  {
    question: 'The goal of a "digital HQ" is:',
    options: ['To look fancy', 'To convert attention into action (leads/sales)', 'To have 100 pages'],
    correctIndex: 1,
  },
  {
    question: 'For first 100 sales, the best beginner move is usually:',
    options: ['A clear 1-page offer + one primary CTA', 'A complex site with hidden pricing', 'No website and no system'],
    correctIndex: 0,
  },
  {
    question: 'PageSpeed Insights is used to:',
    options: ['Test page performance and get improvement suggestions', 'Design a logo', 'Pay taxes'],
    correctIndex: 0,
  },
  {
    question: 'Lighthouse can audit:',
    options: ['Only performance', 'Performance, accessibility, SEO, and more', 'Only WhatsApp'],
    correctIndex: 1,
  },
  {
    question: 'A CDN helps because:',
    options: ['It can serve cached content closer to users for faster loads', 'It makes your logo bigger', 'It replaces your business name'],
    correctIndex: 0,
  },
  {
    question: 'Your landing page should usually have:',
    options: ['One primary CTA that\'s easy to find', '6 different CTAs competing', 'No CTA'],
    correctIndex: 0,
  },
  {
    question: 'WhatsApp Business helps because:',
    options: ['It hides your offers', 'It helps you respond fast and manage customer chats', 'It replaces a website completely forever'],
    correctIndex: 1,
  },
  {
    question: 'Google Analytics 4 is used to:',
    options: ['Track user actions and measure what works', 'Write your refund policy', 'Register your company'],
    correctIndex: 0,
  },
  {
    question: 'Netlify Forms can help because:',
    options: ['It can capture form submissions without extra backend code', 'It increases your tax', 'It blocks customers'],
    correctIndex: 0,
  },
  {
    question: 'The best launch mindset is:',
    options: ['Launch once and never improve', 'Launch with a checklist, then iterate based on data', 'Wait forever until it\'s perfect'],
    correctIndex: 1,
  },
];

export default function CapeWebPillar3() {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizResponses, setQuizResponses] = useState({});
  const [scoreMessage, setScoreMessage] = useState('Not checked yet.');
  const [progress, setProgress] = useState({ done: 0, total: 0, pct: 0 });
  const [buildMode, setBuildMode] = useState('');
  const articleRef = useRef(null);
  const navRef = useRef(null);

  const handleQuizResponse = (questionIndex, optionIndex) => {
    setQuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleScore = () => {
    const correct = pillar3QuizQuestions.reduce((sum, question, index) => {
      return sum + (quizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 4.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setScoreMessage(message);
  };

  const updateProgress = () => {
    const items = document.querySelectorAll('[data-scroll-section-id="pillar3"] input[data-progress="true"]');
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
              <li>Use a simple form to capture orders/leads</li>
              <li>Track conversions later with GA4 once stable</li>
            </ul>
            <p style={{ margin: '.75rem 0 0', color: '#495057' }}>
              CapeWeb can upgrade this into a lightning-fast conversion page when sales start coming in.
            </p>
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
              <li>Run performance audits and fix biggest bottlenecks</li>
            </ul>
            <p style={{ margin: '.75rem 0 0', color: '#495057' }}>
              Best for services + hybrid businesses that want speed and clarity.
            </p>
          </>
        );
      case 'shopify':
        return (
          <>
            <strong>Shopify Mode Plan:</strong>
            <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>Build product pages + collections + checkout</li>
              <li>Keep theme lean and performance-aware</li>
              <li>Use Shopify's performance guidance and run Lighthouse tests</li>
              <li>Integrate tracking + email/WhatsApp follow-ups</li>
            </ul>
            <p style={{ margin: '.75rem 0 0', color: '#495057' }}>
              Best when products are your main revenue and you need checkout + inventory.
            </p>
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

  return (
    <div data-scroll-section-id="pillar3">
      <div className="blueprint-heading reveal-text">
        <div className="expand-label">CapeWeb University</div>
        <h2 className="expand-title-section" style={{ marginBottom: '1rem' }}>
          Pillar 3: Web Development &amp; Architecture — build a fast digital HQ that turns visitors into customers.
        </h2>
        <p className="expand-text-lg" style={{ maxWidth: '860px' }}>
          Your business can't sleep. A customer can land on your page at <strong>2 AM</strong> and decide in seconds.
          In this pillar, CapeWeb teaches you (step-by-step) how to build a simple, fast, trustworthy website system
          that helps you get your <strong>first 100 sales</strong> — starting from beginner level.
        </p>

        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#f8f9fa', maxWidth: '980px' }}>
          <strong>How CapeWeb helps you win in Pillar 3:</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li><strong>Performance First:</strong> speed tuned for Core Web Vitals and Lighthouse.</li>
            <li><strong>SEO that Sticks:</strong> clean structure, sitemaps, and technical foundations that compound.</li>
            <li><strong>Automation Built-In:</strong> forms → CRM/Sheets → WhatsApp/email follow-ups.</li>
            <li><strong>Content that Converts:</strong> messaging and pages that remove confusion and drive action.</li>
            <li><strong>Care Plans that Care:</strong> ship → learn → improve monthly.</li>
          </ul>
          <div style={{ marginTop: '.85rem' }}>
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '.65rem 1rem', borderRadius: '8px', background: '#0b0f1a', color: '#fff', textDecoration: 'none', fontWeight: 700 }}
            >
              Talk to CapeWeb about a Fast Website Launch Pack →
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
                  id="capeweb-search-p3"
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
                  <strong>Build Passport</strong>
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
              <div className="pillar-modules">
                <button type="button" className="pillar-module is-active" aria-current="true">
                  <div className="module-pill">Pillar 3</div>
                  <div>
                    <div className="module-title">The Digital HQ Blueprint</div>
                    <p>Choose a build path, map pages, and set a "first 100 sales" conversion system.</p>
                  </div>
                </button>
              </div>
            </nav>
          </aside>
        </div>

        <div className="learn-capeweb-article-pane">
          <div className="learn-capeweb-article" ref={articleRef}>
            <Pillar3Content buildMode={buildMode} setBuildMode={setBuildMode} getBuildModePlan={getBuildModePlan} />
            <Pillar3Quiz quizResponses={quizResponses} onSelect={handleQuizResponse} onScore={handleScore} scoreMessage={scoreMessage} />
            <Pillar3Completion />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Pillar3Content({ buildMode, setBuildMode, getBuildModePlan }) {
  return (
    <>
      <div className="article-eyebrow">Pillar 3 · Web Development &amp; Architecture</div>
      <h1>The Digital HQ That Converts</h1>

      <p className="article-summary">
        <strong>Objective:</strong> You will create a simple, fast website system that can earn money without you being online 24/7.
        You'll learn structure (pages + content), build choices (R0-friendly options), performance (Core Web Vitals),
        lead capture (forms + WhatsApp), and launch testing. By the end, you'll be ready to build or commission your site with confidence.
      </p>

      <div className="article-divider"></div>

      {/* Section 1: The Story */}
      <div className="mastery-section" data-topic="digital hq website conversion first 100 sales cape town">
        <h3>1) The moment your website starts working for you</h3>
        <p>
          Imagine this: it's Friday night in Cape Town. Someone sees your Instagram post, taps your link, and lands on your site.
          In <strong>5 seconds</strong> they decide: "This looks trustworthy" or "Nope."
        </p>
        <p>
          CapeWeb's goal is simple: build your digital HQ so the customer instantly understands <strong>what you offer</strong>,
          <strong>why it matters</strong>, and <strong>what to do next</strong>.
        </p>

        <DigitalHQDiagram />

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🧭 Mission 1: Pick your "Build Mode" (start where you are)</h4>
          <p>
            CapeWeb gives you 3 beginner-friendly paths. Choose one. You can upgrade later — the mission is to get to sales.
          </p>

          <div className="quiz-options">
            <label className="radio-item">
              <input data-progress="true" type="radio" name="p3_build_mode" value="r0" checked={buildMode === 'r0'} onChange={(e) => setBuildMode(e.target.value)} />
              <strong>R0 Mode:</strong> simple landing page + WhatsApp + payment link
            </label>
            <br />
            <label className="radio-item">
              <input data-progress="true" type="radio" name="p3_build_mode" value="starter" checked={buildMode === 'starter'} onChange={(e) => setBuildMode(e.target.value)} />
              <strong>Starter Mode:</strong> low-cost website build (clean + fast) with basic automation
            </label>
            <br />
            <label className="radio-item">
              <input data-progress="true" type="radio" name="p3_build_mode" value="shopify" checked={buildMode === 'shopify'} onChange={(e) => setBuildMode(e.target.value)} />
              <strong>Shopify Mode:</strong> ecommerce-ready system (when products become your main thing)
            </label>
          </div>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
            {getBuildModePlan(buildMode)}
          </div>
        </div>
      </div>

      {/* Section 2: Page Map */}
      <div className="mastery-section" data-topic="sitemap page structure navigation website architecture">
        <h3>2) The Page Map — What to build (and what NOT to build)</h3>
        <p>
          Beginners often build <strong>50 pages</strong> when they need <strong>5</strong>. CapeWeb fixes this.
          Here's the minimum structure for your first 100 sales:
        </p>

        <PageMapDiagram />

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🧭 Mission 2: Map your first 5 pages</h4>
          <p>Most small businesses need just 5 core pages. Add more later when you have data.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginTop: '1rem' }}>
            {[
              { title: 'Home (your pitch in 5 seconds)', desc: "What you offer + who it's for + one primary CTA" },
              { title: 'Offer / Services (the "what I get" page)', desc: 'Clear packages, prices, what\'s included, how to start' },
              { title: 'About / Why Trust Me', desc: 'Your story, proof, credentials, testimonials' },
              { title: 'FAQ (kill the doubt)', desc: 'Answer the top 10 questions before they ask' },
              { title: 'Contact / Book / Buy', desc: 'WhatsApp, form, calendar link, payment link' },
            ].map((item, index) => (
              <div key={index} style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem' }}>
                  <input data-progress="true" type="checkbox" style={{ marginTop: '.25rem' }} />
                  <div>
                    <strong>{item.title}</strong>
                    <p style={{ margin: '.25rem 0 0', color: '#6c757d', fontSize: '.9rem' }}>{item.desc}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', background: '#fff3cd', padding: '1rem', borderRadius: '8px', color: '#856404', border: '1px solid #ffeeba' }}>
            <strong>⚠️ Beginner mistake:</strong> building 20 pages before the first sale. <strong>CapeWeb fix:</strong> 5 pages + fast launch + improve with data.
          </div>
        </div>
      </div>

      {/* Section 3: Build Options */}
      <div className="mastery-section" data-topic="platform build technology stack react netlify shopify">
        <h3>3) Build Options — Which platform is right for you?</h3>
        <p>
          The best beginner move is this: <strong>choose based on your revenue model</strong>, not on what's "cool".
        </p>

        <div className="comparison-table-wrapper">
          <table className="capeweb-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #0b0f1a' }}>
                <th style={{ padding: '.75rem', textAlign: 'left', borderRight: '1px solid #e9ecef' }}>Platform</th>
                <th style={{ padding: '.75rem', textAlign: 'left', borderRight: '1px solid #e9ecef' }}>Best for</th>
                <th style={{ padding: '.75rem', textAlign: 'left', borderRight: '1px solid #e9ecef' }}>Cost</th>
                <th style={{ padding: '.75rem', textAlign: 'left' }}>CapeWeb uses this when</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}><strong>Google Sites / Carrd</strong></td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>R0 mode — simple landing page</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Free / R80/mo</td>
                <td style={{ padding: '.75rem' }}>Testing an idea before spending</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}><strong>React + Netlify</strong></td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Fast, custom sites (services/consulting)</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Free tier → ~R200/mo</td>
                <td style={{ padding: '.75rem' }}>Building high-performance conversion sites</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}><strong>Shopify</strong></td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Products + checkout + inventory</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>~R500/mo</td>
                <td style={{ padding: '.75rem' }}>Products become the main revenue</td>
              </tr>
              <tr>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}><strong>WordPress</strong></td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Flexible but needs maintenance</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>R100–R400/mo</td>
                <td style={{ padding: '.75rem' }}>Client wants full content control</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ padding: '1rem', borderLeft: '4px solid #0b0f1a', background: '#f8f9fa', borderRadius: '8px', margin: '1rem 0' }}>
          <strong>CapeWeb principle:</strong> Your platform should get faster as you grow, not slower. We optimize for speed + conversion.
        </div>
      </div>

      {/* Section 4: Performance */}
      <div className="mastery-section" data-topic="performance speed lighthouse core web vitals pagespeed insights">
        <h3>4) Performance — Why speed is your secret weapon</h3>
        <p>
          A slow site loses customers before they even see your offer. Google penalizes slow sites. CapeWeb builds for speed.
        </p>

        <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1.5rem', margin: '1rem 0' }}>
          <h4>The 3 Speed Tools CapeWeb Uses (All Free)</h4>
          <ul style={{ margin: '.75rem 0 0 1.25rem', lineHeight: '1.8' }}>
            <li>
              <strong>PageSpeed Insights:</strong> <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">pagespeed.web.dev</a> — Test your site and get specific fixes.
            </li>
            <li>
              <strong>Lighthouse (in Chrome DevTools):</strong> Audit performance, accessibility, SEO, best practices.
            </li>
            <li>
              <strong>GTmetrix:</strong> <a href="https://gtmetrix.com/" target="_blank" rel="noopener noreferrer">gtmetrix.com</a> — Compare your site to competitors.
            </li>
          </ul>
        </div>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🎯 Mission 3: Run your first speed test</h4>
          <p>Go to <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">PageSpeed Insights</a> and test a competitor site (or your own if you have one).</p>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <input data-progress="true" type="checkbox" />
              I ran a PageSpeed test and reviewed the suggestions
            </label>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#e6f4ea', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb standard:</strong> We aim for 90+ on mobile performance. Fast sites convert better.
          </div>
        </div>

        <h4 style={{ marginTop: '1.5rem' }}>Core Web Vitals (Google's Speed Checklist)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', margin: '1rem 0' }}>
          {[
            { title: 'LCP', desc: 'Largest Contentful Paint', target: '< 2.5s', meaning: 'Main content loads fast' },
            { title: 'FID', desc: 'First Input Delay', target: '< 100ms', meaning: 'Page responds to clicks quickly' },
            { title: 'CLS', desc: 'Cumulative Layout Shift', target: '< 0.1', meaning: "Page doesn't jump around while loading" },
          ].map((item) => (
            <div key={item.title} style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong style={{ fontSize: '1.1rem' }}>{item.title}</strong>
              <p style={{ margin: '.25rem 0', fontSize: '.9rem', color: '#6c757d' }}>{item.desc}</p>
              <p style={{ margin: '.5rem 0', fontWeight: 700, color: '#0b0f1a' }}>Target: {item.target}</p>
              <p style={{ margin: '.25rem 0 0', fontSize: '.85rem', color: '#495057' }}>{item.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Leads, Payments, Tracking */}
      <div className="mastery-section" data-topic="leads forms whatsapp payments tracking analytics ga4">
        <h3>5) Leads, Payments & Tracking — Turn visitors into money</h3>
        <p>
          A beautiful website with no conversion system is just a digital brochure. CapeWeb builds systems that capture leads and track results.
        </p>

        <h4>Lead Capture (Simple Options for Beginners)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
          {[
            { title: 'WhatsApp Business Button', desc: 'Fastest conversion path. Customer taps → chat opens → you respond.', link: 'https://business.whatsapp.com/' },
            { title: 'Netlify Forms', desc: 'Simple contact forms with zero backend code. Free tier available.', link: 'https://www.netlify.com/products/forms/' },
            { title: 'Google Forms', desc: 'Free, easy, integrates with Sheets. Good for R0 mode.', link: 'https://www.google.com/forms/about/' },
            { title: 'Calendly / Cal.com', desc: 'Booking links for consultations. Automates scheduling.', link: 'https://calendly.com/' },
          ].map((item) => (
            <div key={item.title} style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              <strong>{item.title}</strong>
              <p style={{ margin: '.5rem 0', color: '#495057', fontSize: '.9rem' }}>{item.desc}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.85rem', color: '#0066cc' }}>Learn more →</a>
            </div>
          ))}
        </div>

        <h4 style={{ marginTop: '1.5rem' }}>Payments (Get Paid Without a Full Ecommerce System)</h4>
        <ul style={{ margin: '.75rem 0 0 1.25rem', lineHeight: '1.8' }}>
          <li><strong>Yoco Payment Links:</strong> Simple, fast, South African. No monthly fees. <a href="https://www.yoco.com/" target="_blank" rel="noopener noreferrer">yoco.com</a></li>
          <li><strong>PayFast:</strong> Payment gateway for ZA businesses. <a href="https://www.payfast.co.za/" target="_blank" rel="noopener noreferrer">payfast.co.za</a></li>
          <li><strong>Stripe (if you export/work internationally):</strong> <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer">stripe.com</a></li>
          <li><strong>Shopify Checkout:</strong> Built-in if you're on Shopify.</li>
        </ul>

        <h4 style={{ marginTop: '1.5rem' }}>Tracking — Know What Works</h4>
        <p>CapeWeb rule: <strong>No guessing.</strong> We track what drives results.</p>
        <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1.5rem', margin: '1rem 0' }}>
          <h5 style={{ margin: '0 0 .75rem' }}>Beginner Analytics Stack (Free)</h5>
          <ul style={{ margin: '0 0 0 1.25rem', lineHeight: '1.8' }}>
            <li><strong>Google Analytics 4 (GA4):</strong> Track visitors, page views, conversions. <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">analytics.google.com</a></li>
            <li><strong>Google Search Console:</strong> See which searches bring you traffic. <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">search.google.com/search-console</a></li>
            <li><strong>Meta Pixel (if running Facebook/Instagram ads):</strong> <a href="https://business.facebook.com/business/help/952192354843755" target="_blank" rel="noopener noreferrer">Meta Business Help</a></li>
          </ul>
        </div>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>📊 Mission 4: Choose your lead + payment stack</h4>
          <p>Pick ONE from each category. You can change later.</p>

          <div style={{ marginTop: '1rem' }}>
            <strong>Lead Capture:</strong>
            <div style={{ marginTop: '.5rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {['WhatsApp Business', 'Netlify Forms', 'Google Forms', 'Calendly'].map((option) => (
                <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <input data-progress="true" type="radio" name="p3_lead_capture" value={option.toLowerCase().replace(/\s/g, '_')} />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <strong>Payments:</strong>
            <div style={{ marginTop: '.5rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {['Yoco Payment Link', 'PayFast', 'Shopify Checkout', 'Manual (bank transfer for now)'].map((option) => (
                <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <input data-progress="true" type="radio" name="p3_payment" value={option.toLowerCase().replace(/\s/g, '_')} />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <input data-progress="true" type="checkbox" />
              I've set up (or planned) Google Analytics 4
            </label>
          </div>
        </div>
      </div>

      {/* Section 6: Launch Checklist */}
      <div className="mastery-section" data-topic="launch checklist pre-launch testing go live deployment">
        <h3>6) Launch Checklist — Ship it with confidence</h3>
        <p>
          Most beginners wait for "perfect". CapeWeb ships <strong>good enough to learn from</strong>, then improves with data.
        </p>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>✅ Pre-Launch Checklist (Test Before You Tweet)</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '1rem' }}>
            {[
              'All pages load correctly (home, offer, about, FAQ, contact)',
              'CTA buttons work (WhatsApp opens, forms submit, payment links work)',
              'Site looks good on mobile (test on your phone)',
              'Run PageSpeed Insights — fix any critical issues',
              'Check spelling and grammar (ask a friend to read it)',
              'Add favicon and basic meta tags (title, description)',
              'Google Analytics tracking code is installed',
              'Forms send notifications to the right email/phone',
              'Privacy policy + terms linked in footer',
              'Test checkout/payment flow end-to-end',
            ].map((item, index) => (
              <label key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem', background: '#fff', padding: '.75rem', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <input data-progress="true" type="checkbox" style={{ marginTop: '.25rem' }} />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <h4 style={{ marginTop: '1.5rem' }}>After Launch — The First 7 Days</h4>
        <p>You're not done. You're just starting. Here's what CapeWeb teaches founders to track in Week 1:</p>
        <ul style={{ margin: '.75rem 0 0 1.25rem', lineHeight: '1.8' }}>
          <li>Daily visitors (GA4)</li>
          <li>Form submissions / WhatsApp messages</li>
          <li>Top landing pages (what people actually visit)</li>
          <li>Bounce rate (are people leaving immediately?)</li>
          <li>Conversion rate (visits → leads → sales)</li>
        </ul>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#e6f4ea', borderRadius: '8px', color: '#1e7e34', border: '1px solid #c3e6cb' }}>
          <strong>✅ CapeWeb Win Condition:</strong> You've launched when your site is live, trackable, and converting at least 1 visitor into 1 lead in the first week.
        </div>
      </div>
    </>
  );
}

export function Pillar3Quiz({ quizResponses, onSelect, onScore, scoreMessage }) {
  return (
    <div className="mastery-section">
      <h3>🏁 Boss Battle: Pillar 3 Knowledge Test</h3>
      <p>
        Score <strong>8/10</strong> or higher before moving to Pillar 4.
        CapeWeb wants you building with confidence — not guessing.
      </p>
      <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px' }}>
        {pillar3QuizQuestions.map((question, index) => (
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
            {index < pillar3QuizQuestions.length - 1 && <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '1rem 0' }} />}
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

export function Pillar3Completion() {
  return (
    <div className="completion-box" style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed #ced4da' }}>
      <h3>🎉 Pillar 3 Complete</h3>
      <p>
        You now understand how a high-performing website system works: structure, platform choices, speed, lead capture, payments, and launch.
        When you say "continue to Pillar 4," CapeWeb will guide you into Mobile App Development (when an app is truly worth it, and when it's not).
      </p>
    </div>
  );
}

// SVG Diagram: Page Map
function PageMapDiagram() {
  return (
    <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
      <svg width="100%" viewBox="0 0 1100 320" role="img" aria-label="Diagram: Essential 5-page website structure">
        <defs>
          <style>{`
            .pmbox { fill:#fff; stroke:#0b0f1a; stroke-width:2; rx:12; }
            .pmtx { font: 16px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:700; }
            .pmsm { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .pmarr { stroke:#0b0f1a; stroke-width:2; marker-end:url(#pmah); }
          `}</style>
          <marker id="pmah" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a"></polygon>
          </marker>
        </defs>

        <rect className="pmbox" x="420" y="20" width="260" height="80"></rect>
        <text className="pmtx" x="550" y="55" textAnchor="middle">Home</text>
        <text className="pmsm" x="550" y="78" textAnchor="middle">Your 5-second pitch</text>

        <rect className="pmbox" x="50" y="140" width="200" height="80"></rect>
        <text className="pmtx" x="150" y="172" textAnchor="middle">Offer/Services</text>
        <text className="pmsm" x="150" y="195" textAnchor="middle">What you sell</text>

        <rect className="pmbox" x="280" y="140" width="180" height="80"></rect>
        <text className="pmtx" x="370" y="172" textAnchor="middle">About</text>
        <text className="pmsm" x="370" y="195" textAnchor="middle">Trust signals</text>

        <rect className="pmbox" x="490" y="140" width="120" height="80"></rect>
        <text className="pmtx" x="550" y="172" textAnchor="middle">FAQ</text>
        <text className="pmsm" x="550" y="195" textAnchor="middle">Kill doubt</text>

        <rect className="pmbox" x="640" y="140" width="200" height="80"></rect>
        <text className="pmtx" x="740" y="172" textAnchor="middle">Contact/Buy</text>
        <text className="pmsm" x="740" y="195" textAnchor="middle">CTA + payment</text>

        <line className="pmarr" x1="550" y1="100" x2="150" y2="140"></line>
        <line className="pmarr" x1="550" y1="100" x2="370" y2="140"></line>
        <line className="pmarr" x1="550" y1="100" x2="550" y2="140"></line>
        <line className="pmarr" x1="550" y1="100" x2="740" y2="140"></line>

        <rect className="pmbox" x="350" y="250" width="400" height="50"></rect>
        <text className="pmsm" x="550" y="280" textAnchor="middle">Optional: Blog, Case Studies, Testimonials (add later when you have data)</text>
      </svg>
      <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
        Start with 5 pages. Add more when sales prove what customers want.
      </figcaption>
    </figure>
  );
}

// SVG Diagram: Digital HQ System
function DigitalHQDiagram() {
  return (
    <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
      <svg width="100%" viewBox="0 0 1200 520" role="img" aria-label="Diagram: Digital HQ system (pages, trust, leads, payments, analytics)">
        <defs>
          <style>{`
            .bx { fill:#fff; stroke:#0b0f1a; stroke-width:2; rx:14; }
            .tx { font: 18px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:800; }
            .sm { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .ln { stroke:#0b0f1a; stroke-width:2.5; }
          `}</style>
          <marker id="arrP3" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a"></polygon>
          </marker>
        </defs>

        <rect className="bx" x="440" y="200" width="320" height="120"></rect>
        <text className="tx" x="600" y="245" textAnchor="middle">Your Website</text>
        <text className="sm" x="600" y="272" textAnchor="middle">(Digital HQ)</text>
        <text className="sm" x="600" y="296" textAnchor="middle">fast • clear • trustworthy</text>

        <rect className="bx" x="70" y="70" width="320" height="110"></rect>
        <text className="tx" x="230" y="110" textAnchor="middle">Offer Pages</text>
        <text className="sm" x="230" y="135" textAnchor="middle">What you sell + price + next step</text>

        <rect className="bx" x="810" y="70" width="320" height="110"></rect>
        <text className="tx" x="970" y="110" textAnchor="middle">Trust Signals</text>
        <text className="sm" x="970" y="135" textAnchor="middle">proof • reviews • policies • FAQ</text>

        <rect className="bx" x="70" y="380" width="320" height="110"></rect>
        <text className="tx" x="230" y="420" textAnchor="middle">Lead Capture</text>
        <text className="sm" x="230" y="445" textAnchor="middle">WhatsApp • forms • email</text>

        <rect className="bx" x="810" y="380" width="320" height="110"></rect>
        <text className="tx" x="970" y="420" textAnchor="middle">Payments</text>
        <text className="sm" x="970" y="445" textAnchor="middle">payment links • checkout</text>

        <rect className="bx" x="440" y="30" width="320" height="110"></rect>
        <text className="tx" x="600" y="70" textAnchor="middle">Traffic</text>
        <text className="sm" x="600" y="95" textAnchor="middle">social • search • referrals</text>

        <rect className="bx" x="440" y="380" width="320" height="110"></rect>
        <text className="tx" x="600" y="420" textAnchor="middle">Analytics</text>
        <text className="sm" x="600" y="445" textAnchor="middle">what works • what to fix</text>

        <line className="ln" x1="230" y1="180" x2="440" y2="235" markerEnd="url(#arrP3)"></line>
        <line className="ln" x1="970" y1="180" x2="760" y2="235" markerEnd="url(#arrP3)"></line>
        <line className="ln" x1="230" y1="380" x2="440" y2="285" markerEnd="url(#arrP3)"></line>
        <line className="ln" x1="970" y1="380" x2="760" y2="285" markerEnd="url(#arrP3)"></line>
        <line className="ln" x1="600" y1="140" x2="600" y2="200" markerEnd="url(#arrP3)"></line>
        <line className="ln" x1="600" y1="320" x2="600" y2="380" markerEnd="url(#arrP3)"></line>
      </svg>
      <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
        A "website" is not just a page. It's a system that turns attention into action.
      </figcaption>
    </figure>
  );
}
