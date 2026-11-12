import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic, PenLine, ShieldCheck } from 'lucide-react';
import { createExperienceAgent } from '../services/experienceStore';

export default function Contribute() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function createAgent(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    setError('');
    try {
      const agent = await createExperienceAgent(name, description);
      navigate(`/voice?agent=${encodeURIComponent(agent.id)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建 Agent 失败，请稍后重试。');
    } finally {
      setSaving(false);
    }
  }

  return <section className="page section narrow wide-top">
    <div className="eyebrow">CREATE YOUR EXPERIENCE AGENT</div>
    <h1>先创建这段经验对应的 Agent</h1>
    <p className="lead">一位 Agent 对应一组独立的经验。之后写入的每个条目都会只属于它，不会与其他 Agent 混在一起。</p>
    <form className="panel fresh-card" onSubmit={createAgent}>
      <label>Agent 名称<input required maxLength={120} value={name} onChange={e => setName(e.target.value)} placeholder="例如：互联网产品经理面试经验" /></label>
      <label>一句话说明（选填）<textarea maxLength={2000} value={description} onChange={e => setDescription(e.target.value)} placeholder="例如：记录我在产品岗位求职中的面试流程、案例题和复盘。" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn primary" disabled={saving || !name.trim()}>{saving ? '正在创建…' : '创建并开始录入'}</button>
    </form>
    <div className="consent-preview"><ShieldCheck size={18}/><span>这一步只建立归属关系，不会保存任何未确认的经验原文。</span></div>
    <div className="path-grid">
      <div className="path-card"><Mic size={20}/><h2>语音或文字输入</h2><p>可分段录音，也可直接粘贴或输入文字；确认后由 AI 整理成条目。</p></div>
      <div className="path-card insider"><PenLine size={20}/><h2>逐条隐私确认</h2><p>每一条都由你决定是否允许该 Agent 使用；未授权条目始终仅自己可见。</p></div>
    </div>
    <p className="muted">已经有 Agent？请到 <Link to="/dashboard">我的空间</Link> 继续编辑已有条目。</p>
  </section>;
}
