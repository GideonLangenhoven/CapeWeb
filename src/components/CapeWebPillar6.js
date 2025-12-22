import React, { useState, useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';
import { InteractiveLayout, QuizLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, BookInsight } from './CapeWebUI';

// ==========================================
// PILLAR 6 QUIZ DATA
// ==========================================
export const pillar6QuizQuestions = [
  {
    question: 'You spend R1,000 on Facebook Ads. You generate R5,000 in revenue. What is your ROAS (Return On Ad Spend)?',
    options: ['50%', '5.0 (5X)', 'R4,000'],
    correctIndex: 1,
  },
  {
    question: 'You are an emergency plumber. People only hire you when they have a crisis. Where should you spend your ad budget?',
    options: ['Facebook (Interruption)', 'TikTok (Viral)', 'Google Search (Intent)'],
    correctIndex: 2,
  },
  {
    question: 'A user looks at a pair of sneakers on your site but leaves without buying. The next day, they see those EXACT sneakers in an Instagram Story. What strategy is this?',
    options: ['Dynamic Retargeting', 'Magic', 'Cold Outreach'],
    correctIndex: 0,
  },
  {
    question: 'It costs you R500 to acquire a customer (CAC). They only buy R300 worth of soap today. But they subscribe and spend R3,600 over the next year (LTV). Should you stop the ads?',
    options: ['Yes, you lost R200 today', 'No, because LTV (R3,600) is much higher than CAC (R500)', 'Yes, ads are a scam'],
    correctIndex: 1,
  },
  {
    question: 'Your video ad starts with a loud "Stop!" and a shocking image. In the AIDA model, what purpose does this serve?',
    options: ['Desire', 'Attention (The "Pattern Interrupt")', 'Action'],
    correctIndex: 1,
  },
  {
    question: 'Facebook bans your Ad Account. You lose access to your 50k followers. But your business survives because you have a list of buyer emails. What asset saved you?',
    options: ['Owned Media (Your Email List)', 'Rented Media', 'Earned Media'],
    correctIndex: 0,
  },
  {
    question: '1,000 people see your video. Only 50 watch past the first 3 seconds (5% Hook Rate). The industry average is 25%. What must you fix?',
    options: ['The offer at the end', 'The first 3 seconds (The Scroll Stopper)', 'The targeting'],
    correctIndex: 1,
  },
  {
    question: 'Competitor A sells "Gym Membership". Competitor B sells "Lose 5kg in 30 days or we pay you R1,000". Why does B convert better?',
    options: ['It is a "Grand Slam Offer" with a performance guarantee', 'It is cheaper', 'They have a better logo'],
    correctIndex: 0,
  },
  {
    question: 'You want Facebook to find people who actually BUY, not just click. What piece of code must fire on your "Thank You" page?',
    options: ['The Facebook Pixel / Conversion API Purchase Event', 'A JPEG image', 'Google Analytics'],
    correctIndex: 0,
  },
  {
    question: 'You sell R100k solar systems. No one buys from a generic ad. You decide to offer a "Free Power Audit Checklist" PDF first to get their email. What is the PDF?',
    options: ['A Lead Magnet', 'A Product', 'A Bribe'],
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

function TrafficThermometer() {
  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
      background: '#22D3EE',
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

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)' }}>❄️</div>
          <div>
            <strong style={{ color: '#1E293B' }}>Cold Traffic</strong>
            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Strangers. Don't sell. Educate.</div>
          </div>
        </div>
        <div style={{ width: '2px', height: '20px', background: '#CBD5E1', marginLeft: '19px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', boxShadow: '0 4px 6px rgba(245, 158, 11, 0.3)' }}>☀️</div>
          <div>
            <strong style={{ color: '#1E293B' }}>Warm Traffic</strong>
            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Acquaintances. Show Reviews.</div>
          </div>
        </div>
        <div style={{ width: '2px', height: '20px', background: '#CBD5E1', marginLeft: '19px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)' }}>🔥</div>
          <div>
            <strong style={{ color: '#1E293B' }}>Hot Traffic</strong>
            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Fans. Sell Now.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ROASCalculator() {
  const [spend, setSpend] = useState(100);
  const [rev, setRev] = useState(500);
  const roas = (rev / spend).toFixed(1);

  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
      background: '#F472B6',
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
        <h4 style={{ marginBottom: '1.5rem', color: '#0f172a', fontWeight: 800 }}>ROAS Simulator</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '0.5rem' }}>Ad Spend (R)</label>
            <input type="number" value={spend} onChange={(e) => setSpend(e.target.value)} style={{ background: 'white', border: '1px solid #CBD5E1', color: '#1E293B', padding: '0.75rem', borderRadius: '12px', width: '100px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '0.5rem' }}>Revenue (R)</label>
            <input type="number" value={rev} onChange={(e) => setRev(e.target.value)} style={{ background: 'white', border: '1px solid #CBD5E1', color: '#1E293B', padding: '0.75rem', borderRadius: '12px', width: '100px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
          </div>
        </div>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: roas > 3 ? '#10B981' : '#EF4444', textShadow: '0 2px 10px rgba(0,0,0,0.1)', transition: 'color 0.3s' }}>
          {roas}x
        </div>
        <p style={{ fontSize: '1rem', color: roas > 3 ? '#065F46' : '#991B1B', fontWeight: 600, marginTop: '0.5rem' }}>
          {roas > 3 ? 'Profitable! Scale it up! 🚀' : 'Losing money. Kill the ad. ⚠️'}
        </p>
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
      background: '#FB923C',
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

// ==========================================
// PILLAR 6 MODULES A-I
// ==========================================

// Module A: Traffic Temperature
export function Pillar6ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: Traffic Temperature" subtitle="Don't propose on the first date.">
      <div className="cw-prose">
        <p className="cw-text-body">
          You cannot speak to a stranger the same way you speak to a loyal customer. In marketing, we classify audiences by "temperature".
        </p>

        <TrafficThermometer />

        <BookInsight title="Traffic Secrets" author="Russell Brunson" book="Traffic Secrets" color="#3B82F6">
          <p>"If you ask a stranger to marry you (Buy Now), they will say no. You must first ask for a coffee (Lead Magnet)."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Social Media is your 24/7 PR department. It is where your brand personality lives. If you are silent, people assume you are closed.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. Social Proof</h4>
              <p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>
                If a customer sees 500 happy comments, they buy. If they see a ghost town with a last post from 2021, they leave.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. Top of Mind</h4>
              <p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>
                You want to be the brand they think of *before* they need you. Regular content keeps you in their feed and in their head.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build your social engine.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EC4899', marginTop: '2px' }}>➜</span>
                <span><strong>Integrated Feeds:</strong> We stream your social proof directly onto your website to boost conversion.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EC4899', marginTop: '2px' }}>➜</span>
                <span><strong>Content Systems:</strong> We help you set up calendars so you post consistently without burnout.</span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the goal for 'Cold Traffic'?", options: ["Ask for a marriage proposal", "Awareness and Education (Break the ice)", "Sell the most expensive product immediately"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module B: Intent (Google)
export function Pillar6ModuleB({ onNext }) {
  return (
    <InteractiveLayout title="Module B: Intent Marketing" subtitle="Capturing the hand-raisers.">
      <div className="cw-prose">
        <p className="cw-text-body">
          <strong>Google Ads</strong> is "Intent-Based". When someone types "Best Plumber Cape Town", they have a problem <em>right now</em>. They are "Hand Raisers".
        </p>

        <ScenarioToggle
          oldTitle="The Billboard (Hope)"
          oldContent="You pay R50,000 to show your plumbing ad to 100,000 driving people. Only 2 of them have a leak. Wasted money."
          newTitle="Google Search (Precision)"
          newContent="You pay R20 to show your ad to 1 person who JUST searched 'Plumber Help'. High conversion."
        />

        <MiniQuiz
          questions={[
            { question: "Why is Google Ads considered 'Intent Based'?", options: ["Because Google knows your location", "Because the user actively searches for a solution to a problem", "Because it is expensive"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module C: Interruption (Social)
export function Pillar6ModuleC({ onNext }) {
  return (
    <InteractiveLayout title="Module C: Interruption Marketing" subtitle="Stopping the scroll.">
      <div className="cw-prose">
        <p className="cw-text-body">
          <strong>Social Media (Meta/TikTok)</strong> is "Interruption-Based".
          Users are there to see cat videos, not your ad. You must "Stop the Scroll".
        </p>

        <ScenarioToggle
          oldTitle="Boring Ad 😴"
          oldContent="A photo of your logo with 'We sell shoes'."
          newTitle="Pattern Interrupt 💥"
          newContent="A video of someone cutting a shoe in half with a chainsaw. User stops scrolling."
        />

        <MiniQuiz
          questions={[
            { question: "On Social Media, what must you do first?", options: ["Sell the product", "Stop the scroll (Interrupt the user)", "Show your logo"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module D: Copywriting
export function Pillar6ModuleD({ onNext }) {
  return (
    <InteractiveLayout title="Module D: StoryBrand Framework" subtitle="You are not the hero.">
      <div className="cw-prose">
        <div className='cw-text-body'>
          Most businesses fail because they talk about themselves. "We were founded in 1999." Nobody cares.
        </div>

        <ScenarioToggle
          oldTitle="The Company Hero"
          oldContent="'WE are the best. WE have awards. WE are great.' (Customer tunes out)."
          newTitle="The Customer Hero"
          newContent="'YOU can achieve financial freedom. WE just help you get there.' (Customer listens)."
        />

        <BookInsight title="The Guide" author="Donald Miller" book="Building a StoryBrand" color="#F59E0B">
          <p>"The Customer is the Hero. You are the Guide (Yoda). Your Product is the Lightsaber."</p>
        </BookInsight>

        <MiniQuiz
          questions={[
            { question: "Who should be the Hero of your marketing story?", options: ["The CEO", "The Product", "The Customer"], correctIndex: 2 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module E: The Offer
export function Pillar6ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: The Grand Slam Offer" subtitle="Make it stupid to say no.">
      <div className="cw-prose">
        <p>If your marketing works but nobody buys, your <strong>Offer</strong> is weak. Compete on Value, not Price.</p>

        <BookInsight title="Value Equation" author="Alex Hormozi" book="$100M Offers" color="#10B981">
          <p><strong>Value = (Dream Outcome x Likelihood) / (Time Delay x Effort)</strong></p>
          <p>To increase value, decrease the Time Delay and Effort. (e.g. "Lose 10kg in 1 week without exercise" &gt; "Lose 10kg in 1 year with hard work").</p>
        </BookInsight>

        <MiniQuiz
          questions={[
            { question: "How do you increase the value of an offer?", options: ["Lower the price", "Decrease the Time Delay and Effort required for the result", "Add more buttons"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module F: Email
export function Pillar6ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: Owned Media" subtitle="The money is in the list.">
      <div className="cw-prose">
        <p>
          Social Media is "Rented Land". If the algorithm changes, you lose.
          <strong>Email</strong> is "Owned Land".
        </p>

        <CWCard>
          <h4>The Lead Magnet</h4>
          <p>Don't say "Join Newsletter". Say "Download Free Checklist". Give value first.</p>
        </CWCard>

        <MiniQuiz
          questions={[
            { question: "Why is an Email List valuable?", options: ["It is free", "It is 'Owned Media' (Platform independent)", "It is easy to spam"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module G: Retargeting
export function Pillar6ModuleG({ onNext }) {
  return (
    <InteractiveLayout title="Module G: Retargeting" subtitle="The rule of 7.">
      <div className="cw-prose">
        <p>97% of people leave without buying. You must remind them.</p>

        <CWAlert type="warning" title="Scenario: The Abandoned Cart">
          User adds shoes &rarr; Gets distracted &rarr; Leaves.
          <br /><strong>Retargeting Ad (1 hour later):</strong> "Hey, you forgot your shoes! Here is a 5% discount code."
          <br /><strong>Result:</strong> Conversion.
        </CWAlert>

        <MiniQuiz
          questions={[
            { question: "What is the main purpose of Retargeting?", options: ["To find new customers", "To bring back users who visited but didn't buy", "To increase likes"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module H: Analytics
export function Pillar6ModuleH({ onNext }) {
  return (
    <InteractiveLayout title="Module H: ROAS & CAC" subtitle="The math of marketing.">
      <div className="cw-prose">
        <p>Marketing is not art. It is math. If you spend R1 and get R2 back, you keep spending.</p>

        <ROASCalculator />

        <MiniQuiz
          questions={[
            { question: "If you spend R100 to make R500, what is your ROAS?", options: ["5.0", "1.0", "500"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module I: Content
export function Pillar6ModuleI({ onNext }) {
  return (
    <InteractiveLayout title="Module I: Content Marketing" subtitle="Giving before asking.">
      <div className="cw-prose">
        <p>Gary Vaynerchuk's philosophy: "Jab, Jab, Jab, Right Hook". Give value 3 times before you ask for a sale.</p>

        <MiniQuiz
          questions={[
            { question: "What does 'Jab, Jab, Jab, Right Hook' mean?", options: ["Boxing tips", "Give value multiple times before asking for a sale", "Post 3 times a day"], correctIndex: 1 }
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
export function Pillar6Resources({ onNext }) {
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
    <InteractiveLayout title="Module J: Resources" subtitle="Marketing Toolkit">
      <div className="cw-prose">
        <p>Marketing is about testing. These resources will help you test faster. Use the right tool for the right job.</p>

        <h3 style={{ marginTop: '2rem' }}>🛠️ The Toolbelt</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Ads"
            title="Meta Ads Manager"
            description="The cockpit for Facebook & Instagram ads. Where the money is made."
            link="https://adsmanager.facebook.com/"
          />
          <ResourceCard
            category="Analytics"
            title="Google Analytics 4"
            description="Measure every click. If you can't measure it, you can't improve it."
            link="https://analytics.google.com/"
          />
          <ResourceCard
            category="Creative"
            title="Canva"
            description="Create stunning ads without a design degree. Essential for speed."
            link="https://www.canva.com/"
          />
          <ResourceCard
            category="Owned Media"
            title="ConvertKit"
            description="The creator marketing platform. Build your email list here."
            link="https://convertkit.com/"
          />
          <ResourceCard
            category="Scheduling"
            title="Buffer"
            description="Plan your social media calendar in advance so you aren't glued to your phone."
            link="https://buffer.com/"
          />
        </div>

        <h3 style={{ marginTop: '3rem' }}>📚 Recommended Reading</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Funnel Strategy"
            title="Traffic Secrets"
            description="By Russell Brunson. The evergreen strategies to fill your funnel with your dream customers."
            link="https://www.russellbrunson.com/traffic-secrets-book"
          />
          <ResourceCard
            category="Messaging"
            title="Building a StoryBrand"
            description="By Donald Miller. Clarify your message. If you confuse, you lose."
            link="https://storybrand.com/"
          />
          <ResourceCard
            category="Psychology"
            title="$100M Offers"
            description="By Alex Hormozi. How to make offers so good people feel stupid saying no."
            link="https://acquisition.com/books"
          />
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <h4>Ready to Launch?</h4>
          <p style={{ marginBottom: '1.5rem', color: '#64748B' }}>You have the tools. Now prove you can use them.</p>
          <CWButton onClick={onNext} variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Take Final Exam 🏁</CWButton>
        </div>
      </div>
    </InteractiveLayout>
  );
}

// ==========================================
// FINAL QUIZ COMPONENT
// ==========================================

export function Pillar6Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  // Local state handling if props missing
  const [localResponses, setLocalResponses] = useState({});
  const activeResponses = quizResponses || localResponses;
  const activeSetResponse = onSelect || ((qMvc, optIdx) => setLocalResponses(prev => ({ ...prev, [qMvc]: optIdx })));

  const questions = pillar6QuizQuestions;
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
          <CWHeading level={3}>Marketing Master</CWHeading>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{scoreMessage}</p>
          <CWButton onClick={onFinish}>Continue to Certificate →</CWButton>
        </div>
      </CWCard>
    );
  }

  return (
    <QuizLayout title="Final Exam: Digital Marketing" currentStep={currentQuestionIndex + 1} totalSteps={questions.length}>
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

export function Pillar6Completion() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>🎓</h1>
      <CWHeading level={2}>Marketing Master</CWHeading>
      <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '1rem auto' }}>
        You now understand that a great product is not enough. You have the tools to tell the story, attract the traffic, and convert the sale.
      </p>
    </div>
  );
}
