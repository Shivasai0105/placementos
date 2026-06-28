import { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import { PLAN } from '../data/plan';

const CACHE_KEY = 'ai_daily_plan_cache';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

/* ── Compute weak topics from progress data ── */
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
    .map(([tag, { done, total }]) => ({
      tag,
      pct: Math.round((done / total) * 100),
      done,
      total,
    }))
    .sort((a, b) => a.pct - b.pct); // weakest first
}

const TAG_COLORS = {
  dsa: '#00ff88',
  aptitude: '#ffb547',
  dbms: '#64b5f6',
  dev: '#ce93d8',
  comm: '#ff80ab',
  default: '#9e9e9e',
};

const TAG_LABELS = {
  dsa: 'DSA',
  aptitude: 'APTITUDE',
  dbms: 'DBMS',
  dev: 'DEVELOPMENT',
  comm: 'COMMUNICATION',
};

const URGENCY_CONFIG = {
  low:      { color: '#00ff88', label: 'LOW URGENCY',      bg: 'rgba(0,255,136,0.08)',  border: 'rgba(0,255,136,0.3)'  },
  medium:   { color: '#ffb547', label: 'MODERATE URGENCY', bg: 'rgba(255,181,71,0.08)', border: 'rgba(255,181,71,0.3)' },
  high:     { color: '#ff6b35', label: 'HIGH URGENCY',     bg: 'rgba(255,107,53,0.08)', border: 'rgba(255,107,53,0.3)' },
  critical: { color: '#ff2244', label: '⚠ CRITICAL',       bg: 'rgba(255,34,68,0.10)',  border: 'rgba(255,34,68,0.4)'  },
};

