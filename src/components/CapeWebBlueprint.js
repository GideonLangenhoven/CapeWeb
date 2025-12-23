import React, { useRef, useState } from 'react';
import '../styles/CapeWebBlueprint.css';
import {
  Pillar2ModuleA,
  Pillar2ModuleB,
  Pillar2ModuleC,
  Pillar2ModuleD,
  Pillar2ModuleE,
  Pillar2ModuleF,
  Pillar2ModuleBonus,
  Pillar2Resources,
  Pillar2Quiz,
  Pillar2Completion
} from './CapeWebPillar2';
import {
  Pillar1JourneyMap, Pillar1ModuleA, Pillar1ModuleB, Pillar1ModuleC, Pillar1ModuleD, Pillar1ModuleE, Pillar1Resources,
  Pillar1Quiz, Pillar1Completion, pillar1QuizQuestions
} from './CapeWebPillar1';
import {
  Pillar3ModuleA, Pillar3ModuleB, Pillar3ModuleC, Pillar3ModuleD, Pillar3ModuleE,
  Pillar3ModuleF, Pillar3ModuleG, Pillar3ModuleH, Pillar3ModuleI, Pillar3ModuleJ,
  Pillar3Resources,
  Pillar3Quiz,
  Pillar3Completion,
  pillar3QuizQuestions
} from './CapeWebPillar3';
import {
  Pillar4ModuleA, Pillar4ModuleB, Pillar4ModuleC, Pillar4ModuleD, Pillar4ModuleE,
  Pillar4ModuleF, Pillar4ModuleG, Pillar4ModuleH, Pillar4ModuleI, Pillar4ModuleJ, Pillar4ModuleK,
  Pillar4Resources,
  Pillar4Quiz, Pillar4Completion, pillar4QuizQuestions
} from './CapeWebPillar4';
import {
  Pillar5ModuleA, Pillar5ModuleB, Pillar5ModuleC, Pillar5ModuleD, Pillar5ModuleE, Pillar5ModuleF, Pillar5ModuleG, Pillar5ModuleH, Pillar5ModuleI,
  Pillar5Resources,
  Pillar5Quiz, Pillar5Completion, pillar5QuizQuestions
} from './CapeWebPillar5';
import {
  Pillar6ModuleA, Pillar6ModuleB, Pillar6ModuleC, Pillar6ModuleD, Pillar6ModuleE, Pillar6ModuleF, Pillar6ModuleG, Pillar6ModuleH, Pillar6ModuleI,
  Pillar6Resources,
  Pillar6Quiz, Pillar6Completion, pillar6QuizQuestions
} from './CapeWebPillar6';
import {
  Pillar7ModuleA, Pillar7ModuleB, Pillar7ModuleC, Pillar7ModuleD, Pillar7ModuleE,
  Pillar7ModuleF, Pillar7ModuleG, Pillar7ModuleH, Pillar7ModuleI,
  Pillar7Resources,
  Pillar7Quiz, Pillar7Completion, pillar7QuizQuestions
} from './CapeWebPillar7';
import {
  Pillar8ModuleA, Pillar8ModuleB, Pillar8ModuleC, Pillar8ModuleD, Pillar8ModuleE,
  Pillar8ModuleF, Pillar8ModuleG, Pillar8ModuleH, Pillar8ModuleI,
  Pillar8Resources,
  Pillar8Quiz, Pillar8Completion, pillar8QuizQuestions
} from './CapeWebPillar8';
import {
  Pillar9ModuleA,
  Pillar9ModuleB,
  Pillar9ModuleC,
  Pillar9ModuleD,
  Pillar9ModuleE,
  Pillar9ModuleF,
  Pillar9ModuleG, Pillar9ModuleH, Pillar9ModuleI,
  Pillar9Resources,
  Pillar9Quiz,
  Pillar9Completion,
  pillar9QuizQuestions
} from './CapeWebPillar9';
import {
  Pillar10ModuleA, Pillar10ModuleB, Pillar10ModuleC, Pillar10ModuleD, Pillar10ModuleE,
  Pillar10ModuleF, Pillar10ModuleG, Pillar10Resources,
  Pillar10Quiz, Pillar10Completion, pillar10QuizQuestions
} from './CapeWebPillar10';
import {
  Pillar11ModuleA, Pillar11ModuleB, Pillar11ModuleC, Pillar11ModuleD, Pillar11ModuleE,
  Pillar11ModuleF, Pillar11ModuleG, Pillar11Resources,
  Pillar11Quiz, Pillar11Completion, pillar11QuizQuestions
} from './CapeWebPillar11';

import {
  Pillar12ModuleA, Pillar12ModuleB, Pillar12ModuleC, Pillar12ModuleD,
  Pillar12Resources, Pillar12Quiz, Pillar12Completion
} from './CapeWebPillar12';
import {
  Pillar13ModuleA, Pillar13ModuleB, Pillar13ModuleC, Pillar13ModuleD,
  Pillar13Resources, Pillar13Quiz, Pillar13Completion
} from './CapeWebPillar13';
import {
  Pillar14ModuleA, Pillar14ModuleB, Pillar14ModuleC,
  Pillar14Resources, Pillar14Quiz, Pillar14Completion
} from './CapeWebPillar14';
import {
  Pillar15ModuleA, Pillar15ModuleB, Pillar15ModuleC,
  Pillar15Resources, Pillar15Quiz, Pillar15Completion
} from './CapeWebPillar15';
import {
  Pillar16ModuleA, Pillar16ModuleB, Pillar16ModuleC,
  Pillar16Resources, Pillar16Quiz, Pillar16Completion
} from './CapeWebPillar16';
import {
  Pillar17ModuleA, Pillar17ModuleB, Pillar17ModuleC,
  Pillar17Resources, Pillar17Quiz, Pillar17Completion
} from './CapeWebPillar17';
import {
  Pillar18ModuleA, Pillar18ModuleB, Pillar18ModuleC, Pillar18Resources, Pillar18Quiz, Pillar18Completion
} from './CapeWebPillar18';
import {
  Pillar19ModuleA, Pillar19ModuleB, Pillar19ModuleC, Pillar19Resources, Pillar19Quiz, Pillar19Completion
} from './CapeWebPillar19';

import {
  pillar12QuizQuestions, pillar13QuizQuestions, pillar14QuizQuestions,
  pillar15QuizQuestions, pillar16QuizQuestions, pillar17QuizQuestions,
  pillar18QuizQuestions, pillar19QuizQuestions
} from '../data/pillarLibrary';



