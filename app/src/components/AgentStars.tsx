import { Star } from 'lucide-react';
import { useAgentStar } from '../services/community';
export default function AgentStars({id}:{id:string}){const {count,starred}=useAgentStar(id);return <span className={'agent-stars '+(starred?'is-starred':'')} title="当前浏览器对这位 Agent 的 Star；尚未接入全站评价统计"><Star size={14} fill={starred?'currentColor':'none'}/>{count} Star<span className="star-scope"> · 本机</span></span>}
