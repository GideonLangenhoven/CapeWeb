import React from 'react';

/**
 * Textarea Component
 *
 * Accessible textarea with label, error, and helper text support.
 *
 * @param {Object} props
 * @param {string} props.id - Textarea ID (required for accessibility)
 * @param {string} props.label - Textarea label
 * @param {string} [props.value] - Textarea value (controlled)
 * @param {function} [props.onChange] - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.required=false] - Required field
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {number} [props.rows=4] - Number of rows
 * @param {string} [props.error] - Error message
 * @param {string} [props.helper] - Helper text
 * @param {string} [props.success] - Success message
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function Textarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  error,
  helper,
  success,
  className = '',
  ...props
}) {
  const textareaClasses = [
    'form-textarea',
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
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={textareaClasses}
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
