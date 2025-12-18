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
    question: 'In Russell Brunson\'s "Traffic Secrets", what are the three types of traffic?',
    options: ['Fast, Slow, Medium', 'Traffic you earn, Traffic you control, Traffic you own', 'Google, Facebook, TikTok'],
    correctIndex: 1,
  },
  {
    question: 'What is the fundamental difference between Google Ads and Facebook Ads?',
    options: ['Google is blue, Facebook is blue', 'Google is Intent-based (Searching), Facebook is Interruption-based (Browsing)', 'Facebook is for old people'],
    correctIndex: 1,
  },
  {
    question: 'According to Donald Miller\'s "StoryBrand", who is the Hero of the story?',
    options: ['Your Brand', 'The Customer', 'The Product'],
    correctIndex: 1,
  },
  {
    question: 'What does ROAS stand for?',
    options: ['Return On Ad Spend', 'Rate Of Active Sessions', 'Reach Of All Socials'],
    correctIndex: 0,
  },
  {
    question: 'In "$100M Offers" by Alex Hormozi, what defines a "Grand Slam Offer"?',
    options: ['Low price', 'High Value, Low Effort/Time, High Likelihood of Achievement', 'Free shipping'],
    correctIndex: 1,
  },
  {
    question: 'Why is Email Marketing considered "Owned Media"?',
    options: ['Because you pay for it', 'Because no algorithm change (FB/Google) can take your list away from you', 'Because it is old'],
    correctIndex: 1,
  },
  {
    question: 'What is the purpose of "Retargeting"?',
    options: ['To annoy people', 'To show ads to people who have already visited your site but didn\'t buy', 'To target new people'],
    correctIndex: 1,
  },
  {
    question: 'What is a "Lead Magnet"?',
    options: ['A physical magnet', 'Free value (checklist/ebook) given in exchange for an email address', 'A sales call'],
    correctIndex: 1,
  },
  {
    question: 'In copywriting, what does AIDA stand for?',
    options: ['Artificial Intelligence Data Analysis', 'Attention, Interest, Desire, Action', 'Always In Da Action'],
    correctIndex: 1,
  },
  {
    question: 'What is "CAC"?',
    options: ['Customer Acquisition Cost', 'Clicks And Conversions', 'Customer Account Center'],
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

function TrafficThermometer() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '2rem 0', background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>❄️</div>
        <div>
          <strong>Cold Traffic</strong>
          <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Strangers. Don't sell. Educate.</div>
        </div>
      </div>
      <div style={{ width: '2px', height: '20px', background: '#E2E8F0', marginLeft: '19px' }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>☀️</div>
        <div>
          <strong>Warm Traffic</strong>
          <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Acquaintances. Show Reviews.</div>
        </div>
      </div>
      <div style={{ width: '2px', height: '20px', background: '#E2E8F0', marginLeft: '19px' }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>🔥</div>
        <div>
          <strong>Hot Traffic</strong>
          <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Fans. Sell Now.</div>
        </div>
      </div>
    </div>
  )
}

// Interactive: Lead Magnet Funnel
function LeadMagnetFunnel() {
  const [stage, setStage] = useState(0); // 0: Ad, 1: Opt-in, 2: Value, 3: Sale
  const stages = [
    { title: "The Hook (Ad)", text: "Stop the scroll with a curious question.", icon: "🪝", color: "#3B82F6" },
    { title: "The bribe (Opt-in)", text: "Give away a R500 value checklist for free.", icon: "🎁", color: "#F59E0B" },
    { title: "The Indoctrination", text: "Deliver value and prove you can help.", icon: "🧠", color: "#10B981" },
    { title: "The Transaction", text: "Now ask for the sale. Trust is high.", icon: "💰", color: "#EF4444" }
  ];

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Interactive: The Trust Funnel</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
        {stages.map((s, idx) => (
          <div
            key={idx}
            onClick={() => setStage(idx)}
            style={{
              padding: '1.25rem',
              background: stage === idx ? s.color : '#1E293B',
              borderRadius: '16px',
              cursor: 'pointer',
              opacity: stage >= idx ? 1 : 0.4,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: stage === idx ? 'scale(1.02)' : 'scale(1)',
              border: `2px solid ${stage === idx ? 'white' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              zIndex: 1
            }}
          >
            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{s.title}</div>
              {stage === idx && <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', opacity: 0.9 }}>{s.text}</p>}
            </div>
            {stage > idx && <div style={{ fontSize: '1.5rem' }}>✅</div>}
          </div>
        ))}

        {/* Vertical Progress Line */}
        <div style={{
          position: 'absolute',
          left: '35px',
          top: '20px',
          bottom: '20px',
          width: '4px',
          background: '#1E293B',
          zIndex: 0
        }}>
          <div style={{
            height: `${(stage / (stages.length - 1)) * 100}%`,
            width: '100%',
            background: '#F59E0B',
            transition: 'height 0.4s ease'
          }}></div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => setStage(prev => (prev + 1) % stages.length)}
          style={{ padding: '0.8rem 2rem', borderRadius: '100px', background: 'white', color: '#0F172A', border: 'none', fontWeight: 800, cursor: 'pointer' }}
        >
          {stage === 3 ? "Restart Funnel" : "Next Step"}
        </button>
      </div>
    </div>
  );
}

// Interactive: Google Ads Auction
function GoogleAdsAuction() {
  const [bids, setBids] = useState([
    { name: "Giant Bank", bid: 150, quality: 2, score: 300, color: "#EF4444" },
    { name: "You (CapeWeb)", bid: 50, quality: 9, score: 450, color: "#10B981" },
    { name: "Cowboy Plumber", bid: 80, quality: 4, score: 320, color: "#F59E0B" }
  ]);

  const updateBid = (idx, newBid) => {
    const nextBids = [...bids];
    nextBids[idx].bid = parseInt(newBid) || 0;
    nextBids[idx].score = nextBids[idx].bid * nextBids[idx].quality;
    setBids(nextBids.sort((a, b) => b.score - a.score));
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', color: '#0F172A' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>Interactive: The Ad Auction</h3>
      <p style={{ color: '#64748B', marginBottom: '2rem', fontSize: '0.9rem' }}>It's not just who pays the most; it's who provides the best <strong>intent match</strong>.</p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {bids.map((b, idx) => (
          <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'white', borderRadius: '16px', border: `2px solid ${idx === 0 ? '#10B981' : '#E2E8F0'}`, transition: 'all 0.5s ease', transform: idx === 0 ? 'scale(1.02)' : 'scale(1)' }}>
            <div style={{ fontSize: '1.5rem', width: '40px' }}>{idx === 0 ? '🏆' : idx + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>{b.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Intent Match (Quality): {b.quality}/10</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Bid (R)</span>
              <input
                type="number"
                value={b.bid}
                onChange={e => updateBid(idx, e.target.value)}
                style={{ display: 'block', width: '60px', padding: '0.25rem', border: '1px solid #CBD5E1', borderRadius: '4px', textAlign: 'center' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#ECFDF5', borderRadius: '12px', border: '1px solid #A7F3D0', fontSize: '0.9rem', color: '#065F46' }}>
        <strong>Lesson:</strong> Because your site has high Quality (Intent), you beat the Giant Bank even though you bid 3x less!
      </div>
    </div>
  );
}

// Interactive: Scroll Interrupt Simulator
function ScrollInterruptSimulator() {
  const [interrupted, setInterrupted] = useState(false);
  const [score, setScore] = useState(0);

  const posts = [
    { type: 'organic', text: "Just had the best coffee! ☕", author: "Sarah" },
    { type: 'ad', text: "Buy our shoes now. We are the best.", author: "Boring Brand", hook: false },
    { type: 'organic', text: "Look at my cat 🐈", author: "Dave" },
    { type: 'ad', text: "I CUT A TESLA IN HALF WITH A CHAINSAW!", author: "CapeWeb Hero", hook: true }
  ];

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Interactive: The Scroll War</h3>

      <div style={{ height: '300px', overflowY: 'scroll', background: '#1E293B', borderRadius: '16px', padding: '1rem', border: '4px solid #334155', position: 'relative' }}>
        {posts.map((p, idx) => (
          <div key={idx} style={{ padding: '1.5rem', background: p.type === 'ad' ? 'rgba(59, 130, 246, 0.1)' : '#0F172A', borderRadius: '12px', marginBottom: '1rem', border: p.type === 'ad' ? '1px solid #3B82F6' : '1px solid #334155', textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#3B82F6', marginBottom: '0.5rem' }}>@{p.author} {p.type === 'ad' && '• Sponsored'}</div>
            <div style={{ fontSize: '1rem', fontWeight: p.hook ? 900 : 400, color: p.hook ? '#F59E0B' : 'white' }}>{p.text}</div>
            {p.type === 'ad' && (
              <button
                onClick={() => { if (p.hook) setScore(s => s + 1); setInterrupted(true); setTimeout(() => setInterrupted(false), 2000); }}
                style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '8px', background: p.hook ? '#F59E0B' : '#334155', border: 'none', color: 'white', fontWeight: 800, cursor: 'pointer' }}
              >
                {p.hook ? "WAIT, WHAT?! (Click)" : "Scroll Past"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Customers Captured: {score}</div>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Boring ads get scrolled past. High-intensity hooks capture the mind.</p>
      </div>
    </div>
  );
}

// Interactive: StoryBrand Headline Tester
function StoryBrandHeadlineTester() {
  const [selected, setSelected] = useState(null);
  const options = [
    {
      id: 1,
      type: "hero",
      text: "We have over 20 years of experience in solar installation and 50 awards.",
      feedback: "❌ The 'Company-as-Hero' trap. The customer doesn't care about your awards; they care about their problem."
    },
    {
      id: 2,
      type: "guide",
      text: "Never pay for electricity again. We help you gain energy independence.",
      feedback: "✅ The 'Customer-as-Hero' winner! You've identified the dream outcome and positioned yourself as the guide."
    }
  ];

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Interactive: The Hero Filter</h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt)}
            style={{
              padding: '1.5rem',
              background: selected?.id === opt.id ? (opt.type === 'guide' ? '#10B981' : '#EF4444') : '#1E293B',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{opt.text}</div>
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', animation: 'fadeIn 0.3s' }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>{selected.feedback}</p>
        </div>
      )}
    </div>
  );
}

// Interactive: Offer Value Calculator
function OfferValueCalculator() {
  const [dream, setDream] = useState(5);
  const [likelihood, setLikelihood] = useState(5);
  const [time, setTime] = useState(5);
  const [effort, setEffort] = useState(5);

  const value = ((dream * likelihood) / (time * effort)).toFixed(1);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', color: '#0F172A' }}>
      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>The $100M Offer Engine</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '1rem' }}>TOP: THE MULTIPLIERS</label>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span>Dream Outcome</span><span>{dream}/10</span></div>
              <input type="range" min="1" max="10" value={dream} onChange={(e) => setDream(e.target.value)} style={{ width: '100%', accentColor: '#10B981' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span>Likelihood of Success</span><span>{likelihood}/10</span></div>
              <input type="range" min="1" max="10" value={likelihood} onChange={(e) => setLikelihood(e.target.value)} style={{ width: '100%', accentColor: '#10B981' }} />
            </div>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '1rem' }}>BOTTOM: THE DIVIDERS</label>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span>Time Delay</span><span>{time}/10</span></div>
              <input type="range" min="1" max="10" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: '100%', accentColor: '#EF4444' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span>Effort & Sacrifice</span><span>{effort}/10</span></div>
              <input type="range" min="1" max="10" value={effort} onChange={(e) => setEffort(e.target.value)} style={{ width: '100%', accentColor: '#EF4444' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '16px', border: '2px dashed #E2E8F0' }}>
        <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Calculated Offer Value</div>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: value > 1 ? '#10B981' : '#EF4444' }}>{value}</div>
        <p style={{ margin: '1rem 0 0', color: '#64748B' }}>{value > 2 ? "This is a Grand Slam Offer! 🚀" : "Low value. Decrease effort or time delay. ⚠️"}</p>
      </div>
    </div>
  );
}

// Interactive: Algo Survival Sim
function AlgoSurvivalSim() {
  const [view, setView] = useState('normal');

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Interactive: The "Algorithm Wipeout"</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.5rem' }}>SOCIAL REACH</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: view === 'crisis' ? '#EF4444' : '#3B82F6', transition: 'all 0.4s' }}>
            {view === 'crisis' ? '0.2%' : '8%'}
          </div>
        </div>
        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.5rem' }}>EMAIL OPEN RATE</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>
            28%
          </div>
        </div>
      </div>

      <button
        onClick={() => setView(view === 'normal' ? 'crisis' : 'normal')}
        style={{ width: '100%', padding: '1rem', borderRadius: '100px', background: view === 'normal' ? '#EF4444' : '#3B82F6', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}
      >
        {view === 'normal' ? '🔥 TRIGGER ALGORITHM UPDATE' : 'RECOVER SYSTEMS'}
      </button>

      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#94A3B8', textAlign: 'center' }}>
        {view === 'crisis'
          ? "The 'Rented' platform turned off the tap. But your 'Owned' email list is still paying the bills."
          : "Systems functioning on borrowed time. Build your list before the next wipeout."}
      </p>
    </div>
  );
}

// Interactive: Retargeting Journey
function RetargetingJourney() {
  const [step, setStep] = useState(0);
  const journey = [
    { platform: "Google Search", icon: "🔍", text: "User searches for 'Blue Sneakers' and visits your site.", action: "Visitor Pixel Tracked" },
    { platform: "Facebook Feed", icon: "📱", text: "User sees your sneakers while looking at cat photos.", action: "Recall Triggered" },
    { platform: "YouTube Pre-roll", icon: "🎥", text: "User sees a video of your sneakers being tested for comfort.", action: "Desire Built" },
    { platform: "Google Display", icon: "💻", text: "User sees a banner with a 10% discount code.", action: "CONVERSION!" }
  ];

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>The Omnipresence Journey</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {journey.map((j, idx) => (
          <div
            key={idx}
            onClick={() => setStep(idx)}
            style={{
              padding: '1.5rem',
              background: step >= idx ? '#1E293B' : 'rgba(255,255,255,0.05)',
              borderRadius: '20px',
              border: `2px solid ${step === idx ? '#3B82F6' : 'transparent'}`,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              opacity: step >= idx ? 1 : 0.3
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{j.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#3B82F6', marginBottom: '0.5rem' }}>{j.platform}</div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', height: '60px' }}>{j.text}</p>
            {step === idx && <div style={{ marginTop: '1rem', padding: '0.4rem', background: '#10B981', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>{j.action}</div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={() => setStep((step + 1) % journey.length)} style={{ padding: '0.8rem 2rem', borderRadius: '100px', background: '#3B82F6', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
          {step === 3 ? "Start New Visitor" : "Follow Visitor"}
        </button>
      </div>
    </div>
  );
}

// Interactive: Value Meter (Jab Jab Jab Right Hook)
function ValueMeter() {
  const [jabs, setJabs] = useState(0);
  const [sold, setSold] = useState(false);

  const handleAction = (type) => {
    if (type === 'jab') {
      setJabs(prev => Math.min(3, prev + 1));
      setSold(false);
    } else {
      if (jabs === 3) setSold(true);
      setJabs(0);
    }
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#0F172A' }}>Interactive: The Value Bank</h3>
      <p style={{ color: '#64748B', marginBottom: '2rem' }}>You must deposit value before you can withdraw a sale.</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ width: '60px', height: '60px', borderRadius: '50%', background: jabs >= i ? '#10B981' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', transition: 'all 0.3s' }}>
            {jabs >= i ? '🥊' : '💤'}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button onClick={() => handleAction('jab')} style={{ padding: '1rem', borderRadius: '12px', background: '#3B82F6', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
          JAB: Send Helpful Tips
        </button>
        <button onClick={() => handleAction('hook')} style={{ padding: '1rem', borderRadius: '12px', background: jabs === 3 ? '#EF4444' : '#64748B', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
          HOOK: Ask for the Sale
        </button>
      </div>

      {sold && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#DCFCE7', borderRadius: '16px', border: '1px solid #BBF7D0', color: '#166534', animation: 'scaleIn 0.3s' }}>
          <strong>SUCCESS!</strong> Because you deposited value first, the customer felt safe buying from you.
        </div>
      )}
      {!sold && jabs < 3 && jabs > 0 && (
        <div style={{ marginTop: '2rem', color: '#64748B', fontSize: '0.9rem' }}>Depositing value... build more trust.</div>
      )}
    </div>
  );
}

function ROASCalculator() {
  const [spend, setSpend] = useState(100);
  const [rev, setRev] = useState(500);
  const roas = (rev / spend).toFixed(1);

  return (
    <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#0F172A', color: 'white', borderRadius: '24px', textAlign: 'center' }}>
      <h4 style={{ marginBottom: '1rem' }}>ROAS Simulator</h4>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7 }}>Ad Spend (R)</label>
          <input type="number" value={spend} onChange={(e) => setSpend(e.target.value)} style={{ background: 'transparent', border: '1px solid #334155', color: 'white', padding: '0.5rem', borderRadius: '8px', width: '80px', textAlign: 'center' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7 }}>Revenue (R)</label>
          <input type="number" value={rev} onChange={(e) => setRev(e.target.value)} style={{ background: 'transparent', border: '1px solid #334155', color: 'white', padding: '0.5rem', borderRadius: '8px', width: '80px', textAlign: 'center' }} />
        </div>
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: roas > 3 ? '#10B981' : '#EF4444' }}>
        {roas}x
      </div>
      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{roas > 3 ? 'Profitable! Scale it up! 🚀' : 'Losing money. Kill the ad. ⚠️'}</p>
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

        <LeadMagnetFunnel />

        <BookInsight title="Traffic Secrets" author="Russell Brunson" book="Traffic Secrets" color="#3B82F6">
          <p>"If you ask a stranger to marry you (Buy Now), they will say no. You must first ask for a coffee (Lead Magnet)."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '24px', border: '1px solid #BFDBFE' }}>
          <CWHeading level={3} style={{ color: '#1E40AF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E3A8A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Efficiency of Capital.</strong> Most business owners waste budget trying to sell high-ticket items to "Cold" traffic. By building a "Lead Magnet" first, you acquire customers at 1/10th the cost and build a relationship that scales over time.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BFDBFE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=content-that-converts" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Content that Converts</a>: We help you design the perfect "Bribe" (Lead Magnet) that solves a real problem for your customers, turning cold strangers into warm leads automatically.
                </span>
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

        <GoogleAdsAuction />

        <ScenarioToggle
          oldTitle="The Billboard (Hope)"
          oldContent="You pay R50,000 to show your plumbing ad to 100,000 driving people. Only 2 of them have a leak. Wasted money."
          newTitle="Google Search (Precision)"
          newContent="You pay R20 to show your ad to 1 person who JUST searched 'Plumber Help'. High conversion."
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', borderRadius: '24px', border: '1px solid #BBF7D0' }}>
          <CWHeading level={3} style={{ color: '#15803D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#14532D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Capturing Direct Demand.</strong> Intent marketing is the "Low Hanging Fruit". If people are already searching for your service, Google Ads allows you to jump to the front of the line. But beware: without high quality (Intent Match), you will overpay for every click.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BBF7D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-first" style={{ color: '#10B981', textDecoration: 'underline' }}>Performance First</a>: We don't just set up ads; we build the landing pages that match the user's intent perfectly, lowering your cost-per-click while doubling your conversion.
                </span>
              </li>
            </ul>
          </div>
        </div>

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
          <strong>Social Media (Meta/TikTok)</strong> is "Interruption-Based". Users are there to see friends, memes, or cat videos. They aren't looking for you. You must earn their attention by interrupting their pattern.
        </p>

        <ScrollInterruptSimulator />

        <ScenarioToggle
          oldTitle="Boring Ad 😴"
          oldContent="A photo of your logo with 'We sell shoes'. (User scrolls past in 0.2 seconds)."
          newTitle="Pattern Interrupt 💥"
          newContent="A video of someone cutting a shoe in half with a chainsaw while shouting 'DON'T BUY THESE SHOES'. (User stops, watches, and learns why your shoes are better)."
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', borderRadius: '24px', border: '1px solid #FED7AA' }}>
          <CWHeading level={3} style={{ color: '#9A3412', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#7C2D12', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Generating New Demand.</strong> Unlike Google (where people must already be searching), Social Media allows you to create demand where none existed. You can find customers who didn't even know they needed your product—but only if your creative is strong enough to "Stop the Scroll".
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FED7AA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F97316', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=branding-team" style={{ color: '#F97316', textDecoration: 'underline' }}>Branding Team</a>: We specialize in high-intensity creative that uses "Pattern Interrupts" to capture attention in saturated feeds, turning bored scrollers into active buyers.
                </span>
              </li>
            </ul>
          </div>
        </div>

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
          Most businesses fail because they talk about themselves. "We were founded in 1999." Nobody cares. Your customer is looking for a solution to <em>their</em> problem, not a history lesson.
        </div>

        <StoryBrandHeadlineTester />

        <ScenarioToggle
          oldTitle="The Company Hero"
          oldContent="'WE are the best. WE have awards. WE are great.' (Customer tunes out because you've positioned yourself as the 'Hero' who needs help, not the 'Guide' who gives it)."
          newTitle="The Customer Hero"
          newContent="'YOU can achieve financial freedom. WE just help you get there.' (Customer listens because you've identified their 'Dream Outcome')."
        />

        <BookInsight title="The Guide" author="Donald Miller" book="Building a StoryBrand" color="#F59E0B">
          <p>"The Customer is the Hero. You are the Guide (Yoda). Your Product is the Lightsaber."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', borderRadius: '24px', border: '1px solid #FDE68A' }}>
          <CWHeading level={3} style={{ color: '#92400E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#78350F', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Message Market Fit.</strong> If your website is confusing, you are losing money. By simplifying your message and making the customer the hero, you lower the "Cognitive Load" required to understand your offer, which leads to immediate increases in conversion.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FDE68A', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F59E0B', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=content-that-converts" style={{ color: '#F59E0B', textDecoration: 'underline' }}>Copywriting &amp; Strategy</a>: We use the StoryBrand framework to audit your current messaging and rewrite your site so it speaks and sells to your customer's deepest needs.
                </span>
              </li>
            </ul>
          </div>
        </div>

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
        <p className="cw-text-body">
          If your marketing works but nobody buys, your <strong>Offer</strong> is weak. Most businesses compete on Price, which is a "Race to the Bottom." You must compete on **Value**.
        </p>

        <OfferValueCalculator />

        <BookInsight title="Value Equation" author="Alex Hormozi" book="$100M Offers" color="#10B981">
          <p><strong>Value = (Dream Outcome x Likelihood) / (Time Delay x Effort)</strong></p>
          <p>To increase value, decrease the Time Delay and Effort required to see results.</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', borderRadius: '24px', border: '1px solid #BBF7D0' }}>
          <CWHeading level={3} style={{ color: '#15803D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#14532D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Pricing Power.</strong> When you create an "Irresistible Offer," price becomes irrelevant. If you can help someone lose 10kg in 10 days without diet or exercise, you can charge R50,000. If it takes 1 year and hard work, you can only charge R500. Value engineering is the key to high margins.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BBF7D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ai-agents-sales-team" style={{ color: '#10B981', textDecoration: 'underline' }}>AI Sales Team</a>: We help you build "Automated Value" into your offers through AI agents that provide instant response times (reducing Time Delay) and automated onboarding (reducing Effort).
                </span>
              </li>
            </ul>
          </div>
        </div>

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
        <p className="cw-text-body">
          Social Media is "Rented Land". If the algorithm changes, you lose access to your fans. <strong>Email</strong> is "Owned Land"—your list is a permanent asset that no billionaire can take away from you.
        </p>

        <AlgoSurvivalSim />

        <CWCard>
          <h4>The Lead Magnet</h4>
          <p>Don't just say "Join our Newsletter." Nobody wants more email. Say "Download the 5-Step Checklist to Gain Financial Independence." Give value first to earn the permission to market.</p>
        </CWCard>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#9D174D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#831843', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Risk Mitigation.</strong> Relying on Facebook, Google, or TikTok for 100% of your traffic is a high-risk strategy. An email list of 10,000 customers who trust you is an insurance policy against platform bans and algorithm wipeouts.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EC4899', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=automation-systems" style={{ color: '#EC4899', textDecoration: 'underline' }}>Automation Systems</a>: We set up the "Email Infrastructure" that captures leads and drips value automatically, so you can build your "Owned Media" asset while you sleep.
                </span>
              </li>
            </ul>
          </div>
        </div>

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
        <p className="cw-text-body">
          97% of people leave your website without buying anything. They aren't saying "No," they are just saying "Not now." **Retargeting** allows you to stay top-of-mind until they are ready to purchase.
        </p>

        <RetargetingJourney />

        <CWAlert type="warning" title="Scenario: The Abandoned Cart">
          User adds shoes &rarr; Gets distracted &rarr; Leaves.
          <br /><strong>Retargeting Ad (1 hour later):</strong> "Hey, you forgot your shoes! Here is a 5% discount code."
          <br /><strong>Result:</strong> Conversion.
        </CWAlert>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '24px', border: '1px solid #BFDBFE' }}>
          <CWHeading level={3} style={{ color: '#1E40AF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E3A8A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Maximizing Ad Spend ROI.</strong> Most "Cold" traffic ads lose money on the first click. Retargeting is where the profit is made. By showing ads only to people who have already visited your site, you are targeting the highest-intent audience possible, often resulting in 1/5th the CAC of cold ads.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BFDBFE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-first" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Performance First</a>: We implement cross-platform tracking pixels (Meta, Google, TikTok) to ensure your brand follows your customers across the web, gently nudging them back to your checkout page.
                </span>
              </li>
            </ul>
          </div>
        </div>

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
        <p className="cw-text-body">
          Marketing is not an "Expense"—it is an **Investment**. If you spend R1 and get R2 back, you keep spending until it stops working. This is the logic of <strong>Return on Ad Spend (ROAS)</strong>.
        </p>

        <ROASCalculator />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', borderRadius: '24px', border: '1px solid #BBF7D0' }}>
          <CWHeading level={3} style={{ color: '#15803D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#14532D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Data-Driven Growth.</strong> When you know your **LTV (Life Time Value)** and your **CAC (Customer Acquisition Cost)**, you can predict exactly how much money you will make next month. This clarity allows you to secure funding, hire with confidence, and scale your business without the "Marketing Anxiety" of not knowing if your ads are working.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BBF7D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Custom Analytics Dashboards:</strong> We don't just send you reports of "Clicks" and "Impressions." We build dashboards that show you <strong>Net Profit</strong> and <strong>ROAS</strong> per campaign, so you know exactly where your Rands are going.
                </span>
              </li>
            </ul>
          </div>
        </div>

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
        <p className="cw-text-body">
          Gary Vaynerchuk's philosophy: **"Jab, Jab, Jab, Right Hook."** A "Jab" is a piece of free value (a tip, a story, a guide). A "Right Hook" is the request for the sale. Most businesses throw hooks only, which is why people block them.
        </p>

        <ValueMeter />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', borderRadius: '24px', border: '1px solid #FED7AA' }}>
          <CWHeading level={3} style={{ color: '#9A3412', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#7C2D12', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Reciprocity as a Sales Tool.</strong> When you provide free value, you trigger a biological psychological response: the need to reciprocate. Content marketing builds an "Authority Moat" that makes you the only logical choice when the customer is finally ready to throw their "Right Hook" and buy.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FED7AA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F97316', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=branding-team" style={{ color: '#F97316', textDecoration: 'underline' }}>Branding Team</a>: We help you build a "Library of Jabs"—expert videos, blog posts, and guides—that establish you as the authority in your niche and turn every "Hook" into a high-converting sale.
                </span>
              </li>
            </ul>
          </div>
        </div>

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
