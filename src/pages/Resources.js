import React, { useEffect, useRef } from 'react';
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

        {/* 3. NEWSLETTER SECTION (DEEP PURPLE) */}
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
