import React, { useState, useEffect, useRef } from 'react';
import { InteractiveLayout, QuizLayout, ReadingLayout } from './CapeWebLayouts';
import { CWButton, CWCard, CWAlert, BookInsight, CWBadge } from './CapeWebUI';
import { pillar16QuizQuestions } from '../data/pillarLibrary';
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
// INTERACTIVE COMPONENTS (Pillar 16)
// ==========================================

function MVPBuilderInteractive() {
    const [budget, setBudget] = useState(50000);
    const [week, setWeek] = useState(1);
    const [features, setFeatures] = useState([
        { id: 1, name: "Landing Page (Wix)", cost: 500, time: 1, val: 50, type: 'smart' },
        { id: 2, name: "Custom App (React)", cost: 40000, time: 12, val: 60, type: 'dumb' },
        { id: 3, name: "Logo Design (Agency)", cost: 15000, time: 4, val: 5, type: 'dumb' },
        { id: 4, name: "WhatsApp Business", cost: 0, time: 1, val: 80, type: 'smart' },
        { id: 5, name: "Manual Fulfilment", cost: 0, time: 4, val: 90, type: 'smart' },
        { id: 6, name: "AI Automation", cost: 20000, time: 6, val: 20, type: 'dumb' } // Too early
    ]);
    const [built, setBuilt] = useState([]);

    const build = (item) => {
        if (budget >= item.cost) {
            setBudget(prev => prev - item.cost);
            setWeek(prev => prev + item.time);
            setBuilt([...built, item.id]);
        }
    };

    const totalVal = built.reduce((acc, id) => acc + features.find(f => f.id === id).val, 0);

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#EC4899', color: '#fff', position: 'relative' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '0.5rem' }}>MVP Builder Game</h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.9 }}>You have R50k. Build maximum value in minimum time.</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '16px' }}>
                <div>💰 Budget: <strong>R{budget.toLocaleString()}</strong></div>
                <div>📅 Week: <strong>{week}</strong></div>
                <div>⭐ Customer Value: <strong>{totalVal}</strong></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {features.map(f => (
                    <button key={f.id} onClick={() => build(f)} disabled={built.includes(f.id) || budget < f.cost}
                        style={{
                            padding: '1rem', borderRadius: '12px', border: 'none',
                            background: built.includes(f.id) ? 'rgba(255,255,255,0.2)' : '#fff',
                            color: built.includes(f.id) ? '#fff' : '#BE185D',
                            opacity: built.includes(f.id) || budget < f.cost ? 0.6 : 1,
                            cursor: built.includes(f.id) ? 'default' : 'pointer',
                            textAlign: 'left', display: 'flex', justifyContent: 'space-between'
                        }}>
                        <span>{built.includes(f.id) && "✅"} {f.name}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>R{f.cost} / {f.time}w</span>
                    </button>
                ))}
            </div>

            {built.length > 2 && (
                <div style={{ marginTop: '2rem', textAlign: 'center', padding: '1rem', background: '#fff', color: '#BE185D', borderRadius: '12px', fontWeight: 700 }}>
                    {totalVal > 150 ? "🎉 Result: Lean Startup Master! You validated quickly." : "Result: You wasted money on things that don't matter yet."}
                </div>
            )}
        </div>
    );
}

