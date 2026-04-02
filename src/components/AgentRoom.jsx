import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ResearchAgent, CopywriterAgent, EditorAgent } from '../agents/agents';
import { LoadingDots, Button } from './UI';
import './AgentRoom.css';

export function AgentRoom() {
  const {
    sourceDocument,
    factSheet,
    setFactSheet,
    outputs,
    updateOutputs,
    agentStates,
    updateAgentState,
    activityFeed,
    addActivity,
    setCurrentCampaign,
    setCurrentPage,
    approvalStatus,
    setApprovalStatus
  } = useAppContext();

  const [processComplete, setProcessComplete] = useState(false);
  const [rejectionNote, setRejectionNote] = useState(null);

  useEffect(() => {
    const runAgents = async () => {
      try {
        // Stage 1: Research Agent
        addActivity('Research Agent', 'Starting fact extraction...');
        updateAgentState('research', 'working');

        const facts = await ResearchAgent.process(sourceDocument);
        setFactSheet(facts);

        addActivity('Research Agent', `💖 Found ${facts.features.length} key features`);
        updateAgentState('research', 'completed');

        // Simulate delay
        await new Promise(r => setTimeout(r, 1000));

        // Stage 2: Copywriter Agent
        addActivity('Copywriter Agent', 'Generating content across all channels...');
        updateAgentState('copywriter', 'working');

        const drafts = await CopywriterAgent.process(facts, 'professional');
        updateOutputs('blog', drafts.blog);
        updateOutputs('social', drafts.social);
        updateOutputs('email', drafts.email);

        addActivity('Copywriter Agent', '💖 Generated blog, social & email');
        updateAgentState('copywriter', 'completed');

        // Simulate delay
        await new Promise(r => setTimeout(r, 1000));

        // Stage 3: Editor Agent
        addActivity('Editor Agent', 'Performing quality checks...');
        updateAgentState('editor', 'working');

        const editorFeedback = await EditorAgent.process(
          { blog: drafts.blog, social: drafts.social, email: drafts.email },
          facts
        );

        updateAgentState('editor', 'completed');

        if (editorFeedback.approved) {
          addActivity('Editor Agent', '💖 All content approved!');
          setApprovalStatus({
            blog: 'approved',
            social: 'approved',
            email: 'approved'
          });
          setProcessComplete(true);
        } else {
          // Handle rejections
          const rejections = editorFeedback.corrections.filter(
            c => c.severity === 'high'
          );
          if (rejections.length > 0) {
            addActivity('Editor Agent', '💫 Content requires revision');
            setRejectionNote(rejections[0]);
            // Auto-regenerate after feedback
            setTimeout(() => {
              handleRegenerate(rejections[0]);
            }, 2000);
          } else {
            setProcessComplete(true);
          }
        }
      } catch (error) {
        addActivity('System', '🚫 Error during processing');
        console.error(error);
      }
    };

    if (sourceDocument && !factSheet) {
      runAgents();
    }
  }, [sourceDocument, factSheet]);

  const handleRegenerate = async (feedback) => {
    addActivity('Copywriter Agent', `Regenerating based on: ${feedback.message}`);
    updateAgentState('copywriter', 'working');

    const drafts = {
      blog: outputs.blog,
      social: outputs.social,
      email: outputs.email
    };

    const newDrafts = await CopywriterAgent.process(factSheet, 'professional');
    updateOutputs('blog', newDrafts.blog);
    updateOutputs('social', newDrafts.social);
    updateOutputs('email', newDrafts.email);

    addActivity('Copywriter Agent', '💖 New version generated');
    updateAgentState('copywriter', 'completed');

    await new Promise(r => setTimeout(r, 1000));

    const editorFeedback = await EditorAgent.process(newDrafts, factSheet);
    if (editorFeedback.approved) {
      setApprovalStatus({
        blog: 'approved',
        social: 'approved',
        email: 'approved'
      });
      setProcessComplete(true);
      setRejectionNote(null);
    }
  };

  const handleCompleteAndView = () => {
    setCurrentCampaign(prev => ({
      ...prev,
      stage: 'complete'
    }));
    setCurrentPage('results');
  };

  return (
    <div className="agent-room">
      <div className="agent-room-header">
        <h2>Agent Collaboration in Progress</h2>
        <p>Watch your AI team transform your content into a complete marketing campaign</p>
      </div>

      <div className="agent-room-container">
        {/* Agent Cards */}
        <div className="agents-section">
          <div className="agents-grid">
            <AgentCard
              icon="🎀"
              name="Research"
              state={agentStates.research}
            />
            <AgentCard
              icon="🌸"
              name="Copywriter"
              state={agentStates.copywriter}
            />
            <AgentCard
              icon="🦋"
              name="Editor"
              state={agentStates.editor}
            />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="activity-section">
          <h3>Activity Feed</h3>
          <div className="activity-feed">
            {activityFeed.length === 0 ? (
              <div className="activity-empty">Starting agents...</div>
            ) : (
              activityFeed.map((activity, idx) => (
                <ActivityItem key={idx} activity={activity} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rejection Note */}
      {rejectionNote && (
        <div className="rejection-note">
          <div className="rejection-icon">�</div>
          <div className="rejection-content">
            <h4>Editor Feedback</h4>
            <p>{rejectionNote.message}</p>
            <p className="rejection-details">{rejectionNote.details}</p>
          </div>
        </div>
      )}

      {/* Completion Actions */}
      {processComplete && (
        <div className="agent-room-footer">
          <Button
            variant="success"
            onClick={handleCompleteAndView}
            className="complete-button"
          >
            💖 View Results
          </Button>
          <p className="footer-note">Your campaign is ready for review!</p>
        </div>
      )}
    </div>
  );
}

function AgentCard({ icon, name, state }) {
  return (
    <div className={`agent-card agent-state-${state}`}>
      <div className="agent-icon">{icon}</div>
      <h3>{name}</h3>
      <div className="agent-state-display">
        {state === 'idle' && <div className="state-badge idle">Ready</div>}
        {state === 'thinking' && (
          <div className="state-badge thinking">
            Thinking <LoadingDots />
          </div>
        )}
        {state === 'working' && (
          <div className="state-badge working">
            Working <LoadingDots />
          </div>
        )}
        {state === 'completed' && <div className="state-badge completed">💖 Done</div>}
      </div>
    </div>
  );
}

function ActivityItem({ activity }) {
  return (
    <div className="activity-item">
      <div className="activity-timestamp">
        {activity.timestamp.toLocaleTimeString()}
      </div>
      <div className="activity-agent">{activity.agent}</div>
      <div className="activity-message">{activity.message}</div>
    </div>
  );
}
