import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook to handle background color transitions based on scroll position.
 * @param {React.RefObject} scrollRef - Ref to the scroll container
 */
export default function useColorChange(scrollRef) {
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const triggers = [];
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

        // Set initial theme (White)
        setTheme('#ffffff', '#0b0f1a');

        colorSections.forEach((section, index) => {
            const prevBg = index === 0 ? '#ffffff' : colorSections[index - 1].dataset.bgcolor;
            const prevFg = index === 0 ? '#0b0f1a' : colorSections[index - 1].dataset.textcolor;

            triggers.push(
                ScrollTrigger.create({
                    trigger: section,
                    scroller: scrollContainer,
                    start: 'top 60%',
                    end: 'bottom 40%',
                    onEnter: () => setTheme(section.dataset.bgcolor, section.dataset.textcolor),
                    onEnterBack: () => setTheme(section.dataset.bgcolor, section.dataset.textcolor),
                    onLeaveBack: () => setTheme(prevBg, prevFg)
                })
            );
        });

        return () => {
            triggers.forEach((t) => t.kill());
            // Reset to default on unmount
            setTheme('#ffffff', '#0b0f1a');
        };
    }, [scrollRef]);
}
