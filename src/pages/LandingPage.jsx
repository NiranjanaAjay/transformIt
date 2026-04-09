import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/UI';
import './LandingPage.css';

export function LandingPage() {
  const { setCurrentPage } = useAppContext();
  
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-kicker">Bloomboard content studio</p>
          <h1 className="hero-title">Transform one brief into a delightful, polished campaign.</h1>
          <p className="hero-subtitle">
            Paste a source document, let the agents shape it, and store every campaign in Supabase.
          </p>
          <div className="hero-ctas">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => setCurrentPage('signup')}
            >
              Create account
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => setCurrentPage('signin')}
            >
              Sign in
            </Button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hero-card-top">Research, copy, and review in one blooming flow.</div>
          <div className="hero-card hero-card-mid">A live chat between agents, not a black box.</div>
          <div className="hero-card hero-card-bottom">Supabase-backed history you can revisit anytime.</div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">Source</div>
              <h3>Paste your brief</h3>
              <p>Drop in a clean source document and keep the input honest and simple.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-icon">Agents</div>
              <h3>Let the agents shape it</h3>
              <p>Research, copy, and review happen in sequence with cleaner feedback.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-icon">Save</div>
              <h3>Store the result</h3>
              <p>Keep every campaign in Supabase and reopen it later from the dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why it feels better</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">Clear</div>
              <h3>Cleaner inputs</h3>
              <p>The upload flow is honest about what it supports and avoids fake extraction.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">Floral</div>
              <h3>Expressive visuals</h3>
              <p>Floral doodles, layered gradients, and playful cards keep the interface fun and readable.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">DB</div>
              <h3>Persisted campaigns</h3>
              <p>Campaigns save to Supabase when configured and stay available in the dashboard.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">Fast</div>
              <h3>Less noise</h3>
              <p>Unnecessary comparison views and duplicated review loops were removed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-footer">
        <h2>Ready to build a calmer campaign flow?</h2>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => setCurrentPage('signup')}
        >
          Get started
        </Button>
      </section>
    </div>
  );
}
