import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/StaticPage.css';

const tiers = [
  {
    name: 'Launch Site',
    price: 'From R18 500',
    description: 'Perfect for SMEs moving from brochureware to a conversion-ready site with automation essentials.',
    includes: [
      '4 core pages with copy optimised for leads',
      'Mobile-first design built on our growth framework',
      'Booking form + CRM or calendar integration',
      'Launch checklist, QA, and go-live training'
    ]
  },
  {
    name: 'Growth Engine',
    price: 'From R32 000',
    description: 'For teams who need advanced funnels, automations, and analytics to keep sales moving.',
    includes: [
      'Everything in Launch Site',
      'Custom landing pages for each key offer',
      'AI assistant for FAQs, quotes, and follow-ups',
      'Dashboard with call tracking and lead scoring'
    ]
  },
  {
    name: 'Scale Partner',
    price: 'From R9 500 / month',
    description: 'Continuous optimisation for businesses who want a proactive web and automation team on retainer.',
    includes: [
      'Quarterly roadmap and prioritised experiments',
      'Unlimited iterative updates within the plan scope',
      'A/B testing, speed monitoring, and CRO support',
      'Automation maintenance and new workflow builds'
    ]
  }
];

function Pricing() {
  return (
    <div className="static-page">
      <header className="static-hero container">
        <p className="static-eyebrow">Transparent pricing</p>
        <h1>Pick the pace you want to grow</h1>
        <p className="static-lead">
          Every package starts with a discovery call so we can confirm fit, timelines, and the automation wins
          that will matter most for your business.
        </p>
        <div className="static-actions">
          <Link to="/contact" className="btn btn-primary">
            Book a Free Strategy Call
          </Link>
          <a href="/resources" className="btn btn-ghost">
            Download the AI Time-Saver Guide
          </a>
        </div>
      </header>

      <section className="static-section container" id="pricing-tiers">
        <div className="static-section__header">
          <h2>Packages built for SME growth</h2>
          <p>
            Flexible payment plans available. Each project includes content planning, accessibility best practice,
            and time for revisions.
          </p>
        </div>
        <div className="static-grid">
          {tiers.map((tier) => (
            <article key={tier.name} className="static-card">
              <header>
                <h3>{tier.name}</h3>
                <p className="static-card__price">{tier.price}</p>
                <p className="static-card__description">{tier.description}</p>
              </header>
              <ul>
                {tier.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="static-section container">
        <div className="static-section__header">
          <h2>What happens after you say yes?</h2>
        </div>
        <ol className="static-steps">
          <li>
            <strong>Kick-off workshop.</strong> Align on goals, audiences, and success metrics. You get a detailed project
            playbook within 48 hours.
          </li>
          <li>
            <strong>Design, build, automate.</strong> We prototype, test, and connect your systems. Weekly check-ins keep you in the loop.
          </li>
          <li>
            <strong>Launch + optimise.</strong> We handle deployment, handover, and 30 days of monitoring. Ongoing retainers keep momentum.
          </li>
        </ol>
      </section>

      <section className="static-cta">
        <div className="container">
          <h2>Let’s map the right plan for you</h2>
          <p>
            Book a Free Strategy Call to get a custom quote, timeline, and checklist tailored to your goals.
          </p>
          <div className="static-actions">
            <Link to="/contact" className="btn btn-primary">
              Book a Free Strategy Call
            </Link>
            <a href="/resources" className="btn btn-ghost">
              Download the AI Time-Saver Guide
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Pricing;
