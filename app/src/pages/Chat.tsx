import { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Send, ShieldCheck, Star, X, Check } from 'lucide-react';
import { useAgentStar } from '../services/community';
import { getAgent, sendMessage } from '../services/api';
import { appendConversationMessage, readConversation } from '../services/conversations';
import { suggestedQuestions } from '../data/mock';
import type { Agent, ChatMessage } from '../types';

export default function Chat() {
  const [reviewing,setReviewing]=useState(false);
  const { id = '' } = useParams(); const [agent, setAgent] = useState<Agent>(); const [input, setInput] = useState(''); const [sending, setSending] = useState(false); const [error, setError] = useState(''); const endRef=useRef<HTMLDivElement>(null);
  const [storageWarning,setStorageWarning]=useState('');
  const greeting:ChatMessage={id:'hello',role:'assistant',content:'你好，我是基于过来人授权经验构建的 AI Agent。你可以问我具体面试流程、问题、追问和复盘建议。',source:'experience'};
  const [messages,setMessages]=useState<ChatMessage[]>(()=>{try{return readConversation(id)?.messages||[greeting]}catch{return [greeting]}});
  useEffect(()=>{try{readConversation(id)}catch{setStorageWarning('无法读取本地历史。请检查浏览器存储权限，本次对话可能无法保存。')}},[id]);
  const {starred,setStar}=useAgentStar(id);
  const canReview=!!agent&&messages.some(m=>m.role==='assistant'&&m.id!=='hello');
  useEffect(()=>{ let active=true; getAgent(id).then(value=>{if(active){setAgent(value);if(!value)setError("这位 Agent 暂不可用，请返回探索页。")}}).catch(()=>{if(active)setError('Agent 信息加载失败，请返回探索页重试。')}); return ()=>{active=false}; },[id]);
  async function submit(e?:FormEvent,preset?:string){
    e?.preventDefault();const text=String(preset??input).trim();if(!text||sending||!agent)return;
    const currentAgent=agent;
    setError('');setReviewing(false);
    const userMessage:ChatMessage={id:crypto.randomUUID(),role:'user',content:text};
    const history=messages.filter(m=>m&&typeof m.content==='string');
    let pending=[...history,userMessage];
    try{pending=appendConversationMessage(currentAgent,userMessage,history).messages;setStorageWarning('')}catch{setStorageWarning('本地保存失败，请勿关闭页面。检查浏览器存储空间后继续。')}
    setMessages(pending);setInput('');setSending(true);
    try{
      const reply=await sendMessage(id,text,pending.filter(m=>m.id!==userMessage.id));
      if(reply&&typeof reply.content==='string'){
        let completed=[...pending,reply];
        try{completed=appendConversationMessage(currentAgent,reply,pending).messages;setStorageWarning('')}catch{setStorageWarning('回复未能保存，请保留本页并检查浏览器存储空间。')}
        setMessages(completed);
      }else setError('AI 返回内容为空，请稍后重试。');
    }catch(err){setError(err instanceof Error?err.message:'连接暂时不可用，请稍后重试。')}finally{setSending(false)}
  }
  return <section className="chat-page">
    <aside className="chat-side"><div className={`avatar large ${agent?.gradient||'violet'}`}>{agent?.avatar || 'AI'}</div><h2>{agent?.name || 'Agent'}</h2><p>{agent?.company} · {agent?.role}</p><div className="verified-line"><ShieldCheck size={14}/> 授权经验 Agent</div><div className="divider"/><h4>推荐问题</h4>{suggestedQuestions.map(q=><button type="button" key={q} className="question-chip" disabled={sending||!agent} onClick={()=>submit(undefined,q)}>{q}</button>)}</aside>
    <div className="chat-main"><div className="chat-header"><div><div className="eyebrow">EXPERIENCE AGENT</div><strong>{agent?.name || '正在加载'}</strong></div><div className="chat-header-actions"><button className="chat-end-button" disabled={sending||!canReview} onClick={()=>setReviewing(true)}><Star size={14}/> 结束并评价</button><span className="status-dot"><i/> 在线</span></div></div><div className="messages">{storageWarning&&<div className="history-save-warning" role="status">{storageWarning}</div>}{messages.map(m=><div key={m.id} className={`message ${m.role}`}><div className="message-body">{m.role==='assistant'&&m.source&&<span className={`source-badge ${m.source}`}>{m.source==='experience'?'真实经历':m.source==='public'?'当前公开信息':'AI 分析'}</span>}<p>{m.content}</p></div></div>)}{sending&&<div className="message assistant"><div className="message-body typing"><span className="typing-dots"><i/><i/><i/></span> 正在结合授权经验生成回答…</div></div>}{error&&<div className="chat-error" role="alert">{error} <button type="button" onClick={()=>setError('')}>知道了</button></div>}<div ref={endRef}/></div>{reviewing&&<section className="conversation-review" aria-label="对话评价"><button className="review-close" aria-label="关闭评价" onClick={()=>setReviewing(false)}><X size={16}/></button><div className="review-icon"><Star size={21}/></div><div className="review-copy"><h3>这次对话，对你有帮助吗？</h3><p>点亮一颗 Star，把认可留给 {agent?.name}。</p><small>同一浏览器每位 Agent 最多一颗，可取消；目前仅本机保存。</small></div><button className={'review-star-button '+(starred?'active':'')} aria-pressed={starred} onClick={()=>{try{setStar(!starred);setError('')}catch{setError('评价保存失败，请重试。')}}}><Star size={18} fill={starred?'currentColor':'none'}/>{starred?'已点亮 Star':'点亮 Star'}{starred&&<Check size={14}/>}</button><button className="review-continue" onClick={()=>setReviewing(false)}>继续聊聊</button></section>}<form className="composer" onSubmit={submit}><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit();}}} placeholder="问一个具体问题，例如：二面最容易被追问什么？"/><button className="send-btn" disabled={sending||!agent||!input.trim()}><Send size={18}/></button></form><div className="chat-disclaimer">AI 可能出错。重要职业决策请结合更多来源判断。</div></div>
  </section>;
}
