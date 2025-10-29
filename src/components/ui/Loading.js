import React from 'react';
import './Loading.css';

/**
 * Loading Component
 *
 * Loading indicator with multiple variants and sizes.
 * Includes proper ARIA labels for screen readers.
 *
 * @param {Object} props
 * @param {string} [props.variant='spinner'] - Loading variant: 'spinner', 'skeleton', 'dots'
 * @param {string} [props.size='base'] - Size: 'sm', 'base', 'lg'
 * @param {string} [props.text] - Optional loading text
 * @param {boolean} [props.fullscreen=false] - Fullscreen overlay
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function Loading({
  variant = 'spinner',
  size = 'base',
  text,
  fullscreen = false,
  className = ''
}) {
  const Loader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`loading-spinner loading-spinner-${size}`}>
            <div className="loading-spinner-circle"></div>
          </div>
        );
      case 'dots':
        return (
          <div className={`loading-dots loading-dots-${size}`}>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        );
      case 'skeleton':
        return <div className={`skeleton loading-skeleton-${size}`}></div>;
      default:
        return (
          <div className={`loading-spinner loading-spinner-${size}`}>
            <div className="loading-spinner-circle"></div>
          </div>
        );
    }
  };

  if (fullscreen) {
    return (
      <div className="loading-fullscreen" role="alert" aria-live="polite" aria-busy="true">
        <div className="loading-fullscreen-content">
          <Loader />
          {text && <div className="loading-text">{text}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`loading ${className}`} role="status" aria-live="polite" aria-busy="true">
      <Loader />
      {text && <div className="loading-text">{text}</div>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Skeleton Component
 *
 * Skeleton loader for content placeholders.
 */
export function Skeleton({ width, height, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px'
      }}
      aria-hidden="true"
    />
  );
}
