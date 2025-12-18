import React, { useState, useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';
import { InteractiveLayout, QuizLayout, ReadingLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, BookInsight } from './CapeWebUI';

export const pillar2QuizQuestions = [
  {
    question: 'CIPC is mainly used for:',
    options: ['Company registration and intellectual property', 'UIF monthly declarations', 'Roadworthy certificates'],
    correctIndex: 0,
  },
  {
    question: 'POPIA is enforced/overseen by:',
    options: ['The Information Regulator', 'The traffic department', 'The weather service'],
    correctIndex: 0,
  },
  {
    question: 'If you hire employees, you must learn about:',
    options: ['Only Instagram marketing', 'PAYE/UIF/Compensation Fund (as applicable)', 'Nothing changes legally'],
    correctIndex: 1,
  },
  {
    question: 'The Consumer Protection Act is about:',
    options: ['Fair marketplace rules and consumer rights', 'Football rules', 'Airline schedules'],
    correctIndex: 0,
  },
  {
    question: 'ECTA is important because:',
    options: [
      'It regulates electronic communications and transactions (e-commerce basics)',
      'It tells you what to post on TikTok',
      "It's a banking app",
    ],
    correctIndex: 0,
  },
  {
    question: '"Compliance Passport" in CapeWeb means:',
    options: [
      'A checklist you complete to be "legal enough to sell" and grow safely',
      'A passport for international travel',
      'A logo file',
    ],
    correctIndex: 0,
  },
  {
    question: 'If you trade in certain categories in Cape Town, you might need:',
    options: ['Nothing, ever', 'City permits/licences depending on your activity', "A driver's licence renewal"],
    correctIndex: 1,
  },
  {
    question: 'A smart founder approach is:',
    options: [
      'Start safe, keep records, and tighten compliance as you grow',
      'Ignore compliance until you have problems',
      'Wait forever before selling',
    ],
    correctIndex: 0,
  },
  {
    question: 'If you want to be tender-ready, you start with:',
    options: ['CSD registration, then eTenders', 'Buying followers', 'Only printing business cards'],
    correctIndex: 0,
  },
  {
    question: 'A trade mark is:',
    options: [
      'Required before your first sale',
      'A way to protect a valuable brand name (usually later)',
      'A delivery service',
    ],
    correctIndex: 1,
  },
];

// ==========================================
// PILLAR 2 INTERACTIVE COMPONENTS
// ==========================================

function LiabilityShieldInteractive() {
  const [mode, setMode] = useState('sole'); // 'sole' | 'pty'

  return (
    <div style={{ margin: '3rem 0', fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Scenario: The "Delivery Accident"</h3>

      {/* Story Context */}
      <div style={{
        background: '#FEF3C7',
        border: '1px solid #F59E0B',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚚💥</div>
        <p style={{ margin: 0, color: '#92400E', fontSize: '1.1rem' }}>
          You run a delivery business. Your driver accidentally crashes into a luxury car.
          <br /><strong>The Damage Claim: R500,000.</strong> Your business only has R50,000 in the bank.
        </p>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setMode('sole')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            border: mode === 'sole' ? '2px solid #EF4444' : '1px solid #E5E7EB',
            background: mode === 'sole' ? '#FEF2F2' : '#fff',
            color: mode === 'sole' ? '#991B1B' : '#6B7280',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          Sole Proprietor
        </button>
        <button
          onClick={() => setMode('pty')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            border: mode === 'pty' ? '2px solid #10B981' : '1px solid #E5E7EB',
            background: mode === 'pty' ? '#D1FAE5' : '#fff',
            color: mode === 'pty' ? '#065F46' : '#6B7280',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          Pty (Ltd) Company
        </button>
      </div>

      {/* Visualization */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Business Assets */}
        <div style={{
          background: '#fff',
          border: '2px solid #E5E7EB',
          borderRadius: '16px',
          padding: '1.5rem',
          opacity: 0.8
        }}>
          <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🏢 The Business
          </h4>
          <div style={{ padding: '0.5rem', background: '#F3F4F6', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Bank Account:</span>
            <span style={{ fontWeight: 700, color: '#DC2626' }}>Took R50,000</span>
          </div>
          <div style={{ padding: '0.5rem', background: '#F3F4F6', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Remaining Dept:</span>
            <span style={{ fontWeight: 700, color: '#DC2626' }}>R450,000</span>
          </div>
        </div>

        {/* Personal Assets */}
        <div style={{
          background: mode === 'sole' ? '#FEF2F2' : '#ECFDF5',
          border: mode === 'sole' ? '2px solid #EF4444' : '2px solid #10B981',
          borderRadius: '16px',
          padding: '1.5rem',
          position: 'relative',
          transition: 'all 0.5s'
        }}>
          <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🏠 Personal Life
          </h4>

          {mode === 'sole' ? (
            <div style={{ animation: 'shake 0.5s' }}>
              <div style={{ padding: '0.5rem', background: '#FEE2E2', borderRadius: '8px', marginBottom: '0.5rem', color: '#991B1B' }}>
                ⚠️ <strong>House:</strong> SEIZED to pay debt
              </div>
              <div style={{ padding: '0.5rem', background: '#FEE2E2', borderRadius: '8px', marginBottom: '0.5rem', color: '#991B1B' }}>
                ⚠️ <strong>Car:</strong> SEIZED to pay debt
              </div>
              <div style={{ marginTop: '1rem', fontWeight: 700, color: '#DC2626' }}>
                Result: You lose eveything.
              </div>
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '8px', marginBottom: '0.5rem' }}>
                ✅ <strong>House:</strong> SAFE
              </div>
              <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '8px', marginBottom: '0.5rem' }}>
                ✅ <strong>Car:</strong> SAFE
              </div>
              <div style={{ marginTop: '1rem', fontWeight: 700, color: '#059669' }}>
                Result: Only the company fails. You are safe.
              </div>
            </div>
          )}

          {/* Shield Icon Overlay for Pty Ltd */}
          {mode === 'pty' && (
            <div style={{
              position: 'absolute', top: '-15px', right: '-15px',
              background: '#10B981', color: '#fff',
              width: '50px', height: '50px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
              boxShadow: '0 5px 15px rgba(16, 185, 129, 0.4)'
            }}>
              🛡️
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComplianceRoadmapInteractive() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      label: 'CIPC',
      title: 'Company Registration',
      desc: 'Reserve your name and register your Pty Ltd. You get a K/M number (Registration Number).',
      cost: 'R175',
      time: '2-5 Days'
    },
    {
      id: 2,
      label: 'SARS',
      title: 'Income Tax Number',
      desc: 'Automatic with CIPC. You need this number to open a bank account.',
      cost: 'Free',
      time: 'Instant'
    },
    {
      id: 3,
      label: 'BANK',
      title: 'Business Account',
      desc: 'Separate your money. Requires: ID, Address (FICA), and CIPC documents (Notice of Incorporation).',
      cost: 'R0 - R100/pm',
      time: '1 Day'
    },
    {
      id: 4,
      label: 'TRADE',
      title: 'Ready to Sell',
      desc: 'You can now invoice clients legally as a business.',
      cost: '-',
      time: 'Forever'
    }
  ];

  return (
    <div style={{ margin: '3rem 0' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>The "make it official" Timeline</h3>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            {/* Node */}
            <div
              onClick={() => setActiveStep(i)}
              style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: activeStep === i ? '#0b0f1a' : (i < activeStep ? '#10B981' : '#E5E7EB'),
                color: activeStep === i ? '#fff' : (i < activeStep ? '#fff' : '#6B7280'),
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem',
                cursor: 'pointer', transition: 'all 0.3s',
                boxShadow: activeStep === i ? '0 0 0 4px #bae6fd' : 'none',
                zIndex: 2
              }}
            >
              {i < activeStep ? '✓' : step.label}
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div style={{
                height: '4px', width: '60px',
                background: i < activeStep ? '#10B981' : '#E5E7EB',
                transition: 'background 0.5s ease'
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Detail Card */}
      <div style={{
        background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '2rem',
        textAlign: 'center', animation: 'fadeIn 0.3s ease',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
      }} key={activeStep}>
        <CWBadge status="neutral" style={{ marginBottom: '1rem' }}>Step {activeStep + 1}: {steps[activeStep].label}</CWBadge>
        <h4 style={{ fontSize: '1.5rem', margin: '0 0 1rem' }}>{steps[activeStep].title}</h4>
        <p style={{ fontSize: '1.1rem', color: '#4B5563', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
          {steps[activeStep].desc}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.9rem', color: '#6B7280' }}>
          <div>💰 Cost: <strong style={{ color: '#0b0f1a' }}>{steps[activeStep].cost}</strong></div>
          <div>⏱️ Time: <strong style={{ color: '#0b0f1a' }}>{steps[activeStep].time}</strong></div>
        </div>
      </div>
    </div>
  )
}


// Helper: Mini Quiz
function MiniQuiz({ questions, title = "Knowledge Check", onNext }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const counterRef = useRef(null);

  const question = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  // Celebration Sound Effect
  const playSuccessSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed', e));
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  const handleSelect = (index) => {
    setSelected(index);
  };

  const handleNext = () => {
    // Calculate score for THIS question
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

  // Celebration Animation Effect
  useEffect(() => {
    if (celebrating && counterRef.current) {
      const percentage = Math.round((score / questions.length) * 100);

      // GSAP Animation
      const tl = gsap.timeline();
      counterRef.current.classList.remove('celebrate');

      tl.set(counterRef.current, { opacity: 1 })
        .fromTo(counterRef.current,
          {
            innerText: 0,
            "--font-variation-weight": 300,
            scale: 0.8
          },
          {
            innerText: percentage,
            duration: 3,
            snap: { innerText: 1 },
            ease: "linear",
            onUpdate: function () {
              const val = Math.ceil(this.targets()[0].innerText);
              counterRef.current.innerHTML = val + "%";
            },
            onComplete: () => {
              counterRef.current.classList.add('celebrate');
              const colors = ['#fbda61', '#ff5acd'];
              const runConfetti = confettiModule.default || confettiModule;

              if (typeof runConfetti === 'function') {
                runConfetti({
                  particleCount: 150,
                  spread: 100,
                  origin: { y: 0.8 },
                  colors: colors,
                  disableForReducedMotion: true
                });
              }

              setTimeout(() => {
                setCelebrating(false);
              }, 3000);
            }
          }
        )
        .to(counterRef.current, {
          scale: 1,
          "--font-variation-weight": 600,
          duration: 1.2,
          ease: "elastic.out(1, 0.2)"
        });

      return () => {
        if (counterRef.current) counterRef.current.classList.remove('celebrate');
      };
    }
  }, [celebrating, score, questions.length]);

  // Full Screen Celebration Overlay
  if (celebrating) {
    return (
      <div style={{
        marginTop: '3rem',
        padding: '3rem 2rem',
        borderRadius: '32px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 20px 50px -10px rgba(31, 38, 135, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '400px',
        display: 'grid',
        placeItems: 'center',
        fontFamily: '"Roboto Flex", sans-serif'
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h1 ref={counterRef} className="counter">0%</h1>
        </div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        textAlign: 'center',
        borderRadius: '24px',
        background: passed ? 'rgba(209, 250, 229, 0.8)' : 'rgba(254, 226, 226, 0.8)',
        backdropFilter: 'blur(20px)',
        border: passed ? '3px solid rgba(16, 185, 129, 0.3)' : '3px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{passed ? '🎉' : '📚'}</div>
        <h3 style={{ fontSize: '2rem', color: passed ? '#065F46' : '#991B1B', marginBottom: '1rem' }}>
          {passed ? 'Great Job!' : 'Keep Learning!'}
        </h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1F2937' }}>
          You scored {score} out of {questions.length} ({percentage}%)
        </p>
        <p style={{ color: '#4B5563', marginBottom: '2rem', fontSize: '1.1rem' }}>
          {passed ? 'You are ready for the next module.' : 'Review the content and try again.'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <CWButton onClick={handleRestart} variant={passed ? "secondary" : "primary"} style={{ opacity: passed ? 0.9 : 1 }}>
            {passed ? '↺ Retake Quiz' : '↺ Try Again'}
          </CWButton>

          {passed && onNext && (
            <CWButton onClick={onNext} variant="primary">
              Next Module →
            </CWButton>
          )}
        </div>
      </div>
    );
  }

  // Question Card
  return (
    <div style={{
      marginTop: '3rem',
      padding: '2rem 2rem',
      borderRadius: '32px',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      boxShadow: '0 20px 50px -10px rgba(31, 38, 135, 0.15)',
      position: 'relative',
      overflow: 'hidden'
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
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          background: '#E0F2FE',
          color: '#0284C7',
          padding: '0.3rem 0.8rem',
          borderRadius: '100px',
          fontSize: '0.75rem',
          fontWeight: 800,
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          Assessment
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748B' }}>
          Question {currentQ + 1} of {questions.length}
        </span>
      </div>

      <h4 style={{
        margin: '0 0 1.5rem 0',
        fontSize: '2rem',
        fontWeight: 900,
        color: '#0F172A',
        letterSpacing: '-0.02em',
        lineHeight: 1.1
      }}>
        {title}
      </h4>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1E293B', lineHeight: 1.5 }}>
          {question.question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map((option, index) => (
            <label
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                border: '2px solid',
                borderColor: selected === index ? '#0EA5E9' : '#E2E8F0',
                background: selected === index ? '#F0F9FF' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: selected === index ? '0 4px 20px rgba(14, 165, 233, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)'
              }}
              onClick={() => handleSelect(index)}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: selected === index ? '6px solid #0EA5E9' : '2px solid #CBD5E1',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }} />

              <span style={{ flex: 1, fontSize: '1.05rem', color: selected === index ? '#0C4A6E' : '#334155', fontWeight: 500 }}>
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleNext}
          disabled={selected === null}
          style={{
            padding: '0.75rem 2rem',
            background: '#0F172A',
            color: 'white',
            border: 'none',
            borderRadius: '100px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: selected === null ? 'not-allowed' : 'pointer',
            opacity: selected === null ? 0.5 : 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {isLast ? 'Finish Quiz' : 'Next Question'}
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

const moduleAQuestions = [
  {
    question: "When starting with R0 and NO sales, your priority is:",
    options: ["Registering a corporation immediately", "Getting your first 10 sales (Testing)", "Designing a logo"],
    correctIndex: 1
  },
  {
    question: "Why might you choose a Sole Proprietor setup first?",
    options: ["It has zero setup cost and allows immediate trading", "It protects you from liability", "It makes you look big"],
    correctIndex: 0
  }
];

// Module A: Legal Structure (Sole Prop vs Pty Ltd)
export function Pillar2ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: Choose Your Legal Setup" subtitle="Decide your business structure and 'make it real'.">
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
        Here's the truth: you can make your first sales before you register a company. But you need to understand the risk.
        <br /><strong>The choice is simple:</strong> Speed (Sole Prop) vs Safety (Pty Ltd).
      </p>

      {/* Interactive Liability Simulator */}
      <CWCard style={{ marginBottom: '2rem', background: '#F8FAFC' }}>
        <CWHeading level={4} style={{ textAlign: 'center' }}>Interactive: Understand "Limited Liability"</CWHeading>
        <p style={{ textAlign: 'center', marginBottom: '0' }}>Click the options below to see what happens when things go wrong.</p>
        <LiabilityShieldInteractive />
      </CWCard>

      <CWHeading level={3}>Your Options Explained</CWHeading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', margin: '1.5rem 0' }}>
        <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
          <h4 style={{ margin: '0 0 0.5rem' }}>Sole Proprietor</h4>
          <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>You ARE the business.</p>
          <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            <li>✅ Free & Instant start</li>
            <li>✅ Less paperwork</li>
            <li>❌ <strong>High Risk:</strong> Personal assets not safe</li>
            <li>❌ Harder to get corporate contracts</li>
          </ul>
        </div>

        <div style={{ padding: '1.5rem', background: '#0b0f1a', color: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
          <h4 style={{ margin: '0 0 0.5rem', color: '#fff' }}>Pty (Ltd) Company</h4>
          <p style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>A separate legal person.</p>
          <ul style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#D1D5DB' }}>
            <li>✅ <strong>Safe:</strong> Limited liability protection</li>
            <li>✅ Professional image</li>
            <li>✅ Required for funding & tenders</li>
            <li>❌ Costs money (~R175) & more admin</li>
          </ul>
        </div>
      </div>

      {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
      <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
        <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
        </CWHeading>

        <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          In the age of <strong>AI and Automation</strong>, business moves at light speed. Speed is an asset, but <em>fragility</em> is a killer.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: '#0C4A6E', marginBottom: '0.5rem' }}>1. Algorithmic Trust</h4>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}>
              Modern platforms (Stripe, PayPal, Google Merchant Center) use automated bots to verify your business. A registered Pty Ltd with a valid CIPC number gets the "Green Light" instantly. Sole proprietors often face manual reviews and delays.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#0C4A6E', marginBottom: '0.5rem' }}>2. The "Scale" Shield</h4>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}>
              Automation allows you to service 10,000 customers as easily as 10. But increased scale means increased risk. If ONE customer sues, you don't want to lose your house. A corporation is the vessel that holds the risk while you reap the rewards.
            </p>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E0F2FE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
            🚀 How CapeWeb Helps You Scale
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
            Once you've "made it official" with your registration, you need to look the part to capture market share.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#0EA5E9', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Brand Authority:</strong> We build <em>Design Systems & Brand Kits</em> (see our <a href="/services?service=future-digital-branding" style={{ color: '#0EA5E9', textDecoration: 'underline' }}>Content that Converts</a> service) ensuring your new company looks like a Fortune 500 from Day 1.
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#0EA5E9', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Automated Operations:</strong> Now that you are a legal entity, build the "Digital Staff" to run it. Our <a href="/services?service=ai-agents-sales-team" style={{ color: '#0EA5E9', textDecoration: 'underline' }}>AI Agents & Sales Team</a> service helps you deploy 24/7 support without hiring a massive HR department.
              </span>
            </li>
          </ul>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '1rem', fontStyle: 'italic', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
            Get the legal structure right, and we'll build the digital engine on top of it.
          </p>
        </div>
      </div>

      <BookInsight
        title="Corporations are the secret of the rich"
        author="Robert Kiyosaki"
        book="Rich Dad Poor Dad"
        color="#16A34A"
      >
        <p>"The rich use corporations to protect themselves and their money. As an individual, you earn, get taxed, and spend what is left. A corporation earns, spends everything it can, and is taxed on what is left."</p>
        <p><strong>Lesson:</strong> Eventually, you want a Pty Ltd to separate your business money from your personal life.</p>
      </BookInsight>

      <MiniQuiz questions={moduleAQuestions} title="Roadmap Knowledge Check" onNext={onNext} />
    </InteractiveLayout>
  );
}

const moduleBQuestions = [
  {
    question: "CIPC is mainly used for:",
    options: ["Company Registration & IP", "Traffic Fines", "Collecting Vat"],
    correctIndex: 0
  },
  {
    question: "When should you open a business bank account?",
    options: ["Never", "After registering with CIPC (using your MoI)", "Before you have a business name"],
    correctIndex: 1
  }
];

// Module B: Register & Tax Basics
// Module B: Register & Tax Basics
export function Pillar2ModuleB({ onNext }) {
  return (
    <InteractiveLayout title="Module B: Register & Tax Basics" subtitle="The 'Setup Rails' for your business.">
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        This module gives you the "legal rails" your business runs on. You'll learn what to register, where, and why.
      </p>

      {/* Interactive Roadmap */}
      <ComplianceRoadmapInteractive />

      <CWCard>
        <CWHeading level={4} style={{ marginBottom: '1rem' }}>Resources to get it done</CWHeading>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {/* Item 1 */}
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>1. BizPortal (CIPC)</div>
            <div style={{ color: '#64748B', fontSize: '0.9rem' }}>The easiest way to register. Do it all online.</div>
            <CWButton href="https://bizportal.gov.za/" target="_blank" style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Visit BizPortal ↗</CWButton>
          </div>
          {/* Item 2 */}
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>2. SARS eFiling</div>
            <div style={{ color: '#64748B', fontSize: '0.9rem' }}>Activate your Tax Profile once you have your company number.</div>
            <CWButton href="https://www.sars.gov.za/" target="_blank" style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Visit SARS ↗</CWButton>
          </div>
        </div>
      </CWCard>

      <BookInsight title="Take your profit first" author="Mike Michalowicz" book="Profit First" color="#FACC15">
        <p>"The old formula is: Sales - Expenses = Profit. The new formula is: Sales - Profit = Expenses."</p>
        <p><strong>Lesson:</strong> When you set up your bank accounts (Step 3), open a separate savings account called 'PROFIT' and put 1% of every sale there immediately. Do this before paying expenses.</p>
      </BookInsight>

      <CWCard style={{ marginBottom: '2rem', background: '#FEF2F2', border: '1px solid #FECACA' }}>
        <h4 style={{ color: '#991B1B', marginBottom: '0.5rem' }}>Scenario: The "Unregistered" Deal</h4>
        <p style={{ margin: 0, color: '#4B5563' }}>
          <strong>The Situation:</strong> You finally land a big corporate client (Woolworths/Checkers). They love your product.
          <br /><br />
          <strong>The Problem:</strong> They ask for your "Vendor Application". It requires a CIPC Registration Number, a Tax Clearance Certificate, and a Business Bank Letter.
          <br /><br />
          <strong>The Result:</strong> You don't have them. By the time you register (2 weeks), they have moved to another supplier.
          <br />
          <span style={{ fontWeight: 700, color: '#DC2626' }}>Don't let admin kill your big break. Get the basics done now.</span>
        </p>
      </CWCard>

      {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
      <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #6EE7B7' }}>
        <CWHeading level={3} style={{ color: '#047857', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
        </CWHeading>

        <p style={{ fontSize: '1.1rem', color: '#064E3B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          In the modern economy, <strong>Financial Data is Oil</strong>. If your data is messy (mixed personal/business expenses), you cannot use powerful AI tools to automate your growth.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: '#065F46', marginBottom: '0.5rem' }}>1. "Autopilot" Accounting</h4>
            <p style={{ fontSize: '0.95rem', color: '#064E3B', lineHeight: '1.6' }}>
              Tools like Xero and Sage now use AI to categorize your expenses automatically. This <em>only</em> works if you have a dedicated Business Bank Account. If you mix your personal Netflix subscription with your business server costs, the automation breaks.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#065F46', marginBottom: '0.5rem' }}>2. Global Payment Gateways</h4>
            <p style={{ fontSize: '0.95rem', color: '#064E3B', lineHeight: '1.6' }}>
              Want to sell to the world? Platforms like PayPal Business, Stripe, and Yoco require a verified business bank letter and tax number. Without these rails, you are capped at "hobbyist" limits.
            </p>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #D1FAE5', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
            🚀 How CapeWeb Helps You Scale
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
            We build the high-performance engines that generate revenue. You provide the bank account to catch it.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
              <span>
                <strong>High-Speed Revenue:</strong> Our <a href="/services?service=shopify-speed-audit" style={{ color: '#10B981', textDecoration: 'underline' }}>Performance First</a> web builds ensure customers don't bounce. We optimize the "Add to Cart" speed; you just need the Merchant Account to process the card.
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#10B981', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Systematized Growth:</strong> With <a href="/services?service=roi-custom-web-dev" style={{ color: '#10B981', textDecoration: 'underline' }}>Care Plans</a>, we treat your website like a software product. Just as you separate your finances, we separate your "Business Tech" from hobby projects, ensuring 99.9% uptime.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Activity Section Replaced by MiniQuiz */}
      <MiniQuiz questions={moduleBQuestions} title="Roadmap Knowledge Check" onNext={onNext} />
    </InteractiveLayout>
  );
}

// Helper: Compliance Calendar
function ComplianceCalendarDiagram() {
  return (
    <CWCard>
      <CWHeading level={4} style={{ marginBottom: '1rem' }}>The Compliance "Heartbeat" (Annual Cycle)</CWHeading>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <CWBadge status="neutral">Monthly</CWBadge>
          <span>PAYE/UIF (EMP201) - By the 7th of every month</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <CWBadge status="warning">Feb & Aug</CWBadge>
          <span>Provisional Tax (IRP6) - Every 6 months</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <CWBadge status="brand">May</CWBadge>
          <span>Employer Recon (EMP501) - Annual Reconciliation</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <CWBadge status="neutral">Anniversary</CWBadge>
          <span>CIPC Annual Returns (Every year on company birthday)</span>
        </div>
      </div>
    </CWCard>
  )
}

const moduleCQuestions = [
  {
    question: "POPIA is primarily about:",
    options: ["Posting on Instagram", "Protecting personal information (Privacy)", "Population control"],
    correctIndex: 1
  },
  {
    question: "If selling online (ECTA), you must:",
    options: ["Start a podcast", "Provide clear contact details, terms, and refund policies on your site", "Ask for a photo ID"],
    correctIndex: 1
  }
];

// Interactive: Refund Scenario
function RefundScenarioInteractive() {
  const [outcome, setOutcome] = useState(null);

  return (
    <div style={{ margin: '3rem 0' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Scenario: The Unhappy Customer</h3>

      <div style={{
        background: '#F3F4F6', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E7EB',
        marginBottom: '2rem', textAlign: 'center'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>😠</div>
        <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: '#374151' }}>
          "This product broke after 2 days! I want my money back immediately!"
        </p>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '0.5rem' }}>
          (According to CPA, they are within their rights to return defective goods within 6 months)
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '1rem' }}>
        {/* Bad Choice */}
        <button
          onClick={() => setOutcome('bad')}
          style={{
            padding: '1.5rem', borderRadius: '12px', border: '2px solid #EF4444', background: '#fff',
            textAlign: 'left', cursor: 'pointer', opacity: outcome === 'good' ? 0.5 : 1
          }}
        >
          <strong style={{ display: 'block', color: '#DC2626', marginBottom: '0.5rem' }}>🚫 Fight It</strong>
          <div style={{ fontSize: '0.95rem', color: '#4B5563' }}>Cite your "No Refunds" policy (which is illegal) and block them.</div>
        </button>

        {/* Good Choice */}
        <button
          onClick={() => setOutcome('good')}
          style={{
            padding: '1.5rem', borderRadius: '12px', border: '2px solid #10B981', background: '#fff',
            textAlign: 'left', cursor: 'pointer', opacity: outcome === 'bad' ? 0.5 : 1
          }}
        >
          <strong style={{ display: 'block', color: '#059669', marginBottom: '0.5rem' }}>✅ Resolve It</strong>
          <div style={{ fontSize: '0.95rem', color: '#4B5563' }}>Apologize, refund/replace immediately, and ask for feedback.</div>
        </button>
      </div>

      {/* Outcome Reveal */}
      {outcome === 'bad' && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', animation: 'fadeIn 0.5s' }}>
          <strong style={{ color: '#991B1B', fontSize: '1.1rem' }}>Result: Disaster 💥</strong>
          <p style={{ margin: '0.5rem 0 0', color: '#7F1D1D' }}>
            They report you to the Consumer Ombudsman (CGSO). You get fined. They post on HelloPeter. You lose 10 future customers.
          </p>
        </div>
      )}

      {outcome === 'good' && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '12px', animation: 'fadeIn 0.5s' }}>
          <strong style={{ color: '#065F46', fontSize: '1.1rem' }}>Result: Trust Built 🤝</strong>
          <p style={{ margin: '0.5rem 0 0', color: '#064E3B' }}>
            Compliance isn't just law; it's marketing. They might not buy again, but they won't destroy your reputation.
          </p>
        </div>
      )}
    </div>
  )
}

// Module C: Tax Responsibilities (Customers & POPIA)
export function Pillar2ModuleC({ onNext }) {
  return (
    <InteractiveLayout title="Module C: Customers & Privacy (CPA & POPIA)" subtitle="Protecting your business by respecting your customers.">
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Your first 100 sales will come from trust. Trust comes from clarity. You need to know the rules of the game when dealing with people's money and data.
      </p>

      <RefundScenarioInteractive />

      <CWHeading level={3}>The 2 Big Laws You Must Know</CWHeading>

      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
        <CWCard>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2rem' }}>🛡️</div>
            <div>
              <h4 style={{ margin: '0 0 0.5rem' }}>CPA (Consumer Protection Act)</h4>
              <p style={{ margin: 0, color: '#4B5563' }}>
                <strong>The Rule:</strong> You cannot say "No Refunds" on defective goods. Customers have a 6-month warranty on quality.
                <br /><br />
                <strong>Action:</strong> Update your website Terms & Conditions to be fair and legal.
              </p>
            </div>
          </div>
        </CWCard>

        <CWCard>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2rem' }}>🔒</div>
            <div>
              <h4 style={{ margin: '0 0 0.5rem' }}>POPIA (The Privacy Act)</h4>
              <p style={{ margin: 0, color: '#4B5563' }}>
                <strong>The Rule:</strong> You cannot spam people. You must protect their data (names, emails, phones).
                <br /><br />
                <strong>Action:</strong> Add a Privacy Policy to your site. Only email people who opted in.
              </p>
            </div>
          </div>
        </CWCard>

      </div>

      {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
      <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '24px', border: '1px solid #BFDBFE' }}>
        <CWHeading level={3} style={{ color: '#1E40AF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
        </CWHeading>

        <p style={{ fontSize: '1.1rem', color: '#1E3A8A', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Compliance isn't just about avoiding fines; it's about <strong>Conversion Rate Optimization</strong>. Modern customers are "Privacy Aware". If they don't see a Privacy Policy or clear Terms, they abandon cart.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: '#1E40AF', marginBottom: '0.5rem' }}>1. The "Trust" Premium</h4>
            <p style={{ fontSize: '0.95rem', color: '#1E3A8A', lineHeight: '1.6' }}>
              Big brands (Takealot, Amazon) have trained users to expect clear return policies and data protection. If you look "sketchy", you lose the sale. Compliance signals legitimacy.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#1E40AF', marginBottom: '0.5rem' }}>2. Ad Platform Bans</h4>
            <p style={{ fontSize: '0.95rem', color: '#1E3A8A', lineHeight: '1.6' }}>
              Meta (Facebook/Instagram) and Google Ads <strong>will ban your ad account</strong> if you run lead forms without a linked Privacy Policy. Recovering a banned ad account can take months.
            </p>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #DBEAFE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
            🚀 How CapeWeb Helps You Scale
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
            We automate the "boring" legal pages so you can focus on the exciting sales.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Compliance-Ready SEO:</strong> Our <a href="/services?service=seo-2025-beyond-keywords" style={{ color: '#3B82F6', textDecoration: 'underline' }}>SEO that Sticks</a> service includes technical schema that tells Google explicitly "Here is our Return Policy" and "Here is our Privacy Policy", boosting your search trust score.
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Automated Reply Playbooks:</strong> When a customer asks for a refund, don't panic. Our <a href="/services?service=ai-agents-sales-team" style={{ color: '#3B82F6', textDecoration: 'underline' }}>AI Agents</a> can handle the initial inquiry using pre-approved, compliant scripts (CPA-friendly) so you don't accidentally break the law in a heated email.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <BookInsight title="Trust is the Currency" author="Marcus Sheridan" book="They Ask You Answer" color="#3B82F6">
        <p>"If you are willing to answer the questions your competitors are afraid to answer, you will win the trust of the market."</p>
        <p><strong>Lesson:</strong> A clear Refund Policy (CPA) and Privacy Policy (POPIA) effectively answer the question: <em>"Can I trust you?"</em></p>
      </BookInsight>

      <MiniQuiz questions={moduleCQuestions} title="Roadmap Knowledge Check" onNext={onNext} />

    </InteractiveLayout >
  );
}

// Interactive: Compliance Calendar
function ComplianceCalendarInteractive() {
  const [month, setMonth] = useState('Feb');

  const events = {
    'Feb': { task: 'Provisional Tax (1st Payment)', desc: 'Estimate your annual profit and pay half the tax to avoid interest.' },
    'May': { task: 'Employer Recon (EMP501)', desc: 'If you have employees, reconcile your PAYE data with SARS.' },
    'Aug': { task: 'Provisional Tax (2nd Payment)', desc: 'Pay the second half of your estimated tax.' },
    'Anniversary': { task: 'CIPC Annual Return', desc: 'Pay CIPC (~R100) to keep your company active. Happens on the month you registered.' }
  };

  return (
    <div style={{ margin: '3rem 0' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Your Annual "Compliance Heartbeat"</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {Object.keys(events).map(m => (
          <button
            key={m}
            onClick={() => setMonth(m)}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: '50px',
              background: month === m ? '#0b0f1a' : '#F3F4F6',
              color: month === m ? '#fff' : '#374151',
              border: 'none', cursor: 'pointer', fontWeight: 700,
              transition: 'all 0.2s'
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <div style={{
        background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '2rem', textAlign: 'center',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)', minHeight: '150px'
      }} key={month}>
        <div style={{ fontSize: '1.2rem', color: '#6B7280', marginBottom: '0.5rem', fontStyle: 'italic' }}>
          In {month === 'Anniversary' ? 'your registration month' : month}...
        </div>
        <h4 style={{ fontSize: '1.8rem', margin: '0 0 1rem', color: '#0b0f1a' }}>{events[month].task}</h4>
        <p style={{ fontSize: '1.1rem', color: '#4B5563', maxWidth: '500px', margin: '0 auto' }}>
          {events[month].desc}
        </p>
      </div>
    </div>
  )
}

export function Pillar2ModuleD({ onNext }) {
  return (
    <InteractiveLayout title="Module D: Ongoing Compliance" subtitle="Stay in business. Avoid the fines.">
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Registering is easy. Staying registered requires discipline. You have a few key dates every year that you cannot miss.
      </p>

      <ComplianceCalendarInteractive />

      <BookInsight
        title="Don't Lose Your Company"
        author="Michael Gerber"
        book="The E-Myth Revisited"
        quote="The technician works IN the business. The entrepreneur works ON the business."
        takeaway="Governance is working ON your business. Scheduling your annual returns is an entrepreneurial act."
        color="#EF4444"
      />

      <CWCard style={{ marginBottom: '2rem', background: '#FFF7ED', border: '1px solid #FED7AA' }}>
        <h4 style={{ color: '#9A3412', marginBottom: '0.5rem' }}>Scenario: The R100 Disaster</h4>
        <p style={{ margin: 0, color: '#4B5563' }}>
          <strong>The Situation:</strong> Sarah runs a successful design agency. She forgets to pay her CIPC Annual Return fee (R100) for two years.
          <br /><br />
          <strong>The Crisis:</strong> One day, her card declines. The bank has frozen her account because CIPC "Deregistered" her company.
          <br /><br />
          <strong>The Fix:</strong> It takes 3 months of paperwork and R4,000 in penalties to re-activate it. She can't pay staff for 2 weeks.
          <br />
          <span style={{ fontWeight: 700, color: '#C2410C' }}>Set a calendar reminder. Pay the R100.</span>
        </p>
      </CWCard>

      {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
      <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', borderRadius: '24px', border: '1px solid #FDBA74' }}>
        <CWHeading level={3} style={{ color: '#EA580C', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
        </CWHeading>

        <p style={{ fontSize: '1.1rem', color: '#9A3412', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Compliance isn't just a "CFO thing"; it's a <strong>Value Protector</strong>. If you ever plan to sell your business, investors will look at your "Good Standing" history first.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: '#C2410C', marginBottom: '0.5rem' }}>1. The "Exit" Premium</h4>
            <p style={{ fontSize: '0.95rem', color: '#9A3412', lineHeight: '1.6' }}>
              A business with 5 years of perfect CIPC and SARS compliance is worth significantly more than a "messy" one. It proves operational maturity.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#C2410C', marginBottom: '0.5rem' }}>2. Credit & Funding</h4>
            <p style={{ fontSize: '0.95rem', color: '#9A3412', lineHeight: '1.6' }}>
              Banks use automated scoring. If your CIPC status is "Deregistration Process", your credit application is auto-rejected instantly. No human ever sees it.
            </p>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FED7AA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
            🚀 How CapeWeb Helps You Scale
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
            We keep your digital house in order so you can keep your legal house in order.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#F97316', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Zero-Downtime Infrastructure:</strong> Just like CIPC requires annual upkeep, your website needs it too. Our <a href="/services?service=roi-custom-web-dev" style={{ color: '#F97316', textDecoration: 'underline' }}>Performance Monitoring</a> ensures your site never gets "deregistered" from the internet due to technical debt.
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#F97316', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Systematized Operations:</strong> Use our <a href="/services?service=ai-agents-sales-team" style={{ color: '#F97316', textDecoration: 'underline' }}>Booking Flows & Reminders</a> to set up internal alerts for your own team—"Tax Filing Due in 3 days"—so you never miss a deadline again.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <CWAlert type="info" title="What about hiring?">
        Module E covers Employees, PAYE, and Labor Law in detail. This module is about the company itself.
      </CWAlert>

      {/* Mini Quiz for Module D */}
      <MiniQuiz
        question="When must a company file Annual Returns with CIPC?"
        questions={[
          {
            question: "When must a company file Annual Returns with CIPC?",
            options: ["Every month", "Only when making profit", "Every year on the anniversary of registration"],
            correctIndex: 2
          }
        ]}
        title="Roadmap Knowledge Check"
        onNext={onNext}
      />
    </InteractiveLayout>
  );
}



// Bonus Module: Cape Town Permits
const moduleBonusQuestions = [
  {
    question: "Which business needs a Certificate of Acceptability (COA)?",
    options: ["Web Design Agency", "Food Truck", "Clothing Store"],
    correctIndex: 1
  },
  {
    question: "What happens if you ignore CIPC Annual Returns?",
    options: ["Deregsitration (Company Closed)", "R50 Fine", "Nothing"],
    correctIndex: 0
  }
];

export function Pillar2ModuleBonus({ onNext }) {
  return (
    <InteractiveLayout title="Bonus: Cape Town Permits & Tenders" subtitle="Local rules for local businesses.">
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Most online-first businesses won't need special permits at Day 1. But Cape Town has specific licences for food, events, and public spaces.
      </p>

      <CWCard>
        <CWHeading level={4} style={{ marginBottom: '1rem' }}>Do you need a permit?</CWHeading>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700 }}>1. Food & Health</div>
            <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0.5rem 0' }}>Preparing or selling food? You need a <strong>Certificate of Acceptability (COA)</strong>.</p>
            <CWButton href="https://www.capetown.gov.za/City-Connect/Apply/Health-and-safety/Environmental-health/Apply-for-a-certificate-of-acceptability" target="_blank" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Apply for COA ↗</CWButton>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700 }}>2. Trading in Public</div>
            <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0.5rem 0' }}>Selling goods on the street or in markets? You need an <strong>Informal Trading Permit</strong>.</p>
            <CWButton href="https://www.capetown.gov.za/City-Connect/Apply/Licences-and-permits/Business-and-trade/Apply-for-an-informal-trading-permit" target="_blank" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>View Permits ↗</CWButton>
          </div>
        </div>
      </CWCard>

      <div style={{ marginTop: '2rem' }}>
        <CWAlert type="info" title="Government Tenders (CSD)">
          Want to sell to the government? You must register on the <strong>Central Supplier Database (CSD)</strong>. It's free and online.
          <br />
          <a href="https://secure.csd.gov.za/" target="_blank" rel="noopener" style={{ fontWeight: 700, textDecoration: 'underline', display: 'inline-block', marginTop: '0.5rem' }}>Go to CSD Portal ↗</a>
        </CWAlert>
      </div>

      {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
      <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderRadius: '24px', border: '1px solid #BAE6FD' }}>
        <CWHeading level={3} style={{ color: '#0369A1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
        </CWHeading>

        <p style={{ fontSize: '1.1rem', color: '#0C4A6E', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Your service might be digital, but your <em>presence</em> is often physical. Even if you run a cloud kitchen or a pop-up market stall, the City of Cape Town has bylaws. Ignoring them can lead to your equipment being confiscated.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: '#0369A1', marginBottom: '0.5rem' }}>1. The "Pop-Up" Economy</h4>
            <p style={{ fontSize: '0.95rem', color: '#075985', lineHeight: '1.6' }}>
              Want to run a stall at the Oranjezicht City Farm Market? You need your COA (Certificate of Acceptability). No certificate, no trading. This simple paper unlocks high-traffic retail spaces.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#0369A1', marginBottom: '0.5rem' }}>2. Event Partnerships</h4>
            <p style={{ fontSize: '0.95rem', color: '#075985', lineHeight: '1.6' }}>
              If you want to partner with big events (like the Cape Town Cycle Tour), their risk officers will demand your permits. Being "permit-ready" makes you a low-risk partner they love to hire.
            </p>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E0F2FE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
            🚀 How CapeWeb Helps You Scale
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
            Once you have the permit to trade, we help you dominate the location.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#0EA5E9', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Local SEO Dominance:</strong> We optimize your <a href="/services?service=seo-2025-beyond-keywords" style={{ color: '#0EA5E9', textDecoration: 'underline' }}>Google My Business</a> profile so when people search "Best Food Stall Cape Town", you show up first on the map.
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#0EA5E9', marginTop: '2px' }}>➜</span>
              <span>
                <strong>QR Code Menus & Payments:</strong> We build <a href="/services?service=shopify-speed-audit" style={{ color: '#0EA5E9', textDecoration: 'underline' }}>Instant Mobile Checkouts</a>. Customers at your stall scan a QR code, order, and pay in seconds—no clunky card machines required.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <CWHeading level={3} style={{ marginTop: '3rem' }}>The "Don't Get Sued" Checklist</CWHeading>
      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
        <CWCard style={{ borderLeft: '4px solid #EF4444' }}>
          <h4 style={{ margin: '0 0 0.5rem', color: '#991B1B' }}>Mistake 1: The "Handshake" Deal</h4>
          <p style={{ margin: 0, color: '#4B5563' }}>
            Never hire an employee or start a big client project without a signed contract.
          </p>
        </CWCard>

        <CWCard style={{ borderLeft: '4px solid #F59E0B' }}>
          <h4 style={{ margin: '0 0 0.5rem', color: '#92400E' }}>Mistake 2: Ignoring CIPC Annual Returns</h4>
          <p style={{ margin: 0, color: '#4B5563' }}>
            If you don't pay your R100/year, they <strong>deregister</strong> your company. Your bank account freezes. It's a nightmare to fix.
          </p>
        </CWCard>

        <CWCard style={{ borderLeft: '4px solid #10B981' }}>
          <h4 style={{ margin: '0 0 0.5rem', color: '#065F46' }}>Mistake 3: Mixing Money</h4>
          <p style={{ margin: 0, color: '#4B5563' }}>
            Using your business account for groceries. Stop it. It pierces your "Corporate Veil" and makes you personally liable.
          </p>
        </CWCard>
      </div>

      <MiniQuiz
        questions={moduleBonusQuestions}
        title="Roadmap Knowledge Check"
        onNext={onNext}
      />
    </InteractiveLayout >
  );
}

export function Pillar2Quiz({ onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizResponses, setQuizResponses] = useState({});
  const [scoreMessage, setScoreMessage] = useState('Not checked yet.');
  const [isPassed, setIsPassed] = useState(false);

  // Filter valid questions just in case
  const questions = pillar2QuizQuestions;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = quizResponses[currentQuestionIndex] !== undefined;

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

  const onSelect = (qIndex, optIndex) => {
    setQuizResponses(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const onScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (quizResponses[index] === q.correctIndex) {
        score++;
      }
    });

    const passMark = Math.ceil(questions.length * 0.7);
    if (score >= passMark) {
      setScoreMessage(`✅ PASSED! You scored ${score}/${questions.length}.`);
      setIsPassed(true);
      if (confettiModule && confettiModule.default) confettiModule.default({ particleCount: 200, spread: 120, origin: { y: 0.6 } });
    } else {
      setScoreMessage(`❌ You scored ${score}/${questions.length}. You need ${passMark} to pass. Review the modules and try again.`);
      setIsPassed(false);
    }
  };

  const currentQ = questions[currentQuestionIndex];

  return (
    <QuizLayout title="Final Check: Legal & Compliance" progress={(currentQuestionIndex + 1) / questions.length * 100}>
      <div style={{ marginBottom: '2rem' }}>
        <CWHeading level={4} style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </CWHeading>

        <CWCard>
          <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            {currentQ.question}
          </p>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {currentQ.options.map((option, optIndex) => (
              <label key={optIndex} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: quizResponses[currentQuestionIndex] === optIndex ? '2px solid #000' : '1px solid #e2e8f0',
                cursor: 'pointer',
                background: quizResponses[currentQuestionIndex] === optIndex ? '#F9FAFB' : '#fff',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio"
                  name={`q-${currentQuestionIndex}`}
                  checked={quizResponses[currentQuestionIndex] === optIndex}
                  onChange={() => onSelect(currentQuestionIndex, optIndex)}
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'black' }}
                />
                <span style={{ fontSize: '1.05rem', fontWeight: quizResponses[currentQuestionIndex] === optIndex ? 600 : 400 }}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        </CWCard>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <CWButton
          variant="secondary"
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          style={{
            opacity: currentQuestionIndex === 0 ? 0 : 1,
            pointerEvents: currentQuestionIndex === 0 ? 'none' : 'auto',
            minWidth: '120px',
            justifyContent: 'center'
          }}
        >
          ← Back
        </CWButton>

        {!isLastQuestion ? (
          <CWButton
            onClick={handleNext}
            disabled={!hasAnsweredCurrent}
            variant="primary"
            style={{ minWidth: '160px', justifyContent: 'center' }}
          >
            Next Question →
          </CWButton>
        ) : (
          !isPassed && (
            <CWButton
              onClick={onScore}
              disabled={!hasAnsweredCurrent}
              variant="primary"
              style={{
                backgroundColor: '#10B981',
                borderColor: '#10B981',
                minWidth: '160px',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              See Results
            </CWButton>
          )
        )}
      </div>

      {scoreMessage !== 'Not checked yet.' && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <CWAlert type={isPassed ? 'success' : 'error'}>
            {scoreMessage}
          </CWAlert>
          {isPassed && onFinish && (
            <CWButton
              variant="primary"
              style={{ marginTop: '1.5rem', minWidth: '200px', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem 2rem' }}
              onClick={onFinish}
            >
              Finish Pillar 2 →
            </CWButton>
          )}
        </div>
      )}
    </QuizLayout>
  );
}

export function Pillar2Completion() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    // Simulating success
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
    downloadSummary();
  };

  const downloadSummary = () => {
    const content = `
                CAPEWEB UNIVERSITY - PILLAR 2 PASSPORT
======================================
Generated for: ${form.firstName} ${form.lastName}
Date: ${new Date().toLocaleDateString()}

Congratulations on completing Pillar 2: Structure & Compliance!

KEY CONCEPTS MASTERED:
----------------------
1. Legal Structure: Chose the right vehicle (Sole Prop vs Pty Ltd).
2. Registration: CIPC & SARS setup.
3. Tax Discipline: Separate accounts, Profit First.
4. Consumer Trust: Clear policies (CPA, ECTA, POPIA).
5. The Employer System: PAYE, UIF, COIDA ready.

RECOMMENDED READING LIST:
-------------------------
- Rich Dad Poor Dad by Robert Kiyosaki
- Profit First by Mike Michalowicz
- They Ask You Answer by Marcus Sheridan
- The E-Myth Revisited by Michael Gerber

YOUR NEXT STEP:
---------------
Pillar 3: Digital HQ (The Build).
Now that you are legal, let's build the machine that sells.

CapeWeb University © ${new Date().getFullYear()}
        `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CapeWeb_Pillar2_Passport_${form.firstName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (status === 'success') {
    return (
      <ReadingLayout title="Pillar 2 Complete!">
        <CWCard style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <h2 className="cw-heading-md">Passport Issued!</h2>
          <p style={{ color: 'var(--cw-text-secondary)', margin: '1rem 0' }}>
            Your summary has been downloaded. You are now "Business Ready".
          </p>
          <CWButton variant="primary" onClick={() => window.location.reload()}>Proceed to Pillar 3 (Coming Soon)</CWButton>
        </CWCard>
      </ReadingLayout>
    );
  }

  return (
    <ReadingLayout title="Pillar 2 Complete!">
      <CWCard style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <h2 className="cw-heading-md">You Are Legally Ready!</h2>
          <p style={{ color: 'var(--cw-text-secondary)' }}>
            You've completed the Compliance Pillar. Claim your summary and reading list below.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="cw-label">First Name</label>
              <CWInput required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Name" />
            </div>
            <div>
              <label className="cw-label">Last Name</label>
              <CWInput required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Surname" />
            </div>
          </div>
          <div>
            <label className="cw-label">Email Address</label>
            <CWInput required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" />
          </div>

          <div style={{ background: '#F0F9FF', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#0369A1', border: '1px solid #BAE6FD' }}>
            <strong>🎁 Includes:</strong>
            <ul style={{ margin: '0.5rem 0 0 1.2rem' }}>
              <li>Full Pillar 2 Checklist (Text version)</li>
              <li>Legal/Finance Book List</li>
              <li>CapeWeb University "Sophomore" Status</li>
            </ul>
          </div>

          <CWButton type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Generating...' : 'Download My Summary & Finish'}
          </CWButton>
        </form>
      </CWCard>
    </ReadingLayout>
  );
}


// ========================================
// MODULE E: WORKFORCE & LABOR LAW
// ========================================

// Interactive: Hiring Calculator
function HiringCalculatorInteractive() {
  const [salary, setSalary] = useState(10000);

  // Costs (Employer Contributions)
  const uif = salary * 0.01; // 1%
  const sdl = salary > 41666 ? salary * 0.01 : 0; // SDL only if payroll > R500k/yr (simplification) -> Let's just show it as a potential cost or 0
  const coida = salary * 0.01; // Approx 1% risk
  const totalEmployerCost = salary + uif + coida + sdl;

  // Deductions (Employee Pays)
  const uifEmployee = salary * 0.01;
  const paye = salary > 7916 ? (salary - 7916) * 0.18 : 0; // Very rough simplified progressive tax for demo
  const netPay = salary - uifEmployee - paye;

  return (
    <div style={{ margin: '3rem 0' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>The "True Cost" of an Employee</h3>

      <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>Gross Monthly Salary: R{salary}</label>
          <input
            type="range" min="5000" max="50000" step="1000"
            value={salary} onChange={(e) => setSalary(Number(e.target.value))}
            style={{ width: '100%', maxWidth: '400px', accentColor: '#0b0f1a' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

          {/* Employee View */}
          <div style={{ background: '#F0F9FF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#0369A1' }}>👮‍♂️ What they take home</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Gross:</span> <span>R{salary.toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#DC2626' }}>
              <span>- PAYE (Tax):</span> <span>R{paye.toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#DC2626' }}>
              <span>- UIF (1%):</span> <span>R{uifEmployee.toFixed(0)}</span>
            </div>
            <div style={{ borderTop: '2px solid #BAE6FD', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: '#0369A1' }}>
              <span>Net Pay:</span> <span>R{netPay.toFixed(0)}</span>
            </div>
          </div>

          {/* Employer View */}
          <div style={{ background: '#FDF2F8', padding: '1.5rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#BE185D' }}>🏢 What it costs YOU</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Gross Salary:</span> <span>R{salary.toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#BE185D' }}>
              <span>+ UIF (1%):</span> <span>R{uif.toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#BE185D' }}>
              <span>+ COIDA (~1%):</span> <span>R{coida.toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#BE185D' }}>
              <span>+ SDL (1%):</span> <span>{sdl > 0 ? `R${sdl.toFixed(0)}` : 'R0 (Exempt)'}</span>
            </div>
            <div style={{ borderTop: '2px solid #FBCFE8', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: '#BE185D' }}>
              <span>Total Cost:</span> <span>R{totalEmployerCost.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Module E: Workforce & Labor Law
export function Pillar2ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: Hiring & Labor Law" subtitle="Hiring your first employee cleanly.">
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Hiring is exciting but risky. In South Africa, labor laws are strict.
        <br /><strong>The Golden Rule:</strong> Hire slow, fire rarely (because it's hard), and always use a contract.
      </p>

      <HiringCalculatorInteractive />

      <CWHeading level={3}>The "Big 3" You Must Pay</CWHeading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <CWCard>
          <strong style={{ color: '#0b0f1a', fontSize: '1.1rem' }}>1. PAYE (Tax)</strong>
          <p style={{ fontSize: '0.9rem', color: '#4B5563' }}>You deduct this from their salary and pay it to SARS. If you don't, you are liable.</p>
        </CWCard>
        <CWCard>
          <strong style={{ color: '#0b0f1a', fontSize: '1.1rem' }}>2. UIF (1%)</strong>
          <p style={{ fontSize: '0.9rem', color: '#4B5563' }}>1% from them, 1% from you. Protects them if they lose their job.</p>
        </CWCard>
        <CWCard>
          <strong style={{ color: '#0b0f1a', fontSize: '1.1rem' }}>3. COIDA (Injuries)</strong>
          <p style={{ fontSize: '0.9rem', color: '#4B5563' }}>Workplace insurance. Annual fee to Department of Labour. Mandatory.</p>
        </CWCard>
      </div>

      <CWAlert type="warning" title="Scenario: The 'Casual' Gardener">
        <strong>The Trap:</strong> You hire a gardener for the office. He works every Tuesday. You pay him cash. After 6 months, you tell him "We don't need you anymore."
        <br /><br />
        <strong>The CCMA Result:</strong> He is not a casual worker; he is a part-time employee. You fired him without process. You owe him 6 months' salary as a penalty.
        <br />
        <strong>Lesson:</strong> Anyone who works regular hours is likely an employee.
      </CWAlert>

      {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
      <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)', borderRadius: '24px', border: '1px solid #D8B4FE' }}>
        <CWHeading level={3} style={{ color: '#7E22CE', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
        </CWHeading>

        <p style={{ fontSize: '1.1rem', color: '#6B21A8', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Your employees are your biggest asset, but "Labor Risk" is your biggest liability. A solid Human Systems infrastructure allows you to focus on leadership rather than fighting in court.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: '#6B21A8', marginBottom: '0.5rem' }}>1. Scalable Culture</h4>
            <p style={{ fontSize: '0.95rem', color: '#581C87', lineHeight: '1.6' }}>
              Clear contracts and KPIs (Key Performance Indicators) attract "A-Players". High performers want to know the rules of the game. Ambiguity attracts slackers.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#6B21A8', marginBottom: '0.5rem' }}>2. Automate the "Admin"</h4>
            <p style={{ fontSize: '0.95rem', color: '#581C87', lineHeight: '1.6' }}>
              Using software for payroll (SimplePay) removes the "Sunday Night Stress" of calculating PAYE. If you don't automate it, you will eventually make a mistake that costs you fines.
            </p>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E9D5FF', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
            🚀 How CapeWeb Helps You Scale
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
            While you hire humans, we build the "Digital Employees" that never sleep.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#A855F7', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Reduced Headcount:</strong> Before you hire your next support staff, consider our <a href="/services?service=ai-agents-sales-team" style={{ color: '#A855F7', textDecoration: 'underline' }}>AI Agents</a>. One AI agent can handle the workload of 5 humans for a fraction of the cost, with zero UIF/PAYE paperwork.
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#A855F7', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Training Materials:</strong> We build internal <a href="/services?service=future-digital-branding" style={{ color: '#A855F7', textDecoration: 'underline' }}>Brand Wikis & Knowledge Bases</a> so when you do hire, your new employee can "download" your company brain in days, not months.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <BookInsight title="Safety helps performance" author="Simon Sinek" book="Leaders Eat Last" color="#6366F1">
        <p>"When people feel safe, they can focus their energy on the work. When they feel unsafe, they spend their energy protecting themselves."</p>
        <p><strong>Lesson:</strong> Contracts and UIF aren't just admin; they make your team feel safe, which makes them work better.</p>
      </BookInsight>

      <MiniQuiz
        question="Which contribution is shared 50/50 between employer and employee?"
        questions={[
          {
            question: "Which contribution is shared 50/50 between employer and employee?",
            options: ["PAYE", "UIF (Unemployment Insurance)", "COIDA"],
            correctIndex: 1
          }
        ]}
        title="Roadmap Knowledge Check"
        onNext={onNext}
      />
    </InteractiveLayout>
  );
}

// ========================================
// MODULE F: B-BBEE, TENDERS & SUPPLIER DEVELOPMENT
// ========================================

// Interactive: B-BBEE Calculator
function BBBEEStatusInteractive() {
  const [turnover, setTurnover] = useState(1000000); // 1m
  const [blackOwnership, setBlackOwnership] = useState(0);

  let classification = 'Generic (Large Enterprise)';
  let level = 'Level 8 (Non-Compliant)';
  let strategy = 'Complex Scorecard';

  if (turnover < 10000000) {
    classification = 'EME (Exempt Micro Enterprise)';
    strategy = 'Automatic Level 4 (Just an Affidavit)';
    level = 'Level 4';
    if (blackOwnership === 100) level = 'Level 1';
    else if (blackOwnership >= 51) level = 'Level 2';
  } else if (turnover < 50000000) {
    classification = 'QSE (Qualifying Small Enterprise)';
    strategy = 'Simplified Scorecard';
    level = 'Calculated by Agency';
    if (blackOwnership === 100) level = 'Level 1 (Automatic)';
    else if (blackOwnership >= 51) level = 'Level 2 (Automatic)';
  }

  return (
    <div style={{ margin: '3rem 0' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>B-BBEE Status Predictor</h3>

      <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Annual Turnover: R{turnover.toLocaleString()}</label>
          <input
            type="range" min="0" max="60000000" step="100000"
            value={turnover} onChange={(e) => setTurnover(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0b0f1a' }}
          />
          <div style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', justifyContent: 'space-between' }}>
            <span>R0</span><span>R10m (EME Limit)</span><span>R50m (QSE Limit)</span><span>R60m+</span>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Black Ownership: {blackOwnership}%</label>
          <input
            type="range" min="0" max="100" step="1"
            value={blackOwnership} onChange={(e) => setBlackOwnership(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0b0f1a' }}
          />
        </div>

        <div style={{ background: '#F3F4F6', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#4B5563' }}>Classification</div>
              <div style={{ fontWeight: 700, color: '#0b0f1a' }}>{classification}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#4B5563' }}>Est. Level</div>
              <div style={{ fontWeight: 700, color: '#059669' }}>{level}</div>
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#374151', borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
            <strong>Strategy:</strong> {strategy}
          </div>
        </div>
      </div>
    </div>
  )
}

const moduleFQuestions = [
  {
    question: "If your revenue is under R10m, what B-BBEE proof do you need?",
    options: ["An expensive audit", "A Sworn Affidavit", "Nothing"],
    correctIndex: 1
  }
];

export function Pillar2ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: B-BBEE & Tenders" subtitle="Opening the doors to government & corporate deals.">
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        In South Africa, B-BBEE is a business reality. You can ignore it and sell B2C, or embrace it and unlock B2G (Government) and B2B (Corporate) revenue.
      </p>

      <CWHeading level={3}>Do you need a B-BBEE Certificate?</CWHeading>
      <div style={{ background: '#F0FDF4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #BBF7D0', marginBottom: '2rem' }}>
        <p style={{ margin: 0, color: '#166534', fontSize: '1.1rem' }}>
          <strong>Good News:</strong> If your turnover is under R10 Million/year, you are an <strong>EME</strong> (Exempt Micro Enterprise).
          <br /><br />
          You do <strong>NOT</strong> need an audit. You just need a <strong>Sworn Affidavit</strong> signed at a police station. It costs R0.
        </p>
      </div>

      <BBBEEStatusInteractive />

      <CWCard style={{ marginBottom: '2rem', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
        <h4 style={{ color: '#166534', marginBottom: '0.5rem' }}>Scenario: The "Cheapest" Loss</h4>
        <p style={{ margin: 0, color: '#4B5563' }}>
          <strong>The Situation:</strong> You bid for a R500k government catering contract. Your price is the best (cheapest).
          <br /><br />
          <strong>The Result:</strong> You lose to a competitor who was 10% more expensive. Why? They had a Level 1 B-BBEE Affidavit. You had nothing (Level 8).
          <br /><br />
          <strong>Lesson:</strong> In government work, Price represents 80-90 points. B-BBEE represents 10-20 points. You cannot win without those points.
        </p>
      </CWCard>

      {/* NEW SECTION: Why It Matters + CapeWeb Offering */}
      <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', borderRadius: '24px', border: '1px solid #86EFAC' }}>
        <CWHeading level={3} style={{ color: '#166534', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
        </CWHeading>

        <p style={{ fontSize: '1.1rem', color: '#14532D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Tenders are not just for construction companies. Large corporates (banks, insurers, retailers) spend billions on digital services every year. They <strong>must</strong> spend 3% of their profit on Supplier Development (you).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: '#15803D', marginBottom: '0.5rem' }}>1. The "Supplier Development" Pot</h4>
            <p style={{ fontSize: '0.95rem', color: '#14532D', lineHeight: '1.6' }}>
              Big companies get B-BBEE points for training their suppliers. This often means they will pay YOU to improve your own business (buy you laptops, software, or advanced training) just so they can claim the points.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#15803D', marginBottom: '0.5rem' }}>2. Corporate Vendor Lists</h4>
            <p style={{ fontSize: '0.95rem', color: '#14532D', lineHeight: '1.6' }}>
              You cannot get a contract with a bank if you are not B-BBEE compliant. It is the "Gatekeeper" requirement. Once you are in, the contracts are usually 12-24 months long (stable recurring revenue).
            </p>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #DCFCE7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
            🚀 How CapeWeb Helps You Scale
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
            When you pitch for a tender, your proposal needs to look world-class.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#22C55E', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Tender-Ready Documents:</strong> Our <a href="/services?service=future-digital-branding" style={{ color: '#22C55E', textDecoration: 'underline' }}>Branding Team</a> designs professional capabilities decks and company profiles that scream "competence" before they even read your price.
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
              <span style={{ color: '#22C55E', marginTop: '2px' }}>➜</span>
              <span>
                <strong>Automated Client Onboarding:</strong> If you win a tender, you might get 500 new "users" or "clients" overnight. Our <a href="/services?service=ai-agents-sales-team" style={{ color: '#22C55E', textDecoration: 'underline' }}>Automation Systems</a> ensure you can handle the sudden spike in volume without breaking a sweat.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <BookInsight title="Context matters" author="Vusi Thembekwayo" book="Vusi: Business & Life Lessons" color="#0b0f1a">
        <p>"You cannot copy Silicon Valley in South Africa. We have different rules, different history, and different structures."</p>
        <p><strong>Lesson:</strong> B-BBEE is part of the SA landscape. Don't fight it; understand it and use it as a strategic lever.</p>
      </BookInsight>

      <CWHeading level={3}>How to find Tenders</CWHeading>
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
        <a href="https://www.etenders.gov.za/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <CWCard hoverable>
            <strong>eTenders Portal</strong> (National Treasury)
          </CWCard>
        </a>
        <a href="https://secure.csd.gov.za/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <CWCard hoverable>
            <strong>CSD (Central Supplier Database)</strong> - You MUST register here to get paid.
          </CWCard>
        </a>
      </div>

      <MiniQuiz
        questions={moduleFQuestions}
        title="Roadmap Knowledge Check"
        onNext={onNext}
      />
    </InteractiveLayout>
  );
}



