import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

const CACHE_KEY = 'ai_placement_prediction_cache';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours cache

export default function AiPlacement() {
  const { user } = useAuth();
  const { request } = useApi();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPrediction = useCallback(async (force = false) => {
    setLoading(true);
    try {
      if (!force) {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { parsed, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setData(parsed);
            setLoading(false);
            return;
          }
        }
      }

      const prediction = await request('/api/ai/predict');
      setData(prediction);
      
      // Cache the result
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        parsed: prediction,
        timestamp: Date.now()
      }));

    } catch (err) {
      showToast('Diagnostics Error', err.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchPrediction();
  }, []);

  const handleRecalculate = () => {
    sessionStorage.removeItem(CACHE_KEY);
    fetchPrediction(true);
    showToast('🔄 Syncing Telemetry', 'Running fresh diagnostics against core engines...');
  };

  if (loading) {
    return (
      <div className="ap-page">
        <div className="ap-header">
          <div className="ap-h-left">
            <div className="ap-h-label">AI DIAGNOSTICS // ESTIMATING FIT</div>
            <h1 className="ap-h-title">PLACEMENT PREDICTION</h1>
          </div>
        </div>
        <div className="ap-skeleton-wrap">
          <div className="ap-skeleton ap-sk-banner" />
          <div className="ap-sk-row">
            <div className="ap-skeleton ap-sk-card" />
            <div className="ap-skeleton ap-sk-card" style={{ height: '260px' }} />
          </div>
          <div className="ap-skeleton ap-sk-card" style={{ height: '140px' }} />
        </div>
      </div>
    );
  }

  const {
    placementProbability = { Dream: 0, Core: 0, Backup: 0 },
    readinessRating = 0,
    confidenceScore = 0.5,
    insights = [],
    skillGaps = [],
    companyFit = [],
    actionPlan = [],
    isFallback = false
  } = data || {};

  // Circular gauge setup
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessRating / 100) * circumference;

  return (
    <div className="ap-page">
      
      {/* ── HEADER ── */}
      <div className="ap-header">
        <div className="ap-h-left">
          <div className="ap-h-label">AI DIAGNOSTICS // PREPARATION INTELLIGENCE</div>
          <h1 className="ap-h-title">PLACEMENT PREDICTION</h1>
        </div>
        <div className="ap-h-right">
          <div className="ap-confidence-badge">
            <span className="ap-conf-label">INDICATOR CONFIDENCE</span>
            <span className="ap-conf-val">{(confidenceScore * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* ── SPLIT METRICS GRID ── */}
      <div className="ap-grid">
        
        {/* Left Card: Circular Readiness Gauge */}
        <div className="ap-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="ap-card-title" style={{ width: '100%' }}>CORE READINESS RATING</div>
          <div className="ap-score-container">
            <div className="ap-score-svg-wrap">
              <svg width="150" height="150" viewBox="0 0 150 150">
                {/* Background Ring */}
                <circle 
                  cx="75" cy="75" r={radius} 
                  fill="transparent" 
                  stroke="var(--border)" 
                  strokeWidth="8" 
                />
                {/* Colored Fill Ring */}
                <circle 
                  cx="75" cy="75" r={radius} 
                  fill="transparent" 
                  stroke="var(--green)" 
                  strokeWidth="8" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 75 75)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className="ap-score-text">
                <span className="ap-score-num">
                  {readinessRating}<span className="ap-score-pct">%</span>
                </span>
                <span className="ap-score-label">RATING</span>
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted2)', marginTop: '8px', textAlign: 'center', maxWidth: '300px' }}>
            Aggregated metric mapping your solved DSA patterns, aptitude tasks, and resume ATS calibration.
          </div>
        </div>

        {/* Right Card: Tier placement probabilities */}
        <div className="ap-card">
          <div className="ap-card-title">PROBABILITY MATRIX BY OFFER TIER</div>
          <div className="ap-probs">
            
            {/* Dream Tier */}
            <div className="ap-prob-row">
              <div className="ap-prob-label-wrap">
                <span className="ap-prob-tier" style={{ color: 'var(--purple)' }}>DREAM TIER</span>
                <span className="ap-prob-desc">FAANG / Tier 1 Product</span>
              </div>
              <div className="ap-prob-bar-container">
                <div className="ap-prob-fill" style={{ width: `${placementProbability.Dream}%`, background: 'var(--purple)' }} />
              </div>
              <div className="ap-prob-val" style={{ color: 'var(--purple)' }}>{placementProbability.Dream}%</div>
            </div>

            {/* Core Tier */}
            <div className="ap-prob-row">
              <div className="ap-prob-label-wrap">
                <span className="ap-prob-tier" style={{ color: 'var(--blue)' }}>CORE TIER</span>
                <span className="ap-prob-desc">Mid-Product / Startup</span>
              </div>
              <div className="ap-prob-bar-container">
                <div className="ap-prob-fill" style={{ width: `${placementProbability.Core}%`, background: 'var(--blue)' }} />
              </div>
              <div className="ap-prob-val" style={{ color: 'var(--blue)' }}>{placementProbability.Core}%</div>
            </div>

            {/* Backup Tier */}
            <div className="ap-prob-row">
              <div className="ap-prob-label-wrap">
                <span className="ap-prob-tier" style={{ color: 'var(--green)' }}>BACKUP TIER</span>
                <span className="ap-prob-desc">Service / Consultancy</span>
              </div>
              <div className="ap-prob-bar-container">
                <div className="ap-prob-fill" style={{ width: `${placementProbability.Backup}%`, background: 'var(--green)' }} />
              </div>
              <div className="ap-prob-val" style={{ color: 'var(--green)' }}>{placementProbability.Backup}%</div>
            </div>

          </div>
        </div>

      </div>

      {/* ── INSIGHTS PANEL ── */}
      {insights?.length > 0 && (
        <div className="ap-card full" style={{ marginBottom: '20px' }}>
          <div className="ap-card-title">DIAGNOSTIC CRITIQUE & INSIGHTS</div>
          <div className="ap-insights-box">
            <ul className="ap-insights-list">
              {insights.map((insight, idx) => (
                <li key={idx} className="ap-insights-item">
                  <span className="ap-insights-bullet">⚡</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── SKILL GAP DIAGNOSIS ── */}
      <div className="ap-card full" style={{ marginBottom: '20px' }}>
        <div className="ap-card-title">SKILL GAP ANALYSIS</div>
        {skillGaps?.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
            No skill gaps diagnosed. Maintain your current consistency.
          </div>
        ) : (
          <div className="ap-gaps-list">
            {skillGaps.map((gap, idx) => {
              const critClass = `ap-badge crit-${gap.criticality?.toLowerCase() || 'medium'}`;
              const lvlClass = `ap-badge lvl-${gap.level?.toLowerCase() || 'novice'}`;
              return (
                <div key={idx} className="ap-gap-card">
                  <div className="ap-gap-header">
                    <span className="ap-gap-area">{gap.area?.toUpperCase()}</span>
                    <div className="ap-gap-badges">
                      <span className={lvlClass}>{gap.level || 'Novice'}</span>
                      <span className={critClass}>CRIT: {gap.criticality || 'Medium'}</span>
                    </div>
                  </div>
                  <div className="ap-gap-desc">{gap.gapDescription}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── TARGET COMPANY FIT MATCHES ── */}
      <div className="ap-card full" style={{ marginBottom: '20px' }}>
        <div className="ap-card-title">TARGET COMPANY FIT ANALYSIS</div>
        {companyFit?.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
            Configure your target company lists in Settings config to enable eligibility analysis.
          </div>
        ) : (
          <div className="ap-fit-grid">
            {companyFit.map((fit, idx) => {
              let badgeType = 'fit-prep';
              if (fit.verdict === 'Good Match') badgeType = 'fit-good';
              if (fit.verdict === 'Gap Identified') badgeType = 'fit-gap';
              return (
                <div key={idx} className="ap-fit-card">
                  <div className="ap-fit-header">
                    <span className="ap-fit-company">{fit.company?.toUpperCase()}</span>
                    <span className={`ap-badge ${badgeType}`}>{fit.verdict}</span>
                  </div>
                  <div className="ap-fit-details">{fit.details}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── PRIORITIZED ACTION ROADMAP ── */}
      <div className="ap-card full" style={{ marginBottom: '20px' }}>
        <div className="ap-card-title">PRIORITIZED ACTION PLAN</div>
        {actionPlan?.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
            All systems verified. Continue reviewing interview questions and practice sheets.
          </div>
        ) : (
          <div className="ap-action-list">
            {[...actionPlan].sort((a,b) => a.priority - b.priority).map((action, idx) => (
              <div key={idx} className="ap-action-row">
                <div className="ap-action-priority">{action.priority}</div>
                <div className="ap-action-body">
                  <div className="ap-action-task">{action.task}</div>
                  <div className="ap-action-impact">
                    <span style={{ color: 'var(--purple)' }}>◆</span>
                    <span>IMPACT: {action.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER ACTIONS ── */}
      <div className="ap-actions">
        <button className="ap-recalc-btn" onClick={handleRecalculate}>
          <span className="ap-recalc-icon">⟳</span>
          RE-RUN DIAGNOSTICS
        </button>
        <div className="ap-cache-note">
          {isFallback 
            ? '⚡ Baseline Mode — Add GEMINI_API_KEY to server config for live AI prediction analytics' 
            : '⚡ Diagnostics cached for 6 hours · Click to force refresh telemetry'}
        </div>
      </div>

    </div>
  );
}
