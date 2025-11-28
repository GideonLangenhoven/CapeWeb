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
    category: "Strategy",
    title: "The 2025 E-commerce Playbook",
    excerpt: "Why speed is the new currency and how to optimize your store for the next generation of shoppers.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    href: "/resources/2025-ecommerce-playbook"
  },
  {
    category: "Automation",
    title: "Stop Wasting Time on Email",
    excerpt: "How to set up intelligent auto-responders that actually sound human and convert leads while you sleep.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    href: "/resources/stop-wasting-time-email"
  },
  {
    category: "Design",
    title: "Minimalism is Not Dead",
    excerpt: "How to use negative space and bold typography to create a premium brand experience.",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    href: "/resources/minimalism-not-dead"
  }
];

function Resources() {
  const scrollRef = useLocomotiveScroll(true);
  const containerRef = useRef(null);

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
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    // REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLFgbHHM63wG-WrNwFrwzzLoj0kv6r7MD9RHPDFhTAVeS-8Y2UopbSVrzacie8GuZARg/exec';

    try {
      // We use no-cors because Google Scripts don't support CORS headers easily for simple POSTs
      // This means we won't get a readable response, but the data will be sent.
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Assume success if no network error
      setStatus('success');

      // Trigger Download
      const link = document.createElement('a');
      link.href = '/business-evolution-guide.pdf'; // Expecting the user to create this PDF
      link.download = 'business-evolution-guide.pdf';
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
    <div className="expand-page" data-scroll-container ref={scrollRef}>
      <div ref={containerRef}>

        {/* 1. HERO SECTION (WHITE) */}
        <section className="section-white" data-scroll-section>
          <div className="expand-label">Knowledge Base</div>
          <h1 className="expand-title-hero reveal-text">
            INSIGHTS FOR<br />
            GROWTH.
          </h1>
          <p className="expand-text-lg reveal-text" style={{ color: '#333', marginTop: '2rem' }}>
            Strategies, tactics, and guides to help you scale your business in the digital age.
          </p>
        </section>

        {/* 2. ARTICLES SECTION (BLACK) */}
        <section className="section-black" data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
          <div className="expand-label" style={{ backgroundColor: '#fff', color: '#000' }}>Latest Articles</div>

          <div className="resources-grid">
            {ARTICLES.map((article, index) => (
              <a href={article.href} className="resource-card reveal-text" key={index}>
                <div className="resource-card__image-wrap">
                  <img src={article.image} alt={article.title} className="resource-card__image" />
                </div>
                <span className="resource-card__cat">{article.category}</span>
                <h3 className="resource-card__title">{article.title}</h3>
                <p className="resource-card__excerpt">{article.excerpt}</p>
              </a>
            ))}
          </div>
        </section>

        {/* 3. FREE GUIDE LEAD GEN SECTION (ACCENT) */}
        <section className="section-accent" data-scroll-section data-bgcolor="#A64B23" data-textcolor="#ffffff">
          <div className="lead-gen-box reveal-text">
            <div className="lead-gen-content">
              <span className="eyebrow">Free Resource</span>
              <h2 className="expand-title-section">The Business Evolution Guide</h2>
              <p className="expand-text-lg">
                Learn how to transition your brick-and-mortar business into a scalable product-based empire using AI and social media.
              </p>
              <ul className="lead-gen-features">
                <li>✓ Why the old model is broken</li>
                <li>✓ How to productize your expertise</li>
                <li>✓ The social media content engine</li>
              </ul>
            </div>
            <div className="lead-gen-form-wrapper">
              <form className="lead-gen-form" onSubmit={handleSubmit}>
                <h3>Get your copy</h3>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="jane@example.com"
                  />
                </div>
                <button type="submit" className="btn-submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending...' : 'Download Guide'}
                </button>
                {status === 'success' && <p className="success-message">Success! Your download should start shortly.</p>}
                {status === 'error' && <p className="error-message">Something went wrong. Please try again.</p>}
              </form>
            </div>
          </div>
        </section>

        {/* 4. NEWSLETTER SECTION (DEEP PURPLE) */}
        <section className="section-purple" data-scroll-section data-bgcolor="#240b36" data-textcolor="#ffffff">
          <div className="newsletter-box reveal-text">
            <h2 className="expand-title-section">Stay ahead of the curve.</h2>
            <p className="expand-text-lg">
              Join 5,000+ founders receiving our weekly growth tactics. No fluff, just value.
            </p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="newsletter-input" required />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <section data-scroll-section>
          <Footer />
        </section>

      </div>
    </div>
  );
}

export default Resources;
