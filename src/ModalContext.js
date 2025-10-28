import React, { createContext, useState, useCallback } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const openModal = useCallback((imageArray, index) => {
    setImages(imageArray);
    setCurrentIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setImages([]);
    setCurrentIndex(null);
  }, []);

  const nextImage = useCallback((e) => {
    e.stopPropagation();
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  }, [images]);

  const prevImage = useCallback((e) => {
    e.stopPropagation();
    setCurrentIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
  }, [images]);

  const value = {
    isModalOpen,
    images,
    currentIndex,
    openModal,
    closeModal,
    nextImage,
    prevImage,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};