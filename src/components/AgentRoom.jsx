import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ResearchAgent, CopywriterAgent, EditorAgent } from '../agents/agents';
import { LoadingDots, Button } from './UI';
import './AgentRoom.css';

export function AgentRoom() {
  const {
    currentCampaign,
    sourceDocument,
    setFactSheet,
    updateOutputs,
    agentStates,
    updateAgentState,
    activityFeed,
    addActivity,
    setCurrentPage,
    setApprovalStatus,
    saveCurrentCampaign,
  } = useAppContext();

  const [processComplete, setProcessComplete] = useState(false);
  const [reviewNotes, setReviewNotes] = useState([]);
  const startedCampaignIdRef = useRef('');
  const dialogueFeedRef = useRef(null);
  const isCampaignComplete = currentCampaign?.stage === 'complete' || processComplete;
  const dialogueFeed = activityFeed.filter((entry) => entry.kind === 'dialogue');
  const statusFeed = activityFeed.filter((entry) => entry.kind !== 'dialogue');
  const visibleReviewNotes = reviewNotes.length > 0
    ? reviewNotes
    : (currentCampaign?.review_notes || []);

  const summarizeFeedback = (feedback = []) => {
    const summary = feedback
      .map((note) => note?.content)
      .filter(Boolean)
      .join(' | ');

    return summary.length > 220 ? `${summary.slice(0, 220)}...` : summary;
  };

  useEffect(() => {
    if (!dialogueFeedRef.current) {
      return;
    }

    dialogueFeedRef.current.scrollTo({
      top: dialogueFeedRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [dialogueFeed.length]);

  useEffect(() => {
    if (currentCampaign?.stage === 'complete') {
      return;
    }

    if (!currentCampaign?.id || !sourceDocument.trim()) {
      return;
    }

    if (startedCampaignIdRef.current === currentCampaign.id) {
      return;
    }

    startedCampaignIdRef.current = currentCampaign.id;

    const runAgents = async () => {
      let nextActivity = [...activityFeed];
      let nextAgentStatus = { ...agentStates };

      const logStatus = (agent, message) => {
        const entry = addActivity(agent, message, { kind: 'status' });
        nextActivity = [...nextActivity, entry];
      };

      const sendDialogue = (from, to, message) => {
        const entry = addActivity(from, message, { kind: 'dialogue', to });
        nextActivity = [...nextActivity, entry];
      };

      const markAgent = (agent, state) => {
        updateAgentState(agent, state);
        nextAgentStatus = {
          ...nextAgentStatus,
          [agent]: state,
        };
      };

      try {
        logStatus('Research agent', 'Reading and structuring the source brief.');
        markAgent('research', 'working');
        setProcessComplete(false);

        let workingFactSheet = await ResearchAgent.process(sourceDocument);
        setFactSheet(workingFactSheet);

        sendDialogue(
          'Research agent',
          'Copywriter agent',
          `Fact sheet is ready. Core angle: ${workingFactSheet.valueProposition || workingFactSheet.summary}`,
        );
        logStatus('Research agent', 'Fact sheet ready with summary, audience, and key messages.');
        markAgent('research', 'completed');
        await saveCurrentCampaign({
          source_document: sourceDocument,
          fact_sheet: workingFactSheet,
          agent_status: nextAgentStatus,
          activity_feed: nextActivity,
          stage: 'processing',
        });

        sendDialogue(
          'Copywriter agent',
          'Research agent',
          workingFactSheet.briefingDepth === 'lean'
            ? 'Brief is short. Please enrich audience, message angles, and risk notes before drafting.'
            : 'Please confirm drafting guardrails and final message priorities before I write channel variants.',
        );
        logStatus('Research agent', 'Preparing drafting guidance for copywriter handoff.');
        markAgent('research', 'working');

        if (workingFactSheet.briefingDepth === 'lean') {
          workingFactSheet = await ResearchAgent.expandFactSheet(workingFactSheet, sourceDocument);

          sendDialogue(
            'Research agent',
            'Copywriter agent',
            'Sparse-brief enrichment complete. Added inferred audience, message angles, and safe assumptions.',
          );
        }

        workingFactSheet = await ResearchAgent.prepareDraftGuidance(workingFactSheet);
        setFactSheet(workingFactSheet);

        sendDialogue(
          'Research agent',
          'Copywriter agent',
          'Guardrails finalized. Keep claims source-backed and maintain one narrative across all channels.',
        );
        logStatus('Research agent', 'Research handoff package delivered to copywriter.');
        markAgent('research', 'completed');
        await saveCurrentCampaign({
          source_document: sourceDocument,
          fact_sheet: workingFactSheet,
          agent_status: nextAgentStatus,
          activity_feed: nextActivity,
          stage: 'processing',
        });

        logStatus('Copywriter agent', 'Creating blog post, social thread, and email teaser.');
        markAgent('copywriter', 'working');

        let finalDrafts = await CopywriterAgent.process(workingFactSheet);
        updateOutputs('blog', finalDrafts.blog);
        updateOutputs('social', finalDrafts.social);
        updateOutputs('email', finalDrafts.email);

        sendDialogue(
          'Copywriter agent',
          'Editor agent',
          'Draft pack is ready. Please check factual accuracy, tone, and publish readiness.',
        );
        logStatus('Copywriter agent', 'Draft set is ready for editorial review.');
        markAgent('copywriter', 'completed');
        await saveCurrentCampaign({
          source_document: sourceDocument,
          fact_sheet: workingFactSheet,
          outputs: finalDrafts,
          agent_status: nextAgentStatus,
          activity_feed: nextActivity,
          stage: 'processing',
        });

        logStatus('Editor agent', 'Checking factual consistency and clarity.');
        markAgent('editor', 'working');

        let editorFeedback = await EditorAgent.process(
          { blog: finalDrafts.blog, social: finalDrafts.social, email: finalDrafts.email },
          workingFactSheet,
        );

        if ((editorFeedback.feedback || []).length > 0) {
          sendDialogue(
            'Editor agent',
            'Research agent',
            `Validate these notes before revision: ${summarizeFeedback(editorFeedback.feedback)}`,
          );
          logStatus('Research agent', 'Reviewing editor notes and tightening research guidance.');
          markAgent('research', 'working');

          workingFactSheet = await ResearchAgent.resolveFeedback(workingFactSheet, editorFeedback.feedback || []);
          setFactSheet(workingFactSheet);

          sendDialogue(
            'Research agent',
            'Copywriter agent',
            'Updated guidance is ready. Keep claims source-backed and apply the tighter wording in revisions.',
          );
          logStatus('Research agent', 'Feedback resolution delivered to copywriter.');
          markAgent('research', 'completed');

          await saveCurrentCampaign({
            source_document: sourceDocument,
            fact_sheet: workingFactSheet,
            outputs: finalDrafts,
            agent_status: nextAgentStatus,
            activity_feed: nextActivity,
            stage: 'processing',
          });
        }

        if (!editorFeedback.approved) {
          sendDialogue(
            'Editor agent',
            'Copywriter agent',
            `Please revise these points before approval: ${summarizeFeedback(editorFeedback.feedback)}`,
          );
          logStatus('Editor agent', 'Requested one revision pass from copywriter.');

          markAgent('copywriter', 'working');
          finalDrafts = await CopywriterAgent.revise(finalDrafts, workingFactSheet, editorFeedback.feedback || []);
          updateOutputs('blog', finalDrafts.blog);
          updateOutputs('social', finalDrafts.social);
          updateOutputs('email', finalDrafts.email);

          sendDialogue(
            'Copywriter agent',
            'Editor agent',
            'Revision submitted. Claims were tightened and wording was cleaned up.',
          );
          logStatus('Copywriter agent', 'Revision submitted to editor.');
          markAgent('copywriter', 'completed');

          await saveCurrentCampaign({
            source_document: sourceDocument,
            fact_sheet: workingFactSheet,
            outputs: finalDrafts,
            agent_status: nextAgentStatus,
            activity_feed: nextActivity,
            stage: 'processing',
          });

          markAgent('editor', 'working');
          editorFeedback = await EditorAgent.process(
            { blog: finalDrafts.blog, social: finalDrafts.social, email: finalDrafts.email },
            workingFactSheet,
          );
        }

        markAgent('editor', 'completed');
        const reviewStatus = editorFeedback.reviewStatus;

        setApprovalStatus(reviewStatus);
        setReviewNotes(editorFeedback.feedback || []);

        sendDialogue(
          'Editor agent',
          'Team',
          editorFeedback.approved
            ? 'Looks good. Approving this campaign and handing off final outputs.'
            : 'I left final notes. Please manually adjust the flagged claims before publishing.',
        );
        logStatus(
          'Editor agent',
          editorFeedback.approved
            ? 'Campaign approved and saved.'
            : 'Campaign saved with review notes. Please revise flagged claims.',
        );

        await saveCurrentCampaign({
          source_document: sourceDocument,
          fact_sheet: workingFactSheet,
          outputs: finalDrafts,
          review_status: reviewStatus,
          review_notes: editorFeedback.feedback || [],
          agent_status: nextAgentStatus,
          activity_feed: nextActivity,
          stage: 'complete',
        });

        setProcessComplete(true);
      } catch (error) {
        logStatus('System', 'Agent run failed. Please retry the campaign.');
        console.error(error);
      }
    };

    runAgents();
  }, [
    currentCampaign,
    sourceDocument,
    addActivity,
    agentStates,
    activityFeed,
    saveCurrentCampaign,
    setApprovalStatus,
    setFactSheet,
    updateAgentState,
    updateOutputs,
  ]);

  const handleCompleteAndView = () => {
    setCurrentPage('results');
  };

  return (
    <div className="agent-room">
      <div className="agent-room-header">
        <h2>Live team room</h2>
        <p>Watch each handoff in real time, including researcher expansion passes for short briefs and editor-led revision loops.</p>
      </div>

      <div className="agent-room-container">
        <div className="agents-section">
          <div className="agents-grid">
            <AgentCard
              icon="R"
              name="Research"
              state={agentStates.research}
            />
            <AgentCard
              icon="C"
              name="Copywriter"
              state={agentStates.copywriter}
            />
            <AgentCard
              icon="E"
              name="Editor"
              state={agentStates.editor}
            />
          </div>
        </div>

        <div className="dialogue-section">
          <h3>Agent conversation</h3>
          <div className="dialogue-feed" ref={dialogueFeedRef}>
            {dialogueFeed.length === 0 ? (
              <div className="activity-empty">Messages will appear as agents hand work to each other.</div>
            ) : (
              dialogueFeed.map((message, idx) => (
                <DialogueBubble key={idx} message={message} />
              ))
            )}
          </div>
        </div>

        <div className="activity-section">
          <h3>Process timeline</h3>
          <div className="activity-feed">
            {statusFeed.length === 0 ? (
              <div className="activity-empty">Starting agents...</div>
            ) : (
              statusFeed.map((activity, idx) => (
                <ActivityItem key={idx} activity={activity} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rejection Note */}
      {visibleReviewNotes.length > 0 && (
        <div className="rejection-note">
          <div className="rejection-icon">!</div>
          <div className="rejection-content">
            <h4>Editor feedback</h4>
            {visibleReviewNotes.map((note, index) => (
              <p key={index} className="rejection-details">{note.content}</p>
            ))}
          </div>
        </div>
      )}

      {/* Completion Actions */}
      {isCampaignComplete && (
        <div className="agent-room-footer">
          <Button
            variant="success"
            onClick={handleCompleteAndView}
            className="complete-button"
          >
              View results
          </Button>
            <p className="footer-note">Your campaign is ready to open.</p>
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
        {state === 'working' && (
          <div className="state-badge working">
            Working <LoadingDots />
          </div>
        )}
        {state === 'completed' && <div className="state-badge completed">Done</div>}
      </div>
    </div>
  );
}

function ActivityItem({ activity }) {
  const timestamp = new Date(activity.timestamp);

  return (
    <div className="activity-item">
      <div className="activity-timestamp">
        {timestamp.toLocaleTimeString()}
      </div>
      <div className="activity-agent">{activity.agent}</div>
      <div className="activity-message">{activity.message}</div>
    </div>
  );
}

function DialogueBubble({ message }) {
  const timestamp = new Date(message.timestamp);
  const speaker = String(message.agent || '').toLowerCase();
  const toneClass = speaker.includes('editor')
    ? 'editor'
    : speaker.includes('copywriter')
      ? 'copywriter'
      : speaker.includes('research')
        ? 'research'
        : 'system';

  return (
    <div className={`dialogue-bubble dialogue-tone-${toneClass}`}>
      <div className="dialogue-meta">
        <span className="dialogue-from">{message.agent}</span>
        <span className="dialogue-to">to {message.to || 'Team'}</span>
        <span className="dialogue-time">{timestamp.toLocaleTimeString()}</span>
      </div>
      <p>{message.message}</p>
    </div>
  );
}
