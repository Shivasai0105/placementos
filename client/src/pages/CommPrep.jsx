import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { COMM_PREP } from '../data/commPrep';

export default function CommPrep() {
  const { request } = useApi();
  const [progress, setProgress] = useState({ commPrepDays: {} });
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState(0);
  const [streak, setStreak] = useState(0);

  const fetchProgress = useCallback(async () => {
    try {
      const data = await request('/api/progress');
      setProgress({ commPrepDays: data.commPrepDays || {} });
      // Calculate a fake or real streak based on days done consecutively, using basic total for aesthetic now
      setStreak(Object.values(data.commPrepDays || {}).filter(Boolean).length);
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProgress(); }, []);

  const toggleDay = async (dayNum) => {
    try {
      await request('/api/progress/comm-day', {
        method: 'POST',
        body: JSON.stringify({ day: dayNum }),
      });
      setProgress(prev => ({
        commPrepDays: { ...prev.commPrepDays, [dayNum]: !prev.commPrepDays[dayNum] }
      }));
    } catch (err) {
      showToast('Error', err.message);
    }
  };

  const isDone = (dayNum) => !!progress.commPrepDays[dayNum];

  const totalDays = COMM_PREP.reduce((s, p) => s + p.days.length, 0);
  const doneDays = Object.values(progress.commPrepDays).filter(Boolean).length;
  const readiness = totalDays > 0 ? Math.round((doneDays / totalDays) * 100) : 0;

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
      <div className="blink-cursor">LOADING PROTOCOLS...</div>
    </div>
  );

  const phase = COMM_PREP[activePhase];

  return (
    <div className="comm-sys">
      
      {/* ── HEADER ── */}
      <div className="comm-header">
        <div className="ch-left">
          <div className="ch-label">OPERATION: ELOQUENCE</div>
          <h1 className="ch-title">
            COMMUNICATION <br />
            <span className="ch-highlight">PREP 2.0</span>
          </h1>
          <p className="ch-desc">
            A rigorous 30-day technical speaking protocol designed to eliminate verbal friction and command authority in engineering interviews.
          </p>
        </div>
        
        <div className="ch-right">
          <div className="ch-stats-box">
            <div className="ch-stat">
              <div className="ch-stat-label">READINESS</div>
              <div className="ch-stat-val">{readiness}<span className="ch-pct">%</span></div>
            </div>
            <div className="ch-stat border-l">
              <div className="ch-stat-label">DAY STREAK</div>
              <div className="ch-stat-val">{streak}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PHASE CARDS ── */}
      <div className="comm-phases">
        {COMM_PREP.map((p, i) => {
          // Determine state based on progression (for demo, just first is active, rest locked unless done)
          const isPhaseActive = activePhase === i;
          const isLocked = i > 0 && !isDone(COMM_PREP[i-1].days[COMM_PREP[i-1].days.length-1].day);
          
          let stateClass = '';
          if (isPhaseActive) stateClass = 'active';
          else if (isLocked) stateClass = 'locked';

          return (
            <div key={i} className={`cp-card ${stateClass}`} onClick={() => !isLocked && setActivePhase(i)}>
              <div className="cp-state-label">
                {isPhaseActive ? 'CURRENT PHASE' : isLocked ? 'LOCKED' : 'AVAILABLE'}
              </div>
              <div className="cp-title">PHASE {i + 1}: <br/>{p.phase.split(':')[0]}</div>
              <div className="cp-desc">
                Days {p.days[0].day}-{p.days[p.days.length-1].day} · {p.phase.split(':')[1] || 'Mechanics'}
              </div>
            </div>
          );
        })}
        
        {/* Exam Mode Dummy Card */}
        <div className="cp-card exam-mode">
          <div className="em-icon">☕</div>
          <div className="em-label">EXAM MODE</div>
        </div>
      </div>

      {/* ── MISSIONS ── */}
      <div className="comm-missions">
        <div className="cm-header">
          <div className="cm-h-left">
            <h2 className="cm-title">DAILY MISSIONS</h2>
            <span className="cm-badge">ACTIVE WEEK 0{Math.floor(activePhase/2) + 1}</span>
          </div>
          <button className="cm-filter-btn">
            <span className="cm-filter-icon">▼</span> FILTER TASKS
          </button>
        </div>

        <div className="cm-list">
          {phase.days.map((day) => {
            const done = isDone(day.day);
            const isNext = !done && phase.days.find(d => !isDone(d.day))?.day === day.day;
            
            return (
              <div key={day.day} className={`cm-row ${done ? 'done' : isNext ? 'next' : ''}`}>
                
                {/* Number Box */}
                <div className="cm-num-box">
                  {done ? '✓' : String(day.day).padStart(2, '0')}
                </div>
                
                {/* Main Info */}
                <div className="cm-info">
                  <div className="cm-task-title">{day.title}</div>
                  <div className="cm-task-tags">
                    <span className={`cm-tag ${day.category === 'core' ? 'green' : 'blue'}`}>
                      {day.category.toUpperCase()}
                    </span>
                    <span className="cm-tag time">{Math.max(15, Math.floor(day.title.length/2))} MINS</span>
                  </div>
                </div>
                
                {/* Actions / Status */}
                <div className="cm-actions">
                  <div className="cm-status-col">
                    <div className="cm-status-label">{done ? 'SCORE' : isNext ? 'STATUS' : 'PRIORITY'}</div>
                    <div className="cm-status-val">
                      {done ? '98%' : isNext ? <span className="val-in-progress">IN_PROGRESS</span> : 'STANDARD'}
                    </div>
                  </div>
                  
                  <button 
                    className={`cm-btn ${done ? 'review' : isNext ? 'launch' : 'brief'}`}
                    onClick={() => toggleDay(day.day)}
                  >
                    {done ? 'REVIEW' : isNext ? 'LAUNCH DRILL' : 'VIEW BRIEF'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
