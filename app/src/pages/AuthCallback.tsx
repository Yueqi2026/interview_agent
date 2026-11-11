import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function AuthCallback() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    navigate(user ? '/discover' : '/login', { replace: true });
  }, [navigate, ready, user]);

  return <section className="page section narrow wide-top"><p className="muted">正在安全地完成登录…</p></section>;
}
