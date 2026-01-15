import React, { useState, useEffect, useRef } from 'react';
import { VideoReferenceCard } from './VideoReferenceCard';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';
import { InteractiveLayout, QuizLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, BookInsight } from './CapeWebUI';

// ==========================================
// PILLAR 7 QUIZ DATA
// ==========================================
export const pillar7QuizQuestions = [
  {
    question: 'You ask ChatGPT for a biography of a local CEO. It confidently tells you he won a Nobel Prize in 1999 (which is false). What is this error called?',
    options: ['A Glitch', 'A Hallucination', 'A Lie'],
    correctIndex: 1,
  },
  {
    question: 'You want to automatically save every Gmail attachment labeled "Invoice" directly to a Dropbox folder, but you don\'t know how to code. What tool solves this?',
    options: ['Photoshop', 'Zapier / Make.com', 'Microsoft Word'],
    correctIndex: 1,
  },
  {
    question: 'You ask AI to "Write a email". It gives you a boring template. You change the input to "Act as a negotiation expert, keep it under 50 words, tone is strict". The result is perfect. What skill did you use?',
    options: ['Prompt Engineering (Persona & Constraints)', 'Coding', 'Hacking'],
    correctIndex: 0,
  },
  {
    question: 'You paste a sensitive, confidential company client list into the free public version of ChatGPT to "format it nicely". What is the risk?',
    options: ['None', 'Data Leakage (Your data might be used to train the public model)', 'The internet breaks'],
    correctIndex: 1,
  },
  {
    question: 'You give an AI a goal: "Plan a holiday". It autonomously searches flights, books a hotel, and adds it to your calendar without you clicking anything else. What is this capability called?',
    options: ['A Chatbot', 'An AI Agent', 'A Virus'],
    correctIndex: 1,
  },
  {
    question: 'You need a unique photo of a "Cyberpunk Ostrich" for a presentation. You don\'t have a camera or a costume. You type "/imagine" into Midjourney. What are you using?',
    options: ['Generative AI (Text-to-Image)', 'Stock Photography', 'Photoshop'],
    correctIndex: 0,
  },
  {
    question: 'You upload a messy Excel file with 10,000 rows of sales data. You ask the AI to "Find the top 3 products and make a chart". It writes code and gives you the graph. What feature is this?',
    options: ['Magic Switch', 'Code Interpreter / Advanced Data Analysis', 'Spell Check'],
    correctIndex: 1,
  },
  {
    question: 'Designer A creates one logo manually in 4 hours. Designer B uses AI to generate 50 concepts in 10 minutes, then manually refines the best one. Designer B wins. What model is this?',
    options: ['Cheating', 'The Centaur / Cyborg Model (Human + AI)', 'Lazy Design'],
    correctIndex: 1,
  },
  {
    question: 'You paste a 500-page PDF legal contract into a basic AI model and ask for a summary of the last page. It answers incorrectly because it "forgot" the beginning. What limit did you hit?',
    options: ['The Context Window', 'The RAM limit', 'The Battery'],
    correctIndex: 0,
  },
  {
    question: 'Your boss fires the entire support team because "AI is free". Two months later, customers are furious because the bot can\'t solve complex emotional problems. What lesson was missed?',
    options: ['AI is smarter than humans', 'AI should be a Co-pilot (Augmentation), not always an Auto-pilot (Replacement)', 'Robots are evil'],
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

// ==========================================
// PREMIUM INTERACTIVE VISUALS (9/10 QUALITY)
// ==========================================

function CentaurModelVisual() {
  const [mode, setMode] = useState('human');

  return (
    <div style={{ padding: '2rem', background: '#F8FAFC', borderRadius: '24px', margin: '2rem 0', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {['human', 'ai', 'centaur'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ padding: '0.8rem 1.5rem', borderRadius: '100px', border: 'none', background: mode === m ? '#0F172A' : 'white', color: mode === m ? 'white' : '#64748B', cursor: 'pointer', fontWeight: 800, transition: 'all 0.3s', boxShadow: mode === m ? '0 10px 20px -5px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.05)' }}>
            {m === 'human' ? '👨‍💼 Human Only' : m === 'ai' ? '🤖 AI Only' : '🦄 Centaur Team'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ flex: 1, textAlign: 'center', opacity: mode === 'ai' ? 0.3 : 1, filter: mode === 'ai' ? 'grayscale(100%)' : 'none', transition: 'all 0.5s' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👨‍🎨</div>
          <div style={{ fontWeight: 800, color: '#334155' }}>Creativity</div>
          <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Strategy & Soul</div>
        </div>

        <div style={{ fontSize: '2rem', color: '#94A3B8' }}>{mode === 'centaur' ? '+' : 'vs'}</div>

        <div style={{ flex: 1, textAlign: 'center', opacity: mode === 'human' ? 0.3 : 1, filter: mode === 'human' ? 'grayscale(100%)' : 'none', transition: 'all 0.5s' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚡</div>
          <div style={{ fontWeight: 800, color: '#334155' }}>Speed</div>
          <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Scale & Grunt Work</div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: mode === 'centaur' ? '#F0F9FF' : '#F1F5F9', borderRadius: '16px', textAlign: 'center', border: mode === 'centaur' ? '2px solid #38BDF8' : '2px solid transparent', transition: 'all 0.3s' }}>
        <h4 style={{ margin: '0 0 0.5rem', color: mode === 'centaur' ? '#0369A1' : '#475569' }}>
          {mode === 'human' ? 'Outcome: Slow, but soulful.' : mode === 'ai' ? 'Outcome: Fast, but generic.' : 'Outcome: The best of both worlds. 10x Speed, 100% Soul.'}
        </h4>
      </div>
    </div>
  )
}

function TokenPredictionVisual() {
  const [step, setStep] = useState(0);
  const words = ["The", "cat", "sat", "on", "the", "mat"];

  useEffect(() => {
    const i = setInterval(() => setStep(s => (s + 1) % (words.length + 1)), 1500);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{ padding: '2rem', background: '#1E293B', borderRadius: '24px', margin: '2rem 0', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', color: 'white' }}>
      <h4 style={{ textAlign: 'center', color: '#94A3B8', marginBottom: '2rem' }}>LLM Brain Simulation</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', minHeight: '60px' }}>
        {words.slice(0, step).map((w, i) => (
          <span key={i} style={{ padding: '0.5rem 1rem', background: '#334155', borderRadius: '8px', animation: 'popIn 0.3s' }}>{w}</span>
        ))}
        {step < words.length && (
          <span style={{ padding: '0.5rem 1rem', border: '2px dashed #64748B', borderRadius: '8px', color: '#64748B', opacity: 0.5 }}>
            {words[step]}?
            <div style={{ position: 'absolute', top: '-20px', fontSize: '0.7rem', color: '#22D3EE' }}>98% prob</div>
          </span>
        )}
      </div>
      <style>{`@keyframes popIn { from { transform: scale(0); opacity:0; } to { transform: scale(1); opacity:1; } }`}</style>
    </div>
  )
}

function PromptEngineeringVisual() {
  const [level, setLevel] = useState(1);
  return (
    <div style={{ padding: '2rem', background: '#FDF4FF', borderRadius: '24px', margin: '2rem 0', border: '1px solid #F0ABFC' }}>
      <h4 style={{ textAlign: 'center', color: '#86198F', marginBottom: '2rem' }}>Prompt Quality Slider</h4>
      <input type="range" min="1" max="3" value={level} onChange={e => setLevel(Number(e.target.value))} style={{ width: '100%', marginBottom: '2rem', accentColor: '#D946EF' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <div style={{ fontWeight: 800, color: '#86198F', marginBottom: '0.5rem' }}>Input (You)</div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #E879F9', minHeight: '120px', fontSize: '0.9rem' }}>
            {level === 1 && '"Write an email."'}
            {level === 2 && '"Write a sales email for coffee."'}
            {level === 3 && '"Act as a Copywriter. Write a witty, 50-word sales email for \'RocketFuel\' coffee targeting sleepy developers."'}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 800, color: '#86198F', marginBottom: '0.5rem' }}>Output (AI)</div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #E879F9', minHeight: '120px', fontSize: '0.9rem', fontStyle: 'italic', color: '#4B5563' }}>
            {level === 1 && '"Subject: Hello. Here is an email about things..." (Boring 😴)'}
            {level === 2 && '"Buy our coffee. It is good and hot. Drink it today." (Generic 😐)'}
            {level === 3 && '"Subject: 404 Sleep Not Found. ☕ Code broken? Brain foggy? RocketFuel compiles your energy instantly. Deploy to production now." (Gold 🏆)'}
          </div>
        </div>
      </div>
    </div>
  )
}

function MidjourneyVisual() {
  return (
    <div style={{ padding: '2rem', background: '#111827', borderRadius: '24px', margin: '2rem 0', color: 'white', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#22D3EE', color: 'black', borderRadius: '100px', fontWeight: 800, fontSize: '0.8rem', marginBottom: '1.5rem' }}>TEXT-TO-IMAGE ENGINE</div>
      <div style={{ fontSize: '1.2rem', fontFamily: 'monospace', color: '#E2E8F0', marginBottom: '1.5rem', background: '#374151', padding: '1rem', borderRadius: '12px' }}>
        /imagine prompt: <span style={{ color: '#F472B6' }}>cyberpunk neon city</span>, <span style={{ color: '#38BDF8' }}>cinematic lighting</span>
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ width: '80px', height: '80px', background: `linear-gradient(${i * 45}deg, #3B82F6, #EC4899)`, borderRadius: '12px', opacity: 0.8 }} />
        ))}
      </div>
      <p style={{ marginTop: '1.5rem', color: '#94A3B8', fontSize: '0.9rem' }}>Infinite assets. Zero copyright fees.</p>
    </div>
  )
}

function ZapierFlowVisual() {
  const [running, setRunning] = useState(false);

  return (
    <div style={{ padding: '2rem', background: '#FFF7ED', borderRadius: '24px', margin: '2rem 0', border: '1px solid #FFEDD5' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h4 style={{ margin: 0, color: '#9A3412' }}>Automation Pipeline</h4>
        <button onClick={() => setRunning(true)} style={{ padding: '0.5rem 1.5rem', background: '#EA580C', color: 'white', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 800 }}>
          {running ? 'Running...' : '▶ Run Trigger'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative' }}>
        <div style={{ flex: 1, padding: '1.5rem', background: 'white', borderRadius: '16px', border: '2px solid #FDCA92', textAlign: 'center', zIndex: 2 }}>
          <div style={{ fontSize: '2rem' }}>📧</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#9A3412' }}>New Lead</div>
        </div>

        <div style={{ width: '50px', height: '4px', background: '#FED7AA', position: 'relative' }}>
          {running && <div style={{ width: '10px', height: '10px', background: '#EA580C', borderRadius: '50%', position: 'absolute', top: '-3px', animation: 'flow 1s linear forwards' }} />}
        </div>

        <div style={{ flex: 1, padding: '1.5rem', background: 'white', borderRadius: '16px', border: '2px solid #FDCA92', textAlign: 'center', zIndex: 2 }}>
          <div style={{ fontSize: '2rem' }}>📊</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#9A3412' }}>Add to CRM</div>
        </div>

        <div style={{ width: '50px', height: '4px', background: '#FED7AA', position: 'relative' }}>
          {running && <div style={{ width: '10px', height: '10px', background: '#EA580C', borderRadius: '50%', position: 'absolute', top: '-3px', animation: 'flow 1s linear 1s forwards' }} />}
        </div>

        <div style={{ flex: 1, padding: '1.5rem', background: 'white', borderRadius: '16px', border: '2px solid #FDCA92', textAlign: 'center', zIndex: 2 }}>
          <div style={{ fontSize: '2rem' }}>💬</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#9A3412' }}>Slack Team</div>
        </div>
      </div>
      <style>{`@keyframes flow { from { left:0; } to { left:100%; } }`}</style>
    </div>
  )
}

function ChatbotTrainingVisual() {
  return (
    <div style={{ padding: '2rem', background: '#F0FDFA', borderRadius: '24px', margin: '2rem 0', border: '1px solid #CCFBF1' }}>
      <h4 style={{ textAlign: 'center', color: '#0F766E', marginBottom: '1.5rem' }}>How Custom Chatbots Work</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ flex: 1, padding: '1rem', background: 'white', border: '1px solid #99F6E4', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem' }}>📄</div>
          <div style={{ fontSize: '0.8rem', color: '#115E59' }}>Your PDFs</div>
        </div>
        <div style={{ fontSize: '1.5rem', color: '#14B8A6' }}>➜</div>
        <div style={{ flex: 1, padding: '1rem', background: '#0D9488', color: 'white', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem' }}>🧠</div>
          <div style={{ fontSize: '0.8rem' }}>Vector DB</div>
        </div>
        <div style={{ fontSize: '1.5rem', color: '#14B8A6' }}>➜</div>
        <div style={{ flex: 1, padding: '1rem', background: 'white', border: '1px solid #99F6E4', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem' }}>🤖</div>
          <div style={{ fontSize: '0.8rem', color: '#115E59' }}>Smart Answer</div>
        </div>
      </div>
    </div>
  )
}

function AnalysisVisual() {
  return (
    <div style={{ padding: '2rem', background: '#F3F4F6', borderRadius: '24px', margin: '2rem 0', border: '1px solid #E5E7EB', display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: '0.5rem', background: 'white', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '0.5rem', border: '1px solid #D1D5DB' }}>sales_data.csv loaded...</div>
        <div style={{ padding: '0.5rem', background: 'white', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '0.5rem', border: '1px solid #D1D5DB' }}>running python analysis...</div>
        <div style={{ padding: '0.5rem', background: '#DCFCE7', color: '#166534', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', border: '1px solid #86EFAC' }}>Done.</div>
      </div>
      <div style={{ flex: 1, height: '100px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
        {[40, 70, 50, 90, 60, 80].map((h, i) => (
          <div key={i} style={{ flex: 1, height: h + '%', background: '#3B82F6', borderRadius: '4px 4px 0 0' }} />
        ))}
      </div>
    </div>
  )
}

function AgentLoopVisual() {
  return (
    <div style={{ padding: '2rem', background: '#312E81', borderRadius: '24px', margin: '2rem 0', color: 'white' }}>
      <h4 style={{ textAlign: 'center', color: '#A5B4FC', margin: '0 0 1.5rem' }}>Autonomous Agent Loop</h4>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        {['Plan', 'Execute', 'Critique', 'Refine'].map((step, i) => (
          <div key={step} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed #6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', background: i === 1 ? '#4338CA' : 'transparent', boxShadow: i === 1 ? '0 0 20px #4338CA' : 'none' }}>
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}

function MeetingVisual() {
  return (
    <div style={{ padding: '2rem', background: '#FDF2F8', borderRadius: '24px', margin: '2rem 0', border: '1px solid #FBCFE8', textAlign: 'center' }}>
      <h4 style={{ color: '#DB2777', margin: '0 0 1rem' }}>The AI Scribe</h4>
      <div style={{ display: 'inline-block', padding: '1rem 2rem', background: 'white', borderRadius: '12px', border: '1px solid #F9A8D4', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ fontWeight: 800, color: '#831843' }}>Summary:</div>
        <ul style={{ textAlign: 'left', fontSize: '0.9rem', color: '#9D174D', paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
          <li>Action: John to email client.</li>
          <li>Decision: Budget approved.</li>
          <li>Next Step: Meet on Friday.</li>
        </ul>
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
// PILLAR 7 MODULES A-I
// ==========================================

// Module A: AI Strategy
export function Pillar7ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: The Centaur Model" subtitle="Human + AI > AI.">
      <div className="cw-prose">
        <p className="cw-text-body">
          In chess, a "Centaur" is a team of a Human + AI. This team consistently beats pure AI and pure Humans.
          Your goal is to use AI to handle the boring 80%, so you can focus on the creative 20%.
        </p>

        <VideoReferenceCard
          videoId="ZOOAqs2wXjk"
          start={0}
          title="The Centaur Phase Explained"
          description="Why Human + AI outperforms AI alone."
        />

        <CentaurModelVisual />

        <BookInsight title="The Future of Intelligence" author="Max Tegmark" book="Life 3.0" color="#3B82F6">
          <p>"Life 3.0 designs its own software." We are entering an era where you can build tools without coding perfectly.</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
          <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#0C4A6E', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            You don't need to be a coder to build software anymore. You just need to be a good "Project Manager."
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
              <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '0.2rem' }}>1. Massive Cost Savings</div>
              <div style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>Tasks that used to require a R50,000 consultant (coding a script, writing SEO blogs) can now be drafted by AI for R0.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
              <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '0.2rem' }}>2. Speed to Market</div>
              <div style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>The business that uses AI moves 10x faster. While your competitor is brainstorming, you are launching.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BAE6FD', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#0369A1', fontSize: '1.1rem' }}>🚀 How CapeWeb Helps You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We don't just build sites; we build AI-ready infrastructure.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>AI Strategy Consulting:</strong> We help you identify which boring parts of your business can be automated safely.</span>
              </div>
            </div>
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
          ChatGPT does not "know" anything. It is a mathematical model predicting the <strong>Next Token (Word)</strong>.
          It is a very fancy autocomplete.
        </p>

        <VideoReferenceCard
          videoId="xNRgycrPQFY"
          start={0}
          title="Next Token Prediction"
          description="Understanding how Large Language Models actually 'think'."
        />

        <TokenPredictionVisual />

        <CWAlert type="warning" title="Hallucinations">
          Because it is probabilistic, it can lie confidently. It will invent court cases, citations, and facts just to complete the pattern.
        </CWAlert>

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
          <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#0C4A6E', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            If you trust AI blindly, you will get burned. It is a "Reasoning Engine," not a "Fact Database."
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
              <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '0.2rem' }}>1. The Liability Risk</div>
              <div style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>Lawyers have been disbarred for citing fake cases invented by ChatGPT. Always verify the output.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
              <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '0.2rem' }}>2. Data Privacy</div>
              <div style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>Never paste client data into the free version of ChatGPT. It trains on your inputs.</div>
            </div>
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
          To get great writing, you need <strong>Context</strong>.
        </p>

        <VideoReferenceCard
          videoId="uDIW34h8cmM"
          start={0}
          title="Matthew Berman: Prompt Engineering"
          description="Mastering the art of talking to AI models for better output."
        />

        <PromptEngineeringVisual />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
          <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#0C4A6E', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            AI is a mirror. It reflects the quality of your instructions. If your emails are generic, it's because your prompts are generic.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BAE6FD', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#0369A1', fontSize: '1.1rem' }}>🚀 How CapeWeb Helps You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We engineer the prompts into your dashboard.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Content Wizards:</strong> Our CMS comes with pre-built AI fields. You just type "New Coffee" and we generate the SEO title, description, and social posts using expert prompts hidden in the code.</span>
              </div>
            </div>
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
          Tools like <strong>Midjourney</strong> can create photorealistic assets for your website. No need to pay for stock photos.
        </p>

        <VideoReferenceCard
          videoId="7z7OxhNP6Qs"
          start={0}
          title="Midjourney Full Guide"
          description="A crash course in generative art creation."
        />

        <MidjourneyVisual />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
          <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#0C4A6E', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Visuals sell. But professional photography is expensive and stock photos look fake.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
              <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '0.2rem' }}>1. Infinite Inventory</div>
              <div style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>Need a photo of a "purple cow on the moon" for a campaign? It takes 60 seconds and costs $0.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
              <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '0.2rem' }}>2. Licensing Safety</div>
              <div style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>Most AI art generation (like Midjourney paid plan) gives you full commercial rights. No more Getty Images lawsuits.</div>
            </div>
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
          <strong>Zapier</strong> allows you to clone yourself. You can build a "Sales Team" that runs 24/7 for $20/month.
          Trigger &rarr; Action &rarr; Action.
        </p>

        <VideoReferenceCard
          videoId="agqeELAmcB4"
          start={30}
          title="Zapier for Beginners 2025"
          description="Automating your business workflows without writing code."
        />

        <ZapierFlowVisual />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
          <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#0C4A6E', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            The richest businesses are the ones that disconnect "Revenue" from "Hours Worked".
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
              <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '0.2rem' }}>1. Zero Lead Leakage</div>
              <div style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>Humans forget to copy-paste leads. Automations don't. Every lead gets a text message within 5 seconds.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
              <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '0.2rem' }}>2. Scalability</div>
              <div style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>An automation handles 1 lead or 10,000 leads for the same price. A human team needs to hire 5 more people.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BAE6FD', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#0369A1', fontSize: '1.1rem' }}>🚀 How CapeWeb Helps You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We are Zapier Experts.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Integration Standard:</strong> Every form we build pushes data to a webhook. We can connect your website to your CRM, Slack, or Google Sheets instantly.</span>
              </div>
            </div>
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
        <p>Customers hate waiting. AI Chatbots (trained on your own PDF documents) can answer "What is your refund policy?" instantly.</p>

        <VideoReferenceCard
          videoId="GOffPy9kk28"
          start={0}
          title="Vector Databases in 2 Mins"
          description="How RAG (Retrieval Augmented Generation) allows AI to learn your private data."
        />

        <ChatbotTrainingVisual />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
          <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#0C4A6E', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Modern customers expect instant gratification. If you don't answer at 2 AM, they buy from the competitor who does.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BAE6FD', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#0369A1', fontSize: '1.1rem' }}>🚀 How CapeWeb Helps You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              Our care plans include support for AI Chatbots.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Knowledge Base Sync:</strong> We can train a bot on your specific PDFs and Policy pages, so it answers accurately about YOUR business, not general knowledge.</span>
              </div>
            </div>
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
        <p>You can upload an Excel file to ChatGPT (Code Interpreter) and say: "Analyze this sales data. Tell me which product has the highest profit margin."</p>
        <p>It writes Python code, runs it, and gives you charts. It is like having a Harvard graduate in your pocket.</p>

        <VideoReferenceCard
          videoId="in3BS4St3h0"
          start={0}
          title="ChatGPT Data Analysis Demo"
          description="Turning raw data into actionable business insights instantly."
        />

        <AnalysisVisual />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
          <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#0C4A6E', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Data is useless if you can't read it. AI turns "Excel files" into "Business Strategy."
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BAE6FD', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#0369A1', fontSize: '1.1rem' }}>🚀 How CapeWeb Helps You</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Dashboard Metrics:</strong> We build custom analytics dashboards that simplify your site data (Sales, Visits, Conversions) so you don't need to ask an AI to explain it. It's clear from day one.</span>
              </div>
            </div>
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
        <p>Chatbots reply. <strong>Agents</strong> do.</p>

        <VideoReferenceCard
          videoId="98cRLHTMGUc"
          start={0}
          title="Autonomous Agents Explained"
          description="How Agents use tools to complete complex goals autonomously."
        />
        <AgentLoopVisual />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
          <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#0C4A6E', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            The future of work is not "Man vs Machine." It is "Manager of Machines."
          </p>

          <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
            <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '0.2rem' }}>Digital Employees</div>
            <div style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>Soon, you will not hire a "Social Media Intern." You will spin up a "Social Media Agent" that knows your brand voice and posts 24/7 without needing sleep.</div>
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
        <p>Tools like <strong>Otter.ai</strong> join your Zoom calls, transcribe everything, and email you a summary. This saves 15 minutes per meeting.</p>

        <VideoReferenceCard
          videoId="QeA2vBdiSYw"
          start={0}
          title="Otter.ai Meeting Workflow"
          description="Never take meeting notes again. Let AI generate the summary and action items."
        />

        <MeetingVisual />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
          <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#0C4A6E', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Memory is fallible. Transcripts are forever.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
            <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '0.2rem' }}>Accountability</div>
            <div style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>"I never said that" becomes impossible when you have a searchable, word-for-word record of every meeting.</div>
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
// MODULE J: RESOURCES
// ==========================================
export function Pillar7Resources({ onNext }) {
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
    <InteractiveLayout title="Module J: Resources" subtitle="AI Architect Toolkit">
      <div className="cw-prose">
        <p>The AI landscape changes weekly. These are the tools that are staying. Master these, and you master the future.</p>

        <h3 style={{ marginTop: '2rem' }}>🛠️ The AI Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="LLM"
            title="ChatGPT Plus"
            description="The Swiss Army Knife. Use it for writing, coding, data analysis, and brainstorming."
            link="https://chat.openai.com/"
          />
          <ResourceCard
            category="Reasoning"
            title="Claude 3"
            description="Anthropic's model. Often better at coding and creative writing than GPT-4. Large context window."
            link="https://claude.ai/"
          />
          <ResourceCard
            category="Images"
            title="Midjourney"
            description="The best image generator in the world. Runs on Discord. Creates photorealistic assets."
            link="https://www.midjourney.com/"
          />
          <ResourceCard
            category="Automation"
            title="Zapier"
            description="The glue that connects your apps. Start simple automations here."
            link="https://zapier.com/"
          />
          <ResourceCard
            category="Advanced Automation"
            title="Make.com"
            description="Visual workflow builder for complex, multi-step AI agents. More powerful than Zapier."
            link="https://www.make.com/"
          />
        </div>

        <h3 style={{ marginTop: '3rem' }}>📚 Recommended Reading</h3>

        <VideoReferenceCard
          videoId="ivLHyw64YL4"
          start={0}
          title="Life 3.0 Summary"
          description="Max Tegmark's vision of the future of life in the age of Artificial General Intelligence."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Society"
            title="Life 3.0"
            description="By Max Tegmark. A deep dive into being human in the age of Artificial Intelligence."
            link="https://tegmark.org/books/life-3-0/"
          />
          <ResourceCard
            category="Practical"
            title="Co-Intelligence"
            description="By Ethan Mollick. The most practical guide available on how to actually work with AI today."
            link="https://www.penguinrandomhouse.com/books/741761/co-intelligence-by-ethan-mollick/"
          />
          <ResourceCard
            category="Future"
            title="Scary Smart"
            description="By Mo Gawdat. An optimistic yet cautious look at how we must raise AI like a child."
            link="https://www.mogawdat.com/scary-smart"
          />
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <h4>Ready for the Final Exam?</h4>
          <p style={{ marginBottom: '1.5rem', color: '#64748B' }}>You have the tools. Now prove you can use them responsibly.</p>
          <CWButton onClick={onNext} variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Take Final Exam 🏁</CWButton>
        </div>
      </div>
    </InteractiveLayout>
  );
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
