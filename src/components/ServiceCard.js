import React, { useState } from 'react';

const ServiceCard = ({ service, onOpenModal, onCardClick, isActive }) => {
  // This state is ONLY for the temporary desktop hover effect.
  const [isHovered, setIsHovered] = useState(false);

  // A card is "lifted" if it's being hovered on (desktop) OR if it's the active card (mobile tap).
  const isLifted = isHovered || isActive;

  // --- ROBUST EVENT HANDLING ---

  // For Desktop: Classic hover-in, hover-out.
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // For Mobile (and Desktop Clicks): This toggles the active card state via the parent.
  const handleCardClick = () => {
    onCardClick(service.id);
  };

  // This click is ONLY for the "View Details" button.
  const handleViewDetailsClick = (e) => {
    e.stopPropagation(); // Prevents the main card's onClick from firing. CRITICAL.
    onOpenModal(service);
  };

  return (
    <div
      id="make-3D-space"
      // Use onClick for the most reliable tap/click detection across devices.
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        id="product-card"
        // The 'animate' class is now controlled by the unified 'isLifted' variable.
        className={isLifted ? 'animate' : ''}
      >
        <div id="product-front">
          <img src={service.image} alt={service.title} />
          <div className="image_overlay"></div>

          <div className="card-title-container">
            <h2>{service.title}</h2>
          </div>

          <div id="view_details" onClick={handleViewDetailsClick}>
            View Details
          </div>

          <div className="stats">
            <div className="stats-container">
              <span className="product_name">{service.summaryTitle}</span>
              <p>{service.summaryDescription}</p>
              <div className="product-options">
                {service.summaryOptions.map((opt, index) => (
                  <div key={index}>
                    <strong>{opt.type}</strong>
                    <span>{opt.details}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;