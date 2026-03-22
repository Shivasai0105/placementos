import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { DSA_INTERVIEW, MERN_INTERVIEW, CORE_CS_INTERVIEW } from '../data/interviewPrep';

const TAG_STYLES = {
  easy: { bg: 'rgba(0,232,122,0.1)', color: 'var(--green)' },
  medium: { bg: 'rgba(255,184,0,0.1)', color: 'var(--amber)' },
  hard: { bg: 'rgba(255,77,106,0.1)', color: 'var(--red)' },
};

const TABS = [
  { key: 'dsa', label: '💻 DSA', data: DSA_INTERVIEW, color: 'var(--green)' },
  { key: 'mern', label: '🌐 MERN', data: MERN_INTERVIEW, color: 'var(--blue)' },
  { key: 'cs', label: '📚 Core CS', data: CORE_CS_INTERVIEW, color: 'var(--purple)' },
];

export default function InterviewPrep() {
  const { request } = useApi();
  const [progress, setProgress] = useState({ interviewReviewed: {} });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dsa');
  const [openQuestion, setOpenQuestion] = useState(null);
  const [search, setSearch] = useState('');

  const fetchProgress = useCallback(async () => {
    try {
      const data = await request('/api/progress');
      setProgress({ interviewReviewed: data.interviewReviewed || {} });
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProgress(); }, []);

  const toggleReviewed = async (qId) => {
    try {
      await request('/api/progress/interview-review', {
        method: 'POST',
        body: JSON.stringify({ questionId: qId }),
      });
      setProgress(prev => ({
        interviewReviewed: { ...prev.interviewReviewed, [qId]: !prev.interviewReviewed[qId] },
      }));
    } catch (err) {
      showToast('Error', err.message);
    }
  };

  const isReviewed = (qId) => !!progress.interviewReviewed[qId];

  // Compute totals per tab
  const getTabData = (key) => TABS.find(t => t.key === key);
  const totalForTab = (data) => data.reduce((s, cat) => s + cat.questions.length, 0);
  const doneForTab = (data) => data.reduce((s, cat) => s + cat.questions.filter(q => isReviewed(q.id)).length, 0);

  const q = search.trim().toLowerCase();
  const currentTab = getTabData(activeTab);

  const filteredData = currentTab.data.map(cat => ({
    ...cat,
    questions: q ? cat.questions.filter(item => item.q.toLowerCase().includes(q) || item.a?.toLowerCase().includes(q) || item.hint?.toLowerCase().includes(q)) : cat.questions,
  })).filter(cat => cat.questions.length > 0);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>Loading...</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
          💻 Interview Prep Hub
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {TABS.map(tab => {
            const done = doneForTab(tab.data);
            const total = totalForTab(tab.data);
            return (
              <div key={tab.key} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: 'var(--muted)' }}>
                <span style={{ color: tab.color }}>{tab.label.split(' ')[1]}</span>: {done}/{total}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(tab => {
          const done = doneForTab(tab.data);
          const total = totalForTab(tab.data);
          const pct = Math.round(done / total * 100);
          return (
            <button
              key={tab.key}
              className={`tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setSearch(''); setOpenQuestion(null); }}
            >
              {tab.label} · {pct}%
            </button>
          );
        })}
      </div>

      {/* Progress bar for current tab */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontFamily: "'JetBrains Mono',monospace", color: 'var(--muted)', marginBottom: '5px' }}>
          <span>{doneForTab(currentTab.data)} reviewed</span>
          <span>{totalForTab(currentTab.data) - doneForTab(currentTab.data)} remaining</span>
        </div>
        <div className="prog-bar" style={{ height: '3px' }}>
          <div className="prog-fill" style={{
            width: `${Math.round(doneForTab(currentTab.data) / totalForTab(currentTab.data) * 100)}%`,
            background: currentTab.color,
          }} />
        </div>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: '16px' }}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={`Search ${activeTab.toUpperCase()} questions…`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoComplete="off"
        />
        {search && <span className="search-clear" onClick={() => setSearch('')}>✕</span>}
      </div>

      {/* Question Sections */}
      {filteredData.map(cat => {
        const catDone = cat.questions.filter(q => isReviewed(q.id)).length;
        return (
          <div key={cat.topic || cat.category} style={{ marginBottom: '24px' }}>
            {/* Category Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '10px', paddingBottom: '8px', borderBottom: `2px solid ${currentTab.color}20`,
            }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted2)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {cat.topic || cat.category}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: catDone === cat.questions.length ? 'var(--green)' : 'var(--muted)' }}>
                {catDone}/{cat.questions.length}
              </div>
            </div>

            {/* Questions */}
            {cat.questions.map(item => {
              const done = isReviewed(item.id);
              const isOpen = openQuestion === item.id;

              return (
                <div key={item.id} style={{
                  background: 'var(--surface)',
                  border: `1px solid ${done ? 'rgba(0,232,122,0.25)' : 'var(--border)'}`,
                  borderRadius: '8px',
                  marginBottom: '6px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}>
                  {/* Question Row */}
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 13px', cursor: 'pointer', transition: 'background 0.15s' }}
                    onClick={() => setOpenQuestion(isOpen ? null : item.id)}
                  >
                    {/* Checkbox */}
                    <div
                      onClick={(e) => { e.stopPropagation(); toggleReviewed(item.id); }}
                      style={{
                        width: '16px', height: '16px', borderRadius: '3px', border: `1.5px solid ${done ? currentTab.color : 'var(--border2)'}`,
                        background: done ? currentTab.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', cursor: 'pointer',
                      }}
                    >
                      {done && <span style={{ color: '#000', fontSize: '9px', fontWeight: 900 }}>✓</span>}
                    </div>

                    {/* Question text */}
                    <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: done ? 400 : 600, color: done ? 'var(--muted2)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>
                      {item.q}
                    </div>

                    {/* Difficulty tag (DSA only) */}
                    {item.tag && (
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.52rem', padding: '2px 7px', borderRadius: '3px', flexShrink: 0, ...TAG_STYLES[item.tag] }}>
                        {item.tag.toUpperCase()}
                      </span>
                    )}

                    {/* Chevron */}
                    <span style={{ color: 'var(--muted)', fontSize: '0.6rem', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▼</span>
                  </div>

                  {/* Answer / Hint Panel */}
                  {isOpen && (
                    <div style={{ padding: '10px 15px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
                      {/* Hint or Answer */}
                      <div style={{
                        background: `${currentTab.color}08`, borderRadius: '6px', padding: '12px 14px',
                        borderLeft: `3px solid ${currentTab.color}`, marginBottom: '10px',
                      }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: currentTab.color, letterSpacing: '1px', marginBottom: '6px' }}>
                          {item.hint ? '💡 APPROACH HINT' : '✅ ANSWER'}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: '1.7' }}>
                          {item.hint || item.a}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleReviewed(item.id)}
                        style={{
                          width: '100%', padding: '7px', borderRadius: '5px', cursor: 'pointer',
                          fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.5px', fontWeight: 700,
                          background: done ? 'transparent' : currentTab.color,
                          color: done ? currentTab.color : '#000',
                          border: `1px solid ${currentTab.color}${done ? '50' : ''}`,
                          transition: 'all 0.2s',
                        }}
                      >
                        {done ? '✓ REVIEWED — CLICK TO RESET' : '✓ MARK AS REVIEWED'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.75rem' }}>
          No questions found for "{search}"
        </div>
      )}
    </div>
  );
}
