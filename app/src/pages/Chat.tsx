import { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Send, ShieldCheck, Sparkles } from 'lucide-react';
import { getAgent, sendMessage } from '../services/api';
import { suggestedQuestions } from '../data/mock';
import type { Agent, ChatMessage } from '../types';

export default function Chat() {
  const { id = '' } = useParams(); const [agent, setAgent] = useState<Agent>(); const [input, setInput] = useState(''); const [sending, setSending] = useState(false); const [error, setError] = useState(''); const endRef=useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([{id:'hello', role:'assistant', content:'你好，我是基于过来人授权经验构建的 AI Agent。你可以问我具体面试流程、问题、追问和复盘建议。', source:'experience'}]);
  useEffect(()=>{ getAgent(id).then(setAgent); },[id]); useEffect(()=>endRef.current?.scrollIntoView({behavior:'smooth'}),[messages,sending]);
  async function submit(e?: FormEvent, preset?: string){ e?.preventDefault(); const text=(preset ?? input).trim(); if(!text||sending)return; setError(''); const userMessage:ChatMessage={id:crypto.randomUUID(),role:'user',content:text}; setMessages(m=>[...m,userMessage]); setInput(''); setSending(true); try{const reply=await sendMessage(id,text,messages); setMessages(m=>[...m,reply]);}catch(err){setError(err instanceof Error?err.message:'连接暂时不可用，请稍后重试。')}finally{setSending(false);} }
  return <section className="chat-page">
    <aside className="chat-side"><div className={`avatar large ${agent?.gradient||'violet'}`}>{agent?.avatar || 'AI'}</div><h2>{agent?.name || 'Agent'}</h2><p>{agent?.company} · {agent?.role}</p><div className="verified-line"><ShieldCheck size={14}/> 授权经验 Agent</div><div className="divider"/><h4>推荐问题</h4>{suggestedQuestions.map(q=><button type="button" key={q} className="question-chip" disabled={sending} onClick={()=>submit(undefined,q)}>{q}</button>)}</aside>
    <div className="chat-main"><div className="chat-header"><div><div className="eyebrow">EXPERIENCE AGENT</div><strong>{agent?.name || '正在加载'}</strong></div><span className="status-dot"><i/> 在线</span></div><div className="messages">{messages.map(m=><div key={m.id} className={`message ${m.role}`}><div className="message-body">{m.role==='assistant'&&m.source&&<span className={`source-badge ${m.source}`}>{m.source==='experience'?'真实经历':m.source==='public'?'当前公开信息':'AI 分析'}</span>}<p>{m.content}</p></div></div>)}{sending&&<div className="message assistant"><div className="message-body typing"><span className="typing-dots"><i/><i/><i/></span> 正在结合授权经验生成回答…</div></div>}{error&&<div className="chat-error" role="alert">{error} <button type="button" onClick={()=>setError('')}>知道了</button></div>}<div ref={endRef}/></div><form className="composer" onSubmit={submit}><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit();}}} placeholder="问一个具体问题，例如：二面最容易被追问什么？"/><button className="send-btn" disabled={sending||!input.trim()}><Send size={18}/></button></form><div className="chat-disclaimer">AI 可能出错。重要职业决策请结合更多来源判断。</div></div>
  </section>;
}
