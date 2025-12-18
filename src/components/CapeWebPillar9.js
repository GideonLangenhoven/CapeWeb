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
    question: 'In "Profit First", what is the core equation change?',
    options: ['Sales - Expenses = Profit', 'Sales - Profit = Expenses', 'Sales + Sales = Rich'],
    correctIndex: 1,
  },
  {
    question: 'What is "Value-Based Pricing"?',
    options: ['Charing based on your hourly rate', 'Charging based on the value/outcome you provide to the client', 'Charging the lowest price possible'],
    correctIndex: 1,
  },
  {
    question: 'Which of these is a popular South African payment gateway?',
    options: ['Stripe', 'PayFast', 'Alipay'],
    correctIndex: 1,
  },
  {
    question: 'Why should you generally avoid "Cost-Plus" pricing?',
    options: ['It is illegal', 'It punishes you for being efficient (faster work = less money)', 'It is too hard to calculate'],
    correctIndex: 1,
  },
  {
    question: 'What is "Bootstrapping"?',
    options: ['Selling boots', 'Funding your business yourself using operating revenue, without external investors', 'Getting a bank loan'],
    correctIndex: 1,
  },
  {
    question: 'What is a "Retainer" model?',
    options: ['A dental device', 'A model where clients pay a fixed monthly fee for ongoing services', 'A one-off project'],
    correctIndex: 1,
  },
  {
    question: 'In eCommerce logistics (SA), what is a "PUDO" locker?',
    options: ['A type of dog', 'Pick Up Drop Off locker (providing cheaper delivery options)', 'A tracking number'],
    correctIndex: 1,
  },
  {
    question: 'What happens if you run out of Cash Flow, even if you are "Profitable" on paper?',
    options: ['Nothing', 'You go bankrupt (Insolvency)', 'You get a medal'],
    correctIndex: 1,
  },
  {
    question: 'What is "Charm Pricing"?',
    options: ['Being nice', 'Pricing at R99 instead of R100', 'Pricing significantly higher than competitors'],
    correctIndex: 1,
  },
  {
    question: 'Why is a Contract important before starting work?',
    options: ['To look professional', 'To clearly define scope, payment terms, and prevent "Scope Creep"', 'It is not important'],
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
        <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Assessment</div>
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

function UnitEconomicsCalculator() {
  const [price, setPrice] = useState(1000);
  const [cogs, setCogs] = useState(200);
  const [cac, setCac] = useState(300);

  const margin = price - cogs;
  const ltvCac = (margin / cac).toFixed(1);

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
      <h4 style={{ color: '#0F172A', marginBottom: '1.5rem' }}>Unit Economics Calculator 📈</h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Price (R)</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '1rem' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Cost to Fulfill (R)</label>
          <input type="number" value={cogs} onChange={(e) => setCogs(Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '1rem' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Cost to Acquire (CAC) (R)</label>
          <input type="number" value={cac} onChange={(e) => setCac(Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '1rem' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '150px', background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>Gross Margin</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: margin > 0 ? '#10B981' : '#EF4444' }}>R{margin}</div>
        </div>
        <div style={{ flex: 1, minWidth: '150px', background: ltvCac >= 3 ? '#ECFDF5' : '#FEF2F2', padding: '1.5rem', borderRadius: '16px', border: '1px solid', borderColor: ltvCac >= 3 ? '#A7F3D0' : '#FECACA' }}>
          <div style={{ fontSize: '0.7rem', color: ltvCac >= 3 ? '#065F46' : '#991B1B', fontWeight: 800, textTransform: 'uppercase' }}>LTV / CAC Ratio</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: ltvCac >= 3 ? '#059669' : '#DC2626' }}>{ltvCac}x</div>
          <small style={{ color: '#444' }}>{ltvCac >= 3 ? 'Healthy (Scale)' : 'Danger (Inefficient)'}</small>
        </div>
      </div>
    </div>
  );
}

