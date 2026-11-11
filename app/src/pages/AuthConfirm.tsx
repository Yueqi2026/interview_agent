import { useState } from 'react';
import type { EmailOtpType } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase, supabaseConfigured } from '../services/supabase';

export default function AuthConfirm() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'ready' | 'working' | 'success' | 'error'>('ready');
  const [error, setError] = useState('');

  const params = new URLSearchParams(window.location.search);
  const tokenHash = params.get('token_hash');
  const type = params.get('type');
  const canConfirm = Boolean(supabaseConfigured && supabase && tokenHash && type === 'email');

  async function confirm() {
    if (!supabase || !tokenHash || type !== 'email') return;

    setStatus('working');
    setError('');
    const { error: verificationError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });

    if (verificationError) {
      setStatus('error');
      setError('这个登录链接已失效或已被使用。请返回登录页重新发送一封邮件。');
      return;
    }

    setStatus('success');
    window.setTimeout(() => navigate('/discover', { replace: true }), 700);
  }

  return (
    <section className="page section narrow wide-top">
      <div className="panel">
        <p className="eyebrow"><ShieldCheck size={15} /> 邮箱安全验证</p>
        <h1>确认登录</h1>
        <p className="muted">
          请点击下方按钮完成验证。邮件安全扫描即使预先打开本页，也不会消耗你的登录凭证。
        </p>

        {!canConfirm ? (
          <>
            <p className="form-error">此确认链接不完整或登录服务尚未就绪。</p>
            <Link className="btn primary" to="/login">返回登录页</Link>
          </>
        ) : status === 'success' ? (
          <p className="privacy-note"><CheckCircle2 size={17} />验证成功，正在进入网站…</p>
        ) : (
          <>
            {status === 'error' && <p className="form-error">{error}</p>}
            <button className="btn primary" type="button" onClick={confirm} disabled={status === 'working'}>
              {status === 'working' ? '正在验证…' : '确认并登录'}
            </button>
            <p className="muted">如果链接已失效，请回到登录页重新发送，勿转发邮件。</p>
          </>
        )}
      </div>
    </section>
  );
}
