import useMediaQuery from './useMediaQuery';

/**
 * useReducedMotion Hook
 *
 * Hook to detect if user prefers reduced motion.
 * Respects the 'prefers-reduced-motion' media query.
 *
 * @returns {boolean} - Whether user prefers reduced motion
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 *
 * // Use in animations
 * const duration = prefersReducedMotion ? 0 : 300;
 *
 * // Or conditionally apply animations
 * if (!prefersReducedMotion) {
 *   gsap.to(element, { x: 100, duration: 1 });
 * }
 */
export default function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