function CashflowForecaster() {
  const [cash, setCash] = useState(50000);
  const [revenue, setRevenue] = useState(20000);
  const [burn, setBurn] = useState(15000);

  const profit = revenue - burn;
  const runway = profit >= 0 ? 'Infinity' : Math.abs(cash / profit).toFixed(1);

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#0F172A', color: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
      <h4 style={{ color: '#38BDF8', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>🛢️</span> Cash Runway Forecaster
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Cash in Bank</label>
          <input type="range" min="10000" max="500000" step="5000" value={cash} onChange={(e) => setCash(Number(e.target.value))} style={{ width: '100%', accentColor: '#38BDF8' }} />
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>R{cash.toLocaleString()}</div>
        </div>
        <div>
          <label style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Monthly Burn</label>
          <input type="range" min="5000" max="100000" step="1000" value={burn} onChange={(e) => setBurn(Number(e.target.value))} style={{ width: '100%', accentColor: '#F87171' }} />
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>R{burn.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Runway (Months)</div>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: runway === 'Infinity' ? '#10B981' : burn > cash ? '#EF4444' : '#FBBF24', transition: 'all 0.3s' }}>
          {runway} {runway !== 'Infinity' && 'Mo'}
        </div>
        <p style={{ color: '#94A3B8', marginTop: '1rem', fontSize: '0.9rem' }}>
          {runway === 'Infinity' ? 'You are profitable! Your cash is growing.' : `At this rate, your business expires in ${runway} months.`}
        </p>
      </div>
    </div>
  );
}

