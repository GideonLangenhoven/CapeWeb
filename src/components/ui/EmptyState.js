import React from 'react';
import Button from './Button';
import './EmptyState.css';

/**
 * EmptyState Component
 *
 * Displays helpful empty state messages with optional actions.
 * Used when lists, searches, or data queries return no results.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.icon] - Icon element (from Heroicons)
 * @param {string} props.title - Primary message
 * @param {string} [props.description] - Secondary explanation
 * @param {string} [props.actionLabel] - Button text
 * @param {function} [props.onAction] - Button click handler
 * @param {string} [props.actionHref] - Button link (if not using onClick)
 * @param {React.ReactNode} [props.children] - Custom content
 * @param {string} [props.size='base'] - Size: 'sm', 'base', 'lg'
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  children,
  size = 'base',
  className = ''
}) {
  return (
    <div className={`empty-state empty-state-${size} ${className}`} role="status">
      {icon && (
        <div className="empty-state-icon" aria-hidden="true">
          {icon}
        </div>
      )}

      <h3 className="empty-state-title">{title}</h3>

      {description && (
        <p className="empty-state-description">{description}</p>
      )}

      {children && (
        <div className="empty-state-content">
          {children}
        </div>
      )}

      {(actionLabel && (onAction || actionHref)) && (
        <div className="empty-state-action">
          <Button
            variant="primary"
            onClick={onAction}
            href={actionHref}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Common Empty State Variants
 */

export function NoResults({ searchTerm, onClear }) {
  return (
    <EmptyState
      title="No results found"
      description={searchTerm ? `We couldn't find anything matching "${searchTerm}"` : 'Try adjusting your search or filters'}
      actionLabel={searchTerm ? "Clear search" : undefined}
      onAction={onClear}
    />
  );
}

export function NoData({ onAdd, addLabel = "Add item" }) {
  return (
    <EmptyState
      title="Nothing here yet"
      description="Get started by adding your first item"
      actionLabel={addLabel}
      onAction={onAdd}
    />
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <EmptyState
      title="Something went wrong"
      description={error?.message || "We couldn't load this content. Please try again."}
      actionLabel="Try again"
      onAction={onRetry}
    />
  );
}
