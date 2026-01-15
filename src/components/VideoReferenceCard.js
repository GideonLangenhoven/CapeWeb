import React from 'react';

export function VideoReferenceCard({ videoId, start = 0, title, description }) {
    if (!videoId) return null;

    const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${start}`;

    return (
        <div style={{
            margin: '2rem 0',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#fff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#000' }}>
                <iframe
                    src={embedUrl}
                    title={title || "YouTube video player"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                />
            </div>
            {(title || description) && (
                <div style={{ padding: '1rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    {title && <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#0f172a' }}>📺 {title}</h5>}
                    {description && <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{description}</p>}
                </div>
            )}
        </div>
    );
}
