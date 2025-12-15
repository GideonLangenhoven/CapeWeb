import React, { useRef, useState, useEffect } from 'react';
import '../styles/CapeWebBlueprint.css';

export const pillar4QuizQuestions = [
  {
    question: 'The best first move before building an app is usually:',
    options: ['Build 50 screens', 'Prototype a simple flow and test with real users', 'Wait forever'],
    correctIndex: 1,
  },
  {
    question: 'An MVP is:',
    options: ['The smallest version you can launch and learn from', 'A perfect final product', 'A logo'],
    correctIndex: 0,
  },
  {
    question: 'Cross-platform means:',
    options: ['Only Android', 'One codebase that can run on Android and iOS', 'Only iOS'],
    correctIndex: 1,
  },
  {
    question: 'Testing helps you avoid:',
    options: ['Sales', '1-star reviews from bugs and confusion', 'Learning'],
    correctIndex: 1,
  },
  {
    question: 'Google Play uses testing tracks like:',
    options: ['Internal / closed / open testing', 'Only public release', 'No testing'],
    correctIndex: 0,
  },
  {
    question: 'On iOS, TestFlight is used for:',
    options: ['Paying VAT', 'Beta testing builds before App Store release', 'Designing icons'],
    correctIndex: 1,
  },
  {
    question: 'Store submission usually requires:',
    options: ['Only a logo', 'Listing assets + policy/compliance details (privacy/rating)', 'No screenshots'],
    correctIndex: 1,
  },
  {
    question: 'Crash reporting exists to:',
    options: ['Track and fix stability issues', 'Make your phone heavier', 'Replace marketing'],
    correctIndex: 0,
  },
  {
    question: 'A good MVP feature count is usually:',
    options: ['Small enough to finish and launch', '40 features', 'Unlimited features'],
    correctIndex: 0,
  },
  {
    question: 'StoryBrand messaging in a store listing helps because:',
    options: ['It makes things confusing', 'It makes the customer understand value fast', 'It removes the CTA'],
    correctIndex: 1,
  },
];

