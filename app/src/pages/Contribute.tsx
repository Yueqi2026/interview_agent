import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
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

  return <section className="page section narrow wide-top agent-create-page">
    <header className="agent-create-heading">
      <div className="eyebrow">成为过来人</div>
      <h1>把走过的路，留给后来的人</h1>
      <p>可以从一次面试、一个岗位，或一段求职经历开始。你写下的内容会先由你确认，再决定要不要分享。</p>
    </header>
    <form className="agent-create-form" onSubmit={createAgent} data-ui>
      <div className="agent-create-form-head">
        <div><h2>这段经历怎么称呼？</h2><p>先取一个方便自己辨认的名字，它不会自动公开。</p></div>
      </div>
      <div className="agent-fields">
        <label className="agent-field"><span>这段经历的名字 <b>必填</b></span><input required maxLength={120} value={name} onChange={e => setName(e.target.value)} placeholder="例如：互联网产品经理求职经历" /><small>用「行业 / 岗位 / 经历主题」命名，之后找起来更方便。</small></label>
        <label className="agent-field"><span>补充说明 <em>可不填</em></span><textarea maxLength={2000} value={description} onChange={e => setDescription(e.target.value)} placeholder="例如：产品岗位校招，从准备、面试到复盘的过程。" /><small>这是留给自己看的备注，之后随时可以改。</small></label>
      </div>
      <div className="agent-create-footer">
        <div className="agent-create-privacy"><ShieldCheck size={17}/><span>现在只是建一个属于你的经验空间。具体内容要等你一条条确认后，才会保存下来。</span></div>
        <button className="btn primary" disabled={saving || !name.trim()}>{saving ? '正在创建…' : <>继续，写下这段经历 <ArrowRight size={16}/></>}</button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
    <section className="agent-next-steps" aria-labelledby="next-steps-title">
      <div><h2 id="next-steps-title">接下来会做什么</h2><p>下面是之后的流程，不需要在这里做选择。</p></div>
      <ol>
        <li><Check size={16}/><div><strong>写下你还记得的事</strong><span>可以说，也可以写；想到哪儿写到哪儿就好。</span></div></li>
        <li><Check size={16}/><div><strong>看看整理出来的内容</strong><span>系统会先帮你归纳，你可以改、补充或删除。</span></div></li>
        <li><Check size={16}/><div><strong>决定哪些可以分享</strong><span>每一条都由你决定，是否允许它被这个 Agent 使用。</span></div></li>
      </ol>
    </section>
    <p className="agent-existing-link">已经有 Agent？请到 <Link to="/dashboard">我的空间</Link> 继续编辑已有条目。</p>
  </section>;
}