function PricingThermometer() {
    const [price, setPrice] = useState(100);
    const cost = 80;

    // Logic
    const margin = price - cost;
    const marginPercent = ((margin / price) * 100).toFixed(0);

    let perception = "Cheap / Suspicious";
    let color = "#FCA5A5"; // Red

    if (price > 120) { perception = "Fair Value"; color = "#FCD34D"; }
    if (price > 150) { perception = "Premium / Trustworthy"; color = "#6EE7B7"; }
    if (price > 300) { perception = "Rip-off"; color = "#FCA5A5"; }

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#0F766E', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '2rem' }}>Value Based Pricing</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '1rem' }}>Your Price (R)</label>
                    <input type="range" min="50" max="400" value={price} onChange={(e) => setPrice(Number(e.target.value))} style={{ width: '100%', accentColor: '#2DD4BF' }} />
                    <div style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 900, marginTop: '1rem' }}>R{price}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px' }}>
                    <div style={{ marginBottom: '0.5rem' }}>Cost to Produce: R{cost}</div>
                    <div style={{ marginBottom: '1rem' }}>Margin: <strong>{marginPercent}%</strong></div>
                    <div style={{ padding: '0.5rem', background: '#fff', color: '#134E4A', borderRadius: '8px', textAlign: 'center', fontWeight: 700 }}>
                        Customer Perception: <br /> {perception}
                    </div>
                </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.8, fontSize: '0.9rem' }}>
                Lesson: Low prices scare away premium clients. They assume "Cheap" = "Bad".
            </p>
        </div>
    );
}

function NicheFinder() {
    const [level, setLevel] = useState(0);
    const niches = [
        { name: "Marketing Agency", pop: 1000000, price: "Low", difficulty: "High" },
        { name: "Marketing for Dentists", pop: 50000, price: "Med", difficulty: "Med" },
        { name: "Marketing for Pediatric Dentists in CT", pop: 50, price: "High", difficulty: "Low" }
    ];

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#4338CA', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '1rem' }}>The Monopoly Finder</h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Click to drill down into a niche.</p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                {niches.map((n, i) => (
                    <button key={i} onClick={() => setLevel(i)}
                        style={{
                            width: '100%', maxWidth: '500px',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: level === i ? '2px solid #818CF8' : '1px solid transparent',
                            background: level === i ? '#312E81' : 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            textAlign: 'left',
                            opacity: level === i ? 1 : 0.5,
                            transform: level === i ? 'scale(1.05)' : 'scale(1)',
                            transition: 'all 0.3s'
                        }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{n.name}</div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem', color: '#A5B4FC' }}>
                            <span>Competitors: {n.pop}</span>
                            <span>Pricing Power: {n.price}</span>
                        </div>
                    </button>
                ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center', background: '#fff', color: '#4338CA', padding: '1rem', borderRadius: '12px' }}>
                {level === 0 && "Result: You are a commodity. You compete on price. You die."}
                {level === 1 && "Result: Better. You speak their language."}
                {level === 2 && "Result: MONOPOLY. You are the only expert in the world for them. You charge what you want."}
            </div>
        </div>
    );
}

// ==========================================
// QUIZ DATA (Local)
// ==========================================

const moduleA16QuizQuestions = [
    { question: 'What is the "Mom Test"?', options: ['Asking your mom for money', 'Asking questions that don\'t let the user lie to you (Focus on past behavior)', 'Testing a product on moms'], correctIndex: 1 },
    { question: 'What is an MVP?', options: ['Most Valuable Player', 'Minimum Viable Product (Smallest thing that delivers value)', 'Maximum Visual Polish'], correctIndex: 1 },
    { question: 'Why should you NOT build a custom app immediately?', options: ['Coding is fun', 'It is expensive and you don\'t know what users want yet', 'Apps are dead'], correctIndex: 1 },
    { question: 'Which is a "Painkiller"?', options: ['A slightly nicer logo', 'A tool that stops you from getting fined by SARS', 'A cool t-shirt'], correctIndex: 1 },
];

const moduleB16QuizQuestions = [
    { question: 'What is "Cost Plus" pricing?', options: ['Pricing based on Value', 'Taking your cost + 20% (It leaves money on the table)', 'Free pricing'], correctIndex: 1 },
    { question: 'Why is a low price sometimes bad?', options: ['It signals low quality/trust', 'It creates less tax', 'People hate saving money'], correctIndex: 0 },
    { question: 'What is "Value Based Pricing"?', options: ['Charging based on how much money you make for the client', 'Charging an hourly rate', 'Charging what competitors charge'], correctIndex: 0 },
    { question: 'If you double your price and lose 20% of clients, do you make more or less profit?', options: ['Less', 'More (Usually much more, with less work)', 'The same'], correctIndex: 1 },
];

