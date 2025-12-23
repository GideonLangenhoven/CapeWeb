import React, { useState, useEffect, useRef } from 'react';
import { InteractiveLayout, QuizLayout, ReadingLayout } from './CapeWebLayouts';
import { CWButton, CWCard, CWAlert, BookInsight, CWBadge } from './CapeWebUI';
import { pillar17QuizQuestions } from '../data/pillarLibrary';
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
// INTERACTIVE COMPONENTS (Pillar 17)
// ==========================================

function PartnershipSplitter() {
    const [equity, setEquity] = useState(50);

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#F97316', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '1rem' }}>🍰 The Equity Slicer</h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>The biggest cause of failure is a 50/50 "Deadlock" split.</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', background: '#fff', padding: '2rem', borderRadius: '16px', color: '#0F172A' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748B' }}>YOU</div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#F97316' }}>{equity}%</div>
                </div>
                <input
                    type="range" min="1" max="99"
                    value={equity} onChange={(e) => setEquity(Number(e.target.value))}
                    style={{ flex: 2, accentColor: '#F97316' }}
                />
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748B' }}>PARTNER</div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#475569' }}>{100 - equity}%</div>
                </div>
            </div>

            <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                {equity === 50 && <span style={{ fontWeight: 800 }}>⚠️ DANGER: DEADLOCK. Who casts the tie-breaking vote?</span>}
                {equity > 50 && <span>✅ You have control. Ensure you protect minority shareholder rights via the MOU.</span>}
                {equity < 50 && <span>⚠️ You are a minority shareholder. Do you trust them with your life?</span>}
            </div>
        </div>
    );
}

