import React from 'react';

const ServiceDetailModal = ({ service, onClose, isOpen }) => {
  if (!service) {
    return null;
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-header">
            <img src={service.image} alt={service.title} />
            <div className="modal-title-overlay">
                <h2>{service.title}</h2>
            </div>
        </div>
        <div className="modal-body">
            <p>{service.fullDescription}</p>
            <h3>Key Offerings</h3>
            <ul>
                {service.summaryOptions.map((option, index) => (
                    <li key={index}><strong>{option.type}:</strong> {option.details}</li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;