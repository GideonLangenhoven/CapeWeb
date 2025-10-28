import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../data/servicesData';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/Services.css';

const serviceDeepDive = {
  'web-design': {
    longForm: 'High‑performing sites that convert. Clear, fast, and simple to update.',
    deliverables: [
      'Conversion-first UX and copy.',
      'Responsive design systems in Figma.',
      'Performance-tuned builds with analytics.'
    ],
    metrics: ['Core Web Vitals', 'Conversion rate', 'Form / cart completion']
  },
  'seo-organic': {
    longForm: 'Earn traffic, don’t rent it. Technical SEO + content that drives qualified demand.',
    deliverables: [
      'Technical SEO and schema.',
      'Intent-led content strategy and briefs.',
      'Dashboards that tie to revenue.'
    ],
    metrics: ['Organic qualified sessions', 'Share of voice', 'Content-assisted pipeline']
  },
  'ai-automation': {
    longForm: 'Lead capture, follow‑up, and support on autopilot. Feels human, books meetings.',
    deliverables: [
      'Chatbots trained on your offers.',
      'CRM, calendar, and helpdesk integrations.',
      'Lead routing and follow-up workflows.'
    ],
    metrics: ['Lead-to-meeting rate', 'Response time', 'Pipeline influenced']
  },
  'brand-identity': {
    longForm: 'A clear, consistent identity that makes your brand unmistakable.',
    deliverables: [
      'Brand strategy and messaging.',
      'Logos, motion, and visual language.',
      'Sales and social asset kits.'
    ],
    metrics: ['Brand recall', 'Creative velocity', 'Sales cycle compression']
  },
  'social-media': {
    longForm: 'Content engines and paid frameworks that turn views into pipeline.',
    deliverables: [
      'Channel blueprints and tone.',
      'Content sprints and UGC sourcing.',
      'Paid testing and retargeting.'
    ],
    metrics: ['Cost per qualified lead', 'Content-to-demo rate', 'Share of conversation']
  }
};

function Services() {
  useScrollReveal();
  return (
    <div className="services-page">
      <section className="section section-muted services-hero" data-cursor-section="services">
        <div className="container services-hero__container">
          <div className="services-hero__copy" data-scroll-reveal>
            <span className="eyebrow">Services</span>
            <h1>Web + AI systems built to scale your next chapter.</h1>
            <p>Pair conversion-first websites with intelligent automations so your team wins back time and keeps the pipeline full.</p>
            <div className="btn-group">
              <Link to="/contact" className="btn btn-primary">Book a Free Strategy Call</Link>
              <Link to="/resources" className="btn btn-ghost">Download the AI Time-Saver Guide</Link>
            </div>
          </div>
          <div className="services-hero__card surface-panel" data-scroll-reveal>
            <div className="surface-panel__shine" />
            <h3>How we partner</h3>
            <ul>
              <li>Embedded with your team or fully managed delivery.</li>
              <li>Weekly standups, async reporting, and shared dashboards.</li>
              <li>Transparent scope, clear KPIs, and momentum from week one.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section services-offering" data-cursor-section="services">
        <div className="container">
          <div className="section-header" data-scroll-reveal>
            <span className="eyebrow">What we do</span>
            <h2>Each service is a growth stack. Combine them to build your operating system.</h2>
          </div>
          <div className="service-detail-grid">
            {services.map((service) => {
              const detail = serviceDeepDive[service.id];
              return (
                <article key={service.id} className="service-detail surface-panel" data-scroll-reveal>
                  <div className="surface-panel__shine" />
                  <header>
                    <span className="service-detail__category">{service.category}</span>
                    <h3>{service.title}</h3>
                    <p className="service-detail__lead">{detail?.longForm ?? service.description}</p>
                  </header>
                  <div className="service-detail__body">
                    <div>
                      <h4>What we deliver</h4>
                      <ul>
                        {(detail?.deliverables ?? service.highlights).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Signals we track</h4>
                      <ul>
                        {(detail?.metrics ?? service.highlights).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <footer className="service-detail__footer">
                    <Link to="/contact" className="btn btn-ghost">Book a Free Strategy Call</Link>
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-muted services-collaboration" data-cursor-section="services">
        <div className="container collaboration-grid surface-panel" data-scroll-reveal>
          <div className="surface-panel__shine" />
          <div>
            <span className="eyebrow">Collaboration model</span>
            <h2>Pods built for clarity, speed, and iteration.</h2>
            <p>We assemble a dedicated team around your objective. The pod plugs into your workflows, communicates in your tools, and ships progress every week.</p>
          </div>
          <div className="collaboration-points">
            <div>
              <strong>Weekly rhythm</strong>
              <p>Monday strategy standups, mid-week async check-ins, and Friday demo drops keep everyone aligned.</p>
            </div>
            <div>
              <strong>Tooling</strong>
              <p>We run in Notion, Linear, Figma, and Looker. Prefer Airtable or ClickUp? We’ll meet you there.</p>
            </div>
            <div>
              <strong>Transparency</strong>
              <p>Shared dashboards, Loom breakdowns, and open calendars mean no surprises and faster decisions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section services-cta" data-cursor-section="contact">
        <div className="container shimmer-border" data-scroll-reveal>
          <div className="shimmer-inner services-cta__inner">
            <span className="eyebrow">Next step</span>
            <h2>Book a Free Strategy Call.</h2>
            <p>We’ll map bottlenecks and send a no‑fluff plan within 48 hours.</p>
            <div className="btn-group">
              <Link to="/contact" className="btn btn-primary">Book a Free Strategy Call</Link>
              <Link to="/resources" className="btn btn-ghost">Download the AI Time-Saver Guide</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
