import React, { useState, useEffect } from 'react';
import '../styles/CapeWebBlueprint.css';
import { PILLAR_LIBRARY } from '../data/pillarLibrary';
import {
  Pillar2ModuleA,
  Pillar2ModuleB,
  Pillar2ModuleC,
  Pillar2ModuleD,
  Pillar2ModuleBonus,
  Pillar2Quiz,
  Pillar2Completion,
  pillar2QuizQuestions
} from './CapeWebPillar2';
import {
  Pillar3Content,
  Pillar3Quiz,
  Pillar3Completion,
  pillar3QuizQuestions
} from './CapeWebPillar3';
import {
  Pillar4Content,
  Pillar4Quiz,
  Pillar4Completion,
  pillar4QuizQuestions
} from './CapeWebPillar4';
import {
  Pillar5Content,
  Pillar5Quiz,
  Pillar5Completion,
  pillar5QuizQuestions
} from './CapeWebPillar5';
import {
  Pillar6Content,
  Pillar6Quiz,
  Pillar6Completion,
  pillar6QuizQuestions
} from './CapeWebPillar6';
import {
  Pillar7Content,
  Pillar7Quiz,
  Pillar7Completion,
  pillar7QuizQuestions
} from './CapeWebPillar7';
import {
  Pillar8Content,
  Pillar8Quiz,
  Pillar8Completion,
  pillar8QuizQuestions
} from './CapeWebPillar8';
import {
  Pillar9Content,
  Pillar9Quiz,
  Pillar9Completion,
  pillar9QuizQuestions
} from './CapeWebPillar9';
import {
  Pillar10Content,
  Pillar10Quiz,
  Pillar10Completion,
  pillar10QuizQuestions
} from './CapeWebPillar10';
import {
  Pillar11Content,
  Pillar11Quiz,
  Pillar11Completion,
  pillar11QuizQuestions
} from './CapeWebPillar11';

// Progress tracking using localStorage
const PROGRESS_KEY = 'capeweb_learn_progress';

const getInitialProgress = () => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : { activePillar: 1, quizStatuses: {}, completedPillars: [] };
  } catch {
    return { activePillar: 1, quizStatuses: {}, completedPillars: [] };
  }
};

const saveProgress = (progress) => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('Unable to save progress:', error);
  }
};

