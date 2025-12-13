import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import useLocomotiveScroll from '../hooks/useLocomotiveScroll';
import useColorChange from '../hooks/useColorChange';
import Footer from '../components/Footer';
import './Resources.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ARTICLES = [
  {
    category: "Web Development",
    title: "The ROI of Custom Web Development",
    excerpt: "Templates are cheap, but they cost you in the long run. Discover why custom-built sites convert 3x better.",
    date: "October 12, 2025",
    readTime: "6 minute read",
    theme: "purple",
    pdfFileName: "roi-custom-web-dev.pdf",
    guideType: "article-web-roi",
    posterContent: (
      <>
        <div className="poster-icon top-right">🚀</div>
        <h3 className="poster-text">
          STOP USING<br />
          <span className="poster-highlight">TEMPLATES</span><br />
          FOR YOUR BRAND
        </h3>
        <div className="poster-pill bottom-center">CUSTOM = CONVERSION</div>
        <div className="poster-line bottom-left"></div>
      </>
    ),
    content: `
      <h2>Why Templates Are Killing Your Conversion Rate</h2>
      <p>In the early days of a business, a $50 template seems like a smart financial decision. It gets you online fast and looks "good enough." But as you scale, that template becomes a straitjacket.</p>
      <p>Custom web development isn't just about vanity; it's about performance. A custom site is built around your specific content and conversion goals, not the other way around.</p>
      
      <h3>The Speed Factor</h3>
      <p>Templates are bloated with code to support every possible feature a user <em>might</em> want. This slows down your site significantly. Custom sites only load what they need.</p>
      <ul>
        <li><strong>Faster Load Times:</strong> Google ranks fast sites higher.</li>
        <li><strong>Better UX:</strong> Users bounce if a site takes more than 3 seconds to load.</li>
        <li><strong>Higher Conversions:</strong> A 1-second delay can cost you 7% in sales.</li>
      </ul>

      <h3>Brand Differentiation</h3>
      <p>If you use a popular template, you look like thousands of other businesses. Custom design allows you to express your unique brand identity without compromise.</p>
      <p>Investing in custom development is investing in a digital asset that will serve your business for years, not just a temporary placeholder.</p>
    `
  },
  {
    category: "Automation",
    title: "AI Agents: The 24/7 Sales Team",
    excerpt: "Imagine a sales rep that never sleeps, never takes a break, and knows your product perfectly. Meet your AI Agent.",
    date: "November 5, 2025",
    readTime: "5 minute read",
    theme: "green",
    pdfFileName: "ai-agents-sales-team.pdf",
    guideType: "article-ai-agents",
    posterContent: (
      <>
        <div className="poster-tag top-center">ALWAYS ONLINE</div>
        <h3 className="poster-text outline-text">
          THE SALES REP<br />THAT NEVER
        </h3>
        <h3 className="poster-text">
          SLEEPS
        </h3>
        <div className="poster-icon right-center">🤖</div>
        <div className="poster-icon left-center">💤</div>
      </>
    ),
    content: `
      <h2>The End of "Office Hours"</h2>
      <p>The modern consumer expects instant gratification. If they have a question at 11 PM and you don't answer until 9 AM the next day, you've lost the sale. This is where AI Agents come in.</p>
      
      <h3>What is an AI Agent?</h3>
      <p>Unlike a basic chatbot that follows a rigid script, an AI Agent understands context, sentiment, and nuance. It can answer complex questions, recommend products, and even close sales.</p>
      
      <h3>Key Benefits</h3>
      <ul>
        <li><strong>Zero Wait Times:</strong> Customers get answers instantly.</li>
        <li><strong>Consistent Service:</strong> The AI never has a bad day or gets tired.</li>
        <li><strong>Data Collection:</strong> Every interaction is analyzed to improve your sales process.</li>
      </ul>
      
      <p>Implementing an AI Agent isn't about replacing humans; it's about freeing them up to handle high-value relationships while the AI handles the volume.</p>
    `
  },
  {
    category: "Marketing",
    title: "SEO in 2025: Beyond Keywords",
    excerpt: "Search is changing. With AI overviews and voice search, traditional keyword stuffing is dead. Here is what works now.",
    date: "September 28, 2025",
    readTime: "8 minute read",
    theme: "orange",
    pdfFileName: "seo-2025-beyond-keywords.pdf",
    guideType: "article-seo-2025",
    posterContent: (
      <>
        <div className="poster-icon top-left">🔍</div>
        <h3 className="poster-text">
          SEO IS<br />
          <span className="text-white text-shadow">DEAD?</span><br />
          (NO, IT JUST EVOLVED)
        </h3>
        <div className="poster-pill bottom-center">ADAPT OR DISAPPEAR</div>
        <div className="poster-scribble right-center">〰️</div>
      </>
    ),
    content: `
      <h2>The Shift to Semantic Search</h2>
      <p>Gone are the days when you could rank by stuffing "best plumber Cape Town" into your footer 50 times. Search engines today use AI to understand <em>intent</em>, not just match strings of text.</p>
      
      <h3>AI Overviews (SGE)</h3>
      <p>With Google's Search Generative Experience, the user often gets their answer without ever clicking a link. To survive, you need to be the <em>source</em> of that answer.</p>
      
      <h3>What Works Now?</h3>
      <ul>
        <li><strong>Topic Authority:</strong> deeply covering a subject rather than skimming the surface.</li>
        <li><strong>Experience (E-E-A-T):</strong> Demonstrating real-world expertise and authorship.</li>
        <li><strong>User Signals:</strong> If users dwell on your page, you rank higher. If they bounce, you drop.</li>
      </ul>
      
      <p>SEO in 2025 is less about "tricking" the algorithm and more about providing the absolute best answer on the internet.</p>
    `
  },
  {
    category: "E-commerce",
    title: "Why Your Shopify Store Needs a Speed Audit",
    excerpt: "A 1-second delay in load time can cost you 7% in conversions. Is your store leaking money? Let's find out.",
    date: "August 15, 2025",
    readTime: "4 minute read",
    theme: "yellow",
    pdfFileName: "shopify-speed-audit.pdf",
    guideType: "article-shopify-speed",
    posterContent: (
      <>
        <div className="poster-icon top-right">⚡</div>
        <h3 className="poster-text">
          IS YOUR STORE<br />
          <span className="text-outline">LEAKING</span><br />
          MONEY?
        </h3>
        <div className="poster-tag bottom-left">SPEED KILLS (THE COMPETITION)</div>
      </>
    ),
    content: `
      <h2>Speed is the Currency of E-commerce</h2>
      <p>Amazon found that every 100ms of latency cost them 1% in sales. For a smaller store, the impact is even more dramatic. Mobile users, in particular, have zero patience for slow loading screens.</p>
      
      <h3>Common Speed Killers</h3>
      <ul>
        <li><strong>Unoptimized Images:</strong> Uploading 5MB PNGs instead of compressed WebP files.</li>
        <li><strong>Too Many Apps:</strong> Every Shopify app adds JavaScript to your site.</li>
        <li><strong>Bad Themes:</strong> Bloated code that loads unnecessary assets.</li>
      </ul>
      
      <h3>The Audit Process</h3>
      <p>We start by analyzing your Core Web Vitals. These are the metrics Google uses to measure user experience. Fixing your LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift) can often double your conversion rate overnight.</p>
      <p>Don't let a slow site be the reason you lose a customer who was ready to buy.</p>
    `
  },
  {
    category: "Design",
    title: "The Future of Digital Branding",
    excerpt: "Static logos are out. Dynamic, interactive brand identities are in. Learn how to future-proof your visual language.",
    date: "July 22, 2025",
    readTime: "6 minute read",
    theme: "pink",
    pdfFileName: "future-digital-branding.pdf",
    guideType: "article-branding-future",
    posterContent: (
      <>
        <div className="poster-scribble top-center">★</div>
        <h3 className="poster-text">
          MAKE IT<br />
          <span className="poster-highlight white">POP</span><br />
          NOT JUST PRETTY
        </h3>
        <div className="poster-icon bottom-right">🎨</div>
      </>
    ),
    content: `
      <h2>Beyond the Static Logo</h2>
      <p>For decades, branding meant a logo, a font, and a color palette. In the digital age, branding is how your company <em>moves</em> and <em>interacts</em>.</p>
      
      <h3>Dynamic Identity Systems</h3>
      <p>Modern brands are living systems. Your logo might animate on load, your colors might shift based on the time of day, and your typography might react to the user's cursor.</p>
      
      <h3>Why It Matters</h3>
      <p>We live in an attention economy. A static image is easy to scroll past. Movement catches the eye. Interactivity holds attention.</p>
      <ul>
        <li><strong>Motion Design:</strong> Micro-animations that guide the user.</li>
        <li><strong>Generative Art:</strong> Visuals that are unique to every user interaction.</li>
        <li><strong>Sonic Branding:</strong> How your brand sounds in an app or video.</li>
      </ul>
      
      <p>Future-proofing your brand means designing for screens first, not print.</p>
    `
  },
  {
    category: "Strategy",
    title: "Local SEO: Dominating the Cape Town Market",
    excerpt: "Global reach is great, but local dominance is profitable. How to own your backyard in the digital space.",
    date: "June 10, 2025",
    readTime: "5 minute read",
    theme: "lightblue",
    pdfFileName: "local-seo-cape-town.pdf",
    guideType: "article-local-seo",
    posterContent: (
      <>
        <div className="poster-tag top-left yellow">CAPE TOWN BUSINESS</div>
        <h3 className="poster-text">
          OWN YOUR<br />
          BACKYARD
        </h3>
        <div className="poster-pill bottom-right">LOCAL SEO MASTERY</div>
        <div className="poster-icon bottom-left">📍</div>
      </>
    ),
    content: `
      <h2>The "Near Me" Revolution</h2>
      <p>Searches for "services near me" have exploded in the last 5 years. If you're a Cape Town business, your most valuable customer is the one searching for you right now, within 5km of your office.</p>
      
      <h3>Google Business Profile</h3>
      <p>Your GMB listing is often more important than your homepage. It's the first thing people see on Maps. Optimizing this with photos, reviews, and updates is critical.</p>
      
      <h3>Local Content Strategy</h3>
      <p>Don't just write about "Web Design." Write about "Web Design for Cape Town Wineries" or "E-commerce for SA Retailers."</p>
      <ul>
        <li><strong>Local Keywords:</strong> Target suburbs and specific areas.</li>
        <li><strong>Local Backlinks:</strong> Get featured in local news and directories.</li>
        <li><strong>Reviews:</strong> A steady stream of 5-star reviews is the strongest ranking signal.</li>
      </ul>
      
      <p>Dominate your local market first. It's the foundation for global growth.</p>
    `
  }
];

