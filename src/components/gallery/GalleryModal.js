import React, { useContext, useEffect } from 'react';
import { ModalContext } from '../../context/ModalContext'; // Adjust path if necessary
import '../../styles/Home.css'; // We can reuse the modal styles from Home.css

const GalleryModal = () => {
  // Get all modal state and functions from the global context
  const { isModalOpen, images, currentIndex, closeModal, nextImage, prevImage } = useContext(ModalContext);

  // This effect handles keyboard controls and body scroll locking
  useEffect(() => {
    // Don't run if the modal is not open
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextImage(e);
      if (e.key === 'ArrowLeft') prevImage(e);
    };

    window.addEventListener('keydown', handleKeyDown);

    // This is the stable scroll-lock solution
    const scrollPosition = window.scrollY;
    document.body.style.overflow = 'hidden';

    // Cleanup function runs when the modal closes
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      window.scrollTo(0, scrollPosition);
    };
  }, [isModalOpen, closeModal, nextImage, prevImage]); // Effect dependencies

  // If the modal isn't open or no image is selected, render nothing
  if (!isModalOpen || currentIndex === null) {
    return null;
  }

  // Function to close the modal when the dark background is clicked
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="carousel-modal" onClick={handleBackdropClick}>
      <button className="modal-close-button" onClick={closeModal} aria-label="Close image view">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button className="modal-nav-button modal-prev" onClick={prevImage} aria-label="Previous image">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
         </svg>
      </button>

      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={images[currentIndex]} alt={`Full screen view of event ${currentIndex + 1}`} />
      </div>
      
      <button className="modal-nav-button modal-next" onClick={nextImage} aria-label="Next image">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
         </svg>
      </button>
    </div>
  );
};

export default GalleryModal;