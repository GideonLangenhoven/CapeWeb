import React, { useState, useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';
import { InteractiveLayout, QuizLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, BookInsight } from './CapeWebUI';

// ==========================================
// PILLAR 11 QUIZ DATA
// ==========================================
export const pillar11QuizQuestions = [
  {
    question: 'A customer gets a broken product (0/10 experience). You instantly refund them AND send a free replacement with a hand-written note. They become your most loyal fan. What is this phenomenon?',
    options: ['Bribery', 'The Service Recovery Paradox', 'Bad business'],
    correctIndex: 1,
  },
  {
    question: 'You sign up 50 new clients this month. But 60 old clients cancel. You celebrate "Record Sales". What metric are you ignoring?',
    options: ['Churn (You are leaking customers faster than you fill the bucket)', 'Revenue', 'Profit'],
    correctIndex: 0,
  },
  {
    question: '100 customers ask "How do I reset my password?" every single day. Your support team is drowning. What asset should you build specifically to unsolved this?',
    options: ['A toll-free phone number', 'A Self-Service Knowledge Base (Help Center)', 'A Facebook page'],
    correctIndex: 1,
  },
  {
    question: 'A corporate client offers you a contract: "If your server is down for more than 1 hour, you must pay us a R10,000 penalty." What is this clause called?',
    options: ['An NDA', 'An SLA (Service Level Agreement)', 'An Invoice'],
    correctIndex: 1,
  },
  {
    question: 'Company A sends customers free chocolates but takes 3 days to fix issues. Company B sends no gifts but fixes issues in 5 minutes. According to "The Effortless Experience", who wins loyalty?',
    options: ['Company A', 'Company B (Reducing Customer Effort is the biggest driver of loyalty)', 'Neither'],
    correctIndex: 1,
  },
  {
    question: 'You ask customers "On a scale of 0-10, how likely are you to recommend us?". You calculate the score by subtracting the Detractors (0-6) from the Promoters (9-10). What is this?',
    options: ['NPS (Net Promoter Score)', 'IQ Test', 'Customer Satisfaction Score'],
    correctIndex: 0,
  },
  {
    question: 'Only ONE person in your team knows how the billing server works. If they quit (or get hit by a bus), the company dies. What is this risk?',
    options: ['The Bus Factor', 'Staff Turnover', 'Bad luck'],
    correctIndex: 0,
  },
  {
    question: 'Support waits for a ticket saying "It broke". Customer Success calls the client saying "I see you haven\'t logged in, let me help you". What is the difference?',
    options: ['None', 'Support is Reactive; Success is Proactive', 'Success is cheaper'],
    correctIndex: 1,
  },
  {
    question: 'You hire a new intern. Instead of training them for 5 days, you hand them a step-by-step document with screenshots. They do the job perfectly on Day 1. What is this document?',
    options: ['A Diploma', 'An SOP (Standard Operating Procedure) / Playbook', 'A contract'],
    correctIndex: 1,
  },
  {
    question: 'You spend R1,000 to get a new customer. It costs you R50 to keep an existing customer happy. Both spend the same amount. Where is the better ROI?',
    options: ['Retention (Keeping existing customers is 5-25x cheaper than Acquisition)', 'Acquisition', 'Neither'],
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

function NPSVisual() {
  const [score, setScore] = useState(5);
  const [label, setLabel] = useState('Detractor (Unhappy)');
  const [color, setColor] = useState('#EF4444');

  useEffect(() => {
    if (score <= 6) { setLabel("Detractor (Risk of Churn)"); setColor("#EF4444"); }
    else if (score <= 8) { setLabel("Passive (Meh)"); setColor("#F59E0B"); }
    else { setLabel("Promoter (Loyal Gold)"); setColor("#10B981"); }
  }, [score]);

  return (
    <div style={{
      margin: '2rem 0',
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

      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.6)', padding: '2rem', borderRadius: '16px', borderRadius: '16px', backdropFilter: 'blur(4px)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: color, marginBottom: '0.5rem', lineHeight: 1 }}>{score}</div>
        <input
          type="range" min="0" max="10" value={score} onChange={(e) => setScore(e.target.value)}
          style={{ width: '100%', maxWidth: '350px', marginBottom: '1.5rem', cursor: 'pointer' }}
        />
        <div style={{ fontWeight: 800, color: '#334155', fontSize: '1.2rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.8)', borderRadius: '100px', display: 'inline-block' }}>{label}</div>
      </div>
    </div>
  )
}

function KnowledgeBaseVisual() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    if (query.toLowerCase().includes('refund')) setResult("Refund Policy: You can request a refund within 30 days via dashboard.");
    else if (query.toLowerCase().includes('ship')) setResult("Shipping Info: We ship to all SA provinces within 3-5 days.");
    else setResult("No article found. Contacting support...");
  };

  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)',
      background: '#4ADE80',
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

      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.9)', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '2rem' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.3rem', color: '#1E293B' }}>Self-Service Demo</h4>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text" placeholder="Type 'refund' or 'shipping'..."
            value={query} onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '1rem' }}
          />
          <button onClick={handleSearch} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '0 1.5rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Search</button>
        </div>
        {result && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#F0F9FF', borderRadius: '12px', borderLeft: '4px solid #0EA5E9', color: '#0369A1', fontSize: '0.95rem' }}>
            {result}
          </div>
        )}
      </div>
    </div>
  )
}