const DownloadForm = ({ article }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLFgbHHM63wG-WrNwFrwzzLoj0kv6r7MD9RHPDFhTAVeS-8Y2UopbSVrzacie8GuZARg/exec';

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guideType: article.guideType
        }),
      });

      setStatus('success');

      // Trigger Download
      const link = document.createElement('a');
      link.href = `/${article.pdfFileName}`;
      link.download = article.pdfFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setFormData({ name: '', email: '' });
      setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="article-download-section">
      <div className="download-cta">
        <h3>Download Full Article</h3>
        <p>Get the complete PDF version of this article sent to your inbox.</p>
      </div>

      {status === 'success' ? (
        <div className="download-success">
          <p>Thanks! Your download should start automatically.</p>
        </div>
      ) : (
        <form className="article-download-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="download-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="download-input"
          />
          <button type="submit" className="download-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Processing...' : 'Download PDF'}
          </button>
        </form>
      )}
    </div>
  );
};

const FullScreenModal = ({ article, onClose }) => {


  if (!article) return null;

  return (
    <div className="article-modal-overlay" onClick={onClose}>
      <div className="article-modal-content" onClick={e => e.stopPropagation()}>
        <button className="article-modal-close" onClick={onClose}>×</button>
        <div className={`article-modal-header theme-${article.theme}`}>
          <div className="article-poster modal-poster">
            {article.posterContent}
          </div>
        </div>
        <div className="article-modal-body" dangerouslySetInnerHTML={{ __html: article.content }} />
        <DownloadForm article={article} />
      </div>
    </div>
  );
};

