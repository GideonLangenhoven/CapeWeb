import React from 'react';
import Footer from '../components/Footer';
import LightBulb from '../components/LightBulb';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
  const [status, setStatus] = React.useState('idle');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    // REPLACE WITH YOUR ACTUAL DEPLOYED URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLFgbHHM63wG-WrNwFrwzzLoj0kv6r7MD9RHPDFhTAVeS-8Y2UopbSVrzacie8GuZARg/exec';

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guideType: 'contact-form'
        }),
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  // Static page; only LightBulb handles theme changes
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="expand-page contact-page">
      <div>

        {/* 1. HERO SECTION (WHITE aka Lightbulb Theme) */}
        <section className="section-white" data-scroll-section style={{ position: 'relative', backgroundColor: 'var(--lb-bg)', color: 'var(--lb-text)', transition: 'all 0.3s' }}>
          <LightBulb />
          <div className="expand-label">Get In Touch</div>
          <h1 className="expand-title-hero reveal-text" style={{ color: 'var(--lb-text)', transition: 'color 0.3s' }}>
            LET'S START A<br />
            CONVERSATION.
          </h1>
          <p className="expand-text-lg reveal-text" style={{ color: 'var(--lb-text)', marginTop: '2rem', transition: 'color 0.3s' }}>
            Whether you have a specific project in mind or just want to explore what's possible, we're here to listen.
          </p>
        </section>

        {/* 2. FORM SECTION (BLACK aka Lightbulb Theme) */}
        <section className="section-black" data-scroll-section style={{ backgroundColor: 'var(--lb-bg)', color: 'var(--lb-text)', transition: 'all 0.3s' }}>
          <div className="contact-grid">
            <div className="reveal-text">
              <h2 className="expand-title-section" style={{ color: 'var(--lb-text)' }}>Tell us about your project.</h2>
              <p className="expand-text-lg" style={{ color: 'var(--lb-text)', opacity: 0.9, transition: 'color 0.3s' }}>
                Fill out the form and we'll get back to you within 24 hours.
                We hate spam as much as you do, so your details are safe with us.
              </p>
            </div>

            <form className="contact-form reveal-text" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" style={{ color: 'var(--lb-text)' }}>Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  style={{ color: 'var(--page-fg)', borderColor: 'var(--lb-text)' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" style={{ color: 'var(--lb-text)' }}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@company.com"
                  style={{ color: 'var(--page-fg)', borderColor: 'var(--lb-text)' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" style={{ color: 'var(--lb-text)' }}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                  placeholder="Tell us about your goals..."
                  style={{ color: 'var(--page-fg)', borderColor: 'var(--lb-text)' }}
                ></textarea>
              </div>
              <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
              </button>
              {status === 'error' && <p style={{ color: 'red', marginTop: '10px' }}>Something went wrong. Please try again.</p>}
            </form>
          </div>
        </section>

        {/* 3. INFO SECTION (WHITE aka Lightbulb Theme) */}
        <section className="section-white" data-scroll-section style={{ backgroundColor: 'var(--lb-bg)', color: 'var(--lb-text)', transition: 'all 0.3s' }}>
          <div className="expand-label" style={{ backgroundColor: 'var(--lb-text)', color: 'var(--lb-bg)' }}>Contact Details</div>
          <h2 className="expand-title-section reveal-text" style={{ color: 'var(--lb-text)' }}>Other ways to connect.</h2>

          <ul className="contact-info-list" style={{ color: 'var(--lb-text)' }}>
            <li className="contact-info-item reveal-text">
              <span className="contact-info-label">Email</span>
              <a href="mailto:hello@capeweb.co.za" className="contact-info-value" style={{ color: 'var(--lb-text)' }}>hello@capeweb.co.za</a>
            </li>
            <li className="contact-info-item reveal-text">
              <span className="contact-info-label">Phone</span>
              <a href="tel:+27211234567" className="contact-info-value" style={{ color: 'var(--lb-text)' }}>+27 (0) 21 123 4567</a>
            </li>
            <li className="contact-info-item reveal-text">
              <span className="contact-info-label">Office</span>
              <span className="contact-info-value" style={{ color: 'var(--lb-text)' }}>Cape Town, South Africa</span>
            </li>
          </ul>
        </section>

        {/* FOOTER */}
        <section className="footer-section" data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
          <Footer />
        </section>

      </div>
    </div>
  );
}

export default Contact;
