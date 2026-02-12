import React from 'react';
import { homeData } from '../data';
import '../styles/LogoRibbon.css';

const LogoRibbon = () => {
  return (
    <div className="logo-ribbon-container">
      <div className="logo-ribbon-track">
        {/* Generate 4 sets of logos for seamless infinite scroll on wide screens */}
        {[...Array(4)].map((_, setIndex) => (
          <React.Fragment key={`set-${setIndex}`}>
            {homeData.clientLogos.map((logo, index) => (
              <div key={`logo-${setIndex}-${index}`} className="logo-item">
                <img src={logo.logo} alt={`${logo.name} logo`} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LogoRibbon; 