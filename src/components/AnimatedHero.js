import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/AnimatedHero.css';

gsap.registerPlugin(ScrollTrigger);

const AnimatedHero = () => {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    if (!wrapperEl) {
      return undefined;
    }

    let splitTrigger;
    const ctx = gsap.context(() => {
      // Animate the swipe reveals
      gsap.to(".anim-swipe", {
        yPercent: 300,
        delay: 0.2,
        duration: 3,
        stagger: {
          from: "random",
          each: 0.1
        },
        ease: "sine.out"
      });

      // Parallax effect on scroll
      gsap.to(".hero__image-cont > img", {
        scale: 1.5,
        xPercent: 20,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=3000px",
          scrub: true
        }
      });

      splitTrigger = ScrollTrigger.create({
        trigger: wrapperEl,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const shouldSplit = self.progress > 0.05;
          wrapperEl.classList.toggle("is-split", shouldSplit);
        },
        onLeave: () => {
          wrapperEl.classList.add("is-split");
        },
        onLeaveBack: () => {
          wrapperEl.classList.remove("is-split");
        }
      });
    }, wrapperEl);

    return () => {
      if (splitTrigger) {
        splitTrigger.kill();
      }
      ctx.revert();
      wrapperEl.classList.remove("is-split");
    };
  }, []);

  return (
    <div id="animated-hero-wrapper" ref={wrapperRef}>
      <div id="animated-hero-content" ref={contentRef}>
        <section className="hero">
          <div className="hero__inner constrain">
            <div className="hero__image-cont">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2400&q=80" alt="Hero" />
              <div className="anim-swipe"></div>
            </div>
            <div className="hero__image-cont">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2400&q=80" alt="Hero" />
              <div className="anim-swipe"></div>
            </div>
            <div className="hero__image-cont">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2400&q=80" alt="Hero" />
              <div className="anim-swipe"></div>
            </div>
            <div className="hero__image-cont">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2400&q=80" alt="Hero" />
              <div className="anim-swipe"></div>
            </div>
            <div className="hero__image-cont">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2400&q=80" alt="Hero" />
              <div className="anim-swipe"></div>
            </div>
            <div className="hero__image-cont">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2400&q=80" alt="Hero" />
              <div className="anim-swipe"></div>
            </div>
          </div>
        </section>

        <img
          className="scroll"
          srcSet="https://img.icons8.com/glyph-neue/128/ffffff/circled-down-2.png 2x"
          alt="scroll down"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default AnimatedHero;
