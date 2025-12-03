import React, { useEffect, useRef } from 'react';
import useLocomotiveScroll from '../hooks/useLocomotiveScroll';
import useColorChange from '../hooks/useColorChange';
import Footer from '../components/Footer';
import ScrollStackedCards from '../components/ScrollStackedCards';
import './Services.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Services() {
  // Initialize locomotive scroll with start=true, smooth=false (native scroll)
  const { scrollRef, locomotiveScroll } = useLocomotiveScroll(true, false);
  const containerRef = useRef(null);
  const heroRef = useRef(null);

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
                // scroller: ".expand-page", // Removed for native scroll
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
          // scroller: ".expand-page", // Removed for native scroll
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

    // Hero Services Animation
    const heroCtx = gsap.context(() => {
      const colors = [
        "#ffcc55",
        "#f0b4fa",
        "#0000fe",
        "#385a1d",
        "#e277af",
        "#e4e4e4"
      ];

      const boxes = gsap.utils.toArray('.hero-services .box');
      const tagline = document.querySelector('.hero-services .tagline');

      if (tagline && boxes.length > 0) {
        // Custom Split Text Logic
        const text = tagline.innerText;
        tagline.innerHTML = '';
        const words = text.split(' ');

        words.forEach((word, i) => {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.innerText = word;
          wordSpan.className = 'word';
          tagline.appendChild(wordSpan);

          // Add actual space character between words
          if (i < words.length - 1) {
            tagline.appendChild(document.createTextNode(' '));
          }
        });

        const wordSpans = tagline.querySelectorAll('.word');

        // Animation Setup
        const masterTL = gsap.timeline({
          delay: 0.2,
          scrollTrigger: {
            trigger: ".hero-services",
            // scroller: ".expand-page", // Removed for native scroll
            start: "top 80%",
          }
        });

        // 1. Assign colors to boxes
        gsap.set(boxes, {
          backgroundColor: gsap.utils.wrap(colors)
        });

        // 2. Box Distribution
        const boxDist = gsap.utils.distribute({
          base: -260,
          amount: 520,
          ease: "none"
        });

        const boxY = gsap.utils.distribute({
          base: gsap.utils.random(-140, -80),
          amount: gsap.utils.random(280, 520),
          ease: "none"
        });

        const boxScaleY = gsap.utils.distribute({
          base: 0.85,
          amount: 0.75,
          ease: "expo.inOut"
        });

        // 3. Box Animation
        const boxTL = gsap.timeline().from(boxes, {
          x: boxDist,
          y: boxY,
          opacity: 0,
          scaleY: boxScaleY,
          scaleX: 1,
          stagger: {
            each: 0.05,
            from: "center"
          },
          duration: 2.4,
          ease: "power3.out"
        });

        // 4. Text Reveal
        const splitTL = gsap.timeline().from(wordSpans, {
          y: 40,
          opacity: 0,
          duration: 0.5,
          stagger: 0.02,
          ease: "power2.out"
        });

        masterTL.add(boxTL).add(splitTL, "-=1.15");

        // 5. Continuous bar pulse
        const pulseTL = gsap.timeline({
          repeat: -1,
          yoyo: true,
          defaults: { ease: "sine.inOut" }
        });

        pulseTL.to(boxes, {
          duration: 1.6,
          scaleY: () => gsap.utils.random(0.7, 1.7),
          scaleX: 1,
          y: () => gsap.utils.random(-30, 30),
          stagger: { each: 0.12, from: "edges" }
        }).to(boxes, {
          duration: 1.2,
          scaleY: () => gsap.utils.random(0.8, 1.6),
          scaleX: 1,
          y: () => gsap.utils.random(-40, 20),
          stagger: { each: 0.12, from: "center" }
        });

        // De-sync the loop so bars move independently
        pulseTL.progress(Math.random());

        // 6. Ripple Hover Effects
        boxes.forEach((box, i) => {
          box.addEventListener('mouseenter', () => {
            // Animate all boxes based on distance
            boxes.forEach((b, j) => {
              const distance = Math.abs(i - j);
              const delay = distance * 0.05; // Ripple delay

              // Decay effect: further boxes move less
              const intensity = Math.max(0, 1 - distance * 0.2);

              if (intensity > 0) {
                gsap.to(b, {
                  y: gsap.utils.random(-30, -10) * intensity,
                  scaleY: 1 + (gsap.utils.random(0.05, 0.2) * intensity),
                  scaleX: 1,
                  duration: 0.4,
                  delay: delay,
                  ease: "power2.out",
                  overwrite: "auto"
                });
              }
            });
          });

          box.addEventListener('mouseleave', () => {
            // Reset all boxes
            gsap.to(boxes, {
              y: 0,
              scaleY: 1,
              scaleX: 1,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto"
            });
          });
        });
      }
    }, containerRef); // Scope to container

    // Force white background on mount to prevent black flash
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#0b0f1a';

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
      heroCtx.revert();
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
          <div className="hero-services" ref={heroRef}>
            <div className="graphic">
              <div className="box"></div>
              <div className="box"></div>
              <div className="box"></div>
              <div className="box"></div>
              <div className="box"></div>
              <div className="box"></div>
            </div>

            <h1 className="tagline">
              {/* We will populate this via JS or render it split here */}
              Everything you need to scale online.
            </h1>
          </div>
        </section>

        {/* New Scroll Stacked Cards Section - Isolated */}
        <section className="section-black" data-scroll-section>
          <ScrollStackedCards locomotiveScroll={locomotiveScroll} />
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

        {/* FOOTER */}
        <section data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
          <Footer />
        </section>

      </div>
    </div>
  );
}

export default Services;
