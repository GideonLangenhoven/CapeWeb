import React, { useState, useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';
import { InteractiveLayout, QuizLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, BookInsight } from './CapeWebUI';

// ==========================================
// PILLAR 4 QUIZ DATA
// ==========================================

export const pillar4QuizQuestions = [
  {
    question: 'You sell a R100 subscription inside your iPhone App. At the end of the month, you only receive R70. You are angry. What rule did you forget?',
    options: ['VAT is 30%', 'The "Apple Tax" (App Store Commission takes 30%)', 'Bank fees are high'],
    correctIndex: 1,
  },
  {
    question: 'You place your main "Menu" button in the top-left corner of the screen. Users with large phones complain they can\'t reach it one-handed. What design zone did you ignore?',
    options: ['The Danger Zone', 'The Thumb Zone (Natural Reach)', 'The End Zone'],
    correctIndex: 1,
  },
  {
    question: 'A user opens your app in a tunnel with no signal. The app runs a blank screen saying "No Internet". They immediately uninstall it. What approach should you have used?',
    options: ['Offline-First (Show cached content)', 'Better error messages', 'Tell them to buy a better phone'],
    correctIndex: 0,
  },
  {
    question: 'You want to build an app but cannot afford the $99/year Apple fee, and you want your app to be searchable on Google. What technology is best?',
    options: ['Native iOS App', 'PWA (Progressive Web App)', 'Assembly Language'],
    correctIndex: 1,
  },
  {
    question: 'You send 5 push notifications every day telling users to "Open the app!". After one week, 50% of users have uninstalled. Why?',
    options: ['They forgot who you are', 'Notification Fatigue (You spammed them)', 'Their phones broke'],
    correctIndex: 1,
  },
  {
    question: 'A user taps "Like". The heart turns red INSTANTLY, even before the server confirms the action. The app feels incredibly fast. What strategy is this?',
    options: ['Magic UI', 'Optimistic UI', 'Fake UI'],
    correctIndex: 1,
  },
  {
    question: 'You show your app idea to your mother. She says "It\'s lovely dear, you are so smart!". You mortgage your house to build it based on this feedback. Why is this dangerous?',
    options: ['Moms always lie', 'You failed "The Mom Test" (You asked for compliments, not truth)', 'She doesn\'t own a phone'],
    correctIndex: 1,
  },
  {
    question: 'You are building an architecture app that needs to use the iPad\'s specialized LiDAR sensor for 3D scanning. Is a standard website (HTML/CSS) the best choice?',
    options: ['Yes, ease of use', 'No, deep hardware access usually requires Native (Swift/React Native)', 'Maybe'],
    correctIndex: 1,
  },
  {
    question: 'You find a critical typo in your iOS app. If you submit a new build, Apple takes 2 days to review it. Using React Native, how could you fix it instantly?',
    options: ['Call Tim Cook', 'Use CodePush (Over-The-Air Update)', 'Hack the App Store'],
    correctIndex: 1,
  },
  {
    question: 'Your game has 10,000 players. 9,500 play for free. The other 500 spend R5000/month on "Gems". What is this business model?',
    options: ['Subscription', 'Freemium (monetizing the "Whales")', 'Charity'],
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

function HookModelVisual() {
  const [step, setStep] = useState(0);

  // Auto rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const data = [
    { label: 'Trigger', color: '#facc15', text: '🔔 (Notification)' },
    { label: 'Action', color: '#fb7185', text: '👆 (Click)' },
    { label: 'Reward', color: '#22d3ee', text: '🎁 (Dopamine)' },
    { label: 'Investment', color: '#4ade80', text: '💼 (Data Entry)' },
  ];

  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      textAlign: 'center',
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

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.95)', padding: '2rem', borderRadius: '24px', flexWrap: 'wrap' }}>
        {data.map((d, i) => (
          <div key={i} style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: i === step ? d.color : 'rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: i === step ? 1 : 0.4,
            transform: i === step ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.5s',
            boxShadow: i === step ? `0 0 30px ${d.color}` : 'none'
          }}>
            <strong style={{ color: i === step ? 'black' : 'white', fontSize: '0.8rem' }}>{d.label}</strong>
            <span style={{ fontSize: '1.2rem', marginTop: '0.2rem' }}>{d.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbZoneVisual() {
  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      textAlign: 'center',
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

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '250px', height: '450px', border: '8px solid #334155', borderRadius: '40px', background: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          {/* Red Zone (Top) */}
          <div style={{ height: '30%', background: '#FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#991B1B', fontWeight: 'bold' }}>PAIN</div>
          {/* Yellow Zone */}
          <div style={{ height: '40%', background: '#FEF08A' }}></div>
          {/* Green Zone (Bottom) */}
          <div style={{ height: '30%', background: '#BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065F46', fontWeight: 'bold' }}>NATURAL</div>

          {/* Hand Overlay */}
          <div style={{
            position: 'absolute', bottom: '-20px', right: '-20px', width: '200px', height: '200px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', pointerEvents: 'none'
          }}></div>
        </div>
      </div>
      <p style={{ marginTop: '1rem', color: '#475569', fontSize: '0.9rem', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
        Design major actions in the "Green Zone" for easy one-handed use.
      </p>
    </div>
  )
}

function OfflineSyncVisual() {
  const [online, setOnline] = useState(false);
  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      textAlign: 'center',
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button onClick={() => setOnline(!online)} style={{
            padding: '0.75rem 1.5rem', borderRadius: '100px', border: 'none', background: online ? '#10B981' : '#EF4444', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'all 0.3s'
          }}>
            {online ? 'Status: ONLINE 🟢' : 'Status: OFFLINE 🔴'}
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '400px', margin: '0 auto', gap: '1rem' }}>
          {/* Device */}
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.95)', borderRadius: '16px', border: '2px solid #CBD5E1', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Phone<br /><span style={{ color: '#64748B' }}>(Local DB)</span></div>
          </div>
          {/* Sync Line */}
          <div style={{ flex: 1, padding: '0', position: 'relative', height: '4px', background: 'rgba(255,255,255,0.5)', borderRadius: '2px' }}>
            {online && (
              <div style={{ position: 'absolute', top: '-8px', left: '0', width: '20px', height: '20px', background: '#3B82F6', borderRadius: '50%', animation: 'moveRight 1s infinite', boxShadow: '0 0 10px #3B82F6' }}></div>
            )}
            <style>{`@keyframes moveRight { 0% { left: 0% } 100% { left: 95% } }`}</style>
          </div>
          {/* Cloud */}
          <div style={{ padding: '1.5rem', background: online ? '#DBEAFE' : 'rgba(241, 245, 249, 0.8)', borderRadius: '16px', opacity: online ? 1 : 0.6, border: online ? '2px solid #93C5FD' : '2px solid #E2E8F0', transition: 'all 0.3s' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>☁️</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: online ? '#1E40AF' : '#94A3B8' }}>Cloud<br />(Sync)</div>
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
// NEW VISUALS (PREMIUM INTERACTIVE)
// ==========================================

function NoCodeSpeedVisual() {
  const [racing, setRacing] = useState(false);
  const [winner, setWinner] = useState(null);
  const codeCarRef = useRef(null);
  const noCodeCarRef = useRef(null);

  const startRace = () => {
    if (racing) return;
    setRacing(true);
    setWinner(null);

    // Reset positions
    gsap.set([codeCarRef.current, noCodeCarRef.current], { x: 0 });

    // Traditional Code Car (Slow, stutters)
    gsap.to(codeCarRef.current, {
      x: '70%',
      duration: 4,
      ease: "steps(5)", // Represents hiring/bugs stops
      onComplete: () => { if (!winner) setWinner('code'); }
    });

    // No-Code Car (Fast, smooth)
    gsap.to(noCodeCarRef.current, {
      x: '90%',
      duration: 1.5,
      ease: "power2.out",
      onComplete: () => {
        setWinner('nocode');
        setRacing(false);
      }
    });
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', padding: '2rem', borderRadius: '24px', margin: '2rem 0', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)', border: '1px solid white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h4 style={{ margin: 0, color: '#334155' }}>Time-to-Market Race</h4>
        <button onClick={startRace} disabled={racing} style={{ padding: '0.5rem 1.2rem', background: racing ? '#94A3B8' : '#0F172A', color: 'white', borderRadius: '100px', border: 'none', cursor: racing ? 'default' : 'pointer', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.2s' }}>
          {racing ? 'Building...' : '🚀 Start Build'}
        </button>
      </div>

      {/* Lane 1: Traditional */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Traditional Dev (Hire, Plan, Code, Bugfix)</span>
          <span>6 Months</span>
        </div>
        <div style={{ height: '48px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', width: '100%', position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div ref={codeCarRef} style={{ position: 'absolute', left: 0, top: '4px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🐢 <span style={{ fontSize: '0.7rem', background: '#CBD5E1', padding: '2px 6px', borderRadius: '4px' }}>Ticket #404</span>
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '2px', background: '#EF4444', opacity: 0.3 }} /> {/* Finish line */}
        </div>
      </div>

      {/* Lane 2: No-Code */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0EA5E9', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Visual Development (Drag, Drop, Launch)</span>
          <span>2 Weeks</span>
        </div>
        <div style={{ height: '48px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', width: '100%', position: 'relative', overflow: 'hidden', border: '2px solid #BAE6FD' }}>
          <div ref={noCodeCarRef} style={{ position: 'absolute', left: 0, top: '4px', fontSize: '1.5rem' }}>
            🏎️💨
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '2px', background: '#10B981' }} />
        </div>
      </div>

      {winner === 'nocode' && <div style={{ marginTop: '1rem', textAlign: 'center', color: '#059669', fontWeight: 'bold', animation: 'fadeIn 0.5s' }}>🎉 Winner: Visual Dev launched 5.5 months earlier!</div>}
    </div>
  )
}

function BridgeVisual() {
  const [packetStatus, setPacketStatus] = useState('idle'); // idle, sending, received
  const packetRef = useRef(null);

  const sendPacket = () => {
    if (packetStatus === 'sending') return;
    setPacketStatus('sending');

    const tl = gsap.timeline({ onComplete: () => { setPacketStatus('received'); setTimeout(() => setPacketStatus('idle'), 2000); } });

    // JS to Bridge
    tl.to(packetRef.current, { x: 140, duration: 0.8, ease: "power1.in", scale: 0.8, backgroundColor: '#F59E0B' })
      // Bridge Travel
      .to(packetRef.current, { x: 280, duration: 1.2, ease: "linear", rotation: 360, backgroundColor: '#EF4444' }) // Bottleneck color
      // Bridge to Native
      .to(packetRef.current, { x: 420, duration: 0.6, ease: "power1.out", scale: 1, backgroundColor: '#10B981' });
  };

  return (
    <div style={{ padding: '2rem', background: '#0F172A', borderRadius: '24px', margin: '2rem 0', color: 'white', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
        {/* JS Land */}
        <div style={{ width: '100px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: '#F7DF1E', borderRadius: '16px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 0 20px rgba(247, 223, 30, 0.3)' }}>JS</div>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.5rem' }}>Logic Thread</p>
          <button onClick={sendPacket} style={{ marginTop: '0.5rem', background: packetStatus === 'sending' ? '#334155' : '#3B82F6', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Update UI</button>
        </div>

        {/* The Bridge (Bottleneck) */}
        <div style={{ flex: 1, margin: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ height: '4px', width: '100%', background: '#334155', borderRadius: '2px', position: 'relative' }}>
            <div ref={packetRef} style={{ width: '20px', height: '20px', background: '#22D3EE', borderRadius: '50%', position: 'absolute', top: '-8px', left: '0', boxShadow: '0 0 10px currentColor' }} />
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#64748B', background: '#1E293B', padding: '4px 10px', borderRadius: '100px', border: '1px solid #334155' }}>THE BRIDGE (Slower)</div>
        </div>

        {/* Native Land */}
        <div style={{ width: '100px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: packetStatus === 'received' ? '#10B981' : '#334155', borderRadius: '16px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', transition: 'background 0.3s', boxShadow: packetStatus === 'received' ? '0 0 30px #10B981' : 'none' }}>📱</div>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.5rem' }}>Main Thread</p>
        </div>
      </div>
    </div>
  )
}

function ImpellerVisual() {
  const [engine, setEngine] = useState('skia'); // skia or impeller

  return (
    <div style={{ padding: '2rem', background: '#0F172A', borderRadius: '24px', margin: '2rem 0', color: 'white', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setEngine('skia')} style={{ padding: '0.6rem 1.2rem', background: engine === 'skia' ? '#3B82F6' : 'transparent', border: '1px solid #3B82F6', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Default Renderer (Skia)</button>
        <button onClick={() => setEngine('impeller')} style={{ padding: '0.6rem 1.2rem', background: engine === 'impeller' ? '#EC4899' : 'transparent', border: '1px solid #EC4899', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Impeller (New)</button>
      </div>

      <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '2px', position: 'relative' }}>
        {/* Frame Rate Graph Simulation */}
        {[...Array(40)].map((_, i) => {
          // Simulate Jitter for Skia, Smooth for Impeller
          const height = engine === 'skia'
            ? 40 + Math.random() * 50 // Jittery
            : 80 + Math.sin(i / 2) * 5; // Smooth high

          const color = engine === 'skia'
            ? (height < 50 ? '#EF4444' : '#FCD34D') // Red drops
            : '#10B981'; // All Green

          return (
            <div key={i} style={{ flex: 1, height: height + '%', background: color, borderRadius: '2px 2px 0 0', opacity: 0.8, transition: 'all 0.5s ease' }} />
          )
        })}
        <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>
          {engine === 'skia' ? '⚠️ Jank (Frame Drops)' : '✅ 60 FPS (Silky Smooth)'}
        </div>
      </div>
    </div>
  )
}

function PlatformMismatchVisual() {
  const [nativeness, setNativeness] = useState(50);

  return (
    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)', borderRadius: '24px', margin: '2rem 0', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      <h4 style={{ textAlign: 'center', margin: '0 0 1.5rem', color: '#334155' }}>The "Uncanny Valley" Slider</h4>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', minHeight: '120px' }}>
        {/* iOS Button Preview */}
        <div style={{
          padding: '0.8rem 2rem',
          borderRadius: nativeness > 80 ? '8px' : nativeness < 20 ? '2px' : '4px', // iOS is 8px-ish, Material is 4px
          backgroundColor: nativeness > 80 ? '#007AFF' : nativeness < 20 ? '#6200EE' : '#666',
          color: 'white',
          fontFamily: nativeness > 80 ? '-apple-system' : 'Roboto',
          textTransform: nativeness > 80 ? 'none' : 'uppercase',
          boxShadow: nativeness < 20 ? '0 2px 4px rgba(0,0,0,0.2)' : 'none', // Material shadow
          fontSize: '1rem',
          transition: 'all 0.3s'
        }}>
          {nativeness > 80 ? 'Join Now' : 'JOIN NOW'}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '0 2rem' }}>
        <input
          type="range" min="0" max="100" value={nativeness} onChange={(e) => setNativeness(Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold', color: '#64748B' }}>
          <span>Android Material Design</span>
          <span>Native iOS Design</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: nativeness > 80 ? '#059669' : '#DC2626', fontWeight: 600, background: nativeness > 80 ? '#ECFDF5' : '#FEF2F2', padding: '0.5rem', borderRadius: '8px' }}>
        {nativeness > 80 ? '✅ Trust: Users recognize this pattern.' : nativeness < 20 ? '❌ Confusion: "Why does this look like Google?"' : '⚠️ Uncanny: Tries to be native but fails.'}
      </div>
    </div>
  )
}

function AsoFunnelVisual() {
  const [traffic, setTraffic] = useState(1000);

  return (
    <div style={{ padding: '2rem', background: '#EFF6FF', borderRadius: '24px', margin: '2rem 0', border: '1px solid #BFDBFE' }}>
      <h4 style={{ textAlign: 'center', margin: '0 0 1.5rem', color: '#1E3A8A' }}>App Store Conversion Funnel</h4>

      <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        {/* Top of Funnel */}
        <div style={{ width: '100%', padding: '1rem', background: '#3B82F6', color: 'white', borderRadius: '12px', textAlign: 'center', position: 'relative', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>
          <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{traffic.toLocaleString()} Impressions</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>People seeing your icon in search</div>
        </div>

        <div style={{ fontSize: '1.5rem', color: '#93C5FD' }}>⬇️</div>

        {/* Middle */}
        <div style={{ width: '60%', padding: '1rem', background: '#60A5FA', color: 'white', borderRadius: '12px', textAlign: 'center', position: 'relative', boxShadow: '0 4px 6px rgba(96, 165, 250, 0.2)' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{Math.round(traffic * 0.3).toLocaleString()} Views</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Clicking to read more (30%)</div>
        </div>

        <div style={{ fontSize: '1.5rem', color: '#93C5FD' }}>⬇️</div>

        {/* Bottom */}
        <div style={{ width: '30%', padding: '1rem', background: '#2563EB', color: 'white', borderRadius: '12px', textAlign: 'center', position: 'relative', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)', border: '2px solid white' }}>
          <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{Math.round(traffic * 0.3 * 0.4).toLocaleString()} Installs</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Downloading (12% Total)</div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.9rem', color: '#1E40AF', fontWeight: 'bold' }}>Add Traffic:</span>
        <button onClick={() => setTraffic(t => t + 1000)} style={{ background: '#DBEAFE', color: '#1E40AF', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+1000 Impressions</button>
      </div>
    </div>
  )
}

function NetworkRadioVisual() {
  const [mode, setMode] = useState('chatty'); // chatty, batched
  const [battery, setBattery] = useState(100);

  // Simulation effect
  useEffect(() => {
    const i = setInterval(() => {
      setBattery(b => {
        const drain = mode === 'chatty' ? 2 : 0.2;
        return b > 0 ? b - drain : 0;
      });
    }, 100);
    return () => clearInterval(i);
  }, [mode]);

  return (
    <div style={{ padding: '2rem', background: '#1E293B', borderRadius: '24px', margin: '2rem 0', color: 'white', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h4 style={{ margin: 0 }}>Radio State Simulation</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>High Power state drains 500mA</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', color: battery < 20 ? '#EF4444' : '#10B981' }}>🔋 {Math.round(battery)}%</div>
          <button onClick={() => setBattery(100)} style={{ fontSize: '0.7rem', background: 'transparent', border: '1px solid #475569', color: '#94A3B8', padding: '2px 8px', borderRadius: '4px', marginTop: '4px', cursor: 'pointer' }}>Reset</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setMode('chatty')} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '2px solid', borderColor: mode === 'chatty' ? '#EF4444' : '#334155', background: mode === 'chatty' ? 'rgba(239, 68, 68, 0.1)' : 'transparent', color: mode === 'chatty' ? '#EF4444' : '#64748B', cursor: 'pointer', fontWeight: 'bold' }}>⚠️ Chatty App (Poor)</button>
        <button onClick={() => setMode('batched')} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '2px solid', borderColor: mode === 'batched' ? '#10B981' : '#334155', background: mode === 'batched' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: mode === 'batched' ? '#10B981' : '#64748B', cursor: 'pointer', fontWeight: 'bold' }}>✅ Batched (Efficient)</button>
      </div>

      <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', gap: '2px', position: 'relative', borderBottom: '1px solid #334155' }}>
        {[...Array(30)].map((_, i) => {
          // Chatty: Spikes everywhere. Batched: One big spike then silence.
          let active = false;
          if (mode === 'chatty') active = Math.random() > 0.3;
          if (mode === 'batched') active = (i > 5 && i < 15); // One burst

          return (
            <div key={i} style={{
              flex: 1,
              height: active ? '80%' : '10%',
              background: active ? '#EF4444' : '#334155',
              transition: 'all 0.5s',
              borderRadius: '2px'
            }} />
          )
        })}
        <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.7rem', color: '#EF4444' }}>High Power State</div>
        <div style={{ position: 'absolute', bottom: '5px', right: '10px', fontSize: '0.7rem', color: '#334155' }}>Sleep</div>
      </div>
    </div>
  )
}

function ChaosVisual() {
  const [monkeySpeed, setMonkeySpeed] = useState(0);
  const [cracked, setCracked] = useState(false);
  const hitsRef = useRef(0);

  useEffect(() => {
    if (monkeySpeed === 0) return;
    const interval = setInterval(() => {
      hitsRef.current += 1;
      if (hitsRef.current > 50) setCracked(true);

      // Shake sim
      const screen = document.getElementById('mock-screen');
      if (screen) {
        gsap.fromTo(screen, { x: -5 }, { x: 5, duration: 0.05, repeat: 3, yoyo: true });
      }
    }, 1000 / monkeySpeed);

    return () => clearInterval(interval);
  }, [monkeySpeed]);

  const reset = () => {
    setMonkeySpeed(0);
    setCracked(false);
    hitsRef.current = 0;
  };

  return (
    <div style={{ padding: '2rem', background: '#000', borderRadius: '24px', margin: '2rem 0', color: 'white', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)', opacity: 0.2 }} />

      <div style={{ display: 'flex', gap: '2rem', position: 'relative', zIndex: 2 }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 1rem' }}>Chaos Monkey Manager</h4>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#A3A3A3', display: 'block', marginBottom: '0.5rem' }}>Monkey Aggression Level: {monkeySpeed}</label>
            <input type="range" min="0" max="20" value={monkeySpeed} onChange={(e) => setMonkeySpeed(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
          <button onClick={reset} style={{ padding: '0.5rem 1rem', background: '#262626', color: 'white', border: '1px solid #404040', borderRadius: '6px', cursor: 'pointer' }}>Reset Test</button>
        </div>

        {/* Mock Phone Screen */}
        <div id="mock-screen" style={{ width: '150px', height: '250px', background: cracked ? '#3f3f46' : 'white', borderRadius: '16px', border: '4px solid #404040', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {!cracked && <div style={{ color: 'black', fontSize: '0.8rem' }}>My Perfect App</div>}

          {/* Monkey Cursor */}
          {monkeySpeed > 0 && <div style={{ fontSize: '2rem', position: 'absolute', top: '50%', left: '50%', animation: 'shake 0.1s infinite' }}>🐵</div>}

          {/* Cracks */}
          {cracked && (
            <>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red', fontWeight: 'bold', textAlign: 'center' }}>CRASHED<br />NullPointer<br />Exception</div>
              <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'white', transform: 'rotate(45deg)' }} />
              <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'white', transform: 'rotate(-45deg)' }} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function WhaleVisual() {
  const [users, setUsers] = useState(1);

  return (
    <div style={{ padding: '2rem', background: '#F0FDFA', borderRadius: '24px', margin: '2rem 0', border: '1px solid #CCFBF1', overflow: 'hidden' }}>
      <h3 style={{ textAlign: 'center', color: '#0F766E', margin: '0 0 1.5rem' }}>The Freemium Pyramid</h3>

      <div style={{ position: 'relative', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        {/* Pyramid Base */}
        <div style={{ position: 'absolute', bottom: 0, width: '300px', height: '100px', background: '#5EEAD4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(94, 234, 212, 0.4)' }}>
          <span style={{ fontWeight: 'bold', color: '#134E4A' }}>Free Users (95%)</span>
        </div>

        {/* Middle */}
        <div style={{ position: 'absolute', bottom: '110px', width: '180px', height: '80px', background: '#2DD4BF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(45, 212, 191, 0.4)' }}>
          <span style={{ fontWeight: 'bold', color: '#134E4A', fontSize: '0.9rem' }}>Minnows ($1)</span>
        </div>

        {/* Top (Whale) */}
        <div style={{ position: 'absolute', bottom: '200px', width: '100px', height: '80px', background: '#0D9488', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'float 3s infinite ease-in-out', boxShadow: '0 0 20px rgba(13, 148, 136, 0.6)', cursor: 'pointer' }} onClick={() => setUsers(u => u + 1)}>
          <span style={{ fontSize: '2.5rem' }}>🐋</span>
          <div style={{ position: 'absolute', top: '-30px', background: 'white', padding: '4px 8px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>The Whale ($2000)</div>
        </div>

        {[...Array(users)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: 200 + Math.random() * 50, left: 100 + Math.random() * 200, fontSize: '1.2rem', animation: 'fall 1s ease-out forwards', opacity: 0 }}>💰</div>
        ))}
        <style>{`@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } } @keyframes fall { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(100px); } }`}</style>
      </div>

      <p style={{ textAlign: 'center', color: '#115E59', fontSize: '0.9rem', marginTop: '1rem' }}>
        <strong>One Whale</strong> supports 1,000 Free Users. Tap the whale to collect revenue!
      </p>
    </div>
  )
}

// ==========================================
// PILLAR 4 MODULES A-K
// ==========================================

// Module A: Mobile Strategy
export function Pillar4ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: Mobile Psychology" subtitle="Habit vs Information.">
      <div className="cw-prose">
        <p className="cw-text-body">
          A website is for <strong>Information</strong> (searching for an answer). An app is for <strong>Habit</strong> (killing time or daily utility).
          The average user has 80 apps but only opens 9 daily. You are fighting for a slot in the "Daily 9".
        </p>

        <h3>The Hook Model</h3>
        <p>Your app must create a habit loop, or it will be deleted.</p>

        <HookModelVisual />

        <ScenarioToggle
          oldTitle="The Tool"
          oldContent="I open it once a month to pay a bill. (Low Engagement)"
          newTitle="The Habit"
          newContent="I open it every morning to see if I have new messages. (High Engagement)"
        />

        <BookInsight title="Building Habit Forming Products" author="Nir Eyal" book="Hooked" color="#3B82F6">
          <p>"To change behavior, products must ensure the user invests in the product by entering data, earning status, or customizing their experience."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            The world is mobile-first. 60% of web traffic is mobile. If your experience isn't seamless, users equate "hard to use" with "bad company".
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. The "Push" Advantage</h4>
              <p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>
                Email open rates are ~20%. Push Notification open rates are ~90%. An app is the only channel where you can tap a customer on the shoulder.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. Home Screen Real Estate</h4>
              <p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>
                An icon on their phone is permanent branding. You are one tap away, not a URL search away. This reduces friction to zero.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build 3 apps for the price of 1.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EC4899', marginTop: '2px' }}>➜</span>
                <span><strong>Cross-Platform Specialists:</strong> We use React Native / Expo to ship iOS, Android, and Web from a single codebase.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EC4899', marginTop: '2px' }}>➜</span>
                <span><strong>Offline-First:</strong> We build apps that work even when the internet is down, syncing data when connections return.</span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the most effective type of reward for forming habits?", options: ["Fixed Reward (Same every time)", "Variable Reward (Unpredictable)", "No Reward"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module B: No-Code
export function Pillar4ModuleB({ onNext }) {
  return (
    <InteractiveLayout title="Module B: Visual Development" subtitle="Coding at the speed of thought.">
      <div className="cw-prose">
        <p className="cw-text-body">
          <strong>FlutterFlow</strong> and <strong>Draftbit</strong> allow you to build real native apps visually. These tools export clean Flutter/React Native code, so you are not "locked in".
        </p>

        <NoCodeSpeedVisual />

        <h3>The Prototype Mindset</h3>
        <p>
          You can build a "looking" app in 2 days. Use it to get feedback.
        </p>

        <ScenarioToggle
          oldTitle="The 6 Month Build"
          oldContent="You spend R100k hiring devs. You launch. Users don't like it. You are broke."
          newTitle="The 2 Week Prototype"
          newContent="You build it yourself in FlutterFlow. You launch. Users don't like it. You change it in 1 day. You win."
        />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>
          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Speed is the only advantage a startup has. Traditional development is slow and expensive. Visual development changes the math.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. Validated Learning</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Don't spend R200k to find out nobody wants your app. Spend R5k and find out in a week.</p></div>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. No Vendor Lock-in</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Modern tools export real code. You own the asset, not the platform.</p></div>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>🚀 How CapeWeb Helps You Scale</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>We prototype rapidly using these tools before writing custom code.</p>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Why is it important that modern No-Code tools export clean code?", options: ["It isn't important", "So you are not locked into their platform forever", "To make the file size larger"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module C: React Native
export function Pillar4ModuleC({ onNext }) {
  return (
    <InteractiveLayout title="Module C: React Native" subtitle="The Bridge concept.">
      <div className="cw-prose">
        <p>React Native lets you write JavaScript (same as the web) but it controls the Real Native Components on the phone.</p>

        <BridgeVisual />

        <CWCard style={{ borderLeft: '4px solid #22D3EE' }}>
          <h4>Over-the-Air Updates (CodePush)</h4>
          <p>You can push a JavaScript bug fix to every user's phone INSTANTLY, bypassing the 2-day Apple App Store review process.</p>
        </CWCard>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>
          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Maintaining two codebases (Swift for iOS, Kotlin for Android) doubles your cost and halves your speed. Cross-platform is the business choice.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. Talent Pool</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>React Native uses JavaScript, the most popular language in the world. Easier to hire, cheaper to maintain.</p></div>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. Feature Parity</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Ensure your Android users get the same features as iOS users on the same day.</p></div>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>🚀 How CapeWeb Helps You Scale</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>We specialize in React Native architecture for long-term scalability.</p>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What acts as the translator between JavaScript and Native code in React Native?", options: ["The Wall", "The Bridge", "The Tunnel"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module D: Flutter
export function Pillar4ModuleD({ onNext }) {
  return (
    <InteractiveLayout title="Module D: Flutter & Impeller" subtitle="Drawing every pixel.">
      <div className="cw-prose">
        <p>Unlike React Native (which uses the phone's native buttons), Flutter draws its own buttons. It is like a high-performance 2D game engine.</p>

        <ImpellerVisual />

        <p>This means your app looks <strong>exactly the same</strong> on an old Android and a new iPhone.</p>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>
          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Google backs Flutter. It is designed for "Ambient Computing"—running on any screen (auto, mobile, desktop) with high performance.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. Consistency</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Avoid "broken UI" support tickets. Control every pixel, regardless of the user's device.</p></div>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. Performance</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Flutter apps feel "buttery smooth" (60/120fps), which builds subconscious trust.</p></div>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>🚀 How CapeWeb Helps You Scale</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>We help you choose between Flutter and React Native depending on your visual needs.</p>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "How does Flutter render UI?", options: ["It uses standard HTML", "It draws every pixel itself using a graphics engine", "It sends a fax"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module E: Native
export function Pillar4ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: Native Guidelines" subtitle="Respecting the platform.">
      <div className="cw-prose">
        <p>Don't make an iPhone app look like a Google app. Users will feel "uncanny valley" vibes.</p>

        <PlatformMismatchVisual />

        <CWCard style={{ background: '#F1F5F9' }}>
          <strong>Jakob's Law</strong>
          <p>Users spend most of their time on OTHER sites/apps. They expect yours to work the same way.</p>
        </CWCard>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>
          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            "Innovation" in UI is often a mistake. Users don't want to learn how to use your app; they want to solve their problem.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. Reduce Friction</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>If a user has to "think" about how to go back, you lost them. Use standard patterns.</p></div>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. Platform Trust</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Apps that follow Guidelines result in higher App Store approval rates and better reviews.</p></div>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>🚀 How CapeWeb Helps You Scale</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>We design standard, intuitive interfaces that require zero training.</p>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is Apple's design rulebook called?", options: ["Material Design", "Human Interface Guidelines (HIG)", "The Apple Way"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module F: Backend
export function Pillar4ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: Offline First" subtitle="The tunnel problem.">
      <div className="cw-prose">
        <p>In South Africa, mobile data is flaky. An app MUST work when the internet cuts out.</p>

        <OfflineSyncVisual />

        <ScenarioToggle
          oldTitle="The Spinning Wheel"
          oldContent="User tries to 'Like' a photo. Spinner appears. Request fails. Error message. Frustration."
          newTitle="Optimistic UI"
          newContent="User taps 'Like'. Heart turns Red INSTANTLY. App saves to local DB. Syncs to cloud later when online. Joy."
        />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>
          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            In emerging markets like South Africa, connectivity is not guaranteed. Load shedding knocks out cell towers. Your business must continue.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. Reliability</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>If your field worker can't log data because of poor signal, you lose data. Offline-first fixes this.</p></div>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. Perceived Speed</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Local actions are instant. Users feel the app is "fast", even if the network is slow.</p></div>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>🚀 How CapeWeb Helps You Scale</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>We implement local-databases (SQLite/Link) to ensure 100% uptime for your users.</p>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is 'Optimistic UI'?", options: ["Being happy", "Updating the UI instantly before the server confirms", "Waiting for the server response"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module G: Publishing
export function Pillar4ModuleG({ onNext }) {
  return (
    <InteractiveLayout title="Module G: App Store Optimization (ASO)" subtitle="The packaging matters.">
      <div className="cw-prose">
        <p>The App Store is a search engine. Your Title, Screenshots, and Reviews determine if you get downloaded.</p>

        <AsoFunnelVisual />

        <CWAlert type="error" title="Rejection Risk">
          Apple rejects "Website Wrappers". If your app doesn't use native features (Camera, Push, Offline), they will tell you to just build a website.
        </CWAlert>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>
          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            The App Store is a distribution channel with billions of credit cards on file. But you have to play by their rules.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. Discovery</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>70% of apps are found through search. ASO (App Store Optimization) is free marketing.</p></div>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. Credibility</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Being "On the App Store" is a trust signal. It verifies your business legitimacy.</p></div>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>🚀 How CapeWeb Helps You Scale</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>We handle the entire submission process, meta-data optimization, and rejection appeals.</p>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Why might Apple reject an app?", options: ["It is too beautiful", "It is just a website wrapper with no native functionality", "It is free"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module H: UX
export function Pillar4ModuleH({ onNext }) {
  return (
    <InteractiveLayout title="Module H: The Thumb Zone" subtitle="Ergonomics of touch.">
      <div className="cw-prose">
        <p>Most people use their phone with one hand. The top corner is the "Pain Zone". Important buttons must be at the bottom.</p>

        <ThumbZoneVisual />

        <ScenarioToggle
          oldTitle="Hamburger Menu (Top Left) 🍔"
          oldContent="Hard to reach. Thumb strain. Low engagement."
          newTitle="Tab Bar (Bottom) ⬇️"
          newContent="Easy to reach. Instant switching. High engagement."
        />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>
          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Ergonomics equals Economics. If your app is physically comfortable to use, sessions are longer, and users buy more.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. The One-Handed Rule</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>People use phones while holding coffee, bags, or kids. If they need two hands, they close your app.</p></div>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. Conversion Buttons</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Your "Buy" or "Contact" button should always be in the Thumb Zone.</p></div>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>🚀 How CapeWeb Helps You Scale</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>We design ergonomic interfaces tested on real devices.</p>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Why is the top-left corner hard to reach?", options: ["It is too dark", "It is outside the natural arc of the thumb", "Pixels are expensive there"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module I: Performance
export function Pillar4ModuleI({ onNext }) {
  return (
    <InteractiveLayout title="Module I: Battery Consumpption" subtitle="The silent killer.">
      <div className="cw-prose">
        <p>The #1 battery killer is the Network Radio. Every time you fetch data, the radio wakes up.</p>

        <NetworkRadioVisual />

        <p><strong>Batch your requests.</strong> Fetch everything you need at once, then let the radio sleep.</p>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>
          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Users blame <em>your</em> app for their battery dying. If you drain their power, they delete you to "save space" and battery.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. Retention</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>High performance apps are kept. Resource hogs are deleted.</p></div>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. Data Costs</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>In SA, data is money. An app that constantly downloads unnecessary data is "stealing" from the user.</p></div>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>🚀 How CapeWeb Helps You Scale</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>We optimize assets and caching to minimize data and battery usage.</p>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Which component consumes significant battery power?", options: ["The Speaker", "The Network Radio (waking up frequently)", "The GPS when off"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module J: Testing
export function Pillar4ModuleJ({ onNext }) {
  return (
    <InteractiveLayout title="Module J: Chaos Engineering" subtitle="Beyond 'It works on my machine'.">
      <div className="cw-prose">
        <p>Real users do crazy things. They tap buttons with wet fingers. They lose signal in an elevator.</p>

        <ChaosVisual />

        <h3>Monkey Testing</h3>
        <p>This is a technique where an automated script taps random spots on the screen 100 times a second to try and crash your app.</p>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>
          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            One crash is an accident. Two crashes is a pattern. Three crashes is a 1-star review.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. Reputation</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Reviews are forever. Recovering from a 2-star average is almost impossible.</p></div>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. Cost of Fixing</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Fixing bugs in production is 10x more expensive than finding them during development.</p></div>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>🚀 How CapeWeb Helps You Scale</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>We run automated chaos testing suites on every build.</p>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is 'Monkey Testing'?", options: ["Testing on animals", "Automated random inputs to try and crash the app", "Testing in the jungle"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module K: Monetization
export function Pillar4ModuleK({ onNext }) {
  return (
    <InteractiveLayout title="Module K: Freemium Economics" subtitle="Hunting Whales.">
      <div className="cw-prose">
        <WhaleVisual />

        <BookInsight title="The Power Law" author="Eric Seufert" book="Freemium Economics" color="#8B5CF6">
          <p>"In Free-to-Play games, 95% of users pay nothing. The business is supported by 'Whales'—users who love the product so much they spend thousands."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>
          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            You don't need everyone to pay you. You just need a system where the users who love you CAN pay you easily.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. The Funnel</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>Free users are not "leeches". They are the audience for your ads and the referral engine for your Whales.</p></div>
            <div><h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. LTV greater than CAC</h4><p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>If a user is worth R50 and costs R20 to acquire, you have a money printing machine.</p></div>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>🚀 How CapeWeb Helps You Scale</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>We implement In-App Purchases and Subscription models.</p>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What must be greater than CAC (Cost to Acquire Customer) for a business to survive?", options: ["LTV (Lifetime Value)", "CPI (Cost Per Install)", "DAU (Daily Active Users)"], correctIndex: 0 }
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
export function Pillar4Resources({ onNext }) {
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
    <InteractiveLayout title="Module L: Resources" subtitle="The App Developer's Toolkit">
      <div className="cw-prose">
        <p>Building apps is hard. Managing subscriptions, push notifications, and app store approvals is even harder. These tools make it manageable.</p>

        <h3 style={{ marginTop: '2rem' }}>🛠️ The Mobile Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Framework"
            title="Expo"
            description="The fastest way to build React Native apps. One codebase for iOS, Android, and Web."
            link="https://expo.dev"
          />
          <ResourceCard
            category="Core"
            title="React Native"
            description="Build native apps using JavaScript and React. Used by Facebook, Tesla, and Airbnb."
            link="https://reactnative.dev"
          />
          <ResourceCard
            category="Backend"
            title="Supabase"
            description="Perfect for mobile: Auth (Apple/Google Login) and Realtime Database out of the box."
            link="https://supabase.com"
          />
          <ResourceCard
            category="Monetization"
            title="RevenueCat"
            description="Implementing In-App Purchases is a nightmare. RevenueCat solves it in 10 minutes."
            link="https://www.revenuecat.com/"
          />
          <ResourceCard
            category="Design"
            title="Apple Human Interface"
            description="The official design guidelines from Apple. Read this before designing a single pixel."
            link="https://developer.apple.com/design/human-interface-guidelines/"
          />
        </div>

        <h3 style={{ marginTop: '3rem' }}>📚 Recommended Reading</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Validation"
            title="The Mom Test"
            description="By Rob Fitzpatrick. How to talk to customers & learn if your idea is good (because your mom will lie to you)."
            link="https://www.momtestbook.com/"
          />
          <ResourceCard
            category="Retention"
            title="Hooked"
            description="By Nir Eyal. How to build habit-forming products that bring users back."
            link="https://www.nirandfar.com/hooked/"
          />
          <ResourceCard
            category="Strategy"
            title="The Lean Startup"
            description="By Eric Ries. Build an MVP, measure, learn, and pivot. The standard for tech startups."
            link="http://theleanstartup.com/"
          />
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <h4>Ready for the App Store?</h4>
          <p style={{ marginBottom: '1.5rem', color: '#64748B' }}>You have the tools. Now pass the exam to earn your Mobile Developer badge.</p>
          <CWButton onClick={onNext} variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Take Final Exam 🏁</CWButton>
        </div>
      </div>
    </InteractiveLayout>
  )
}

// ==========================================
// FINAL QUIZ COMPONENT
// ==========================================

export function Pillar4Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  // Local state handling if props missing
  const [localResponses, setLocalResponses] = useState({});
  const activeResponses = quizResponses || localResponses;
  const activeSetResponse = onSelect || ((qMvc, optIdx) => setLocalResponses(prev => ({ ...prev, [qMvc]: optIdx })));

  const questions = pillar4QuizQuestions;
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
          <CWHeading level={3}>Pillar 11 Complete!</CWHeading>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{scoreMessage}</p>
          <CWButton onClick={onFinish}>Continue to Certificate →</CWButton>
        </div>
      </CWCard>
    );
  }

  return (
    <QuizLayout title="Final Exam: Mobile Dev" currentStep={currentQuestionIndex + 1} totalSteps={questions.length}>
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

export function Pillar4Completion() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>🎓</h1>
      <CWHeading level={2}>Mobile Master</CWHeading>
      <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '1rem auto' }}>
        You have conquered the App Stores. You know the tools, the rules, and the strategies to build mobile products that people actually use.
      </p>
    </div>
  );
}
