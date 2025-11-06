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

    // Scroll-triggered animation for h1 - add spacing and zoom
    const scrollAnimation = gsap.to('.left-part h1', {
      letterSpacing: '0.5em',
      scale: 1.5,
      opacity: 0.3,
      scrollTrigger: {
        trigger: '.hero-container',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: false
      }
    });

    // Scroll-triggered animation for individual h1 spans (words zoom incrementally)
    const h1Spans = gsap.utils.toArray('.left-part h1 > span');
    h1Spans.forEach((span, index) => {
      gsap.to(span, {
        scale: 2 + (index * 0.5),
        opacity: 0,
        scrollTrigger: {
          trigger: '.hero-container',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          markers: false
        }
      });
    });

    return () => {
      typed.destroy();
      if (scrollAnimation.scrollTrigger) {
        scrollAnimation.scrollTrigger.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="hero-container" data-scroll-section>
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
            <a href="#contact" className="btn btn-primary">Get a Free Site Audit</a>
            <a href="#work" className="btn btn-secondary">See Our Work</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
