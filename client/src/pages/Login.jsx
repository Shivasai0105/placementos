import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resending, setResending] = useState(false);
  const { login } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUnverifiedEmail(null);
    setLoading(true);
    try {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      if (err.requiresVerification) {
        setUnverifiedEmail(err.email || email);
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setResending(true);
    try {
      await request('/api/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email: unverifiedEmail }),
      });
      setError('');
      setUnverifiedEmail(null);
      alert('Verification email resent! Please check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-title">PlacementOS</div>
          <div className="auth-logo-sub">10 LPA BATTLE PLAN</div>
        </div>

        <div className="auth-title">Welcome back 👋</div>
        <div className="auth-sub">Log in to continue your placement prep.</div>

        {error && <div className="error-msg">⚠️ {error}</div>}

        {unverifiedEmail && (
          <div className="verify-notice">
            <div>📧 Please verify your email before logging in.</div>
            <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.7 }}>Sent to: {unverifiedEmail}</div>
            <button className="btn btn-green" onClick={resendVerification} disabled={resending} style={{ marginTop: '10px', width: '100%' }}>
              {resending ? 'Sending...' : '↺ Resend Verification Email'}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ textAlign: 'right', marginBottom: '12px' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--muted2)' }}>
              Forgot password?
            </Link>
          </div>
          <button type="submit" className="btn btn-green btn-lg btn-full" disabled={loading}>
            {loading ? 'Logging in...' : '→ LOG IN'}
          </button>
        </form>

        <div className="auth-footer">
          New here? <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
}
