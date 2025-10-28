import { useEffect } from 'react';

const selector = '[data-scroll-reveal]';

const createObserver = () =>
  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -18% 0px'
    }
  );

export default function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector));
    if (!elements.length) return undefined;

    const observer = createObserver();
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      elements.forEach((el) => el.classList.remove('is-visible'));
    };
  }, []);
}
