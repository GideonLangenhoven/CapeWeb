import React, { useState, useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';
import { InteractiveLayout, QuizLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, BookInsight } from './CapeWebUI';

// ==========================================
// PILLAR 7 QUIZ DATA
// ==========================================
export const pillar7QuizQuestions = [
  {
    question: 'How does a Large Language Model (LLM) like GPT work fundamentally?',
    options: ['It Googles the answer', 'It predicts the next word (token) based on probability', 'It calls a human expert'],
    correctIndex: 1,
  },
  {
    question: 'What is "Prompt Engineering"?',
    options: ['Designing physical machines', 'The skill of crafting inputs to guide AI to the best output', 'Fixing computer bugs'],
    correctIndex: 1,
  },
  {
    question: 'in "Life 3.0", Max Tegmark defines Life 3.0 as beings who can redesign their own:',
    options: ['Software and Hardware', 'Clothing', 'Houses'],
    correctIndex: 0,
  },
  {
    question: 'What is a "Hallucination" in AI terms?',
    options: ['When the AI sees ghosts', 'When the AI confidently states a fact that is completely false', 'When the server crashes'],
    correctIndex: 1,
  },
  {
    question: 'Which tool is best suited for visual automation (connecting apps like LEGO)?',
    options: ['MS Paint', 'Zapier or Make.com', 'Notepad'],
    correctIndex: 1,
  },
  {
    question: 'What is "Code Interpreter" (or Advanced Data Analysis)?',
    options: ['An AI that speaks code', 'A feature allowing AI to write and execute Python code to analyze data/Excel files', 'A translation service'],
    correctIndex: 1,
  },
  {
    question: 'In AI image generation (Midjourney), what is an "Aspect Ratio" parameter?',
    options: ['--ar 16:9', '--high-quality', '--make-pretty'],
    correctIndex: 0,
  },
  {
    question: 'What is the "Centaur" model of work?',
    options: ['Half man, half horse', 'A human enhanced by AI tools specifically to outperform unenhanced humans', 'A chess opening'],
    correctIndex: 1,
  },
  {
    question: 'Why should you generally NOT use AI for final fact-checking?',
    options: ['It is too expensive', 'It can hallucinate dates and events', 'It is too slow'],
    correctIndex: 1,
  },
  {
    question: 'What is an "AI Agent"?',
    options: ['A spy', 'An AI system that can plan and execute multiple steps to achieve a goal autonomously', 'A support ticket'],
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

// Interactive: The Centaur Lever
function CentaurLever() {
  const [leverage, setLeverage] = useState(50);

  const output = Math.pow(leverage / 10, 2).toFixed(1);
  const cost = (100 - leverage).toFixed(0);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Interactive: The Leverage Gap</h3>
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="range"
          min="1" max="100"
          value={leverage}
          onChange={(e) => setLeverage(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#3B82F6' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B', marginTop: '0.5rem' }}>
          <span>PURE HUMAN</span>
          <span>THE CENTAUR</span>
          <span>PURE AI</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Weekly Output</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3B82F6' }}>{output}x</div>
        </div>
        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Friction / Effort</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F59E0B' }}>{cost}%</div>
        </div>
      </div>
      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#94A3B8' }}>
        {leverage < 30 && "Low output, high burnout risk. You are a manual laborer."}
        {leverage >= 30 && leverage <= 70 && "Optimal. You use AI to multiply your human soul."}
        {leverage > 70 && "High output, but low soul. Content sounds robotic."}
      </p>
    </div>
  );
}

// Interactive: Token Predictor Game
function TokenPredictorGame() {
  const [step, setStep] = useState(0);
  const [showProb, setShowProb] = useState(false);

  const sentences = [
    { start: "The CEO decided to ", end: "automate", probs: ["automate (85%)", "quit (5%)", "dance (10%)"] },
    { start: "Our best strategy is to ", end: "scale", probs: ["scale (92%)", "panic (3%)", "sleep (5%)"] }
  ];

  return (
    <div style={{ margin: '3rem 0', padding: '2.5rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', color: '#0F172A', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1rem' }}>The Probability Engine</h3>
      <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '2rem' }}>AI doesn't "think"—it guesses the next word based on percentage chance.</p>

      <div style={{ fontSize: '1.5rem', fontFamily: 'monospace', padding: '2rem', background: 'white', borderRadius: '16px', border: '2px dashed #CBD5E1', marginBottom: '2rem' }}>
        <span>{sentences[step].start}</span>
        <span style={{ color: '#3B82F6', fontWeight: 800, borderBottom: '2px solid #3B82F6' }}>
          {showProb ? sentences[step].end : '______'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => setShowProb(true)}
          style={{ padding: '0.8rem 2rem', borderRadius: '100px', background: '#3B82F6', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}
        >
          PREDICT NEXT TOKEN
        </button>
        {showProb && (
          <button
            onClick={() => { setStep((step + 1) % sentences.length); setShowProb(false); }}
            style={{ padding: '0.8rem 2rem', borderRadius: '100px', background: '#F1F5F9', color: '#0F172A', border: '1px solid #E2E8F0', fontWeight: 800, cursor: 'pointer' }}
          >
            NEXT SENTENCE
          </button>
        )}
      </div>

      {showProb && (
        <div style={{ marginTop: '2rem', animation: 'fadeIn 0.3s' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1rem' }}>TOP PROBABILITIES:</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {sentences[step].probs.map(p => (
              <span key={p} style={{ padding: '0.5rem 1rem', background: '#DBEAFE', color: '#1E40AF', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>{p}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Interactive: Prompt Refiner
function PromptRefiner() {
  const [tone, setTone] = useState('Professional');
  const [context, setContext] = useState(false);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Interactive: Prompt Engineering</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8', marginBottom: '1rem' }}>SET TONE</label>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {['Professional', 'Funny', 'Aggressive', 'Scientific'].map(t => (
              <button
                key={t}
                onClick={() => setTone(t)}
                style={{
                  padding: '0.8rem',
                  background: tone === t ? '#3B82F6' : '#1E293B',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8', marginBottom: '1rem' }}>ADD CONTEXT?</label>
          <button
            onClick={() => setContext(!context)}
            style={{
              width: '100%',
              padding: '1.5rem',
              background: context ? '#10B981' : '#1E293B',
              border: `2px ${context ? 'solid' : 'dashed'} ${context ? '#34D399' : '#475569'}`,
              borderRadius: '16px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {context ? '✅ CONTEXT ENABLED' : '❌ NO CONTEXT'}
          </button>
          <p style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#64748B' }}>
            Context includes: Goal, Target Audience, Constraints, and Examples.
          </p>
        </div>
      </div>

      <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px', border: '1px solid #334155' }}>
        <div style={{ fontSize: '0.7rem', color: '#64748B', marginBottom: '0.5rem' }}>AI OUTPUT (SIMULATED):</div>
        <div style={{ fontSize: '0.9rem', lineHeight: 1.6, color: context ? '#F8FAFC' : '#94A3B8' }}>
          {context ? (
            tone === 'Professional' ? "Based on our market analysis of busy professionals, here are three strategic initiatives to optimize your workflow..." :
              tone === 'Funny' ? "Look, your calendar is a dumpster fire. We're here to throw water on it. Here's the plan..." :
                tone === 'Aggressive' ? "STOP WASTING TIME. Every second you spend manual tasking is cash burning. Get the tool now." :
                  "The initial data set indicates a 40% variance in chronological efficiency when utilizing automated protocols..."
          ) : (
            "Here is a generic response that sounds like every other robot on the internet. I don't know who you are or what you want."
          )}
        </div>
      </div>
    </div>
  );
}

function TokenPredictionVisual() {
  const [word, setWord] = useState('');
  const sentence = "The cat sat on the ";

  useEffect(() => {
    const words = ["mat (80%)", "hat (10%)", "floor (5%)"];
    let i = 0;
    const interval = setInterval(() => {
      setWord(words[i]);
      i = (i + 1) % words.length;
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '16px', fontSize: '1.2rem', fontFamily: 'monospace', textAlign: 'center' }}>
      <span>{sentence}</span>
      <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{word}</span>
      <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '1rem' }}>
        The AI does not know what a "cat" is. It just calculates what word comes next mathematically.
      </p>
    </div>
  )
}

// Interactive: Support Triage Sim
function SupportTriageSim() {
  const [automation, setAutomation] = useState(0);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Interactive: The Support Triage</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.5rem' }}>HUMAN LOAD</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: automation > 70 ? '#10B981' : '#EF4444' }}>
            {100 - automation}%
          </div>
        </div>
        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.5rem' }}>AI DEFLECTION</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6' }}>
            {automation}%
          </div>
        </div>
      </div>

      <input
        type="range"
        min="0" max="95"
        value={automation}
        onChange={(e) => setAutomation(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: '#3B82F6', marginBottom: '1.5rem' }}
      />

      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#94A3B8' }}>
        {automation < 20 && "Humans are drowning in 'Where is my order?' tickets."}
        {automation >= 20 && automation <= 70 && "AI handles basic FAQs. Humans handle complex complaints."}
        {automation > 70 && "Maximum efficiency. Humans only step in for VIP exceptions."}
      </p>
    </div>
  );
}

// Interactive: Data Cruncher Visual
function DataCruncherVisual() {
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  const startAnalysis = () => {
    setAnalyzing(true);
    setDone(false);
    setTimeout(() => {
      setAnalyzing(false);
      setDone(true);
    }, 2000);
  };

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', color: '#0F172A', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1rem' }}>The Python Bridge</h3>
      <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '2rem' }}>AI can write code to analyze massive spreadsheets in seconds.</p>

      <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '1.5rem' }}>📄 CSV</div>
        <div style={{ fontSize: '1.5rem', color: analyzing ? '#3B82F6' : '#CBD5E1', animation: analyzing ? 'pulse 1s infinite' : 'none' }}>➜</div>
        <div style={{ padding: '1.2rem', background: '#0F172A', color: '#10B981', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {analyzing ? "import pandas as pd..." : "df.describe()"}
        </div>
        <div style={{ fontSize: '1.5rem', color: done ? '#10B981' : '#CBD5E1' }}>➜</div>
        <div style={{ padding: '1rem', background: 'white', border: '2px solid #10B981', borderRadius: '8px', fontSize: '1.5rem', opacity: done ? 1 : 0.3 }}>📊 CHART</div>
      </div>

      <button
        onClick={startAnalysis}
        disabled={analyzing}
        style={{ padding: '0.8rem 2rem', borderRadius: '100px', background: analyzing ? '#94A3B8' : '#0F172A', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}
      >
        {analyzing ? 'CRUNCHING DATA...' : 'REVEAL PROFIT TRENDS'}
      </button>

      {done && (
        <div style={{ marginTop: '1.5rem', color: '#166534', fontSize: '0.9rem', fontWeight: 600 }}>
          Insight Found: Products in the "Home" category have 40% higher ROI.
        </div>
      )}
    </div>
  );
}

// Interactive: Agent Task Chain
function AgentTaskChain() {
  const [step, setStep] = useState(-1);
  const steps = [
    { label: "RESEARCH", icon: "🔍", text: "Finding lead info..." },
    { label: "ANALYZE", icon: "🧠", text: "Filtering for relevance..." },
    { label: "DRAFT", icon: "✍️", text: "Writing personalized intro..." },
    { label: "EXECUTE", icon: "🚀", text: "Sending outreach email..." }
  ];

  useEffect(() => {
    if (step >= 0 && step < steps.length) {
      const timer = setTimeout(() => setStep(step + 1), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#0F172A', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>The Autonomous Workflow</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
        {steps.map((s, idx) => (
          <div key={idx} style={{ textAlign: 'center', opacity: step >= idx ? 1 : 0.2, transition: 'all 0.4s' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: step === idx ? '#3B82F6' : '#94A3B8' }}>{s.label}</div>
            <div style={{ height: '4px', background: step >= idx ? '#3B82F6' : '#334155', borderRadius: '10px', marginTop: '0.5rem' }} />
          </div>
        ))}
      </div>

      <div style={{ height: '60px', textAlign: 'center' }}>
        {step >= 0 && step < steps.length ? (
          <p style={{ color: '#3B82F6', fontWeight: 600, animation: 'fadeIn 0.3s' }}>{steps[step].text}</p>
        ) : step === steps.length ? (
          <p style={{ color: '#10B981', fontWeight: 800 }}>✅ TASK COMPLETED AUTOMATICALLY</p>
        ) : (
          <button
            onClick={() => setStep(0)}
            style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', background: '#3B82F6', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}
          >
            DEPLOY AGENT
          </button>
        )}
      </div>
    </div>
  );
}

// Interactive: Meeting Time Recovered
function MeetingTimeRecovered() {
  const [meetings, setMeetings] = useState(5);
  const timeSaved = (meetings * 15) / 60;

  return (
    <div style={{ margin: '3rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#0F172A' }}>The Focus Calculator</h3>
      <p style={{ color: '#64748B', marginBottom: '2rem' }}>How much brain-power are you wasting on transcription?</p>

      <div style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem' }}>
          <span>Meetings Per Week</span>
          <span>{meetings}</span>
        </div>
        <input
          type="range"
          min="1" max="25"
          value={meetings}
          onChange={(e) => setMeetings(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#3B82F6' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase' }}>Time Saved / Week</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10B981' }}>{timeSaved.toFixed(1)}h</div>
        </div>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase' }}>Notes Quality</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3B82F6' }}>100%</div>
        </div>
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748B' }}>
        By automating notes, you gain back half a day of deep work every month.
      </p>
    </div>
  );
}

function ZapierFlowVisual() {
  return (
    <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ padding: '1rem', background: '#F59E0B', color: 'white', borderRadius: '12px', width: '200px', textAlign: 'center', position: 'relative' }}>
        <strong>⚡ Trigger</strong>
        <div>New Lead (FB Ads)</div>
      </div>
      <div style={{ fontSize: '1.5rem' }}>⬇️</div>
      <div style={{ padding: '1rem', background: '#3B82F6', color: 'white', borderRadius: '12px', width: '200px', textAlign: 'center' }}>
        <strong>Action 1</strong>
        <div>Add to Google Sheet</div>
      </div>
      <div style={{ fontSize: '1.5rem' }}>⬇️</div>
      <div style={{ padding: '1rem', background: '#EF4444', color: 'white', borderRadius: '12px', width: '200px', textAlign: 'center' }}>
        <strong>Action 2</strong>
        <div>Slack Team "New Deal!"</div>
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
// PILLAR 7 MODULES A-I
// ==========================================

// Module A: AI Strategy
export function Pillar7ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: The Centaur Model" subtitle="Human + AI &gt; AI.">
      <div className="cw-prose">
        <p className="cw-text-body">
          The future belongs to the **Centaur**. In chess, a Centaur is a team of a Human + AI. This combination consistently outperforms both pure AI and pure Humans. Your goal is to use AI for the "Heavy Lifting" (Automation) while you focus on the "Heart" (Strategy & Soul).
        </p>

        <CentaurLever />

        <ScenarioToggle
          oldTitle="The Purist 👴"
          oldContent="'I don't use AI. It is cheating.' (Writes 1 email per hour, laboriously researching every fact manually)."
          newTitle="The Centaur 🤖"
          newContent="'I use AI to draft, and I edit for soul.' (Writes 10 emails per hour, using AI to synthesize research in seconds)."
        />

        <BookInsight title="The Future of Intelligence" author="Max Tegmark" book="Life 3.0" color="#3B82F6">
          <p>"Life 3.0 designs its own software." We are entering an era where you can build tools without coding perfectly.</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '24px', border: '1px solid #BFDBFE' }}>
          <CWHeading level={3} style={{ color: '#1E40AF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E3A8A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Algorithmic Advantage.</strong> Your competitors are already using AI to lower their costs. If you don't adopt the Centaur model, your margins will slowly be eaten by more efficient operators. AI doesn't replace you; a human using AI replaces a human who doesn't.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BFDBFE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ai-agents-sales-team" style={{ color: '#3B82F6', textDecoration: 'underline' }}>AI Sales Team</a>: We build custom GPT-powered sales reps that act as Centaurs for your business—handling the volume of "Qualified" leads while your human sales team focuses on closing high-ticket deals.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the 'Centaur' model in AI?", options: ["A mythical creature", "A collaboration where Human + AI outperforms either alone", "AI replacing humans entirely"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module B: LLM Basics
export function Pillar7ModuleB({ onNext }) {
  return (
    <InteractiveLayout title="Module B: How LLMs Work" subtitle="The stochastic parrot.">
      <div className="cw-prose">
        <p className="cw-text-body">
          ChatGPT does not "know" anything in the human sense. It is a mathematical model trained on human language to predict the **Next Token (Word)**. It is essentially a "Stochastic Parrot"—highly sophisticated autocomplete.
        </p>

        <TokenPredictorGame />

        <CWAlert type="warning" title="The Hallucination Risk">
          Because LLMs are probabilistic, they can lie confidently. They will invent court cases, citations, and names just to complete a pattern that looks "correct" to the algorithm.
        </CWAlert>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', borderRadius: '24px', border: '1px solid #FDE68A' }}>
          <CWHeading level={3} style={{ color: '#92400E', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#78350F', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Risk Management.</strong> If you use AI for legal contracts or historical fact-checking without critical oversight, you are playing Russian Roulette with your brand's credibility. Understanding "how the engine works" allows you to use it for brainstorming and structure, while keeping humans responsible for accuracy.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FDE68A', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#D97706', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=brand-wikis-knowledge-bases" style={{ color: '#D97706', textDecoration: 'underline' }}>Brand Wikis</a>: We use <strong>Retrieval-Augmented Generation (RAG)</strong> to ground your AI in your own company's verified documents, effectively killing hallucinations and ensuring your AI "knows" your facts.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "How does an LLM generate text?", options: ["It thinks like a human", "It predicts the next token based on probability patterns", "It searches Google immediately"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module C: Writing (Copy)
export function Pillar7ModuleC({ onNext }) {
  return (
    <InteractiveLayout title="Module C: Prompt Engineering" subtitle="Garbage In, Garbage Out.">
      <div className="cw-prose">
        <p className="cw-text-body">
          The difference between a robot-sounding email and a conversion-focused masterpiece is the quality of the <strong>Context</strong> you provide. Prompt engineering is the art of giving the AI a "Role," a "Goal," and "Constraints."
        </p>

        <PromptRefiner />

        <ScenarioToggle
          oldTitle="Lazy Prompt"
          oldContent="'Write an email about coffee.' Result: 'I am writing to tell you about our coffee. It is good. Buy now.' (Robotic and generic)."
          newTitle="Context Prompt"
          newContent="'Act as a world-class copywriter. Write a 100-word email for a new cold brew. Target audience: tired parents with zero time. Tone: Funny and empathetic.' Result: 'We know you haven't slept since 2019. Here's a cold-processed hug in a bottle...'"
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#9D174D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#831843', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Operational Velocity.</strong> Masterful prompting allows your marketing team to produce a week's worth of content in an hour. By creating a "Prompt Library" for your brand, you ensure that every AI output sounds like your best copywriter, regardless of who is typing the request.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#DB2777', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=content-that-converts" style={{ color: '#DB2777', textDecoration: 'underline' }}>Content that Converts</a>: We don't just write copy; we build "Prompt Engines" for your brand so your team can generate high-quality, high-soul content at scale without us.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What acts as the biggest lever for quality AI output?", options: ["The internet speed", "The quality of the Prompt (Context)", "The time of day"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module D: Design (Midjourney)
export function Pillar7ModuleD({ onNext }) {
  return (
    <InteractiveLayout title="Module D: Generative Art" subtitle="Imagine anything.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Tools like **Midjourney** and **DALL-E 3** allow you to create high-end brand assets, product mockups, and website visuals in seconds. You are no longer limited by your ability to draw or your budget for stock photos.
        </p>

        <CWCard style={{ background: '#0F172A', color: '#fff', padding: '2rem', border: '1px solid #334155' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', marginBottom: '1rem' }}>MIDJOURNEY PROMPT EXAMPLE:</div>
          <code style={{ fontSize: '1rem', color: '#3B82F6' }}>/imagine prompt: a minimalist logo for a SaaS company, vector art, flat design, white background, high resolution --ar 16:9 --v 6.0</code>
        </CWCard>

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', borderRadius: '24px', border: '1px solid #DDD6FE' }}>
          <CWHeading level={3} style={{ color: '#5B21B6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎨</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#4C1D95', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Brand Velocity.</strong> High-quality visuals are the "Entry Fee" for modern trust. Generative AI allows you to test 10 different visual directions for a landing page in the time it used to take to brief a designer. It de-risks the creative process and explodes your output of high-performing ad creative.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #DDD6FE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#8B5CF6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=branding-team" style={{ color: '#8B5CF6', textDecoration: 'underline' }}>Branding Team</a>: We use advanced generative workflows to create unique, high-conversion visual assets that make your brand look like a billion-dollar company at a fraction of the cost.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is a major benefit of AI image generation for startups?", options: ["It is free forever", "Creating custom, high-quality assets without expensive stock photo subscriptions", "It can print paper"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module E: No-Code Auto (Zapier)
export function Pillar7ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: Automation Pipelines" subtitle="Connecting the LEGO bricks.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Automation is the "Digital Glue" of your business. Tools like **Zapier** and **Make** allow you to connect different apps—making data flow between your website, CRM, and communication tools without any human intervention.
        </p>

        <ZapierFlowVisual />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', borderRadius: '24px', border: '1px solid #FED7AA' }}>
          <CWHeading level={3} style={{ color: '#9A3412', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#7C2D12', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Scale without Headcount.</strong> Most businesses hire humans to move data between spreadsheets and apps. Automation allows you to handle 10x the volume with 0x the additional staff. It ensures that <strong>no lead is ever forgotten</strong> and no customer falls through the cracks.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FED7AA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EA580C', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=automation-systems" style={{ color: '#EA580C', textDecoration: 'underline' }}>Automation Systems</a>: We map your entire customer journey and build the automated "Pipes" that handle everything from lead-capture to invoice-generation, freeing you to work <strong>on</strong> the business instead of <strong>in</strong> it.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is a 'Trigger' in automation?", options: ["Something that makes you angry", "The event that starts the automation workflow (e.g. New Email)", "The end result"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module F: Support (Chatbots)
export function Pillar7ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: AI Support" subtitle="Instant answers.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Modern customers expect answers in seconds, not hours. AI Chatbots, when properly integrated with your company's knowledge base, can handle 80% of routine queries with 100% accuracy, 24/7.
        </p>

        <SupportTriageSim />

        <ScenarioToggle
          oldTitle="Human Support"
          oldContent="Reply time: 24 hours. Cost: High. Consistency: Variable based on agent's mood. Leads lost: 40% due to slow response."
          newTitle="AI Support"
          newContent="Reply time: 1.5 seconds. Cost: Low. Consistency: Perfect alignment with brand voice. Leads lost: 0%."
        />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #A7F3D0' }}>
          <CWHeading level={3} style={{ color: '#065F46', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💬</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#064E3B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>The Trust Gap.</strong> Every minute a potential customer waits for a reply is a minute they spend looking at your competitor. AI support isn't about "replacing humans"; it's about being <strong>present</strong> when your customer is ready to buy—whether that's at 2 PM or 2 AM.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ai-agents-sales-team" style={{ color: '#10B981', textDecoration: 'underline' }}>AI Sales Team</a>: We build "Intelligent Concierges" that don't just answer questions—they book appointments, qualify leads, and close sales directly inside your website or WhatsApp.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the primary role of an AI Chatbot?", options: ["To annoy customers", "To handle repetitive Tier 1 queries instantly", "To replace all humans"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module G: Data (Code Interpreter)
export function Pillar7ModuleG({ onNext }) {
  return (
    <InteractiveLayout title="Module G: Data Analysis" subtitle="Your personal Data Scientist.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Modern AI tools (like ChatGPT's Advanced Data Analysis) can write and execute Python code to crunch massive datasets. You can upload your sales spreadsheets and ask: "Which marketing channel has the highest ROI?" or "Predict our cash flow for next month."
        </p>

        <DataCruncherVisual />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
          <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📊</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#075985', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Precision Decision Making.</strong> Most businesses run on "Gut Feel." AI-driven data analysis allows you to find the 20% of your products or customers that generate 80% of your profit. It's like having a Harvard-educated data scientist sitting in your pocket, ready to audit your business 24/7.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BAE6FD', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#0EA5E9', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-monitoring" style={{ color: '#0EA5E9', textDecoration: 'underline' }}>Performance Monitoring</a>: We set up automated data pipelines that feed your sales data into AI analyzers, giving you a live "Profit Dashboard" that tells you exactly where to invest your next Marketing Rand.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "How does ChatGPT analyze data efficiently?", options: ["It reads it slowly", "It writes and executes Python code to crunch numbers", "It guesses"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module H: Agents
export function Pillar7ModuleH({ onNext }) {
  return (
    <InteractiveLayout title="Module H: Autonomous Agents" subtitle="Goal-directed AI.">
      <div className="cw-prose">
        <p className="cw-text-body">
          While a chatbot *replies* to you, an <strong>Agent</strong> executes for you. Agents are AI systems that can plan, use tools (like a browser or an email client), and perform multi-step tasks autonomously to reach a goal.
        </p>

        <AgentTaskChain />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)', borderRadius: '24px', border: '1px solid #CBD5E1' }}>
          <CWHeading level={3} style={{ color: '#334155', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🤖</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E293B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>The Future of Labor.</strong> We are moving from "Human-in-the-loop" (you tell AI to do one thing) to "Human-on-the-loop" (you tell an Agent a goal, and it performs 10 tasks to get there). Autonomous Agents allow you to run entire departments—like lead research or content distribution—with minimal oversight.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #CBD5E1', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#475569', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ai-agents" style={{ color: '#475569', textDecoration: 'underline' }}>AI Agents</a>: We build custom agents that live on your servers and perform repetitive business tasks—from scraping competitor pricing to personalized outreach—so your team can focus on relationships.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What distinguishes an 'Agent' from a 'Chatbot'?", options: ["The price", "Autonomy: Agents can plan and execute multiple steps to achieve a goal", "Agents have voices"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module I: Productivity
export function Pillar7ModuleI({ onNext }) {
  return (
    <InteractiveLayout title="Module I: Meeting Intelligence" subtitle="Never take notes again.">
      <div className="cw-prose">
        <p className="cw-text-body">
          The average founder spends 10+ hours a week in meetings. By using AI "Recorders" (like Otter or Fireflies), you can automate transcription, indexing, and action-item summaries—freeing your brain to actually *participate* in the conversation.
        </p>

        <MeetingTimeRecovered />

        {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
          <CWHeading level={3} style={{ color: '#334155', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎙️</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Bandwidth Recovery.</strong> As a founder, your most valuable asset is your "Deep Work" time. Meeting automation doesn't just save you from taking notes; it creates a searchable "Corporate Brain" where you can recall exactly what was promised to a client 6 months ago in 2 seconds.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#475569', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=care-plans" style={{ color: '#475569', textDecoration: 'underline' }}>Care Plans</a>: We manage the complexity of your AI stack. From ensuring your meeting recorders are synced to your CRM to training your team on prompt libraries, we handle the tech so you can focus on the growth.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the benefit of AI meeting assistants?", options: ["They interrupt you", "They transcribe and banish the need for manual note-taking", "They make coffee"], correctIndex: 1 }
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

export function Pillar7Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  // Local state handling if props missing
  const [localResponses, setLocalResponses] = useState({});
  const activeResponses = quizResponses || localResponses;
  const activeSetResponse = onSelect || ((qMvc, optIdx) => setLocalResponses(prev => ({ ...prev, [qMvc]: optIdx })));

  const questions = pillar7QuizQuestions;
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
          <CWHeading level={3}>AI Architect</CWHeading>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{scoreMessage}</p>
          <CWButton onClick={onFinish}>Continue to Certificate →</CWButton>
        </div>
      </CWCard>
    );
  }

  return (
    <QuizLayout title="Final Exam: AI Automation" currentStep={currentQuestionIndex + 1} totalSteps={questions.length}>
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

export function Pillar7Completion() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>🤖</h1>
      <CWHeading level={2}>AI Architect</CWHeading>
      <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '1rem auto' }}>
        You now wield the most powerful tools in history. Use them to multiply your output, not just to cheat on homework.
      </p>
    </div>
  );
}
