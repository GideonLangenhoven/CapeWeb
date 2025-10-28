import React, { useState, useEffect, useCallback } from 'react';
import './ImageLightbox.css';

const ImageLightbox = ({ images, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  // Add keyboard navigation for the lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const currentImage = images[currentIndex];

  return (
    <div className="image-lightbox-container">
        <button className="lightbox-nav-btn prev" onClick={goToPrev} aria-label="Previous image">
            &#10094;
        </button>

        <figure className="lightbox-figure">
            <img src={currentImage.src || currentImage} alt={currentImage.title || 'Gallery image'} />
            {currentImage.title && (
                <figcaption className="lightbox-caption">
                    <h3>{currentImage.title}</h3>
                    {currentImage.description && <p>{currentImage.description}</p>}
                </figcaption>
            )}
        </figure>

        <button className="lightbox-nav-btn next" onClick={goToNext} aria-label="Next image">
            &#10095;
        </button>
    </div>
  );
};

export default ImageLightbox;