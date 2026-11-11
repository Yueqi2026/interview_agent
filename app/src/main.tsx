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
import ErrorBoundary from './components/ErrorBoundary';
import KnowledgeReview from './pages/KnowledgeReview';
import Voice from './pages/Voice';
import AuthCallback from './pages/AuthCallback';
import { AuthProvider } from './auth/AuthProvider';
import { RequireAuth } from './auth/RequireAuth';
import './styles.css';
import './home-refined.css';
import './community.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider><BrowserRouter>
      <ErrorBoundary><Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/discover" element={<Discover/>}/>
          <Route path="/agents/:id" element={<AgentDetail/>}/>
          <Route path="/agents/:id/chat" element={<Chat/>}/>
          <Route path="/contribute" element={<RequireAuth><Contribute/></RequireAuth>}/>
          <Route path="/voice" element={<RequireAuth><Voice/></RequireAuth>}/>
          <Route path="/interview" element={<RequireAuth><Interview/></RequireAuth>}/>
          <Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>}/>
          <Route path="/knowledge-review" element={<RequireAuth><KnowledgeReview/></RequireAuth>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/auth/callback" element={<AuthCallback/>}/>
        </Route>
      </Routes></ErrorBoundary>
    </BrowserRouter></AuthProvider>
  </React.StrictMode>
);
