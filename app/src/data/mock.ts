import type { Agent } from '../types';

export const agents: Agent[] = [
  {
    id: 'alice-byte', name: 'Alice AI', title: '商业化产品经理 · 真实经历 Agent', company: '字节跳动', role: '商业化产品经理', year: 2024,
    location: '上海', tags: ['社招', '商业化', '产品 Case', '二面复盘'],
    summary: '基于 Alice 授权的 2024 年字节商业化产品面试经历，覆盖一至三面、指标体系、广告漏斗和复盘建议。',
    score: 4.9, sessions: 238, avatar: 'A', updatedAt: '2026-09-18', gradient: 'violet',
    interviewHighlights: [
      { round: '一面', focus: '产品基本功', prompt: '指标体系如何搭建？' },
      { round: '二面', focus: '商业化 Case', prompt: '广告收入下降时先看什么？' },
      { round: '三面', focus: '复盘与协作', prompt: '如何推动销售和研发一起改方案？' }
    ]
  },
  {
    id: 'kevin-mck', name: 'Kevin AI', title: '咨询 Case Interview · 真实经历 Agent', company: 'McKinsey', role: 'Associate', year: 2023,
    location: 'London', tags: ['Experienced Hire', 'Case Interview', 'PEI'],
    summary: '覆盖 McKinsey / BCG 咨询面试准备、Case 拆解、PEI 追问以及常见失误。',
    score: 4.8, sessions: 171, avatar: 'K', updatedAt: '2026-08-30', gradient: 'blue',
    interviewHighlights: [
      { round: 'Case', focus: '结构化拆解', prompt: '如何估算一个新市场的规模？' },
      { round: 'PEI', focus: '个人经历', prompt: '讲一个你改变团队决策的例子。' }
    ]
  },
  {
    id: 'mia-tencent', name: 'Mia AI', title: '增长产品 · 校招经历 Agent', company: '腾讯', role: '产品经理', year: 2025,
    location: '深圳', tags: ['校招', '增长', '群面', '业务面'],
    summary: '基于 Mia 的腾讯增长产品校招经历，适合准备群面、增长指标和产品设计题的候选人。',
    score: 4.7, sessions: 96, avatar: 'M', updatedAt: '2026-09-02', gradient: 'cyan',
    interviewHighlights: [
      { round: '群面', focus: '协作表达', prompt: '意见不一致时如何推进讨论？' },
      { round: '业务面', focus: '增长分析', prompt: '新用户次日留存下降怎么定位？' }
    ]
  },
  {
    id: 'leo-google', name: 'Leo AI', title: 'Software Engineer · 系统设计 Agent', company: 'Google', role: 'Software Engineer', year: 2025,
    location: 'Zürich', tags: ['Coding', 'System Design', 'Behavioral'],
    summary: '覆盖 Coding、系统设计与行为面试，适合准备欧洲技术岗面试的候选人。',
    score: 4.9, sessions: 143, avatar: 'L', updatedAt: '2026-09-25', gradient: 'indigo',
    interviewHighlights: [
      { round: 'Coding', focus: '算法与代码质量', prompt: '如何设计一个可扩展的缓存？' },
      { round: 'System Design', focus: '系统设计', prompt: '设计一个实时通知系统。' }
    ]
  }
];

export const suggestedQuestions = [
  '你当时二面最难的问题是什么？',
  '如果现在重新准备，你会重点补哪些内容？',
  '面试官对商业化指标追问到什么深度？',
  '这段经验和现在的岗位要求有哪些差异？'
];
