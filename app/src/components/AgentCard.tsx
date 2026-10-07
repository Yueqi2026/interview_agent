import { ArrowUpRight, MapPin, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Agent } from '../types';

export default function AgentCard({agent}:{agent:Agent}){
  return <Link className="agent-card" to={`/agents/${agent.id}`}>
    <div className={`avatar agent-avatar ${agent.gradient||'violet'}`}>{agent.avatar}</div>
    <div className="agent-main">
      <div className="agent-title-row"><div><h3>{agent.name}</h3><p>{agent.company} · {agent.role}</p></div><ArrowUpRight className="agent-arrow" size={19}/></div>
      <p className="agent-summary">{agent.summary}</p>
      <div className="tags">{agent.tags.slice(0,4).map(t=><span key={t}>{t}</span>)}</div>
      <div className="agent-meta"><span><MapPin size={14}/>{agent.location}</span><span><Star size={14}/>{agent.score}</span><span><MessageCircle size={14}/>{agent.sessions} 次对话</span></div>
    </div>
  </Link>
}
