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
    question: 'According to Steve Krug in "Don\'t Make Me Think", what is the primary cause of user frustration?',
    options: ['Ugly colors', 'Cognitive Load (making them think)', 'Slow internet'],
    correctIndex: 1,
  },
  {
    question: 'The "Atomic Design" methodology suggests building UIs starting from:',
    options: ['The whole page', 'The smallest atoms (buttons/inputs)', 'The footer'],
    correctIndex: 1,
  },
  {
    question: 'In the "Jamstack" architecture, what is a key benefit?',
    options: ['It uses actual jam', 'Decoupling frontend from backend for speed & security', 'It requires Microsoft Windows'],
    correctIndex: 1,
  },
  {
    question: 'What is the "concierge MVP" concept from The Lean Startup?',
    options: ['Building a hotel app', 'Manually performing a service to test value before coding automation', 'Hiring a receptionist'],
    correctIndex: 1,
  },
  {
    question: 'Why is "Edge Computing" (like Vercel) faster than traditional hosting?',
    options: ['It uses better cables', 'It runs code on servers physically closest to the user', 'It allows 5G only'],
    correctIndex: 1,
  },
  {
    question: 'According to "High Performance Browser Networking", what is the bottleneck of modern web?',
    options: ['Bandwidth (speed)', 'Latency (delay)', 'CPU power'],
    correctIndex: 1,
  },
  {
    question: 'The "Principle of Least Privilege" in security means:',
    options: ['Giving everyone admin access', 'Giving users/systems only the access they strictly need', 'Not using passwords'],
    correctIndex: 1,
  },
  {
    question: 'What does "Perceived Performance" refer to?',
    options: ['How fast the site actually loads', 'How fast the site *feels* to the user (e.g. via skeletons)', 'The FPS count'],
    correctIndex: 1,
  },
  {
    question: 'In "Refactoring UI", what is recommended for better design hierarchy?',
    options: ['Making everything bold', 'Using size, color, and weight contrast', 'Using 10 different fonts'],
    correctIndex: 1,
  },
  {
    question: 'What is "Prop Drilling" in React typically solved by?',
    options: ['Drilling holes in the screen', 'State Management / Context API', 'Buying a new mouse'],
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
    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
      <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: load < 40 ? '#EF4444' : '#10B981', transition: 'color 0.3s' }}>
        User Patience: {load}%
      </div>
      <div style={{ width: '100%', height: '40px', background: '#E2E8F0', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '2px solid #CBD5E1' }}>
        <div style={{
          width: `${load}%`,
          height: '100%',
          background: load < 40 ? '#EF4444' : '#10B981',
          transition: 'width 0.1s linear, background 0.3s'
        }} />
      </div>
      <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '0.5rem' }}>
        Every pop-up, slow loading spinner, or confusing menu drains this battery. <br />
        When it hits 0%, the user leaves.
      </p>
      <CWButton onClick={reset} style={{ marginTop: '1rem' }} variant="secondary">Reset Battery ⚡</CWButton>
    </div>
  );
}

function BoxModelInteractive() {
  const [padding, setPadding] = useState(20);
  return (
    <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', textAlign: 'center' }}>
      <h4 style={{ marginBottom: '1rem' }}>CSS Box Model Playground</h4>
      <div style={{ marginBottom: '1rem' }}>
        <label>Padding: {padding}px</label>
        <input type="range" min="0" max="60" value={padding} onChange={(e) => setPadding(parseInt(e.target.value))} style={{ width: '100%', marginTop: '0.5rem' }} />
      </div>
      <div style={{ background: '#fbbf24', padding: '20px', border: '2px dashed #000', borderRadius: '8px', display: 'inline-block' }}>
        <span style={{ fontSize: '0.8rem', display: 'block' }}>Margin (Outer)</span>
        <div style={{ background: '#60a5fa', padding: '10px', border: '5px solid #000' }}>
          <span style={{ fontSize: '0.8rem' }}>Border</span>
          <div style={{ background: '#4ade80', padding: `${padding}px`, transition: 'padding 0.3s' }}>
            <span style={{ fontSize: '0.8rem' }}>Padding (Inner Space)</span>
            <div style={{ background: '#fff', padding: '10px' }}>
              <strong>Content</strong>
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '2rem 0' }}>
      <div style={{ padding: '1rem', border: '2px solid #EF4444', borderRadius: '12px', background: '#FEF2F2', opacity: updated ? 0.5 : 1 }}>
        <strong>Old Way (HTML)</strong>
        <p>Reloads Entire Page</p>
        <div style={{ marginTop: '1rem', fontSize: '2rem' }}>🔄</div>
      </div>
      <div style={{ padding: '1rem', border: '2px solid #10B981', borderRadius: '12px', background: '#ECFDF5' }}>
        <strong>New Way (React)</strong>
        <p>Updates Only the Number</p>
        <div style={{ marginTop: '1rem', fontSize: '2rem', transition: 'transform 0.2s', transform: updated ? 'scale(1.5)' : 'scale(1)' }}>
          {updated ? '5' : '4'}
        </div>
        <button onClick={() => setUpdated(!updated)} style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem' }}>Click Me</button>
      </div>
    </div>
  )
}

