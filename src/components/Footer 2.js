import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState({ submitting: false, success: false, error: false });
  const footerRef = useRef(null);

  // Animation: Fade in footer when it enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ submitting: true, success: false, error: false });

    try {
      const response = await fetch('https://formspree.io/f/xdkzdoka', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setFormState({ submitting: false, success: true, error: false });
        setEmail('');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      setFormState({ submitting: false, success: false, error: true });
    }
  };

  return (
    <footer id="SITE_FOOTER" className="site-footer" ref={footerRef}>
      <div className="footer-container">
        {/* Top Section: Newsletter Signup */}
        <div className="footer-top-section">
          <div className="footer-signup-text">
            <h2>Want growth ideas in your inbox?</h2>
            <p>Monthly playbooks on web + AI from capeweb. Actionable, no spam.</p>
          </div>
          <div className="footer-signup-form-container">
            <form className="footer-signup-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={formState.submitting}
                />
                <button type="submit" disabled={formState.submitting}>
                  {formState.submitting ? '...' : 'Send'}
                </button>
            </form>
            {formState.success && <p className="form-disclaimer success">Thank you! You're now subscribed.</p>}
            {formState.error && <p className="form-disclaimer error">Something went wrong. Please try again.</p>}
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider-full"></div>

        {/* Bottom Section: Links & Socials */}
        <div className="footer-bottom-section">
          {/* Column 1: Branding */}
          <div className="footer-column footer-brand-column">
            <Link to="/" className="footer-brand-logo">capeweb</Link>
            <p className="copyright">© {new Date().getFullYear()} All Rights Reserved.</p>
          </div>

          {/* Column 2: Navigation */}
          <div className="footer-column footer-nav-column">
            <h4>Menu</h4>
            <ul>
              <li><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>Home</Link></li>
              <li><Link to="/services" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>Services</Link></li>
              <li><Link to="/testimonials" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>Testimonials</Link></li>
              <li><Link to="/gallery" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>Gallery</Link></li>
            </ul>
          </div>
          
          {/* Spacer Column to push socials to the right */}
          <div className="footer-column-spacer"></div>

          {/* Column 3: Social Media */}
          <div className="footer-column footer-social-column">
            <h4>Connect</h4>
            <div className="social-links">
               <a href="https://facebook.com/RDSEvents" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path></svg>
              </a>
              <a href="https://instagram.com/_rds_entertainment/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.585-.011-4.85-.069c-3.252-.149-4.771-1.664-4.919-4.919-.058-1.265-.069-1.644-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
