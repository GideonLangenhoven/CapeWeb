import React, { useState, useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';
import { gsap } from 'gsap';
import { InteractiveLayout, QuizLayout } from './CapeWebLayouts';
import { CWButton, CWHeading, CWCard, CWInput, CWBadge, CWAlert, BookInsight } from './CapeWebUI';

// ==========================================
// PILLAR 8 QUIZ DATA
// ==========================================
export const pillar8QuizQuestions = [
  {
    question: 'What is the "weakest link" in any security system according to Kevin Mitnick?',
    options: ['The Firewall', 'The Encryption', 'The Human (Social Engineering)'],
    correctIndex: 2,
  },
  {
    question: 'What does 2FA stand for, and why is it essential?',
    options: ['2 Fast Ads', 'Two-Factor Authentication (Something you know + Something you have)', 'Two False Attempts'],
    correctIndex: 1,
  },
  {
    question: 'In South Africa, what is the law governing data privacy?',
    options: ['GDPR', 'POPIA (Protection of Personal Information Act)', 'HIPAA'],
    correctIndex: 1,
  },
  {
    question: 'What is "Phishing"?',
    options: ['Catching fish', 'A fraudulent attempt to obtain sensitive info by disguising as a trustworthy entity', 'A database error'],
    correctIndex: 1,
  },
  {
    question: 'What does HTTPS ensure on a website?',
    options: ['That the site is fast', 'That the communication between user and server is encrypted', 'That the site is legal'],
    correctIndex: 1,
  },
  {
    question: 'If you receive an email from "The CEO" asking for urgent iTunes gift cards, what is it?',
    options: ['A generous bonus', 'A "Spear Phishing" or "Whaling" attack', 'A mistake'],
    correctIndex: 1,
  },
  {
    question: 'What is the best way to manage passwords?',
    options: ['Write them on a sticky note', 'Use the same password everywhere', 'Use a Password Manager (1Password/LastPass) with unique passwords'],
    correctIndex: 2,
  },
  {
    question: 'What is "Ransomware"?',
    options: ['Software that audits your money', 'Malware that encrypts your files and demands payment to unlock them', 'Free software'],
    correctIndex: 1,
  },
  {
    question: 'What does the "CIA Triad" stand for in security?',
    options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Control, Inspect, Audit'],
    correctIndex: 1,
  },
  {
    question: 'Why are public backups (like public S3 buckets) dangerous?',
    options: ['They cost money', 'Anyone on the internet can download your customer data', 'They are slow'],
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

function CIATriadVisual() {
  const [active, setActive] = useState('c');
  const details = {
    c: { title: "Confidentiality", desc: "Keeping secrets secret. If this fails, your customer list is on the dark web.", icon: "🤫", color: "#3B82F6" },
    i: { title: "Integrity", desc: "Keeping data accurate. If this fails, your bank balance says R0 instead of R100,000.", icon: "⚖️", color: "#10B981" },
    a: { title: "Availability", desc: "Keeping systems online. If this fails, your website is down on Black Friday.", icon: "🟢", color: "#F59E0B" }
  };

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {Object.keys(details).map(key => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              padding: '1rem', borderRadius: '12px', border: 'none',
              background: active === key ? details[key].color : '#fff',
              color: active === key ? 'white' : '#64748B',
              cursor: 'pointer', flex: 1, fontWeight: 'bold', transition: 'all 0.2s',
              boxShadow: active === key ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {details[key].title}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{details[active].icon}</div>
        <h4 style={{ color: details[active].color }}>{details[active].title}</h4>
        <p style={{ color: '#475569' }}>{details[active].desc}</p>
      </div>
    </div>
  );
}

function PasswordCrackerSim() {
  const [pwd, setPwd] = useState('');
  const [crackTime, setCrackTime] = useState('0 seconds');
  const [color, setColor] = useState('#EF4444');

  useEffect(() => {
    let time = "0 seconds";
    let c = "#EF4444";
    if (pwd.length === 0) { time = "0 seconds"; c = "#EF4444"; }
    else if (pwd.length < 6) { time = "Instantly"; c = "#EF4444"; }
    else if (pwd.length < 8) { time = "2 minutes"; c = "#F97316"; }
    else if (pwd.length < 12) {
      time = /[0-9]/.test(pwd) && /[A-Z]/.test(pwd) ? "3 weeks" : "4 hours";
      c = "#F59E0B";
    }
    else {
      time = /[!@#$%^&*]/.test(pwd) ? "400 years" : "2 years";
      c = "#10B981";
    }
    setCrackTime(time);
    setColor(c);
  }, [pwd]);

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#0F172A', color: 'white', borderRadius: '24px' }}>
      <h4 style={{ color: '#94A3B8', marginBottom: '1rem' }}>Brute Force Simulator</h4>
      <input
        type="text"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        placeholder="Type a password..."
        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: '#1E293B', color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Estimated Time to Crack:</span>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: color }}>{crackTime}</span>
      </div>
      <div style={{ height: '4px', background: '#334155', borderRadius: '2px', marginTop: '1rem', overflow: 'hidden' }}>
        <div style={{ width: color === '#10B981' ? '100%' : color === '#F59E0B' ? '60%' : '10%', height: '100%', background: color, transition: 'all 0.5s' }} />
      </div>
    </div>
  );
}

function PhishingGauntlet() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const scenarios = [
    { text: "Email from 'microsoft-security@outlook.com' says your PC is infected.", legit: false, hint: "Check the domain: Microsoft uses @microsoft.com" },
    { text: "SMS from your bank saying 'Deduction of R5000 authorized. If not you, click bit.ly/bank-help'.", legit: false, hint: "Banks never send shortened bit.ly links for security." },
    { text: "Email from 'it-support@yourcompany.com' with an attachment 'Office_Party_Photos.exe'.", legit: false, hint: ".exe files are almost always malicious in emails." }
  ];

  const handleChoice = (isLegit) => {
    const correct = isLegit === scenarios[step].legit;
    if (correct) setScore(score + 1);
    if (step < scenarios.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#FFF7ED', borderRadius: '24px', border: '1px solid #FFEDD5' }}>
      {!showResult ? (
        <>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', color: '#C2410C' }}>Phishing Gauntlet</span>
            <span>{step + 1} / {scenarios.length}</span>
          </div>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', minHeight: '60px' }}>{scenarios[step].text}</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => handleChoice(true)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid #FED7AA', background: 'white', cursor: 'pointer' }}>Legit ✅</button>
            <button onClick={() => handleChoice(false)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid #FED7AA', background: 'white', cursor: 'pointer' }}>Fishy 🎣</button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h4>Result: {score}/{scenarios.length} identified!</h4>
          <p>{score === 3 ? "You are a human firewall!" : "Keep practicing. Hackers only need you to slip up once."}</p>
          <button onClick={() => { setStep(0); setScore(0); setShowResult(false); }} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#C2410C', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Restart</button>
        </div>
      )}
    </div>
  );
}

function SSLCipherSim() {
  const [msg, setMsg] = useState('Hello');
  const [encrypted, setEncrypted] = useState('');

  useEffect(() => {
    setEncrypted(msg.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 5)).join(''));
  }, [msg]);

  return (
    <div style={{ margin: '2rem 0', padding: '2rem', background: '#F0FDF4', borderRadius: '24px', border: '1px solid #DCFCE7' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', color: '#166534', marginBottom: '0.5rem' }}>Client Type (Your Input):</label>
        <input type="text" value={msg} onChange={e => setMsg(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #BBF7D0' }} />
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1, padding: '1rem', background: 'white', borderRadius: '12px', border: '1px dashed #166534', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#166534' }}>In-Transit (Encrypted)</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{encrypted}</div>
        </div>
        <div style={{ fontSize: '1.5rem' }}>🔒</div>
        <div style={{ flex: 1, padding: '1rem', background: 'white', borderRadius: '12px', border: '1px solid #BBF7D0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#166534' }}>Server Receives</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{msg}</div>
        </div>
      </div>
    </div>
  );
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
        <div style={{ padding: '2rem', background: '#FEF2F2', borderRadius: '24px', border: '2px solid #FECACA', animation: 'fadeIn 0.5s', color: '#991B1B' }}>
          {oldContent}
        </div>
      ) : (
        <div style={{ padding: '2rem', background: '#ECFDF5', borderRadius: '24px', border: '2px solid #A7F3D0', animation: 'fadeIn 0.5s', color: '#064E3B' }}>
          {newContent}
        </div>
      )}
    </div>
  );
}


