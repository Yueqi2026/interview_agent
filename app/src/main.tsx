import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Discover from './pages/Discover';
import AgentDetail from './pages/AgentDetail';
import Chat from './pages/Chat';
import Contribute from './pages/Contribute';
import Interview from './pages/Interview';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/discover" element={<Discover/>}/>
          <Route path="/agents/:id" element={<AgentDetail/>}/>
          <Route path="/agents/:id/chat" element={<Chat/>}/>
          <Route path="/contribute" element={<Contribute/>}/>
          <Route path="/interview" element={<Interview/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/login" element={<Login/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
