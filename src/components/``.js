import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ImageCarousel.css';

const ImageCarousel = ({ images }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollPositionRef = useRef(0);

  // We duplicate the images to create a seamless, infinite loop effect
  const imageList = [...images, ...images];
  
  // Function to handle clicking an image
  const handleImageClick = (imageUrl, index) => {
    const actualIndex = index % images.length; // Get the index in the original array
    setCurrentImageIndex(actualIndex);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Restore scroll position after a short delay to prevent page jumping
    setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 0);
  }, []);
  
  // Effect to handle body scrolling when modal opens/closes
  useEffect(() => {
    if (isModalOpen) {
      // Save current scroll position
      scrollPositionRef.current = window.scrollY;
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scrolling
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to ensure scrolling is restored if component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  // Navigate to next image
  const goToNext = useCallback((e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // Navigate to previous image
  const goToPrev = useCallback((e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'Escape':
          handleCloseModal();
          break;
        case 'ArrowRight':
          goToNext({ stopPropagation: () => {} });
          break;
        case 'ArrowLeft':
          goToPrev({ stopPropagation: () => {} });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleCloseModal, goToNext, goToPrev]);

  return (
    <div 
      className="carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Row */}
      <div className={`carousel-track top-track ${isPaused ? 'paused' : ''}`}>
        {imageList.map((img, index) => (
          <div 
            className="carousel-card" 
            key={`top-${index}`} 
            onClick={() => handleImageClick(img, index)}
          >
            <img src={img} alt={`Gallery of successful team events ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Bottom Row (moves in the opposite direction) */}
      <div className={`carousel-track bottom-track ${isPaused ? 'paused' : ''}`}>
        {imageList.map((img, index) => (
          <div 
            className="carousel-card" 
            key={`bottom-${index}`} 
            onClick={() => handleImageClick(img, index + images.length)}
          >
            <img src={img} alt={`Gallery of corporate culture workshops ${index + 1}`} />
          </div>
        ))}
      </div>
      
      {/* Modal/Lightbox for full-screen image view */}
      {isModalOpen && (
        <div className="carousel-modal" onClick={handleCloseModal}>
          <button 
            className="modal-close-button" 
            onClick={handleCloseModal} 
            aria-label="Close image view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button className="modal-navigation left" onClick={goToPrev} aria-label="Previous image">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={images[currentImageIndex]} 
              alt={`Full screen view of event ${currentImageIndex + 1}`} 
            />
          </div>
          
          <button className="modal-navigation right" onClick={goToNext} aria-label="Next image">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;