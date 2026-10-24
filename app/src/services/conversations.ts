import type { Agent, ChatMessage } from '../types';

const prefix='guolairen.conversation.v1.';
export type Conversation={
  agentId:string;
  agent:Pick<Agent,'name'|'company'|'role'|'avatar'|'gradient'>;
  messages:ChatMessage[];
  createdAt:string;
  updatedAt:string;
};
function parse(raw:string|null):Conversation|null {
  if(!raw)return null;
  try{
    const value=JSON.parse(raw);
    if(!value||typeof value.agentId!=='string'||!value.agent||typeof value.agent.name!=='string'||typeof value.agent.company!=='string'||typeof value.agent.role!=='string'||typeof value.agent.avatar!=='string'||!Array.isArray(value.messages)||!Number.isFinite(Date.parse(value.createdAt))||!Number.isFinite(Date.parse(value.updatedAt)))return null;
    if(value.messages.some((m:ChatMessage)=>!m||typeof m.id!=='string'||!['user','assistant'].includes(m.role)||typeof m.content!=='string'))return null;
    return value as Conversation;
  }catch{return null}
}
export function readConversation(agentId:string):Conversation|null {
  const result=parse(localStorage.getItem(prefix+agentId));
  return result?.agentId===agentId?result:null;
}
export function listConversations():Conversation[]{
  const rows:Conversation[]=[];
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(!key?.startsWith(prefix))continue;
    const value=parse(localStorage.getItem(key));
    if(value&&key===prefix+value.agentId&&value.messages.some(m=>m.role==='user'))rows.push(value);
  }
  return rows.sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt));
}
export function appendConversationMessage(agent:Agent,message:ChatMessage,initial:ChatMessage[]=[]):Conversation {
  // Read at write time so a late reply cannot replace newer saved messages.
  const existing=readConversation(agent.id);
  const messages=existing?.messages||initial;
  const now=new Date().toISOString();
  const next:Conversation={
    agentId:agent.id,
    agent:{name:agent.name,company:agent.company,role:agent.role,avatar:agent.avatar,gradient:agent.gradient},
    messages:messages.some(m=>m.id===message.id)?messages:[...messages,message],
    createdAt:existing?.createdAt||now,
    updatedAt:now
  };
  localStorage.setItem(prefix+agent.id,JSON.stringify(next));
  return next;
}