const RESOURCES_DATA = [
  {
    title: "The WhatsApp Goldmine",
    subtitle: "Automating Sales Conversations.",
    description: "96% of South Africans use WhatsApp. Move beyond manual replies and unlock the power of automated conversational commerce.",
    features: [
      "Automate appointment bookings.",
      "98% open rates.",
      "Answer FAQs instantly.",
      "Build a lead database you own."
    ],
    quote: "\"Turn the app into a sales engine.\"",
    buttonText: "Download Playbook",
    guideType: "whatsapp-goldmine",
    fileName: "whatsapp-automation.pdf",
    image: "https://images.unsplash.com/photo-1611746347311-585aad8486a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Automation",
    readTime: "8 min read",
    theme: "green",
    posterContent: (
      <>
        <div className="poster-icon top-left">💬</div>
        <h3 className="poster-text">
          TURN<br />
          CHATS INTO<br />
          <span className="text-white text-shadow">CASH</span>
        </h3>
        <div className="poster-tag bottom-right">WHATSAPP AUTOMATION</div>
      </>
    )
  },
  {
    title: "The \"Time-for-Money\" Trap",
    subtitle: "Breaking free from the hourly grind.",
    description: "Stop trading your limited hours for capped revenue. Transform your high-touch services into low-touch, high-margin digital assets.",
    features: [
      "Exit the \"owner-operator\" burnout cycle.",
      "Automated delivery systems.",
      "Revenue consistency.",
      "The \"Asset Mindset\"."
    ],
    quote: "\"Decouple your time from your income.\"",
    buttonText: "Download Guide",
    guideType: "time-money-trap",
    fileName: "time-for-money-trap.pdf",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Strategy",
    readTime: "10 min read",
    theme: "orange",
    posterContent: (
      <>
        <div className="poster-icon top-right">⏳</div>
        <h3 className="poster-text">
          STOP<br />
          TRADING<br />
          <span className="poster-highlight">TIME</span>
        </h3>
        <div className="poster-pill bottom-left">ESCAPE THE TRAP</div>
      </>
    )
  },
  {
    title: "The 2026 Extinction Event",
    subtitle: "Why SA Businesses Without AI Will Fade Away.",
    description: "The market is dividing into two camps: the AI-enabled and the obsolete. This whitepaper is your wake-up call and survival kit.",
    features: [
      "The hidden \"Efficiency Tax\".",
      "3 Immediate AI integrations.",
      "Competitor Analysis.",
      "Risk-free AI roadmap."
    ],
    quote: "\"Adaptation is the only safety.\"",
    buttonText: "Download Survival Guide",
    guideType: "2026-extinction",
    fileName: "2026-survival-guide.pdf",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Future Tech",
    readTime: "15 min read",
    theme: "purple",
    posterContent: (
      <>
        <div className="poster-scribble top-left">⚡</div>
        <h3 className="poster-text">
          ADAPT<br />
          <span className="text-outline">OR</span><br />
          DIE
        </h3>
        <div className="poster-icon bottom-right">💀</div>
      </>
    )
  },
  {
    title: "The Employee Who Never Sleeps",
    subtitle: "Implementing AI Agents for 24/7 Support.",
    description: "Meet your new best employee: an AI Agent that never takes leave, never sleeps, and treats every customer like a VIP.",
    features: [
      "Instant responses at 2:00 AM.",
      "Zero lead leakage.",
      "Consistent brand voice.",
      "Drastic support cost reduction."
    ],
    quote: "\"Fast-track your response times.\"",
    buttonText: "Download Agent Guide",
    guideType: "employee-never-sleeps",
    fileName: "ai-agent-guide.pdf",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "AI Agents",
    readTime: "12 min read",
    theme: "blue",
    posterContent: (
      <>
        <div className="poster-icon top-center">🌙</div>
        <h3 className="poster-text">
          24/7<br />
          <span className="text-white text-shadow">SUPPORT</span>
        </h3>
        <div className="poster-tag bottom-center">NEVER SLEEPS</div>
      </>
    )
  },
  {
    title: "Service to Scale",
    subtitle: "Transforming Expertise into Product.",
    description: "Join the Product-Led Growth revolution. Stop selling services—start selling solutions that scale infinitely.",
    features: [
      "Identify \"repeatable magic\".",
      "Low-code MVP tools.",
      "Subscription pricing strategies.",
      "Case studies of SA pivots."
    ],
    quote: "\"Build it once, sell it forever.\"",
    buttonText: "Download Roadmap",
    guideType: "service-to-scale",
    fileName: "service-to-scale.pdf",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Growth",
    readTime: "20 min read",
    theme: "pink",
    posterContent: (
      <>
        <div className="poster-icon top-right">🚀</div>
        <h3 className="poster-text">
          SCALE<br />
          <span className="poster-highlight white">INFINITELY</span>
        </h3>
        <div className="poster-pill bottom-left">PRODUCTIZE YOUR SERVICE</div>
      </>
    )
  }
];

