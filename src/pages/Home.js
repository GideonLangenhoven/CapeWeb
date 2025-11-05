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

const planSteps = [
  {
    title: 'Discovery Call',
    description: 'Share your goals and bottlenecks so we understand what growth looks like for you.'
  },
  {
    title: 'Custom Growth Plan',
    description: 'Review a tailored website and automation roadmap that removes friction for your customers.'
  },
  {
    title: 'Launch & Grow',
    description: 'We build, launch, and monitor your new system so it keeps converting while you stay focused.'
  }
];

const benefits = [
  'Conversion-focused layouts that stay fast and responsive on every device.',
  'Automated follow-ups, bookings, and handoffs that free your team from manual busywork.',
  'Cape Town specialists who stay close after launch with proactive optimisation.'
];

const testimonials = [
  {
    quote: 'Capeweb rebuilt our site and automated bookings — qualified enquiries jumped 42% in the first month.',
    name: 'Anika Jacobs',
    role: 'Owner, Atlantic Legal'
  },
  {
    quote: 'The new site feels like an extra salesperson. Automations send quotes before we even pick up the phone.',
    name: 'Sipho Moyo',
    role: 'Director, Harbour Manufacturing'
  },
  {
    quote: 'We finally have a dashboard that shows where leads come from and what to fix next. Game changer.',
    name: 'Megan Daniels',
    role: 'Marketing Lead, CapeFit Studios'
  }
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

function Home() {
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return undefined;
    const scrollContainer = scrollContainerRef.current;

    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.classList.add('home-scroll-active');

    // Clear any hash from URL to prevent auto-scrolling to anchors
    if (window.location.hash) {
      window.history.replaceState(null, null, ' ');
    }

    const locoScroll = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      lerp: 0.09,
      tablet: { smooth: true },
      smartphone: { smooth: false },
      resetNativeScroll: true
    });

    // Handle anchor link clicks
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const id = target.getAttribute('href').substring(1);
        const element = scrollContainer.querySelector(`#${id}`);
        if (element) {
          locoScroll.scrollTo(element, {
            offset: 0,
            duration: 1000,
            easing: [0.25, 0.0, 0.35, 1.0]
          });
        }
      }
    };

    scrollContainer.addEventListener('click', handleAnchorClick);

    const handleScroll = () => ScrollTrigger.update();
    locoScroll.on('scroll', handleScroll);

    ScrollTrigger.scrollerProxy(scrollContainer, {
      scrollTop(value) {
        if (arguments.length) {
          locoScroll.scrollTo(value, { duration: 0, disableLerp: true });
        } else {
          return locoScroll.scroll.instance.scroll.y;
        }
      },
      getBoundingClientRect() {
        return {
          left: 0,
          top: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
    });

    const scrollColorElems = scrollContainer.querySelectorAll('[data-bgcolor]');
    const triggers = [];

    // Apply background colors to sections immediately
    scrollColorElems.forEach((section) => {
      const bgColor = section.dataset.bgcolor;
      if (bgColor) {
        section.style.backgroundColor = bgColor;
      }
    });

    const applyTheme = (bg, text) => {
      if (!bg || !text) return;
      gsap.to(document.body, {
        duration: 0.6,
        ease: 'power2.inOut',
        overwrite: 'auto',
        '--home-bg-color': bg,
        '--home-text-color': text,
        background: bg,
        color: text
      });
    };

    scrollColorElems.forEach((colorSection, i) => {
      const prevBg = i === 0 ? '#ffffff' : scrollColorElems[i - 1].dataset.bgcolor;
      const prevText = i === 0 ? '#0A174E' : scrollColorElems[i - 1].dataset.textcolor;

      triggers.push(
        ScrollTrigger.create({
          trigger: colorSection,
          scroller: scrollContainer,
          start: 'top top',
          end: 'bottom top',
          onEnter: () => applyTheme(colorSection.dataset.bgcolor, colorSection.dataset.textcolor),
          onEnterBack: () => applyTheme(colorSection.dataset.bgcolor, colorSection.dataset.textcolor),
          onLeaveBack: () => applyTheme(prevBg, prevText)
        })
      );
    });

    const refresh = () => locoScroll.update();
    ScrollTrigger.addEventListener('refresh', refresh);

    // Delay refresh to allow Locomotive Scroll to fully initialize and prevent jumping
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      scrollContainer.removeEventListener('click', handleAnchorClick);
      triggers.forEach(trigger => trigger.kill());
      ScrollTrigger.removeEventListener('refresh', refresh);
      locoScroll.off('scroll', handleScroll);
      locoScroll.destroy();
      const cleanupTween = gsap.to(document.body, {
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
        '--home-bg-color': '#ffffff',
        '--home-text-color': '#0A174E',
        background: '#ffffff',
        color: '#0A174E'
      });
      cleanupTween.eventCallback('onComplete', () => {
        document.body.classList.remove('home-scroll-active');
      });
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  /* -----------------------------------------------------------
     Interactive Reveal Effect for Guide Section
  ----------------------------------------------------------- */
  useEffect(() => {
    const hiddenContent = document.querySelector('.guide .hidden-content');
    const ctaLink = document.querySelector('.guide .cta-link');
    const btnIcon = document.querySelector('.guide .btn-icon');
    const guideSection = document.querySelector('.guide');

    if (!hiddenContent || !ctaLink || !btnIcon || !guideSection) {
      console.log('Guide elements not found:', { hiddenContent, ctaLink, btnIcon, guideSection });
      return;
    }

    console.log('Interactive reveal initialized');

    let isLinkHovered = false;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 3;
    let targetX = currentX;
    let targetY = currentY;
    let currentSize = 0;
    let targetSize = 0;
    let animationFrameId;

    // Convert rem to pixels
    const remToPx = (rem) => {
      return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    };

    const proximityThreshold = remToPx(6); // 6rem in pixels for larger detection area

    // Check if mouse is near any hoverable element
    const isNearHoverableElement = (mouseX, mouseY) => {
      const hoverElements = document.querySelectorAll('.guide .content h2, .guide .content .display-text, .guide .content .stakes-callout, .guide .content .section-lead');

      for (let el of hoverElements) {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Calculate element bounds with proximity threshold
        const elementTop = rect.top + scrollTop - proximityThreshold;
        const elementBottom = rect.bottom + scrollTop + proximityThreshold;
        const elementLeft = rect.left - proximityThreshold;
        const elementRight = rect.right + proximityThreshold;

        // Check if mouse is within the expanded bounds
        if (mouseX >= elementLeft && mouseX <= elementRight &&
            mouseY >= elementTop && mouseY <= elementBottom) {
          return true;
        }
      }
      return false;
    };

    // Smooth animation loop
    const animate = () => {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      currentSize += (targetSize - currentSize) * 0.15;

      hiddenContent.style.setProperty('--x', currentX + 'px');
      hiddenContent.style.setProperty('--y', currentY + 'px');
      hiddenContent.style.setProperty('--size', currentSize + 'px');

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    // Track mouse movement and check proximity
    const handleMouseMove = (e) => {
      if (!isLinkHovered) {
        targetX = e.pageX;
        targetY = e.pageY;

        // Check if near any hoverable element
        if (isNearHoverableElement(e.pageX, e.pageY)) {
          targetSize = 500; // Increased from 300 to 500 for more visibility
        } else {
          targetSize = 0;
        }
      }
    };

    // Button hovering - smaller focused reveal
    const handleLinkEnter = () => {
      isLinkHovered = true;
      targetSize = 50; // Increased from 25 to 50
    };

    const handleLinkMove = (e) => {
      if (isLinkHovered) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const iconRect = btnIcon.getBoundingClientRect();
        const centerX = iconRect.left + iconRect.width / 2;
        const centerY = iconRect.top + iconRect.height / 2 + scrollTop;

        targetX = centerX;
        targetY = centerY;
      }
    };

    const handleLinkLeave = () => {
      isLinkHovered = false;
      targetSize = 0;
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    ctaLink.addEventListener('mouseenter', handleLinkEnter);
    ctaLink.addEventListener('mousemove', handleLinkMove);
    ctaLink.addEventListener('mouseleave', handleLinkLeave);

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      if (ctaLink) {
        ctaLink.removeEventListener('mouseenter', handleLinkEnter);
        ctaLink.removeEventListener('mousemove', handleLinkMove);
        ctaLink.removeEventListener('mouseleave', handleLinkLeave);
      }
    };
  }, []);

  const handleLeadSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      return;
    }
    setLeadSubmitted(true);
    form.reset();
  };

  return (
    <div className="home">
      <div
        className="scroll-container"
        data-scroll-container
        ref={scrollContainerRef}
      >
        <Hero />

        <section
          className="scroll-section problem"
          id="problem"
          data-bgcolor="#0A174E"
          data-textcolor="#ffffff"
          data-scroll-section
        >
          <div className="section-inner container">
            <h2>Stop losing leads to a tired website</h2>
            <p className="section-lead">
              An outdated, cluttered site costs you leads. Manual tasks steal your focus and slow growth.
            </p>
            <div className="stakes-callout">
              If you wait, you keep losing customers, keep wasting hours, and keep falling behind competitors
              who automate first.
            </div>
          </div>
        </section>

        <section
          className="scroll-section value"
          id="value"
          data-bgcolor="#00D4FF"
          data-textcolor="#0A174E"
          data-scroll-section
        >
          <div className="section-inner container">
            <h2>Build a site that sells while you sleep</h2>
            <p className="section-lead">
              Imagine a website that sells 24/7 while smart automations handle the busywork.
              Grow faster with less effort.
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
        </section>

        <section
          className="scroll-section plan"
          id="plan"
          data-bgcolor="#6A00FF"
          data-textcolor="#ffffff"
          data-scroll-section
        >
          <div className="section-inner container">
            <h2>Our three-step plan</h2>
            <div className="plan-steps">
              {planSteps.map((step, index) => (
                <article className="plan-step" key={step.title}>
                  <span className="plan-step__icon" aria-hidden="true">
                    {index + 1}
                  </span>
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
          <div className="section-inner" style={{ position: 'relative', width: '100%' }}>
            <div className="content">
              <div className="container">
                <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                  <div className="col-12 col-md-10 col-lg-8">
                    <h2 className="text-center problem-heading">Stop losing leads to a tired website</h2>
                    <p className="section-lead text-center">
                      An outdated, cluttered site costs you leads. Manual tasks steal your focus and slow growth.
                    </p>
                    <div className="stakes-callout">
                      If you wait, you keep losing customers, keep wasting hours, and keep falling behind competitors who automate first.
                    </div>
                    <p className="reveal-hint text-center">Hover to reveal the solution...</p>
                  </div>
                </div>
                <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                  <div className="col-12 col-md-10 col-lg-8">
                    <p className="display-text text-center hoverable">Your website should work as hard as you do</p>
                  </div>
                </div>
                <div className="text-center pb-5">
                  <a className="cta-link d-inline-flex justify-content-center align-items-center" href="#contact">
                    <span>Transform your website now</span>
                    <span className="btn-icon">→</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden-content">
              <div className="container">
                <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                  <div className="col-12 col-md-10 col-lg-8">
                    <h2 className="text-center">Automate, convert, and scale with confidence</h2>
                    <p className="section-lead text-center">
                      Modern websites capture leads 24/7, automate follow-ups, and turn visitors into customers while you sleep.
                    </p>
                    <div className="stakes-callout">
                      Smart automation means more leads, more time, and more revenue—without the manual grind.
                    </div>
                    <p className="reveal-hint text-center" style={{ opacity: 0 }}>Placeholder for spacing</p>
                  </div>
                </div>
                <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                  <div className="col-12 col-md-10 col-lg-8">
                    <p className="display-text text-center">Turn your site into your best salesperson</p>
                  </div>
                </div>
                <div className="text-center pb-5">
                  <div className="cta-link d-inline-flex justify-content-center align-items-center">
                    <span>Transform your website now</span>
                    <span className="btn-icon">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="scroll-section proof"
          id="proof"
          data-bgcolor="#f1f1f1"
          data-textcolor="#0A174E"
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
                {testimonials.map((testimonial) => (
                  <li className="testimonial" key={testimonial.name}>
                    <p className="testimonial__quote">"{testimonial.quote}"</p>
                    <p className="testimonial__meta">
                      {testimonial.name} · {testimonial.role}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="scroll-section services"
          id="services"
          data-bgcolor="#00D4FF"
          data-textcolor="#0A174E"
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
          data-bgcolor="#6A00FF"
          data-textcolor="#ffffff"
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
              <button type="submit" className="btn btn-primary">
                Download the AI Time-Saver Guide
              </button>
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
          data-bgcolor="#0A174E"
          data-textcolor="#ffffff"
          data-scroll-section
        >
          <div className="section-inner container">
            <h2>FAQ</h2>
            <div className="faq-list">
              {faqs.map((faqItem) => (
                <details key={faqItem.question}>
                  <summary>{faqItem.question}</summary>
                  <p>{faqItem.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="scroll-section cta-band"
          data-bgcolor="#00D4FF"
          data-textcolor="#0A174E"
          data-scroll-section
        >
          <div className="section-inner container">
            <h2>Ready to launch a site that works as hard as you do?</h2>
            <p>
              Book a Free Strategy Call and get a clear roadmap, pricing, and timeline in your inbox within 48 hours.
            </p>
            <div className="cta-band__actions">
              <Link to="/contact" className="btn btn-primary">
                Book a Free Strategy Call
              </Link>
              <a href="#ai-guide" className="btn btn-ghost">
                Download the AI Time-Saver Guide
              </a>
            </div>
          </div>
        </section>

        <section
          className="scroll-section footer-section"
          data-bgcolor="#0A174E"
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