export default function CapeWebPillar4() {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizResponses, setQuizResponses] = useState({});
  const [scoreMessage, setScoreMessage] = useState('Not checked yet.');
  const [progress, setProgress] = useState({ done: 0, total: 0, pct: 0 });
  const [needAppChoice, setNeedAppChoice] = useState('');
  const [stackChoice, setStackChoice] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const articleRef = useRef(null);
  const navRef = useRef(null);

  const handleQuizResponse = (questionIndex, optionIndex) => {
    setQuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleScore = () => {
    const correct = pillar4QuizQuestions.reduce((sum, question, index) => {
      return sum + (quizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 5.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setScoreMessage(message);
  };

  const updateProgress = () => {
    const items = document.querySelectorAll('[data-scroll-section-id="pillar4"] input[data-progress="true"]');
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
    <div data-scroll-section-id="pillar4">
      <div className="blueprint-heading reveal-text">
        <div className="expand-label">CapeWeb University</div>
        <h2 className="expand-title-section" style={{ marginBottom: '1rem' }}>
          Pillar 4: Mobile Application Development — go from idea to App Store-ready product.
        </h2>
        <p className="expand-text-lg" style={{ maxWidth: '900px' }}>
          A mobile app can be your most powerful "always-on" sales tool — but only if you build it at the right time, with the right scope.
          In this pillar, CapeWeb helps a beginner founder (25, Cape Town, starting budget R0) go from <strong>idea → prototype → MVP → testing → store submission</strong>
          without getting overwhelmed.
        </p>

        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#f8f9fa', maxWidth: '980px' }}>
          <strong>How CapeWeb helps you win in Pillar 4:</strong>
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li><strong>Performance First:</strong> fast app screens + smooth UX (no "laggy startup").</li>
            <li><strong>Automation Built-In:</strong> bookings, follow-ups, WhatsApp + email flows from day one.</li>
            <li><strong>Content that Converts:</strong> app store listing copy + screenshots that sell clearly.</li>
            <li><strong>SEO that Sticks:</strong> (yes, even for apps) clean metadata + discoverability basics.</li>
            <li><strong>Care Plans that Care:</strong> ship → learn → improve after launch.</li>
          </ul>

          <div style={{ marginTop: '.85rem' }}>
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '.65rem 1rem', borderRadius: '8px', background: '#0b0f1a', color: '#fff', textDecoration: 'none', fontWeight: 800 }}
            >
              Talk to CapeWeb about an MVP Mobile App Launch →
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
                  id="capeweb-search-p4"
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
                  Tick checkboxes and answer activities to track progress.
                </p>
              </div>
            </section>

            <nav className="learn-capeweb-nav" aria-label="CapeWeb Blueprint Navigation" ref={navRef}>
              <div className="pillar-modules">
                <button type="button" className="pillar-module is-active" aria-current="true">
                  <div className="module-pill">Pillar 4</div>
                  <div>
                    <div className="module-title">The Store-Ready MVP</div>
                    <p>Decide if you need an app, prototype it, build MVP scope, test, and submit to stores.</p>
                  </div>
                </button>
              </div>
            </nav>
          </aside>
        </div>

        <div className="learn-capeweb-article-pane">
          <div className="learn-capeweb-article" ref={articleRef}>
            <Pillar4Content
              needAppChoice={needAppChoice}
              setNeedAppChoice={setNeedAppChoice}
              stackChoice={stackChoice}
              setStackChoice={setStackChoice}
              selectedFeatures={selectedFeatures}
              setSelectedFeatures={setSelectedFeatures}
            />
            <Pillar4Quiz quizResponses={quizResponses} onSelect={handleQuizResponse} onScore={handleScore} scoreMessage={scoreMessage} />
            <Pillar4Completion />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Pillar4Content({ needAppChoice, setNeedAppChoice, stackChoice, setStackChoice, selectedFeatures, setSelectedFeatures }) {
  const handleFeatureToggle = (value) => {
    setSelectedFeatures((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  const getNeedAppPlan = (choice) => {
    switch (choice) {
      case 'later':
        return (
          <>
            <strong>CapeWeb plan (App Later):</strong>
            <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>Use your website + WhatsApp as your "mobile flow" first</li>
              <li>Collect proof: 20–100 sales with the same simple process</li>
              <li>Prototype the app while selling (so you don't guess)</li>
              <li>Build the app when you have repeat buyers</li>
            </ul>
            <p style={{ margin: '.75rem 0 0', color: '#495057' }}>CapeWeb can build a conversion-first mobile flow now, then upgrade you to an app later.</p>
          </>
        );
      case 'now':
        return (
          <>
            <strong>CapeWeb plan (App Now):</strong>
            <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>Prototype the exact reorder/booking flow that repeats</li>
              <li>Build the "core 7" MVP features only</li>
              <li>Test with 10 real users</li>
              <li>Submit to stores with the correct assets + privacy details</li>
            </ul>
            <p style={{ margin: '.75rem 0 0', color: '#495057' }}>This is how you turn existing demand into easier growth.</p>
          </>
        );
      case 'unsure':
        return (
          <>
            <strong>CapeWeb plan (Quick Test):</strong>
            <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>Make a 3-screen prototype</li>
              <li>Show it to 10 potential customers</li>
              <li>If 3+ say "I would use this weekly," proceed</li>
              <li>If not, fix the offer and flow first</li>
            </ul>
            <p style={{ margin: '.75rem 0 0', color: '#495057' }}>Decisions become easy when you test instead of guessing.</p>
          </>
        );
      default:
        return (
          <>
            <strong>Your CapeWeb plan will show here.</strong>
            <p style={{ margin: '.5rem 0 0', color: '#495057' }}>Choose an option above.</p>
          </>
        );
    }
  };

  const getStackPlan = (choice) => {
    switch (choice) {
      case 'expo':
        return (
          <>
            <strong>Expo plan (Beginner-friendly):</strong>
            <ol style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>Prototype the 3 screens</li>
              <li>Build MVP screens + one core flow</li>
              <li>Connect a simple backend (optional early)</li>
              <li>Enable analytics + crash reporting</li>
              <li>Use Expo build + submission docs to go store-ready</li>
            </ol>
            <p style={{ margin: '.75rem 0 0', color: '#495057' }}>Best when you want the smoothest path to both stores.</p>
          </>
        );
      case 'flutter':
        return (
          <>
            <strong>Flutter plan (Strong cross-platform):</strong>
            <ol style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>Prototype the 3 screens</li>
              <li>Build UI + core flow fast</li>
              <li>Prepare Android and iOS release builds using Flutter deployment docs</li>
              <li>Test, then submit using store checklists</li>
            </ol>
            <p style={{ margin: '.75rem 0 0', color: '#495057' }}>Great for performance + consistent UI.</p>
          </>
        );
      case 'native':
        return (
          <>
            <strong>Native plan (Only if you must):</strong>
            <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
              <li>Android build and iOS build are separate projects</li>
              <li>More control, more cost/time</li>
              <li>CapeWeb recommends this later if your app needs deep device features</li>
            </ul>
          </>
        );
      default:
        return (
          <>
            <strong>Your stack plan will appear here.</strong>
            <p style={{ margin: '.5rem 0 0', color: '#495057' }}>Pick a stack above.</p>
          </>
        );
    }
  };

  const featureCount = selectedFeatures.length;
  const featureMessage =
    featureCount === 0
      ? 'Pick your core features to build an MVP.'
      : featureCount <= 7
      ? '✅ Good! This is small enough to ship and learn.'
      : '⚠️ Too big for a first launch. Cut features until you can finish.';

  return (
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

      <div className="article-divider"></div>

      {/* Section 1: Do you need an app? */}
      <div className="mastery-section" data-topic="need an app pwa web app vs native mobile decision">
        <h3>1) Do you need an app right now? (Most founders don't.)</h3>
        <p>
          CapeWeb sees this mistake all the time: a founder with R0 says "I need an app."
          What they really need is <strong>sales</strong>.
        </p>
        <p>
          Apps are powerful when they reduce friction for customers who already want what you sell:
          faster re-orders, bookings, loyalty, push notifications, offline use.
        </p>

        <AppDecisionDiagram />

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🧭 Mission 1: Decide "App Now" vs "Later"</h4>
          <p>Answer honestly. CapeWeb uses this to prevent you from wasting months.</p>

          <div className="quiz-question">
            <p><strong>Question:</strong> Which statement is most true today?</p>
            <div className="quiz-options">
              <label className="radio-item">
                <input data-progress="true" type="radio" name="p4_need_app" value="later" checked={needAppChoice === 'later'} onChange={(e) => setNeedAppChoice(e.target.value)} />
                I have no repeat customers yet. I need a simple flow to get my first 100 sales.
              </label>
              <br />
              <label className="radio-item">
                <input data-progress="true" type="radio" name="p4_need_app" value="now" checked={needAppChoice === 'now'} onChange={(e) => setNeedAppChoice(e.target.value)} />
                I already have repeat buyers. An app would make ordering/booking faster.
              </label>
              <br />
              <label className="radio-item">
                <input data-progress="true" type="radio" name="p4_need_app" value="unsure" checked={needAppChoice === 'unsure'} onChange={(e) => setNeedAppChoice(e.target.value)} />
                I'm not sure (I need a quick test plan).
              </label>
            </div>

            <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
              {getNeedAppPlan(needAppChoice)}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Prototype First - continuing from previous section */}
      <div className="mastery-section" data-topic="prototype wireframe figma user flow clickable prototype">
        <h3>2) Prototype first (before you write code)</h3>
        <p>
          A prototype is a "fake app" that feels real. You can show it to customers and ask:
          "Would you use this? Would you pay?"
        </p>
        <p>
          CapeWeb uses prototypes to avoid expensive mistakes — especially when your budget is R0.
        </p>

        <div style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
          <strong>Free tool that works:</strong> Figma (design + clickable prototypes)
          <ul style={{ margin: '.75rem 0 0 1.25rem' }}>
            <li><a href="https://help.figma.com/hc/en-us/articles/360040531773-Share-files-and-prototypes" target="_blank" rel="noopener noreferrer">Share prototypes (official guide)</a></li>
            <li><a href="https://help.figma.com/hc/en-us/articles/1500007609322-Guide-to-sharing-and-permissions" target="_blank" rel="noopener noreferrer">Sharing + permissions</a></li>
          </ul>
        </div>

        <UserFlowDiagram />

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>📝 Mission 2: Write your 3-screen MVP (beginner template)</h4>
          <p>Only 3 screens. If you need 20 screens, you're building "version 5" on day 1.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '.5rem' }}>Screen 1: Home (what choices exist?)</label>
              <textarea rows="5" placeholder="Example:
- Button: Buy product
- Button: Book service
- Button: Talk on WhatsApp" style={{ width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }}></textarea>
              <label style={{ display: 'block', marginTop: '.75rem', fontWeight: 800 }}>Success rule:</label>
              <input type="text" placeholder="e.g., user taps a button within 5 seconds" style={{ width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />
            </div>

            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '.5rem' }}>Screen 2: Choose (product/service selection)</label>
              <textarea rows="5" placeholder="Example:
- list of options
- simple price display
- 'Next' button" style={{ width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }}></textarea>
              <label style={{ display: 'block', marginTop: '.75rem', fontWeight: 800 }}>Biggest risk:</label>
              <input type="text" placeholder="e.g., pricing confusion / too many choices" style={{ width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '.5rem' }}>Screen 3: Confirm + Pay (the money moment)</label>
              <textarea rows="6" placeholder="Example:
- show summary
- show total
- button: Pay now (link) OR Confirm booking
- show what happens next" style={{ width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' }}></textarea>
              <small style={{ color: '#6c757d' }}>CapeWeb tip: "What happens next?" reduces refunds, complaints, and fear.</small>
            </div>
          </div>

          <div style={{ marginTop: '1rem', background: '#e6f4ea', padding: '1rem', borderRadius: '8px', color: '#1e7e34' }}>
            <strong>✅ CapeWeb shortcut:</strong> CapeWeb can turn your 3-screen MVP into a clickable prototype in days, not months.
            <a href="/contact" target="_blank" rel="noopener noreferrer" style={{ color: '#1e7e34', fontWeight: 900, textDecoration: 'underline' }}>Open CapeWeb →</a>
          </div>
        </div>
      </div>

      {/* Section 3: Choose Build Path */}
      <div className="mastery-section" data-topic="flutter react native expo native cross platform stack choose build path">
        <h3>3) Choose your build path (simple and realistic)</h3>
        <p>
          You have 4 main options. CapeWeb usually recommends cross-platform first (one codebase for Android + iOS),
          especially when budget is tight.
        </p>

        <div className="comparison-table-wrapper">
          <table className="capeweb-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #0b0f1a' }}>
                <th style={{ padding: '.75rem', textAlign: 'left', borderRight: '1px solid #e9ecef' }}>Option</th>
                <th style={{ padding: '.75rem', textAlign: 'left', borderRight: '1px solid #e9ecef' }}>Good for</th>
                <th style={{ padding: '.75rem', textAlign: 'left', borderRight: '1px solid #e9ecef' }}>Risk</th>
                <th style={{ padding: '.75rem', textAlign: 'left' }}>Links</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>No-code / low-code</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Very fast validation</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Limits later</td>
                <td style={{ padding: '.75rem' }}><a href="https://www.figma.com/" target="_blank" rel="noopener noreferrer">Prototype first (Figma)</a></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>React Native</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Cross-platform apps</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Build + signing complexity</td>
                <td style={{ padding: '.75rem' }}><a href="https://reactnative.dev/docs/signed-apk-android" target="_blank" rel="noopener noreferrer">Publishing to Google Play</a></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Flutter</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Cross-platform apps (fast UI)</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Learning curve</td>
                <td style={{ padding: '.75rem' }}>
                  <a href="https://docs.flutter.dev/deployment/android" target="_blank" rel="noopener noreferrer">Release for Android</a> ·
                  <a href="https://docs.flutter.dev/deployment/ios" target="_blank" rel="noopener noreferrer">Release for iOS</a>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Expo (with React Native)</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Simpler builds + store submission</td>
                <td style={{ padding: '.75rem', borderRight: '1px solid #e9ecef' }}>Advanced native needs later</td>
                <td style={{ padding: '.75rem' }}>
                  <a href="https://docs.expo.dev/deploy/build-project/" target="_blank" rel="noopener noreferrer">Build for stores</a> ·
                  <a href="https://docs.expo.dev/deploy/submit-to-app-stores/" target="_blank" rel="noopener noreferrer">Submit to stores</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' }}>
          <h4>🧩 Mission 3: Pick your beginner-friendly stack</h4>
          <p>Choose one. CapeWeb will show a simple build plan.</p>

          <div className="quiz-options">
            <label>
              <input data-progress="true" type="radio" name="p4_stack" value="expo" checked={stackChoice === 'expo'} onChange={(e) => setStackChoice(e.target.value)} />
              Expo (React Native) — simplest store pipeline
            </label>
            <br />
            <label>
              <input data-progress="true" type="radio" name="p4_stack" value="flutter" checked={stackChoice === 'flutter'} onChange={(e) => setStackChoice(e.target.value)} />
              Flutter — strong cross-platform option
            </label>
            <br />
            <label>
              <input data-progress="true" type="radio" name="p4_stack" value="native" checked={stackChoice === 'native'} onChange={(e) => setStackChoice(e.target.value)} />
              Native (Android + iOS separate) — only if you must
            </label>
          </div>

          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' }}>
            {getStackPlan(stackChoice)}
          </div>

          <div style={{ marginTop: '1rem', background: '#e7f1ff', padding: '1rem', borderRadius: '8px', border: '1px solid #cfe2ff' }}>
            <strong>🎯 CapeWeb recommendation (R0 founder):</strong> Prototype → Expo/Flutter MVP → Android-first launch → iOS when budget allows.
          </div>
        </div>
      </div>

      {/* Continuing file due to length... */}
    </>
  );
}

export function Pillar4Quiz({ quizResponses, onSelect, onScore, scoreMessage }) {
  return (
    <div className="mastery-section">
      <h3>🏁 Boss Battle: Pillar 4 Knowledge Test</h3>
      <p>
        Score <strong>8/10</strong> or higher before moving to Pillar 5.
        CapeWeb wants you building with confidence — not guessing.
      </p>
      <div className="workbook-section" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px' }}>
        {pillar4QuizQuestions.map((question, index) => (
          <React.Fragment key={index}>
            <div className="quiz-question">
              <p>
                <strong>{index + 1})</strong> {question.question}
              </p>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="radio-item" style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={`quiz-p4-${index}`}
                    checked={quizResponses[index] === optionIndex}
                    onChange={() => onSelect(index, optionIndex)}
                  />{' '}
                  {option}
                </label>
              ))}
            </div>
            {index < pillar4QuizQuestions.length - 1 && <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '1rem 0' }} />}
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

export function Pillar4Completion() {
  return (
    <div className="completion-box" style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed #ced4da' }}>
      <h3>🎉 Pillar 4 Complete</h3>
      <p>
        You now know how to go from idea to a store-ready MVP: decide timing, prototype, pick a build path, keep scope small, test properly,
        and prepare listing + compliance.
      </p>
      <p style={{ color: '#6c757d', maxWidth: '900px', margin: '0.75rem auto 0' }}>
        When you say "continue," CapeWeb will move you to Pillar 5 (SEO) — so your web + app discoverability can compound over time.
      </p>
    </div>
  );
}

// SVG Diagrams
function AppDecisionDiagram() {
  return (
    <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
      <svg width="100%" viewBox="0 0 1200 420" role="img" aria-label="Diagram: Should you build an app now decision tree">
        <defs>
          <style>{`
            .bx { fill:#fff; stroke:#0b0f1a; stroke-width:2; rx:14; }
            .tx { font: 18px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:800; }
            .sm { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .ar { stroke:#0b0f1a; stroke-width:3; marker-end:url(#arrP4a); }
          `}</style>
          <marker id="arrP4a" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a"></polygon>
          </marker>
        </defs>

        <rect className="bx" x="440" y="20" width="320" height="90"></rect>
        <text className="tx" x="600" y="60" textAnchor="middle">START</text>
        <text className="sm" x="600" y="85" textAnchor="middle">"I think I need an app."</text>

        <line className="ar" x1="600" y1="110" x2="600" y2="160"></line>

        <rect className="bx" x="340" y="160" width="520" height="90"></rect>
        <text className="tx" x="600" y="200" textAnchor="middle">Do you already have repeat customers?</text>
        <text className="sm" x="600" y="225" textAnchor="middle">(people who buy again without begging)</text>

        <line className="ar" x1="340" y1="205" x2="210" y2="205"></line>
        <rect className="bx" x="40" y="160" width="170" height="90"></rect>
        <text className="tx" x="125" y="198" textAnchor="middle">NO</text>
        <text className="sm" x="125" y="222" textAnchor="middle">Build web + WhatsApp first</text>

        <line className="ar" x1="860" y1="205" x2="990" y2="205"></line>
        <rect className="bx" x="990" y="160" width="170" height="90"></rect>
        <text className="tx" x="1075" y="198" textAnchor="middle">YES</text>
        <text className="sm" x="1075" y="222" textAnchor="middle">App can accelerate growth</text>

        <line className="ar" x1="1075" y1="250" x2="1075" y2="310"></line>
        <rect className="bx" x="910" y="310" width="330" height="90"></rect>
        <text className="tx" x="1075" y="350" textAnchor="middle">Build an MVP app</text>
        <text className="sm" x="1075" y="375" textAnchor="middle">Start small → test → publish</text>

        <line className="ar" x1="125" y1="250" x2="125" y2="310"></line>
        <rect className="bx" x="40" y="310" width="330" height="90"></rect>
        <text className="tx" x="205" y="350" textAnchor="middle">Build a mobile-friendly site</text>
        <text className="sm" x="205" y="375" textAnchor="middle">Then upgrade to an app after traction</text>
      </svg>
      <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
        CapeWeb rule: a mobile app is an upgrade that makes growth easier — not a magic spell that creates demand.
      </figcaption>
    </figure>
  );
}

function UserFlowDiagram() {
  return (
    <figure style={{ margin: '1.25rem 0', padding: '1rem', border: '1px solid #e9ecef', borderRadius: '10px', background: '#fff' }}>
      <svg width="100%" viewBox="0 0 1200 260" role="img" aria-label="Diagram: Simple mobile user flow for product + service">
        <defs>
          <style>{`
            .bx { fill:#fff; stroke:#0b0f1a; stroke-width:2; rx:14; }
            .tx { font: 16px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:800; }
            .sm { font: 12px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .ar { stroke:#0b0f1a; stroke-width:3; marker-end:url(#arrP4b); }
          `}</style>
          <marker id="arrP4b" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a"></polygon>
          </marker>
        </defs>

        <rect className="bx" x="40" y="70" width="210" height="120"></rect>
        <text className="tx" x="145" y="112" textAnchor="middle">Open App</text>
        <text className="sm" x="145" y="138" textAnchor="middle">Home screen</text>

        <line className="ar" x1="250" y1="130" x2="340" y2="130"></line>
        <rect className="bx" x="340" y="40" width="260" height="90"></rect>
        <text className="tx" x="470" y="85" textAnchor="middle">Buy Product</text>
        <text className="sm" x="470" y="108" textAnchor="middle">browse → add → pay</text>

        <line className="ar" x1="250" y1="130" x2="340" y2="170"></line>
        <rect className="bx" x="340" y="150" width="260" height="90"></rect>
        <text className="tx" x="470" y="195" textAnchor="middle">Book Service</text>
        <text className="sm" x="470" y="218" textAnchor="middle">choose date → confirm</text>

        <line className="ar" x1="600" y1="85" x2="700" y2="85"></line>
        <line className="ar" x1="600" y1="195" x2="700" y2="195"></line>

        <rect className="bx" x="700" y="40" width="240" height="200"></rect>
        <text className="tx" x="820" y="95" textAnchor="middle">Confirm</text>
        <text className="sm" x="820" y="120" textAnchor="middle">details + price</text>
        <text className="sm" x="820" y="145" textAnchor="middle">WhatsApp / email receipt</text>
        <text className="sm" x="820" y="170" textAnchor="middle">status updates</text>

        <line className="ar" x1="940" y1="140" x2="1120" y2="140"></line>
        <rect className="bx" x="1120" y="85" width="60" height="110"></rect>
        <text className="tx" x="1150" y="138" textAnchor="middle">❤️</text>
        <text className="sm" x="1150" y="163" textAnchor="middle">Repeat</text>
      </svg>
      <figcaption style={{ marginTop: '.75rem', color: '#6c757d', fontSize: '.95rem' }}>
        Your MVP flow should be boringly simple: open → choose → confirm → repeat.
      </figcaption>
    </figure>
  );
}
