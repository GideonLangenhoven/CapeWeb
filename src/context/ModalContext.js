import React, { createContext, useState, useCallback, useContext } from 'react';

// 1. Create the context
export const ModalContext = createContext();

// 2. Create a provider component
export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalConfig, setModalConfig] = useState({});

  // Function to open the modal with specific content and configuration
  const openModal = useCallback((content, config = {}) => {
    setModalContent(content);
    setModalConfig(config); // e.g., { size: 'large' }
    setIsOpen(true);
  }, []);

  // Function to close the modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    // We delay clearing the content to allow for fade-out animations
    setTimeout(() => {
        setModalContent(null);
        setModalConfig({});
    }, 400); // This duration should match your CSS transition time
  }, []);

  const value = {
    isOpen,
    openModal,
    closeModal,
    modalContent,
    modalConfig,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};