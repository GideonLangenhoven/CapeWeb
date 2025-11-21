import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import SplitRevealLogo from './SplitRevealLogo';

const navItems = [
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/gallery' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' }
];

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const selectorRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const updateScrollState = () => {
      // Non-home pages should always have a filled navbar
      if (location.pathname !== '/') {
        setIsScrolled(true);
        return;
      }

      const trigger = document.querySelector('[data-nav-fill-trigger]');
      const headerHeight = navRef.current ? navRef.current.offsetHeight : 0;

      if (!trigger) {
        setIsScrolled(window.scrollY > 40);
        return;
      }

      const triggerOffset = trigger.getBoundingClientRect().top + window.scrollY;
      const scrollPosition = window.scrollY + headerHeight;

      setIsScrolled(scrollPosition >= triggerOffset);

      // Keyhole transparency logic (Homepage only)
      const keyhole = document.getElementById('keyhole');
      if (keyhole) {
        const keyholeRect = keyhole.getBoundingClientRect();
        // Check if keyhole is in view (or reached)
        if (keyholeRect.top <= headerHeight && keyholeRect.bottom >= 0) {
          document.querySelector('.site-header').classList.add('site-header--keyhole-active');
        } else {
          document.querySelector('.site-header').classList.remove('site-header--keyhole-active');
        }
      }
    };

    updateScrollState();
    // Delay a second measurement to ensure DOM layout is ready
    const timer = setTimeout(updateScrollState, 50);

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      // Cleanup class
      const header = document.querySelector('.site-header');
      if (header) header.classList.remove('site-header--keyhole-active');
    };
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Update selector position
  useEffect(() => {
    const updateSelector = () => {
      if (!selectorRef.current || !navRef.current) return;

      const activeItem = navRef.current.querySelector('.nav-item.is-active');
      if (activeItem) {
        const left = activeItem.offsetLeft;
        const width = activeItem.offsetWidth;

        selectorRef.current.style.left = `${left}px`;
        selectorRef.current.style.width = `${width}px`;
        selectorRef.current.style.height = '';
        selectorRef.current.style.opacity = '1';
      } else {
        selectorRef.current.style.opacity = '0';
        selectorRef.current.style.width = '0px';
        selectorRef.current.style.left = '0px';
        selectorRef.current.style.height = '';
      }
    };

    updateSelector();
    window.addEventListener('resize', updateSelector);

    // Delay to ensure DOM is ready
    const timer = setTimeout(updateSelector, 100);
    const timer2 = setTimeout(updateSelector, 300);

    return () => {
      window.removeEventListener('resize', updateSelector);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;


  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <nav className="navbar navbar-expand-custom navbar-mainbg">
        <div className="container header-container">
          <Link to="/" className="navbar-brand navbar-logo" aria-label="capeweb home">
            <SplitRevealLogo />
          </Link>

          <button
            className={`navbar-toggler ${isMenuOpen ? 'navbar-toggler--open' : ''}`}
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="navbarSupportedContent"
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>

          <div
            className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`}
            id="navbarSupportedContent"
            ref={navRef}
          >
            <ul className="navbar-nav ml-auto">
              <div className="hori-selector" ref={selectorRef}>
                <div className="left"></div>
                <div className="right"></div>
              </div>
              {navItems.map((item) => (
                <li key={item.to} className={`nav-item ${isActive(item.to) ? 'is-active' : ''}`}>
                  <Link to={item.to} className="nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="header-actions">
            <Link to="/contact" className="btn btn-primary btn-nav" aria-label="Book a Free Strategy Call">
              Book a Free Strategy Call
            </Link>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav ${isMenuOpen ? 'mobile-nav--open' : ''}`} id="mobile-nav">
        <div className="mobile-nav__inner">
          <ul>
            {navItems.filter((item) => !item.isSecondary).map((item) => (
              <li key={item.to} className={isActive(item.to) ? 'is-active' : ''}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
          {navItems.some((item) => item.isSecondary) && (
            <details className="mobile-nav__more">
              <summary>More</summary>
              <ul>
                {navItems.filter((item) => item.isSecondary).map((item) => (
                  <li key={item.to} className={isActive(item.to) ? 'is-active' : ''}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
          <div className="mobile-nav__cta">
            <Link to="/contact" className="btn btn-primary">
              Book a Free Strategy Call
            </Link>
            <Link to="/resources" className="btn btn-ghost">
              Download the AI Time-Saver Guide
            </Link>
          </div>
        </div>
      </div>
      {isMenuOpen && <div className="mobile-nav__overlay" onClick={() => setIsMenuOpen(false)} aria-hidden="true" />}
    </header>
  );
}

export default Header;
