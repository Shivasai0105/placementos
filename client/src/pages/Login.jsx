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
  const [devLink, setDevLink] = useState(null);
  const { login } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUnverifiedEmail(null);
    setDevLink(null);
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
        if (err.devVerificationLink) {
          setDevLink(err.devVerificationLink);
        }
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
      const data = await request('/api/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email: unverifiedEmail }),
      });
      setError('');
      if (data.devVerificationLink) {
        setDevLink(data.devVerificationLink);
        alert('Verification link generated in Dev Mode!');
      } else {
        setUnverifiedEmail(null);
        alert('Verification email resent! Please check your inbox.');
      }
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

            {devLink && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                background: 'rgba(0, 232, 122, 0.1)',
                border: '1px dashed var(--green)',
                borderRadius: '6px',
                textAlign: 'left'
              }}>
                <div style={{ color: 'var(--green)', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '4px' }}>
                  🛠️ Dev Mode: Direct Verification Link
                </div>
                <a href={devLink} className="btn btn-green btn-sm" style={{ width: '100%', textAlign: 'center', boxSizing: 'border-box', marginTop: '6px', display: 'inline-block' }}>
                  Verify & Log In Directly
                </a>
              </div>
            )}
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