const moduleC16QuizQuestions = [
    { question: 'What is "Product Market Fit"?', options: ['When the product looks good', 'When the market pulls the product out of your hands faster than you can build it', 'When you have a logo'], correctIndex: 1 },
    { question: 'According to Peter Thiel, what should you aim for?', options: ['Perfect competition', 'Monopoly (Dominate a small niche)', 'Being average'], correctIndex: 1 },
    { question: 'Why start with a Niche?', options: ['It is smaller', 'You can dominate it quickly with limited resources', 'It is easier'], correctIndex: 1 },
    { question: 'What is the "10x Rule"?', options: ['Work 10x harder', 'Your product must be 10x better than the alternative to get people to switch', 'Hire 10 people'], correctIndex: 1 },
];

// ==========================================
// EXPORTED MODULES
// ==========================================

export function Pillar16ModuleA({ onNext }) {
    return (
        <InteractiveLayout title="Module A: The Lean Product" subtitle="Build what they want">
            <div className="cw-prose">
                <p>Don't build a castle until you know someone wants to live in it. Build a tent first.</p>

                <BookInsight title="The Feedback Loop" author="Rob Fitzpatrick" book="The Mom Test" color="#EC4899">
                    "You aren't allowed to tell them what their problem is, and in return, they aren't allowed to tell you what to build. They own the problem, you own the solution."
                </BookInsight>

                <h3>Core Concept: The MVP Game</h3>
                <p>Can you build a business with R50k? Or will you blow it all on a logo?</p>

                <h3>Interactive: MVP Builder</h3>
                <MVPBuilderInteractive />

                <CWAlert type="info" title="Activity: The 5 Interviews">
                    Call 5 potential customers. Ask: "What is the hardest thing about [Problem]?" <br />Do NOT describe your idea. Just listen.
                </CWAlert>

                <WhyBusinessMatters
                    intro="Development is expensive. Research is cheap."
                    points={[
                        { title: "Risk Reduction", text: "Writing code is the most expensive way to test a hypothesis. Use a flyer or a WhatsApp message first." },
                        { title: "Speed", text: "The faster you learn you are wrong, the faster you can be right." }
                    ]}
                    capeWebCards={{
                        intro: "We help you iterate fast.",
                        items: [
                            { title: "Rapid Landing Pages", text: "We spin up conversion-focused pages in days, not months, to test your offer." },
                            { title: "Analytics", text: "We track every click so you know exactly which headline works best." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleA16QuizQuestions} title="Lean Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar16ModuleB({ onNext }) {
    return (
        <InteractiveLayout title="Module B: Pricing Strategy" subtitle="Charge what you are worth">
            <div className="cw-prose">
                <p>Price is not just a number. It is a signal. It tells the customer "This is premium" or "This is trash".</p>

                <BookInsight title="The Price" author="Madhavan Ramanujam" book="Monetizing Innovation" color="#0F766E">
                    "Innovation that you can't get paid for is just an art project."
                </BookInsight>

                <h3>Core Concept: Value Based Pricing</h3>
                <p>Don't charge for your time. Charge for the value you provide. If you save them R1m, charging R100k is a bargain.</p>

                <h3>Interactive: Pricing Thermometer</h3>
                <PricingThermometer />

                <CWAlert type="warning" title="Warning: The Cheap Trap">
                    Clients who pay the least complain the most. Raising your prices often attracts BETTER clients who trust you more.
                </CWAlert>

                <WhyBusinessMatters
                    intro="Margin gives you room to breathe."
                    points={[
                        { title: "Profit is Sanity", text: "Turnover is vanity. Profit is sanity. High margins allow you to hire help and grow." },
                        { title: "Quality", text: "You cannot deliver a premium service on a budget price. You will burn out." }
                    ]}
                    capeWebCards={{
                        intro: "We position you as the expert.",
                        items: [
                            { title: "Premium Design", text: "Our designs signal 'High Value' instantly, allowing you to charge 2x your competitors." },
                            { title: "Social Proof", text: "We showcase your best testimonials right next to the price tag to justify the cost." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleB16QuizQuestions} title="Pricing Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar16ModuleC({ onNext }) {
    return (
        <InteractiveLayout title="Module C: Product Market Fit" subtitle="Scaling Up">
            <div className="cw-prose">
                <p>Once you have a product people want and a price that works, you scale. But don't try to sell to everyone. Sell to someone.</p>

                <BookInsight title="Monopoly" author="Peter Thiel" book="Zero to One" color="#4338CA">
                    "Competition is for losers. All happy companies are different: each one earns a monopoly by solving a unique problem."
                </BookInsight>

                <h3>Core Concept: Niche Down</h3>
                <p>It is easier to dominate a small pond than to be a small fish in the ocean.</p>

                <h3>Interactive: Niche Finder</h3>
                <NicheFinder />

                <CWAlert type="success" title="Activity: The 10x Feature">
                    Identify ONE thing you can do 10x better than the competitor. <br />Speed? Price? Simplicity? Build your marketing around that.
                </CWAlert>

                <WhyBusinessMatters
                    intro="Focus is the ultimate weapon."
                    points={[
                        { title: "Efficiency", text: "If you serve only Dentists, you can copy-paste your solution. If you serve everyone, every project is from scratch." },
                        { title: "Referrals", text: "Dentists talk to other Dentists. Your name spreads faster in a niche." }
                    ]}
                    capeWebCards={{
                        intro: "We help you scale your niche.",
                        items: [
                            { title: "SEO Clustering", text: "We build content clusters (e.g., 'Marketing for Pediatric Dentists') to own specific search terms." },
                            { title: "Automated Onboarding", text: "We build forms that qualify leads automatically, so you only talk to perfect fits." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleC16QuizQuestions} title="Scale Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar16Resources({ onNext }) {
    return (
        <InteractiveLayout title="Module D: Product Resources" subtitle="Toolkit">
            <div className="cw-prose">
                <ul className="cw-resource-list">
                    <li><strong>The Mom Test</strong> by Rob Fitzpatrick</li>
                    <li><strong>Monetizing Innovation</strong> by Madhavan Ramanujam</li>
                    <li><strong>Zero to One</strong> by Peter Thiel</li>
                </ul>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <CWButton onClick={onNext} variant="primary">Take Final Exam →</CWButton>
                </div>
            </div>
        </InteractiveLayout>
    );
}

export function Pillar16Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
    const questions = pillar16QuizQuestions;
    const [localIndex, setLocalIndex] = useState(0);

    const handleNext = () => { if (localIndex < questions.length - 1) setLocalIndex(prev => prev + 1); };
    const handlePrev = () => { if (localIndex > 0) setLocalIndex(prev => prev - 1); };
    const isLast = localIndex === questions.length - 1;
    const hasAnswered = quizResponses && quizResponses[localIndex] !== undefined;

    return (
        <QuizLayout title="Final Exam: Product Strategy" currentStep={localIndex + 1} totalSteps={questions.length}>
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

export function Pillar16Completion({ onNext }) {
    return (
        <ReadingLayout title="Product Training Complete!">
            <CWCard style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                <h2 className="cw-heading-md">Innovator Badge Earned!</h2>
                <p style={{ color: 'var(--cw-text-secondary)', margin: '1rem 0' }}>
                    You now know how to build a product that sells itself.
                </p>
                <CWButton variant="primary" onClick={onNext || (() => window.location.reload())}>Next Pillar: Partnerships →</CWButton>
            </CWCard>
        </ReadingLayout>
    );
}
