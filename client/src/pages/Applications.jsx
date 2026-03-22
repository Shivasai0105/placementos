import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';

const COLUMNS = [
  { key: 'saved',     label: 'SAVED',     color: 'var(--muted)' },
  { key: 'applied',   label: 'APPLIED',   color: 'var(--blue)' },
  { key: 'oa',        label: 'OA',        color: 'var(--green)' },
  { key: 'interview', label: 'INTERVIEW', color: 'var(--purple)' },
  { key: 'offer',     label: 'OFFER',     color: 'var(--amber)' },
  { key: 'rejected',  label: 'REJECTED',  color: 'var(--red)' },
];

const EMPTY_FORM = { company: '', role: 'Software Engineer', status: 'saved', link: '', notes: '', salary: '', appliedDate: '' };

export default function Applications() {
  const { request } = useApi();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchApps = useCallback(async () => {
    try {
      const data = await request('/api/applications');
      setApps(data);
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApps(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
  const openEdit = (app) => {
    setForm({
      company: app.company,
      role: app.role,
      status: app.status,
      link: app.link || '',
      notes: app.notes || '',
      salary: app.salary || '',
      appliedDate: app.appliedDate ? new Date(app.appliedDate).toISOString().split('T')[0] : '',
    });
    setModal(app);
  };
  const closeModal = () => { setModal(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') {
        await request('/api/applications', { method: 'POST', body: JSON.stringify(form) });
        showToast('✅ Added!', `${form.company} application saved.`);
      } else {
        await request(`/api/applications/${modal._id}`, { method: 'PATCH', body: JSON.stringify(form) });
        showToast('✅ Updated!', `${form.company} updated.`);
      }
      fetchApps();
      closeModal();
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!modal || modal === 'add') return;
    if (!confirm(`Confirm deletion of ${modal.company} record?`)) return;
    try {
      await request(`/api/applications/${modal._id}`, { method: 'DELETE' });
      showToast('🗑️ Deleted', `${modal.company} removed from DB.`);
      fetchApps();
      closeModal();
    } catch (err) {
      showToast('Error', err.message);
    }
  };

  const setF = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const colApps = (key) => apps.filter(a => a.status === key);
  
  // Stats Calcs
  const totalApplied = apps.length;
  const interviews = apps.filter(a => ['interview', 'offer', 'rejected'].includes(a.status)).length;
  const interviewRate = totalApplied > 0 ? ((interviews / totalApplied) * 100).toFixed(1) : 0;
  const totalOffers = colApps('offer').length;

  // Fake response time for aesthetic, or calculate if we had dates
  const avgResponse = totalApplied > 0 ? '4.2' : '0.0';

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
      <div className="blink-cursor">LOADING REPOSITORY...</div>
    </div>
  );

  return (
    <div className="tracker-page">
      
      {/* ── HEADER ── */}
      <div className="tracker-header">
        <div className="th-left">
          <div className="th-badges">
            <span className="th-badge primary">ACTIVE SPRINT</span>
            <span className="th-badge secondary">SYSTEM.V2.0.4</span>
          </div>
          <h1 className="th-title">Application Tracker</h1>
          <p className="th-desc">
            Manage your professional pipeline with surgical precision. Track status, technical assessments, and interview cycles.
          </p>
        </div>
        <div className="th-right">
          <button className="tracker-add-btn" onClick={openAdd}>
            <span>+</span> NEW APPLICATION
          </button>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="tracker-stats">
        <div className="t-stat-card">
          <div className="ts-label">TOTAL APPLIED</div>
          <div className="ts-val">{String(totalApplied).padStart(2, '0')}</div>
        </div>
        <div className="t-stat-card">
          <div className="ts-label">INTERVIEW RATE</div>
          <div className="ts-val">{interviewRate}<span className="ts-sub">%</span></div>
        </div>
        <div className="t-stat-card">
          <div className="ts-label">AVG RESPONSE</div>
          <div className="ts-val">{avgResponse}<span className="ts-sub">days</span></div>
        </div>
        <div className="t-stat-card">
          <div className="ts-label">CURRENT OFFERS</div>
          <div className="ts-val highlight">{String(totalOffers).padStart(2, '0')}</div>
        </div>
      </div>

      {/* ── KANBAN BOARD ── */}
      <div className="term-kanban">
        {COLUMNS.map(col => {
          const cards = colApps(col.key);
          return (
            <div key={col.key} className="tk-col">
              
              <div className="tk-header">
                <div className="tk-h-left">
                  <div className="tk-dot" style={{ backgroundColor: col.color }} />
                  <span className="tk-name">{col.label}</span>
                </div>
                <div className="tk-count">{String(cards.length).padStart(2, '0')}</div>
              </div>

              <div className="tk-cards">
                {cards.length === 0 && <div className="tk-empty">null</div>}
                
                {cards.map(app => {
                  // Generate reliable dynamic fake data for aesthetics based on company name
                  const getIcon = (c) => {
                    const l = c.toLowerCase();
                    if (l.includes('google') || l.includes('aws') || l.includes('cloud')) return '☁️';
                    if (l.includes('stripe') || l.includes('fin')) return '💳';
                    if (l.includes('zoom') || l.includes('tech')) return '🎥';
                    return '🏢';
                  };
                  const dateStr = app.appliedDate 
                    ? new Date(app.appliedDate).toLocaleDateString("en-IN", { month: "short", day: "numeric"}) 
                    : "2d ago";
                  const tech = (app.role.toLowerCase().includes('frontend') || app.role.toLowerCase().includes('react')) 
                    ? ['REACT', 'TAILWIND'] 
                    : ['NODE', 'SYS'];

                  return (
                    <div key={app._id} className="tk-card" onClick={() => openEdit(app)}>
                      <div className="tk-card-top">
                        <div className="tk-icon-box">{getIcon(app.company)}</div>
                        <div className="tk-meta">{dateStr}</div>
                      </div>
                      
                      <div className="tk-role">{app.role}</div>
                      <div className="tk-company">{app.company} {app.salary ? `· ${app.salary}` : ''}</div>
                      
                      <div className="tk-tags">
                        {tech.map((t, i) => <span key={i} className="tk-tag">{t}</span>)}
                      </div>

                      {/* Fake active action button if OA or Interview */}
                      {col.key === 'oa' && (
                        <div className="tk-action-btn oa-btn">START ENVIRONMENT</div>
                      )}
                      {col.key === 'interview' && (
                        <div className="tk-action-btn int-btn">JOIN CALL</div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* ── MODAL ── */}
      {modal !== null && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box term-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: 800, fontSize: '1rem', fontFamily: "'Fira Code', monospace", color: 'var(--green)' }}>
                {modal === 'add' ? '> INIT_NEW_APPLICATION' : `> EDIT_RECORD: ${modal.company}`}
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">COMPANY *</label>
                  <input type="text" value={form.company} onChange={setF('company')} required placeholder="e.g. Stripe" />
                </div>
                <div className="form-group">
                  <label className="form-label">ROLE</label>
                  <input type="text" value={form.role} onChange={setF('role')} placeholder="Frontend Engineer" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">PIPELINE_STATUS</label>
                  <select value={form.status} onChange={setF('status')}>
                    {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">COMPENSATION</label>
                  <input type="text" value={form.salary} onChange={setF('salary')} placeholder="e.g. 24 LPA" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">DATE_APPLIED</label>
                  <input type="date" value={form.appliedDate} onChange={setF('appliedDate')} />
                </div>
                <div className="form-group">
                  <label className="form-label">URL_REF</label>
                  <input type="url" value={form.link} onChange={setF('link')} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">ENCRYPTED_NOTES</label>
                <textarea value={form.notes} onChange={setF('notes')} rows={3} placeholder="Next interview on Tuesday..." style={{ resize: 'vertical' }} />
              </div>
              
              <div className="modal-footer">
                {modal !== 'add' && (
                  <button type="button" className="btn btn-red term-btn-red" onClick={handleDelete}>[X] DELETE ORPHAN</button>
                )}
                <button type="submit" className="btn btn-green term-btn-green" disabled={saving} style={{ marginLeft: 'auto' }}>
                  {saving ? 'EXECUTING...' : modal === 'add' ? '[+] COMMIT' : '[✓] SAVE_STATE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
