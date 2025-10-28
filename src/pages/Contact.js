import React, { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/Contact.css';

const initialState = {
  name: '',
  email: '',
  company: '',
  website: '',
  priority: '',
  message: ''
};

const priorities = ['Launch', 'Scale', 'Compound'];

function Contact() {
  useScrollReveal();
  const [formData, setFormData] = useState(initialState);
  const [submissionState, setSubmissionState] = useState('idle'); // idle | submitting | success | error

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submissionState !== 'idle') setSubmissionState('idle');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionState('submitting');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setFormData(initialState);
      setSubmissionState('success');
    } catch (error) {
      setSubmissionState('error');
    }
  };

  return (
    <div className="contact-page">
      <section className="section contact-hero" data-cursor-section="contact">
        <div className="container contact-hero__container surface-panel" data-scroll-reveal>
          <div className="surface-panel__shine" />
          <div className="contact-hero__copy">
            <span className="eyebrow">Free Strategy Call</span>
            <h1>Book a Free Strategy Call.</h1>
            <p>45 minutes to map goals, bottlenecks, and the plan that pays off.</p>
            <div className="contact-hero__meta">
              <div>
                <strong>What you get</strong>
                <p>45-minute strategy session · bottleneck diagnosis · prioritised roadmap · next-step plan in 48 hours.</p>
              </div>
              <div>
                <strong>Who joins</strong>
                <p>Founder or lead + our pod lead. Bring your metrics, questions, and ambition. We’ll bring the plan.</p>
              </div>
            </div>
          </div>
          <div className="contact-hero__aside">
            <div>
              <span className="eyebrow">Direct line</span>
              <p className="contact-line">hello@capeweb.co.za</p>
              <p className="contact-line">+27 21 000 0000</p>
            </div>
            <div>
              <span className="eyebrow">Office hours</span>
              <p>Mon–Fri 09:00–18:00 SAST · Remote-first · Global delivery</p>
            </div>
            <div>
              <span className="eyebrow">Newsletter</span>
              <p>“Signal, not noise.” Monthly playbooks on design, AI, and growth.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section contact-form-section" data-cursor-section="contact">
        <div className="container contact-form__wrapper">
          <form className={`contact-form ${submissionState}`} onSubmit={handleSubmit} data-scroll-reveal>
            <div className="form-grid">
              <label>
                Name
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" />
              </label>
              <label>
                Email
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@company.com" />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Company
                <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company or project" />
              </label>
              <label>
                Website / URL
                <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" />
              </label>
            </div>
            <label>
              Which focus best matches your priority?
              <div className="priority-group">
                {priorities.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`priority-pill ${formData.priority === option ? 'is-active' : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, priority: option }))}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </label>
            <label>
              Tell us about your goals and bottlenecks
              <textarea
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Where are you headed? What’s holding you back? What have you tried?"
                required
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={submissionState === 'submitting'}>
              {submissionState === 'submitting' ? 'Sending…' : 'Book a Free Strategy Call'}
            </button>
            <p className="form-note">
              {submissionState === 'success'
                ? 'Thanks! We’ll respond within one business day with scheduling options.'
                : submissionState === 'error'
                ? 'Something went wrong. Please email hello@capeweb.co.za.'
                : 'We keep everything confidential. NDA available on request.'}
            </p>
          </form>
          <aside className="contact-insights surface-panel" data-scroll-reveal>
            <div className="surface-panel__shine" />
            <span className="eyebrow">What to expect</span>
            <ul>
              <li>Pre-call prep: we review your current site, funnels, and automations.</li>
              <li>Live strategy: collaborative session to map quick wins and big swings.</li>
              <li>48-hour blueprint: priorities, timeline, and investment ready to action.</li>
            </ul>
            <div className="divider" />
            <span className="eyebrow">Recent wins</span>
            <ul>
              <li>42% increase in speed + 3.1× organic leads for a SaaS brand in 60 days.</li>
              <li>Automated lead routing that cut response times from 12 hours to 4 minutes.</li>
              <li>Launch-to-scale commerce rollout generating 28% higher AOV.</li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default Contact;
