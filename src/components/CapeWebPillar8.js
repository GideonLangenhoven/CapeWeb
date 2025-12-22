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
    question: 'You receive an email from "The CEO" (ceo@company-update.com) asking you to urgently buy 10 iTunes Gift Cards for a client. You pause. What did you spot?',
    options: ['A legitimate request', 'A "Whaling" / Spear Phishing attack (Spoofed sender)', 'A generous bonus'],
    correctIndex: 1,
  },
  {
    question: 'A hacker guesses your password ("Password123"). They try to log in, but are asked for a 6-digit code sent to your phone. They fail. What saved you?',
    options: ['Luck', '2FA (Two-Factor Authentication)', 'The hacker gave up'],
    correctIndex: 1,
  },
  {
    question: 'You have 50 different accounts. You don\'t know ANY of the passwords, but you log into them instantly using one "Master Key". What tool are you using?',
    options: ['A sticky note', 'A Password Manager (LastPass/1Password)', 'Your brain'],
    correctIndex: 1,
  },
  {
    question: 'You open a strange attachment named "Invoice_Final.exe". Suddenly your screen turns red and says "All files encrypted. Pay R50,000 to unlock". What is this?',
    options: ['Ransomware', 'A software update', 'A prank'],
    correctIndex: 0,
  },
  {
    question: 'You are at a coffee shop. You log into your business bank account using the free, unencrypted "Guest Wi-Fi". A hacker intercepts your data. What was the mistake?',
    options: ['You didn\'t buy coffee', 'Using Public Wi-Fi for sensitive banking without a VPN', 'Typing too slowly'],
    correctIndex: 1,
  },
  {
    question: 'You lose a USB drive containing unencrypted IDs and emails of 5,000 customers. Under POPIA law in South Africa, what MUST you do?',
    options: ['Keep quiet and hope nobody notices', 'Notify the Information Regulator and the affected customers', 'Buy a new USB'],
    correctIndex: 1,
  },
  {
    question: 'A friendly "IT Support" person calls you: "Hey, I\'m fixing the server, just need your password quickly to test it." You give it to them. You get hacked. What attack was this?',
    options: ['Social Engineering (Vishing)', 'Brute Force', 'DDOS'],
    correctIndex: 0,
  },
  {
    question: 'Your WordPress site gets hacked. You realize you haven\'t clicked "Update Plugin" in 3 years. What vulnerability was likely exploited?',
    options: ['Outdated Software / Unpatched Security Hole', 'The internet was too fast', 'Too many visitors'],
    correctIndex: 0,
  },
  {
    question: 'You are buying shoes online. You look at the browser bar and see "Not Secure" (No Padlock). You decide NOT to enter your credit card. What was missing?',
    options: ['A cool logo', 'SSL Certificate (HTTPS Encryption)', 'A discount code'],
    correctIndex: 1,
  },
  {
    question: 'Your office burns down with all your laptops. You are back in business the next day because you had a copy of every file in the Cloud. What concept is this?',
    options: ['Magic', 'Disaster Recovery / Off-site Backups', 'Insurance fraud'],
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

function TriadVisual() {
  const [balance, setBalance] = useState({ c: 100, i: 100, a: 100 });

  // Simulation: hacking attempts reduce stats
  useEffect(() => {
    const i = setInterval(() => {
      setBalance(prev => ({
        c: Math.min(100, prev.c + (Math.random() > 0.8 ? -5 : 1)),
        i: Math.min(100, prev.i + (Math.random() > 0.8 ? -5 : 1)),
        a: Math.min(100, prev.a + (Math.random() > 0.8 ? -5 : 1))
      }));
    }, 500);
    return () => clearInterval(i);
  }, []);

  const StatBar = ({ label, val, color, icon }) => (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#1E293B' }}>
        <span>{icon} {label}</span>
        <span>{val}%</span>
      </div>
      <div style={{ width: '100%', height: '12px', background: '#E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ width: val + '%', height: '100%', background: val < 50 ? '#EF4444' : color, transition: 'all 0.5s' }} />
      </div>
      {val < 50 && <div style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '2px' }}>⚠️ CRITICAL FAILURE</div>}
    </div>
  );

  return (
    <div style={{ padding: '2rem', background: 'white', borderRadius: '24px', margin: '2rem 0', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', position: 'relative', border: '1px solid #E2E8F0' }}>
      <h4 style={{ margin: '0 0 1.5rem', textAlign: 'center', color: '#0F172A' }}>Real-Time Security Monitor</h4>
      <StatBar label="Confidentiality" val={balance.c} color="#3B82F6" icon="🔒" />
      <StatBar label="Integrity" val={balance.i} color="#10B981" icon="✅" />
      <StatBar label="Availability" val={balance.a} color="#F59E0B" icon="⚡" />
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#F1F5F9', borderRadius: '12px', fontSize: '0.85rem', color: '#64748B', textAlign: 'center' }}>
        Trying to achieve 100% in all three is impossible. Security is a balancing act.
      </div>
    </div>
  )
}

function PasswordCrackerVisual() {
  const [pwd, setPwd] = useState('');
  const [timeToCrack, setTimeToCrack] = useState('Instantly');
  const [cracking, setCracking] = useState(false);
  const [hackerText, setHackerText] = useState('');

  useEffect(() => {
    let strength = 0;
    if (pwd.length > 8) strength += 10;
    if (pwd.length > 12) strength += 100;
    if (/[A-Z]/.test(pwd)) strength *= 2;
    if (/[0-9]/.test(pwd)) strength *= 2;
    if (/[^A-Za-z0-9]/.test(pwd)) strength *= 5;

    if (strength < 10) setTimeToCrack('0.0002 seconds');
    else if (strength < 100) setTimeToCrack('4 minutes');
    else if (strength < 1000) setTimeToCrack('2 years');
    else setTimeToCrack('400 million years');

    if (cracking) {
      const chars = '01';
      const i = setInterval(() => {
        setHackerText(Array(40).fill(0).map(() => chars[Math.floor(Math.random() * 2)]).join(''));
      }, 50);
      return () => clearInterval(i);
    } else {
      setHackerText('');
    }
  }, [pwd, cracking]);

  return (
    <div style={{ padding: '2rem', background: '#0F172A', borderRadius: '24px', margin: '2rem 0', color: 'white', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', gap: '2rem', position: 'relative', zIndex: 2 }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 1rem', color: '#C084FC' }}>Brute Force Simulator</h4>
          <input
            type="text"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            placeholder="Enter password..."
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#1E293B', border: '1px solid #334155', color: 'white', fontSize: '1.1rem', marginBottom: '1rem', outline: 'none' }}
            onFocus={() => setCracking(true)}
            onBlur={() => setCracking(false)}
          />
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Estimated Time to Crack:</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: timeToCrack.includes('years') ? '#10B981' : '#EF4444' }}>{timeToCrack}</div>
          </div>
        </div>
        <div style={{ width: '120px', background: 'black', fontFamily: 'monospace', color: '#22D3EE', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', opacity: 0.8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {cracking ? hackerText : 'WAITING...'}
        </div>
      </div>
    </div>
  )
}

function PhishingPremiumVisual() {
  const [score, setScore] = useState(0);
  const [emailState, setEmailState] = useState('unopened'); // unopened, safe, unsafe

  const checkEmail = (type) => {
    if (type === 'safe' && emailState !== 'safe') setScore(s => s - 1); // Wrong guess
    if (type === 'unsafe') {
      setScore(s => s + 1);
      setEmailState('unsafe');
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#F0FDF4', borderRadius: '24px', margin: '2rem 0', border: '1px solid #BBF7D0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, color: '#14532D' }}>Phishing Hunter</h4>
        <div style={{ fontWeight: 800, color: '#16A34A' }}>Score: {score}</div>
      </div>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' }}>
        {emailState === 'unsafe' && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626', fontWeight: 900, fontSize: '2rem', zIndex: 10 }}>BUSTED!</div>}

        <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>From:</div>
          <div style={{ fontWeight: 600 }}>Facebvk Security <span style={{ fontWeight: 400, color: '#EF4444' }}>&lt;security@facebvk-verify.com&gt;</span></div>
        </div>
        <div style={{ marginBottom: '1.5rem', color: '#374151' }}>
          Your account will be deleted in 24 hours unless you confirm your password.
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => checkEmail('unsafe')} style={{ flex: 1, padding: '0.8rem', background: '#DC2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Report Phishing 🚨</button>
          <button onClick={() => alert("Oh no! You clicked the link!")} style={{ flex: 1, padding: '0.8rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Verify Password</button>
        </div>
      </div>
    </div>
  )
}

function SSLHandshakeVisual() {
  const [secure, setSecure] = useState(false);

  return (
    <div style={{ padding: '2rem', background: '#FFF7ED', borderRadius: '24px', margin: '2rem 0', border: '1px solid #FFEDD5', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2rem' }}>💻</div>
        <div style={{ flex: 1, height: '4px', background: '#FED7AA', borderRadius: '2px', position: 'relative' }}>
          {/* Packets */}
          <div style={{ width: '10px', height: '10px', background: secure ? '#10B981' : '#EF4444', borderRadius: '50%', position: 'absolute', top: '-3px', animation: 'shuttle 2s infinite linear' }} />
          {secure && <div style={{ position: 'absolute', width: '100%', textAlign: 'center', top: '-20px', fontSize: '0.8rem', color: '#EA580C', fontWeight: 'bold' }}>ENCRYPTED TUNNEL</div>}
        </div>
        <div style={{ fontSize: '2rem' }}>☁️</div>
      </div>

      <button onClick={() => setSecure(!secure)} style={{ width: '100%', padding: '1rem', background: secure ? '#10B981' : '#F97316', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem' }}>
        {secure ? '🔒 Secure Connection (HTTPS)' : '🔓 Insecure (HTTP)'}
      </button>
      <div style={{ marginTop: '1rem', textAlign: 'center', color: '#9A3412', fontSize: '0.9rem' }}>
        {secure ? 'Data looks like: "x7#m9@kL2$"' : 'Data looks like: "MyPassword123"'}
      </div>
      <style>{`@keyframes shuttle { 0% { left:0; } 50% { left:100%; } 100% { left:0; } }`}</style>
    </div>
  )
}

function ComplianceShieldVisual() {
  return (
    <div style={{ padding: '2rem', background: '#F5F3FF', borderRadius: '24px', margin: '2rem 0', border: '1px solid #DDD6FE', textAlign: 'center' }}>
      <h4 style={{ color: '#7C3AED', margin: '0 0 1.5rem' }}>POPIA Compliance Checklist</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {['Consent Obtained', 'Data Minimal', 'Secure Storage', 'Breach Plan'].map(item => (
          <div key={item} style={{ padding: '1rem', background: 'white', borderRadius: '12px', border: '2px solid #C4B5FD', color: '#5B21B6', fontWeight: 600 }}>
            ✅ {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function RansomwareSim() {
  const [locked, setLocked] = useState(false);
  return (
    <div style={{ padding: '2rem', background: locked ? '#7F1D1D' : '#F1F5F9', borderRadius: '24px', margin: '2rem 0', transition: 'all 0.5s', color: locked ? 'white' : 'inherit', position: 'relative', overflow: 'hidden' }}>
      {!locked ? (
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 1rem' }}>My Business Files</h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {['📁 Accounts', '📁 Clients', '📁 Plans'].map(f => (
              <div key={f} style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #CBD5E1' }}>{f}</div>
            ))}
          </div>
          <button onClick={() => setLocked(true)} style={{ padding: '0.5rem 1rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Download "Invoice.exe" ⚠️</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', animation: 'shake 0.5s' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔒</h1>
          <h2 style={{ color: '#FECACA', margin: 0 }}>YOUR FILES ARE ENCRYPTED</h2>
          <p style={{ margin: '1rem 0' }}>Send 1 Bitcoin to unlock.</p>
          <button onClick={() => setLocked(false)} style={{ padding: '0.8rem 1.5rem', background: 'white', color: '#7F1D1D', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 800 }}>Restore from Backup (The Only Cure)</button>
        </div>
      )}
    </div>
  )
}

function CloudBucketVisual() {
  const [access, setAccess] = useState('public');
  return (
    <div style={{ padding: '2rem', background: '#ECFEFF', borderRadius: '24px', margin: '2rem 0', border: '1px solid #A5F3FC' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h4 style={{ margin: 0, color: '#0E7490' }}>AWS S3 Bucket: "user-passports"</h4>
        <div style={{ background: access === 'public' ? '#EF4444' : '#10B981', color: 'white', padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{access}</div>
      </div>

      <div style={{ position: 'relative', height: '100px', border: '2px dashed #06B6D4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
        {access === 'public' ? (
          <div style={{ textAlign: 'center', color: '#EF4444' }}>
            <div style={{ fontSize: '1.5rem' }}>🌍 👀</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Visible to Whole Internet</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#10B981' }}>
            <div style={{ fontSize: '1.5rem' }}>🔒 🛡️</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Accessible Only by App</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={() => setAccess('public')} style={{ flex: 1, padding: '0.5rem', border: '1px solid #EF4444', background: access === 'public' ? '#FEF2F2' : 'white', color: '#B91C1C', borderRadius: '8px', cursor: 'pointer' }}>Make Public (Mistake)</button>
        <button onClick={() => setAccess('private')} style={{ flex: 1, padding: '0.5rem', border: '1px solid #10B981', background: access === 'private' ? '#ECFDF5' : 'white', color: '#047857', borderRadius: '8px', cursor: 'pointer' }}>Make Private (Correct)</button>
      </div>
    </div>
  )
}

function IncidentTimelineVisual() {
  return (
    <div style={{ padding: '2rem', background: '#F8FAFC', borderRadius: '24px', margin: '2rem 0', border: '1px solid #E2E8F0' }}>
      <h4 style={{ textAlign: 'center', margin: '0 0 1.5rem' }}>The Golden Hour</h4>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        <div style={{ textAlign: 'center', opacity: 0.5 }}>
          <div style={{ width: '12px', height: '12px', background: '#94A3B8', borderRadius: '50%', margin: '0 auto 4px' }} />
          Breach
        </div>
        <div style={{ flex: 1, height: '2px', background: '#CBD5E1' }} />
        <div style={{ textAlign: 'center', color: '#EF4444', fontWeight: 'bold' }}>
          <div style={{ width: '16px', height: '16px', background: '#EF4444', borderRadius: '50%', margin: '0 auto 4px', boxShadow: '0 0 10px #EF4444' }} />
          Detection
        </div>
        <div style={{ flex: 1, height: '2px', background: '#CBD5E1' }} />
        <div style={{ textAlign: 'center', color: '#10B981', fontWeight: 'bold' }}>
          <div style={{ width: '16px', height: '16px', background: '#10B981', borderRadius: '50%', margin: '0 auto 4px' }} />
          Containment
        </div>
      </div>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#64748B', fontSize: '0.9rem' }}>The faster you move from Red to Green, the less money you lose.</p>
    </div>
  )
}

function HumanFirewallVisual() {
  return (
    <div style={{ padding: '2rem', background: '#FFF1F2', borderRadius: '24px', margin: '2rem 0', border: '1px solid #FECDD3', textAlign: 'center' }}>
      <h4 style={{ color: '#BE123C', margin: '0 0 1rem' }}>You Are The Firewall</h4>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️🙎‍♂️🛡️</div>
      <p style={{ color: '#881337' }}>Technology catches 90% of attacks. <strong>You</strong> must catch the other 10%.</p>
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

        <TriadVisual />

        <CWCard>
          <h4>The CIA Triad</h4>
          <ul>
            <li><strong>Confidentiality:</strong> Only authorized people see it. (e.g. Encryption).</li>
            <li><strong>Integrity:</strong> It hasn't been changed. (e.g. Valid Backups).</li>
            <li><strong>Availability:</strong> The server is actually online. (e.g. DDoS protection).</li>
          </ul>
        </CWCard>

        {/* NEW SECTION: Why It Matters */}
        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            In the digital economy, Trust is your Currency. If clients cannot access your service (Availability) or their secrets leak (Confidentiality), you go bankrupt.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>1. Reputation is Fragile</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>60% of small businesses close within 6 months of a major cyber attack. Recovering trust is harder than recovering data.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>2. Compliance is Mandatory</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>POPIA demands Integrity. If you cannot prove your data hasn't been tampered with, you face massive fines.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#831843', fontSize: '1.1rem' }}>🚀 How CapeWeb Protects You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We don't just build pretty sites; we build fortified digital assets.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Secure by Design:</strong> We configure enterprise-grade firewalls and WAFs from Day 1.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Resilient Uptime:</strong> Our "Performance First" architecture ensures High Availability, so your shop is always open.</span>
              </div>
            </div>
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
          "Password123" is cracked in 0.001 seconds. Complexity matters.
        </p>

        <PasswordCrackerVisual />

        <ScenarioToggle
          oldTitle="The Sticky Note"
          oldContent="Writing passwords on post-its or using 'Password123' for everything. (Hacked instantly)."
          newTitle="The Manager"
          newContent="Using 1Password/Bitwarden. You remember 1 Master Password. It generates 50-character chaos for everything else."
        />

        {/* NEW SECTION: Why It Matters */}
        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Your password is often the only thing standing between a transnational criminal syndicate and your bank account.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>1. The Credential Stuffing Threat</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Hackers use AI to test millions of stolen passwords. If you reuse your Netflix password for your Bank, you are vulnerable.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>2. Professionalism</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Sharing "admin123" via WhatsApp is negligence. It creates legal liability if that shared account causes a breach.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#831843', fontSize: '1.1rem' }}>🚀 How CapeWeb Protects You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We implement frictionless security that doesn't slow you down.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Seamless Auth:</strong> We integrate Passwordless or Social Logins (Google/Apple) to boost security without the headache.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Vault Management:</strong> We securely manage your site credentials in encrypted vaults, so you never have to text a password again.</span>
              </div>
            </div>
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

        <PhishingPremiumVisual />

        <BookInsight title="The Art of Deception" author="Kevin Mitnick" book="The Art of Deception" color="#EF4444">
          <p>"The human factor is truly security's weakest link."</p>
        </BookInsight>

        {/* NEW SECTION: Why It Matters */}
        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            The hacker does not need to break your code if they can break your staff.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>1. Invoice Fraud</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>South African businesses lose millions annually to fake PDF invoices sent from "spoofed" email addresses.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>2. Ransomware Entry</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>90% of ransomware attacks start with a single, well-timed phishing email to a tired employee.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#831843', fontSize: '1.1rem' }}>🚀 How CapeWeb Protects You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We protect both your digital and human identity.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Email Authentication:</strong> We configure SPF, DKIM, and DMARC records so criminals cannot send fake emails pretending to be you.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Visual Training:</strong> Our dashboards include clear visual cues to help admins distinguish between safe and external requests.</span>
              </div>
            </div>
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
          <strong>HTTPS (TLS/SSL):</strong> Encrypts the tunnel between user and server. Without it, anyone on the Free WiFi at the coffee shop can read your passwords in plain text.
        </p>

        <SSLHandshakeVisual />

        {/* NEW SECTION: Why It Matters */}
        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            An insecure website is a "Closed" sign for modern customers.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>1. The Conversion Killer</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Chrome marks HTTP sites as "Not Secure" in red. 85% of users abandon a purchase immediately if they see this warning.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>2. SEO Penalty</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Google actively penalizes insecure sites, pushing them to page 10. No encryption means no traffic.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#831843', fontSize: '1.1rem' }}>🚀 How CapeWeb Protects You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We handle the plumbing so you can focus on sales.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Zero-Config SSL:</strong> We provide and manage SSL certificates automatically. You never have to worry about expiration.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>HSTS Headers:</strong> We force-redirect all traffic to secure tunnels, protecting your customers' data from interception.</span>
              </div>
            </div>
          </div>
        </div>

        <MiniQuiz
          questions={[
            { question: "What happens if a site does not have HTTPS?", options: ["It is slower", "Data sent (like passwords) is visible to anyone on the network", "Google bans it"], correctIndex: 1 }
          ]}
          onNext={onNext}
        />
      </div>
    </InteractiveLayout>
  )
}

// Module E: POPIA
export function Pillar8ModuleE({ onNext }) {
  return (
    <InteractiveLayout title="Module E: POPIA Compliance" subtitle="Privacy is Law.">
      <div className="cw-prose">
        <p className="cw-text-body">
          In South Africa, <strong>POPIA</strong> mandates how you treat customer data. You cannot spam people. You must secure their data.
        </p>

        <ComplianceShieldVisual />

        <CWAlert type="info" title="The Golden Rule">
          Treat customer data like toxic waste. Only collect what you absolutely need. If you don't have it, you can't lose it.
        </CWAlert>

        {/* NEW SECTION: Why It Matters */}
        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            In South Africa, Privacy is not just "nice to have"—it is the Law.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>1. Regulatory Risk</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Non-compliance with POPIA can lead to fines up to R10 million or jail time. It is not worth the gamble.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>2. Competitive Edge</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Being "Privacy First" is a marketing asset. Premium customers buy from brands that demonstrably respect their data.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#831843', fontSize: '1.1rem' }}>🚀 How CapeWeb Protects You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We build compliance into the code.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Legal-Ready Forms:</strong> We integrate opt-in checkboxes and consent logs directly into your lead capture forms.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Data Minimization:</strong> We design databases that only store what you absolutely need, drastically lowering your liability footprint.</span>
              </div>
            </div>
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
  )
}

// Module F: Device Security
export function Pillar8ModuleF({ onNext }) {
  return (
    <InteractiveLayout title="Module F: Endpoint Protection" subtitle="My laptop was stolen.">
      <div className="cw-prose">
        <p>If your laptop is stolen, is the data safe? <strong>Full Disk Encryption (FileVault / BitLocker)</strong> scrambles the hard drive.</p>

        <RansomwareSim />

        <ScenarioToggle
          oldTitle="Unencrypted"
          oldContent="Thief takes Hard Drive out of laptop. Plugs it into his PC. Reads all your files."
          newTitle="Encrypted"
          newContent="Thief takes Hard Drive out. Sees only garbage code. Your data is safe."
        />

        {/* NEW SECTION: Why It Matters */}
        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            A stolen laptop should cost you the price of the hardware, not the price of your business.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>1. Mobile Warfare</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Laptops get stolen daily in SA. If it contains client lists or passwords in plain text, you have a massive breach.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>2. Client Trust</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Telling your biggest client "I lost your financial data because my device wasn't encrypted" is a conversation you never want to have.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#831843', fontSize: '1.1rem' }}>🚀 How CapeWeb Protects You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We secure the workflow, not just the code.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Cloud-First Workflow:</strong> We architect your business so critical data lives in the secure cloud, not on vulnerable hard drives.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Device Guidance:</strong> We provide checklists for setting up "Find My Device" and remote-wipe capabilities for your team.</span>
              </div>
            </div>
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
  )
}

// Module G: Cloud Security
export function Pillar8ModuleG({ onNext }) {
  return (
    <InteractiveLayout title="Module G: Cloud configuration" subtitle="The open bucket.">
      <div className="cw-prose">
        <p>The #1 cause of massive data leaks is <strong>Misconfigured S3 Buckets</strong>. Developers set "permissions: public" and forget.</p>

        <CloudBucketVisual />

        <p><strong>Principle of Least Privilege:</strong> Give a system ONLY the access it needs, nothing more.</p>

        {/* NEW SECTION: Why It Matters */}
        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            "The Cloud" is just someone else's computer. Leaving it unlocked is like leaving your office front door wide open.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>1. Silent Leaks</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Misconfigured storage is the #1 cause of data breaches. It happens quietly - no alarms, just data flowing out to the dark web.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>2. Bill Shock</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Hackers steal cloud access keys not just for data, but to mine cryptocurrency on your credit card.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#831843', fontSize: '1.1rem' }}>🚀 How CapeWeb Protects You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We use code, not clicks, to manage infrastructure.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Infrastructure as Code:</strong> We script your server setup. This means no "accidental" public switches are possible.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Anomaly Detection:</strong> We set up billing and usage alerts to catch weird spikes before they cost you thousands.</span>
              </div>
            </div>
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
  )
}

// Module H: Incident Response
export function Pillar8ModuleH({ onNext }) {
  return (
    <InteractiveLayout title="Module H: Incident Response" subtitle="Don't panic. Prepare.">
      <div className="cw-prose">
        <p>You will be hacked. It is a matter of "when", not "if".</p>

        <IncidentTimelineVisual />

        <CWCard>
          <h4>The 4 Steps</h4>
          <ol>
            <li><strong>Identify:</strong> Know you are breached.</li>
            <li><strong>Contain:</strong> Unplug the internet. Stop the bleed.</li>
            <li><strong>Eradicate:</strong> Remove the virus.</li>
            <li><strong>Recover:</strong> Restore from Backups.</li>
          </ol>
        </CWCard>

        {/* NEW SECTION: Why It Matters */}
        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            When the crisis hits, Panic is your enemy. Preparation is your best friend.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>1. The Cost of Downtime</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Every hour your digital store is offline, you lose money. Speed is profit.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>2. Legal Exposure</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>Showing the regulator you had a plan and followed it reduces fines. Chaos looks like negligence.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#831843', fontSize: '1.1rem' }}>🚀 How CapeWeb Protects You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We are your digital emergency services.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Emergency Restore:</strong> We keep rolling, encrypted backups. We can wipe and restore your business to yesterday's state in minutes, not days.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Developers on Speed Dial:</strong> As a Care Plan client, you skip the queue. We shut down attacks immediately.</span>
              </div>
            </div>
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
  )
}

// Module I: Training
export function Pillar8ModuleI({ onNext }) {
  return (
    <InteractiveLayout title="Module I: Security Culture" subtitle="The Human Firewall.">
      <div className="cw-prose">
        <p>Tech cannot fix human error. You must train your staff.</p>

        <HumanFirewallVisual />

        <p>Create a "No Blame" culture. If someone clicks a link, they should report it immediately, not hide it out of fear.</p>

        {/* NEW SECTION: Why It Matters */}
        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            You cannot patch a human with a software update. You must upgrade your culture.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>1. The Weakest Link</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>One intern can bypass a R1 million firewall. Security is a team sport.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid #FBCFE8' }}>
              <div style={{ fontWeight: 800, color: '#831843', marginBottom: '0.2rem' }}>2. No-Blame Culture</div>
              <div style={{ fontSize: '0.95rem', color: '#9D174D' }}>If staff are afraid to report mistakes ("I clicked a link"), threats fester. Open communication saves businesses.</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#831843', fontSize: '1.1rem' }}>🚀 How CapeWeb Protects You</h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We make security usable, not annoying.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>UX-Driven Security:</strong> We design internal tools where the *secure* way is the *easiest* way, reducing human error.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.95rem', color: '#374151' }}>
                <span>➜</span>
                <span><strong>Ongoing Education:</strong> We provide bite-sized security tips in our monthly reports to keep your team sharp.</span>
              </div>
            </div>
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
  )
}

// ==========================================
// MODULE J: RESOURCES
// ==========================================
export function Pillar8Resources({ onNext }) {
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
    <InteractiveLayout title="Module J: Resources" subtitle="Security Toolkit">
      <div className="cw-prose">
        <p>Security is about layers. Add these layers to your life today. If you make it hard enough, hackers will move to an easier target.</p>

        <h3 style={{ marginTop: '2rem' }}>🛠️ The Security Toolbelt</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Passwords"
            title="1Password / Bitwarden"
            description="Never reuse a password again. Generate 20-character random passwords for every site."
            link="https://1password.com/"
          />
          <ResourceCard
            category="Hardware 2FA"
            title="YubiKey"
            description="A physical key for your USB port. Even if hackers steal your password, they can't get in."
            link="https://www.yubico.com/"
          />
          <ResourceCard
            category="Website Defense"
            title="Cloudflare"
            description="Free protection against DDoS attacks. Put this in front of your website immediately."
            link="https://www.cloudflare.com/"
          />
          <ResourceCard
            category="Breach Check"
            title="HaveIBeenPwned"
            description="Check if your email has been leaked in a database breach. You will be surprised."
            link="https://haveibeenpwned.com/"
          />
        </div>

        <h3 style={{ marginTop: '3rem' }}>📚 Recommended Reading</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Social Engineering"
            title="The Art of Deception"
            description="By Kevin Mitnick. Understanding how hackers manipulate people, not just computers."
            link="https://www.mitnicksecurity.com/the-art-of-deception"
          />
          <ResourceCard
            category="Thriller"
            title="Ghost in the Wires"
            description="By Kevin Mitnick. A thrilling autobiography of the world's most famous hacker."
            link="https://www.amazon.com/Ghost-Wires-Adventures-Worlds-Wanted/dp/0316037729"
          />
          <ResourceCard
            category="Warfare"
            title="Sandworm"
            description="By Andy Greenberg. A terrifying look at state-sponsored cyberwarfare."
            link="https://www.andygreenberg.net/sandworm"
          />
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <h4>Ready to Lock Down?</h4>
          <p style={{ marginBottom: '1.5rem', color: '#64748B' }}>You are now harder to hack than 99% of people. Prove your skills.</p>
          <CWButton onClick={onNext} variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Take Final Exam 🏁</CWButton>
        </div>
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
