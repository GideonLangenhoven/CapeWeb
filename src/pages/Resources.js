import React, { useEffect, useRef, useState } from 'react';
import useLocomotiveScroll from '../hooks/useLocomotiveScroll';
import useColorChange from '../hooks/useColorChange';
import Footer from '../components/Footer';
import './Resources.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ARTICLES = [
  {
    category: "AI Strategy",
    title: "The AI Advantage: Why Speed Wins",
    excerpt: "In the age of AI, being second is the same as being last. Learn why implementation speed matters more than perfection.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    content: `
      <h2>The Speed of AI Adoption</h2>
      <p>The business landscape is shifting faster than ever before. Traditional 5-year plans are obsolete. In the age of AI, the companies that win are the ones that can iterate, adapt, and deploy new technologies at lightning speed.</p>
      <h3>Perfection is the Enemy</h3>
      <p>Many businesses wait for the "perfect" AI strategy. But AI evolves weekly. By the time you perfect your plan, the technology has changed. The winning strategy is "deploy and refine".</p>
      <h3>The First-Mover Advantage</h3>
      <p>Those who integrate AI agents and automation now are building a data moat that competitors cannot cross. They are learning what works while others are still holding meetings about it.</p>
    `
  },
  {
    category: "Automation",
    title: "The End of the 9-to-5",
    excerpt: "How automated workflows are decoupling time from value creation, and what this means for the future of work.",
    image: "https://images.unsplash.com/photo-1488229297570-58520851e868?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    content: `
      <h2>Decoupling Time from Value</h2>
      <p>For centuries, we've equated work with hours. You get paid for the time you sit at a desk. Automation breaks this link.</p>
      <h3>The 24/7 Workforce</h3>
      <p>With AI agents handling customer support, lead qualification, and data entry, your business effectively runs 24/7. Your value creation is no longer limited by your need to sleep.</p>
      <h3>Focus on High-Leverage Work</h3>
      <p>This doesn't mean humans are obsolete. It means humans are freed to focus on strategy, creativity, and relationship building—the things AI cannot do (yet).</p>
    `
  },
  {
    category: "Business Growth",
    title: "Scaling Without Headcount",
    excerpt: "The new unicorn companies will have fewer than 10 employees. Here is how to build a lean, high-revenue operation.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    content: `
      <h2>The One-Person Unicorn</h2>
      <p>Sam Altman predicted that we will soon see the first one-person billion-dollar company. This is only possible through extreme leverage.</p>
      <h3>The Tech Stack as a Team</h3>
      <p>Instead of hiring a marketing department, you hire an AI marketing stack. Instead of a support team, you deploy an AI agent. The modern org chart is a mix of humans and silicon.</p>
      <h3>Profitability over Revenue</h3>
      <p>By keeping headcount low and revenue high, you maximize profitability and agility. You can pivot instantly without the inertia of a large workforce.</p>
    `
  }
];

const FullScreenModal = ({ article, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!article) return null;

  return (
    <div className="article-modal-overlay" onClick={onClose}>
      <div className="article-modal-content" onClick={e => e.stopPropagation()}>
        <button className="article-modal-close" onClick={onClose}>×</button>
        <div className="article-modal-header" style={{ backgroundImage: `url(${article.image})` }}>
          <div className="article-modal-header-content">
            <span className="article-category">{article.category}</span>
            <h1>{article.title}</h1>
          </div>
        </div>
        <div className="article-modal-body" dangerouslySetInnerHTML={{ __html: article.content }} />
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
    readTime: "8 min read"
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
    readTime: "10 min read"
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
    readTime: "15 min read"
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
    readTime: "12 min read"
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
    readTime: "20 min read"
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
        <div className="card-front">
          <div className="card-image-wrapper">
            <span className="card-category-badge">{resource.category}</span>
            <img src={resource.image} alt={resource.title} className="card-image" />
            <div className="card-overlay"></div>
          </div>
          <div className="card-stats-container">
            <h3 className="card-title">{resource.title}</h3>
            <span className="card-subtitle">{resource.subtitle}</span>

            <div className="card-meta-row">
              <span className="meta-item">⏱ {resource.readTime}</span>
              <span className="meta-item">📄 PDF Guide</span>
            </div>

            <p className="card-front-quote">{resource.quote}</p>

            <button className="view-details-btn" onClick={() => setIsFlipped(true)}>
              View Details
            </button>
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

    const update = () => {
      for (let y = 0; y < canvas.height; y += 30) {
        const grad = ctx.createLinearGradient(0, y + 50, 0, y - 70);
        grad.addColorStop(0, "gray");
        grad.addColorStop(1, "white");
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
      }
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
  const scrollRef = useLocomotiveScroll(true);
  const containerRef = useRef(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useColorChange(scrollRef);

  useEffect(() => {
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
              scroller: containerRef.current,
              start: 'top 85%',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

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

          <div className="hero-footer-text reveal-text" style={{ marginTop: 'auto', paddingTop: '4rem', paddingBottom: '10rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.1' }}>Businesses and automation go hand in hand</h2>
            <p className="expand-text-lg" style={{ opacity: 0.8 }}>Click below to find out more</p>
          </div>
        </section>

        {/* 2. ARTICLES SECTION (BLACK) */}
        <section className="section-black" data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
          <div className="expand-label" style={{ backgroundColor: '#fff', color: '#000' }}>Latest Articles</div>

          <div className="resources-grid">
            {ARTICLES.map((article, index) => (
              <div
                className="resource-card reveal-text"
                key={index}
                onClick={() => setSelectedArticle(article)}
                style={{ cursor: 'pointer' }}
              >
                <div className="resource-card__image-wrap">
                  <img src={article.image} alt={article.title} className="resource-card__image" />
                </div>
                <span className="resource-card__cat">{article.category}</span>
                <h3 className="resource-card__title">{article.title}</h3>
                <p className="resource-card__excerpt">{article.excerpt}</p>
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

      </div>
    </div>
  );
}

export default Resources;
