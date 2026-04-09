import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Tabs, Button } from './UI';
import './FinalOutput.css';

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function toLabel(status) {
  if (status === 'approved') {
    return 'Approved';
  }

  if (status === 'review') {
    return 'Needs review';
  }

  return 'Pending';
}

export function FinalOutput() {
  const {
    outputs,
    sourceDocument,
    resetCampaign,
    setCurrentPage,
    factSheet,
    currentCampaign,
    approvalStatus,
  } = useAppContext();

  const [activeView, setActiveView] = useState('blog');
  const [copiedAll, setCopiedAll] = useState(false);

  const blogWords = countWords(outputs.blog);
  const socialPosts = Array.isArray(outputs.social) ? outputs.social.length : 0;
  const emailWords = countWords(outputs.email);
  const campaignUpdatedAt = currentCampaign?.updated_at
    ? new Date(currentCampaign.updated_at).toLocaleString()
    : 'Not available';

  const tabs = [
    {
      id: 'blog',
      label: 'Blog',
      content: <OutputCard title="Blog Post" content={outputs.blog} type="blog" />,
    },
    {
      id: 'social',
      label: 'Social',
      content: <OutputCard title="Social Media Thread" content={outputs.social} type="social" />,
    },
    {
      id: 'email',
      label: 'Email',
      content: <OutputCard title="Email Teaser" content={outputs.email} type="email" />,
    },
  ];

  const handleExport = () => {
    const content = {
      campaign_id: currentCampaign?.id,
      title: currentCampaign?.title,
      source_document: sourceDocument,
      blog_post: outputs.blog,
      social_thread: outputs.social.join('\n\n---\n\n'),
      email_teaser: outputs.email,
      fact_sheet: JSON.stringify(factSheet, null, 2),
      review_status: approvalStatus,
      review_notes: currentCampaign?.review_notes || [],
      generated_at: new Date().toISOString(),
    };

    // Create blob
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
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

  const handleCopyAllOutputs = async () => {
    const allContent = [
      '# Blog',
      outputs.blog || 'No blog output yet.',
      '',
      '# Social Thread',
      Array.isArray(outputs.social) && outputs.social.length > 0
        ? outputs.social.map((post, index) => `${index + 1}. ${post}`).join('\n\n')
        : 'No social output yet.',
      '',
      '# Email',
      outputs.email || 'No email output yet.',
    ].join('\n');

    await navigator.clipboard.writeText(allContent);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleNewCampaign = () => {
    resetCampaign();
    setCurrentPage('dashboard');
  };

  return (
    <div className="final-output">
      <div className="output-header">
        <p className="output-kicker">Campaign complete</p>
        <h2>Your campaign is ready</h2>
        <p>Review generated copy, check approval status, and export your bundle.</p>
      </div>

      <div className="output-metrics">
        <div className="metric-card">
          <span className="metric-label">Blog length</span>
          <strong>{blogWords} words</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Social posts</span>
          <strong>{socialPosts} posts</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Email length</span>
          <strong>{emailWords} words</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Last updated</span>
          <strong>{campaignUpdatedAt}</strong>
        </div>
      </div>

      <div className="output-container">
        <div className="output-tabs-section">
          <Tabs tabs={tabs} activeTab={activeView} onChange={setActiveView} />
        </div>

        <div className="output-side">
          <div className="source-box">
            <h3>Source document</h3>
            <div className="source-preview">
              <p>
                {sourceDocument && sourceDocument.length > 0 
                  ? sourceDocument 
                  : 'No source document uploaded'}
              </p>
            </div>
          </div>

          <div className="actions-box">
            <h3>Actions</h3>
            <Button
              variant="success"
              className="action-button"
              onClick={handleExport}
            >
              Download campaign bundle
            </Button>
            <Button
              variant="primary"
              className="action-button"
              onClick={handleCopyAllOutputs}
            >
              {copiedAll ? 'Copied all outputs' : 'Copy all outputs'}
            </Button>
            <Button
              variant="secondary"
              className="action-button"
              onClick={handleNewCampaign}
            >
              Create new campaign
            </Button>
          </div>

          {factSheet && (
            <div className="source-box">
              <h3>Research summary</h3>
              <div className="source-preview">
                <p>
                  {factSheet.summary}
                </p>
              </div>
              {factSheet.valueProposition && (
                <div className="source-preview compact-preview">
                  <p>{factSheet.valueProposition}</p>
                </div>
              )}
            </div>
          )}

          <div className="source-box">
            <h3>Approval status</h3>
            <div className="status-list status-grid">
              <div className="status-row">
                <span>Blog</span>
                <span className={`status-pill ${approvalStatus.blog || 'pending'}`}>{toLabel(approvalStatus.blog)}</span>
              </div>
              <div className="status-row">
                <span>Social</span>
                <span className={`status-pill ${approvalStatus.social || 'pending'}`}>{toLabel(approvalStatus.social)}</span>
              </div>
              <div className="status-row">
                <span>Email</span>
                <span className={`status-pill ${approvalStatus.email || 'pending'}`}>{toLabel(approvalStatus.email)}</span>
              </div>
            </div>
          </div>

          {Array.isArray(currentCampaign?.review_notes) && currentCampaign.review_notes.length > 0 && (
            <div className="source-box">
              <h3>Review notes</h3>
              <div className="status-list">
                {currentCampaign.review_notes.map((note, index) => (
                  <p key={index}>{note.content}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OutputCard({ title, content, type }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = Array.isArray(content) ? content.join('\n\n') : content;
    await navigator.clipboard.writeText(text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (type === 'social' && Array.isArray(content)) {
    return (
      <div className="output-card">
        <div className="card-header">
          <h3>{title}</h3>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <div className="social-thread">
          {content.map((post, idx) => (
            <div key={idx} className="post">
              <div className="post-header">
                <div className="post-avatar">{idx + 1}</div>
                <div className="post-meta">
                  <div className="post-author">Thread post</div>
                  <div className="post-time">Ready to publish</div>
                </div>
              </div>
              <div className="post-content">
                {post}
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
          {copied ? 'Copied' : 'Copy'}
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
          <div className="text-content empty-copy">
            Content is loading or not available yet...
          </div>
        )}
      </div>
    </div>
  );
}
