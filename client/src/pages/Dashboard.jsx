import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { PLAN } from '../data/plan';

export default function Dashboard() {
  const { user } = useAuth();
  const { request } = useApi();
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState({ tasks: {}, problems: {} });
  const [loading, setLoading] = useState(true);
  const [uptime, setUptime] = useState("00D : 00H : 00M");

  const fetchData = useCallback(async () => {
    try {
      const [statsData, progressData] = await Promise.all([
        request('/api/progress/stats'),
        request('/api/progress'),
      ]);
      setStats(statsData);
      setProgress(progressData);
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Uptime calculation (fake for now, based on start date or just session)
    const start = new Date(user?.startDate || Date.now()).getTime();
    const timer = setInterval(() => {
      const diff = Date.now() - start;
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      setUptime(`${d}D : ${h.toString().padStart(2, '0')}H : ${m.toString().padStart(2, '0')}M`);
    }, 60000);
    // run once immediately
    const diff = Date.now() - start;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    setUptime(`${d}D : ${h.toString().padStart(2, '0')}H : ${m.toString().padStart(2, '0')}M`);
    return () => clearInterval(timer);
  }, []);

  const toggleTask = async (week, day, taskIndex) => {
    try {
      await request('/api/progress/task', {
        method: 'POST',
        body: JSON.stringify({ week, day, taskIndex }),
      });
      fetchData();
    } catch (err) {
      showToast('Error', err.message);
    }
  };

  if (loading || !stats) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
      <div className="blink-cursor">INITIALIZING SYSTEM</div>
    </div>
  );

  // Today's data
  const offset = stats.offset || 0;
  const w = Math.min(Math.floor(offset / 7), PLAN.length - 1);
  const d = Math.min(offset % 7, PLAN[w].days.length - 1);
  const todayPlan = PLAN[w];
  const todayTasks = todayPlan.days[d].tasks;
  const todayDone = todayTasks.filter((_, ti) => progress.tasks[`w${w}d${d}t${ti}`]);
  const todayPct = Math.round((todayDone.length / todayTasks.length) * 100);

  // Overall Readiness (Overall tasks done / Total tasks)
  const totalTasks = PLAN.reduce((s, wk) => s + wk.days.reduce((ss, dy) => ss + dy.tasks.length, 0), 0);
  const readiness = Math.round((stats.tasksDone / totalTasks) * 100) || 0;

  return (
    <div className="dash-terminal">
      {/* ── TOP HEADER ── */}
      <div className="sys-header">
        <div>
          <div className="sys-label">SYSTEM READINESS MONITOR</div>
          <h1 className="sys-title blink-cursor">OPERATIONAL</h1>
        </div>
        <div className="sys-status-metrics">
          <div className="sys-status-box">
            <div className="sys-box-label">CURRENT STATUS</div>
            <div className="sys-status-text">ACTIVE_SESSION</div>
          </div>
          <div className="sys-status-box">
            <div className="sys-box-label">UPTIME</div>
            <div className="sys-uptime-text">{uptime}</div>
          </div>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="dash-grid-top">
        {/* Readiness Index */}
        <div className="dash-card readiness-card">
          <div className="sys-box-label">PLACEMENT READINESS INDEX</div>
          <div className="readiness-val">
            <span className="big-num">{readiness}</span><span className="pct">%</span>
          </div>
          <div className="readiness-bar-bg">
            <div className="readiness-bar-fill" style={{ width: `${readiness}%` }} />
          </div>
        </div>

        {/* 4 Mini Stats */}
        <div className="mini-stats-grid">
          <div className="dash-card mini-stat">
            <div className="sys-box-label">DSA SOLVED <span className="stat-icon">{'</>'}</span></div>
            <div className="stat-main">{stats.dsaDone}</div>
          </div>
          <div className="dash-card mini-stat">
            <div className="sys-box-label">APTITUDE SOLVED <span className="stat-icon">🎯</span></div>
            <div className="stat-main">{stats.aptDone}</div>
          </div>
          <div className="dash-card mini-stat">
            <div className="sys-box-label">DAY STREAK <span className="stat-icon red-icon">🔥</span></div>
            <div className="stat-main">{stats.streak}</div>
            <div className="stat-sub">Personal Best: {stats.streak}</div>
          </div>
          <div className="dash-card mini-stat">
            <div className="sys-box-label">TASKS DONE <span className="stat-icon">✓</span></div>
            <div className="stat-main">{stats.tasksDone}<span className="stat-max">/{totalTasks}</span></div>
            <div className="stat-sub">Week {w + 1} Targets</div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM GRID ── */}
      <div className="dash-grid-bottom">
        
        {/* Current Iteration Tasks */}
        <div className="current-iteration">
          <div className="iter-header">
            <span className="iter-badge">W{w + 1}</span>
            <div className="iter-title-wrapper">
              <span className="sys-box-label">CURRENT_ITERATION: </span>
              <span className="iter-theme">{todayPlan.theme}</span>
            </div>
            <div className="bootcamp-badge">BOOTCAMP_MODE</div>
          </div>

          <div className="iter-tasks">
            {todayTasks.map((task, ti) => {
              const key = `w${w}d${d}t${ti}`;
              const isDone = !!progress.tasks[key];
              const isActive = !isDone && ti === todayDone.length; // Next uncompleted task is active
              const statusClass = isDone ? 'complete' : isActive ? 'active' : 'queued';

              return (
                <div key={ti} className={`iter-task-row ${statusClass}`} onClick={() => toggleTask(w, d, ti)}>
                  <div className="task-icon-box">{isDone ? '✓' : isActive ? '>' : '{ }'}</div>
                  <div className="task-info">
                    <div className="task-title">{task.name}</div>
                    <div className="task-meta">
                      <span className="task-meta-time">🕐 {task.time}</span>
                      <span className="task-meta-diff">· {task.tag.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="task-action-col">
                    {isDone ? (
                      <div className="task-status-badge success">COMPLETE <span className="status-dot green" /></div>
                    ) : isActive ? (
                      <button className="terminal-btn-sm" onClick={(e) => { e.stopPropagation(); toggleTask(w, d, ti); }}>
                        ACTIVE_NOW <span className="resume-btn">RESUME</span>
                      </button>
                    ) : (
                      <div className="task-status-badge muted">QUEUED <span className="status-dot hollow" /></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap Sidebar */}
        <div className="dash-card roadmap-sidebar">
          <div className="sys-box-label">BATTLE PLAN ROADMAP</div>
          <div className="rm-list">
            {PLAN.map((planWk, wi) => {
              const isPast = wi < w;
              const isActive = wi === w;
              const isLocked = wi > w;
              const status = isActive ? 'active' : isLocked ? 'locked' : 'past';
              
              return (
                <div key={wi} className={`rm-item ${status}`}>
                  <div className="rm-icon">
                    {isActive ? <div className="dot green pulse" /> : isPast ? <div className="dot green solid" /> : <div className="lock-icon">🔒</div>}
                  </div>
                  <div className="rm-content">
                    <div className="rm-title">WEEK {String(wi + 1).padStart(2, '0')}: {planWk.theme}</div>
                    <div className="rm-desc">{planWk.focus}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
