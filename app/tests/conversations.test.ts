import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appendConversationMessage, listConversations, readConversation } from '../src/services/conversations.ts';

test('conversation persistence, isolation, malformed records and late replies',()=>{
  const data=new Map<string,string>();
  const storage={
    get length(){return data.size},
    key(i:number){return Array.from(data.keys())[i]??null},
    getItem(key:string){return data.get(key)??null},
    setItem(key:string,value:string){data.set(key,value)}
  };
  Object.defineProperty(globalThis,'localStorage',{value:storage,configurable:true});
  const agent={id:'a',name:'A',company:'Demo',role:'PM',avatar:'A',title:'Demo',year:2026,location:'',tags:[],summary:'',score:0,sessions:0,updatedAt:''};
  assert.equal(readConversation('a'),null);
  const hello={id:'hello',role:'assistant' as const,content:'hello'};
  appendConversationMessage(agent,{id:'u1',role:'user',content:'first'},[hello]);
  assert.equal(readConversation('a')?.messages.length,2);
  appendConversationMessage({...agent,id:'b'},{id:'b1',role:'user',content:'separate'},[hello]);
  appendConversationMessage(agent,{id:'u2',role:'user',content:'newer'});
  const late=appendConversationMessage(agent,{id:'a1',role:'assistant',content:'late reply'},[hello]);
  assert.deepEqual(late.messages.map(m=>m.id),['hello','u1','u2','a1']);
  appendConversationMessage(agent,{id:'a1',role:'assistant',content:'late reply'});
  assert.equal(readConversation('a')?.messages.length,4);
  assert.equal(readConversation('b')?.messages.at(-1)?.content,'separate');
  data.set('guolairen.conversation.v1.bad','{invalid');
  assert.equal(readConversation('bad'),null);
  assert.equal(listConversations().length,2);
  const a=JSON.parse(storage.getItem('guolairen.conversation.v1.a')!);
  a.updatedAt='2026-10-24T12:00:00Z';
  const second=JSON.parse(storage.getItem('guolairen.conversation.v1.b')!);
  second.updatedAt='2026-10-25T12:00:00Z';
  storage.setItem('guolairen.conversation.v1.a',JSON.stringify(a));
  storage.setItem('guolairen.conversation.v1.b',JSON.stringify(second));
  assert.deepEqual(listConversations().map(x=>x.agentId),['b','a']);
  storage.setItem('guolairen.conversation.v1.impostor',JSON.stringify(a));
  assert.equal(readConversation('impostor'),null);
  assert.equal(listConversations().length,2);
  storage.setItem=()=>{throw new Error('Quota exceeded')};
  assert.throws(()=>appendConversationMessage(agent,{id:'u3',role:'user',content:'not persisted'}),/Quota/);
});
