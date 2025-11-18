import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import './Home.css';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Static content ---------- */
const planSteps = [
  { title: 'Discovery Call', description: 'Share your goals and bottlenecks so we understand what growth looks like for you.' },
  { title: 'Custom Growth Plan', description: 'Review a tailored website and automation roadmap that removes friction for your customers.' },
  { title: 'Launch & Grow', description: 'We build, launch, and monitor your new system so it keeps converting while you stay focused.' }
];

const benefits = [
  'layouts that stay fast and responsive on every device.',
  'Automated follow-ups, bookings, and handoffs that free your team from manual busywork.',
  'Cape Town specialists who stay close after launch with proactive optimisation.'
];

const carouselItems = [
  {
    title: 'Conversion',
    description: 'Layouts designed to turn visitors into customers with responsive design that works on every device.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop'
  },
  {
    title: 'Automation',
    description: 'Smart systems handle follow-ups, bookings, and workflows so your team can focus on growth.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'
  },
  {
    title: 'Support',
    description: 'Cape Town specialists provide ongoing optimisation and proactive improvements after launch.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Analytics',
    description: 'Track performance and gain insights that drive continuous improvement and business growth.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
  }
];

const testimonials = [
  { quote: 'Capeweb rebuilt our site and automated bookings — qualified enquiries jumped 42% in the first month.', name: 'Anika Jacobs', role: 'Owner, Atlantic Legal' },
  { quote: 'The new site feels like an extra salesperson. Automations send quotes before we even pick up the phone.', name: 'Sipho Moyo', role: 'Director, Harbour Manufacturing' },
  { quote: 'We finally have a dashboard that shows where leads come from and what to fix next. Game changer.', name: 'Megan Daniels', role: 'Marketing Lead, CapeFit Studios' }
];

const services = [
  { title: 'Growth Websites', description: 'Modern, mobile-first sites built to turn visitors into booked calls.' },
  { title: 'AI Sales Assistants', description: 'Chatbots and email follow-ups that answer instantly and nurture prospects.' },
  { title: 'Automation Audits', description: 'Map manual workflows and deploy the right integrations to save hours weekly.' },
  { title: 'Content Systems', description: 'SEO and landing page packs that keep your pipeline full without guesswork.' },
  { title: 'Care & Optimisation', description: 'Ongoing analytics, A/B tests, and fixes so performance keeps climbing.' }
];

const faqs = [
  {
    question: 'How quickly can we launch?',
    answer: 'Most projects launch within six to eight weeks depending on scope. During discovery we map milestones so you know exactly what happens when.'
  },
  {
    question: 'Do you only work with Cape Town companies?',
    answer: 'We specialise in serving South African SMEs and meet locally when possible, but we also collaborate remotely with teams across the country.'
  },
  {
    question: 'What if we just need improvements, not a full rebuild?',
    answer: 'That is common. We can audit your current site, prioritise quick wins, and phase bigger updates so you see value fast.'
  },
  {
    question: 'Can you integrate with our existing CRM and tools?',
    answer: 'Yes. We routinely connect websites to HubSpot, Zoho, Xero, and industry-specific systems to keep data flowing automatically.'
  },
  {
    question: 'What does support look like after launch?',
    answer: 'You get training, documentation, and a care plan so updates, experiments, and troubleshooting are handled without the back-and-forth.'
  }
];

/* ============================================================
   Home
   ============================================================ */
