import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export default function VerifyEmail() {
  const { token } = useParams();
  const { login } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await request(`/api/auth/verify/${token}`);
        login(data.token, data.user);
        setStatus('success');
        // Auto-redirect to dashboard after 2s
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        setMessage(err.message || 'Verification failed.');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-logo-title" style={{ marginBottom: '24px' }}>PlacementOS</div>

        {status === 'loading' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⏳</div>
            <div className="auth-title">Verifying your email…</div>
            <div className="auth-sub">Please wait a moment.</div>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✅</div>
            <div className="auth-title">Email verified!</div>
            <div className="auth-sub">You're all set. Redirecting to dashboard…</div>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>❌</div>
            <div className="auth-title">Verification failed</div>
            <div className="error-msg" style={{ marginBottom: '20px' }}>⚠️ {message}</div>
            <div className="auth-sub">The link may have expired or already been used.</div>
            <Link to="/login" className="btn btn-green" style={{ marginTop: '16px', display: 'inline-block' }}>
              → Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
