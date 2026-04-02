import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Navbar } from './Navbar';
import { CampaignStart } from './CampaignStart';
import { AgentRoom } from './AgentRoom';
import { FinalOutput } from './FinalOutput';
import { Button } from './UI';
import './Dashboard.css';

export function Dashboard() {
  const { currentCampaign, user, setCurrentPage } = useAppContext();

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

  // Default: show campaign start
  return (
    <div className="dashboard">
      <Navbar />
      <CampaignStart />
    </div>
  );
}

export default Dashboard;

