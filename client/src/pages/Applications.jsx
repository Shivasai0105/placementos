import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';

const COLUMNS = [
  { key: 'saved',     label: '💾 Saved',     color: 'var(--muted2)' },
  { key: 'applied',   label: '📤 Applied',    color: 'var(--blue)' },
  { key: 'oa',        label: '📝 OA',         color: 'var(--amber)' },
  { key: 'interview', label: '🎤 Interview',  color: 'var(--purple)' },
  { key: 'offer',     label: '✅ Offer',      color: 'var(--green)' },
  { key: 'rejected',  label: '❌ Rejected',   color: 'var(--red)' },
];

const EMPTY_FORM = { company: '', role: 'Software Engineer', status: 'saved', link: '', notes: '', salary: '', appliedDate: '' };

export default function Applications() {
  const { request } = useApi();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);   // null | 'add' | app object (edit)
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
    if (!confirm(`Delete ${modal.company} application?`)) return;
    try {
      await request(`/api/applications/${modal._id}`, { method: 'DELETE' });
      showToast('🗑️ Deleted', `${modal.company} removed.`);
      fetchApps();
      closeModal();
    } catch (err) {
      showToast('Error', err.message);
    }
  };

  const moveStatus = async (app, newStatus) => {
    try {
      await request(`/api/applications/${app._id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
      fetchApps();
    } catch (err) {
      showToast('Error', err.message);
    }
  };

  const setF = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const colApps = (key) => apps.filter(a => a.status === key);
  const totalOffers = colApps('offer').length;
  const totalApplied = apps.length;

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>Loading applications...</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>📋 Application Tracker</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: 'var(--muted)', marginTop: '3px', letterSpacing: '1px' }}>
            {totalApplied} TOTAL · {totalOffers} OFFER{totalOffers !== 1 ? 'S' : ''}
          </div>
        </div>
        <button className="btn btn-green" onClick={openAdd}>+ New Application</button>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {COLUMNS.map(col => {
          const cards = colApps(col.key);
          return (
            <div key={col.key} className="kanban-col">
              <div className="kanban-col-header" style={{ color: col.color }}>
                <span>{col.label}</span>
                <span className="kanban-count">{cards.length}</span>
              </div>
              <div className="kanban-cards">
                {cards.length === 0 && (
                  <div className="kanban-empty">No applications</div>
                )}
                {cards.map(app => (
                  <div key={app._id} className="kanban-card" onClick={() => openEdit(app)}>
                    <div className="kc-company">{app.company}</div>
                    <div className="kc-role">{app.role}</div>
                    {app.salary && <div className="kc-salary">💰 {app.salary}</div>}
                    {app.appliedDate && (
                      <div className="kc-date">
                        {new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    )}
                    {/* Quick move arrows */}
                    <div className="kc-actions" onClick={e => e.stopPropagation()}>
                      {COLUMNS.findIndex(c => c.key === app.status) > 0 && (
                        <button
                          className="kc-move"
                          title="Move back"
                          onClick={() => moveStatus(app, COLUMNS[COLUMNS.findIndex(c => c.key === app.status) - 1].key)}
                        >◀</button>
                      )}
                      {COLUMNS.findIndex(c => c.key === app.status) < COLUMNS.length - 1 && (
                        <button
                          className="kc-move"
                          title="Move forward"
                          onClick={() => moveStatus(app, COLUMNS[COLUMNS.findIndex(c => c.key === app.status) + 1].key)}
                        >▶</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {apps.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📋</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>No applications yet</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted2)', marginBottom: '20px' }}>Start tracking your placement journey</div>
          <button className="btn btn-green" onClick={openAdd}>+ Add Your First Application</button>
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                {modal === 'add' ? '+ New Application' : `✏️ ${modal.company}`}
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company *</label>
                  <input type="text" value={form.company} onChange={setF('company')} required placeholder="e.g. Zoho" />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input type="text" value={form.role} onChange={setF('role')} placeholder="Software Engineer" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select value={form.status} onChange={setF('status')}>
                    {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">CTC / Salary</label>
                  <input type="text" value={form.salary} onChange={setF('salary')} placeholder="e.g. 12 LPA" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Apply Date</label>
                  <input type="date" value={form.appliedDate} onChange={setF('appliedDate')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Link</label>
                  <input type="url" value={form.link} onChange={setF('link')} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea value={form.notes} onChange={setF('notes')} rows={3} placeholder="Interview rounds, contact info, next steps…" style={{ resize: 'vertical' }} />
              </div>
              <div className="modal-footer">
                {modal !== 'add' && (
                  <button type="button" className="btn btn-red" onClick={handleDelete}>🗑️ Delete</button>
                )}
                <button type="submit" className="btn btn-green" disabled={saving} style={{ marginLeft: 'auto' }}>
                  {saving ? 'Saving…' : modal === 'add' ? '+ Add' : '✓ Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
