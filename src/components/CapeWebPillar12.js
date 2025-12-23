import React, { useState, useEffect, useRef } from 'react';
import { InteractiveLayout, QuizLayout, ReadingLayout } from './CapeWebLayouts';
import { CWButton, CWCard, CWAlert, BookInsight, CWBadge } from './CapeWebUI';
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
                }}>ASSESSMENT</span>
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
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            fontSize: '1rem', fontWeight: '500', color: '#1F2937',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}>
                        <div style={{
                            width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #D1D5DB',
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
                        background: '#713F12', color: '#fff', padding: '1rem 2rem', borderRadius: '100px', border: 'none',
                        fontWeight: '700', fontSize: '1rem', cursor: selected === null ? 'not-allowed' : 'pointer',
                        opacity: selected === null ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                    {isLast ? 'Finish Assessment' : 'Next Question'} <span>➔</span>
                </button>
            </div>
        </div>
    );
}

function WhyBusinessMatters({ intro, points, capeWebCards }) {
    return (
        <div style={{ background: '#FDF2F8', borderRadius: '24px', padding: '2.5rem', margin: '3rem 0', color: '#831843' }}>
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
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 30px -5px rgba(253, 242, 248, 0.8)' }}>
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
// INTERACTIVE COMPONENTS
// ==========================================

function PipelineVisual() {
    const [leads, setLeads] = useState(100);
    const [rate, setRate] = useState(10);
    const deals = Math.floor(leads * (rate / 100));
    const value = deals * 5000;

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#3B82F6', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '2rem' }}>The Sales Funnel</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '80%', padding: '1rem', background: 'rgba(255,255,255,0.2)', textAlign: 'center', borderRadius: '12px' }}>
                    Leads In: {leads}
                    <input type="range" min="10" max="500" value={leads} onChange={(e) => setLeads(Number(e.target.value))} style={{ width: '100%', marginTop: '0.5rem' }} />
                </div>
                <div style={{ width: '40px', fontSize: '2rem' }}>⬇</div>
                <div style={{ width: '60%', padding: '1rem', background: 'rgba(255,255,255,0.3)', textAlign: 'center', borderRadius: '12px' }}>
                    Conversion Rate: {rate}%
                    <input type="range" min="1" max="50" value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: '100%', marginTop: '0.5rem' }} />
                </div>
                <div style={{ width: '40px', fontSize: '2rem' }}>⬇</div>
                <div style={{ width: '40%', padding: '1.5rem', background: '#fff', color: '#1D4ED8', textAlign: 'center', borderRadius: '16px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {deals} Sales<br />
                    <span style={{ fontSize: '1.5rem', color: '#047857' }}>R{value.toLocaleString()}</span> revenue
                </div>
            </div>
        </div>
    );
}

function ObjectionDojo() {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const cards = [
        { objection: "It's too expensive.", rebuttal: "Price is what you pay. Value is what you get. If this saves you R50k, is R5k expensive?" },
        { objection: "I need to think about it.", rebuttal: "Understood. What specifically is the concern? Usually, it's Price, Trust, or Timing." },
        { objection: "We are happy with our current supplier.", rebuttal: "Great. I'm not asking you to switch today. I'm asking for a 15-min chat to see if we can be a backup." }
    ];

    return (
        <div style={{ margin: '3rem 0', perspective: '1000px', cursor: 'pointer' }} onClick={() => setFlipped(!flipped)}>
            <div style={{
                padding: '3rem', borderRadius: '24px', textAlign: 'center', background: flipped ? '#10B981' : '#EF4444',
                color: '#fff', transition: 'transform 0.6s', transformStyle: 'preserve-3d', transform: flipped ? 'rotateX(180deg)' : 'rotateX(0deg)', position: 'relative'
            }}>
                <div style={{ backfaceVisibility: 'hidden' }}>
                    <h3>OBJECTION:</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>"{cards[index].objection}"</div>
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>(Click to Flip)</div>
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateX(180deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3>REBUTTAL:</h3>
                    <div style={{ fontSize: '1.5rem', padding: '0 2rem' }}>"{cards[index].rebuttal}"</div>
                    <button onClick={(e) => { e.stopPropagation(); setFlipped(false); setTimeout(() => setIndex((index + 1) % cards.length), 300); }} style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '100px', border: 'none', background: '#fff', color: '#047857', cursor: 'pointer' }}>Next Card ➔</button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// QUIZ DATA
// ==========================================

const moduleA12QuizQuestions = [
    { question: 'What is the "Top of Funnel"?', options: ['The most expensive product', 'The stage where you pour champagne', 'The process of finding new Leads (Prospecting)'], correctIndex: 2 },
    { question: 'Which is better: Inbound or Outbound?', options: ['Inbound only', 'Both (Inbound is easier, Outbound is faster/controllable)', 'Neither'], correctIndex: 1 },
    { question: 'What is a "Lead"?', options: ['A metal', 'Someone who has shown interest in your product', 'A signed customer'], correctIndex: 1 },
];

const moduleB12QuizQuestions = [
    { question: 'What is the goal of the First Meeting?', options: ['To sign the contract immediately', 'To talk for 2 hours', 'To diagnose the problem (Discovery)'], correctIndex: 2 },
    { question: 'If you talk more than 50% of the time, you are:', options: ['Winning', 'Losing (You should be listening)', 'Teaching'], correctIndex: 1 },
    { question: 'What is a "Features vs Benefits" error?', options: ['Explaining the drill features (RPM) instead of the hole (Result)', 'Talking about price', 'Being too nice'], correctIndex: 0 },
];

const moduleC12QuizQuestions = [
    { question: 'When a client says "It is too expensive", what do they usually mean?', options: ['They have R0 in the bank', 'They do not see enough VALUE yet to justify the price', 'They hate you'], correctIndex: 1 },
    { question: 'What is "Following Up"?', options: ['Stalking', 'Professional persistence until you get a Yes or No', 'Annoying'], correctIndex: 1 },
    { question: 'What does "Always Be Closing" mean today?', options: ['Force the sale', 'Always be moving to the Next Step clearly', 'Close the door'], correctIndex: 1 },
];

const pillar12QuizQuestions = [
    ...moduleA12QuizQuestions, ...moduleB12QuizQuestions, ...moduleC12QuizQuestions
];

// ==========================================
// EXPORTED MODULES
// ==========================================

export function Pillar12ModuleA({ onNext }) {
    return (
        <InteractiveLayout title="Module A: Prospecting" subtitle="Filling the Funnel">
            <div className="cw-prose">
                <p>Sales is not luck. It is a numbers game. You need a system to find people who have the problem you solve.</p>
                <BookInsight title="Fanatical Prospecting" author="Jeb Blount" book="Fanatical Prospecting" color="#3B82F6">
                    "The number one reason for empty bank accounts is an empty pipeline."
                </BookInsight>
                <h3>Core Concept: The Pipeline</h3>
                <p>Visualize your sales as water flowing through a pipe. If you don't put water in the top (Leads), nothing comes out the bottom (Cash).</p>
                <h3>Interactive: Pipeline Simulator</h3>
                <PipelineVisual />
                <CWAlert type="info" title="Activity: The Power Hour">
                    Commit to 1 hour every morning. Do nothing but reach out to 20 new people. Do this for 30 days and your life will change.
                </CWAlert>
                <WhyBusinessMatters
                    intro="Without sales, you don't have a business. You have a hobby."
                    points={[
                        { title: "Cashflow", text: "Sales solve almost every problem. If you have revenue, you can hire help." },
                        { title: "Validation", text: "People vote with their wallets. A sale is the only proof that your product works." }
                    ]}
                    capeWebCards={{
                        intro: "We help you capture leads automatically.",
                        items: [
                            { title: "Lead Magnets", text: "We build landing pages that give away value (PDFs, Guides) in exchange for emails." },
                            { title: "CRM Integration", text: "We connect your forms to HubSpot so no lead is ever lost." }
                        ]
                    }}
                />
                <MiniQuiz questions={moduleA12QuizQuestions} title="Prospecting Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar12ModuleB({ onNext }) {
    return (
        <InteractiveLayout title="Module B: The Pitch" subtitle="Diagnose Before Prescribing">
            <div className="cw-prose">
                <p>Amateurs pitch. Professionals diagnose. Your job is not to sell, it is to find out if you can help.</p>
                <BookInsight title="The Challenger" author="Matthew Dixon" book="The Challenger Sale" color="#8B5CF6">
                    "Customers don't want a relationship. They want a new perspective."
                </BookInsight>
                <h3>Core Concept: Questions are Weapons</h3>
                <p>Ask "Spin" questions. Situation, Problem, Implication, Need-Payoff. Make them feel the pain before you offer the pill.</p>
                <div style={{ background: '#F3F4F6', padding: '1.5rem', borderRadius: '12px', margin: '2rem 0' }}>
                    <strong>Bad Pitch:</strong> "We have the best servers and fastest code."<br />
                    <strong>Good Pitch:</strong> "I see your site takes 5s to load. Data shows you lose 40% of customers at 3s. That's R50k/month lost. We can fix that."
                </div>
                <WhyBusinessMatters
                    intro="A good pitch creates trust. A bad pitch creates resistance."
                    points={[
                        { title: "Authority", text: "When you diagnose their problem better than they can, they automatically trust your solution." },
                        { title: "Higher Prices", text: "Doctors charge more than pharmacists. Be the Doctor." }
                    ]}
                    capeWebCards={{
                        intro: "We position you as the expert.",
                        items: [
                            { title: "Case Studies", text: "We build a 'Results' page on your site proving you have done this before." },
                            { title: "Professional Polish", text: "A broken website screams 'Amateur'. A slick site screams 'Pro'." }
                        ]
                    }}
                />
                <MiniQuiz questions={moduleB12QuizQuestions} title="Pitch Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar12ModuleC({ onNext }) {
    return (
        <InteractiveLayout title="Module C: Closing" subtitle="Handling Objections">
            <div className="cw-prose">
                <p>An objection is not a "No". It is a request for more information. Learn to love "No".</p>
                <BookInsight title="The Close" author="Alex Hormozi" book="$100M Offers" color="#EF4444">
                    "Make people an offer so good they would feel stupid saying no."
                </BookInsight>
                <h3>Core Concept: The Rebuttal</h3>
                <p>Don't argue. Agree, Empathize, then Redirect.</p>
                <h3>Interactive: The Objection Dojo</h3>
                <ObjectionDojo />
                <CWAlert type="success" title="Activity: The Contract">
                    Never leave a meeting without a "Next Step". Send the contract immediately while emotions are high.
                </CWAlert>
                <WhyBusinessMatters
                    intro="Closing is about certainty. Transfer your certainty to them."
                    points={[
                        { title: "Prediction", text: "If you know your closing rate (e.g. 20%), you know exactly how many leads you need to hit target." },
                        { title: "Growth", text: "You can't eat 'Maybe'. You can eat 'Yes'." }
                    ]}
                    capeWebCards={{
                        intro: "We reduce friction in the close.",
                        items: [
                            { title: "Online Signatures", text: "We integrate HelloSign/DocuSign so clients can sign on their phone instantly." },
                            { title: "Payment Links", text: "We add Yoco/PayFast links to your invoices for instant payment." }
                        ]
                    }}
                />
                <MiniQuiz questions={moduleC12QuizQuestions} title="Closing Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar12Resources({ onNext }) {
    return (
        <InteractiveLayout title="Module D: Sales Resources" subtitle="Toolkit">
            <div className="cw-prose">
                <ul className="cw-resource-list">
                    <li><strong>Fanatical Prospecting</strong> by Jeb Blount</li>
                    <li><strong>The Way of the Wolf</strong> by Jordan Belfort</li>
                    <li><strong>$100M Offers</strong> by Alex Hormozi</li>
                    <li><strong>HubSpot CRM</strong> (Free Plan)</li>
                </ul>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <CWButton onClick={onNext} variant="primary">Take Final Exam →</CWButton>
                </div>
            </div>
        </InteractiveLayout>
    );
}

export function Pillar12Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
    const questions = pillar12QuizQuestions;
    const [localIndex, setLocalIndex] = useState(0);

    const handleNext = () => { if (localIndex < questions.length - 1) setLocalIndex(prev => prev + 1); };
    const handlePrev = () => { if (localIndex > 0) setLocalIndex(prev => prev - 1); };
    const isLast = localIndex === questions.length - 1;
    const hasAnswered = quizResponses && quizResponses[localIndex] !== undefined;

    return (
        <QuizLayout title="Final Exam: Sales Mastery" currentStep={localIndex + 1} totalSteps={questions.length}>
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

export function Pillar12Completion({ onNext }) {
    return (
        <ReadingLayout title="Sales Training Complete!">
            <CWCard style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦁</div>
                <h2 className="cw-heading-md">Rainmaker Badge Earned!</h2>
                <p style={{ color: 'var(--cw-text-secondary)', margin: '1rem 0' }}>
                    You now know how to hunt, feed the pipeline, and close the deal.
                </p>
                <CWButton variant="primary" onClick={onNext || (() => window.location.reload())}>Next Pillar: Team & Leadership →</CWButton>
            </CWCard>
        </ReadingLayout>
    );
}
