import React, { useCallback, useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const LOGO_ITEMS = ['FACEBOOK', 'DISNEY', 'AIRBNB', 'APPLE', 'SPARK', 'SAMSUNG', 'QUORA', 'SASS'];

const PRODUCT_CARDS = [
  {
    title: 'E-commerce Stores',
    description: 'Blazing speed, conversion UX, social proof on autopilot.',
    bg: 'https://cdn-front.freepik.com/home/anon-rvmp/professionals/designers.webp',
    thumb: 'https://cdn-front.freepik.com/home/anon-rvmp/professionals/img-designer.webp?w=480'
  },
  {
    title: 'Service Businesses',
    description: 'Rank locally, book online, automate replies.',
    bg: 'https://cdn-front.freepik.com/home/anon-rvmp/professionals/marketers.webp',
    thumb: 'https://cdn-front.freepik.com/home/anon-rvmp/professionals/img-marketer.webp?w=480'
  },
  {
    title: 'Content Creators',
    description: 'Grow subscribers with SEO-driven content engines.',
    bg: 'https://cdn-front.freepik.com/home/anon-rvmp/professionals/filmmakers.webp',
    thumb: 'https://cdn-front.freepik.com/home/anon-rvmp/professionals/img-film.webp?w=480'
  },
  {
    title: 'SaaS Companies',
    description: 'Explain value clearly. Convert trials into revenue.',
    bg: 'https://cdn-front.freepik.com/home/anon-rvmp/professionals/content-creators.webp',
    thumb: 'https://cdn-front.freepik.com/home/anon-rvmp/professionals/img-content.webp?w=480'
  },
  {
    title: 'Agencies',
    description: 'Portfolio sites that sell the next project.',
    bg: 'https://cdn-front.freepik.com/home/anon-rvmp/professionals/art-directors.webp',
    thumb: 'https://cdn-front.freepik.com/home/anon-rvmp/professionals/img-art.webp?w=480'
  }
];

const REVIEWS = [
  { name: 'Alice', role: 'Founder', avatar: 'https://i.pravatar.cc/150?img=23', review: 'Monthly leads up 3× within 8 weeks. Pages are lightning fast.' },
  { name: 'Bob', role: 'Architect', avatar: 'https://i.pravatar.cc/150?img=13', review: 'Clear process, great comms, and the results keep compounding.' },
  { name: 'Charlie', role: 'COO', avatar: 'https://i.pravatar.cc/150?img=8', review: 'Automation cut follow-up time by 90%. Our team loves it.' },
  { name: 'Diana', role: 'Product Manager', avatar: 'https://i.pravatar.cc/150?img=41', review: 'The site explains our value. Trial-to-paid rate jumped 42%.' },
  { name: 'Ethan', role: 'Software Engineer', avatar: 'https://i.pravatar.cc/150?img=57', review: "Best Core Web Vitals we've ever had. SEO actually sticks." }
];

const PLAN_LINES = [
  { label: 'Performance First', accent: '98+ Lighthouse' },
  { label: 'SEO that Sticks', accent: 'Structured & Fast' },
  { label: 'Automation Built-In', accent: 'Bookings & Follow-ups' },
  { label: 'Content that Converts', accent: 'StoryBrand Ready' },
  { label: 'Care Plans that Care', accent: 'Ship • Learn • Improve' }
];

const BG_VIDEO_ID = '69yA-F7yOiQ';
const FG_VIDEO_ID = 'dQw4w9WgXcQ';
const FLUID_LINES = ['SAVE TIME', 'SAVE MONEY'];

const scriptCache = new Map();
const loadExternalScript = (src) => {
  if (!scriptCache.has(src)) {
    scriptCache.set(
      src,
      new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          if (existing.getAttribute('data-loaded') === 'true') {
            resolve();
            return;
          }
          existing.addEventListener('load', resolve, { once: true });
          existing.addEventListener('error', reject, { once: true });
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
          script.setAttribute('data-loaded', 'true');
          resolve();
        };
        script.onerror = reject;
        document.body.appendChild(script);
      })
    );
  }
  return scriptCache.get(src);
};

