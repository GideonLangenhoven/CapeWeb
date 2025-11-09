import React, { useEffect } from 'react';
import '../styles/Hero.css';
import Typed from 'typed.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroCanvas from './HeroCanvas';

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  useEffect(() => {
    // Initialize Typed.js for the animated headline
    const typed = new Typed('.text', {
      strings: ['sell 24/7.', 'book meetings.', 'qualify leads.', 'handle support', 'sync to CRMs'],
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

    // Scroll-triggered animation for "Websites that" - increase size and letter spacing
    // NOTE: Hero is now outside Locomotive Scroll, using native scroll
    const websitesThatSpan = document.querySelector('.left-part h1 > span:first-child');
    if (websitesThatSpan) {
      const scrollAnimation = gsap.to(websitesThatSpan, {
        scale: 1.1,  // 10% increase in size
        letterSpacing: '0.25em',  // 25% increase in letter spacing
        transformOrigin: 'left center',  // Scale from the left so all words move
        scrollTrigger: {
          trigger: '.hero-container',
          // No scroller property - uses window/native scroll
          start: 'top top',
          end: 'bottom+=25% top',  // End 25% sooner
          scrub: 1,
          markers: false
        }
      });

      return () => {
        typed.destroy();
        if (scrollAnimation.scrollTrigger) {
          scrollAnimation.scrollTrigger.kill();
        }
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }

    return () => {
      typed.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="hero-container">
      <HeroCanvas />
      <div className="bg-decoration bg-decoration-1"></div>
      <div className="bg-decoration bg-decoration-2"></div>

      <div className="hero-content">
        <div className="left-part">
          <h1>
            <span>Websites that</span>
            <br />
            <span className="text"></span>
          </h1>
          <div className="cta-buttons">
            <a href="#ai-guide" className="btn btn-primary">Book a Discovery Call</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
