import React, { useState, useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';
import { InteractiveLayout, QuizLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, BookInsight } from './CapeWebUI';

// ==========================================
// PILLAR 9 QUIZ DATA
// ==========================================
export const pillar9QuizQuestions = [
  {
    question: 'You make R10,000 revenue. Your expenses are R12,000. Traditional accounting says you made a loss. What does the "Profit First" formula force you to do?',
    options: ['Borrow money', 'Take Profit FIRST (e.g. 5%), then force expenses to fit the remainder', 'Close the business'],
    correctIndex: 1,
  },
  {
    question: 'It takes you 1 hour to fix a critical server bug that saves a client R5 million. You charge R1,000 (your hourly rate). They would have happily paid R50,000. What mistake did you make?',
    options: ['You were too fast', 'You used Cost-Plus Pricing instead of Value-Based Pricing', 'You should have worked slower'],
    correctIndex: 1,
  },
  {
    question: 'You get faster at your work. A job that took 10 hours now takes 2. If you charge by the hour, you now make LESS money. What is this trap called?',
    options: ['The Efficiency Penalty (Why hourly billing fails experts)', 'Inflation', 'Market forces'],
    correctIndex: 0,
  },
  {
    question: 'You record R1 million in sales in March (Great!). But the clients only pay in June. In April, you can\'t pay your staff and go bust. What killed you?',
    options: ['Not enough sales', 'Cash Flow / Liquidity Crisis (Profit ≠ Cash)', 'Bad luck'],
    correctIndex: 1,
  },
  {
    question: 'Client A pays R50,000 once. Client B pays R5,000 every month for 3 years (R180k total). Which client increases the valuation of your company?',
    options: ['Client A (Big cash)', 'Client B (Recurring Revenue / MRR)', 'Neither'],
    correctIndex: 1,
  },
  {
    question: 'A customer wants your R150 product, but Door-to-Door courier costs R120. They abandon the cart. What cheaper SA logicstics option could save this sale?',
    options: ['PUDO / Paxi (Locker-to-Locker)', 'Drone delivery', 'Flying it yourself'],
    correctIndex: 0,
  },
  {
    question: 'You want to accept credit cards on your website by tomorrow morning. Do you go to a bank branch or use a Payment Gateway?',
    options: ['Bank Branch (3 week application)', 'Payment Gateway (PayFast/Yoco/Stripe) - Instant setup', 'Cash only'],
    correctIndex: 1,
  },
  {
    question: 'A client asks for "just one small change". Then another. Then another. You end up working 20 hours for free. What is this?',
    options: ['Good service', 'Scope Creep', 'Agile development'],
    correctIndex: 1,
  },
  {
    question: 'You start your business using only your own savings and customer revenue. You have zero debt and zero outside investors. What is this strategy?',
    options: ['Bootstrapping', 'Venture Capital', 'IPO'],
    correctIndex: 0,
  },
  {
    question: 'You send an invoice marked "Due on Receipt". The client ignores it for 4 months. What clause should you have had in your contract?',
    options: ['A polite request', 'Late Payment Penalties / Interest on overdue accounts', 'A discount'],
    correctIndex: 1,
  },
];

// ==========================================
// SHARED UTILS (MiniQuiz)
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
      audio.play().catch(e => console.log('Audio error', e));
    } catch (e) { }
  };

  const handleSelect = (index) => setSelected(index);

  const handleNext = () => {
    const isCorrect = selected === question.correctIndex;
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

  useEffect(() => {
    if (celebrating && counterRef.current) {
      const percentage = Math.round((score / questions.length) * 100);
      const tl = gsap.timeline();
      counterRef.current.classList.remove('celebrate');
      tl.set(counterRef.current, { opacity: 1 })
        .fromTo(counterRef.current,
          { innerText: 0, "--font-variation-weight": 300, scale: 0.8 },
          {
            innerText: percentage, duration: 3, snap: { innerText: 1 }, ease: "linear",
            onUpdate: function () { const val = Math.ceil(this.targets()[0].innerText); counterRef.current.innerHTML = val + "%"; },
            onComplete: () => {
              counterRef.current.classList.add('celebrate');
              const colors = ['#fbda61', '#ff5acd'];
              const runConfetti = confettiModule.default || confettiModule;
              if (typeof runConfetti === 'function') {
                runConfetti({ particleCount: 150, spread: 100, origin: { y: 0.8 }, colors: colors, disableForReducedMotion: true });
              }
              setTimeout(() => setCelebrating(false), 3000);
            }
          }
        )
        .to(counterRef.current, { scale: 1, "--font-variation-weight": 600, duration: 1.2, ease: "elastic.out(1, 0.2)" });
      return () => { if (counterRef.current) counterRef.current.classList.remove('celebrate'); };
    }
  }, [celebrating, score, questions.length]);

  if (celebrating) {
    return (
      <div style={{ marginTop: '3rem', padding: '3rem 2rem', borderRadius: '32px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 20px 50px -10px rgba(31, 38, 135, 0.15)', position: 'relative', overflow: 'hidden', minHeight: '400px', display: 'grid', placeItems: 'center', fontFamily: '"Roboto Flex", sans-serif' }}>
        <div style={{ textAlign: 'center', width: '100%' }}><h1 ref={counterRef} className="counter">0%</h1></div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    return (
      <div style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center', borderRadius: '24px', background: passed ? 'rgba(209, 250, 229, 0.8)' : 'rgba(254, 226, 226, 0.8)', backdropFilter: 'blur(20px)', border: passed ? '3px solid rgba(16, 185, 129, 0.3)' : '3px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{passed ? '🎉' : '📚'}</div>
        <h3 style={{ fontSize: '2rem', color: passed ? '#065F46' : '#991B1B', marginBottom: '1rem' }}>{passed ? 'Great Job!' : 'Keep Learning!'}</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1F2937' }}>You scored {score} out of {questions.length} ({percentage}%)</p>
        <p style={{ color: '#4B5563', marginBottom: '2rem', fontSize: '1.1rem' }}>{passed ? 'You are ready for the next module.' : 'Review the content and try again.'}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <CWButton onClick={handleRestart} variant={passed ? "secondary" : "primary"} style={{ opacity: passed ? 0.9 : 1 }}>{passed ? '↺ Retake Quiz' : '↺ Try Again'}</CWButton>
          {passed && onNext && <CWButton onClick={onNext} variant="primary">Next Module →</CWButton>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '3rem', padding: '2rem 2rem', borderRadius: '32px', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 20px 50px -10px rgba(31, 38, 135, 0.15)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(120deg, rgba(34,211,238,0.15), rgba(244,114,182,0.15), rgba(253,224,71,0.15), rgba(34,211,238,0.15))', backgroundSize: '300% 300%', animation: 'gradientMove 15s ease infinite', zIndex: -1, pointerEvents: 'none' }} />
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Knowledge Check</div>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748B' }}>Question {currentQ + 1} of {questions.length}</span>
      </div>
      <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</h4>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1E293B', lineHeight: 1.5 }}>{question.question}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map((option, index) => (
            <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '16px', border: '2px solid', borderColor: selected === index ? '#0EA5E9' : '#E2E8F0', background: selected === index ? '#F0F9FF' : '#FFFFFF', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: selected === index ? '0 4px 20px rgba(14, 165, 233, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)' }} onClick={() => handleSelect(index)}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: selected === index ? '6px solid #0EA5E9' : '2px solid #CBD5E1', flexShrink: 0, transition: 'all 0.2s ease' }} />
              <span style={{ flex: 1, fontSize: '1.05rem', color: selected === index ? '#0C4A6E' : '#334155', fontWeight: 500 }}>{option}</span>
            </label>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleNext} disabled={selected === null} style={{ padding: '0.75rem 2rem', background: '#0F172A', color: 'white', border: 'none', borderRadius: '100px', fontSize: '1rem', fontWeight: 700, cursor: selected === null ? 'not-allowed' : 'pointer', opacity: selected === null ? 0.5 : 1, transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isLast ? 'Finish Quiz' : 'Next Question'}<span>→</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// INTERACTIVE VISUALS
// ==========================================

function ProfitEquationVisual() {
  const [mode, setMode] = useState('old');
  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
      background: '#22D3EE', color: '#0F172A'
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
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.5)', padding: '0.5rem', borderRadius: '12px' }}>
          <button onClick={() => setMode('old')} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: mode === 'old' ? '#EF4444' : 'transparent', color: mode === 'old' ? '#fff' : '#64748B', cursor: 'pointer', fontWeight: 700, transition: 'all 0.3s' }}>Old Way</button>
          <button onClick={() => setMode('new')} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: mode === 'new' ? '#10B981' : 'transparent', color: mode === 'new' ? '#fff' : '#64748B', cursor: 'pointer', fontWeight: 700, transition: 'all 0.3s' }}>New Way</button>
        </div>

        <div style={{ fontSize: '1.5rem', fontWeight: 900, background: 'rgba(255,255,255,0.9)', padding: '2rem', borderRadius: '20px', display: 'flex', gap: '0.8rem', alignItems: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {mode === 'old' ? (
            <>
              <span>Sales</span>
              <span>-</span>
              <span>Expenses</span>
              <span>=</span>
              <span style={{ color: '#64748B' }}>Profit (Leftovers)</span>
            </>
          ) : (
            <>
              <span>Sales</span>
              <span>-</span>
              <span style={{ color: '#10B981' }}>Profit (First)</span>
              <span>=</span>
              <span>Expenses</span>
            </>
          )}
        </div>
        <p style={{ textAlign: 'center', color: '#475569', maxWidth: '450px', lineHeight: 1.6, fontWeight: 500 }}>
          {mode === 'old'
            ? "In the old way, you pay everyone else first. You only keep what's accidentally left over (which is usually zero)."
            : "In Profit First, you take your profit immediately. Then you force the business to survive on the remainder."
          }
        </p>
      </div>
    </div>
  )
}

