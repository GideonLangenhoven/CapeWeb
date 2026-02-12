import React, { useState, useEffect, useRef } from 'react';
import { InteractiveLayout, QuizLayout, ReadingLayout } from './CapeWebLayouts';
import { CWButton, CWCard, CWAlert, BookInsight, CWBadge } from './CapeWebUI';
import { pillar14QuizQuestions } from '../data/pillarLibrary';
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{
                    background: '#fff',
                    color: '#0EA5E9',
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
                            borderRadius: '100px',
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
                        background: '#713F12',
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
            background: '#FDF2F8',
            borderRadius: '24px',
            padding: '2.5rem',
            margin: '3rem 0',
            color: '#831843'
        }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', marginBottom: '1.5rem', color: '#0F172A' }}>
                <span>🧠</span> Why This Matters for Business Owners
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#334155', marginBottom: '2.5rem' }}>{intro}</p>
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
// INTERACTIVE COMPONENTS (Pillar 14)
// ==========================================

function CapTableSimulator() {
    const [founderEquity, setFounderEquity] = useState(100);
    const [equitySold, setEquitySold] = useState(20);
    const [valuation, setValuation] = useState(5000000); // 5m
    const [exitValue, setExitValue] = useState(20000000); // 20m

    // Logic
    const investorEquity = equitySold;
    const finalFounderEquity = 100 - investorEquity;

    const founderCash = (exitValue * (finalFounderEquity / 100));
    const investorCash = (exitValue * (investorEquity / 100));

    // Formatter
    const fmt = (n) => `R${(n / 1000000).toFixed(1)}m`;

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#4F46E5', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '0.5rem' }}>🍰 The Pie Chart of Doom</h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.9 }}>See how selling equity dilutes your payday.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Equity Sold to Investor (%)</label>
                    <input type="range" min="0" max="90" value={equitySold} onChange={(e) => setEquitySold(Number(e.target.value))} style={{ width: '100%', accentColor: '#818CF8' }} />
                    <div style={{ textAlign: 'right', fontWeight: 700 }}>{equitySold}%</div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Exit Valuation (R)</label>
                    <input type="range" min="1000000" max="100000000" step="1000000" value={exitValue} onChange={(e) => setExitValue(Number(e.target.value))} style={{ width: '100%', accentColor: '#818CF8' }} />
                    <div style={{ textAlign: 'right', fontWeight: 700 }}>{fmt(exitValue)}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', height: '100px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ width: `${finalFounderEquity}%`, background: '#fff', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    You ({finalFounderEquity}%)
                </div>
                {investorEquity > 0 && (
                    <div style={{ width: `${investorEquity}%`, background: '#818CF8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        Investor ({investorEquity}%)
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your Payout:</div>
                <div style={{ fontSize: '3rem', fontWeight: 900 }}>{fmt(founderCash)}</div>
                <div style={{ marginTop: '0.5rem', opacity: 0.8 }}>Investor gets {fmt(investorCash)}</div>
            </div>
        </div>
    );
}

function GrantChecker() {
    const [age, setAge] = useState(30);
    const [blackOwned, setBlackOwned] = useState(true);
    const [registered, setRegistered] = useState(true);
    const [taxClean, setTaxClean] = useState(true);

    let result = [];
    if (age <= 35) result.push({ name: "NYDA Grant", status: "Eligible (R1k - R250k)", color: "#10B981" });
    if (blackOwned && registered && taxClean) result.push({ name: "NEF / SEFA", status: "Eligible (Loan/Grant Mix)", color: "#3B82F6" });
    if (!registered || !taxClean) result.push({ name: "Compliance Alert", status: "You qualify for NOTHING until you register & pay tax.", color: "#EF4444" });

    if (result.length === 0) result.push({ name: "Private Funding", status: "Try Banks or Investors.", color: "#F59E0B" });

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#059669', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '1.5rem' }}>🏛️ Grant Eligibility Check</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={age <= 35} onChange={() => setAge(age > 35 ? 30 : 40)} style={{ width: '20px', height: '20px' }} />
                    Under 35 Years Old?
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={blackOwned} onChange={() => setBlackOwned(!blackOwned)} style={{ width: '20px', height: '20px' }} />
                    51%+ Black Owned?
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={registered} onChange={() => setRegistered(!registered)} style={{ width: '20px', height: '20px' }} />
                    CIPC Registered?
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={taxClean} onChange={() => setTaxClean(!taxClean)} style={{ width: '20px', height: '20px' }} />
                    Tax Clearance Valid?
                </label>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', color: '#064E3B' }}>
                <h4 style={{ margin: '0 0 1rem' }}>Results:</h4>
                {result.map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', borderBottom: '1px solid #E5E7EB', fontWeight: 600 }}>
                        <span>{r.name}</span>
                        <span style={{ color: r.color }}>{r.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PitchDeckBuilder() {
    const [slides, setSlides] = useState([
        { id: 1, name: "Problem", order: 2 },
        { id: 2, name: "Solution", order: 3 },
        { id: 3, name: "Team", order: 5 },
        { id: 4, name: "Market Size", order: 1 }, // Wrong
        { id: 5, name: "The Ask", order: 4 }
    ]);

    const move = (index, dir) => {
        const newSlides = [...slides];
        const targetIndex = index + dir;
        if (targetIndex >= 0 && targetIndex < newSlides.length) {
            [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
            setSlides(newSlides);
        }
    };

    const isCorrect = slides[0].name === "Problem" && slides[1].name === "Solution" && slides[slides.length - 1].name === "The Ask";

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#DB2777', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '1rem' }}>The Perfect Pitch Flow</h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Reorder the slides to tell a story.</p>

            <div style={{ display: 'grid', gap: '0.5rem' }}>
                {slides.map((s, i) => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ fontWeight: 800, width: '30px' }}>{i + 1}</div>
                        <div style={{ flex: 1, fontWeight: 600 }}>{s.name}</div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => move(i, -1)} style={{ background: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>⬆️</button>
                            <button onClick={() => move(i, 1)} style={{ background: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>⬇️</button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '12px', background: '#fff', color: '#DB2777', fontWeight: 700, textAlign: 'center' }}>
                {isCorrect ? "✅ Perfect! Hook them with the Problem, end with the Ask." : "❌ Structure incorrect. Start with the Problem."}
            </div>
        </div>
    );
}

// ==========================================
// QUIZ DATA (Local)
// ==========================================

const moduleA14QuizQuestions = [
    { question: 'What is Equity?', options: ['A loan from the bank', 'Ownership in your company (Shares)', 'A grant'], correctIndex: 1 },
    { question: 'What is "Dilution"?', options: ['Watering down your coffee', 'When your percentage ownership decreases because you issued new shares to an investor', 'Increasing your profit'], correctIndex: 1 },
    { question: 'What is "Bootstrapping"?', options: ['Wearing boots', 'Funding the business yourself using customer revenue and savings', 'Getting a bank loan'], correctIndex: 1 },
    { question: 'Which funding type requires NO repayment?', options: ['Bank Loan', 'Grant', 'Equity'], correctIndex: 1 },
];

const moduleB14QuizQuestions = [
    { question: 'What does NYDA stand for?', options: ['National Youth Development Agency', 'New York Development Area', 'No Youth Denied Access'], correctIndex: 0 },
    { question: 'Can you get a government grant if you are not tax compliant?', options: ['Yes', 'No (Valid Tax Clearance is mandatory)', 'Maybe if you know someone'], correctIndex: 1 },
    { question: 'Who is SEFA for?', options: ['Big corporates', 'Small Enterprise Finance Agency (SMEs)', 'International companies'], correctIndex: 1 },
    { question: 'According to "Profit First", what should you do?', options: ['Spend all money on growth', 'Take your profit percentage FIRST, then run the business on what is left', 'Wait until the end of the year to take profit'], correctIndex: 1 },
];

const moduleC14QuizQuestions = [
    { question: 'What is the most important slide in a Pitch Deck?', options: ['The Team', 'The Problem (The Hook)', 'The References'], correctIndex: 1 },
    { question: 'What does TAM stand for?', options: ['Total Addressable Market', 'Tamara', 'Tax and Money'], correctIndex: 0 },
    { question: 'How long do investors typically spend reading a deck?', options: ['30 minutes', '3 minutes (or less)', '1 hour'], correctIndex: 1 },
    { question: 'What is "The Ask"?', options: ['Asking how they are doing', 'Clearly stating how much money you need and what you will do with it', 'Asking for a job'], correctIndex: 1 },
];

// ==========================================
// MODULES
// ==========================================

export function Pillar14ModuleA({ onNext }) {
    return (
        <InteractiveLayout title="Module A: The Funding Reality" subtitle="Equity vs Debt">
            <div className="cw-prose">
                <p>Don't celebrate raising money. Celebrate making money. Raising money is selling a piece of your baby.</p>

                <BookInsight title="Be Smarter Than Your Lawyer" author="Brad Feld" book="Venture Deals" color="#4F46E5">
                    "If you don't know who the sucker at the poker table is, it's you. Understand the terms sheet."
                </BookInsight>

                <h3>Core Concept: Dilution</h3>
                <p>When you take R1m for 20%, you now only own 80%. If you sell for R100m, you lost R20m. Make sure the R1m was worth it.</p>

                <h3>Interactive: Cap Table Simulator</h3>
                <CapTableSimulator />

                <CWAlert type="info" title="Bootstrapping">
                    The best funding is Customer Funding. If customers pay you, you don't need investors.
                </CWAlert>

                <WhyBusinessMatters
                    intro="Ownership is expensive."
                    points={[
                        { title: "Control", text: "Investors want board seats. They can fire you from your own company." },
                        { title: "Exit", text: "Investors force you to sell (Exit) within 5-7 years. You can't just run it forever." }
                    ]}
                    capeWebCards={{
                        intro: "We help you look investable.",
                        items: [
                            { title: "Due Diligence Ready", text: "Our digital systems ensure your data is clean when investors audit you." },
                            { title: "Reporting", text: "Automated monthly reports to keep shareholders happy." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleA14QuizQuestions} title="Equity Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar14ModuleB({ onNext }) {
    return (
        <InteractiveLayout title="Module B: Gov Grants & Bootstrapping" subtitle="Free Money?">
            <div className="cw-prose">
                <p>South Africa has billions in grant funding. But it is locked behind a wall of paperwork.</p>

                <BookInsight title="Bank Your Profit" author="Mike Michalowicz" book="Profit First" color="#059669">
                    "Profit is not an event at the end of the year. Profit is a habit that happens with every single deposit."
                </BookInsight>

                <h3>Core Concept: Compliance First</h3>
                <p>You will get R0.00 from the government if you don't have a Tax Clearance Certificate. Period.</p>

                <h3>Interactive: Grant Checker</h3>
                <GrantChecker />

                <CWAlert type="warning" title="Warning: The Waiting Game">
                    Grants take 6 months to payout. Do not rely on them for rent next week.
                </CWAlert>

                <WhyBusinessMatters
                    intro="Grants are non-dilutive."
                    points={[
                        { title: "Free Equity", text: "They don't take shares. It's free cash to buy equipment." },
                        { title: "Credibility", text: "Winning a SEFA/NYDA grant proves you are a legitimate business." }
                    ]}
                    capeWebCards={{
                        intro: "We help with compliance.",
                        items: [
                            { title: "Professional Email", text: "You can't apply for a R1m grant with a @gmail.com address." },
                            { title: "Website Credibility", text: "Grant adjudicators check your website. If it looks broken, they reject you." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleB14QuizQuestions} title="Grants Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar14ModuleC({ onNext }) {
    return (
        <InteractiveLayout title="Module C: The Pitch" subtitle="Selling the Dream">
            <div className="cw-prose">
                <p>Investors buy the story, not just the spreadsheet. You need to frame the deal.</p>

                <BookInsight title="Frame Control" author="Oren Klaff" book="Pitch Anything" color="#DB2777">
                    "When you are reacting to the other person, that person owns the frame. When the other person is reacting to what you do and say, you own the frame."
                </BookInsight>

                <h3>Core Concept: The Hook</h3>
                <p>Start with the Problem. If they don't feel the pain, they won't buy the aspirin (Solution).</p>

                <h3>Interactive: Pitch Builder</h3>
                <PitchDeckBuilder />

                <CWAlert type="success" title="Tip: The Ask">
                    Be specific. "We need R500k to hire 2 sales people to reach R200k MRR." Don't say "We need money for marketing."
                </CWAlert>

                <WhyBusinessMatters
                    intro="Communication is leverage."
                    points={[
                        { title: "Recruiting", text: "A great pitch deck doesn't just get money; it gets great employees to join your vision." },
                        { title: "Sales", text: "Your investor pitch is just a version of your sales pitch." }
                    ]}
                    capeWebCards={{
                        intro: "We design winning decks.",
                        items: [
                            { title: "Visual Storytelling", text: "We turn boring slides into visual narratives that investors can't ignore." },
                            { title: "Data Visualization", text: "We make your growth charts look exponential." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleC14QuizQuestions} title="Pitch Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar14Resources({ onNext }) {
    return (
        <InteractiveLayout title="Module D: Funding Resources" subtitle="Toolkit">
            <div className="cw-prose">
                <ul className="cw-resource-list">
                    <li><strong>NYDA Portal</strong> - Youth Grants.</li>
                    <li><strong>SEFA</strong> - SME Loans.</li>
                    <li><strong>Y-Combinator Library</strong> - Best startup advice in the world (Free).</li>
                    <li><strong>SARS eFiling</strong> - Get your Tax Clearance.</li>
                </ul>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <CWButton onClick={onNext} variant="primary">Take Final Exam →</CWButton>
                </div>
            </div>
        </InteractiveLayout>
    );
}

export function Pillar14Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
    const questions = pillar14QuizQuestions;
    const [localIndex, setLocalIndex] = useState(0);

    const handleNext = () => { if (localIndex < questions.length - 1) setLocalIndex(prev => prev + 1); };
    const handlePrev = () => { if (localIndex > 0) setLocalIndex(prev => prev - 1); };
    const isLast = localIndex === questions.length - 1;
    const hasAnswered = quizResponses && quizResponses[localIndex] !== undefined;

    return (
        <QuizLayout title="Final Exam: Investment" currentStep={localIndex + 1} totalSteps={questions.length}>
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
                        <CWAlert type={scoreMessage.includes('Pass') || scoreMessage.includes('Funded') ? 'success' : 'error'}>{scoreMessage}</CWAlert>
                        {(scoreMessage.includes('Pass') || scoreMessage.includes('Funded')) && (
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

export function Pillar14Completion({ onNext }) {
    return (
        <ReadingLayout title="Investment Ready!">
            <CWCard style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦄</div>
                <h2 className="cw-heading-md">Fundable Badge Earned!</h2>
                <p style={{ color: 'var(--cw-text-secondary)', margin: '1rem 0' }}>
                    You now know the rules of the money game.
                </p>
                <CWButton variant="primary" onClick={onNext || (() => window.location.reload())}>Next Pillar: HR & Teams →</CWButton>
            </CWCard>
        </ReadingLayout>
    );
}
