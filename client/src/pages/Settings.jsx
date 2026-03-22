import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';

const DEFAULT_COMPANIES = ['Google', 'Meta', 'Stripe', 'Amazon'];

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { request } = useApi();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    cgpa: user?.cgpa || '',
    startDate: user?.startDate ? new Date(user.startDate).toISOString().split('T')[0] : '',
  });
  
  const [companies, setCompanies] = useState(
    user?.targetCompanies?.length ? user.targetCompanies : DEFAULT_COMPANIES
  );
  
  const [newCompany, setNewCompany] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [alerts, setAlerts] = useState({ study: true, deadlines: false });

  const setField = (field) => (e) => setProfile(p => ({ ...p, [field]: e.target.value }));

  const removeCompany = (name) => setCompanies(prev => prev.filter(c => c !== name));

  const addCompany = (e) => {
    e.preventDefault();
    const trimmed = newCompany.trim().toUpperCase();
    if (!trimmed) return;
    if (companies.map(c => c.toUpperCase()).includes(trimmed)) { 
      showToast('⚠️ Already Exists', `"${trimmed}" is already in your list.`); 
      return; 
    }
    setCompanies(prev => [...prev, trimmed]);
    setNewCompany('');
  };

  const saveProfile = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const data = await request('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: profile.name,
          cgpa: profile.cgpa ? parseFloat(profile.cgpa) : null,
          startDate: profile.startDate,
          targetCompanies: companies,
        }),
      });
      updateUser(data.user);
      showToast('✅ Configuration Updated', 'System parameters synchronized successfully.');
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="conf-sys">
      
      {/* ── HEADER ── */}
      <div className="conf-header">
        <div className="conf-h-label">SETTINGS & AUTHORITY</div>
        <h1 className="conf-h-title">USER CONFIGURATION</h1>
        <div className="conf-h-line"></div>
      </div>

      {/* ── SPLIT LAYOUT ── */}
      <div className="conf-layout">
        
        {/* Left Column */}
        <div className="conf-col-left">
          
          {/* Identity Section */}
          <div className="conf-section">
            <div className="conf-sec-title">
              <span className="conf-sec-icon">👤</span> IDENTITY
            </div>
            
            <div className="conf-row split">
              <div className="conf-input-group">
                <label>FULL IDENTITY</label>
                <input type="text" value={profile.name} onChange={setField('name')} placeholder="Alex Rivera" />
              </div>
              <div className="conf-input-group">
                <label>ACADEMIC CGPA</label>
                <input type="number" step="0.01" value={profile.cgpa} onChange={setField('cgpa')} placeholder="8.92" />
              </div>
            </div>

            <div className="conf-input-group">
              <label>NETWORK ADDRESS (READ ONLY)</label>
              <div className="conf-input-wrapper">
                <input type="email" value={user?.email || 'alex.rivera@tech-inst.edu'} readOnly className="readonly" />
                <span className="conf-input-icon">🔒</span>
              </div>
            </div>

            <div className="conf-input-group">
              <label>ROADMAP START DATE</label>
              <div className="conf-input-wrapper">
                <input type="date" value={profile.startDate} onChange={setField('startDate')} />
                <span className="conf-input-icon">📅</span>
              </div>
            </div>
          </div>

          {/* Target Companies Section */}
          <div className="conf-section" style={{ marginTop: '40px' }}>
            <div className="conf-sec-title">
              <span className="conf-sec-icon">◎</span> TARGET COMPANIES
            </div>
            
            <div className="conf-targets">
              {companies.map(c => (
                <div key={c} className="conf-target-pill">
                  {c.toUpperCase()} 
                  <span className="conf-target-x" onClick={() => removeCompany(c)}>✕</span>
                </div>
              ))}
              
              {/* Add form built inline */}
              <form onSubmit={addCompany} className="conf-target-add-form">
                <input 
                  type="text" 
                  value={newCompany} 
                  onChange={e => setNewCompany(e.target.value)} 
                  placeholder="+ ADD TARGET" 
                  className="conf-target-input" 
                />
              </form>
            </div>
            
            <p className="conf-helper-text">
              Defining targets optimizes the Battle Plan algorithm for specific tech stacks.
            </p>
          </div>

        </div>

        {/* Right Column */}
        <div className="conf-col-right">
          
          {/* Alert System Section */}
          <div className="conf-section">
            <div className="conf-sec-title">
              <span className="conf-sec-icon">🔔</span> ALERT SYSTEM
            </div>
            
            <div className="conf-alert-card" onClick={() => setAlerts(p => ({...p, study: !p.study}))}>
              <div className="conf-alert-info">
                <div className="conf-alert-name">Study Reminders</div>
                <div className="conf-alert-desc">Daily ping for DSA and Aptitude</div>
              </div>
              <div className={`conf-toggle ${alerts.study ? 'on' : 'off'}`}></div>
            </div>

            <div className="conf-alert-card" onClick={() => setAlerts(p => ({...p, deadlines: !p.deadlines}))}>
              <div className="conf-alert-info">
                <div className="conf-alert-name">Deadline Alerts</div>
                <div className="conf-alert-desc">Critical milestones & tests</div>
              </div>
              <div className={`conf-toggle ${alerts.deadlines ? 'on' : 'off'}`}></div>
            </div>
          </div>

          {/* Authority Status Card */}
          <div className="conf-auth-card">
            <div className="conf-auth-header">
              <div className="conf-auth-label">AUTHORITY STATUS</div>
              <div className="conf-shield-icon">🛡️</div>
            </div>
            <div className="conf-auth-tier">TIER: ELITE</div>
            <p className="conf-auth-desc">
              Your placement readiness score is in the top 5% of all users in your region. System integrity is high.
            </p>
            <button className="conf-btn glow-green" onClick={saveProfile} disabled={saving}>
              {saving ? 'SYNCHRONIZING...' : 'RE-AUTHENTICATE SYSTEM'}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="conf-danger-zone">
            <div className="conf-danger-label">CRITICAL ACTIONS</div>
            <button className="conf-btn-outline-red" onClick={logout}>
              TERMINATE SESSION <span className="conf-logout-icon">⎋</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
