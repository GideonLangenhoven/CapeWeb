import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Locomotive and wires GSAP's scrollerProxy to the same container.
 * Returns a ref to apply to your <div data-scroll-container>.
 */
export default function useLocoScroll() {
  const scrollerRef = useRef(null);
  const locoRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const loco = new LocomotiveScroll({
      el,
      smooth: true,
      lerp: 0.09,
      tablet: { smooth: true },
      smartphone: { smooth: true }
    });
    locoRef.current = loco;

    // Keep ScrollTrigger in sync
    loco.on('scroll', ScrollTrigger.update);

    // Bridge Locomotive <-> ScrollTrigger
    ScrollTrigger.scrollerProxy(el, {
      scrollTop(value) {
        if (arguments.length) {
          loco.scrollTo(value, { duration: 0, disableLerp: true });
        }
        return loco.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      },
      // Chromium fix: pin using transforms if the scroller is transformed
      pinType: getComputedStyle(el).transform !== 'none' ? 'transform' : 'fixed'
    });

    // Default all triggers to use our scroller
    ScrollTrigger.defaults({ scroller: el });

    // Refresh in correct order
    const refresh = () => { loco.update(); ScrollTrigger.refresh(); };
    ScrollTrigger.addEventListener('refresh', () => loco.update());
    window.addEventListener('load', () => {
      requestAnimationFrame(() => requestAnimationFrame(refresh));
    });

    const onResize = () => refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ScrollTrigger.removeEventListener('refresh', () => loco.update());
      loco.off('scroll', ScrollTrigger.update);
      loco.destroy();
    };
  }, []);

  return { scrollerRef, locoRef };
}