const ResourceCard3D = ({ resource }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLFgbHHM63wG-WrNwFrwzzLoj0kv6r7MD9RHPDFhTAVeS-8Y2UopbSVrzacie8GuZARg/exec';

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guideType: resource.guideType
        }),
      });

      setStatus('success');

      // Trigger Download
      const link = document.createElement('a');
      link.href = `/${resource.fileName}`;
      link.download = resource.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setFormData({ name: '', email: '' });
      setTimeout(() => {
        setStatus('idle');
        setIsFlipped(false); // Flip back after success
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="resource-3d-container">
      <div className={`resource-3d-card ${isFlipped ? 'flipped' : ''}`}>

        {/* FRONT */}
        <div className={`card-front article-card theme-${resource.theme}`} onClick={() => setIsFlipped(true)} style={{ cursor: 'pointer' }}>
          <div className="article-poster">
            {resource.posterContent}
          </div>
          <div className="article-category-bar">
            {resource.category}
          </div>
          <div className="article-content">
            <h3>{resource.title}</h3>
            <p>{resource.subtitle}</p>
            <div className="article-meta">
              <span>{resource.readTime}</span>
              <span>📄 PDF Guide</span>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="card-back">
          <div className="card-back-header">
            <span className="back-title">Resource Details</span>
            <button className="close-btn" onClick={() => setIsFlipped(false)}>×</button>
          </div>

          <p className="card-description">{resource.description}</p>

          <ul className="card-features">
            {resource.features.slice(0, 3).map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>

          <form className="card-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="card-input"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="card-input"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="card-submit-btn" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Processing...' : resource.buttonText}
            </button>
            {status === 'success' && <p className="card-success-msg">Download started!</p>}
          </form>
        </div>

      </div>
    </div>
  );
};

const CanvasAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = 512;
    canvas.height = 512;

    // Pre-calculate gradients to avoid creating them every frame
    const gradients = [];
    for (let y = 0; y < canvas.height; y += 30) {
      const grad = ctx.createLinearGradient(0, y + 50, 0, y - 70);
      grad.addColorStop(0, "gray");
      grad.addColorStop(1, "white");
      gradients.push({ y, grad });
    }

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      gradients.forEach(({ y, grad }) => {
        ctx.fillStyle = grad;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 16) {
          let middleOffset = (x / canvas.width);
          middleOffset *= 1 - middleOffset;
          middleOffset = Math.pow(4 * middleOffset, 2);
          let yOffset = (y / canvas.height);
          yOffset *= 1 - yOffset;
          yOffset = Math.pow(4 * yOffset, 2);
          ctx.lineTo(x, y - 70 * middleOffset * yOffset * (1.3 + 0.2 * Math.sin(Date.now() / 100 + x / 30 + y / 13)));
        }
        ctx.lineTo(canvas.width + 100, y + 60);
        ctx.lineTo(-100, y + 60);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" />;
};

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLFgbHHM63wG-WrNwFrwzzLoj0kv6r7MD9RHPDFhTAVeS-8Y2UopbSVrzacie8GuZARg/exec';

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          name: 'Subscriber', // Default name
          guideType: 'footer-subscribe'
        }),
      });

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="newsletter-wrapper">
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          className="newsletter-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="newsletter-btn" disabled={status === 'submitting'}>
          {status === 'submitting' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && <p className="success-message" style={{ color: '#fff', marginTop: '10px' }}>Thanks for subscribing!</p>}
      {status === 'error' && <p className="error-message" style={{ color: '#ff6b6b', marginTop: '10px' }}>Something went wrong. Try again.</p>}
    </div>
  );
};

