import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [devResetLink, setDevResetLink] = useState(null);
  const { request } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await request('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      if (data.devResetLink) {
        setDevResetLink(data.devResetLink);
      }
      setDone(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📧</div>
          <div className="auth-logo-title" style={{ marginBottom: '20px' }}>PlacementOS</div>
          <div className="auth-title">Check your inbox</div>
          <div className="auth-sub" style={{ marginBottom: '20px' }}>
            If <strong>{email}</strong> is registered, a password reset link has been sent.
            Check your spam folder too.
          </div>

          {devResetLink && (
            <div style={{
              margin: '20px 0',
              padding: '16px',
              background: 'rgba(0, 232, 122, 0.1)',
              border: '1px dashed var(--green)',
              borderRadius: '8px',
              textAlign: 'left'
            }}>
              <div style={{ color: 'var(--green)', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem' }}>
                🛠️ Dev Mode: Direct Reset Link
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '12px' }}>
                Since email delivery might not be set up in this environment, you can reset your password immediately by clicking below:
              </div>
              <a href={devResetLink} className="btn btn-green btn-sm" style={{ width: '100%', textAlign: 'center', boxSizing: 'border-box', display: 'inline-block' }}>
                Reset Password Directly
              </a>
            </div>
          )}

          <Link to="/login" style={{ fontSize: '0.82rem', color: 'var(--green)' }}>← Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-title">PlacementOS</div>
          <div className="auth-logo-sub">10 LPA BATTLE PLAN</div>
        </div>

        <div className="auth-title">Forgot password 🔑</div>
        <div className="auth-sub">Enter your email and we'll send a reset link.</div>

        {error && <div className="error-msg">⚠️ {error}</div>}

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
          <button type="submit" className="btn btn-green btn-lg btn-full" disabled={loading}>
            {loading ? 'Sending…' : '→ SEND RESET LINK'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">← Back to login</Link>
        </div>
      </div>
    </div>
  );
}
