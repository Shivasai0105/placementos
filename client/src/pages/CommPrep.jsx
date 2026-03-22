import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';
import { COMM_PREP, CATEGORY_COLORS } from '../data/commPrep';

const PHASE_COLORS = { green: 'var(--green)', blue: 'var(--blue)', purple: 'var(--purple)', amber: 'var(--amber)' };

export default function CommPrep() {
  const { request } = useApi();
  const [progress, setProgress] = useState({ commPrepDays: {} });
  const [loading, setLoading] = useState(true);
  const [openDay, setOpenDay] = useState(null);
  const [activePhase, setActivePhase] = useState(0);

  const fetchProgress = useCallback(async () => {
    try {
      const data = await request('/api/progress');
      setProgress({ commPrepDays: data.commPrepDays || {} });
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
      setProgress(prev => {
        const updated = { ...prev.commPrepDays, [dayNum]: !prev.commPrepDays[dayNum] };
        return { commPrepDays: updated };
      });
    } catch (err) {
      showToast('Error', err.message);
    }
  };

  const isDone = (dayNum) => !!progress.commPrepDays[dayNum];

  const totalDays = COMM_PREP.reduce((s, p) => s + p.days.length, 0);
  const doneDays = Object.values(progress.commPrepDays).filter(Boolean).length;

  const catColor = (cat) => {
    const c = CATEGORY_COLORS[cat] || 'muted';
    return c === 'muted' ? 'var(--muted)' : `var(--${c})`;
  };
  const catBg = (cat) => {
    const c = CATEGORY_COLORS[cat] || 'muted';
    const map = { green: 'rgba(0,232,122,0.1)', cyan: 'rgba(0,212,255,0.1)', blue: 'rgba(59,158,255,0.1)', purple: 'rgba(155,109,255,0.1)', amber: 'rgba(255,184,0,0.1)', red: 'rgba(255,77,106,0.1)', muted: 'rgba(90,90,122,0.1)' };
    return map[c] || map.muted;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>Loading...</div>;

  const phase = COMM_PREP[activePhase];
  const phaseDone = phase.days.filter(d => isDone(d.day)).length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
          🎤 Communication Prep{' '}
          <span style={{ color: 'var(--green)' }}>{doneDays}/{totalDays}</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '12px' }}>
          30-DAY STRUCTURED SPEAKING PLAN · {Math.round(doneDays / totalDays * 100)}% COMPLETE
        </div>
        <div className="prog-bar" style={{ height: '4px' }}>
          <div className="prog-fill" style={{ width: `${Math.round(doneDays / totalDays * 100)}%` }} />
        </div>
      </div>

      {/* Phase Tabs */}
      <div className="tabs">
        {COMM_PREP.map((p, i) => {
          const pDone = p.days.filter(d => isDone(d.day)).length;
          return (
            <button key={i} className={`tab${activePhase === i ? ' active' : ''}`} onClick={() => setActivePhase(i)}>
              Phase {i + 1} ({pDone}/{p.days.length})
            </button>
          );
        })}
      </div>

      {/* Phase Header */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', borderTop: `3px solid ${PHASE_COLORS[phase.phaseColor]}` }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '4px' }}>{phase.phase}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: 'var(--muted)' }}>
            {phaseDone}/{phase.days.length} DAYS DONE
          </div>
          <div className="prog-bar" style={{ flex: 1, height: '3px' }}>
            <div className="prog-fill" style={{ width: `${Math.round(phaseDone / phase.days.length * 100)}%`, background: PHASE_COLORS[phase.phaseColor] }} />
          </div>
        </div>
      </div>

      {/* Day Cards */}
      {phase.days.map((day) => {
        const done = isDone(day.day);
        const isOpen = openDay === day.day;
        return (
          <div key={day.day} style={{
            background: 'var(--surface)',
            border: `1px solid ${done ? 'rgba(0,232,122,0.3)' : 'var(--border)'}`,
            borderRadius: '10px',
            marginBottom: '8px',
            overflow: 'hidden',
            opacity: done ? 0.75 : 1,
            transition: 'all 0.2s',
          }}>
            {/* Day Header */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', cursor: 'pointer', transition: 'background 0.15s' }}
              onClick={() => setOpenDay(isOpen ? null : day.day)}
            >
              {/* Checkbox */}
              <div
                onClick={(e) => { e.stopPropagation(); toggleDay(day.day); }}
                style={{
                  width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${done ? 'var(--green)' : 'var(--border2)'}`,
                  background: done ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', cursor: 'pointer',
                }}
              >
                {done && <span style={{ color: '#000', fontSize: '10px', fontWeight: 900 }}>✓</span>}
              </div>

              {/* Day number */}
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: 'var(--muted)', width: '36px', flexShrink: 0 }}>DAY {day.day}</div>

              {/* Title + category */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--muted2)' : 'var(--text)' }}>
                  {day.title}
                </div>
              </div>

              {/* Category badge */}
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', padding: '2px 8px', borderRadius: '3px', background: catBg(day.category), color: catColor(day.category), flexShrink: 0 }}>
                {day.category.toUpperCase()}
              </span>

              {/* Chevron */}
              <span style={{ color: 'var(--muted)', fontSize: '0.65rem', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▼</span>
            </div>

            {/* Expanded Content */}
            {isOpen && (
              <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted2)', lineHeight: '1.6', marginBottom: '10px' }}>{day.description}</div>
                <div style={{ background: 'var(--surface3)', borderRadius: '6px', padding: '10px 12px', marginBottom: '10px', borderLeft: `3px solid ${PHASE_COLORS[phase.phaseColor]}` }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '1px', marginBottom: '4px' }}>💡 TIP</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text)', lineHeight: '1.5' }}>{day.tip}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(0,232,122,0.05)', borderRadius: '6px', padding: '10px 12px', border: '1px solid rgba(0,232,122,0.15)' }}>
                  <span style={{ fontSize: '0.85rem' }}>🎯</span>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: 'var(--green)', letterSpacing: '1px', marginBottom: '3px' }}>TODAY'S PRACTICE</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted2)', lineHeight: '1.5' }}>{day.practice}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleDay(day.day)}
                  style={{
                    marginTop: '12px', width: '100%', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.5px', fontWeight: 700,
                    background: done ? 'rgba(0,232,122,0.1)' : 'var(--green)', color: done ? 'var(--green)' : '#000',
                    border: done ? '1px solid rgba(0,232,122,0.3)' : '1px solid var(--green)', transition: 'all 0.2s',
                  }}
                >
                  {done ? '✓ MARKED AS DONE — CLICK TO UNDO' : '✓ MARK DAY COMPLETE'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
