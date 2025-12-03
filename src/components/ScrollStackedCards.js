import React, { useMemo } from 'react';
import '../styles/ScrollStackedCards.css';

const servicesData = [
  {
    id: 1,
    title: "Web Development",
    description: "Custom websites and web applications built with modern technologies, optimized for performance and conversion.",
    services: ["Shopify Development", "Custom Web Apps", "E-commerce Solutions", "API Integrations"],
    color: "#fde047"
  },
  {
    id: 2,
    title: "Digital Marketing",
    description: "Data-driven marketing strategies that drive real business growth and measurable ROI.",
    services: ["Meta Ads Management", "Google Ads", "SEO Strategy", "Content Marketing"],
    color: "#22d3ee"
  },
  {
    id: 3,
    title: "Automation & AI",
    description: "Intelligent automation solutions that streamline operations and enhance customer experiences.",
    services: ["WhatsApp Automation", "AI Chatbots", "Workflow Automation", "Process Optimization"],
    color: "#f472b6"
  },
  {
    id: 4,
    title: "Brand & Design",
    description: "Strategic design that captures attention and builds memorable brand identities.",
    services: ["Brand Identity", "UI/UX Design", "Visual Design", "Design Systems"],
    color: "#fb923c"
  },
  {
    id: 5,
    title: "Strategy & Consulting",
    description: "Expert guidance to navigate digital transformation and accelerate business growth.",
    services: ["Digital Strategy", "Tech Consulting", "Growth Planning", "Analytics Setup"],
    color: "#4ade80"
  }
];

export default function ScrollStackedCards() {
  const stripeColors = useMemo(() => servicesData.map(s => s.color), []);

  // Calculate enough scrollable area so all sticky cards can stack without disappearing
  const containerMinHeight = useMemo(() => {
    const cardHeight = 84; // vh
    const offsetStep = 5; // vh
    const buffer = 20; // vh
    return `calc(${cardHeight}vh + ${(servicesData.length - 1) * offsetStep}vh + ${buffer}vh)`;
  }, []);

  return (
    <>
      {/* Color Stripes at the top */}
      <div className="stacked-stripes">
        {stripeColors.map((color, i) => (
          <div key={i} style={{ backgroundColor: color }}></div>
        ))}
      </div>

      {/* Stacked Cards Container */}
      <div
        className="stacked-sections-container"
        style={{
          minHeight: containerMinHeight
        }}
      >
        {servicesData.map((card, index) => {
          const topOffset = index * 5; // vh
          return (
            <div
              key={card.id}
              className="stacked-section-card"
              style={{
                top: `${topOffset}vh`,
                backgroundColor: card.color,
                zIndex: index + 1
              }}
            >
              <div className="stacked-card-content">
                <div className="card-header">
                  <h2>{card.title}</h2>
                  <a href="/work" className="card-cta">
                    Our Work <span className="arrow">→</span>
                  </a>
                </div>

                <div className="card-body">
                  <div className="card-description">
                    <p>{card.description}</p>
                  </div>

                  <div className="card-services-list">
                    {card.services.map((service, i) => (
                      <span key={i} className="service-item">{service}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
