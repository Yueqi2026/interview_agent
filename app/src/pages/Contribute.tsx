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
      <div className="eyebrow">创建经验 Agent</div>
      <h1>为这一段经历留一处独立空间</h1>
      <p>Agent 是经验的归属单位。每个 Agent 下的条目、隐私设置和未来回答都会彼此独立。</p>
    </header>
    <form className="agent-create-form" onSubmit={createAgent} data-ui>
      <div className="agent-create-form-head">
        <div><h2>Agent 信息</h2><p>先写一个便于自己辨认的名称；它不会自动公开。</p></div>
        <span className="agent-draft-badge">草稿</span>
      </div>
      <div className="agent-fields">
        <label className="agent-field"><span>Agent 名称 <b>必填</b></span><input required maxLength={120} value={name} onChange={e => setName(e.target.value)} placeholder="例如：互联网产品经理面试经验" /><small>建议用「行业 / 岗位 / 经历主题」命名，之后更容易管理。</small></label>
        <label className="agent-field"><span>经验简介 <em>选填</em></span><textarea maxLength={2000} value={description} onChange={e => setDescription(e.target.value)} placeholder="例如：记录我在产品岗位求职中的面试流程、案例题和复盘。" /><small>只作你自己的管理说明，之后可以修改。</small></label>
      </div>
      <div className="agent-create-footer">
        <div className="agent-create-privacy"><ShieldCheck size={17}/><span>现在只创建归属关系；任何经验内容都要等你逐条确认后才会保存。</span></div>
        <button className="btn primary" disabled={saving || !name.trim()}>{saving ? '正在创建…' : <>创建并开始录入 <ArrowRight size={16}/></>}</button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
    <section className="agent-next-steps" aria-labelledby="next-steps-title">
      <div><h2 id="next-steps-title">创建后，你将完成这三件事</h2><p>这些是接下来的流程说明，不需要在此处点击选择。</p></div>
      <ol>
        <li><Check size={16}/><div><strong>输入经验</strong><span>可录音、分段补充文字，或直接粘贴经历。</span></div></li>
        <li><Check size={16}/><div><strong>核对整理结果</strong><span>AI 只提供初稿，你可以编辑、增补或删除。</span></div></li>
        <li><Check size={16}/><div><strong>逐条确认隐私</strong><span>选择是否允许当前 Agent 使用该条经验。</span></div></li>
      </ol>
    </section>
    <p className="agent-existing-link">已经有 Agent？请到 <Link to="/dashboard">我的空间</Link> 继续编辑已有条目。</p>
  </section>;
}
