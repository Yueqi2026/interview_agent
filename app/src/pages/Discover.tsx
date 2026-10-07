import { useEffect, useState } from 'react';
import { BriefcaseBusiness, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import AgentCard from '../components/AgentCard';
import { searchAgents } from '../services/api';
import type { Agent } from '../types';

export default function Discover() {
  const [q, setQ] = useState(''); const [items, setItems] = useState<Agent[]>([]); const [loading,setLoading]=useState(true);
  useEffect(() => { let active=true; setLoading(true); const t=setTimeout(()=>searchAgents(q).then(x=>active&&setItems(x)).finally(()=>active&&setLoading(false)),180); return ()=>{active=false;clearTimeout(t)} }, [q]);
  return <section className="page section wide-top discover-page">
    <div className="discover-hero"><div className="eyebrow"><Sparkles size={13}/> DISCOVER</div><h1>找到与你目标最接近的过来人</h1><p className="muted">搜索公司、岗位、地点或面试类型。Agent 会把真实经历、当前信息和 AI 分析清晰分开。</p>
      <div className="searchbox elevated"><Search size={21}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="例如：字节 商业化 产品经理 社招"/><button className="filter-btn"><SlidersHorizontal size={17}/> 筛选</button></div>
      <div className="quick-filters"><button onClick={()=>setQ('产品经理')}>产品经理</button><button onClick={()=>setQ('Case Interview')}>咨询 Case</button><button onClick={()=>setQ('校招')}>校招</button><button onClick={()=>setQ('System Design')}>技术面</button></div>
    </div>
    <div className="result-meta"><span><BriefcaseBusiness size={16}/> {loading?'正在匹配…':`找到 ${items.length} 位相关过来人`}</span><span>按相关度排序</span></div>
    {loading?<div className="skeleton-list">{[1,2,3].map(i=><div className="skeleton-card" key={i}><div className="skeleton avatar-skel"/><div className="skel-lines"><div className="skeleton w40"/><div className="skeleton w70"/><div className="skeleton w90"/></div></div>)}</div>:<div className="agent-list">{items.map(a => <AgentCard key={a.id} agent={a}/>)}</div>}
  </section>;
}
