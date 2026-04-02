import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Tabs, Button } from './UI';
import './FinalOutput.css';

export function FinalOutput() {
  const {
    outputs,
    sourceDocument,
    resetCampaign,
    setCurrentPage,
    setCurrentCampaign,
    factSheet
  } = useAppContext();

  const [activeView, setActiveView] = useState('blog');
  const [mobilePreview, setMobilePreview] = useState(false);

  const tabs = [
    {
      id: 'blog',
      label: '� Blog Post',
      content: <OutputCard title="Blog Post" content={outputs.blog} type="blog" />
    },
    {
      id: 'social',
      label: '👥 Social Thread',
      content: <OutputCard title="Social Media Thread" content={outputs.social} type="social" mobilePreview={mobilePreview} />
    },
    {
      id: 'email',
      label: '📧 Email Teaser',
      content: <OutputCard title="Email Teaser" content={outputs.email} type="email" />
    }
  ];

  const handleExport = () => {
    const content = {
      blog_post: outputs.blog,
      social_thread: outputs.social.join('\n\n---\n\n'),
      email_teaser: outputs.email,
      fact_sheet: JSON.stringify(factSheet, null, 2),
      generated_at: new Date().toISOString()
    };

    // Create blob
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json'
    });

    // Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyContent = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleNewCampaign = () => {
    resetCampaign();
    setCurrentCampaign(null);
    setCurrentPage('dashboard');
  };

  return (
    <div className="final-output">
      <div className="output-header">
        <h2>Your Campaign is Ready!</h2>
        <p>Review and export your multi-channel content</p>
      </div>

      <div className="output-container">
        {/* Tabs for different outputs */}
        <div className="output-tabs-section">
          <Tabs tabs={tabs} activeTab={activeView} onChange={setActiveView} />
        </div>

        {/* Side Content: Source Document */}
        <div className="output-side">
          <div className="source-box">
            <h3>📄 Source Document</h3>
            <div className="source-preview">
              <p style={{color: 'var(--color-dark-gray)', margin: 0}}>
                {sourceDocument && sourceDocument.length > 0 
                  ? sourceDocument 
                  : 'No source document uploaded'}
              </p>
            </div>
          </div>

          {/* Preview Options */}
          <div className="preview-options">
            <h3>📱 Preview Mode</h3>
            <div className="preview-toggles">
              <button
                className={`preview-button ${!mobilePreview ? 'active' : ''}`}
                onClick={() => setMobilePreview(false)}
              >
                💻 Desktop
              </button>
              <button
                className={`preview-button ${mobilePreview ? 'active' : ''}`}
                onClick={() => setMobilePreview(true)}
              >
                📱 Mobile
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="actions-box">
            <h3>Actions</h3>
            <Button
              variant="success"
              className="action-button"
              onClick={handleExport}
            >
              📥 Download Campaign Kit
            </Button>
            <Button
              variant="secondary"
              className="action-button"
              onClick={handleNewCampaign}
            >
              🆕 Create New Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison View */}
      <div className="comparison-section">
        <h3>Side-by-Side Comparison</h3>
        <div className="comparison-grid">
          <div className="comparison-item">
            <h4>Source</h4>
            <div className="comparison-content source">
              {sourceDocument && sourceDocument.length > 0 
                ? sourceDocument 
                : 'No source document'}
            </div>
          </div>
          <div className="comparison-item">
            <h4>Blog Output</h4>
            <div className="comparison-content output">
              {outputs.blog && outputs.blog.length > 0
                ? outputs.blog
                : 'No output generated yet'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutputCard({ title, content, type, mobilePreview }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = Array.isArray(content) ? content.join('\n\n') : content;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (type === 'social' && Array.isArray(content)) {
    return (
      <div className={`output-card ${mobilePreview ? 'mobile-view' : 'desktop-view'}`}>
        <div className="card-header">
          <h3>{title}</h3>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? '💖 Copied' : '🌺 Copy'}
          </Button>
        </div>
        <div className="social-thread">
          {content.map((post, idx) => (
            <div key={idx} className={`post ${mobilePreview ? 'mobile-post' : ''}`}>
              <div className="post-header">
                <div className="post-avatar">✨</div>
                <div className="post-meta">
                  <div className="post-author">Your Brand</div>
                  <div className="post-time">Just now</div>
                </div>
              </div>
              <div className="post-content">
                {post}
              </div>
              <div className="post-actions">
                <button>💕 Like</button>
                <button>💬 Reply</button>
                <button>🔄 Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="output-card">
      <div className="card-header">
        <h3>{title}</h3>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? '💖 Copied' : '🌺 Copy'}
        </Button>
      </div>
      <div className="card-content">
        {content && (typeof content === 'string') ? (
          <div className="text-content">
            {content.split('\n').map((line, idx) => (
              <div key={idx} className="line">
                {line}
              </div>
            ))}
          </div>
        ) : content && Array.isArray(content) ? (
          <div className="text-content">
            {content.map((item, idx) => (
              <div key={idx} className="line" style={{marginBottom: '16px', whiteSpace: 'pre-wrap'}}>
                {item}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-content" style={{color: '#999', fontStyle: 'italic'}}>
            Content is loading or not available yet...
          </div>
        )}
      </div>
    </div>
  );
}
