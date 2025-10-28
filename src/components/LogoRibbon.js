import React from 'react';
import { homeData } from '../data';
import '../styles/LogoRibbon.css';

const LogoRibbon = () => {
  return (
    <div className="logo-ribbon-container">
      <div className="logo-ribbon-track">
        {/* First set of logos */}
        {homeData.clientLogos.map((logo, index) => (
          <div key={`logo-1-${index}`} className="logo-item">
            <img src={logo.logo} alt={`${logo.name} logo`} />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {homeData.clientLogos.map((logo, index) => (
          <div key={`logo-2-${index}`} className="logo-item">
            <img src={logo.logo} alt={`${logo.name} logo`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoRibbon; 