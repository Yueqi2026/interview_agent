import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, CheckCircle2, MapPin, MessageCircle, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { getAgent } from '../services/api';
import type { Agent } from '../types';

export default function AgentDetail() {
  const { id = '' } = useParams(); const [agent, setAgent] = useState<Agent>();
  useEffect(() => { getAgent(id).then(setAgent); }, [id]);
  if (!agent) return <section className="page section"><div className="loading-page"><span className="loader dark"/> 正在加载 Agent…</div></section>;
  return <section className="page section wide-top">
    <div className="profile-grid">
      <div>
        <div className="profile-head"><div className={`avatar large ${agent.gradient||'violet'}`}>{agent.avatar}</div><div><div className="eyebrow"><CheckCircle2 size={13}/> VERIFIED EXPERIENCE AGENT</div><h1>{agent.name}</h1><p>{agent.title}</p></div></div>
        <div className="profile-meta"><span><CalendarDays size={16}/>{agent.year} 年经历</span><span><MapPin size={16}/>{agent.location}</span><span><Star size={16}/>{agent.score}</span></div>
        <div className="info-card accent-card"><div className="card-icon"><Sparkles size={19}/></div><h3>这个 Agent 能回答什么</h3><p>{agent.summary}</p><div className="tags">{agent.tags.map(t=><span key={t}>{t}</span>)}</div></div>
        {agent.interviewHighlights?.length && <div className="info-card"><h3>面试经历地图</h3><div className="source-list">{agent.interviewHighlights.map(item=><div className="source-row" key={item.round}><b>{item.round}</b><span>{item.focus} · {item.prompt}</span></div>)}</div></div>}
        <div className="info-card"><h3>回答来源说明</h3><div className="source-row"><b><i className="source-dot exp"/>真实经历</b><span>仅使用贡献者明确授权给 Agent 的内容。</span></div><div className="source-row"><b><i className="source-dot pub"/>当前公开信息</b><span>正式版接入 JD、招聘页与可信公开来源，并显示日期。</span></div><div className="source-row"><b><i className="source-dot ana"/>AI 分析</b><span>模型基于前两类信息进行推理，不伪装成贡献者原话。</span></div></div>
      </div>
      <aside className="sticky-card premium-card"><div className={`avatar xl ${agent.gradient||'violet'}`}>{agent.avatar}</div><div className="available"><span/>可对话</div><h2>{agent.name}</h2><p className="muted">最近更新 {agent.updatedAt}</p><div className="stat-row"><div><strong>{agent.sessions}</strong><span>历史对话</span></div><div><strong>{agent.score}</strong><span>体验评分</span></div></div><Link className="btn primary full big" to={`/agents/${agent.id}/chat`}><MessageCircle size={18}/> 开始对话</Link><div className="privacy-note"><ShieldCheck size={16}/> AI 只能访问贡献者授权的经验知识，不读取私人身份资料。</div></aside>
    </div>
  </section>;
}
