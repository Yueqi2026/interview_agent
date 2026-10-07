export type Agent = {
  id: string;
  name: string;
  title: string;
  company: string;
  role: string;
  year: number;
  location: string;
  tags: string[];
  summary: string;
  score: number;
  sessions: number;
  avatar: string;
  updatedAt: string;
  gradient?: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: 'experience' | 'public' | 'analysis';
  citations?: { label: string; url?: string; date?: string }[];
};

export type ContributorDraft = {
  company: string;
  role: string;
  year: string;
  interviewType: string;
  location: string;
  result: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type HealthStatus = {
  ok: boolean;
  environment: string;
  upstream?: string;
  timestamp: string;
};

export type InterviewTurn = {
  sessionId: string;
  question: string;
  done: boolean;
  progress?: number;
};
