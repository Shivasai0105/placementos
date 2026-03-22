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
  const globalMastery = totalAll > 0 ? ((doneAll / totalAll) * 100).toFixed(1) : '0.0';

  // Questions for active company
  const allCoQs = co.sections.flatMap(s => s.questions.map(q => ({ ...q, topic: s.topic })));
  
  const filteredQs = allCoQs.filter(q => {
    if (filter === 'all') return true;
    if (filter === 'unsolved') return !isDone(q.id);
    if (filter === 'bookmarked') return false; // Mock feature for "bookmarked" tab
    return true;
  });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
      <div className="blink-cursor">ACCESSING VAULT...</div>
    </div>
  );

  return (
    <div className="vault-sys">
      
      {/* ── HEADER ── */}
      <div className="vault-header">
        <div className="vh-left">
          <div className="vh-label">ARCHIVE_ACCESS // COMPANY_SPECIFIC</div>
          <h1 className="vh-title">
            <span className="vh-white">QUESTION</span><br/>
            <span className="vh-green">VAULT</span>
          </h1>
        </div>
        
        <div className="vh-right">
          <div className="vh-mastery-label">GLOBAL MASTERY</div>
          <div className="vh-mastery-val">{globalMastery}%</div>
          <div className="vh-mastery-bar-bg">
            <div className="vh-mastery-bar-fill" style={{ width: `${globalMastery}%` }} />
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="vault-grid">
        
        {/* Sidebar: Companies */}
        <div className="vault-sidebar">
          <div className="vs-header">
            <div className="vs-dot green" /> SELECTED_SECTOR
          </div>
          
          <div className="vs-list">
            {COMPANY_QUESTIONS.map((c, i) => {
              const ct = c.sections.reduce((s, sec) => s + sec.questions.length, 0);
              const cd = c.sections.reduce((s, sec) => s + sec.questions.filter(q => isDone(q.id)).length, 0);
              const pct = ct > 0 ? Math.round((cd / ct) * 100) : 0;
              const isActive = activeCompany === i;
              
              return (
                <div 
                  key={c.company} 
                  className={`vs-item ${isActive ? 'active' : ''}`}
                  onClick={() => { setActiveCompany(i); setFilter('all'); }}
                >
                  <div className="vs-item-unit">UNIT_0{i + 1}</div>
                  <div className="vs-item-name">{c.company}</div>
                  <div className="vs-item-stats">
                    <span className="vs-stat-done">{cd}/{ct} solved</span>
                    <span className="vs-stat-pct">{pct}%</span>
                  </div>
                  {isActive && <div className="vs-item-active-bar" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content: Questions */}
        <div className="vault-content">
          
          {/* Tabs */}
          <div className="vc-tabs">
            {['all', 'unsolved', 'bookmarked'].map(t => (
              <button 
                key={t}
                className={`vc-tab ${filter === t ? 'active' : ''}`}
                onClick={() => setFilter(t)}
              >
                {t === 'all' ? 'ALL PROBLEMS' : t.toUpperCase()}
              </button>
            ))}
            
            <div className="vc-tab-spacer" />
            
            <div className="vc-tab-icon">▼ ≡</div>
          </div>

          {/* Question List */}
          <div className="vc-list">
            {filteredQs.length === 0 ? (
              <div className="vc-empty">NO RECORDS FOUND</div>
            ) : (
              filteredQs.map((q, idx) => {
                const done = isDone(q.id);
                // Fake sub-tags for aesthetic mapping from diff/topic
                const tags = [q.topic.toUpperCase().replace(/\s+/g, '_')]; 
                if (q.q.toLowerCase().includes('frequency')) tags.push('HIGH FREQUENCY');
                if (q.q.toLowerCase().includes('essential')) tags.push('ESSENTIAL');
                
                return (
                  <div key={q.id} className={`vc-row ${done ? 'done' : ''}`} onClick={() => toggleQ(q.id)}>
                    <div className="vc-num">{String(idx + 1).padStart(2, '0')}</div>
                    
                    <div className="vc-info">
                      <div className="vc-q-title">
                        {q.q} 
                        {done && <span className="vc-done-icon">✓</span>}
                      </div>
                      
                      <div className="vc-q-tags">
                        {tags.map((t, i) => (
                          <span key={i} className="vc-tag plain">{t}</span>
                        ))}
                        <span className={`vc-tag diff-${q.diff === 'medium' ? 'med' : q.diff}`}>
                          {q.diff.toUpperCase()}
                        </span>
                        {done && <span className="vc-tag plain">✓ COMPLETED</span>}
                        {q.q.toLowerCase().includes('essential') && <span className="vc-tag plain">★ ESSENTIAL</span>}
                      </div>
                    </div>
                    
                    <div className="vc-action">
                      <button 
                        className={`vc-solve-btn ${done ? 'muted' : 'active'}`}
                        onClick={(e) => { e.stopPropagation(); toggleQ(q.id); }}
                      >
                        {done ? 'REVIEW_TASK' : 'SOLVE_TASK'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
        </div>
        
      </div>

      {/* ── FOOTER LOGS ── */}
      <div className="vault-footer">
        <span className="vf-metric"><span className="vf-key">SYS_LOG:</span> QUESTIONS REFRESHED FROM 2024 PLACEMENT CYCLE</span>
        <span className="vf-metric"><span className="vf-key">BUFFER:</span> 42 PENDING SUBMISSIONS IN QUEUE</span>
        <span className="vf-metric"><span className="vf-key">LOC:</span> GLOBAL_MAINFRAME_CHENNAI</span>
      </div>

    </div>
  );
}
