import { agents } from '../data/mock';
import type { Agent, AuthUser, ChatMessage, ContributorDraft, HealthStatus, InterviewTurn } from '../types';

const mode = import.meta.env.VITE_API_MODE || 'mock';
const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const timeoutMs = Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000);

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit, retries = 1): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': '0.4.0',
        ...(init?.headers || {})
      }
    });
    if (!res.ok) {
      let detail: any = null;
      try { detail = await res.json(); } catch { /* noop */ }
      if (res.status >= 500 && retries > 0) {
        await new Promise(r => setTimeout(r, 300));
        return request<T>(path, init, retries - 1);
      }
      throw new ApiError(detail?.message || `API request failed (${res.status})`, res.status, detail?.code);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw new ApiError('请求超时，请稍后重试', 408, 'TIMEOUT');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function health(): Promise<HealthStatus> {
  if (mode === 'mock') return { ok: true, environment: 'mock', timestamp: new Date().toISOString() };
  return request<HealthStatus>('/health', undefined, 0);
}

export async function signIn(email: string): Promise<{ user: AuthUser; token?: string }> {
  if (mode === 'mock') {
    await new Promise(r => setTimeout(r, 650));
    return { user: { id: 'demo-user', name: email.split('@')[0] || 'Demo User', email } };
  }
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) }, 0);
}

export async function searchAgents(query = ''): Promise<Agent[]> {
  await new Promise(r => setTimeout(r, 180));
  const q = query.toLowerCase().trim();
  if (!q) return agents;
  return agents.filter(a => [a.name, a.company, a.role, a.location, ...a.tags].join(' ').toLowerCase().includes(q));
}

export async function getAgent(id: string): Promise<Agent | undefined> {
  await new Promise(r => setTimeout(r, 160));
  return agents.find(a => a.id === id);
}

export async function sendMessage(agentId: string, content: string, history: ChatMessage[] = []): Promise<ChatMessage> {
  if (mode === 'mock') {
    const source = /现在|目前|最新|当下/.test(content) ? 'public' : /建议|准备|应该/.test(content) ? 'analysis' : 'experience';
    const agent = agents.find(a => a.id === agentId) || agents[0];
    const body = source === 'experience'
      ? `根据 ${agent.name.replace(' AI','')} 授权的 ${agent.year} 年经历，这类问题当时会持续追问到“为什么选择这个指标、指标之间如何权衡、如果数据异常如何定位”。建议不要只背框架，而是准备一个完整业务例子。`
      : source === 'public'
      ? `这部分属于当前公开信息层。正式版会通过项目组 API 接入招聘页、JD 与可信公开来源，并显示日期和来源，不会把新信息伪装成过来人亲历。`
      : `这是 AI 分析层：结合该过来人的经验，你可以把准备拆成“岗位理解 → 业务指标 → 典型 Case → 追问复盘”四层，并针对自己的背景提前准备可量化案例。`;
    await new Promise(r => setTimeout(r, 700));
    return { id: crypto.randomUUID(), role: 'assistant', content: body, source };
  }
  return request<ChatMessage>(`/agents/${agentId}/chat`, { method: 'POST', body: JSON.stringify({ content, messages: history.map(({ role, content: text }) => ({ role, content: text })) }) });
}

export async function createContributorDraft(draft: ContributorDraft) {
  return { id: 'draft-' + Date.now(), ...draft };
}

export async function interviewTurn(sessionId: string, answer: string, history: { role: 'user' | 'assistant'; content: string }[] = []): Promise<InterviewTurn> {
  if (mode === 'mock') {
    const turns = [
      '这次面试一共有几轮？你先从整体流程讲起。',
      '哪一轮让你印象最深？面试官具体问了什么？',
      '你当时是怎么回答的？有没有被连续追问？',
      '现在回头看，你觉得哪个回答最值得改进？',
      '如果给下一位候选人三条建议，你会说什么？'
    ];
    const n = Number(sessionId.split('-').pop() || 0) + 1;
    await new Promise(r => setTimeout(r, 520));
    return { sessionId: `session-${n}`, question: turns[Math.min(n, turns.length - 1)], done: n >= turns.length - 1, progress: Math.min(100, (n + 1) * 20) };
  }
  return request(`/interview-sessions/${sessionId}/turn`, { method: 'POST', body: JSON.stringify({ sessionId, answer, messages: history }) });
}

export async function extractInterview(sessionId: string) {
  if (mode === 'mock') return { status: 'ready', sessionId, chunks: 6 };
  return request(`/interview-sessions/${sessionId}/extract`, { method: 'POST' });
}
