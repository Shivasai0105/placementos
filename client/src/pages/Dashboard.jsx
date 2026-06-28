import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { PLAN } from '../data/plan';

const AI_CACHE_KEY = 'ai_daily_plan_cache';
const AI_CACHE_TTL = 6 * 60 * 60 * 1000;

function computeWeakTopics(tasks) {
  const tagStats = {};
  PLAN.forEach((week, wi) =>
    week.days.forEach((day, di) =>
      day.tasks.forEach((task, ti) => {
        const tag = task.tag;
        if (!tagStats[tag]) tagStats[tag] = { done: 0, total: 0 };
        tagStats[tag].total++;
        if (tasks[`w${wi}d${di}t${ti}`]) tagStats[tag].done++;
      })
    )
  );
  return Object.entries(tagStats)
    .map(([tag, { done, total }]) => ({ tag, pct: Math.round((done / total) * 100) }))
    .sort((a, b) => a.pct - b.pct);
}

export default function Dashboard() {
  const { user } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState({ tasks: {}, problems: {} });
  const [loading, setLoading] = useState(true);
  const [uptime, setUptime] = useState("00D : 00H : 00M");
  const [aiPlan, setAiPlan] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);

  /* ── Fetch AI plan (uses cache if fresh) ── */
  const fetchAiInsight = useCallback(async (progressTasks, statsData) => {
    setAiLoading(true);
    try {
      const cached = sessionStorage.getItem(AI_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < AI_CACHE_TTL) {
          setAiPlan(data);
          setAiLoading(false);
          return;
        }
      }
      const start = new Date(user?.startDate || Date.now());
      start.setHours(0, 0, 0, 0);
      const now = new Date(); now.setHours(0, 0, 0, 0);
      const offset = Math.max(0, Math.floor((now - start) / 86400000));
      const daysLeft = Math.max(0, 56 - offset);
      const weakTopics = computeWeakTopics(progressTasks).slice(0, 3);
      const plan = await request('/api/ai/daily-plan', {
        method: 'POST',
        body: JSON.stringify({
          stats: statsData,
          weakTopics,
          targetCompanies: user?.targetCompanies || [],
          daysLeft,
        }),
      });
      setAiPlan(plan);
      sessionStorage.setItem(AI_CACHE_KEY, JSON.stringify({ data: plan, timestamp: Date.now() }));
    } catch (_) {
      // Silent fail — dashboard widget is non-critical
    } finally {
      setAiLoading(false);
    }
  }, [user]);

  const fetchData = useCallback(async () => {
    try {
      const [statsData, progressData] = await Promise.all([
        request('/api/progress/stats'),
        request('/api/progress'),
      ]);
      setStats(statsData);
      setProgress(progressData);
      fetchAiInsight(progressData.tasks || {}, statsData);
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchAiInsight]);


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

        {/* AI Insight Widget */}
        <div className="dash-card ai-insight-widget">
          <div className="ai-widget-header">
            <div className="sys-box-label">✨ AI STUDY INSIGHT</div>
            <button className="ai-widget-view-btn" onClick={() => navigate('/ai-plan')}>
              VIEW FULL PLAN →
            </button>
          </div>

          {aiLoading ? (
            <div className="ai-widget-loading">
              <div className="aip-skeleton ai-sk-line" style={{ width: '90%', height: '14px', marginBottom: '10px' }} />
              <div className="aip-skeleton ai-sk-line" style={{ width: '60%', height: '14px', marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="aip-skeleton ai-sk-line" style={{ width: '80px', height: '24px', borderRadius: '4px' }} />
                <div className="aip-skeleton ai-sk-line" style={{ width: '70px', height: '24px', borderRadius: '4px' }} />
              </div>
            </div>
          ) : aiPlan ? (
            <div className="ai-widget-body">
              <p className="ai-widget-headline">{aiPlan.headline}</p>
              {aiPlan.focusTopics?.length > 0 && (
                <div className="ai-widget-pills">
                  {aiPlan.focusTopics.slice(0, 3).map((t, i) => (
                    <span key={i} className={`ai-widget-pill tag-${t.toLowerCase()}`}>{t}</span>
                  ))}
                </div>
              )}
              <div className="ai-widget-tasks">
                {aiPlan.tasks?.slice(0, 3).map((task, i) => (
                  <div key={i} className="ai-widget-task-row">
                    <span className="ai-widget-task-dot">›</span>
                    <span className="ai-widget-task-name">{task.name}</span>
                    <span className="ai-widget-task-dur">{task.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="ai-widget-empty">
              <p>AI insights unavailable.</p>
              <button className="aip-regen-btn" style={{ marginTop: '10px', fontSize: '0.7rem', padding: '6px 14px' }}
                onClick={() => navigate('/ai-plan')}>OPEN AI PLAN →</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
