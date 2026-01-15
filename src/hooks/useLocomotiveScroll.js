import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Define a safe subclass to override the buggy method
export class SafeLocomotiveScroll extends LocomotiveScroll {
    addSections() {
        this.sections = {};

        let sections = this.el?.querySelectorAll(`[data-${this.name}-section]`) || [];
        if (sections.length === 0 && this.el) {
            sections = [this.el];
        }

        // Helper to safely get translate values
        const safeGetTranslate = (el) => {
            if (!el) return { x: 0, y: 0 };
            const style = window.getComputedStyle ? window.getComputedStyle(el) : null;
            const transform = style?.transform || style?.webkitTransform || style?.mozTransform || 'matrix(1,0,0,1,0,0)';

            const translate = { x: 0, y: 0 };
            // Ensure transform is a string
            const transformStr = String((!transform || transform === 'none') ? 'matrix(1,0,0,1,0,0)' : transform);

            let mat = transformStr.match(/^matrix3d\((.+)\)$/);
            if (mat) {
                const parts = mat[1].split(', ');
                translate.x = parseFloat(parts[12]) || 0;
                translate.y = parseFloat(parts[13]) || 0;
            } else {
                mat = transformStr.match(/^matrix\((.+)\)$/);
                const parts = mat ? mat[1].split(', ') : [];
                translate.x = parseFloat(parts[4]) || 0;
                translate.y = parseFloat(parts[5]) || 0;
            }
            return translate;
        };

        sections.forEach((section, index) => {
            if (!section) return;
            const dataset = section.dataset || {};
            const id = typeof dataset[this.name + 'Id'] === 'string' ? dataset[this.name + 'Id'] : `section${index}`;
            const sectionBCR = section.getBoundingClientRect();

            // Use safe getter
            const translate = safeGetTranslate(section);

            const offset = {
                x: sectionBCR.left - window.innerWidth * 1.5 - translate.x,
                y: sectionBCR.top - window.innerHeight * 1.5 - translate.y
            };
            const limit = {
                x: offset.x + sectionBCR.width + window.innerWidth * 2,
                y: offset.y + sectionBCR.height + window.innerHeight * 2
            };
            const persistent = typeof dataset[this.name + 'Persistent'] === 'string';
            section.setAttribute(`data-${this.name}-section-id`, id);

            this.sections[id] = {
                el: section,
                offset,
                limit,
                inView: false,
                persistent,
                id
            };
        });
    }
}

export default function useLocomotiveScroll(start, smooth = true) {
    const scrollRef = useRef(null);
    const locomotiveScrollRef = useRef(null);

    useEffect(() => {
        if (!start || !scrollRef.current) return;

        const scrollEl = scrollRef.current;

        const applyTransformFallback = (el) => {
            if (!el) return;
            const style = window.getComputedStyle ? window.getComputedStyle(el) : null;
            const transform = style?.transform || style?.webkitTransform || style?.mozTransform;
            if (!transform || transform === 'none') {
                el.style.transform = 'translate3d(0,0,0)';
                el.style.webkitTransform = 'translate3d(0,0,0)';
                el.style.msTransform = 'translate3d(0,0,0)';
            }
        };

        // Ensure elements have transforms before init (extra safety)
        const ensureTransforms = () => {
            if (smooth) {
                applyTransformFallback(scrollEl);
            }
            scrollEl.querySelectorAll('[data-scroll-section], [data-scroll]').forEach(applyTransformFallback);
        };
        ensureTransforms();

        // Use the Safe subclass
        const ls = new SafeLocomotiveScroll({
            el: scrollEl,
            smooth: smooth,
            multiplier: 1,
            class: 'is-revealed',
            reloadOnContextChange: true,
            touchMultiplier: 2,
            smoothMobile: 0,
            smartphone: {
                smooth: smooth,
            },
            tablet: {
                smooth: smooth,
            },
        });

        locomotiveScrollRef.current = ls;

        const originalUpdate = ls.update.bind(ls);
        ls.update = () => {
            ensureTransforms();
            originalUpdate();
        };

        // Force an update to register sections using the patched method
        ls.update();

        // Sync ScrollTrigger with Locomotive Scroll
        ScrollTrigger.scrollerProxy(scrollEl, {
            scrollTop(value) {
                if (ls && ls.scroll) {
                    if (arguments.length) {
                        return ls.scrollTo(value, 0, 0);
                    }
                    return ls.scroll.instance?.scroll?.y || 0;
                }
                if (arguments.length && scrollEl) {
                    scrollEl.scrollTop = value;
                }
                return scrollEl ? scrollEl.scrollTop : 0;
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

        ls.on('scroll', ScrollTrigger.update);

        const refreshHandler = () => {
            if (ls) {
                ls.update();
            }
        };

        ScrollTrigger.addEventListener('refresh', refreshHandler);
        ScrollTrigger.refresh();

        const resizeObserver = new ResizeObserver(() => {
            if (ls) {
                ls.update();
                ScrollTrigger.refresh();
            }
        });
        resizeObserver.observe(scrollEl);

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.scroller === scrollEl) {
                    trigger.kill();
                }
            });

            if (ls) {
                ls.destroy();
                locomotiveScrollRef.current = null;
            }
            resizeObserver.disconnect();
            ScrollTrigger.removeEventListener('refresh', refreshHandler);
        };
    }, [start]);

    return { scrollRef, locomotiveScroll: locomotiveScrollRef };
}
