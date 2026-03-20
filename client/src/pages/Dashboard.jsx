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
    // Show welcome toast on first load
    setTimeout(() => {
      if (user) showToast(`Welcome back, ${user.name?.split(' ')[0]}! 🔥`, 'Keep the streak alive today.');
    }, 800);
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

  const logToday = async () => {
    try {
      await request('/api/progress/log-today', { method: 'POST' });
      fetchData();
      showToast('🎉 Day Logged!', 'All tasks marked complete. Keep the streak!');
    } catch (err) {
      showToast('Error', err.message);
    }
  };

  const requestNotif = () => {
    if (!('Notification' in window)) { showToast('⚠️ Not Supported', 'Browser does not support notifications.'); return; }
    Notification.requestPermission().then(p => {
      if (p === 'granted') {
        showToast('✅ Notifications Enabled', "You'll be reminded at 6 PM daily!");
        scheduleNotif();
      } else {
        showToast('❌ Blocked', 'Allow notifications in browser settings.');
      }
    });
  };

  const scheduleNotif = () => {
    const now = new Date(), next = new Date();
    next.setHours(18, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('⚡ PlacementOS — 6 PM Grind Time!', {
          body: 'Your evening session starts now. Open the app.',
        });
        scheduleNotif();
      }
    }, next - now);
  };

  if (loading || !stats) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
      <div className="loading-dots" style={{ justifyContent: 'center' }}>
        <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
      </div>
    </div>
  );

  // Today's data
  const offset = stats.offset || 0;
  const w = Math.min(Math.floor(offset / 7), PLAN.length - 1);
  const d = Math.min(offset % 7, PLAN[w].days.length - 1);
  const todayPlan = PLAN[w];
  const todayDay = todayPlan.days[d];
  const todayTasks = todayDay.tasks;
  const todayDone = todayTasks.filter((_, ti) => progress.tasks[`w${w}d${d}t${ti}`]);
  const todayPct = Math.round((todayDone.length / todayTasks.length) * 100);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Company targets styling
  const companyStyle = {
    Zoho: 't-primary', Freshworks: 't-primary',
    Persistent: 't-secondary', Startups: 't-secondary',
    'TCS Digital': 't-backup', 'Infosys DSE': 't-backup',
    'Amazon/MS (Dream)': 't-dream',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px', background: 'linear-gradient(135deg,var(--green),var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            PlacementOS v3
          </div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '2.5px', marginTop: '3px' }}>
            10 LPA BATTLE PLAN · {user?.name?.toUpperCase()} · {user?.cgpa ? `${user.cgpa} CGPA` : ''} · {stats.dsaDone + stats.aptDone} PROBLEMS DONE
          </div>
        </div>
        <div className="header-actions">
          <button className="btn" onClick={requestNotif}>🔔 NOTIFY ME</button>
          <button className="btn btn-green" onClick={logToday}>✓ LOG TODAY</button>
        </div>
      </div>

      {/* Company Targets */}
      <div className="targets">
        {(user?.targetCompanies || ['Zoho', 'Freshworks', 'Persistent', 'TCS Digital', 'Infosys DSE']).map(c => (
          <span key={c} className={`target-chip ${companyStyle[c] || 't-backup'}`}>{c}</span>
        ))}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat g">
          <div className="stat-n">{stats.tasksDone}</div>
          <div className="stat-l">Tasks Done</div>
        </div>
        <div className="stat p">
          <div className="stat-n">{stats.streak}</div>
          <div className="stat-l">Day Streak</div>
        </div>
        <div className="stat a">
          <div className="stat-n">{stats.dsaDone}</div>
          <div className="stat-l">DSA Solved</div>
        </div>
        <div className="stat c">
          <div className="stat-n">{stats.aptDone}</div>
          <div className="stat-l">Aptitude ✓</div>
        </div>
        <div className="stat b">
          <div className="stat-n">W{stats.currentWeek}</div>
          <div className="stat-l">Current Week</div>
        </div>
      </div>

      {/* Today Card */}
      <div className="today-card">
        <div className="today-badge">TODAY</div>
        <div className="today-meta">{dateStr}</div>
        <div className="today-heading">Week {w + 1} — {todayPlan.theme}</div>
        <div className="today-theme">🎯 Focus: {todayPlan.focus}</div>

        <div>
          {todayTasks.map((task, ti) => {
            const key = `w${w}d${d}t${ti}`;
            const isDone = !!progress.tasks[key];
            return (
              <div key={ti} className={`task-item${isDone ? ' done' : ''}`} onClick={() => toggleTask(w, d, ti)}>
                <div className="task-check"><span className="task-tick">✓</span></div>
                <div className="task-body">
                  <span className={`tag tag-${task.tag}`}>{task.tag.toUpperCase()}</span>
                  <div className="task-name">{task.name}</div>
                  <div className="task-detail">{task.detail}</div>
                  <div className="task-meta">
                    <span className="task-time">⏰ {task.time}</span>
                    {task.lc && <span className="task-lc">↗ {task.lc}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div style={{ paddingTop: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '5px' }}>
            <span>Today's Progress</span>
            <span>{todayPct}%</span>
          </div>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: `${todayPct}%` }} />
          </div>
        </div>
      </div>

      {/* Quick Streak Preview */}
      <div className="section-label">64-DAY STREAK MAP</div>
      <div className="streak-grid">
        {(stats.streakMap || []).map((day) => (
          <div
            key={day.day}
            className={`sd ${day.isToday ? 'today' : day.isFuture ? 'future' : day.done ? 'done' : 'missed'}`}
            title={`Day ${day.day}`}
          >
            {day.isToday ? '▲' : day.done ? '✓' : day.isFuture ? day.day : '✕'}
          </div>
        ))}
      </div>
    </div>
  );
}