export default function AiStudyPlan() {
  const { user } = useAuth();
  const { request } = useApi();

  const [plan, setPlan]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ tasks: {} });
  const [stats, setStats]     = useState(null);
  const [typing, setTyping]   = useState(false);
  const [displayed, setDisplayed] = useState('');
  const typingRef = useRef(null);

  /* ── Compute days left ── */
  const getDaysLeft = useCallback(() => {
    const start = new Date(user?.startDate || Date.now());
    start.setHours(0, 0, 0, 0);
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const offset = Math.max(0, Math.floor((now - start) / 86400000));
    return Math.max(0, 56 - offset);
  }, [user]);

  /* ── Typing animation for headline ── */
  const animateHeadline = useCallback((text) => {
    setDisplayed('');
    setTyping(true);
    let i = 0;
    clearInterval(typingRef.current);
    typingRef.current = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, ++i));
      } else {
        clearInterval(typingRef.current);
        setTyping(false);
      }
    }, 30);
  }, []);

  /* ── Load or fetch plan ── */
  const fetchPlan = useCallback(async (force = false) => {
    setLoading(true);
    try {
      // Check cache first
      if (!force) {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setPlan(data);
            animateHeadline(data.headline || '');
            setLoading(false);
            return;
          }
        }
      }

      // Fetch progress + stats in parallel
      const [progressData, statsData] = await Promise.all([
        request('/api/progress'),
        request('/api/progress/stats'),
      ]);
      setProgress(progressData);
      setStats(statsData);

      const weakTopics = computeWeakTopics(progressData.tasks || {}).slice(0, 3);
      const daysLeft = getDaysLeft();

      const generatedPlan = await request('/api/ai/daily-plan', {
        method: 'POST',
        body: JSON.stringify({
          stats: statsData,
          weakTopics,
          targetCompanies: user?.targetCompanies || [],
          daysLeft,
        }),
      });

      setPlan(generatedPlan);
      animateHeadline(generatedPlan.headline || '');

      // Cache the result
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        data: generatedPlan,
        timestamp: Date.now(),
      }));

    } catch (err) {
      showToast('AI Plan Error', err.message);
    } finally {
      setLoading(false);
    }
  }, [user, getDaysLeft, animateHeadline]);

  useEffect(() => {
    fetchPlan();
    return () => clearInterval(typingRef.current);
  }, []);

  const handleRegenerate = () => {
    sessionStorage.removeItem(CACHE_KEY);
    fetchPlan(true);
    showToast('🔄 Regenerating', 'Generating fresh plan from AI...');
  };

  const urgency = plan ? (URGENCY_CONFIG[plan.urgency] || URGENCY_CONFIG.medium) : URGENCY_CONFIG.medium;
  const daysLeft = getDaysLeft();

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="aip-page">
        <div className="aip-header">
          <div className="aip-h-label">AI ASSISTANT // GENERATING</div>
          <h1 className="aip-h-title">DAILY STUDY PLAN</h1>
        </div>
        <div className="aip-skeleton-wrap">
          <div className="aip-skeleton aip-sk-banner" />
          <div className="aip-skeleton aip-sk-headline" />
          <div className="aip-skeleton-pills">
            <div className="aip-skeleton aip-sk-pill" />
            <div className="aip-skeleton aip-sk-pill" />
            <div className="aip-skeleton aip-sk-pill" style={{ width: '80px' }} />
          </div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aip-skeleton aip-sk-task" style={{ opacity: 1 - i * 0.15 }} />
          ))}
          <div className="aip-skeleton aip-sk-tip" />
        </div>
      </div>
    );
  }

  return (
    <div className="aip-page">

      {/* ── HEADER ── */}
      <div className="aip-header">
        <div className="aip-h-left">
          <div className="aip-h-label">AI ASSISTANT // {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
          <h1 className="aip-h-title">DAILY STUDY PLAN</h1>
        </div>
        <div className="aip-h-right">
          <div className="aip-days-badge" style={{ borderColor: urgency.color, color: urgency.color }}>
            <div className="aip-days-num">{daysLeft}</div>
            <div className="aip-days-label">DAYS LEFT</div>
          </div>
        </div>
      </div>

      {/* ── URGENCY BANNER ── */}
      <div className="aip-urgency-banner"
        style={{ background: urgency.bg, borderColor: urgency.border, color: urgency.color }}>
        <span className="aip-urgency-dot" style={{ background: urgency.color }} />
        <span className="aip-urgency-status">{urgency.label}</span>
        <span className="aip-urgency-sep">|</span>
        <span className="aip-urgency-companies">
          TARGET: {(user?.targetCompanies || ['GENERAL']).join(' · ')}
        </span>
        {plan?.isFallback && (
          <span className="aip-fallback-badge">BASELINE MODE</span>
        )}
      </div>

      {/* ── MAIN CARD ── */}
      <div className="aip-main-card" style={{ borderColor: urgency.border }}>

        {/* Headline with typing animation */}
        <div className="aip-headline-wrap">
          <div className="aip-headline-label">// AI ASSESSMENT</div>
          <p className="aip-headline">
            {displayed}
            {typing && <span className="aip-cursor">█</span>}
          </p>
        </div>

        {/* Focus Topics */}
        {plan?.focusTopics?.length > 0 && (
          <div className="aip-section">
            <div className="aip-section-title">FOCUS TARGETS TODAY</div>
            <div className="aip-focus-pills">
              {plan.focusTopics.map((topic, i) => {
                const tagKey = topic.toLowerCase();
                const col = TAG_COLORS[tagKey] || TAG_COLORS.default;
                return (
                  <div key={i} className="aip-focus-pill"
                    style={{ borderColor: col, color: col, background: col + '15' }}>
                    <span className="aip-pill-dot" style={{ background: col }} />
                    {topic.toUpperCase()}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Task List */}
        {plan?.tasks?.length > 0 && (
          <div className="aip-section">
            <div className="aip-section-title">EXECUTION QUEUE [{plan.tasks.length} TASKS]</div>
            <div className="aip-task-list">
              {plan.tasks.map((task, i) => {
                const tagKey = task.tag?.toLowerCase() || 'default';
                const col = TAG_COLORS[tagKey] || TAG_COLORS.default;
                return (
                  <div key={i} className="aip-task-row" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="aip-task-index" style={{ color: col }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="aip-task-body">
                      <div className="aip-task-name">{task.name}</div>
                      <div className="aip-task-meta">
                        <span className="aip-tag-badge" style={{ borderColor: col + '80', color: col }}>
                          {TAG_LABELS[tagKey] || task.tag?.toUpperCase()}
                        </span>
                        <span className="aip-task-dur">🕐 {task.duration}</span>
                      </div>
                    </div>
                    <div className="aip-task-arrow" style={{ color: col }}>›</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pro Tip */}
        {plan?.tip && (
          <div className="aip-tip-block">
            <div className="aip-tip-icon">💡</div>
            <div className="aip-tip-content">
              <div className="aip-tip-label">COACH TIP</div>
              <p className="aip-tip-text">{plan.tip}</p>
            </div>
          </div>
        )}

      </div>

      {/* ── WEAK TOPIC BREAKDOWN ── */}
      <WeakTopicBreakdown tasks={progress.tasks || {}} />

      {/* ── ACTIONS ── */}
      <div className="aip-actions">
        <button className="aip-regen-btn" onClick={handleRegenerate}>
          <span className="aip-regen-icon">⟳</span>
          REGENERATE PLAN
        </button>
        <div className="aip-cache-note">
          {plan?.isFallback
            ? '⚡ Add GEMINI_API_KEY to server .env for AI-powered plans'
            : '⚡ Plan cached for 6 hours · Regenerate anytime'}
        </div>
      </div>

    </div>
  );
}

/* ── Weak Topic Breakdown sub-component ── */
function WeakTopicBreakdown({ tasks }) {
  const allTopics = computeWeakTopics(tasks);

  return (
    <div className="aip-breakdown-card">
      <div className="aip-section-title" style={{ marginBottom: '16px' }}>
        TOPIC COMPLETION ANALYSIS
      </div>
      <div className="aip-topic-bars">
        {allTopics.map(({ tag, pct, done, total }) => {
          const col = TAG_COLORS[tag] || TAG_COLORS.default;
          const isWeak = pct < 40;
          return (
            <div key={tag} className="aip-topic-bar-row">
              <div className="aip-topic-bar-label">
                <span style={{ color: col }}>{TAG_LABELS[tag] || tag.toUpperCase()}</span>
                {isWeak && <span className="aip-weak-badge">WEAK</span>}
              </div>
              <div className="aip-topic-bar-track">
                <div
                  className="aip-topic-bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${col}44, ${col})`,
                    boxShadow: isWeak ? `0 0 8px ${col}60` : 'none'
                  }}
                />
              </div>
              <div className="aip-topic-bar-stat" style={{ color: col }}>
                {pct}% <span className="aip-topic-frac">({done}/{total})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
