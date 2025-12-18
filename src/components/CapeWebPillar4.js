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
    question: 'In Nir Eyal\'s "Hooked" model, what comes after the Trigger?',
    options: ['The Reward', 'The Action', 'The Investment'],
    correctIndex: 1,
  },
  {
    question: 'According to "The Mom Test", what is the wrong way to validate an app idea?',
    options: ['Watching users solve the problem currently', 'Asking "Would you buy this app?" (Hypothetical)', 'Asking "When was the last time you encountered this problem?"'],
    correctIndex: 1,
  },
  {
    question: 'What is the "Thumb Zone"?',
    options: ['The top left corner of the screen', 'The area of the screen comfortably reachable with one handed use', 'A specific button color'],
    correctIndex: 1,
  },
  {
    question: 'How does Flutter achieve consistent rendering across iOS and Android?',
    options: ['It uses native buttons', 'It uses the Skia/Impeller Graphics Engine to draw every pixel itself', 'It uses HTML'],
    correctIndex: 1,
  },
  {
    question: 'In Mobile Backend, what is "Optimistic UI"?',
    options: ['Hoping the server works', 'Updating the screen instantly as if the request succeeded, then reverting if it fails', 'Smiling while coding'],
    correctIndex: 1,
  },
  {
    question: 'What is the most expensive resource on a mobile device to consume?',
    options: ['Storage space', 'The Network Radio (Battery drain)', 'RAM'],
    correctIndex: 1,
  },
  {
    question: 'According to Apple\'s "Human Interface Guidelines", touch targets should be at least:',
    options: ['10x10 pts', '44x44 pts', '100x100 pts'],
    correctIndex: 1,
  },
  {
    question: 'What is "Dogfooding"?',
    options: ['Feeding your pets', 'Using your own app internally before releasing it to customers', 'A coding language'],
    correctIndex: 1,
  },
  {
    question: 'In Freemium Economics, who are "Whales"?',
    options: ['The 95% of users who play for free', 'The small % of users who spend massive amounts of money', 'Large tablets'],
    correctIndex: 1,
  },
  {
    question: 'What is a key advantage of React Native\'s "CodePush"?',
    options: ['It pushes code physically', 'It allows updating the JS bundle over-the-air without App Store review', 'It writes code for you'],
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

// Interactive: The Hook Model Simulator
function HookModelVisual() {
  const [stage, setStage] = useState(0); // 0: Trigger, 1: Action, 2: Reward, 3: Investment
  const [dopamine, setDopamine] = useState(20);

  const handleNext = () => {
    if (stage === 3) {
      setStage(0); // Loop
    } else {
      if (stage === 1) setDopamine(prev => Math.min(prev + 40, 100)); // Reward boosts dopamine
      setStage(stage + 1);
    }
  };

  const steps = [
    { label: '1. Trigger', icon: '🔔', desc: 'External: Push Notification\nInternal: Boredom', color: '#facc15' },
    { label: '2. Action', icon: '👆', desc: 'Simple behavior done in anticipation of reward.', color: '#fb7185' },
    { label: '3. Reward', icon: '🎁', desc: 'Variable Reward! (Likes, Matches, News)', color: '#22d3ee' },
    { label: '4. Investment', icon: '💼', desc: 'User adds data (Profile, Friend), increasing value.', color: '#4ade80' },
  ];

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', textAlign: 'center' }}>
      <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Interactive: The Habit Loop</h3>
      <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Click the button to complete the cycle and build the habit.</p>

      {/* Cycle Visual */}
      <div style={{ position: 'relative', width: '250px', height: '250px', margin: '0 auto 2rem' }}>
        {steps.map((s, i) => {
          const angle = (i * 90) - 90; // Top, Right, Bottom, Left
          const isActive = i === stage;
          return (
            <div key={i} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '80px', height: '80px',
              marginLeft: '-40px', marginTop: '-40px',
              borderRadius: '50%',
              background: isActive ? s.color : '#1E293B',
              border: `2px solid ${isActive ? 'white' : '#334155'}`,
              transform: `rotate(${angle}deg) translate(85px) rotate(${-angle}deg) scale(${isActive ? 1.2 : 0.9})`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: isActive ? 10 : 1,
              boxShadow: isActive ? `0 0 30px ${s.color}66` : 'none',
              opacity: isActive ? 1 : 0.4
            }}>
              <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
            </div>
          );
        })}
        {/* Center Info */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', textAlign: 'center' }}>
          <div style={{ color: steps[stage].color, fontWeight: 800, fontSize: '0.9rem', marginBottom: '5px' }}>{steps[stage].label}</div>
          <div style={{ color: 'white', fontSize: '0.7rem', lineHeight: '1.2' }}>{steps[stage].desc}</div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleNext}
        style={{
          padding: '1rem 2.5rem',
          background: steps[stage].color,
          color: '#000',
          border: 'none',
          borderRadius: '100px',
          fontSize: '1.1rem',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: `0 4px 15px ${steps[stage].color}66`,
          transition: 'transform 0.1s'
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {stage === 3 ? 'Restart Loop ↻' : 'Next Step →'}
      </button>

      {/* Dopamine Meter */}
      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontSize: '0.8rem' }}>User Dopamine:</span>
        <div style={{ width: '150px', height: '10px', background: '#334155', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${dopamine}%`, height: '100%', background: 'linear-gradient(90deg, #F472B6, #22D3EE)', transition: 'width 0.5s' }}></div>
        </div>
      </div>
    </div>
  );
}

function ThumbZoneVisual() {
  return (
    <div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '250px', height: '450px', border: '8px solid #334155', borderRadius: '40px', background: 'white', position: 'relative', overflow: 'hidden' }}>
        {/* Red Zone (Top) */}
        <div style={{ height: '30%', background: '#FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#991B1B', fontWeight: 'bold' }}>PAIN</div>
        {/* Yellow Zone */}
        <div style={{ height: '40%', background: '#FEF08A' }}></div>
        {/* Green Zone (Bottom) */}
        <div style={{ height: '30%', background: '#BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065F46', fontWeight: 'bold' }}>NATURAL</div>

        {/* Hand Overlay */}
        <div style={{
          position: 'absolute', bottom: '-20px', right: '-20px', width: '200px', height: '200px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%', pointerEvents: 'none'
        }}></div>
      </div>
    </div>
  )
}

function OfflineSyncVisual() {
  const [online, setOnline] = useState(false);
  return (
    <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <button onClick={() => setOnline(!online)} style={{
          padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', background: online ? '#10B981' : '#EF4444', color: 'white', fontWeight: 'bold', cursor: 'pointer'
        }}>
          {online ? 'Status: ONLINE 🟢' : 'Status: OFFLINE 🔴'}
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '400px', margin: '0 auto' }}>
        {/* Device */}
        <div style={{ padding: '1rem', background: 'white', borderRadius: '12px', border: '2px solid #CBD5E1' }}>
          📱 Phone <br /> (Data Saved Locally)
        </div>
        {/* Sync Line */}
        <div style={{ flex: 1, padding: '0 1rem', position: 'relative' }}>
          <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px' }}></div>
          {online && (
            <div style={{ position: 'absolute', top: '-10px', left: '0', width: '20px', height: '20px', background: '#3B82F6', borderRadius: '50%', animation: 'moveRight 1s infinite' }}></div>
          )}
          <style>{`@keyframes moveRight { 0% { left: 10% } 100% { left: 90% } }`}</style>
        </div>
        {/* Cloud */}
        <div style={{ padding: '1rem', background: online ? '#DBEAFE' : '#E2E8F0', borderRadius: '12px', opacity: online ? 1 : 0.5 }}>
          ☁️ Cloud <br /> (Database)
        </div>
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

// Interactive: No-Code App Builder
function AppBuilderSimulator() {
  const [features, setFeatures] = useState([]);
  const [time, setTime] = useState(0); // Weeks
  const [cost, setCost] = useState(0); // Rands

  const toggleFeature = (feat) => {
    if (features.includes(feat.id)) {
      setFeatures(features.filter(f => f !== feat.id));
      setTime(t => t - feat.time);
      setCost(c => c - feat.cost);
    } else {
      setFeatures([...features, feat.id]);
      setTime(t => t + feat.time);
      setCost(c => c + feat.cost);
    }
  };

  const menu = [
    { id: 'auth', label: 'Login Screen (Auth)', time: 0.1, cost: 0, type: 'basic' },
    { id: 'map', label: 'Google Maps', time: 0.2, cost: 0, type: 'basic' },
    { id: 'chat', label: 'Chat System', time: 0.2, cost: 0, type: 'basic' },
    { id: 'payment', label: 'Stripe Payments', time: 0.1, cost: 0, type: 'basic' },
  ];

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Interactive: The No-Code Studio</h3>
        <p style={{ color: '#94A3B8' }}>Drag & Drop features to build your MVP. Notice the Dev Time.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Toolbox */}
        <div>
          <h4 style={{ color: '#94A3B8', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Available Modules</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {menu.map(item => (
              <button
                key={item.id}
                onClick={() => toggleFeature(item)}
                style={{
                  padding: '1rem',
                  background: features.includes(item.id) ? '#3B82F6' : '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <span>{features.includes(item.id) ? '✅' : '➕'} {item.label}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Drag →</span>
              </button>
            ))}
          </div>
        </div>

        {/* Phone Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '220px', height: '400px', background: 'white', borderRadius: '30px', border: '8px solid #334155', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '20px', background: '#F1F5F9', marginBottom: '10px', borderRadius: '4px' }}></div>

            {/* Added Features */}
            {features.length === 0 && (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CAD5E1', fontSize: '0.9rem' }}>
                Empty Canvas
              </div>
            )}

            {features.map((fid) => {
              const f = menu.find(m => m.id === fid);
              return (
                <div key={fid} style={{ padding: '0.8rem', background: '#DBEAFE', borderRadius: '8px', marginBottom: '0.5rem', color: '#1E3A8A', fontSize: '0.8rem', fontWeight: 700, animation: 'popIn 0.3s' }}>
                  {f.label} Component
                </div>
              );
            })}

            {/* Nav Bar */}
            <div style={{ position: 'absolute', bottom: '10px', left: '1rem', right: '1rem', height: '30px', background: '#F1F5F9', borderRadius: '15px' }}></div>
          </div>
          <style>{`@keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

          <div style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', background: '#1E293B', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Estimated Build Time</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10B981' }}>
              {(time + 2).toFixed(1)} Weeks
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              (vs 6 Months Traditional)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        <p>To win on mobile, your app must create a "Habit Loop". If users don't open it automatically when they are bored, you have already lost.</p>

        <HookModelVisual />

        <ScenarioToggle
          oldTitle="The Tool"
          oldContent="I open it once a month to pay a bill. (Low Engagement, High Delete Rate)"
          newTitle="The Habit"
          newContent="I open it every morning to see if I have new messages. (High Engagement, Zero Churn)"
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
          <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#0C4A6E', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            A mobile app gives you <strong>Real Estate on the Home Screen</strong>. This is the most valuable advertising space in the world. It allows you to bypass Google/Facebook ads and talk directly to your customer via Push Notifications.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#0284C7', marginBottom: '0.5rem' }}>1. Push vs Email</h4>
              <p style={{ fontSize: '0.95rem', color: '#0C4A6E', lineHeight: '1.6' }}>
                Email open rates are ~20%. Push Notification open rates are ~90%. An app gives you a direct line to your customer's pocket.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#0284C7', marginBottom: '0.5rem' }}>2. Retention</h4>
              <p style={{ fontSize: '0.95rem', color: '#0C4A6E', lineHeight: '1.6' }}>
                It costs 5x more to acquire a new customer than to keep an existing one. Apps are retention machines. They keep your brand "Top of Mind" simply by existing on the screen.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BAE6FD', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build habit-forming products.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#0EA5E9', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Strategy Workshops:</strong> We don't just build apps; we design the "Hook". We help you map out the Trigger, Action, Reward, and Investment via our <a href="/services?service=roi-custom-web-dev" style={{ color: '#0EA5E9', textDecoration: 'underline' }}>Product Strategy</a> sessions.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#0EA5E9', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Native App Dev:</strong> We build high-performance React Native & Flutter apps that feel premium and responsive, ensuring your users love the experience.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <BookInsight title="Building Habit Forming Products" author="Nir Eyal" book="Hooked" color="#3B82F6">
          <p>"To change behavior, products must ensure the user invests in the product by entering data, earning status, or customizing their experience."</p>
        </BookInsight>

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

        <h3>The Prototype Mindset</h3>
        <p>
          You can build a "looking" app in 2 days. Use it to get feedback.
        </p>

        <AppBuilderSimulator />

        <ScenarioToggle
          oldTitle="The 6 Month Build"
          oldContent="You spend R100k hiring devs. You launch. Users don't like it. You are broke."
          newTitle="The 2 Week Prototype"
          newContent="You build it yourself in FlutterFlow. You launch. Users don't like it. You change it in 1 day. You win."
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #6EE7B7' }}>
          <CWHeading level={3} style={{ color: '#047857', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#065F46', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            The biggest risk in business is <strong>building something nobody wants</strong>. Visual Development (No-Code) allows you to "fail fast" and "fail cheap". You can validate your idea for R10k instead of R500k.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>1. Speed to Market</h4>
              <p style={{ fontSize: '0.95rem', color: '#065F46', lineHeight: '1.6' }}>
                If your competitor launches 6 months before you, they win. Visual Dev lets you launch in weeks.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>2. Agility</h4>
              <p style={{ fontSize: '0.95rem', color: '#065F46', lineHeight: '1.6' }}>
                Need to change the pricing model? Or add a new feature? With Visual Dev, these changes take hours, not weeks of coding.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #6EE7B7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We specialize in Rapid MVP Development.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>MVP Launchpad:</strong> We use tools like FlutterFlow to build and launch your <a href="/services?service=roi-custom-web-dev" style={{ color: '#10B981', textDecoration: 'underline' }}>iOS/Android App</a> in under 4 weeks.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Hybrid Approach:</strong> If your app grows, we can export the code and add custom features using React Native, giving you the best of both worlds.
                </span>
              </li>
            </ul>
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

// Interactive: The Bridge Concept
function NativeBridgeSimulator() {
  const [messages, setMessages] = useState([]); // { id, type, status }
  const [jsLoad, setJsLoad] = useState(0);
  const [nativeLoad, setNativeLoad] = useState(0);
  const [congested, setCongested] = useState(false);

  const sendCommand = (type) => {
    if (messages.length > 8) {
      setCongested(true);
      setTimeout(() => setCongested(false), 2000);
      return;
    }
    const id = Date.now() + Math.random();
    setMessages(prev => [...prev, { id, type, status: 'js' }]);
    setJsLoad(prev => Math.min(prev + 20, 100));

    // Simulate Bridge Travel
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'bridge' } : m));
      // Simulate Native Arrival
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'native' } : m));
        setNativeLoad(prev => Math.min(prev + 20, 100));
        // Clear message
        setTimeout(() => {
          setMessages(prev => prev.filter(m => m.id !== id));
          setJsLoad(prev => Math.max(prev - 20, 0));
          setNativeLoad(prev => Math.max(prev - 20, 0));
        }, 1000);
      }, 1000);
    }, 800);
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', textAlign: 'center' }}>
      <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Interactive: The React Native Bridge</h3>
      <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Send commands from JS to Native. Watch out for traffic jams!</p>

      {/* Visualizer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>

        {/* JS Thread */}
        <div style={{ padding: '1rem', background: '#1E293B', borderRadius: '16px', border: '2px solid #F59E0B' }}>
          <div style={{ color: '#F59E0B', fontWeight: 800, marginBottom: '0.5rem' }}>JavaScript Thread</div>
          <div style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>React Logic</div>
          <div style={{ height: '6px', background: '#334155', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ width: `${jsLoad}%`, height: '100%', background: '#F59E0B', transition: 'width 0.2s' }}></div>
          </div>
        </div>

        {/* The Bridge */}
        <div style={{ position: 'relative', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '100%', height: '8px', background: congested ? '#EF4444' : '#475569', borderRadius: '4px', transition: 'background 0.3s' }}></div>
          {congested && <div style={{ position: 'absolute', top: '-1.5rem', color: '#EF4444', fontWeight: 800, fontSize: '0.8rem' }}>⚠️ TRAFFIC</div>}

          {/* Messages on Bridge */}
          {messages.map(m => (
            <div key={m.id} style={{
              position: 'absolute',
              width: '16px', height: '16px', borderRadius: '50%',
              background: m.type === 'ui' ? '#60A5FA' : '#F472B6',
              boxShadow: '0 0 10px rgba(96, 165, 250, 0.5)',
              left: m.status === 'js' ? '0%' : m.status === 'bridge' ? '50%' : '100%',
              transition: 'left 1s ease-in-out',
              transform: 'translate(-50%, -50%)',
              top: '50%'
            }}></div>
          ))}
        </div>

        {/* Native Thread */}
        <div style={{ padding: '1rem', background: '#1E293B', borderRadius: '16px', border: '2px solid #3B82F6' }}>
          <div style={{ color: '#3B82F6', fontWeight: 800, marginBottom: '0.5rem' }}>Native Thread</div>
          <div style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>iOS / Android UI</div>
          <div style={{ height: '6px', background: '#334155', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ width: `${nativeLoad}%`, height: '100%', background: '#3B82F6', transition: 'width 0.2s' }}></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => sendCommand('ui')}
          style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', background: '#3B82F6', color: 'white', fontWeight: 700, cursor: 'pointer', opacity: congested ? 0.5 : 1 }}
        >
          Send UI Update 🟦
        </button>
        <button
          onClick={() => sendCommand('anim')}
          style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', background: '#EC4899', color: 'white', fontWeight: 700, cursor: 'pointer', opacity: congested ? 0.5 : 1 }}
        >
          Send Animation 🌸
        </button>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
        Rule: Don't overload the bridge with 60fps animations. Use the Native Driver.
      </div>
    </div>
  );
}

