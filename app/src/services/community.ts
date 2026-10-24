import { useSyncExternalStore } from 'react';

const eventName = 'guolairen-community';
const starKey = (id:string) => 'guolairen.star.' + id;
function subscribe(callback:()=>void) {
  window.addEventListener(eventName,callback);
  window.addEventListener('storage',callback);
  return ()=>{window.removeEventListener(eventName,callback);window.removeEventListener('storage',callback)};
}
function readStar(id:string) { try{return localStorage.getItem(starKey(id))==='1'}catch{return false} }
export function useAgentStar(id:string) {
  const starred=useSyncExternalStore(subscribe,()=>readStar(id),()=>false);
  return {starred,count:starred?1:0,setStar:(value:boolean)=>{
    localStorage.setItem(starKey(id),value?'1':'0');
    window.dispatchEvent(new Event(eventName));
  }};
}
export type SpaceProfile={name:string;bio:string;joinedAt:string;visits:number};
export function readSpaceProfile():SpaceProfile {
  const fallback={name:'我的经验主页',bio:'把走过的路，变成可以分享的经验。',joinedAt:new Date().toISOString(),visits:0};
  try {
    const saved=JSON.parse(localStorage.getItem('guolairen.profile')||'null');
    if(saved&&typeof saved.name==='string'&&typeof saved.bio==='string'&&typeof saved.joinedAt==='string'&&Number.isFinite(saved.visits))return saved;
    const user=JSON.parse(localStorage.getItem('demoUser')||'null');
    if(typeof user?.name==='string')fallback.name=user.name;
  }catch{/* use safe profile */}
  return fallback;
}
export function saveSpaceProfile(profile:SpaceProfile){localStorage.setItem('guolairen.profile',JSON.stringify(profile))}
export function registerSpaceVisit(){
  const profile=readSpaceProfile();
  if(sessionStorage.getItem('guolairen.spaceVisited')!=='1'){
    const next={...profile,visits:profile.visits+1};
    saveSpaceProfile(next);sessionStorage.setItem('guolairen.spaceVisited','1');return next;
  }
  return profile;
}
