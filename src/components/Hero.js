import React, { useEffect } from 'react';
import '../styles/Hero.css';
import Typed from 'typed.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

    // Hover effect for shapes
    const leftPart = document.querySelector('.left-part');
    const heroContainer = document.querySelector('.hero-container');
    let isHovering = false;

    const handleMouseMove = (evt) => {
      if (!isHovering) return;

      const mouseX = evt.clientX;
      const mouseY = evt.clientY;

      gsap.set(".hero-cursor", {
        x: mouseX,
        y: mouseY
      });

      gsap.to(".hero-shape", {
        x: mouseX,
        y: mouseY,
        stagger: -0.1
      });
    };

    const handleMouseEnter = () => {
      isHovering = true;
      heroContainer.classList.add('shapes-active');
    };

    const handleMouseLeave = () => {
      isHovering = false;
      heroContainer.classList.remove('shapes-active');
    };

    if (leftPart) {
      leftPart.addEventListener('mouseenter', handleMouseEnter);
      leftPart.addEventListener('mouseleave', handleMouseLeave);
    }

    document.body.addEventListener("mousemove", handleMouseMove);

    // Get the scroll container for proper scroller reference
    const scrollContainer = document.querySelector('[data-scroll-container]');

    // Scroll-triggered animation for "Websites that" - increase size and letter spacing
    let scrollAnimation = null;
    const websitesThatSpan = document.querySelector('.left-part h1 > span:first-child');
    if (websitesThatSpan && scrollContainer) {
      scrollAnimation = gsap.to(websitesThatSpan, {
        scale: 1.1,  // 10% increase in size
        letterSpacing: '0.25em',  // 25% increase in letter spacing
        transformOrigin: 'left center',  // Scale from the left so all words move
        scrollTrigger: {
          trigger: '.hero-container',
          scroller: scrollContainer,
          start: 'top top',
          end: 'bottom+=25% top',  // End 25% sooner
          scrub: 1,
          markers: false
        }
      });
    }

    // Single cleanup function
    return () => {
      typed.destroy();
      if (leftPart) {
        leftPart.removeEventListener('mouseenter', handleMouseEnter);
        leftPart.removeEventListener('mouseleave', handleMouseLeave);
      }
      document.body.removeEventListener("mousemove", handleMouseMove);
      if (scrollAnimation?.scrollTrigger) {
        scrollAnimation.scrollTrigger.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="hero-container" data-scroll-section>
      <div className="hero-cursor"></div>
      <div className="hero-shapes">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
      </div>
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
