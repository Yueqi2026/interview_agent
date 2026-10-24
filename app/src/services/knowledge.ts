import { demoKnowledge } from './demoKnowledge';
export type Knowledge={id:string;title:string;content:string;createdAt:string;visible:boolean};
export function readKnowledge():Knowledge[]{try{const saved=localStorage.getItem('knowledge.v1');if(saved===null)return demoKnowledge.map(x=>({...x}));const a=JSON.parse(saved);return Array.isArray(a)?a.filter(x=>x&&typeof x.id==='string'&&typeof x.content==='string'&&typeof x.title==='string'&&typeof x.visible==='boolean'):[]}catch{return []}}
export function saveKnowledge(rows:Knowledge[]){localStorage.setItem('knowledge.v1',JSON.stringify(rows))}
