import { supabase } from './supabase';

export type ExperienceAgent = {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'paused' | 'archived';
  createdAt: string;
};

export type ExperienceItem = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  agentUsageAllowed: boolean;
  visibility: 'private' | 'published';
};

type ConfirmedItem = Pick<ExperienceItem, 'title' | 'content'> & { agentUsageAllowed: boolean };

function client() {
  if (!supabase) throw new Error('资料服务尚未配置，请联系网站管理员。');
  return supabase;
}

function makeSlug() {
  return `agent-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function currentUserId() {
  const { data, error } = await client().auth.getUser();
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('登录状态已失效，请重新登录后再保存。');
  return data.user.id;
}

function toAgent(row: any): ExperienceAgent {
  return { id: row.id, name: row.name, description: row.description, status: row.status, createdAt: row.created_at };
}

function toItem(row: any): ExperienceItem {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    agentUsageAllowed: row.agent_usage_allowed,
    visibility: row.visibility
  };
}

export async function listMyAgents(): Promise<ExperienceAgent[]> {
  const { data, error } = await client()
    .from('agents')
    .select('id,name,description,status,created_at')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toAgent);
}

export async function createExperienceAgent(name: string, description = ''): Promise<ExperienceAgent> {
  const ownerUserId = await currentUserId();
  const { data, error } = await client()
    .from('agents')
    .insert({ owner_user_id: ownerUserId, name: name.trim(), description: description.trim(), slug: makeSlug() })
    .select('id,name,description,status,created_at')
    .single();
  if (error) throw new Error(error.message);
  return toAgent(data);
}

export async function listExperienceItems(agentId: string): Promise<ExperienceItem[]> {
  const { data, error } = await client()
    .from('knowledge_items')
    .select('id,title,content,visibility,agent_usage_allowed,created_at,updated_at')
    .eq('agent_id', agentId)
    .is('hidden_at', null)
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toItem);
}

// This is intentionally the first server-side write of an experience item.
// Call it only after the contributor has reviewed every generated item and
// chosen its privacy/Agent-use setting.
export async function saveConfirmedExperienceItems(agentId: string, items: ConfirmedItem[]): Promise<ExperienceItem[]> {
  const payload = items.map(item => ({
    agent_id: agentId,
    title: item.title.trim(),
    content: item.content.trim(),
    agent_usage_allowed: item.agentUsageAllowed,
    visibility: item.agentUsageAllowed ? 'published' : 'private'
  }));
  const { data, error } = await client()
    .from('knowledge_items')
    .insert(payload)
    .select('id,title,content,visibility,agent_usage_allowed,created_at,updated_at');
  if (error) throw new Error(error.message);
  return (data ?? []).map(toItem);
}

export async function updateExperienceItemPermission(item: ExperienceItem, agentUsageAllowed: boolean): Promise<ExperienceItem> {
  const { data, error } = await client()
    .from('knowledge_items')
    .update({
      agent_usage_allowed: agentUsageAllowed,
      visibility: agentUsageAllowed ? 'published' : 'private',
      hidden_at: null
    })
    .eq('id', item.id)
    .select('id,title,content,visibility,agent_usage_allowed,created_at,updated_at')
    .single();
  if (error) throw new Error(error.message);
  return toItem(data);
}
