import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { PROBLEMS } from '../data/problems';

export default function Problems() {
  const { request } = useApi();
  const [progress, setProgress] = useState({ tasks: {}, problems: {} });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, easy, medium, hard
  const [search, setSearch] = useState('');

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

  // Normalize search query
  const q = search.trim().toLowerCase();

  const getFiltered = (problems) => {
    let list = filter === 'all' ? problems : problems.filter(p => p.diff === filter);
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || String(p.lc).includes(q));
    return list;
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
      <div className="blink-cursor">QUERYING REPOSITORY...</div>
    </div>
  );

  return (
    <div className="problems-sys">
      
      {/* ── HEADER ── */}
      <div className="pb-header">
        <div className="pb-label">CORE REPOSITORY</div>
        <h1 className="pb-title">
          PROBLEM_BANK<span className="pb-ext">.sys</span>
        </h1>
      </div>

      {/* ── CONTROLS ── */}
      <div className="pb-controls">
        <div className="pb-search-wrapper">
          <span className="pb-search-icon">{'🔍'}</span>
          <input
            type="text"
            className="pb-search"
            placeholder="QUERY_PROBLEM_NAME_OR_TAG..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
        
        <div className="pb-filters">
          {['all', 'easy', 'medium', 'hard'].map(f => (
            <button 
              key={f} 
              className={`pb-filter-btn ${filter === f ? 'active' : ''}`} 
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── PROBLEM SECTIONS ── */}
      <div className="pb-list">
        {PROBLEMS.map(section => {
          const filtered = getFiltered(section.problems);
          if (filtered.length === 0) return null;
          
          const titleFmt = section.topic.toUpperCase().replace(/\s+/g, '_');

          return (
            <div key={section.topic} className="pb-section">
              <div className="pb-section-header">
                <span className="pb-sec-title">{titleFmt}</span>
                <span className="pb-sec-count">COUNT: {filtered.length}</span>
              </div>
              
              <div className="pb-rows">
                {filtered.map(p => {
                  const done = isDone(p.id);
                  // Generate fake tags for aesthetic if missing
                  const tags = (p.name.toLowerCase().includes('tree') || p.name.toLowerCase().includes('graph'))
                    ? ['DFS', 'BFS'] : ['HASH_MAP', 'ARRAY'];

                  return (
                    <div
                      key={p.id}
                      className={`pb-row ${done ? 'done' : ''}`}
                      onClick={() => toggleProb(p.id)}
                    >
                      <div className="pb-col-num">{String(p.lc || p.id).padStart(3, '0')}</div>
                      
                      <div className="pb-col-main">
                        <div className="pb-prob-title">{p.name}</div>
                        <div className="pb-prob-tags">
                          {tags.map((t, idx) => <span key={idx}>{t}</span>)}
                        </div>
                      </div>
                      
                      <div className="pb-col-diff">
                        <span className={`pb-badge diff-${p.diff === 'medium' ? 'med' : p.diff}`}>
                          {p.diff.toUpperCase()}
                        </span>
                      </div>
                      
                      {done && (
                        <div className="pb-col-status">
                          <span className="pb-status-icon">✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Empty state when searching */}
        {q && PROBLEMS.every(sec => getFiltered(sec.problems).length === 0) && (
          <div className="pb-empty">
            <span className="blink-cursor">&gt; NO_RESULTS_FOUND</span>
          </div>
        )}
      </div>

    </div>
  );
}
