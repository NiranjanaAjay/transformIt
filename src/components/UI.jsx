import React from 'react';

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, className].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input className={className} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, rows = 6, className = '', ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <textarea rows={rows} className={className} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function LoadingDots() {
  return (
    <span className="loading-dots" aria-label="Loading">
      <span />
      <span />
      <span />
    </span>
  );
}

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tabs">
      <div className="tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