function ScenarioToggle({ oldTitle, oldContent, newTitle, newContent }) {
  const [view, setView] = useState('old');
  return (
    <div style={{ margin: '3rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', background: 'rgba(241, 245, 249, 0.7)', padding: '0.5rem', borderRadius: '100px', width: 'fit-content', margin: '0 auto 2rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <button onClick={() => setView('old')} style={{ padding: '0.6rem 1.8rem', borderRadius: '100px', border: 'none', background: view === 'old' ? '#fff' : 'transparent', color: view === 'old' ? '#EF4444' : '#64748B', fontWeight: 800, boxShadow: view === 'old' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>{oldTitle}</button>
        <button onClick={() => setView('new')} style={{ padding: '0.6rem 1.8rem', borderRadius: '100px', border: 'none', background: view === 'new' ? '#fff' : 'transparent', color: view === 'new' ? '#10B981' : '#64748B', fontWeight: 800, boxShadow: view === 'new' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>{newTitle}</button>
      </div>
      <div style={{
        padding: '2rem',
        borderRadius: '32px',
        border: '1px solid',
        borderColor: view === 'old' ? '#FECACA' : '#A7F3D0',
        background: view === 'old' ? 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)' : 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
        minHeight: '150px',
        transition: 'all 0.5s ease',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05, pointerEvents: 'none' }}>
          {view === 'old' ? '📉' : '🚀'}
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h4 style={{ margin: '0 0 1rem 0', color: view === 'old' ? '#991B1B' : '#065F46', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {view === 'old' ? 'Warning' : 'Strategy'}
          </h4>
          <div style={{ fontSize: '1.1rem', color: view === 'old' ? '#7F1D1D' : '#064E3B', lineHeight: '1.6' }}>
            {view === 'old' ? oldContent : newContent}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfitEquationVisual() {
  const [mode, setMode] = useState('old');
  return (
    <div style={{ margin: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', background: '#F1F5F9', padding: '0.5rem', borderRadius: '100px' }}>
        <button onClick={() => setMode('old')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', border: 'none', background: mode === 'old' ? '#EF4444' : 'transparent', color: mode === 'old' ? '#fff' : '#64748B', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>The Gap Way</button>
        <button onClick={() => setMode('new')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', border: 'none', background: mode === 'new' ? '#10B981' : 'transparent', color: mode === 'new' ? '#fff' : '#64748B', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>Profit First</button>
      </div>

      <div style={{
        fontSize: '1.8rem',
        fontWeight: 900,
        background: '#fff',
        padding: '2.5rem',
        borderRadius: '32px',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid #E2E8F0',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {mode === 'old' ? (
          <>
            <span style={{ color: '#0F172A' }}>Sales</span>
            <span style={{ color: '#94A3B8' }}>-</span>
            <span style={{ color: '#0F172A' }}>Expenses</span>
            <span style={{ color: '#94A3B8' }}>=</span>
            <span style={{ color: '#EF4444', textDecoration: 'line-through' }}>Profit</span>
          </>
        ) : (
          <>
            <span style={{ color: '#0F172A' }}>Sales</span>
            <span style={{ color: '#94A3B8' }}>-</span>
            <span style={{ color: '#10B981', background: '#ECFDF5', padding: '0.2rem 0.8rem', borderRadius: '8px' }}>Profit</span>
            <span style={{ color: '#94A3B8' }}>=</span>
            <span style={{ color: '#0F172A' }}>Expenses</span>
          </>
        )}
      </div>
      <p style={{ textAlign: 'center', color: '#64748B', maxWidth: '500px', fontSize: '1.1rem', lineHeight: '1.6' }}>
        {mode === 'old'
          ? "Most businesses pay everyone else first. They are left with 'accidental profit', which is usually zero or negative."
          : "Flipping the formula ensures you get paid first. This forces your company to be innovative and frugal with the remainder."
        }
      </p>
    </div>
  )
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
          Parkinson's Law states: <strong>"Expenses rise to meet income"</strong>.
          If you have R10,000 in your account, you will find a way to spend R10,000. To build wealth, you must change the formula.
        </p>

        <ProfitEquationVisual />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #A7F3D0' }}>
          <CWHeading level={3} style={{ color: '#065F46', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💰</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#064E3B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Operational Efficiency.</strong> Most businesses run on "accidental profit"—whatever is left over after everyone else gets paid. By taking your profit first, you force your business to innovate and operate within a smaller budget, creating a lean, high-margin machine.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-monitoring" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Financial Dashboards</a>: We build custom dashboards that pull your real-time bank data and automate the "Profit First" allocation percentages, so you always know where your money is.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <BookInsight title="Profit First" author="Mike Michalowicz" book="Profit First" color="#3B82F6">
          <p>"When you take your profit first, you flip the script. You are forced to innovate because you have less money to operate."</p>
        </BookInsight>

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

        <UnitEconomicsCalculator />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', borderRadius: '24px', border: '1px solid #93C5FD' }}>
          <CWHeading level={3} style={{ color: '#1E3A8A', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏷️</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E3A8A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Scalable Margins.</strong> If you bill by the hour, you are selling your life. There are only 24 hours in a day. To scale, you must bill for the <em>result</em> you produce. This allows you to disconnect your income from your time.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #93C5FD', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ecommerce" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Dynamic Pricing AI</a>: We can implement machine learning models into your eCommerce store that adjust prices based on supply, demand, and competitor pricing (High-Frequency Trading for your shop).
                </span>
              </li>
            </ul>
          </div>
        </div>

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
          If you make it hard to pay, people won't pay. Any friction in the checkout process—extra fields, slow loading, lack of payment options—is directly lost revenue.
        </p>

        <ScenarioToggle
          oldTitle="The 1990s Way 📠"
          oldContent="Sending a PDF attached to an email. 'Please EFT to this account and fax proof of payment to us before we start work'."
          newTitle="The Modern Way ⚡"
          newContent="Sending a 'Pay Now' link via SMS or WhatsApp (PayFast/Yoco/Stripe). Client punches in card details or uses Apple/Google Pay. Paid in 15 seconds."
        />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', borderRadius: '24px', border: '1px solid #FCD34D' }}>
          <CWHeading level={3} style={{ color: '#92400E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💳</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#78350F', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Cash Conversion Cycle.</strong> The faster you get paid, the faster you can reinvest that money into growth. Waiting 30 days for an EFT kills small businesses. Getting paid instantly via cards or digital wallets is the fuel for scaling.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FCD34D', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ecommerce" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Payment Gateway Integration</a>: We integrate SA's top gateways (PayFast, Yoco, Paystack) into your site, enabling Apple Pay, Google Pay, and instant EFT for maximum conversion.
                </span>
              </li>
            </ul>
          </div>
        </div>

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
          Never start physical work, or even deep strategy, without a signed contract and a deposit.
        </p>

        <CWCard>
          <h4 style={{ color: '#0F172A' }}>Scope Creep: The Silent Killer 🥷</h4>
          <p><strong>Client:</strong> "Oh, while you are there, can you just add this one small thing? It should only take 5 minutes."</p>
          <p><strong>You (Without Contract):</strong> "Okay..." (Then you work for 3 hours for free).</p>
          <p style={{ marginTop: '1rem', padding: '1rem', background: '#ECFDF5', borderRadius: '12px', borderLeft: '4px solid #10B981' }}>
            <strong>You (With Contract):</strong> "I can definitely add that! Since it is outside the original agreed scope, I will send a change-request quote for the addition. Which card should I bill?"
          </p>
        </CWCard>

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)', borderRadius: '24px', border: '1px solid #CBD5E1' }}>
          <CWHeading level={3} style={{ color: '#334155', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚖️</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E293B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Risk Mitigation.</strong> A contract isn't just about getting paid; it's about defining the boundaries of your liability. Without it, you are exposed to endless revisions, payment delays, and legal misunderstandings that can drain your resources.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #CBD5E1', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ai-agents-sales-team" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Automated Onboarding</a>: We build AI workflows that automatically generate contracts, send them for e-signature via HelloSign/DocuSign, and trigger the deposit invoice the moment the client says "Yes."
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is 'Scope Creep'?", options: ["A scary person", "When a project unknowingly grows beyond its original agreement without extra pay", "A type of tax"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module E: Logistics
export function Pillar9ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: Logistics" subtitle="Moving atoms.">
      <div className="cw-prose">
        <p className="cw-text-body">
          In South Africa, delivery is the "Final Boss" of eCommerce. "Door-to-Door" courier can be expensive (R100+), often costing more than the product itself.
        </p>

        <ScenarioToggle
          oldTitle="Traditional Courier 🚚"
          oldContent="R100 shipping fee. Customer must be home between 8am and 5pm. High failure rate if they step out for milk."
          newTitle="PUDO/Paxi 📦"
          newContent="R60 shipping fee. Customer picks up from a locker or shop at their own convenience. Zero failed deliveries. Cheaper for you and them."
        />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#9D174D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📍</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#831843', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Customer Satisfaction.</strong> Shipping costs are the #1 reason for cart abandonment. By offering cheaper, locker-based alternatives, you lower the barrier to entry and make your products accessible to a wider demographic who may not have a reliable home delivery address.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ecommerce" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Logistics Integration</a>: We integrate PUDO and Paxi plugins directly into your WooCommerce or Shopify store, so your customers can choose their nearest locker on a map during checkout.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is a benefit of PUDO lockers?", options: ["They are free", "They offer a cheaper, convenient alternative to door-to-door courier", "They are only in America"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module F: Funding
export function Pillar9ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: Funding & Cashflow" subtitle="Fuel for the fire.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Profit is a theory. Cash is a fact. You can be "Profitable" on paper but still go bankrupt if your cash is tied up in unpaid invoices or inventory.
        </p>

        <CashflowForecaster />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)', borderRadius: '24px', border: '1px solid #A5F3FC' }}>
          <CWHeading level={3} style={{ color: '#083344', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🚀</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#164E63', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Strategic Runway.</strong> Knowing exactly how many months you have before the lights go out allows you to make calm, calculated decisions instead of desperate ones. If you know you have 6 months of runway, you can focus on building long-term value instead of chasing "panic revenue."
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A5F3FC', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=custom-web-apps" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Reporting Automation</a>: We build automated financial reports that send a weekly "Runway Alert" to your phone, so you never have to guess if you can afford that next big hire.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the main advantage of Bootstrapping?", options: ["It is easy", "You retain 100% control and equity", "You get free money"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
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
