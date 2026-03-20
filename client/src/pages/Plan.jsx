import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { PLAN } from '../data/plan';
import { useAuth } from '../context/AuthContext';

export default function Plan() {
  const { user } = useAuth();
  const { request } = useApi();
  const [progress, setProgress] = useState({ tasks: {}, problems: {} });
  const [activeWeek, setActiveWeek] = useState(0);
  const [openDays, setOpenDays] = useState({});
  const [loading, setLoading] = useState(true);

  // Compute current week/day
  const getDayOffset = () => {
    const s = new Date(user?.startDate || Date.now());
    s.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.max(0, Math.floor((t - s) / 86400000));
  };
  const offset = getDayOffset();
  const cw = Math.min(Math.floor(offset / 7), PLAN.length - 1);
  const cd = Math.min(offset % 7, PLAN[cw].days.length - 1);

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

  useEffect(() => {
    setActiveWeek(cw);
    setOpenDays({ [`${cw}-${cd}`]: true }); // auto-open today
    fetchProgress();
  }, []);

  const toggleDay = (wi, di) => {
    setOpenDays(prev => ({ ...prev, [`${wi}-${di}`]: !prev[`${wi}-${di}`] }));
  };

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

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>Loading plan...</div>;

  const w = PLAN[activeWeek];
  const weekTasks = w.days.reduce((sum, d) => sum + d.tasks.length, 0);
  const weekDone = w.days.reduce((sum, d, di) =>
    sum + d.tasks.filter((_, ti) => progress.tasks[`w${activeWeek}d${di}t${ti}`]).length, 0);

  return (
    <div>
      <div className="section-label">WEEKLY BREAKDOWN</div>

      {/* Week Nav */}
      <div className="week-nav">
        {PLAN.map((_, wi) => (
          <button
            key={wi}
            className={`wbtn${wi === activeWeek ? ' active' : ''}`}
            onClick={() => setActiveWeek(wi)}
            title={PLAN[wi].theme}
          >
            W{wi + 1}
          </button>
        ))}
      </div>

      {/* Week Header */}
      <div className="week-hdr">
        <div>
          <div className="week-hdr-title">Week {activeWeek + 1} — {w.theme}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted2)', marginTop: '4px' }}>🎯 {w.focus}</div>
        </div>
        <div className="week-hdr-right">
          <span className="week-badge wb-green">{w.days.length} DAYS</span>
          <span className="week-badge wb-blue">{weekDone}/{weekTasks} TASKS</span>
        </div>
      </div>

      {/* Days */}
      {w.days.map((day, di) => {
        const isToday = activeWeek === cw && di === cd;
        const total = day.tasks.length;
        const done = day.tasks.filter((_, ti) => progress.tasks[`w${activeWeek}d${di}t${ti}`]).length;
        const pct = Math.round((done / total) * 100);
        const isOpen = openDays[`${activeWeek}-${di}`];

        return (
          <div key={di} className={`day-card${isToday ? ' today-hl' : ''}`}>
            <div className="day-hdr" onClick={() => toggleDay(activeWeek, di)}>
              <div className="dhl">
                <div className="day-num">D{activeWeek * 7 + di + 1}</div>
                <div>
                  <span className="day-name">{day.name}</span>
                  {isToday && <span className="day-today-badge">TODAY</span>}
                </div>
              </div>
              <div className="dhr">
                <div className="mini-prog"><div className="mini-prog-fill" style={{ width: `${pct}%` }} /></div>
                <div className="day-cnt">{done}/{total}</div>
                <div className="chev" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</div>
              </div>
            </div>

            <div className={`day-tasks-panel${isOpen ? ' open' : ''}`}>
              {day.tasks.map((task, ti) => {
                const key = `w${activeWeek}d${di}t${ti}`;
                const isDone = !!progress.tasks[key];
                return (
                  <div key={ti} className={`task-item${isDone ? ' done' : ''}`} onClick={() => toggleTask(activeWeek, di, ti)}>
                    <div className="task-check"><span className="task-tick">✓</span></div>
                    <div className="task-body">
                      <div className="task-name">
                        <span className={`tag tag-${task.tag}`}>{task.tag.toUpperCase()}</span>{' '}
                        {task.name}
                      </div>
                      <div className="task-detail">{task.detail} · {task.time}</div>
                      {task.lc && <div className="task-lc">↗ {task.lc}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
