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
    <section className="hero-container">
      <div className="bg-decoration bg-decoration-1"></div>
      <div className="bg-decoration bg-decoration-2"></div>

      <div className="hero-content">
        <div className="left-part">
          <h1>
            <span>Websites that</span><br/>
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

        <div className="right-part">
          <div className="bg-line">
            <img src="/assets/text-infinity.svg" alt="Infinity text"/>
            <img src="/assets/text-infinity.svg" alt="Infinity text"/>
          </div>

          <div className="main-grid">
            <div className="d-flex">
              {/* 1: Text box */}
              <div className="box"><span>Web Design</span></div>

              {/* 2: Image */}
              <div className="box">
                <div className="bg-img">
                  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop" alt="Web development"/>
                </div>
              </div>

              {/* 3: Text box */}
              <div className="box"><span>AI Agents</span></div>

              {/* 4: Text box */}
              <div className="box"><span>Automation</span></div>

              {/* 5: Image */}
              <div className="box">
                <div className="bg-img">
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop" alt="Data and analytics"/>
                </div>
              </div>

              {/* 6: Image */}
              <div className="box">
                <div className="bg-img">
                  <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=600&fit=crop" alt="Automation workflows"/>
                </div>
              </div>

              {/* 7: Text */}
              <div className="box"><span>E‑Commerce</span></div>

              {/* 8: Image */}
              <div className="box">
                <div className="bg-img">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop" alt="Analytics dashboards"/>
                </div>
              </div>
            </div>

            <div className="bg-circle-h-line">
              <img src="/assets/circle-ring.svg" alt="Accent ring"/>
              <img src="/assets/circle-ring.svg" alt="Accent ring"/>
              <img src="/assets/circle-ring.svg" alt="Accent ring"/>
            </div>
            <div className="bg-dash-circle">
              <img src="/assets/dash-circle.svg" alt="Dashed rotating circle"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
