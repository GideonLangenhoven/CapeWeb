import React, { useEffect, useCallback } from 'react';
import { useModal } from '../context/ModalContext';
import '../styles/Modal.css';

const Modal = () => {
  const { isOpen, closeModal, modalContent, modalConfig } = useModal();

  // Handle 'Escape' key press to close the modal
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  }, [closeModal]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleKeyDown]);

  // Handle clicks on the backdrop to close the modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!isOpen) {
    return null;
  }

  // Determine the size class for the modal content
  const sizeClass = modalConfig.size ? `modal-content--${modalConfig.size}` : '';

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className={`modal-content ${sizeClass}`}>
        <button
          className="modal-close-btn"
          onClick={closeModal}
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="modal-body">
          {modalContent}
        </div>
      </div>
    </div>
  );
};

export default Modal;