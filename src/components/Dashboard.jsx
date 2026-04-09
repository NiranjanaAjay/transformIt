import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Navbar } from './Navbar';
import { CampaignStart } from './CampaignStart';
import { AgentRoom } from './AgentRoom';
import { FinalOutput } from './FinalOutput';
import { Button } from './UI';
import './Dashboard.css';

export function Dashboard() {
  const { currentCampaign, campaigns, user, selectCampaign } = useAppContext();

  // If a campaign is in progress, show agent room
  if (currentCampaign?.stage === 'processing') {
    return (
      <>
        <Navbar />
        <AgentRoom />
      </>
    );
  }

  // If campaign is complete, show outputs
  if (currentCampaign?.stage === 'complete') {
    return (
      <>
        <Navbar />
        <FinalOutput />
      </>
    );
  }

  return (
    <div className="dashboard dashboard-shell">
      <Navbar />
      <section className="dashboard-hero container">
        <div>
          <p className="dashboard-kicker">Welcome back{user?.name ? `, ${user.name}` : ''}</p>
          <h1>Build a campaign from one source brief.</h1>
          <p className="dashboard-copy">
            Start with a full brief or a single-line concept. The researcher expands it, then copywriter and editor complete the handoff loop.
          </p>
        </div>
        <Button variant="secondary" onClick={() => selectCampaign(null)}>
          Start fresh
        </Button>
      </section>

      <section className="dashboard-grid container">
        <div className="dashboard-main-card">
          <CampaignStart />
        </div>

        <aside className="dashboard-side-card">
          <h2>Recent campaigns</h2>
          {campaigns.length === 0 ? (
            <p className="empty-state">No campaigns yet. Create the first one from the panel on the left.</p>
          ) : (
            <div className="campaign-list">
              {campaigns.slice(0, 5).map((campaign) => (
                <button
                  key={campaign.id}
                  className="campaign-list-item"
                  onClick={() => selectCampaign(campaign)}
                >
                  <strong>{campaign.title}</strong>
                  <span>{campaign.stage} • {new Date(campaign.updated_at).toLocaleDateString()}</span>
                </button>
              ))}
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}

export default Dashboard;

