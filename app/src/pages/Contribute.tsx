import { FormEvent, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Calendar, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createContributorDraft } from '../services/api';

export default function Contribute() {
  const nav=useNavigate(); const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({company:'',role:'',year:'2025',interviewType:'社招',location:'',result:''});
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
  async function submit(e:FormEvent){e.preventDefault(); setSaving(true); try{await createContributorDraft(form); localStorage.setItem('contributorDraft',JSON.stringify(form)); nav('/interview');}finally{setSaving(false)}}
  return <section className="page section narrow wide-top">
    <div className="form-hero"><div className="eyebrow"><Sparkles size={13}/> BECOME AN INSIDER</div><h1>把一次真实经历，变成可以帮助别人的 Agent</h1><p className="lead small">先填写最基本的面试背景。下一步 AI 会像采访一样与你对话，把经历整理成结构化知识，再由你逐条确认。</p></div>
    <div className="progress modern"><span className="active">1 背景</span><span>2 AI 访谈</span><span>3 知识确认</span><span>4 授权</span></div>
    <form className="form-card fresh-card" onSubmit={submit}><div className="form-grid"><label><span><BriefcaseBusiness size={15}/>公司</span><input required value={form.company} onChange={e=>set('company',e.target.value)} placeholder="例如：字节跳动"/></label><label><span><BriefcaseBusiness size={15}/>岗位</span><input required value={form.role} onChange={e=>set('role',e.target.value)} placeholder="例如：商业化产品经理"/></label><label><span><Calendar size={15}/>年份</span><select value={form.year} onChange={e=>set('year',e.target.value)}><option>2026</option><option>2025</option><option>2024</option><option>2023</option></select></label><label><span>面试类型</span><select value={form.interviewType} onChange={e=>set('interviewType',e.target.value)}><option>社招</option><option>校招</option><option>实习</option></select></label><label><span><MapPin size={15}/>地点</span><input value={form.location} onChange={e=>set('location',e.target.value)} placeholder="例如：上海"/></label><label><span>结果</span><select value={form.result} onChange={e=>set('result',e.target.value)}><option value="">可稍后填写</option><option>Offer</option><option>未通过</option><option>主动终止</option></select></label></div><div className="consent-preview"><ShieldCheck size={18}/><span>你可以控制哪些内容允许 Agent 使用。私人身份信息不会进入 Agent 知识库。</span></div><button className="btn primary big" type="submit" disabled={saving}>{saving?<span className="loader"/>:<>开始 AI 访谈 <ArrowRight size={18}/></>}</button></form>
  </section>;
}
