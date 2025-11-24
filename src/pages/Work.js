import React, { useEffect, useRef } from 'react';
import useLocomotiveScroll from '../hooks/useLocomotiveScroll';
import Footer from '../components/Footer';
import './Work.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
    {
        title: "Neon Commerce",
        description: "A complete Shopify Plus overhaul for a leading streetwear brand, resulting in a 45% increase in mobile conversions.",
        tags: ["Shopify", "UX/UI", "Performance"],
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
        title: "Apex Finance",
        description: "Custom dashboard and CRM integration for a financial services firm. Automated 20+ hours of weekly admin work.",
        tags: ["Web App", "Automation", "React"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
        title: "Lumina Art",
        description: "Immersive WebGL gallery experience. A digital showcase that matches the prestige of the physical art pieces.",
        tags: ["WebGL", "3D", "Experience"],
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
];

function Work() {
    const scrollRef = useLocomotiveScroll(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax for images
            const images = document.querySelectorAll('.project-card__image');
            images.forEach((img) => {
                gsap.to(img, {
                    y: '-20%', // Move image up slightly as we scroll down
                    ease: 'none',
                    scrollTrigger: {
                        trigger: img.parentElement,
                        scroller: containerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            });

            // Text reveals
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
                            scroller: containerRef.current,
                            start: 'top 85%',
                        }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="expand-page" data-scroll-container ref={scrollRef}>
            <div ref={containerRef}>

                {/* 1. HERO SECTION (WHITE) */}
                <section className="section-white" data-scroll-section>
                    <div className="expand-label">Selected Projects</div>
                    <h1 className="expand-title-hero reveal-text">
                        OUR WORK SPEAKS<br />
                        FOR ITSELF.
                    </h1>
                    <p className="expand-text-lg reveal-text" style={{ color: '#333', marginTop: '2rem' }}>
                        We don't just make things look pretty. We build digital products that drive real business results.
                    </p>
                </section>

                {/* 2. PROJECTS SECTION (BLACK) */}
                <section className="section-black" data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
                    <div className="projects-list">
                        {PROJECTS.map((project, index) => (
                            <div className="project-card" key={index}>
                                <div className="project-card__image-wrap">
                                    <img src={project.image} alt={project.title} className="project-card__image" />
                                </div>
                                <div className="project-card__info reveal-text">
                                    <div>
                                        <h2 className="project-card__title">{project.title}</h2>
                                        <div className="project-card__meta">
                                            {project.tags.map(tag => <span key={tag} className="project-tag">{tag}</span>)}
                                        </div>
                                    </div>
                                    <p className="project-card__desc">{project.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. CTA SECTION (DEEP PURPLE) */}
                <section className="section-purple work-cta" data-scroll-section data-bgcolor="#240b36" data-textcolor="#ffffff">
                    <div className="expand-label" style={{ backgroundColor: '#fff', color: '#000' }}>Next Step</div>
                    <h2 className="expand-title-section reveal-text">Ready to build your<br />success story?</h2>
                    <a href="/contact" className="work-cta__btn reveal-text">Start a Project</a>
                </section>

                {/* FOOTER */}
                <section data-scroll-section>
                    <Footer />
                </section>

            </div>
        </div>
    );
}

export default Work;
