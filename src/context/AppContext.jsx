/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  auth,
  createCampaign,
  defaultAgentStatus,
  defaultApprovalStatus,
  defaultOutputs,
  deriveCampaignTitle,
  getSupabaseConfigurationError,
  isSupabaseConfigured,
  listCampaigns,
  updateCampaign,
} from '../services/supabase';

export const AppContext = createContext();

const INIT_TIMEOUT_MS = 10000;

function withTimeout(promise, timeoutMs, label) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out. Check your Supabase URL/key and network, then refresh.`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [session, setSession] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [appError, setAppError] = useState('');

  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [sourceDocument, setSourceDocument] = useState('');
  const [factSheet, setFactSheet] = useState(null);
  const [outputs, setOutputs] = useState({ ...defaultOutputs });

  const [agentStates, setAgentStates] = useState({
    ...defaultAgentStatus,
  });
  const [activityFeed, setActivityFeed] = useState([]);

  const [approvalStatus, setApprovalStatus] = useState({ ...defaultApprovalStatus });

  const user = useMemo(() => {
    const authUser = session?.user;

    if (!authUser) {
      return null;
    }

    return {
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Creator',
    };
  }, [session]);

  const resetWorkingState = useCallback(() => {
    setCurrentCampaign(null);
    setSourceDocument('');
    setFactSheet(null);
    setOutputs({ ...defaultOutputs });
    setAgentStates({ ...defaultAgentStatus });
    setActivityFeed([]);
    setApprovalStatus({ ...defaultApprovalStatus });
  }, []);

  const loadCampaigns = useCallback(async (userId) => {
    if (!userId) {
      setCampaigns([]);
      return [];
    }

    const records = await listCampaigns(userId);
    setCampaigns(records);
    return records;
  }, []);

  const hydrateCampaign = useCallback((campaign) => {
    if (!campaign) {
      resetWorkingState();
      return;
    }

    setCurrentCampaign(campaign);
    setSourceDocument(campaign.source_document || '');
    setFactSheet(campaign.fact_sheet || null);
    setOutputs(campaign.outputs || { ...defaultOutputs });
    setAgentStates(campaign.agent_status || { ...defaultAgentStatus });
    setActivityFeed(campaign.activity_feed || []);
    setApprovalStatus(campaign.review_status || { ...defaultApprovalStatus });
    setCurrentPage(campaign.stage === 'complete' ? 'results' : 'campaign');
  }, [resetWorkingState]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAppError(getSupabaseConfigurationError());
      setIsInitializing(false);
      return undefined;
    }

    let mounted = true;
    const initGuard = setTimeout(() => {
      if (!mounted) {
        return;
      }

      setAppError('App initialization is taking too long. Confirm Supabase is reachable and reload the page.');
      setIsInitializing(false);
    }, INIT_TIMEOUT_MS);

    const bootstrap = async () => {
      try {
        setAppError('');

        const { data, error } = await withTimeout(auth.getSession(), INIT_TIMEOUT_MS, 'Session initialization');
        if (error) {
          throw error;
        }

        if (!mounted) {
          return;
        }

        setSession(data?.session || null);
        if (data?.session?.user) {
          await withTimeout(loadCampaigns(data.session.user.id), INIT_TIMEOUT_MS, 'Campaign sync');
          setCurrentPage('dashboard');
        } else {
          setCurrentPage('landing');
        }
      } catch (error) {
        if (mounted) {
          setAppError(error?.message || 'Failed to load session.');
        }
      } finally {
        if (mounted) {
          clearTimeout(initGuard);
          setIsInitializing(false);
        }
      }
    };

    bootstrap();

    const { data: subscription } = auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) {
        return;
      }

      try {
        setAppError('');
        setSession(nextSession || null);

        if (nextSession?.user) {
          await withTimeout(loadCampaigns(nextSession.user.id), INIT_TIMEOUT_MS, 'Campaign sync');
          setCurrentPage('dashboard');
        } else {
          setCampaigns([]);
          resetWorkingState();
          setCurrentPage('landing');
        }
      } catch (error) {
        setAppError(error?.message || 'Failed to refresh your session.');
      } finally {
        setIsInitializing(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(initGuard);
      subscription?.subscription?.unsubscribe?.();
    };
  }, [loadCampaigns, resetWorkingState]);

  const addActivity = useCallback((agent, message, details = {}, timestamp = new Date()) => {
    const entry = {
      agent,
      message,
      timestamp: timestamp.toISOString(),
      ...details,
    };

    setActivityFeed((prev) => [...prev, entry]);
    return entry;
  }, []);

  const updateAgentState = useCallback((agent, state) => {
    setAgentStates((prev) => ({
      ...prev,
      [agent]: state,
    }));
  }, []);

  const updateOutputs = useCallback((type, content) => {
    setOutputs((prev) => ({
      ...prev,
      [type]: content,
    }));
  }, []);

  const resetCampaign = useCallback(() => {
    resetWorkingState();
    setCurrentPage('dashboard');
  }, [resetWorkingState]);

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await auth.signIn({ email, password });

    if (error) {
      throw error;
    }

    setSession(data?.session || null);
    if (data?.session?.user) {
      await loadCampaigns(data.session.user.id);
    }
    setCurrentPage('dashboard');
    return data;
  }, [loadCampaigns]);

  const signUp = useCallback(async ({ name, email, password }) => {
    const { data, error } = await auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw error;
    }

    setSession(data?.session || null);
    if (data?.session?.user) {
      await loadCampaigns(data.session.user.id);
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('signin');
    }

    return data;
  }, [loadCampaigns]);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setSession(null);
    setCampaigns([]);
    resetWorkingState();
    setCurrentPage('landing');
  }, [resetWorkingState]);

  const selectCampaign = useCallback((campaign) => {
    if (!campaign) {
      resetWorkingState();
      setCurrentPage('dashboard');
      return;
    }

    hydrateCampaign(campaign);
  }, [hydrateCampaign, resetWorkingState]);

  const startCampaign = useCallback(async (sourceText) => {
    if (!user) {
      throw new Error('Please sign in first.');
    }

    const campaign = await createCampaign({
      userId: user.id,
      title: deriveCampaignTitle(sourceText),
      sourceDocument: sourceText,
      stage: 'processing',
    });

    setCampaigns((prev) => [campaign, ...prev.filter((entry) => entry.id !== campaign.id)]);
    hydrateCampaign(campaign);
    setCurrentPage('campaign');
    return campaign;
  }, [hydrateCampaign, user]);

  const saveCurrentCampaign = useCallback(async (updates) => {
    if (!currentCampaign?.id) {
      return null;
    }

    const nextCampaign = await updateCampaign(currentCampaign.id, updates);
    setCurrentCampaign(nextCampaign);
    setCampaigns((prev) => prev.map((campaign) => (campaign.id === nextCampaign.id ? nextCampaign : campaign)));
    return nextCampaign;
  }, [currentCampaign]);
  
  const value = {
    currentPage,
    setCurrentPage,
    user,
    campaigns,
    setCampaigns,
    loadCampaigns,
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
    resetCampaign,
    signIn,
    signUp,
    signOut,
    startCampaign,
    saveCurrentCampaign,
    selectCampaign,
    isInitializing,
    appError,
    setAppError,
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
