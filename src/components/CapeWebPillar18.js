import React, { useState, useEffect, useRef } from 'react';
import { InteractiveLayout, QuizLayout, ReadingLayout } from './CapeWebLayouts';
import { CWButton, CWCard, CWAlert, BookInsight, CWBadge } from './CapeWebUI';
import { pillar18QuizQuestions } from '../data/pillarLibrary';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';

// ==========================================
// INTERNAL HELPERS (Shared Design System)
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
// INTERACTIVE COMPONENTS (Pillar 18)
// ==========================================

function CrisisRadarInteractive() {
    const [risks, setRisks] = useState([
        { id: 1, name: 'Single Big Client', type: 'Revenue', active: false },
        { id: 2, name: 'Key Staff (No Backup)', type: 'Ops', active: false },
        { id: 3, name: 'Cashflow < 30 Days', type: 'Finance', active: false },
        { id: 4, name: 'No Contracts', type: 'legal', active: false }
    ]);

    const toggleRisk = (id) => {
        setRisks(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    };

    const activeCount = risks.filter(r => r.active).length;
    let fragility = "Robust";
    let color = "#10B981"; // Green
    if (activeCount >= 1) { fragility = "Fragile"; color = "#F59E0B"; }
    if (activeCount >= 3) { fragility = "CRITICAL"; color = "#EF4444"; }

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#0891B2', color: '#fff', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>The Fragility Radar</h3>
            <p style={{ marginBottom: '2rem', opacity: 0.9 }}>Select items that apply to your business right now.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {risks.map(r => (
                    <button key={r.id} onClick={() => toggleRisk(r.id)} style={{
                        padding: '1rem',
                        background: r.active ? '#CFFAFE' : 'rgba(255,255,255,0.1)',
                        color: r.active ? '#155E75' : '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}>
                        {r.active ? '⚠️ ' : '🛡️ '} {r.name}
                    </button>
                ))}
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', display: 'inline-block' }}>
                Status: <strong style={{ color: color === '#10B981' ? '#fff' : color, fontSize: '1.5rem' }}>{fragility}</strong>
                <p style={{ margin: 0, fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
                    {activeCount === 0 ? "You are built to survive shocks." : "One bad event could kill the company."}
                </p>
            </div>
        </div>
    );
}

function RunwaySimulator() {
    const [cash, setCash] = useState(150000); // 3 months x 50k
    const [expenses, setExpenses] = useState(50000);
    const [cuts, setCuts] = useState([
        { id: 1, name: 'Fire Fancy Marketing Agency', saving: 10000, taken: false },
        { id: 2, name: 'Move to Remote Work (Cut Rent)', saving: 15000, taken: false },
        { id: 3, name: 'Founder takes 0 Salary', saving: 20000, taken: false }
    ]);

    const monthsLeft = (cash / expenses).toFixed(1);

    const takeAction = (id) => {
        const action = cuts.find(c => c.id === id);
        if (action && !action.taken) {
            setExpenses(prev => prev - action.saving);
            setCuts(prev => prev.map(c => c.id === id ? { ...c, taken: true } : c));
        }
    };

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#F59E0B', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '0.5rem' }}>Wartime CEO Simulator</h3>
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Revenue just hit R0. You have R150k in bank. Survive.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
                    <div style={{ background: '#fff', color: '#78350F', padding: '1.5rem', borderRadius: '16px' }}>
                        <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 800 }}>Runway Left</div>
                        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: monthsLeft < 6 ? '#EF4444' : '#10B981' }}>{monthsLeft}m</div>
                        <div style={{ fontSize: '0.9rem' }}>Burn Rate: R{expenses.toLocaleString()}/mo</div>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {cuts.map(c => (
                            <button key={c.id} onClick={() => takeAction(c.id)} disabled={c.taken} style={{
                                padding: '1rem', borderRadius: '12px', border: 'none',
                                background: c.taken ? 'rgba(0,0,0,0.1)' : '#78350F',
                                color: '#fff', cursor: c.taken ? 'default' : 'pointer', opacity: c.taken ? 0.6 : 1, textAlign: 'left'
                            }}>
                                ✂️ {c.name} (Save R{c.saving / 1000}k)
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ApologyBuilderInteractive() {
    const [statement, setStatement] = useState([]);

    const options = [
        { text: "We messed up.", score: 10, type: 'good' },
        { text: "It was a technical glitch.", score: -5, type: 'bad' },
        { text: "We are investigating.", score: 0, type: 'neutral' },
        { text: "Here is how we fixed it.", score: 10, type: 'good' },
        { text: "We are sorry you feel that way.", score: -10, type: 'bad' },
        { text: "Full refund issued.", score: 10, type: 'good' }
    ];

    const addToStatement = (opt) => {
        if (!statement.includes(opt)) setStatement([...statement, opt]);
    };

    const totalScore = statement.reduce((acc, curr) => acc + curr.score, 0);

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#1E293B', color: '#fff' }}>
            <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '1rem' }}>The Apology Builder</h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.8 }}>Build a public statement after a data breach. Choose wisely.</p>

            <div style={{ background: '#fff', color: '#000', padding: '1.5rem', borderRadius: '8px', minHeight: '100px', marginBottom: '2rem', fontFamily: 'monospace' }}>
                <strong>PRESS RELEASE:</strong><br /><br />
                {statement.length === 0 ? <span style={{ color: '#ccc' }}>[Select fragments below...]</span> : statement.map(s => s.text).join(' ')}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
                {options.map((opt, i) => (
                    <button key={i} onClick={() => addToStatement(opt)} style={{
                        padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid #94A3B8', background: 'transparent', color: '#fff', cursor: 'pointer'
                    }}>
                        {opt.text}
                    </button>
                ))}
            </div>

            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px' }}>
                Trust Score: <strong style={{ color: totalScore > 10 ? '#4ADE80' : totalScore < 0 ? '#F87171' : '#fff' }}>{totalScore}</strong>
                {totalScore > 15 && " (Excellent Ownership)"}
                {totalScore < 0 && " (Defensive & Weak)"}
            </div>
            {statement.length > 0 && <button onClick={() => setStatement([])} style={{ display: 'block', margin: '1rem auto 0', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', textDecoration: 'underline' }}>Reset</button>}
        </div>
    );
}

// ==========================================
// QUIZ DATA (Local)
// ==========================================

const moduleA18QuizQuestions = [
    { question: 'What is "Antifragility"?', options: ['Being very careful', 'Things that gain from disorder and stress', 'Things that break easily'], correctIndex: 1 },
    { question: 'What is a "Black Swan" event?', options: ['A rare bird', 'A predictable problem', 'A rare, unpredictable event with massive impact'], correctIndex: 2 },
    { question: 'Why is "Efficiency" (e.g. Just-in-Time) sometimes dangerous?', options: ['It costs too much', 'It removes the buffer needed to survive shocks', 'It is too fast'], correctIndex: 1 },
    { question: 'What is the "Pre-Mortem" technique?', options: ['Imagining the project failed BEFORE you start, to fix risks', 'An autopsy', 'Checking steady vital signs'], correctIndex: 0 },
];

const moduleB18QuizQuestions = [
    { question: 'In a crisis (Wartime), who should make decisions?', options: ['A large committee', 'The CEO (Single point of command)', 'The Intern'], correctIndex: 1 },
    { question: 'What is "Runway"?', options: ['A fashion show', 'How many months your business can survive with zero revenue', 'A paved road'], correctIndex: 1 },
    { question: 'When cutting costs in a crisis, you should:', options: ['Cut a little bit every month', 'Cut deep and cut once (preserve morale)', 'Wait and see'], correctIndex: 1 },
    { question: 'What is the first step in "Triage"?', options: ['Panic', 'Identify the most life-threatening problem', 'Call a meeting'], correctIndex: 1 },
];

const moduleC18QuizQuestions = [
    { question: 'What is "Extreme Ownership"?', options: ['Owning a lot of things', 'Taking total responsibility for everything that happens, good or bad', 'Buying competitors'], correctIndex: 1 },
    { question: 'When apologizing publicly, you should:', options: ['Explain why it wasn\'t really your fault', 'Blame a junior employee', 'Admit the error, state the fix, and say sorry clearly'], correctIndex: 2 },
    { question: 'Trust is gained by:', options: ['Promises', 'Consistency over time', 'Marketing'], correctIndex: 1 },
    { question: 'After a crisis, what is a "Post-Mortem"?', options: ['A celebration', 'An analysis of what went wrong so it never happens again', 'A funeral'], correctIndex: 1 },
];

// ==========================================
// EXPORTED MODULES
// ==========================================

export function Pillar18ModuleA({ onNext }) {
    return (
        <InteractiveLayout title="Module A: Early Detection" subtitle="The Smoke Signals">
            <div className="cw-prose">
                <p>Most crises give warnings. We ignore them because we are "Too Busy". Antifragility means building a business that doesn't just survive chaos, but gets better because of it.</p>

                <BookInsight title="The Black Swan" author="Nassim Taleb" book="Antifragile" color="#0891B2">
                    "Wind extinguishes a candle and energizes fire. You want to be the fire and wish for the wind."
                </BookInsight>

                <h3>Core Concept: Fragility Check</h3>
                <p>Efficiency is the enemy of survival. If you are 100% efficient (no extra cash, one supplier, maxed out time), one bump kills you. You need "Slack".</p>

                <h3>Interactive: The Crisis Radar</h3>
                <CrisisRadarInteractive />

                <CWAlert type="info" title="Activity: The Pre-Mortem">
                    Imagine it is 1 year from now and your business has FAILED. <br />Write down the story of <strong>why</strong> it failed. <br />Now, go fix those things.
                </CWAlert>

                <WhyBusinessMatters
                    intro="A resilient business sleeps better at night."
                    points={[
                        { title: "Survival", text: "50% of businesses fail because of cashflow shocks. Reserves are not 'dead money', they are oxygen tanks." },
                        { title: "Opportunity", text: "When a crisis hits (e.g., Covid), fragile competitors die. Antifragile businesses acquire them." }
                    ]}
                    capeWebCards={{
                        intro: "We build redundancy into your digital presence.",
                        items: [
                            { title: "Hosting Backups", text: "Daily automated off-site backups mean you can never lose your data, even if hacked." },
                            { title: "Compliance Audit", text: "We proactively scan for broken links and security flaws before they hurt your brand." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleA18QuizQuestions} title="Risk Radar Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar18ModuleB({ onNext }) {
    return (
        <InteractiveLayout title="Module B: The Response" subtitle="General Quarters">
            <div className="cw-prose">
                <p>The crisis has started. The server is down. The money is gone. This is War. Peacetime rules no longer apply.</p>

                <BookInsight title="Wartime CEO" author="Ben Horowitz" book="The Hard Thing About Hard Things" color="#EA580C">
                    "Peacetime CEO knows that proper protocol leads to winning. Wartime CEO violates protocol to win. Wartime CEO cares about a speck of dust on a gnat's ass if it interferes with the prime directive."
                </BookInsight>

                <h3>Core Concept: Triage</h3>
                <p>Stop the bleeding. Don't worry about the scar. If you run out of cash, the game ends.</p>

                <h3>Interactive: Extension Protocol</h3>
                <RunwaySimulator />

                <h3 style={{ marginTop: '2rem' }}>Scenario: The Viral Complaint</h3>
                <CWCard>
                    <div style={{ padding: '1rem', background: '#FEE2E2', borderRadius: '12px', color: '#991B1B' }}>
                        <strong>@AngryClient99:</strong> "This company stole my money and never delivered! SCAM #CapeWeb" (100 Retweets)
                    </div>
                    <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>❌ Peacetime Response:</strong><br /> "Let's form a committee to draft a response next week." <br /><em>(Result: Brand dies)</em>
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>✅ Wartime Response:</strong><br /> CEO DM's immediately. Publicly replies: "I am the owner. I am fixing this now. Here is my cell number."
                        </div>
                    </div>
                </CWCard>

                <WhyBusinessMatters
                    intro="Speed is the only currency that matters in a crisis."
                    points={[
                        { title: "Leadership", text: "Your team is watching. If you freeze, they panic. If you act, they follow." },
                        { title: "Cash Preservation", text: "It is better to cut costs too early and be wrong, than too late and be dead." }
                    ]}
                    capeWebCards={{
                        intro: "We offer priority support for critical incidents.",
                        items: [
                            { title: "Uptime Monitoring", text: "We know your site is down before you do, and we start fixing it immediately." },
                            { title: "Crisis Communcation", text: "We can deploy site-wide banners/alerts in minutes to inform customers of issues." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleB18QuizQuestions} title="Wartime Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar18ModuleC({ onNext }) {
    return (
        <InteractiveLayout title="Module C: Recovery" subtitle="Extreme Ownership">
            <div className="cw-prose">
                <p>The dust has settled. You survived. Now you must rebuild trust. This requires total honesty and zero excuses.</p>

                <BookInsight title="No Excuses" author="Jocko Willink" book="Extreme Ownership" color="#1E293B">
                    "Leaders must own everything in their world. There is no one else to blame."
                </BookInsight>

                <h3>Core Concept: The Apology</h3>
                <p>A bad apology kills trust ("We are sorry <em>if</em> you were offended"). A good apology accepts blame and details the fix.</p>

                <h3>Interactive: The Statement Builder</h3>
                <ApologyBuilderInteractive />

                <CWAlert type="success" title="Activity: The Post-Mortem Report">
                    After every crisis, write a report:<br />1. What happened?<br />2. Dis we respond fast enough?<br />3. What system did we build to prevent repeat?
                </CWAlert>

                <WhyBusinessMatters
                    intro="Reputation takes years to build and seconds to lose."
                    points={[
                        { title: "Trust Asset", text: "A brand that owns its mistakes often becomes MORE trusted than one that never makes mistakes." },
                        { title: "System Improvement", text: "Every crisis reveals a weak system. Fixing it makes you stronger (Antifragile)." }
                    ]}
                    capeWebCards={{
                        intro: "We protect your domain reputation.",
                        items: [
                            { title: "Security Headers", text: "We implement technical safeguards (DMARC/SPF) so your emails don't go to spam." },
                            { title: "Review Management", text: "We help you solicit positive reviews to bury the occasional negative one naturally." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleC18QuizQuestions} title="Ownership Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar18Resources({ onNext }) {
    return (
        <InteractiveLayout title="Module D: Crisis Resources" subtitle="Toolkit">
            <div className="cw-prose">
                <ul className="cw-resource-list">
                    <li><strong>Antifragile</strong> by Nassim Taleb</li>
                    <li><strong>The Hard Thing About Hard Things</strong> by Ben Horowitz</li>
                    <li><strong>Extreme Ownership</strong> by Jocko Willink</li>
                    <li><strong>Load Shedding Schedule App</strong> (Essential Ops Tool)</li>
                </ul>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <CWButton onClick={onNext} variant="primary">Take Final Exam →</CWButton>
                </div>
            </div>
        </InteractiveLayout>
    );
}

export function Pillar18Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
    const questions = pillar18QuizQuestions;
    const [localIndex, setLocalIndex] = useState(0);

    const handleNext = () => { if (localIndex < questions.length - 1) setLocalIndex(prev => prev + 1); };
    const handlePrev = () => { if (localIndex > 0) setLocalIndex(prev => prev - 1); };
    const isLast = localIndex === questions.length - 1;
    const hasAnswered = quizResponses && quizResponses[localIndex] !== undefined;

    return (
        <QuizLayout title="Final Exam: Crisis Management" currentStep={localIndex + 1} totalSteps={questions.length}>
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
                                <CWButton onClick={onFinish} variant="primary">Continue →</CWButton>
                            </div>
                        )}
                    </div>
                )}
            </CWCard>
        </QuizLayout>
    );
}

export function Pillar18Completion({ onNext }) {
    return (
        <ReadingLayout title="Crisis Training Complete!">
            <CWCard style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛟</div>
                <h2 className="cw-heading-md">Crisis Commander Badge Earned!</h2>
                <p style={{ color: 'var(--cw-text-secondary)', margin: '1rem 0' }}>
                    You now know how to detect smoke, fight the fire, and rebuild the house.
                </p>
                <CWButton variant="primary" onClick={onNext || (() => window.location.reload())}>Next Pillar: Exit Strategy →</CWButton>
            </CWCard>
        </ReadingLayout>
    );
}
