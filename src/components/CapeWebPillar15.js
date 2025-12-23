import React, { useState, useEffect, useRef } from 'react';
import { InteractiveLayout, QuizLayout, ReadingLayout } from './CapeWebLayouts';
import { CWButton, CWCard, CWAlert, BookInsight, CWBadge, CWInput } from './CapeWebUI';
import { pillar15QuizQuestions } from '../data/pillarLibrary';
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
// INTERACTIVE COMPONENTS (Pillar 15)
// ==========================================

function MarginCrusher() {
    const [costPrice, setCostPrice] = useState(100);
    const [sellPrice, setSellPrice] = useState(300);
    const [shipping, setShipping] = useState(85);
    const [ads, setAds] = useState(50);

    const profit = sellPrice - costPrice - shipping - ads;
    const margin = sellPrice > 0 ? Math.round((profit / sellPrice) * 100) : 0;

    let color = '#10B981';
    if (margin < 20) color = '#F59E0B';
    if (profit <= 0) color = '#EF4444';

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#3B82F6', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '0.5rem' }}>🏭 The Margin Crusher</h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.9 }}>See how Shipping and Ads eat your lunch.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Selling Price (R)</label>
                    <input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', fontSize: '1.2rem' }} />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Product Cost (R)</label>
                    <input type="number" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', fontSize: '1.2rem' }} />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Shipping (R)</label>
                    <input type="number" value={shipping} onChange={(e) => setShipping(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', fontSize: '1.2rem' }} />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Ads (R)</label>
                    <input type="number" value={ads} onChange={(e) => setAds(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', fontSize: '1.2rem' }} />
                </div>
            </div>

            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', color: '#1E293B', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Net Profit</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: color }}>R{profit}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: color }}>{margin}% Margin</div>
                {profit < 0 && <div style={{ marginTop: '0.5rem', color: '#EF4444', fontWeight: 'bold' }}>You are losing money on every sale!</div>}
                {margin > 0 && margin < 15 && <div style={{ marginTop: '0.5rem', color: '#F59E0B', fontWeight: 'bold' }}>Analysis: Dangerous zone. Any mistake kills you.</div>}
                {margin > 30 && <div style={{ marginTop: '0.5rem', color: '#10B981', fontWeight: 'bold' }}>Analysis: Healthy E-commerce business.</div>}
            </div>
        </div>
    );
}

function CourierSelector() {
    const [selected, setSelected] = useState(null);
    const options = [
        { id: 'paxi', name: "PAXI (Pep)", cost: "R60", time: "7-9 Days", type: "Economy", desc: "Best for township/rural. Customer collects at Pep." },
        { id: 'courier', name: "Door-to-Door", cost: "R100", time: "1-3 Days", type: "Premium", desc: "Best for professionals. Fast but pricey." },
        { id: 'pargo', name: "Pargo", cost: "R75", time: "3-5 Days", type: "Flexible", desc: "Click & Collect at Clicks/Caltex. Good middle ground." }
    ];

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#F59E0B', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '1.5rem' }}>🚚 Logistics Matchmaker</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {options.map(opt => (
                    <button key={opt.id} onClick={() => setSelected(opt.id)}
                        style={{
                            padding: '1.5rem', borderRadius: '16px', border: 'none', background: selected === opt.id ? '#fff' : 'rgba(255,255,255,0.2)',
                            color: selected === opt.id ? '#D97706' : '#fff', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s',
                            transform: selected === opt.id ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: selected === opt.id ? '0 10px 20px -5px rgba(0,0,0,0.2)' : 'none'
                        }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{opt.name}</span>
                            <span style={{ background: selected === opt.id ? '#D97706' : '#fff', color: selected === opt.id ? '#fff' : '#D97706', padding: '0.2rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>{opt.cost}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.9 }}>
                            <span>⏱ {opt.time}</span>
                            <span>{opt.type}</span>
                        </div>
                        {selected === opt.id && <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem', fontStyle: 'italic' }}>{opt.desc}</div>}
                    </button>
                ))}
            </div>
        </div>
    );
}

function StockSimulator() {
    const [cash, setCash] = useState(10000);
    const [stock, setStock] = useState(0);
    const [day, setDay] = useState(1);

    // Simple logic: Each day, sell 1-5 items at R200 (Cost R100).
    // User buttons: Buy Small (10 units @ R120), Buy Bulk (100 units @ R80).

    // Logic simulated just for visual demo
    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#10B981', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem' }}>The Cashflow Trap</h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Buying too much stock kills your cash.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                <div style={{ background: '#fff', color: '#10B981', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ fontWeight: 800 }}>Just In Time (JIT)</div>
                    <p style={{ fontSize: '0.9rem' }}>Buy 10. Sell 10. Repeat.</p>
                    <div style={{ fontSize: '2rem' }}>✅</div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Safe but more work.</p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ fontWeight: 800 }}>Bulk Import</div>
                    <p style={{ fontSize: '0.9rem' }}>Buy 1000. Sell 10.</p>
                    <div style={{ fontSize: '2rem' }}>🛑</div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Cash stuck in boxes.</p>
                </div>
            </div>
        </div>
    );
}


