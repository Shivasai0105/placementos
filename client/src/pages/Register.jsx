import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', cgpa: '',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false); // "check your email" state

  const { request } = useApi();
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          cgpa: form.cgpa ? parseFloat(form.cgpa) : null,
          startDate: form.startDate,
        }),
      });
      setDone(true); // show "check your email" card
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // ─── "Check your email" success screen ───────────────────────────────────────
  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📧</div>
          <div className="auth-logo-title" style={{ marginBottom: '4px' }}>PlacementOS</div>
          <div className="auth-title" style={{ marginTop: '20px' }}>Check your inbox!</div>
          <div className="auth-sub" style={{ marginBottom: '24px' }}>
            We sent a verification link to <strong>{form.email}</strong>.
            Click the link to activate your account.
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            Didn't get it? Check your spam folder.<br />
            Or <Link to="/login" style={{ color: 'var(--green)' }}>go back to login</Link> to resend.
          </div>
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

        <div className="auth-title">Start your prep 🚀</div>
        <div className="auth-sub">Create your account to track your 8-week journey.</div>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" placeholder="Your Full Name" value={form.name} onChange={set('name')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">CGPA (optional)</label>
              <input type="number" placeholder="8.67" step="0.01" min="0" max="10" value={form.cgpa} onChange={set('cgpa')} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input type="date" value={form.startDate} onChange={set('startDate')} />
            </div>
          </div>
          <button type="submit" className="btn btn-green btn-lg btn-full" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Creating account...' : '→ GET STARTED'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}