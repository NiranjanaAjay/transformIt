import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/UI';
import './LandingPage.css';

export function LandingPage() {
  const { setCurrentPage } = useAppContext();
  
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title animate-wiggle">
            <span>TransformIt</span>
          </h1>
          <p className="hero-subtitle">
            Turn one document into a full multi-channel marketing campaign — instantly.
          </p>
          <div className="hero-ctas">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => setCurrentPage('signup')}
            >
              ✨ Sign Up
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => setCurrentPage('signin')}
            >
              Sign In
            </Button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="gradient-blob blob-1 animate-float"></div>
          <div className="gradient-blob blob-2 animate-float" style={{'--delay': '1s'}}></div>
          <div className="gradient-blob blob-3 animate-float" style={{'--delay': '2s'}}></div>
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">🌟</div>
          <div className="sparkle sparkle-3">💫</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">📤</div>
              <h3>Upload Source</h3>
              <p>Paste your document, PDF, or image and let the system understand your content.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-icon">🤖</div>
              <h3>AI Agents Collaborate</h3>
              <p>Three specialized agents work together to research, create, and review your content.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-icon">🎁</div>
              <h3>Get Campaign Kit</h3>
              <p>Download your complete, ready-to-go marketing campaign with all three formats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose TransformIt?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Save Hours</h3>
              <p>Go from zero to a complete campaign in minutes, not days.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎨</div>
              <h3>Consistent Branding</h3>
              <p>All outputs follow one fact-sheet, ensuring unified messaging.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔄</div>
              <h3>Intelligent Feedback</h3>
              <p>Our editors review and refine until perfection is achieved.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📱</div>
              <h3>Multi-Channel Ready</h3>
              <p>Blog, social media, and email—all optimized for their platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="cta-footer">
        <h2>Ready to transform your content workflow?</h2>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => setCurrentPage('signup')}
        >
          Get Started Now ✨
        </Button>
      </section>
    </div>
  );
}
