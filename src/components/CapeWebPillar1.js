import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ReadingLayout, InteractiveLayout, QuizLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, CWProgressBar, BookInsight } from './CapeWebUI';
import '../styles/CapeWebBlueprint.css';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';

// ==========================================
// SVGs
// ==========================================
// ==========================================
// INTERACTIVE COMPONENTS
// ==========================================

function WeeklyLoopInfinity() {
    const [activeStep, setActiveStep] = useState(0); // Start at 0 immediately

    const steps = [
        {
            id: 1,
            label: 'LEARN',
            badge: 'STEP 1: THE HYPOTHESIS',
            color: '#fde047', // Yellow
            text: 'Stop guessing. Start asking.',
            desc: 'You have an idea? Great. Treat it like a science experiment, not a fact.',
            action: 'Write down: "I believe [Customer] has [Problem] and will pay for [Solution]."'
        },
        {
            id: 2,
            label: 'DO',
            badge: 'STEP 2: THE EXPERIMENT',
            color: '#22d3ee', // Cyan
            text: 'Build the smallest thing possible.',
            desc: 'Do not build the app. Do not rent the shop. Do the manual version first.',
            action: 'Example: Instead of building a laundromat, offer to wash neighbors\' clothes in your own machine for R50.'
        },
        {
            id: 3,
            label: 'PROOF',
            badge: 'STEP 3: THE DATA',
            color: '#f472b6', // Pink
            text: 'The market never lies.',
            desc: 'Did they pay you? If yes, great. If no, why? "Nice job" is not proof. Money is proof.',
            action: 'Count the sales. 0 sales = 0 proof. Do not make excuses.'
        },
        {
            id: 4,
            label: 'IMPROVE',
            badge: 'STEP 4: THE PIVOT',
            color: '#4ade80', // Green
            text: 'Change the plan.',
            desc: 'Take what you learned and change the offer. Then start the loop again immediately.',
            action: 'If nobody bought, change the Price, the Customer, or the Promise. Try again tomorrow.'
        }
    ];

    // Auto-reset logic when loop completes (Step 4 -> Step 0)
    useEffect(() => {
        if (activeStep === 4) {
            const timer = setTimeout(() => {
                setActiveStep(0);
            }, 1000); // Wait 1s for the green line to finish drawing, then reset
            return () => clearTimeout(timer);
        }
    }, [activeStep]);

    const handleNext = () => {
        // If at last step (3), go to 4 (Complete Loop), which creates the "Draw to Start" effect
        // Step 4 will auto-reset to 0 via useEffect
        if (activeStep === 3) {
            setActiveStep(4);
        } else {
            setActiveStep(prev => (prev + 1) % 4); // Keep modulo 4 for steps 0,1,2,3
        }
    };

    const handlePrev = () => {
        if (activeStep === 0) return; // Don't allow going back past start effectively
        setActiveStep(prev => prev - 1);
    };

    // Scaled Geometry (800x400)
    // TL: 200, 80 | TR: 600, 80
    // BL: 200, 320 | BR: 600, 320
    const path1 = "M 200 80 C 350 80, 450 320, 600 320"; // Learn -> Do
    const path2 = "M 600 320 C 750 320, 750 80, 600 80";  // Do -> Proof (Right Arc)
    const path3 = "M 600 80 C 450 80, 350 320, 200 320";  // Proof -> Improve
    const path4 = "M 200 320 C 50 320, 50 80, 200 80";    // Improve -> Learn (Left Arc)

    const pathStyle = (index) => ({
        stroke: steps[index] ? steps[index].color : '#4ade80', // Path 4 uses Green from Step 3 (Improve) or default
        strokeWidth: 10,
        fill: 'none',
        strokeLinecap: 'round',
        opacity: activeStep >= index ? 1 : 0.1,
        strokeDasharray: 1200,
        strokeDashoffset: activeStep >= index ? 0 : 1200,
        transition: 'stroke-dashoffset 1s ease-in-out, opacity 0.5s ease'
    });

    // Fix color reference for Path 4 (It connects Improve (Green) -> Learn)
    // Actually Steps array only has 0,1,2,3. Path 4 needs a color.
    // Path 0 (Learn->Do) = Yellow. Path 1 (Do->Proof) = Cyan. Path 2 (Proof->Improve) = Pink. Path 3 (Improve->Learn) = Green.
    // My previous mapping was steps[index].color. 
    // index 0 -> Yellow (Correct). index 1 -> Cyan (Correct). index 2 -> Pink (Correct). index 3 -> Green (Correct).

    const nodeStyle = (index, x, y) => ({
        cx: x,
        cy: y,
        r: (activeStep === index) || (activeStep === 4 && index === 0) ? 35 : 15, // Highlight Start Node when looping back
        fill: steps[index].color,
        stroke: '#0b0f1a',
        strokeWidth: 4,
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: (activeStep === index) || (activeStep === 4 && index === 0) ? 'drop-shadow(0 0 25px ' + steps[index].color + ')' : 'none',
        cursor: 'pointer'
    });

    const current = activeStep === 4 ? steps[3] : (steps[activeStep] || steps[0]); // Show Improve text while closing loop

    return (
        <div id="cw-infinity-loop-container" style={{ background: '#0b0f1a', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)', margin: '3rem 0', position: 'relative', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>

            {/* Header / Controls */}
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', position: 'absolute', width: '100%', zIndex: 10, pointerEvents: 'none' }}>
                <div style={{ pointerEvents: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handlePrev} disabled={activeStep === 0} style={{ opacity: activeStep === 0 ? 0.3 : 1, background: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
                    <button onClick={handleNext} disabled={activeStep === 4} style={{ opacity: activeStep === 4 ? 0.3 : 1, background: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px #F59E0B' }}>→</button>
                </div>
            </div>

            {/* SVG Layer */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                <svg width="100%" height="100%" viewBox="0 0 800 400" style={{ maxWidth: '800px', overflow: 'visible' }}>
                    {/* Ghost Paths */}
                    <path d={path1} stroke="#1f2937" strokeWidth="10" fill="none" strokeLinecap="round" />
                    <path d={path2} stroke="#1f2937" strokeWidth="10" fill="none" strokeLinecap="round" />
                    <path d={path3} stroke="#1f2937" strokeWidth="10" fill="none" strokeLinecap="round" />
                    <path d={path4} stroke="#1f2937" strokeWidth="10" fill="none" strokeLinecap="round" />

                    {/* Active Paths - CONNECTS TO NEXT STEP */}
                    <path d={path1} style={{ ...pathStyle(0), opacity: activeStep >= 1 ? 1 : 0.1, strokeDashoffset: activeStep >= 1 ? 0 : 1200 }} />
                    <path d={path2} style={{ ...pathStyle(1), opacity: activeStep >= 2 ? 1 : 0.1, strokeDashoffset: activeStep >= 2 ? 0 : 1200 }} />
                    <path d={path3} style={{ ...pathStyle(2), opacity: activeStep >= 3 ? 1 : 0.1, strokeDashoffset: activeStep >= 3 ? 0 : 1200 }} />
                    {/* Final closing path (Improve -> Learn) only active at Step 4 */}
                    <path d={path4} style={{ ...pathStyle(3), opacity: activeStep === 4 ? 1 : 0.1, strokeDashoffset: activeStep === 4 ? 0 : 1200 }} />

                    {/* Nodes & Labels */}
                    <g onClick={() => setActiveStep(0)} style={{ cursor: 'pointer', opacity: 1 }}>
                        <circle {...nodeStyle(0, 200, 80)} />
                        <text x="200" y="40" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800" style={{ textShadow: '0 2px 10px #000' }}>LEARN</text>
                    </g>
                    <g onClick={() => setActiveStep(1)} style={{ cursor: 'pointer', opacity: activeStep >= 1 ? 1 : 0.3, transition: 'opacity 0.5s' }}>
                        <circle {...nodeStyle(1, 600, 320)} />
                        <text x="600" y="370" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800" style={{ textShadow: '0 2px 10px #000' }}>DO</text>
                    </g>
                    <g onClick={() => setActiveStep(2)} style={{ cursor: 'pointer', opacity: activeStep >= 2 ? 1 : 0.3, transition: 'opacity 0.5s' }}>
                        <circle {...nodeStyle(2, 600, 80)} />
                        <text x="600" y="40" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800" style={{ textShadow: '0 2px 10px #000' }}>PROOF</text>
                    </g>
                    <g onClick={() => setActiveStep(3)} style={{ cursor: 'pointer', opacity: activeStep >= 3 ? 1 : 0.3, transition: 'opacity 0.5s' }}>
                        <circle {...nodeStyle(3, 200, 320)} />
                        <text x="200" y="370" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800" style={{ textShadow: '0 2px 10px #000' }}>IMPROVE</text>
                    </g>
                </svg>
            </div>

            {/* Teaching Pop-up (Inside the loop feel) */}
            <div style={{
                minHeight: '240px', /* Allow growth */
                background: 'rgba(0,0,0,0.6)', /* Darker, more contrast */
                backdropFilter: 'blur(20px)',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.5s ease',
                textAlign: 'center',
                borderRadius: '0 0 24px 24px' /* FIX: Round the bottom corners */
            }}>
                <div style={{ animation: 'fadeIn 0.5s ease' }} key={activeStep}>
                    <div style={{ color: current.color, fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{current.badge}</div>

                    <h3 style={{ fontSize: '2.5rem', margin: '0 0 1rem', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}>{current.text}</h3>
                    <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 1.5rem', lineHeight: 1.5, color: '#FFFFFF', textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}>{current.desc}</p>

                    <div style={{
                        borderLeft: '4px solid ' + current.color,
                        paddingLeft: '1rem',
                        textAlign: 'left',
                        display: 'inline-block',
                        maxWidth: '600px'
                    }}>
                        <span style={{ fontWeight: 800, textTransform: 'uppercase', marginRight: '0.5rem', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}>🔥 ACTION:</span>
                        <span style={{ fontSize: '1.1rem', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}>{current.action}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CoffeeScenarioInteractive() {
    const [showOldWay, setShowOldWay] = useState(true);

    const loopSteps = [
        {
            id: 1,
            label: 'LEARN',
            color: '#fde047',
            icon: '💡',
            text: 'Thabo guesses: "I think people on Albert Road want coffee at 7am."',
            detail: 'Start with a hypothesis, not a business plan'
        },
        {
            id: 2,
            label: 'DO',
            color: '#22d3ee',
            icon: '☕',
            text: 'He buys 4 flasks of good coffee and stands on the corner at 7am with a sign: "Hot Coffee R20"',
            detail: 'Cost: R200 (not R500,000!)'
        },
        {
            id: 3,
            label: 'PROOF',
            color: '#f472b6',
            icon: '📊',
            text: 'By 8am, 30 people asked for Cappuccinos, but he only had filter coffee. He sold 5 cups.',
            detail: 'The market told him what they really want'
        },
        {
            id: 4,
            label: 'IMPROVE',
            color: '#4ade80',
            icon: '🚀',
            text: 'Insight! There IS traffic, but they want Cappuccinos, not Black coffee.',
            detail: 'Change the offer and try again tomorrow'
        }
    ];

    return (
        <div style={{ margin: '3rem 0' }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Scenario: The "Coffee on Wheels" Test</h3>

            {/* Character Introduction */}
            <div style={{
                background: '#B2F7EF',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨🏾‍💼</div>
                <h4 style={{ color: '#0b0f1a', margin: '0 0 0.5rem' }}>Meet Thabo</h4>
                <p style={{ color: '#1F2937', margin: 0 }}>Thabo wants to open a coffee shop in Woodstock. He needs R500,000 for rent and machines.</p>
            </div>

            {/* Toggle Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
                <button
                    onClick={() => setShowOldWay(true)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '50px',
                        border: showOldWay ? '2px solid #EF4444' : '2px solid #E5E7EB',
                        background: showOldWay ? '#FEE2E2' : '#fff',
                        color: showOldWay ? '#991B1B' : '#6B7280',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: showOldWay ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: showOldWay ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
                    }}
                >
                    ❌ The Old Way
                </button>
                <button
                    onClick={() => setShowOldWay(false)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '50px',
                        border: !showOldWay ? '2px solid #10B981' : '2px solid #E5E7EB',
                        background: !showOldWay ? '#D1FAE5' : '#fff',
                        color: !showOldWay ? '#065F46' : '#6B7280',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: !showOldWay ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: !showOldWay ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                >
                    ✅ The CapeWeb Loop Way
                </button>
            </div>

            {/* Content Area */}
            <div style={{ position: 'relative', minHeight: '400px' }}>
                {/* Old Way */}
                {/* Old Way */}
                {showOldWay && (
                    <div style={{
                        animation: 'fadeIn 0.5s ease',
                        background: '#FEF2F2',
                        borderRadius: '16px',
                        border: '2px solid #FCA5A5',
                        padding: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{
                                background: '#fff',
                                padding: '1rem',
                                borderRadius: '12px',
                                borderLeft: '4px solid #EF4444',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>💰</div>
                                <div style={{ fontSize: '0.95rem' }}><strong>Year 1-5:</strong> Thabo saves every cent for 5 years</div>
                            </div>

                            <div style={{
                                background: '#fff',
                                padding: '1rem',
                                borderRadius: '12px',
                                borderLeft: '4px solid #EF4444',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>🏪</div>
                                <div style={{ fontSize: '0.95rem' }}><strong>Year 6:</strong> Opens the shop with R500,000</div>
                            </div>

                            <div style={{
                                background: '#fff',
                                padding: '1rem',
                                borderRadius: '12px',
                                borderLeft: '4px solid #EF4444',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>😰</div>
                                <div style={{ fontSize: '0.95rem' }}><strong>Reality:</strong> The street is empty at 7am. Nobody comes.</div>
                            </div>

                            <div style={{
                                background: '#7F1D1D',
                                color: '#fff',
                                padding: '1rem',
                                borderRadius: '12px',
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize: '1.1rem'
                            }}>
                                💔 Result: Thabo loses everything
                            </div>
                        </div>
                    </div>
                )}

                {/* CapeWeb Loop Way */}
                {!showOldWay && (
                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {loopSteps.map((step, index) => (
                                <div
                                    key={step.id}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        borderLeft: '4px solid ' + step.color,
                                        transform: 'translateX(0) scale(1)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                        <div style={{
                                            fontSize: '1.5rem',
                                            transform: 'scale(1) rotate(0deg)',
                                            lineHeight: 1
                                        }}>
                                            {step.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: 'inline-block',
                                                background: step.color,
                                                color: '#0b0f1a',
                                                padding: '0.15rem 0.6rem',
                                                borderRadius: '20px',
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                marginBottom: '0.4rem',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {step.label}
                                            </div>
                                            <p style={{
                                                margin: '0 0 0.25rem',
                                                fontSize: '0.95rem',
                                                lineHeight: 1.4,
                                                color: '#1F2937'
                                            }}>
                                                {step.text}
                                            </p>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.85rem',
                                                color: '#6B7280',
                                                fontStyle: 'italic',
                                                opacity: 0.8
                                            }}>
                                                💡 {step.detail}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Success Result */}
                        <div style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            color: '#fff',
                            padding: '1.25rem',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            animation: 'pulseGlow 2s infinite'
                        }}>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🎉</span> Smart Loop Result:
                                </div>
                                <p style={{ color: '#D1FAE5', margin: 0, fontSize: '0.9rem', lineHeight: 1.3 }}>
                                    Saved R500k. Learned he needs an Espresso Cart.
                                </p>
                            </div>

                            <div style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50px',
                                backdropFilter: 'blur(4px)',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                            }}>
                                Cost: R200 ⚡ Learning: Priceless
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function WeeklyLoopStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        {
            id: 1,
            label: 'LEARN',
            badge: '1. THE HYPOTHESIS',
            color: 'var(--cw-color-vib-yellow)',
            text: 'You start with a guess. You do not know if it is true yet.',
            ex: 'Example: "I think busy people in my complex want their cars washed while they sleep."'
        },
        {
            id: 2,
            label: 'DO',
            badge: '2. THE EXPERIMENT',
            color: 'var(--cw-color-vib-cyan)',
            text: 'Do the smallest, cheapest thing to test your guess. Don\'t build an app. Just do the work.',
            ex: 'Example: I put 10 flyers in mailboxes saying "SMS me for a 2am Car Wash - R100".'
        },
        {
            id: 3,
            label: 'PROOF',
            badge: '3. THE DATA',
            color: 'var(--cw-color-vib-pink)',
            text: 'Collect the results. Did they pay? Did they ignore you? This is the only truth.',
            ex: 'Example: 0 people SMSed me. My idea failed.'
        },
        {
            id: 4,
            label: 'IMPROVE',
            badge: '4. THE PIVOT',
            color: 'var(--cw-color-vib-green)',
            text: 'Use the data to change your plan. If you don\'t improve, you die.',
            ex: 'Example: I change the offer to "Mobile Car Wash at your Office". Try again.'
        }
    ];

    const current = steps[activeStep];
    const isComplete = activeStep === 3;

    return (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', margin: '2rem 0' }}>

            {/* 1. VISUALIZATION AREA (The Loop Building Up) */}
            <div style={{ background: '#F9FAFB', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    {steps.map((s, i) => (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                            {/* Node */}
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: i <= activeStep ? s.color : '#E5E7EB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                color: '#0b0f1a',
                                boxShadow: i === activeStep ? '0 0 0 4px #fff, 0 0 0 8px ' + s.color : 'none',
                                opacity: i <= activeStep ? 1 : 0.3,
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: i === activeStep ? 'scale(1.1)' : 'scale(1)',
                                zIndex: 2
                            }}>
                                {s.label}
                            </div>

                            {/* Arrow to Next (Show if this is NOT the last item) */}
                            {i < 3 && (
                                <div style={{ width: '40px', height: '4px', background: i < activeStep ? '#0b0f1a' : '#E5E7EB', margin: '0 0.5rem', borderRadius: '4px', transition: 'background 0.4s ease' }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Return Arrow (Only active at end) */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    height: '60px',
                    border: '4px solid #0b0f1a',
                    borderTop: 'none',
                    borderRadius: '0 0 50px 50px',
                    opacity: isComplete ? 0.6 : 0,
                    transition: 'opacity 0.5s ease',
                    zIndex: 0
                }}>
                    <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '15px solid #0b0f1a', transform: 'rotate(-90deg)' }} />
                </div>
            </div>

            {/* 2. DETAIL AREA (Explains the Active Step) */}
            <div style={{ padding: '2rem', textAlign: 'center', animation: 'fadeIn 0.5s ease' }} key={activeStep}>
                <CWBadge style={{ background: current.color, color: '#0b0f1a', marginBottom: '1rem', border: 'none' }}>{current.badge}</CWBadge>

                <p style={{ fontSize: '1.25rem', color: '#111827', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    "{current.text}"
                </p>
                <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '2rem', fontStyle: 'italic' }}>
                    {current.ex}
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    {activeStep > 0 && (
                        <CWButton variant="ghost" onClick={() => setActiveStep(activeStep - 1)}>← Back</CWButton>
                    )}
                    <CWButton
                        variant="primary"
                        style={{
                            background: isComplete ? '#0b0f1a' : current.color,
                            borderColor: isComplete ? '#0b0f1a' : current.color,
                            color: isComplete ? '#fff' : '#0b0f1a', // Black text on colors, White on black
                            minWidth: '160px',
                            justifyContent: 'center'
                        }}
                        onClick={() => setActiveStep(prev => (prev + 1) % steps.length)}
                    >
                        {isComplete ? 'Restart Loop ↺' : 'Next Step →'}
                    </CWButton>
                </div>
            </div>
        </div>
    );
}
// ... keeping other SVGs simple or reusing the styles above

// ==========================================
// MODULE-SPECIFIC QUIZ DATA
// ==========================================

// Roadmap: The Weekly Loop - 4 questions (only Roadmap content)
export const roadmapQuizQuestions = [
    {
        question: 'The CapeWeb weekly loop is:',
        options: ['Learn → Do → Proof → Improve', 'Plan → Build → Launch → Pray', 'Logo → Website → Ads → Rich'],
        correctIndex: 0,
    },
    {
        question: 'In the "Coffee on Wheels" scenario, what did Thabo learn from his R200 experiment?',
        options: ['Nobody wants coffee at 7am', 'People want Cappuccinos, not filter coffee', 'He should open a big shop'],
        correctIndex: 1,
    },
    {
        question: 'What is the goal of the "DO" step in the loop?',
        options: ['Build the perfect product', 'Do the smallest, cheapest experiment to test your idea', 'Quit your job'],
        correctIndex: 1,
    },
    {
        question: 'In the loop, "PROOF" means:',
        options: ['People said nice things about your idea', 'You got actual sales or real customer data', 'You made a logo'],
        correctIndex: 1,
    },
];

// Module A: The Founder Routine - 4 questions (3 new + 1 review)
export const moduleAQuizQuestions = [
    {
        question: 'Why is a Founder Routine important?',
        options: ['It looks professional', 'You cannot build a company on "when I have time"', 'It impresses investors'],
        correctIndex: 1,
    },
    {
        question: 'What is better for building a business?',
        options: ['10 hours once a month', '30 minutes every day', 'Waiting until you have a full day free'],
        correctIndex: 1,
    },
    {
        question: 'What is "busy work"?',
        options: ['Important tasks that grow your business', 'Work that feels like work but achieves nothing (e.g., perfecting a logo for weeks)', 'Talking to customers'],
        correctIndex: 1,
    },
    {
        question: 'What is the first step of the weekly loop? (Review)',
        options: ['Buy a domain', 'LEARN (Start with a hypothesis)', 'Build a full product'],
        correctIndex: 1,
    },
];

// Module B: Problem & Customer - 4 questions (3 new + 1 from Module A)
export const moduleBQuizQuestions = [
    {
        question: 'A strong business statement uses:',
        options: ['WHO + PAIN + RESULT', 'Logo + Colours + Slogan', 'Hope + Motivation + Luck'],
        correctIndex: 0,
    },
    {
        question: 'Validation means:',
        options: ['Designing a logo and printing flyers', 'Getting proof from real customers before building', 'Waiting until everything is perfect'],
        correctIndex: 1,
    },
    {
        question: 'How should you validate your idea?',
        options: ['Ask "Would you buy my product?"', 'Ask about their past actions and problems', 'Just build it and hope'],
        correctIndex: 1,
    },
    {
        question: 'What should you focus on first? (Review from Module A)',
        options: ['Making a perfect logo', 'Building a consistent routine', 'Buying expensive equipment'],
        correctIndex: 1,
    },
];

// Module C: Your Offer - 4 questions (3 new + 1 review)
export const moduleCQuizQuestions = [
    {
        question: 'People buy when:',
        options: ['The price is lowest', 'Value is higher than Friction (price + effort + risk)', 'The logo is pretty'],
        correctIndex: 1,
    },
    {
        question: 'To increase sales, you can:',
        options: ['Only lower the price', 'Increase Value OR decrease Friction', 'Make the website fancier'],
        correctIndex: 1,
    },
    {
        question: 'What reduces "Friction" in an offer?',
        options: ['Making it more expensive', 'Adding a money-back guarantee or making it easier to buy', 'Adding more features'],
        correctIndex: 1,
    },
    {
        question: 'Before building your offer, you should: (Review)',
        options: ['Validate the problem with real customers', 'Design the perfect website', 'Quit your job'],
        correctIndex: 0,
    },
];

// Module D: Competitors - 4 questions (3 new + 1 review)
export const moduleDQuizQuestions = [
    {
        question: 'Why do we analyze competitors?',
        options: ['To copy everything they do', 'To find their weaknesses and your opportunity', 'To steal their customers'],
        correctIndex: 1,
    },
    {
        question: 'What are "Indirect Competitors"?',
        options: ['People selling the exact same thing', 'Different solutions to the same problem', 'People in a different industry'],
        correctIndex: 1,
    },
    {
        question: 'The biggest competitor is often:',
        options: ['Direct competitors', 'Indirect competitors', 'Inertia - customers doing nothing because change is hard'],
        correctIndex: 2,
    },
    {
        question: 'Your offer should focus on: (Review)',
        options: ['Being cheaper than everyone', 'Higher Value than Friction', 'Having the fanciest website'],
        correctIndex: 1,
    },
];

// Module E: Business Model - 5 questions (3 new + 2 review)
export const moduleEQuizQuestions = [
    {
        question: 'A "Service" business model is:',
        options: ['Selling a physical item like shoes', 'Selling your time/skill (e.g. repairs, design)', 'Selling subscriptions'],
        correctIndex: 1,
    },
    {
        question: 'A "Product" business model is:',
        options: ['Selling your time', 'Making or buying items to sell (e.g., food, clothes)', 'Consulting'],
        correctIndex: 1,
    },
    {
        question: 'The advantage of a Service model is:',
        options: ['Easy to scale to millions', 'Low cost to start', 'No work required'],
        correctIndex: 1,
    },
    {
        question: 'Why analyze competitors? (Review)',
        options: ['To copy them', 'To find their weaknesses and your opportunity', 'To give up'],
        correctIndex: 1,
    },
    {
        question: 'The CapeWeb loop is: (Review)',
        options: ['Learn → Do → Proof → Improve', 'Plan → Build → Launch → Pray', 'Logo → Website → Ads → Rich'],
        correctIndex: 0,
    },
];

// Final Pillar 1 Quiz (comprehensive review) - 10 questions
export const pillar1QuizQuestions = [
    {
        question: 'The CapeWeb weekly loop is:',
        options: ['Learn → Do → Proof → Improve', 'Learn → Logo → Website → Rich', 'Plan → Panic → Quit → Repeat'],
        correctIndex: 0,
    },
    {
        question: 'In the "Coffee on Wheels" scenario, what did Thabo learn from his R200 experiment?',
        options: ['Nobody wants coffee at 7am', 'People want Cappuccinos, not filter coffee', 'He should quit and get a job'],
        correctIndex: 1,
    },
    {
        question: 'Why is a Founder Routine important?',
        options: ['It looks professional', 'You cannot build a company on "when I have time"', 'It impresses investors'],
        correctIndex: 1,
    },
    {
        question: 'Validation means:',
        options: ['Designing a logo and printing flyers', 'Getting proof from real customers before building', 'Waiting until everything is perfect'],
        correctIndex: 1,
    },
    {
        question: 'A strong business statement uses:',
        options: ['WHO + PAIN + RESULT', 'Logo + Colours + Slogan', 'Hope + Motivation + Luck'],
        correctIndex: 0,
    },
    {
        question: 'In the Value vs Friction formula, how do you increase sales?',
        options: ['Only lower the price', 'Increase Value OR decrease Friction (price, effort, risk)', 'Make the logo bigger'],
        correctIndex: 1,
    },
    {
        question: 'Why do we analyze competitors?',
        options: ['To copy everything they do', 'To find their weaknesses and your opportunity', 'To steal their logo'],
        correctIndex: 1,
    },
    {
        question: 'A "Service" business model is:',
        options: ['Selling a physical item like shoes', 'Selling your time/skill (e.g. repairs, design)', 'Doing nothing'],
        correctIndex: 1,
    },
    {
        question: 'What is the goal of Pillar 1?',
        options: ['Build a perfect website', 'Validation - prove people want what you have', 'Register your company'],
        correctIndex: 1,
    },
    {
        question: 'The biggest competitor is often:',
        options: ['Direct competitors selling the same thing', 'Indirect competitors with different solutions', 'Inertia - customers doing nothing because change is hard'],
        correctIndex: 2,
    },
];

// ==========================================
// MINI QUIZ COMPONENT (for individual modules)
// ==========================================
function MiniQuiz({ questions, title = "Knowledge Check", onNext }) {
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null);
    // Removed showFeedback state as we are deferring results
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [celebrating, setCelebrating] = useState(false);
    const counterRef = React.useRef(null);

    const question = questions[currentQ];
    const isLast = currentQ === questions.length - 1;

    // Celebration Sound Effect
    const playSuccessSound = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch (e) {
            console.error("Audio error", e);
        }
    };

    const handleSelect = (index) => {
        setSelected(index);
    };

    const handleNext = () => {
        // Calculate score for THIS question
        const isCorrect = selected === question.correctIndex;
        // Use functional update to ensure we have the latest score if batching occurs, 
        // though strictly speaking in this flow we update then move, so 'score' var might be stale for THIS render cycle but next render is fine.
        // Better: calculate new score and pass it if we are finishing.
        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);

        if (isLast) {
            setCompleted(true);
            const percentage = Math.round((newScore / questions.length) * 100);

            if (percentage >= 70) {
                setCelebrating(true);
                playSuccessSound();
            }
        } else {
            setCurrentQ(currentQ + 1);
            setSelected(null);
        }
    };

    const handleRestart = () => {
        setCurrentQ(0);
        setSelected(null);
        setScore(0);
        setCompleted(false);
        setCelebrating(false);
    };

    // Celebration Animation Effect
    useEffect(() => {
        if (celebrating && counterRef.current) {
            const percentage = Math.round((score / questions.length) * 100);

            // GSAP Animation matches the provided snippet
            const tl = gsap.timeline();

            // Remove celebrate class initially
            counterRef.current.classList.remove('celebrate');

            tl.set(counterRef.current, { opacity: 1 })
                .fromTo(counterRef.current,
                    {
                        innerText: 0,
                        "--font-variation-weight": 300,
                        scale: 0.8
                    },
                    {
                        innerText: percentage,
                        duration: 3,
                        snap: { innerText: 1 },
                        ease: "linear",
                        onUpdate: function () {
                            const val = Math.ceil(this.targets()[0].innerText);
                            counterRef.current.innerHTML = val + "%";
                        },
                        onComplete: () => {
                            // Celebrate!
                            counterRef.current.classList.add('celebrate');


                            const colors = ['#fbda61', '#ff5acd'];
                            const runConfetti = confettiModule.default || confettiModule;

                            if (typeof runConfetti === 'function') {
                                runConfetti({
                                    particleCount: 150,
                                    spread: 100,
                                    origin: { y: 0.8 },
                                    colors: colors,
                                    disableForReducedMotion: true
                                });
                            }

                            // Auto-close overlay
                            setTimeout(() => {
                                setCelebrating(false);
                            }, 3000);
                        }
                    }
                )
                .to(counterRef.current, {
                    scale: 1,
                    "--font-variation-weight": 600,
                    duration: 1.2,
                    ease: "elastic.out(1, 0.2)"
                });

            return () => {
                if (counterRef.current) counterRef.current.classList.remove('celebrate');
            };
        }
    }, [celebrating, score, questions.length]);

    // Full Screen Celebration Overlay -> Now Contained in Card
    if (celebrating) {
        return (
            <div style={{
                marginTop: '3rem',
                padding: '3rem 2rem',
                borderRadius: '32px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 50px -10px rgba(31, 38, 135, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '400px', // Ensure height matches quiz
                display: 'grid',
                placeItems: 'center',
                fontFamily: '"Roboto Flex", sans-serif'
            }}>
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <h1 ref={counterRef} className="counter">0%</h1>
                </div>
            </div>
        );
    }

    if (completed) {
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 70;

        return (
            <div style={{
                marginTop: '3rem',
                padding: '2rem',
                textAlign: 'center',
                borderRadius: '24px',
                background: passed ? 'rgba(209, 250, 229, 0.8)' : 'rgba(254, 226, 226, 0.8)',
                backdropFilter: 'blur(20px)',
                border: passed ? '3px solid rgba(16, 185, 129, 0.3)' : '3px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{passed ? '🎉' : '📚'}</div>
                <h3 style={{ fontSize: '2rem', color: passed ? '#065F46' : '#991B1B', marginBottom: '1rem' }}>
                    {passed ? 'Great Job!' : 'Keep Learning!'}
                </h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1F2937' }}>
                    You scored {score} out of {questions.length} ({percentage}%)
                </p>
                <p style={{ color: '#4B5563', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    {passed ? 'You are ready for the next module.' : 'Review the content and try again.'}
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <CWButton onClick={handleRestart} variant={passed ? "secondary" : "primary"} style={{ opacity: passed ? 0.9 : 1 }}>
                        {passed ? '↺ Retake Quiz' : '↺ Try Again'}
                    </CWButton>

                    {passed && onNext && (
                        <CWButton onClick={onNext} variant="primary">
                            Next Module →
                        </CWButton>
                    )}
                </div>
            </div>
        );
    }

    // Glassmorphic Question Card
    return (
        <div style={{
            marginTop: '3rem',
            padding: '2rem 2rem', // Reduced padding
            borderRadius: '32px', // More rounded
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 20px 50px -10px rgba(31, 38, 135, 0.15)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Moving Gradient Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(120deg, rgba(34,211,238,0.15), rgba(244,114,182,0.15), rgba(253,224,71,0.15), rgba(34,211,238,0.15))',
                backgroundSize: '300% 300%',
                animation: 'gradientMove 15s ease infinite',
                zIndex: -1,
                pointerEvents: 'none'
            }} />

            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                    background: '#E0F2FE',
                    color: '#0284C7',
                    padding: '0.3rem 0.8rem', // Slightly smaller
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    Assessment
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748B' }}>
                    Question {currentQ + 1} of {questions.length}
                </span>
            </div>

            <h4 style={{
                margin: '0 0 1.5rem 0', // Reduced margin
                fontSize: '2rem', // Slightly smaller title
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
            }}>
                {title}
            </h4>

            <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1E293B', lineHeight: 1.5 }}>
                    {question.question}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {question.options.map((option, index) => (
                        <label
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem 1.25rem', // Reduced padding
                                borderRadius: '16px', // Slightly tighter radius
                                border: '2px solid',
                                borderColor: selected === index ? '#0EA5E9' : '#E2E8F0', // Blue highlight
                                background: selected === index ? '#F0F9FF' : '#FFFFFF',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: selected === index ? '0 4px 20px rgba(14, 165, 233, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                            onClick={() => handleSelect(index)}
                        >
                            <div style={{
                                width: '22px', // Smaller checkbox
                                height: '22px',
                                borderRadius: '50%',
                                border: selected === index ? '6px solid #0EA5E9' : '2px solid #CBD5E1',
                                flexShrink: 0,
                                transition: 'all 0.2s ease'
                            }} />

                            <span style={{ flex: 1, fontSize: '1.05rem', color: selected === index ? '#0C4A6E' : '#334155', fontWeight: 500 }}>
                                {option}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleNext}
                    disabled={selected === null}
                    style={{
                        padding: '0.75rem 2rem', // Compact button
                        background: '#0F172A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '100px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        cursor: selected === null ? 'not-allowed' : 'pointer',
                        opacity: selected === null ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {isLast ? 'Finish Quiz' : 'Next Question'}
                    <span>→</span>
                </button>
            </div>
        </div>
    );
}

// ==========================================
// MODULES (Expanded Content for Beginners)
// ==========================================

export function Pillar1JourneyMap({ onNext }) {
    return (
        <InteractiveLayout title="The Roadmap" subtitle="From 'Just an Idea' to 'Real Business'">
            <div className="cw-prose">
                <p className="cw-text-body">
                    You are about to start a journey that most people fail at.
                    Why do they fail? Because they focus on the "fun" stuff (logos, websites, business cards) before they answer the hard questions.
                </p>
                <p>
                    This roadmap is not a guess. It is built on the same principles used by the world's best founders, from Silicon Valley (<em>The Lean Startup</em>) to successful local tradesmen (<em>The E-Myth</em>).
                </p>

                <h3>Validation</h3>
                <p>

                    Before you spend R1 on a website, you must prove that people actually want what you have.
                    We use the <strong>"Zero to One"</strong> mindset: you aren't just copying a competitor; you are solving a specific problem for specific people better than anyone else.
                </p>

                <h4 style={{ marginTop: '2rem' }}>The Build-Measure-Learn Loop</h4>
                <p>
                    You don't build a business in a cave for 6 months. You build it in 1-week loops.
                    This concept (popularized by Eric Ries) dictates that the faster you learn, the faster you win.
                </p>

                <WeeklyLoopInfinity />

                <CoffeeScenarioInteractive />

                <MiniQuiz questions={roadmapQuizQuestions} title="Roadmap Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

// ==========================================
// SHARED COMPONENTS
// ==========================================

// BookInsight imported from CapeWebUI

// ==========================================
// MODULE A INTERACTIVES
// ==========================================

function RoutineCompoundGraph() {
    const [mode, setMode] = useState('consistent'); // 'consistent' or 'intensity'

    return (
        <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1.5rem', fontWeight: 800, fontSize: '1.2rem' }}>Which curve are you on?</h4>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setMode('intensity')}
                    style={{
                        padding: '0.5rem 1.5rem',
                        borderRadius: '100px',
                        border: 'none',
                        background: mode === 'intensity' ? '#EF4444' : '#E2E8F0',
                        color: mode === 'intensity' ? '#fff' : '#64748B',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    🔥 Hero Mode
                </button>
                <button
                    onClick={() => setMode('consistent')}
                    style={{
                        padding: '0.5rem 1.5rem',
                        borderRadius: '100px',
                        border: 'none',
                        background: mode === 'consistent' ? '#10B981' : '#E2E8F0',
                        color: mode === 'consistent' ? '#fff' : '#64748B',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: mode === 'consistent' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                >
                    🌱 Habit Mode
                </button>
            </div>

            <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    {/* Grid */}
                    <line x1="0" y1="180" x2="400" y2="180" stroke="#CBD5E1" strokeWidth="2" />
                    <line x1="20" y1="0" x2="20" y2="180" stroke="#CBD5E1" strokeWidth="2" />
                    <text x="380" y="195" fontSize="10" fill="#94A3B8" fontWeight="600">TIME</text>
                    <text x="0" y="10" fontSize="10" fill="#94A3B8" fontWeight="600">RESULTS</text>

                    {/* INTENSITY CURVE (Spiky, burnout) */}
                    <path
                        d="M 20 180 L 50 20 L 80 180 L 150 180 L 180 50 L 210 180 L 400 180"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            opacity: mode === 'intensity' ? 1 : 0.1,
                            transition: 'opacity 0.5s',
                            strokeDasharray: 1000,
                            strokeDashoffset: mode === 'intensity' ? 0 : 1000,
                            transition: 'stroke-dashoffset 2s ease, opacity 0.5s'
                        }}
                    />
                    {mode === 'intensity' && (
                        <g>
                            <circle cx="50" cy="20" r="6" fill="#EF4444" />
                            <text x="60" y="20" fontSize="12" fill="#EF4444" fontWeight="bold">BIG DAY</text>
                            <circle cx="210" cy="180" r="6" fill="#EF4444" />
                            <text x="220" y="170" fontSize="12" fill="#EF4444" fontWeight="bold">BURNOUT</text>
                        </g>
                    )}

                    {/* HABIT CURVE (Exponential) */}
                    <path
                        d="M 20 180 Q 200 170 400 20"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{
                            opacity: mode === 'consistent' ? 1 : 0.1,
                            strokeDasharray: 1000,
                            strokeDashoffset: mode === 'consistent' ? 0 : 1000,
                            transition: 'stroke-dashoffset 2s ease, opacity 0.5s'
                        }}
                    />
                    {mode === 'consistent' && (
                        <g>
                            <circle cx="400" cy="20" r="8" fill="#10B981" />
                            <text x="320" y="40" fontSize="14" fill="#10B981" fontWeight="bold">SUCCESS</text>
                        </g>
                    )}
                </svg>
            </div>
            <p style={{ marginTop: '1rem', color: '#64748B', fontSize: '0.9rem', fontStyle: 'italic' }}>
                {mode === 'intensity' ? 'Hero Mode: Work 12 hours once. Get tired. Quit.' : 'Habit Mode: Work 30 mins daily. Compound growth.'}
            </p>
        </div>
    );
}

function RoutineScenarioInteractive() {
    const [view, setView] = useState('old');

    return (
        <div style={{ margin: '3rem 0' }}>
            <h4 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Scenario: Finding Time</h4>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', background: '#F1F5F9', padding: '0.5rem', borderRadius: '100px', width: 'fit-content', margin: '0 auto 2rem' }}>
                <button onClick={() => setView('old')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'old' ? '#fff' : 'transparent', color: view === 'old' ? '#EF4444' : '#64748B', fontWeight: 800, boxShadow: view === 'old' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>The Weekend Warrior</button>
                <button onClick={() => setView('new')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'new' ? '#fff' : 'transparent', color: view === 'new' ? '#10B981' : '#64748B', fontWeight: 800, boxShadow: view === 'new' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>The 30-Min Founder</button>
            </div>

            {view === 'old' ? (
                <div style={{ animation: 'fadeIn 0.5s', padding: '1rem', background: '#FEF2F2', borderRadius: '24px', border: '2px solid #FECACA' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ background: '#fff', padding: '1rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.5rem' }}>📅</div>
                            <div>
                                <strong style={{ color: '#EF4444', textTransform: 'uppercase', fontSize: '0.8rem' }}>Monday - Friday</strong>
                                <p style={{ margin: 0, color: '#475569' }}>"I'm too tired after work. I'll do it on Saturday."</p>
                            </div>
                        </div>
                        <div style={{ background: '#fff', padding: '1rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.5rem' }}>🔥</div>
                            <div>
                                <strong style={{ color: '#EF4444', textTransform: 'uppercase', fontSize: '0.8rem' }}>Saturday</strong>
                                <p style={{ margin: 0, color: '#475569' }}>Works for 10 hours straight. Skips family time.</p>
                            </div>
                        </div>
                        <div style={{ background: '#fff', padding: '1rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.5rem' }}>💀</div>
                            <div>
                                <strong style={{ color: '#EF4444', textTransform: 'uppercase', fontSize: '0.8rem' }}>Week 2</strong>
                                <p style={{ margin: 0, color: '#475569' }}>Burnout. Does nothing for 3 weeks.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ animation: 'fadeIn 0.5s', padding: '1rem', background: '#ECFDF5', borderRadius: '24px', border: '2px solid #A7F3D0' }}>
                    <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                            <div key={day} style={{ background: '#fff', padding: '0.8rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #10B981' }}>
                                <div style={{ fontSize: '1.2rem' }}>✅</div>
                                <div style={{ flex: 1, fontWeight: 700, color: '#064E3B' }}>{day}</div>
                                <div style={{ fontSize: '0.9rem', color: '#64748B' }}>30 mins before kids wake up</div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: '#fff',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        animation: 'pulseGlow 2s infinite',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>📈</span> Result:
                            </div>
                            <p style={{ color: '#D1FAE5', margin: 0, fontSize: '0.9rem', lineHeight: 1.3 }}>
                                Consistent momentum. No burnout.
                            </p>
                        </div>
                        <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50px', backdropFilter: 'blur(4px)', fontSize: '0.85rem', fontWeight: 700 }}>
                            Total: 150 mins/week
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export function Pillar1ModuleA({ onNext }) {
    return (

        <InteractiveLayout
            title="Module A: The Founder Routine"
            subtitle="Motivation gets you started. Habit keeps you going."
        >
            <div className="cw-prose">
                <p className="cw-text-body">
                    Most people think they need a "big break" or "full time focus" to start a business.
                    <strong>This is a lie.</strong>
                </p>
                <p className="cw-text-body">
                    We tend to think we need "motivation" to work. But professionals don't wait for motivation.
                    They build a <strong>routine</strong> that makes working automatic.
                </p>

                <BookInsight title="Systems > Goals" author="James Clear" book="Atomic Habits" color="#0EA5E9">
                    "You do not rise to the level of your goals. You fall to the level of your systems.
                    Your goal is your desired outcome. Your system is the collection of daily habits that will get you there."
                </BookInsight>

                <h3 style={{ fontSize: '1.75rem', marginTop: '2.5rem' }}>Core Concept: Identity-Based Habits</h3>
                <p>
                    James Clear teaches that true change doesn't come from focusing on <em>outcomes</em> (e.g. "I want to make R10k"), but on <em>identity</em>.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
                    <CWCard>
                        <strong style={{ color: '#EF4444' }}>The Amateur</strong>
                        <p>"I want to build a website."</p>
                        <small style={{ color: '#64748B' }}>Focus: Outcome. Breaks when it gets hard.</small>
                    </CWCard>
                    <CWCard>
                        <strong style={{ color: '#10B981' }}>The Professional</strong>
                        <p>"I am a Builder."</p>
                        <small style={{ color: '#64748B' }}>Focus: Identity. Builders build every day, regardless of motivation.</small>
                    </CWCard>
                </div>
                <p>
                    <strong>The 2-Minute Rule:</strong> When starting a new habit, it should take less than 2 minutes to do. "Build a website" is too hard. "Open my code editor" is easy. Master the art of showing up.
                </p>

                <h3 style={{ fontSize: '1.75rem', marginTop: '2.5rem' }}>The Compound Effect</h3>
                <p>
                    Imagine two founders. One works intensely but randomly. The other works a small amount every single day.
                    Who wins? The math is surprising.
                </p>

                <RoutineCompoundGraph />

                <h3>Activity: Set Your Schedule</h3>
                <p>
                    Be honest. We are not looking for "I will work 4 hours every night". You won't.
                    We are looking for a slot you can hit <strong>100% of the time</strong>, even on your worst day.
                </p>

                <CWCard style={{ marginBottom: '2rem', marginTop: '1.5rem' }}>
                    <h4 style={{ marginTop: 0 }}>The Commitment</h4>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <label className="cw-label">1. Founder Name</label>
                            <CWInput placeholder="Who is making this promise?" />
                        </div>
                        <div>
                            <label className="cw-label">2. The Slot</label>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>E.g. "Every morning from 06:00 to 06:30"</p>
                            <CWInput placeholder="When will you work?" />
                        </div>
                        <div>
                            <label className="cw-label">3. The Trigger</label>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>"I will work immediately after..." (e.g. Brushing teeth)</p>
                            <CWInput placeholder="My trigger is..." />
                        </div>
                    </div>
                </CWCard>

                <RoutineScenarioInteractive />

                <MiniQuiz questions={moduleAQuizQuestions} title="Routine Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

// ==========================================
// MODULE B INTERACTIVES
// ==========================================

function TargetingVisual() {
    const [mode, setMode] = useState('niche'); // 'broad' or 'niche'

    return (
        <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>The "Sniper" Principle</h4>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => setMode('broad')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', border: 'none', background: mode === 'broad' ? '#EF4444' : '#E2E8F0', color: mode === 'broad' ? '#fff' : '#64748B', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>📢 Shotgun (Broad)</button>
                <button onClick={() => setMode('niche')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', border: 'none', background: mode === 'niche' ? '#10B981' : '#E2E8F0', color: mode === 'niche' ? '#fff' : '#64748B', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', boxShadow: mode === 'niche' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none' }}>🎯 Sniper (Niche)</button>
            </div>

            <div style={{ height: '220px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="300" height="200" viewBox="0 0 300 200">
                    {/* Customer Crowd */}
                    {Array.from({ length: 40 }).map((_, i) => {
                        // Random positions standard
                        const randX = (i * 137) % 280 + 10;
                        const randY = (i * 73) % 180 + 10;
                        // Niche positions (clustered in center)
                        const nicheX = 150 + Math.cos(i) * 30;
                        const nicheY = 100 + Math.sin(i) * 30;

                        const x = mode === 'broad' ? randX : nicheX;
                        const y = mode === 'broad' ? randY : nicheY;
                        const isTarget = i < 10; // Only 10 are actual buyers

                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={isTarget ? 6 : 4}
                                fill={isTarget ? '#10B981' : '#CBD5E1'}
                                style={{ transition: 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                            />
                        );
                    })}

                    {/* Scope Overlay */}
                    <g style={{
                        opacity: mode === 'niche' ? 1 : 0,
                        transform: mode === 'niche' ? 'scale(1)' : 'scale(2)',
                        transformOrigin: 'center',
                        transition: 'all 0.8s ease'
                    }}>
                        <circle cx="150" cy="100" r="50" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="10,5" />
                        <line x1="150" y1="50" x2="150" y2="150" stroke="#EF4444" strokeWidth="1" />
                        <line x1="100" y1="100" x2="200" y2="100" stroke="#EF4444" strokeWidth="1" />
                    </g>

                    {/* Message bubble */}
                    {mode === 'broad' && (
                        <text x="150" y="100" textAnchor="middle" fill="#EF4444" fontSize="14" fontWeight="bold" style={{ textShadow: '0 2px 4px white' }}>"I HELP EVERYONE!"</text>
                    )}
                </svg>
            </div>
            <p style={{ marginTop: '1rem', color: '#64748B', fontSize: '0.9rem' }}>
                {mode === 'broad' ? 'Broad: You try to talk to everyone. No one listens. (Low Sales)' : 'Niche: You talk to specific people. They feel understood. (High Sales)'}
            </p>
        </div>
    );
}

function TargetingScenario() {
    const [view, setView] = useState('old');
    return (
        <div style={{ margin: '3rem 0' }}>
            <h4 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Scenario: The Catering Company</h4>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', background: '#F1F5F9', padding: '0.5rem', borderRadius: '100px', width: 'fit-content', margin: '0 auto 2rem' }}>
                <button onClick={() => setView('old')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'old' ? '#fff' : 'transparent', color: view === 'old' ? '#EF4444' : '#64748B', fontWeight: 800, boxShadow: view === 'old' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>The "Safe" Way</button>
                <button onClick={() => setView('new')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'new' ? '#fff' : 'transparent', color: view === 'new' ? '#10B981' : '#64748B', fontWeight: 800, boxShadow: view === 'new' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>The Smart Way</button>
            </div>
            {view === 'old' ? (
                <div style={{ padding: '1.5rem', background: '#FEF2F2', borderRadius: '24px', border: '2px solid #FECACA', animation: 'fadeIn 0.5s' }}>
                    <strong>Offer:</strong> "We do catering for weddings, parties, funerals, and corporate."
                    <br /><br />
                    <strong>Result:</strong> Confused customers. "Are they cheap? Expensive? Good?"
                    <br /><br />
                    <span style={{ color: '#EF4444', fontWeight: 800 }}>Outcome: 2 Gigs/Month. Struggling.</span>
                </div>
            ) : (
                <div style={{ padding: '1.5rem', background: '#ECFDF5', borderRadius: '24px', border: '2px solid #A7F3D0', animation: 'fadeIn 0.5s' }}>
                    <strong>Offer:</strong> "Health-focused catering for Tech Startup lunches in Cape Town."
                    <br /><br />
                    <strong>Result:</strong> Clear value. "Perfect for our office!"
                    <br /><br />
                    <span style={{ color: '#10B981', fontWeight: 800 }}>Outcome: Fully Booked (Recurring Recurring Revenue).</span>
                </div>
            )}
        </div>
    )
}

export function Pillar1ModuleB({ onNext }) {
    return (
        <InteractiveLayout
            title="Module B: The Problem"
            subtitle="If you chase two rabbits, you catch none."
        >
            <div className="cw-prose">
                <p className="cw-text-body">
                    The biggest mistake new founders make is being afraid to exclude people.
                    "I don't want to limit my market!" they say.
                    <br />
                    So they market to everyone, and connect with no one.
                </p>

                <BookInsight title="The Tribe Concept" author="Seth Godin" book="This is Marketing" color="#10B981">
                    "Everyone is not your customer. It’s better to have 1,000 true fans than 100,000 people who sort of like you.
                    People like us do things like this."
                </BookInsight>

                <TargetingVisual />

                <h3 style={{ marginTop: '2rem' }}>The "Minimum Viable Audience"</h3>
                <p>
                    Seth Godin argues that you shouldn't try to reach everyone. Instead, ask yourself:
                    <em>"What is the smallest group of people who could sustain my business?"</em>
                </p>
                <ul style={{ background: '#F0FDF4', padding: '1.5rem 1.5rem 1.5rem 2.5rem', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Don't</strong> find customers for your product.</li>
                    <li><strong>Do</strong> find a product for your customers.</li>
                </ul>
                <p>
                    When you treat your customers as a "Tribe"—people who share values and say "people like us do things like this"—marketing becomes easy. You aren't selling; you are leading.
                </p>

                <h3>The CapeWeb Formula</h3>
                <p>To build a strong business statement, you just need to fill in these three blanks. This is your "North Star".</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
                    <CWCard>
                        <CWBadge status="brand">THE WHO</CWBadge>
                        <h4>Specific Group</h4>
                        <p style={{ fontSize: '0.9rem' }}>e.g. "Working moms with toddlers"</p>
                        <CWInput placeholder="Who is your customer?" style={{ marginTop: '0.5rem' }} />
                    </CWCard>
                    <CWCard>
                        <CWBadge status="warning">THE PAIN</CWBadge>
                        <h4>The Problem</h4>
                        <p style={{ fontSize: '0.9rem' }}>e.g. "No time to cook healthy"</p>
                        <CWInput placeholder="What do they hate?" style={{ marginTop: '0.5rem' }} />
                    </CWCard>
                    <CWCard>
                        <CWBadge status="success">THE RESULT</CWBadge>
                        <h4>The Solution</h4>
                        <p style={{ fontSize: '0.9rem' }}>e.g. "Fresh kids meals delivered"</p>
                        <CWInput placeholder="How do you fix it?" style={{ marginTop: '0.5rem' }} />
                    </CWCard>
                </div>

                <TargetingScenario />

                <CWAlert type="warning" title="Validation Rule">
                    Do not ask "Would you buy my product?" People lie to be nice. Ask "Tell me about the last time you tried to solve this problem?"
                </CWAlert>

                <MiniQuiz questions={moduleBQuizQuestions} title="Focus Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

// ==========================================
// MODULE C INTERACTIVES
// ==========================================

function ValueEquationVisual() {
    const [friction, setFriction] = useState(80); // High friction default

    // Calculate Value (inverse to friction for visual effect)
    const value = 100 - friction;
    const isSale = value > friction;

    return (
        <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>The Value Equation</h4>

            <div style={{ marginBottom: '2rem', padding: '0 2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, color: '#64748B' }}>Friction (Price, Effort, Risk)</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={friction}
                    onChange={(e) => setFriction(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'black' }}
                />
            </div>

            <div style={{ height: '150px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Seesaw Base */}
                <div style={{
                    width: '200px',
                    height: '4px',
                    background: '#334155',
                    transform: 'rotate(' + ((friction - 50) * 0.4) + 'deg)',
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} />
                <div style={{ width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '20px solid #334155', position: 'absolute', bottom: '50px' }} />

                {/* Scale Items */}
                <div style={{
                    position: 'absolute',
                    left: '60px',
                    bottom: (50 + (friction - 50)) + 'px', // Moves up/down
                    transition: 'bottom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                    <div style={{ fontSize: '2rem' }}>💎</div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>VALUE</div>
                </div>

                <div style={{
                    position: 'absolute',
                    right: '60px',
                    bottom: (50 - (friction - 50)) + 'px', // Moves down/up
                    transition: 'bottom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                    <div style={{ fontSize: '2rem' }}>🧱</div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>FRICTION</div>
                </div>
            </div>

            <div style={{
                marginTop: '1rem',
                fontWeight: 800,
                fontSize: '1.5rem',
                color: isSale ? '#10B981' : '#94A3B8',
                transition: 'color 0.3s'
            }}>
                {isSale ? '🎉 SALE HAPPENS!' : '🚫 NO SALE.'}
            </div>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                {isSale ? 'Value outweighs Friction. Customer buys.' : 'Too much Friction (Price/Risk). Customer leaves.'}
            </p>
        </div>
    );
}

function OfferScenario() {
    const [view, setView] = useState('weak');
    return (
        <div style={{ margin: '3rem 0' }}>
            <h4 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Scenario: Selling a Course</h4>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', background: '#F1F5F9', padding: '0.5rem', borderRadius: '100px', width: 'fit-content', margin: '0 auto 2rem' }}>
                <button onClick={() => setView('weak')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'weak' ? '#fff' : 'transparent', color: view === 'weak' ? '#EF4444' : '#64748B', fontWeight: 800, boxShadow: view === 'weak' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>Weak Offer</button>
                <button onClick={() => setView('strong')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'strong' ? '#fff' : 'transparent', color: view === 'strong' ? '#10B981' : '#64748B', fontWeight: 800, boxShadow: view === 'strong' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>Irresistible Offer</button>
            </div>
            {view === 'weak' ? (
                <div style={{ padding: '1.5rem', background: '#FEF2F2', borderRadius: '24px', border: '2px solid #FECACA', animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                    <h3 style={{ margin: '0 0 1rem' }}>"Buy my SQL Course"</h3>
                    <p>Price: R5,000</p>
                    <p style={{ color: '#EF4444', fontStyle: 'italic' }}>Result: "Too expensive. I'll watch YouTube."</p>
                </div>
            ) : (
                <div style={{ padding: '1.5rem', background: '#ECFDF5', borderRadius: '24px', border: '2px solid #A7F3D0', animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁</div>
                    <h3 style={{ margin: '0 0 1rem' }}>"Become a Data Analyst in 30 Days"</h3>
                    <ul style={{ textAlign: 'left', display: 'inline-block', margin: '0 auto 1.5rem', color: '#064E3B' }}>
                        <li>✅ Complete SQL Course</li>
                        <li>✅ Resume Review by Expert</li>
                        <li>✅ Mock Interview Practice</li>
                        <li>✅ <strong>100% Money Back Guarantee</strong></li>
                    </ul>
                    <p>Price: R5,000</p>
                    <p style={{ color: '#10B981', fontWeight: 800 }}>Result: "This is a no-brainer!"</p>
                </div>
            )}
        </div>
    )
}

export function Pillar1ModuleC({ onNext }) {
    return (
        <InteractiveLayout
            title="Module C: The Offer"
            subtitle="Make it so good they feel stupid saying no."
        >
            <div className="cw-prose">
                <p className="cw-text-body">
                    An "Offer" is not just a product. It is what you give, and what you get in return.
                    It needs to be <strong>Irresistible</strong>.
                </p>

                <BookInsight title="The Grand Slam Offer" author="Alex Hormozi" book="$100M Offers" color="#8B5CF6">
                    "The goal is to make an offer so good that people feel stupid saying no.
                    Make the value discrepancy so large that checking out is a no-brainer."
                </BookInsight>

                <ValueEquationVisual />

                <h3 style={{ marginTop: '2rem' }}>Hormozi's 4 Value Variables</h3>
                <p>
                    According to <em>$100M Offers</em>, Value isn't just "good quality". It's a formula.
                    If you want to charge more, you must move these four levers:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
                    <CWCard style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}>
                        <div style={{ color: '#10B981', fontWeight: 800, fontSize: '1.2rem' }}>⬆️ INCREASE</div>
                        <ul style={{ margin: '0.5rem 0 0 1rem', fontSize: '0.9rem' }}>
                            <li><strong>Dream Outcome:</strong> What will their life look like?</li>
                            <li><strong>Likelihood:</strong> How sure are they it will work? (Proof/Guarantees)</li>
                        </ul>
                    </CWCard>
                    <CWCard style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
                        <div style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.2rem' }}>⬇️ DECREASE</div>
                        <ul style={{ margin: '0.5rem 0 0 1rem', fontSize: '0.9rem' }}>
                            <li><strong>Time Delay:</strong> How fast do they get results?</li>
                            <li><strong>Effort & Sacrifice:</strong> How hard must they work?</li>
                        </ul>
                    </CWCard>
                </div>

                <h3>Value vs Friction</h3>
                <p>
                    People buy when the <strong>Value</strong> (what they get) is higher than the <strong>Friction</strong> (price + effort + risk).
                    <br />
                    If you want more sales, you can either:
                </p>
                <ul>
                    <li>Increase the Value (Make it better, faster, tastier)</li>
                    <li>Decrease the Friction (Make it cheaper, easier to buy, guaranteed)</li>
                </ul>

                <OfferScenario />

                <CWCard style={{ marginTop: '2rem' }}>
                    <h4>Draft Your Offer</h4>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <label className="cw-label">What exactly do they get?</label>
                            <CWInput placeholder="e.g. 5 Frozen Meals delivered on Monday" />
                        </div>
                        <div>
                            <label className="cw-label">What is the price?</label>
                            <CWInput placeholder="e.g. R350" />
                        </div>
                        <div>
                            <label className="cw-label">How do you reduce risk?</label>
                            <CWInput placeholder="e.g. Money back guarantee if they don't like it" />
                        </div>
                    </div>
                </CWCard>

                <MiniQuiz questions={moduleCQuizQuestions} title="Offer Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout >
    );
}

// ==========================================
// MODULE D INTERACTIVES
// ==========================================

function CompetitorRadar() {
    const [mode, setMode] = useState('copy'); // 'copy' or 'gap'

    return (
        <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Finding Your "Blue Ocean"</h4>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => setMode('copy')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', border: 'none', background: mode === 'copy' ? '#EF4444' : '#E2E8F0', color: mode === 'copy' ? '#fff' : '#64748B', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>🐑 Copycat</button>
                <button onClick={() => setMode('gap')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', border: 'none', background: mode === 'gap' ? '#10B981' : '#E2E8F0', color: mode === 'gap' ? '#fff' : '#64748B', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', boxShadow: mode === 'gap' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none' }}>🦈 Innovator</button>
            </div>

            <div style={{ height: '240px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="240" height="240" viewBox="0 0 240 240">
                    {/* Radar Grid */}
                    <circle cx="120" cy="120" r="100" fill="#F1F5F9" stroke="#E2E8F0" />
                    <circle cx="120" cy="120" r="70" fill="none" stroke="#E2E8F0" />
                    <circle cx="120" cy="120" r="40" fill="none" stroke="#E2E8F0" />
                    <line x1="120" y1="20" x2="120" y2="220" stroke="#E2E8F0" />
                    <line x1="20" y1="120" x2="220" y2="120" stroke="#E2E8F0" />

                    {/* Labels */}
                    <text x="120" y="15" textAnchor="middle" fontSize="10" fill="#64748B" fontWeight="600">PRICE (High)</text>
                    <text x="120" y="235" textAnchor="middle" fontSize="10" fill="#64748B" fontWeight="600">QUALITY (High)</text>
                    <text x="10" y="125" textAnchor="start" fontSize="10" fill="#64748B" fontWeight="600">SPEED (Fast)</text>
                    <text x="230" y="125" textAnchor="end" fontSize="10" fill="#64748B" fontWeight="600">SERVICE (Best)</text>

                    {/* Competitor Shape (Static) */}
                    <polygon points="120,40 180,120 120,180 60,120" fill="rgba(100, 116, 139, 0.2)" stroke="#64748B" strokeWidth="2" />
                    <text x="120" y="120" textAnchor="middle" dy="5" fontSize="10" fill="#64748B" fontWeight="bold">Them</text>

                    {/* You Shape (Dynamic) */}
                    <polygon
                        points={
                            mode === 'copy'
                                ? "120,45 175,120 120,175 65,120" // Almost same as them
                                : "120,100 120,120 90,200 120,120" // Different spike
                            // Actually properly calculating radar points is hard in svg path string without math, simplifying visual:
                        }
                    // Manual points for clarity:
                    // Copy: Overlaps 'Them' slightly
                    // Gap: Spikes in 'Speed' and 'Service', low on 'Price' (meaning Cheap? No, Price axis usually cost. Let's say we find a gap.)
                    />

                    {/* Simpler Visual: Dots */}
                    {mode === 'copy' ? (
                        <circle cx="125" cy="125" r="40" fill="rgba(239, 68, 68, 0.5)" stroke="#EF4444" style={{ mixBlendMode: 'multiply' }} />
                    ) : (
                        <circle cx="50" cy="120" r="30" fill="rgba(16, 185, 129, 0.5)" stroke="#10B981" style={{ animation: 'pulseGlow 2s infinite' }} />
                    )}
                </svg>
                {mode === 'gap' && (
                    <div style={{ position: 'absolute', top: '100px', left: '25px', background: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #10B981', fontSize: '0.7rem', color: '#065F46', fontWeight: 700 }}>YOUR GAP</div>
                )}
            </div>
            <p style={{ marginTop: '1rem', color: '#64748B', fontSize: '0.9rem' }}>
                {mode === 'copy' ? 'You look exactly like them. Customer chooses the cheapest one. You lose.' : 'You find a gap (e.g. Faster). Customer chooses you for Speed. You win.'}
            </p>

            <h4 style={{ textAlign: 'left', marginTop: '2rem' }}>Strategy: Value Innovation</h4>
            <div style={{ textAlign: 'left', fontSize: '0.95rem', color: '#475569' }}>
                <p>Blue Ocean Strategy teaches us to break the trade-off between value and cost. You do this by asking 4 questions (ERRC):</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.5rem' }}>
                    <li>🔴 <strong>Eliminate:</strong> What industry standards can we just stop doing? (e.g. Cirque du Soleil cut animals).</li>
                    <li>🟡 <strong>Reduce:</strong> What can we do less of?</li>
                    <li>🟢 <strong>Raise:</strong> What must we do <em>better</em> than anyone else?</li>
                    <li>🔵 <strong>Create:</strong> What has never been offered before?</li>
                </ul>
            </div>
        </div>
    );
}

function CompetitorScenario() {
    const [view, setView] = useState('copy');
    return (
        <div style={{ margin: '3rem 0' }}>
            <h4 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Scenario: The Burger Joint</h4>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', background: '#F1F5F9', padding: '0.5rem', borderRadius: '100px', width: 'fit-content', margin: '0 auto 2rem' }}>
                <button onClick={() => setView('copy')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'copy' ? '#fff' : 'transparent', color: view === 'copy' ? '#EF4444' : '#64748B', fontWeight: 800, boxShadow: view === 'copy' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>Burger King Clone</button>
                <button onClick={() => setView('gap')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'gap' ? '#fff' : 'transparent', color: view === 'gap' ? '#10B981' : '#64748B', fontWeight: 800, boxShadow: view === 'gap' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>The "Gourmet" Gap</button>
            </div>
            {view === 'copy' ? (
                <div style={{ padding: '1.5rem', background: '#FEF2F2', borderRadius: '24px', border: '2px solid #FECACA', animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍔</div>
                    <h3 style={{ margin: '0 0 1rem' }}>"Fast Burgers R50"</h3>
                    <p style={{ color: '#64748B' }}>McDonalds is next door selling for R49.</p>
                    <p style={{ color: '#EF4444', fontWeight: 800 }}>Result: You fight on price. You go bankrupt.</p>
                </div>
            ) : (
                <div style={{ padding: '1.5rem', background: '#ECFDF5', borderRadius: '24px', border: '2px solid #A7F3D0', animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🥑</div>
                    <h3 style={{ margin: '0 0 1rem' }}>"Healthy Vegan Burgers R90"</h3>
                    <p style={{ color: '#64748B' }}>No one else sells this here.</p>
                    <p style={{ color: '#10B981', fontWeight: 800 }}>Result: You own the niche. High profit margins.</p>
                </div>
            )}
        </div>
    )
}

export function Pillar1ModuleD({ onNext }) {
    return (
        <InteractiveLayout title="Module D: Competitors" subtitle="Don't be better. Be different.">
            <div className="cw-prose">
                <p className="cw-text-body">
                    You always have competitors. Even if "no one else sells this", your customer is solving the problem somehow (even if it's just ignoring it).
                    <br /><br />
                    <strong>The Goal:</strong> Don't try to beat the big guys at their own game. Find the gap they are missing.
                </p>

                <BookInsight title="Don't Compete" author="W. Chan Kim" book="Blue Ocean Strategy" color="#F59E0B">
                    "Cutthroat competition results in nothing but a bloody ocean.
                    Create a blue ocean of uncontested market space where the competition is irrelevant."
                </BookInsight>

                <CompetitorRadar />

                <h3>Analysis: Types of Competitors</h3>
                <div style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0' }}>
                    <CWCard>
                        <strong>1. Direct Competitors</strong>
                        <p>People selling the exact same thing. (e.g. Another frozen meal company).</p>
                    </CWCard>
                    <CWCard>
                        <strong>2. Indirect Competitors</strong>
                        <p>Different solution to the same problem. (e.g. Buying takeaways, hiring a nanny who cooks).</p>
                    </CWCard>
                    <CWCard>
                        <strong>3. Inertia (Doing Nothing)</strong>
                        <p>The customer just keeps suffering because it's easier than changing. This is your biggest enemy.</p>
                    </CWCard>
                </div>

                <CompetitorScenario />

                <MiniQuiz questions={moduleDQuizQuestions} title="Competitor Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

// ==========================================
// MODULE E INTERACTIVES
// ==========================================

function BusinessModelGraph() {
    const [model, setModel] = useState('service'); // 'service' or 'product'

    return (
        <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Service vs Product Scaling</h4>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => setModel('service')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', border: 'none', background: model === 'service' ? '#3B82F6' : '#E2E8F0', color: model === 'service' ? '#fff' : '#64748B', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>🛠️ Service (Time)</button>
                <button onClick={() => setModel('product')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', border: 'none', background: model === 'product' ? '#8B5CF6' : '#E2E8F0', color: model === 'product' ? '#fff' : '#64748B', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', boxShadow: model === 'product' ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none' }}>📦 Product (Scale)</button>
            </div>

            <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <line x1="0" y1="180" x2="400" y2="180" stroke="#CBD5E1" strokeWidth="2" />
                    <line x1="20" y1="0" x2="20" y2="180" stroke="#CBD5E1" strokeWidth="2" />

                    {/* Linear Line (Service) */}
                    <path
                        d="M 20 180 L 380 50"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="4"
                        style={{ opacity: model === 'service' ? 1 : 0.1, transition: 'all 0.5s' }}
                    />
                    {model === 'service' && <text x="200" y="100" fill="#3B82F6" fontWeight="bold">Capped by Hours</text>}

                    {/* Exponential Line (Product) */}
                    <path
                        d="M 20 180 Q 250 180 380 20"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="6"
                        style={{ opacity: model === 'product' ? 1 : 0.1, transition: 'all 0.5s' }}
                    />
                    {model === 'product' && <text x="250" y="80" fill="#8B5CF6" fontWeight="bold">Uncapped Growth</text>}
                </svg>
            </div>
            <p style={{ marginTop: '1rem', color: '#64748B', fontSize: '0.9rem' }}>
                {model === 'service' ? 'You sell your hours. To make more money, you must work more hours.' : 'You sell a system/product. You build it once, sell it a million times.'}
            </p>
        </div>
    );
}

function ModelScenario() {
    const [view, setView] = useState('service');
    return (
        <div style={{ margin: '3rem 0' }}>
            <h4 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Scenario: The Cleaning Biz</h4>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', background: '#F1F5F9', padding: '0.5rem', borderRadius: '100px', width: 'fit-content', margin: '0 auto 2rem' }}>
                <button onClick={() => setView('service')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'service' ? '#fff' : 'transparent', color: view === 'service' ? '#3B82F6' : '#64748B', fontWeight: 800, boxShadow: view === 'service' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>The Cleaner</button>
                <button onClick={() => setView('product')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'product' ? '#fff' : 'transparent', color: view === 'product' ? '#8B5CF6' : '#64748B', fontWeight: 800, boxShadow: view === 'product' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>The Agency</button>
            </div>
            {view === 'service' ? (
                <div style={{ padding: '1.5rem', background: '#EFF6FF', borderRadius: '24px', border: '2px solid #BFDBFE', animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧹</div>
                    <h3 style={{ margin: '0 0 1rem' }}>"I clean houses"</h3>
                    <p style={{ color: '#64748B' }}>Time: 8 hours/day. Max clients: 2.</p>
                    <p style={{ color: '#3B82F6', fontWeight: 800 }}>Income Limit: R20,000/month.</p>
                </div>
            ) : (
                <div style={{ padding: '1.5rem', background: '#F5F3FF', borderRadius: '24px', border: '2px solid #DDD6FE', animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
                    <h3 style={{ margin: '0 0 1rem' }}>"I manage 10 cleaners"</h3>
                    <p style={{ color: '#64748B' }}>Time: 8 hours/day management.</p>
                    <p style={{ color: '#8B5CF6', fontWeight: 800 }}>Income Limit: Unlimited (Scale to 100 cleaners).</p>
                </div>
            )}
        </div>
    )
}

export function Pillar1ModuleE({ onNext }) {
    return (
        <InteractiveLayout title="Module E: Business Model" subtitle="How does the money actually flow?">
            <div className="cw-prose">
                <p className="cw-text-body">
                    A business model is just a fancy way of saying: "How do we make money?".
                    Don't reinvent the wheel. Pick a standard model that works.
                </p>

                <BookInsight title="The Entrepreneurial Seizure" author="Michael Gerber" book="The E-Myth Revisited" color="#EC4899">
                    "If your business depends on you, you don't own a business—you own a job.
                    And it's the worst job in the world because you work for a lunatic. Build systems that work without you."
                </BookInsight>

                <h3 style={{ marginTop: '2rem' }}>The 3 Personalities in You</h3>
                <p>
                    Gerber explains that every founder is actually three people fighting for control:
                </p>
                <div style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '2rem', background: '#F1F5F9', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>🛠️</div>
                        <div>
                            <strong>The Technician</strong>
                            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Lives in the Present. "I do the work." (70% of your time initially).</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '2rem', background: '#F1F5F9', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>📊</div>
                        <div>
                            <strong>The Manager</strong>
                            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Lives in the Past. "I organize the work and clean up the mess."</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '2rem', background: '#F1F5F9', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>🚀</div>
                        <div>
                            <strong>The Entrepreneur</strong>
                            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Lives in the Future. "I dream of what this could be."</div>
                        </div>
                    </div>
                </div>
                <p><strong>Fatal Error:</strong> Most businesses are started by Technicians (e.g. a baker) who just want to bake, ignoring the Manager and Entrepreneur roles.</p>

                <BusinessModelGraph />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <CWCard>
                        <CWBadge status="info">SERVICE</CWBadge>
                        <h4 style={{ marginTop: '0.5rem' }}>Selling Time</h4>
                        <p style={{ fontSize: '0.9rem' }}>You do work for a client. Consulting, Cleaning, Repairs.</p>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}><strong>Good:</strong> Easy to start. Low cost.<br /><strong>Bad:</strong> Hard to scale (you only have 24 hours).</p>
                    </CWCard>
                    <CWCard>
                        <CWBadge status="brand">PRODUCT</CWBadge>
                        <h4 style={{ marginTop: '0.5rem' }}>Selling Things</h4>
                        <p style={{ fontSize: '0.9rem' }}>You make or buy an item and sell it. Food, Clothes, Crafts.</p>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}><strong>Good:</strong> Scalable.<br /><strong>Bad:</strong> Inventory costs money.</p>
                    </CWCard>
                </div>

                <ModelScenario />

                <MiniQuiz questions={moduleEQuizQuestions} title="Model Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

// ==========================================
// QUIZ (WIZARD STYLE - One Question at a Time)
// ==========================================

export function Pillar1Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
    // Local state for the wizard step
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleNext = () => {
        if (currentQuestionIndex < pillar1QuizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const currentQuestion = pillar1QuizQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === pillar1QuizQuestions.length - 1;
    const hasAnsweredCurrent = quizResponses[currentQuestionIndex] !== undefined;
    const isPassed = scoreMessage && scoreMessage.includes('Pass');

    return (
        <QuizLayout
            title="Knowledge Check"
            currentStep={currentQuestionIndex + 1}
            totalSteps={pillar1QuizQuestions.length}
        >
            <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CWCard style={{ width: '100%', maxWidth: '600px', textAlign: 'left', padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                        {currentQuestion.question}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {currentQuestion.options.map((option, optIndex) => (
                            <label key={optIndex} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                borderRadius: 'var(--cw-radius-md)',
                                border: '2px solid',
                                borderColor: quizResponses[currentQuestionIndex] === optIndex ? '#000' : '#E5E7EB',
                                cursor: 'pointer',
                                background: quizResponses[currentQuestionIndex] === optIndex ? '#F9FAFB' : '#fff',
                                transition: 'all 0.2s ease'
                            }}>
                                <input
                                    type="radio"
                                    name={'q-' + currentQuestionIndex}
                                    checked={quizResponses[currentQuestionIndex] === optIndex}
                                    onChange={() => onSelect(currentQuestionIndex, optIndex)}
                                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'black' }}
                                />
                                <span style={{ fontSize: '1.05rem', fontWeight: quizResponses[currentQuestionIndex] === optIndex ? 600 : 400 }}>
                                    {option}
                                </span>
                            </label>
                        ))}
                    </div>
                </CWCard>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <CWButton
                    variant="secondary"
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    style={{
                        opacity: currentQuestionIndex === 0 ? 0 : 1,
                        pointerEvents: currentQuestionIndex === 0 ? 'none' : 'auto',
                        minWidth: '120px',
                        justifyContent: 'center'
                    }}
                >
                    ← Back
                </CWButton>

                {!isLastQuestion ? (
                    <CWButton
                        onClick={handleNext}
                        disabled={!hasAnsweredCurrent}
                        variant="primary"
                        style={{ minWidth: '160px', justifyContent: 'center' }}
                    >
                        Next Question →
                    </CWButton>
                ) : (
                    !isPassed && (
                        <CWButton
                            onClick={onScore}
                            disabled={!hasAnsweredCurrent}
                            variant="primary"
                            style={{
                                backgroundColor: '#10B981',
                                borderColor: '#10B981',
                                minWidth: '160px',
                                justifyContent: 'center',
                                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                            }}
                        >
                            See Results
                        </CWButton>
                    )
                )}
            </div>

            {scoreMessage !== 'Not checked yet.' && (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <CWAlert type={isPassed ? 'success' : 'error'}>
                        {scoreMessage}
                    </CWAlert>
                    {isPassed && onFinish && (
                        <CWButton
                            variant="primary"
                            style={{ marginTop: '1.5rem', minWidth: '200px', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem 2rem' }}
                            onClick={onFinish}
                        >
                            Finish Pillar 1 →
                        </CWButton>
                    )}
                </div>
            )}
        </QuizLayout>
    );
}

export function Pillar1Completion() {
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
    const [status, setStatus] = useState('idle'); // idle, submitting, success

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        // 1. Send to Google Sheet (Placeholder)
        const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; // TODO: User to specific their own script URL

        try {
            // Using no-cors mode for simple clear forms if needed, but standard POST usually requires enabling CORS on script.
            // Simulating success for now:
            await new Promise(resolve => setTimeout(resolve, 1500));

            /* Real Implementation:
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(form)
            });
            */

            setStatus('success');
            downloadSummary();
        } catch (err) {
            console.error('Error', err);
            setStatus('success'); // Fallback to success to allow download anyway
            downloadSummary();
        }
    };

    const downloadSummary = () => {
        const content = [
            'CAPEWEB UNIVERSITY - PILLAR 1 PASSPORT',
            '======================================',
            'Generated for: ' + form.firstName + ' ' + form.lastName,
            'Date: ' + new Date().toLocaleDateString(),
            '',
            'Congratulations on completing Pillar 1: Validation!',
            '',
            'KEY CONCEPTS MASTERED:',
            '----------------------',
            '1. The Founder Routine: Systems > Goals. (Atomic Habits)',
            '2. The Sniper Principle: Target a specific niche. (This is Marketing)',
            '3. The Irresistible Offer: Value > Friction. ($100M Offers)',
            '4. The Blue Ocean: Don\'t compete, differentiate. (Zero to One)',
            '5. The Money Engine: Build a machine, not a job. (The E-Myth)',
            '',
            'RECOMMENDED READING LIST:',
            '-------------------------',
            '- Atomic Habits by James Clear',
            '- This is Marketing by Seth Godin',
            '- $100M Offers by Alex Hormozi',
            '- Zero to One by Peter Thiel',
            '- The E-Myth Revisited by Michael Gerber',
            '- Profit First by Mike Michalowicz',
            '',
            'YOUR NEXT STEP:',
            '---------------',
            'Pillar 2: Legal & Compliance.',
            'Now that you have a plan, let\'s make it legitimate.',
            '',
            'CapeWeb University © ' + new Date().getFullYear()
        ].join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CapeWeb_Pillar1_Passport_' + form.firstName + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (status === 'success') {
        return (
            <ReadingLayout title="Pillar 1 Complete!">
                <CWCard style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                    <h2 className="cw-heading-md">Passport Issued!</h2>
                    <p style={{ color: 'var(--cw-text-secondary)', margin: '1rem 0' }}>
                        Your summary has been downloaded. Welcome to the alumni network, {form.firstName}.
                    </p>
                    <CWButton variant="primary" onClick={() => window.location.reload()}>Next Pillar (Coming Soon)</CWButton>
                </CWCard>
            </ReadingLayout>
        );
    }

    return (
        <ReadingLayout title="Pillar 1 Complete!">
            <CWCard style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
                    <h2 className="cw-heading-md">You Did It!</h2>
                    <p style={{ color: 'var(--cw-text-secondary)' }}>
                        You've completed the Validation Pillar. Claim your summary and reading list below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="cw-label">First Name</label>
                            <CWInput
                                required
                                value={form.firstName}
                                onChange={e => setForm({ ...form, firstName: e.target.value })}
                                placeholder="e.g. Thabo"
                            />
                        </div>
                        <div>
                            <label className="cw-label">Last Name</label>
                            <CWInput
                                required
                                value={form.lastName}
                                onChange={e => setForm({ ...form, lastName: e.target.value })}
                                placeholder="e.g. Molefe"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="cw-label">Email Address</label>
                        <CWInput
                            required
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div style={{ background: '#F0F9FF', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#0369A1', border: '1px solid #BAE6FD' }}>
                        <strong>🎁 Includes:</strong>
                        <ul style={{ margin: '0.5rem 0 0 1.2rem' }}>
                            <li>Full Pillar 1 Summary PDF (Text version)</li>
                            <li>Curated "Founder's Library" Book List</li>
                            <li>CapeWeb University Alumni Status</li>
                        </ul>
                    </div>

                    <CWButton
                        type="submit"
                        variant="primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                        disabled={status === 'submitting'}
                    >
                        {status === 'submitting' ? 'Generating...' : 'Download My Summary & Finish'}
                    </CWButton>
                </form>
            </CWCard>
        </ReadingLayout>
    );
}
