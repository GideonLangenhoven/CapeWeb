import React, { useEffect, useRef } from 'react';
import useLocomotiveScroll from '../hooks/useLocomotiveScroll';
import useColorChange from '../hooks/useColorChange';
import Footer from '../components/Footer';
import './Contact.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Contact() {
  const scrollRef = useLocomotiveScroll(true);
  const containerRef = useRef(null);
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

  useColorChange(scrollRef);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reveals = document.querySelectorAll('.reveal-text');
      reveals.forEach((el) => {
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              scroller: containerRef.current,
              start: 'top 85%',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="expand-page" data-scroll-container ref={scrollRef}>
      <div ref={containerRef}>

        {/* 1. HERO SECTION (WHITE) */}
        <section className="section-white" data-scroll-section data-bgcolor="#ffffff" data-textcolor="#0b0f1a">
          <div className="expand-label">Get In Touch</div>
          <h1 className="expand-title-hero reveal-text">
            LET'S START A<br />
            CONVERSATION.
          </h1>
          <p className="expand-text-lg reveal-text" style={{ color: '#333', marginTop: '2rem' }}>
            Whether you have a specific project in mind or just want to explore what's possible, we're here to listen.
          </p>
        </section>

        {/* 2. FORM SECTION (BLACK) */}
        <section className="section-black" data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
          <div className="contact-grid">
            <div className="reveal-text">
              <h2 className="expand-title-section">Tell us about your project.</h2>
              <p className="expand-text-lg" style={{ opacity: 0.8 }}>
                Fill out the form and we'll get back to you within 24 hours.
                We hate spam as much as you do, so your details are safe with us.
              </p>
            </div>

            <form className="contact-form reveal-text" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@company.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                  placeholder="Tell us about your goals..."
                ></textarea>
              </div>
              <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
              </button>
              {status === 'error' && <p style={{ color: 'red', marginTop: '10px' }}>Something went wrong. Please try again.</p>}
            </form>
          </div>
        </section>

        {/* 3. INFO SECTION (WHITE) */}
        <section className="section-white" data-scroll-section data-bgcolor="#ffffff" data-textcolor="#0b0f1a">
          <div className="expand-label" style={{ backgroundColor: '#000', color: '#fff' }}>Contact Details</div>
          <h2 className="expand-title-section reveal-text">Other ways to connect.</h2>

          <ul className="contact-info-list">
            <li className="contact-info-item reveal-text">
              <span className="contact-info-label">Email</span>
              <a href="mailto:hello@capeweb.co.za" className="contact-info-value">hello@capeweb.co.za</a>
            </li>
            <li className="contact-info-item reveal-text">
              <span className="contact-info-label">Phone</span>
              <a href="tel:+27211234567" className="contact-info-value">+27 (0) 21 123 4567</a>
            </li>
            <li className="contact-info-item reveal-text">
              <span className="contact-info-label">Office</span>
              <span className="contact-info-value">Cape Town, South Africa</span>
            </li>
          </ul>
        </section>

        {/* FOOTER */}
        <section data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
          <Footer />
        </section>

      </div>
    </div>
  );
}

export default Contact;
