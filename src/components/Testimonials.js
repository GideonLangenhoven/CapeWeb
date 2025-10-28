import React from 'react';
import TestimonialSlideshow from '../components/TestimonialSlideshow';
import '../styles/pages.css';

const Testimonials = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>Client results and wins</h1>
        <p className="page-intro">Short stories about growth, speed, and saved time.</p>
        <div className="testimonials-section">
          <TestimonialSlideshow fullPage={true} />
        </div>
        <div className="cta-section">
          <h2>Ready to grow?</h2>
          <p>Book a free strategy call and get a custom plan.</p>
          <a href="/contact" className="cta-button">Book a Free Strategy Call</a>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
