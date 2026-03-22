const express = require('express');
const auth = require('../middleware/authMiddleware');
const Progress = require('../models/Progress');
const User = require('../models/User');

// Static plan data (mirrored from frontend) used for server-side stats computation
const PLAN = require('../data/plan');

const router = express.Router();

// All routes below require authentication
router.use(auth);

// Helper: compute day offset from startDate
function getDayOffset(startDate) {
  const s = new Date(startDate);
  s.setHours(0, 0, 0, 0);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((t - s) / 86400000));
}

function getWD(offset) {
  const w = Math.min(Math.floor(offset / 7), PLAN.length - 1);
  const d = Math.min(offset % 7, PLAN[w].days.length - 1);
  return { w, d };
}

function tkey(w, d, t) {
  return `w${w}d${d}t${t}`;
}

// GET /api/progress — get full progress for user
router.get('/', async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) {
      progress = await Progress.create({ userId: req.userId });
    }

    const tasks = Object.fromEntries(progress.tasks || {});
    const problems = Object.fromEntries(progress.problems || {});
    const commPrepDays = Object.fromEntries(progress.commPrepDays || {});
    const interviewReviewed = Object.fromEntries(progress.interviewReviewed || {});

    res.json({ tasks, problems, commPrepDays, interviewReviewed });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/progress/task — toggle a task
router.post('/task', async (req, res) => {
  try {
    const { week, day, taskIndex } = req.body;
    if (week === undefined || day === undefined || taskIndex === undefined) {
      return res.status(400).json({ message: 'week, day, and taskIndex are required.' });
    }

    const key = tkey(week, day, taskIndex);
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });

    const current = progress.tasks.get(key) || false;
    progress.tasks.set(key, !current);
    await progress.save();

    res.json({ key, value: !current });
  } catch (err) {
    console.error('Toggle task error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/progress/problem — toggle a problem
router.post('/problem', async (req, res) => {
  try {
    const { problemId } = req.body;
    if (!problemId) return res.status(400).json({ message: 'problemId is required.' });

    const key = `p_${problemId}`;
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });

    const current = progress.problems.get(key) || false;
    progress.problems.set(key, !current);
    await progress.save();

    res.json({ key, value: !current });
  } catch (err) {
    console.error('Toggle problem error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/progress/comm-day — toggle a communication prep day
router.post('/comm-day', async (req, res) => {
  try {
    const { day } = req.body;
    if (day === undefined) return res.status(400).json({ message: 'day is required.' });

    const key = String(day);
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });

    const current = progress.commPrepDays.get(key) || false;
    progress.commPrepDays.set(key, !current);
    await progress.save();

    res.json({ key, value: !current });
  } catch (err) {
    console.error('Comm day toggle error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/progress/interview-review — toggle an interview question reviewed state
router.post('/interview-review', async (req, res) => {
  try {
    const { questionId } = req.body;
    if (!questionId) return res.status(400).json({ message: 'questionId is required.' });

    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });

    const current = progress.interviewReviewed.get(questionId) || false;
    progress.interviewReviewed.set(questionId, !current);
    await progress.save();

    res.json({ key: questionId, value: !current });
  } catch (err) {
    console.error('Interview review toggle error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/progress/log-today — mark all today's tasks done
router.post('/log-today', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const offset = getDayOffset(user.startDate);
    const { w, d } = getWD(offset);

    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });

    const dayTasks = PLAN[w]?.days[d]?.tasks || [];
    dayTasks.forEach((_, ti) => {
      progress.tasks.set(tkey(w, d, ti), true);
    });
    await progress.save();

    res.json({ message: 'Today logged!', tasksMarked: dayTasks.length });
  } catch (err) {
    console.error('Log today error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/progress/import — import data from localStorage export
router.post('/import', async (req, res) => {
  try {
    const { tasks, problems } = req.body;

    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });

    // Merge imported data (only set true values, don't override existing true)
    if (tasks && typeof tasks === 'object') {
      Object.entries(tasks).forEach(([key, value]) => {
        if (value === true) progress.tasks.set(key, true);
      });
    }
    if (problems && typeof problems === 'object') {
      Object.entries(problems).forEach(([key, value]) => {
        if (value === true) progress.problems.set(key, true);
      });
    }

    await progress.save();
    res.json({ message: 'Progress imported successfully!' });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/progress/stats — computed analytics stats
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });

    const tasks = Object.fromEntries(progress.tasks || {});
    const problems = Object.fromEntries(progress.problems || {});

    // Total tasks done
    const tasksDone = Object.values(tasks).filter(Boolean).length;
    const probsDone = Object.values(problems).filter(Boolean).length;

    // DSA tasks done
    let dsaDone = 0, aptDone = 0;
    Object.entries(tasks).forEach(([key, val]) => {
      if (!val) return;
      const match = key.match(/^w(\d+)d(\d+)t(\d+)$/);
      if (!match) return;
      const [, wi, di, ti] = match.map(Number);
      const tag = PLAN[wi]?.days[di]?.tasks[ti]?.tag;
      if (tag === 'dsa') dsaDone++;
      if (tag === 'aptitude') aptDone++;
    });

    // Current week
    const offset = getDayOffset(user.startDate);
    const { w } = getWD(offset);

    // Streak calculation
    let streak = 0;
    for (let d = offset; d >= 0; d--) {
      const dw = Math.min(Math.floor(d / 7), PLAN.length - 1);
      const dd = d % 7;
      const dayTasks = PLAN[dw]?.days[dd]?.tasks || [];
      const anyDone = dayTasks.some((_, ti) => tasks[tkey(dw, dd, ti)]);
      if (anyDone) streak++;
      else if (d < offset) break;
    }

    // Weekly breakdown (tasks completed per week)
    const weeklyStats = PLAN.map((week, wi) => {
      let done = 0, total = 0;
      week.days.forEach((day, di) => {
        day.tasks.forEach((_, ti) => {
          total++;
          if (tasks[tkey(wi, di, ti)]) done++;
        });
      });
      return { week: wi + 1, theme: week.theme, done, total };
    });

    // Total tasks in entire plan
    const totalTasks = PLAN.reduce((sum, w) => sum + w.days.reduce((s, d) => s + d.tasks.length, 0), 0);
    const totalProblems = 250; // approximate

    // Readiness score
    const readiness = Math.round(((tasksDone + probsDone) / (totalTasks + totalProblems)) * 100);

    // 56-day streak map
    const streakMap = Array.from({ length: 56 }, (_, d) => {
      const dw = Math.min(Math.floor(d / 7), PLAN.length - 1);
      const dd = d % 7;
      const dayTasks = PLAN[dw]?.days[dd]?.tasks || [];
      const anyDone = dayTasks.some((_, ti) => tasks[tkey(dw, dd, ti)]);
      const isToday = d === offset;
      const isFuture = d > offset;
      return { day: d + 1, done: anyDone, isToday, isFuture };
    });

    res.json({
      tasksDone,
      probsDone,
      dsaDone: dsaDone + probsDone,
      aptDone,
      currentWeek: w + 1,
      streak,
      weeklyStats,
      streakMap,
      readiness,
      offset
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
