import React from 'react';
import '../styles/CapeWebBlueprint.css';
import '../styles/CapeWebDesignSystem.css';

/**
 * CapeWeb UI Utility Components
 * Phase 6: Monochrome / Hybrid Theme (White Content, Dark Sidebar)
 */

/* --- Typography --- */

export const CWHeading = ({ level = 2, children, className = '', ...props }) => {
    const Tag = `h${level}`;
    const sizeClass =
        level === 1 ? 'cw-display-lg' :
            level === 2 ? 'cw-heading-md' :
                'cw-text-body';

    return <Tag className={`${sizeClass} ${className}`} {...props}>{children}</Tag>;
};

/* --- Buttons --- */

export const CWButton = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    icon,
    ...props
}) => {

    const baseStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderRadius: 'var(--cw-radius-full)',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'var(--cw-transition-fast)',
        border: '1px solid transparent',
        padding: size === 'sm' ? '0.4rem 0.8rem' : size === 'lg' ? '0.8rem 1.75rem' : '0.6rem 1.25rem',
        fontSize: size === 'sm' ? '0.85rem' : '1rem',
        boxShadow: 'var(--cw-shadow-sm)',
    };

    const variants = {
        primary: {
            background: 'var(--cw-neutral-900)', // Ink Black
            color: 'var(--cw-white)',
            border: '1px solid var(--cw-neutral-900)',
        },
        secondary: {
            background: 'var(--cw-white)',
            color: 'var(--cw-neutral-900)',
            border: '1px solid var(--cw-neutral-200)',
        },
        outline: {
            background: 'transparent',
            border: '1px solid var(--cw-neutral-900)',
            color: 'var(--cw-neutral-900)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--cw-neutral-600)',
            boxShadow: 'none',
            border: 'none',
        }
    };

    const mergedStyle = {
        ...baseStyle,
        ...variants[variant],
        ...(props.style || {}) // Merge external styles LAST so they can override specific properties
    };

    // Remove style from props to avoid duplication/conflict
    const { style, ...restProps } = props;

    return (
        <button
            className={`cw-btn ${className}`}
            style={mergedStyle}
            {...restProps}
        >
            {icon && <span style={{ fontSize: '1.1em' }} aria-hidden="true">{icon}</span>}
            {children}
        </button>
    );
};

/* --- Cards --- */

export const CWCard = ({ children, className = '', glass = false, style = {}, ...props }) => {
    const cardStyle = {
        background: glass ? 'rgba(255,255,255,0.7)' : 'var(--cw-white)',
        borderRadius: 'var(--cw-radius-lg)',
        border: '1px solid var(--cw-neutral-200)',
        padding: 'var(--cw-space-6)',
        boxShadow: glass ? 'none' : 'var(--cw-shadow-sm)',
        color: 'var(--cw-text-body)',
        ...style
    };

    return (
        <div className={`cw-card ${className}`} style={cardStyle} {...props}>
            {children}
        </div>
    );
};

/* --- Inputs --- */
export const CWInput = ({ className = '', ...props }) => (
    <input className={`cw-input ${className}`} {...props} />
);

/* --- Status Badges (Refined for White BG) --- */

export const CWBadge = ({ status = 'neutral', children }) => {
    const styles = {
        neutral: { bg: 'var(--cw-neutral-100)', color: 'var(--cw-neutral-600)', border: 'var(--cw-neutral-200)' },
        success: { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
        warning: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
        error: { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' },
        brand: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' }, // Blue
        info: { bg: '#F3F4F6', color: '#1F2937', border: '#E5E7EB' }
    };

    const currentInfo = styles[status] || styles.neutral;

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--cw-radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.025em',
            background: currentInfo.bg,
            color: currentInfo.color,
            border: `1px solid ${currentInfo.border}`
        }}>
            {children}
        </span>
    );
};

/* --- Progress Bars --- */

export const CWProgressBar = ({ progress = 0, color = 'var(--cw-neutral-900)', trackColor = 'var(--cw-neutral-200)' }) => {
    return (
        <div style={{
            width: '100%',
            height: '8px',
            background: trackColor,
            borderRadius: '999px',
            overflow: 'hidden'
        }}>
            <div style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
                height: '100%',
                background: color,
                borderRadius: '999px',
                transition: 'width 0.5s var(--cw-transition-normal)'
            }} />
        </div>
    );
};

/* --- Alert / Verify Box --- */

export const CWAlert = ({ type = 'info', title, children }) => {
    const theme = {
        info: { border: '#3B82F6', bg: '#EFF6FF', text: '#1E40AF' },
        success: { border: '#10B981', bg: '#ECFDF5', text: '#065F46' },
        warning: { border: '#F59E0B', bg: '#FFFBEB', text: '#92400E' },
        error: { border: '#EF4444', bg: '#FEF2F2', text: '#991B1B' },
    };

    const current = theme[type] || theme.info;

    return (
        <div style={{
            background: current.bg,
            borderLeft: `4px solid ${current.border}`,
            padding: '1rem 1.25rem',
            borderRadius: 'var(--cw-radius-md)',
            margin: '1.5rem 0',
            color: current.text
        }}>
            {title && <div style={{ fontWeight: 700, marginBottom: '0.25rem', color: current.text }}>{title}</div>}
            <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{children}</div>
        </div>
    );
};

/* --- Book Insight Component --- */
export const BookInsight = ({ title, author, book, children, color = '#334155' }) => {
    return (
        <div style={{ background: '#F8FAFC', borderLeft: `4px solid ${color}`, padding: '1.5rem', borderRadius: '0 12px 12px 0', margin: '2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: color, fontWeight: '700', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                <span style={{ fontSize: '1.2rem' }}>📚</span> Best-Seller Insight
            </div>
            <h4 style={{ margin: '0 0 0.5rem', color: '#0F172A', fontSize: '1.1rem' }}>{title}</h4>
            <div style={{ fontSize: '0.95rem', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                {children}
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #E2E8F0', fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
                — {author}, <span style={{ fontStyle: 'italic' }}>{book}</span>
            </div>
        </div>
    );
};
