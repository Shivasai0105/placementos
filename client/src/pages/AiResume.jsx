import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { showToast } from '../components/Toast';

export default function AiResume() {
  const { request } = useApi();
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resume.trim()) {
      showToast('Warning', 'Please paste your resume text first.');
      return;
    }
    if (!jobDescription.trim()) {
      showToast('Warning', 'Please paste the job description.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await request('/api/ai/resume-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });
      setResult(data);
      showToast('✅ Complete!', 'ATS diagnostics computed successfully.');
    } catch (err) {
      showToast('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  // Color logic for score
  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--green)';
    if (score >= 50) return 'var(--amber)';
    return 'var(--red)';
  };

  return (
    <div className="tracker-page">
      {/* HEADER */}
      <div className="tracker-header">
        <div className="th-left">
          <div className="th-badges">
            <span className="th-badge primary">AI MODULE</span>
            <span className="th-badge secondary">ATS_DIAGNOSTICS_v1.0</span>
          </div>
          <h1 className="th-title">AI Resume ATS Matcher</h1>
          <p className="th-desc">
            Compare your resume text directly with target Job Descriptions. Leverage LLM analytics to score match rates, extract keyword gaps, and refine bullets.
          </p>
        </div>
      </div>

      {!result ? (
        <form onSubmit={handleAnalyze} className="settings-section" style={{ border: '1px solid var(--border)' }}>
          <div className="settings-section-title" style={{ fontFamily: "'Fira Code', monospace", color: 'var(--blue)' }}>
            &gt;_ INITIALIZE_DIAGNOSTICS_PARAMS
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">PASTE_RESUME_TEXT *</label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste the plain text of your resume here (Ctrl+V)..."
              rows={10}
              required
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: '0.8rem',
                lineHeight: '1.5',
                resize: 'vertical',
                background: 'var(--bg)',
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">PASTE_TARGET_JOB_DESCRIPTION *</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target company's job post requirements and responsibilities here..."
              rows={8}
              required
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: '0.8rem',
                lineHeight: '1.5',
                resize: 'vertical',
                background: 'var(--bg)',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-green btn-lg btn-full"
            disabled={loading}
            style={{ fontSize: '0.8rem', fontWeight: 'bold' }}
          >
            {loading ? (
              <span className="blink-cursor">RUNNING_ATS_DIAGNOSTICS...</span>
            ) : (
              '⚡ RUN_DIAGNOSTICS_COMPUTATION'
            )}
          </button>
        </form>
      ) : (
        <div className="settings-section" style={{ border: `1px solid ${getScoreColor(result.score)}` }}>
          
          {/* RESULTS HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div style={{ fontFamily: "'Fira Code', monospace", color: getScoreColor(result.score), fontWeight: 'bold' }}>
              &gt;_ ATS_DIAGNOSTIC_REPORT: COMPLETED
            </div>
            <button className="btn" onClick={handleReset} style={{ fontFamily: "'Fira Code', monospace" }}>
              [↺] NEW_DIAGNOSTIC_RUN
            </button>
          </div>

          {/* SCORE BOARD */}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '24px', alignItems: 'center', background: 'var(--surface2)', padding: '20px', borderRadius: 'var(--radius)', marginBottom: '24px', border: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: getScoreColor(result.score), lineHeight: '1' }}>
                {result.score}
                <span style={{ fontSize: '1rem', color: 'var(--muted)' }}>%</span>
              </div>
              <div style={{ fontSize: '0.55rem', fontFamily: "'Fira Code', monospace", color: 'var(--muted)', marginTop: '4px', letterSpacing: '1px' }}>
                MATCH_SCORE
              </div>
            </div>
            <div>
              <div className="section-label" style={{ marginTop: '0', marginBottom: '8px' }}>EVALUATION_SUMMARY</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: '1.6' }}>{result.summary}</p>
            </div>
          </div>

          {/* MAIN RESULTS GRID */}
          <div className="analytics-grid" style={{ marginBottom: '0' }}>
            
            {/* MISSING KEYWORDS */}
            <div className="analytics-card" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <div className="analytics-card-title" style={{ color: 'var(--amber)', fontFamily: "'Fira Code', monospace", fontWeight: 'bold' }}>
                ⚠️ MISSING_KEYWORDS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {result.missingKeywords && result.missingKeywords.length > 0 ? (
                  result.missingKeywords.map((kw, i) => (
                    <span 
                      key={i} 
                      className="tag" 
                      style={{ 
                        background: 'rgba(255,184,0,0.1)', 
                        color: 'var(--amber)', 
                        border: '1px solid rgba(255,184,0,0.2)',
                        padding: '4px 10px',
                        fontSize: '0.65rem'
                      }}
                    >
                      {kw.toUpperCase()}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>No critical keyword gaps identified.</span>
                )}
              </div>
            </div>

            {/* STRENGTHS */}
            <div className="analytics-card" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <div className="analytics-card-title" style={{ color: 'var(--green)', fontFamily: "'Fira Code', monospace", fontWeight: 'bold' }}>
                ✓ STRENGTHS_DETECTION
              </div>
              <ul style={{ paddingLeft: '0', listStyle: 'none', margin: '0' }}>
                {result.strengths && result.strengths.map((str, i) => (
                  <li 
                    key={i} 
                    style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--text)', 
                      marginBottom: '8px', 
                      display: 'flex', 
                      gap: '8px',
                      lineHeight: '1.4'
                    }}
                  >
                    <span style={{ color: 'var(--green)', fontWeight: 'bold' }}>[+]</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ACTIONABLE RECOMMENDATIONS */}
            <div className="analytics-card full" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', marginTop: '16px' }}>
              <div className="analytics-card-title" style={{ color: 'var(--blue)', fontFamily: "'Fira Code', monospace", fontWeight: 'bold' }}>
                🛠️ BULLET_REFINEMENT_RECOMMENDATIONS
              </div>
              <ul style={{ paddingLeft: '0', listStyle: 'none', margin: '0' }}>
                {result.recommendations && result.recommendations.map((rec, i) => (
                  <li 
                    key={i} 
                    style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--text)', 
                      marginBottom: '10px', 
                      display: 'flex', 
                      gap: '8px',
                      lineHeight: '1.5'
                    }}
                  >
                    <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>[&gt;]</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