function ChatWidgetVisual() {
  const [messages, setMessages] = useState([]);

  const startChat = () => {
    setMessages([{ from: 'user', text: 'Do you ship to Durban?' }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: 'Yes! We ship to Durban via The Courier Guy (1-3 days).' }]);
    }, 1000);
  };

  return (
    <div style={{
      margin: '2rem auto',
      width: '320px',
      height: '400px',
      borderRadius: '20px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.2)',
      background: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ background: '#0F172A', color: 'white', padding: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '10px', height: '10px', background: '#10B981', borderRadius: '50%' }}></div>
        Live Support
      </div>
      <div style={{ flex: 1, padding: '1.5rem', background: '#F8FAFC', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 && <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: '2rem', fontStyle: 'italic' }}>Start a chat...</div>}
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
            background: m.from === 'user' ? '#3B82F6' : '#fff',
            color: m.from === 'user' ? 'white' : '#1E293B',
            padding: '0.8rem 1.2rem',
            borderRadius: '12px',
            borderBottomRightRadius: m.from === 'user' ? '0' : '12px',
            borderBottomLeftRadius: m.from === 'user' ? '12px' : '0',
            maxWidth: '80%',
            fontSize: '0.95rem',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            {m.text}
          </div>
        ))}
      </div>
      <div style={{ padding: '1rem', borderTop: '1px solid #E2E8F0', background: 'white' }}>
        <button onClick={startChat} style={{ width: '100%', padding: '0.8rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s' }}>Ask Question</button>
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
      background: '#FDE047',
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
// PILLAR 11 MODULES A-G
// ==========================================

