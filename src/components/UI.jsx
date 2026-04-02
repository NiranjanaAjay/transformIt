import React from 'react';

export function Button({ children, variant = 'primary', size = 'md', ...props }) {
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  
  return (
    <button className={`btn ${variantClass} ${sizeClass}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Input({ label, error, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, rows = 6, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <textarea rows={rows} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function Badge({ children, variant = 'primary', animated = false }) {
  const animClass = animated ? 'animate-pulse' : '';
  return (
    <span className={`badge badge-${variant} ${animClass}`}>
      {children}
    </span>
  );
}

export function LoadingDots() {
  return (
    <div className="loading-dots">
      <span className="animate-typing"></span>
      <span className="animate-typing"></span>
      <span className="animate-typing"></span>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </>
  );
}

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tabs">
      <div className="tabs-nav">
        {tabs.map(tab => (
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
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

export function Toast({ message, type = 'info', onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
}

export function Skeleton({ width = '100%', height = '20px', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, animation: 'shimmer 2s infinite' }}
    ></div>
  );
}

export function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="form-select">
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
