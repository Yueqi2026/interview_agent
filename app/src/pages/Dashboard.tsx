import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, Check, ChevronDown, Eye, EyeOff, Footprints, Pencil, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import {readKnowledge,saveKnowledge} from '../services/knowledge';
import {readSpaceProfile,registerSpaceVisit,saveSpaceProfile} from '../services/community';
import {listConversations} from '../services/conversations';
import {MessageCircle, Clock3} from 'lucide-react';

export default function Dashboard(){
  const [rows,setRows]=useState(readKnowledge),[error,setError]=useState(''),[profile,setProfile]=useState(readSpaceProfile),[editing,setEditing]=useState(false);
  const [name,setName]=useState(profile.name),[bio,setBio]=useState(profile.bio);
  const [conversations]=useState(()=>{try{return listConversations()}catch{return []}});
  useEffect(()=>{try{setProfile(registerSpaceVisit())}catch{setError('本地存储不可用，本次修改可能无法保存。')}},[]);
  const visible=rows.filter(x=>x.visible).length;
  function editProfile(e:FormEvent){e.preventDefault();try{const next={...profile,name:name.trim(),bio:bio.trim()};saveSpaceProfile(next);setProfile(next);setEditing(false);setError('')}catch{setError('资料保存失败，请检查浏览器存储。')}}
  function toggle(id:string,value:boolean){const next=rows.map(x=>x.id===id?{...x,visible:value}:x);try{saveKnowledge(next);setRows(next);setError('')}catch{setError('隐私设置保存失败，请重试。')}}
  return <section className="page space-page wide-top">
    <div className="space-page-heading"><div className="eyebrow"><Sparkles size={13}/> MY LITTLE CORNER</div><span>我的空间</span></div>
    <header className="space-profile">
      <div className="space-profile-cover"><span>每一段经历，都有值得留下的部分。</span><div className="space-cover-orb"/><div className="space-cover-ring"/></div>
      <div className="space-profile-body">
        <div className="space-profile-top"><div className="space-avatar">{profile.name==='我的经验主页'?'我':Array.from(profile.name)[0]}<span><Check size={11}/></span></div><button className="btn secondary compact" onClick={()=>{setName(profile.name);setBio(profile.bio);setEditing(v=>!v)}}><Pencil size={14}/> 编辑资料</button></div>
        <div className="space-profile-info"><div><h1>{profile.name}</h1><p>{profile.bio}</p><div className="space-profile-meta"><span><CalendarDays size={13}/> 入驻于 {new Date(profile.joinedAt).toLocaleDateString('zh-CN')}</span><span><ShieldCheck size={13}/> 经验由你授权</span></div></div><Link to="/contribute" className="btn primary"><Plus size={16}/> 留下一段新经验</Link></div>
      </div>
      <div className="space-stats"><div><span><Footprints size={15}/> 空间访问</span><strong>{profile.visits}<small>次</small></strong><p>本浏览器会话访问次数</p></div><div><span><BookOpen size={15}/> 经验条目</span><strong>{rows.length}<small>条</small></strong><p>每一条都是一次积累</p></div><div><span><Eye size={15}/> 允许展示</span><strong>{visible}<small>条</small></strong><p>由你逐项确认的内容</p></div><div><span><ShieldCheck size={15}/> 私人珍藏</span><strong>{rows.length-visible}<small>条</small></strong><p>仅在自己的空间保存</p></div></div>
    </header>
    {editing&&<form className="space-edit" onSubmit={editProfile}><h2>编辑个人资料</h2><label>展示名称<input required maxLength={30} value={name} onChange={e=>setName(e.target.value)}/></label><label>一句话介绍<textarea maxLength={140} value={bio} onChange={e=>setBio(e.target.value)}/></label><button className="btn primary" disabled={!name.trim()}>保存资料</button><button type="button" className="btn ghost" onClick={()=>setEditing(false)}>取消</button></form>}
    {error&&<p className="form-error" role="alert">{error}</p>}
    <div className="space-section-heading"><div><div className="eyebrow">EXPERIENCE COLLECTION</div><h2>我的经验气泡 <span>{rows.length}</span></h2><p>把片段整理成知识，把分享的边界留给自己。</p></div><Link to="/contribute" className="text-link">添加经验 <ArrowRight size={15}/></Link></div>
    <div className="experience-bubbles">{rows.map((r,i)=><article className={'experience-bubble '+(r.visible?'is-public':'is-private')} key={r.id}>
      <div className="experience-bubble-top"><span className="experience-number">{String(i+1).padStart(2,'0')}</span><time><CalendarDays size={12}/>{new Date(r.createdAt).toLocaleDateString('zh-CN')}</time><span className="experience-kind">{r.id.startsWith('demo-')||r.title.includes('虚拟示例')?'虚拟示例':'我的经验'}</span></div>
      <details><summary><h3>{r.title.replace('【虚拟示例】','')}</h3><span className="experience-expand">查看经验 <ChevronDown size={16}/></span></summary><div className="experience-content">{r.content.split(/\n\s*\n/).map((paragraph,n)=><p key={n}>{paragraph}</p>)}</div></details>
      <footer className="experience-bubble-footer"><span><ShieldCheck size={13}/>{r.visible?'已允许展示及 Agent 使用':'仅自己可见'}</span><button type="button" role="switch" aria-checked={r.visible} aria-label={r.title+'的展示权限'} className="experience-privacy" onClick={()=>toggle(r.id,!r.visible)}>{r.visible?<Eye size={14}/>:<EyeOff size={14}/>}<span>{r.visible?'展示':'私密'}</span><i/></button></footer>
    </article>)}</div>
    {!rows.length&&<div className="space-empty"><BookOpen size={32}/><h3>第一段经验，从这里开始</h3><p>选择访谈或语音，把那些值得记住的细节留下来。</p><Link className="btn primary" to="/contribute">分享经验</Link></div>}
    <section className="explored-insiders" aria-label="我探索过的过来人">
      <div className="space-section-heading"><div><div className="eyebrow">PEOPLE I'VE MET</div><h2>我探索过的过来人 <span>{conversations.length}</span></h2><p>上次没聊完的，这次接着聊。按最近对话排序。</p></div><Link to="/discover" className="text-link">发现更多 <ArrowRight size={15}/></Link></div>
      {conversations.length?<div className="explored-grid">{conversations.map(conversation=>{
        const last=conversation.messages.filter(m=>m.id!=='hello').at(-1);
        return <Link className="explored-card" key={conversation.agentId} to={'/agents/'+encodeURIComponent(conversation.agentId)+'/chat'}>
          <div className="explored-card-top"><div className={'avatar agent-avatar '+(conversation.agent.gradient||'violet')}>{conversation.agent.avatar}</div><div className="explored-identity"><h3>{conversation.agent.name}</h3><p>{conversation.agent.company} · {conversation.agent.role}</p></div><ArrowRight size={17}/></div>
          <div className="explored-preview"><span>{last?.role==='user'?'我':'Agent'}：</span>{last?.content}</div>
          <div className="explored-card-bottom"><span><Clock3 size={12}/>{new Date(conversation.updatedAt).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span><span><MessageCircle size={12}/>{conversation.messages.filter(m=>m.id!=='hello').length} 条消息</span><b>继续对话</b></div>
        </Link>
      })}</div>:<div className="space-empty explored-empty"><MessageCircle size={30}/><h3>还没有开始的对话</h3><p>与一位过来人聊聊后，就能在这里找回对话、继续探索。</p><Link className="btn secondary" to="/discover">探索过来人 <ArrowRight size={15}/></Link></div>}
      <p className="explored-storage-note">对话历史保存在当前浏览器。接入此功能前未保存的旧对话无法找回。</p>
    </section>
    <p className="space-local-note"><ShieldCheck size={14}/> 资料、对话、访问和权限目前保存在本浏览器；入驻时间为首次使用本空间的日期。虚拟示例不代表真实经历。</p>
  </section>
}
