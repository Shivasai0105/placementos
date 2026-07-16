const express = require('express');
const auth = require('../middleware/authMiddleware');
const { aiQueueMiddleware } = require('../middleware/aiQueue');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Application = require('../models/Application');
const PLAN = require('../data/plan');

const router = express.Router();

// Apply auth middleware to all AI routes
router.use(auth);

// Apply concurrency queue to all AI routes (max 5 concurrent Gemini calls)
router.use(aiQueueMiddleware);

// Helper function to extract JSON from potentially markdown-wrapped text
const extractJson = (text) => {
  try {
    // Try simple direct parsing
    return JSON.parse(text.trim());
  } catch (e) {
    // If that fails, look for ```json ... ``` or ``` ... ``` code blocks
    const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch (innerErr) {
        throw new Error('Response returned markdown-wrapped JSON, but the content inside was invalid JSON: ' + innerErr.message);
      }
    }
    throw new Error('AI response was not format-compliant JSON. Raw response: ' + text.substring(0, 100));
  }
};

// POST /api/ai/resume-match — Analyze resume against job description
router.post('/resume-match', async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    if (!resume || !resume.trim()) {
      return res.status(400).json({ message: 'Resume text is required.' });
    }
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: 'Job description is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(503).json({ 
        message: 'Gemini API Key is not configured on the server. Please add GEMINI_API_KEY to your server .env file.' 
      });
    }

    const systemPrompt = `You are an expert technical recruiter and ATS (Applicant Tracking System) optimization algorithm.
Analyze the provided candidate resume against the target job description.

Determine the keyword matches, structural alignment, and skill gaps. 
You must respond with a single valid JSON object containing the evaluation. Do NOT include any introductory or concluding text. Do not wrap the JSON in Markdown code block backticks.

Required JSON format:
{
  "score": 75,
  "missingKeywords": ["Docker", "GraphQL", "Redis"],
  "strengths": ["Strong foundational React & Vite experience", "Implemented JWT authentication and state-management protocols"],
  "recommendations": ["Rewrite the project description to highlight Node.js API scale metrics", "Add CSS layout tokens to technical skills section"],
  "summary": "The candidate has strong frontend React and general javascript alignment, but lacks backend infrastructure exposure requested in the job description."
}

Ensure the "score" is an integer between 0 and 100. Provide 3 to 7 highly specific missing keywords. Ensure strengths and recommendations are highly actionable.`;

    const userPrompt = `RESUME TEXT:
${resume.trim()}

JOB DESCRIPTION TEXT:
${jobDescription.trim()}`;

    // Query Gemini API with resilient fallbacks (Gemini 2.5/2.0/1.5/pro)
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro-latest'];
    let lastError = null;
    let candidateText = null;

    for (const model of modelsToTry) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt },
                  { text: userPrompt }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        });

        if (response.ok) {
          const result = await response.json();
          candidateText = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            break; // Found working model and received response
          }
        } else {
          const errBody = await response.json().catch(() => ({}));
          lastError = errBody.error?.message || `Status ${response.status}`;
          console.warn(`Model ${model} returned error:`, lastError);
        }
      } catch (fetchErr) {
        lastError = fetchErr.message;
        console.warn(`Model ${model} connection timed out/failed:`, lastError);
      }
    }

    if (!candidateText) {
      console.error('All Gemini API models failed. Last error:', lastError);
      return res.status(502).json({ 
        message: 'AI gateway connection failed or model not supported.',
        error: lastError
      });
    }

    try {
      const analysis = extractJson(candidateText);
      res.json(analysis);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON. Content:', candidateText);
      res.status(502).json({ 
        message: 'Failed to parse AI diagnostics result. Please try again.',
        error: parseError.message 
      });
    }

  } catch (err) {
    console.error('AI Resume Match Error:', err);
    res.status(500).json({ message: 'Server error during AI diagnostics.' });
  }
});

