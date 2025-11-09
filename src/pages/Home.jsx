import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroCanvas from '../components/HeroCanvas';
import './home-sections.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const problemRef = useRef(null);
  const keyholeRef = useRef(null);

  useEffect(() => {
    // ====== Gradient Wipe (#problem)
    const section = problemRef.current;
    if (section) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.set(section, {'--target': prefersReduced ? '0%' : '100%'});
      if (!prefersReduced) {
        const tween = gsap.to(section, {
          '--target': '0%',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=1500',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate(self) {
              if (self.progress > 0.95) section.setAttribute('data-progress','complete');
              else section.removeAttribute('data-progress');
            }
          }
        });
        return () => {
          tween?.scrollTrigger?.kill();
          tween?.kill();
        };
      }
    }
  }, []);

  useEffect(() => {
    // ====== Keyhole Reveal (#keyhole)
    const wrap = keyholeRef.current;
    if (!wrap) return;
    const keyhole = wrap.querySelector('.keyhole');
    const content = wrap.querySelector('.keyhole-section__content');
    const arrow = wrap.querySelector('.arrow');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top bottom',
        end: 'top 40%',
        scrub: .6
      }
    });

    tl.fromTo(keyhole,
      { clipPath: 'inset(49% 49% 49% 49% round 80px)' },
      { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out' }
    ).fromTo(content,
      { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
      { opacity: 1, clipPath: 'inset(0 0 0 0)', ease: 'power2.out' },
      0
    );

    if (arrow) {
      gsap.to(arrow, {
        opacity: 0,
        scrollTrigger: {
          trigger: wrap,
          start: 'top 70%',
          end: 'top 50%',
          scrub: true
        }
      });
    }

    return () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  useEffect(() => {
    // Ensure GSAP re-measures after your canvas finishes its first render
    const onLoaded = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoaded);
    return () => window.removeEventListener('load', onLoaded);
  }, []);

  return (
    <main>
      {/* 0) HERO CANVAS - Using HeroCanvas component with WebGL fallback */}
      <section id="hero" aria-label="Interactive 3D hero">
        <HeroCanvas />
      </section>

      {/* 1) GRADIENT WIPE (Problem / Solution) */}
      <section id="problem" ref={problemRef} aria-label="Problem & Solution">
        <div className="section-inner">
          <div className="problem-content">
            <div className="section-top">
              <a href="#problem" className="kicker"><span className="dot" aria-hidden="true"></span> About</a>
              <a href="#contact" className="cta">Come play with us <span className="arr">→</span></a>
            </div>
            <h1 className="display-hero">
              Driving Brand <span className="hl hl-pink">Growth</span> Through Strategic
              <span className="hl hl-cyan"> Engagement</span> and
              <span className="hl hl-yellow"> Meaningful Connections</span>.
            </h1>
            <p className="subhead">We design, market, and automate experiences that turn attention into revenue.</p>
            <div className="stakes subhead small">Slow sites and manual tasks cost customers. Let's fix both.</div>
          </div>

          <div className="solution-content" aria-hidden="true">
            <div className="section-top" style={{visibility:'hidden'}}><span></span><span></span></div>
            <h1 className="display-hero">
              Build a site that <span className="hl hl-green">sells</span> while you sleep.
            </h1>
            <p className="subhead">Fast UX, clean code, smart automation—deployed together.</p>
            <ul className="subhead bullets">
              <li>Lightning-fast pages that convert</li>
              <li>AI workflows for bookings & follow-ups</li>
              <li>SEO that brings buyers, not just browsers</li>
              <li>Continuous optimisation post-launch</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2) KEYHOLE */}
      <section id="keyhole" ref={keyholeRef} className="keyhole-section" aria-label="Keyhole Reveal">
        <span className="keyhole" aria-hidden="true"></span>
        <span className="arrow" aria-hidden="true">
          <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-5 -5 30 30">
            <path d="M 0 10 H 20 L 10 0 M 20 10 L 10 20" strokeWidth="4" strokeLinecap="square" strokeLinejoin="round"></path>
          </svg>
        </span>

        <figure className="keyhole-section__figure">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=1600&fit=crop"
            alt="Team collaboration" width="1600" height="1600"
          />
        </figure>

        <div className="keyhole-section__content">
          <h2>Meet your <span className="hl">digital dream team</span>.</h2>
          <p>We turn "our site doesn't convert" into growth—design, dev, SEO and automation under one roof.</p>
        </div>
      </section>

      {/* 3) LOGO RIBBON + REST OF HOMEPAGE (unchanged) */}
      {/* Example: <LogoRibbon logos={homeData.clientLogos} /> */}
      {/* Your existing sections continue here... */}
    </main>
  );
}
