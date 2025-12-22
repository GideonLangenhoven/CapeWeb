import React, { useState, useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';
import { InteractiveLayout, QuizLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, BookInsight } from './CapeWebUI';

// ==========================================
// PILLAR 3 QUIZ DATA
// ==========================================

export const pillar3QuizQuestions = [
  {
    question: 'A user lands on your site. The menu has 25 options and a pop-up appears immediately. They close the tab in 3 seconds. What principle did you likely violate?',
    options: ['Not enough colors', 'Cognitive Load (You forced them to think too much)', 'The images were too small'],
    correctIndex: 1,
  },
  {
    question: 'You design a complex dashboard on your 27-inch monitor. It looks perfect. When your client opens it on their iPhone, they can\'t see the buttons. What mistake did you make?',
    options: ['You didn\'t use bold fonts', 'You failed to design "Mobile First"', 'You should have told them to buy a laptop'],
    correctIndex: 1,
  },
  {
    question: 'Your site takes 8 seconds to load because of a 10MB hero video. A user on 3G in rural KZN gives up and leaves. What killed your sale?',
    options: ['The user\'s patience', 'Latency & Bandwidth (Performance matters more than aesthetics)', 'The video wasn\'t cool enough'],
    correctIndex: 1,
  },
  {
    question: 'You have a valid idea but zero coding skills. You need to launch by Friday. What constitutes the smartest "Technological Choice"?',
    options: ['Spend 6 months learning React', 'Use a No-Code builder (Webflow/Bubble) to ship immediately', 'Hire an agency for R100k'],
    correctIndex: 1,
  },
  {
    question: 'Your server is in London. Your customer is in Cape Town. Every click feels "laggy" due to the distance. What technology fixes this by moving content closer?',
    options: ['A faster CPU', 'Edge Network / CDN (Content Delivery Network)', 'More RAM'],
    correctIndex: 1,
  },
  {
    question: 'On your checkout page, the "Cancel" button is the same size and color as the "Pay Now" button. Users keep clicking the wrong one. What is missing?',
    options: ['Visual Hierarchy (Contrast)', 'More animations', 'Sound effects'],
    correctIndex: 0,
  },
  {
    question: 'Instead of trying to design a full "Dashboard Page" at once, you start by designing just the "Button", "Input", and "Card" components. What methodology is this?',
    options: ['Atomic Design', 'Chaos Theory', 'Waterfall'],
    correctIndex: 0,
  },
  {
    question: 'You hire a freelancer to update one image on your site. You give them full "Super Admin" access to your entire database. They accidentally delete your user table. What security rule did you break?',
    options: ['Zero Trust', 'Principle of Least Privilege', 'Two-Factor Authentication'],
    correctIndex: 1,
  },
  {
    question: 'Your app data takes 2 seconds to load. Instead of showing a blank white screen, you show grey "shimmering" bars (skeletons). Why does this feel faster to the user?',
    options: ['It is actually faster', 'Perceived Performance (It feels active/responsive)', 'It distracts them'],
    correctIndex: 1,
  },
  {
    question: 'In your React app, you are passing the "Username" prop down through 10 different components just to show it in the footer. The code is a mess. What solves this?',
    options: ['Prop Drilling', 'Global State Management (Context API)', 'refreshing the page'],
    correctIndex: 1,
  }
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

function CognitiveLoadBattery() {
  const [load, setLoad] = useState(100);

  // Auto-drain effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(prev => Math.max(prev - 2, 20)); // Drain to 20%
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const reset = () => setLoad(100);

  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
      background: '#FDE047', // Yellow
      color: '#0F172A'
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
        <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: load < 40 ? '#EF4444' : '#10B981', transition: 'color 0.3s' }}>
          User Patience: {load}%
        </div>
        <div style={{ width: '100%', height: '40px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '2px solid #CBD5E1' }}>
          <div style={{
            width: `${load}%`,
            height: '100%',
            background: load < 40 ? '#EF4444' : '#10B981',
            transition: 'width 0.1s linear, background 0.3s'
          }} />
        </div>
        <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.5rem' }}>
          Every pop-up, slow loading spinner, or confusing menu drains this battery. <br />
          When it hits 0%, the user leaves.
        </p>
        <CWButton onClick={reset} style={{ marginTop: '1rem' }} variant="secondary">Reset Battery ⚡</CWButton>
      </div>
    </div>
  );
}

function BoxModelInteractive() {
  const [padding, setPadding] = useState(20);
  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
      background: '#22D3EE', // Cyan
      color: '#0F172A'
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
        <h4 style={{ marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>CSS Box Model Playground</h4>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#475569', fontWeight: 600 }}>Padding: {padding}px</label>
          <input type="range" min="0" max="60" value={padding} onChange={(e) => setPadding(parseInt(e.target.value))} style={{ width: '100%', marginTop: '0.5rem', accentColor: '#3B82F6' }} />
        </div>
        <div style={{ background: '#fbbf24', padding: '20px', border: '2px dashed #000', borderRadius: '8px', display: 'inline-block', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <span style={{ fontSize: '0.8rem', display: 'block', fontWeight: 700, color: '#78350F' }}>Margin (Outer)</span>
          <div style={{ background: '#60a5fa', padding: '10px', border: '5px solid #000' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E3A8A' }}>Border</span>
            <div style={{ background: '#4ade80', padding: `${padding}px`, transition: 'padding 0.3s' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#064E3B' }}>Padding (Inner Space)</span>
              <div style={{ background: '#fff', padding: '10px' }}>
                <strong>Content</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VirtualDOMVisual() {
  const [updated, setUpdated] = useState(false);
  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
      background: '#F472B6', // Pink
      color: '#0F172A'
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

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
        <div style={{ padding: '1.5rem', border: '2px solid #FECACA', borderRadius: '16px', background: 'rgba(254, 242, 242, 0.9)', opacity: updated ? 0.5 : 1, textAlign: 'center' }}>
          <strong style={{ color: '#991B1B', display: 'block', marginBottom: '0.5rem' }}>Old Way (HTML)</strong>
          <p style={{ fontSize: '0.9rem', color: '#7F1D1D' }}>Reloads Entire Page</p>
          <div style={{ marginTop: '1rem', fontSize: '2.5rem' }}>🔄</div>
        </div>
        <div style={{ padding: '1.5rem', border: '2px solid #A7F3D0', borderRadius: '16px', background: 'rgba(236, 253, 245, 0.9)', textAlign: 'center' }}>
          <strong style={{ color: '#065F46', display: 'block', marginBottom: '0.5rem' }}>New Way (React)</strong>
          <p style={{ fontSize: '0.9rem', color: '#064E3B' }}>Updates Only the Number</p>
          <div style={{ marginTop: '1rem', fontSize: '2.5rem', transition: 'transform 0.2s', transform: updated ? 'scale(1.5)' : 'scale(1)', fontWeight: 800, color: '#059669' }}>
            {updated ? '5' : '4'}
          </div>
          <button onClick={() => setUpdated(!updated)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '100px', border: 'none', background: '#10B981', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>Click Me</button>
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
      background: '#FB923C', // Orange
      color: '#0F172A'
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

function NoCodeRaceVisual() {
  const [codeTyped, setCodeTyped] = useState('');
  const [clicks, setClicks] = useState(0);
  const [noCodeStage, setNoCodeStage] = useState(0); // 0: Start, 1: Dragged, 2: Launched

  const targetCode = "import React from 'react'; function App() { return <div>Hello</div> }";

  const handleType = () => {
    if (codeTyped.length < targetCode.length) {
      setCodeTyped(targetCode.substring(0, codeTyped.length + 3));
    }
  };

  const handleNoCodeClick = () => {
    if (noCodeStage < 2) setNoCodeStage(s => s + 1);
  };

  return (
    <div style={{ margin: '2rem 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {/* Code Side */}
      <div onClick={handleType} style={{ padding: '1.5rem', background: '#0F172A', borderRadius: '16px', border: '1px solid #334155', cursor: 'text', minHeight: '200px' }}>
        <h5 style={{ color: '#94A3B8', marginTop: 0 }}>💻 Custom Code</h5>
        <div style={{ fontFamily: 'monospace', color: '#60A5FA', fontSize: '0.8rem', lineHeight: '1.5', minHeight: '60px' }}>
          {codeTyped}<span style={{ animation: 'blink 1s infinite' }}>|</span>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#475569' }}>
          Tap this box repeatedly to write code.<br />
          <strong>Progress: {Math.round((codeTyped.length / targetCode.length) * 100)}%</strong>
        </div>
      </div>

      {/* No Code Side */}
      <div onClick={handleNoCodeClick} style={{ padding: '1.5rem', background: '#ECFDF5', borderRadius: '16px', border: '1px solid #6EE7B7', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h5 style={{ color: '#059669', marginTop: 0, width: '100%', textAlign: 'left' }}>⚡ No-Code</h5>

        {noCodeStage === 0 && <div style={{ padding: '0.5rem 1rem', background: '#10B981', color: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Drag Me (Tap)</div>}
        {noCodeStage === 1 && <div style={{ padding: '0.5rem 1rem', border: '2px dashed #10B981', color: '#10B981', borderRadius: '8px' }}>Drop Here (Tap)</div>}
        {noCodeStage === 2 && <div style={{ fontSize: '2rem' }}>🚀 LAUNCHED</div>}

        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#065F46' }}>
          {noCodeStage === 2 ? "Done in 2 clicks!" : "Tap to build linearly."}
        </div>
      </div>
    </div>
  );
}

function APIWaiterVisual() {
  const [status, setStatus] = useState('idle'); // idle, ordered, kitchen, delivering, delivered

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', borderRadius: '24px', background: '#FFF7ED', border: '1px solid #FECACA', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>🧑‍💻</div>
          <div style={{ fontWeight: 700, color: '#9A3412', fontSize: '0.9rem' }}>You</div>
        </div>

        {/* The Waiter Track */}
        <div style={{ flex: 1, height: '4px', background: '#FED7AA', margin: '0 1rem', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{
            position: 'absolute',
            left: (status === 'idle' || status === 'delivered') ? '0%' : (status === 'ordered' || status === 'delivering') ? '50%' : '100%',
            transition: 'left 1s ease',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem' }}>🤵</div>
            {status === 'ordered' && <div style={{ fontSize: '1rem', position: 'absolute', top: '-20px' }}>📝</div>}
            {status === 'delivering' && <div style={{ fontSize: '1.5rem', position: 'absolute', top: '-20px' }}>🍔</div>}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>👨‍🍳</div>
          <div style={{ fontWeight: 700, color: '#9A3412', fontSize: '0.9rem' }}>Kitchen</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {status === 'idle' && <button onClick={() => setStatus('ordered')} style={{ padding: '0.5rem 1rem', background: '#EA580C', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>1. Give Order to Waiter</button>}
        {status === 'ordered' && <button onClick={() => setStatus('kitchen')} style={{ padding: '0.5rem 1rem', background: '#EA580C', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>2. Waiter walks to Kitchen</button>}
        {status === 'kitchen' && <button onClick={() => setStatus('delivering')} style={{ padding: '0.5rem 1rem', background: '#EA580C', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>3. Kitchen gives Food</button>}
        {status === 'delivering' && <button onClick={() => setStatus('delivered')} style={{ padding: '0.5rem 1rem', background: '#EA580C', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>4. Waiter brings Food</button>}
        {status === 'delivered' && <button onClick={() => setStatus('idle')} style={{ padding: '0.5rem 1rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Delicious! Eat (Reset)</button>}
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#9A3412', fontStyle: 'italic' }}>
        Note: You never touched the Kitchen. The Waiter (API) did it all.
      </div>
    </div>
  )
}

function EdgePingVisual() {
  const [mode, setMode] = useState(null); // 'london' or 'edge'
  const [state, setState] = useState('idle'); // idle, waiting, success
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState(null);

  const startTest = (m) => {
    setMode(m);
    setState('waiting');
    setResult(null);
    setTimeout(() => {
      setState('active'); // Turn Green
      setStartTime(Date.now());
    }, 1000 + Math.random() * 1000);
  };

  const handleClick = () => {
    if (state !== 'active') return;
    const clickTime = Date.now();
    const pureReaction = clickTime - startTime;
    // Add artificial lag for London
    const lag = mode === 'london' ? 600 : 20;

    setTimeout(() => {
      setResult(pureReaction + lag);
      setState('success');
    }, mode === 'london' ? lag : 0); // Delay the feedback too!
  };

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#F3E8FF', borderRadius: '24px', textAlign: 'center' }}>
      <h4 style={{ color: '#6B21A8' }}>Latency Reflex Test</h4>
      <p style={{ marginBottom: '1.5rem', color: '#7E22CE' }}>Click the Dot when it turns GREEN.</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => startTest('london')} disabled={state !== 'idle'} style={{ opacity: state !== 'idle' && mode !== 'london' ? 0.3 : 1, padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #A855F7', background: mode === 'london' ? '#A855F7' : 'transparent', color: mode === 'london' ? 'white' : '#A855F7', cursor: 'pointer' }}>Version A: London Server</button>
        <button onClick={() => startTest('edge')} disabled={state !== 'idle'} style={{ opacity: state !== 'idle' && mode !== 'edge' ? 0.3 : 1, padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #A855F7', background: mode === 'edge' ? '#A855F7' : 'transparent', color: mode === 'edge' ? 'white' : '#A855F7', cursor: 'pointer' }}>Version B: Edge Server</button>
      </div>

      <div
        onClick={handleClick}
        style={{
          width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto',
          background: state === 'active' ? '#22C55E' : state === 'success' ? '#fff' : '#CBD5E1',
          cursor: state === 'active' ? 'pointer' : 'default',
          border: '4px solid',
          borderColor: state === 'active' ? '#16A34A' : '#94A3B8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 900
        }}
      >
        {state === 'waiting' ? '...' : state === 'active' ? 'CLICK!' : state === 'success' ? '⏱️' : 'Start'}
      </div>

      {result && (
        <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: mode === 'london' ? '#EF4444' : '#10B981' }}>{result}ms</div>
          <div style={{ color: '#6B21A8' }}>
            {mode === 'london' ? '🛑 Slow! It felt unresponsive.' : '⚡ Instant! Feels native.'}
          </div>
        </div>
      )}
    </div>
  )
}

function HeadlessCMSVisual() {
  const [content, setContent] = useState('Summer Sale');
  const [publishing, setPublishing] = useState(false);

  const publish = () => {
    setPublishing(true);
    setTimeout(() => setPublishing(false), 2000);
  };

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#EFF6FF', borderRadius: '24px', border: '1px solid #BFDBFE' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h5 style={{ margin: 0, color: '#1E40AF' }}>Headless CMS Core</h5>
        <div style={{ display: 'inline-flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #93C5FD' }}
          />
          <button onClick={publish} style={{ padding: '0.5rem 1rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            {publishing ? 'Publishing...' : 'Publish to All'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', position: 'relative' }}>
        {['Website', 'iOS App', 'Smart Watch'].map((device, i) => (
          <div key={device} style={{ padding: '1rem', background: 'white', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1.5rem' }}>{i === 0 ? '🖥️' : i === 1 ? '📱' : '⌚'}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.5rem' }}>{device}</div>
            <div style={{ fontWeight: 700, color: '#1E3A8A', minHeight: '1.2em', transition: 'all 0.3s', transform: publishing ? 'scale(1.1)' : 'scale(1)' }}>
              {content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SQLInjectionVisual() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState(['> System Ready.', '> Enter Username:']);
  const [hacked, setHacked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;

    const newLogs = [...logs, `> ${input}`];

    if (input.includes("' OR '1'='1") || input.includes('DROP') || input.includes('1=1')) {
      setHacked(true);
      newLogs.push('> ADMIN ACCESS GRANTED.');
      newLogs.push('> WARNING: DELETING ALL USERS...');
      newLogs.push('> [SYSTEM CRITICAL FAILURE]');
    } else {
      newLogs.push('> Access Denied. Password verify failed.');
      newLogs.push('> Enter Username:');
    }
    setLogs(newLogs);
    setInput('');
  };

  const reset = () => {
    setLogs(['> System Ready.', '> Enter Username:']);
    setHacked(false);
    setInput('');
  };

  return (
    <div style={{ margin: '2rem 0', padding: '1.5rem', borderRadius: '16px', background: '#0F172A', color: '#38BDF8', fontFamily: 'monospace', position: 'relative', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
      </div>

      <div style={{ height: '150px', overflowY: 'auto', marginBottom: '1rem', color: hacked ? '#EF4444' : '#38BDF8' }}>
        {logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <span style={{ color: '#22D3EE' }}>$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try: ' OR '1'='1"
          disabled={hacked}
          style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, fontFamily: 'monospace', outline: 'none' }}
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>

      {hacked && (
        <button onClick={reset} style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '0.5rem 1rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Reset Firewall
        </button>
      )}
    </div>
  );
}


function CheckoutFrictionVisual() {
  const [conversion, setConversion] = useState(2.5); // Baseline 2.5%
  const [fields, setFields] = useState([
    { id: 1, name: 'Fax Number', impact: 0.5 },
    { id: 2, name: 'Confirm Email', impact: 1.2 },
    { id: 3, name: 'How did you hear?', impact: 0.8 },
    { id: 4, name: 'Create Account', impact: 4.5 },
  ]);

  const removeField = (id, impact) => {
    setFields(f => f.filter(x => x.id !== id));
    setConversion(c => parseFloat((c + impact).toFixed(1)));
  };

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#F0FDF4', borderRadius: '24px', textAlign: 'center', border: '1px solid #BBF7D0' }}>
      <h4 style={{ color: '#15803D' }}>The Friction Crusher 🔨</h4>
      <p style={{ marginBottom: '1.5rem', color: '#166534' }}>Tap a field to REMOVE it and boost conversion.</p>

      <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {fields.map(f => (
          <button
            key={f.id}
            onClick={() => removeField(f.id, f.impact)}
            style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #86EFAC', borderRadius: '8px', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>🗑️</span> {f.name}
          </button>
        ))}
        {fields.length === 0 && <div style={{ fontWeight: 700, color: '#16A34A' }}>🔥 PERFECT FORM!</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', background: 'white', padding: '1.5rem', borderRadius: '16px' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Conversion Rate</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: conversion > 5 ? '#16A34A' : '#F59E0B', transition: 'all 0.5s' }}>
            {conversion}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Monthly Revenue</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: conversion > 5 ? '#16A34A' : '#64748B', transition: 'all 0.5s' }}>
            R{(100000 * (conversion / 2.5)).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonLoaderVisual() {
  const [mode, setMode] = useState('spinner'); // 'spinner' or 'skeleton'
  const [loading, setLoading] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const load = (m) => {
    setMode(m);
    setLoading(true);
    setContentVisible(false);
    setTimeout(() => {
      setLoading(false);
      setContentVisible(true);
    }, 2500); // 2.5s simulated load
  };

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#F8F9FA', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
      <h4 style={{ color: '#334155', textAlign: 'center', marginBottom: '1.5rem' }}>Perceived Performance Test</h4>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => load('spinner')} style={{ padding: '0.5rem 1rem', background: mode === 'spinner' ? '#3B82F6' : 'white', color: mode === 'spinner' ? 'white' : '#3B82F6', border: '1px solid #3B82F6', borderRadius: '8px', cursor: 'pointer' }}>
          Load A (Spinner)
        </button>
        <button onClick={() => load('skeleton')} style={{ padding: '0.5rem 1rem', background: mode === 'skeleton' ? '#3B82F6' : 'white', color: mode === 'skeleton' ? 'white' : '#3B82F6', border: '1px solid #3B82F6', borderRadius: '8px', cursor: 'pointer' }}>
          Load B (Skeleton)
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '350px', margin: '0 auto', background: 'white', height: '400px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative' }}>

        {/* Header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#CBD5E1' }}></div>
          <div style={{ width: '100px', height: '10px', background: '#E2E8F0', borderRadius: '4px' }}></div>
        </div>

        <div style={{ padding: '1rem' }}>
          {!loading && !contentVisible && <div style={{ textAlign: 'center', marginTop: '50%' }}>Tap a button above</div>}

          {loading && mode === 'spinner' && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {loading && mode === 'skeleton' && (
            <div className="skeleton-pulse">
              <div style={{ width: '100%', height: '150px', background: '#E2E8F0', borderRadius: '8px', marginBottom: '1rem' }}></div>
              <div style={{ width: '80%', height: '15px', background: '#E2E8F0', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
              <div style={{ width: '60%', height: '15px', background: '#E2E8F0', borderRadius: '4px', marginBottom: '1.5rem' }}></div>
              <style>{`@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } } .skeleton-pulse > div { animation: pulse 1.5s infinite ease-in-out; }`}</style>
            </div>
          )}

          {contentVisible && (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <div style={{ width: '100%', height: '150px', background: 'linear-gradient(45deg, #3B82F6, #8B5CF6)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>HERO IMAGE</div>
              <h4 style={{ margin: '0 0 0.5rem' }}>Amazing Product</h4>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>This is the content you were waiting for. Notice how the Skeleton version felt faster?</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


// ==========================================
// PILLAR 3 MODULES AC
// ==========================================

// Module A: Fundamentals
export function Pillar3ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: Web Strategy & UX" subtitle="Architecture before bricks.">
      <div className="cw-prose">
        <p className="cw-text-body">
          You are about to build a house. Do you start by buying curtains, or by drawing a blueprint?
          Most beginners start with the creative stuff (colors, fonts).
          <strong>This is a mistake.</strong>
        </p>
        <p>In web development, "UX" (User Experience) is the architecture. It determines if the user feels confused or empowered.
          Steve Krug, author of "Don't Make Me Think", says that every confusing button drains the user's energy.
        </p>

        <CognitiveLoadBattery />

        <h3 style={{ marginTop: '2rem' }}>The Reservoir of Goodwill</h3>
        <p>
          Imagine every user starts with 100% patience. If they can't find the menu, -10%.
          If a pop-up blocks the screen, -20%. If the site is slow, -30%.
          When they hit 0%, they leave and never come back.
        </p>

        <ScenarioToggle
          oldTitle="The Greedy Marketer"
          oldContent={
            <div>
              <h4 style={{ color: '#991B1B' }}>The "Ask for Everything" Approach</h4>
              <p>You put a popup on load asking for their email. You have 12 items in the menu. You have a carousel with 5 slides.</p>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
                <strong>Result:</strong> User feels overwhelmed. Bounce rate: 85%.
              </div>
            </div>
          }
          newTitle="The Helpful Guide"
          newContent={
            <div>
              <h4 style={{ color: '#065F46' }}>The "One Clear Path" Approach</h4>
              <p>You have ONE main button ("Get Started"). You show value before asking for an email. Navigation has only 4 items.</p>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #6EE7B7' }}>
                <strong>Result:</strong> User feels smart. Conversion rate: High.
              </div>
            </div>
          }
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            UX is not "making it pretty". UX is <strong>financial engineering</strong>. If you reduce friction in your signup flow, you don't just "help the user"—you lower your Customer Acquisition Cost (CAC) immediately.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. The "1-Second" Rule</h4>
              <p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>
                New visitors decide in 0.05 seconds if they trust you. If your site looks cluttered or dated, they leave (Bounce). You paid for that click, and bad UX wasted it.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. AI Navigation</h4>
              <p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>
                In the near future, AI agents will browse your site for users. If your UX is confusing to a human, it's confusing to an AI agent trying to buy your product. "Clear is king."
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We turn your website into a conversion machine.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EC4899', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Conversion Rate Optimization (CRO):</strong> We don't guess. We analyze where users are getting stuck using heatmaps and redesign those flows for maximum profit via our <a href="/services?service=roi-custom-web-dev" style={{ color: '#EC4899', textDecoration: 'underline' }}>Performance Audits</a>.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EC4899', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Brand Authority:</strong> Our <a href="/services?service=future-digital-branding" style={{ color: '#EC4899', textDecoration: 'underline' }}>Design Systems</a> ensure every button and font screams "Premium Trust", allowing you to charge higher prices.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Why are Carousels/Sliders generally bad for UX?", options: ["They are too expensive", "Almost no one sees past the first slide and they slow down the site", "They are illegal"], correctIndex: 1 },
            { question: "What is 'Cognitive Load'?", options: ["How fast the CPU runs", "The amount of mental effort required to use the interface", "The weight of the server"], correctIndex: 1 },
            { question: "What is the '1-Second Rule' (or 0.05s)?", options: ["Users judge your site's credibility instantly", "It takes 1 second to load", "You must click in 1 second"], correctIndex: 0 },
            { question: "Why design 'Mobile First'?", options: ["Phones are small", "Everyone has a desktop", "Most web traffic is mobile, and it forces you to prioritize content"], correctIndex: 2 }
          ]}
          onNext={onNext}
        />

      </div>
    </InteractiveLayout>
  );
}

// Module B: No-Code
export function Pillar3ModuleB({ onNext }) {
  return (
    <InteractiveLayout title="Module B: The No-Code Revolution" subtitle="Validating without code.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Stop coding from scratch! If you are building a standard website, writing HTML/CSS by hand is like building a car by mining the metal yourself.
          <strong>Use the leverage available to you.</strong>
        </p>

        <h3 style={{ marginTop: '2rem' }}>The Citizen Developer</h3>
        <p>
          Tools like Webflow and Framer are not "toys". They write cleaner code than most junior developers.
          They allow you to move at the speed of thought.
        </p>

        <NoCodeRaceVisual />

        <ScenarioToggle
          oldTitle="❌ Custom Code Trap"
          oldContent={
            <p>Spends 4 weeks fighting with CSS Grid and server deployment just to put up a landing page. Burnout ensues.</p>
          }
          newTitle="✅ The Smart Stack"
          newContent={
            <p>Builds landing page in Carrd (1 hour). Connects Form to Airtable. Uses saved time to talk to customers.</p>
          }
        />

        <BookInsight title="Validated Learning" author="Eric Ries" book="The Lean Startup" color="#10B981">
          <p>"We must learn what customers really want, not what they say they want or what we think they should want."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #6EE7B7' }}>
          <CWHeading level={3} style={{ color: '#047857', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#065F46', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            In the Age of AI, "Code" is cheap. <strong>Speed</strong> is the new currency. Your competitors are using AI and No-Code tools to launch experiments weekly. If you are stuck in a 6-month "Waterfall" build, you will lose.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>1. The Cost of Delay</h4>
              <p style={{ fontSize: '0.95rem', color: '#064E3B', lineHeight: '1.6' }}>
                Every week you wait to launch is a week of lost data. No-Code allows you to validate an idea for R500 before spending R50,000 on custom development.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>2. Agility</h4>
              <p style={{ fontSize: '0.95rem', color: '#064E3B', lineHeight: '1.6' }}>
                Marketing needs to change the headline? With No-Code, they do it themselves. With custom code, they file a ticket and wait 3 days. Agility wins markets.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We choose the right tool for the job. Often, that tool is speed.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Rapid MVP Launches:</strong> Need to test a market? We use <a href="/services?service=roi-custom-web-dev" style={{ color: '#10B981', textDecoration: 'underline' }}>Low-Code Platforms</a> to get your product live in days, not months.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Marketing Autonomy:</strong> We build <a href="/services?service=future-digital-branding" style={{ color: '#10B981', textDecoration: 'underline' }}>Visual Editing Systems</a> (using tools like Sanity or Builder.io) so your marketing team can build new landing pages without calling a developer.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the primary benefit of No-Code tools for startups?", options: ["It requires no computer", "Speed to market validation (testing ideas fast)", "It uses blockchain"], correctIndex: 1 },
            { question: "When should you potentially switch from No-Code to Custom Code?", options: ["Immediately", "When you need complex, unique features or hit scale limits", "Never"], correctIndex: 1 },
            { question: "Does 'No-Code' mean 'Low Quality'?", options: ["Yes, always", "No, modern tools build professional, fast sites", "Only for hobbies"], correctIndex: 1 },
            { question: "What is a CMS?", options: ["Content Management System (e.g. for Blogs)", "Computer Made Simple", "Code Made Slow"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module C: Code Foundations
export function Pillar3ModuleC({ onNext }) {
  return (
    <InteractiveLayout title="Module C: Deep Dive into Code" subtitle="HTML, CSS, JS & The DOM.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Even if you use AI to write code, you must understand the fundamentals to debug it.
          The browser is an engine. HTML is the chassis. CSS is the paint. JavaScript is the engine logic.
        </p>

        <BoxModelInteractive />

        <h3 style={{ marginTop: '2rem' }}>Semantic HTML</h3>
        <p>Using a <code>&lt;div&gt;</code> for a button is a cardinal sin. It ruins accessibility for blind users. Use the right tag for the job.</p>

        <ScenarioToggle
          oldTitle="The Div Soup"
          oldContent={
            <code>&lt;div onclick="..."&gt;Click Me&lt;/div&gt;</code>
          }
          newTitle="Semantic Gold"
          newContent={
            <code>&lt;button type="button"&gt;Click Me&lt;/button&gt;</code>
          }
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '24px', border: '1px solid #BFDBFE' }}>
          <CWHeading level={3} style={{ color: '#1E40AF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E3A8A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            You don't need to write code, but you need to understand <strong>Code Quality</strong>. Bad code ("Spaghetti Code") is like a building with a weak foundation. It looks fine on Day 1, but cracks on Day 100.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#1E40AF', marginBottom: '0.5rem' }}>1. The "SEO" Language</h4>
              <p style={{ fontSize: '0.95rem', color: '#1E3A8A', lineHeight: '1.6' }}>
                Google bot is blind. It reads code (HTML), not pixels. If your site is built with "Div Soup" (bad code), Google can't understand your content, and you won't rank. Semantic HTML is an SEO superpower.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#1E40AF', marginBottom: '0.5rem' }}>2. Vendor Lock-In</h4>
              <p style={{ fontSize: '0.95rem', color: '#1E3A8A', lineHeight: '1.6' }}>
                If you rely on a proprietary drag-and-drop builder with messy code export, you can never move your site. Clean, standard code ensures you own your digital asset forever.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #DBEAFE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We write code for machines (Google) and humans.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Code Quality Audits:</strong> We use industry-standard tools to scan your existing site for "Code Rot" and security holes via our <a href="/services?service=performance-first" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Performance First</a> audits.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Semantic SEO:</strong> Our <a href="/services?service=seo-2025-beyond-keywords" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Advanced SEO</a> builds use Schema.org markup so AI agents (like ChatGPT) can easily read and recommend your business.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Which CSS property adds space *inside* the border?", options: ["Margin", "Padding", "Flex"], correctIndex: 1 },
            { question: "Which CSS property adds space *outside* the border?", options: ["Margin", "Padding", "Color"], correctIndex: 0 },
            { question: "Why use Semantic HTML (like <button> instead of <div>)?", options: ["It is shorter", "It improves Accessibility and SEO", "It is blue"], correctIndex: 1 },
            { question: "Who primarily 'reads' your HTML code?", options: ["Your mom", "Search Engine Bots (Google) and Browsers", "No one"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module D: Modern Frameworks
export function Pillar3ModuleD({ onNext }) {
  return (
    <InteractiveLayout title="Module D: Component Architecture" subtitle="React, Next.js & Atomic Design.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Modern web development is <strong>component-based</strong>. We don't build pages; we build systems of reusable parts. This is like LEGO.
        </p>

        <h3>The Virtual DOM Magic</h3>
        <p>Why is React so fast? Because it doesn't reload the page. It keeps a "Virtual" copy of the page in memory, calculates what changed, and only updates that tiny piece.</p>

        <VirtualDOMVisual />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', borderRadius: '24px', border: '1px solid #86EFAC' }}>
          <CWHeading level={3} style={{ color: '#15803D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#166534', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Traditional websites are "Monoliths"—if you want to change the header, you might break the footer. <strong>Component Architecture</strong> (React) reduces your "Technical Debt". It makes your site cheaper to maintain in the long run.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#15803D', marginBottom: '0.5rem' }}>1. Scalability</h4>
              <p style={{ fontSize: '0.95rem', color: '#14532D', lineHeight: '1.6' }}>
                Netflix, Facebook, and Airbnb run on React because it scales. As your business grows from 10 pages to 10,000, React keeps it organized.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#15803D', marginBottom: '0.5rem' }}>2. The "App-Like" Feel</h4>
              <p style={{ fontSize: '0.95rem', color: '#14532D', lineHeight: '1.6' }}>
                Users expect websites to feel instant, like an iPhone app. React enables this. If your site feels "clunky" (full page reloads), users perceive your brand as "old".
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #DCFCE7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build "Digital Assets", not just pages.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#22C55E', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Custom Web Apps:</strong> Need a client portal or a booking engine? We build it with React/Next.js via our <a href="/services?service=roi-custom-web-dev" style={{ color: '#22C55E', textDecoration: 'underline' }}>Custom Dev Service</a>, ensuring it's fast and secure.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#22C55E', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>UI Kits:</strong> We create a "Design System" for your brand. This means consistency. Your buttons, forms, and colors will be identical across every page, building <a href="/services?service=future-digital-branding" style={{ color: '#22C55E', textDecoration: 'underline' }}>Brand Trust</a>.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Why does React use a Virtual DOM?", options: ["To use more memory", "To start a virtual reality game", "To improve performance by only updating changed elements"], correctIndex: 2 },
            { question: "What is a 'Component' in React?", options: ["A reusable piece of UI (like a Button)", "A database", "A server"], correctIndex: 0 },
            { question: "Why choose Next.js over plain React?", options: ["It is harder", "Better SEO (SSR) and built-in routing", "It uses Python"], correctIndex: 1 },
            { question: "What is 'State'?", options: ["The location of the user", "Data that changes over time (like a counter)", "A law"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module E: Backend & APIs
export function Pillar3ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: Serverless & APIs" subtitle="The invisible infrastructure.">
      <div className="cw-prose">
        <p>The "Backend" is where the logic lives. In the past, you rented a physical server computer. Now, you rent "Functions" (Serverless) that only exist when someone clicks a button.</p>

        <APIWaiterVisual />

        <ScenarioToggle
          oldTitle="Monolith (Risky)"
          oldContent="If the salad station catches fire, the whole restaurant closes."
          newTitle="Microservices (Safe)"
          newContent="If the salad station catches fire, the steak station keeps cooking."
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', borderRadius: '24px', border: '1px solid #FDBA74' }}>
          <CWHeading level={3} style={{ color: '#EA580C', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9A3412', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Your business data lives in silos (Email, Xero, CRM). <strong>APIs</strong> are the pipes that connect them. If you master APIs, you can automate 80% of your manual admin work.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#C2410C', marginBottom: '0.5rem' }}>1. The "Ecosystem" Play</h4>
              <p style={{ fontSize: '0.95rem', color: '#9A3412', lineHeight: '1.6' }}>
                You don't need to build a payment system; use Stripe's API. You don't need to build a map; use Google's API. "Composability" allows small businesses to have enterprise-grade features.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#C2410C', marginBottom: '0.5rem' }}>2. Resilience</h4>
              <p style={{ fontSize: '0.95rem', color: '#9A3412', lineHeight: '1.6' }}>
                If you use "Serverless" functions, you don't pay for idle servers. It's infinite scale. If 10,000 people visit at once, the serverless cloud spins up 10,000 functions instantly.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FED7AA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We glue the internet together for you.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F97316', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Business Automation:</strong> We use APIs to connect your website forms to your CRM, Slack, and Email tools via our <a href="/services?service=ai-agents-sales-team" style={{ color: '#F97316', textDecoration: 'underline' }}>AI & Automation</a> service. Stop copying data manually.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F97316', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Custom Integrations:</strong> Need to pull stock levels from your warehouse software onto your website? We build custom API bridges via <a href="/services?service=roi-custom-web-dev" style={{ color: '#F97316', textDecoration: 'underline' }}>Custom Dev</a>.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is a major benefit of Microservices?", options: ["It uses less code", "Isolation of failure (if one part breaks, the rest works)", "It makes the logo bigger"], correctIndex: 1 },
            { question: "What is an API (Application Programming Interface)?", options: ["A type of beer", "A 'Waiter' that takes requests between software systems (e.g. Website <-> Database)", "A programming language"], correctIndex: 1 },
            { question: "What is 'Serverless' computing?", options: ["Computers without screens", "Running code as functions on demand without managing a physical server", "Magic"], correctIndex: 1 },
            { question: "Why use APIs for business?", options: ["They are free", "To automate workflows (connect CRM to Website) and reduce manual admin", "To look cool"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module F: Hosting
export function Pillar3ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: Edge Computing" subtitle="Speed through Physics.">
      <div className="cw-prose">
        <p>Speed of light is finite. If your server is in London and your user is in Cape Town, the signal has to travel 10,000km. That takes time (~180ms).</p>
        <p><strong>Edge Computing</strong> puts a mini-server in Cape Town. Now the signal travels 5km (~5ms). This is instant.</p>

        <EdgePingVisual />

        <CWAlert type="info" title="Vercel & Netlify">
          These platforms deploy your code to 300+ locations worldwide instantly. You don't manage servers. You just push code.
        </CWAlert>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)', borderRadius: '24px', border: '1px solid #D8B4FE' }}>
          <CWHeading level={3} style={{ color: '#7E22CE', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#6B21A8', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Digital Real Estate has a location problem. If your server is in New York, your Cape Town customers wait 2 seconds for a response. <strong>Edge Computing</strong> solves this.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#A855F7', marginBottom: '0.5rem' }}>1. Milliseconds = Money</h4>
              <p style={{ fontSize: '0.95rem', color: '#581C87', lineHeight: '1.6' }}>
                Amazon found that every 100ms lag costs 1% in sales. If your site is "global" but your server is "local", you are losing international revenue.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#A855F7', marginBottom: '0.5rem' }}>2. SEO Impact</h4>
              <p style={{ fontSize: '0.95rem', color: '#581C87', lineHeight: '1.6' }}>
                Google measures your "Time to First Byte" (TTFB). Edge hosting ensures your TTFB is under 50ms worldwide, giving you a massive ranking boost over competitors on cheap hosting.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E9D5FF', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We deploy your site to the Edge, not just a server.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#9333EA', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Global CDN Config:</strong> We configure Cloudflare/Vercel Edge Networks so your content loads instantly in London, New York, and Joburg simultaneously via our <a href="/services?service=performance-first" style={{ color: '#9333EA', textDecoration: 'underline' }}>Performance First</a> optimization.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#9333EA', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Uptime Guarantee:</strong> Edge networks don't go down because they are decentralized. We monitor this 24/7 with our <a href="/services?service=roi-custom-web-dev" style={{ color: '#9333EA', textDecoration: 'underline' }}>Care Plans</a>.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Which rendering method is generally fastest for a Blog?", options: ["SSG (Static Site Generation)", "SSR (Server Side)", "CSR (Client Side)"], correctIndex: 0 },
            { question: "What is 'Edge Computing'?", options: ["Computing on the edge of a cliff", "Running servers geographically close to the user to reduce latency", "Using old computers"], correctIndex: 1 },
            { question: "What causes 'Latency' (lag)?", options: ["The speed of light/distance between user and server", "Bad WiFi only", "Too many pixels"], correctIndex: 0 },
            { question: "Why use a global CDN (Content Delivery Network)?", options: ["To make the site slower", "To serve images/files from a server closest to the user instantly", "To save money only"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module G: Performance
export function Pillar3ModuleG({ onNext }) {
  return (
    <InteractiveLayout title="Module G: Performance Engineering" subtitle="Beyond 'Fast Loading'.">
      <div className="cw-prose">
        <p>Performance is not just about numbers; it is about <strong>Perception</strong>. The user hates wondering "Is it broken?".</p>

        <SkeletonLoaderVisual />

        <p>Both versions above take exactly 2.5 seconds to load. But the "Skeleton" version <strong>feels</strong> faster because it gives immediate feedback.</p>

        <ScenarioToggle
          oldTitle="The Spinner ⏳"
          oldContent="User stares at a spinning circle. Brain interaction: 'Waiting'. Frustration builds."
          newTitle="The Skeleton 💀"
          newContent="User sees the layout structure instantly. Brain interaction: 'It is loading'. Frustration minimized."
        />

        <BookInsight title="The Bottleneck" author="Ilya Grigorik" book="High Performance Browser Networking" color="#EF4444">
          <p>"It is not bandwidth that constraints the modern web, but latency."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)', borderRadius: '24px', border: '1px solid #C7D2FE' }}>
          <CWHeading level={3} style={{ color: '#3730A3', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#312E81', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Amazon found that every 100ms of latency costs them 1% in sales. Google found that if a site takes longer than 3 seconds to load, 53% of users leave. Speed is Revenue.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#4338CA', marginBottom: '0.5rem' }}>1. The "Bounce" Rate</h4>
              <p style={{ fontSize: '0.95rem', color: '#3730A3', lineHeight: '1.6' }}>
                If your site is slow, users don't blame their connection; they blame your brand. They click "Back" and go to your competitor.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#4338CA', marginBottom: '0.5rem' }}>2. SEO Ranking</h4>
              <p style={{ fontSize: '0.95rem', color: '#3730A3', lineHeight: '1.6' }}>
                Google's "Core Web Vitals" update explicitly penalizes slow sites. Fast sites rank higher, get more traffic, and pay less for ads (higher Quality Score).
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #C7D2FE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We engineer for perceived and actual speed.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#4F46E5', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Optimistic UI:</strong> We use "Skeleton Screens" and "Optimistic Updates" (showing the 'Like' instantly before the server confirms) to make your app feel native.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#4F46E5', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Next.js Optimization:</strong> We use Server Side Rendering (SSR) and Image Optimization to ensuring your <a href="/services?service=performance-first" style={{ color: '#4F46E5', textDecoration: 'underline' }}>Performance Score</a> is 90+.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What causes 'Cumulative Layout Shift' (CLS)?", options: ["Images/Ads loading without defined dimensions", "Fast Internet", "Good design"], correctIndex: 0 },
            { question: "What is a 'Skeleton Screen'?", options: ["A scary image", "A gray placeholder that shows layout while content loads (improves perceived speed)", "A broken site"], correctIndex: 1 },
            { question: "Why is 'Perceived Performance' important?", options: ["Users hate waiting; making it 'feel' fast keeps them engaged", "It isn't", "It tricks speed tests"], correctIndex: 0 },
            { question: "What is the biggest bottleneck in mobile web?", options: ["CPU speed", "Latency (Network Delay)", "Screen size"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module H: Security
export function Pillar3ModuleH({ onNext }) {
  return (
    <InteractiveLayout title="Module H: Zero Trust Security" subtitle="Paranoia is a virtue.">
      <div className="cw-prose">
        <p>The internet is a hostile place. Automated bots are scanning your site for weaknesses 24/7.
          The #1 rule: <strong>Never Trust User Input.</strong>
        </p>

        <SQLInjectionVisual />

        <p>If you don't sanitize this input, the database reads "OR 1=1" as "True" and grants admin access instantly.</p>

        <ScenarioToggle
          oldTitle="Trusting Input"
          oldContent="User types malicious code. Server executes it. Data Stolen."
          newTitle="Sanitization"
          newContent="Server cleans input. Malicious code becomes harmless text. Data Safe."
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)', borderRadius: '24px', border: '1px solid #FECACA' }}>
          <CWHeading level={3} style={{ color: '#BE123C', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9F1239', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            One hack can bankrupt a small business. It's not just the R100,000 ransom; it's the loss of customer trust (Reputation Damage) which you can never buy back.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#E11D48', marginBottom: '0.5rem' }}>1. The "POPI Act" Fine</h4>
              <p style={{ fontSize: '0.95rem', color: '#881337', lineHeight: '1.6' }}>
                If you leak customer emails because of a cheap WordPress plugin, you are liable for fines up to R10 million in South Africa. Security is compliance.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#E11D48', marginBottom: '0.5rem' }}>2. Business Continuity</h4>
              <p style={{ fontSize: '0.95rem', color: '#881337', lineHeight: '1.6' }}>
                Recovering from a hack takes an average of 21 days. Can your business survive being offline for 3 weeks? Zero Trust ensures you stay online.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FECACA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build Fort Knox, not just a website.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F43F5E', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Enterprise Security:</strong> Our <a href="/services?service=roi-custom-web-dev" style={{ color: '#F43F5E', textDecoration: 'underline' }}>Maintenance Plans</a> include 24/7 uptime monitoring, daily backups, and automated penetration testing.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F43F5E', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Secure Code Standards:</strong> We don't use 30 random plugins. We write custom, clean code that has zero known vulnerabilities.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is 'SQL Injection'?", options: ["A medical procedure", "Inserting malicious database commands into user input fields", "Injecting speed into a server"], correctIndex: 1 },
            { question: "What is 'Zero Trust' security?", options: ["Trusting no one inside or outside the network; verifying every request", "Trusting your employees only", "Having no firewall"], correctIndex: 0 },
            { question: "Why must you sanitize user input?", options: ["To keep the database clean", "To prevent hackers from executing code on your server", "To check for spelling"], correctIndex: 1 },
            { question: "Who is scanning your site for vulnerabilities?", options: ["No one", "Automated Bots (24/7)", "Only the FBI"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module I: Ecommerce
export function Pillar3ModuleI({ onNext }) {
  return (
    <InteractiveLayout title="Module I: E-commerce Psychology" subtitle="Designing for the wallet.">
      <div className="cw-prose">
        <p>Building a shop is easy. Getting people to trust it with their credit card is hard.</p>
        <h3>Friction vs Motivation</h3>
        <p>To increase sales, you must remove barriers (Friction). Every extra field in a form reduces sales by 10%.</p>

        <CheckoutFrictionVisual />

        <ScenarioToggle
          oldTitle="The Interrogation"
          oldContent="Name? Middle Name? Fax? How did you hear about us? Create Account? Verify Email? (User leaves)"
          newTitle="Guest Checkout"
          newContent="Email? Card Number. Pay. (User buys)"
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #6EE7B7' }}>
          <CWHeading level={3} style={{ color: '#047857', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#065F46', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            70% of shopping carts are abandoned. That means for every R100 you make, you left R230 on the table just because your checkout process was annoying.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>1. The "Guest Checkout" Millions</h4>
              <p style={{ fontSize: '0.95rem', color: '#064E3B', lineHeight: '1.6' }}>
                When ASOS removed the "Create Account" requirement and added Guest Checkout, their sales increased by 50% overnight. Don't force marriage on the first date.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>2. Trust Signals</h4>
              <p style={{ fontSize: '0.95rem', color: '#064E3B', lineHeight: '1.6' }}>
                If your site doesn't look secure (HTTPS, clean design, Payment Logos), people won't pay. Design quality = Perceived Security.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #6EE7B7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build high-converting storefronts.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Stripe/PayStack Integration:</strong> We integrate seamless payment gateways via our <a href="/services?service=roi-custom-web-dev" style={{ color: '#10B981', textDecoration: 'underline' }}>Commerce Service</a> that handle 3D Secure without breaking the flow.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>One-Page Checkout:</strong> We design checkout flows that fit on a single screen, reducing abandonment by 30%.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "How do you improve checkout conversion?", options: ["Ask more questions", "Reduce friction (remove unnecessary fields)", "Make the font smaller"], correctIndex: 1 },
            { question: "What is 'Guest Checkout'?", options: ["Checking out at a hotel", "Allowing purchase without creating an account", "Buying as a gift"], correctIndex: 1 },
            { question: "Every extra field in a form...", options: ["Increases data", "Reduces conversion rate (Sales)", "Makes users happy"], correctIndex: 1 },
            { question: "What kills a sale fastest?", options: ["High price", "Friction (Confusion/Effort)", "Bad colors"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module J: CMS
export function Pillar3ModuleJ({ onNext }) {
  return (
    <InteractiveLayout title="Module J: Headless CMS" subtitle="Future-proofing content.">
      <div className="cw-prose">
        <p>In the past, your content was locked inside WordPress. Today, content needs to go everywhere: Your App, Your Website, Your Smart Watch.</p>
        <p><strong>Headless CMS</strong> (like Sanity or Strapi) stores content as pure data (JSON), not HTML. It breeds flexibility.</p>

        <HeadlessCMSVisual />

        <ScenarioToggle
          oldTitle="WordPress (Coupled)"
          oldContent="You write 'Summer Sale' in WordPress. It appears on the website. But your Mobile App doesn't know about it. You have to copy-paste it manually."
          newTitle="Headless (Decoupled)"
          newContent="You write 'Summer Sale' in Sanity/Headless CMS. The Website, Mobile App, and Smart Watch all fetch it instantly via API."
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '24px', border: '1px solid #BFDBFE' }}>
          <CWHeading level={3} style={{ color: '#1E40AF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E3A8A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Content is expensive to create. If your content is trapped in a website "Theme", it is a liability. If it is stored as "Data" (Headless), it is an Asset you can use everywhere.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#1E40AF', marginBottom: '0.5rem' }}>1. Omnichannel Ready</h4>
              <p style={{ fontSize: '0.95rem', color: '#1E3A8A', lineHeight: '1.6' }}>
                Today you have a website. Tomorrow you might need an iPhone App or a Digital Billboard. Headerless CMS lets you push content to all of them without rewriting a single word.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#1E40AF', marginBottom: '0.5rem' }}>2. Future Proofing</h4>
              <p style={{ fontSize: '0.95rem', color: '#1E3A8A', lineHeight: '1.6' }}>
                When you want to redesign your site in 3 years, you don't have to migrate your content. You just build a new "Front End" (Skin) and plug it into the same Content Database.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #DBEAFE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build content infrastructures.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Sanity IO Integration:</strong> We are experts in implementing Sanity CMS, giving your marketing team a "Google Docs" like editing experience that powers your enterprise site.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is a major advantage of Headless CMS?", options: ["It has no interface", "Content can be deployed to multiple platforms (Omnichannel) via API", "It is older"], correctIndex: 1 },
            { question: "What does 'Headless' mean?", options: ["No brain", "The frontend (Head) is decoupled from the backend (Body)", "Scary"], correctIndex: 1 },
            { question: "Why move away from traditional WordPress?", options: ["It is too popular", "Security risks, plugin bloat, and lack of flexibility", "It is free"], correctIndex: 1 },
            { question: "What is 'Omnichannel' content?", options: ["Content that lives on one channel", "Content that can be pushed to Web, App, Watch, and Screen simultaneously", "TV channels"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// ==========================================
// MODULE L: RESOURCES
// ==========================================
export function Pillar3Resources({ onNext }) {
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
    <InteractiveLayout title="Module L: Resources" subtitle="The Architect's Toolkit">
      <div className="cw-prose">
        <p>Great architects don't memorize every brick. They know where to find the blueprints. Here is the exact stack we use at CapeWeb to build scalable, high-performance platforms.</p>

        <h3 style={{ marginTop: '2rem' }}>🛠️ The CapeWeb Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Hosting & Edge"
            title="Vercel"
            description="The absolute best way to deploy Next.js apps. Zero config, instant global edge network."
            link="https://vercel.com"
          />
          <ResourceCard
            category="Framework"
            title="Next.js"
            description="The React framework for production. Hybrid static & server rendering."
            link="https://nextjs.org"
          />
          <ResourceCard
            category="Styling"
            title="Tailwind CSS"
            description="Rapidly build modern websites without ever leaving your HTML. Utility-first."
            link="https://tailwindcss.com"
          />
          <ResourceCard
            category="Database"
            title="Supabase"
            description="The open source Firebase alternative. Postgres database, Auth, and Storage."
            link="https://supabase.com"
          />
          <ResourceCard
            category="Design"
            title="Figma"
            description="Where design happens. The industry standard for UI/UX collaboration."
            link="https://figma.com"
          />
        </div>

        <h3 style={{ marginTop: '3rem' }}>📚 Recommended Reading</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Usability"
            title="Don't Make Me Think"
            description="By Steve Krug. The bible of web usability. If you read one book, read this."
            link="https://sensible.com/dont-make-me-think/"
          />
          <ResourceCard
            category="Design System"
            title="Refactoring UI"
            description="By Adam Wathan & Steve Schoger. Learn how to design beautiful UIs without a degree."
            link="https://www.refactoringui.com/"
          />
          <ResourceCard
            category="Performance"
            title="High Performance Browser Networking"
            description="By Ilya Grigorik. Deep dive into how the internet actually works."
            link="https://hpbn.co/"
          />
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <h4>Ready for the Final Exam?</h4>
          <p style={{ marginBottom: '1.5rem', color: '#64748B' }}>You have completed all learning modules. It's time to prove your knowledge.</p>
          <CWButton onClick={onNext} variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Take Final Exam 🏁</CWButton>
        </div>
      </div>
    </InteractiveLayout>
  )
}

// ==========================================
// FINAL QUIZ COMPONENT
// ==========================================

export function Pillar3Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  // Use local state if props are not provided (stand-alone mode support)
  const [localResponses, setLocalResponses] = useState({});
  const activeResponses = quizResponses || localResponses;
  const activeSetResponse = onSelect || ((qMvc, optIdx) => setLocalResponses(prev => ({ ...prev, [qMvc]: optIdx })));

  const questions = pillar3QuizQuestions;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = activeResponses[currentQuestionIndex] !== undefined;

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(c => c + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(c => c - 1);
    }
  };

  const handleScore = () => {
    if (onScore) {
      onScore();
    } else {
      // Local scoring logic if no prop provided
      let correct = 0;
      questions.forEach((q, i) => {
        if (activeResponses[i] === q.correctIndex) correct++;
      });
      if (correct >= 8) setIsPassed(true);
    }

    // If we have a success message (passed down) or local logic implies pass
    // We trigger finish
    if (onFinish) onFinish();
  };

  if (scoreMessage && scoreMessage.includes('Pass')) {
    return (
      <CWCard>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <CWHeading level={3}>Pillar 2 Complete!</CWHeading>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{scoreMessage}</p>
          <CWButton onClick={onFinish}>Continue to Certificate →</CWButton>
        </div>
      </CWCard>
    );
  }

  return (
    <QuizLayout title="Final Exam: Web Architecture" currentStep={currentQuestionIndex + 1} totalSteps={questions.length}>
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
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #CBD5E1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: activeResponses[currentQuestionIndex] === idx ? '#0b0f1a' : 'transparent',
                borderColor: activeResponses[currentQuestionIndex] === idx ? '#0b0f1a' : '#CBD5E1'
              }}>
                {activeResponses[currentQuestionIndex] === idx && <div style={{ width: '10px', height: '10px', background: '#fff', borderRadius: '50%' }} />}
              </div>
              {option}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <CWButton variant="ghost" onClick={handlePrev} disabled={currentQuestionIndex === 0} style={{ opacity: currentQuestionIndex === 0 ? 0 : 1 }}>
            ← Previous
          </CWButton>

          {isLastQuestion ? (
            <CWButton variant="primary" onClick={handleScore} disabled={!hasAnsweredCurrent}>
              Submit Exam 🏁
            </CWButton>
          ) : (
            <CWButton variant="primary" onClick={handleNext} disabled={!hasAnsweredCurrent}>
              Next Question →
            </CWButton>
          )}
        </div>

        {scoreMessage && !scoreMessage.includes('Pass') && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#FEF2F2', color: '#991B1B', borderRadius: '8px', textAlign: 'center' }}>
            {scoreMessage}
          </div>
        )}
      </div>
    </QuizLayout>
  );
}

export function Pillar3Completion() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>🎓</h1>
      <CWHeading level={2}>Web Architecture Mastered</CWHeading>
      <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '1rem auto' }}>
        You now understand the deep principles of the modern web: from Atomic Design to Edge Computing, and from User Psychology to Zero Trust Security.
      </p>
    </div>
  );
}