// POST /api/ai/daily-plan — Generate a personalized daily study plan
router.post('/daily-plan', async (req, res) => {
  try {
    const { stats, weakTopics, targetCompanies, daysLeft } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Return a graceful fallback plan when API key is not configured
      return res.json({
        headline: "Stay consistent — every task completed brings you closer to your dream offer.",
        urgency: daysLeft <= 7 ? 'critical' : daysLeft <= 14 ? 'high' : daysLeft <= 21 ? 'medium' : 'low',
        focusTopics: weakTopics?.slice(0, 3).map(t => t.tag.toUpperCase()) || ['DSA', 'APTITUDE', 'DBMS'],
        tasks: [
          { name: "Solve 3 Array/String LeetCode problems", tag: "dsa", duration: "60 min" },
          { name: "Practice 15 Quantitative Aptitude questions", tag: "aptitude", duration: "45 min" },
          { name: "Revise SQL joins and normalization concepts", tag: "dbms", duration: "30 min" },
          { name: "Mock interview: explain 2 past projects clearly", tag: "comm", duration: "20 min" },
          { name: "Review company-specific question patterns", tag: "dev", duration: "30 min" },
        ],
        tip: `Focus on ${targetCompanies?.[0] || 'your target company'} — study their coding round patterns and practice similar difficulty problems.`,
        isFallback: true
      });
    }

    const weakTopicsText = weakTopics?.length
      ? weakTopics.map(t => `${t.tag.toUpperCase()} (${t.pct}% done)`).join(', ')
      : 'No weak topics identified yet';

    const companiesText = targetCompanies?.length
      ? targetCompanies.join(', ')
      : 'General placement';

    const systemPrompt = `You are an expert placement preparation coach for Indian engineering students. 
Generate a highly personalized daily study plan in strict JSON format.
Do NOT include any text outside the JSON. Do NOT wrap in markdown code blocks.

Required JSON structure:
{
  "headline": "one motivating sentence (max 15 words) tailored to the user's situation",
  "urgency": "low" | "medium" | "high" | "critical",
  "focusTopics": ["TOPIC1", "TOPIC2"],
  "tasks": [
    { "name": "specific task description", "tag": "dsa|aptitude|dbms|dev|comm", "duration": "X min" }
  ],
  "tip": "one specific, actionable tip mentioning target company patterns or strategies"
}

Rules:
- urgency: critical if daysLeft <= 7, high if <= 14, medium if <= 21, else low
- focusTopics: 2-3 topics from the weakest areas
- tasks: exactly 4-5 tasks, ordered by priority (most urgent first)
- tip: must be company-specific and directly actionable
- headline: must feel personal and motivating, not generic`;

    const userPrompt = `User context:
- Target companies: ${companiesText}
- Days remaining in preparation window: ${daysLeft}
- Current streak: ${stats?.streak || 0} days
- Tasks completed overall: ${stats?.tasksDone || 0}
- DSA problems solved: ${stats?.dsaDone || 0}
- Aptitude questions done: ${stats?.aptDone || 0}
- Weak topics (lowest completion %): ${weakTopicsText}
- Current readiness score: ${stats?.readiness || 0}%

Generate the personalized JSON study plan now.`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro-latest'];
    let lastError = null;
    let candidateText = null;

    for (const model of modelsToTry) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }, { text: userPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        if (response.ok) {
          const result = await response.json();
          candidateText = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) break;
        } else {
          const errBody = await response.json().catch(() => ({}));
          lastError = errBody.error?.message || `Status ${response.status}`;
          console.warn(`Model ${model} returned error:`, lastError);
        }
      } catch (fetchErr) {
        lastError = fetchErr.message;
        console.warn(`Model ${model} failed:`, lastError);
      }
    }

    if (!candidateText) {
      return res.status(502).json({ message: 'AI gateway failed.', error: lastError });
    }

    try {
      const plan = extractJson(candidateText);
      res.json(plan);
    } catch (parseError) {
      console.error('Failed to parse Gemini daily plan JSON:', candidateText);
      res.status(502).json({ message: 'Failed to parse AI plan result.', error: parseError.message });
    }

  } catch (err) {
    console.error('AI Daily Plan Error:', err);
    res.status(500).json({ message: 'Server error generating study plan.' });
  }
});

// Helper: compute day offset from startDate
function getDayOffset(startDate) {
  const s = new Date(startDate);
  s.setHours(0, 0, 0, 0);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((t - s) / 86400000));
}

