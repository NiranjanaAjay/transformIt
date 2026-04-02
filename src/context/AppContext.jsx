import React, { createContext, useState, useCallback, useReducer } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('landing'); // landing, signin, signup, dashboard, campaign, results
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  
  // Campaign state
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [sourceDocument, setSourceDocument] = useState('');
  const [factSheet, setFactSheet] = useState(null);
  const [outputs, setOutputs] = useState({
    blog: '',
    social: [],
    email: ''
  });
  
  // Agent states
  const [agentStates, setAgentStates] = useState({
    research: 'idle', // idle, thinking, working, completed
    copywriter: 'idle',
    editor: 'idle'
  });
  
  // Activity feed
  const [activityFeed, setActivityFeed] = useState([]);
  
  // Approval state
  const [approvalStatus, setApprovalStatus] = useState({
    blog: null,
    social: null,
    email: null
  });
  
  const addActivity = useCallback((agent, message, timestamp = new Date()) => {
    setActivityFeed(prev => [...prev, { agent, message, timestamp }]);
  }, []);
  
  const updateAgentState = useCallback((agent, state) => {
    setAgentStates(prev => ({
      ...prev,
      [agent]: state
    }));
  }, []);
  
  const updateOutputs = useCallback((type, content) => {
    setOutputs(prev => ({
      ...prev,
      [type]: content
    }));
  }, []);
  
  const resetCampaign = useCallback(() => {
    setCurrentCampaign(null);
    setSourceDocument('');
    setFactSheet(null);
    setOutputs({ blog: '', social: [], email: '' });
    setAgentStates({ research: 'idle', copywriter: 'idle', editor: 'idle' });
    setActivityFeed([]);
    setApprovalStatus({ blog: null, social: null, email: null });
  }, []);
  
  const value = {
    currentPage,
    setCurrentPage,
    user,
    setUser,
    campaigns,
    setCampaigns,
    currentCampaign,
    setCurrentCampaign,
    sourceDocument,
    setSourceDocument,
    factSheet,
    setFactSheet,
    outputs,
    updateOutputs,
    agentStates,
    updateAgentState,
    activityFeed,
    addActivity,
    approvalStatus,
    setApprovalStatus,
    resetCampaign
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
