import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Hero from '../components/Hero';

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
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger children animations
          const children = entry.target.querySelectorAll('.animate-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.fade-in-up, .scale-in');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
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
      <Hero />

      <section className="problem fade-in-up" id="problem" data-nav-fill-trigger>
        <div className="section-inner container">
          <h2>Stop losing leads to a tired website</h2>
          <p className="section-lead">
            An outdated, cluttered site costs you leads. Manual tasks steal your focus and slow growth.
          </p>
          <div className="stakes-callout scale-in">
            If you wait, you keep losing customers, keep wasting hours, and keep falling behind competitors
            who automate first.
          </div>
        </div>
      </section>

      <section className="value fade-in-up" id="value">
        <div className="section-inner container">
          <h2>Build a site that sells while you sleep</h2>
          <p className="section-lead">
            Imagine a website that sells 24/7 while smart automations handle the busywork.
            Grow faster with less effort.
          </p>
          <ul className="value-benefits">
            {benefits.map((benefit, index) => (
              <li key={benefit} className="animate-child">
                <span className="value-benefits__icon" aria-hidden="true">◆</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="plan fade-in-up" id="plan">
        <div className="section-inner container">
          <h2>Our three-step plan</h2>
          <div className="plan-steps">
            {planSteps.map((step, index) => (
              <article className="plan-step animate-child" key={step.title}>
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

      <section className="guide fade-in-up" id="about">
        <div className="section-inner container">
          <h2>Meet your guide</h2>
          <p className="section-lead">
            We know how frustrating it is to feel invisible online. For years, Capeweb has helped Cape Town
            businesses ship clean, fast sites with automation that frees up hours.
          </p>
          <div className="guide-highlight scale-in">
            <p>Local expertise with global standards in web design, development, and AI-powered automation.</p>
            <p>Certified StoryBrand and automation specialists ready to translate your vision into measurable growth.</p>
          </div>
        </div>
      </section>

      <section className="proof fade-in-up" id="proof">
        <div className="section-inner container">
          <h2>Proof it works</h2>
          <div className="proof-grid">
            <div className="proof-stat scale-in">
              <p className="proof-stat__figure">+58%</p>
              <p className="proof-stat__caption">Average lift in qualified leads within 90 days.</p>
            </div>
            <ul className="testimonials">
              {testimonials.map((testimonial, index) => (
                <li className="testimonial animate-child" key={testimonial.name}>
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

      <section className="services fade-in-up" id="services">
        <div className="section-inner container">
          <h2>What we deliver</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <article className="service-card animate-child" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lead-magnet fade-in-up" id="ai-guide">
        <div className="section-inner container">
          <h2>Get the AI Time-Saver Guide</h2>
          <p className="section-lead">
            Download 5 ways AI can save your business time and uncover the tasks to automate first.
          </p>
          <form className="lead-form scale-in" onSubmit={handleLeadSubmit} noValidate>
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

      <section className="faq fade-in-up" id="faq">
        <div className="section-inner container">
          <h2>FAQ</h2>
          <div className="faq-list">
            {faqs.map((faqItem, index) => (
              <details key={faqItem.question} className="animate-child">
                <summary>{faqItem.question}</summary>
                <p>{faqItem.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band scale-in">
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
    </div>
  );
}

export default Home;
