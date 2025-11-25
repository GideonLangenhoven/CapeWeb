import React, { useEffect, useRef } from 'react';
import useLocomotiveScroll from '../hooks/useLocomotiveScroll';
import useColorChange from '../hooks/useColorChange';
import Footer from '../components/Footer';
import './Services.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Services() {
  // Initialize locomotive scroll with start=true
  const scrollRef = useLocomotiveScroll(true);
  const containerRef = useRef(null);

  // Activate color transitions
  useColorChange(scrollRef);

  useEffect(() => {
    // Delay GSAP init to ensure Locomotive Scroll proxy is ready
    let ctx;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
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
                scroller: ".expand-page", // Use class selector
                start: 'top 85%',
              }
            }
          );
        });

        // Vertical Loop Logic
        const cols = gsap.utils.toArray(".v-loop-col", containerRef.current);
        const additionalY = { val: 0 };
        let additionalYAnim;
        let offset = 0;

        cols.forEach((col, i) => {
          const images = Array.from(col.children);

          // DUPLICATE IMAGES FOR LOOP
          images.forEach((image) => {
            var clone = image.cloneNode(true);
            col.appendChild(clone);
          });

          // SET ANIMATION
          // Re-select items after cloning
          const items = Array.from(col.children);

          items.forEach((item) => {
            let columnHeight = item.parentElement.clientHeight;
            let direction = i % 2 !== 0 ? "+=" : "-="; // Change direction for odd columns

            gsap.to(item, {
              y: direction + Number(columnHeight / 2),
              duration: 20,
              repeat: -1,
              ease: "none",
              modifiers: {
                y: gsap.utils.unitize((y) => {
                  if (direction === "+=") {
                    offset += additionalY.val;
                    y = (parseFloat(y) - offset) % (columnHeight * 0.5);
                  } else {
                    offset += additionalY.val;
                    y = (parseFloat(y) + offset) % -Number(columnHeight * 0.5);
                  }
                  return y;
                })
              }
            });
          });
        });

        // Scroll Velocity Trigger
        ScrollTrigger.create({
          trigger: ".v-loop-section",
          scroller: ".expand-page",
          start: "top bottom",
          end: "bottom top",
          onUpdate: function (self) {
            const velocity = self.getVelocity();
            if (velocity > 0) {
              if (additionalYAnim) additionalYAnim.kill();
              additionalY.val = -velocity / 2000;
              additionalYAnim = gsap.to(additionalY, { val: 0 });
            }
            if (velocity < 0) {
              if (additionalYAnim) additionalYAnim.kill();
              additionalY.val = -velocity / 3000;
              additionalYAnim = gsap.to(additionalY, { val: 0 });
            }
          }
        });

        // Refresh ScrollTrigger and Locomotive Scroll after setup
        ScrollTrigger.refresh();

      }, containerRef);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) {
        ctx.revert();
      }
    };
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

        {/* 2.5 VERTICAL LOOP SECTION */}
        <section className="v-loop-section" data-scroll-section>
          <h1 className="v-loop-title">Accelerating<br />Digital Growth</h1>

          <div className="v-loop-gallery">
            <div className="v-loop-col">
              <div className="v-loop-image">
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" alt="Cyberpunk City" />
              </div>
              <div className="v-loop-image">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" alt="Technology" />
              </div>
              <div className="v-loop-image">
                <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop" alt="Matrix Code" />
              </div>
            </div>
            <div className="v-loop-col">
              <div className="v-loop-image">
                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" alt="Retro Tech" />
              </div>
              <div className="v-loop-image">
                <img src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1887&auto=format&fit=crop" alt="Abstract Shapes" />
              </div>
              <div className="v-loop-image">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop" alt="Liquid Metal" />
              </div>
            </div>
            <div className="v-loop-col">
              <div className="v-loop-image">
                <img src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1887&auto=format&fit=crop" alt="Neon Lights" />
              </div>
              <div className="v-loop-image">
                <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop" alt="Abstract Fluid" />
              </div>
              <div className="v-loop-image">
                <img src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop" alt="Data Visualization" />
              </div>
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
