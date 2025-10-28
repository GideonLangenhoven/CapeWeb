import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonial from './components/Testimonial';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import './styles/main.css';

function App() {
  return (
    <div className="site-container">
      <Header />
      <main>
        <Hero />
        <Services />
        <Testimonial />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}

export default App;