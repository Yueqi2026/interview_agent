import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Layout() {
  const [open,setOpen]=useState(false);
  const location=useLocation();
  useEffect(()=>setOpen(false),[location.pathname]);
  const hideChrome=location.pathname==='/login';
  if(hideChrome) return <Outlet/>;
  return <div className="app-shell">
    <header className="topbar glass-nav">
      <Link className="brand" to="/"><span className="brand-mark"><Sparkles size={17}/></span><span>过来人 <b>AI</b></span></Link>
      <nav className={open?'open':''}>
        <NavLink to="/discover">发现过来人</NavLink>
        <NavLink to="/contribute">创建 Agent</NavLink>
        <NavLink to="/dashboard">我的空间</NavLink>
      </nav>
      <div className="nav-actions">
        <Link className="btn ghost compact desktop-login" to="/login">登录</Link>
        <Link className="btn primary compact" to="/discover">开始探索</Link>
        <button className="menu-btn" onClick={()=>setOpen(v=>!v)} aria-label="菜单">{open?<X size={20}/>:<Menu size={20}/>}</button>
      </div>
    </header>
    <main key={location.pathname} className="route-enter"><Outlet/></main>
    <footer><span>过来人 AI · Experience-powered career intelligence</span><span>v0.4.1 · UI fix</span></footer>
  </div>
}
