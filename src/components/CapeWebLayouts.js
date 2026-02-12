import React from 'react';
import { CWHeading, CWCard, CWProgressBar, CWBadge } from './CapeWebUI';
import '../styles/CapeWebDesignSystem.css';

/**
 * CapeWeb Layout System
 * Standardized layouts for different content types.
 */

/* --- Reading Layout (Standard Article) --- */
export const ReadingLayout = ({
    eyebrow,
    title,
    summary,
    progress = null,
    children
}) => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                {eyebrow && (
                    <div className="article-eyebrow" style={{ color: 'var(--cw-brand-primary)' }}>
                        {eyebrow}
                    </div>
                )}
                <CWHeading level={1} style={{ marginBottom: '1.5rem', color: '#e54742' }}>{title}</CWHeading>
                {summary && (
                    <div className="article-summary" style={{
                        fontSize: '1.25rem',
                        color: 'var(--cw-text-secondary)',
                        borderLeft: '4px solid var(--cw-brand-primary)',
                        paddingLeft: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        {summary}
                    </div>
                )}

            </header>

            <div className="cw-prose">
                {children}
            </div>
        </div>
    );
};

/* --- Interactive Layout (Tools / Maps) --- */
export const InteractiveLayout = ({ title, subtitle, children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <header style={{ marginBottom: '2rem', flexShrink: 0 }}>
                <CWHeading level={2} style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#e54742' }}>{title}</CWHeading>
                {subtitle && <p style={{ color: 'var(--cw-text-secondary)', fontSize: '1.5rem', lineHeight: 1.4 }}>{subtitle}</p>}
            </header>

            <CWCard glass className="interactive-canvas" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {children}
            </CWCard>
        </div>
    );
};

/* --- Quiz Layout --- */
export const QuizLayout = ({ title, currentStep, totalSteps, children }) => {
    return (
        <div style={{
            margin: '2rem auto',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            borderRadius: 'var(--cw-radius-xl)',
            overflow: 'hidden',
        }}>
            {/* Background Layer */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #FFF 0%, rgba(34, 211, 238, 0.2) 50%, rgba(244, 114, 182, 0.2) 100%)',
                zIndex: 0
            }} />

            {/* Content Layer */}
            <div style={{ position: 'relative', zIndex: 1, padding: '3rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <CWBadge style={{ background: '#0b0f1a', color: '#fff', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    Assessment
                </CWBadge>

                <h2 style={{
                    margin: '1.5rem 0 2.5rem',
                    fontSize: '2rem',
                    fontWeight: 800,
                    background: 'linear-gradient(to right, #0b0f1a, #4b5563)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {title}
                </h2>

                {children}

                <div style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                        <span>Progress</span>
                        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
                    </div>
                    <CWProgressBar progress={(currentStep / totalSteps) * 100} color="#0b0f1a" trackColor="rgba(0,0,0,0.05)" />
                </div>
            </div>
        </div>
    );
};