function PricingSliderVisual() {
  const [hours, setHours] = useState(1);
  const hourlyRate = 500;
  const valuePrice = 50000;

  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
      background: '#F472B6', color: '#0F172A'
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
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px' }}>
          <label style={{ marginRight: '1rem', fontWeight: 'bold', color: '#334155' }}>Hours Spent:</label>
          <input type="range" min="1" max="10" value={hours} onChange={(e) => setHours(e.target.value)} style={{ marginRight: '1rem' }} />
          <span style={{ fontWeight: 700, color: '#0F172A' }}>{hours} hours</span>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, padding: '1.5rem', border: '2px solid #CBD5E1', borderRadius: '16px', background: 'rgba(255,255,255,0.9)', minWidth: '200px' }}>
            <strong style={{ color: '#64748B' }}>Hourly Billing</strong>
            <div style={{ fontSize: '2rem', color: '#EF4444', fontWeight: 900, margin: '0.5rem 0' }}>R{hours * hourlyRate}</div>
            <small style={{ color: '#94A3B8' }}>Punishes speed.</small>
          </div>
          <div style={{ flex: 1, padding: '1.5rem', border: '2px solid #10B981', borderRadius: '16px', background: '#ECFDF5', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.2)', minWidth: '200px' }}>
            <strong style={{ color: '#065F46' }}>Value Billing</strong>
            <div style={{ fontSize: '2rem', color: '#10B981', fontWeight: 900, margin: '0.5rem 0' }}>R{valuePrice}</div>
            <small style={{ color: '#064E3B' }}>Rewards results.</small>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScenarioToggle({ oldTitle, oldContent, newTitle, newContent }) {
  const [view, setView] = useState('old');
  return (
    <div style={{
      margin: '3rem 0',
      padding: '2rem',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
      background: '#FB923C', color: '#0F172A'
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
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', background: 'rgba(241, 245, 249, 0.8)', padding: '0.5rem', borderRadius: '100px', width: 'fit-content', margin: '0 auto 2rem' }}>
          <button onClick={() => setView('old')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'old' ? '#fff' : 'transparent', color: view === 'old' ? '#EF4444' : '#64748B', fontWeight: 800, boxShadow: view === 'old' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>{oldTitle}</button>
          <button onClick={() => setView('new')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'new' ? '#fff' : 'transparent', color: view === 'new' ? '#10B981' : '#64748B', fontWeight: 800, boxShadow: view === 'new' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>{newTitle}</button>
        </div>
        {view === 'old' ? (
          <div style={{ padding: '1.5rem', background: 'rgba(254, 242, 242, 0.9)', borderRadius: '24px', border: '2px solid #FECACA', animation: 'fadeIn 0.5s' }}>
            {oldContent}
          </div>
        ) : (
          <div style={{ padding: '1.5rem', background: 'rgba(236, 253, 245, 0.9)', borderRadius: '24px', border: '2px solid #A7F3D0', animation: 'fadeIn 0.5s' }}>
            {newContent}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// PILLAR 9 MODULES A-F
// ==========================================

// Module A: The Money Machine
export function Pillar9ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: Profit First" subtitle="Don't eat the seed corn.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Parkinson's Law states: "Expenses rise to meet income".
          If you have R10,000 in the bank, you will find a way to spend R10,000.
        </p>

        <ProfitEquationVisual />

        <BookInsight title="Profit First" author="Mike Michalowicz" book="Profit First" color="#3B82F6">
          <p>"When you take your profit first, you flip the script. You are forced to innovate because you have less money to operate."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Cash flow kills more businesses than lack of profit. If getting paid is hard for your client, you will go broke waiting for the cheque.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. Speed of Money</h4>
              <p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>
                The faster you get paid, the faster you can reinvest. Invoice automation is non-negotiable for scaling.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. Frictionless Checkout</h4>
              <p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>
                Every extra field in a checkout form drops conversion by 10%. We make paying you the easiest part of the transaction.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build your financial infrastructure.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EC4899', marginTop: '2px' }}>➜</span>
                <span><strong>Seamless Payments:</strong> We integrate PayFast, Yoco, and Stripe tailored to your audience.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EC4899', marginTop: '2px' }}>➜</span>
                <span><strong>Automated Invoicing:</strong> We link your site to Xero so invoices send automatically when orders are placed.</span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Why does 'Profit First' suggest taking profit before expenses?", options: ["It is illegal", "To ensure you always have a buffer and force the business to run leaner", "To hide money from SARS"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module B: Pricing
export function Pillar9ModuleB({ onNext }) {
  return (
    <InteractiveLayout title="Module B: Pricing Strategy" subtitle="Billing for value, not time.">
      <div className="cw-prose">
        <p className="cw-text-body">
          If a plumber fixes a burst pipe in 5 minutes, do you pay him for 5 minutes (R50)? No.
          You pay him R1000 because he stopped your house from flooding. That is <strong>Value-Based Pricing</strong>.
        </p>

        <PricingSliderVisual />

        <CWAlert type="info" title="Charm Pricing">
          Humans read left-to-right.
          <br /><strong>R400</strong> feels like "Four Hundred".
          <br /><strong>R399</strong> feels like "Three Hundred something".
          It works. Use it.
        </CWAlert>

        <MiniQuiz
          questions={[
            { question: "What is the downside of hourly billing (Cost-Plus)?", options: ["You get too rich", "It punishes efficiency (the better/faster you get, the less you earn)", "Clients hate it"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module C: Payments
export function Pillar9ModuleC({ onNext }) {
  return (
    <InteractiveLayout title="Module C: Getting Paid" subtitle="Frictionless Revenue.">
      <div className="cw-prose">
        <p className="cw-text-body">
          If you make it hard to pay, people won't pay.
        </p>

        <ScenarioToggle
          oldTitle="The 1990s Way"
          oldContent="Sending a PDF attached to an email. 'Please EFT to this account and fax proof'."
          newTitle="The Modern Way"
          newContent="Sending a 'Pay Now' link (PayFast/Yoco). Client punches in card details. Done."
        />

        <MiniQuiz
          questions={[
            { question: "How should you invoice to maximize speed of payment?", options: ["Send a fax", "Send a digital invoice with a 'Pay Now' link (Credit Card/EFT)", "Wait for a cheque"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module D: Invoicing
export function Pillar9ModuleD({ onNext }) {
  return (
    <InteractiveLayout title="Module D: Contracts & Scope" subtitle="Professionalism is a Contract.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Mike Monteiro's famous rule: <strong>"F*ck you, pay me."</strong>
          Never start work without a contract and a deposit.
        </p>

        <CWCard>
          <h4>Scope Creep</h4>
          <p><strong>Client:</strong> "Oh, just add this one small thing."</p>
          <p><strong>You (Without Contract):</strong> "Okay..." (Works for free).</p>
          <p><strong>You (With Contract):</strong> "Sure! That is outside the original scope. I will send a quote for the addition."</p>
        </CWCard>

        <MiniQuiz
          questions={[
            { question: "What is 'Scope Creep'?", options: ["A scary person", "When a project unknowingly grows beyond its original agreement without extra pay", "A type of tax"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module E: Logistics
export function Pillar9ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: Logistics" subtitle="Moving atoms.">
      <div className="cw-prose">
        <p className="cw-text-body">
          In SA, "Door-to-Door" courier can be expensive (R100+).
        </p>

        <CWCard>
          <h4>Alternative Options</h4>
          <ul>
            <li><strong>PUDO (The Courier Guy):</strong> Lockers at petrol stations. Cost ~R60.</li>
            <li><strong>Paxi (Pep):</strong> Store-to-Store. Cost ~R60.</li>
          </ul>
        </CWCard>

        <MiniQuiz
          questions={[
            { question: "What is a benefit of PUDO lockers?", options: ["They are free", "They offer a cheaper, convenient alternative to door-to-door courier", "They are only in America"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module F: Funding
export function Pillar9ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: Funding Ecosystem" subtitle="Show me the money.">
      <div className="cw-prose">
        <p className="cw-text-body">
          <strong>Bootstrapping:</strong> You funding it yourself. (Best: You keep 100% equity).
          <br /><strong>Government:</strong> MNYDA, SEFA. (Hard paperwork).
          <br /><strong>VC (Venture Capital):</strong> They give you money, but expect 100x growth and own your soul.
        </p>
        <MiniQuiz
          questions={[
            { question: "What is the main advantage of Bootstrapping?", options: ["It is easy", "You retain 100% control and equity", "You get free money"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// ==========================================
// MODULE J: RESOURCES
// ==========================================
export function Pillar9Resources({ onNext }) {
  const openLink = (url) => window.open(url, '_blank');

  const ResourceCard = ({ title, category, description, link }) => (
    <div onClick={() => openLink(link)} style={{
      padding: '1.5rem', background: 'white', borderRadius: '16px',
      border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.2s',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', gap: '0.5rem'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#94A3B8'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
    >
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#F1F5F9', padding: '0.25rem 0.5rem', borderRadius: '4px', alignSelf: 'flex-start' }}>
        {category}
      </div>
      <h4 style={{ margin: '0.5rem 0 0', fontSize: '1.1rem', color: '#0F172A' }}>{title} ↗</h4>
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#4B5563', lineHeight: '1.5' }}>{description}</p>
    </div>
  );

  return (
    <InteractiveLayout title="Module J: Resources" subtitle="Finance Toolkit">
      <div className="cw-prose">
        <p>Your finance stack determines your speed. Automate accounting, payments, and invoicing so you can focus on sales.</p>

        <h3 style={{ marginTop: '2rem' }}>🛠️ The Finance Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Accounting"
            title="Xero"
            description="The gold standard for cloud accounting. Automates bank feeds and invoicing."
            link="https://www.xero.com/"
          />
          <ResourceCard
            category="Payments (Global)"
            title="Stripe"
            description="The best developer experience for accepting cards online. Works in SA now."
            link="https://stripe.com/"
          />
          <ResourceCard
            category="Payments (Local)"
            title="PayFast"
            description="SA's leading payment gateway. Essential for accepting EFT/Scan-to-Pay."
            link="https://payfast.io/"
          />
          <ResourceCard
            category="POS"
            title="Yoco"
            description="Accept card payments in person. Great for markets and retail."
            link="https://www.yoco.com/"
          />
          <ResourceCard
            category="Logistics"
            title="Pudo (Courier Guy)"
            description="Locker-to-Locker delivery. The cheapest way to ship small e-commerce parcels in SA."
            link="https://www.pudo.co.za/"
          />
        </div>

        <h3 style={{ marginTop: '3rem' }}>📚 Recommended Reading</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="System"
            title="Profit First"
            description="By Mike Michalowicz. Take your profit first, run your business on what's left."
            link="https://mikemichalowicz.com/profit-first/"
          />
          <ResourceCard
            category="Mindset"
            title="The Millionaire Fastlane"
            description="By MJ DeMarco. Why wealth is created by business systems, not saving lattes."
            link="https://www.themillionairefastlane.com/"
          />
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <h4>Ready to Get Paid?</h4>
          <p style={{ marginBottom: '1.5rem', color: '#64748B' }}>Money is the lifeblood of business. You now know how to manage it.</p>
          <CWButton onClick={onNext} variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Take Final Exam 🏁</CWButton>
        </div>
      </div>
    </InteractiveLayout>
  );
}

// ==========================================
// FINAL QUIZ COMPONENT
// ==========================================

export function Pillar9Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  // Local state handling if props missing
  const [localResponses, setLocalResponses] = useState({});
  const activeResponses = quizResponses || localResponses;
  const activeSetResponse = onSelect || ((qMvc, optIdx) => setLocalResponses(prev => ({ ...prev, [qMvc]: optIdx })));

  const questions = pillar9QuizQuestions;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = activeResponses[currentQuestionIndex] !== undefined;

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(c => c + 1);
  };
  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(c => c - 1);
  };
  const handleScore = () => {
    if (onScore) {
      onScore();
    } else {
      let correct = 0;
      questions.forEach((q, i) => { if (activeResponses[i] === q.correctIndex) correct++; });
      if (correct >= 8) setIsPassed(true);
    }
    if (onFinish) onFinish();
  };

  if (scoreMessage && scoreMessage.includes('Pass')) {
    return (
      <CWCard>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <CWHeading level={3}>Financial Wizard</CWHeading>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{scoreMessage}</p>
          <CWButton onClick={onFinish}>Continue to Certificate →</CWButton>
        </div>
      </CWCard>
    );
  }

  return (
    <QuizLayout title="Final Exam: Financial Systems" currentStep={currentQuestionIndex + 1} totalSteps={questions.length}>
      <div style={{ padding: '0 1rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', minHeight: '60px' }}>
          {questions[currentQuestionIndex].question}
        </h3>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          {questions[currentQuestionIndex].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => activeSetResponse(currentQuestionIndex, idx)}
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: activeResponses[currentQuestionIndex] === idx ? '2px solid #0b0f1a' : '1px solid #E5E7EB',
                background: activeResponses[currentQuestionIndex] === idx ? '#F8FAFC' : '#fff',
                textAlign: 'left',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: activeResponses[currentQuestionIndex] === idx ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeResponses[currentQuestionIndex] === idx ? '#0b0f1a' : 'transparent', borderColor: activeResponses[currentQuestionIndex] === idx ? '#0b0f1a' : '#CBD5E1' }}>
                {activeResponses[currentQuestionIndex] === idx && <div style={{ width: '10px', height: '10px', background: '#fff', borderRadius: '50%' }} />}
              </div>
              {option}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <CWButton variant="ghost" onClick={handlePrev} disabled={currentQuestionIndex === 0} style={{ opacity: currentQuestionIndex === 0 ? 0 : 1 }}>← Previous</CWButton>
          {isLastQuestion ? (
            <CWButton variant="primary" onClick={handleScore} disabled={!hasAnsweredCurrent}>Submit Exam 🏁</CWButton>
          ) : (
            <CWButton variant="primary" onClick={handleNext} disabled={!hasAnsweredCurrent}>Next Question →</CWButton>
          )}
        </div>
        {scoreMessage && !scoreMessage.includes('Pass') && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#FEF2F2', color: '#991B1B', borderRadius: '8px', textAlign: 'center' }}>{scoreMessage}</div>
        )}
      </div>
    </QuizLayout>
  );
}

export function Pillar9Completion() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>💸</h1>
      <CWHeading level={2}>Finance Master</CWHeading>
      <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '1rem auto' }}>
        You now speak the language of money. You know how to price, how to bill, and most importantly, how to keep the profit.
      </p>
    </div>
  );
}
