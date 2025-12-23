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

function RoleBuilder() {
    const [role, setRole] = useState('Assistant');
    const [tasks, setTasks] = useState([]);
    const [drafted, setDrafted] = useState(false);

    const commonTasks = {
        'Assistant': ['Email Management', 'Calendar Scheduling', 'Travel Booking', 'Data Entry'],
        'Sales Rep': ['Cold Calling', 'Lead Qual', 'Closing', 'CRM Updates'],
        'Developer': ['Frontend Code', 'Bug Fixes', 'Deployment', 'Testing']
    };

    const toggleTask = (t) => {
        if (tasks.includes(t)) setTasks(tasks.filter(x => x !== t));
        else setTasks([...tasks, t]);
    };

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#ec4899', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '2rem' }}>Job Spec Generator</h3>
            {!drafted ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label>What role are you hiring?</label>
                    <select value={role} onChange={e => { setRole(e.target.value); setTasks([]); }} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none' }}>
                        <option value="Assistant">Virtual Assistant</option>
                        <option value="Sales Rep">Sales Representative</option>
                        <option value="Developer">Web Developer</option>
                    </select>

                    <label>Select Key Responsibilities:</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {commonTasks[role].map(t => (
                            <button key={t} onClick={() => toggleTask(t)} style={{
                                padding: '0.5rem', borderRadius: '8px', border: '2px solid #fff',
                                background: tasks.includes(t) ? '#fff' : 'transparent',
                                color: tasks.includes(t) ? '#ec4899' : '#fff', cursor: 'pointer', fontWeight: 'bold'
                            }}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setDrafted(true)} disabled={tasks.length === 0} style={{ padding: '1rem', marginTop: '1rem', borderRadius: '100px', border: 'none', background: '#fff', color: '#ec4899', fontWeight: 'bold', cursor: 'pointer' }}>Generate Job Ad ➔</button>
                </div>
            ) : (
                <div style={{ background: '#fff', color: '#333', padding: '1.5rem', borderRadius: '16px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Wanted: Excellent {role}</h4>
                    <p>We are looking for a rockstar to join our team. You will be responsible for:</p>
                    <ul>{tasks.map(t => <li key={t}>{t}</li>)}</ul>
                    <p>If you are detail-oriented and ready to grow, apply now!</p>
                    <button onClick={() => setDrafted(false)} style={{ marginTop: '1rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#ec4899' }}>Start Over</button>
                </div>
            )}
        </div>
    );
}

function EmployeeCostCalc() {
    const [salary, setSalary] = useState(15000);
    const uif = salary * 0.01;
    const sdl = salary * 0.01;
    const unknown = salary * 0.20; // Hidden costs
    const total = salary + uif + sdl + unknown;

    return (
        <div style={{ margin: '3rem 0', padding: '2rem', borderRadius: '24px', background: '#6366f1', color: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '2rem' }}>True Cost to Company</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Net Salary Offer (ZAR)</label>
                    <input type="range" min="5000" max="50000" step="1000" value={salary} onChange={(e) => setSalary(Number(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>R{salary.toLocaleString()}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Salary:</span> <span>R{salary.toLocaleString()}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>UIF (1%):</span> <span>R{uif.toLocaleString()}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SDL (1%):</span> <span>R{sdl.toLocaleString()}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fca5a5' }}><span>Hidden (Equip, Training):</span> <span>R{unknown.toLocaleString()}</span></div>
                    <div style={{ borderTop: '1px solid #fff', marginTop: '0.5rem', paddingTop: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        Total: R{total.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// QUIZ DATA
// ==========================================

const moduleA13QuizQuestions = [
    { question: 'When should you hire your first employee?', options: ['When you feel lonely', 'When you are doing low-value tasks that prevent you from doing high-value tasks', 'When you have extra money'], correctIndex: 1 },
    { question: 'What is the "e-Myth" trap?', options: ['Thinking that because you understand the technical work, you understand the business that does that technical work', 'Hiring online', 'Using email'], correctIndex: 0 },
    { question: 'Who is usually the best first hire?', options: ['A Sales VP', 'An Assistant (Admin/ Ops) to free up your time', 'Another you'], correctIndex: 1 },
];

const moduleB13QuizQuestions = [
    { question: 'Can you fire someone easily in South Africa?', options: ['Yes, Donald Trump style', 'No, use the CCMA procedures (Process + Substantive Fairness)', 'Yes if you pay them'], correctIndex: 1 },
    { question: 'What is a "Probation Period"?', options: ['A time to relax', 'A 3-month period to assess fit before permanent employment rights fully kick in', 'Unpaid work'], correctIndex: 1 },
    { question: 'What must every employee have by law?', options: ['A signed contract and payslip', 'A laptop', 'Free lunch'], correctIndex: 0 },
];

const moduleC13QuizQuestions = [
    { question: 'What is "Company Culture"?', options: ['The ping pong table', 'What people do when you are not in the room', 'The office decor'], correctIndex: 1 },
    { question: 'How often should you do 1-on-1s?', options: ['Once a year', 'Weekly (to clear blockers)', 'Never'], correctIndex: 1 },
    { question: 'If an employee makes a mistake, you should:', options: ['Yell immediately', 'Ask "What part of the system failed?"', 'Fire them'], correctIndex: 1 },
];

const pillar13QuizQuestions = [
    ...moduleA13QuizQuestions, ...moduleB13QuizQuestions, ...moduleC13QuizQuestions
];

// ==========================================
// EXPORTED MODULES
// ==========================================

export function Pillar13ModuleA({ onNext }) {
    return (
        <InteractiveLayout title="Module A: Your First Hire" subtitle="Buying Back Your Time">
            <div className="cw-prose">
                <p>You cannot grow if you are doing everything. The first hire is the scariest, but also the most liberating.</p>
                <BookInsight title="Buy Back Your Time" author="Dan Martell" book="Buy Back Your Time" color="#ec4899">
                    "Don't hire to grow your business. Hire to buy back your time."
                </BookInsight>
                <h3>Core Concept: The Value Ladder</h3>
                <p>Calculate your hourly rate. If you want to earn R100k/month, your hour is worth R600. If you are doing R100/hr admin work, you are losing money.</p>
                <h3>Interactive: Job Spec Generator</h3>
                <RoleBuilder />
                <CWAlert type="info" title="Activity: The Time Audit">
                    Look at your calendar. Highlight everything that is NOT "Selling" or "Building". That is the job description for your new Assistant.
                </CWAlert>
                <WhyBusinessMatters
                    intro="A team multiplies your output. 1 + 1 = 3."
                    points={[
                        { title: "Specialization", text: "You can't be good at everything. Hire people who are better than you at specific things." },
                        { title: "Revenue per Employee", text: "This is the key metric. If a new hire doesn't help you earn more than they cost (3x), don't hire them." }
                    ]}
                    capeWebCards={{
                        intro: "We help you appear bigger than you are.",
                        items: [
                            { title: "Team Page", text: "Even if it's just you and a freelancer, a professional Team Bio page builds trust." },
                            { title: "Role-Specific Emails", text: "We set up accounts@, support@, and sales@ emails to create departmental structure." }
                        ]
                    }}
                />
                <MiniQuiz questions={moduleA13QuizQuestions} title="Hiring Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar13ModuleB({ onNext }) {
    return (
        <InteractiveLayout title="Module B: Labour Law & Contracts" subtitle="Playing by the Rules">
            <div className="cw-prose">
                <p>South African Labour Law is strict. You need to protect yourself and treat people fairly.</p>
                <h3>Core Concept: Substantive vs Procedural Fairness</h3>
                <p><strong>Substantive:</strong> Did they actually do something wrong?<br /><strong>Procedural:</strong> Did you follow the correct process to discipline them?</p>
                <BookInsight title="CCMA Rules" author="Labour Relations Act" book="SA Labour Law" color="#ef4444">
                    "The worst expensive mistake is an unfair dismissal case."
                </BookInsight>
                <h3>Interactive: Cost Calculator</h3>
                <EmployeeCostCalc />
                <div style={{ background: '#F3F4F6', padding: '1.5rem', borderRadius: '12px', margin: '2rem 0' }}>
                    <strong>Golden Rule:</strong> Always have a signed contract before day 1. No contract = indefinite employment by default.
                </div>
                <WhyBusinessMatters
                    intro="Good contracts prevent bad breakups."
                    points={[
                        { title: "Clarity", text: "A contract sets expectations. 'This is what you do, this is what you get'." },
                        { title: "IP Protection", text: "Ensure your contract states that any code/work they create belongs to the company, not them." }
                    ]}
                    capeWebCards={{
                        intro: "We secure your digital access.",
                        items: [
                            { title: "User Permissions", text: "We set up your CMS so staff can edit blogs but cannot delete the website." },
                            { title: "Offboarding", text: "Our systems allow you to revoke access instantly if an employee leaves." }
                        ]
                    }}
                />
                <MiniQuiz questions={moduleB13QuizQuestions} title="Legal Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar13ModuleC({ onNext }) {
    return (
        <InteractiveLayout title="Module C: Leadership & Culture" subtitle="Setting the Standard">
            <div className="cw-prose">
                <p>Culture is not a poster on the wall. Culture is what you tolerate. If you tolerate lateness, that is your culture.</p>
                <BookInsight title="Extreme Ownership" author="Jocko Willink" book="Extreme Ownership" color="#10B981">
                    "There are no bad teams, only bad leaders."
                </BookInsight>
                <h3>Core Concept: The Weekly 1-on-1</h3>
                <p>Meet with your direct reports for 30 mins every week. Ask two questions:<br />1. What are you working on?<br />2. How can I help you?</p>
                <CWAlert type="success" title="Activity: The Vision Speech">
                    On the first day, tell your new hire clearly: "This is where we are going, and this is why you are important."
                </CWAlert>
                <WhyBusinessMatters
                    intro="People leave managers, not companies."
                    points={[
                        { title: "Retention", text: "It costs R50k to replace an employee. Keeping them happy is cheaper." },
                        { title: "Autonomy", text: "Great leaders give the goal, not the method. Let them figure out 'How'." }
                    ]}
                    capeWebCards={{
                        intro: "We support your internal comms.",
                        items: [
                            { title: "Intranet / Knowledge Base", text: "We can build a private section of your site for staff training manuals." },
                            { title: "Slack / Teams Setup", text: "We help integrate communication tools into your website workflows." }
                        ]
                    }}
                />
                <MiniQuiz questions={moduleC13QuizQuestions} title="Culture Knowledge Check" onNext={onNext} />
            </div>
        </InteractiveLayout>
    );
}

export function Pillar13Resources({ onNext }) {
    return (
        <InteractiveLayout title="Module D: Team Resources" subtitle="Toolkit">
            <div className="cw-prose">
                <ul className="cw-resource-list">
                    <li><strong>Buy Back Your Time</strong> by Dan Martell</li>
                    <li><strong>Extreme Ownership</strong> by Jocko Willink</li>
                    <li><strong>CCMA Website</strong> (Templates)</li>
                    <li><strong>Deel / Remote.com</strong> (For global hiring)</li>
                </ul>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <CWButton onClick={onNext} variant="primary">Take Final Exam →</CWButton>
                </div>
            </div>
        </InteractiveLayout>
    );
}

export function Pillar13Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
    const questions = pillar13QuizQuestions;
    const [localIndex, setLocalIndex] = useState(0);

    const handleNext = () => { if (localIndex < questions.length - 1) setLocalIndex(prev => prev + 1); };
    const handlePrev = () => { if (localIndex > 0) setLocalIndex(prev => prev - 1); };
    const isLast = localIndex === questions.length - 1;
    const hasAnswered = quizResponses && quizResponses[localIndex] !== undefined;

    return (
        <QuizLayout title="Final Exam: Leadership" currentStep={localIndex + 1} totalSteps={questions.length}>
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

export function Pillar13Completion({ onNext }) {
    return (
        <ReadingLayout title="Leadership Training Complete!">
            <CWCard style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                <h2 className="cw-heading-md">Boss Badge Earned!</h2>
                <p style={{ color: 'var(--cw-text-secondary)', margin: '1rem 0' }}>
                    You are ready to hire, lead, and grow without burning out.
                </p>
                <CWButton variant="primary" onClick={onNext || (() => window.location.reload())}>Next Pillar: Scaling & Operations →</CWButton>
            </CWCard>
        </ReadingLayout>
    );
}