export default function CapeWebBlueprint() {
  const initialProgress = getInitialProgress();
  const [activePillar, setActivePillar] = useState(initialProgress.activePillar || 1);
  const [quizStatuses, setQuizStatuses] = useState(initialProgress.quizStatuses || {});
  const [showQuiz, setShowQuiz] = useState({});

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress({ activePillar, quizStatuses, completedPillars: Object.keys(quizStatuses).filter(k => quizStatuses[k]?.passed) });
  }, [activePillar, quizStatuses]);

  const handlePillarClick = (pillarNum) => {
    setActivePillar(pillarNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizComplete = (pillarNum, passed, score, total) => {
    setQuizStatuses(prev => ({
      ...prev,
      [pillarNum]: { passed, score, total, completedAt: new Date().toISOString() }
    }));
  };

  const activePillarData = PILLAR_LIBRARY.find(p => p.pillar === activePillar);

  return (
    <div className="capeweb-blueprint-shell">
      {/* Introduction Section */}
      <section className="learn-intro-panel">
        <div className="learn-intro-content">
          <h2>Master Business From Start to Finish</h2>
          <p className="learn-intro-description">
            Welcome to CapeWeb University, your comprehensive guide to building and running a successful South African business.
            This course takes you through all 11 essential pillars of business mastery, from your initial idea to scaling operations.
            No matter what stage you're at, these modules will give you the knowledge and practical skills to succeed.
          </p>
          <div className="learn-intro-features">
            <div className="learn-feature-item">
              <span className="feature-icon">📚</span>
              <strong>11 Core Pillars</strong>
              <p>Complete business education covering every essential area</p>
            </div>
            <div className="learn-feature-item">
              <span className="feature-icon">🎯</span>
              <strong>Practical & Interactive</strong>
              <p>Learn by doing with real-world examples and exercises</p>
            </div>
            <div className="learn-feature-item">
              <span className="feature-icon">🇿🇦</span>
              <strong>SA-Focused</strong>
              <p>Tailored for South African businesses with local resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Guide */}
      <section className="getting-started-panel">
        <h3>Starting Your Business Journey</h3>
        <p>Before diving into the pillars, here are essential resources for starting a business in South Africa:</p>
        <div className="startup-resources-grid">
          <div className="resource-card">
            <h4>🏢 Company Registration</h4>
            <p>Register your business with CIPC (Companies and Intellectual Property Commission) to make it official.</p>
            <a href="https://www.cipc.co.za/" target="_blank" rel="noopener noreferrer" className="resource-link">
              Visit CIPC →
            </a>
            <a href="https://bizportal.gov.za/" target="_blank" rel="noopener noreferrer" className="resource-link">
              Fast-track via BizPortal →
            </a>
          </div>
          <div className="resource-card">
            <h4>💰 Funding & Support</h4>
            <p>Access funding, grants, and non-financial support for small businesses and startups.</p>
            <a href="https://www.seda.org.za/" target="_blank" rel="noopener noreferrer" className="resource-link">
              SEDA Business Support →
            </a>
            <a href="https://sefa.finfind.co.za/" target="_blank" rel="noopener noreferrer" className="resource-link">
              sefa Funding Portal →
            </a>
            <a href="https://www.nyda.gov.za/" target="_blank" rel="noopener noreferrer" className="resource-link">
              NYDA Youth Grants →
            </a>
          </div>
          <div className="resource-card">
            <h4>📋 Tax & Compliance</h4>
            <p>Get your tax number and understand your compliance obligations from day one.</p>
            <a href="https://www.sars.gov.za/" target="_blank" rel="noopener noreferrer" className="resource-link">
              SARS Registration →
            </a>
            <a href="https://secure.csd.gov.za/" target="_blank" rel="noopener noreferrer" className="resource-link">
              CSD Supplier Database →
            </a>
          </div>
          <div className="resource-card">
            <h4>📖 Business Guides</h4>
            <p>Free comprehensive guides and tools for South African entrepreneurs.</p>
            <a href="https://www.seda.org.za/business-tools/" target="_blank" rel="noopener noreferrer" className="resource-link">
              SEDA Business Tools →
            </a>
            <a href="https://www.dsbd.gov.za/" target="_blank" rel="noopener noreferrer" className="resource-link">
              Dept. of Small Business Development →
            </a>
          </div>
        </div>
      </section>

      {/* Main Learning Interface */}
      <div className="learn-capeweb-layout">
        {/* Sidebar Navigation */}
        <div className="learn-capeweb-toc-wrapper">
          <nav className="learn-capeweb-toc" aria-label="Pillar navigation">
            <h3 className="toc-title">Learning Pillars</h3>
            <p className="toc-subtitle">Your complete business education</p>
            <ol className="toc-list">
              {PILLAR_LIBRARY.map((pillar) => {
                const isActive = pillar.pillar === activePillar;
                const isCompleted = quizStatuses[pillar.pillar]?.passed;
                return (
                  <li key={pillar.pillar} className={isActive ? 'toc-item--active' : ''}>
                    <button
                      onClick={() => handlePillarClick(pillar.pillar)}
                      className="toc-link"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="toc-number">Pillar {pillar.pillar}</span>
                      <span className="toc-label">{pillar.title}</span>
                      {isCompleted && <span className="completion-badge">✓</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="toc-progress-summary">
              <strong>Progress</strong>
              <p>{Object.values(quizStatuses).filter(s => s?.passed).length} of {PILLAR_LIBRARY.length} completed</p>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="learn-capeweb-article-pane">
          <article className="learn-capeweb-article">
            {/* Pillar Header */}
            <header className="pillar-header">
              <div className="pillar-meta">
                <span className="pillar-number">Pillar {activePillarData.pillar}</span>
                <span className="pillar-divider">•</span>
                <span className="pillar-category">Essential Business Knowledge</span>
              </div>
              <h1 className="pillar-title">{activePillarData.title}</h1>
              <div className="pillar-objectives">
                <h3>What You'll Master</h3>
                <ul>
                  {activePillarData.objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>
            </header>

            {/* Pillar Content */}
            <div className="pillar-content-wrapper">
              {activePillar === 1 && <Pillar1Content />}
              {activePillar === 2 && (
                <div className="pillar-modules">
                  <Pillar2ModuleA />
                  <Pillar2ModuleB />
                  <Pillar2ModuleC />
                  <Pillar2ModuleD />
                  <Pillar2ModuleBonus />
                </div>
              )}
              {activePillar === 3 && <Pillar3Content />}
              {activePillar === 4 && <Pillar4Content />}
              {activePillar === 5 && <Pillar5Content />}
              {activePillar === 6 && <Pillar6Content />}
              {activePillar === 7 && <Pillar7Content />}
              {activePillar === 8 && <Pillar8Content />}
              {activePillar === 9 && <Pillar9Content />}
              {activePillar === 10 && <Pillar10Content />}
              {activePillar === 11 && <Pillar11Content />}
            </div>

            {/* Resources Section */}
            {activePillarData.resources && activePillarData.resources.length > 0 && (
              <div className="pillar-resources">
                <h3>Essential Resources</h3>
                <div className="resources-grid">
                  {activePillarData.resources.map((resource, idx) => (
                    <div key={idx} className="resource-item">
                      <h4>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          {resource.label}
                        </a>
                      </h4>
                      <p>{resource.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Section */}
            <div className="pillar-quiz-section">
              {!showQuiz[activePillar] && !quizStatuses[activePillar]?.passed && (
                <button
                  className="quiz-start-button"
                  onClick={() => setShowQuiz(prev => ({ ...prev, [activePillar]: true }))}
                >
                  Start Quiz for Pillar {activePillar}
                </button>
              )}

              {showQuiz[activePillar] && !quizStatuses[activePillar]?.passed && (
                <div className="quiz-wrapper">
                  {activePillar === 1 && <Pillar1Quiz questions={[]} onComplete={(score, total) => handleQuizComplete(1, score >= 7, score, total)} />}
                  {activePillar === 2 && <Pillar2Quiz questions={pillar2QuizQuestions} onComplete={(score, total) => handleQuizComplete(2, score >= activePillarData.quizGoal, score, total)} />}
                  {activePillar === 3 && <Pillar3Quiz questions={pillar3QuizQuestions} onComplete={(score, total) => handleQuizComplete(3, score >= activePillarData.quizGoal, score, total)} />}
                  {activePillar === 4 && <Pillar4Quiz questions={pillar4QuizQuestions} onComplete={(score, total) => handleQuizComplete(4, score >= activePillarData.quizGoal, score, total)} />}
                  {activePillar === 5 && <Pillar5Quiz questions={pillar5QuizQuestions} onComplete={(score, total) => handleQuizComplete(5, score >= activePillarData.quizGoal, score, total)} />}
                  {activePillar === 6 && <Pillar6Quiz questions={pillar6QuizQuestions} onComplete={(score, total) => handleQuizComplete(6, score >= activePillarData.quizGoal, score, total)} />}
                  {activePillar === 7 && <Pillar7Quiz questions={pillar7QuizQuestions} onComplete={(score, total) => handleQuizComplete(7, score >= activePillarData.quizGoal, score, total)} />}
                  {activePillar === 8 && <Pillar8Quiz questions={pillar8QuizQuestions} onComplete={(score, total) => handleQuizComplete(8, score >= activePillarData.quizGoal, score, total)} />}
                  {activePillar === 9 && <Pillar9Quiz questions={pillar9QuizQuestions} onComplete={(score, total) => handleQuizComplete(9, score >= activePillarData.quizGoal, score, total)} />}
                  {activePillar === 10 && <Pillar10Quiz questions={pillar10QuizQuestions} onComplete={(score, total) => handleQuizComplete(10, score >= activePillarData.quizGoal, score, total)} />}
                  {activePillar === 11 && <Pillar11Quiz questions={pillar11QuizQuestions} onComplete={(score, total) => handleQuizComplete(11, score >= activePillarData.quizGoal, score, total)} />}
                </div>
              )}

              {quizStatuses[activePillar]?.passed && (
                <div className="quiz-completion">
                  {activePillar === 1 && <Pillar1Completion />}
                  {activePillar === 2 && <Pillar2Completion />}
                  {activePillar === 3 && <Pillar3Completion />}
                  {activePillar === 4 && <Pillar4Completion />}
                  {activePillar === 5 && <Pillar5Completion />}
                  {activePillar === 6 && <Pillar6Completion />}
                  {activePillar === 7 && <Pillar7Completion />}
                  {activePillar === 8 && <Pillar8Completion />}
                  {activePillar === 9 && <Pillar9Completion />}
                  {activePillar === 10 && <Pillar10Completion />}
                  {activePillar === 11 && <Pillar11Completion />}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

// Pillar 1 Content Component (placeholder - needs to be created)
function Pillar1Content() {
  return (
    <div className="pillar-content">
      <section className="content-section">
        <h2>Understanding Strategic Foundation & Brand Identity</h2>
        <p>
          Every successful business starts with a clear strategic foundation. Before you invest time and money into building your business,
          you need to understand who you're serving, what problem you're solving, and why customers should choose you. This pillar teaches
          you how to validate your business idea, craft a compelling brand message, and create a lean business plan that guides your first steps.
        </p>

        <h3>1. Validating Your Business Idea</h3>
        <p>
          The first and most critical step in building a business is making sure there's actually a market for what you want to offer.
          Too many entrepreneurs fall in love with their idea without checking if customers actually want it. Here's how to validate your concept:
        </p>
        <ul>
          <li>
            <strong>Identify Your Target Customer:</strong> Who exactly will pay for your product or service? Be specific. Instead of "everyone,"
            think "small restaurant owners in Johannesburg" or "young professionals in Cape Town who commute to work."
          </li>
          <li>
            <strong>Define the Problem You Solve:</strong> What specific pain point are you addressing? The clearer the problem, the easier
            it is to sell your solution. Talk to potential customers and ask them about their challenges.
          </li>
          <li>
            <strong>Test Your Solution:</strong> Before building anything expensive, create a minimum viable version. This could be a simple
            landing page, a prototype, or even just a detailed description. Show it to real potential customers and get honest feedback.
          </li>
          <li>
            <strong>Research Your Market:</strong> Use resources like Stats SA to understand market size, demographics, and economic conditions
            in your area. Check Google Trends to see if people are searching for solutions like yours.
          </li>
        </ul>

        <h3>2. Crafting Your Brand Message (StoryBrand Framework)</h3>
        <p>
          Your brand message is how you communicate what you do and why it matters. The StoryBrand framework is a proven approach that
          positions your customer as the hero and your business as their guide. Here's how it works:
        </p>
        <ul>
          <li>
            <strong>The Hero (Your Customer):</strong> Start by understanding your customer's goals and desires. What are they trying to achieve?
          </li>
          <li>
            <strong>The Problem:</strong> Clearly articulate the obstacle standing in their way. This should be both practical (external problem)
            and emotional (internal problem).
          </li>
          <li>
            <strong>The Guide (Your Business):</strong> Position yourself as the expert who understands their challenge. Show empathy and demonstrate authority.
          </li>
          <li>
            <strong>The Plan:</strong> Give them a clear, simple plan for how you'll solve their problem. Make it easy to understand.
          </li>
          <li>
            <strong>The Call to Action:</strong> Tell them exactly what to do next. "Book a consultation," "Order now," or "Get started today."
          </li>
          <li>
            <strong>The Stakes:</strong> Show what they stand to lose if they don't act, and what success looks like if they do.
          </li>
        </ul>
        <p className="example-box">
          <strong>Example:</strong> If you're starting a bookkeeping service for small retailers:
          <br />
          <em>"Many small shop owners (hero) lose sleep over tax season (problem). We're bookkeeping experts who've helped 100+ retailers
          stay compliant (guide). Our simple three-step process (plan) means you never miss a deadline. Book your free consultation today
          (call to action) and avoid costly SARS penalties while keeping more of your hard-earned profit (stakes)."</em>
        </p>

        <h3>3. Building Your Lean Canvas</h3>
        <p>
          The Lean Canvas is a one-page business plan that helps you map out your business model quickly. It's perfect for startups
          because it forces you to focus on what really matters. Here are the key sections:
        </p>
        <div className="canvas-grid">
          <div className="canvas-item">
            <strong>Problem:</strong> Top 3 problems your customers face
          </div>
          <div className="canvas-item">
            <strong>Customer Segments:</strong> Who are your target customers?
          </div>
          <div className="canvas-item">
            <strong>Unique Value Proposition:</strong> Why are you different and worth buying from?
          </div>
          <div className="canvas-item">
            <strong>Solution:</strong> Your top 3 features or services
          </div>
          <div className="canvas-item">
            <strong>Channels:</strong> How will you reach customers?
          </div>
          <div className="canvas-item">
            <strong>Revenue Streams:</strong> How will you make money?
          </div>
          <div className="canvas-item">
            <strong>Cost Structure:</strong> What are your main costs?
          </div>
          <div className="canvas-item">
            <strong>Key Metrics:</strong> How will you measure success?
          </div>
        </div>

        <h3>4. Creating Your 30-Day Action Plan</h3>
        <p>
          Once you have your strategic foundation, break it down into immediate action steps. Your first 30 days should focus on validation
          and getting your first customers:
        </p>
        <ol>
          <li>Week 1: Talk to 10 potential customers and refine your value proposition based on their feedback</li>
          <li>Week 2: Create your minimal viable product or service offering</li>
          <li>Week 3: Set up basic operations (business registration, bank account, simple website or social media)</li>
          <li>Week 4: Launch and get your first 3 paying customers</li>
        </ol>

        <h3>Common Mistakes to Avoid</h3>
        <ul>
          <li>❌ Building a perfect product before talking to customers</li>
          <li>❌ Trying to serve everyone instead of focusing on a specific niche</li>
          <li>❌ Spending too much on branding and logos before proving the business works</li>
          <li>❌ Creating a 50-page business plan that nobody will read</li>
          <li>❌ Ignoring competitors and thinking your idea is completely unique</li>
        </ul>

        <div className="key-takeaways">
          <h3>Key Takeaways</h3>
          <ul>
            <li>✓ Validate your idea by talking to real customers before building anything expensive</li>
            <li>✓ Use the StoryBrand framework to create a clear, compelling message that resonates</li>
            <li>✓ A Lean Canvas is better than a traditional business plan for startups</li>
            <li>✓ Focus on getting your first customers quickly rather than perfecting everything</li>
            <li>✓ Your strategy should evolve based on real market feedback</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

// Placeholder Quiz and Completion for Pillar 1
function Pillar1Quiz({ questions, onComplete }) {
  return (
    <div className="quiz-placeholder">
      <p>Quiz for Pillar 1 (placeholder - similar structure to Pillar 2 quiz)</p>
      <button onClick={() => onComplete(8, 10)}>Complete Quiz</button>
    </div>
  );
}

function Pillar1Completion() {
  return (
    <div className="completion-message">
      <h3>🎉 Congratulations!</h3>
      <p>You've completed Pillar 1: Strategic Foundation & Brand Identity</p>
      <p>You now understand how to validate business ideas, craft compelling messages, and build a lean business plan.</p>
    </div>
  );
}
