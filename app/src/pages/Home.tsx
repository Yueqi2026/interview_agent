import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, BriefcaseBusiness, Building2, Compass, MessageCircle, Search, ShieldCheck, Sparkles, UserRoundPlus, WandSparkles, Zap } from 'lucide-react';
import { agents } from '../data/mock';
import AgentCard from '../components/AgentCard';

const careerImage='https://images.unsplash.com/photo-1758876020967-e5a80e49463a?auto=format&fit=crop&fm=jpg&q=82&w=1600';
const workspaceImage='https://images.unsplash.com/photo-1774292476423-c3ee7ea107b9?auto=format&fit=crop&fm=jpg&q=82&w=1600';
const mentorImage='https://images.unsplash.com/photo-1758873268023-15a6e6d739ed?auto=format&fit=crop&fm=jpg&q=82&w=1200';

export default function Home() {
  return <>
    <section className="hero page hero-v2">
      <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
      <div className="hero-copy">
        <div className="pill"><Sparkles size={15}/> 真人经历 × AI Career Intelligence</div>
        <h1>面试之前，先和<br/><span>真正走过这条路的人</span>聊聊。</h1>
        <p className="lead">按公司、岗位、年份和招聘类型找到最相关的“过来人 Agent”。每个回答都区分本人经历、当下公开信息和 AI 分析，让你知道建议从哪里来。</p>
        <div className="hero-search-preview"><Search size={18}/><span>搜索公司 / 岗位 / 行业，例如“字节 商业化产品 社招”</span><Link to="/discover">搜索 <ArrowRight size={16}/></Link></div>
        <div className="hero-actions">
          <Link className="btn primary big" to="/discover"><Compass size={18}/> 探索过来人 <ArrowRight size={17}/></Link>
          <Link className="btn secondary big" to="/contribute"><UserRoundPlus size={18}/> 创建我的 Agent</Link>
        </div>
        <div className="trust-row"><span><ShieldCheck size={16}/> 经本人授权</span><span><BrainCircuit size={16}/> 来源分层</span><span><WandSparkles size={16}/> 知识可编辑、可删除</span></div>
      </div>
      <div className="hero-visual-stack">
        <div className="hero-photo-frame"><img src={careerImage} alt="职业人士在办公室使用电脑"/><div className="photo-overlay"><span>今日热门方向</span><b>AI 产品 · 商业化 · Consulting</b></div></div>
        <div className="hero-panel floating-card hero-chat-card">
          <div className="panel-top"><div><span className="live-dot"/> Alice AI</div><span>字节 · 产品</span></div>
          <div className="bubble user">商业化产品二面会追问到什么程度？</div>
          <div className="bubble ai"><strong>来自 Alice 的真实经历</strong><p>2024 年二面连续追问指标选择、异常定位和业务权衡，不只是背框架。</p></div>
          <div className="bubble ai analysis"><strong>AI 分析</strong><p>结合当前岗位变化，建议额外准备 AI 商业化与自动化投放场景。</p></div>
          <Link to="/agents/alice-byte" className="text-link">查看 Alice AI <ArrowRight size={16}/></Link>
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
        <Link to="/contribute" className="path-card insider"><div className="path-icon"><UserRoundPlus size={23}/></div><span className="mini-label">FOR INSIDERS</span><h3>我愿意分享一次经历</h3><p>先填写背景，再接受 AI 访谈。你确认之后，经历才会成为 Agent 可以使用的知识。</p><b>创建 Agent <ArrowRight size={16}/></b></Link>
      </div>
    </section>

    <section className="visual-band">
      <div className="page visual-band-grid"><div><div className="eyebrow light">INTERVIEW INTELLIGENCE</div><h2>最终，不只是“问一个人”。</h2><p>当经验积累起来，平台可以逐步回答：过去半年某岗位常问什么、哪些能力权重正在变化、哪一个时间点最值得准备。</p><div className="role-pills"><span><Building2 size={14}/> 公司</span><span><BriefcaseBusiness size={14}/> 岗位</span><span>年份</span><span>面试轮次</span><span>主题</span></div></div><div className="visual-photo"><img src={workspaceImage} alt="现代职业学习工作台"/></div></div>
    </section>

    <section className="page section cta-band cta-band-v2"><div><div className="eyebrow light">READY WHEN YOU ARE</div><h2>下一次面试，不必从零开始。</h2><p>先找到一个与你足够相似的经历，再让 AI 帮你把信息转化成自己的准备策略。</p></div><div className="cta-actions"><Link className="btn light big" to="/discover">探索过来人 <ArrowRight size={17}/></Link><Link className="btn glass-light big" to="/contribute">创建我的 Agent</Link></div></section>
  </>;
}