// ==========================================
// QUIZ DATA (Local)
// ==========================================

const moduleA15QuizQuestions = [
    { question: 'What is "Gross Margin"?', options: ['The total sales amount', 'Wait, no, is it profit?', 'Revenue minus Cost of Goods Sold (The money left to pay rent/ads)'], correctIndex: 2 },
    { question: 'Why is tracking ads/shipping critical?', options: ['It is fun', 'They are "Variable Costs" that scale with sales and can eat all your profit', 'SARS requires it'], correctIndex: 1 },
    { question: 'In "The Goal", what is the most important concept?', options: ['The Bottleneck (Constraint)', 'Working harder', 'Hiring more people'], correctIndex: 0 },
    { question: 'If your margin is 10%, how much revenue do you need to cover R10k of theft?', options: ['R10k', 'R100k', 'R1k'], correctIndex: 1 },
];

const moduleB15QuizQuestions = [
    { question: 'What is "Last Mile Delivery"?', options: ['The final leg of delivery to the customers door (The most expensive part)', 'The first mile', 'Shipping from China'], correctIndex: 0 },
    { question: 'Why offer PAXI (Pep) as an option?', options: ['It is faster', 'It accesses the township economy and is cheaper', 'It is premium'], correctIndex: 1 },
    { question: 'What is "Volumetric Weight"?', options: ['The actual weight', 'Charging based on size (Space occupied) even if item is light', 'Weight of the volume'], correctIndex: 1 },
    { question: 'What does "Shoe Dog" teach us about sourcing?', options: ['It is easy', 'Cash is king and supply chains are fragile', 'Just drop ship'], correctIndex: 1 },
];

const moduleC15QuizQuestions = [
    { question: 'What is "Dead Stock"?', options: ['Inventory that is not selling (Cash trapped in a box)', 'Stock for funeral parlors', 'Out of stock'], correctIndex: 0 },
    { question: 'What is JIT (Just-In-Time)?', options: ['Ordering stock only when needed', 'Ordering 6 months in advance', 'Running late'], correctIndex: 0 },
    { question: 'Why is Theft/Shrinkage a big deal in SA?', options: ['It is annoying', 'It directly reduces Net Profit (1 unit stolen = 10 units sold to recover)', 'It is insured'], correctIndex: 1 },
    { question: 'What is "Landed Cost"?', options: ['The price on Alibaba', 'The total cost including tax, duty, and shipping to your door', 'The shipping fee'], correctIndex: 1 },
];

// ==========================================
// MODULES
// ==========================================

