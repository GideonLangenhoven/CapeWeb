import React, { Suspense } from 'react';
import Footer from '../components/Footer';
const CapeWebBlueprint = React.lazy(() => import('../components/CapeWebBlueprint'));

export default function Learn() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="learn-page expand-page" data-scroll-container>
      <section className="section-white" data-scroll-section data-bgcolor="#ffffff" data-textcolor="#0b0f1a">
        <div className="blueprint-heading reveal-text">
          <div className="expand-label">CapeWeb University</div>
          <h2 className="expand-title-section" style={{ marginBottom: '1rem' }}>
            Start with nothing. Build a real South African business—step by step.
          </h2>
          <p className="expand-text-lg" style={{ maxWidth: '720px' }}>
            This course is for a brand-new founder with an idea and no formal business education. CapeWeb is your guide.
            You'll learn one concept at a time, do practical missions, take mini-quizzes, and pass "boss battles".
            By the end, you won't just understand entrepreneurship — you'll be running a business that works.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="learn-capeweb-layout loading-state">
              <div className="learn-capeweb-article-pane">
                <div className="learn-capeweb-article">
                  <p>Loading CapeWeb University…</p>
                </div>
              </div>
            </div>
          }
        >
          <CapeWebBlueprint />
        </Suspense>
      </section>

      <section className="footer-section" data-scroll-section data-bgcolor="#0b0f1a" data-textcolor="#ffffff">
        <Footer />
      </section>
    </div>
  );
}
