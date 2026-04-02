import React, { useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Textarea, Button } from './UI';
import './CampaignStart.css';

export function CampaignStart() {
  const {
    setCurrentCampaign,
    setSourceDocument,
    sourceDocument,
    setCurrentPage,
    currentCampaign,
    updateAgentState,
    addActivity
  } = useAppContext();
  
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate file reading
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setSourceDocument(content);
        setUploadedFile(file.name);
        setError('');
      }
    };

    if (file.type === 'application/pdf') {
      // For demo, just set a placeholder
      setSourceDocument(`PDF Document: ${file.name}\n\nThis is a simulated PDF content extraction. In production, you would use a PDF parser like pdf-parse or pdfjs-dist.`);
      setUploadedFile(file.name);
    } else if (file.type.startsWith('image/')) {
      setSourceDocument(`Image: ${file.name}\n\nThis is a simulated image content extraction. In production, you would use OCR like Tesseract.`);
      setUploadedFile(file.name);
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      setError('Please upload a PDF, image, or text file');
    }
  };

  const handleGenerateCampaign = async () => {
    if (!sourceDocument.trim()) {
      setError('Please enter or upload content');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create campaign
      const campaign = {
        id: Date.now(),
        stage: 'processing',
        createdAt: new Date(),
        sourceDocument
      };

      setCurrentCampaign(campaign);
      setCurrentPage('campaign');

      // Start agent states
      updateAgentState('research', 'thinking');
      addActivity('System', 'Campaign created. Research agent starting...');

    } catch (err) {
      setError('Failed to start campaign. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="campaign-start">
      <div className="campaign-container">
        <h2 className="campaign-title">Create Your Campaign</h2>
        <p className="campaign-subtitle">
          Paste your document or upload a file to get started
        </p>

        <div className="campaign-input-area">
          {/* Textarea Input */}
          <div className="input-section">
            <h3>Your Content</h3>
            <Textarea
              placeholder="Paste your document, press Ctrl+V after uploading a file..."
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
                📄 Uploaded: {uploadedFile}
              </div>
            )}
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
              <div className="upload-icon">📤</div>
              <h4>Drag & Drop</h4>
              <p>or click to select</p>
              <p className="upload-formats">PDF, JPG, PNG, TXT</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            💫 {error}
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
            {isProcessing ? 'Generating...' : '✨ Generate Campaign'}
          </Button>
          <p className="action-hint">
            Your content will be processed by our AI agents to create blog, social, and email content.
          </p>
        </div>
      </div>
    </div>
  );
}
