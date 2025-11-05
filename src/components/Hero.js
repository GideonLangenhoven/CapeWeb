import React, { useEffect } from 'react';
import '../styles/Hero.css';
import Typed from 'typed.js';
import gsap from 'gsap';

function Hero() {
  useEffect(() => {
    // Initialize Typed.js for the animated headline
    const typed = new Typed('.text', {
      strings: ['sell 24/7.', 'book meetings.', 'qualify leads.', 'handle support.', 'sync to your CRM.'],
      typeSpeed: 100,
      backSpeed: 40,
      loop: true
    });

    // GSAP animations for hero elements with explicit end states
    gsap.fromTo('.left-part h1',
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        clearProps: 'all'
      }
    );

    gsap.fromTo('.subtitle, .hero-description',
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.3,
        stagger: 0.2,
        ease: 'power3.out',
        clearProps: 'all'
      }
    );

    gsap.fromTo('.cta-buttons',
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
        clearProps: 'all'
      }
    );

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <section className="hero-container" data-scroll-section>
      <div className="bg-decoration bg-decoration-1"></div>
      <div className="bg-decoration bg-decoration-2"></div>

      <div className="hero-content">
        <div className="left-part">
          <h1>
            <span>Websites that</span>
            <br />
            <span className="text"></span>
          </h1>
          <p className="subtitle">
            We build websites and AI workflows that automate what you'd rather not do manually.
          </p>
          <p className="hero-description">
            From custom-built sites to chat agents, booking flows, and lead pipelines — we help Cape Town businesses
            run leaner and grow faster with smart automation.
          </p>
          <div className="cta-buttons">
            <a href="#contact" className="btn btn-primary">Get a Free Site Audit</a>
            <a href="#work" className="btn btn-secondary">See Our Work</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
