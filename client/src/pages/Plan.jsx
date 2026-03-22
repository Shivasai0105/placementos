import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { PLAN } from '../data/plan';
import { useAuth } from '../context/AuthContext';

const TAG_COLORS = {
  dsa:      { bg: 'rgba(0,232,122,0.12)',   color: 'var(--green)'  },
  oop:      { bg: 'rgba(155,109,255,0.12)', color: 'var(--purple)' },
  mern:     { bg: 'rgba(59,158,255,0.12)',  color: 'var(--blue)'   },
  aptitude: { bg: 'rgba(0,212,255,0.12)',   color: 'var(--cyan)'   },
  theory:   { bg: 'rgba(255,184,0,0.12)',   color: 'var(--amber)'  },
  project:  { bg: 'rgba(255,77,106,0.12)',  color: 'var(--red)'    },
  mock:     { bg: 'rgba(255,184,0,0.15)',   color: 'var(--amber)'  },
  system:   { bg: 'rgba(155,109,255,0.15)', color: 'var(--purple)' },
};

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
  const offset   = getDayOffset();
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
  const doneTasks  = Object.keys(progress.tasks || {}).filter(k => progress.tasks[k]).length;

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
      Loading plan…
    </div>
  );

  return (
    <div className="plan-page">

      {/* ── HEADER ── */}
      <div className="plan-header">
        <div className="plan-header-label">BATTLE PLAN PHASE 1</div>
        <h1 className="plan-header-title">8-Week<br />Roadmap</h1>
        <div className="plan-stats-row">
          <div className="plan-stat-box">
            <div className="plan-stat-label">PROGRESS</div>
            <div className="plan-stat-value">
              <span className="plan-stat-num">{doneTasks}</span>
              <span className="plan-stat-total"> / {totalTasks} TASKS</span>
            </div>
          </div>
          <div className="plan-stat-box">
            <div className="plan-stat-label">CURRENT STATUS</div>
            <div className="plan-week-badge">WEEK {currentWeek + 1}</div>
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="plan-timeline">
        {PLAN.map((week, wi) => {
          const isActive = wi === currentWeek;
          const isPast   = wi < currentWeek;
          const isLocked = wi > currentWeek;

          /* week-level progress */
          const weekTotal = week.days.reduce((s, d) => s + d.tasks.length, 0);
          const weekDone  = week.days.reduce((s, d, di) =>
            s + d.tasks.filter((_, ti) => progress.tasks[`w${wi}d${di}t${ti}`]).length, 0);

          return (
            <div key={wi} className={`plan-week-block${isActive ? ' active' : ''}${isLocked ? ' locked' : ''}`}>

              {/* ── Week row ── */}
              <div className="plan-week-row">
                {/* dot + line */}
                <div className="plan-dot-col">
                  <div className={`plan-dot${isActive ? ' active' : isPast ? ' past' : ''}`}>
                    {isLocked ? '🔒' : isActive ? '●' : '✓'}
                  </div>
                  {wi < PLAN.length - 1 && <div className="plan-line" />}
                </div>

                {/* text */}
                <div className="plan-week-info">
                  <h2 className={`plan-week-title${isLocked ? ' muted' : ''}`}>
                    Week {wi + 1}: {titleCase(week.theme)}
                  </h2>
                  {isActive && <div className="plan-active-badge">ACTIVE CYCLE</div>}
                  {isPast   && <div className="plan-done-badge">{weekDone}/{weekTotal} DONE</div>}
                  {isLocked && <div className="plan-locked-badge">LOCKED</div>}
                </div>
              </div>

              {/* ── Task cards (only active / past weeks) ── */}
              {!isLocked && (
                <div className="plan-tasks-area">
                  {week.days.map((day, di) =>
                    day.tasks.map((task, ti) => {
                      const key    = `w${wi}d${di}t${ti}`;
                      const isDone = !!progress.tasks[key];
                      const colors = TAG_COLORS[task.tag] || TAG_COLORS.dsa;
                      return (
                        <div
                          key={key}
                          className={`plan-task-card${isDone ? ' done' : ''}`}
                          onClick={() => toggleTask(wi, di, ti)}
                        >
                          {/* checkbox */}
                          <div className={`plan-task-check${isDone ? ' checked' : ''}`}>
                            {isDone && <span>✓</span>}
                          </div>

                          {/* content */}
                          <div className="plan-task-content">
                            <div
                              className="plan-task-tag"
                              style={{ background: colors.bg, color: colors.color }}
                            >
                              {task.tag.toUpperCase()}
                            </div>
                            <div className="plan-task-name">{task.name}</div>
                            <div className="plan-task-detail">{task.detail}</div>
                            <div className="plan-task-time">
                              <span className="plan-task-time-icon">🕐</span>
                              {task.time}
                              {task.lc && <span className="plan-task-lc"> · {task.lc}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* locked preview — show first task of the week */}
              {isLocked && week.days[0]?.tasks[0] && (
                <div className="plan-tasks-area locked-preview">
                  {week.days[0].tasks.slice(0, 2).map((task, ti) => {
                    const colors = TAG_COLORS[task.tag] || TAG_COLORS.dsa;
                    return (
                      <div key={ti} className="plan-task-card locked">
                        <div className="plan-task-lock">🔒</div>
                        <div className="plan-task-content">
                          <div
                            className="plan-task-tag"
                            style={{ background: colors.bg, color: colors.color, opacity: 0.5 }}
                          >
                            {task.tag.toUpperCase()}
                          </div>
                          <div className="plan-task-name" style={{ opacity: 0.4 }}>{task.name}</div>
                          <div className="plan-task-time" style={{ opacity: 0.3 }}>
                            <span className="plan-task-time-icon">🕐</span>
                            {task.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}

/* helper */
function titleCase(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}