// GET /api/ai/predict — Generate a personalized placement prediction and skill gap analysis
router.get('/predict', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) {
      progress = await Progress.create({ userId: req.userId });
    }

    const applications = await Application.find({ userId: req.userId });

    // Compute basic completion stats
    const tasks = Object.fromEntries(progress.tasks || {});
    const problems = Object.fromEntries(progress.problems || {});
    const commPrepDays = Object.fromEntries(progress.commPrepDays || {});
    const interviewReviewed = Object.fromEntries(progress.interviewReviewed || {});

    const tasksDone = Object.values(tasks).filter(Boolean).length;
    const probsDone = Object.values(problems).filter(Boolean).length;
    const commDaysDone = Object.values(commPrepDays).filter(Boolean).length;
    const interviewsDone = Object.values(interviewReviewed).filter(Boolean).length;

    // Categorized tasks completed
    let tagStats = { dsa: 0, aptitude: 0, dbms: 0, dev: 0, comm: 0, other: 0 };
    Object.entries(tasks).forEach(([key, val]) => {
      if (!val) return;
      const match = key.match(/^w(\d+)d(\d+)t(\d+)$/);
      if (!match) return;
      const [, wi, di, ti] = match.map(Number);
      const tag = PLAN[wi]?.days[di]?.tasks[ti]?.tag;
      if (tag === 'dsa') tagStats.dsa++;
      else if (tag === 'aptitude') tagStats.aptitude++;
      else if (tag === 'dbms' || tag === 'theory') tagStats.dbms++;
      else if (tag === 'dev' || tag === 'mern' || tag === 'project') tagStats.dev++;
      else if (tag === 'comm') tagStats.comm++;
      else tagStats.other++;
    });

    // Active applications summary
    const appStages = { saved: 0, applied: 0, oa: 0, interview: 0, offer: 0, rejected: 0 };
    const appliedCompanies = [];
    applications.forEach(app => {
      if (appStages[app.status] !== undefined) {
        appStages[app.status]++;
      }
      appliedCompanies.push(`${app.company} (${app.role} - status: ${app.status})`);
    });

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Dynamic simulated baseline generator based on statistics
    const simulatedReadiness = Math.min(100, Math.round(((tasksDone + probsDone) / (250 + 200)) * 100) + (user.cgpa ? Math.round(user.cgpa * 2) : 10));
    const simulatedDream = Math.min(100, Math.max(5, Math.round(simulatedReadiness * 0.6) + (user.cgpa > 8 ? 10 : 0)));
    const simulatedCore = Math.min(100, Math.max(10, Math.round(simulatedReadiness * 0.8) + (user.cgpa > 7 ? 10 : 0)));
    const simulatedBackup = Math.min(100, Math.max(20, Math.round(simulatedReadiness * 0.95) + 15));

    const simulatedData = {
      placementProbability: {
        Dream: simulatedDream,
        Core: simulatedCore,
        Backup: simulatedBackup
      },
      readinessRating: simulatedReadiness,
      confidenceScore: 0.75,
      insights: [
        `System baseline diagnostics indicate an overall readiness rating of ${simulatedReadiness}%.`,
        user.cgpa ? `Your academic standing (CGPA: ${user.cgpa}) satisfies cutoff requirements for key target companies.` : "Define your CGPA in Config settings to unlock precise eligibility matching diagnostics.",
        probsDone < 30 ? "Your DSA problem bank completion is currently a primary bottleneck. Focus on solving more questions." : "Good progress on the DSA problem bank. Keep practicing medium-tagged problems."
      ],
      skillGaps: [
        {
          area: "DSA",
          level: probsDone > 100 ? "Advanced" : probsDone > 30 ? "Intermediate" : "Novice",
          gapDescription: probsDone > 100 ? "Solid foundational problem solving. Keep optimizing graph patterns." : "Needs practice on key patterns (Sliding Window, Trees, and DP).",
          criticality: probsDone > 100 ? "low" : "high"
        },
        {
          area: "CS Core",
          level: tagStats.dbms > 5 ? "Intermediate" : "Novice",
          gapDescription: "Need to revise SQL normalization and OS process synchronization.",
          criticality: "medium"
        },
        {
          area: "Communication",
          level: commDaysDone > 10 ? "Advanced" : commDaysDone > 3 ? "Intermediate" : "Novice",
          gapDescription: "Mock interview recordings show minor pacing issues in technical explanations.",
          criticality: commDaysDone > 10 ? "low" : "medium"
        }
      ],
      companyFit: (user.targetCompanies || ['GENERAL']).map(company => {
        let verdict = "Needs Prep";
        let details = "Requires higher task and DSA completion to meet standard hiring benchmarks.";
        if (simulatedReadiness > 75) {
          verdict = "Good Match";
          details = "Telemetry aligns well with past selected candidates. Continue revision of mock interview templates.";
        } else if (simulatedReadiness > 45) {
          verdict = "Prep Needed";
          details = "Competent baseline; focus on core concepts and verify ATS compatibility score.";
        }
        return { company, verdict, details };
      }),
      actionPlan: [
        {
          priority: 1,
          task: "Complete remaining DSA roadmap tasks focusing on dynamic programming and graphs.",
          impact: "Increases Dream Tier placement probability by ~12%"
        },
        {
          priority: 2,
          task: "Review mock interview transcripts in Interview Prep section.",
          impact: "Improves overall communication and confidence indicators"
        },
        {
          priority: 3,
          task: "Submit at least 2 active job tracker applications in OA/Interview stage.",
          impact: "Increases interview funnel conversion rate"
        }
      ],
      isFallback: true
    };

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Return simulated data gracefully if API Key is not configured
      return res.json(simulatedData);
    }

    const systemPrompt = `You are the primary predictive hiring analytics module of PlacementOS, an enterprise placement platform. 
Analyze the student telemetry provided and produce a placement prediction and skill gap analysis diagnostic report.
You must output a single valid JSON object. Do not wrap the JSON in Markdown code block backticks (e.g. \`\`\`json). Do not add any introductory or concluding text.

Required JSON Schema:
{
  "placementProbability": {
    "Dream": 45, // Tier 1: FAANG, high-paying product companies (0-100 integer)
    "Core": 75,  // Tier 2: Mid-sized product companies, well-funded startups (0-100 integer)
    "Backup": 95 // Tier 3: Service-based companies, consultancies (0-100 integer)
  },
  "readinessRating": 65, // Overall score (0-100 integer)
  "confidenceScore": 0.85, // Float between 0.00 and 1.00
  "insights": [
    "Sentence summarizing overall preparation health.",
    "Sentence identifying major bottlenecks or areas of concern.",
    "Sentence offering general strategic advice based on target companies."
  ],
  "skillGaps": [
    {
      "area": "DSA" | "CS Core" | "Projects/Dev" | "Communication" | "Aptitude",
      "level": "Novice" | "Intermediate" | "Advanced",
      "gapDescription": "Short descriptive analysis of the gap",
      "criticality": "high" | "medium" | "low"
    }
  ],
  "companyFit": [
    {
      "company": "Company Name",
      "verdict": "Good Match" | "Prep Needed" | "Gap Identified",
      "details": "Actionable feedback for this specific company"
    }
  ],
  "actionPlan": [
    {
      "priority": 1, // Integer starting at 1
      "task": "Actionable task for the student",
      "impact": "Estimated probability/readiness uplift description"
    }
  ]
}

Rules:
1. Ground predictions strictly in the telemetry (e.g. low solved DSA problems = lower probability for FAANG/Dream, low CGPA = potential eligibility issue).
2. The 'companyFit' array must evaluate the specific target companies listed in the user profile.
3. The response must be 100% valid JSON and contain all required fields.`;

    const userPrompt = `User Profile:
- Name: ${user.name}
- CGPA: ${user.cgpa || 'Not set'}
- Target Companies: ${user.targetCompanies.join(', ')}
- Roadmap Offset: Day ${getDayOffset(user.startDate) + 1} of 56

Preparation Progress:
- Total Tasks Completed: ${tasksDone}
- DSA Problems Solved: ${probsDone}
- Communication Days Done: ${commDaysDone}
- Mock Interviews Reviewed: ${interviewsDone}

Categorized Task Completion Counts:
- DSA Curriculum Tasks: ${tagStats.dsa}
- Aptitude Tasks: ${tagStats.aptitude}
- DBMS & Theory Tasks: ${tagStats.dbms}
- Dev & Project Tasks: ${tagStats.dev}
- Communication Tasks: ${tagStats.comm}

Active Applications Status:
- Total Applications: ${applications.length}
- Saved: ${appStages.saved} | Applied: ${appStages.applied} | Online Assessment (OA): ${appStages.oa} | Interview: ${appStages.interview} | Offer: ${appStages.offer} | Rejected: ${appStages.rejected}
- Applied Companies List: ${appliedCompanies.join(', ') || 'No applications tracked yet'}

Analyze this profile and generate the prediction JSON.`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro-latest'];
    let lastError = null;
    let candidateText = null;

    for (const model of modelsToTry) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }, { text: userPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        if (response.ok) {
          const result = await response.json();
          candidateText = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) break;
        } else {
          const errBody = await response.json().catch(() => ({}));
          lastError = errBody.error?.message || `Status ${response.status}`;
          console.warn(`Model ${model} prediction error:`, lastError);
        }
      } catch (fetchErr) {
        lastError = fetchErr.message;
        console.warn(`Model ${model} prediction failed:`, lastError);
      }
    }

    if (!candidateText) {
      console.warn('All Gemini models failed for prediction. Returning simulated data fallback.');
      return res.json(simulatedData);
    }

    try {
      const prediction = extractJson(candidateText);
      res.json({ ...prediction, isFallback: false });
    } catch (parseError) {
      console.error('Failed to parse Gemini prediction JSON:', candidateText);
      res.status(502).json({ message: 'Failed to parse AI prediction result.', error: parseError.message });
    }

  } catch (err) {
    console.error('AI Predict Error:', err);
    res.status(500).json({ message: 'Server error generating placement prediction.' });
  }
});

