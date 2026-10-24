import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Compass, MessageCircle, ShieldCheck, Sparkles, UserRoundPlus, WandSparkles } from 'lucide-react';


export default function Home() {

  return <>
    <section className="hero page hero-v2 hero-refined">
      <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
      <div className="hero-copy">
        <div className="pill"><Sparkles size={15}/> 真人经历 × AI Career Intelligence</div>
        <h1>面试之前，先和<br/><span>走过这条路的人</span><br/>聊聊。</h1>
        <p className="lead">按公司、岗位、年份和招聘类型找到最相关的“过来人 Agent”。每个回答都区分本人经历、当下公开信息和 AI 分析，让你知道建议从哪里来。</p>
        <div className="hero-actions">
          <Link className="btn primary big" to="/discover"><Compass size={18}/> 探索过来人 <ArrowRight size={17}/></Link>
          <Link className="btn secondary big" to="/contribute"><UserRoundPlus size={18}/> 创建我的 Agent</Link>
        </div>
        <div className="trust-row"><span><ShieldCheck size={16}/> 经本人授权</span><span><BrainCircuit size={16}/> 来源分层</span><span><WandSparkles size={16}/> 知识可编辑、可删除</span></div>
      </div>
      <div className="insider-showcase" aria-label="经验整理与授权界面示意">
        <div className="showcase-bar"><span><Sparkles size={17}/> 我的经验工作台</span><span className="showcase-demo">界面示意</span></div>
        <div className="showcase-body">
          <div className="eyebrow">BECOME AN INSIDER</div><h2>一次经历，更多可能。</h2><p className="showcase-intro">你来分享，AI 帮你整理。每一步都由你确认。</p>
          <ol className="showcase-steps"><li className="complete"><span>✓</span>说出经历</li><li className="current"><span>2</span>确认知识</li><li><span>3</span>自主授权</li></ol>
          <div className="showcase-recording"><div className="recording-icon"><MessageCircle size={20}/></div><div><strong>我的产品面试复盘</strong><small>语音片段 01 · 已确认</small></div><div className="showcase-wave" aria-hidden="true">{[10,22,15,30,20,12,24,17].map((height,i)=><i key={i} style={{height}}/>)}</div></div>
          <div className="showcase-connector"><WandSparkles size={14}/> 整理为清晰、可复用的知识</div>
          <article className="showcase-knowledge"><div className="showcase-knowledge-head"><span>经验知识 · 01</span><span><ShieldCheck size={13}/> 由你控制</span></div><h3>指标拆解：先讲清业务判断</h3><p>先明确业务目标，再拆解转化漏斗。比起背框架，更重要的是说明为什么选择这些指标。</p><div className="showcase-permission"><span>● 允许 Agent 使用</span><span className="showcase-switch" aria-label="授权状态示意：开启"/></div></article>
          <div className="showcase-footer"><span><ShieldCheck size={14}/> 仅使用你确认授权的内容</span><Link to="/contribute">成为过来人 <ArrowRight size={15}/></Link></div>
        </div>
      </div>
    </section>

  </>;
}