// Module C: React Native
export function Pillar4ModuleC({ onNext }) {
  return (
    <InteractiveLayout title="Module C: React Native" subtitle="The Bridge concept.">
      <div className="cw-prose">
        <p className="cw-text-body">
          <strong>React Native</strong> allows you to write one codebase (in JavaScript) that runs on both iOS and Android. It translates your code into real, native components.
        </p>

        <h3>The Bridge</h3>
        <p>
          Think of it as two countries (JavaScript Land and Native Land) speaking different languages. "The Bridge" translates messages between them.
        </p>

        <NativeBridgeSimulator />

        <CWCard style={{ borderLeft: '4px solid #F59E0B' }}>
          <h4>CodePush: The Superpower</h4>
          <p>Because the logic is just JavaScript, you can push updates to your users <strong>Instantly</strong>. You don't have to wait for the 2-day Apple App Store review process for bug fixes.</p>
        </CWCard>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', borderRadius: '24px', border: '1px solid #FED7AA' }}>
          <CWHeading level={3} style={{ color: '#C2410C', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9A3412', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Cross-Platform Efficiency</strong> means you pay for one development team but get two apps (iOS & Android). This reduces your initial build cost by ~40% and halves your maintenance costs.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#EA580C', marginBottom: '0.5rem' }}>1. Single Source of Truth</h4>
              <p style={{ fontSize: '0.95rem', color: '#9A3412', lineHeight: '1.6' }}>
                Fix a bug once, and it is fixed on both platforms. This ensures feature parity and a consistent brand experience.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#EA580C', marginBottom: '0.5rem' }}>2. Talent Pool</h4>
              <p style={{ fontSize: '0.95rem', color: '#9A3412', lineHeight: '1.6' }}>
                Since it uses JavaScript (React), there are millions of developers available. You aren't hunting for rare, expensive Swift or Kotlin specialists.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FED7AA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We are React Native experts.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F97316', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Cost-Effective Builds:</strong> We utilize <a href="/services?service=roi-custom-web-dev" style={{ color: '#F97316', textDecoration: 'underline' }}>React Native</a> to deliver high-quality iOS and Android apps faster and cheaper than native-only agencies.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F97316', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Live Updates:</strong> We implement CodePush pipelines so we can fix critical bugs on your live app immediately, without waiting for Apple.
                </span>
              </li>
            </ul>
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

// Interactive: Flutter Impeller Engine
function ImpellerEngineVisual() {
  const [rendering, setRendering] = useState(false);
  const [layers, setLayers] = useState([]);

  const drawFrame = () => {
    if (rendering) return;
    setRendering(true);
    setLayers([]);

    // Simulate drawing layers
    const sequence = [
      { id: 'bg', color: '#1E293B', width: '100%', height: '100%', borderRadius: '0' },
      { id: 'button', color: '#3B82F6', width: '60%', height: '50px', borderRadius: '12px' },
      { id: 'text', color: '#FFFFFF', width: '30%', height: '10px', borderRadius: '4px' },
      { id: 'shadow', color: 'rgba(0,0,0,0.3)', width: '60%', height: '50px', borderRadius: '12px', blur: true }
    ];

    sequence.forEach((layer, index) => {
      setTimeout(() => {
        setLayers(prev => [...prev, layer]);
        if (index === sequence.length - 1) setRendering(false);
      }, (index + 1) * 200);
    });
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', textAlign: 'center' }}>
      <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Interactive: The Skia/Impeller Engine</h3>
      <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Flutter doesn't use native buttons. It paints every pixel itself, like a game engine.</p>

      <div style={{ position: 'relative', width: '280px', height: '180px', margin: '0 auto 2rem', border: '4px solid #334155', borderRadius: '16px', background: '#000', overflow: 'hidden' }}>
        {/* Canvas Area */}
        {layers.map((l, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: l.id === 'bg' ? 0 : '50%',
            left: l.id === 'bg' ? 0 : '50%',
            transform: l.id === 'bg' ? 'none' : `translate(${l.id === 'shadow' ? '4px' : '-50%'}, ${l.id === 'shadow' ? '4px' : '-50%'})`,
            width: l.width,
            height: l.height,
            background: l.color,
            borderRadius: l.borderRadius,
            filter: l.blur ? 'blur(10px)' : 'none',
            zIndex: i,
            animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}></div>
        ))}
        {/* Painter Icon */}
        <div style={{
          position: 'absolute',
          top: rendering ? '60%' : '10%',
          right: rendering ? '20%' : '-50px',
          fontSize: '2rem',
          transition: 'all 0.5s ease'
        }}>🖌️</div>

        <style>{`@keyframes scaleIn { from { transform: translate(-50%, -50%) scale(0); } to { transform: translate(-50%, -50%) scale(1); } }`}</style>
      </div>

      <button
        onClick={drawFrame}
        style={{ padding: '0.8rem 2rem', borderRadius: '100px', border: 'none', background: rendering ? '#334155' : '#10B981', color: 'white', fontWeight: 700, cursor: rendering ? 'default' : 'pointer', transition: 'all 0.2s' }}
      >
        {layers.length === 0 ? 'Paint Frame 🎨' : 'Re-Paint Frame 🎨'}
      </button>

      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
        <div style={{ background: '#1E293B', padding: '1rem', borderRadius: '12px' }}>
          <h4 style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Native (Standard)</h4>
          <p style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>Relies on OEM components. Look changes with OS updates.</p>
        </div>
        <div style={{ background: '#1E293B', padding: '1rem', borderRadius: '12px', border: '1px solid #3B82F6' }}>
          <h4 style={{ color: '#3B82F6', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Flutter (Impeller)</h4>
          <p style={{ color: '#white', fontSize: '0.9rem' }}>YOU control every pixel. Identical on all devices.</p>
        </div>
      </div>
    </div>
  );
}

// Module D: Flutter
export function Pillar4ModuleD({ onNext }) {
  return (
    <InteractiveLayout title="Module D: Flutter & Impeller" subtitle="Drawing every pixel.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Unlike React Native (which uses the phone's native buttons), <strong>Flutter</strong> draws its own buttons. It is basically a high-performance 2D game engine that runs apps.
        </p>

        <h3>The "Drawing" Approach</h3>
        <p>This means your app looks <strong>exactly the same</strong> on an old Android and a new iPhone. You are not at the mercy of the device manufacturer's design whims.</p>

        <ImpellerEngineVisual />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '24px', border: '1px solid #BFDBFE' }}>
          <CWHeading level={3} style={{ color: '#1E40AF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E3A8A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Brand Consistency & Performance.</strong> If your brand is "Premium", you cannot afford for your app to look broken on older Android phones (which is 60% of the SA market). Flutter guarantees a premium look everywhere.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#2563EB', marginBottom: '0.5rem' }}>1. The "Pixel Perfect" Promise</h4>
              <p style={{ fontSize: '0.95rem', color: '#1E3A8A', lineHeight: '1.6' }}>
                Your designers can design a specific custom UI, and Flutter will render it exactly as designed, down to the last pixel, without "Platform Limitations".
              </p>
            </div>
            <div>
              <h4 style={{ color: '#2563EB', marginBottom: '0.5rem' }}>2. High Performance</h4>
              <p style={{ fontSize: '0.95rem', color: '#1E3A8A', lineHeight: '1.6' }}>
                Because it compiles to machine code (ARM) and draws its own graphics, Flutter apps often run at a smooth 60fps or 120fps, feeling "buttery smooth".
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BFDBFE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build beautiful Flutter experiences.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Custom UX/UI:</strong> Using <a href="/services?service=roi-custom-web-dev" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Flutter</a>, we can build custom, animated interfaces that stand out from the "boring standard apps" of your competitors.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Emerging Markets:</strong> We optimize our Flutter builds to run smoothly even on entry-level R1000 smartphones, expanding your total addressable market in Africa.
                </span>
              </li>
            </ul>
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

// Interactive: Platform Guidelines Matcher
function PlatformGuidelineMatcher() {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const challenges = [
    {
      question: "Which Navigation style is Native to iOS?",
      options: [
        { id: 'ios', label: 'Bottom Tab Bar', icon: '⬇️' },
        { id: 'android', label: 'Hamburger Menu (Top)', icon: '🍔' }
      ],
      correct: 'ios',
      explanation: "iOS users expect navigation at the bottom. Top menus are harder to reach."
    },
    {
      question: "Which 'Action' style is Native to Android (Material)?",
      options: [
        { id: 'ios', label: 'Top Right Text Button', icon: 'Edit' },
        { id: 'android', label: 'Floating Action Button (FAB)', icon: '➕' }
      ],
      correct: 'android',
      explanation: "Android users look for the FAB (Floating Action Button) for primary actions."
    }
  ];

  const handleGuess = (id) => {
    if (id === challenges[step].correct) {
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        setStep(prev => (prev + 1) % challenges.length); // Loop or finish
      }, 2000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const current = challenges[step];

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', textAlign: 'center' }}>
      <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Interactive: Platform Native Check</h3>
      <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Don't confuse your users. Pick the pattern they expect.</p>

      <div style={{ marginBottom: '2rem', fontSize: '1.2rem', color: 'white', fontWeight: 600 }}>
        {current.question}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {current.options.map(opt => (
          <button
            key={opt.id}
            onClick={() => handleGuess(opt.id)}
            style={{
              padding: '2rem',
              background: '#1E293B',
              border: '2px solid #334155',
              borderRadius: '16px',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.1s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '2rem' }}>{opt.icon}</div>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{opt.label}</div>
          </button>
        ))}
      </div>

      {feedback && (
        <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '12px', background: feedback === 'correct' ? '#10B981' : '#EF4444', color: 'white', fontWeight: 700, animation: 'popIn 0.3s' }}>
          {feedback === 'correct' ? '✅ Correct! ' + current.explanation : '❌ Incorrect. Users might feel lost.'}
        </div>
      )}
    </div>
  );
}

// Interactive: ASO Simulator
function ASOSimulator() {
  const [stats, setStats] = useState({ downloads: 12, conversion: 1.5 });
  const [improvements, setImprovements] = useState({ keywords: false, screenshots: false, icon: false });

  const toggleImprovement = (key) => {
    if (improvements[key]) return;

    const newImps = { ...improvements, [key]: true };
    setImprovements(newImps);

    // Calculate impact
    let d = 12;
    let c = 1.5;
    if (newImps.keywords) { d += 40; c += 0.5; }
    if (newImps.screenshots) { d += 80; c += 2.5; }
    if (newImps.icon) { d += 30; c += 1.0; }

    // Animate stats
    const interval = setInterval(() => {
      setStats(prev => {
        const nextD = prev.downloads + (d - prev.downloads) * 0.1;
        const nextC = prev.conversion + (c - prev.conversion) * 0.1;
        if (Math.abs(nextD - d) < 1) clearInterval(interval);
        return { downloads: nextD, conversion: nextC };
      });
    }, 50);
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>Interactive: App Store Optimizer</h3>
      <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Metadata isn't just paperwork. It's your sales funnel.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <button
            onClick={() => toggleImprovement('keywords')}
            disabled={improvements.keywords}
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #334155', background: improvements.keywords ? '#1E293B' : '#334155', color: improvements.keywords ? '#10B981' : 'white', display: 'flex', justifyContent: 'space-between', cursor: improvements.keywords ? 'default' : 'pointer' }}
          >
            <span>Correct Keywords</span>
            <span>{improvements.keywords ? '✅' : '+40% Traffic'}</span>
          </button>
          <button
            onClick={() => toggleImprovement('screenshots')}
            disabled={improvements.screenshots}
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #334155', background: improvements.screenshots ? '#1E293B' : '#334155', color: improvements.screenshots ? '#10B981' : 'white', display: 'flex', justifyContent: 'space-between', cursor: improvements.screenshots ? 'default' : 'pointer' }}
          >
            <span>Lifestyle Screenshots</span>
            <span>{improvements.screenshots ? '✅' : '+200% Conv.'}</span>
          </button>
          <button
            onClick={() => toggleImprovement('icon')}
            disabled={improvements.icon}
            style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #334155', background: improvements.icon ? '#1E293B' : '#334155', color: improvements.icon ? '#10B981' : 'white', display: 'flex', justifyContent: 'space-between', cursor: improvements.screenshots ? 'default' : 'pointer' }}
          >
            <span>Vibrant App Icon</span>
            <span>{improvements.icon ? '✅' : '+30% Clicks'}</span>
          </button>
        </div>

        {/* Device Preview */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '1rem', color: '#0F172A' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: improvements.icon ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              {improvements.icon ? '🚀' : '😐'}
            </div>
            <div>
              <div style={{ fontWeight: 800 }}>My Great App</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{improvements.keywords ? 'The Best Productivity Tool 2024' : 'App for stuff'}</div>
              <div style={{ marginTop: '5px', fontSize: '0.7rem', color: '#3B82F6' }}>★★★★★</div>
            </div>
          </div>
          {/* Screenshots Row */}
          <div style={{ display: 'flex', gap: '0.5rem', overflow: 'hidden' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: '80px', height: '140px', background: improvements.screenshots ? '#DBEAFE' : '#F1F5F9', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', textAlign: 'center', padding: '2px' }}>
                {improvements.screenshots ? 'Feature + Human Face' : 'Boring Screenshot'}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Daily Downloads</div>
              <div style={{ fontWeight: 900, color: '#3B82F6' }}>{Math.round(stats.downloads)}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Conversion Rate</div>
              <div style={{ fontWeight: 900, color: stats.conversion > 4 ? '#10B981' : '#F59E0B' }}>{stats.conversion.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Module E: Native
export function Pillar4ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: Native Guidelines" subtitle="Respecting the platform.">
      <div className="cw-prose">
        <p>Don't make an iPhone app look like a Google app. Users will feel "uncanny valley" vibes.</p>

        <PlatformGuidelineMatcher />

        <CWCard style={{ background: '#F1F5F9' }}>
          <strong>Jakob's Law</strong>
          <p>Users spend most of their time on OTHER sites/apps. They expect yours to work the same way.</p>
        </CWCard>

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
        <p className="cw-text-body">
          In South Africa, mobile data is flaky. An app MUST work when the internet cuts out. If your app shows a white screen or a spinner when the user enters a lift or runs out of data, they will delete it.
        </p>

        <OfflineSyncVisual />

        <ScenarioToggle
          oldTitle="The Spinning Wheel"
          oldContent="User tries to 'Like' a photo. Spinner appears. Request fails. Error message. Frustration."
          newTitle="Optimistic UI"
          newContent="User taps 'Like'. Heart turns Red INSTANTLY. App saves to local DB. Syncs to cloud later when online. Joy."
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', borderRadius: '24px', border: '1px solid #BBF7D0' }}>
          <CWHeading level={3} style={{ color: '#15803D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#14532D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Retention & Usability.</strong> 30% of app usage happens in poor connectivity environments (commutes, rural areas, load shedding). An "Offline First" app works 100% of the time, making it reliable and indispensable.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#16A34A', marginBottom: '0.5rem' }}>1. No Dead Ends</h4>
              <p style={{ fontSize: '0.95rem', color: '#14532D', lineHeight: '1.6' }}>
                Workers in the field (e.g., delivery drivers, inspectors) cannot afford to stop working just because the signal is lost. Offline capability keeps your business moving.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#16A34A', marginBottom: '0.5rem' }}>2. Perceived Speed</h4>
              <p style={{ fontSize: '0.95rem', color: '#14532D', lineHeight: '1.6' }}>
                Because the app reads from the local device database first (instead of waiting for the server), it feels instant. Speed = Revenue.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BBF7D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build Robust, Offline-Capable Systems.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#22C55E', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Sync Architectures:</strong> We use advanced local databases (like WatermelonDB or Realm) to ensure your app works flawlessly offline and syncs automatically when <a href="/services?service=roi-custom-web-dev" style={{ color: '#22C55E', textDecoration: 'underline' }}>connectivity returns</a>.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#22C55E', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Optimistic UI:</strong> We implement patterns that make user actions feel instant, updating the interface immediately while handling server communication in the background.
                </span>
              </li>
            </ul>
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

        <ASOSimulator />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BFDBFE' }}>
          <CWHeading level={3} style={{ color: '#0C4A6E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#075985', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Visibility & Acquisition.</strong> A great app is useless if no one can find it. ASO is the cheapest form of user acquisition, ensuring your app ranks high in search results and converts browsers into users.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#0284C7', marginBottom: '0.5rem' }}>1. Organic Growth</h4>
              <p style={{ fontSize: '0.95rem', color: '#075985', lineHeight: '1.6' }}>
                Optimizing your app store listing means more users find you naturally, reducing reliance on expensive paid advertising campaigns.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#0284C7', marginBottom: '0.5rem' }}>2. First Impressions</h4>
              <p style={{ fontSize: '0.95rem', color: '#075985', lineHeight: '1.6' }}>
                Your app icon, screenshots, and description are your digital storefront. A compelling listing significantly boosts conversion rates from view to download.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BFDBFE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We craft App Store listings that convert.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#0EA5E9', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Keyword Research & Optimization:</strong> We identify high-volume, low-competition keywords to ensure your app appears for relevant searches.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#0EA5E9', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Compelling Visuals & Copy:</strong> From eye-catching icons to persuasive descriptions and engaging screenshots, we make your app irresistible.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <CWAlert type="error" title="Rejection Risk">
          Apple rejects "Website Wrappers". If your app doesn't use native features (Camera, Push, Offline), they will tell you to just build a website.
        </CWAlert>

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

// Interactive: Crash Analytics Dashboard
function CrashAnalyticsDashboard() {
  const [crashRate, setCrashRate] = useState(4.2); // %
  const [activeUsers, setActiveUsers] = useState(120);
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    if (fixed && crashRate > 0.1) {
      const timer = setInterval(() => {
        setCrashRate(prev => Math.max(0.1, prev - 0.2));
        setActiveUsers(prev => prev + 5);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [fixed, crashRate]);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Interactive: The "Day 1" Bug</h3>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, padding: '1rem', background: '#1E293B', borderRadius: '16px', borderLeft: fixed ? '4px solid #10B981' : '4px solid #EF4444' }}>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Crash Free Users</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: fixed ? '#10B981' : '#EF4444' }}>
            {(100 - crashRate).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>Goal: 99.9%</div>
        </div>
        <div style={{ flex: 1, padding: '1rem', background: '#1E293B', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Active Sessions</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>
            {activeUsers}
          </div>
        </div>
      </div>

      {!fixed ? (
        <div style={{ padding: '1rem', background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#FECACA' }}>⚠️ CRITICAL EXCEPTION</div>
            <div style={{ fontSize: '0.8rem', color: '#FCA5A5' }}>NullPointerException in LoginView.js:42</div>
          </div>
          <button
            onClick={() => setFixed(true)}
            style={{ padding: '0.6rem 1.2rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
          >
            Deploy Hotfix 🚀
          </button>
        </div>
      ) : (
        <div style={{ padding: '1rem', background: '#064e3b', border: '1px solid #065f46', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', color: '#A7F3D0', fontWeight: 700, animation: 'popIn 0.3s' }}>
          ✅ Hotfix Deployed via CodePush. Users recovering...
        </div>
      )}

      <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
        Without OTP updates (CodePush), you would have to wait 2 days for Apple Review while users delete your app.
      </p>
    </div>
  )
}

// Module H: Updates
export function Pillar4ModuleH({ onNext }) {
  return (
    <InteractiveLayout title="Module H: Post-Launch & Scaling" subtitle="The journey begins at launch.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Software is never "finished". Mobile operating systems obtain updates every year (iOS17, iOS18). Your app breaks if you don't maintain it.
        </p>

        <CrashAnalyticsDashboard />

        <div style={{ margin: '2rem 0' }}>
          <h4>Why Maintenance is Non-Negotiable</h4>
          <ul className="cw-ul">
            <li><strong>Security Patches:</strong> Hackers find new exploits. We close them.</li>
            <li><strong>New Devices:</strong> The new iPhone 16 has a different screen size. We adapt.</li>
            <li><strong>API Changes:</strong> Facebook changes their login API. We update.</li>
          </ul>
        </div>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)', borderRadius: '24px', border: '1px solid #FECDD3' }}>
          <CWHeading level={3} style={{ color: '#BE123C', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9F1239', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>The "Silent Killer" is Churn.</strong> If your app crashes for 5% of users, they don't complain—they just leave and never come back. Proactive maintenance is cheaper than re-acquiring lost customers.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#E11D48', marginBottom: '0.5rem' }}>1. Protecting Reputation</h4>
              <p style={{ fontSize: '0.95rem', color: '#9F1239', lineHeight: '1.6' }}>
                One bad update can lead to 1-star reviews that haunt your listing for years. Immediate hotfixes (via CodePush) save your brand.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#E11D48', marginBottom: '0.5rem' }}>2. Longevity</h4>
              <p style={{ fontSize: '0.95rem', color: '#9F1239', lineHeight: '1.6' }}>
                Apps that aren't updated for 2 years are often removed by Apple/Google automatically. Your asset depreciates to zero if neglected.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FECDD3', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We offer comprehensive Care Plans.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F43F5E', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Crash Monitoring:</strong> We install tools like Sentry to detect crashes in real-time. We usually fix them before you even know they happened.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F43F5E', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Evergreen Updates:</strong> Our <a href="/services?service=care-plans" style={{ color: '#F43F5E', textDecoration: 'underline' }}>Care Plans</a> ensure your app is constantly updated to support the latest iOS/Android versions, protecting your investment.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What happens if you don't update your app for 2 years?", options: ["Nothing", "It becomes a vintage classic", "Apple/Google might remove it"], correctIndex: 2 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Interactive: Battery Drain Visual
function BatteryDrainVisual() {
  const [level, setLevel] = useState(100);
  const [features, setFeatures] = useState({ gps: false, polling: false, render: false });
  const [draining, setDraining] = useState(false);

  useEffect(() => {
    let interval;
    if (draining && level > 0) {
      interval = setInterval(() => {
        let drain = 0.5; // Base drain
        if (features.gps) drain += 2.0;
        if (features.polling) drain += 1.5;
        if (features.render) drain += 1.0;

        setLevel(prev => Math.max(0, prev - drain));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [draining, features, level]);

  const toggleFeature = (f) => setFeatures(prev => ({ ...prev, [f]: !prev[f] }));

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>Interactive: Battery Simulator</h3>
      <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Turn on "Greedy" features and watch the battery die.</p>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        {/* Battery */}
        <div style={{ width: '100px', height: '200px', border: '8px solid #334155', borderRadius: '20px', padding: '5px', position: 'relative' }}>
          <div style={{ width: '40px', height: '10px', background: '#334155', position: 'absolute', top: '-15px', left: '25px', borderRadius: '5px 5px 0 0' }}></div>
          <div style={{
            width: '100%',
            height: `${level}%`,
            background: level > 20 ? (level > 60 ? '#10B981' : '#F59E0B') : '#EF4444',
            borderRadius: '12px',
            position: 'absolute',
            bottom: '5px',
            left: '5px',
            width: 'calc(100% - 10px)',
            transition: 'height 0.1s linear, background 0.3s'
          }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 900, fontSize: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {Math.round(level)}%
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={() => toggleFeature('gps')} style={{ padding: '0.8rem', borderRadius: '12px', border: 'none', background: features.gps ? '#EF4444' : '#1E293B', color: 'white', cursor: 'pointer', textAlign: 'left' }}>
            {features.gps ? 'High Accuracy GPS (Active) 🛰️' : 'GPS (Off) 🛰️'}
          </button>
          <button onClick={() => toggleFeature('polling')} style={{ padding: '0.8rem', borderRadius: '12px', border: 'none', background: features.polling ? '#EF4444' : '#1E293B', color: 'white', cursor: 'pointer', textAlign: 'left' }}>
            {features.polling ? 'Network Polling (Active) 📶' : 'Network Polling (Off) 📶'}
          </button>
          <button onClick={() => toggleFeature('render')} style={{ padding: '0.8rem', borderRadius: '12px', border: 'none', background: features.render ? '#F59E0B' : '#1E293B', color: 'white', cursor: 'pointer', textAlign: 'left' }}>
            {features.render ? 'Uncapped FPS (Active) 🎮' : 'Uncapped FPS (Off) 🎮'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => setDraining(!draining)} style={{ padding: '0.8rem 2rem', borderRadius: '100px', background: draining ? '#334155' : '#3B82F6', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
          {draining ? 'Pause Simulator' : 'Start Usage'}
        </button>
        <button onClick={() => setLevel(100)} style={{ padding: '0.8rem 2rem', borderRadius: '100px', background: '#10B981', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
          Recharge
        </button>
      </div>
    </div>
  )
}

// Module I: Performance
export function Pillar4ModuleI({ onNext }) {
  return (
    <InteractiveLayout title="Module I: Battery Consumption" subtitle="The silent killer.">
      <div className="cw-prose">
        <p className="cw-text-body">
          The #1 battery killer is the Network Radio. Every time you fetch data, the radio wakes up. If your app kills the user's battery, they will uninstall it to survive the day.
        </p>

        <BatteryDrainVisual />

        <div style={{ margin: '2rem 0' }}>
          <h4>Optimization Strategies</h4>
          <ul className="cw-ul">
            <li><strong>Batch Requests:</strong> Fetch everything you need at once, then let the radio sleep.</li>
            <li><strong>Lazy Loading:</strong> Don't load high-res images until the user scrolls to them.</li>
            <li><strong>Background Locations:</strong> Only track GPS when absolutely necessary.</li>
          </ul>
        </div>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FEF9C3 0%, #FEF08A 100%)', borderRadius: '24px', border: '1px solid #FDE047' }}>
          <CWHeading level={3} style={{ color: '#854D0E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#713F12', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Usage Retention.</strong> Users are smart. If their phone gets hot or the battery drains while using your app, they stop using it. Efficient apps get more screen time.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#A16207', marginBottom: '0.5rem' }}>1. Emerging Markets</h4>
              <p style={{ fontSize: '0.95rem', color: '#713F12', lineHeight: '1.6' }}>
                In Africa, many users have older phones with degraded batteries. Being "battery polite" is a competitive advantage here.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#A16207', marginBottom: '0.5rem' }}>2. Background Data Cost</h4>
              <p style={{ fontSize: '0.95rem', color: '#713F12', lineHeight: '1.6' }}>
                Inefficient polling (checking for updates constantly) not only kills battery but eats data. Saving user data builds brand loyalty.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FDE047', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We write green code.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EAB308', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Performance Audits:</strong> We use profilers to identify "energy leaks" in your app code and patch them.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EAB308', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Smart Caching:</strong> All our apps come with aggressive image and data caching to minimize network usage (and battery drain) for returning users.
                </span>
              </li>
            </ul>
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

// Interactive: Chaos Monkey Visual
function ChaosMonkeyVisual() {
  const [active, setActive] = useState(false);
  const [errorBoundary, setErrorBoundary] = useState(false);
  const [status, setStatus] = useState('Stable'); // Stable, Crashed, Recovered

  useEffect(() => {
    let interval;
    if (active && status === 'Stable') {
      interval = setInterval(() => {
        // Random chance to "crash"
        if (Math.random() > 0.7) {
          if (errorBoundary) {
            setStatus('Recovered');
            setTimeout(() => setStatus('Stable'), 1000);
          } else {
            setStatus('Crashed');
            setActive(false);
          }
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [active, status, errorBoundary]);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white', border: status === 'Crashed' ? '4px solid #EF4444' : '4px solid #334155' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>Interactive: Chaos Monkey Testing</h3>
      <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Simulate a toddler (or automated script) tapping randomly.</p>

      <div style={{ height: '150px', background: status === 'Crashed' ? '#7F1D1D' : '#1E293B', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: status === 'Crashed' ? '#FCA5A5' : (status === 'Recovered' ? '#FCD34D' : '#fff'), transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
        {status === 'Stable' && "App Running Smoothly 🟢"}
        {status === 'Crashed' && "CRITICAL SYSTEM FAILURE 💥"}
        {status === 'Recovered' && "Error Caught! Recovering... 🛡️"}

        {active && status !== 'Crashed' && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '3rem', animation: 'shake 0.5s infinite' }}>🐒</div>
        )}
        <style>{`@keyframes shake { 0% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } 100% { transform: rotate(0deg); } }`}</style>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={() => { setStatus('Stable'); setActive(!active); }}
          style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: active ? '#EF4444' : '#3B82F6', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
        >
          {active ? 'Stop Monkey' : 'Unleash Monkey'}
        </button>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: '#334155', padding: '0.8rem 1rem', borderRadius: '12px' }}>
          <input type="checkbox" checked={errorBoundary} onChange={e => setErrorBoundary(e.target.checked)} />
          <span>Enable Error Boundaries</span>
        </label>

        {status === 'Crashed' && (
          <button onClick={() => setStatus('Stable')} style={{ padding: '0.8rem', color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Restart App
          </button>
        )}
      </div>
    </div>
  )
}

// Module J: Testing
export function Pillar4ModuleJ({ onNext }) {
  return (
    <InteractiveLayout title="Module J: Chaos Engineering" subtitle="Beyond 'It works on my machine'.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Real users do crazy things. They tap buttons with wet fingers. They lose signal in an elevator. They double-tap "Payment" buttons. If you don't test for chaos, your users will find the bugs for you.
        </p>

        <h3>Monkey Testing</h3>
        <p>This is a technique where an automated script taps random spots on the screen 100 times a second to try and crash your app.</p>

        <ChaosMonkeyVisual />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)', borderRadius: '24px', border: '1px solid #D8B4FE' }}>
          <CWHeading level={3} style={{ color: '#7E22CE', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#6B21A8', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Risk Mitigation.</strong> A crash during a payment flow or critical data entry can cost you a customer permanently. Automated testing ensures that critical paths work 100% of the time, regardless of user behavior.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#9333EA', marginBottom: '0.5rem' }}>1. Scalability</h4>
              <p style={{ fontSize: '0.95rem', color: '#6B21A8', lineHeight: '1.6' }}>
                You cannot manually test every single screen on 50 different devices every time you update. Automated testing scales with your app complexity.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#9333EA', marginBottom: '0.5rem' }}>2. Speed to Release</h4>
              <p style={{ fontSize: '0.95rem', color: '#6B21A8', lineHeight: '1.6' }}>
                With a solid test suite, you can release updates on Friday afternoon with confidence, knowing the core features are bulletproof.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #D8B4FE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              Quality Assurance is built-in.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#A855F7', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Automated E2E Tests:</strong> We write software robots that open your app, log in, browse products, and checkout—running every night to ensure nothing broke while we slept.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#A855F7', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Device Farms:</strong> We test your app on real devices (Samsung, Huawei, iPhone) in the cloud to catch device-specific bugs before your users do.
                </span>
              </li>
            </ul>
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

// Interactive: LTV vs CAC Calculator
function LTVCalculator() {
  const [cac, setCac] = useState(50); // Cost to Acquire
  const [ltv, setLtv] = useState(150); // Lifetime Value

  const profitability = ltv - cac;
  const roi = ((profitability / cac) * 100).toFixed(0);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>Interactive: The Unit Economics Engine</h3>
      <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>If your CAC is higher than your LTV, your business is a "leaky bucket".</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
              CAC (Acquisition Cost): R{cac}
            </label>
            <input
              type="range" min="10" max="500" step="10" value={cac}
              onChange={e => setCac(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#3B82F6' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
              LTV (Lifetime Value): R{ltv}
            </label>
            <input
              type="range" min="10" max="1000" step="10" value={ltv}
              onChange={e => setLtv(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981' }}
            />
          </div>
        </div>

        {/* Output */}
        <div style={{ padding: '1.5rem', background: profitability > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: `2px solid ${profitability > 0 ? '#10B981' : '#EF4444'}`, textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Profit Per User</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: profitability > 0 ? '#10B981' : '#EF4444' }}>
            R{profitability}
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>
            {profitability > 0 ? `🚀 ${roi}% ROI` : '⚠️ Losing Money'}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.9rem', color: '#64748B', textAlign: 'center' }}>
        *Scaling a business with negative unit economics only makes you go bankrupt faster.
      </p>
    </div>
  )
}

// Module K: Monetization
export function Pillar4ModuleK({ onNext }) {
  return (
    <InteractiveLayout title="Module K: Freemium Economics" subtitle="Hunting Whales.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Most apps fail not because of bad code, but because of bad math. You must understand your unit economics before you start spending on marketing.
        </p>

        <BookInsight title="The Power Law" author="Eric Seufert" book="Freemium Economics" color="#8B5CF6">
          <p>"In Free-to-Play games, 95% of users pay nothing. The business is supported by 'Whales'—users who love the product so much they spend thousands."</p>
        </BookInsight>

        <LTVCalculator />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', borderRadius: '24px', border: '1px solid #DDD6FE' }}>
          <CWHeading level={3} style={{ color: '#5B21B6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#4C1D95', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Sustainable Growth.</strong> Knowing your LTV (Lifetime Value) allows you to outbid your competitors for customers. If you know a user is worth R300, you can safely spend R100 to acquire them.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#7C3AED', marginBottom: '0.5rem' }}>1. Investor Readiness</h4>
              <p style={{ fontSize: '0.95rem', color: '#4C1D95', lineHeight: '1.6' }}>
                Investors don't just look at user numbers; they look at cohorts and churn. Understanding monetization mechanics makes your business "Investable".
              </p>
            </div>
            <div>
              <h4 style={{ color: '#7C3AED', marginBottom: '0.5rem' }}>2. Pricing Power</h4>
              <p style={{ fontSize: '0.95rem', color: '#4C1D95', lineHeight: '1.6' }}>
                Whether you use subscriptions, ads, or in-app purchases, your monetization strategy dictates your product design.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #DDD6FE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build revenue engines.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#8B5CF6', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Payment Integration:</strong> We integrate reliable gateways (PayStack, Stripe, Apple In-App Purchases) to ensure a <a href="/services?service=roi-custom-web-dev" style={{ color: '#8B5CF6', textDecoration: 'underline' }}>frictionless checkout</a>.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#8B5CF6', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Growth Analytics:</strong> We set up dashboards that track your real CAC and LTV in real-time, so you can make data-driven decisions on where to spend your marketing budget.
                </span>
              </li>
            </ul>
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
          <CWHeading level={3}>Pillar 4 Complete!</CWHeading>
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
