import React from 'react';

/**
 * Button Component
 *
 * Reusable button component with multiple variants and sizes.
 * Follows WCAG 2.2 AA accessibility guidelines with 44px minimum touch target.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.variant='primary'] - Button variant: 'primary', 'secondary', 'outline', 'ghost'
 * @param {string} [props.size='base'] - Button size: 'sm', 'base', 'lg'
 * @param {string} [props.href] - If provided, renders as <a> tag
 * @param {function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {React.ReactNode} [props.icon] - Icon element (from Heroicons)
 * @param {string} [props.iconPosition='right'] - Icon position: 'left' or 'right'
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {boolean} [props.fullWidth=false] - Make button full width
 * @param {string} [props.type='button'] - Button type attribute
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'base',
  href,
  onClick,
  disabled = false,
  icon,
  iconPosition = 'right',
  className = '',
  fullWidth = false,
  type = 'button',
  ...props
}) {
  const Component = href ? 'a' : 'button';

  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'base' && `btn-${size}`,
    icon && 'btn-with-icon',
    fullWidth && 'btn-block',
    className
  ].filter(Boolean).join(' ');

  const buttonProps = {
    className: classes,
    onClick: !disabled ? onClick : undefined,
    disabled: Component === 'button' ? disabled : undefined,
    ...(href && { href }),
    ...(Component === 'button' && { type }),
    'aria-disabled': disabled,
    ...props
  };

  return (
    <Component {...buttonProps}>
      {icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      <span className="btn-text">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </Component>
  );
}
