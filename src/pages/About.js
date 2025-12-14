import React, { useEffect, useRef } from 'react';
import useLocomotiveScroll from '../hooks/useLocomotiveScroll';
import Footer from '../components/Footer';
import './About.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function About() {
    const { scrollRef } = useLocomotiveScroll(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const scroller = scrollRef.current;
        if (!scroller) return;

        const ctx = gsap.context(() => {
            // Parallax effect for mountain line
            gsap.to('.about-hero__mountain', {
                y: 100,
                scrollTrigger: {
                    trigger: '.about-hero',
                    scroller,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // Reveal animations
            const sections = document.querySelectorAll('.reveal-text');
            sections.forEach(section => {
                gsap.fromTo(section,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        scrollTrigger: {
                            trigger: section,
                            scroller,
                            start: 'top 80%',
                        }
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, [scrollRef]);

    return (
        <div className="about-page" data-scroll-container ref={scrollRef}>
            <div ref={containerRef}>

                {/* HERO SECTION - WHITE */}
                <section className="about-hero" data-scroll-section>
                    <div className="about-hero__mountain">
                        <svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 150 C 150 140, 250 140, 350 100 C 400 80, 420 60, 450 60 C 480 60, 500 80, 550 80 C 600 80, 650 60, 750 150" />
                        </svg>
                    </div>
                    <div className="about-hero__label">Our Why</div>
                    <h1 className="about-hero__title">
                        Born in Cape Town,<br />
                        EXPANDed globally.
                    </h1>
                    <p className="about-hero__subtitle">A partner to ambitious brands.</p>
                </section>

                {/* INTRO SECTION - BLACK */}
                <section className="about-intro" data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
                    <div className="about-intro__label">Building Modern Brands</div>
                    <h2 className="about-intro__headline reveal-text">
                        Growing businesses through<br />
                        impactful experiences.
                    </h2>
                    <p className="about-intro__text reveal-text">
                        Today, people choose companies that deliver customer experiences tailored to their needs.
                        EXPAND transforms businesses by designing these exceptional experiences, driven by strong creativity
                        and backed by the technology, data, and strategic planning needed for operational success.
                    </p>
                    <a href="/gallery" className="about-intro__cta reveal-text">
                        View Our Work
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </section>

                {/* FOUNDERS SECTION - IMAGE */}
                <section className="about-founders" data-scroll-section>
                    <img
                        className="about-founders__img"
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="The Founders"
                        data-scroll
                        data-scroll-speed="-2"
                    />
                    <div className="about-founders__overlay">
                        <h2 className="about-founders__title" data-scroll data-scroll-speed="1">
                            FOU<br />NDERS
                        </h2>
                    </div>
                </section>

                {/* VALUES SECTION - DEEP PURPLE */}
                <section className="about-values" data-scroll-section data-bgcolor="#240b36" data-textcolor="#ffffff">
                    <div className="about-values__label">Our Values</div>
                    <h2 className="about-values__headline reveal-text">Beyond words.</h2>
                    <p className="about-values__desc reveal-text">
                        Our values have run deep through our company culture since we started.
                        This list continues to evolve, strengthen and serves as our guide.
                    </p>

                    <div className="about-values__list">
                        <div className="reveal-text">
                            <span className="about-values__word">EXPAND</span>
                            <div className="about-values__detail">RELATIONSHIP</div>
                            <p>Build trust, encourage collaboration, and create lasting connections.</p>
                        </div>
                    </div>
                </section>

                <section data-scroll-section>
                    <Footer />
                </section>

            </div>
        </div>
    );
}

export default About;
