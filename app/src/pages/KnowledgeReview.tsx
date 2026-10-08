import { Check, Eye, EyeOff, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type ReviewItem = { id: string; title: string; content: string; allowed: boolean; removed?: boolean };
const fallback: ReviewItem[] = [
  { id: 'background', title: '面试背景', content: '公司、岗位、年份和招聘类型来自创建 Agent 时填写的经历背景。', allowed: true },
  { id: 'process', title: '面试流程', content: '访谈完成后，这里会显示 AI 从回答中整理出的轮次、形式和时间信息。', allowed: true },
  { id: 'advice', title: '给后来人的建议', content: '确认前请检查内容是否只包含你愿意让 Agent 使用的经验。', allowed: true }
];

export default function KnowledgeReview() {
  const [items, setItems] = useState<ReviewItem[]>(fallback);
  useEffect(() => { try { const saved = localStorage.getItem('knowledgeReview'); if (saved) setItems(JSON.parse(saved)); } catch { /* use fallback */ } }, []);
  useEffect(() => { localStorage.setItem('knowledgeReview', JSON.stringify(items)); }, [items]);
  return <section className="page section narrow wide-top"><div className="eyebrow"><ShieldCheck size={13}/> KNOWLEDGE REVIEW</div><h1>你的面试经验已经整理完成</h1><p className="muted">这是发布前的审核区。只有你确认允许 Agent 使用的条目，未来才会进入 KnowledgeChunk；原始访谈不会自动公开。</p><div className="review-list">{items.filter(item=>!item.removed).map(item=><article className="review-item fresh-card" key={item.id}><div className="review-item-head"><div><span className="mini-label">结构化知识</span><h3>{item.title}</h3></div><span className={`review-state ${item.allowed?'allowed':'private'}`}>{item.allowed?<><Eye size={14}/> Agent 可使用</>:<><EyeOff size={14}/> 仅自己可见</>}</span></div><p>{item.content}</p><div className="review-actions"><button type="button" onClick={()=>setItems(rows=>rows.map(row=>row.id===item.id?{...row,allowed:!row.allowed}:row))}>{item.allowed?<><EyeOff size={14}/> 设为仅自己可见</>:<><Eye size={14}/> 允许 Agent 使用</>}</button><button type="button" onClick={()=>setItems(rows=>rows.map(row=>row.id===item.id?{...row,content:`${row.content}（待编辑）`}:row))}><Pencil size={14}/> 编辑</button><button type="button" className="danger" onClick={()=>setItems(rows=>rows.map(row=>row.id===item.id?{...row,removed:true}:row))}><Trash2 size={14}/> 删除</button></div></article>)}</div><div className="review-confirm fresh-card"><Check size={20}/><div><strong>当前审核状态已保存在本机草稿</strong><p>接入真实数据库后，这里会改为服务端保存并写入 Consent 记录。</p></div></div></section>;
}
