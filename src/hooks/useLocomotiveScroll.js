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
        const fixScrollSections = () => {
            const ensureTransform = (el) => {
                if (!el) return;
                const transform = window.getComputedStyle(el).transform;
                if (!transform || transform === 'none' || transform === 'unset') {
                    el.style.transform = 'translate3d(0, 0, 0)';
                }
            };

            ensureTransform(scrollEl);
            const sections = scrollEl.querySelectorAll('[data-scroll-section]');
            sections.forEach((section) => {
                ensureTransform(section);
            });
        };

        fixScrollSections();

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

        // Override update to always apply fix
        const originalUpdate = locomotiveScrollRef.current.update.bind(locomotiveScrollRef.current);
        locomotiveScrollRef.current.update = () => {
            fixScrollSections();
            originalUpdate();
        };

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

        const refreshHandler = () => {
            if (locomotiveScrollRef.current) {
                locomotiveScrollRef.current.update();
            }
        };

        ScrollTrigger.addEventListener('refresh', refreshHandler);
        ScrollTrigger.refresh();

        const resizeObserver = new ResizeObserver(() => {
            if (locomotiveScrollRef.current) {
                locomotiveScrollRef.current.update();
                ScrollTrigger.refresh();
            }
        });
        resizeObserver.observe(scrollEl);

        return () => {
            if (locomotiveScrollRef.current) {
                locomotiveScrollRef.current.destroy();
                locomotiveScrollRef.current = null;
            }
            resizeObserver.disconnect();
            ScrollTrigger.removeEventListener('refresh', refreshHandler);
        };
    }, [start]);

    return scrollRef;
}
