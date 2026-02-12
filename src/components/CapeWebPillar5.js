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
    question: 'You sell running shoes. You target the keyword "Shoes" but get zero traffic because Nike and Adidas dominate page 1. What strategy should you have used?',
    options: ['Buy more ads', 'Long Tail Keywords (e.g. "Red Velcro trail running shoes for wide feet")', 'Give up'],
    correctIndex: 1,
  },
  {
    question: 'You start a medical advice blog but have no medical degree. Millions of people visit, but Google suddenly de-ranks your entire site. What signal was missing?',
    options: ['Not enough photos', 'E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) - specifically for "Your Money Your Life" topics', 'You didn\'t use WordPress'],
    correctIndex: 1,
  },
  {
    question: 'Your Google Business Profile lists your address as "123 Main St", but your website says "Corner Main & 5th". Your local ranking drops. Why?',
    options: ['NAP Inconsistency (Name, Address, Phone must be identical)', 'Google maps is broken', 'Street names changed'],
    correctIndex: 0,
  },
  {
    question: 'You write 5 different blog posts all targeting the exact same keyword: "Best Coffee Cape Town". They all rank on Page 3, but none reach Page 1. What is the problem?',
    options: ['Not enough coffee', 'Keyword Cannibalization (Your pages are competing with each other)', 'The internet is full'],
    correctIndex: 1,
  },
  {
    question: 'You search for a recipe. One result has a picture, star rating, and cooking time right there in the Google result. Yours is just text. What tech are they using?',
    options: ['Magic', 'Schema Markup / Structured Data', 'Photoshop'],
    correctIndex: 1,
  },
  {
    question: 'Your content is excellent, but as the page loads, the text shifts around wildly, causing users to click the wrong buttons. Google penalizes you. Which Core Web Vital failed?',
    options: ['LCP (Loading)', 'CLS (Cumulative Layout Shift)', 'FID (Input Delay)'],
    correctIndex: 1,
  },
  {
    question: 'A customer asks "How much does your service cost?". You refuse to put pricing on your website because "it depends". They go to your competitor who lists prices. What principle did you ignore?',
    options: ['They Ask, You Answer (Transparency builds trust)', 'Secrecy is key', 'Prices scare people'],
    correctIndex: 0,
  },
  {
    question: 'You buy 5,000 backlinks from "FastLinks4U.com" for R100. Next week, your site disappears entirely from Google results. Why?',
    options: ['You bought "Toxic" links and got a Manual Penalty', 'Google server crash', 'You grew too fast'],
    correctIndex: 0,
  },
  {
    question: 'Your "Red Shirt" product is available at two URLs: /products/red-shirt and /shirts/red. Google thinks you are copying content. How do you tell Google which one is the "master" version?',
    options: ['Delete one page', 'Use a Canonical Tag', 'Write distinct text for each'],
    correctIndex: 1,
  },
  {
    question: 'Your online store allows filtering by Color, Size, and Material. Suddenly, Google is indexing 50,000 empty pages like "Blue-Size10-Cotton-PriceHigh". What is this problem?',
    options: ['Index Bloat (wasting crawl budget on low-value pages)', 'High growth', 'Excellent structure'],
    correctIndex: 0,
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

function LongTailVisual() {
  return (
    <div style={{
      margin: '2rem 0',
      padding: '2rem',
      borderRadius: '24px',
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

      <div style={{ position: 'relative', zIndex: 1, height: '200px', background: 'rgba(248, 250, 252, 0.8)', borderRadius: '16px', display: 'flex', alignItems: 'flex-end', padding: '0 1rem', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.5)' }}>
        {/* Fat Head */}
        <div style={{ width: '20%', height: '80%', background: '#EF4444', borderRadius: '8px 8px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)' }}>
          <strong>Head</strong>
          <span>High Vol</span>
          <span>Low Conv</span>
        </div>
        {/* Middle */}
        <div style={{ width: '30%', height: '50%', background: '#F59E0B', borderRadius: '8px 8px 0 0', opacity: 0.8 }}></div>
        {/* Long Tail */}
        <div style={{ width: '50%', height: '30%', background: '#10B981', borderRadius: '8px 8px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)' }}>
          <strong>Long Tail</strong>
          <span>Low Vol</span>
          <span>High Conv</span>
        </div>
      </div>
    </div>
  )
}

function SFERPVisual() {
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

      <div style={{ position: 'relative', zIndex: 1, background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '0.85rem', color: '#202124', marginBottom: '0.25rem' }}>www.plumbers.co.za › cape-town</div>
        <div style={{ fontSize: '1.25rem', color: '#1A0DAB', cursor: 'pointer', textDecoration: 'underline', marginBottom: '6px', fontWeight: 500 }}>
          Best Plumbers Cape Town | 24/7 Emergency Service
        </div>
        <div style={{ fontSize: '0.95rem', color: '#4D5156', lineHeight: 1.5 }}>
          We fix blocked drains, burst pipes and geysers. Call us now for a free quote.
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.8rem', display: 'flex', gap: '1rem', background: '#F8F9FA', padding: '0.5rem', borderRadius: '4px' }}>
          <span style={{ fontWeight: 'bold', color: '#3C4043' }}>Key:</span>
          <span style={{ color: '#1A0DAB' }}>Title Tag (Blue)</span>
          <span style={{ color: '#4D5156' }}>Meta Description (Grey)</span>
        </div>
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

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#3B82F6', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4)', border: '2px solid white' }}>
          <strong>News24</strong>
          <small>Score: 90</small>
        </div>
        {/* Tube */}
        <div style={{ width: '100px', height: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '5px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{
            width: '40px', height: '100%', background: '#3B82F6', borderRadius: '5px', position: 'absolute', top: 0,
            left: flowing ? '100%' : '-40%',
            transition: 'left 1s linear',
            boxShadow: '0 0 10px #3B82F6'
          }} />
        </div>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: flowing ? '#93C5FD' : '#E2E8F0', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'all 0.3s', boxShadow: flowing ? '0 10px 20px rgba(147, 197, 253, 0.4)' : 'none', border: '2px solid white' }}>
          <strong>You</strong>
          <small>{flowing ? 'Score: 20' : 'Score: 10'}</small>
        </div>
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

        <LongTailVisual />

        <BookInsight title="The Long Tail" author="Chris Anderson" book="The Long Tail" color="#3B82F6">
          <p>"The future of business is selling less of more."</p>
        </BookInsight>

        <ScenarioToggle
          oldTitle="The Head (Hard)"
          oldContent="Keyword: 'Insurance'. Volume: 1M. Competition: Huge Banks. Rank: Page 50. Revenue: R0."
          newTitle="The Tail (Easy)"
          newContent="Keyword: 'Insurance for Pet snakes'. Volume: 100. Competition: None. Rank: #1. Revenue: R5000."
        />

        {/* NEW SECTION: Why It Matters */}
        <div style={{ margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)', borderRadius: '24px', border: '1px solid #FBCFE8' }}>
          <CWHeading level={3} style={{ color: '#BE185D', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Why This Matters for Business Owners
          </CWHeading>

          <p style={{ fontSize: '1.1rem', color: '#9D174D', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            You can have the best product in the world, but if you are on Page 2 of Google, you don't exist. Organic traffic is free, compounding, and high-intent.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>1. Intent vs Interruption</h4>
              <p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>
                Social Media interrupts people. Search captures them when they are asking for help. These leads convert 3x higher.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#DB2777', marginBottom: '0.5rem' }}>2. The Trust Factor</h4>
              <p style={{ fontSize: '0.95rem', color: '#831843', lineHeight: '1.6' }}>
                People trust the organic #1 spot more than the paid ad spot. Ranking high is the ultimate social proof.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FBCFE8', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b0f1a' }}>
              🚀 How CapeWeb Helps You Scale
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              We turn your website into a traffic asset.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EC4899', marginTop: '2px' }}>➜</span>
                <span><strong>Product-Led SEO:</strong> We build tools and pages that naturally attract links.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#EC4899', marginTop: '2px' }}>➜</span>
                <span><strong>Local Domination:</strong> We optimize your Google Business Profile to capture local customers.</span>
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
    <InteractiveLayout title="Module C: The Skyscraper Technique" subtitle="Content that cannot be ignored.">
      <div className="cw-prose">
        <p className="cw-text-body">
          You need to speak to two audiences: The Human (H1) and The Robot (Title Tag).
          <strong>The Robot needs to know where to file your page.</strong> The Human needs to click.
        </p>

        <SFERPVisual />

        <CWHeading level={3}>Skyscraper Technique</CWHeading>
        <p className="cw-text-body">
          Find the #1 article. Create one that is <strong>10x better</strong> (More updated, better design). Then tell everyone.
        </p>

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
        <p>Google has a "Crawl Budget". If your site is slow, Google leaves.</p>

        <CWCard>
          <h4>Canonical Tags</h4>
          <p>Telling Google "This is the ORIGINAL version" prevents duplicate content penalties.</p>
        </CWCard>

        <ScenarioToggle
          oldTitle="Slow & Heavy"
          oldContent="Large images, layout shifts (CLS), user rage clicks."
          newTitle="Fast & Stable"
          newContent="Optimized images, static layout, happy user."
        />

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
        <p>For local businesses, Google looks for trust signals across the web. You must be consistent.</p>

        <ScenarioToggle
          oldTitle="Inconsistent (Bad)"
          oldContent="FB: '12 Main Rd'. Web: '12 Main Road, Cape Town'. (Google is confused)."
          newTitle="Consistent (Good)"
          newContent="FB: '12 Main Road, Cape Town'. Web: '12 Main Road, Cape Town'. (Google trusts)."
        />

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
        <p>In the age of AI spam, Google prioritizes <strong>Experience</strong>. AI cannot taste food or hike a mountain.</p>

        <BookInsight title="Experience vs Expertise" author="Google" book="Search Quality Guidelines" color="#F43F5E">
          <p>"E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness."</p>
        </BookInsight>

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
        <p>A link from another site is a "Vote of Confidence". But not all votes are equal.</p>

        <LinkJuiceVisual />

        <p>Don't spam. Create news. Release a survey on "Cape Town Coffee Prices". Send it to journalists.</p>

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
        <p><strong>Bounce Rate</strong> is dead. It is replaced by <strong>Engagement Rate</strong>.</p>

        <ScenarioToggle
          oldTitle="Vanity Metric"
          oldContent="'We got 10,000 hits!' (But 99% left instantly)."
          newTitle="Actionable Metric"
          newContent="'We got 100 engaged sessions who stayed for 3 mins'."
        />

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
        <p>E-commerce sites often have filters (Red, Blue, Size 10). If Google indexes every combination, you get <strong>Index Bloat</strong>.</p>

        <CWAlert type="warning" title="The Fix">
          Use <code>robots.txt</code> to block crawling of parameter URLs.
        </CWAlert>

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
// MODULE L: RESOURCES
// ==========================================
export function Pillar5Resources({ onNext }) {
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
    <InteractiveLayout title="Module L: Resources" subtitle="The SEO Specialist's Toolkit">
      <div className="cw-prose">
        <p>SEO isn't magic; it's measurement. These tools let you see what users are searching for, who is linking to you, and why your competitors are winning.</p>

        <h3 style={{ marginTop: '2rem' }}>🛠️ The SEO Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Inspiration"
            title="SA SEO Case Studies"
            description="Real examples of South African businesses growing traffic. See what works locally."
            link="https://www.bizcommunity.com/Search/SEO"
          />
          <ResourceCard
            category="The Source of Truth"
            title="Google Search Console"
            description="If you only use one tool, use this. See exactly how Google views your site and what queries you rank for."
            link="https://search.google.com/search-console"
          />
          <ResourceCard
            category="Intelligence"
            title="Ahrefs"
            description="The industry standard for competitor analysis, keyword research, and backlink auditing."
            link="https://ahrefs.com"
          />
          <ResourceCard
            category="Technical"
            title="Screaming Frog"
            description="A crawler that audits your website for broken links, missing meta tags, and technical errors."
            link="https://www.screamingfrog.co.uk/"
          />
          <ResourceCard
            category="Content"
            title="Answer The Public"
            description="See the exact questions people are asking about your topic. Goldmine for blog post ideas."
            link="https://answerthepublic.com/"
          />
          <ResourceCard
            category="Local"
            title="Google Business Profile"
            description="Manage your map listing. Critical for any local business (plumbers, cafes, lawyers)."
            link="https://www.google.com/business/"
          />
        </div>

        <h3 style={{ marginTop: '3rem' }}>📚 Recommended Reading</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <ResourceCard
            category="Philosophy"
            title="They Ask, You Answer"
            description="By Marcus Sheridan. The most practical guide to content marketing ever written. Stop selling, start teaching."
            link="https://marcussheridan.com/they-ask-you-answer/"
          />
          <ResourceCard
            category="Strategy"
            title="Product-Led SEO"
            description="By Eli Schwartz. How to build SEO into the product itself, rather than treating it like marketing."
            link="https://www.productledseo.com/"
          />
          <ResourceCard
            category="Link Building"
            title="Backlinko"
            description="Brian Dean's blog is arguably the best free resource for actionable SEO tactics."
            link="https://backlinko.com/"
          />
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <h4>Ready to Rank #1?</h4>
          <p style={{ marginBottom: '1.5rem', color: '#64748B' }}>You know the rules of the search engine. Now verify your knowledge.</p>
          <CWButton onClick={onNext} variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Take Final Exam 🏁</CWButton>
        </div>
      </div>
    </InteractiveLayout>
  );
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
          <CWHeading level={3}>Pillar 3 Complete!</CWHeading>
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
