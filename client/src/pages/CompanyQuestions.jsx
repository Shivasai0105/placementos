import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { COMPANY_QUESTIONS } from '../data/companyQuestions';

export default function CompanyQuestions() {
  const { request } = useApi();
  const [progress, setProgress] = useState({ tasks: {}, problems: {} });
  const [loading, setLoading] = useState(true);
  const [activeCompany, setActiveCompany] = useState(0);
  const [filter, setFilter] = useState('all');

  const fetchProgress = useCallback(async () => {
    try {
      const data = await request('/api/progress');
      setProgress(data);
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProgress(); }, []);

  const toggleQ = async (qId) => {
    // Reuse the existing /problem endpoint — stored as p_cpq_<id>
    try {
      await request('/api/progress/problem', {
        method: 'POST',
        body: JSON.stringify({ problemId: `cpq_${qId}` }),
      });
      fetchProgress();
    } catch (err) {
      showToast('Error', err.message);
    }
  };

  const isDone = (qId) => !!progress.problems[`p_cpq_${qId}`];

  const co = COMPANY_QUESTIONS[activeCompany];

  // Total stats across all companies
  const totalAll = COMPANY_QUESTIONS.reduce((s, c) => s + c.sections.reduce((ss, sec) => ss + sec.questions.length, 0), 0);
  const doneAll = COMPANY_QUESTIONS.reduce((s, c) =>
    s + c.sections.reduce((ss, sec) => ss + sec.questions.filter(q => isDone(q.id)).length, 0), 0);

  // Per-company stats
  const companyTotal = co.sections.reduce((s, sec) => s + sec.questions.length, 0);
  const companyDone = co.sections.reduce((s, sec) => s + sec.questions.filter(q => isDone(q.id)).length, 0);

  const getFiltered = (questions) =>
    filter === 'all' ? questions : questions.filter(q => q.diff === filter);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>Loading questions…</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>🏢 Company Questions</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: 'var(--muted)' }}>
          {doneAll}/{totalAll} TOTAL DONE
        </div>
      </div>
      <div className="prog-bar" style={{ marginBottom: '20px', height: '4px' }}>
        <div className="prog-fill" style={{ width: `${Math.round(doneAll / totalAll * 100)}%` }} />
      </div>

      {/* Company Tabs */}
      <div className="cq-company-tabs">
        {COMPANY_QUESTIONS.map((c, i) => {
          const ct = c.sections.reduce((s, sec) => s + sec.questions.length, 0);
          const cd = c.sections.reduce((s, sec) => s + sec.questions.filter(q => isDone(q.id)).length, 0);
          return (
            <button
              key={c.company}
              className={`cq-company-tab${activeCompany === i ? ' active' : ''}`}
              style={activeCompany === i ? { borderColor: c.border, color: c.color, background: c.bg } : {}}
              onClick={() => { setActiveCompany(i); setFilter('all'); }}
            >
              <span>{c.company}</span>
              <span className="cq-tab-count" style={activeCompany === i ? { color: c.color } : {}}>
                {cd}/{ct}
              </span>
            </button>
          );
        })}
      </div>

      {/* Company details banner */}
      <div className="cq-banner" style={{ borderColor: co.border, background: co.bg }}>
        <div className="cq-banner-name" style={{ color: co.color }}>{co.company}</div>
        <div className="cq-banner-desc">{co.description}</div>
        <div className="cq-banner-progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '5px', fontFamily: "'JetBrains Mono',monospace" }}>
            <span>PROGRESS</span>
            <span>{companyDone}/{companyTotal}</span>
          </div>
          <div className="prog-bar"><div className="prog-fill" style={{ width: `${Math.round(companyDone / companyTotal * 100)}%` }} /></div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="tabs">
        {['all', 'easy', 'medium', 'hard'].map(f => (
          <button key={f} className={`tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Questions */}
      {co.sections.map(section => {
        const filtered = getFiltered(section.questions);
        if (filtered.length === 0) return null;
        const secDone = filtered.filter(q => isDone(q.id)).length;
        return (
          <div key={section.topic} className="prob-section">
            <div className="prob-section-title">{section.topic} ({secDone}/{filtered.length})</div>
            {filtered.map(q => (
              <div
                key={q.id}
                className={`cq-item${isDone(q.id) ? ' done' : ''}`}
                onClick={() => toggleQ(q.id)}
              >
                <div className="prob-check"><span className="prob-tick">✓</span></div>
                <div className="cq-question">{q.q}</div>
                <span className={`prob-diff diff-${q.diff === 'medium' ? 'med' : q.diff}`}>
                  {q.diff.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
