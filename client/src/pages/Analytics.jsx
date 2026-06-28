import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { PLAN } from '../data/plan';

export default function Analytics() {
  const { request } = useApi();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const AUDIT_CACHE_KEY = 'ai_telemetry_audit_cache';
  const AUDIT_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

  const [audit, setAudit] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const fetchAudit = async (force = false) => {
    setAuditLoading(true);
    try {
      if (!force) {
        const cached = sessionStorage.getItem(AUDIT_CACHE_KEY);
        if (cached) {
          const { parsed, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < AUDIT_CACHE_TTL) {
            setAudit(parsed);
            return;
          }
        }
      }
      const data = await request('/api/ai/analytics-audit');
      setAudit(data);
      sessionStorage.setItem(AUDIT_CACHE_KEY, JSON.stringify({
        parsed: data,
        timestamp: Date.now()
      }));
    } catch (err) {
      showToast('Audit Error', err.message);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await request('/api/progress/stats');
        setStats(data);
        fetchAudit();
      } catch (err) {
        showToast('Error', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !stats) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>Loading analytics...</div>;

  const maxWeeklyDone = Math.max(...(stats.weeklyStats || []).map(w => w.done), 1);

  // Topic breakdown for DSA tasks (rough tag-based count)
  const tagColors = {
    dsa: 'var(--green)', mern: 'var(--blue)', oop: 'var(--purple)',
    theory: 'var(--amber)', project: 'var(--red)', aptitude: 'var(--cyan)',
    mock: 'var(--amber)', system: 'var(--purple)'
  };

  return (
    <div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>📈 Analytics & Progress</div>

      {/* Readiness + Streak row */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-card-title">PLACEMENT READINESS</div>
          <div className="readiness-score">{stats.readiness}%</div>
          <div className="readiness-label">Based on task + problem completion</div>
          <div className="prog-bar" style={{ marginTop: '16px', height: '6px' }}>
            <div className="prog-fill" style={{ width: `${stats.readiness}%` }} />
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-title">CURRENT STREAK 🔥</div>
          <div className="readiness-score" style={{ color: 'var(--amber)' }}>{stats.streak}</div>
          <div className="readiness-label">consecutive days with at least one task</div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--green)' }}>{stats.tasksDone}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>TASKS</div>
            </div>
            <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--blue)' }}>{stats.dsaDone}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>DSA DONE</div>
            </div>
            <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--cyan)' }}>{stats.aptDone}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>APT DONE</div>
            </div>
          </div>
        </div>
      </div>

      {/* 🤖 AI TELEMETRY AUDIT CARD */}
      <div className="analytics-card full" style={{ marginBottom: '16px', marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div className="analytics-card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🤖</span> AI TELEMETRY AUDIT
            {audit?.isFallback && <span className="ana-fallback-badge">DEMO MODE</span>}
          </div>
          <button 
            className="ana-audit-btn" 
            onClick={() => fetchAudit(true)}
            disabled={auditLoading}
          >
            {auditLoading ? 'ANALYZING...' : '⟳ RE-AUDIT TELEMETRY'}
          </button>
        </div>

        {auditLoading ? (
          <div className="ana-audit-loading">
            <div className="ana-pulse-ring" />
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--muted)' }}>
              AGGREGATING TELEMETRY & RUNNING COHORT AUDIT...
            </span>
          </div>
        ) : audit ? (
          <div className="ana-audit-content">
            {/* Header: Tier + Explanation */}
            <div className="ana-audit-header">
              <div className={`ana-tier-badge ${audit.readinessTier?.toLowerCase()}`}>
                {audit.readinessTier?.toUpperCase()} READINESS
              </div>
              <div className="ana-tier-exp">
                {audit.readinessExplanation}
              </div>
            </div>

            {/* Diagnostics grid */}
            <div className="ana-audit-grid" style={{ marginTop: '16px' }}>
              <div className="ana-audit-block">
                <div className="ana-block-label">// FUNNEL & PIPELINE ANALYSIS</div>
                <p className="ana-block-text">{audit.pipelineAnalysis}</p>
              </div>
              <div className="ana-audit-block">
                <div className="ana-block-label">// TOPIC DEFICIT DIAGNOSIS</div>
                <p className="ana-block-text">{audit.topicDeficit}</p>
              </div>
            </div>

            {/* Goals list */}
            {audit.analystGoals?.length > 0 && (
              <div className="ana-goals-section" style={{ marginTop: '16px' }}>
                <div className="ana-block-label" style={{ marginBottom: '10px' }}>// RECOMMENDED METRIC UPLIFT GOALS</div>
                <div className="ana-goals-list">
                  {audit.analystGoals.map((g, idx) => (
                    <div key={idx} className="ana-goal-row">
                      <div className="ana-goal-checkbox">☐</div>
                      <div className="ana-goal-info">
                        <div className="ana-goal-text">{g.goal}</div>
                        <div className="ana-goal-metric">➔ Target: {g.metricTarget}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)', fontSize: '0.8rem' }}>
            No telemetry audit cached. Click "RE-AUDIT TELEMETRY" to run.
          </div>
        )}
      </div>

      {/* Weekly Bar Chart */}
      <div className="analytics-card full" style={{ marginBottom: '16px' }}>
        <div className="analytics-card-title">WEEKLY TASK COMPLETION</div>
        <div className="chart-bars">
          {(stats.weeklyStats || []).map(w => {
            const barPct = maxWeeklyDone > 0 ? (w.done / maxWeeklyDone) * 100 : 0;
            return (
              <div key={w.week} className="chart-bar-wrap">
                <div className="chart-bar-val">{w.done}</div>
                <div className="chart-bar" style={{ height: `${Math.max(barPct, 2)}%` }} title={w.theme} />
                <div className="chart-bar-label">W{w.week}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Week-by-week breakdown */}
      <div className="analytics-card full" style={{ marginBottom: '16px' }}>
        <div className="analytics-card-title">WEEK-BY-WEEK BREAKDOWN</div>
        {(stats.weeklyStats || []).map(w => {
          const pct = w.total > 0 ? Math.round((w.done / w.total) * 100) : 0;
          return (
            <div key={w.week} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                <span style={{ fontWeight: 700 }}>W{w.week}: <span style={{ color: 'var(--muted2)', fontWeight: 400 }}>{PLAN[w.week - 1]?.theme}</span></span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: 'var(--muted)' }}>{w.done}/{w.total} ({pct}%)</span>
              </div>
              <div className="prog-bar">
                <div className="prog-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 56-Day Heatmap */}
      <div className="analytics-card full" style={{ marginBottom: '0' }}>
        <div className="analytics-card-title">56-DAY ACTIVITY HEATMAP</div>
        <div className="streak-grid" style={{ marginTop: '8px' }}>
          {(stats.streakMap || []).map(day => (
            <div
              key={day.day}
              className={`sd ${day.isToday ? 'today' : day.isFuture ? 'future' : day.done ? 'done' : 'missed'}`}
              title={`Day ${day.day}${day.done ? ' ✓' : day.isFuture ? ' (upcoming)' : ' ✕'}`}
            >
              {day.isToday ? '▲' : day.done ? '✓' : day.isFuture ? day.day : '✕'}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.65rem', fontFamily: "'JetBrains Mono',monospace", color: 'var(--muted)' }}>
          <span><span style={{ color: 'var(--green)' }}>✓</span> Done</span>
          <span><span style={{ color: 'var(--red)' }}>✕</span> Missed</span>
          <span><span style={{ color: 'var(--amber)' }}>▲</span> Today</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>Future</span>
        </div>
      </div>
    </div>
  );
}
