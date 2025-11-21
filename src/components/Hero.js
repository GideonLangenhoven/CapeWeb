import React, { useEffect, useRef } from 'react';
import '../styles/Hero.css';
import Typed from 'typed.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const heroRef = useRef(null);
  const leftPartRef = useRef(null);

  useEffect(() => {
    // Initialize Typed.js
    const typed = new Typed('.text', {
      strings: ['sell 24/7.', 'book meetings.', 'qualify leads.', 'handle support', 'sync to CRMs'],
      typeSpeed: 100,
      backSpeed: 40,
      loop: true
    });

    // GSAP animations for hero elements
    gsap.fromTo('.left-part h1',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', clearProps: 'all' }
    );

    gsap.fromTo('.cta-buttons',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: 'power3.out', clearProps: 'all' }
    );

    // Interactive Bubble Logic
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
    let animationFrameId;

    function move() {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      if (interBubble) {
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }
      animationFrameId = requestAnimationFrame(move);
    }

    const handleMouseMove = (event) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    move();

    // Hover Logic
    const handleMouseEnter = () => {
      if (heroRef.current) heroRef.current.classList.add('gradient-active');
    };

    const handleMouseLeave = () => {
      if (heroRef.current) heroRef.current.classList.remove('gradient-active');
    };

    const leftPart = leftPartRef.current;
    if (leftPart) {
      leftPart.addEventListener('mouseenter', handleMouseEnter);
      leftPart.addEventListener('mouseleave', handleMouseLeave);
    }

    // Scroll Animation
    const scrollContainer = document.querySelector('[data-scroll-container]');
    let scrollAnimation = null;
    const websitesThatSpan = document.querySelector('.left-part h1 > span:first-child');

    if (websitesThatSpan && scrollContainer) {
      scrollAnimation = gsap.to(websitesThatSpan, {
        scale: 1.1,
        letterSpacing: '0.25em',
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: '.hero-container',
          scroller: scrollContainer,
          start: 'top top',
          end: 'bottom+=25% top',
          scrub: 1,
          markers: false
        }
      });
    }

    return () => {
      typed.destroy();
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (leftPart) {
        leftPart.removeEventListener('mouseenter', handleMouseEnter);
        leftPart.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (scrollAnimation?.scrollTrigger) {
        scrollAnimation.scrollTrigger.kill();
      }
      // Only kill triggers created in this component, not global ones
      // ScrollTrigger.getAll().forEach(trigger => trigger.kill()); 
    };
  }, []);

  return (
    <section className="hero-container" data-scroll-section ref={heroRef}>
      <div className="gradient-bg">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <div className="interactive"></div>
        </div>
      </div>

      <div className="hero-content">
        <div className="left-part" ref={leftPartRef}>
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
