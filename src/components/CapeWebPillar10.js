import React, { useState, useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';
import { InteractiveLayout, QuizLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, BookInsight } from './CapeWebUI';

// ==========================================
// PILLAR 10 QUIZ DATA
// ==========================================
export const pillar10QuizQuestions = [
  {
    question: 'What is a "Vanity Metric"?',
    options: ['A metric that makes you feel good but doesn\'t help you make decisions (e.g. Total Likes)', 'A metric about mirrors', 'A difficult metric'],
    correctIndex: 0,
  },
  {
    question: 'In "Lean Analytics", what is the "One Metric That Matters" (OMTM)?',
    options: ['The only number you should ever look at', 'The single metric you focus on improving at your current stage of growth', 'Revenue'],
    correctIndex: 1,
  },
  {
    question: 'What is the difference between Google Analytics 4 (GA4) and the old UA?',
    options: ['GA4 is blue', 'GA4 is Event-based (User did X), UA was Session-based (User visited site)', 'GA4 costs money'],
    correctIndex: 1,
  },
  {
    question: 'What is "Conversion Rate"?',
    options: ['The speed of currency exchange', 'The percentage of visitors who complete a desired action (e.g. Buy)', 'The number of visitors'],
    correctIndex: 1,
  },
  {
    question: 'What is Google Tag Manager (GTM) used for?',
    options: ['Managing hashtags', 'A container to deploy tracking codes (Pixels/Tags) without editing website code every time', 'Writing blog posts'],
    correctIndex: 1,
  },
  {
    question: 'What is "Attribution" in marketing?',
    options: ['Giving credit to the correct marketing channel for a sale', 'Blaming someone', 'Commenting on posts'],
    correctIndex: 0,
  },
  {
    question: 'Why is A/B Testing important?',
    options: ['It is fun', 'It replaces "guessing" with data-proven decisions (e.g. Red button vs Green button)', 'It is mandatory'],
    correctIndex: 1,
  },
  {
    question: 'What is a "Cohort Analysis"?',
    options: ['Analyzing groups of users who joined at the same time to see if they stay longer', 'Analyzing code', 'A medical test'],
    correctIndex: 0,
  },
  {
    question: 'What does "LTV" stand for?',
    options: ['Long Term Video', 'Lifetime Value (How much a customer spends in total)', 'Low Tech Value'],
    correctIndex: 1,
  },
  {
    question: 'According to "Measure What Matters", what are OKRs?',
    options: ['Only Know Rules', 'Objectives and Key Results', 'Old Key Records'],
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

function TagBucketSim() {
  const [tags, setTags] = useState([]);
  const availableTags = ['Facebook Pixel', 'Google Ads', 'Hotjar', 'LinkedIn Insight', 'TikTok Pixel'];

  const addTag = (tag) => {
    if (!tags.includes(tag)) setTags([...tags, tag]);
  };

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
      <h4 style={{ color: '#0F172A', marginBottom: '1.5rem', textAlign: 'center' }}>The GTM "Bucket" 🪣</h4>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem' }}>
        Click to pour tracking tags into your website bucket. No code edits required!
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
        {availableTags.map(tag => (
          <button
            key={tag}
            onClick={() => addTag(tag)}
            disabled={tags.includes(tag)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '100px',
              border: '1px solid #CBD5E1',
              background: tags.includes(tag) ? '#E2E8F0' : '#fff',
              color: tags.includes(tag) ? '#94A3B8' : '#0F172A',
              cursor: tags.includes(tag) ? 'default' : 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            + {tag}
          </button>
        ))}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '300px',
        height: '200px',
        border: '4px solid #3B82F6',
        borderTop: 'none',
        borderRadius: '0 0 40px 40px',
        margin: '0 auto',
        position: 'relative',
        background: 'rgba(59, 130, 246, 0.05)',
        display: 'flex',
        flexDirection: 'column-reverse',
        padding: '1rem',
        gap: '0.5rem',
        overflow: 'hidden'
      }}>
        {tags.map((tag, i) => (
          <div
            key={tag}
            style={{
              background: '#3B82F6',
              color: '#fff',
              padding: '0.5rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              textAlign: 'center',
              animation: 'slideDown 0.5s ease'
            }}
          >
            {tag} ACTIVE
          </div>
        ))}
        {tags.length === 0 && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>Bucket is Empty</div>}
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
          {view === 'old' ? '📊' : '📈'}
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h4 style={{ margin: '0 0 1rem 0', color: view === 'old' ? '#991B1B' : '#065F46', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {view === 'old' ? 'The Old Way' : 'The Data Way'}
          </h4>
          <div style={{ fontSize: '1.1rem', color: view === 'old' ? '#7F1D1D' : '#064E3B', lineHeight: '1.6' }}>
            {view === 'old' ? oldContent : newContent}
          </div>
        </div>
      </div>
    </div>
  );
}

function VanityMetricVisual() {
  const [mode, setMode] = useState('vanity');
  return (
    <div style={{ margin: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', background: '#F1F5F9', padding: '0.5rem', borderRadius: '100px' }}>
        <button onClick={() => setMode('vanity')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', border: 'none', background: mode === 'vanity' ? '#3B82F6' : 'transparent', color: mode === 'vanity' ? '#fff' : '#64748B', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>Vanity</button>
        <button onClick={() => setMode('action')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', border: 'none', background: mode === 'action' ? '#10B981' : 'transparent', color: mode === 'action' ? '#fff' : '#64748B', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>Actionable</button>
      </div>

      <div style={{
        padding: '3rem',
        borderRadius: '32px',
        textAlign: 'center',
        width: '100%',
        maxWidth: '500px',
        background: mode === 'vanity'
          ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
          : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        color: 'white',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '0.5rem', fontFamily: '"Roboto Flex", sans-serif' }}>
          {mode === 'vanity' ? '1.2M' : '412'}
        </div>
        <div style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 800, opacity: 0.9 }}>
          {mode === 'vanity' ? 'Followers' : 'Orders'}
        </div>
        <div style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '16px', fontSize: '1rem', fontWeight: 500, backdropFilter: 'blur(10px)' }}>
          {mode === 'vanity' ? '🎉 "Look at me! I am famous!" (Profit: R0)' : '💰 "My business is growing." (Profit: R50,000)'}
        </div>
      </div>
    </div>
}

function FunnelCalculator() {
  const [visitors, setVisitors] = useState(1000);
  const [cart, setCart] = useState(100);
  const [checkout, setCheckout] = useState(50);
  const [sales, setSales] = useState(10);

  const cartRate = ((cart / visitors) * 100).toFixed(1);
  const checkoutRate = ((checkout / cart) * 100).toFixed(1);
  const salesRate = ((sales / checkout) * 100).toFixed(1);

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
      <h4 style={{ color: '#0F172A', marginBottom: '1.5rem', textAlign: 'center' }}>Funnel Leak Detector 🚰</h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Visitors</label>
          <input type="number" value={visitors} onChange={(e) => setVisitors(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>To Cart</label>
          <input type="number" value={cart} onChange={(e) => setCart(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>To Checkout</label>
          <input type="number" value={checkout} onChange={(e) => setCheckout(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Sales</label>
          <input type="number" value={sales} onChange={(e) => setSales(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ background: '#3B82F6', height: '40px', width: '100%', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>Visitors: {visitors}</div>
        <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.7rem', fontWeight: 800 }}>↓ {cartRate}% Move to Cart</div>
        <div style={{ background: '#60A5FA', height: '40px', width: `${(cart / visitors) * 100}%`, minWidth: '40px', margin: '0 auto', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>{cart}</div>
        <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.7rem', fontWeight: 800 }}>↓ {checkoutRate}% Move to Checkout</div>
        <div style={{ background: '#93C5FD', height: '40px', width: `${(checkout / visitors) * 100}%`, minWidth: '35px', margin: '0 auto', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', fontSize: '0.8rem', fontWeight: 700 }}>{checkout}</div>
        <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.7rem', fontWeight: 800 }}>↓ {salesRate}% Buy</div>
        <div style={{ background: '#BFDBFE', height: '40px', width: `${(sales / visitors) * 100}%`, minWidth: '30px', margin: '0 auto', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', fontSize: '0.8rem', fontWeight: 700 }}>{sales}</div>
      </div>
    </div>
  );
}

function AttributionVisualizer() {
  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#0F172A', color: '#fff', borderRadius: '24px' }}>
      <h4 style={{ color: '#38BDF8', marginBottom: '1.5rem', textAlign: 'center' }}>The Customer Journey 🗺️</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        <div style={{ minWidth: '120px', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📸</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>Instagram Ad</div>
          <div style={{ fontSize: '0.6rem', color: '#94A3B8' }}>First Touch</div>
        </div>
        <div style={{ color: '#94A3B8' }}>➔</div>
        <div style={{ minWidth: '120px', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>Google Search</div>
          <div style={{ fontSize: '0.6rem', color: '#94A3B8' }}>Evaluation</div>
        </div>
        <div style={{ color: '#94A3B8' }}>➔</div>
        <div style={{ minWidth: '120px', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📧</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>Email Offer</div>
          <div style={{ fontSize: '0.6rem', color: '#94A3B8' }}>Retention</div>
        </div>
        <div style={{ color: '#94A3B8' }}>➔</div>
        <div style={{ minWidth: '120px', padding: '1rem', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💰</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>SALE</div>
          <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>Last Touch</div>
        </div>
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center' }}>
        <strong>The Trap:</strong> If you only look at "Last Touch," you might delete your Instagram ads, not realizing they started the whole journey.
      </p>
    </div>
  );
}

function ABTestVisual() {
  const [winner, setWinner] = useState(null);
  return (
    <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
      <h4 style={{ color: '#0F172A', marginBottom: '1.5rem', textAlign: 'center' }}>Live A/B Testing 🧪</h4>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <div
          onClick={() => setWinner('A')}
          style={{ cursor: 'pointer', padding: '1.5rem', border: '2px solid', borderColor: winner === 'A' ? '#EF4444' : '#E2E8F0', borderRadius: '20px', textAlign: 'center', background: winner === 'A' ? '#FEF2F2' : 'white', flex: 1, transition: 'all 0.3s' }}
        >
          <div style={{ width: '100%', height: '40px', background: '#EF4444', marginBottom: '1rem', borderRadius: '100px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>Click Here</div>
          <strong>Variant A</strong>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#EF4444', marginTop: '0.5rem' }}>1.2%</div>
          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Conversion</div>
        </div>
        <div
          onClick={() => setWinner('B')}
          style={{ cursor: 'pointer', padding: '1.5rem', border: '2px solid', borderColor: winner === 'B' ? '#10B981' : '#E2E8F0', borderRadius: '20px', textAlign: 'center', background: winner === 'B' ? '#ECFDF5' : 'white', flex: 1, transition: 'all 0.3s' }}
        >
          <div style={{ width: '100%', height: '40px', background: '#10B981', marginBottom: '1rem', borderRadius: '100px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>Claim Discount</div>
          <strong>Variant B</strong>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10B981', marginTop: '0.5rem' }}>4.8%</div>
          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Conversion</div>
        </div>
      </div>
      {winner && (
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: winner === 'B' ? '#059669' : '#DC2626', fontWeight: 700 }}>
          {winner === 'B' ? '🚀 B Wins! "Benefit-driven" copy outperformed "Action-driven" copy by 4x.' : '📈 A is losing. Your users prefer clear value propositions over generic buttons.'}
        </p>
      )}
    </div>
  )
}



// ==========================================
// PILLAR 10 MODULES A-G
// ==========================================

// Module A: Fundamentals
export function Pillar10ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: Data vs Vibes" subtitle="The Truth Serum.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Humans are biased. We think our design is cool because we like its colors. Data tells us nobody clicks the primary button.
          To build a scaling business, you must separate <strong>"Ego Metrics"</strong> from <strong>"Engine Metrics"</strong>.
        </p>

        <VanityMetricVisual />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #A7F3D0' }}>
          <CWHeading level={3} style={{ color: '#065F46', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📊</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#064E3B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Strategic Focus.</strong> If you focus on Vanity Metrics (Likes, Followers, Pageviews), you might feel successful while going bankrupt. If you focus on Actionable Metrics (Conversion Rate, LTV, CAC), you can precisely dial in your growth.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-monitoring" style={{ color: '#3B82F6', textDecoration: 'underline' }}>KPI Architecture</a>: We define your "One Metric That Matters" and build the tracking necessary to measure it accurately, cutting through the noise of useless data.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <BookInsight title="Vanity vs Actionable" author="Alistair Croll" book="Lean Analytics" color="#3B82F6">
          <p>"If a metric doesn't change how you behave, it is a bad metric."</p>
        </BookInsight>

        <MiniQuiz
          questions={[
            { question: "What distinguishes an Actionable Metric from a Vanity Metric?", options: ["Actionable metrics are harder to calculate", "Actionable metrics change your behavior/decisions; Vanity metrics just feed your ego", "Vanity metrics are illegal"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// Module B: GA4
export function Pillar10ModuleB({ onNext }) {
  return (
    <InteractiveLayout title="Module B: Google Analytics 4" subtitle="The web is a movie.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Google Analytics 4 (GA4) is a revolutionary change in how we track users. The old way was about "Sessions" (visits). The new way is about "Events" (interactions).
        </p>

        <ScenarioToggle
          oldTitle="Old Analytics (UA) 📺"
          oldContent="Measured 'Sessions' (Visits). Assumed people just read a page like a newspaper. Very poor for measuring actual engagement."
          newTitle="New Analytics (GA4) 🕹️"
          newContent="Measures 'Events'. (Scrolls, Clicks, Video Plays, Form Submissions). Treats your website like a video game where every action counts."
        />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', borderRadius: '24px', border: '1px solid #93C5FD' }}>
          <CWHeading level={3} style={{ color: '#1E3A8A', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📈</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E3A8A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Intent Prediction.</strong> GA4 allows you to see the <em>path</em> a customer took before buying. Did they watch a video first? Did they read three blog posts? Understanding these patterns allows you to optimize your high-intent content and double down on what works.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #93C5FD', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=custom-web-apps" style={{ color: '#3B82F6', textDecoration: 'underline' }}>GA4 Implementation</a>: We don't just "install" GA4; we configure custom events, purchase tracking, and audience segments so you can see exactly who your best customers are.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the fundamental unit of tracking in GA4?", options: ["Sessions", "Events", "Pageviews only"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// Module C: GTM
export function Pillar10ModuleC({ onNext }) {
  return (
    <InteractiveLayout title="Module C: Google Tag Manager" subtitle="The Bucket.">
      <div className="cw-prose">
        <p className="cw-text-body">
          <strong>The Problem:</strong> Marketing wants to add a Facebook Pixel. Then a LinkedIn Insight Tag. Then a Hotjar Heatmap. Developers hate editing the website code 5 times a week just to add "trackers."
        </p>

        <TagBucketSim />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', borderRadius: '24px', border: '1px solid #FCD34D' }}>
          <CWHeading level={3} style={{ color: '#92400E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🪣</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#78350F', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Agility & Performance.</strong> GTM allows your marketing team to deploy new tags in minutes, not weeks. It also prevents "code bloat"—too many individual scripts can slow down your site. GTM loads them all efficiently through one single container.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FCD34D', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-monitoring" style={{ color: '#3B82F6', textDecoration: 'underline' }}>GTM Setup</a>: We setup your "Master Bucket" and configure all your marketing pixels correctly (Enhanced Conversions) to ensure your ads are actually tracking ROI.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Why is Google Tag Manager useful?", options: ["It writes content for you", "It allows non-developers to add tracking codes/pixels without editing the website source code", "It is an antivirus"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// Module D: E-commerce
export function Pillar10ModuleD({ onNext }) {
  return (
    <InteractiveLayout title="Module D: E-commerce Funnel" subtitle="Where is the leak?">
      <div className="cw-prose">
        <p className="cw-text-body">
          You don't fix a business by guessing. You look at the funnel. If 1,000 people visit your site, but only 10 buy, you have a 1% conversion rate. But <em>where</em> did the other 990 go?
        </p>

        <FunnelCalculator />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #A7F3D0' }}>
          <CWHeading level={3} style={{ color: '#065F46', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🚰</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#064E3B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>High-ROIE Repairs.</strong> Fixing a leak in your checkout process is often 10x cheaper than buying more ads. If you double your conversion rate from 1% to 2%, you double your revenue without spending an extra cent on marketing.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ecommerce" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Checkout Optimization</a>: We use tools like FullStory or Hotjar to watch session recordings and identify exactly where users are getting stuck in your funnel.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What does Funnel Analysis tell you?", options: ["How much water fits in a bucket", "Where exactly in the user journey customers are dropping off", "The total sales"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module E: Attribution
export function Pillar10ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: Attribution" subtitle="Who gets the credit?">
      <div className="cw-prose">
        <p className="cw-text-body">
          The path to purchase is rarely a straight line. Customers often interact with your brand 7 to 10 times across different channels before they finally decide to buy.
        </p>

        <AttributionVisualizer />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', borderRadius: '24px', border: '1px solid #93C5FD' }}>
          <CWHeading level={3} style={{ color: '#1E3A8A', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚖️</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E3A8A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Budget Allocation.</strong> Without proper attribution, you might kill a high-performing "Awareness" channel (like TikTok or Radio) because it doesn't show direct sales, unknowingly cutting off the top of your funnel and causing your "Last Click" channels (like Google Search) to dry up.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #93C5FD', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-monitoring" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Multi-Touch Attribution</a>: We setup data-driven attribution models that give partial credit to every touchpoint, giving you a true picture of your marketing ROI.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the flaw of 'Last Click Attribution'?", options: ["It gives all credit to the final step, ignoring the ads that introduced the brand", "It is too expensive", "It counts every click twice"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module F: Dashboards
export function Pillar10ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: Reporting" subtitle="Looker Studio.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Don't stare at raw GA4 tables. They are confusing and overwhelming. You need a <strong>Dashboard</strong> that tells you the health of your business in 5 seconds.
        </p>

        <CWCard>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ fontSize: '3rem' }}>📁</div>
            <div>
              <h4 style={{ margin: 0 }}>Looker Studio Dashboards</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0.5rem 0' }}>Pulling Data from: GA4, Search Console, Facebook Ads, Shopify, and Google Sheets.</p>
              <CWBadge color="blue">Automated Weekly Email</CWBadge>
            </div>
          </div>
        </CWCard>

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)', borderRadius: '24px', border: '1px solid #CBD5E1' }}>
          <CWHeading level={3} style={{ color: '#334155', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📉</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E293B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Executive Decision Making.</strong> You shouldn't be digging into data; you should be using it. A high-level dashboard allows you to spot trends, detect technical failures early (e.g., a drop in sales), and make informed pivots without needing a data science degree.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #CBD5E1', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-monitoring" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Custom Reporting</a>: We build "Executive Level" dashboards for our clients that highlight only the numbers that move the needle, keeping you focused on growth.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is Looker Studio best for?", options: ["Drawing pictures", "Visualizing data from multiple sources in a single dashboard", "Recording video"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module G: A/B Testing
export function Pillar10ModuleG({ onNext }) {
  return (
    <InteractiveLayout title="Module G: A/B Testing" subtitle="Science, not art.">
      <div className="cw-prose">
        <p className="cw-text-body">
          You think the button should be Red. Your designer thinks Blue. In the old world, the boss wins the argument. In the data world, the <strong>user</strong> wins.
        </p>

        <ABTestVisual />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', borderRadius: '24px', border: '1px solid #FCD34D' }}>
          <CWHeading level={3} style={{ color: '#92400E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔬</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#78350F', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Incremental Gains.</strong> A/B testing allows you to systematically improve your website over time. A 5% improvement here and a 10% improvement there compound into massive revenue gains over a year. It's the "Marginal Gains" theory applied to your digital storefront.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FCD34D', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=custom-web-apps" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Conversion Rate Optimization (CRO)</a>: We run experiments for you—testing headlines, layouts, and call-to-actions to find the highest-converting version of your site.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the primary goal of A/B Testing?", options: ["To confuse users", "To validate hypotheses with real user data to improve conversion rates", "To make the site colorful"], correctIndex: 1 }
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

export function Pillar10Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  // Local state handling if props missing
  const [localResponses, setLocalResponses] = useState({});
  const activeResponses = quizResponses || localResponses;
  const activeSetResponse = onSelect || ((qMvc, optIdx) => setLocalResponses(prev => ({ ...prev, [qMvc]: optIdx })));

  const questions = pillar10QuizQuestions;
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
          <CWHeading level={3}>Data Analyst</CWHeading>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{scoreMessage}</p>
          <CWButton onClick={onFinish}>Continue to Certificate →</CWButton>
        </div>
      </CWCard>
    );
  }

  return (
    <QuizLayout title="Final Exam: Analytics" currentStep={currentQuestionIndex + 1} totalSteps={questions.length}>
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

export function Pillar10Completion() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>📈</h1>
      <CWHeading level={2}>Data Scientist</CWHeading>
      <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '1rem auto' }}>
        You no longer guess. You know. And knowledge is profit.
      </p>
    </div>
  );
}
