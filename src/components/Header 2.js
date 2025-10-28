// src/components/Header.js

import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import { ThemeContext } from '../App';

// SVG Icon for Sun (Light Mode)
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

// SVG Icon for Moon (Dark Mode)
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="site-header">
        <nav className="nav-container">
          <Link to="/" className="logo" onClick={e => { closeMobileMenu(); window.scrollTo(0,0); }}>
            <img src={require('../images/RDSLOGO.png')} alt="capeweb Logo" style={{ height: '92px', width: 'auto', display: 'block' }} />
          </Link>
          
          <button
            className={`mobile-menu-button ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}> 
            <ul>
              <li className={isActive('/') ? 'active' : ''}>
                <Link to="/" onClick={e => { closeMobileMenu(); window.scrollTo(0,0); }}>Home</Link>
              </li>
              <li className={isActive('/services') ? 'active' : ''}>
                <Link to="/services" onClick={e => { closeMobileMenu(); window.scrollTo(0,0); }}>Services</Link>
              </li>
              <li className={isActive('/gallery') ? 'active' : ''}>
                <Link to="/gallery" onClick={e => { closeMobileMenu(); window.scrollTo(0,0); }}>Gallery</Link>
              </li>
              <li>
                <Link to="/contact" className="contact-link" onClick={e => { closeMobileMenu(); window.scrollTo(0,0); }}>
                  Contact
                </Link>
              </li>
              {/* Show the toggle button inside the menu only on mobile (when menu is open) */}
              {isMobileMenuOpen && (
                <li className="theme-toggle-nav-item mobile-only">
                  <div className="theme-toggle-nav-wrapper">
                    <button
                      className="theme-toggle-btn"
                      onClick={toggleTheme}
                      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                  </div>
                </li>
              )}
            </ul>
          </div>
          {/* Always show the toggle button in the nav bar (desktop and mobile header) */}
          <div className="theme-toggle-nav-wrapper desktop-only">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </nav>
      </header>
      
      <div 
        className={`menu-backdrop ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={closeMobileMenu}
      />
    </>
  );
}

export default Header;