function Home() {
  const scrollContainerRef = useRef(null);
  const problemRef = useRef(null);
  const keyholeRef = useRef(null);
  const sliderTrackRef = useRef(null);
  const sliderViewportRef = useRef(null);
  const fluidCanvasRef = useRef(null);
  const fluidWrapRef = useRef(null);
  const logoStripRef = useRef(null);
  const bgIframeRef = useRef(null);
  const videoOverlayRef = useRef(null);
  const sliderTouchStartRef = useRef({ x: 0, y: 0 });
  const testimonialTimerRef = useRef(null);
  const playerRef = useRef(null);

  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [ytReady, setYtReady] = useState(false);

  const restartTestimonialTimer = useCallback(() => {
    clearInterval(testimonialTimerRef.current);
    testimonialTimerRef.current = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 4000);
  }, []);

  useEffect(() => {
    restartTestimonialTimer();
    return () => clearInterval(testimonialTimerRef.current);
  }, [restartTestimonialTimer]);

  const goToCard = useCallback((index) => {
    setActiveCard((prev) => {
      if (index === prev) return prev;
      return Math.min(Math.max(index, 0), PRODUCT_CARDS.length - 1);
    });
  }, []);

  const handleLeadSubmit = useCallback((event) => {
    event.preventDefault();
    setLeadSubmitted(true);
    event.currentTarget.reset();
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const openVideoModal = useCallback(() => {
    setIsVideoOpen(true);
    document.documentElement.style.overflow = 'hidden';
    try {
      playerRef.current?.seekTo(0, true);
      playerRef.current?.playVideo();
      playerRef.current?.unMute();
    } catch (error) {
      // no-op
    }
  }, []);

  const closeVideoModal = useCallback(() => {
    setIsVideoOpen(false);
    document.documentElement.style.overflow = '';
    try {
      playerRef.current?.pauseVideo();
    } catch (error) {
      // no-op
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return undefined;

    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    const loco = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      lerp: 0.09,
      tablet: { smooth: true },
      smartphone: { smooth: false },
      resetNativeScroll: true
    });

    const handleAnchorClick = (event) => {
      const target = event.target.closest('a[href^="#"]');
      if (!target) return;
      const id = target.getAttribute('href')?.slice(1);
      if (!id) return;
      const destination = scrollContainer.querySelector(`#${CSS.escape(id)}`);
      if (!destination) return;
      event.preventDefault();
      loco.scrollTo(destination, {
        offset: 0,
        duration: 1000,
        easing: [0.25, 0.0, 0.35, 1.0]
      });
    };

    scrollContainer.addEventListener('click', handleAnchorClick);

    const handleScroll = () => ScrollTrigger.update();
    loco.on('scroll', handleScroll);

    ScrollTrigger.scrollerProxy(scrollContainer, {
      scrollTop(value) {
        if (arguments.length) {
          loco.scrollTo(value, { duration: 0, disableLerp: true });
        }
        return loco.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          left: 0,
          top: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
    });

    const triggers = [];
    const tweens = [];

    const colorSections = scrollContainer.querySelectorAll('[data-bgcolor]');
    const setTheme = (bg, fg) => {
      gsap.to(document.body, {
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
        '--page-bg': bg,
        '--page-fg': fg,
        background: bg,
        color: fg
      });
    };

    colorSections.forEach((section, index) => {
      const prevBg = index === 0 ? '#ffffff' : colorSections[index - 1].dataset.bgcolor;
      const prevFg = index === 0 ? '#1f2937' : colorSections[index - 1].dataset.textcolor;
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          scroller: scrollContainer,
          start: 'top+=10rem top',
          end: 'bottom top',
          onEnter: () => setTheme(section.dataset.bgcolor, section.dataset.textcolor),
          onEnterBack: () => setTheme(section.dataset.bgcolor, section.dataset.textcolor),
          onLeaveBack: () => setTheme(prevBg, prevFg)
        })
      );
    });

    const keyholeSection = keyholeRef.current;
    const keyhole = keyholeSection?.querySelector('.keyhole');
    const arrow = keyholeSection?.querySelector('.arrow');
    const content = keyholeSection?.querySelector('.keyhole-section__content');
    if (keyhole && content) {
      tweens.push(
        gsap
          .timeline({
            scrollTrigger: {
              trigger: keyholeSection,
              scroller: scrollContainer,
              start: 'top bottom',
              end: 'top 40%',
              scrub: 0.55
            }
          })
          .fromTo(
            keyhole,
            { clipPath: 'inset(49% 49% 49% 49% round 80px)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out' }
          )
          .fromTo(
            content,
            { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
            { opacity: 1, clipPath: 'inset(0 0 0 0)', ease: 'power2.out' },
            0
          )
      );
      if (arrow) {
        tweens.push(
          gsap.to(arrow, {
            opacity: 0,
            scrollTrigger: {
              trigger: keyholeSection,
              scroller: scrollContainer,
              start: 'top bottom',
              end: 'top 70%',
              scrub: 0.55
            }
          })
        );
      }
    }

    scrollContainer.querySelectorAll('.tfx-line').forEach((line) => {
      tweens.push(
        gsap.fromTo(
          line,
          { backgroundSize: '0% 1px' },
          {
            backgroundSize: '100% 1px',
            scrollTrigger: {
              trigger: line,
              scroller: scrollContainer,
              start: 'center 80%',
              end: 'center 20%',
              scrub: true
            }
          }
        )
      );
    });

    const refresh = () => loco.update();
    ScrollTrigger.addEventListener('refresh', refresh);

    setTimeout(() => {
      loco.update();
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      scrollContainer.removeEventListener('click', handleAnchorClick);
      ScrollTrigger.removeEventListener('refresh', refresh);
      triggers.forEach((trigger) => trigger.kill());
      tweens.forEach((tween) => tween.kill());
      loco.off('scroll', handleScroll);
      loco.destroy();
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      gsap.to(document.body, {
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
        '--page-bg': '#ffffff',
        '--page-fg': '#1f2937',
        background: '#ffffff',
        color: '#1f2937'
      });
    };
  }, []);

  useEffect(() => {
    const section = problemRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!section || !scrollContainer) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(section, { '--target': '0%' });
      section.setAttribute('data-progress', 'complete');
      return undefined;
    }

    gsap.set(section, { '--target': '100%' });

    const tween = gsap.to(section, {
      '--target': '0%',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        scroller: scrollContainer,
        start: 'top top',
        end: '+=1500',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress > 0.95) {
            section.setAttribute('data-progress', 'complete');
          } else {
            section.removeAttribute('data-progress');
          }
        }
      }
    });

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tween.scrollTrigger?.kill();
      tween.kill();
      section.removeAttribute('data-progress');
    };
  }, []);

  useEffect(() => {
    const logoStrip = logoStripRef.current;
    if (!logoStrip || logoStrip.dataset.cloned) return;
    const clone = logoStrip.cloneNode(true);
    clone.id = '';
    clone.setAttribute('aria-hidden', 'true');
    logoStrip.after(clone);
    logoStrip.dataset.cloned = 'true';
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        setActiveCard((prev) => Math.min(prev + 1, PRODUCT_CARDS.length - 1));
      } else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
        setActiveCard((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const viewport = sliderViewportRef.current;
    const track = sliderTrackRef.current;
    if (!viewport || !track) return;
    const card = track.children[activeCard];
    if (!card) return;
    const offset = card.offsetLeft - (viewport.clientWidth / 2 - card.clientWidth / 2);
    viewport.scrollTo({ left: Math.max(offset, 0), behavior: 'smooth' });
  }, [activeCard]);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    const handleF11 = (event) => {
      if (event.key === 'F11') {
        event.preventDefault();
        toggleFullscreen();
      }
    };
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('keydown', handleF11);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('keydown', handleF11);
    };
  }, [toggleFullscreen]);

  useEffect(() => {
    const iframe = bgIframeRef.current;
    const overlay = videoOverlayRef.current;
    if (!iframe || !overlay) return undefined;
    iframe.src = `https://www.youtube.com/embed/${BG_VIDEO_ID}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&loop=1&playlist=${BG_VIDEO_ID}`;
    const handleLoad = () => {
      setTimeout(() => {
        overlay.classList.add('header__video-overlay--fadeOut');
      }, 300);
    };
    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    const scriptSrc = 'https://www.youtube.com/iframe_api';
    const onReady = () => setYtReady(true);
    if (window.YT && window.YT.Player) {
      onReady();
      return undefined;
    }
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
    if (!existing) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      onReady();
    };
    return () => {
      if (window.onYouTubeIframeAPIReady === onReady) {
        window.onYouTubeIframeAPIReady = undefined;
      }
    };
  }, []);

  useEffect(() => {
    if (!ytReady || playerRef.current) return;
    if (!window.YT) return;
    playerRef.current = new window.YT.Player('yt-fg', {
      width: '1920',
      height: '1080',
      videoId: FG_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        mute: 0,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 0,
        iv_load_policy: 3,
        loop: 0
      }
    });
  }, [ytReady]);

  useEffect(() => {
    if (!isVideoOpen) return undefined;
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        closeVideoModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isVideoOpen, closeVideoModal]);

  useEffect(() => {
    const canvas = fluidCanvasRef.current;
    const wrap = fluidWrapRef.current;
    if (!canvas || !wrap) return undefined;
    let cleanup = () => {};
    let isCancelled = false;

    const initFluid = () => {
      if (!window.ogl || isCancelled) return;
      const { Renderer, Vec2, Vec4, Texture, Program, Geometry, Mesh, Flowmap } = window.ogl;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const renderer = new Renderer({ dpr, canvas });
      const { gl } = renderer;
      const tex = new Texture(gl, { minFilter: gl.LINEAR, magFilter: gl.LINEAR });
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        tex.image = img;
      };
      img.src = 'https://robindelaporte.fr/codepen/bg3.jpg';

      const mouse = new Vec2(-1);
      const velocity = new Vec2();
      const flowmap = new Flowmap(gl, { falloff: 0.3, dissipation: 0.92, alpha: 0.5 });

      const geometry = new Geometry(gl, {
        position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
        uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
      });

      const vertex = `
        attribute vec2 uv;
        attribute vec2 position;
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = vec4(position, 0., 1.); }
      `;

      const fragment = `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D tWater;
        uniform sampler2D tFlow;
        uniform vec4 res;
        void main(){
          vec3 flow = texture2D(tFlow, vUv).rgb;
          vec2 uv1 = (vUv - .5) * res.zw + .5 - flow.xy * 0.18;
          vec2 uv2 = (vUv - .5) * res.zw + .5 - flow.xy * 0.14;
          vec2 uv3 = (vUv - .5) * res.zw + .5 - flow.xy * 0.10;
          vec3 c1 = texture2D(tWater, uv1).rgb;
          vec3 c2 = texture2D(tWater, uv2).rgb;
          vec3 c3 = texture2D(tWater, uv3).rgb;
          gl_FragColor = vec4(c1.r, c2.g, c3.b, 1.0);
        }
      `;

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          tWater: { value: tex },
          tFlow: flowmap.uniform,
          res: { value: new Vec4(1, 1, 1, 1) }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });

      let lastTime;
      let lastX = 0;
      let lastY = 0;
      let animationFrameId;

      const setSize = () => {
        const rect = wrap.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width));
        const h = Math.max(1, Math.floor(rect.height));
        renderer.setSize(w, h);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        let a1;
        let a2;
        const imageAspect = 1638 / 2048;
        if (h / w < imageAspect) {
          a1 = 1.0;
          a2 = (h / w) / imageAspect;
        } else {
          a1 = (w / h) * imageAspect;
          a2 = 1.0;
        }
        program.uniforms.res.value.set(w, h, a1, a2);
      };

      const updatePointer = (event) => {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        const x = Math.max(0, Math.min(rect.width, point.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, point.clientY - rect.top));
        mouse.set(x / rect.width, 1 - y / rect.height);
        const now = performance.now();
        if (!lastTime) {
          lastTime = now;
          lastX = x;
          lastY = y;
          return;
        }
        const dx = x - lastX;
        const dy = y - lastY;
        lastX = x;
        lastY = y;
        const dt = Math.max(10.4, now - lastTime);
        lastTime = now;
        velocity.set(dx / dt, dy / dt);
        velocity.needsUpdate = true;
      };

      const tick = () => {
        if (isCancelled) return;
        animationFrameId = requestAnimationFrame(tick);
        if (!velocity.needsUpdate) {
          mouse.set(-1);
          velocity.set(0, 0);
        }
        velocity.needsUpdate = false;
        const dbw = gl.drawingBufferWidth || 1;
        const dbh = gl.drawingBufferHeight || 1;
        flowmap.aspect = dbw / dbh;
        flowmap.mouse.copy(mouse);
        flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
        flowmap.update();
        renderer.render({ scene: mesh });
      };

      const ro = new ResizeObserver(setSize);
      ro.observe(wrap);
      window.addEventListener('orientationchange', setSize);
      canvas.addEventListener('mousemove', updatePointer, { passive: false });
      canvas.addEventListener('touchstart', updatePointer, { passive: false });
      canvas.addEventListener('touchmove', updatePointer, { passive: false });

      setSize();
      tick();

      cleanup = () => {
        ro.disconnect();
        window.removeEventListener('orientationchange', setSize);
        canvas.removeEventListener('mousemove', updatePointer);
        canvas.removeEventListener('touchstart', updatePointer);
        canvas.removeEventListener('touchmove', updatePointer);
        cancelAnimationFrame(animationFrameId);
        try {
          renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
        } catch (error) {
          // ignore
        }
      };
    };

    if (window.ogl) {
      initFluid();
    } else {
      loadExternalScript('https://unpkg.com/ogl@0.0.32/dist/ogl.min.js')
        .then(initFluid)
        .catch(() => {});
    }

    return () => {
      isCancelled = true;
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!leadSubmitted) return undefined;
    const timer = setTimeout(() => setLeadSubmitted(false), 4000);
    return () => clearTimeout(timer);
  }, [leadSubmitted]);

  const handleSliderTouchStart = (event) => {
    sliderTouchStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  };

  const handleSliderTouchEnd = (event) => {
    const start = sliderTouchStartRef.current;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      setActiveCard((prev) => {
        if (dx > 0) {
          return Math.max(prev - 1, 0);
        }
        return Math.min(prev + 1, PRODUCT_CARDS.length - 1);
      });
    }
  };

  const handleTestimonialChange = (direction) => {
    setTestimonialIndex((prev) => {
      const next = (prev + direction + REVIEWS.length) % REVIEWS.length;
      return next;
    });
    restartTestimonialTimer();
  };

  return (
    <div className="home">
      <button
        className="fullscreen-btn"
        id="fullscreenBtn"
        type="button"
        aria-label="Toggle fullscreen"
        title={isFullscreen ? 'Exit fullscreen (F11)' : 'Toggle fullscreen (F11)'}
        onClick={toggleFullscreen}
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
      </button>

      <div className="scroll-container" data-scroll-container ref={scrollContainerRef}>
        <Hero />

        <section
          id="problem"
          className="scroll-section"
          ref={problemRef}
          data-bgcolor="#0b0f1a"
          data-textcolor="#ffffff"
          data-scroll-section
        >
          <div className="section-inner">
            <div className="problem-content">
              <div className="section-top">
                <a href="#problem" className="kicker"><span className="dot" aria-hidden="true" /> About</a>
                <a href="#ai-guide" className="cta">Come play with us <span className="arr">→</span></a>
              </div>
              <h1 className="display-hero">
                Driving Brand <span className="hl hl-pink">Growth</span> Through Strategic
                <span className="hl hl-cyan"> Engagement</span> and
                <span className="hl hl-yellow"> Meaningful Connections</span>.
              </h1>
              <p className="subhead">We design, market, and automate experiences that turn attention into revenue.</p>
              <div className="stakes subhead" style={{ fontSize: 'var(--step-0)' }}>
                Slow sites and manual tasks cost customers. Let's fix both.
              </div>
            </div>

            <div className="solution-content" aria-hidden="true">
              <div className="section-top" style={{ visibility: 'hidden' }}>
                <span />
                <span />
              </div>
              <h1 className="display-hero">Build a site that <span className="hl hl-green">sells</span> while you sleep.</h1>
              <p className="subhead">Fast UX, clean code, smart automation—deployed together.</p>
              <ul className="subhead" style={{ listStyle: 'none', display: 'grid', gap: '.5rem', marginTop: '.25rem' }}>
                <li>Lightning-fast pages that convert</li>
                <li>AI workflows for bookings & follow-ups</li>
                <li>SEO that brings buyers, not just browsers</li>
                <li>Continuous optimisation post-launch</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="keyhole"
          className="keyhole-section"
          ref={keyholeRef}
          data-bgcolor="#F35588"
          data-textcolor="#ffffff"
          data-scroll-section
        >
          <span className="keyhole" aria-hidden="true" />
          <span className="arrow" aria-hidden="true">
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-5 -5 30 30">
              <path d="M 0 10 H 20 L 10 0 M 20 10 L 10 20" strokeWidth="4" strokeLinecap="square" strokeLinejoin="round" />
            </svg>
          </span>
          <figure className="keyhole-section__figure">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=1600&fit=crop"
              alt="Cape Town team collaboration"
              width="1600"
              height="1600"
            />
          </figure>
          <div className="keyhole-section__content">
            <h2>
              Meet your <span className="hl hl-yellow">digital dream team</span>.
            </h2>
            <p>We turn "our site doesn't convert" into growth—design, dev, SEO and automation under one roof.</p>
          </div>
        </section>

        <section className="logo-carousel" data-bgcolor="#05DFD7" data-textcolor="#1f2937" data-scroll-section aria-label="Trusted by brands">
          <div className="wrap">
            <div className="marquee">
              <ul id="logoStrip" ref={logoStripRef}>
                {LOGO_ITEMS.map((item) => (
                  <li className="logo-item" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="plan" className="scroll-section" data-bgcolor="#A3F7BF" data-textcolor="#1f2937" data-scroll-section>
          <div className="section-inner">
            <div className="section-top">
              <a href="#plan" className="kicker"><span className="dot" /> Services</a>
              <a href="#ai-guide" className="cta">See pricing &amp; process <span className="arr">→</span></a>
            </div>
            <h2 className="display-xl">
              We are <span className="hl hl-cyan">web development</span> and <span className="hl hl-pink">digital marketing</span> experts.
            </h2>
            <p className="subhead">Focused sprints. Clear outcomes. Real growth.</p>
            <div className="plan-textfx">
              <div className="fx-wrap">
                {PLAN_LINES.map((line) => (
                  <div className="tfx-line" key={line.label}>
                    {line.label} <span>{line.accent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="prod-slider"
          className="scroll-section"
          data-bgcolor="#FFF591"
          data-textcolor="#1f2937"
          data-scroll-section
          aria-label="Who we help"
        >
          <div className="wrap">
            <div className="head">
              <h2>
                Who we help <span className="hl hl-pink">win online</span>.
              </h2>
              <div className="controls">
                <button
                  id="ps-prev"
                  className="nav-btn"
                  type="button"
                  aria-label="Prev"
                  onClick={() => setActiveCard((prev) => Math.max(prev - 1, 0))}
                  disabled={activeCard === 0}
                >
                  ‹
                </button>
                <button
                  id="ps-next"
                  className="nav-btn"
                  type="button"
                  aria-label="Next"
                  onClick={() => setActiveCard((prev) => Math.min(prev + 1, PRODUCT_CARDS.length - 1))}
                  disabled={activeCard === PRODUCT_CARDS.length - 1}
                >
                  ›
                </button>
              </div>
            </div>
            <div className="slider" ref={sliderViewportRef}>
              <div
                className="track"
                id="ps-track"
                ref={sliderTrackRef}
                onTouchStart={handleSliderTouchStart}
                onTouchEnd={handleSliderTouchEnd}
              >
                {PRODUCT_CARDS.map((card, index) => (
                  <article
                    className="project-card"
                    key={card.title}
                    active={index === activeCard ? 'true' : null}
                    onMouseEnter={() => goToCard(index)}
                    onClick={() => goToCard(index)}
                  >
                    <img className="project-card__bg" src={card.bg} alt="" />
                    <div className="project-card__content">
                      <img className="project-card__thumb" src={card.thumb} alt="" />
                      <div>
                        <h3 className="project-card__title">{card.title}</h3>
                        <p className="project-card__desc">{card.description}</p>
                        <button className="project-card__btn" type="button">
                          Details
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="dots" id="ps-dots">
              {PRODUCT_CARDS.map((card, index) => (
                <span
                  key={card.title}
                  className={`dot ${index === activeCard ? 'active' : ''}`.trim()}
                  role="button"
                  tabIndex={0}
                  onClick={() => goToCard(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      goToCard(index);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="scroll-section"
          data-bgcolor="#F35588"
          data-textcolor="#ffffff"
          data-scroll-section
          aria-label="Customer testimonials"
        >
          <div className="section-inner">
            <div className="section-top">
              <a href="#testimonials" className="kicker"><span className="dot" /> Results</a>
              <a href="#ai-guide" className="cta">Book a call <span className="arr">→</span></a>
            </div>
            <div className="t-wrap">
              <div className="t-head">
                <h3>Real results from real clients</h3>
                <p>Short wins. Compounding gains.</p>
              </div>
              <div className="t-grid">
                <button className="t-btn" type="button" data-slide="prev" aria-label="Previous" onClick={() => handleTestimonialChange(-1)}>
                  ‹
                </button>
                <div className="t-slider" id="t-slider">
                  <div className="t-stack" id="t-stack">
                    {REVIEWS.map((review, index) => (
                      <div className={`t-card ${index === testimonialIndex ? 'active' : ''}`.trim()} key={review.name}>
                        <blockquote className="t-quote">“{review.review}”</blockquote>
                        <div className="t-details">
                          <img className="t-avatar" src={review.avatar} alt={review.name} />
                          <div>
                            <p className="t-name">{review.name}</p>
                            <p className="t-role">{review.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="t-btn" type="button" data-slide="next" aria-label="Next" onClick={() => handleTestimonialChange(1)}>
                  ›
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="ai-guide" className="scroll-section" data-bgcolor="#05DFD7" data-textcolor="#1f2937" data-scroll-section>
          <div className="section-inner" style={{ textAlign: 'center' }}>
            <div className="section-top" style={{ justifyContent: 'center' }}>
              <a href="#ai-guide" className="kicker"><span className="dot" /> Get the guide</a>
              <a href="#yt-hero" className="cta">Watch the demo <span className="arr">→</span></a>
            </div>
            <h2 className="display-lg">
              Steal our <span className="hl hl-green">automation playbook</span>.
            </h2>
            <p className="subhead" style={{ margin: '0 auto' }}>
              Five workflows that save 10+ hours a week. Free, no fluff.
            </p>
            <form className="lead-form" id="leadForm" onSubmit={handleLeadSubmit} noValidate>
              <div className="lead-form__field">
                <label htmlFor="lead-email">Email address</label>
                <input id="lead-email" type="email" name="email" placeholder="you@business.co.za" required />
              </div>
              <button type="submit">Send me the playbook</button>
              <p className="lead-form__consent">We'll send one useful email—unsubscribe anytime.</p>
              {leadSubmitted && <p className="lead-form__success">Thanks! Your download link is on its way to your inbox.</p>}
            </form>
          </div>
        </section>

        <section
          id="fluid-mask"
          className="scroll-section"
          data-bgcolor="#A3F7BF"
          data-textcolor="#1f2937"
          data-scroll-section
          aria-label="SAVE TIME"
        >
          <div className="section-inner container-tight" style={{ gap: '.5rem' }}>
            <div className="section-top">
              <a href="#fluid-mask" className="kicker"><span className="dot" /> Why it matters</a>
              <a href="#ai-guide" className="cta">Start saving time <span className="arr">→</span></a>
            </div>
          </div>
          <div className="fluid-inner" ref={fluidWrapRef}>
            <canvas className="fluid-canvas" aria-hidden="true" ref={fluidCanvasRef} />
            <svg className="text-cut" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="SAVE TIME AND MONEY">
              <defs>
                <mask id="cutout-mask">
                  <rect x="0" y="0" width="1600" height="900" fill="white" />
                  {FLUID_LINES.map((line, idx) => (
                    <text
                      key={line}
                      x="50%"
                      y={`${40 + idx * 22}%`}
                      fill="black"
                      fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
                      fontWeight="900"
                      fontSize="216"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      letterSpacing="8"
                    >
                      {line}
                    </text>
                  ))}
                </mask>
              </defs>
              <rect x="0" y="0" width="1600" height="900" fill="#A3F7BF" mask="url(#cutout-mask)" />
            </svg>
          </div>
        </section>

        <section
          id="yt-hero"
          className="scroll-section"
          data-bgcolor="#FFF591"
          data-textcolor="#1f2937"
          data-scroll-section
          aria-label="Watch how we help you save time"
        >
          <div className="section-inner" style={{ gap: '1rem', textAlign: 'center' }}>
            <div className="section-top" style={{ justifyContent: 'center' }}>
              <a href="#yt-hero" className="kicker"><span className="dot" /> Demo</a>
            </div>
            <h2 className="display-lg">
              Watch how we <span className="hl hl-pink">automate the boring stuff</span>.
            </h2>
            <p className="subhead" style={{ margin: '0 auto', maxWidth: '860px' }}>
              A quick walkthrough showing SEO + social + AI working together.
            </p>
            <div className="header" data-bg-video={BG_VIDEO_ID} data-fg-video={FG_VIDEO_ID}>
              <div className="header__background">
                <iframe
                  id="bg-iframe"
                  ref={bgIframeRef}
                  title="Background video"
                  src=""
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  loading="eager"
                  referrerPolicy="origin"
                />
              </div>
              <div
                className="header__video-overlay js-video-overlay"
                ref={videoOverlayRef}
                style={{ backgroundImage: `url('https://img.youtube.com/vi/${BG_VIDEO_ID}/maxresdefault.jpg')` }}
              />
              <div className="header__scrim" aria-hidden="true" />
              <div className="play-cta">
                <button className="play-cta__btn" id="openPlayer" type="button" aria-label="Play video" onClick={openVideoModal}>
                  <span className="play-cta__ring" aria-hidden="true" />
                  <span className="play-cta__icon" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className={`video-modal ${isVideoOpen ? 'is-open' : ''}`.trim()} id="videoModal" aria-hidden={!isVideoOpen} aria-label="Video player dialog">
              <div className="video-modal__backdrop" id="modalBackdrop" role="presentation" onClick={closeVideoModal} />
              <div className="video-modal__stage" role="dialog" aria-modal="true">
                <button className="video-modal__close" id="closePlayer" type="button" aria-label="Close video" onClick={closeVideoModal}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <div id="yt-fg" />
              </div>
            </div>
          </div>
        </section>

        <section className="scroll-section footer-section" data-bgcolor="#0b0f1a" data-textcolor="#ffffff" data-scroll-section>
          <Footer />
        </section>
      </div>
    </div>
  );
}

export default Home;
