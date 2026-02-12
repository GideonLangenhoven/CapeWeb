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
    question: 'You have 100,000 Instagram followers but 0 sales. You tell investors "We are killing it!". What dangerous trap have you fallen into?',
    options: ['Success', 'Vanity Metrics (Looking good vs Being good)', 'Market Domination'],
    correctIndex: 1,
  },
  {
    question: 'You and your designer argue about whether the "Buy" button should be Red or Blue. Instead of fighting, you show Red to 50% of users and Blue to 50%. What is this?',
    options: ['A/B Testing (Split Testing)', 'Conflict Resolution', 'Guessing'],
    correctIndex: 0,
  },
  {
    question: 'A user sees your Facebook Ad, later Googles you, and finally clicks an Email link to buy. Facebook claims credit. Email claims credit. What puzzle is this?',
    options: ['The Attribution Problem', 'Double Sales', 'Computer Error'],
    correctIndex: 0,
  },
  {
    question: 'Users who joined in January stayed for 8 months. Users who joined in June quit after 1 week. You analyze these groups separately to find the cause. What is this?',
    options: ['Cohort Analysis', 'Group Therapy', 'Segmenting by color'],
    correctIndex: 0,
  },
  {
    question: 'You need to add the TikTok Pixel to your site urgently. Your developer is on holiday. You log into a container tool and push the tag yourself without touching code. What tool is this?',
    options: ['Google Analytics', 'Google Tag Manager (GTM)', 'WordPress'],
    correctIndex: 1,
  },
  {
    question: '1,000 people visit. 10 people buy (1% Conversion). To double revenue, you could pay for 2,000 visitors, OR you could just fix the website to get 20 buyers (2% Conversion). What is the second strategy?',
    options: ['SEO', 'CRO (Conversion Rate Optimization)', 'PPC'],
    correctIndex: 1,
  },
  {
    question: 'You are a startup trying to optimize Retention, Referral, and Revenue all at the same time, and failing. "Lean Analytics" suggests ignoring everything else and picking just:',
    options: ['OMTM (One Metric That Matters)', 'All metrics', 'Revenue only'],
    correctIndex: 0,
  },
  {
    question: 'You sign up 100 new customers this month. But 110 old customers cancel their subscription. Is your business growing?',
    options: ['Yes, new sales are high', 'No, you have negative Net Growth due to High Churn', 'Yes, because revenue is revenue'],
    correctIndex: 1,
  },
  {
    question: '100 people see your ad. 50 Click. 10 Add to Cart. 1 Buys. Visualizing these steps helps you spot where people drop off. What is this visualization?',
    options: ['A Pie Chart', 'A Sales Funnel', 'A Scatter Plot'],
    correctIndex: 1,
  },
  {
    question: 'In the old Google Analytics, we counted "Page Views". In GA4, we track "Video Started", "File Downloaded", and "Scroll Depth". What is this model?',
    options: ['Event-Based Measurement', 'Session-Based Measurement', 'Time-Based Measurement'],
    correctIndex: 0,
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

function VanityMetricVisual() {
  const [mode, setMode] = useState('vanity');
  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
      background: '#4ADE80', color: '#0F172A'
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

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={() => setMode('vanity')} style={{ padding: '0.6rem 1.2rem', background: mode === 'vanity' ? '#3B82F6' : 'rgba(255,255,255,0.7)', color: mode === 'vanity' ? 'white' : 'black', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 600 }}>Vanity Metric</button>
          <button onClick={() => setMode('action')} style={{ padding: '0.6rem 1.2rem', background: mode === 'action' ? '#10B981' : 'rgba(255,255,255,0.7)', color: mode === 'action' ? 'white' : 'black', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 600 }}>Actionable Metric</button>
        </div>

        <div style={{
          padding: '2rem', borderRadius: '20px', textAlign: 'center',
          background: mode === 'vanity' ? 'linear-gradient(to right, #93C5FD, #60A5FA)' : 'linear-gradient(to right, #6EE7B7, #34D399)',
          color: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          transition: 'all 0.5s'
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, textShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            {mode === 'vanity' ? '1,000,000' : '10'}
          </div>
          <div style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
            {mode === 'vanity' ? 'Total Likes' : 'Daily Sales'}
          </div>
          <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 500 }}>
            {mode === 'vanity' ? 'Ego = High. Bank Account = R0.' : 'Ego = Moderate. Bank Account = R10,000.'}
          </div>
        </div>
      </div>
    </div>
  )
}

