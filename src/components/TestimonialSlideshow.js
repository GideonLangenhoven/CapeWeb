// src/components/TestimonialSlideshow.js

import React, { useState, useEffect } from 'react';
import { homeData } from '../data';
import '../styles/TestimonialSlideshow.css';

const TestimonialSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const testimonials = homeData.testimonials;

  const handlePrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % testimonials.length
        );
        setIsTransitioning(false);
      }, 500);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [isTransitioning]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="testimonials-container">
      <div className="testimonials-header">
        <h2>What Our Clients Say</h2>
        <div className="testimonial-divider">
          <span className="divider-line"></span>
          <span className="divider-icon">❀</span>
          <span className="divider-line"></span>
        </div>
      </div>
      
      <div className="testimonial-slider">
        <button 
          className="nav-arrow prev" 
          onClick={handlePrevious}
          aria-label="Previous testimonial"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className={`testimonial-card ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <div className="testimonial-content">
            <div className="quote-icon">"</div>
            <p className="testimonial-quote">{currentTestimonial.quote}</p>
            <div className="testimonial-author">
              <img 
                src={currentTestimonial.image} 
                alt={currentTestimonial.author} 
                className="author-image"
              />
              <div className="author-info">
                <h4>{currentTestimonial.author}</h4>
                <p className="author-role">{currentTestimonial.role}</p>
                <p className="author-company">{currentTestimonial.company}</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="nav-arrow next" 
          onClick={handleNext}
          aria-label="Next testimonial"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="testimonial-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              if (!isTransitioning && index !== currentIndex) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }
            }}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlideshow;