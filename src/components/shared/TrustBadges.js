import React from 'react';
import { CheckCircleIcon, ShieldCheckIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import './TrustBadges.css';

/**
 * TrustBadges Component
 *
 * Displays trust signals and badges to build credibility.
 * Shows security, compliance, and location information.
 */
export default function TrustBadges() {
  const badges = [
    {
      icon: <ShieldCheckIcon />,
      label: 'SSL Secure',
      description: 'Your data is encrypted'
    },
    {
      icon: <CheckCircleIcon />,
      label: 'POPIA Compliant',
      description: 'Privacy-first approach'
    },
    {
      icon: <ClockIcon />,
      label: '24/7 Support',
      description: 'Always here to help'
    },
    {
      icon: <MapPinIcon />,
      label: 'Cape Town Based',
      description: 'Local service, global standards'
    }
  ];

  return (
    <section className="trust-section" aria-label="Trust and security information">
      <div className="container">
        <div className="trust-badges">
          {badges.map((badge, index) => (
            <div key={index} className="trust-badge">
              <div className="trust-badge-icon">
                {badge.icon}
              </div>
              <div className="trust-badge-content">
                <h3 className="trust-badge-label">{badge.label}</h3>
                <p className="trust-badge-description">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
