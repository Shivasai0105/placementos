import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';

const DEFAULT_COMPANIES = ['Zoho', 'Freshworks', 'Persistent', 'TCS Digital', 'Infosys DSE'];

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { request } = useApi();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    cgpa: user?.cgpa || '',
    startDate: user?.startDate ? new Date(user.startDate).toISOString().split('T')[0] : '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [changingPw, setChangingPw] = useState(false);
  const [companies, setCompanies] = useState(
    user?.targetCompanies?.length ? user.targetCompanies : DEFAULT_COMPANIES
  );
  const [newCompany, setNewCompany] = useState('');
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);

  const set = (field) => (e) => setProfile(p => ({ ...p, [field]: e.target.value }));

  const removeCompany = (name) => setCompanies(prev => prev.filter(c => c !== name));

  const addCompany = () => {
    const trimmed = newCompany.trim();
    if (!trimmed) return;
    if (companies.includes(trimmed)) { showToast('⚠️ Already Exists', `"${trimmed}" is already in your list.`); return; }
    setCompanies(prev => [...prev, trimmed]);
    setNewCompany('');
  };

  const handleCompanyKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addCompany(); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (companies.length === 0) { showToast('⚠️ No Companies', 'Add at least one target company.'); return; }
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
      showToast('✅ Profile Updated', 'Your profile has been saved.');
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const requestNotif = () => {
    if (!('Notification' in window)) { showToast('⚠️ Not Supported', 'Browser does not support notifications.'); return; }
    Notification.requestPermission().then(p => {
      if (p === 'granted') showToast('✅ Enabled', "You'll get a 6 PM reminder daily!");
      else showToast('❌ Blocked', 'Allow notifications in browser settings.');
    });
  };

  const importFromLocalStorage = async () => {
    try {
      const saved = localStorage.getItem('pos2');
      if (!saved) { showToast('⚠️ No Data', 'No local data found (pos2 key).'); return; }
      const localState = JSON.parse(saved);
      setImporting(true);
      await request('/api/progress/import', {
        method: 'POST',
        body: JSON.stringify({ tasks: localState.tasks || {}, problems: localState.problems || {} }),
      });
      showToast('✅ Imported!', 'Your local progress has been synced to the server.');
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setImporting(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) { showToast('⚠️ Too short', 'New password must be at least 6 characters.'); return; }
    setChangingPw(true);
    try {
      await request('/api/auth/password', {
        method: 'PATCH',
        body: JSON.stringify(pwForm),
      });
      showToast('✅ Password Changed', 'Your password has been updated.');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>⚙️ Settings</div>

      {/* Profile */}
      <div className="settings-section">
        <div className="settings-section-title">👤 Profile</div>
        <form onSubmit={saveProfile}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" value={profile.name} onChange={set('name')} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">CGPA</label>
              <input type="number" step="0.01" min="0" max="10" value={profile.cgpa} onChange={set('cgpa')} placeholder="8.67" />
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input type="date" value={profile.startDate} onChange={set('startDate')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email (read-only)</label>
            <input type="email" value={user?.email || ''} readOnly style={{ opacity: 0.5 }} />
          </div>

          {/* Target Companies */}
          <div className="form-group" style={{ marginTop: '4px' }}>
            <label className="form-label">🏢 Target Companies</label>
            <div className="company-chips">
              {companies.map(c => (
                <span key={c} className="company-chip">
                  {c}
                  <span className="chip-remove" onClick={() => removeCompany(c)} title={`Remove ${c}`}>✕</span>
                </span>
              ))}
              {companies.length === 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic' }}>No companies added yet</span>
              )}
            </div>
            <div className="add-company-row">
              <input
                type="text"
                placeholder="Add company (e.g. Google)"
                value={newCompany}
                onChange={e => setNewCompany(e.target.value)}
                onKeyDown={handleCompanyKeyDown}
                maxLength={40}
              />
              <button type="button" className="btn btn-green" onClick={addCompany} style={{ flexShrink: 0 }}>
                + Add
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-green" disabled={saving} style={{ marginTop: '8px' }}>
            {saving ? 'Saving...' : '✓ Save Profile'}
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <div className="settings-section-title">🔔 Notifications</div>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted2)', marginBottom: '16px', lineHeight: 1.5 }}>
          Enable browser notifications to get a daily 6:00 PM reminder to start your prep session.
          Notifications work as long as the browser is open.
        </p>
        <button className="btn" onClick={requestNotif}>
          🔔 Enable 6 PM Notifications
        </button>
        <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>
          Current permission: {Notification?.permission || 'not supported'}
        </div>
      </div>

      {/* Data Import */}
      <div className="settings-section">
        <div className="settings-section-title">📥 Import Progress from Old App</div>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted2)', marginBottom: '16px', lineHeight: 1.5 }}>
          If you used the old HTML version of PlacementOS (<code>placement-tracker-final.html</code>),
          your progress was saved in this browser's localStorage under the key <code>pos2</code>.
          Click below to import it to your account.
        </p>
        <button className="btn" onClick={importFromLocalStorage} disabled={importing}>
          {importing ? 'Importing...' : '📥 Import from localStorage'}
        </button>
      </div>

      {/* Change Password */}
      <div className="settings-section">
        <div className="settings-section-title">🔑 Change Password</div>
        <form onSubmit={changePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
              required
              placeholder="Your current password"
            />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </div>
          <button type="submit" className="btn btn-green" disabled={changingPw}>
            {changingPw ? 'Updating...' : '🔑 Update Password'}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="settings-section" style={{ borderColor: 'rgba(255,77,106,0.2)' }}>
        <div className="settings-section-title" style={{ color: 'var(--red)' }}>⚠️ Account</div>
        <button className="btn btn-red" onClick={logout}>
          Logout from this device
        </button>
      </div>
    </div>
  );
}
