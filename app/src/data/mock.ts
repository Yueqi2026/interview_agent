import type { Agent } from '../types';

export const agents: Agent[] = [
  {
    id: 'alice-byte', name: 'Alice AI', title: '商业化产品经理 · 真实经历 Agent', company: '字节跳动', role: '商业化产品经理', year: 2024,
    location: '上海', tags: ['社招', '商业化', '产品 Case', '二面复盘'],
    summary: '基于 Alice 授权的 2024 年字节商业化产品面试经历，覆盖一至三面、指标体系、广告漏斗和复盘建议。',
    score: 4.9, sessions: 238, avatar: 'A', updatedAt: '2026-09-18', gradient: 'violet'
  },
  {
    id: 'kevin-mck', name: 'Kevin AI', title: '咨询 Case Interview · 真实经历 Agent', company: 'McKinsey', role: 'Associate', year: 2023,
    location: 'London', tags: ['Experienced Hire', 'Case Interview', 'PEI'],
    summary: '覆盖 McKinsey / BCG 咨询面试准备、Case 拆解、PEI 追问以及常见失误。',
    score: 4.8, sessions: 171, avatar: 'K', updatedAt: '2026-08-30', gradient: 'blue'
  },
  {
    id: 'mia-tencent', name: 'Mia AI', title: '增长产品 · 校招经历 Agent', company: '腾讯', role: '产品经理', year: 2025,
    location: '深圳', tags: ['校招', '增长', '群面', '业务面'],
    summary: '基于 Mia 的腾讯增长产品校招经历，适合准备群面、增长指标和产品设计题的候选人。',
    score: 4.7, sessions: 96, avatar: 'M', updatedAt: '2026-09-02', gradient: 'cyan'
  },
  {
    id: 'leo-google', name: 'Leo AI', title: 'Software Engineer · 系统设计 Agent', company: 'Google', role: 'Software Engineer', year: 2025,
    location: 'Zürich', tags: ['Coding', 'System Design', 'Behavioral'],
    summary: '覆盖 Coding、系统设计与行为面试，适合准备欧洲技术岗面试的候选人。',
    score: 4.9, sessions: 143, avatar: 'L', updatedAt: '2026-09-25', gradient: 'indigo'
  }
];

export const suggestedQuestions = [
  '你当时二面最难的问题是什么？',
  '如果现在重新准备，你会重点补哪些内容？',
  '面试官对商业化指标追问到什么深度？',
  '这段经验和现在的岗位要求有哪些差异？'
];