function Home() {
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Refs
  const problemRef = useRef(null);             // pinned gradient section (window scroller)
  const locoContainerRef = useRef(null);       // everything after #problem
  const locoRef = useRef(null);                // guard against double-init (StrictMode)
  const slideRef = useRef(null);

  /* -----------------------------------------------------------
     1) Motiontricks-style pinned gradient (window scroller)
  ----------------------------------------------------------- */
  useEffect(() => {
    const section = problemRef.current;
    if (!section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(section, { '--target': '0%' });
      return;
    }

    // Ensure section sits above the spacer during pin
    section.style.zIndex = '10';

    gsap.set(section, { '--target': '100%' });

    const tween = gsap.to(section, {
      '--target': '0%',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=1000',       // adjust wipe length here
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      section.style.zIndex = '';
    };
  }, []);

  /* -----------------------------------------------------------
     2) Locomotive Scroll for content AFTER #problem
        (value -> footer). Uses scrollerProxy ONLY for that node.
  ----------------------------------------------------------- */
  useEffect(() => {
    const scrollerEl = locoContainerRef.current;
    if (!scrollerEl || locoRef.current) return;

    // Avoid StrictMode double-init
    const loco = new LocomotiveScroll({
      el: scrollerEl,
      smooth: true,
      lerp: 0.09,
      tablet: { smooth: true },
      smartphone: { smooth: false },
      resetNativeScroll: true
    });
    locoRef.current = loco;

    const onScroll = () => ScrollTrigger.update();
    loco.on('scroll', onScroll);

    // Proxy only this container
    ScrollTrigger.scrollerProxy(scrollerEl, {
      scrollTop(value) {
        if (arguments.length) {
          loco.scrollTo(value, { duration: 0, disableLerp: true });
        } else {
          return loco.scroll.instance.scroll.y;
        }
      },
      getBoundingClientRect() {
        return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: scrollerEl.style.transform ? 'transform' : 'fixed'
    });

    // Theme transitions inside this container
    const themeTriggers = [];
    const colorSections = scrollerEl.querySelectorAll('[data-bgcolor]');
    const applyTheme = (bg, text) => {
      if (!bg || !text) return;
      gsap.to(document.body, {
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
        '--home-bg-color': bg,
        '--home-text-color': text,
        background: bg,
        color: text
      });
    };

    colorSections.forEach((el, i) => {
      const prevBg = i === 0 ? getComputedStyle(document.body).backgroundColor : colorSections[i - 1].dataset.bgcolor;
      const prevText = i === 0 ? getComputedStyle(document.body).color : colorSections[i - 1].dataset.textcolor;

      themeTriggers.push(
        ScrollTrigger.create({
          trigger: el,
          scroller: scrollerEl,
          start: 'top+=10rem top',
          end: 'bottom top',
          onEnter: () => applyTheme(el.dataset.bgcolor, el.dataset.textcolor),
          onEnterBack: () => applyTheme(el.dataset.bgcolor, el.dataset.textcolor),
          onLeaveBack: () => applyTheme(prevBg, prevText)
        })
      );
    });

    // Important: refresh after Locomotive lays out
    const rafRefresh = () => {
      loco.update();
      ScrollTrigger.refresh();
    };
    // give the pinned section a beat to compute its spacer height
    setTimeout(rafRefresh, 80);

    // Anchor links inside this scroller
    const onAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const target = scrollerEl.querySelector(`#${CSS.escape(id)}`);
      if (target) {
        loco.scrollTo(target, { offset: 0, duration: 1000, easing: [0.25, 0.0, 0.35, 1.0] });
      }
    };
    scrollerEl.addEventListener('click', onAnchorClick);

    // Cleanup
    return () => {
      scrollerEl.removeEventListener('click', onAnchorClick);
      themeTriggers.forEach(t => t.kill());
      loco.off('scroll', onScroll);
      loco.destroy();
      locoRef.current = null;
      gsap.to(document.body, {
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
        '--home-bg-color': '#ffffff',
        '--home-text-color': '#2a3a5c',
        background: '#ffffff',
        color: '#2a3a5c'
      });
    };
  }, []);

  /* -----------------------------------------------------------
     Carousel controls
  ----------------------------------------------------------- */
  const handleNext = () => {
    if (!slideRef.current) return;
    const items = slideRef.current.querySelectorAll('.item');
    if (items.length) slideRef.current.appendChild(items[0]);
  };
  const handlePrev = () => {
    if (!slideRef.current) return;
    const items = slideRef.current.querySelectorAll('.item');
    if (items.length) slideRef.current.prepend(items[items.length - 1]);
  };

  /* -----------------------------------------------------------
     Lead form
  ----------------------------------------------------------- */
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return;
    setLeadSubmitted(true);
    form.reset();
  };

  return (
    <div className="home">
      {/* Section 1: Hero (normal window scroll) */}
      <Hero />

      {/* Section 2: Pinned Motiontricks gradient (window scroller) */}
      <section
        id="problem"
        className="scroll-section problem"
        data-bgcolor="#2a3a5c"
        data-textcolor="#ffffff"
        ref={problemRef}
      >
        <div className="section-inner container">
          <h2>Stop losing leads to a tired website</h2>
          <p className="section-lead">
            An outdated, cluttered site costs you leads. Manual tasks steal your focus and slow growth.
          </p>
          <div className="stakes-callout">
            If you wait, you keep losing customers, keep wasting hours, and keep falling behind competitors who automate first.
          </div>
        </div>
      </section>

      {/* Everything after this uses Locomotive Scroll */}
      <div className="scroll-container" data-scroll-container ref={locoContainerRef}>
        <section
          className="scroll-section value"
          id="value"
          data-bgcolor="#f0ecf9"
          data-textcolor="#2a3a5c"
          data-scroll-section
        >
          <div className="section-inner">
            <div className="container-text">
              <h2>Build a site that sells while you sleep</h2>
              <p className="section-lead">
                Imagine a website that sells 24/7 while smart automations handle the busywork. Grow faster with less effort.
              </p>
              <ul className="value-benefits">
                {benefits.map((benefit) => (
                  <li key={benefit}>
                    <span className="value-benefits__icon" aria-hidden="true">◆</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="carousel-container">
              <div className="slide" ref={slideRef}>
                {carouselItems.map((item, index) => (
                  <div key={index} className="item" style={{ backgroundImage: `url('${item.image}')` }}>
                    <div className="content">
                      <div className="name">{item.title}</div>
                      <div className="des">{item.description}</div>
                      <button>See More</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="carousel-button">
                <button className="prev" onClick={handlePrev}>◁</button>
                <button className="next" onClick={handleNext}>▷</button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="scroll-section plan"
          id="plan"
          data-bgcolor="#e3f5f0"
          data-textcolor="#2a3a5c"
          data-scroll-section
        >
          <div className="section-inner container">
            <h2>Our three-step plan</h2>
            <div className="plan-steps">
              {planSteps.map((step, index) => (
                <article className="plan-step" key={step.title}>
                  <span className="plan-step__icon" aria-hidden="true">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="scroll-section guide"
          id="about"
          data-bgcolor="#3d4a6d"
          data-textcolor="#ffffff"
          data-scroll-section
        >
          <div className="section-inner container">
            <h2>Meet your guide</h2>
            <p className="section-lead">
              We know how frustrating it is to feel invisible online. For years, Capeweb has helped Cape Town
              businesses ship clean, fast sites with automation that frees up hours.
            </p>
            <div className="guide-highlight">
              <p>Local expertise with global standards in web design, development, and AI-powered automation.</p>
              <p>Certified StoryBrand and automation specialists ready to translate your vision into measurable growth.</p>
            </div>
          </div>
        </section>

        <section
          className="scroll-section proof"
          id="proof"
          data-bgcolor="#fff9e6"
          data-textcolor="#2a3a5c"
          data-scroll-section
        >
          <div className="section-inner container">
            <h2>Proof it works</h2>
            <div className="proof-grid">
              <div className="proof-stat">
                <p className="proof-stat__figure">+58%</p>
                <p className="proof-stat__caption">Average lift in qualified leads within 90 days.</p>
              </div>
              <ul className="testimonials">
                {testimonials.map((t) => (
                  <li className="testimonial" key={t.name}>
                    <p className="testimonial__quote">"{t.quote}"</p>
                    <p className="testimonial__meta">{t.name} · {t.role}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="scroll-section services"
          id="services"
          data-bgcolor="#e8f4f8"
          data-textcolor="#2a3a5c"
          data-scroll-section
        >
          <div className="section-inner container">
            <h2>What we deliver</h2>
            <div className="services-grid">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="scroll-section lead-magnet"
          id="ai-guide"
          data-bgcolor="#ffe5e0"
          data-textcolor="#2a3a5c"
          data-scroll-section
        >
          <div className="section-inner container">
            <h2>Get the AI Time-Saver Guide</h2>
            <p className="section-lead">
              Download 5 ways AI can save your business time and uncover the tasks to automate first.
            </p>
            <form className="lead-form" onSubmit={handleLeadSubmit} noValidate>
              <div className="lead-form__field">
                <label htmlFor="lead-email">Email address</label>
                <input
                  id="lead-email"
                  type="email"
                  name="email"
                  placeholder="you@business.co.za"
                  required
                  aria-describedby="lead-consent"
                />
              </div>
              <button type="submit" className="btn btn-primary">Download the AI Time-Saver Guide</button>
              <p id="lead-consent" className="lead-form__consent">
                We respect your inbox. One useful email, zero spam. Opt out anytime.
              </p>
              <p className="lead-form__success" aria-live="polite">
                {leadSubmitted ? 'Thanks! Your download link is on its way to your inbox.' : ''}
              </p>
            </form>
          </div>
        </section>

        <section
          className="scroll-section faq"
          id="faq"
          data-bgcolor="#f3e8f5"
          data-textcolor="#2a3a5c"
          data-scroll-section
        >
          <div className="section-inner container">
            <h2>FAQ</h2>
            <div className="faq-list">
              {faqs.map((f) => (
                <details key={f.question}>
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="scroll-section footer-section"
          data-bgcolor="#4a5978"
          data-textcolor="#ffffff"
          data-scroll-section
        >
          <Footer />
        </section>
      </div>
    </div>
  );
}

export default Home;
