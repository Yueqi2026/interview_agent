import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut, Menu, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_VERSION } from '../config/app';
import { useAuth } from '../auth/AuthProvider';

export default function Layout() {
  const [open,setOpen]=useState(false);
  const location=useLocation();
  const navigate=useNavigate();
  const { user, signOut }=useAuth();
  useEffect(()=>setOpen(false),[location.pathname]);
  const hideChrome=location.pathname==='/login';
  if(hideChrome) return <Outlet/>;
  return <div className={location.pathname==='/'?'app-shell home-shell':'app-shell'}>
    <a className="skip-link" href="#main-content">跳到主要内容</a>
    <header className="topbar glass-nav">
      <Link className="brand" to="/"><span className="brand-mark"><Sparkles size={17}/></span><span>过来人 <b>AI</b></span></Link>
      <nav id="primary-navigation" className={open?'open':''}>
        <NavLink to="/discover">发现过来人</NavLink>
        <NavLink to="/contribute">创建 Agent</NavLink>
        <NavLink to="/dashboard">我的空间</NavLink>
      </nav>
      <div className="nav-actions">
        {user?<button className="btn ghost compact desktop-login" type="button" onClick={()=>void signOut().then(()=>navigate('/')).catch(()=>undefined)} aria-label="退出登录"><LogOut size={15}/>退出</button>:<Link className="btn ghost compact desktop-login" to="/login">登录</Link>}
        <Link className="btn primary compact" to="/discover">开始探索</Link>
        <button className="menu-btn" type="button" onClick={()=>setOpen(v=>!v)} aria-label="菜单" aria-expanded={open} aria-controls="primary-navigation">{open?<X size={20}/>:<Menu size={20}/>}</button>
      </div>
    </header>
    <main id="main-content" key={location.pathname} className="route-enter" tabIndex={-1}><Outlet/></main>
    {location.pathname!=='/'&&<footer><span>过来人 AI · Experience-powered career intelligence</span><span>v{APP_VERSION}</span></footer>}
  </div>
}
