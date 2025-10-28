import React, { useEffect, useRef } from 'react';
import './HorizontalScroll.css';

const HorizontalScroll = () => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Initialize after DOM is ready
    const initTimer = setTimeout(() => {
      if (window.gsap && window.ScrollTrigger) {
        initHorizontalScroll();
      }
    }, 500);

    return () => {
      clearTimeout(initTimer);
      // Cleanup ScrollTrigger instances
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
      // Cleanup Locomotive Scroll
      if (scrollerRef.current) {
        scrollerRef.current.destroy();
      }
    };
  }, []);

  const initHorizontalScroll = () => {
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn("GSAP or ScrollTrigger not loaded");
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    // Wait for elements to be in DOM
    const checkElements = () => {
      const pinWrap = document.querySelector(".pin-wrap");
      const sectionPin = document.querySelector("#sectionPin");

      if (!pinWrap || !sectionPin) {
        setTimeout(checkElements, 100);
        return;
      }

      // Force layout calculation for horizontal layout
      pinWrap.style.width = 'max-content';
      pinWrap.style.display = 'flex';
      pinWrap.style.flexDirection = 'row';

      // Get all child elements
      const items = pinWrap.children;
      console.log("Found", items.length, "items in pin-wrap");

      // Calculate total width
      let totalWidth = 0;
      for (let item of items) {
        totalWidth += item.offsetWidth + 100; // Add some padding
      }

      const horizontalScrollLength = totalWidth - window.innerWidth;

      console.log("Total width:", totalWidth);
      console.log("Window width:", window.innerWidth);
      console.log("Scroll length:", horizontalScrollLength);

      if (horizontalScrollLength <= 0) {
        console.warn("No horizontal scroll needed");
        return;
      }

      // Create the horizontal scroll animation
      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: "#sectionPin",
          start: "top top",
          end: () => `+=${horizontalScrollLength}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            console.log("Progress:", self.progress);
          }
        }
      });

      tl.to(".pin-wrap", {
        x: -horizontalScrollLength,
        ease: "none"
      });

      // Refresh after setup
      window.ScrollTrigger.refresh();

      // Setup video scroll triggers
      setupVideoScrollTriggers();
    };

    checkElements();
  };

  const setupVideoScrollTriggers = () => {
    const video = videoRef.current;
    if (!video) return;

    // Video play/pause trigger
    window.ScrollTrigger.create({
      trigger: ".scroll-triggered-video",
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        video.play().catch(e => console.log("Video play failed:", e));
      },
      onLeave: () => {
        video.pause();
      },
      onEnterBack: () => {
        video.play().catch(e => console.log("Video play failed:", e));
      },
      onLeaveBack: () => {
        video.pause();
      }
    });

    // Video scale animation
    window.ScrollTrigger.create({
      trigger: ".horizontal-closing-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const scale = 1 + (self.progress * 0.5); // Scale from 1 to 1.5
        window.gsap.set(video, {
          scale: scale,
          transformOrigin: "center center"
        });
      }
    });
  };

  return (
    <div className="horizontal-scroll-container" ref={containerRef} data-cursor-section="work">
      <section data-bgcolor="#bcb8ad" data-textcolor="#032f35" className="horizontal-intro-section">
        <div>
          <h1 data-scroll data-scroll-speed="1">
            <span>Horizontal</span>
            <span>scroll</span>
            <span>section</span>
          </h1>
          <p data-scroll data-scroll-speed="2" data-scroll-delay="0.2">
            with GSAP ScrollTrigger & Locomotive Scroll
          </p>
        </div>
      </section>

      <section id="sectionPin">
        <div className="pin-wrap">
          <div className="horizontal-content-block">
            <h2>Our Process</h2>
            <p>We don't just build websites. We create intelligent business systems that work around the clock to grow your South African business.</p>
          </div>
          <div className="horizontal-service-card">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80" alt="Website Development" />
            <div className="horizontal-card-content">
              <h3>Modern Websites</h3>
              <p>Fast, responsive, conversion-focused websites that work perfectly on every device and generate leads 24/7.</p>
            </div>
          </div>
          <div className="horizontal-service-card">
            <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80" alt="AI Automation" />
            <div className="horizontal-card-content">
              <h3>AI Automation</h3>
              <p>Smart chatbots, automated workflows, and AI-powered systems that handle repetitive tasks so you can focus on growth.</p>
            </div>
          </div>
          <div className="horizontal-service-card">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80" alt="Growth Systems" />
            <div className="horizontal-card-content">
              <h3>Growth Systems</h3>
              <p>Complete business automation including CRM integration, lead scoring, and performance tracking that scales with you.</p>
            </div>
          </div>
        </div>
      </section>

      <section data-bgcolor="#e3857a" data-textcolor="#f1dba7" className="horizontal-closing-section">
        <video
          ref={videoRef}
          className="scroll-triggered-video"
          width="500"
          height="auto"
          muted
          loop
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/2795405/2795405-hd_1920_1080_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="horizontal-closing-content">
          <h2>Ready to automate your success?</h2>
          <p>Let's build something amazing together. Book your free strategy call and discover how we can transform your business.</p>
        </div>
      </section>
    </div>
  );
};

export default HorizontalScroll;