import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/StaticPage.css';

const resources = [
  {
    title: 'AI Time-Saver Guide',
    description: 'Identify five quick wins to automate across marketing, sales, and admin without new headcount.',
    format: 'PDF · 12 pages',
    link: '#ai-guide'
  },
  {
    title: 'Website Clarity Checklist',
    description: 'A 15-minute checklist to ensure your homepage tells the right story and drives action on mobile.',
    format: 'Notion template',
    link: '#'
  },
  {
    title: 'Automation Stack for SMEs',
    description: 'See the exact tools we integrate for Cape Town clients to automate inbound leads and onboarding.',
    format: 'Google Sheet',
    link: '#'
  }
];

function Resources() {
  return (
    <div className="static-page">
      <header className="static-hero container">
        <p className="static-eyebrow">Resources</p>
        <h1>Tools to help you grow without the burnout</h1>
        <p className="static-lead">
          Practical templates, guides, and automations designed for South African SMEs who want a smarter, faster
          web presence.
        </p>
        <div className="static-actions">
          <Link to="/contact" className="btn btn-primary">
            Book a Free Strategy Call
          </Link>
          <a href="#downloads" className="btn btn-ghost">
            Download the AI Time-Saver Guide
          </a>
        </div>
      </header>

      <section className="static-section container" id="downloads">
        <div className="static-section__header">
          <h2>Download and put to work today</h2>
        </div>
        <div className="static-grid">
          {resources.map((resource) => (
            <article key={resource.title} className="static-card static-card--resource">
              <header>
                <p className="static-card__format">{resource.format}</p>
                <h3>{resource.title}</h3>
              </header>
              <p className="static-card__description">{resource.description}</p>
              <a href={resource.link} className="static-link">
                Download resource
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="static-section container">
        <div className="static-section__header">
          <h2>Want early access?</h2>
          <p>Join our quarterly update to get new templates, workshop invites, and automation experiments first.</p>
        </div>
        <form className="static-form">
          <div className="static-form__field">
            <label htmlFor="resource-name">Name</label>
            <input id="resource-name" name="name" type="text" autoComplete="name" placeholder="Your name" required />
          </div>
          <div className="static-form__field">
            <label htmlFor="resource-email">Email</label>
            <input
              id="resource-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@business.co.za"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Download the AI Time-Saver Guide
          </button>
        </form>
        <p className="static-form__note">
          We send one curated email at a time. Unsubscribe whenever you need to.
        </p>
      </section>
    </div>
  );
}

export default Resources;