// Module A: CX Strategy
export function Pillar11ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: Service is Marketing" subtitle="Zappos philosophy.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Tony Hsieh (Zappos) believed that Great Service = Free Marketing.
          If you wow a customer, they tell 10 friends. If you annoy them, they tell 100.
        </p>

        <ScenarioToggle
          oldTitle="Bad Service"
          oldContent="Customer wants refund. You quote 'Policy 4.2' and refuse. Customer posts angry Tweet. You lose 50 future sales."
          newTitle="Great Service"
          newContent="Customer wants refund. You say 'Done! Keep the shoes.' Customer is shocked, tweets praise. You gain 10 new sales."
        />

        <BookInsight title="Delivering Happiness" author="Tony Hsieh" book="Delivering Happiness" color="#3B82F6">
          <p>"We are a service company that happens to sell shoes."</p>
        </BookInsight>

        <MiniQuiz
          questions={[
            { question: "Why treat Customer Service as Marketing?", options: ["It is cheaper", "Because happy customers tell their friends (Word of Mouth), which drives growth", "It is legally required"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module B: Foundations
export function Pillar11ModuleB({ onNext }) {
  return (
    <InteractiveLayout title="Module B: The 3 Pillars" subtitle="Speed, Accuracy, Tone.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Great support stands on three legs:
          <br /><strong>1. Speed:</strong> Reply in minutes.
          <br /><strong>2. Accuracy:</strong> Don't guess.
          <br /><strong>3. Tone:</strong> Be human, not a lawyer.
        </p>

        <CWAlert type="warning" title="The Robotic Apology">
          Bad: "We apologize for the inconvenience." (Cold).
          <br />Good: "I am so sorry about that! That sounds absolutely frustrating. I'd be annoyed too. Let me fix it right now." (Human).
        </CWAlert>

        <MiniQuiz
          questions={[
            { question: "What are the three pillars of support?", options: ["Speed, Accuracy, Human Tone", "Money, Time, Effort", "Yes, No, Maybe"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module C: Help Desk
export function Pillar11ModuleC({ onNext }) {
  return (
    <InteractiveLayout title="Module C: Help Desk Software" subtitle="Stop using Gmail.">
      <div className="cw-prose">
        <p className="cw-text-body">
          If you run support from a personal Gmail, emails will slip through the cracks.
          Use <strong>Intercom, Zendesk, or HelpScout</strong>.
        </p>
        <MiniQuiz
          questions={[
            { question: "Why switch from Gmail to a Help Desk tool?", options: ["Gmail is ugly", "To track tickets, prevent lost emails, and collaborate with teams", "To spend money"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}

// Module D: Knowledge Base
export function Pillar11ModuleD({ onNext }) {
  return (
    <InteractiveLayout title="Module D: Self-Service" subtitle="The best support is no support.">
      <div className="cw-prose">
        <p className="cw-text-body">
          60% of customers prefer to solve the issue themselves without talking to you.
          Give them a searchable <strong>Knowledge Base</strong>.
        </p>

        <KnowledgeBaseVisual />

        <MiniQuiz
          questions={[
            { question: "What is the benefit of a Knowledge Base?", options: ["It reduces support volume and satisfies customers who prefer self-service", "It makes the website look full", "It is required"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module E: Chat
export function Pillar11ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: Live Chat" subtitle="Where the sale happens.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Customers have last-minute doubts at checkout. "Will this arrive by Friday?"
          If you aren't there to answer, they abandon the cart.
        </p>

        <ChatWidgetVisual />

        <MiniQuiz
          questions={[
            { question: "Where is the highest-value place to put a Live Chat widget?", options: ["The About page", "The Checkout Page (to resolve last-minute objections)", "The Terms of Service"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module F: Feedback
export function Pillar11ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: NPS & Feedback" subtitle="Listen to them.">
      <div className="cw-prose">
        <p className="cw-text-body">
          <strong>NPS (Net Promoter Score):</strong> The gold standard for measuring loyalty.
          "On a scale of 0-10, how likely are you to recommend us?"
        </p>

        <NPSVisual />

        <MiniQuiz
          questions={[
            { question: "What defines a 'Detractor' in NPS?", options: ["A score of 0-6 (Unhappy, likely to badmouth)", "A score of 10", "A tractor driver"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module G: Retention
export function Pillar11ModuleG({ onNext }) {
  return (
    <InteractiveLayout title="Module G: Retention" subtitle="Churn kills.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Acquiring a new customer costs 5x more than keeping an old one.
          <br /><strong>Service Recovery Paradox:</strong> If you fix a mistake <em>brilliantly</em>, the customer trusts you MORE than if nothing ever went wrong.
        </p>
        <MiniQuiz
          questions={[
            { question: "What is the 'Service Recovery Paradox'?", options: ["Fixing a problem excellently can create higher loyalty than never having a problem", "Service is impossible to recover", "Mistakes always lead to churn"], correctIndex: 0 }
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
export function Pillar11Resources({ onNext }) {
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
    <InteractiveLayout title="Module H: Resources" subtitle="CX Toolkit">
      <div className="cw-prose">
        <p>Your brand is what people say about you when you are not in the room. Give them something good to say.</p>

        <h3 style={{ marginTop: '2rem' }}>🛠️ The CX Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Live Chat"
            title="Intercom / Zendesk"
            description="Integrated help desk and live chat. Don't make customers wait for email."
            link="https://www.intercom.com/"
          />
          <ResourceCard
            category="Messaging"
            title="WhatsApp Business API"
            description="Meet your customers where they are. 2 billion people use WhatsApp."
            link="https://business.whatsapp.com/"
          />
          <ResourceCard
            category="Feedback"
            title="Typeform / Tally"
            description="Beautiful surveys that people actually enjoy filling out. Use for NPS."
            link="https://www.typeform.com/"
          />
          <ResourceCard
            category="Trust"
            title="Trustpilot"
            description="Collecting reviews builds social proof. 90% of people read reviews before buying."
            link="https://www.trustpilot.com/"
          />
        </div>

        <h3 style={{ marginTop: '3rem' }}>📚 Recommended Reading</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Culture"
            title="Delivering Happiness"
            description="By Tony Hsieh. How Zappos built a billion-dollar business by obsessing over customer service."
            link="https://www.deliveringhappiness.com/book"
          />
          <ResourceCard
            category="Strategy"
            title="The Effortless Experience"
            description="By Matthew Dixon. Stop trying to 'delight' customers. Just make it easy for them."
            link="https://www.amazon.com/Effortless-Experience-Conquering-Battleground-Customer/dp/1591845815"
          />
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <h4>Ready for the Final Exam?</h4>
          <p style={{ marginBottom: '1.5rem', color: '#64748B' }}>Service is an attitude, not a department. Let's see if you have it.</p>
          <CWButton onClick={onNext} variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Take Final Exam 🏁</CWButton>
        </div>
      </div>
    </InteractiveLayout>
  );
}

// ==========================================
// FINAL QUIZ COMPONENT
// ==========================================

export function Pillar11Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  // Local state handling if props missing
  const [localResponses, setLocalResponses] = useState({});
  const activeResponses = quizResponses || localResponses;
  const activeSetResponse = onSelect || ((qMvc, optIdx) => setLocalResponses(prev => ({ ...prev, [qMvc]: optIdx })));

  const questions = pillar11QuizQuestions;
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
          <CWHeading level={3}>Service Hero</CWHeading>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{scoreMessage}</p>
          <CWButton onClick={onFinish}>Continue to Certificate →</CWButton>
        </div>
      </CWCard>
    );
  }

  return (
    <QuizLayout title="Final Exam: CX Mastery" currentStep={currentQuestionIndex + 1} totalSteps={questions.length}>
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

export function Pillar11Completion() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>🤝</h1>
      <CWHeading level={2}>CX Champion</CWHeading>
      <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '1rem auto' }}>
        You have completed the entire CapeWeb University curriculum. A new world awaits.
      </p>
    </div>
  );
}
