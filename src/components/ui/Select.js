import React from 'react';

/**
 * Select Component
 *
 * Accessible select dropdown with label, error, and helper text support.
 *
 * @param {Object} props
 * @param {string} props.id - Select ID (required for accessibility)
 * @param {string} props.label - Select label
 * @param {string} [props.value] - Select value (controlled)
 * @param {function} [props.onChange] - Change handler
 * @param {Array} props.options - Array of option objects [{value, label}]
 * @param {string} [props.placeholder] - Placeholder option text
 * @param {boolean} [props.required=false] - Required field
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.error] - Error message
 * @param {string} [props.helper] - Helper text
 * @param {string} [props.success] - Success message
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function Select({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  error,
  helper,
  success,
  className = '',
  ...props
}) {
  const selectClasses = [
    'form-select',
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
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={selectClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${id}-error` : helper ? `${id}-helper` : success ? `${id}-success` : undefined
        }
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
