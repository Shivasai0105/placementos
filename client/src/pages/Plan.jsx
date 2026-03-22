import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { PLAN } from '../data/plan';
import { useAuth } from '../context/AuthContext';

export default function Plan() {
  const { user } = useAuth();
  const { request } = useApi();
  const [progress, setProgress] = useState({ tasks: {}, problems: {} });
  const [loading, setLoading] = useState(true);

  /* ── compute current week ── */
  const getDayOffset = () => {
    const s = new Date(user?.startDate || Date.now());
    s.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.max(0, Math.floor((t - s) / 86400000));
  };
  const offset = getDayOffset();
  const currentWeek = Math.min(Math.floor(offset / 7), PLAN.length - 1);

  /* ── data fetching ── */
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

  const toggleTask = async (week, day, taskIndex) => {
    try {
      await request('/api/progress/task', {
        method: 'POST',
        body: JSON.stringify({ week, day, taskIndex }),
      });
      fetchProgress();
    } catch (err) {
      showToast('Error', err.message);
    }
  };

  /* ── global stats ── */
  const totalTasks = PLAN.reduce((s, w) => s + w.days.reduce((ss, d) => ss + d.tasks.length, 0), 0);
  const doneTasks = Object.keys(progress.tasks || {}).filter(k => progress.tasks[k]).length;
  const readiness = totalTasks > 0 ? ((doneTasks / totalTasks) * 100).toFixed(1) : '0.0';

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
      <div className="blink-cursor">LOADING TIMELINE...</div>
    </div>
  );

  return (
    <div className="roadmap-sys">

      {/* ── HEADER ── */}
      <div className="rm-header">
        <div className="rm-h-left">
          <div className="rm-label">SYSTEM.INITIALIZATION // {new Date().getFullYear()}_Q{Math.ceil((new Date().getMonth() + 1) / 3)}</div>
          <h1 className="rm-title">ROADMAP</h1>
        </div>
        <div className="rm-h-right">
          <div className="rm-readiness-box">
            <div className="rm-read-label">OVERALL READINESS</div>
            <div className="rm-read-val">{readiness}<span className="rm-pct">%</span></div>
          </div>
        </div>
      </div>

      {/* ── TIMELINE CONTAINER ── */}
      <div className="rm-timeline">
        <div className="rm-center-line"></div>

        {PLAN.map((week, wi) => {
          const isActive = wi === currentWeek;
          const isPast = wi < currentWeek;
          const isLocked = wi > currentWeek;
          
          const isLeft = wi % 2 === 0; // alternate layout
          
          /* Calculate week progress */
          const weekTotal = week.days.reduce((s, d) => s + d.tasks.length, 0);
          const weekDone = week.days.reduce((s, d, di) =>
            s + d.tasks.filter((_, ti) => progress.tasks[`w${wi}d${di}t${ti}`]).length, 0);

          return (
            <div key={wi} className={`rm-node ${isLeft ? 'left' : 'right'} ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''} ${isPast ? 'past' : ''}`}>
              
              {/* Giant Background Number */}
              <div className="rm-giant-bg">{String(wi + 1).padStart(2, '0')}</div>

              {/* Center Dot */}
              <div className="rm-center-dot">
                <div className="rm-dot-inner">{isLocked ? '🔒' : isActive ? <div className="dot-pulse" /> : '✓'}</div>
              </div>

              {/* Card */}
              <div className="rm-card-content">
                <div className="rm-card-inner">
                  
                  <div className="rm-card-header">
                    <h2 className="rm-week-title">Week {wi + 1}: {week.theme}</h2>
                    {isActive && <span className="rm-badge-active">ACTIVE_CYCLE</span>}
                    {isLocked && <span className="rm-badge-locked">LOCKED</span>}
                    {isPast && <span className="rm-badge-past">{weekDone}/{weekTotal} DONE</span>}
                  </div>

                  <p className="rm-week-desc">{week.focus}</p>

                  {/* Extract unique tags for this week to show as pills */}
                  <div className="rm-week-tags">
                    {Array.from(new Set(week.days.flatMap(d => d.tasks.map(t => t.tag)))).slice(0, 4).map(tag => (
                      <span key={tag} className="rm-tag">● {tag.toUpperCase()}</span>
                    ))}
                  </div>

                  {/* If active, show interactive task list directly inside the card */}
                  {isActive && (
                    <div className="rm-active-tasks">
                      {week.days.map((day, di) =>
                        day.tasks.map((task, ti) => {
                          const key = `w${wi}d${di}t${ti}`;
                          const isDone = !!progress.tasks[key];
                          return (
                            <div key={key} className={`rm-task-row ${isDone ? 'done' : ''}`} onClick={() => toggleTask(wi, di, ti)}>
                              <div className="rm-t-check">{isDone ? '✓' : ''}</div>
                              <div className="rm-t-name">{task.name} <span className="rm-t-diff">· {task.tag.toUpperCase()}</span></div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
