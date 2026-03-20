import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { PROBLEMS } from '../data/problems';

export default function Problems() {
  const { request } = useApi();
  const [progress, setProgress] = useState({ tasks: {}, problems: {} });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, easy, medium, hard

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

  const toggleProb = async (problemId) => {
    try {
      await request('/api/progress/problem', {
        method: 'POST',
        body: JSON.stringify({ problemId }),
      });
      fetchProgress();
    } catch (err) {
      showToast('Error', err.message);
    }
  };

  const isDone = (id) => !!progress.problems[`p_${id}`];

  const total = PROBLEMS.reduce((s, sec) => s + sec.problems.length, 0);
  const done = PROBLEMS.reduce((s, sec) => s + sec.problems.filter(p => isDone(p.id)).length, 0);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>Loading problems...</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 800 }}>
          Problem Bank <span style={{ color: 'var(--green)' }}>{done}/{total}</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: 'var(--muted)' }}>
          {Math.round(done / total * 100)}% COMPLETE
        </div>
      </div>

      <div className="prog-bar" style={{ marginBottom: '16px', height: '4px' }}>
        <div className="prog-fill" style={{ width: `${Math.round(done / total * 100)}%` }} />
      </div>

      {/* Filter tabs */}
      <div className="tabs">
        {['all', 'easy', 'medium', 'hard'].map(f => (
          <button key={f} className={`tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Problem Sections */}
      {PROBLEMS.map(section => {
        const filtered = filter === 'all' ? section.problems : section.problems.filter(p => p.diff === filter);
        if (filtered.length === 0) return null;
        const secDone = filtered.filter(p => isDone(p.id)).length;

        return (
          <div key={section.topic} className="prob-section">
            <div className="prob-section-title">
              {section.topic} ({secDone}/{filtered.length})
            </div>
            {filtered.map(p => (
              <div
                key={p.id}
                className={`prob-item${isDone(p.id) ? ' done' : ''}`}
                onClick={() => toggleProb(p.id)}
              >
                <div className="prob-check"><span className="prob-tick">✓</span></div>
                <div className="prob-num">{p.lc}</div>
                <div className="prob-name">{p.name}</div>
                <span className={`prob-diff diff-${p.diff === 'medium' ? 'med' : p.diff}`}>
                  {p.diff.toUpperCase()}
                </span>
                <div className="prob-topic">{section.topic.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
