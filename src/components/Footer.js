import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const navLinks = [
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/gallery' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' }
];

const signalSnippets = [
  'Automated websites that win customers.',
  'Your 24/7 growth engine: site + AI.',
  'From traffic to trust to transactions.',
  'Simple systems. Real growth.'
];

function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) return;

    setStatus('submitting');
    try {
      const response = await fetch('https://formspree.io/f/xdkzdoka', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setEmail('');
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-wrapper">
        <div className="footer-top surface-panel">
          <div className="footer-top__copy">
            <span className="eyebrow">Newsletter</span>
            <h3>Signal, not noise.</h3>
            <p>Monthly playbooks on design, AI, and growth. Actionable, founder-ready, and never spam.</p>
          </div>
          <form className="footer-form" onSubmit={handleSubmit}>
            <div className={`footer-form__field ${status === 'success' ? 'footer-form__field--success' : ''} ${status === 'error' ? 'footer-form__field--error' : ''}`}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== 'idle') setStatus('idle');
                }}
                required
                autoComplete="email"
                aria-label="Email address"
                disabled={status === 'submitting'}
              />
              <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Joining…' : 'Subscribe'}
              </button>
            </div>
            <span className="footer-form__meta">
              {status === 'success' && 'Welcome aboard. Check your inbox for your first playbook.'}
              {status === 'error' && 'Something went wrong. Try again or reach out.'}
              {status === 'idle' && 'We send one email a month. Unsubscribe anytime.'}
            </span>
          </form>
        </div>

        <div className="footer-middle">
          <div className="footer-brand">
            <span className="brand-glyph" aria-hidden="true">◆</span>
            <div>
              <p className="footer-brand__title">capeweb</p>
              <p className="footer-brand__subtitle">Automated websites and AI systems that win customers.</p>
            </div>
          </div>
          <div className="footer-snippets">
            <span className="eyebrow">Taglines</span>
            <div className="tagline-grid">
              {signalSnippets.map((snippet) => (
                <span key={snippet}>{snippet}</span>
              ))}
            </div>
          </div>
          <div className="footer-links">
            <span className="eyebrow">Navigation</span>
            <ul>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-cta">
            <span className="eyebrow">Ready?</span>
            <p>Book a Free Strategy Call and leave with a custom growth plan.</p>
            <Link to="/contact" className="btn btn-primary">Book a Free Strategy Call</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-meta">
            <span>© {new Date().getFullYear()} capeweb. Future‑ready growth systems.</span>
            <span>Built with design, code, and AI in Cape Town · Operating globally.</span>
          </div>
          <div className="footer-social">
            <Link to="/privacy">Privacy</Link>
            <a href="https://instagram.com/_rds_entertainment/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:hello@capeweb.co.za">Email</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
