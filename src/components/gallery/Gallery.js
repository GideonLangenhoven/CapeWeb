import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryData } from '../../data/galleryData';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Gallery.css';

const GalleryModal = ({ item, onClose, onNext, onPrev }) => {
  useEffect(() => {
    if (!item) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNext();
      if (event.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [item, onClose, onNext, onPrev]);

  if (!item) return null;

  return (
    <div className="gallery-modal" onClick={onClose} role="dialog" aria-modal="true">
      <button type="button" className="gallery-modal__close" onClick={onClose} aria-label="Close gallery">X</button>
      <button type="button" className="gallery-modal__nav gallery-modal__nav--prev" onClick={(event) => { event.stopPropagation(); onPrev(); }} aria-label="Previous project">&lt;</button>
      <div className="gallery-modal__body" onClick={(event) => event.stopPropagation()}>
        <img src={item.src} alt={item.title} />
        <div className="gallery-modal__meta">
          <span>{item.category}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </div>
      <button type="button" className="gallery-modal__nav gallery-modal__nav--next" onClick={(event) => { event.stopPropagation(); onNext(); }} aria-label="Next project">&gt;</button>
    </div>
  );
};

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  useScrollReveal();
  const categories = useMemo(() => ['All', ...Array.from(new Set(galleryData.map((item) => item.category)))], []);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredData = useMemo(() => {
    if (activeCategory === 'All') return galleryData;
    return galleryData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const openModal = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const closeModal = useCallback(() => setActiveIndex(null), []);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % filteredData.length;
    });
  }, [filteredData.length]);

  const showPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + filteredData.length) % filteredData.length;
    });
  }, [filteredData.length]);

  useEffect(() => {
    setActiveIndex(null);
  }, [activeCategory]);

  return (
    <div className="gallery-page">
      <section className="section gallery-hero">
        <div className="container gallery-hero__container">
          <div className="gallery-hero__copy" data-scroll-reveal>
            <span className="eyebrow">Work</span>
            <h1>Work that ships results.</h1>
            <p>Launches and automations that turn attention into revenue.</p>
            <div className="btn-group">
              <Link to="/contact" className="btn btn-primary">Book a Free Strategy Call</Link>
              <Link to="/services" className="btn btn-ghost">View services</Link>
            </div>
          </div>
          <div className="gallery-hero__meta surface-panel" data-scroll-reveal>
            <div className="surface-panel__shine" />
            <h3>Filters</h3>
            <div className="gallery-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`gallery-filter ${category === activeCategory ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <p>Each capture links back to a deliverable inside a broader plan.</p>
          </div>
        </div>
      </section>

      <section className="section gallery-grid-section">
        <div className="container">
          <div className="gallery-grid">
            {filteredData.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className="gallery-card"
                onClick={() => openModal(index)}
                data-scroll-reveal
              >
                <div className="gallery-card__media">
                  <img src={item.src} alt={item.title} />
                  <span className="gallery-card__category">{item.category}</span>
                </div>
                <div className="gallery-card__copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section gallery-cta">
        <div className="container shimmer-border" data-scroll-reveal>
          <div className="shimmer-inner gallery-cta__inner">
            <span className="eyebrow">Next step</span>
            <h2>Ready to see your plan?</h2>
            <p>We’ll translate your goal into a simple blueprint—wireframes, automation flow, and rollout plan.</p>
            <Link to="/contact" className="btn btn-primary">Book a Free Strategy Call</Link>
          </div>
        </div>
      </section>

      <GalleryModal
        item={activeIndex !== null ? filteredData[activeIndex] : null}
        onClose={closeModal}
        onNext={showNext}
        onPrev={showPrev}
      />
    </div>
  );
};

export default Gallery;