// ==========================================
// PILLAR 8 MODULES A-I
// ==========================================

// Module A: Fundamentals
export function Pillar8ModuleA({ onNext }) {
  return (
    <InteractiveLayout title="Module A: The CIA Triad" subtitle="More than just secrets.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Security is not just about keeping data <strong>Secret</strong>. It is also about keeping it <strong>Correct</strong> and <strong>Accessible</strong>.
        </p>

        <CIATriadVisual />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
          <CWHeading level={3} style={{ color: '#1E293B', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🛡️</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>The Trust Tax.</strong> If you lose customer data (Confidentiality), you lose trust. If your inventory numbers are hacked (Integrity), you lose money. If your site is down (Availability), you lose sales. Digital security is the floor of your business—it must be solid.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=care-plans" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Security & Care Plans</a>: We monitor your "Availability" 24/7/365, ensuring your digital assets remain online and un-tampered with while you focus on growth.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What does Integrity mean in the CIA Triad?", options: ["The data is secret", "The data is accurate and untampered", "The data is profitable"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// Module B: Passwords
export function Pillar8ModuleB({ onNext }) {
  return (
    <InteractiveLayout title="Module B: Authentication" subtitle="You are the password.">
      <div className="cw-prose">
        <p className="cw-text-body">
          "Password123" is cracked in 0.001 seconds. Diversity and length are your shields.
        </p>

        <PasswordCrackerSim />

        <ScenarioToggle
          oldTitle="The Sticky Note 📝"
          oldContent="Using the same 3 passwords for Gmail, Bank, and Facebook. One leak in a minor app means the hacker has the 'Skeleton Key' to your entire life."
          newTitle="The Vault 🔐"
          newContent="Using a Password Manager. You remember one complex 'Master Key', while the app generates and remembers 64-character random strings for everything else."
        />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', borderRadius: '24px', border: '1px solid #C7D2FE' }}>
          <CWHeading level={3} style={{ color: '#3730A3', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔑</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#312E81', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Account Takeover (ATO).</strong> If a hacker gets into your business email, they can reset your bank passwords, message your customers, and destroy your brand in hours. MFA (Multi-Factor Authentication) is not a feature; it's a requirement for survival.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #C7D2FE', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=automation-systems" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Secure Infrastructure</a>: We set up secure employee access systems using SSO (Single Sign-On), so you can revoke access for any ex-employee with one click.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is Multi-Factor Authentication (MFA)?", options: ["Using two passwords", "Combining 'Something you Know' with 'Something you Have'", "Asking a friend"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// Module C: Phishing
export function Pillar8ModuleC({ onNext }) {
  return (
    <InteractiveLayout title="Module C: Social Engineering" subtitle="Hacking the human.">
      <div className="cw-prose">
        <p className="cw-text-body">
          Hackers don't always break firewalls; they trick you into opening the door. This is called <strong>Phishing</strong>.
        </p>

        <PhishingGauntlet />

        <BookInsight title="The Art of Deception" author="Kevin Mitnick" book="The Art of Deception" color="#EF4444">
          <p>"The human factor is truly security's weakest link."</p>
        </BookInsight>

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', borderRadius: '24px', border: '1px solid #FED7AA' }}>
          <CWHeading level={3} style={{ color: '#9A3412', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎣</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#7C2D12', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Human Vulnerability.</strong> You can spend R100,000 on software, but it only takes one intern clicking one bad link to compromise the entire network. Social engineering is the #1 way companies are actually breached.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FED7AA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ai-agents-sales-team" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Filtered Communications</a>: Our AI triage agents act as a buffer, filtering out malicious intent and phishing attempts before they ever hit your team's inbox.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is 'Social Engineering'?", options: ["Building social apps", "Manipulating people into performing actions or divulging confidential info", "Coding with friends"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// Module D: Website Security
export function Pillar8ModuleD({ onNext }) {
  return (
    <InteractiveLayout title="Module D: Securing the Web" subtitle="HTTPS & Headers.">
      <div className="cw-prose">
        <p className="cw-text-body">
          <strong>HTTPS (TLS/SSL):</strong> Encrypts the tunnel between user and server. Without it, your customer's data is readable by anyone on the same network.
        </p>

        <SSLCipherSim />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', borderRadius: '24px', border: '1px solid #BBF7D0' }}>
          <CWHeading level={3} style={{ color: '#166534', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🖥️</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#14532D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>SEO & Trust.</strong> Google penalizes sites without SSL. Browsers show a scary "Not Secure" warning. Most importantly, without HTTPS, you are legally liable if customer credit card info is intercepted on your checkout page.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BBF7D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-monitoring" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Secure Hosting</a>: We implement automatic SSL renewal and HSTS (Strict Transport Security) on all our client sites, ensuring 100% encryption by default.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What happens if a site does not have HTTPS?", options: ["It is slower", "Data sent is visible to anyone on the network", "Google bans it"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// Module E: POPIA
export function Pillar8ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: POPIA Compliance" subtitle="Privacy is Law.">
      <div className="cw-prose">
        <p className="cw-text-body">
          In South Africa, <strong>POPIA</strong> mandates how you treat customer data. You cannot spam people. You must secure their data.
        </p>
        <CWAlert type="info" title="The Golden Rule">
          Treat customer data like toxic waste. Only collect what you absolutely need. If you don't have it, you can't lose it.
        </CWAlert>

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#9D174D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚖️</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#831843', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Legal Liability.</strong> Fines for POPIA violations can reach R10 million, or even prison time for severe negligence. Proper compliance isn't just a legal chore—it's a competitive advantage that builds long-term customer loyalty.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=content-converts" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Privacy-First Marketing</a>: We help you build "Owned" email lists via ethical, opt-in funnels that comply with POPIA while maintaining high conversion rates.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Under POPIA, what must you do if you have a data breach?", options: ["Hide it", "Notify the Information Regulator and affected parties", "Delete the data"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// Module F: Device Security
export function Pillar8ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: Endpoint Protection" subtitle="My laptop was stolen.">
      <div className="cw-prose">
        <p>If your laptop is stolen, is the data safe? <strong>Full Disk Encryption (FileVault / BitLocker)</strong> scrambles the hard drive.</p>

        <ScenarioToggle
          oldTitle="Unencrypted 💻"
          oldContent="Thief takes Hard Drive out of laptop. Plugs it into his PC. Reads all your business records, spreadsheets, and client contacts instantly."
          newTitle="Encrypted 🔐"
          newContent="Thief takes Hard Drive out. Sees only garbage code. Without your recovery key, the data is essentially non-existent to them."
        />

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)', borderRadius: '24px', border: '1px solid #CBD5E1' }}>
          <CWHeading level={3} style={{ color: '#334155', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🛡️</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#1E293B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Physical Loss.</strong> We spend so much energy on hackers that we forget about the coffee shop thief. A stolen laptop with customer data on it is a POPIA breach. Encryption turns a catastrophe into a minor insurance claim.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #CBD5E1', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=care-plans" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Remote Management</a>: We can set up MDM (Mobile Device Management) for your team, allowing you to remotely wipe any lost or stolen device instantly.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What protects data if the physical device is stolen?", options: ["A strong password", "Full Disk Encryption", "GPS Tracking"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// Module G: Cloud Security
export function Pillar8ModuleG({ onNext }) {
  return (
    <InteractiveLayout title="Module G: Cloud configuration" subtitle="The open bucket.">
      <div className="cw-prose">
        <p>The #1 cause of massive data leaks is <strong>Misconfigured Cloud Storage</strong>. Developers set "permissions: public" for ease of testing and forget to change it back.</p>
        <p><strong>Principle of Least Privilege:</strong> Give a system ONLY the access it needs, nothing more.</p>

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '24px', border: '1px solid #A7F3D0' }}>
          <CWHeading level={3} style={{ color: '#065F46', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>☁️</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#064E3B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Scale Breaches.</strong> One bad cloud setting can leak your entire database in seconds. Cloud systems are incredibly powerful but require precise configuration. It's not the cloud that is insecure—it's the way humans set it up.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A7F3D0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=performance-monitoring" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Cloud Audits</a>: We perform security audits of your AWS, GCP, or Azure environments to ensure no sensitive "Buckets" are exposed to the public internet.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the 'Principle of Least Privilege'?", options: ["Being mean", "Granting only the minimum permissions necessary to do the job", "Giving admin access to everyone"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// Module H: Incident Response
export function Pillar8ModuleH({ onNext }) {
  return (
    <InteractiveLayout title="Module H: Incident Response" subtitle="Don't panic. Prepare.">
      <div className="cw-prose">
        <p>Breaches happen. How you respond defines your survival.</p>

        <CWCard>
          <h4 style={{ color: '#EF4444' }}>The Breach Protocol</h4>
          <ol>
            <li><strong>Identify:</strong> Use monitoring to detect anomalies early.</li>
            <li><strong>Contain:</strong> Isolate infected systems immediately.</li>
            <li><strong>Eradicate:</strong> Identify and remove the root cause.</li>
            <li><strong>Recover:</strong> Restore from clean, off-site backups.</li>
          </ol>
        </CWCard>

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', borderRadius: '24px', border: '1px solid #FECACA' }}>
          <CWHeading level={3} style={{ color: '#991B1B', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🚨</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#7F1D1D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Business Continuity.</strong> A ransomware attack can lock you out of your data for weeks. Without an Incident Response plan and redundant backups, that is often a "Company Ending Event." Preparation is the difference between a bad day and bankruptcy.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FECACA', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=care-plans" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Disaster Recovery</a>: We implement automatic, immutable off-site backups for all client websites, so we can roll back to a clean state in minutes if a breach occurs.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What is the first meaningful step after noticing a breach?", options: ["Identifying and Containment (Stopping the spread)", "Posting on Twitter", "Firing the intern"], correctIndex: 0 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// Module I: Training
export function Pillar8ModuleI({ onNext }) {
  return (
    <InteractiveLayout title="Module I: Security Culture" subtitle="The Human Firewall.">
      <div className="cw-prose">
        <p>Tech cannot fix human error. You must train your staff.</p>
        <p>Create a "No Blame" culture. If someone clicks a link, they should feel safe reporting it immediately, rather than hiding it out of fear of being fired.</p>

        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)', borderRadius: '24px', border: '1px solid #A5F3FC' }}>
          <CWHeading level={3} style={{ color: '#083344', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👥</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#164E63', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            <strong>Operational Resilience.</strong> Security is a team sport. If everyone in your company understands the value of security, they become your strongest defense. A security-conscious culture is the only thing that works when the software fails.
          </p>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #A5F3FC', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#3B82F6', marginTop: '2px' }}>➜</span>
                <span>
                  <a href="/services?service=ai-agents-sales-team" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Policy Training</a>: We can build custom AI training assistants that teach your team about your specific company security policies in an interactive, non-boring way.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "Who is responsible for security?", options: ["The IT Guy", "Everyone", "The Government"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  );
}


// ==========================================
// FINAL QUIZ COMPONENT
// ==========================================

export function Pillar8Quiz({ quizResponses, onSelect, onScore, scoreMessage, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  // Local state handling if props missing
  const [localResponses, setLocalResponses] = useState({});
  const activeResponses = quizResponses || localResponses;
  const activeSetResponse = onSelect || ((qMvc, optIdx) => setLocalResponses(prev => ({ ...prev, [qMvc]: optIdx })));

  const questions = pillar8QuizQuestions;
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
          <CWHeading level={3}>Security Cleared</CWHeading>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{scoreMessage}</p>
          <CWButton onClick={onFinish}>Continue to Certificate →</CWButton>
        </div>
      </CWCard>
    );
  }

  return (
    <QuizLayout title="Final Exam: Cyber Security" currentStep={currentQuestionIndex + 1} totalSteps={questions.length}>
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

export function Pillar8Completion() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>🔐</h1>
      <CWHeading level={2}>Cyber Guardian</CWHeading>
      <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '1rem auto' }}>
        You now understand the threats. You have locked the digital doors. You are no longer "Low Hanging Fruit" for hackers.
      </p>
    </div>
  );
}
