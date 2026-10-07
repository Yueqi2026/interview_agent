import { FormEvent, useState } from 'react';
import { ArrowRight, Check, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../services/api';

export default function Login(){
  const [email,setEmail]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState(''); const nav=useNavigate();
  async function submit(e:FormEvent){e.preventDefault(); if(!email)return; setError('');setLoading(true); try{const r=await signIn(email); localStorage.setItem('demoUser',JSON.stringify(r.user)); nav('/discover');}catch(err){setError((err as Error).message)}finally{setLoading(false)}}
  return <section className="login-page">
    <div className="login-brand-panel">
      <Link className="brand login-brand" to="/"><span className="brand-mark"><Sparkles size={17}/></span><span>过来人 <b>AI</b></span></Link>
      <div className="login-brand-copy"><div className="pill dark"><Sparkles size={14}/> Experience-powered AI</div><h1>让真实经历，<br/>成为你的面试优势。</h1><p>连接那些真正走过这条路的人。经验由本人授权，AI 负责整理、检索与推理。</p><div className="login-points"><span><Check size={17}/> 经验来源清晰可追溯</span><span><Check size={17}/> 私人身份与 Agent Knowledge 隔离</span><span><Check size={17}/> 支持后续接入企业 API 与 RAG</span></div></div>
      <div className="login-orb orb-a"/><div className="login-orb orb-b"/><div className="login-mini-card card-one">“二面为什么一直追问指标？”</div><div className="login-mini-card card-two">来自 2024 真实经历</div>
    </div>
    <div className="login-form-panel">
      <div className="login-card fresh-card"><div className="mobile-brand"><span className="brand-mark"><Sparkles size={16}/></span> 过来人 AI</div><div className="login-kicker">欢迎回来</div><h2>登录或创建账号</h2><p className="muted">继续探索与你目标最接近的真实经验 Agent。</p>
        <form onSubmit={submit}><label className="field-label">邮箱</label><div className="input-icon"><Mail size={18}/><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div>{error&&<div className="form-error">{error}</div>}<button className="btn primary full big" disabled={loading}>{loading?<span className="loader"/>:<><span>使用邮箱继续</span><ArrowRight size={18}/></>}</button></form>
        <div className="or"><span/>或<span/></div><button className="btn secondary full big oauth-btn"><span className="oauth-dot">微</span> 使用微信继续</button>
        <p className="terms">继续即代表你同意服务条款与隐私说明。正式版建议使用 OAuth / Magic Link，不在前端保存明文密码。</p>
        <div className="privacy-note"><ShieldCheck size={16}/> 登录身份数据与 Agent Knowledge 分层隔离。</div>
        <Link className="text-link center" to="/">先返回首页体验</Link>
      </div>
      <div className="secure-chip"><LockKeyhole size={14}/> Secure session · API-ready</div>
    </div>
  </section>
}