export function Pillar15ModuleA({ onNext }) {
    return (
        <InteractiveLayout title="Module A: Operations & Margins" subtitle="The math of making money">
            <div className="cw-prose">
                <p>Operations is not sexy. But it is where the profit lives. Marketing brings revenue; Operations keeps profit.</p>

                <BookInsight title="The Bottleneck" author="Eliyahu Goldratt" book="The Goal" color="#3B82F6">
                    "An hour lost at a bottleneck is an hour lost for the entire system. An hour saved at a non-bottleneck is a mirage."
                </BookInsight>

                <h3>Core Concept: The Margin Trap</h3>
                <p>New founders look at Revenue ("I made R100k!"). Experienced founders look at Net Profit ("I kept R10k").</p>

                <h3>Interactive: Margin Crusher</h3>
                <MarginCrusher />

                <CWAlert type="warning" title="Warning: Ad Spend">
                    If your Ad Cost per Sale (CPA) is higher than your Gross Margin, you are paying people to take your product.
                </CWAlert>

                <WhyBusinessMatters
                    intro="A 1% improvement in ops can double your profit."
                    points={[
                        { title: "Scalability", text: "If your process is manual, you cannot grow. You need systems." },
                        { title: "Cashflow", text: "Operations determines how fast you get paid vs how fast you pay suppliers." }
                    ]}
                    capeWebCards={{
                        intro: "We automate your ops.",
                        items: [
                            { title: "Zapier Integrations", text: "We connect Shopify to your Accounting automatically." },
                            { title: "Order Tracking", text: "Branded tracking pages to reduce 'Where is my order?' emails." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleA15QuizQuestions} title="Ops Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar15ModuleB({ onNext }) {
    return (
        <InteractiveLayout title="Module B: Logistics" subtitle="Moving atoms">
            <div className="cw-prose">
                <p>In South Africa, logistics is the biggest friction point. "Will it arrive? Will it get stolen?"</p>

                <BookInsight title="The Chaos" author="Phil Knight" book="Shoe Dog" color="#F59E0B">
                    "Supply and demand is always a problem. But supply is the harder problem."
                </BookInsight>

                <h3>Core Concept: The Last Mile</h3>
                <p>Getting a package from JHB to CT is easy. Getting it from the depot to the customer's specific door is hard and expensive.</p>

                <h3>Interactive: Courier Selector</h3>
                <CourierSelector />

                <CWAlert type="info" title="Tip: The Pargo Option">
                    Many people in SA live in areas where couriers struggle to find the address, or they are at work. "Click & Collect" (Pargo/Pudd) solves this.
                </CWAlert>

                <WhyBusinessMatters
                    intro="Shipping speed = Trust."
                    points={[
                        { title: "Conversion Rate", text: "Unexpected shipping costs are the #1 reason for cart abandonment. Be transparent." },
                        { title: "Returns", text: "A smooth return process makes people buy again." }
                    ]}
                    capeWebCards={{
                        intro: "We optimize your checkout.",
                        items: [
                            { title: "Dynamic Shipping", text: "We configure Shopify to show accurate courier rates so you don't lose money on deep rural deliveries." },
                            { title: "Notifications", text: "Automated WhatsApp updates for 'Out for Delivery'." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleB15QuizQuestions} title="Logistics Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar15ModuleC({ onNext }) {
    return (
        <InteractiveLayout title="Module C: Inventory & Sourcing" subtitle="The Art of Stock">
            <div className="cw-prose">
                <p>Inventory is a balancing act. Too little = lost sales. Too much = lost cash.</p>

                <BookInsight title="Lean" author="James Womack" book="Lean Thinking" color="#10B981">
                    "Muda (Waste) is anything that does not create value for the customer. Excess inventory is waste."
                </BookInsight>

                <h3>Core Concept: Landed Cost</h3>
                <p>Don't just calculate the item price. Calculate Item + Shipping + Duty + Clearing + Storage.</p>

                <h3>Interactive: Cashflow Trap</h3>
                <StockSimulator />

                <CWAlert type="error" title="Theft & Shrinkage">
                    In SA, if you don't count it, it disappears. Do weekly stock takes. CCTV in packing areas is mandatory.
                </CWAlert>

                <WhyBusinessMatters
                    intro="Cash is oxygen."
                    points={[
                        { title: "Dead Stock", text: "Holding old stock costs money (storage, insurance, obsolescence). Run a sale to clear it and get cash back." },
                        { title: "Negotiation", text: "Sourcing agents can save you 20%, which goes straight to your bottom line." }
                    ]}
                    capeWebCards={{
                        intro: "We build inventory systems.",
                        items: [
                            { title: "Low Stock Alerts", text: "Automated emails when you need to reorder." },
                            { title: "Supplier Database", text: "We help you organize your supplier contracts digitally." }
                        ]
                    }}
                />

                <MiniQuiz questions={moduleC15QuizQuestions} title="Stock Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar15Resources({ onNext }) {
    return (
        <InteractiveLayout title="Module D: Ops Resources" subtitle="Toolkit">
            <div className="cw-prose">
                <ul className="cw-resource-list">
                    <li><strong>The Courier Guy Portal</strong> - Best for SMEs.</li>
                    <li><strong>PAXI</strong> - Best for Township reach.</li>
                    <li><strong>Merrypak</strong> - Packaging supplies in CT.</li>
                    <li><strong>Shopify Inventory</strong> - Built-in stock tracking.</li>
                </ul>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <CWButton onClick={onNext} variant="primary">Take Final Exam →</CWButton>
                </div>
            </div>
        </InteractiveLayout>
    );
}

export function Pillar15Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
    const questions = pillar15QuizQuestions;
    const [localIndex, setLocalIndex] = useState(0);

    const handleNext = () => { if (localIndex < questions.length - 1) setLocalIndex(prev => prev + 1); };
    const handlePrev = () => { if (localIndex > 0) setLocalIndex(prev => prev - 1); };
    const isLast = localIndex === questions.length - 1;
    const hasAnswered = quizResponses && quizResponses[localIndex] !== undefined;

    return (
        <QuizLayout title="Final Exam: Supply Chain" currentStep={localIndex + 1} totalSteps={questions.length}>
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
                        <CWAlert type={scoreMessage.includes('Pass') || scoreMessage.includes('Delivered') ? 'success' : 'error'}>{scoreMessage}</CWAlert>
                        {(scoreMessage.includes('Pass') || scoreMessage.includes('Delivered')) && (
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

export function Pillar15Completion({ onNext }) {
    return (
        <ReadingLayout title="Supply Chain Master!">
            <CWCard style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏗️</div>
                <h2 className="cw-heading-md">Operator Badge Earned!</h2>
                <p style={{ color: 'var(--cw-text-secondary)', margin: '1rem 0' }}>
                    You now understand that true success is built on boring systems.
                </p>
                <CWButton variant="primary" onClick={onNext || (() => window.location.reload())}>Next Pillar: Investment →</CWButton>
            </CWCard>
        </ReadingLayout>
    );
}