export default function CapeWebBlueprint() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pillar1QuizResponses, setPillar1QuizResponses] = useState({});
  const [pillar1ScoreMessage, setPillar1ScoreMessage] = useState('Not checked yet.');

  const [pillar3QuizResponses, setPillar3QuizResponses] = useState({});
  const [pillar3ScoreMessage, setPillar3ScoreMessage] = useState('Not checked yet.');

  const [pillar8QuizResponses, setPillar8QuizResponses] = useState({});
  const [pillar4QuizResponses, setPillar4QuizResponses] = useState({});
  const [pillar4ScoreMessage, setPillar4ScoreMessage] = useState('Not checked yet.');
  const [pillar5QuizResponses, setPillar5QuizResponses] = useState({});
  const [pillar5ScoreMessage, setPillar5ScoreMessage] = useState('Not checked yet.');
  const [pillar6QuizResponses, setPillar6QuizResponses] = useState({});
  const [pillar6ScoreMessage, setPillar6ScoreMessage] = useState('Not checked yet.');
  const [pillar7QuizResponses, setPillar7QuizResponses] = useState({});
  const [pillar7ScoreMessage, setPillar7ScoreMessage] = useState('Not checked yet.');
  const [pillar8ScoreMessage, setPillar8ScoreMessage] = useState('Not checked yet.');
  const [pillar9QuizResponses, setPillar9QuizResponses] = useState({});
  const [pillar9ScoreMessage, setPillar9ScoreMessage] = useState('Not checked yet.');
  const [pillar10QuizResponses, setPillar10QuizResponses] = useState({});
  const [pillar10ScoreMessage, setPillar10ScoreMessage] = useState('Not checked yet.');
  const [pillar11QuizResponses, setPillar11QuizResponses] = useState({});
  const [pillar11ScoreMessage, setPillar11ScoreMessage] = useState('Not checked yet.');
  const [isPillar12Expanded, setIsPillar12Expanded] = useState(false);
  const [pillar12QuizResponses, setPillar12QuizResponses] = useState({});
  const [pillar12ScoreMessage, setPillar12ScoreMessage] = useState('Not checked yet.');

  const [isPillar13Expanded, setIsPillar13Expanded] = useState(false);
  const [isPillar14Expanded, setIsPillar14Expanded] = useState(false);
  const [pillar14QuizResponses, setPillar14QuizResponses] = useState({});
  const [pillar14ScoreMessage, setPillar14ScoreMessage] = useState('Not checked yet.');

  const [isPillar15Expanded, setIsPillar15Expanded] = useState(false);
  const [pillar15QuizResponses, setPillar15QuizResponses] = useState({});
  const [pillar15ScoreMessage, setPillar15ScoreMessage] = useState('Not checked yet.');

  const [isPillar16Expanded, setIsPillar16Expanded] = useState(false);
  const [pillar16QuizResponses, setPillar16QuizResponses] = useState({});
  const [pillar16ScoreMessage, setPillar16ScoreMessage] = useState('Not checked yet.');

  const [isPillar17Expanded, setIsPillar17Expanded] = useState(false);
  const [pillar17QuizResponses, setPillar17QuizResponses] = useState({});
  const [pillar17ScoreMessage, setPillar17ScoreMessage] = useState('Not checked yet.');

  const [isPillar18Expanded, setIsPillar18Expanded] = useState(false);
  const [pillar18QuizResponses, setPillar18QuizResponses] = useState({});
  const [pillar18ScoreMessage, setPillar18ScoreMessage] = useState('Not checked yet.');

  const [isPillar19Expanded, setIsPillar19Expanded] = useState(false);
  const [pillar19QuizResponses, setPillar19QuizResponses] = useState({});
  const [pillar19ScoreMessage, setPillar19ScoreMessage] = useState('Not checked yet.');
  const [pillar13QuizResponses, setPillar13QuizResponses] = useState({});
  const [pillar13ScoreMessage, setPillar13ScoreMessage] = useState('Not checked yet.');

  const [activeModule, setActiveModule] = useState('p1-map');
  const [isPillar1Expanded, setIsPillar1Expanded] = useState(true);
  const [isPillar2Expanded, setIsPillar2Expanded] = useState(false);
  const [isPillar3Expanded, setIsPillar3Expanded] = useState(false);
  const [isPillar4Expanded, setIsPillar4Expanded] = useState(false);
  const [isPillar5Expanded, setIsPillar5Expanded] = useState(false);
  const [isPillar6Expanded, setIsPillar6Expanded] = useState(false);
  const [isPillar7Expanded, setIsPillar7Expanded] = useState(false);
  const [isPillar8Expanded, setIsPillar8Expanded] = useState(false);
  const [isPillar9Expanded, setIsPillar9Expanded] = useState(false);
  const [isPillar10Expanded, setIsPillar10Expanded] = useState(false);
  const [isPillar11Expanded, setIsPillar11Expanded] = useState(false);

  const [activePillar, setActivePillar] = useState(1);
  const normalizedQuery = searchTerm.trim().toLowerCase();
  const articleRef = useRef(null);
  const navRef = useRef(null);



  const scrollToTop = () => {
    if (articleRef.current) {
      articleRef.current.scrollTop = 0;
    }
  };

  const handleModuleChange = (moduleId) => {
    setActiveModule(moduleId);
    scrollToTop();
  };

  const handlePillar1QuizResponse = (questionIndex, optionIndex) => {
    setPillar1QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar1Score = () => {
    const correct = pillar1QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar1QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 7
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 10 when you are.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar1ScoreMessage(message);
  };



  const handlePillar3QuizResponse = (questionIndex, optionIndex) => {
    setPillar3QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar3Score = () => {
    const correct = pillar3QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar3QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 11.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar3ScoreMessage(message);
  };

  const handlePillar4QuizResponse = (questionIndex, optionIndex) => {
    setPillar4QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar4Score = () => {
    const correct = pillar4QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar4QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 3.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar4ScoreMessage(message);
  };

  const handlePillar5QuizResponse = (questionIndex, optionIndex) => {
    setPillar5QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar5Score = () => {
    const correct = pillar5QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar5QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 9
        ? `✅ Pass! You scored ${correct}/12. You're ready for Pillar 4.`
        : `❌ ${correct}/12. Revisit the sections you missed and try again.`;
    setPillar5ScoreMessage(message);
  };

  const handlePillar6QuizResponse = (questionIndex, optionIndex) => {
    setPillar6QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar6Score = () => {
    const correct = pillar6QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar6QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 10
        ? `✅ Pass! You scored ${correct}/13. You're ready for Pillar 7.`
        : `❌ ${correct}/13. Revisit the sections you missed and try again.`;
    setPillar6ScoreMessage(message);
  };

  const handlePillar7QuizResponse = (questionIndex, optionIndex) => {
    setPillar7QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar7Score = () => {
    const correct = pillar7QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar7QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 5
        ? `✅ Pass! You scored ${correct}/6. You're ready for Pillar 9.`
        : `❌ ${correct}/6. Revisit the sections you missed and try again.`;
    setPillar7ScoreMessage(message);
  };

  const handlePillar8QuizResponse = (questionIndex, optionIndex) => {
    setPillar8QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar8Score = () => {
    const correct = pillar8QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar8QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 9
        ? `✅ Pass! You scored ${correct}/12. You're ready for Pillar 5.`
        : `❌ ${correct}/12. Revisit the sections you missed and try again.`;
    setPillar8ScoreMessage(message);
  };

  const handlePillar9QuizResponse = (questionIndex, optionIndex) => {
    setPillar9QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar9Score = () => {
    const correct = pillar9QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar9QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 8.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar9ScoreMessage(message);
  };

  const handlePillar10QuizResponse = (questionIndex, optionIndex) => {
    setPillar10QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar10Score = () => {
    const correct = pillar10QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar10QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 6.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar10ScoreMessage(message);
  };

  const handlePillar11QuizResponse = (questionIndex, optionIndex) => {
    setPillar11QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar11Score = () => {
    const correct = pillar11QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar11QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 8
        ? `✅ Pass! You scored ${correct}/10. You're ready for Pillar 12.`
        : `❌ ${correct}/10. Revisit the sections you missed and try again.`;
    setPillar11ScoreMessage(message);
  };

  const handlePillar12Score = () => {
    const correct = pillar12QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar12QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message = correct >= 4
      ? `✅ Pass! You scored ${correct}/5. Rainmaker status approved.`
      : `❌ ${correct}/5. Review the objection handling section.`;
    setPillar12ScoreMessage(message);
  };

  const handlePillar13QuizResponse = (questionIndex, optionIndex) => {
    setPillar13QuizResponses((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handlePillar13Score = () => {
    const correct = pillar13QuizQuestions.reduce((sum, question, index) => {
      return sum + (pillar13QuizResponses[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const message =
      correct >= 4
        ? `✅ Pass! You scored ${correct}/5. You are ready to lead.`
        : `❌ ${correct}/5. Review the CCMA section.`;
    setPillar13ScoreMessage(message);
  };

  // Pillar 14 Hnadlers
  const handlePillar14QuizResponse = (questionIndex, optionIndex) => {
    setPillar14QuizResponses(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };
  const handlePillar14Score = () => {
    const correct = pillar14QuizQuestions.reduce((sum, q, i) => sum + (pillar14QuizResponses[i] === q.correctIndex ? 1 : 0), 0);
    setPillar14ScoreMessage(correct >= 4 ? `✅ Funded! Score: ${correct}/5` : `❌ ${correct}/5. Check your math.`);
  };

  // Pillar 15 Handlers
  const handlePillar15QuizResponse = (questionIndex, optionIndex) => {
    setPillar15QuizResponses(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };
  const handlePillar15Score = () => {
    const correct = pillar15QuizQuestions.reduce((sum, q, i) => sum + (pillar15QuizResponses[i] === q.correctIndex ? 1 : 0), 0);
    setPillar15ScoreMessage(correct >= 4 ? `✅ Delivered! Score: ${correct}/5` : `❌ ${correct}/5. Package lost.`);
  };

  // Pillar 16 Handlers
  const handlePillar16QuizResponse = (questionIndex, optionIndex) => {
    setPillar16QuizResponses(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };
  const handlePillar16Score = () => {
    const correct = pillar16QuizQuestions.reduce((sum, q, i) => sum + (pillar16QuizResponses[i] === q.correctIndex ? 1 : 0), 0);
    setPillar16ScoreMessage(correct >= 4 ? `✅ Validated! Score: ${correct}/5` : `❌ ${correct}/5. Pivot required.`);
  };

  // Pillar 17 Handlers
  const handlePillar17QuizResponse = (questionIndex, optionIndex) => {
    setPillar17QuizResponses(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };
  const handlePillar17Score = () => {
    const correct = pillar17QuizQuestions.reduce((sum, q, i) => sum + (pillar17QuizResponses[i] === q.correctIndex ? 1 : 0), 0);
    setPillar17ScoreMessage(correct >= 4 ? `✅ Partnered Up! Score: ${correct}/5` : `❌ ${correct}/5. Read the contract again.`);
  };

  // Pillar 18 Handlers
  const handlePillar18QuizResponse = (questionIndex, optionIndex) => {
    setPillar18QuizResponses(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };
  const handlePillar18Score = () => {
    const correct = pillar18QuizQuestions.reduce((sum, q, i) => sum + (pillar18QuizResponses[i] === q.correctIndex ? 1 : 0), 0);
    setPillar18ScoreMessage(correct >= 4 ? `✅ Pass! Score: ${correct}/5` : `❌ ${correct}/5. Review the Crisis module.`);
  };

  // Pillar 19 Handlers
  const handlePillar19QuizResponse = (questionIndex, optionIndex) => {
    setPillar19QuizResponses(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };
  const handlePillar19Score = () => {
    const correct = pillar19QuizQuestions.reduce((sum, q, i) => sum + (pillar19QuizResponses[i] === q.correctIndex ? 1 : 0), 0);
    setPillar19ScoreMessage(correct >= 4 ? `✅ Pass! Score: ${correct}/5` : `❌ ${correct}/5. Review the Exit module.`);
  };



  // Scroll isolation removed to allow natural scroll chaining (user request)


  return (
    <div className="learn-capeweb-layout">
      <div className="learn-capeweb-toc-wrapper">
        <aside className="learn-capeweb-toc">
          <section className="learn-capeweb-controls">
            <div className="search-bar-wrapper">
              <input
                id="capeweb-search-p1"
                type="text"
                placeholder="🔍 Search CapeWeb topics..."
                className="learn-capeweb-search"
                aria-label="Search CapeWeb blueprint content"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <p className="search-hint">Browse by pillar or type what you want to learn.</p>
          </section>

          <nav className="learn-capeweb-nav" aria-label="CapeWeb Blueprint Navigation" ref={navRef}>
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar1Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar1Expanded}
                onClick={() => {
                  setActivePillar(1);
                  setIsPillar1Expanded(!isPillar1Expanded);
                  setIsPillar2Expanded(false);
                  if (!isPillar1Expanded) {
                    setActiveModule('p1-map');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 1 · Strategic Foundation &amp; Brand Identity</div>
                  <div className="pillar-subtitle">Turn your idea into a clear plan + a brand people trust.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar1Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar1Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-strategy">
                  <button className={`pillar-module ${activeModule === 'p1-map' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p1-map')}>
                    <div>
                      <div className="module-title">The Roadmap</div>
                      <p>Where are we going? A map from Idea to Business.</p>
                    </div>
                  </button>
                  <button className={`pillar-module ${activeModule === 'p1-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p1-module-a')}>
                    <div>
                      <div className="module-title">Module A · The Founder Routine</div>
                      <p>Build the habit. You cannot build a company on "when I have time".</p>
                    </div>
                  </button>
                  <button className={`pillar-module ${activeModule === 'p1-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p1-module-b')}>
                    <div>
                      <div className="module-title">Module B · The Problem & Customer</div>
                      <p>Validation: Don't guess, ask. Solving real pain.</p>
                    </div>
                  </button>
                  <button className={`pillar-module ${activeModule === 'p1-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p1-module-c')}>
                    <div>
                      <div className="module-title">Module C · Your Offer</div>
                      <p>Value vs Friction: Making your product irresistible.</p>
                    </div>
                  </button>
                  <button className={`pillar-module ${activeModule === 'p1-module-d' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p1-module-d')}>
                    <div>
                      <div className="module-title">Module D · Competitors</div>
                      <p>Market Research: Know who you are fighting against.</p>
                    </div>
                  </button>
                  <button className={`pillar-module ${activeModule === 'p1-module-e' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p1-module-e')}>
                    <div>
                      <div className="module-title">Module E · Business Model</div>
                      <p>The Money Engine: Service, Product, Subscription, or Marketplace?</p>
                    </div>
                  </button>
                  <button className={`pillar-module ${activeModule === 'p1-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p1-resources')}>
                    <div>
                      <div className="module-title">Module F · Resources</div>
                      <p>Books, tools, and links to help you execute.</p>
                    </div>
                  </button>
                  <button className={`pillar-module ${activeModule === 'p1-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p1-quiz')}>
                    <div>
                      <div className="module-title">Final Exam · Strategy</div>
                      <p>Prove you have a plan.</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 2 - Functional */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar3Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar3Expanded}
                onClick={() => {
                  setActivePillar(3);
                  setIsPillar3Expanded(!isPillar3Expanded);
                  setIsPillar1Expanded(false);
                  setIsPillar2Expanded(false);
                  if (!isPillar3Expanded) {
                    setActiveModule('p3-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 2 · Web Development & Architecture</div>
                  <div className="pillar-subtitle">10 Modules: From fundamentals to full-stack mastery.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar3Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar3Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-web">
                  <button type="button" className={`pillar-module ${activeModule === 'p3-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-module-a')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Module A · Web Fundamentals</div><p>Strategy, sitemaps, and planning your Digital HQ.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p3-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-module-b')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Module B · No-Code Solutions</div><p>Building without code (Wix, Webflow, WordPress).</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p3-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-module-c')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Module C · HTML, CSS & JS</div><p>The code foundations every founder should know.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p3-module-d' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-module-d')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Module D · Modern Frameworks</div><p>React, Next.js, and Tailwind CSS basics.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p3-module-e' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-module-e')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Module E · Backend & APIs</div><p>Databases, authentication, and server logic.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p3-module-f' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-module-f')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Module F · Hosting & Deployment</div><p>Getting live: Vercel, Netlify, and SA hosting.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p3-module-g' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-module-g')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Module G · Performance</div><p>Speed, Core Web Vitals, and optimization.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p3-module-h' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-module-h')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Module H · Security Basics</div><p>HTTPS, passwords, and protecting user data.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p3-module-i' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-module-i')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Module I · E-commerce</div><p>Selling online: WooCommerce, Shopify, Payments.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p3-module-j' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-module-j')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Module J · CMS Management</div><p>Headless vs Traditional CMS options.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p3-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-resources')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Resources</div><p>Architect's Toolkit.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p3-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p3-quiz')}>
                    <div className="module-pill">Pillar 2</div>
                    <div><div className="module-title">Final Exam · Architecture</div><p>Prove you know the stack.</p></div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 3 - Functional */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar5Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar5Expanded}
                onClick={() => {
                  setActivePillar(5);
                  setIsPillar5Expanded(!isPillar5Expanded);
                  setIsPillar1Expanded(false);
                  setIsPillar2Expanded(false);
                  setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false);
                  if (!isPillar5Expanded) {
                    setActiveModule('p5-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 3 · Search Engine Optimization</div>
                  <div className="pillar-subtitle">9 Modules: SEO for Real Revenue.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar5Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar5Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-seo">
                  <button type="button" className={`pillar-module ${activeModule === 'p5-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p5-module-a')}>
                    <div className="module-pill">Pillar 3</div>
                    <div><div className="module-title">Module A · SEO Fundamentals</div><p>Technical, Content, and Authority pillars.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p5-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p5-module-b')}>
                    <div className="module-pill">Pillar 3</div>
                    <div><div className="module-title">Module B · Keyword Research</div><p>Finding what South Africans search for.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p5-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p5-module-c')}>
                    <div className="module-pill">Pillar 3</div>
                    <div><div className="module-title">Module C · On-Page SEO</div><p>Titles, metas, and structure.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p5-module-d' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p5-module-d')}>
                    <div className="module-pill">Pillar 3</div>
                    <div><div className="module-title">Module D · Technical SEO</div><p>Sitemaps, robots.txt, and speed.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p5-module-e' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p5-module-e')}>
                    <div className="module-pill">Pillar 3</div>
                    <div><div className="module-title">Module E · Local SEO</div><p>Google Business Profile & Maps domination.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p5-module-f' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p5-module-f')}>
                    <div className="module-pill">Pillar 3</div>
                    <div><div className="module-title">Module F · Content Strategy</div><p>Topic clusters and pillar pages.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p5-module-g' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p5-module-g')}>
                    <div className="module-pill">Pillar 3</div>
                    <div><div className="module-title">Module G · Link Building</div><p>Getting votes of confidence (backlinks).</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p5-module-h' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p5-module-h')}>
                    <div className="module-pill">Pillar 3</div>
                    <div><div className="module-title">Module H · Tools & Metrics</div><p>Google Search Console & Analytics.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p5-module-i' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p5-module-i')}>
                    <div className="module-pill">Pillar 3</div>
                    <div><div className="module-title">Module I · E-commerce SEO</div><p>Fixing duplicate content.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p5-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p5-resources')}>
                    <div className="module-pill">Pillar 3</div>
                    <div><div className="module-title">Resources</div><p>SEO Toolkit.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p5-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p5-quiz')}>
                    <div className="module-pill">Pillar 3</div>
                    <div><div className="module-title">Final Exam · SEO Strategy</div><p>Prove you can rank.</p></div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 4 - Functional */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar6Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar6Expanded}
                onClick={() => {
                  setActivePillar(6);
                  setIsPillar6Expanded(!isPillar6Expanded);
                  setIsPillar1Expanded(false);
                  setIsPillar2Expanded(false);
                  setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false);
                  setIsPillar5Expanded(false);
                  if (!isPillar6Expanded) {
                    setActiveModule('p6-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 4 · Social Media &amp; Digital Marketing</div>
                  <div className="pillar-subtitle">7 Modules: Storytelling at the Speed of Social.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar6Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar6Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-marketing">
                  <button type="button" className={`pillar-module ${activeModule === 'p6-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p6-module-a')}>
                    <div className="module-pill">Pillar 4</div>
                    <div><div className="module-title">Module A · Platform Selection</div><p>TikTok, WhatsApp, LinkedIn - what works where.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p6-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p6-module-b')}>
                    <div className="module-pill">Pillar 4</div>
                    <div><div className="module-title">Module B · Content Creation</div><p>Educate, Entertain, Empower.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p6-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p6-module-c')}>
                    <div className="module-pill">Pillar 4</div>
                    <div><div className="module-title">Module C · Organic Growth</div><p>The Hook-Value-CTA framework.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p6-module-d' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p6-module-d')}>
                    <div className="module-pill">Pillar 4</div>
                    <div><div className="module-title">Module D · Paid Advertising</div><p>Meta Ads & Google Ads for SA budgets.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p6-module-e' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p6-module-e')}>
                    <div className="module-pill">Pillar 4</div>
                    <div><div className="module-title">Module E · WhatsApp Business</div><p>Catalogs, quick replies, and commerce.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p6-module-f' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p6-module-f')}>
                    <div className="module-pill">Pillar 4</div>
                    <div><div className="module-title">Module F · Influencer Marketing</div><p>Nano vs Macro influencers in SA.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p6-module-g' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p6-module-g')}>
                    <div className="module-pill">Pillar 4</div>
                    <div><div className="module-title">Module G · Analytics</div><p>Vanity metrics vs real business results.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p6-module-h' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p6-module-h')}>
                    <div className="module-pill">Pillar 4</div>
                    <div><div className="module-title">Module H · Analytics & ROAS</div><p>Calculating CAC, LTV, and knowing your numbers.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p6-module-i' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p6-module-i')}>
                    <div className="module-pill">Pillar 4</div>
                    <div><div className="module-title">Module I · Strategies</div><p>Jab, Jab, Right Hook.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p6-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p6-resources')}>
                    <div className="module-pill">Pillar 4</div>
                    <div><div className="module-title">Resources</div><p>Marketing Toolkit.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p6-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p6-quiz')}>
                    <div className="module-pill">Pillar 4</div>
                    <div><div className="module-title">Final Exam · Marketing</div><p>Prove you can sell.</p></div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 5 - Functional */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar9Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar9Expanded}
                onClick={() => {
                  setActivePillar(9);
                  setIsPillar9Expanded(!isPillar9Expanded);
                  setIsPillar1Expanded(false);
                  setIsPillar2Expanded(false);
                  setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false);
                  setIsPillar5Expanded(false);
                  setIsPillar6Expanded(false);
                  setIsPillar7Expanded(false);
                  setIsPillar8Expanded(false);
                  if (!isPillar9Expanded) {
                    setActiveModule('p9-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 5 · Financial Systems &amp; eCommerce</div>
                  <div className="pillar-subtitle">Money, payments, pricing, bookkeeping, and selling online.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar9Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar9Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-money">
                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p9-module-a' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p9-module-a' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p9-module-a')}
                  >
                    <div className="module-pill">Pillar 5</div>
                    <div>
                      <div className="module-title">Module A · The CapeWeb Money Machine</div>
                      <p>Build a financial system that helps you price, sell, collect, and track every rand.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p9-module-b' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p9-module-b' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p9-module-b')}
                  >
                    <div className="module-pill">Pillar 5</div>
                    <div>
                      <div className="module-title">Module B · Pricing Strategy & Psychology</div>
                      <p>Cost-plus, value-based, competitive pricing, psychological tactics, margins, and discounts.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p9-module-c' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p9-module-c' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p9-module-c')}
                  >
                    <div className="module-pill">Pillar 5</div>
                    <div>
                      <div className="module-title">Module C · Payment Processing for SA</div>
                      <p>PayFast, Yoco, Ozow comparison, gateway setup, transaction fees, and payment security.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p9-module-d' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p9-module-d' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p9-module-d')}
                  >
                    <div className="module-pill">Pillar 5</div>
                    <div>
                      <div className="module-title">Module D · Invoicing & Contracts</div>
                      <p>Professional invoicing, payment terms, basic contracts, and debt collection.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p9-module-e' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p9-module-e' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p9-module-e')}
                  >
                    <div className="module-pill">Pillar 5</div>
                    <div>
                      <div className="module-title">Module E · Cross-Border Trade & Logistics</div>
                      <p>SADC markets, customs, PUDO/Paxi, cross-border payments, and regional expansion.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p9-module-f' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p9-module-f' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p9-module-f')}
                  >
                    <div className="module-pill">Pillar 5</div>
                    <div>
                      <div className="module-title">Module F · SA Funding Ecosystem</div>
                      <p>SEFA, SEDA, NYDA, provincial funding, stokvels, angel investors, and accessing growth capital.</p>
                    </div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p9-module-g' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p9-module-g')}>
                    <div className="module-pill">Pillar 5</div>
                    <div><div className="module-title">Module G · Cash Flow vs Profit</div><p>Understanding burn rate and runway.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p9-module-h' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p9-module-h')}>
                    <div className="module-pill">Pillar 5</div>
                    <div><div className="module-title">Module H · Financial Forecasting</div><p>Predicting the future (Base/Best/Worst).</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p9-module-i' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p9-module-i')}>
                    <div className="module-pill">Pillar 5</div>
                    <div><div className="module-title">Module I · The Scoreboard</div><p>P&L, Balance Sheet, and Cash Flow Statement.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p9-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p9-resources')}>
                    <div className="module-pill">Pillar 5</div>
                    <div><div className="module-title">Resources</div><p>Financial Toolkit.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p9-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p9-quiz')}>
                    <div className="module-pill">Pillar 5</div>
                    <div><div className="module-title">Final Exam · Financial Systems</div><p>Prove you can manage money.</p></div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 6 - Functional */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar11Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar11Expanded}
                onClick={() => {
                  setActivePillar(11);
                  setIsPillar11Expanded(!isPillar11Expanded);
                  setIsPillar1Expanded(false);
                  setIsPillar2Expanded(false);
                  setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false);
                  setIsPillar5Expanded(false);
                  setIsPillar6Expanded(false);
                  setIsPillar7Expanded(false);
                  setIsPillar8Expanded(false);
                  setIsPillar9Expanded(false);
                  setIsPillar10Expanded(false);
                  if (!isPillar11Expanded) {
                    setActiveModule('p11-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 6 · Customer Experience &amp; Support</div>
                  <div className="pillar-subtitle">Turn support into a growth lever.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar11Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar11Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-cx">
                  <button type="button" className={`pillar-module ${activeModule === 'p11-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p11-module-a')}>
                    <div className="module-pill">Pillar 6</div>
                    <div><div className="module-title">Module A · CX Strategy</div><p>Why customer service is your best marketing channel.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p11-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p11-module-b')}>
                    <div className="module-pill">Pillar 6</div>
                    <div><div className="module-title">Module B · Support Foundations</div><p>Speed, accuracy, and the human touch.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p11-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p11-module-c')}>
                    <div className="module-pill">Pillar 6</div>
                    <div><div className="module-title">Module C · Help Desk</div><p>Moving from Gmail to professional ticketing tools.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p11-module-d' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p11-module-d')}>
                    <div className="module-pill">Pillar 6</div>
                    <div><div className="module-title">Module D · Knowledge Base</div><p>Letting customers solve their own problems 24/7.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p11-module-e' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p11-module-e')}>
                    <div className="module-pill">Pillar 6</div>
                    <div><div className="module-title">Module E · Chat & WhatsApp</div><p>Closing sales with instant answers.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p11-module-f' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p11-module-f')}>
                    <div className="module-pill">Pillar 6</div>
                    <div><div className="module-title">Module F · Feedback</div><p>Measuring customer loyalty with Net Promoter Score.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p11-module-g' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p11-module-g')}>
                    <div className="module-pill">Pillar 6</div>
                    <div><div className="module-title">Module G · Retention</div><p>Fixing mistakes and keeping customers for life.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p11-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p11-resources')}>
                    <div className="module-pill">Pillar 6</div>
                    <div><div className="module-title">Module H · Resources</div><p>CX Toolkit.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p11-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p11-quiz')}>
                    <div className="module-pill">Pillar 6</div>
                    <div><div className="module-title">Final Exam · CX Mastery</div><p>Prove you can serve.</p></div>
                  </button>
                </div>
              )}
            </div>



            {/* Pillar 7 - Functional */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar7Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar7Expanded}
                onClick={() => {
                  setActivePillar(7);
                  setIsPillar7Expanded(!isPillar7Expanded);
                  setIsPillar1Expanded(false);
                  setIsPillar2Expanded(false);
                  setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false);
                  setIsPillar5Expanded(false);
                  setIsPillar6Expanded(false);
                  if (!isPillar7Expanded) {
                    setActiveModule('p7-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 7 · AI & Automation</div>
                  <div className="pillar-subtitle">9 Modules: Scale with AI Assistants.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar7Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar7Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-ai">
                  <button type="button" className={`pillar-module ${activeModule === 'p7-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p7-module-a')}>
                    <div className="module-pill">Pillar 7</div>
                    <div><div className="module-title">Module A · AI Strategy</div><p>Creation, Automation, and Analysis layers.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p7-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p7-module-b')}>
                    <div className="module-pill">Pillar 7</div>
                    <div><div className="module-title">Module B · ChatGPT & LLMs</div><p>Prompt Engineering 101.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p7-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p7-module-c')}>
                    <div className="module-pill">Pillar 7</div>
                    <div><div className="module-title">Module C · Writing Tools</div><p>Claude, Jasper, and copy assistance.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p7-module-d' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p7-module-d')}>
                    <div className="module-pill">Pillar 7</div>
                    <div><div className="module-title">Module D · Design Tools</div><p>Midjourney, DALL-E 3, and assets.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p7-module-e' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p7-module-e')}>
                    <div className="module-pill">Pillar 7</div>
                    <div><div className="module-title">Module E · No-Code Auto</div><p>Zapier and Make fundamentals.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p7-module-f' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p7-module-f')}>
                    <div className="module-pill">Pillar 7</div>
                    <div><div className="module-title">Module F · AI Customer Support</div><p>Chatbots and instant replies.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p7-module-g' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p7-module-g')}>
                    <div className="module-pill">Pillar 7</div>
                    <div><div className="module-title">Module G · Data Analytics</div><p>Using AI to analyze spreadsheets.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p7-module-h' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p7-module-h')}>
                    <div className="module-pill">Pillar 7</div>
                    <div><div className="module-title">Module H · Advanced Auto</div><p>AI Agents and multi-step tasks.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p7-module-i' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p7-module-i')}>
                    <div className="module-pill">Pillar 7</div>
                    <div><div className="module-title">Module I · Productivity</div><p>Meeting notes and email assistants.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p7-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p7-resources')}>
                    <div className="module-pill">Pillar 7</div><div><div className="module-title">Resources</div><p>AI Architect Toolkit.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p7-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p7-quiz')}>
                    <div className="module-pill">Pillar 7</div><div><div className="module-title">Final Exam · AI Architect</div><p>Prove you can automate.</p></div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 8 - Functional */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar10Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar10Expanded}
                onClick={() => {
                  setActivePillar(10);
                  setIsPillar10Expanded(!isPillar10Expanded);
                  setIsPillar1Expanded(false);
                  setIsPillar2Expanded(false);
                  setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false);
                  setIsPillar5Expanded(false);
                  setIsPillar6Expanded(false);
                  setIsPillar7Expanded(false);
                  setIsPillar8Expanded(false);
                  setIsPillar9Expanded(false);
                  if (!isPillar10Expanded) {
                    setActiveModule('p10-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 8 · Analytics &amp; Business Intelligence</div>
                  <div className="pillar-subtitle">Run the business on data, not vibes.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar10Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar10Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-analytics">
                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p10-module-a' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p10-module-a' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p10-module-a')}
                  >
                    <div className="module-pill">Pillar 8</div>
                    <div>
                      <div className="module-title">Module A · Fundamentals</div>
                      <p>Understanding data, metrics, KPIs, and the analytics mindset.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p10-module-b' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p10-module-b' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p10-module-b')}
                  >
                    <div className="module-pill">Pillar 8</div>
                    <div>
                      <div className="module-title">Module B · Google Analytics 4 (GA4)</div>
                      <p>Setting up GA4, understanding events, reports, and user journeys.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p10-module-c' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p10-module-c' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p10-module-c')}
                  >
                    <div className="module-pill">Pillar 8</div>
                    <div>
                      <div className="module-title">Module C · Google Tag Manager (GTM)</div>
                      <p>Implementing tags, triggers, variables, and managing website tracking.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p10-module-d' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p10-module-d' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p10-module-d')}
                  >
                    <div className="module-pill">Pillar 8</div>
                    <div>
                      <div className="module-title">Module D · E-commerce Analytics</div>
                      <p>Tracking sales, conversions, product performance, and customer behavior.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p10-module-e' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p10-module-e' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p10-module-e')}
                  >
                    <div className="module-pill">Pillar 8</div>
                    <div>
                      <div className="module-title">Module E · Attribution Models</div>
                      <p>Understanding how different marketing channels contribute to conversions.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p10-module-f' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p10-module-f' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p10-module-f')}
                  >
                    <div className="module-pill">Pillar 8</div>
                    <div>
                      <div className="module-title">Module F · Dashboards & Reporting</div>
                      <p>Creating effective dashboards, visualizing data, and communicating insights.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p10-module-g' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p10-module-g' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p10-module-g')}
                  >
                    <div className="module-pill">Pillar 8</div>
                    <div>
                      <div className="module-title">Module G · A/B Testing & Optimization</div>
                      <p>Running experiments, testing hypotheses, and optimizing for better results.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p10-resources' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p10-resources' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p10-resources')}
                  >
                    <div className="module-pill">Pillar 8</div>
                    <div>
                      <div className="module-title">Module H · Resources</div>
                      <p>Tools, books, and references to deeper your knowledge.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p10-quiz' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p10-quiz' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p10-quiz')}
                  >
                    <div className="module-pill">Pillar 8</div>
                    <div>
                      <div className="module-title">Final Exam · Analytics</div>
                      <p>Test your knowledge and earn your badge.</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 9 - Functional */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar8Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar8Expanded}
                onClick={() => {
                  setActivePillar(8);
                  setIsPillar8Expanded(!isPillar8Expanded);
                  setIsPillar1Expanded(false);
                  setIsPillar2Expanded(false);
                  setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false);
                  setIsPillar5Expanded(false);
                  setIsPillar6Expanded(false);
                  setIsPillar7Expanded(false);
                  if (!isPillar8Expanded) {
                    setActiveModule('p8-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 9 · Cybersecurity &amp; Risk Management</div>
                  <div className="pillar-subtitle">Protect your accounts, website, customers, and reputation.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar8Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar8Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-security">
                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p8-module-a' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p8-module-a' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p8-module-a')}
                  >
                    <div className="module-pill">Pillar 9</div>
                    <div>
                      <div className="module-title">Module A · Fundamentals</div>
                      <p>Understanding threats, risks, and the basics of digital self-defense.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p8-module-b' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p8-module-b' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p8-module-b')}
                  >
                    <div className="module-pill">Pillar 9</div>
                    <div>
                      <div className="module-title">Module B · Passwords & Access</div>
                      <p>Strong passwords, 2FA, password managers, and secure access practices.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p8-module-c' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p8-module-c' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p8-module-c')}
                  >
                    <div className="module-pill">Pillar 9</div>
                    <div>
                      <div className="module-title">Module C · Email & Phishing</div>
                      <p>Identifying scams, securing email accounts, and protecting against social engineering.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p8-module-d' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p8-module-d' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p8-module-d')}
                  >
                    <div className="module-pill">Pillar 9</div>
                    <div>
                      <div className="module-title">Module D · Website Security</div>
                      <p>HTTPS, CMS security, backups, and protecting your online presence.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p8-module-e' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p8-module-e' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p8-module-e')}
                  >
                    <div className="module-pill">Pillar 9</div>
                    <div>
                      <div className="module-title">Module E · Data & POPIA</div>
                      <p>Data protection, privacy, POPIA compliance, and secure data handling.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p8-module-f' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p8-module-f' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p8-module-f')}
                  >
                    <div className="module-pill">Pillar 9</div>
                    <div>
                      <div className="module-title">Module F · Device Security</div>
                      <p>Securing laptops, phones, tablets, and protecting against malware.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p8-module-g' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p8-module-g' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p8-module-g')}
                  >
                    <div className="module-pill">Pillar 9</div>
                    <div>
                      <div className="module-title">Module G · Cloud Security</div>
                      <p>Securing cloud accounts, storage, and understanding cloud risks.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p8-module-h' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p8-module-h' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p8-module-h')}
                  >
                    <div className="module-pill">Pillar 9</div>
                    <div>
                      <div className="module-title">Module H · Incident Response</div>
                      <p>What to do when things go wrong: detection, response, and recovery.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p8-module-i' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p8-module-i' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p8-module-i')}
                  >
                    <div className="module-pill">Pillar 9</div>
                    <div>
                      <div className="module-title">Module I · Security Training</div>
                      <p>Building a security-aware culture for yourself and your team.</p>
                    </div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p8-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p8-resources')}>
                    <div className="module-pill">Pillar 9</div>
                    <div><div className="module-title">Resources</div><p>Security Toolkit.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p8-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p8-quiz')}>
                    <div className="module-pill">Pillar 9</div>
                    <div><div className="module-title">Final Exam · Cybersecurity</div><p>Prove you can protect.</p></div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 10 - Functional */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar2Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar2Expanded}
                onClick={() => {
                  setActivePillar(2);
                  setIsPillar2Expanded(!isPillar2Expanded);
                  setIsPillar1Expanded(false);
                  if (!isPillar2Expanded) {
                    setActiveModule('p2-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 10 · Legal, Governance & Compliance</div>
                  <div className="pillar-subtitle">Registrations, tax, contracts, POPIA, and doing it properly.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar2Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar2Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-legal">
                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p2-module-a' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p2-module-a' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p2-module-a')}
                  >
                    <div className="module-pill">Pillar 10</div>
                    <div>
                      <div className="module-title">Module A · Choose Your Legal Setup</div>
                      <p>Decide your business structure and "make it real" without wasting money.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p2-module-b' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p2-module-b' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p2-module-b')}
                  >
                    <div className="module-pill">Pillar 10</div>
                    <div>
                      <div className="module-title">Module B · Register & Tax Basics</div>
                      <p>Understand CIPC, SARS, eFiling, VAT, and micro-business options.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p2-module-c' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p2-module-c' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p2-module-c')}
                  >
                    <div className="module-pill">Pillar 10</div>
                    <div>
                      <div className="module-title">Module C · Customers, POPIA & Online Selling</div>
                      <p>Protect your business with policies: CPA, ECTA, POPIA, PAIA.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p2-module-d' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p2-module-d' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p2-module-d')}
                  >
                    <div className="module-pill">Pillar 10</div>
                    <div>
                      <div className="module-title">Module D · Employers & Ongoing Compliance</div>
                      <p>PAYE/UIF/Compensation Fund + annual returns + beneficial ownership.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p2-module-e' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p2-module-e' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p2-module-e')}
                  >
                    <div className="module-pill">Pillar 10</div>
                    <div>
                      <div className="module-title">Module E · Hiring & Labor Law</div>
                      <p>How to hire correctly (Contracts, CCMA, PAYE) without fear.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p2-module-f' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p2-module-f' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p2-module-f')}
                  >
                    <div className="module-pill">Pillar 10</div>
                    <div>
                      <div className="module-title">Module F · B-BBEE & Tenders</div>
                      <p>Unlock government revenue: CIPC, CSD, and B-BBEE affidavits.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p2-module-bonus' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p2-module-bonus' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p2-module-bonus')}
                  >
                    <div className="module-pill">Pillar 10</div>
                    <div>
                      <div className="module-title">Bonus · Cape Town Permits & Tenders</div>
                      <p>City licences, informal trading permits, B-BBEE basics, CSD & eTenders.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p2-resources' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p2-resources' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p2-resources')}
                  >
                    <div className="module-pill">Pillar 10</div>
                    <div>
                      <div className="module-title">Resources</div>
                      <p>Official Portals, Tax Links, and Reading List.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`pillar-module ${activeModule === 'p2-quiz' ? 'is-active' : ''}`}
                    aria-current={activeModule === 'p2-quiz' ? 'true' : 'false'}
                    onClick={() => handleModuleChange('p2-quiz')}
                  >
                    <div className="module-pill">Pillar 10</div>
                    <div>
                      <div className="module-title">Final Exam · Compliance</div>
                      <p>Get your badge.</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 11 - Functional */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar4Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar4Expanded}
                onClick={() => {
                  setActivePillar(4);
                  setIsPillar4Expanded(!isPillar4Expanded);
                  setIsPillar1Expanded(false);
                  setIsPillar2Expanded(false);
                  setIsPillar3Expanded(false);
                  if (!isPillar4Expanded) {
                    setActiveModule('p4-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 11 · Mobile Application Development</div>
                  <div className="pillar-subtitle">11 Modules: From idea to App Store launch.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar4Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar4Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-mobile">
                  <button type="button" className={`pillar-module ${activeModule === 'p4-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-module-a')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Module A · Mobile Strategy</div><p>App vs Web, and planning your MVP.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p4-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-module-b')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Module B · No-Code Mobile</div><p>FlutterFlow, Adalo, and visual builders.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p4-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-module-c')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Module C · React Native</div><p>Building cross-platform apps with JS.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p4-module-d' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-module-d')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Module D · Flutter Dev</div><p>Building beautiful apps with Google's toolkit.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p4-module-e' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-module-e')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Module E · Native iOS/Android</div><p>When to go native (Swift/Kotlin).</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p4-module-f' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-module-f')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Module F · Backend & APIs</div><p>Connecting your app to the cloud.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p4-module-g' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-module-g')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Module G · App Store Publish</div><p>Google Play & Apple App Store guides.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p4-module-h' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-module-h')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Module H · Mobile UX/UI</div><p>Designing for thumbs and small screens.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p4-module-i' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-module-i')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Module I · Optimization</div><p>Performance, battery, and app size.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p4-module-j' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-module-j')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Module J · Testing & QA</div><p>Beta testing and avoiding crashes.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p4-module-k' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-module-k')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Module K · Monetization</div><p>IAP, subscriptions, and analytics.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p4-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-resources')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Resources</div><p>Developer's Toolkit.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p4-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p4-quiz')}>
                    <div className="module-pill">Pillar 11</div>
                    <div><div className="module-title">Final Exam · Mobile Dev</div><p>Prove you can launch an app.</p></div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 12 - Sales */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar12Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar12Expanded}
                onClick={() => {
                  setActivePillar(12);
                  setIsPillar12Expanded(!isPillar12Expanded);
                  setIsPillar1Expanded(false); setIsPillar2Expanded(false); setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false); setIsPillar5Expanded(false); setIsPillar6Expanded(false);
                  setIsPillar7Expanded(false); setIsPillar8Expanded(false); setIsPillar9Expanded(false);
                  setIsPillar10Expanded(false); setIsPillar11Expanded(false); setIsPillar13Expanded(false);
                  if (!isPillar12Expanded) {
                    setActiveModule('p12-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 12 · Sales & Revenue</div>
                  <div className="pillar-subtitle">Hunting, Pitching, and Closing.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar12Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar12Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-sales">
                  <button type="button" className={`pillar-module ${activeModule === 'p12-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p12-module-a')}>
                    <div className="module-pill">Pillar 12</div>
                    <div><div className="module-title">Module A · Mindset</div><p>Stop begging. Start solving.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p12-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p12-module-b')}>
                    <div className="module-pill">Pillar 12</div>
                    <div><div className="module-title">Module B · The Pitch</div><p>Cold Calling & WhatsApp.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p12-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p12-module-c')}>
                    <div className="module-pill">Pillar 12</div>
                    <div><div className="module-title">Module C · Objections</div><p>Handling "It's too expensive".</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p12-module-d' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p12-module-d')}>
                    <div className="module-pill">Pillar 12</div>
                    <div><div className="module-title">Module D · Tenders</div><p>Government readiness.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p12-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p12-resources')}>
                    <div className="module-pill">Pillar 12</div>
                    <div><div className="module-title">Resources</div><p>Sales Toolkit.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p12-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p12-quiz')}>
                    <div className="module-pill">Pillar 12</div>
                    <div><div className="module-title">Final Exam · Sales</div><p>Rainmaker status.</p></div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 13 - Team Building */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar13Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar13Expanded}
                onClick={() => {
                  setActivePillar(13);
                  setIsPillar13Expanded(!isPillar13Expanded);
                  setIsPillar1Expanded(false); setIsPillar2Expanded(false); setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false); setIsPillar5Expanded(false); setIsPillar6Expanded(false);
                  setIsPillar7Expanded(false); setIsPillar8Expanded(false); setIsPillar9Expanded(false);
                  setIsPillar10Expanded(false); setIsPillar11Expanded(false); setIsPillar12Expanded(false);
                  if (!isPillar13Expanded) {
                    setActiveModule('p13-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 13 · Team Building & HR</div>
                  <div className="pillar-subtitle">Hiring, firing, and scaling a team.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar13Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar13Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-hr">
                  <button type="button" className={`pillar-module ${activeModule === 'p13-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p13-module-a')}>
                    <div className="module-pill">Pillar 13</div>
                    <div><div className="module-title">Module A · Hiring 101</div><p>Contracts & Laws.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p13-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p13-module-b')}>
                    <div className="module-pill">Pillar 13</div>
                    <div><div className="module-title">Module B · Management</div><p>Culture & Pulse.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p13-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p13-module-c')}>
                    <div className="module-pill">Pillar 13</div>
                    <div><div className="module-title">Module C · Discipline</div><p>The CCMA.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p13-module-d' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p13-module-d')}>
                    <div className="module-pill">Pillar 13</div>
                    <div><div className="module-title">Module D · Payroll</div><p>SARS & UIF.</p></div>
                  </button>

                  <button type="button" className={`pillar-module ${activeModule === 'p13-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p13-resources')}>
                    <div className="module-pill">Pillar 13</div>
                    <div><div className="module-title">Resources</div><p>HR Templates.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p13-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p13-quiz')}>
                    <div className="module-pill">Pillar 13</div>
                    <div><div className="module-title">Final Exam · HR</div><p>Lead with confidence.</p></div>
                  </button>
                </div>
              )}
            </div>
            {/* Pillar 14 - Investment */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar14Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar14Expanded}
                onClick={() => {
                  setActivePillar(14);
                  setIsPillar14Expanded(!isPillar14Expanded);
                  setIsPillar1Expanded(false); setIsPillar2Expanded(false); setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false); setIsPillar5Expanded(false); setIsPillar6Expanded(false);
                  setIsPillar7Expanded(false); setIsPillar8Expanded(false); setIsPillar9Expanded(false);
                  setIsPillar10Expanded(false); setIsPillar11Expanded(false);
                  setIsPillar12Expanded(false); setIsPillar13Expanded(false); setIsPillar15Expanded(false);
                  if (!isPillar14Expanded) {
                    setActiveModule('p14-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 14 · Investment</div>
                  <div className="pillar-subtitle">Funding, Grants & Pitching.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar14Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar14Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-investment">
                  <button type="button" className={`pillar-module ${activeModule === 'p14-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p14-module-a')}>
                    <div className="module-pill">Pillar 14</div>
                    <div><div className="module-title">Module A · The Funding Reality</div><p>Equity vs Debt vs Grants.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p14-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p14-module-b')}>
                    <div className="module-pill">Pillar 14</div>
                    <div><div className="module-title">Module B · Government Grants</div><p>NYDA, SEFA & The Paperwork.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p14-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p14-module-c')}>
                    <div className="module-pill">Pillar 14</div>
                    <div><div className="module-title">Module C · Pitch Deck</div><p>10 Slides to Win.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p14-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p14-resources')}>
                    <div className="module-pill">Pillar 14</div>
                    <div><div className="module-title">Resources</div><p>Templates & Links.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p14-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p14-quiz')}>
                    <div className="module-pill">Pillar 14</div>
                    <div><div className="module-title">Final Exam · Funding</div><p>Are you fundable?</p></div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 15 - Supply Chain */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar15Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar15Expanded}
                onClick={() => {
                  setActivePillar(15);
                  setIsPillar15Expanded(!isPillar15Expanded);
                  setIsPillar1Expanded(false); setIsPillar2Expanded(false); setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false); setIsPillar5Expanded(false); setIsPillar6Expanded(false);
                  setIsPillar7Expanded(false); setIsPillar8Expanded(false); setIsPillar9Expanded(false);
                  setIsPillar10Expanded(false); setIsPillar11Expanded(false);
                  setIsPillar12Expanded(false); setIsPillar13Expanded(false); setIsPillar14Expanded(false);
                  if (!isPillar15Expanded) {
                    setActiveModule('p15-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 15 · Supply Chain</div>
                  <div className="pillar-subtitle">Operations, Logistics & Stock.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar15Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar15Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-ops">
                  <button type="button" className={`pillar-module ${activeModule === 'p15-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p15-module-a')}>
                    <div className="module-pill">Pillar 15</div>
                    <div><div className="module-title">Module A · Operations</div><p>Margins & Costs.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p15-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p15-module-b')}>
                    <div className="module-pill">Pillar 15</div>
                    <div><div className="module-title">Module B · Logistics</div><p>Couriers & PAXI.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p15-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p15-module-c')}>
                    <div className="module-pill">Pillar 15</div>
                    <div><div className="module-title">Module C · Inventory</div><p>Stock Control.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p15-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p15-resources')}>
                    <div className="module-pill">Pillar 15</div>
                    <div><div className="module-title">Resources</div><p>Suppliers & Tools.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p15-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p15-quiz')}>
                    <div className="module-pill">Pillar 15</div>
                    <div><div className="module-title">Final Exam · Ops</div><p>Deliver the goods.</p></div>
                  </button>
                </div>
              )}
            </div>
            {/* Pillar 16 - Product */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar16Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar16Expanded}
                onClick={() => {
                  setActivePillar(16);
                  setIsPillar16Expanded(!isPillar16Expanded);
                  // Close others
                  setIsPillar1Expanded(false); setIsPillar2Expanded(false); setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false); setIsPillar5Expanded(false); setIsPillar6Expanded(false);
                  setIsPillar7Expanded(false); setIsPillar8Expanded(false); setIsPillar9Expanded(false);
                  setIsPillar10Expanded(false); setIsPillar11Expanded(false);
                  setIsPillar12Expanded(false); setIsPillar13Expanded(false);
                  setIsPillar14Expanded(false); setIsPillar15Expanded(false); setIsPillar17Expanded(false);
                  if (!isPillar16Expanded) {
                    setActiveModule('p16-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 16 · Product Strategy</div>
                  <div className="pillar-subtitle">Innovation & MVP.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar16Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar16Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-product">
                  <button type="button" className={`pillar-module ${activeModule === 'p16-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p16-module-a')}>
                    <div className="module-pill">Pillar 16</div>
                    <div><div className="module-title">Module A · Market Fit</div><p>Vitamins vs Painkillers.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p16-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p16-module-b')}>
                    <div className="module-pill">Pillar 16</div>
                    <div><div className="module-title">Module B · Building for SA</div><p>Data costs & Lite apps.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p16-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p16-module-c')}>
                    <div className="module-pill">Pillar 16</div>
                    <div><div className="module-title">Module C · Prioritization</div><p>MVP Strategy.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p16-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p16-resources')}>
                    <div className="module-pill">Pillar 16</div>
                    <div><div className="module-title">Resources</div><p>Figma & Lean Canvas.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p16-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p16-quiz')}>
                    <div className="module-pill">Pillar 16</div>
                    <div><div className="module-title">Final Exam · Product</div><p>Validate your idea.</p></div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 17 - Partnerships */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar17Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar17Expanded}
                onClick={() => {
                  setActivePillar(17);
                  setIsPillar17Expanded(!isPillar17Expanded);
                  // Close others
                  setIsPillar1Expanded(false); setIsPillar2Expanded(false); setIsPillar3Expanded(false);
                  setIsPillar4Expanded(false); setIsPillar5Expanded(false); setIsPillar6Expanded(false);
                  setIsPillar7Expanded(false); setIsPillar8Expanded(false); setIsPillar9Expanded(false);
                  setIsPillar10Expanded(false); setIsPillar11Expanded(false);
                  setIsPillar12Expanded(false); setIsPillar13Expanded(false);
                  setIsPillar14Expanded(false); setIsPillar15Expanded(false); setIsPillar16Expanded(false);
                  if (!isPillar17Expanded) {
                    setActiveModule('p17-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 17 · Partnerships</div>
                  <div className="pillar-subtitle">Contracts & BEE.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar17Expanded ? '▼' : '►'}
                </span>
              </button>

              {isPillar17Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-partnerships">
                  <button type="button" className={`pillar-module ${activeModule === 'p17-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p17-module-a')}>
                    <div className="module-pill">Pillar 17</div>
                    <div><div className="module-title">Module A · Leverage</div><p>Joint Ventures.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p17-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p17-module-b')}>
                    <div className="module-pill">Pillar 17</div>
                    <div><div className="module-title">Module B · B-BBEE</div><p>Enterprise Development.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p17-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p17-module-c')}>
                    <div className="module-pill">Pillar 17</div>
                    <div><div className="module-title">Module C · Contracts</div><p>SLAs & MOUs.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p17-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p17-resources')}>
                    <div className="module-pill">Pillar 17</div>
                    <div><div className="module-title">Resources</div><p>Templates.</p></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p17-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p17-quiz')}>
                    <div className="module-pill">Pillar 17</div>
                    <div><div className="module-title">Final Exam · Deals</div><p>Don't get tricked.</p></div>
                  </button>
                </div>
              )}
            </div>
            {/* Pillar 18 - Crisis */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar18Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar18Expanded}
                onClick={() => {
                  setActivePillar(18);
                  setIsPillar18Expanded(!isPillar18Expanded);
                  // Close others - simplistic approach
                  setIsPillar1Expanded(false); setIsPillar16Expanded(false); setIsPillar17Expanded(false); setIsPillar19Expanded(false);
                  // Note: ideally close all, but prioritized recent ones for brevity
                  if (!isPillar18Expanded) {
                    setActiveModule('p18-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 18 · Crisis Management</div>
                  <div className="pillar-subtitle">Survival.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar18Expanded ? '▼' : '►'}
                </span>
              </button>
              {isPillar18Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-crisis">
                  <button type="button" className={`pillar-module ${activeModule === 'p18-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p18-module-a')}>
                    <div className="module-pill">Pillar 18</div><div><div className="module-title">Module A · PR Crisis</div></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p18-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p18-module-b')}>
                    <div className="module-pill">Pillar 18</div><div><div className="module-title">Module B · Ops Crisis</div></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p18-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p18-module-c')}>
                    <div className="module-pill">Pillar 18</div><div><div className="module-title">Module C · Business Rescue</div></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p18-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p18-resources')}>
                    <div className="module-pill">Pillar 18</div><div><div className="module-title">Resources</div></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p18-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p18-quiz')}>
                    <div className="module-pill">Pillar 18</div><div><div className="module-title">Final Exam</div></div>
                  </button>
                </div>
              )}
            </div>

            {/* Pillar 19 - Exit */}
            <div className="toc-pillar-group">
              <button
                type="button"
                className={`toc-pillar-title-button ${isPillar19Expanded ? 'is-open' : ''}`}
                aria-expanded={isPillar19Expanded}
                onClick={() => {
                  setActivePillar(19);
                  setIsPillar19Expanded(!isPillar19Expanded);
                  // Close others
                  setIsPillar1Expanded(false); setIsPillar16Expanded(false); setIsPillar17Expanded(false); setIsPillar18Expanded(false);
                  if (!isPillar19Expanded) {
                    setActiveModule('p19-module-a');
                  }
                }}
              >
                <div>
                  <div className="pillar-title">Pillar 19 · Exit Strategy</div>
                  <div className="pillar-subtitle">Valuation & Sale.</div>
                </div>
                <span className="toc-expander-icon" aria-hidden="true">
                  {isPillar19Expanded ? '▼' : '►'}
                </span>
              </button>
              {isPillar19Expanded && (
                <div className="pillar-modules" id="pillar-content-pillar-exit">
                  <button type="button" className={`pillar-module ${activeModule === 'p19-module-a' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p19-module-a')}>
                    <div className="module-pill">Pillar 19</div><div><div className="module-title">Module A · Valuation</div></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p19-module-b' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p19-module-b')}>
                    <div className="module-pill">Pillar 19</div><div><div className="module-title">Module B · Building to Sell</div></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p19-module-c' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p19-module-c')}>
                    <div className="module-pill">Pillar 19</div><div><div className="module-title">Module C · Due Diligence</div></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p19-resources' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p19-resources')}>
                    <div className="module-pill">Pillar 19</div><div><div className="module-title">Resources</div></div>
                  </button>
                  <button type="button" className={`pillar-module ${activeModule === 'p19-quiz' ? 'is-active' : ''}`} onClick={() => handleModuleChange('p19-quiz')}>
                    <div className="module-pill">Pillar 19</div><div><div className="module-title">Final Exam</div></div>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </aside>
      </div>

      <div className="learn-capeweb-article-pane">
        <div className="learn-capeweb-article" ref={articleRef}>
          {activePillar === 1 ? (
            <>
              {activeModule === 'p1-map' && (
                <>
                  <div className="article-eyebrow">Pillar 1 · Strategic Foundation &amp; Brand Identity</div>
                  <h1>From Idea to a Real Business Plan</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Turn your raw idea into a clear plan: who you serve, what you sell, why people trust you,
                    and what your next 30 days look like.
                  </p>
                  <div className="article-divider" />
                </>
              )}

              {activeModule === 'p1-map' && <Pillar1JourneyMap onNext={() => setActiveModule('p1-module-a')} />}
              {activeModule === 'p1-module-a' && <Pillar1ModuleA onNext={() => setActiveModule('p1-module-b')} />}
              {activeModule === 'p1-module-b' && <Pillar1ModuleB onNext={() => setActiveModule('p1-module-c')} />}
              {activeModule === 'p1-module-c' && <Pillar1ModuleC onNext={() => setActiveModule('p1-module-d')} />}
              {activeModule === 'p1-module-d' && <Pillar1ModuleD onNext={() => setActiveModule('p1-module-e')} />}
              {activeModule === 'p1-module-e' && <Pillar1ModuleE onNext={() => setActiveModule('p1-resources')} />}
              {activeModule === 'p1-resources' && <Pillar1Resources onNext={() => setActiveModule('p1-quiz')} />}

              {activeModule === 'p1-quiz' && (
                <Pillar1Quiz
                  quizResponses={pillar1QuizResponses}
                  onSelect={handlePillar1QuizResponse}
                  onScore={handlePillar1Score}
                  scoreMessage={pillar1ScoreMessage}
                  onFinish={() => setActiveModule('p1-completion')}
                />
              )}

              {activeModule === 'p1-completion' && <Pillar1Completion />}
            </>
          ) : activePillar === 2 ? (
            <>
              {activeModule === 'p2-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 10 · Legal, Governance & Compliance</div>
                  <h1>Legally Ready for Your First 100 Sales (South Africa + Cape Town)</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> You will understand the legal basics to trade confidently in South Africa: business structure,
                    registration, tax basics, POPIA, consumer rules for online selling, and ongoing compliance. You'll leave with a{' '}
                    <strong>Compliance Passport</strong> checklist and a clear "what to do next" plan.
                  </p>
                  <div className="article-divider" />
                </>
              )}

              {activeModule === 'p2-module-a' && <Pillar2ModuleA onNext={() => handleModuleChange('p2-module-b')} />}
              {activeModule === 'p2-module-b' && <Pillar2ModuleB onNext={() => handleModuleChange('p2-module-c')} />}
              {activeModule === 'p2-module-c' && <Pillar2ModuleC onNext={() => handleModuleChange('p2-module-d')} />}
              {activeModule === 'p2-module-d' && <Pillar2ModuleD onNext={() => handleModuleChange('p2-module-e')} />}
              {activeModule === 'p2-module-e' && <Pillar2ModuleE onNext={() => handleModuleChange('p2-module-f')} />}
              {activeModule === 'p2-module-f' && <Pillar2ModuleF onNext={() => handleModuleChange('p2-module-bonus')} />}
              {activeModule === 'p2-module-bonus' && <Pillar2ModuleBonus onNext={() => handleModuleChange('p2-resources')} />}
              {activeModule === 'p2-resources' && <Pillar2Resources onNext={() => handleModuleChange('p2-quiz')} />}

              {activeModule === 'p2-quiz' && (
                <Pillar2Quiz onFinish={() => handleModuleChange('p2-completion')} />
              )}

              {activeModule === 'p2-completion' && <Pillar2Completion />}
            </>
          ) : activePillar === 3 ? (
            <>
              {activeModule === 'p3-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 2 · Web Development &amp; Architecture</div>
                  <h1>The Digital HQ That Converts</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Master the web stack. From simple No-Code pages to full-stack React applications,
                    you will learn how to build, host, secure, and optimize a professional digital presence in South Africa.
                  </p>
                  <div className="article-divider" />
                </>
              )}

              {activeModule === 'p3-module-a' && <Pillar3ModuleA />}
              {activeModule === 'p3-module-b' && <Pillar3ModuleB />}
              {activeModule === 'p3-module-c' && <Pillar3ModuleC />}
              {activeModule === 'p3-module-d' && <Pillar3ModuleD />}
              {activeModule === 'p3-module-e' && <Pillar3ModuleE />}
              {activeModule === 'p3-module-f' && <Pillar3ModuleF />}
              {activeModule === 'p3-module-g' && <Pillar3ModuleG />}
              {activeModule === 'p3-module-h' && <Pillar3ModuleH />}
              {activeModule === 'p3-module-i' && <Pillar3ModuleI />}
              {activeModule === 'p3-module-j' && <Pillar3ModuleJ onNext={() => handleModuleChange('p3-resources')} />}
              {activeModule === 'p3-resources' && <Pillar3Resources onNext={() => handleModuleChange('p3-quiz')} />}

              {activeModule === 'p3-quiz' && (
                <Pillar3Quiz
                  quizResponses={pillar3QuizResponses}
                  onSelect={handlePillar3QuizResponse}
                  onScore={handlePillar3Score}
                  scoreMessage={pillar3ScoreMessage}
                  onFinish={() => setActiveModule('p3-completion')}
                />
              )}
              {activeModule === 'p3-completion' && <Pillar3Completion />}
            </>
          ) : activePillar === 4 ? (
            <>
              {activeModule === 'p4-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 11 · Mobile Application Development</div>
                  <h1>The Store-Ready MVP</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Go from idea to the App Store. Learn how to prototype, choose the right stack (Native vs Cross-Platform),
                    build your MVP, and navigate the complex submission process for Google Play and Apple App Store.
                  </p>
                  <div className="article-divider" />
                </>
              )}

              {activeModule === 'p4-module-a' && <Pillar4ModuleA />}
              {activeModule === 'p4-module-b' && <Pillar4ModuleB />}
              {activeModule === 'p4-module-c' && <Pillar4ModuleC />}
              {activeModule === 'p4-module-d' && <Pillar4ModuleD />}
              {activeModule === 'p4-module-e' && <Pillar4ModuleE />}
              {activeModule === 'p4-module-f' && <Pillar4ModuleF />}
              {activeModule === 'p4-module-g' && <Pillar4ModuleG />}
              {activeModule === 'p4-module-h' && <Pillar4ModuleH />}
              {activeModule === 'p4-module-i' && <Pillar4ModuleI />}
              {activeModule === 'p4-module-j' && <Pillar4ModuleJ />}
              {activeModule === 'p4-module-k' && <Pillar4ModuleK />}
              {activeModule === 'p4-resources' && <Pillar4Resources onNext={() => handleModuleChange('p4-quiz')} />}

              {activeModule === 'p4-quiz' && (
                <Pillar4Quiz
                  quizResponses={pillar4QuizResponses}
                  onSelect={handlePillar4QuizResponse}
                  onScore={handlePillar4Score}
                  scoreMessage={pillar4ScoreMessage}
                  onFinish={() => setActiveModule('p4-completion')}
                />
              )}
              {activeModule === 'p4-completion' && <Pillar4Completion />}
            </>
          ) : activePillar === 5 ? (
            <>
              {activeModule === 'p5-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 3 · Search Engine Optimization</div>
                  <h1>SEO for Real Revenue</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Learn how Google (and other search engines) find you, rank you, and send customers to your door.
                    You will understand: <strong>(1)</strong> keywords and search intent, <strong>(2)</strong> on-page optimization,{' '}
                    <strong>(3)</strong> technical SEO basics, <strong>(4)</strong> local SEO for Cape Town, <strong>(5)</strong> content systems
                    that compound, <strong>(6)</strong> link-building that won't harm you, and <strong>(7)</strong> measurement that matters.
                    By the end, you'll have an SEO action plan to own organic demand in your market.
                  </p>
                  <div className="article-divider" />
                </>
              )}

              {activeModule === 'p5-module-a' && <Pillar5ModuleA />}
              {activeModule === 'p5-module-b' && <Pillar5ModuleB />}
              {activeModule === 'p5-module-c' && <Pillar5ModuleC />}
              {activeModule === 'p5-module-d' && <Pillar5ModuleD />}
              {activeModule === 'p5-module-e' && <Pillar5ModuleE />}
              {activeModule === 'p5-module-f' && <Pillar5ModuleF />}
              {activeModule === 'p5-module-g' && <Pillar5ModuleG />}
              {activeModule === 'p5-module-h' && <Pillar5ModuleH />}
              {activeModule === 'p5-module-i' && <Pillar5ModuleI />}
              {activeModule === 'p5-resources' && <Pillar5Resources onNext={() => handleModuleChange('p5-quiz')} />}

              {activeModule === 'p5-quiz' && (
                <Pillar5Quiz
                  quizResponses={pillar5QuizResponses}
                  onSelect={handlePillar5QuizResponse}
                  onScore={handlePillar5Score}
                  scoreMessage={pillar5ScoreMessage}
                  onFinish={() => setActiveModule('p5-completion')}
                />
              )}
              {activeModule === 'p5-completion' && <Pillar5Completion />}
            </>
          ) : activePillar === 6 ? (
            <>
              {activeModule === 'p6-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 4 · Social Media &amp; Digital Marketing</div>
                  <h1>Storytelling at the Speed of Social</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Build a marketing system that gets your <strong>first 100 sales</strong>.
                    You will learn the CapeWeb method: pick the right platforms, set up profiles that convert, create content that earns trust,
                    run simple campaigns (even with R0), and track what leads to money.
                    You'll finish with a <strong>7-day launch sprint</strong> and a <strong>weekly marketing scoreboard</strong>.
                  </p>
                  <div className="article-divider" />
                </>
              )}

              {activeModule === 'p6-module-a' && <Pillar6ModuleA />}
              {activeModule === 'p6-module-b' && <Pillar6ModuleB />}
              {activeModule === 'p6-module-c' && <Pillar6ModuleC />}
              {activeModule === 'p6-module-d' && <Pillar6ModuleD />}
              {activeModule === 'p6-module-e' && <Pillar6ModuleE />}
              {activeModule === 'p6-module-f' && <Pillar6ModuleF />}
              {activeModule === 'p6-module-g' && <Pillar6ModuleG />}
              {activeModule === 'p6-module-h' && <Pillar6ModuleH />}
              {activeModule === 'p6-module-i' && <Pillar6ModuleI onNext={() => handleModuleChange('p6-resources')} />}
              {activeModule === 'p6-resources' && <Pillar6Resources onNext={() => handleModuleChange('p6-quiz')} />}

              {activeModule === 'p6-quiz' && (
                <Pillar6Quiz
                  quizResponses={pillar6QuizResponses}
                  onSelect={handlePillar6QuizResponse}
                  onScore={handlePillar6Score}
                  scoreMessage={pillar6ScoreMessage}
                  onFinish={() => setActiveModule('p6-completion')}
                />
              )}
              {activeModule === 'p6-completion' && <Pillar6Completion />}
            </>
          ) : activePillar === 7 ? (
            <>
              {activeModule === 'p7-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 7 · Artificial Intelligence &amp; Automation</div>
                  <h1>Scale with Automations and AI Assistants</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Build an always-on system that captures leads, books meetings, and follows up—without you.
                    You will learn where automation fits (lead capture, WhatsApp replies, bookings), how to choose your stack (R0, CRM, or custom automation),
                    when to add AI (prompts, chatbots, workflows), and how to stay compliant (POPIA, opt-ins, consent).
                    You'll finish with a <strong>playbook library</strong>, an <strong>AI prompt builder</strong>, and a <strong>pipeline template</strong>.
                  </p>
                  <div className="article-divider" />
                </>
              )}

              {activeModule === 'p7-module-a' && <Pillar7ModuleA />}
              {activeModule === 'p7-module-b' && <Pillar7ModuleB />}
              {activeModule === 'p7-module-c' && <Pillar7ModuleC />}
              {activeModule === 'p7-module-d' && <Pillar7ModuleD />}
              {activeModule === 'p7-module-e' && <Pillar7ModuleE />}
              {activeModule === 'p7-module-f' && <Pillar7ModuleF />}
              {activeModule === 'p7-module-g' && <Pillar7ModuleG />}
              {activeModule === 'p7-module-h' && <Pillar7ModuleH />}
              {activeModule === 'p7-module-i' && <Pillar7ModuleI onNext={() => handleModuleChange('p7-resources')} />}
              {activeModule === 'p7-resources' && <Pillar7Resources onNext={() => handleModuleChange('p7-quiz')} />}

              {activeModule === 'p7-quiz' && (
                <Pillar7Quiz
                  quizResponses={pillar7QuizResponses}
                  onSelect={handlePillar7QuizResponse}
                  onScore={handlePillar7Score}
                  scoreMessage={pillar7ScoreMessage}
                  onFinish={() => handleModuleChange('p7-completion')}
                />
              )}

              {activeModule === 'p7-completion' && <Pillar7Completion />}
            </>
          ) : activePillar === 8 ? (
            <>
              {activeModule === 'p8-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 9 · Cybersecurity &amp; Risk Management</div>
                  <h1>Cybersecurity for Normal People (CapeWeb Edition)</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Build a simple, strong security foundation for a Cape Town business that sells a <strong>product + service</strong>.
                    You'll protect your email, social accounts, website, payments, devices, and customer data — and you'll create a "what to do if hacked" plan.
                    You'll finish with a <strong>Risk Register</strong> and a <strong>Security Shield Checklist</strong>.
                  </p>
                  <div className="article-divider" />
                </>
              )}


              {activeModule === 'p8-module-a' && <Pillar8ModuleA />}
              {activeModule === 'p8-module-b' && <Pillar8ModuleB />}
              {activeModule === 'p8-module-c' && <Pillar8ModuleC />}
              {activeModule === 'p8-module-d' && <Pillar8ModuleD />}
              {activeModule === 'p8-module-e' && <Pillar8ModuleE />}
              {activeModule === 'p8-module-f' && <Pillar8ModuleF />}
              {activeModule === 'p8-module-g' && <Pillar8ModuleG />}
              {activeModule === 'p8-module-h' && <Pillar8ModuleH />}
              {activeModule === 'p8-module-i' && <Pillar8ModuleI onNext={() => handleModuleChange('p8-resources')} />}
              {activeModule === 'p8-resources' && <Pillar8Resources onNext={() => handleModuleChange('p8-quiz')} />}

              {activeModule === 'p8-quiz' && (
                <Pillar8Quiz
                  quizResponses={pillar8QuizResponses}
                  onSelect={handlePillar8QuizResponse}
                  onScore={handlePillar8Score}
                  scoreMessage={pillar8ScoreMessage}
                  onFinish={() => handleModuleChange('p8-completion')}
                />
              )}

              {activeModule === 'p8-completion' && <Pillar8Completion />}
            </>
          ) : activePillar === 9 ? (
            <>
              {activeModule === 'p9-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 5 · Financial Systems &amp; eCommerce</div>
                  <h1>CapeWeb Money 101</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Build a financial system that works from Day 1. You'll track every sale, understand pricing, set up local payments,
                    choose your eCommerce path, write fair policies, and prepare for tax season. By the end, you'll have a <strong>simple ledger</strong>, a
                    <strong> pricing calculator</strong>, and a <strong>financial dashboard</strong> you can trust.
                  </p>
                  <div className="article-divider" />
                </>
              )}

              {activeModule === 'p9-module-a' && <Pillar9ModuleA />}
              {activeModule === 'p9-module-b' && <Pillar9ModuleB />}
              {activeModule === 'p9-module-c' && <Pillar9ModuleC />}
              {activeModule === 'p9-module-d' && <Pillar9ModuleD />}
              {activeModule === 'p9-module-e' && <Pillar9ModuleE />}
              {activeModule === 'p9-module-f' && <Pillar9ModuleF onNext={() => handleModuleChange('p9-module-g')} />}
              {activeModule === 'p9-module-g' && <Pillar9ModuleG onNext={() => handleModuleChange('p9-module-h')} />}
              {activeModule === 'p9-module-h' && <Pillar9ModuleH onNext={() => handleModuleChange('p9-module-i')} />}
              {activeModule === 'p9-module-i' && <Pillar9ModuleI onNext={() => handleModuleChange('p9-resources')} />}
              {activeModule === 'p9-resources' && <Pillar9Resources onNext={() => handleModuleChange('p9-quiz')} />}

              {activeModule === 'p9-quiz' && (
                <Pillar9Quiz
                  quizResponses={pillar9QuizResponses}
                  onSelect={handlePillar9QuizResponse}
                  onScore={handlePillar9Score}
                  scoreMessage={pillar9ScoreMessage}
                  onFinish={() => handleModuleChange('p9-completion')}
                />
              )}

              {activeModule === 'p9-completion' && <Pillar9Completion />}
            </>
          ) : activePillar === 10 ? (
            <>
              {activeModule === 'p10-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 8 · Analytics &amp; Business Intelligence</div>
                  <h1>The Growth Dashboard (Measure → Learn → Improve)</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Build a beginner-friendly measurement system for a product + service business in Cape Town.
                    You'll learn what to track, how to track it (free tools), how to interpret it, and how to choose your next improvement.
                  </p>
                  <div className="article-divider" />
                </>
              )}


              {activeModule === 'p10-module-a' && <Pillar10ModuleA />}
              {activeModule === 'p10-module-b' && <Pillar10ModuleB />}
              {activeModule === 'p10-module-c' && <Pillar10ModuleC />}
              {activeModule === 'p10-module-d' && <Pillar10ModuleD />}
              {activeModule === 'p10-module-e' && <Pillar10ModuleE />}
              {activeModule === 'p10-module-f' && <Pillar10ModuleF />}
              {activeModule === 'p10-module-g' && <Pillar10ModuleG onNext={() => handleModuleChange('p10-resources')} />}
              {activeModule === 'p10-resources' && <Pillar10Resources onNext={() => handleModuleChange('p10-quiz')} />}

              {activeModule === 'p10-quiz' && (
                <Pillar10Quiz
                  quizResponses={pillar10QuizResponses}
                  onSelect={handlePillar10QuizResponse}
                  onScore={handlePillar10Score}
                  scoreMessage={pillar10ScoreMessage}
                  onFinish={() => handleModuleChange('p10-completion')}
                />
              )}

              {activeModule === 'p10-completion' && <Pillar10Completion />}
            </>
          ) : activePillar === 11 ? (
            <>
              {activeModule === 'p11-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 6 · Customer Experience &amp; Support</div>
                  <h1>The CX Flywheel (Support → Trust → Reviews → More Sales)</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Build a customer experience that feels like a "real company" from day one:
                    fast replies, clear expectations, simple policies, and a system that learns from customer questions.
                    This is how CapeWeb clients build businesses that run smoothly and grow.
                  </p>
                  <div className="article-divider" />
                </>
              )}


              {activeModule === 'p11-module-a' && <Pillar11ModuleA />}
              {activeModule === 'p11-module-b' && <Pillar11ModuleB />}
              {activeModule === 'p11-module-c' && <Pillar11ModuleC />}
              {activeModule === 'p11-module-d' && <Pillar11ModuleD />}
              {activeModule === 'p11-module-e' && <Pillar11ModuleE />}
              {activeModule === 'p11-module-f' && <Pillar11ModuleF />}
              {activeModule === 'p11-module-g' && <Pillar11ModuleG onNext={() => handleModuleChange('p11-resources')} />}
              {activeModule === 'p11-resources' && <Pillar11Resources onNext={() => handleModuleChange('p11-quiz')} />}

              {activeModule === 'p11-quiz' && (
                <Pillar11Quiz
                  quizResponses={pillar11QuizResponses}
                  onSelect={handlePillar11QuizResponse}
                  onScore={handlePillar11Score}
                  scoreMessage={pillar11ScoreMessage}
                  onFinish={() => handleModuleChange('p11-completion')}
                />
              )}

              {activeModule === 'p11-completion' && <Pillar11Completion onNext={() => {
                setActivePillar(12);
                setIsPillar12Expanded(true);
                handleModuleChange('p12-module-a');
              }} />}
            </>
          ) : activePillar === 12 ? (
            <>
              {activeModule === 'p12-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 12 · Sales & Revenue</div>
                  <h1>Hunting for Business</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Stop waiting for the phone to ring. Learn how to prospect, pitch, and close deals in the SA market.
                  </p>
                  <div className="article-divider" />
                </>
              )}
              {activeModule === 'p12-module-a' && <Pillar12ModuleA onNext={() => handleModuleChange('p12-module-b')} />}
              {activeModule === 'p12-module-b' && <Pillar12ModuleB onNext={() => handleModuleChange('p12-module-c')} />}
              {activeModule === 'p12-module-c' && <Pillar12ModuleC onNext={() => handleModuleChange('p12-module-d')} />}
              {activeModule === 'p12-module-d' && <Pillar12ModuleD onNext={() => handleModuleChange('p12-resources')} />}
              {activeModule === 'p12-resources' && <Pillar12Resources onNext={() => handleModuleChange('p12-quiz')} />}
              {activeModule === 'p12-quiz' && (
                <Pillar12Quiz
                  quizResponses={pillar12QuizResponses}
                  onSelect={(q, o) => setPillar12QuizResponses(prev => ({ ...prev, [q]: o }))}
                  onScore={handlePillar12Score}
                  scoreMessage={pillar12ScoreMessage}
                  onFinish={() => handleModuleChange('p12-completion')}
                />
              )}
              {activeModule === 'p12-completion' && (
                <Pillar12Completion
                  onNext={() => {
                    setActivePillar(13);
                    setActiveModule('p13-module-a');
                    setIsPillar12Expanded(false);
                    setIsPillar13Expanded(true);
                    scrollToTop();
                  }}
                />
              )}
              {/* Note: I should add a button in P12 Completion to go to P13 manually if needed, or rely on sidebar */}
            </>
          ) : activePillar === 13 ? (
            <>
              {activeModule === 'p13-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 13 · Team Building & HR</div>
                  <h1>Building a Team that Works</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Transition from Solopreneur to Leader. Learn hiring, labour law basics, CCMA procedures, and how to build a winning culture.
                  </p>
                  <div className="article-divider" />
                </>
              )}
              {activeModule === 'p13-module-a' && <Pillar13ModuleA onNext={() => handleModuleChange('p13-module-b')} />}
              {activeModule === 'p13-module-b' && <Pillar13ModuleB onNext={() => handleModuleChange('p13-module-c')} />}
              {activeModule === 'p13-module-c' && <Pillar13ModuleC onNext={() => handleModuleChange('p13-module-d')} />}
              {activeModule === 'p13-module-d' && <Pillar13ModuleD onNext={() => handleModuleChange('p13-resources')} />}
              {activeModule === 'p13-resources' && <Pillar13Resources onNext={() => handleModuleChange('p13-quiz')} />}
              {activeModule === 'p13-quiz' && (
                <Pillar13Quiz
                  quizResponses={pillar13QuizResponses}
                  onSelect={handlePillar13QuizResponse}
                  onScore={handlePillar13Score}
                  scoreMessage={pillar13ScoreMessage}
                  onFinish={() => handleModuleChange('p13-completion')}
                />
              )}
              {activeModule === 'p13-completion' && <Pillar13Completion />}
            </>
          ) : activePillar === 14 ? (
            <>
              {activeModule === 'p14-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 14 · Investment</div>
                  <h1>Funding Your Dream</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Understand the funding landscape. Don't waste time on investors if you aren't ready. Master the 6-month rule.
                  </p>
                  <div className="article-divider" />
                </>
              )}
              {activeModule === 'p14-module-a' && <Pillar14ModuleA onNext={() => handleModuleChange('p14-module-b')} />}
              {activeModule === 'p14-module-b' && <Pillar14ModuleB onNext={() => handleModuleChange('p14-module-c')} />}
              {activeModule === 'p14-module-c' && <Pillar14ModuleC onNext={() => handleModuleChange('p14-resources')} />}
              {activeModule === 'p14-resources' && <Pillar14Resources onNext={() => handleModuleChange('p14-quiz')} />}
              {activeModule === 'p14-quiz' && (
                <Pillar14Quiz
                  quizResponses={pillar14QuizResponses}
                  onSelect={handlePillar14QuizResponse}
                  onScore={handlePillar14Score}
                  scoreMessage={pillar14ScoreMessage}
                  onFinish={() => handleModuleChange('p14-completion')}
                />
              )}
              {activeModule === 'p14-completion' && <Pillar14Completion onNext={() => {
                setActivePillar(15);
                setActiveModule('p15-module-a');
                setIsPillar14Expanded(false);
                setIsPillar15Expanded(true);
                // scrollToTop(); // Assumed handled by effect
              }} />}
            </>
          ) : activePillar === 15 ? (
            <>
              {activeModule === 'p15-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 15 · Supply Chain</div>
                  <h1>Operations & Logistics</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Master the physical side of business. Shipping, stock, and margins.
                  </p>
                  <div className="article-divider" />
                </>
              )}
              {activeModule === 'p15-module-a' && <Pillar15ModuleA onNext={() => handleModuleChange('p15-module-b')} />}
              {activeModule === 'p15-module-b' && <Pillar15ModuleB onNext={() => handleModuleChange('p15-module-c')} />}
              {activeModule === 'p15-module-c' && <Pillar15ModuleC onNext={() => handleModuleChange('p15-resources')} />}
              {activeModule === 'p15-resources' && <Pillar15Resources onNext={() => handleModuleChange('p15-quiz')} />}
              {activeModule === 'p15-quiz' && (
                <Pillar15Quiz
                  quizResponses={pillar15QuizResponses}
                  onSelect={handlePillar15QuizResponse}
                  onScore={handlePillar15Score}
                  scoreMessage={pillar15ScoreMessage}
                  onFinish={() => handleModuleChange('p15-completion')}
                />
              )}
              {activeModule === 'p15-completion' && <Pillar15Completion />}
            </>
          ) : activePillar === 16 ? (
            <>
              {activeModule === 'p16-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 16 · Product Strategy</div>
                  <h1>Building What People Want</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Validate your idea before building. Design for the SA reality (mobile-first, low data).
                  </p>
                  <div className="article-divider" />
                </>
              )}
              {activeModule === 'p16-module-a' && <Pillar16ModuleA onNext={() => handleModuleChange('p16-module-b')} />}
              {activeModule === 'p16-module-b' && <Pillar16ModuleB onNext={() => handleModuleChange('p16-module-c')} />}
              {activeModule === 'p16-module-c' && <Pillar16ModuleC onNext={() => handleModuleChange('p16-resources')} />}
              {activeModule === 'p16-resources' && <Pillar16Resources onNext={() => handleModuleChange('p16-quiz')} />}
              {activeModule === 'p16-quiz' && (
                <Pillar16Quiz
                  quizResponses={pillar16QuizResponses}
                  onSelect={handlePillar16QuizResponse}
                  onScore={handlePillar16Score}
                  scoreMessage={pillar16ScoreMessage}
                  onFinish={() => handleModuleChange('p16-completion')}
                />
              )}
              {activeModule === 'p16-completion' && <Pillar16Completion onNext={() => {
                setActivePillar(17);
                setActiveModule('p17-module-a');
                setIsPillar16Expanded(false);
                setIsPillar17Expanded(true);
              }} />}
            </>
          ) : activePillar === 17 ? (
            <>
              {activeModule === 'p17-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 17 · Partnerships</div>
                  <h1>The Power of Ecosystems</h1>
                  <p className="article-summary">
                    <strong>Objective:</strong> Accelerate growth through partnerships. Navigate B-BBEE and contracts safely.
                  </p>
                  <div className="article-divider" />
                </>
              )}
              {activeModule === 'p17-module-a' && <Pillar17ModuleA onNext={() => handleModuleChange('p17-module-b')} />}
              {activeModule === 'p17-module-b' && <Pillar17ModuleB onNext={() => handleModuleChange('p17-module-c')} />}
              {activeModule === 'p17-module-c' && <Pillar17ModuleC onNext={() => handleModuleChange('p17-resources')} />}
              {activeModule === 'p17-resources' && <Pillar17Resources onNext={() => handleModuleChange('p17-quiz')} />}
              {activeModule === 'p17-quiz' && (
                <Pillar17Quiz
                  quizResponses={pillar17QuizResponses}
                  onSelect={handlePillar17QuizResponse}
                  onScore={handlePillar17Score}
                  scoreMessage={pillar17ScoreMessage}
                  onFinish={() => handleModuleChange('p17-completion')}
                />
              )}
              {activeModule === 'p17-completion' && <Pillar17Completion onNext={() => {
                setActivePillar(18);
                setActiveModule('p18-module-a');
                setIsPillar17Expanded(false);
                setIsPillar18Expanded(true);
              }} />}
            </>
          ) : activePillar === 18 ? (
            <>
              {activeModule === 'p18-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 18 · Crisis Management</div>
                  <h1>Survival Mode</h1>
                  <p className="article-summary"><strong>Objective:</strong> Navigate storms without sinking. Legal, PR, and Operational Resilience.</p>
                  <div className="article-divider" />
                </>
              )}
              {activeModule === 'p18-module-a' && <Pillar18ModuleA onNext={() => handleModuleChange('p18-module-b')} />}
              {activeModule === 'p18-module-b' && <Pillar18ModuleB onNext={() => handleModuleChange('p18-module-c')} />}
              {activeModule === 'p18-module-c' && <Pillar18ModuleC onNext={() => handleModuleChange('p18-resources')} />}
              {activeModule === 'p18-resources' && <Pillar18Resources onNext={() => handleModuleChange('p18-quiz')} />}
              {activeModule === 'p18-quiz' && (
                <Pillar18Quiz
                  quizResponses={pillar18QuizResponses}
                  onSelect={handlePillar18QuizResponse}
                  onScore={handlePillar18Score}
                  scoreMessage={pillar18ScoreMessage}
                  onFinish={() => handleModuleChange('p18-completion')}
                />
              )}
              {activeModule === 'p18-completion' && <Pillar18Completion onNext={() => {
                setActivePillar(19);
                setActiveModule('p19-module-a');
                setIsPillar18Expanded(false);
                setIsPillar19Expanded(true);
              }} />}
            </>
          ) : activePillar === 19 ? (
            <>
              {activeModule === 'p19-module-a' && (
                <>
                  <div className="article-eyebrow">Pillar 19 · Exit Strategy</div>
                  <h1>The Big Payday</h1>
                  <p className="article-summary"><strong>Objective:</strong> Sell your business for maximum value. Understand valuation and due diligence.</p>
                  <div className="article-divider" />
                </>
              )}
              {activeModule === 'p19-module-a' && <Pillar19ModuleA onNext={() => handleModuleChange('p19-module-b')} />}
              {activeModule === 'p19-module-b' && <Pillar19ModuleB onNext={() => handleModuleChange('p19-module-c')} />}
              {activeModule === 'p19-module-c' && <Pillar19ModuleC onNext={() => handleModuleChange('p19-resources')} />}
              {activeModule === 'p19-resources' && <Pillar19Resources onNext={() => handleModuleChange('p19-quiz')} />}
              {activeModule === 'p19-quiz' && (
                <Pillar19Quiz
                  quizResponses={pillar19QuizResponses}
                  onSelect={handlePillar19QuizResponse}
                  onScore={handlePillar19Score}
                  scoreMessage={pillar19ScoreMessage}
                  onFinish={() => handleModuleChange('p19-completion')}
                />
              )}
              {activeModule === 'p19-completion' && <Pillar19Completion />}
            </>
          ) : null}
        </div>
      </div>
    </div >
  );
}



const sectionBoxStyle = { backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '10px', margin: '1.5rem 0' };
const gridTwoColumn = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
const inputStyle = { width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' };
const textareaStyle = { width: '100%', padding: '.6rem', border: '1px solid #ced4da', borderRadius: '6px' };
const labelStyle = { fontWeight: 700, display: 'block', marginBottom: '.5rem' };
const smallCardStyle = { background: '#fff', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1rem' };
const dividerStyle = { border: 'none', borderTop: '1px solid #e9ecef', margin: '1rem 0' };

function JourneyMapSvg() {
  return (
    <svg width="100%" viewBox="0 0 1100 180" role="img" aria-label="CapeWeb roadmap from idea to a well-run business">
      <defs>
        <style>
          {`.cw-box { fill: #ffffff; stroke: #0b0f1a; stroke-width: 2; rx: 10; }
            .cw-text { font: 18px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill: #0b0f1a; }
            .cw-sub { font: 14px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill: #495057; }
            .cw-arrow { stroke: #0b0f1a; stroke-width: 3; marker-end: url(#arrowhead); }`}
        </style>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a" />
        </marker>
      </defs>
      <rect className="cw-box" x="20" y="40" width="180" height="90"></rect>
      <text className="cw-text" x="110" y="78" textAnchor="middle">
        Idea
      </text>
      <text className="cw-sub" x="110" y="105" textAnchor="middle">
        What you want to build
      </text>
      <line className="cw-arrow" x1="200" y1="85" x2="260" y2="85"></line>
      <rect className="cw-box" x="260" y="40" width="220" height="90"></rect>
      <text className="cw-text" x="370" y="78" textAnchor="middle">
        Validate
      </text>
      <text className="cw-sub" x="370" y="105" textAnchor="middle">
        Real people, real proof
      </text>
      <line className="cw-arrow" x1="480" y1="85" x2="540" y2="85"></line>
      <rect className="cw-box" x="540" y="40" width="220" height="90"></rect>
      <text className="cw-text" x="650" y="78" textAnchor="middle">
        Build &amp; Launch
      </text>
      <text className="cw-sub" x="650" y="105" textAnchor="middle">
        MVP + first customers
      </text>
      <line className="cw-arrow" x1="760" y1="85" x2="820" y2="85"></line>
      <rect className="cw-box" x="820" y="40" width="260" height="90"></rect>
      <text className="cw-text" x="950" y="78" textAnchor="middle">
        Systems &amp; Scale
      </text>
      <text className="cw-sub" x="950" y="105" textAnchor="middle">
        Marketing, finance, automation
      </text>
    </svg>
  );
}

function WeeklyLoopSvg() {
  return (
    <svg width="100%" viewBox="0 0 980 260" role="img" aria-label="CapeWeb weekly loop diagram">
      <defs>
        <style>
          {`.cw2 { fill:#ffffff; stroke:#0b0f1a; stroke-width:2; rx:12; }
            .tx { font: 18px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; }
            .sub { font: 14px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .arr { stroke:#0b0f1a; stroke-width:3; marker-end:url(#ah2); }`}
        </style>
        <marker id="ah2" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a"></polygon>
        </marker>
      </defs>
      <rect className="cw2" x="40" y="40" width="260" height="90"></rect>
      <text className="tx" x="170" y="78" textAnchor="middle">
        Learn
      </text>
      <text className="sub" x="170" y="105" textAnchor="middle">
        New concept (small)
      </text>
      <rect className="cw2" x="340" y="40" width="260" height="90"></rect>
      <text className="tx" x="470" y="78" textAnchor="middle">
        Do
      </text>
      <text className="sub" x="470" y="105" textAnchor="middle">
        One mission (real)
      </text>
      <rect className="cw2" x="640" y="40" width="300" height="90"></rect>
      <text className="tx" x="790" y="78" textAnchor="middle">
        Get Proof
      </text>
      <text className="sub" x="790" y="105" textAnchor="middle">
        Customer feedback / data
      </text>
      <line className="arr" x1="300" y1="85" x2="340" y2="85"></line>
      <line className="arr" x1="600" y1="85" x2="640" y2="85"></line>
      <rect className="cw2" x="340" y="155" width="260" height="90"></rect>
      <text className="tx" x="470" y="192" textAnchor="middle">
        Improve
      </text>
      <text className="sub" x="470" y="220" textAnchor="middle">
        Make it simpler
      </text>
      <line className="arr" x1="790" y1="130" x2="560" y2="155"></line>
      <line className="arr" x1="340" y1="200" x2="170" y2="130"></line>
    </svg>
  );
}

function LeanCanvasSvg() {
  return (
    <svg width="100%" viewBox="0 0 1100 520" role="img" aria-label="Lean Canvas simplified diagram">
      <defs>
        <style>
          {`.lc { fill:#ffffff; stroke:#0b0f1a; stroke-width:2; }
            .lct { font: 16px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight: 700; }
            .lcs { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }`}
        </style>
      </defs>
      <rect className="lc" x="20" y="20" width="260" height="160"></rect>
      <text className="lct" x="40" y="55">
        Problem
      </text>
      <text className="lcs" x="40" y="82">
        Top 3 pains
      </text>
      <rect className="lc" x="300" y="20" width="260" height="160"></rect>
      <text className="lct" x="320" y="55">
        Customer
      </text>
      <text className="lcs" x="320" y="82">
        Who suffers?
      </text>
      <rect className="lc" x="580" y="20" width="500" height="160"></rect>
      <text className="lct" x="600" y="55">
        Unique Value Proposition
      </text>
      <text className="lcs" x="600" y="82">
        Why you? Why now?
      </text>
      <rect className="lc" x="20" y="200" width="260" height="140"></rect>
      <text className="lct" x="40" y="235">
        Solution
      </text>
      <text className="lcs" x="40" y="262">
        Top 3 features
      </text>
      <rect className="lc" x="300" y="200" width="260" height="140"></rect>
      <text className="lct" x="320" y="235">
        Channels
      </text>
      <text className="lcs" x="320" y="262">
        Where you find customers
      </text>
      <rect className="lc" x="580" y="200" width="260" height="140"></rect>
      <text className="lct" x="600" y="235">
        Revenue
      </text>
      <text className="lcs" x="600" y="262">
        How you make money
      </text>
      <rect className="lc" x="860" y="200" width="220" height="140"></rect>
      <text className="lct" x="880" y="235">
        Costs
      </text>
      <text className="lcs" x="880" y="262">
        What you spend
      </text>
      <rect className="lc" x="20" y="360" width="540" height="140"></rect>
      <text className="lct" x="40" y="395">
        Key Metrics
      </text>
      <text className="lcs" x="40" y="422">
        What you track weekly
      </text>
      <rect className="lc" x="580" y="360" width="500" height="140"></rect>
      <text className="lct" x="600" y="395">
        Unfair Advantage
      </text>
      <text className="lcs" x="600" y="422">
        Why you can win long-term
      </text>
    </svg>
  );
}

function ValueFrictionSvg() {
  return (
    <svg width="100%" viewBox="0 0 980 420" role="img" aria-label="Value vs Friction 2x2 grid">
      <defs>
        <style>
          {`.grid { fill:#ffffff; stroke:#0b0f1a; stroke-width:2; }
            .gt { font: 16px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:700; }
            .gs { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }`}
        </style>
      </defs>
      <rect className="grid" x="40" y="40" width="900" height="320"></rect>
      <line x1="490" y1="40" x2="490" y2="360" stroke="#0b0f1a" strokeWidth="2"></line>
      <line x1="40" y1="200" x2="940" y2="200" stroke="#0b0f1a" strokeWidth="2"></line>
      <text className="gt" x="120" y="120">
        ✅ Easy + Valuable
      </text>
      <text className="gs" x="120" y="145">
        Best zone. Customers stay.
      </text>
      <text className="gt" x="560" y="120">
        ⚠️ Hard + Not Valuable
      </text>
      <text className="gs" x="560" y="145">
        Customers leave fast.
      </text>
      <text className="gt" x="120" y="280">
        🧠 Easy but weak
      </text>
      <text className="gs" x="120" y="305">
        Needs stronger results.
      </text>
      <text className="gt" x="560" y="280">
        💎 Valuable but hard
      </text>
      <text className="gs" x="560" y="305">
        Reduce steps. Simplify.
      </text>
    </svg>
  );
}

function StoryBrandSvg() {
  return (
    <svg width="100%" viewBox="0 0 1100 260" role="img" aria-label="Simple storybranding message framework diagram">
      <defs>
        <style>
          {`.sb { fill:#ffffff; stroke:#0b0f1a; stroke-width:2; rx:12; }
            .sbt { font: 17px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#0b0f1a; font-weight:700; }
            .sbs { font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial; fill:#495057; }
            .sba { stroke:#0b0f1a; stroke-width:3; marker-end:url(#sbm); }`}
        </style>
        <marker id="sbm" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#0b0f1a"></polygon>
        </marker>
      </defs>
      <rect className="sb" x="40" y="60" width="220" height="140"></rect>
      <text className="sbt" x="150" y="105" textAnchor="middle">
        Hero
      </text>
      <text className="sbs" x="150" y="135" textAnchor="middle">
        Your customer
      </text>
      <text className="sbs" x="150" y="160" textAnchor="middle">
        wants success
      </text>
      <line className="sba" x1="260" y1="130" x2="320" y2="130"></line>
      <rect className="sb" x="320" y="60" width="220" height="140"></rect>
      <text className="sbt" x="430" y="105" textAnchor="middle">
        Problem
      </text>
      <text className="sbs" x="430" y="135" textAnchor="middle">
        pain / risk
      </text>
      <line className="sba" x1="540" y1="130" x2="600" y2="130"></line>
      <rect className="sb" x="600" y="60" width="220" height="140"></rect>
      <text className="sbt" x="710" y="105" textAnchor="middle">
        Guide
      </text>
      <text className="sbs" x="710" y="135" textAnchor="middle">
        Your business brings clarity
      </text>
      <line className="sba" x1="820" y1="130" x2="880" y2="130"></line>
      <rect className="sb" x="880" y="60" width="180" height="140"></rect>
      <text className="sbt" x="970" y="105" textAnchor="middle">
        Plan
      </text>
      <text className="sbs" x="970" y="135" textAnchor="middle">
        steps + CTA
      </text>
    </svg>
  );
}
