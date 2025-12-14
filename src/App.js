import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Resources from './pages/Resources';
import Gallery from './pages/Gallery';
import Work from './pages/Work';
import Contact from './pages/Contact';
import Intake from './pages/Intake';
import Privacy from './pages/Privacy';
import ComponentLibrary from './pages/ComponentLibrary';
import './styles/main.css';
import './styles/monochrome.css';
import { ModalProvider } from './context/ModalContext';
import Modal from './components/Modal'; // Import our new universal modal
import useVoiceflowWidget from './hooks/useVoiceflowWidget'; // Import the Voiceflow widget hook
import ScrollToTop from './components/ScrollToTop'; // Import ScrollToTop
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
      <ScrollToTop />
      <CustomCursor />
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/work" element={<Work />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/component-library" element={<ComponentLibrary />} />
          <Route path="*" element={<Home />} /> {/* Fallback route */}
        </Routes>
      </main>
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
