import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './SplitRevealLogo.css';

const SplitRevealLogo = () => {
  const logoRef = useRef(null);
  const containerRef = useRef(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const textCycleIntervalRef = useRef(null);
  const autoPlayIntervalRef = useRef(null);

  const services = ['WEBSITES', 'AUTOMATIONS', 'SOCIAL MEDIA', 'GRAPHIC DESIGN'];

  // Remove auto-play - only open on hover

  useEffect(() => {
    // Cycle through texts when hovered
    if (isHovered) {
      textCycleIntervalRef.current = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % services.length);
      }, 2000);
    } else {
      if (textCycleIntervalRef.current) {
        clearInterval(textCycleIntervalRef.current);
      }
      setCurrentTextIndex(0);
    }

    return () => {
      if (textCycleIntervalRef.current) {
        clearInterval(textCycleIntervalRef.current);
      }
    };
  }, [isHovered, services.length]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link to="/" style={{ textDecoration: 'none' }}>
      <div
        ref={containerRef}
        className="split-logo-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={logoRef} className={`logo-split-reveal ${isHovered ? 'opened' : ''}`}>
          <div className="logo-panels">
            <div className="panel panel-left">
              <span>CAPE</span>
            </div>
            <div className="panel panel-right">
              <span>WEB</span>
            </div>
          </div>
          <div className="inner-content">
            {services.map((service, index) => (
              <div
                key={service}
                className={`inner-text ${currentTextIndex === index && isHovered ? 'active' : ''}`}
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SplitRevealLogo;