function Resources() {
  const { scrollRef, locomotiveScroll } = useLocomotiveScroll(true);
  const containerRef = useRef(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useColorChange(scrollRef);

  // Reset scroll position on mount
  // Reset scroll position on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = 0;
    }
    // Immediate reset for locomotive scroll
    if (locomotiveScroll?.current) {
      locomotiveScroll.current.scrollTo(0, { duration: 0, disableLerp: true });
    }
  }, [scrollRef, locomotiveScroll]);

  // Handle scroll locking when modal is open
  useEffect(() => {
    if (selectedArticle) {
      if (locomotiveScroll?.current) {
        locomotiveScroll.current.stop();
      }
      document.body.style.overflow = 'hidden';
    } else {
      if (locomotiveScroll?.current) {
        locomotiveScroll.current.start();
      }
      document.body.style.overflow = '';
    }
  }, [selectedArticle, locomotiveScroll]);

  useEffect(() => {
    const scrollerEl = scrollRef?.current;
    if (!scrollerEl) return undefined;

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const reveals = document.querySelectorAll('.reveal-text');
        reveals.forEach((el) => {
          gsap.fromTo(el,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                scroller: scrollerEl,
                start: 'top 85%',
              }
            }
          );
        });

        // Refresh ScrollTrigger after animations are set up
        ScrollTrigger.refresh();
      }, containerRef);

      return () => ctx.revert();
    }, 200);

    return () => clearTimeout(timer);
  }, [scrollRef]);

  return (
    <div className="expand-page" data-scroll-container ref={scrollRef}>
      <div ref={containerRef}>

        {/* 1. HERO SECTION (WHITE) */}
        <section className="section-white" data-scroll-section style={{ position: 'relative', overflow: 'hidden', paddingBottom: 0 }} data-bgcolor="#ffffff" data-textcolor="#0b0f1a">
          <div className="expand-label">Knowledge Base</div>
          <div className="hero-content-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="expand-title-hero reveal-text">
                INSIGHTS FOR<br />
                GROWTH.
              </h1>
              <p className="expand-text-lg reveal-text" style={{ color: '#333', marginTop: '2rem', maxWidth: '500px' }}>
                Strategies, tactics, and guides to help you scale your business in the digital age.
              </p>
            </div>
            <div className="hero-canvas-container">
              <CanvasAnimation />
            </div>
          </div>


        </section>

        {/* 2. ARTICLES SECTION (BLACK) */}
        <section className="section-black" data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff" style={{ marginTop: '-20vh', position: 'relative', zIndex: 2 }}>
          <div className="expand-label article-grid__label">Latest Articles</div>

          <div className="article-grid">
            {ARTICLES.map((article, index) => (
              <div
                className={`article-card theme-${article.theme} reveal-text`}
                key={index}
                onClick={() => setSelectedArticle(article)}
                style={{ cursor: 'pointer' }}
              >
                <div className="article-poster">
                  {article.posterContent}
                </div>
                <div className="article-category-bar">
                  {article.category}
                </div>
                <div className="article-content">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="article-meta">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <FullScreenModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />

        {/* 3. RESOURCES 3D GRID SECTION */}
        <section className="section-black" data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
          <div className="resources-heading-container reveal-text">
            <h2 className="resources-section-title">Learn how to transform your business in the age of AI.</h2>
          </div>
          <div className="resources-3d-grid">
            {RESOURCES_DATA.map((resource, index) => (
              <div key={index} className="reveal-text">
                <ResourceCard3D resource={resource} />
              </div>
            ))}
          </div>
        </section>

        {/* 4. NEWSLETTER SECTION (WHITE) */}
        <section className="section-white" data-scroll-section data-bgcolor="#ffffff" data-textcolor="#0b0f1a">
          <div className="newsletter-box reveal-text">
            <h2 className="expand-title-section">Stay ahead of the curve.</h2>
            <p className="expand-text-lg">
              Join 5,000+ founders receiving our weekly growth tactics. No fluff, just value.
            </p>
            <NewsletterForm />
          </div>
        </section>

        {/* FOOTER */}
        <section data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
          <Footer />
        </section>

      </div >
    </div >
  );
}

export default Resources;