function BBBEEInteractive() {
    const [ownership, setOwnership] = useState(0);
    const [skills, setSkills] = useState(0);
    const [suppliers, setSuppliers] = useState(0);

    // Simplified calculation
    const totalPoints = (ownership * 0.25) + (skills * 0.2) + (suppliers * 0.4);
    let level = 8;
    if (totalPoints > 40) level = 7;
    if (totalPoints > 55) level = 6;
    if (totalPoints > 70) level = 5;
    if (totalPoints > 80) level = 4;
    if (totalPoints > 90) level = 2;
    if (totalPoints > 100) level = 1;
    if (ownership === 100) level = 1; // 100% Black Owned EME usually Auto Level 1

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#111827', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '0.5rem' }}>B-BBEE Simulator</h3>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#9CA3AF' }}>See how your choices affect your Compliance Level.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#D1D5DB' }}>Black Ownership %</label>
                            <input type="range" min="0" max="100" value={ownership} onChange={(e) => setOwnership(Number(e.target.value))} style={{ width: '100%', accentColor: '#FCD34D' }} />
                            <div style={{ textAlign: 'right', fontWeight: 700, color: '#FCD34D' }}>{ownership}%</div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#D1D5DB' }}>Skills Spend (R)</label>
                            <input type="range" min="0" max="100" value={skills} onChange={(e) => setSkills(Number(e.target.value))} style={{ width: '100%', accentColor: '#60A5FA' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#D1D5DB' }}>Supplier Development</label>
                            <input type="range" min="0" max="100" value={suppliers} onChange={(e) => setSuppliers(Number(e.target.value))} style={{ width: '100%', accentColor: '#34D399' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1F2937', borderRadius: '16px', padding: '2rem', border: '1px solid #374151' }}>
                        <div style={{ fontSize: '1rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>CONTRIBUTOR LEVEL</div>
                        <div style={{ fontSize: '5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{level}</div>
                        <div style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: level === 1 ? '#059669' : level <= 4 ? '#D97706' : '#DC2626', borderRadius: '8px', fontWeight: 700 }}>
                            {level === 1 ? "Premier Partner" : level <= 4 ? "Compliant" : "Non-Compliant"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function JVCalculator() {
    const [you, setYou] = useState("Product");
    const [them, setThem] = useState("Audience");

    // Simple logic for educational purpose
    let synergy = "Good Match";
    let desc = "Standard distribution deal.";

    if (you === "Product" && them === "Product") { synergy = "Competition"; desc = "You are fighting for the same shelf space. Risky."; }
    if (you === "Audience" && them === "Audience") { synergy = "Noise"; desc = "Two megaphones, no product. Nothing to sell."; }
    if (you === "Operations" && them === "Sales") { synergy = "Perfect Match"; desc = "The classic 'Hacker vs Hustler' combo."; }

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#4F46E5', color: '#fff' }}>
            <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem' }}>JV Matchmaker</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: '#fff', color: '#000', padding: '1.5rem', borderRadius: '12px' }}>
                    <strong>You Have:</strong>
                    <select value={you} onChange={(e) => setYou(e.target.value)} style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '8px' }}>
                        <option value="Product">Great Product</option>
                        <option value="Audience">Big Audience</option>
                        <option value="Operations">Operations Skill</option>
                        <option value="Sales">Sales Skill</option>
                    </select>
                </div>
                <div style={{ fontSize: '2rem' }}>+</div>
                <div style={{ background: '#fff', color: '#000', padding: '1.5rem', borderRadius: '12px' }}>
                    <strong>They Have:</strong>
                    <select value={them} onChange={(e) => setThem(e.target.value)} style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '8px' }}>
                        <option value="Product">Great Product</option>
                        <option value="Audience">Big Audience</option>
                        <option value="Operations">Operations Skill</option>
                        <option value="Sales">Sales Skill</option>
                    </select>
                </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{synergy}</div>
                <p>{desc}</p>
            </div>
        </div>
    );
}

// ==========================================
// QUIZ DATA (Local)
// ==========================================

const moduleA17QuizQuestions = [
    { question: 'What does 1 + 1 = 3 mean in partnerships?', options: ['Bad math', 'Synergy: Together you create more value than the sum of parts', 'A merger'], correctIndex: 1 },
    { question: 'Why is a 50/50 equity split dangerous?', options: ['It is too fair', 'Deadlock Risk: No decision can be made if partners disagree', 'Taxes are higher'], correctIndex: 1 },
    { question: 'What is the most important document to sign BEFORE starting?', options: ['Office Lease', 'Partnership Charter / Shareholders Agreement', 'Wifi Contract'], correctIndex: 1 },
    { question: 'If you have the Idea but no Skills or Money, how much equity do you deserve?', options: ['50%', '5-10% (Ideas are cheap, execution is everything)', '100%'], correctIndex: 1 },
];

const moduleB17QuizQuestions = [
    { question: 'What is "Fronting"?', options: ['Being a receptionist', 'Illegal practice of faking black ownership to cheat B-BBEE points', 'Designing a shop front'], correctIndex: 1 },
    { question: 'Who is the "Integrator" in a business?', options: ['The person who connects the wifi', 'The operator who turns the Visionary\'s ideas into reality (Rocket Fuel)', 'The sales guy'], correctIndex: 1 },
    { question: 'What is an MOU?', options: ['Memorandum of Understanding (Not legally binding)', 'Mother of Us', 'Money or U'], correctIndex: 0 },
    { question: 'What happens if you ignore B-BBEE as you grow?', options: ['Nothing', 'You get locked out of Government and Large Corporate supply chains', 'You save money'], correctIndex: 1 },
];

const moduleC17QuizQuestions = [
    { question: 'What is a "Strategic Alliance"?', options: ['A war pact', 'A mutually beneficial relationship (e.g. referrals) without forming a new company', 'Buying a competitor'], correctIndex: 1 },
    { question: 'In the formula "Who Not How", what is the secret to scaling?', options: ['Learning how to do everything yourself', 'Finding a "Who" (Partner/Employee) that already knows how to do it', 'Working harder'], correctIndex: 1 },
    { question: 'What is the biggest risk in a Joint Venture (JV)?', options: ['Making too much money', 'Misaligned values and reputation damage', 'Having to share lunch'], correctIndex: 1 },
    { question: 'The best partnerships are based on:', options: ['Similar skills (Two Accountants)', 'Complementary skills (Hacker + Hustler)', 'Friendship only'], correctIndex: 1 },
];

// ==========================================
// EXPORTED MODULES
// ==========================================

export function Pillar17ModuleA({ onNext }) {
    return (
        <InteractiveLayout title="Module A: Foundations" subtitle="Why Partner?">
            <div className="cw-prose">
                <p>You can go fast alone, or far together. But most partnerships fail because they are based on "liking each other" instead of "needing each other".</p>

                <BookInsight title="The Prenup" author="David Gage" book="The Partnership Charter" color="#F97316">
                    "partnerships don't fail because of business problems; they fail because the partners didn't discuss how they would handle problems before they started."
                </BookInsight>

                <h3>Core Concept: The Deadlock</h3>
                <p>A 50/50 split feels fair, but it is a trap. If you disagree, the business freezes and dies. Someone must have the casting vote.</p>

                <h3>Interactive: The Equity Slicer</h3>
                <PartnershipSplitter />

                <CWAlert type="info" title="Activity: The Tough Questions">
                    Before signing, ask your partner:<br />1. What happens if one of us wants to quit?<br />2. How much money can we take out as salary?<br />3. What is our "Divorce" clause?
                </CWAlert>

                <WhyBusinessMatters
                    intro="Partnerships are the quickest lever for growth."
                    points={[
                        { title: "Speed", text: "Why build an audience from zero when you can partner with someone who has 10,000 fans?" },
                        { title: "Capital", text: "Equity is the most expensive currency you have. Don't give it away for work you could just hire a freelancer for." }
                    ]}
                    capeWebCards={{
                        intro: "We act as your technical partner.",
                        items: [
                            { title: "Technical Co-Founder", text: "We provide the code quality of a CTO, without taking 50% of your company." },
                            { title: "Scale Infrastructure", text: "Our systems are built to handle traffic spikes from your marketing partners." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleA17QuizQuestions} title="Partnership Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar17ModuleB({ onNext }) {
    return (
        <InteractiveLayout title="Module B: Legal & Structure" subtitle="Rules of Engagement">
            <div className="cw-prose">
                <p>Handshakes are for friends. Contracts are for professionals. In South Africa, understanding B-BBEE is also critical for landing big deals.</p>

                <BookInsight title="Visionary vs Integrator" author="Gino Wickman" book="Rocket Fuel" color="#111827">
                    "The Visionary sees the future. The Integrator makes it happen. One cannot exist without the other."
                </BookInsight>

                <h3>Core Concept: The Scorecard</h3>
                <p>Large corporates need Level 1-4 suppliers. If you are 51% Black Owned, you are automatically Level 2. This is a massive competitive advantage.</p>

                <h3>Interactive: B-BBEE Simulator</h3>
                <BBBEEInteractive />

                <CWAlert type="error" title="Warning: Fronting">
                    Never give shares to someone just for points if they don't do real work. It is fraud. Go to jail, do not collect R200.
                </CWAlert>

                <WhyBusinessMatters
                    intro="Compliance is a barrier to entry that protects you."
                    points={[
                        { title: "Supply Chain", text: "Corporate procurement departments are lazy. They pick the compliant vendor over the cheaper one." },
                        { title: "Funding", text: "Government grants (NYDA, SEFA) require valid compliance structures." }
                    ]}
                    capeWebCards={{
                        intro: "We help you check the boxes.",
                        items: [
                            { title: "POPIA Compliance", text: "Our forms come with standard consent checkboxes required by law." },
                            { title: "Privacy Policy", text: "We generate standard legal pages to keep your footer compliant." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleB17QuizQuestions} title="Legal Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar17ModuleC({ onNext }) {
    return (
        <InteractiveLayout title="Module C: Strategic Alliances" subtitle="Growing Together">
            <div className="cw-prose">
                <p>Leverage other people's assets. Joint Ventures (JVs) allow you to sell to their list, or use their technology, without merging companies.</p>

                <BookInsight title="Leverage" author="Dan Sullivan" book="Who Not How" color="#4F46E5">
                    "When you have a problem, don't ask 'How do I solve this?'. Ask 'Who can solve this for me?'."
                </BookInsight>

                <h3>Core Concept: The Swap</h3>
                <p>The best deals are cashless. "I give you my product for your customers (Perk), you give me exposure."</p>

                <h3>Interactive: JV Matchmaker</h3>
                <JVCalculator />

                <CWAlert type="success" title="Activity: The Top 10 List">
                    List 10 businesses that already sell to your ideal customer (but aren't competitors). <br />Example: Selling Wedding Cakes? Partner with Florists.
                </CWAlert>

                <WhyBusinessMatters
                    intro="Acquiring customers one by one is slow. Relationships bring them in bulk."
                    points={[
                        { title: "Trust Transfer", text: "When a trusted partner recommends you, their trust transfers to you instantly." },
                        { title: "Zero Cost Marketing", text: "Pay on performance (Commission) instead of praying on Facebook Ads." }
                    ]}
                    capeWebCards={{
                        intro: "We integrate with your partners.",
                        items: [
                            { title: "Affiliate Tracking", text: "We can install tracking codes so you know exactly which partner sent which sale." },
                            { title: "Co-Branded Landing Pages", text: "Spin up a dedicated page for a partner (e.g. capeweb.com/standardbank) in minutes." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleC17QuizQuestions} title="Alliance Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar17Resources({ onNext }) {
    return (
        <InteractiveLayout title="Module D: Partnership Resources" subtitle="Toolkit">
            <div className="cw-prose">
                <ul className="cw-resource-list">
                    <li><strong>The Partnership Charter</strong> by David Gage</li>
                    <li><strong>Rocket Fuel</strong> by Gino Wickman</li>
                    <li><strong>Slicing Pie</strong> (Equity Logic)</li>
                    <li><strong>Standard Bank ESD Portal</strong> (Link)</li>
                </ul>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <CWButton onClick={onNext} variant="primary">Take Final Exam →</CWButton>
                </div>
            </div>
        </InteractiveLayout>
    );
}

export function Pillar17Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
    const questions = pillar17QuizQuestions;
    const [localIndex, setLocalIndex] = useState(0);

    const handleNext = () => { if (localIndex < questions.length - 1) setLocalIndex(prev => prev + 1); };
    const handlePrev = () => { if (localIndex > 0) setLocalIndex(prev => prev - 1); };
    const isLast = localIndex === questions.length - 1;
    const hasAnswered = quizResponses && quizResponses[localIndex] !== undefined;

    return (
        <QuizLayout title="Final Exam: Partnerships" currentStep={localIndex + 1} totalSteps={questions.length}>
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

export function Pillar17Completion({ onNext }) {
    return (
        <ReadingLayout title="Partnership Training Complete!">
            <CWCard style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
                <h2 className="cw-heading-md">Connector Badge Earned!</h2>
                <p style={{ color: 'var(--cw-text-secondary)', margin: '1rem 0' }}>
                    You now know how to multiply your value through strategic alliances.
                </p>
                <CWButton variant="primary" onClick={onNext || (() => window.location.reload())}>Next Pillar: Crisis Management →</CWButton>
            </CWCard>
        </ReadingLayout>
    );
}
