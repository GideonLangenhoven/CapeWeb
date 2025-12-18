import React, { useState, useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';
import { InteractiveLayout, QuizLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, BookInsight } from './CapeWebUI';

// ==========================================
// PILLAR 5 QUIZ DATA
// ==========================================
export const pillar5QuizQuestions = [
  {
    question: 'According to "The Long Tail", which keyword strategy is easier for new businesses?',
    options: ['Head Terms (e.g. "Shoes")', 'Long Tail Keywords (e.g. "Red Velcro Hiking Shoes Size 10")', 'No keywords'],
    correctIndex: 1,
  },
  {
    question: 'What does the acronym E-E-A-T stand for in Google\'s Quality Guidelines?',
    options: ['Eat Everything All Time', 'Experience, Expertise, Authoritativeness, Trustworthiness', 'Energy, Effort, Action, Time'],
    correctIndex: 1,
  },
  {
    question: 'In "They Ask You Answer", what is the strategy recommended?',
    options: ['Ignore customer questions', 'Answer the difficult questions (like Price and Problems) publicly', 'Only write sales copy'],
    correctIndex: 1,
  },
  {
    question: 'What is the "Skyscraper Technique"?',
    options: ['Building a tall office', 'Finding high-ranking content and creating a version that is 10x better', 'Buying ads'],
    correctIndex: 1,
  },
  {
    question: 'Core Web Vitals measure:',
    options: ['How much money you make', 'User Experience metrics like Loading (LCP), Interactivity (INP), and Stability (CLS)', 'The number of keywords'],
    correctIndex: 1,
  },
  {
    question: 'What is "Keyword Cannibalization"?',
    options: ['When two of your own pages compete for the same keyword, hurting both', 'When keywords eat each other', 'Using too many keywords'],
    correctIndex: 0,
  },
  {
    question: 'Why is "Faceted Navigation" dangerous for E-commerce SEO?',
    options: ['It makes the menu ugly', 'It can generate millions of thin/duplicate pages (Index Bloat)', 'Google loves it'],
    correctIndex: 1,
  },
  {
    question: 'What is a "Canonical Tag"?',
    options: ['A religious text', 'A tag that tells Google "This is the master version of this page"', 'A price tag'],
    correctIndex: 1,
  },
  {
    question: 'For Local SEO, what is NAP Consistency?',
    options: ['Sleeping at work', 'Name, Address, Phone number must be identical across the web (Google, Facebook, YellowPages)', 'No Ads Please'],
    correctIndex: 1,
  },
  {
    question: 'What is "Schema Markup"?',
    options: ['A design scheme', 'Code that explains your content to Google (e.g. "This is a Recipe")', 'A database'],
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

// Interactive: Long Tail Simulator
function LongTailSimulator() {
  const [credits, setCredits] = useState(100);
  const [ranking, setRanking] = useState(null); // { term: string, chance: number, cost: number, success: boolean }
  const [history, setHistory] = useState([]);

  const keywords = [
    { term: "Insurance", cost: 90, chance: 1, label: "Head Term (Fatal)" },
    { term: "Car Insurance", cost: 60, chance: 5, label: "Head Term (Hard)" },
    { term: "Car Insurance for Students", cost: 20, chance: 40, label: "Medium Tail" },
    { term: "Affordable insurance for 18 year old drivers in Cape Town", cost: 5, chance: 95, label: "Long Tail (Winning)" }
  ];

  const handleBid = (k) => {
    if (credits < k.cost) return;

    const success = Math.random() * 100 < k.chance;
    const result = { ...k, success };

    setRanking(result);
    setCredits(prev => prev - k.cost);
    setHistory(prev => [result, ...prev].slice(0, 3));
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Interactive: The Keyword War</h3>
        <div style={{ background: '#1E293B', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid #334155' }}>
          Credits: <span style={{ color: '#F59E0B', fontWeight: 800 }}>{credits}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {keywords.map(k => (
          <button
            key={k.term}
            onClick={() => handleBid(k)}
            disabled={credits < k.cost}
            style={{
              padding: '1.25rem',
              background: '#1E293B',
              border: '2px solid #334155',
              borderRadius: '16px',
              color: 'white',
              cursor: credits < k.cost ? 'not-allowed' : 'pointer',
              opacity: credits < k.cost ? 0.5 : 1,
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>{k.label}</div>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>"{k.term}"</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Cost: {k.cost}</span>
              <span style={{ color: '#10B981' }}>Win: {k.chance}%</span>
            </div>
          </button>
        ))}
      </div>

      {ranking && (
        <div style={{ padding: '1.5rem', background: ranking.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `2px solid ${ranking.success ? '#10B981' : '#EF4444'}`, borderRadius: '16px', textAlign: 'center', animation: 'fadeIn 0.3s' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{ranking.success ? '🏆' : '💀'}</div>
          <h4 style={{ margin: 0 }}>{ranking.success ? 'RANKED #1!' : 'Wasted Budget'}</h4>
          <p style={{ margin: '0.5rem 0 0', color: '#CBD5E1' }}>
            {ranking.success ? `You dominated the niche for "${ranking.term}".` : `Your R${ranking.cost} was eaten by giants.`}
          </p>
        </div>
      )}

      {credits <= 10 && !ranking?.success && (
        <button onClick={() => { setCredits(100); setRanking(null); setHistory([]); }} style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: '#3B82F6', textDecoration: 'underline', cursor: 'pointer', width: '100%' }}>Restart Simulation</button>
      )}
    </div>
  );
}

// Interactive: Question Sieve (AI vs Human)
function QuestionSieve() {
  const questions = [
    { q: "What is the capital of France?", type: "AI", explanation: "Factual, instant, AI dominates this." },
    { q: "What does it feel like to fail a business?", type: "Human", explanation: "Emotional, lived experience. AI cannot fake this authentically yet." },
    { q: "How to tie a tie?", type: "AI", explanation: "Procedural. SGE will show a video/diagram instantly." },
    { q: "Is the Tesla Model 3 worth it in South Africa?", type: "Human", explanation: "Opinion, local nuance, value judgement." }
  ];

  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const handleGuess = (guess) => {
    const isCorrect = guess === questions[index].type;
    setFeedback({ isCorrect, ...questions[index] });
    setTimeout(() => {
      setFeedback(null);
      setIndex(prev => (prev + 1) % questions.length);
    }, 3000);
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>Interactive: The "SGE" Survival Test</h3>
      <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Which questions will AI steal? Which will humans protect?</p>

      <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600, padding: '1rem', background: '#1E293B', borderRadius: '16px', marginBottom: '2rem' }}>
        "{questions[index].q}"
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button onClick={() => handleGuess('AI')} style={{ padding: '1.5rem', borderRadius: '16px', background: '#334155', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 800 }}>🤖 AI Territory</button>
        <button onClick={() => handleGuess('Human')} style={{ padding: '1.5rem', borderRadius: '16px', background: '#3B82F6', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 800 }}>👤 Human Territory</button>
      </div>

      {feedback && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '16px', background: feedback.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', border: `2px solid ${feedback.isCorrect ? '#10B981' : '#EF4444'}` }}>
          <div style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{feedback.isCorrect ? 'Correct!' : 'Not Quite.'}</div>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>{feedback.explanation}</p>
        </div>
      )}
    </div>
  );
}

// Interactive: Core Web Vitals Visualizer
function CoreWebVitalsVisualizer() {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({ lcp: 0, cls: 0, inp: 0 });
  const [config, setConfig] = useState({ optimize: false, stable: false });

  const runTest = () => {
    setLoading(true);
    setMetrics({ lcp: 0, cls: 0, inp: 0 });

    setTimeout(() => {
      setMetrics({
        lcp: config.optimize ? 1.2 : 4.5,
        cls: config.stable ? 0.01 : 0.45,
        inp: config.optimize ? 45 : 300
      });
      setLoading(false);
    }, 2000);
  };

  const getStatus = (val, type) => {
    if (type === 'lcp') return val < 2.5 ? '#10B981' : '#EF4444';
    if (type === 'cls') return val < 0.1 ? '#10B981' : '#EF4444';
    if (type === 'inp') return val < 200 ? '#10B981' : '#EF4444';
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>Interactive: Core Web Vitals Lab</h3>
      <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>How Google measures your site's health.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px', textAlign: 'center', borderTop: `4px solid ${getStatus(metrics.lcp, 'lcp')}` }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Loading (LCP)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{loading ? '...' : `${metrics.lcp}s`}</div>
        </div>
        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px', textAlign: 'center', borderTop: `4px solid ${getStatus(metrics.cls, 'cls')}` }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Stability (CLS)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{loading ? '...' : metrics.cls}</div>
        </div>
        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px', textAlign: 'center', borderTop: `4px solid ${getStatus(metrics.inp, 'inp')}` }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Interactivity (INP)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{loading ? '...' : `${metrics.inp}ms`}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#334155', padding: '0.8rem 1rem', borderRadius: '12px', cursor: 'pointer' }}>
          <input type="checkbox" checked={config.optimize} onChange={e => setConfig(prev => ({ ...prev, optimize: e.target.checked }))} />
          <span>Optimize Assets</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#334155', padding: '0.8rem 1rem', borderRadius: '12px', cursor: 'pointer' }}>
          <input type="checkbox" checked={config.stable} onChange={e => setConfig(prev => ({ ...prev, stable: e.target.checked }))} />
          <span>Pre-size Layout</span>
        </label>
      </div>

      <button onClick={runTest} disabled={loading} style={{ width: '100%', padding: '1rem', borderRadius: '100px', background: '#3B82F6', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Crawling...' : 'Run Google Audit'}
      </button>
    </div>
  );
}

// Interactive: Map Trust Simulator
function MapTrustSimulator() {
  const [pins, setPins] = useState([
    { id: 1, name: "Google Business", status: "Verified", consistent: true },
    { id: 2, name: "Facebook Page", status: "Old Address", consistent: false },
    { id: 3, name: "YellowPages", status: "No Phone", consistent: false }
  ]);

  const trustScore = Math.round((pins.filter(p => p.consistent).length / pins.length) * 100);

  const fixPin = (id) => {
    setPins(prev => prev.map(p => p.id === id ? { ...p, status: "Verified", consistent: true } : p));
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, color: '#0F172A' }}>Interactive: Local Trust Engine</h3>
        <div style={{ padding: '0.5rem 1rem', background: '#10B981', color: 'white', borderRadius: '100px', fontWeight: 800 }}>
          Local Visibility: {trustScore}%
        </div>
      </div>

      <div style={{ background: '#E2E8F0', height: '200px', borderRadius: '16px', position: 'relative', overflow: 'hidden', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: `${trustScore * 2}px`,
          height: `${trustScore * 2}px`,
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '50%',
          border: '2px solid #10B981',
          transition: 'all 0.5s ease'
        }}></div>
        <div style={{ position: 'absolute', fontSize: '2rem' }}>🏢</div>

        {/* Pins */}
        <div style={{ position: 'absolute', top: '20px', left: '40px', fontSize: '1.5rem', opacity: pins[1].consistent ? 1 : 0.4 }}>📍</div>
        <div style={{ position: 'absolute', bottom: '30px', right: '50px', fontSize: '1.5rem', opacity: pins[2].consistent ? 1 : 0.4 }}>📍</div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {pins.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#0F172A' }}>{p.name}</div>
              <div style={{ fontSize: '0.8rem', color: p.consistent ? '#10B981' : '#EF4444' }}>{p.status}</div>
            </div>
            {!p.consistent && (
              <button onClick={() => fixPin(p.id)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#3B82F6', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                Fix NAP
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Interactive: E-E-A-T Validator
function EEATValidator() {
  const [selected, setSelected] = useState(null);
  const scenarios = [
    {
      id: 1,
      label: "AI-Generated Guide",
      content: "General advice on hiking Table Mountain based on web data.",
      score: "Low",
      reason: "No lived 'Experience' or unique photos."
    },
    {
      id: 2,
      label: "Expert Local Guide",
      content: "My personal 50th hike up the mountain, with weather-specific safety tips and 20 photos.",
      score: "High",
      reason: "High 'Experience' and 'Authoritativeness'."
    }
  ];

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Interactive: The EEAT Filter</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {scenarios.map(s => (
          <div
            key={s.id}
            onClick={() => setSelected(s)}
            style={{
              padding: '1.5rem',
              background: '#1E293B',
              borderRadius: '16px',
              border: selected?.id === s.id ? '2px solid #3B82F6' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{s.label}</div>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: 0 }}>{s.content}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', border: '1px solid #3B82F6', animation: 'fadeIn 0.3s' }}>
          <div style={{ fontWeight: 800, color: '#3B82F6', marginBottom: '0.5rem' }}>Google's Verdict: {selected.score} Trust</div>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>{selected.reason}</p>
        </div>
      )}
    </div>
  );
}

// Interactive: Link Quality Visual
function LinkQualityVisual() {
  const [links, setLinks] = useState([]);
  const [authority, setAuthority] = useState(0);

  const addLink = (type) => {
    const newLink = type === 'high'
      ? { id: Date.now(), title: "BBC / News Site", power: 40, color: '#3B82F6' }
      : { id: Date.now(), title: "Random Directory", power: 2, color: '#94A3B8' };

    setLinks(prev => [...prev, newLink].slice(-10));
    setAuthority(prev => Math.min(100, Math.round(prev + newLink.power)));
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ margin: 0 }}>Interactive: Domain Authority Engine</h3>
        <div style={{ padding: '0.5rem 1rem', background: '#3B82F6', color: 'white', borderRadius: '100px', fontWeight: 800 }}>
          DA: {authority}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', minHeight: '100px', padding: '1rem', background: '#1E293B', borderRadius: '16px', marginBottom: '2rem' }}>
        {links.length === 0 && <p style={{ color: '#64748B', width: '100%', textAlign: 'center' }}>No backlinks yet.</p>}
        {links.map(l => (
          <div key={l.id} style={{ padding: '0.5rem 1rem', background: l.color, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, animation: 'scaleIn 0.3s' }}>
            {l.title} (+{l.power})
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button onClick={() => addLink('low')} style={{ padding: '1rem', borderRadius: '12px', background: '#334155', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add Cheap Directory Link
        </button>
        <button onClick={() => addLink('high')} style={{ padding: '1rem', borderRadius: '12px', background: '#3B82F6', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
          Earn Authority News Link
        </button>
      </div>
    </div>
  );
}

// Interactive: Engagement Funnel Simulator
function EngagementFunnelSimulator() {
  const [quality, setQuality] = useState(50);

  const traffic = 1000;
  const engagementRate = (quality / 100).toFixed(2);
  const engagedSessions = Math.round(traffic * engagementRate);
  const conversionRate = (engagedSessions / traffic * 0.1).toFixed(2); // Simplified
  const revenue = (engagedSessions * 10).toLocaleString();

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
      <h3 style={{ marginBottom: '0.5rem', color: '#0F172A' }}>Interactive: The Revenue Funnel</h3>
      <p style={{ color: '#64748B', marginBottom: '2rem' }}>Adjust content quality to see how "Vanity" traffic turns into "Actionable" revenue.</p>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem' }}>
          Content Relevance & Quality: {quality}%
        </label>
        <input
          type="range" min="10" max="100" value={quality}
          onChange={e => setQuality(e.target.value)}
          style={{ width: '100%', accentColor: '#10B981' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1.25rem', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Traffic (Vanity)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{traffic}</div>
        </div>
        <div style={{ padding: '1.25rem', background: '#DCFCE7', borderRadius: '12px', border: '1px solid #BBF7D0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#15803D' }}>Engaged Sessions</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803D' }}>{engagedSessions}</div>
        </div>
        <div style={{ padding: '1.25rem', background: '#DBEAFE', borderRadius: '12px', border: '1px solid #BFDBFE', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#1E40AF' }}>Est. Revenue</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E40AF' }}>R{revenue}</div>
        </div>
      </div>
    </div>
  );
}

// Interactive: Index Bloat Simulator
function IndexBloatSimulator() {
  const [blocked, setBlocked] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [stats, setStats] = useState({ products: 0, filters: 0 });

  useEffect(() => {
    let interval;
    if (crawling) {
      interval = setInterval(() => {
        setStats(prev => ({
          products: prev.products + (blocked ? 1 : 0.2),
          filters: prev.filters + (blocked ? 0 : 5)
        }));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [crawling, blocked]);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Interactive: Googlebot Crawl Simulation</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>{Math.floor(stats.products)}</div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>REAL Products Found</div>
        </div>
        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🕸️</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: blocked ? '#64748B' : '#EF4444' }}>{Math.floor(stats.filters)}</div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Filter Junk Crawled</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={() => { setCrawling(!crawling); if (!crawling) setStats({ products: 0, filters: 0 }); }} style={{ padding: '1rem 2rem', borderRadius: '100px', background: '#3B82F6', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
          {crawling ? 'Stop Simulation' : 'Start Googlebot'}
        </button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: '#334155', padding: '0.8rem 1.5rem', borderRadius: '100px' }}>
          <input type="checkbox" checked={blocked} onChange={e => setBlocked(e.target.checked)} />
          <span>Enable robots.txt Filter Block</span>
        </label>
      </div>
    </div>
  );
}

function LongTailVisual() {
  return (
    <div style={{ margin: '2rem 0', height: '200px', background: '#F8FAFC', borderRadius: '16px', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0 1rem' }}>
      {/* Fat Head */}
      <div style={{ width: '20%', height: '80%', background: '#EF4444', borderRadius: '8px 8px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', textAlign: 'center' }}>
        <strong>Head</strong>
        <span>High Vol</span>
        <span>Low Conv</span>
      </div>
      {/* Middle */}
      <div style={{ width: '30%', height: '50%', background: '#F59E0B', borderRadius: '8px 8px 0 0' }}></div>
      {/* Long Tail */}
      <div style={{ width: '50%', height: '30%', background: '#10B981', borderRadius: '8px 8px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', textAlign: 'center' }}>
        <strong>Long Tail</strong>
        <span>Low Vol</span>
        <span>High Conv</span>
      </div>
    </div>
  )
}

// Interactive: SERP Preview Editor
function SERPPreviewEditor() {
  const [title, setTitle] = useState("Best Pizza in Cape Town | My Restaurant");
  const [desc, setDesc] = useState("We make the best wood-fired pizza in Cape Town. Come visit us for a slice of heaven. 24/7 service.");

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#0F172A' }}>Interactive: SERP Preview Editor</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Title Tag ({title.length}/60 chars)
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: title.length > 60 ? '2px solid #EF4444' : '1px solid #CBD5E1', fontSize: '1rem' }}
            />
            {title.length > 60 && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>Title too long! Google will truncate it (...)</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Meta Description ({desc.length}/160 chars)
            </label>
            <textarea
              value={desc}
              rows={3}
              onChange={e => setDesc(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: desc.length > 160 ? '2px solid #EF4444' : '1px solid #CBD5E1', fontSize: '1rem', resize: 'none' }}
            />
            {desc.length > 160 && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>Description too long! Google will cut it off.</p>}
          </div>
        </div>

        {/* Google Mockup */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Google Mobile Preview
          </label>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
              <div style={{ width: '20px', height: '20px', background: '#F1F3F4', borderRadius: '50%' }}></div>
              <div style={{ fontSize: '0.8rem', color: '#202124' }}>www.mygreatsite.co.za › pizza</div>
            </div>
            <div style={{
              fontSize: '1.25rem',
              color: '#1A0DAB',
              marginBottom: '4px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3
            }}>
              {title}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#4D5156',
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {desc}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SFERPVisual() {
  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', margin: '2rem 0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '0.8rem', color: '#202124' }}>www.plumbers.co.za › cape-town</div>
      <div style={{ fontSize: '1.2rem', color: '#1A0DAB', cursor: 'pointer', textDecoration: 'underline', marginBottom: '4px' }}>
        Best Plumbers Cape Town | 24/7 Emergency Service
      </div>
      <div style={{ fontSize: '0.9rem', color: '#4D5156' }}>
        We fix blocked drains, burst pipes and geysers. Call us now for a free quote.
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', display: 'flex', gap: '0.5rem' }}>
        <span style={{ fontWeight: 'bold' }}>Key:</span>
        <span style={{ color: '#1A0DAB' }}>Title Tag (Blue)</span>
        <span style={{ color: '#4D5156' }}>Meta Description (Grey)</span>
      </div>
    </div>
  )
}

function LinkJuiceVisual() {
  const [flowing, setFlowing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setFlowing(f => !f), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', margin: '2rem 0' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#3B82F6', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)' }}>
        <strong>News24</strong>
        <small>Score: 90</small>
      </div>
      {/* Tube */}
      <div style={{ width: '100px', height: '10px', background: '#E2E8F0', borderRadius: '5px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          width: '40px', height: '100%', background: '#3B82F6', borderRadius: '5px', position: 'absolute', top: 0,
          left: flowing ? '100%' : '-40%',
          transition: 'left 1s linear'
        }} />
      </div>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: flowing ? '#93C5FD' : '#E2E8F0', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'background 0.3s' }}>
        <strong>You</strong>
        <small>{flowing ? 'Score: 20' : 'Score: 10'}</small>
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
// PILLAR 5 MODULES A-I
// ==========================================

// Module A: SEO Fundamentals
export function Pillar5ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: The Long Tail" subtitle="Picking fights you can win.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Google results are a "Winner Take All" market. The #1 spot gets ~33% of clicks. The #10 spot gets &lt; 1%.
          If you are a new shoe store, you cannot rank for "Shoes" (Competition: Nike, Adidas).
        </p>

        <LongTailSimulator />

        <BookInsight title="The Long Tail" author="Chris Anderson" book="The Long Tail" color="#3B82F6">
          <p>"The future of business is selling less of more."</p>
        </BookInsight>

        <ScenarioToggle
          oldTitle="The Head (Hard)"
          oldContent="Keyword: 'Insurance'. Volume: 1M. Competition: Huge Banks. Rank: Page 50. Revenue: R0."
          newTitle="The Tail (Easy)"
          newContent="Keyword: 'Insurance for Pet snakes'. Volume: 100. Competition: None. Rank: #1. Revenue: R5000."
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '24px', border: '1px solid #BFDBFE' }}>
          <CWHeading level={3} style={{ color: '#1E40AF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E3A8A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Capital Efficiency.</strong> Ranking for high-volume "Head Terms" costs millions in backlinks and content. Smaller businesses scale faster by dominating 100 niche "Long Tail" terms where the competition is zero and the conversion rate is 10x higher.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BFDBFE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build content assets, not just pages.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=seo-that-sticks" style={{ color: '#3B82F6', textDecoration: 'underline' }}>SEO that Sticks</a>: We map your customer's journey and find the specific high-intent "Tail" keywords that your competitors have ignored.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Why should you target 'Long Tail' keywords?", options: ["They have more traffic", "They are easier to rank for and have higher conversion intent", "They are shorter"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module B: Keywords & Questions
export function Pillar5ModuleB({ onNext }) {
  return (
    <InteractiveLayout title="Module B: Answering Questions" subtitle="Be the oracle.">
      <div className="cw-prose">
        <p className="cw-text-body">
          People don't just type words; they ask questions. With <strong>SGE (Search Generative Experience)</strong>, AI answers simple questions. To survive, you must provide deep, human insight.
        </p>

        <QuestionSieve />

        <CWAlert type="warning" title="Keyword Cannibalization">
          <strong>The Trap:</strong> You write 5 different blog posts all trying to rank for "Best Coffee in CT".
          <br /><strong>The Result:</strong> Google gets confused about which page is the "Master" page and ranks NONE of them.
        </CWAlert>

        <ScenarioToggle
          oldTitle="Generic Blog"
          oldContent="'We offer great services at affordable prices'. (Boring, no one searches for this)."
          newTitle="Radical Transparency"
          newContent="'How much does a website cost in 2024?'. (Specific, high intent, builds trust)."
        />

        <BookInsight title="Radical Transparency" author="Marcus Sheridan" book="They Ask You Answer" color="#10B981">
          <p>"If you are willing to answer the questions that your prospects are asking—and your competitors are afraid to answer—you will own the market."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', borderRadius: '24px', border: '1px solid #BBF7D0' }}>
          <CWHeading level={3} style={{ color: '#15803D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#14532D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Trust & The SGE Threat.</strong> Google's AI (SGE) will steal "factual" traffic. To win, your content must answer the difficult, qualitative questions that AI can't: "Should I do this?", "What are the common pitfalls?", and "Is it worth the money?".
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BBF7D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=content-that-converts" style={{ color: '#10B981', textDecoration: 'underline' }}>Content that Converts</a>: We help you build a "Knowledge Base" strategy that answers real customer anxieties, transforming your site from a brochure into a trusted advisor.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is 'Keyword Cannibalization'?", options: ["When keywords eat each other", "When your own pages compete against each other for the same term", "When you use too many keywords"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module C: On-Page
export function Pillar5ModuleC({ onNext }) {
  return (
    <InteractiveLayout title="Module C: SEO Real Estate" subtitle="Dominating the result page.">
      <div className="cw-prose">
        <p className="cw-text-body">
          You need to speak to two audiences: The Human (H1) and The Robot (Title Tag).
          <strong>The Robot needs to know where to file your page.</strong> The Human needs to click.
        </p>

        <SERPPreviewEditor />

        <h3>The Skyscraper Technique</h3>
        <p className="cw-text-body">
          Don't just write a blog post. Find the #1 ranking article for your target keyword. Analyze it. Then create a version that is <strong>10x better</strong> (More updated, better design, better data). Then, reach out to everyone who linked to the old version and tell them about yours.
        </p>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', borderRadius: '24px', border: '1px solid #FED7AA' }}>
          <CWHeading level={3} style={{ color: '#9A3412', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#7C2D12', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Click-Through Rate (CTR) = Market Share.</strong> Even if you are #3, a better Title and Meta Description can earn you more clicks than the #1 spot. SEO is as much about advertising psychology as it is about code.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FED7AA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F97316', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-first" style={{ color: '#F97316', textDecoration: 'underline' }}>Performance First</a>: We ensure your technical "SEO Furniture" (H1s, Titles, Meta, Alt Text) is perfectly optimized for both humans and search engines from day one.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the detailed difference between Title Tag and H1?", options: ["There is no difference", "Title Tag is for Google results, H1 is the top heading on the page itself", "H1 is for the footer"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module D: Technical
export function Pillar5ModuleD({ onNext }) {
  return (
    <InteractiveLayout title="Module D: Core Web Vitals" subtitle="Ranking via Experience.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Google has a "Crawl Budget". If your site is slow or jumps around while loading, Google considers it a poor experience and penalizes your ranking.
        </p>

        <CoreWebVitalsVisualizer />

        <CWCard>
          <h4>Canonical Tags</h4>
          <p>Telling Google "This is the ORIGINAL version" prevents duplicate content penalties. This is critical for e-commerce where the same product might appear under different categories.</p>
        </CWCard>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F9FAF0 0%, #F0FDF4 100%)', borderRadius: '24px', border: '1px solid #DCFCE7' }}>
          <CWHeading level={3} style={{ color: '#166534', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#14532D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Conversion Rate Correlation.</strong> Every 100ms delay in load time can drop conversion rates by 7%. Technical SEO isn't just for ranking; it's a direct driver of revenue. If your site is slow, your marketing budget is being wasted on "Bounce" traffic.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #DCFCE7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-first" style={{ color: '#10B981', textDecoration: 'underline' }}>Performance Monitoring</a>: We set up automated alerts that ping us the moment your PageSpeed scores dip, ensuring your "Evergreen" traffic remains stable.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What does a Canonical Tag do?", options: ["It confuses Google", "It tells Google which URL is the 'Master' version to index", "It speeds up the site"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module E: Local
export function Pillar5ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: NAP Consistency" subtitle="Proximity is power.">
      <div className="cw-prose">
        <p className="cw-text-body">
          For local businesses, Google looks for "Trust Signals" across the web. If your phone number is different on Facebook than it is on your website, Google loses trust in your location data.
        </p>

        <MapTrustSimulator />

        <ScenarioToggle
          oldTitle="Inconsistent (Bad)"
          oldContent="FB: '12 Main Rd'. Web: '12 Main Road, Cape Town'. (Google is confused and lowers your proximity ranking)."
          newTitle="Consistent (Good)"
          newContent="FB: '12 Main Road, Cape Town'. Web: '12 Main Road, Cape Town'. (Google trusts and shows you to nearby searchers)."
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FEFCE8 0%, #FEF9C3 100%)', borderRadius: '24px', border: '1px solid #FEF08A' }}>
          <CWHeading level={3} style={{ color: '#854D0E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#713F12', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>The "Near Me" Economy.</strong> Over 70% of mobile searches lead to a physical store visit within 24 hours. If your NAP (Name, Address, Phone) isn't perfect, you are literally invisible to the customers standing in your neighborhood.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FEF08A', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EAB308', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Local Presence Audit:</strong> We scan 50+ directories (Google, Bing, Yelp, Apple Maps) to find and fix inconsistent data that is currently suppressing your local rankings.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What does NAP stand for in Local SEO?", options: ["Name, Address, Phone", "No Ads Please", "New App Protocol"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module F: Content
export function Pillar5ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: E-E-A-T" subtitle="Google's Trust Metric.">
      <div className="cw-prose">
        <p className="cw-text-body">
          In the age of AI spam, Google prioritizes <strong>Experience</strong>. AI cannot taste food, hike a mountain, or run a boardroom.
        </p>

        <EEATValidator />

        <BookInsight title="Experience vs Expertise" author="Google" book="Search Quality Guidelines" color="#F43F5E">
          <p>"E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness. It is the framework Google uses to separate helpful content from search-engine-first junk."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)', borderRadius: '24px', border: '1px solid #FECDD3' }}>
          <CWHeading level={3} style={{ color: '#9F1239', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#881337', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>The AI Filter.</strong> As search engines get flooded with AI-written text, they are becoming extremely selective. Businesses that post genuine case studies, customer photos, and "behind-the-scenes" expertise will skyrocket while generic blogs will disappear.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FECDD3', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#F43F5E', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=content-that-converts" style={{ color: '#F43F5E', textDecoration: 'underline' }}>Authority Strategy</a>: We don't just write for you; we help you extract the unique "Experience" from your team to create content that AI simply cannot replicate.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Why does Google value 'Experience' (the extra E)?", options: ["AI cannot have real-world physical experience", "It likes fancy words", "It is easier to index"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module G: Links
export function Pillar5ModuleG({ onNext }) {
  return (
    <InteractiveLayout title="Module G: Digital PR" subtitle="Earning links, not buying them.">
      <div className="cw-prose">
        <p className="cw-text-body">
          A link from another site is a "Vote of Confidence". But in Google's world, the reputation of the voter matters as much as the vote itself. One link from a trusted news site is worth 10,000 links from unknown directories.
        </p>

        <LinkQualityVisual />

        <p className="cw-text-body">Don't spam. Create news. Release a survey, a unique tool, or a controversial opinion backed by data. When journalists reference your work, you earn "Link Juice" that creates a permanent competitive moat.</p>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', borderRadius: '24px', border: '1px solid #C7D2FE' }}>
          <CWHeading level={3} style={{ color: '#3730A3', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#312E81', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>The Trust Moat.</strong> Backlinks are the hardest part of SEO to replicate. A competitor can copy your keywords and design, but they cannot easily "steal" the links you've earned from major publications. High authority links are a long-term asset that protects your rankings from algorithm updates.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #C7D2FE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#4F46E5', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>Digital PR Strategy:</strong> We help you create "Linkable Assets"—data studies, calculators, or infographics—that naturally attract mentions from industry blogs and news outlets.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Which backlink is more valuable?", options: ["One link from a high Domain Authority news site", "100 links from low quality directories", "A link from your own Facebook page"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module H: Data
export function Pillar5ModuleH({ onNext }) {
  return (
    <InteractiveLayout title="Module H: Actionable Metrics" subtitle="Ignoring vanity.">
      <div className="cw-prose">
        <p className="cw-text-body">
          <strong>Bounce Rate</strong> is dead. It is replaced by <strong>Engagement Rate</strong>. If someone spends 5 minutes reading your article and then leaves, that's a success, not a bounce.
        </p>

        <EngagementFunnelSimulator />

        <ScenarioToggle
          oldTitle="Vanity Metric"
          oldContent="'We got 10,000 hits!' (But 99% left instantly because the page was slow or irrelevant)."
          newTitle="Actionable Metric"
          newContent="'We got 100 engaged sessions who stayed for 3 mins and clicked our pricing page'."
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)', borderRadius: '24px', border: '1px solid #99F6E4' }}>
          <CWHeading level={3} style={{ color: '#0F766E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#134E4A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>ROI Transparency.</strong> Most SEO agencies report on "Clicks" because it's easy. We report on "Conversions" and "Engagement" because that's what pays the bills. Understanding where users drop off in your funnel allows you to fix 1% problems that have a 100% impact on bottom-line profit.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #99F6E4', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#14B8A6', marginTop: '2px' }}>➜</span>
                <span>
                  <strong>GA4 Custom Dashboards:</strong> We set up simplified reporting that ignores the noise and shows you exactly how much revenue your SEO efforts are generating.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Why is 'Engagement Rate' better than 'Bounce Rate'?", options: ["It looks nicer", "It accounts for users who read content without clicking further (positive intent)", "It is calculated by AI"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module I: Ecommerce
export function Pillar5ModuleI({ onNext }) {
  return (
    <InteractiveLayout title="Module I: The Index Bloat Killer" subtitle="Faceted Navigation.">
      <div className="cw-prose">
        <p className="cw-text-body">
          E-commerce sites often have thousands of filters (Red, Blue, Size 10). If Google indexes every possible combination, you get <strong>Index Bloat</strong>—the search engine gets lost in your junk pages and stops ranking your important ones.
        </p>

        <IndexBloatSimulator />

        <CWAlert type="warning" title="The Technical Fix">
          Use your <code>robots.txt</code> file to block the crawling of filtered URLs (e.g. <code>/products?color=*</code>). This forces Google to spend its "Crawl Budget" only on your high-value product and category pages.
        </CWAlert>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
          <CWHeading level={3} style={{ color: '#334155', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E293B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Inventory Visibility.</strong> If Google is busy crawling 10,000 "Red Size Large" combinations, it might miss the new product you just launched today. Solving Index Bloat ensures that your <em>entire</em> catalog is indexed and ready for customers to find.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#64748B', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ecommerce-solutions" style={{ color: '#64748B', textDecoration: 'underline' }}>E-commerce Solutions</a>: We specialize in technical SEO for Shopify, WooCommerce, and Custom Stores, ensuring your faceted navigation helps users without hurting your search presence.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is 'Index Bloat' caused by Faceted Navigation?", options: ["The site gets fat", "Google indexing thousands of filter combinations as separate pages", "Images being too big"], correctIndex: 1 }
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

export function Pillar5Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  // Local state handling if props missing
  const [localResponses, setLocalResponses] = useState({});
  const activeResponses = quizResponses || localResponses;
  const activeSetResponse = onSelect || ((qMvc, optIdx) => setLocalResponses(prev => ({ ...prev, [qMvc]: optIdx })));

  const questions = pillar5QuizQuestions;
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
          <CWHeading level={3}>Pillar 5 Complete!</CWHeading>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{scoreMessage}</p>
          <CWButton onClick={onFinish}>Continue to Certificate →</CWButton>
        </div>
      </CWCard>
    );
  }

  return (
    <QuizLayout title="Final Exam: SEO Mastery" currentStep={currentQuestionIndex + 1} totalSteps={questions.length}>
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

export function Pillar5Completion() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>🎓</h1>
      <CWHeading level={2}>SEO Master</CWHeading>
      <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '1rem auto' }}>
        You now understand how to speak Google's language. From Keyword Cannibalization to Index Bloat, you are ready to drive organic revenue.
      </p>
    </div>
  );
}