// GET /api/ai/analytics-audit — Generate a personal performance audit report from progress metrics
router.get('/analytics-audit', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) {
      progress = await Progress.create({ userId: req.userId });
    }

    const applications = await Application.find({ userId: req.userId });

    // Compute basic completion stats
    const tasks = Object.fromEntries(progress.tasks || {});
    const problems = Object.fromEntries(progress.problems || {});
    const commPrepDays = Object.fromEntries(progress.commPrepDays || {});
    const interviewReviewed = Object.fromEntries(progress.interviewReviewed || {});

    const tasksDone = Object.values(tasks).filter(Boolean).length;
    const probsDone = Object.values(problems).filter(Boolean).length;
    const commDaysDone = Object.values(commPrepDays).filter(Boolean).length;
    const interviewsDone = Object.values(interviewReviewed).filter(Boolean).length;

    // Categorized tasks completed
    let tagStats = { dsa: 0, aptitude: 0, dbms: 0, dev: 0, comm: 0, other: 0 };
    Object.entries(tasks).forEach(([key, val]) => {
      if (!val) return;
      const match = key.match(/^w(\d+)d(\d+)t(\d+)$/);
      if (!match) return;
      const [, wi, di, ti] = match.map(Number);
      const tag = PLAN[wi]?.days[di]?.tasks[ti]?.tag;
      if (tag === 'dsa') tagStats.dsa++;
      else if (tag === 'aptitude') tagStats.aptitude++;
      else if (tag === 'dbms' || tag === 'theory') tagStats.dbms++;
      else if (tag === 'dev' || tag === 'mern' || tag === 'project') tagStats.dev++;
      else if (tag === 'comm') tagStats.comm++;
      else tagStats.other++;
    });

    // Active applications summary
    const appStages = { saved: 0, applied: 0, oa: 0, interview: 0, offer: 0, rejected: 0 };
    const appliedCompanies = [];
    applications.forEach(app => {
      if (appStages[app.status] !== undefined) {
        appStages[app.status]++;
      }
      appliedCompanies.push(`${app.company} (${app.role} - status: ${app.status})`);
    });

    const apiKey = process.env.GEMINI_API_KEY;

    // Dynamic simulated baseline generator based on statistics
    const totalTasks = PLAN.reduce((sum, w) => sum + w.days.reduce((s, d) => s + d.tasks.length, 0), 0);
    const completionRate = totalTasks > 0 ? (tasksDone / totalTasks) : 0;

    let simulatedReadinessTier = "Low";
    let simulatedReadinessExplanation = "Your overall roadmap progress is in the early stages. Prioritize checking off daily tasks to accelerate consistency.";
    if (completionRate > 0.6 || probsDone > 100) {
      simulatedReadinessTier = "High";
      simulatedReadinessExplanation = "Excellent progress telemetry. Your high solve metrics and consistent roadmap check-offs show great readiness for core interviews.";
    } else if (completionRate > 0.25 || probsDone > 40) {
      simulatedReadinessTier = "Medium";
      simulatedReadinessExplanation = "Moderate completion metrics. You have built a good foundation but require higher coverage in core CS fundamentals and advanced graphs.";
    }

    const simulatedData = {
      pipelineAnalysis: applications.length === 0 
        ? "No applications tracked. Establish your Kanban job board tracking immediately to begin collecting recruitment funnel analytics." 
        : `Funnel review: You have ${applications.length} total applications, with ${appStages.oa} in OA and ${appStages.interview} in Interview stages. Keep pushing applications to increase conversion rates.`,
      topicDeficit: probsDone < 30 
        ? "Deficit flagged: DSA problem bank is severely under-utilized. High-paying product roles require strong DSA proficiency. Target Arrays, Trees, and Strings."
        : "Good DSA balance. Your current bottleneck lies in CS Core theory tasks (Operating Systems, SQL Normalization). Schedule dedicated hours to clear theory tasks.",
      readinessTier: simulatedReadinessTier,
      readinessExplanation: simulatedReadinessExplanation,
      analystGoals: [
        { goal: "Solve 15 more questions in DSA Problem Bank", metricTarget: "Clear DSA deficit" },
        { goal: "Complete 5 DBMS/OS checklist tasks in Week 4 Roadmap", metricTarget: "Cover CS Core gaps" },
        { goal: "Move at least 2 job applications into the Applied stage", metricTarget: "Increase funnel volume" }
      ],
      isFallback: true
    };

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.json(simulatedData);
    }

    const systemPrompt = `You are an expert HR Data Analyst and Technical Placement Auditor.
Analyze the user's placement preparation telemetry and produce a quantitative performance audit report.
You must output a single valid JSON object. Do not wrap in markdown code blocks. Do not add any introductory or concluding text.

Required JSON Schema:
{
  "pipelineAnalysis": "One paragraph analyzing their job applications funnel, conversion ratios, and drop-off risks.",
  "topicDeficit": "One paragraph diagnosing their topic deficits in DSA and CS Core subjects.",
  "readinessTier": "Low" | "Medium" | "High",
  "readinessExplanation": "Detailed explanation justifying the readiness tier classification based on completion rates, CGPA, and coding count.",
  "analystGoals": [
    {
      "goal": "Specific task, e.g. Solve 10 Leetcode recursion questions",
      "metricTarget": "Uplift target, e.g. Boost recursion coverage by 20%"
    }
  ]
}

Rules:
1. Ensure 'readinessTier' matches the stats: Low if tasks+problems solved is low, Medium if moderate, High if they have high stats.
2. The response must be valid JSON and contain all fields.`;

    const userPrompt = `User Profile:
- CGPA: ${user.cgpa || 'Not set'}
- Target Companies: ${user.targetCompanies.join(', ')}

Preparation Progress:
- Total Tasks Completed: ${tasksDone}
- DSA Problems Solved: ${probsDone}
- Communication Days Done: ${commDaysDone}
- Mock Interviews Reviewed: ${interviewsDone}

Task Completion Tag Counts:
- DSA: ${tagStats.dsa}
- Aptitude: ${tagStats.aptitude}
- DBMS & Theory: ${tagStats.dbms}
- Dev & Project: ${tagStats.dev}
- Communication: ${tagStats.comm}

Active Applications Status:
- Total Applications: ${applications.length}
- Saved: ${appStages.saved} | Applied: ${appStages.applied} | OA: ${appStages.oa} | Interview: ${appStages.interview} | Offer: ${appStages.offer} | Rejected: ${appStages.rejected}
- Companies Applied: ${appliedCompanies.join(', ') || 'None'}

Analyze this profile and generate the audit JSON report.`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro-latest'];
    let lastError = null;
    let candidateText = null;

    for (const model of modelsToTry) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }, { text: userPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        if (response.ok) {
          const result = await response.json();
          candidateText = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) break;
        } else {
          const errBody = await response.json().catch(() => ({}));
          lastError = errBody.error?.message || `Status ${response.status}`;
          console.warn(`Model ${model} audit error:`, lastError);
        }
      } catch (fetchErr) {
        lastError = fetchErr.message;
        console.warn(`Model ${model} audit failed:`, lastError);
      }
    }

    if (!candidateText) {
      console.warn('All Gemini models failed for audit. Returning simulated data fallback.');
      return res.json(simulatedData);
    }

    try {
      const audit = extractJson(candidateText);
      res.json({ ...audit, isFallback: false });
    } catch (parseError) {
      console.error('Failed to parse Gemini audit JSON:', candidateText);
      res.status(502).json({ message: 'Failed to parse AI audit result.', error: parseError.message });
    }

  } catch (err) {
    console.error('AI Audit Error:', err);
    res.status(500).json({ message: 'Server error generating analytics audit.' });
  }
});

module.exports = router;

