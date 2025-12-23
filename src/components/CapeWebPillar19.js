import React, { useState, useEffect, useRef } from 'react';
import { InteractiveLayout, QuizLayout, ReadingLayout } from './CapeWebLayouts';
import { CWButton, CWCard, CWAlert, BookInsight, CWBadge } from './CapeWebUI';
import { pillar19QuizQuestions } from '../data/pillarLibrary';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';

// ==========================================
// INTERNAL HELPERS
// ==========================================

function MiniQuiz({ questions, title = "Knowledge Check", onNext }) {
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [celebrating, setCelebrating] = useState(false);
    const counterRef = useRef(null);

    const question = questions[currentQ];
    const isLast = currentQ === questions.length - 1;

    const playSuccessSound = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch (e) { console.error("Audio error", e); }
    };

    const handleNext = () => {
        const isCorrect = selected === question.correctIndex;
        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);

        if (isLast) {
            setCompleted(true);
            if (Math.round((newScore / questions.length) * 100) >= 70) {
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

    useEffect(() => {
        if (celebrating && counterRef.current) {
            const percentage = Math.round((score / questions.length) * 100);
            const tl = gsap.timeline();
            counterRef.current.classList.remove('celebrate');
            tl.set(counterRef.current, { opacity: 1 })
                .fromTo(counterRef.current, { innerText: 0, scale: 0.8 }, {
                    innerText: percentage, duration: 3, snap: { innerText: 1 }, ease: "linear",
                    onUpdate: function () { counterRef.current.innerHTML = Math.ceil(this.targets()[0].innerText) + "%"; },
                    onComplete: () => {
                        const runConfetti = confettiModule.default || confettiModule;
                        if (typeof runConfetti === 'function') runConfetti({ particleCount: 150, spread: 100, origin: { y: 0.8 }, disableForReducedMotion: true });
                        setTimeout(() => setCelebrating(false), 3000);
                    }
                })
                .to(counterRef.current, { scale: 1, duration: 1.2, ease: "elastic.out(1, 0.2)" });
        }
    }, [celebrating, score, questions.length]);

    if (celebrating) return <div style={{ padding: '3rem', fontSize: '5rem', textAlign: 'center', background: '#fff', borderRadius: '24px' }}><h1 ref={counterRef}>0%</h1></div>;

    if (completed) {
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 70;
        return (
            <div style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center', borderRadius: '24px', background: passed ? '#D1FAE5' : '#FEE2E2' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{passed ? '🎉' : '📚'}</div>
                <h3 style={{ fontSize: '2rem', color: passed ? '#065F46' : '#991B1B' }}>{passed ? 'Great Job!' : 'Keep Learning!'}</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>You scored {percentage}%</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                    <CWButton onClick={handleRestart} variant={passed ? "secondary" : "primary"}>{passed ? 'Retake' : 'Try Again'}</CWButton>
                    {passed && onNext && <CWButton onClick={onNext} variant="primary">Next Module →</CWButton>}
                </div>
            </div>
        );
    }

    return (
        <div style={{
            marginTop: '3rem',
            padding: '2.5rem',
            borderRadius: '24px',
            background: '#FDE047', // Yellow-300
            color: '#422006', // Yellow-950
            position: 'relative',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{
                    background: '#fff',
                    color: '#0EA5E9', // Sky Blue text
                    padding: '0.4rem 1rem',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    ASSESSMENT
                </span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem', opacity: 0.8 }}>Question {currentQ + 1} of {questions.length}</span>
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.2' }}>{title}</h3>
            <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '2rem' }}>{question.question}</p>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2.5rem' }}>
                {question.options.map((option, index) => (
                    <button key={index} onClick={() => setSelected(index)}
                        style={{
                            padding: '1.25rem 2rem',
                            borderRadius: '100px', // Full Pill
                            border: selected === index ? '2px solid #0EA5E9' : 'none',
                            background: '#fff',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontSize: '1rem',
                            fontWeight: '500',
                            color: '#1F2937',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: '2px solid #D1D5DB',
                            background: selected === index ? '#0EA5E9' : 'transparent',
                            borderColor: selected === index ? '#0EA5E9' : '#D1D5DB',
                            flexShrink: 0
                        }}></div>
                        {option}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleNext} disabled={selected === null}
                    style={{
                        background: '#713F12', // Dark Olive/Brown
                        color: '#fff',
                        padding: '1rem 2rem',
                        borderRadius: '100px',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '1rem',
                        cursor: selected === null ? 'not-allowed' : 'pointer',
                        opacity: selected === null ? 0.5 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                    {isLast ? 'Finish Assessment' : 'Next Question'} <span>➔</span>
                </button>
            </div>
        </div>
    );
}

// Global "Why This Matters" Component (Pink)
function WhyBusinessMatters({ intro, points, capeWebCards }) {
    return (
        <div style={{
            background: '#FDF2F8', // Pink-50
            borderRadius: '24px',
            padding: '2.5rem',
            margin: '3rem 0',
            color: '#831843' // Pink-900
        }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', marginBottom: '1.5rem', color: '#0F172A' }}>
                <span>🧠</span> Why This Matters for Business Owners
            </h3>

            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#334155', marginBottom: '2.5rem' }}>
                {intro}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                {points.map((p, i) => (
                    <div key={i}>
                        <h4 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '0.5rem' }}>{i + 1}. {p.title}</h4>
                        <p style={{ color: '#475569', lineHeight: '1.5' }}>{p.text}</p>
                    </div>
                ))}
            </div>

            <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 10px 30px -5px rgba(253, 242, 248, 0.8), 0 4px 6px -2px rgba(0,0,0,0.05)'
            }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem' }}>
                    <span>🚀</span> How CapeWeb Helps You Scale
                </h4>
                <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>{capeWebCards.intro}</p>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {capeWebCards.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <span style={{ color: '#EC4899', fontWeight: 'bold', fontSize: '1.2rem', lineHeight: '1' }}>➔</span>
                            <p style={{ margin: 0, color: '#334155', lineHeight: '1.5' }}>
                                <strong style={{ color: '#0F172A' }}>{item.title}:</strong> {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// INTERACTIVE COMPONENTS (Pillar 19)
// ==========================================

function ValuationInteractive() {
    const [profit, setProfit] = useState(500000);
    const [systems, setSystems] = useState(1);
    const [recurring, setRecurring] = useState(10);

    const multiple = (2.0 + (systems * 0.4) + (recurring / 100 * 1.5)).toFixed(2);
    const valuation = (profit * multiple).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 });

    return (
        <div style={{
            margin: '3rem 0',
            padding: '2rem',
            borderRadius: '24px',
            background: '#0F172A',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.3)'
        }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(15,23,42,1) 70%)', animation: 'pulseSlow 10s infinite' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>The Valuation Calculator</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94A3B8' }}>Annual Net Profit (SDE)</label>
                            <input type="range" min="100000" max="5000000" step="50000" value={profit} onChange={(e) => setProfit(Number(e.target.value))} style={{ width: '100%' }} />
                            <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.2rem', marginTop: '0.5rem' }}>{profit.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 })}</div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94A3B8' }}>Owner Irrelevance (Systems)</label>
                            <input type="range" min="0" max="5" step="1" value={systems} onChange={(e) => setSystems(Number(e.target.value))} style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94A3B8' }}>Recurring Revenue %</label>
                            <input type="range" min="0" max="100" step="10" value={recurring} onChange={(e) => setRecurring(Number(e.target.value))} style={{ width: '100%' }} />
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '1rem', color: '#94A3B8', marginBottom: '0.5rem' }}>ESTIMATED EXIT VALUE</div>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#10B981' }}>{valuation}</div>
                        <div style={{ marginTop: '1rem', display: 'inline-block', padding: '0.5rem 1rem', background: '#334155', borderRadius: '8px', fontSize: '0.9rem' }}>
                            Your Multiple: <strong style={{ color: '#fff' }}>{multiple}x</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ValuationScenario() {
    const [view, setView] = useState('thabo');
    return (
        <div style={{ margin: '3rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: '100px', padding: '0.5rem', background: '#fff', width: 'fit-content', margin: '0 auto 2rem' }}>
                <button onClick={() => setView('thabo')} style={{ padding: '0.8rem 2rem', borderRadius: '100px', border: 'none', background: view === 'thabo' ? '#EF4444' : 'transparent', color: view === 'thabo' ? '#fff' : '#64748B', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>Thabo's Agency</button>
                <button onClick={() => setView('sarah')} style={{ padding: '0.8rem 2rem', borderRadius: '100px', border: 'none', background: view === 'sarah' ? '#10B981' : 'transparent', color: view === 'sarah' ? '#fff' : '#64748B', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>Sarah's Agency</button>
            </div>
            <div style={{ background: view === 'thabo' ? '#FEF2F2' : '#EFFDF5', border: view === 'thabo' ? '2px solid #FCA5A5' : '2px solid #6EE7B7', borderRadius: '24px', padding: '2rem' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: view === 'thabo' ? '#991B1B' : '#065F46' }}>{view === 'thabo' ? "The 'Key Person' Trap" : "The 'Turnkey' Machine"}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
                            {[
                                { icon: '💰', label: 'Profit', val: 'R1,000,000', note: 'Same Profit' },
                                { icon: '⏰', label: 'Owner Role', val: view === 'thabo' ? 'Does sales, ops & delivery' : 'Focuses on strategy only', note: view === 'thabo' ? 'Problem!' : 'Good!' },
                                { icon: '⚙️', label: 'Systems', val: view === 'thabo' ? 'In his head' : 'Documented SOPS', note: '' },
                                { icon: '📉', label: 'Risk to Buyer', val: view === 'thabo' ? 'EXTREME (If Thabo leaves, revenue stops)' : 'LOW (Business runs itself)', note: '' }
                            ].map((item, i) => (
                                <li key={i} style={{ background: '#fff', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                                    <div><div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94A3B8' }}>{item.label}</div><div style={{ fontWeight: 700, color: '#1E293B' }}>{item.val}</div></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '16px', padding: '2rem' }}>
                        <div style={{ fontSize: '1rem', color: '#64748B', marginBottom: '0.5rem' }}>BUSINESS VALUE</div>
                        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: view === 'thabo' ? '#DC2626' : '#059669' }}>{view === 'thabo' ? 'R1.5m' : 'R4.0m'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DelegationMatrixInteractive() {
    const [tasks, setTasks] = useState([
        { id: 1, name: 'Sales Calls', owner: 'you' },
        { id: 2, name: 'Invoicing', owner: 'you' },
        { id: 3, name: 'Making Coffee', owner: 'you' },
        { id: 4, name: 'Strategy', owner: 'you' } // Strategy stays with you
    ]);

    const moveTask = (id, target) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, owner: target } : t));
    };

    const delegatedCount = tasks.filter(t => t.owner === 'system').length;
    const freedomScore = delegatedCount * 25; // 4 tasks

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#8B5CF6', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>The Delegation Matrix</h3>
                <p style={{ marginBottom: '2rem', opacity: 0.9 }}>Click tasks to move them from <strong>You</strong> to a <strong>System</strong>.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem', border: '2px dashed rgba(255,255,255,0.2)' }}>
                        <h4 style={{ marginBottom: '1rem' }}>😰 You (The Bottleneck)</h4>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {tasks.filter(t => t.owner === 'you').map(t => (
                                <button key={t.id} onClick={() => moveTask(t.id, 'system')}
                                    style={{ background: '#fff', color: '#6D28D9', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {t.name} <span>➜</span>
                                </button>
                            ))}
                            {tasks.filter(t => t.owner === 'you').length === 0 && <div style={{ opacity: 0.5, fontStyle: 'italic' }}>Nothing left! You are free!</div>}
                        </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '1.5rem', border: '2px solid rgba(255,255,255,0.4)' }}>
                        <h4 style={{ marginBottom: '1rem' }}>⚙️ The Machine (Systems/Staff)</h4>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {tasks.filter(t => t.owner === 'system').map(t => (
                                <button key={t.id} onClick={() => moveTask(t.id, 'you')}
                                    style={{ background: '#10B981', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {t.name} <span>✅</span>
                                </button>
                            ))}
                            {tasks.filter(t => t.owner === 'system').length === 0 && <div style={{ opacity: 0.5, fontStyle: 'italic' }}>Empty. Drag tasks here.</div>}
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '100px', display: 'inline-block' }}>
                    Freedom Score: <strong>{freedomScore}%</strong> {freedomScore === 100 ? '🎉 CEO Status' : freedomScore > 0 ? '🛠️ Building...' : '😰 Employee Status'}
                </div>
            </div>
        </div>
    );
}

function DueDiligenceInteractive() {
    const [round, setRound] = useState(0);
    const [offer, setOffer] = useState(5000000); // Start at R5m
    const [logs, setLogs] = useState([]);

    const steps = [
        { title: "Financials", q: "The buyer asks for your accounts. You provide:", good: { label: "Audited Financials", val: 0, text: "Trust maintained." }, bad: { label: "Excel Spreadsheet", val: -1000000, text: "Risk detected. Price drops R1m." } },
        { title: "Contracts", q: "The buyer checks your biggest client. You have:", good: { label: "Signed 12-month Contract", val: 500000, text: "Value verified. Price +R500k." }, bad: { label: "Handshake Agreement", val: -2000000, text: "Major Risk! They might leave. Price -R2m." } },
        { title: "IP Rights", q: "The buyer checks your logo and code. Use show:", good: { label: "Registered Trademark", val: 0, text: "Clean." }, bad: { label: "No documentation", val: -500000, text: "Legal risk. Price -R500k." } }
    ];

    const handleChoice = (isGood) => {
        const currentCheck = steps[round];
        const change = isGood ? currentCheck.good.val : currentCheck.bad.val;
        const msg = isGood ? currentCheck.good.text : currentCheck.bad.text;

        setOffer(offer + change);
        setLogs(prev => [...prev, msg]);

        if (round < 2) {
            setRound(round + 1);
        } else {
            setRound(3); // Finished
        }
    };

    const reset = () => {
        setRound(0);
        setOffer(5000000);
        setLogs([]);
    };

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#2563EB', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Due Diligence Simulator</h3>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '2rem' }}>Can your business survive the audit?</div>

                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Current Offer</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{offer.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 })}</div>
                </div>

                {round < 3 ? (
                    <div style={{ background: '#fff', color: '#1E293B', padding: '2rem', borderRadius: '16px' }}>
                        <div style={{ textTransform: 'uppercase', color: '#64748B', fontSize: '0.8rem', fontWeight: 800 }}>Audit Round {round + 1}/3: {steps[round].title}</div>
                        <h4 style={{ fontSize: '1.4rem', margin: '1rem 0' }}>{steps[round].q}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button onClick={() => handleChoice(true)} style={{ padding: '1rem', borderRadius: '12px', background: '#DCFCE7', color: '#14532D', border: '2px solid #86EFAC', fontWeight: 700, cursor: 'pointer' }}>{steps[round].good.label}</button>
                            <button onClick={() => handleChoice(false)} style={{ padding: '1rem', borderRadius: '12px', background: '#FEE2E2', color: '#7F1D1D', border: '2px solid #FCA5A5', fontWeight: 700, cursor: 'pointer' }}>{steps[round].bad.label}</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: '#fff', color: '#1E293B', padding: '2rem', borderRadius: '16px' }}>
                        <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Audit Complete</h4>
                        <p>Final Deal Value: <strong>{offer.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 })}</strong></p>
                        <p style={{ color: '#444' }}>{offer < 5000000 ? "You lost value because your paperwork was messy." : "Great job! Clean paperwork protects value."}</p>
                        <button onClick={reset} style={{ padding: '0.8rem 1.5rem', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 700 }}>Try Again</button>
                    </div>
                )}
            </div>
        </div>
    );
}

function ExitScenario() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '3rem 0' }}>
            <CWCard>
                <h4 style={{ color: '#DC2626', marginBottom: '1rem' }}>⚠️ The Handshake Deal</h4>
                <p style={{ fontSize: '0.9rem', color: '#475569' }}>John agrees to sell for R2m over lunch. He stops looking for other buyers. 3 months later, the buyer ghosts him.</p>
                <div style={{ padding: '0.5rem', background: '#FEF2F2', color: '#991B1B', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center' }}>Result: Wasted 3 months.</div>
            </CWCard>
            <CWCard>
                <h4 style={{ color: '#059669', marginBottom: '1rem' }}>✅ The Letter of Intent (LOI)</h4>
                <p style={{ fontSize: '0.9rem', color: '#475569' }}>Sarah gets a signed LOI with an "Exclusive Period". She gets a deposit. The lawyer drafts the Sale Agreement.</p>
                <div style={{ padding: '0.5rem', background: '#ECFDF5', color: '#065F46', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center' }}>Result: Protected Process.</div>
            </CWCard>
        </div>
    );
}

// Module Quizzes
const moduleA19QuizQuestions = [
    { question: 'What is SDE (Seller Discretionary Earnings)?', options: ['Just the net profit in the bank', 'Profit + Owner Salary + Personal Expenses paid by business', 'The total revenue'], correctIndex: 1 },
    { question: 'What is the biggest factor that kills your valuation multiple?', options: ['Having too many employees', 'Owner Dependency (The business needs YOU to run)', 'Spending money on marketing'], correctIndex: 1 },
    { question: 'If two businesses make the same profit, why would one sell for 3x more?', options: ['Better Logo', 'Lower Risk (Systems, Recurring Revenue, Consistency)', 'The owner is nicer'], correctIndex: 1 },
    { question: 'What is the "Valuation Trap"?', options: ['Selling too early', 'Building a job for yourself instead of an asset', 'Not paying taxes'], correctIndex: 1 },
];

const moduleB19QuizQuestions = [
    { question: 'What is the specific goal of a "System"?', options: ['To make work more complicated', 'To allow ordinary people to produce extraordinary results consistently', 'To replace all humans with robots'], correctIndex: 1 },
    { question: 'The "Delegation Matrix" teaches us to:', options: ['Do everything ourselves to save money', 'Move tasks from "Owner" to "System" to increase value', 'Hire the cheapest staff possible'], correctIndex: 1 },
    { question: 'Which book popularized the "Franchise Prototype" concept?', options: ['Atomic Habits', 'The E-Myth Revisited', 'Rich Dad Poor Dad'], correctIndex: 1 },
    { question: 'A business that relies 100% on the owner is:', options: ['Highly valuable', 'Unsellable (It is just a job)', 'A fast growing startup'], correctIndex: 1 },
];

const moduleC19QuizQuestions = [
    { question: 'What is "Due Diligence"?', options: ['A friendly coffee chat', 'A rigorous audit where the buyer verifies every claim you made', 'The negotiation of the price'], correctIndex: 1 },
    { question: 'Why is a "Handshake Deal" dangerous?', options: ['It spreads germs', 'It is not legally binding, and the buyer can walk away after wasting your time', 'It is rude'], correctIndex: 1 },
    { question: 'What is a "Data Room"?', options: ['A server room in your office', 'A secure online folder containing all your legal, financial, and tax documents', 'A chat room for staff'], correctIndex: 1 },
    { question: 'Who usually knows more about the business during a sale?', options: ['The Buyer', 'The Seller (Information Asymmetry)', 'The Lawyer'], correctIndex: 1 },
];

// ==========================================
// EXPORTED MODULES
// ==========================================

export function Pillar19ModuleA({ onNext }) {
    return (
        <InteractiveLayout title="Module A: Valuation" subtitle="From Income to Wealth">
            <div className="cw-prose">
                <p>Most entrepreneurs focus on <strong>Income</strong> (Salary). Real wealth comes from <strong>Equity</strong> (Selling the asset). <br />But you can only sell your business if it works <em>without you</em>.</p>
                <BookInsight title="The Freedom Paradox" author="John Warrillow" book="Built to Sell" color="#10B981">
                    "If your business can't survive without you, you don't have a business—you have a job. And the only way to get out of a job is to quit."
                </BookInsight>

                <h3>Core Concept: The Multiple</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '2rem 0' }}>
                    <CWCard><strong>SDE (Earnings)</strong><div style={{ fontSize: '0.9rem', color: '#64748B' }}>Profit + Owner Add-backs</div></CWCard>
                    <CWCard><strong>The Multiple</strong><div style={{ fontSize: '0.9rem', color: '#64748B' }}>Multiplier based on System Quality</div></CWCard>
                </div>

                <h3>Interactive: What is your exit number?</h3>
                <ValuationInteractive />

                <h3 style={{ marginTop: '4rem' }}>Scenario: Tale of Two Agencies</h3>
                <ValuationScenario />

                <CWAlert type="info" title="Activity: The Replacement Audit">
                    1. List every task you did this week.<br />2. Circle the ones that <strong>ONLY YOU</strong> can do.<br />3. Your goal: Create a System to remove circles.
                </CWAlert>

                <WhyBusinessMatters
                    intro="A high valuation protects you. Even if you don't sell, 'building to sell' gives you the best lifestyle."
                    points={[
                        { title: "The Multiple Effect", text: "Every R1 of profit adds R3-R5 to your exit price. Cutting expenses isn't just saving cash; it's building wealth." },
                        { title: "The Replaceability Test", text: "If the business stops when you stop, it's worth R0. Valuation is a measure of how irrelevant you are." }
                    ]}
                    capeWebCards={{
                        intro: "We build assets, not just websites.",
                        items: [
                            { title: "Asset Building", text: "We create digital assets that add tangible book value to your company audit." },
                            { title: "Automated Lead Gen", text: "Our systems ensure revenue flows even when you sleep, boosting your Recurring Revenue score." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleA19QuizQuestions} title="Valuation Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar19ModuleB({ onNext }) {
    return (
        <InteractiveLayout title="Module B: Building to Sell" subtitle="Systems over Solo">
            <div className="cw-prose">
                <p>If you are the business, nobody will buy it. You need systems that run without you. This is the difference between a "Practice" (Doctor/Lawyer) and a "Business" (Hospital/Firm).</p>

                <BookInsight title="The Franchise Prototype" author="Michael Gerber" book="The E-Myth Revisited" color="#8B5CF6">
                    "The system must be able to provide the intended results every time... It must be designed to be operated by people with the lowest possible level of skill."
                </BookInsight>

                <h3>Core Concept: The Manual</h3>
                <p>Great businesses are run by ordinary people using extraordinary systems. Your goal is to move knowledge from your brain into a manual (SOPs).</p>

                <h3>Interactive: The Delegation Matrix</h3>
                <DelegationMatrixInteractive />

                <h3>Scenario: The Baker's Burnout</h3>
                <CWCard>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '2rem' }}>🧑‍🍳</div>
                        <div>
                            <strong>Baker A (The Artist):</strong> Wakes up at 3am. Bakes the best bread. If he gets sick, the shop closes. <span style={{ color: '#EF4444' }}>Value: Low.</span>
                        </div>
                    </div>
                </CWCard>
                <div style={{ height: '1rem' }} />
                <CWCard>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '2rem' }}>🏭</div>
                        <div>
                            <strong>Baker B (The Entrepreneur):</strong> Wrote down the recipe. Hired students to bake. Inspects quality once a week. <span style={{ color: '#10B981' }}>Value: High.</span>
                        </div>
                    </div>
                </CWCard>

                <WhyBusinessMatters
                    intro="Systems are the only way to scale without exploding."
                    points={[
                        { title: "Scalability", text: "You cannot scale yourself. You have 24 hours. A system can appear in 100 locations at once." },
                        { title: "Peace of Mind", text: "Systems don't call in sick, don't have bad days, and don't ask for a raise." }
                    ]}
                    capeWebCards={{
                        intro: "We allow you to automate the sales conversation.",
                        items: [
                            { title: "Sales Systems", text: "Our websites act as your best salesperson, repeating your perfect pitch 24/7 without error." },
                            { title: "Integration", text: "We connect your site to CRM and Email systems so leads are nurtured automatically." }
                        ]
                    }}
                />

                <CWAlert type="info" title="Activity: The SOP Challenge">
                    Pick ONE task you do daily. Record a loom video of yourself doing it. Write 3 bullet points. Give it to someone else to try.
                </CWAlert>

                <MiniQuiz questions={moduleB19QuizQuestions} title="Systems Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar19ModuleC({ onNext }) {
    return (
        <InteractiveLayout title="Module C: The Exit Process" subtitle="Getting Acquired">
            <div className="cw-prose">
                <p>The day you sell is the day you get paid for all the years of hard work. But getting acquired is not an event, it is a brutal process.</p>

                <BookInsight title="The Finish Line" author="Bo Burlingham" book="Finish Big" color="#2563EB">
                    "Most business owners have no idea what their business is worth or how to sell it until it is too late."
                </BookInsight>

                <h3>Core Concept: Information Asymmetry</h3>
                <p>The buyer often knows more about deal-making than you do. They will look for any excuse to lower the price. This is why you need to be prepared.</p>

                <h3>Interactive: The Due Diligence Simulator</h3>
                <DueDiligenceInteractive />

                <h3>Scenario: Handshake vs Contract</h3>
                <ExitScenario />

                <WhyBusinessMatters
                    intro="Your 'Exit' turns paper wealth into real wealth (Liquidity)."
                    points={[
                        { title: "Liquidity", text: "A business on paper pays no bills. Selling releases capital for your next phase of life." },
                        { title: "Legacy", text: "Ensuring your business survives without you is the ultimate act of leadership." }
                    ]}
                    capeWebCards={{
                        intro: "We ensure you pass the 'Tech Due Diligence' with flying colors.",
                        items: [
                            { title: "Clean IP", text: "We transfer all copyright and code ownership to you, so there are no legal blockers during sale." },
                            { title: "Data Room Ready", text: "Our analytics and CRM records provide the 'Proof of Data' that buyers demand." }
                        ]
                    }}
                />

                <CWAlert type="info" title="Activity: The Data Room Start">
                    Create a Google Drive folder called 'Exit'. <br />Put your Incorporation Docs, Last 3 Years Financials, and Lease Agreement in it. <br />Do it today.
                </CWAlert>

                <MiniQuiz questions={moduleC19QuizQuestions} title="Due Diligence Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar19Resources({ onNext }) {
    return (
        <InteractiveLayout title="Module D: Exit Resources" subtitle="Further Reading">
            <div className="cw-prose">
                <ul className="cw-resource-list">
                    <li><strong>Built to Sell</strong> by John Warrillow</li>
                    <li><strong>Finish Big</strong> by Bo Burlingham</li>
                    <li><strong>The Art of Selling Your Business</strong> by John Warrillow</li>
                </ul>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <CWButton onClick={onNext} variant="primary">Take Final Exam →</CWButton>
                </div>
            </div>
        </InteractiveLayout>
    );
}

export function Pillar19Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
    const questions = pillar19QuizQuestions;
    const [localIndex, setLocalIndex] = useState(0);

    const handleNext = () => { if (localIndex < questions.length - 1) setLocalIndex(prev => prev + 1); };
    const handlePrev = () => { if (localIndex > 0) setLocalIndex(prev => prev - 1); };
    const isLast = localIndex === questions.length - 1;
    const hasAnswered = quizResponses && quizResponses[localIndex] !== undefined;

    return (
        <QuizLayout title="Final Exam: Exit" currentStep={localIndex + 1} totalSteps={questions.length}>
            <CWCard>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '2rem', minHeight: '60px' }}>{questions[localIndex].question}</h3>
                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                    {questions[localIndex].options.map((option, idx) => (
                        <button key={idx} onClick={() => onSelect && onSelect(localIndex, idx)}
                            style={{
                                padding: '1.25rem', borderRadius: '12px',
                                border: quizResponses[localIndex] === idx ? '2px solid #0b0f1a' : '1px solid #E5E7EB',
                                background: quizResponses[localIndex] === idx ? '#F8FAFC' : '#fff',
                                display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', fontSize: '1.1rem', cursor: 'pointer'
                            }}>
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #CBD5E1',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: quizResponses[localIndex] === idx ? '#0b0f1a' : 'transparent',
                                borderColor: quizResponses[localIndex] === idx ? '#0b0f1a' : '#CBD5E1'
                            }}>
                                {quizResponses[localIndex] === idx && <div style={{ width: '10px', height: '10px', background: '#fff', borderRadius: '50%' }} />}
                            </div>
                            {option}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <CWButton variant="ghost" onClick={handlePrev} disabled={localIndex === 0} style={{ opacity: localIndex === 0 ? 0 : 1 }}>← Previous</CWButton>
                    {isLast ? (
                        <CWButton variant="primary" onClick={onScore} disabled={!hasAnswered}>Submit Exam 🏁</CWButton>
                    ) : (
                        <CWButton variant="primary" onClick={handleNext} disabled={!hasAnswered}>Next Question →</CWButton>
                    )}
                </div>
                {scoreMessage && (
                    <div style={{ marginTop: '2rem' }}>
                        <CWAlert type={scoreMessage.includes('Pass') ? 'success' : 'error'}>{scoreMessage}</CWAlert>
                        {scoreMessage.includes('Pass') && (
                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <CWButton onClick={onFinish} variant="primary">Graduate 🎓</CWButton>
                            </div>
                        )}
                    </div>
                )}
            </CWCard>
        </QuizLayout>
    );
}

export function Pillar19Completion({ onNext }) {
    return (
        <ReadingLayout title="Degree Complete!">
            <CWCard style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                <h2 className="cw-heading-md">CapeWeb University Graduated!</h2>
                <p style={{ color: 'var(--cw-text-secondary)', margin: '1rem 0' }}>
                    You have completed the full curriculum. You are ready to build, grow, and sell.
                </p>
                <CWButton variant="primary" onClick={onNext || (() => window.location.reload())}>Return to Campus</CWButton>
            </CWCard>
        </ReadingLayout>
    );
}
