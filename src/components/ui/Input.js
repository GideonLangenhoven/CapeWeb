import React from 'react';

/**
 * Input Component
 *
 * Accessible form input with label, error, and helper text support.
 * WCAG 2.2 AA compliant with 44px minimum height.
 *
 * @param {Object} props
 * @param {string} props.id - Input ID (required for accessibility)
 * @param {string} props.label - Input label
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.value] - Input value (controlled)
 * @param {function} [props.onChange] - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.required=false] - Required field
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.error] - Error message
 * @param {string} [props.helper] - Helper text
 * @param {string} [props.success] - Success message
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helper,
  success,
  className = '',
  ...props
}) {
  const inputClasses = [
    'form-input',
    error && 'error',
    success && 'success',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-error" aria-label="required"> *</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${id}-error` : helper ? `${id}-helper` : success ? `${id}-success` : undefined
        }
        {...props}
      />
      {error && (
        <div id={`${id}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}
      {success && !error && (
        <div id={`${id}-success`} className="form-success" role="status">
          {success}
        </div>
      )}
      {helper && !error && !success && (
        <div id={`${id}-helper`} className="form-helper">
          {helper}
        </div>
      )}
    </div>
  );
}
