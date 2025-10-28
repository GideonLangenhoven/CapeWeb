import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Home.css';

// --- 1. The Gallery Modal Component ---
const GalleryModal = ({ currentImage, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext(e);
      if (e.key === 'ArrowLeft') onPrev(e);
    };
    window.addEventListener('keydown', handleKeyDown);

    const scrollPosition = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
    };
  }, [onClose, onNext, onPrev]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!currentImage) return null;

  return (
    <div className="carousel-modal" onClick={handleBackdropClick}>
      <button className="modal-close-button" onClick={onClose} aria-label="Close image view">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button className="modal-nav-button modal-prev" onClick={(e) => { e.stopPropagation(); onPrev(e); }} aria-label="Previous image">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
         </svg>
      </button>

      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={currentImage} alt="Full screen view of event" />
      </div>
      
      <button className="modal-nav-button modal-next" onClick={(e) => { e.stopPropagation(); onNext(e); }} aria-label="Next image">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
         </svg>
      </button>
    </div>
  );
};

// --- 2. The Image Carousel Component ---
const ImageCarousel = ({ images }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [modalState, setModalState] = useState({ open: false, index: null });

  const handleImageClick = (e, index) => {
    e.stopPropagation();
    setModalState({ open: true, index: index % images.length });
  };

  const handleCloseModal = useCallback(() => {
    setModalState({ open: false, index: null });
  }, []);

  const handleNextInModal = useCallback((e) => {
    if (e) e.stopPropagation();
    setModalState((prev) => ({ ...prev, index: (prev.index + 1) % images.length }));
  }, [images.length]);

  const handlePrevInModal = useCallback((e) => {
    if (e) e.stopPropagation();
    setModalState((prev) => ({ ...prev, index: (prev.index - 1 + images.length) % images.length }));
  }, [images.length]);

  const imageList = [...images, ...images];

  return (
    <>
      <div className="carousel-container" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <div className={`carousel-track top-track ${isPaused ? 'paused' : ''}`}>
          {imageList.map((img, index) => (
            <div className="carousel-card" key={`top-${index}`} onClick={(e) => handleImageClick(e, index)}>
              <img src={img} alt={`Gallery of successful team events ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className={`carousel-track bottom-track ${isPaused ? 'paused' : ''}`}>
          {imageList.map((img, index) => (
            <div className="carousel-card" key={`bottom-${index}`} onClick={(e) => handleImageClick(e, index)}>
              <img src={img} alt={`Gallery of corporate culture workshops ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {modalState.open && modalState.index !== null && (
        <GalleryModal 
          currentImage={images[modalState.index]} 
          onClose={handleCloseModal}
          onNext={handleNextInModal}
          onPrev={handlePrevInModal}
        />
      )}
    </>
  );
};

// --- 3. The Main Home Page Component ---
const Home = () => {
    const scrollerRef = useRef(null);
    const testimonialsContainerRef = useRef(null);
    const heroParaRef = useRef(null);
    const servicesImgParaRef = useRef(null);

    const galleryImages = [ 
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", 
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", 
      "https://images.unsplash.com/photo-1519167758481-83f29b1fe26d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", 
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", 
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", 
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", 
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", 
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
    ];
    
    const heroImage = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80";
    const servicesImage = "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80";
    
    const testimonials = [ 
      { quote: "Working with this team was an absolute dream. They took our vision and brought it to life with such elegance and precision.", author: "Sarah & Tom", event: "Wedding Celebration", image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" }, 
      { quote: "The professionalism and creativity are unmatched. The feedback from attendees was overwhelmingly positive. Flawlessly executed.", author: "Johnathan Lee", event: "CEO, Innovate Corp.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" }, 
      { quote: "From the initial consultation to the day of the event, the communication was seamless. They are true experts in their field.", author: "Maria Garcia", event: "50th Anniversary Party", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" }, 
      { quote: "I was truly impressed by their attention to detail. Every element was thoughtfully considered and beautifully implemented.", author: "Aisha Khan", event: "Product Launch Event", image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" }, 
      { quote: "They transformed our charity fundraiser into an unforgettable evening, helping us exceed our fundraising goals.", author: "David Chen", event: "Director, Unity Foundation", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" }, 
      { quote: "An incredible team that is both organized and inspired. They took all the stress out of planning and allowed us to simply enjoy our special day.", author: "Emily & Mark", event: "Private Estate Wedding", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" } 
    ];
    
    const extendedTestimonials = [...testimonials, ...testimonials];
    const clientLogos = [ 
      'https://logodix.com/logo/1722880.png', 
      'https://logodix.com/logo/1722880.png', 
      'https://logodix.com/logo/1722880.png', 
      'https://logodix.com/logo/1722880.png', 
      'https://logodix.com/logo/1722880.png', 
      'https://logodix.com/logo/1722880.png', 
    ];
  
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (heroParaRef.current) {
                        heroParaRef.current.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
                    }
                    if (servicesImgParaRef.current) {
                        const rect = servicesImgParaRef.current.getBoundingClientRect();
                        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                        if (scrollPercent > 0 && scrollPercent < 1) {
                            const yPos = (scrollPercent - 0.5) * -80;
                            servicesImgParaRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`;
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        const sections = document.querySelectorAll('.services-section, .testimonials-section, .client-logo-ribbon, .gallery-carousel-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.2 });
        sections.forEach(section => observer.observe(section));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            sections.forEach(section => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);
  
    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        let scrollInterval;
        const startScrolling = () => {
            scrollInterval = setInterval(() => {
                if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
                    scroller.scrollLeft = 0;
                } else {
                    scroller.scrollLeft += 1;
                }
            }, 30);
        };
        const stopScrolling = () => clearInterval(scrollInterval);
        startScrolling();
        const container = testimonialsContainerRef.current;
        container.addEventListener('mouseenter', stopScrolling);
        container.addEventListener('mouseleave', startScrolling);
        return () => {
            clearInterval(scrollInterval);
            if (container) {
                container.removeEventListener('mouseenter', stopScrolling);
                container.removeEventListener('mouseleave', startScrolling);
            }
        };
    }, []);
  
    const handleNextTestimonial = () => {
        const scroller = scrollerRef.current;
        if (scroller) {
            const cardWidth = 350 + 32;
            scroller.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
    };
  
    return (
        <div className="home-page-clone">
          <section className="hero-section">
            <div ref={heroParaRef} className="parallax-background" style={{ backgroundImage: `url(${heroImage})` }}></div>
            <div className="hero-pattern-overlay"></div>
            <div className="hero-content">
              <div className="hero-text-content">
                <h1 className="hero-main-title">Timeless</h1>
                <h2 className="hero-subtitle">Events</h2>
                <h3 className="hero-accent">Crafted with Passion</h3>
              </div>
            </div>
            <a href="#services" className="hero-scroll-indicator" aria-label="Scroll down">
              <div className="scroll-dot"></div>
            </a>
            <div className="indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </section>

          <section id="services" className="services-section">
            <div className="services-text-column">
              <div className="services-content">
                <h2>Our Services</h2>
                <div className="services-icon">
                  <svg className="floral-ornament" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 20 Q30 5 50 20 Q70 35 90 20 Q110 5 120 20" stroke="#8b7355" strokeWidth="2" fill="none"/>
                    <circle cx="30" cy="15" r="3" fill="#8b7355"/><circle cx="60" cy="20" r="4" fill="#8b7355"/><circle cx="90" cy="15" r="3" fill="#8b7355"/>
                  </svg>
                </div>
                <p>From intimate gatherings to grand celebrations, we specialize in creating unforgettable experiences tailored to your unique vision.</p>
                <a href="/contact" className="discover-button">Book a Free Strategy Call</a>
              </div>
            </div>
            <div className="services-image-column">
                <div ref={servicesImgParaRef} className="services-image-inner" style={{ backgroundImage: `url(${servicesImage})` }}></div>
            </div>
          </section>
          
          <section className="testimonials-section">
              <div className="testimonials-header">
                  <h2>What Our Clients Say</h2>
                  <div className="quote-icon">"</div>
              </div>
              <div className="testimonials-outer-container" ref={testimonialsContainerRef}>
                  <div className="testimonials-scroller" ref={scrollerRef}>
                      {extendedTestimonials.map((testimonial, index) => (
                          <div className="testimonial-card" key={index}>
                              <div className="testimonial-image-wrapper"><img src={testimonial.image} alt={`Portrait of ${testimonial.author}`} /></div>
                              <div className="testimonial-text-wrapper">
                                  <h3 className="testimonial-heading">{testimonial.author}</h3>
                                  <p className="testimonial-subheading">{testimonial.event}</p>
                                  <p className="testimonial-quote">{`"${testimonial.quote}"`}</p>
                              </div>
                          </div>
                      ))}
                  </div>
                  <button className="testimonial-arrow-next" aria-label="Next testimonial" onClick={handleNextTestimonial}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
              </div>
          </section>
  
          <section className="client-logo-ribbon">
            <div className="logo-track-wrapper">
              <div className="logo-track">
                {[...clientLogos, ...clientLogos].map((logo, index) => (
                  <img key={index} src={logo} alt={`Client logo ${index + 1}`} className="client-logo" />
                ))}
              </div>
            </div>
          </section>
  
          <section className="gallery-carousel-section">
            <div className="gallery-carousel-header">
              <h2>Gallery of Success</h2>
              <p>Explore a curated collection of our most memorable events, each telling a unique story of collaboration and celebration.</p>
            </div>
            <ImageCarousel images={galleryImages} />
            <div className="gallery-carousel-cta">
              <a href="/gallery" className="discover-button-dark">View Full Gallery</a>
            </div>
          </section>
        </div>
    );
};
  
export default Home;
