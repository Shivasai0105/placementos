import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { DSA_INTERVIEW, MERN_INTERVIEW, CORE_CS_INTERVIEW } from '../data/interviewPrep';

const TABS = [
  { key: 'dsa', label: 'DSA Mastery', data: DSA_INTERVIEW, color: 'var(--green)' },
  { key: 'mern', label: 'MERN Stack', data: MERN_INTERVIEW, color: 'var(--blue)' },
  { key: 'cs', label: 'Core CS', data: CORE_CS_INTERVIEW, color: 'var(--purple)' },
];

export default function InterviewPrep() {
  const { request } = useApi();
  const [progress, setProgress] = useState({ interviewReviewed: {} });
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dsa');
  const [search, setSearch] = useState('');

  const fetchProgress = useCallback(async () => {
    try {
      const [data, statsData, appsData] = await Promise.all([
        request('/api/progress'),
        request('/api/progress/stats'),
        request('/api/applications')
      ]);
      setProgress({ interviewReviewed: data.interviewReviewed || {} });
      setStats(statsData);
      
      const nextInterview = appsData.find(a => a.status === 'interview');
      setUpcoming(nextInterview || null);
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

  // Stats
  const totalQuestions = TABS.reduce((sum, tab) => sum + tab.data.reduce((s, cat) => s + cat.questions.length, 0), 0);
  const doneQuestions = Object.keys(progress.interviewReviewed).filter(k => progress.interviewReviewed[k]).length;
  const readiness = totalQuestions > 0 ? Math.round((doneQuestions / totalQuestions) * 100) : 0;
  
  // Dynamic streak from stats
  const streak = stats?.streak || 0;

  const currentTab = TABS.find(t => t.key === activeTab);
  const q = search.trim().toLowerCase();

  const filteredData = currentTab.data.map(cat => ({
    ...cat,
    questions: q ? cat.questions.filter(item => item.q.toLowerCase().includes(q) || item.a?.toLowerCase().includes(q) || item.hint?.toLowerCase().includes(q)) : cat.questions,
  })).filter(cat => cat.questions.length > 0);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
      <div className="blink-cursor">LOADING HUB...</div>
    </div>
  );

  return (
    <div className="iph-sys">
      
      {/* ── TOP STATS WIDGETS ── */}
      <div className="iph-top-stats">
        {/* Readiness */}
        <div className="iph-stat-card readiness">
          <div className="iph-stat-header">PLACEMENT READINESS</div>
          <div className="iph-stat-body">
            <div className="iph-stat-big">{readiness}<span className="pct">%</span></div>
            <div className="iph-stat-sub green">+2% this session</div>
          </div>
          <div className="iph-stat-progress">
            <div className="iph-prog-track"><div className="iph-prog-fill" style={{ width: `${readiness}%` }} /></div>
          </div>
        </div>
        
        {/* Questions Solved */}
        <div className="iph-stat-card solved">
          <div className="iph-stat-header">QUESTIONS SOLVED</div>
          <div className="iph-stat-body">
            <div className="iph-stat-big">{doneQuestions} <span className="slash">/ {totalQuestions}</span></div>
          </div>
          <div className="iph-stat-segments">
            <div className={`iph-seg-${readiness > 25 ? 'fill' : 'empty'}`} />
            <div className={`iph-seg-${readiness > 50 ? 'fill' : 'empty'}`} />
            <div className={`iph-seg-${readiness > 75 ? 'fill' : 'empty'}`} />
            <div className={`iph-seg-${readiness === 100 ? 'fill' : 'empty'}`} />
          </div>
        </div>
        
        {/* Active Streak */}
        <div className="iph-stat-card streak">
          <div className="iph-stat-header">ACTIVE STREAK</div>
          <div className="iph-stat-body">
            <div className="iph-stat-big">{streak} <span className="days">DAYS</span></div>
          </div>
          <div className="iph-streak-icon">⚡</div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="iph-layout">
        
        {/* Left Sidebar: CORE TRACKS */}
        <div className="iph-sidebar">
          <div className="iph-sidebar-title">CORE TRACKS</div>
          
          <div className="iph-tracks">
            {TABS.map(tab => {
              const tabTotal = tab.data.reduce((s, cat) => s + cat.questions.length, 0);
              const tabDone = tab.data.reduce((s, cat) => s + cat.questions.filter(item => isReviewed(item.id)).length, 0);
              const isActive = activeTab === tab.key;
              
              return (
                <div 
                  key={tab.key} 
                  className={`iph-track-item ${isActive ? 'active' : ''}`}
                  onClick={() => { setActiveTab(tab.key); setSearch(''); }}
                >
                  <div className="iph-track-icon">{isActive ? '{}' : '❖'}</div>
                  <div className="iph-track-name">{tab.label}</div>
                  <div className="iph-track-score">{String(tabDone).padStart(2, '0')}/{tabTotal}</div>
                </div>
              );
            })}
          </div>

          <div className="iph-upcoming">
            <div className="iph-up-label">UPCOMING INTERVIEW</div>
            {upcoming ? (
              <>
                <div className="iph-up-company">{upcoming.company} • {upcoming.role}</div>
                <div className="iph-up-time">System configured for assessment</div>
                <div className="iph-up-bar"><div className="iph-up-fill" style={{width: '80%'}} /></div>
              </>
            ) : (
              <>
                <div className="iph-up-company" style={{color: 'var(--muted)'}}>None Scheduled</div>
                <div className="iph-up-time">Update your Tracker pipeline</div>
                <div className="iph-up-bar"><div className="iph-up-fill" style={{width: '0%'}} /></div>
              </>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="iph-content">
          
          {/* Controls */}
          <div className="iph-controls">
            <div className="iph-search-box">
              <span className="iph-sh-icon">&gt;_</span>
              <input 
                type="text" 
                className="iph-search-input" 
                placeholder="QUERY_PROBLEM_SET [SEARCH...]" 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <div className="iph-action-btns">
              <button className="iph-btn dark">DIFFICULTY</button>
              <button className="iph-btn dark">STATUS</button>
              <button className="iph-btn bright">RUN DAILY</button>
            </div>
          </div>

          {/* Module List */}
          <div className="iph-modules">
            {filteredData.length === 0 ? (
              <div className="iph-empty">NO RECORDS FOUND</div>
            ) : (
              filteredData.map((cat, ci) => (
                <div key={cat.topic || cat.category} className="iph-module">
                  
                  {/* Module Header */}
                  <div className="iph-mod-header">
                    <div className="iph-mod-title">
                      {cat.topic || cat.category} <span className="iph-mod-id">MODULE_{String(ci + 1).padStart(2,'0')}</span>
                    </div>
                    <div className="iph-mod-cols">
                      <span>DIFFICULTY</span>
                      <span>FREQUENCY</span>
                    </div>
                  </div>

                  {/* Rows */}
                  <div className="iph-mod-rows">
                    {cat.questions.map(item => {
                      const done = isReviewed(item.id);
                      // Use a deterministic pseudo random rate derived from the ID string for aesthetic stability
                      const idCharCode = item.id.charCodeAt(0) + (item.id.charCodeAt(item.id.length-1) || 0);
                      const rate = ((idCharCode % 70) + 25).toFixed(1);
                      
                      return (
                        <div key={item.id} className={`iph-row ${done ? 'done' : ''}`} onClick={() => toggleReviewed(item.id)}>
                          
                          <div className="iph-col-check">
                            <div className={`iph-checkbox ${done ? 'checked' : ''}`}>
                              {done && '✓'}
                            </div>
                          </div>
                          
                          <div className="iph-col-main">
                            <div className="iph-q-title">{item.q}</div>
                            <div className="iph-q-tags">
                              {item.tag && (
                                <span className={`iph-tag ${item.tag === 'easy' ? 'green' : item.tag === 'medium' ? 'blue' : 'red'}`}>
                                  {item.tag.toUpperCase()}
                                </span>
                              )}
                              <span className="iph-tag-plain">TAG: {(cat.topic || cat.category || 'CORE').toUpperCase().replace(/\s+/g, '_')}</span>
                            </div>
                          </div>
                          
                          <div className="iph-col-rate">
                            <div className="iph-rate-label">SUCCESS RATE</div>
                            <div className="iph-rate-val">{done ? '100.0' : rate}%</div>
                          </div>
                          
                          <div className="iph-col-action">
                            <button className="iph-play-btn" onClick={(e) => { e.stopPropagation(); toggleReviewed(item.id); }}>
                              ▶
                            </button>
                          </div>
                          
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))
            )}
            
            {/* Lock placeholder */}
            <div className="iph-lock-footer">
              🔒 COMPLETE MORE TASKS TO UNLOCK ADVANCED MODULES
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
