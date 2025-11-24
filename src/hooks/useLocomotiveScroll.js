import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useLocomotiveScroll(start = true) {
    const scrollRef = useRef(null);
    const locomotiveScrollRef = useRef(null);

    useEffect(() => {
        if (!start || !scrollRef.current) return;

        const scrollEl = scrollRef.current;

        // Fix for locomotive-scroll getTranslate error: ensure sections have a transform
        const sections = scrollEl.querySelectorAll('[data-scroll-section]');
        sections.forEach((section) => {
            const transform = window.getComputedStyle(section).transform;
            if (!transform || transform === 'none') {
                section.style.transform = 'translate3d(0, 0, 0)';
            }
        });

        locomotiveScrollRef.current = new LocomotiveScroll({
            el: scrollEl,
            smooth: true,
            multiplier: 1,
            class: 'is-revealed',
            reloadOnContextChange: true,
            touchMultiplier: 2,
            smoothMobile: 0,
            smartphone: {
                smooth: true,
            },
            tablet: {
                smooth: true,
            },
        });

        // Sync ScrollTrigger with Locomotive Scroll
        ScrollTrigger.scrollerProxy(scrollEl, {
            scrollTop(value) {
                return arguments.length
                    ? locomotiveScrollRef.current.scrollTo(value, 0, 0)
                    : locomotiveScrollRef.current.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            pinType: scrollEl.style.transform ? 'transform' : 'fixed',
        });

        locomotiveScrollRef.current.on('scroll', ScrollTrigger.update);

        ScrollTrigger.addEventListener('refresh', () => locomotiveScrollRef.current.update());
        ScrollTrigger.refresh();

        const resizeObserver = new ResizeObserver(() => {
            locomotiveScrollRef.current?.update();
            ScrollTrigger.refresh();
        });
        resizeObserver.observe(scrollEl);

        return () => {
            if (locomotiveScrollRef.current) {
                locomotiveScrollRef.current.destroy();
            }
            resizeObserver.disconnect();
            ScrollTrigger.removeEventListener('refresh', () => locomotiveScrollRef.current?.update());
        };
    }, [start]);

    return scrollRef;
}
