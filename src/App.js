import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Resources from './pages/Resources';
import Gallery from './components/gallery/Gallery';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import ComponentLibrary from './pages/ComponentLibrary';
import './styles/main.css';
import { ModalProvider } from './context/ModalContext';
import Modal from './components/Modal'; // Import our new universal modal
import useVoiceflowWidget from './hooks/useVoiceflowWidget'; // Import the Voiceflow widget hook
import ScrollToTopButton from './components/ScrollToTopButton'; // Import ScrollToTopButton
import CustomCursor from './components/CustomCursor'; // Import custom cursor
import { ErrorBoundary, CookieConsent } from './components/shared';

// Main App component
function App() {
  // Initialize Voiceflow widget
  useVoiceflowWidget();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="app-shell">
      <CustomCursor />
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/component-library" element={<ComponentLibrary />} />
          <Route path="*" element={<Home />} /> {/* Fallback route */}
        </Routes>
      </main>
      <Footer />
      <Modal />
      <ScrollToTopButton />
      <CookieConsent />
    </div>
  );
}

// App wrapper with providers
export default function AppWithProvider() {
  return (
    <ErrorBoundary>
      <ModalProvider>
        <App />
      </ModalProvider>
    </ErrorBoundary>
  );
}