function ScenarioToggle({ oldTitle, oldContent, newTitle, newContent }) {
  const [view, setView] = useState('old');
  return (
    <div style={{ margin: '3rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', background: '#F1F5F9', padding: '0.5rem', borderRadius: '100px', width: 'fit-content', margin: '0 auto 2rem' }}>
        <button onClick={() => setView('old')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'old' ? '#fff' : 'transparent', color: view === 'old' ? '#EF4444' : '#64748B', fontWeight: 800, boxShadow: view === 'old' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>{oldTitle}</button>
        <button onClick={() => setView('new')} style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', border: 'none', background: view === 'new' ? '#fff' : 'transparent', color: view === 'new' ? '#10B981' : '#64748B', fontWeight: 800, boxShadow: view === 'new' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>{newTitle}</button>
      </div>
      {view === 'old' ? (
        <div style={{ padding: '1.5rem', background: '#FEF2F2', borderRadius: '24px', border: '2px solid #FECACA', animation: 'fadeIn 0.5s' }}>
          {oldContent}
        </div>
      ) : (
        <div style={{ padding: '1.5rem', background: '#ECFDF5', borderRadius: '24px', border: '2px solid #A7F3D0', animation: 'fadeIn 0.5s' }}>
          {newContent}
        </div>
      )}
    </div>
  );
}

// ==========================================
// PILLAR 3 MODULES AC
// ==========================================

// Interactive: UX Friction Simulator
function UXFrictionSimulator() {
  const [buttonText, setButtonText] = useState('Submit');
  const [buttonColor, setButtonColor] = useState('#94A3B8'); // Slate 400
  const [hasClutter, setHasClutter] = useState(true);

  // Calculate "Conversion Score"
  let score = 10; // Base score
  if (buttonText === 'Get My Free Guide') score += 30;
  if (buttonColor === '#2563EB') score += 40; // Blue
  if (!hasClutter) score += 20;

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#0F172A' }}>Interactive: The "Conversion" Lab</h3>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#64748B' }}>
        Tweak the interface below to see how small UX changes explode your conversion rate.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>

        {/* Controls */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>1. Button Copy</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setButtonText('Submit')} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: buttonText === 'Submit' ? '2px solid #000' : '1px solid #CBD5E1', background: '#fff', cursor: 'pointer' }}>"Submit"</button>
              <button onClick={() => setButtonText('Get My Free Guide')} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: buttonText !== 'Submit' ? '2px solid #000' : '1px solid #CBD5E1', background: '#fff', cursor: 'pointer' }}>"Get Free Guide"</button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>2. Button Color (Contrast)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setButtonColor('#94A3B8')} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#94A3B8', border: buttonColor === '#94A3B8' ? '3px solid #000' : 'none', cursor: 'pointer' }} title="Low Contrast"></button>
              <button onClick={() => setButtonColor('#2563EB')} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2563EB', border: buttonColor === '#2563EB' ? '3px solid #000' : 'none', cursor: 'pointer' }} title="High Contrast"></button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>3. Distractions</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label className="switch" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={!hasClutter} onChange={() => setHasClutter(!hasClutter)} style={{ width: '20px', height: '20px' }} />
                <span>Remove Clutter?</span>
              </label>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0', position: 'relative', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>

          {hasClutter && (
            <>
              <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.8rem', color: '#EF4444', animation: 'float 3s infinite ease-in-out' }}>Buy Now!</div>
              <div style={{ position: 'absolute', bottom: '20px', right: '10px', fontSize: '0.8rem', color: '#F59E0B', animation: 'float 4s infinite ease-in-out' }}>Limited Offer!</div>
              <div style={{ position: 'absolute', top: '50%', left: '10px', fontSize: '2rem', opacity: 0.1 }}>Ads Ads Ads</div>
            </>
          )}

          <h4 style={{ marginBottom: '1rem', zIndex: 2 }}>Ready to grow?</h4>
          <button style={{
            padding: '1rem 2rem',
            background: buttonColor,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 2
          }}>
            {buttonText}
          </button>

          <div style={{ marginTop: '2rem', textAlign: 'center', zIndex: 2 }}>
            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Projected Conversion Rate</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: score > 80 ? '#10B981' : score > 50 ? '#F59E0B' : '#EF4444', transition: 'color 0.5s' }}>
              {score}%
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

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

        <UXFrictionSimulator />

        <h3 style={{ marginTop: '2rem' }}>The Reservoir of Goodwill</h3>
        <p>
          Imagine every user starts with 100% patience. If they can't find the menu, -10%.
          If a pop-up blocks the screen, -20%. If the site is slow, -30%.
          When they hit 0%, they leave and never come back.
        </p>

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
            { question: "Why are Carousels/Sliders generally bad for UX?", options: ["They are too expensive", "Almost no one sees past the first slide and they slow down the site", "They are illegal"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Interactive: No-Code Builder
function NoCodeBuilderInteractive() {
  const [sections, setSections] = useState([]);
  const [published, setPublished] = useState(false);
  const [timeSaved, setTimeSaved] = useState(0);

  const addSection = (type) => {
    if (sections.includes(type)) return;
    setSections([...sections, type]);
    setTimeSaved(prev => prev + (type === 'hero' ? 4 : type === 'pricing' ? 6 : 3)); // Hours saved
    setPublished(false);
  };

  const handlePublish = () => {
    if (sections.length === 0) return;
    setPublished(true);
  };

  return (
    <div style={{ margin: '3rem 0', padding: '1.5rem', background: '#0F172A', color: 'white', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#94A3B8' }}>No-Code Studio</div>
        <div style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
          Code Time Saved: <strong style={{ color: '#10B981' }}>{timeSaved} hrs</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '2rem' }}>

        {/* Sidebar Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#64748B', fontWeight: 700 }}>DRAG ELEMENTS</p>

          <button onClick={() => addSection('navbar')} disabled={sections.includes('navbar')} style={{ padding: '0.75rem', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: 'white', cursor: sections.includes('navbar') ? 'default' : 'pointer', opacity: sections.includes('navbar') ? 0.5 : 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
            <span>🧭</span> Navigation Bar
          </button>

          <button onClick={() => addSection('hero')} disabled={sections.includes('hero')} style={{ padding: '0.75rem', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: 'white', cursor: sections.includes('hero') ? 'default' : 'pointer', opacity: sections.includes('hero') ? 0.5 : 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
            <span>✨</span> Hero Section
          </button>

          <button onClick={() => addSection('pricing')} disabled={sections.includes('pricing')} style={{ padding: '0.75rem', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: 'white', cursor: sections.includes('pricing') ? 'default' : 'pointer', opacity: sections.includes('pricing') ? 0.5 : 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
            <span>💰</span> Pricing Table
          </button>

          <button onClick={handlePublish} disabled={sections.length === 0 || published} style={{ marginTop: 'auto', padding: '1rem', background: published ? '#10B981' : '#3B82F6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 800, cursor: published ? 'default' : 'pointer', opacity: sections.length === 0 ? 0.5 : 1 }}>
            {published ? '🚀 LIVE!' : 'Publish Site ⚡'}
          </button>
        </div>

        {/* Live Canvas */}
        <div style={{ background: '#F1F5F9', borderRadius: '12px', minHeight: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

          {sections.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8', fontSize: '1.2rem', fontWeight: 600 }}>
              Blank Canvas
            </div>
          )}

          {/* Rendered Sections */}
          {sections.includes('navbar') && (
            <div style={{ padding: '15px 20px', background: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'slideDown 0.3s ease-out' }}>
              <div style={{ fontWeight: 900, color: '#0F172A' }}>MyStartup</div>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: '#64748B' }}>
                <span>Home</span><span>About</span><span>Contact</span>
              </div>
            </div>
          )}

          {sections.includes('hero') && (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'linear-gradient(to bottom, #F8FAFC, #EFF6FF)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', animation: 'fadeIn 0.5s ease-out' }}>
              <h1 style={{ fontSize: '1.5rem', color: '#1E293B', marginBottom: '10px' }}>Build Faster.</h1>
              <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: '300px', margin: '0 auto 15px' }}>Stop wasting time on boilerplate code.</p>
              <button style={{ padding: '8px 16px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '6px', width: 'fit-content', margin: '0 auto' }}>Get Started</button>
            </div>
          )}

          {sections.includes('pricing') && (
            <div style={{ padding: '30px', background: 'white', display: 'flex', gap: '10px', justifyContent: 'center', animation: 'slideUp 0.4s ease-out' }}>
              <div style={{ padding: '15px', border: '1px solid #E2E8F0', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem' }}>Basic</div> <strong>$19</strong>
              </div>
              <div style={{ padding: '15px', border: '2px solid #3B82F6', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#3B82F6' }}>Pro</div> <strong>$49</strong>
              </div>
            </div>
          )}

          {/* Published Overlay */}
          {published && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, animation: 'fadeIn 0.3s' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>Website Deployed!</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>URL: <u>mystartup.com</u></p>
            </div>
          )}

        </div>
      </div>
    </div>
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

        <NoCodeBuilderInteractive />

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
            { question: "What is the primary benefit of No-Code tools for startups?", options: ["It requires no computer", "Speed to market validation (testing ideas fast)", "It uses blockchain"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Interactive: Google Bot Simulator
function GoogleBotSimulator() {
  const [codeType, setCodeType] = useState('bad'); // 'bad' or 'good'
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const scan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult(codeType === 'bad' ? 'fail' : 'success');
    }, 1500);
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#1E293B', color: 'white', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Interactive: The "Google Bot" Vision</h3>
        <p style={{ color: '#94A3B8' }}>See how a search engine views your code.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

        {/* Code Selector */}
        <div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button onClick={() => { setCodeType('bad'); setResult(null); }} style={{ flex: 1, padding: '1rem', background: codeType === 'bad' ? '#EF4444' : '#334155', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, cursor: 'pointer', opacity: codeType === 'bad' ? 1 : 0.5 }}>
              Bad Code (Div Soup)
            </button>
            <button onClick={() => { setCodeType('good'); setResult(null); }} style={{ flex: 1, padding: '1rem', background: codeType === 'good' ? '#10B981' : '#334155', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, cursor: 'pointer', opacity: codeType === 'good' ? 1 : 0.5 }}>
              Good Code (Semantic)
            </button>
          </div>

          <div style={{ background: '#0F172A', padding: '1.5rem', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.9rem', border: '1px solid #334155' }}>
            {codeType === 'bad' ? (
              <>
                <div style={{ color: '#94A3B8' }}>&lt;div class="nav"&gt;</div>
                <div style={{ marginLeft: '1rem', color: '#CBD5E1' }}>&lt;div onclick="go()"&gt;Home&lt;/div&gt;</div>
                <div style={{ marginLeft: '1rem', color: '#CBD5E1' }}>&lt;div class="btn"&gt;Buy&lt;/div&gt;</div>
                <div style={{ color: '#94A3B8' }}>&lt;/div&gt;</div>
              </>
            ) : (
              <>
                <div style={{ color: '#F472B6' }}>&lt;nav&gt;</div>
                <div style={{ marginLeft: '1rem', color: '#60A5FA' }}>&lt;a href="/"&gt;Home&lt;/a&gt;</div>
                <div style={{ marginLeft: '1rem', color: '#34D399' }}>&lt;button&gt;Buy&lt;/button&gt;</div>
                <div style={{ color: '#F472B6' }}>&lt;/nav&gt;</div>
              </>
            )}
          </div>

          <button onClick={scan} disabled={scanning} style={{ width: '100%', marginTop: '1rem', padding: '1rem', background: 'white', color: '#0F172A', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: scanning ? 'default' : 'pointer', fontSize: '1rem' }}>
            {scanning ? 'Scanning...' : 'Run Google Bot 🤖'}
          </button>
        </div>

        {/* Bot View */}
        <div style={{ background: '#000', borderRadius: '12px', border: '2px solid #334155', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>

          {scanning ? (
            <div style={{ fontSize: '3rem', animation: 'spin 1s infinite linear' }}>🔍</div>
          ) : result ? (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {result === 'success' ? '✅' : '❓'}
              </div>
              <h3 style={{ color: result === 'success' ? '#4ADE80' : '#F87171', marginBottom: '0.5rem' }}>
                {result === 'success' ? 'Understood!' : 'Confused.'}
              </h3>
              <p style={{ color: '#94A3B8' }}>
                {result === 'success'
                  ? 'I see a Navigation and a Button. I will index this as a functional page.'
                  : 'I just see generic "divs". I don\'t know what this page is about. Ignoring.'
                }
              </p>
            </div>
          ) : (
            <div style={{ color: '#475569', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🤖</div>
              <p>Waiting for scan...</p>
            </div>
          )}

        </div>

      </div>
    </div>
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

        <GoogleBotSimulator />

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
            { question: "Which CSS property adds space *inside* the border?", options: ["Margin", "Padding", "Flex"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Interactive: Component System (The LEGO Model)
function ComponentSystemInteractive() {
  const [mode, setMode] = useState('react'); // 'html' or 'react'
  const [masterColor, setMasterColor] = useState('#3B82F6'); // Blue
  const [cardColors, setCardColors] = useState(['#3B82F6', '#3B82F6', '#3B82F6']); // For HTML mode

  const handleMasterChange = (color) => {
    setMasterColor(color);
    if (mode === 'react') {
      // React: Update all instantly
      setCardColors([color, color, color]);
    }
  };

  const handleCardClick = (index) => {
    if (mode === 'html') {
      // HTML: Manual update required
      const newColors = [...cardColors];
      newColors[index] = masterColor;
      setCardColors(newColors);
    }
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#F1F5F9', borderRadius: '24px', border: '1px solid #E2E8F0' }}>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: '#0F172A', marginBottom: '0.5rem' }}>Interactive: The "Scale" Problem</h3>
        <p style={{ color: '#64748B' }}>
          Try to change the brand color of these 3 product cards.
        </p>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={() => { setMode('html'); setMasterColor('#EF4444'); setCardColors(['#3B82F6', '#3B82F6', '#3B82F6']); }} style={{ padding: '0.5rem 1rem', background: mode === 'html' ? '#EF4444' : '#fff', color: mode === 'html' ? 'white' : '#64748B', border: '1px solid #CBD5E1', borderRadius: '100px', cursor: 'pointer', fontWeight: 700 }}>
            Standard HTML (Manual)
          </button>
          <button onClick={() => { setMode('react'); setMasterColor('#3B82F6'); setCardColors(['#3B82F6', '#3B82F6', '#3B82F6']); }} style={{ padding: '0.5rem 1rem', background: mode === 'react' ? '#3B82F6' : '#fff', color: mode === 'react' ? 'white' : '#64748B', border: '1px solid #CBD5E1', borderRadius: '100px', cursor: 'pointer', fontWeight: 700 }}>
            React Components (Auto)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>

        {/* Master Control */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #CBD5E1', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748B' }}>Master Design System</h4>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Pick new Brand Color:</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'].map(color => (
              <button
                key={color}
                onClick={() => handleMasterChange(color)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: color,
                  border: masterColor === color ? '3px solid #0F172A' : '1px solid #E2E8F0',
                  cursor: 'pointer', transform: masterColor === color ? 'scale(1.1)' : 'scale(1)'
                }}
              />
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: mode === 'react' ? '#F0F9FF' : '#FEF2F2', borderRadius: '8px', border: '1px solid', borderColor: mode === 'react' ? '#BAE6FD' : '#FECACA' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: mode === 'react' ? '#0369A1' : '#991B1B', marginBottom: '0.25rem' }}>STATUS</div>
            {mode === 'react'
              ? <div style={{ color: '#0C4A6E', fontSize: '0.9rem' }}>✅ Connected. All instances update automatically.</div>
              : <div style={{ color: '#7F1D1D', fontSize: '0.9rem' }}>⚠️ Disconnected. You must manually update each file/page.</div>
            }
          </div>
        </div>

        {/* Instances */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              onClick={() => handleCardClick(i)}
              style={{
                background: 'white', padding: '1rem', borderRadius: '12px', cursor: mode === 'html' ? 'pointer' : 'default',
                border: '1px solid #E2E8F0', transition: 'all 0.3s ease',
                boxShadow: mode === 'html' && cardColors[i] !== masterColor ? '0 0 0 2px #EF4444' : 'none'
              }}
            >
              <div style={{ width: '100%', height: '80px', background: '#F1F5F9', borderRadius: '8px', marginBottom: '0.75rem' }}></div>
              <div style={{ height: '10px', width: '60%', background: '#E2E8F0', borderRadius: '100px', marginBottom: '0.5rem' }}></div>
              <button style={{
                width: '100%', padding: '0.5rem',
                background: cardColors[i],
                color: 'white', border: 'none', borderRadius: '6px',
                fontSize: '0.8rem', fontWeight: 700,
                transition: 'background 0.3s'
              }}>
                Buy Now
              </button>
              {mode === 'html' && cardColors[i] !== masterColor && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#EF4444', textAlign: 'center' }}>Click to fix!</div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
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

        <h3>The "Single Source of Truth"</h3>
        <p>Why is React so fast? It allows us to define a button <em>once</em>. If we change that button, it updates on 1,000 pages instantly.</p>

        <ComponentSystemInteractive />

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
            { question: "Why does React use a Virtual DOM?", options: ["To use more memory", "To start a virtual reality game", "To improve performance by only updating changed elements"], correctIndex: 2 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Interactive: API Automation Simulator
function APISimulator() {
  const [mode, setMode] = useState('manual'); // 'manual' | 'api'
  const [step, setStep] = useState(0); // 0: Start, 1: Copied, 2: Pasted/Done

  useEffect(() => {
    let interval;
    if (mode === 'api') {
      // Loop the animation
      interval = setInterval(() => {
        setStep(prev => (prev >= 2 ? 0 : prev + 1));
      }, 600);
    } else {
      setStep(0);
    }
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', color: 'white', borderRadius: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Interactive: The Automation Power</h3>
        <p style={{ color: '#94A3B8' }}>How does data move in your business?</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button onClick={() => setMode('manual')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', background: mode === 'manual' ? '#EF4444' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Manual (Human)</button>
          <button onClick={() => setMode('api')} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', background: mode === 'api' ? '#3B82F6' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}>API (Machine)</button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '500px', margin: '0 auto', position: 'relative' }}>

        {/* Node 1: Website */}
        <div style={{ textAlign: 'center', zIndex: 2 }}>
          <div style={{ width: '60px', height: '60px', background: '#1E293B', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '2px solid #334155', marginBottom: '0.5rem' }}>🌐</div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Website</div>
          {mode === 'manual' && step === 0 && (
            <button onClick={() => setStep(1)} style={{ marginTop: '0.5rem', padding: '4px 8px', fontSize: '0.7rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Copy Data</button>
          )}
        </div>

        {/* Path */}
        <div style={{ flex: 1, height: '4px', background: '#334155', position: 'relative', margin: '0 10px' }}>
          {/* Data Packet */}
          <div style={{
            position: 'absolute', top: '-6px', left: 0,
            width: '16px', height: '16px', background: mode === 'api' ? '#3B82F6' : '#EF4444', borderRadius: '50%',
            transition: 'left 0.6s linear, opacity 0.2s',
            left: step === 0 ? '0%' : step === 1 ? '50%' : '100%',
            opacity: mode === 'api' || step > 0 ? 1 : 0
          }} />
        </div>

        {/* Node 2: CRM */}
        <div style={{ textAlign: 'center', zIndex: 2 }}>
          <div style={{ width: '60px', height: '60px', background: '#1E293B', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '2px solid #334155', marginBottom: '0.5rem' }}>📊</div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>CRM / Xero</div>
          {mode === 'manual' && step === 1 && (
            <button onClick={() => setStep(2)} style={{ marginTop: '0.5rem', padding: '4px 8px', fontSize: '0.7rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Paste Data</button>
          )}
          {mode === 'manual' && step === 2 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#10B981' }}>Done!</div>
          )}
          {/* API Flash */}
          {mode === 'api' && step === 2 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#3B82F6', animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }}>Received!</div>
          )}
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#CBD5E1' }}>
          {mode === 'manual'
            ? "⚠️ Step 1: Human reads email. Step 2: Human types into CRM. Error prone & slow."
            : "⚡ Zero touch. The website talks directly to the CRM instantly. 24/7."}
        </p>
      </div>

    </div>
  );
}

// Module E: Backend & APIs
export function Pillar3ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: Serverless & APIs" subtitle="The invisible infrastructure.">
      <div className="cw-prose">
        <p>The "Backend" is where the logic lives. In the past, you rented a physical server computer. Now, you rent "Functions" (Serverless) that only exist when someone clicks a button.</p>

        <APISimulator />

        <h3 style={{ marginTop: '2rem' }}>The API Waiter Analogy</h3>
        <p>
          Imagine a restaurant. You (Client) sit at the table. The Kitchen (Server) has the food (Data).
          You don't walk into the kitchen. You tell the <strong>Waiter (API)</strong> what you want.
          The Waiter takes your order (JSON request) to the kitchen and brings back your food (JSON response).
        </p>

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
            { question: "What is a major benefit of Microservices?", options: ["It uses less code", "Isolation of failure (if one part breaks, the rest works)", "It makes the logo bigger"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Interactive: Global Latency Simulator
function GlobalLatencyInteractive() {
  const [mode, setMode] = useState('legacy'); // 'legacy' | 'edge'
  const [ping, setPing] = useState(0);
  const [animating, setAnimating] = useState(false);

  const runTest = (selectedMode) => {
    if (animating) return;
    setMode(selectedMode);
    setAnimating(true);
    setPing(0);

    // Simulate ping time
    const duration = selectedMode === 'legacy' ? 2000 : 300;
    const finalPing = selectedMode === 'legacy' ? 185 : 12;

    setTimeout(() => {
      setAnimating(false);
      setPing(finalPing);
    }, duration);
  };

  useEffect(() => {
    // Auto run first test
    runTest('legacy');
  }, []);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', color: 'white', borderRadius: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Interactive: The Speed of Light</h3>
        <p style={{ color: '#94A3B8' }}>Select a hosting strategy to test latency.</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button onClick={() => runTest('legacy')} disabled={animating} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', background: mode === 'legacy' ? '#EF4444' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, opacity: animating ? 0.5 : 1 }}>Legacy Hosting</button>
          <button onClick={() => runTest('edge')} disabled={animating} style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', background: mode === 'edge' ? '#10B981' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, opacity: animating ? 0.5 : 1 }}>Edge (Vercel)</button>
        </div>
      </div>

      <div style={{ position: 'relative', height: '200px', borderBottom: '2px solid #334155', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10%' }}>

        {/* User (Cape Town) */}
        <div style={{ textAlign: 'center', marginBottom: '-1.5rem' }}>
          <div style={{ fontSize: '2rem' }}>🇿🇦</div>
          <div style={{ fontSize: '0.8rem', color: '#CBD5E1', fontWeight: 700, marginTop: '0.5rem' }}>You (Cape Town)</div>
        </div>

        {/* Server (London) */}
        <div style={{ textAlign: 'center', marginBottom: '-1.5rem', opacity: mode === 'legacy' ? 1 : 0.3 }}>
          <div style={{ fontSize: '2rem' }}>🇬🇧</div>
          <div style={{ fontSize: '0.8rem', color: '#CBD5E1', fontWeight: 700, marginTop: '0.5rem' }}>Server (London)</div>
        </div>

        {/* Data Packet */}
        {animating && (
          <div style={{
            position: 'absolute',
            bottom: '40px',
            width: '12px', height: '12px', borderRadius: '50%', background: '#fff',
            boxShadow: '0 0 10px white',
            left: '10%',
            animation: mode === 'legacy' ? 'pingPong 2s ease-in-out infinite' : 'quickBounce 0.3s ease-out infinite'
          }}></div>
        )}

        {/* Edge Node */}
        {mode === 'edge' && (
          <div style={{ position: 'absolute', left: '15%', bottom: '50px' }}>
            <div style={{ fontSize: '1.5rem' }}>⚡</div>
            <div style={{ fontSize: '0.7rem', color: '#10B981', background: '#064E3B', padding: '2px 6px', borderRadius: '4px' }}>Edge Node</div>
          </div>
        )}

      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Latency (Time to Load)</div>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: ping > 100 ? '#EF4444' : '#10B981', fontVariantNumeric: 'tabular-nums' }}>
          {animating ? '...' : ping + 'ms'}
        </div>
        <p style={{ color: '#CBD5E1', maxWidth: '400px', margin: '1rem auto' }}>
          {animating ? 'Traveling through fiber optic cables...' : mode === 'legacy'
            ? "Slow. Data travels 10,000km to London and back. The user is waiting."
            : "Instant. Data connects to a local 'Edge Node' in Cape Town. Physics wins."
          }
        </p>
      </div>

    </div>
  );
}

// Module F: Hosting
export function Pillar3ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: Edge Computing" subtitle="Speed through Physics.">
      <div className="cw-prose">
        <p>Speed of light is finite. If your server is in London and your user is in Cape Town, the signal has to travel 10,000km. That takes time (~180ms).</p>
        <p><strong>Edge Computing</strong> puts a mini-server in Cape Town. Now the signal travels 5km (~5ms). This is instant.</p>

        <GlobalLatencyInteractive />

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
            { question: "Which rendering method is generally fastest for a Blog?", options: ["SSG (Static Site Generation)", "SSR (Server Side)", "CSR (Client Side)"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Interactive: Perceived Performance (Skeleton Screens)
function PerceivedPerformanceInteractive() {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const startDemo = () => {
    if (loading) return;
    setLoading(true);
    setLoaded(false);
    setTimeout(() => {
      setLoaded(true);
      setLoading(false);
    }, 2500);
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#F1F5F9', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: '#0F172A', marginBottom: '0.5rem' }}>Interactive: The Psychology of Waiting</h3>
        <p style={{ color: '#64748B', maxWidth: '500px', margin: '0 auto' }}>Which experience feels faster? Both take exactly 2.5 seconds to load.</p>
        <button onClick={startDemo} disabled={loading} style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '100px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Loading...' : 'Test Perception ⏱️'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* Screen A: Spinner */}
        <div style={{ background: 'white', border: '8px solid #334155', borderRadius: '16px', height: '300px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ background: '#334155', padding: '0.5rem', color: 'white', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700 }}>Version A (Traditional)</div>

          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
            {loaded ? (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <div style={{ height: '100px', background: '#E0F2FE', borderRadius: '8px', marginBottom: '1rem' }}></div>
                <div style={{ height: '20px', background: '#F1F5F9', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '20px', background: '#F1F5F9', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '20px', background: '#F1F5F9', width: '60%' }}></div>
              </div>
            ) : loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #CBD5E1', borderTop: '4px solid #3B82F6', borderRadius: '50%', animation: 'spin 1s infinite linear' }}></div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>Click Test</div>
            )}
          </div>
        </div>

        {/* Screen B: Skeleton */}
        <div style={{ background: 'white', border: '8px solid #334155', borderRadius: '16px', height: '300px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ background: '#334155', padding: '0.5rem', color: 'white', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700 }}>Version B (Optimized)</div>

          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
            {loaded ? (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <div style={{ height: '100px', background: '#E0F2FE', borderRadius: '8px', marginBottom: '1rem' }}></div>
                <div style={{ height: '20px', background: '#F1F5F9', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '20px', background: '#F1F5F9', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '20px', background: '#F1F5F9', width: '60%' }}></div>
              </div>
            ) : loading ? (
              <div style={{ animation: 'pulse 1.5s infinite' }}>
                <div style={{ height: '100px', background: '#E2E8F0', borderRadius: '8px', marginBottom: '1rem' }}></div>
                <div style={{ height: '20px', background: '#E2E8F0', marginBottom: '0.5rem', borderRadius: '4px' }}></div>
                <div style={{ height: '20px', background: '#E2E8F0', marginBottom: '0.5rem', borderRadius: '4px' }}></div>
                <div style={{ height: '20px', background: '#E2E8F0', width: '60%', borderRadius: '4px' }}></div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>Click Test</div>
            )}
          </div>
        </div>

      </div>

      {loaded && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', animation: 'fadeIn 0.5s', color: '#15803D', fontWeight: 600 }}>
          Most users say Version B loaded "Instantly", even though it took the same amount of time!
        </div>
      )}
    </div>
  );
}

// Module G: Performance
export function Pillar3ModuleG({ onNext }) {
  return (
    <InteractiveLayout title="Module G: Performance Engineering" subtitle="Beyond 'Fast Loading'.">
      <div className="cw-prose">
        <p>Performance is not just about numbers; it is about <strong>Perception</strong>. The user hates wondering "Is it broken?".</p>

        <h3>Skeleton Screens vs Spinners</h3>
        <p>Instead of a spinning wheel (which implies waiting), show a gray "skeleton" of the content. It makes the user feel like the content is "almost there", keeping them engaged.</p>

        <PerceivedPerformanceInteractive />

        <BookInsight title="The Bottleneck" author="Ilya Grigorik" book="High Performance Browser Networking" color="#EF4444">
          <p>"It is not bandwidth that constraints the modern web, but latency."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFEDD5 0%, #FFDDC1 100%)', borderRadius: '24px', border: '1px solid #FDBA74' }}>
          <CWHeading level={3} style={{ color: '#EA580C', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9A3412', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Google has confirmed that "Core Web Vitals" are a ranking factor. Faster sites rank higher. But more importantly, <strong>faster sites sell more</strong>. A 1-second delay reduces conversions by 7%.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#C2410C', marginBottom: '0.5rem' }}>1. The "Bounce" Prevention</h4>
              <p style={{ fontSize: '0.95rem', color: '#9A3412', lineHeight: '1.6' }}>
                If your site shows a white screen for 3 seconds, users think it's broken and hit "Back". Skeletons prevent this "False Bounce".
              </p>
            </div>
            <div>
              <h4 style={{ color: '#C2410C', marginBottom: '0.5rem' }}>2. Mobile Vitality</h4>
              <p style={{ fontSize: '0.95rem', color: '#9A3412', lineHeight: '1.6' }}>
                On 4G/LTE, lag is common. Performance engineering ensures your site feels premium even on a patchy connection in a coffee shop.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FED7AA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We obsess over milliseconds.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F97316', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Speed Audits:</strong> We analyze your LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift) to find the "hidden brakes" on your revenue via <a href="/services?service=performance-first" style={{ color: '#F97316', textDecoration: 'underline' }}>Performance Tuning</a>.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F97316', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Optimized Assets:</strong> We compress all images to WebP/AVIF formats automatically, so your users never download generic huge JPEGs again.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What causes 'Cumulative Layout Shift' (CLS)?", options: ["Images/Ads loading without defined dimensions (jumping content)", "Fast Internet", "Good design"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Interactive: Security Input Simulator
function SecurityInputSimulator() {
  const [inputVal, setInputVal] = useState('');
  const [isSecure, setIsSecure] = useState(false);
  const [output, setOutput] = useState(null);
  const [hacked, setHacked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setHacked(false);

    // Simulate processing
    if (inputVal === "<script>alert('Hacked')</script>" || inputVal.includes('DROP TABLE')) {
      if (!isSecure) {
        setHacked(true);
        setOutput(null);
        return;
      }
    }

    // Normal output (simulating 'sanitized' vs 'raw')
    // In React, output is auto-escaped, but for the demo we simulate the difference visually
    setOutput(inputVal);
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', color: 'white', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Interactive: The "Input" Attack</h3>
        <p style={{ color: '#94A3B8' }}>Try to hack this form.</p>

        {/* Toggle Security */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', cursor: 'pointer' }} onClick={() => { setIsSecure(!isSecure); setHacked(false); setOutput(null); }}>
          <div style={{ width: '50px', height: '26px', background: isSecure ? '#10B981' : '#334155', borderRadius: '100px', position: 'relative', transition: 'background 0.3s' }}>
            <div style={{ width: '22px', height: '22px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isSecure ? '26px' : '2px', transition: 'left 0.3s' }}></div>
          </div>
          <span style={{ fontSize: '0.9rem', color: isSecure ? '#10B981' : '#94A3B8', fontWeight: 700 }}>{isSecure ? 'Security: ON (Sanitized)' : 'Security: OFF (Vulnerable)'}</span>
        </div>
      </div>

      <div style={{ maxWidth: '400px', margin: '0 auto', background: '#1E293B', padding: '2rem', borderRadius: '16px', border: `2px solid ${hacked ? '#EF4444' : '#334155'}` }}>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#CBD5E1' }}>Enter Your Name:</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Start typing..."
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#334155', color: 'white' }}
            />
            <button type="submit" style={{ padding: '0 1rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Go</button>
          </div>
        </form>

        {/* Shortcuts */}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button onClick={() => { setInputVal('John Doe'); setOutput(null); setHacked(false); }} style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: '#94A3B8', cursor: 'pointer' }}>Normal User</button>
          <button onClick={() => { setInputVal("DROP TABLE users"); setOutput(null); setHacked(false); }} style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '4px', color: '#FCA5A5', cursor: 'pointer' }}>SQL Attack 💀</button>
        </div>

        {/* Result Area */}
        <div style={{ marginTop: '2rem', minHeight: '60px', textAlign: 'center' }}>
          {hacked ? (
            <div style={{ animation: 'shake 0.5s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚨</div>
              <div style={{ color: '#EF4444', fontWeight: 900 }}>DATABASE DELETED!</div>
              <div style={{ fontSize: '0.8rem', color: '#FCA5A5' }}>The code was executed because it wasn't cleaned.</div>
            </div>
          ) : output ? (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <div style={{ fontSize: '1rem', color: isSecure ? '#10B981' : 'white' }}>Hello, {output}</div>
              {isSecure && (inputVal.includes('DROP') || inputVal.includes('<')) && (
                <div style={{ fontSize: '0.7rem', color: '#10B981', marginTop: '0.5rem' }}>Starting Attack Blocked. Input treated as text.</div>
              )}
            </div>
          ) : (
            <div style={{ color: '#64748B', fontSize: '0.9rem' }}>Waiting for input...</div>
          )}
        </div>
      </div>

    </div>
  );
}

// Module H: Security
export function Pillar3ModuleH({ onNext }) {
  return (
    <InteractiveLayout title="Module H: Zero Trust Security" subtitle="Paranoia is a virtue.">
      <div className="cw-prose">
        <p>The internet is a hostile place. Automated bots are scanning your site for weaknesses 24/7.
          The #1 rule: <strong>Never Trust User Input.</strong>
        </p>

        <SecurityInputSimulator />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', borderRadius: '24px', border: '1px solid #FECACA' }}>
          <CWHeading level={3} style={{ color: '#991B1B', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#7F1D1D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Security is not just an IT problem; it's a <strong>Reputation Problem</strong>. If your customer data (emails, addresses) leaks, 60% of small businesses close within 6 months due to loss of trust and fines (POPIA/GDPR).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#B91C1C', marginBottom: '0.5rem' }}>1. The "Open Door"</h4>
              <p style={{ fontSize: '0.95rem', color: '#7F1D1D', lineHeight: '1.6' }}>
                Outdated WordPress plugins are the most common entry point. If you don't update your site weekly, you are leaving the front door open.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#B91C1C', marginBottom: '0.5rem' }}>2. Bot Traffic</h4>
              <p style={{ fontSize: '0.95rem', color: '#7F1D1D', lineHeight: '1.6' }}>
                Competitors can scrape your prices. Bots can spam your forms. Basic security isn't enough; you need active firewalls.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FECACA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build Fort Knox, not just a storefront.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#DC2626', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Secure Code Practices:</strong> We sanitize all inputs and use strict Content Security Policies (CSP) in every <a href="/services?service=roi-custom-web-dev" style={{ color: '#DC2626', textDecoration: 'underline' }}>Custom Build</a> to block attacks.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#DC2626', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Maintenance & Patching:</strong> Our <a href="/services?service=performance-first" style={{ color: '#DC2626', textDecoration: 'underline' }}>Care Plans</a> include weekly security updates and 24/7 uptime monitoring so you sleep soundly.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is 'SQL Injection'?", options: ["A medical procedure", "Inserting malicious database commands into user input fields", "Injecting speed into a server"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Interactive: Checkout Funnel Simulator
function CheckoutFunnelSimulator() {
  const [frictionPoints, setFrictionPoints] = useState(['email']); // 'email', 'account', 'survey'
  const [conversionRate, setConversionRate] = useState(10); // Base %

  useEffect(() => {
    let rate = 80; // Start high
    if (frictionPoints.includes('account')) rate -= 40;
    if (frictionPoints.includes('survey')) rate -= 25;
    setConversionRate(rate);
  }, [frictionPoints]);

  const toggleFriction = (point) => {
    if (frictionPoints.includes(point)) {
      setFrictionPoints(frictionPoints.filter(p => p !== point));
    } else {
      setFrictionPoints([...frictionPoints, point]);
    }
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', color: 'white', borderRadius: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Interactive: The "Leaky" Funnel</h3>
        <p style={{ color: '#94A3B8' }}>Add/Remove steps to your checkout and see what happens to sales.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            onClick={() => { }}
            style={{ padding: '1rem', background: '#334155', borderRadius: '12px', opacity: 0.5, cursor: 'not-allowed', display: 'flex', justifyContent: 'space-between' }}
          >
            <span>💳 Payment Details</span>
            <span style={{ fontSize: '0.8rem' }}>Required</span>
          </div>

          <div
            onClick={() => toggleFriction('account')}
            style={{ padding: '1rem', background: frictionPoints.includes('account') ? '#EF4444' : '#1E293B', borderRadius: '12px', cursor: 'pointer', border: '1px solid #475569', display: 'flex', justifyContent: 'space-between', transition: 'all 0.2s' }}
          >
            <span>📝 "Create Account" (Password)</span>
            <span>{frictionPoints.includes('account') ? 'REMOVE' : 'ADD'}</span>
          </div>

          <div
            onClick={() => toggleFriction('survey')}
            style={{ padding: '1rem', background: frictionPoints.includes('survey') ? '#EF4444' : '#1E293B', borderRadius: '12px', cursor: 'pointer', border: '1px solid #475569', display: 'flex', justifyContent: 'space-between', transition: 'all 0.2s' }}
          >
            <span>📊 "How did you hear about us?"</span>
            <span>{frictionPoints.includes('survey') ? 'REMOVE' : 'ADD'}</span>
          </div>
        </div>

        {/* Visual Funnel */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '200px', margin: '0 auto' }}>
            {/* Top of Funnel */}
            <div style={{ width: '100%', height: '20px', background: '#3B82F6', marginBottom: '5px', borderRadius: '4px' }}></div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1rem' }}>100 Visitors</div>

            {/* Funnel Body representing filtering */}
            <div style={{ width: '0', height: '0', borderLeft: '100px solid transparent', borderRight: '100px solid transparent', borderTop: '150px solid rgba(59, 130, 246, 0.2)', margin: '0 auto', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-140px', left: '-20px', fontSize: '2rem', animation: 'float 2s infinite' }}>👥</div>
              {frictionPoints.includes('account') && <div style={{ position: 'absolute', top: '-100px', right: '-80px', color: '#EF4444', fontSize: '0.8rem' }}>🚫 -40% dropped off</div>}
              {frictionPoints.includes('survey') && <div style={{ position: 'absolute', top: '-60px', left: '-80px', color: '#EF4444', fontSize: '0.8rem' }}>🚫 -25% dropped off</div>}
            </div>

            {/* Output */}
            <div style={{ width: `${conversionRate}%`, minWidth: '20px', height: '40px', background: conversionRate > 50 ? '#10B981' : '#F59E0B', margin: '0 auto', borderRadius: '0 0 12px 12px', transition: 'width 0.5s', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5px' }}>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: conversionRate > 50 ? '#10B981' : '#F59E0B', marginTop: '0.5rem' }}>
              {conversionRate}%
            </div>
            <div style={{ fontSize: '0.9rem', color: 'white' }}>Conversion Rate</div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Module I: Ecommerce
export function Pillar3ModuleI({ onNext }) {
  return (
    <InteractiveLayout title="Module I: E-commerce Psychology" subtitle="Designing for the wallet.">
      <div className="cw-prose">
        <p>Building a shop is easy. Getting people to trust it with their credit card is hard.</p>
        <h3>Friction vs Motivation</h3>
        <p>To increase sales, you must remove barriers (Friction). Every extra field in a form reduces sales by 10%.</p>

        <CheckoutFunnelSimulator />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', borderRadius: '24px', border: '1px solid #FCD34D' }}>
          <CWHeading level={3} style={{ color: '#D97706', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#B45309', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Generally, <strong>70% of people abandon their carts</strong>. This is money left on the table. By optimizing your checkout flow (UX) and using automated recovery, you can reclaim 30%+ of that lost revenue.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#D97706', marginBottom: '0.5rem' }}>1. The "Guest" Rule</h4>
              <p style={{ fontSize: '0.95rem', color: '#B45309', lineHeight: '1.6' }}>
                Forcing users to "Create an Account" is the #1 killer of sales. Allow "Guest Checkout" first, then ask for a password <em>after</em> they pay.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#D97706', marginBottom: '0.5rem' }}>2. Trust Signals</h4>
              <p style={{ fontSize: '0.95rem', color: '#B45309', lineHeight: '1.6' }}>
                If your design looks "cheap" or "broken", users fear credit card theft. High-end design (padding, typography) is a proxy for security.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FDE68A', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We turn browsers into buyers.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F59E0B', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Checkout Optimization:</strong> We audit your Shopify/WooCommerce store to remove friction points and implement "One-Click" flows via our <a href="/services?service=shopify-speed-audit" style={{ color: '#F59E0B', textDecoration: 'underline' }}>Performance First</a> service.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F59E0B', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Cart Recovery AI:</strong> We set up automated email/SMS sequences that gently nudge users who left, often recovering 15% of lost sales automatically via our <a href="/services?service=ai-agents-sales-team" style={{ color: '#F59E0B', textDecoration: 'underline' }}>AI Sales Team</a>.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "How do you improve checkout conversion?", options: ["Ask more questions", "Reduce friction (remove unnecessary fields)", "Make the font smaller"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Interactive: Headless CMS Simulator
function HeadlessCMSSimulator() {
  const [headline, setHeadline] = useState('New Summer Range');
  const [published, setPublished] = useState(false);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', color: 'white', borderRadius: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Interactive: The "Omnichannel" Core</h3>
        <p style={{ color: '#94A3B8' }}>Update content in one place. See it change everywhere.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'center' }}>

        {/* CMS Input */}
        <div style={{ background: '#1E293B', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#CBD5E1', fontWeight: 700 }}>CMS DASHBOARD (Sanity/Strapi)</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => { setHeadline(e.target.value); setPublished(false); }}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0F172A', border: '1px solid #475569', color: 'white', borderRadius: '8px' }}
          />
          <button
            onClick={() => setPublished(true)}
            style={{ width: '100%', padding: '0.75rem', background: published ? '#10B981' : '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.3s' }}
          >
            {published ? 'Published! ✅' : 'Publish Changes 🚀'}
          </button>
        </div>

        {/* Output Channels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

          {/* Website */}
          <div style={{ background: 'white', padding: '10px', borderRadius: '8px', minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.6rem', color: '#64748B', marginBottom: '5px' }}>🖥️ Website</div>
            <div style={{ flex: 1, background: '#F1F5F9', borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>{headline}</strong>
            </div>
          </div>

          {/* Mobile App */}
          <div style={{ background: 'white', padding: '10px', borderRadius: '8px', minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.6rem', color: '#64748B', marginBottom: '5px' }}>📱 iOS App</div>
            <div style={{ flex: 1, background: '#F1F5F9', borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>{headline}</strong>
            </div>
          </div>

          {/* Watch / Kiosk */}
          <div style={{ background: 'white', padding: '10px', borderRadius: '8px', minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.6rem', color: '#64748B', marginBottom: '5px' }}>⌚ Smart Watch</div>
            <div style={{ flex: 1, background: '#000', borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <strong style={{ color: '#fff', fontSize: '0.7rem' }}>{headline}</strong>
            </div>
          </div>

          {/* Social (Auto) */}
          <div style={{ background: 'white', padding: '10px', borderRadius: '8px', minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.6rem', color: '#64748B', marginBottom: '5px' }}>🐦 Auto-Tweet</div>
            <div style={{ flex: 1, background: '#F1F5F9', borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <strong style={{ color: '#1DA1F2', fontSize: '0.7rem' }}>Tweet: {headline} 🔥</strong>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Module J: CMS
export function Pillar3ModuleJ({ onNext }) {
  return (
    <InteractiveLayout title="Module J: Headless CMS" subtitle="Future-proofing content.">
      <div className="cw-prose">
        <p>In the past, your content was locked inside WordPress. Today, content needs to go everywhere: Your App, Your Website, Your Smart Watch.</p>
        <p><strong>Headless CMS</strong> (like Sanity or Strapi) stores content as pure data (JSON), not HTML. It breeds flexibility.</p>

        <HeadlessCMSSimulator />

        <CWAlert type="success" title="The API Economy">
          Because content is just data, you can connect your CMS to anything. Connect it to Shopify to update prices. Connect it to OpenAI to auto-translate content.
        </CWAlert>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)', borderRadius: '24px', border: '1px solid #A5F3FC' }}>
          <CWHeading level={3} style={{ color: '#0891B2', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#0E7490', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Your technology should not be a "dead end". <strong>Headless Architecture</strong> future-proofs your business. If a new platform (e.g., Apple Vision Pro) comes out next year, your data is ready to be sent there instantly without rebuilding your website.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#0891B2', marginBottom: '0.5rem' }}>1. Omnichannel Reality</h4>
              <p style={{ fontSize: '0.95rem', color: '#155E75', lineHeight: '1.6' }}>
                Customers don't just shop on websites. They shop on Instagram, Mobile Apps, and Voice Assistants. Headless CMS feeds all these channels from one dashboard.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#0891B2', marginBottom: '0.5rem' }}>2. Rebranding Speed</h4>
              <p style={{ fontSize: '0.95rem', color: '#155E75', lineHeight: '1.6' }}>
                Need to change your brand voice or update a product disclaimer? Change it once in the CMS, and it updates across 500 pages and 3 apps instantly.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A5F3FC', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build systems that grow with you.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#06B6D4', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Headless Builds:</strong> We primarily build with Next.js + Sanity/Contentful. This gives you the editing power of WordPress but the speed and security of a custom app via our <a href="/services?service=roi-custom-web-dev" style={{ color: '#06B6D4', textDecoration: 'underline' }}>Custom Dev</a> service.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#06B6D4', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Global Brand Management:</strong> Our <a href="/services?service=future-digital-branding" style={{ color: '#06B6D4', textDecoration: 'underline' }}>Branding Systems</a> ensure your messaging is consistent across every digital touchpoint.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is a major advantage of Headless CMS?", options: ["It has no interface", "Content can be deployed to multiple platforms (Omnichannel) via API", "It is older"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
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
          <CWHeading level={3}>Pillar 3 Complete!</CWHeading>
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
