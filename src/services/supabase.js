import { createClient } from '@supabase/supabase-js';

export const defaultOutputs = {
  blog: '',
  social: [],
  email: '',
};

export const defaultApprovalStatus = {
  blog: 'pending',
  social: 'pending',
  email: 'pending',
};

export const defaultAgentStatus = {
  research: 'idle',
  copywriter: 'idle',
  editor: 'idle',
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }

  return supabase;
}

export function getSupabaseConfigurationError() {
  if (isSupabaseConfigured) {
    return '';
  }

  return 'Supabase keys are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env, then restart Vite.';
}

export function deriveCampaignTitle(sourceDocument = '') {
  const cleaned = String(sourceDocument)
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'Untitled campaign';
  }

  return cleaned.slice(0, 60).replace(/[.?!]+$/, '');
}

export function normalizeCampaignRecord(record) {
  if (!record) {
    return null;
  }

  return {
    ...record,
    fact_sheet: record.fact_sheet || null,
    outputs: record.outputs || { ...defaultOutputs },
    review_status: record.review_status || { ...defaultApprovalStatus },
    review_notes: Array.isArray(record.review_notes) ? record.review_notes : [],
    agent_status: record.agent_status || { ...defaultAgentStatus },
    activity_feed: Array.isArray(record.activity_feed) ? record.activity_feed : [],
    stage: record.stage || 'draft',
  };
}

export const auth = {
  getSession: () => requireSupabase().auth.getSession(),
  signUp: (payload) => requireSupabase().auth.signUp(payload),
  signIn: ({ email, password }) => requireSupabase().auth.signInWithPassword({ email, password }),
  signOut: () => requireSupabase().auth.signOut(),
  onAuthStateChange: (callback) => requireSupabase().auth.onAuthStateChange(callback),
};

export async function listCampaigns(userId) {
  const client = requireSupabase();

  const { data, error } = await client
    .from('campaigns')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(normalizeCampaignRecord);
}

export async function createCampaign({ userId, title, sourceDocument, stage = 'processing' }) {
  const client = requireSupabase();

  const payload = {
    user_id: userId,
    title: title || deriveCampaignTitle(sourceDocument),
    source_document: sourceDocument,
    stage,
    fact_sheet: null,
    outputs: { ...defaultOutputs },
    review_status: { ...defaultApprovalStatus },
    review_notes: [],
    agent_status: { ...defaultAgentStatus },
    activity_feed: [],
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client.from('campaigns').insert(payload).select('*').single();

  if (error) {
    throw error;
  }

  return normalizeCampaignRecord(data);
}

export async function updateCampaign(campaignId, updates) {
  const client = requireSupabase();

  const patch = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from('campaigns')
    .update(patch)
    .eq('id', campaignId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return normalizeCampaignRecord(data);
}

export async function deleteCampaign(campaignId) {
  const client = requireSupabase();
  const { error } = await client.from('campaigns').delete().eq('id', campaignId);

  if (error) {
    throw error;
  }

  return true;
}