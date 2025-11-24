import React, { useEffect, useRef } from 'react';
import useLocomotiveScroll from '../hooks/useLocomotiveScroll';
import Footer from '../components/Footer';
import './Services.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Services() {
  // Initialize locomotive scroll with start=true
  const scrollRef = useLocomotiveScroll(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate elements on scroll
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
              scroller: containerRef.current, // Important: use the container ref
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
          <div className="expand-label">Our Expertise</div>
          <h1 className="expand-title-hero reveal-text">
            WE BUILD MEANINGFUL<br />
            CUSTOMER EXPERIENCES.
          </h1>
          <p className="expand-text-lg reveal-text" style={{ color: '#333', marginTop: '2rem' }}>
            We combine design, technology, and strategy to help ambitious brands grow faster.
          </p>
        </section>

        {/* 2. PILLARS SECTION (BLACK) */}
        <section className="section-black" data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
          <div className="expand-label" style={{ backgroundColor: '#fff', color: '#000' }}>Core Services</div>
          <h2 className="expand-title-section reveal-text">
            Everything you need<br />
            to scale online.
          </h2>

          <div className="services-grid">
            <div className="service-card reveal-text">
              <span className="service-card__icon">⚡️</span>
              <h3>Performance Dev</h3>
              <p>Custom websites and web apps built for speed. No bloat, just code that converts.</p>
              <ul>
                <li>React / Next.js Development</li>
                <li>Headless CMS (Sanity, Contentful)</li>
                <li>Shopify Plus Customization</li>
              </ul>
            </div>

            <div className="service-card reveal-text">
              <span className="service-card__icon">🤖</span>
              <h3>AI Automation</h3>
              <p>Replace busy work with intelligent systems. We build bots that work 24/7.</p>
              <ul>
                <li>Customer Support AI Agents</li>
                <li>Lead Qualification Chatbots</li>
                <li>Workflow Automation (Zapier/Make)</li>
              </ul>
            </div>

            <div className="service-card reveal-text">
              <span className="service-card__icon">📈</span>
              <h3>Growth & SEO</h3>
              <p>Data-driven strategies to get you found and keep you top of mind.</p>
              <ul>
                <li>Technical SEO Audits</li>
                <li>Conversion Rate Optimization</li>
                <li>Analytics & Tracking Setup</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. PROCESS SECTION (DEEP PURPLE) */}
        <section className="section-purple" data-scroll-section data-bgcolor="#240b36" data-textcolor="#ffffff">
          <div className="expand-label" style={{ backgroundColor: '#fff', color: '#000' }}>The Process</div>
          <h2 className="expand-title-section reveal-text">How we work.</h2>

          <div className="process-list">
            <div className="process-item reveal-text">
              <div className="process-num">01</div>
              <div className="process-content">
                <h3>Discovery & Strategy</h3>
                <p>We start by understanding your business goals, target audience, and current bottlenecks. We don't write a line of code until we have a solid plan.</p>
              </div>
            </div>

            <div className="process-item reveal-text">
              <div className="process-num">02</div>
              <div className="process-content">
                <h3>Design & Build</h3>
                <p>We design high-fidelity prototypes for your approval, then build them using modern, scalable tech stacks. Regular updates keep you in the loop.</p>
              </div>
            </div>

            <div className="process-item reveal-text">
              <div className="process-num">03</div>
              <div className="process-content">
                <h3>Launch & Optimize</h3>
                <p>We handle the deployment and ensure everything runs smoothly. Post-launch, we monitor performance and make data-backed improvements.</p>
              </div>
            </div>
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

export default Services;
