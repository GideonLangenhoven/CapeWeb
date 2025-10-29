import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import './Toast.css';

/**
 * Toast Component
 *
 * Notification toast with auto-dismiss and accessibility support.
 *
 * @param {Object} props
 * @param {string} props.id - Unique toast ID
 * @param {string} props.message - Toast message
 * @param {string} [props.type='info'] - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} [props.duration=5000] - Auto-dismiss duration in ms (0 = no auto-dismiss)
 * @param {function} props.onClose - Close handler
 * @param {boolean} [props.persistent=false] - Persistent toast (requires user action to dismiss)
 */
export default function Toast({
  id,
  message,
  type = 'info',
  duration = 5000,
  onClose,
  persistent = false
}) {
  useEffect(() => {
    if (persistent || duration === 0) return;

    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose, persistent]);

  const icons = {
    success: <CheckCircleIcon className="toast-icon" />,
    error: <XCircleIcon className="toast-icon" />,
    warning: <ExclamationTriangleIcon className="toast-icon" />,
    info: <InformationCircleIcon className="toast-icon" />
  };

  return (
    <div
      className={`toast toast-${type}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className="toast-icon-wrapper">
        {icons[type]}
      </div>
      <div className="toast-message">{message}</div>
      <button
        type="button"
        className="toast-close"
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

/**
 * ToastContainer Component
 *
 * Container for managing multiple toasts.
 */
export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