function FunnelVisual() {
  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
      background: '#FDE047', color: '#0F172A'
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

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px', height: '60px', background: '#3B82F6', marginBottom: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)' }}>
          View Product (1000)
        </div>
        <div style={{ width: '60%', maxWidth: '240px', height: '60px', background: '#60A5FA', marginBottom: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, boxShadow: '0 4px 6px rgba(96, 165, 250, 0.2)' }}>
          Add to Cart (100)
        </div>
        <div style={{ width: '30%', maxWidth: '120px', height: '60px', background: '#93C5FD', marginBottom: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', fontWeight: 700, boxShadow: '0 4px 6px rgba(147, 197, 253, 0.2)' }}>
          Start Checkout (50)
        </div>
        <div style={{ width: '15%', maxWidth: '60px', height: '60px', background: '#DBEAFE', marginBottom: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', fontWeight: 700, border: '2px solid #3B82F6', textShadow: '0 0 10px white' }}>
          Buy (10)
        </div>
        <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '1rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.7)', padding: '0.5rem 1rem', borderRadius: '100px' }}>Notice the huge drop-off? That is the leak.</p>
      </div>
    </div>
  )
}

function ABTestVisual() {
  const [winner, setWinner] = useState(null);
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

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div
          onClick={() => setWinner('A')}
          style={{ cursor: 'pointer', padding: '1.5rem', border: '3px solid #EF4444', borderRadius: '16px', textAlign: 'center', background: winner === 'A' ? 'rgba(254, 242, 242, 0.9)' : 'rgba(255,255,255,0.8)', flex: 1, minWidth: '150px', transition: 'all 0.3s', transform: winner === 'A' ? 'scale(1.05)' : 'scale(1)' }}
        >
          <div style={{ width: '100px', height: '40px', background: '#EF4444', margin: '0 auto 1rem', borderRadius: '6px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Buy Now</div>
          <strong style={{ fontSize: '1.2rem', color: '#1E293B' }}>Variant A</strong>
          <div style={{ color: '#64748B', marginTop: '0.5rem' }}>Conv: 1%</div>
        </div>
        <div
          onClick={() => setWinner('B')}
          style={{ cursor: 'pointer', padding: '1.5rem', border: '3px solid #10B981', borderRadius: '16px', textAlign: 'center', background: winner === 'B' ? 'rgba(236, 253, 245, 0.9)' : 'rgba(255,255,255,0.8)', flex: 1, minWidth: '150px', transition: 'all 0.3s', transform: winner === 'B' ? 'scale(1.05)' : 'scale(1)' }}
        >
          <div style={{ width: '100px', height: '40px', background: '#10B981', margin: '0 auto 1rem', borderRadius: '6px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Buy Now</div>
          <strong style={{ fontSize: '1.2rem', color: '#1E293B' }}>Variant B</strong>
          <div style={{ color: '#64748B', marginTop: '0.5rem' }}>Conv: 5%</div>
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
// PILLAR 10 MODULES A-G
// ==========================================

// Module A: Fundamentals
export function Pillar10ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: Data vs Vibes" subtitle="The Truth Serum.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Humans are biased. We think our red button is cool because we like red. Data tells us nobody clicks it.
          You must separate "Feeling Good" from "Making Money".
        </p>

        <VanityMetricVisual />

        <ScenarioToggle
          oldTitle="The Intuition Trap"
          oldContent={
            <div>
              <h4 style={{ color: '#991B1B' }}>"I think..."</h4>
              <p>You change the website headline because you had a 'good idea' in the shower. You have no way to know if it worked.</p>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
                <strong>Result:</strong> Random results. Revenue fluctuates unpredictable.
              </div>
            </div>
          }
          newTitle="The Data Driver"
          newContent={
            <div>
              <h4 style={{ color: '#065F46' }}>"The Data says..."</h4>
              <p>You run an A/B test. The data shows Version B gets 20% more sales. You switch to Version B immediately.</p>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #6EE7B7' }}>
                <strong>Result:</strong> Consistent growth. Revenue serves the business.
              </div>
            </div>
          }
        />

        <BookInsight title="Vanity vs Actionable" author="Alistair Croll" book="Lean Analytics" color="#3B82F6">
          <p>"If a metric doesn't change how you behave, it is a bad metric."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #6EE7B7' }}>
          <CWHeading level={3} style={{ color: '#047857', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#065F46', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Data is your cheat sheet. If you know exactly which ad brings customers and which webpage scares them away, you stop losing money. Actionable metrics give you <strong>control</strong> over your growth.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>1. Stop Guessing</h4>
              <p style={{ fontSize: '0.95rem', color: '#064E3B', lineHeight: '1.6' }}>
                Marketing without data is gambling. With accurate tracking, every Rand you spend has a measurable ROI. You can scale winners and cut losers instantly.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>2. The "Silent" Feedback</h4>
              <p style={{ fontSize: '0.95rem', color: '#064E3B', lineHeight: '1.6' }}>
                Customers rarely email you to say "I left because your menu is confusing." They just leave. Analytics hears what customers don't say, revealing hidden friction.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We turn your website into a lab, not a brochure.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Full Analytics Setup:</strong> We install GA4, GTM, and custom events so you track <em>conversion</em> (sales), not just traffic via our <a href="/services?service=performance-first" style={{ color: '#10B981', textDecoration: 'underline' }}>Data Setup Service</a>.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Monthly Intelligence Reports:</strong> We don't send you a PDF of numbers. We send you an "Action List" of what to fix to make more money next month.
                </span>
              </li>
            </ul>
          </div>
        </div>

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
    <InteractiveLayout title="Module B: GA4 basics" subtitle="The web is a movie.">
      <div className="cw-prose">
        <p className="cw-text-body">
          The old web was a newspaper (Pageviews). The new web is a video game (Interactions).
        </p>

        <ScenarioToggle
          oldTitle="Old Analytics (UA)"
          oldContent="Measured 'Sessions' (Visits). Assumed people just read."
          newTitle="New Analytics (GA4)"
          newContent="Measures 'Events'. (Scrolls, Clicks, Video Plays). Assumes people interact."
        />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #6EE7B7' }}>
          <CWHeading level={3} style={{ color: '#047857', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#065F46', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            A million hits mean nothing if they bounce in 1 second. The new GA4 tells you if they actually <em>read</em> your content.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>1. Real Engagement</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>Old metrics lied. New metrics show if someone watched your video or scrolled to your pricing.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>2. Cross-Device Tracking</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>People look on mobile but buy on desktop. GA4 connects these dots so you don't lose the lead.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#047857', fontSize: '1.1rem' }}>🚀 How CapeWeb Helps You</h4>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
              <span>➜</span>
              <span><strong>Event Configuration:</strong> We set up the complex tracking ("Add to Cart", "Form Start", "Video Complete") so you measure intent, not just visits.</span>
            </div>
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
          <strong>Problem:</strong> Marketing wants to add a Facebook Pixel. Then a LinkedIn Insight Tag. Then a Hotjar Heatmap.
          Developers hate editing the code every time.
          <br /><strong>Solution:</strong> A single "Bucket" (GTM) on your site. You pour tags into the bucket via a dashboard, without touching the code.
        </p>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #6EE7B7' }}>
          <CWHeading level={3} style={{ color: '#047857', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#065F46', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Speed of execution is your competitive advantage.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>1. Marketing Agility</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>You don't need to pay a developer R1,000 every time you want to add a Facebook Pixel. You can do it yourself in minutes.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>2. Site Speed</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>GTM loads tags asynchronously. This means your tracking scripts won't slow down your website for customers.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#047857', fontSize: '1.1rem' }}>🚀 How CapeWeb Helps You</h4>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
              <span>➜</span>
              <span><strong>Container Management:</strong> We manage your GTM container, ensuring 3rd party scripts don't break your site or steal user data.</span>
            </div>
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
          You don't fix a business by guessing. You look at the funnel.
        </p>

        <FunnelVisual />

        <p>If 100 people add to cart, but only 10 buy... your checkout page is broken (or shipping is too expensive).</p>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #6EE7B7' }}>
          <CWHeading level={3} style={{ color: '#047857', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#065F46', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Most businesses are leaking money at the Checkout page and don't even know it.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>1. Recover Lost Sales</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>70% of people abandon their cart. Identifying <em>why</em> (e.g., surprise shipping costs) retrieves that lost revenue.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>2. Laser-Focus</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>Knowing exactly where the drop-off is (Product Page vs. Cart) tells you exactly what to fix.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#047857', fontSize: '1.1rem' }}>🚀 How CapeWeb Helps You</h4>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
              <span>➜</span>
              <span><strong>Funnel Visualization:</strong> We build custom funnel reports so you can see the "Leak" in your business instantly.</span>
            </div>
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
  )
}

// Module E: Attribution
export function Pillar10ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: Attribution" subtitle="Who gets the credit?">
      <div className="cw-prose">
        <p className="cw-text-body">
          User sees Instagram Ad &rarr; Clicks (No buy).
          <br />Next day, Googles your name &rarr; Clicks (No buy).
          <br />Next week, types URL directly &rarr; Buys.
        </p>
        <CWAlert type="warning" title="Last Click Lie">
          Most tools give 100% credit to the LAST click (Direct). This makes you think Instagram isn't working, so you turn off the ads, and suddenly sales stop.
        </CWAlert>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #6EE7B7' }}>
          <CWHeading level={3} style={{ color: '#047857', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#065F46', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Don't fire the employee who introduces you to the customer just because they didn't close the deal.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>1. ROAS Accuracy</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>If you turn off "Awareness" ads because they don't get the "Last Click", your funnel dries up. You need to know the full path.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>2. Smarter Budgeting</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>Spend your marketing budget where it actually influences the decision, not just the final click.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#047857', fontSize: '1.1rem' }}>🚀 How CapeWeb Helps You</h4>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
              <span>➜</span>
              <span><strong>Attribution Modeling:</strong> We implement multi-touch attribution so you can see the true ROI of your social media efforts.</span>
            </div>
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
  )
}

// Module F: Dashboards
export function Pillar10ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: Reporting" subtitle="Looker Studio.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Don't stare at raw tables. Use <strong>Looker Studio</strong>.
          Pull data from GA4 + Facebook + Sheets into one visual page.
          <br />Rule: If you can't read the trend in 5 seconds, the chart is bad.
        </p>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #6EE7B7' }}>
          <CWHeading level={3} style={{ color: '#047857', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#065F46', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            You shouldn't need a PhD to read your own sales report.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>1. Avoid Decision Paralysis</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>Excel sheets bury the truth. Visual dashboards reveal the truth in seconds, allowing you to react faster.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>2. Team Alignment</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>When everyone looks at the same live scoreboard, performance improves. No more arguing over whose spreadsheet is newer.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#047857', fontSize: '1.1rem' }}>🚀 How CapeWeb Helps You</h4>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
              <span>➜</span>
              <span><strong>CEO Dashboards:</strong> We build "One Screen" dashboards in Looker Studio containing all your vital signs (Sales, Ad Spend, ROI).</span>
            </div>
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
  )
}

// Module G: A/B Testing
export function Pillar10ModuleG({ onNext }) {
  return (
    <InteractiveLayout title="Module G: A/B Testing" subtitle="Science, not art.">
      <div className="cw-prose">
        <p className="cw-text-body">
          You think the button should be Red. Your designer thinks Blue.
          <strong>Don't argue. Test.</strong>
        </p>

        <ABTestVisual />

        <p>Show Red to 50% of people. Show Blue to 50% of people. The winner takes the throne.</p>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #6EE7B7' }}>
          <CWHeading level={3} style={{ color: '#047857', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#065F46', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Your opinion is expensive. Data is free.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>1. Risk Reduction</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>Don't redesign your whole site on a hunch. Test small changes to prove they work before committing budget.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.2rem' }}>2. Compounding Growth</div>
              <div style={{ fontSize: '0.95rem', color: '#065F46' }}>A 1% improvement every week leads to 67% growth in a year. A/B testing is the engine of compound interest.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#047857', fontSize: '1.1rem' }}>🚀 How CapeWeb Helps You</h4>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
              <span>➜</span>
              <span><strong>Experiment Engine:</strong> We run the tests for you. We write the code for Variant B, track the results, and deploy the winner.</span>
            </div>
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
  )
}

// ==========================================
// MODULE H: RESOURCES
// ==========================================
export function Pillar10Resources({ onNext }) {
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
    <InteractiveLayout title="Module H: Resources" subtitle="Data Toolkit">
      <div className="cw-prose">
        <p>You cannot manage what you do not measure. These tools give you the dashboard for your business vehicle.</p>

        <h3 style={{ marginTop: '2rem' }}>🛠️ The Analytics Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Traffic"
            title="Google Analytics 4"
            description="The industry standard. Tracks where users come from and what they do. Essential."
            link="https://analytics.google.com/"
          />
          <ResourceCard
            category="Tracking"
            title="Google Tag Manager"
            description="Manage all your tracking pixels (Meta, LinkedIn, Google Ads) in one place without code."
            link="https://tagmanager.google.com/"
          />
          <ResourceCard
            category="Heatmaps"
            title="Hotjar / Clarity"
            description="See exactly where users click and scroll. Watch recordings of their sessions."
            link="https://www.hotjar.com/"
          />
          <ResourceCard
            category="Visualization"
            title="Looker Studio"
            description="Turn boring data tables into beautiful, live dashboards for your team."
            link="https://lookerstudio.google.com/"
          />
        </div>

        <h3 style={{ marginTop: '3rem' }}>📚 Recommended Reading</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Startup Metrics"
            title="Lean Analytics"
            description="By Alistair Croll. How to use data to build a better startup faster. Don't measure vanity metrics."
            link="http://leananalyticsbook.com/"
          />
          <ResourceCard
            category="Goal Setting"
            title="Measure What Matters"
            description="By John Doerr. The OKR (Objectives and Key Results) system used by Google to scale."
            link="https://www.whatmatters.com/"
          />
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <h4>Ready for the Data Exam?</h4>
          <p style={{ marginBottom: '1.5rem', color: '#64748B' }}>Numbers don't lie. Let's see if you can read them.</p>
          <CWButton onClick={onNext} variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Take Final Exam 🏁</CWButton>
        </div>
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
