import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, BriefcaseBusiness, Building2, Compass, MessageCircle, Search, ShieldCheck, Sparkles, UserRoundPlus, WandSparkles, Zap } from 'lucide-react';
import { agents } from '../data/mock';
import AgentCard from '../components/AgentCard';

const workspaceImage='https://images.unsplash.com/photo-1774292476423-c3ee7ea107b9?auto=format&fit=crop&fm=jpg&q=82&w=1600';
const mentorImage='https://images.unsplash.com/photo-1758873268023-15a6e6d739ed?auto=format&fit=crop&fm=jpg&q=82&w=1200';

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

    <section className="page proof-bar">
      <div><b>4 类来源</b><span>亲历 / 公开信息 / AI 分析 / 用户上下文</span></div>
      <div><b>可追溯</b><span>回答标记来源与经验年份，避免“AI 假装亲历”</span></div>
      <div><b>双向价值</b><span>求职者获得经验，贡献者沉淀可复用的数字经验资产</span></div>
    </section>

    <section className="page section">
      <div className="section-head"><div><div className="eyebrow">FEATURED INSIDERS</div><h2>先看看，谁真正走过你的目标路径</h2><p className="muted">不是匿名帖子，而是按经历结构化的可对话 Agent。</p></div><Link to="/discover" className="text-link">查看全部 <ArrowRight size={16}/></Link></div>
      <div className="agent-list home-agent-list">{agents.slice(0,4).map(a=><AgentCard key={a.id} agent={a}/>)}</div>
    </section>

    <section className="story-section">
      <div className="page story-grid">
        <div className="story-image"><img src={mentorImage} alt="职业人士在工作环境中使用电脑"/><div className="image-caption"><Sparkles size={14}/><span>经验不是一篇帖子，而是一套可继续追问的上下文。</span></div></div>
        <div className="story-copy"><div className="eyebrow">WHY IT FEELS DIFFERENT</div><h2>AI 不替过来人“编经验”，而是把经验组织得更有用。</h2><p className="muted">传统面经往往缺少上下文：什么年份、什么级别、为什么被追问、候选人当时怎么回答。这里先用 AI 访谈补齐这些信息，再由贡献者逐条确认。</p>
          <div className="detail-list">
            <div><span className="detail-icon"><MessageCircle size={18}/></span><div><b>连续追问，而不是一次性投稿</b><p>围绕面试轮次、原始问题、回答、追问、复盘和建议形成结构化经历。</p></div></div>
            <div><span className="detail-icon"><ShieldCheck size={18}/></span><div><b>贡献者保留控制权</b><p>可隐藏知识条目、撤销授权或删除资料，私人身份信息不进入 Agent Retrieval。</p></div></div>
            <div><span className="detail-icon"><Zap size={18}/></span><div><b>经验和“现在”分开</b><p>历史亲历不会被伪装成最新事实；最新 JD、组织变化和行业动态进入单独的实时信息层。</p></div></div>
          </div>
          <Link to="/contribute" className="btn primary big">成为过来人 <ArrowRight size={17}/></Link>
        </div>
      </div>
    </section>

    <section className="page section">
      <div className="section-head"><div><div className="eyebrow">TWO WAYS TO START</div><h2>你可以来找经验，也可以把经验留下来</h2></div></div>
      <div className="path-grid">
        <Link to="/discover" className="path-card seeker"><div className="path-icon"><Search size={23}/></div><span className="mini-label">FOR CANDIDATES</span><h3>我正在准备面试</h3><p>输入目标公司、岗位、地点或面试类型，找到最相关的过来人并开始聊天。</p><b>查找 Agent <ArrowRight size={16}/></b></Link>
        <Link to="/contribute" className="path-card insider"><div className="path-icon"><UserRoundPlus size={23}/></div><span className="mini-label">FOR INSIDERS</span><h3>我愿意分享一次经历</h3><p>选择 AI 访谈或分段语音，讲述自己的经历。确认知识后，再逐项决定是否授权。</p><b>创建 Agent <ArrowRight size={16}/></b></Link>
      </div>
    </section>

    <section className="visual-band">
      <div className="page visual-band-grid"><div><div className="eyebrow light">INTERVIEW INTELLIGENCE</div><h2>最终，不只是“问一个人”。</h2><p>当经验积累起来，平台可以逐步回答：过去半年某岗位常问什么、哪些能力权重正在变化、哪一个时间点最值得准备。</p><div className="role-pills"><span><Building2 size={14}/> 公司</span><span><BriefcaseBusiness size={14}/> 岗位</span><span>年份</span><span>面试轮次</span><span>主题</span></div></div><div className="visual-photo"><img src={workspaceImage} alt="现代职业学习工作台"/></div></div>
    </section>

    <section className="page section cta-band cta-band-v2"><div><div className="eyebrow light">READY WHEN YOU ARE</div><h2>下一次面试，不必从零开始。</h2><p>先找到一个与你足够相似的经历，再让 AI 帮你把信息转化成自己的准备策略。</p></div><div className="cta-actions"><Link className="btn light big" to="/discover">探索过来人 <ArrowRight size={17}/></Link><Link className="btn glass-light big" to="/contribute">创建我的 Agent</Link></div></section>
  </>;
}
