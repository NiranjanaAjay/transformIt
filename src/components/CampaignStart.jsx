import React, { useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Textarea, Button } from './UI';
import './CampaignStart.css';

const QUICK_BRIEF_IDEAS = [
  'Launch our AI assistant for marketing ops teams.',
  'Promote our eco-friendly bottle line for summer.',
  'Drive webinar signups for RevOps leaders.',
  'Announce our new analytics dashboard for SaaS founders.',
];

export function CampaignStart() {
  const {
    setSourceDocument,
    sourceDocument,
    startCampaign,
    appError,
    setAppError,
  } = useAppContext();
  
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      setError('Only TXT and MD files are supported. Paste the source brief for other formats.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setSourceDocument(content);
        setUploadedFile(file.name);
        setError('');
      }
    };

    reader.readAsText(file);
  };

  const handleGenerateCampaign = async () => {
    if (!sourceDocument.trim()) {
      setError('Please paste a source brief before starting.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setAppError('');

    try {
      await startCampaign(sourceDocument);
    } catch (err) {
      setError(err?.message || 'Failed to start campaign. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="campaign-start">
      <div className="campaign-container">
        <h2 className="campaign-title">Create your campaign</h2>
        <p className="campaign-subtitle">
          Paste a full brief, or drop a single-line idea and let the researcher expand it before drafting.
        </p>

        <div className="quick-briefs" aria-label="Quick brief starters">
          {QUICK_BRIEF_IDEAS.map((idea) => (
            <button
              key={idea}
              className="quick-brief-chip"
              onClick={() => {
                setSourceDocument(idea);
                setUploadedFile(null);
                setError('');
              }}
              type="button"
            >
              {idea}
            </button>
          ))}
        </div>

        <div className="campaign-input-area">
          {/* Textarea Input */}
          <div className="input-section">
            <h3>Your content</h3>
            <Textarea
              placeholder="Paste your source brief here"
              value={sourceDocument}
              onChange={(e) => {
                setSourceDocument(e.target.value);
                setError('');
              }}
              rows={10}
              className="campaign-textarea"
            />
            {uploadedFile && (
              <div className="uploaded-file-badge">
                Uploaded: {uploadedFile}
              </div>
            )}
            <p className="input-meta">
              {sourceDocument.trim().length === 0
                ? 'Tip: one clear sentence is enough to start.'
                : `${sourceDocument.trim().split(/\s+/).filter(Boolean).length} words ready for research handoff.`}
            </p>
          </div>

          {/* Upload Section */}
          <div className="upload-section">
            <div
              className="upload-box"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  handleFileUpload({ target: { files } });
                }
              }}
            >
              <div className="upload-icon">Text file</div>
              <h4>Drop your brief file</h4>
              <p>or click to select a file</p>
              <p className="upload-formats">TXT, MD</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {appError && (
          <div className="error-message">
            {appError}
          </div>
        )}

        <div className="campaign-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerateCampaign}
            disabled={isProcessing || !sourceDocument.trim()}
            className="generate-button"
          >
            {isProcessing ? 'Starting...' : 'Generate campaign'}
          </Button>
          <p className="action-hint">
            The run includes research, copywriting, and editorial validation.
          </p>
        </div>
      </div>
    </div>
  );
}
