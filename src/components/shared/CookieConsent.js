import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import './CookieConsent.css';

/**
 * CookieConsent Component
 *
 * POPIA-compliant cookie consent banner.
 * Appears on first visit and stores consent in localStorage.
 */
export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-description"
    >
      <div className="cookie-content">
        <div className="cookie-text">
          <h3 className="cookie-title">We value your privacy</h3>
          <p id="cookie-description" className="cookie-description">
            We use cookies to improve your experience on our site and to show you relevant content.
            By clicking "Accept", you consent to our use of cookies.{' '}
            <a href="/privacy" className="cookie-link">
              Learn more
            </a>
          </p>
        </div>
        <div className="cookie-actions">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDecline}
            className="cookie-btn"
          >
            Decline
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAccept}
            className="cookie-btn"
          >
            Accept Cookies
          </Button>
        </div>
      </div>
    </div>
  );
}
