const cron = require('node-cron');
const User = require('../models/User');
const Progress = require('../models/Progress');
const PLAN = require('../data/plan');
const { 
  sendDailyTasksEmail, 
  sendStreakWarningEmail, 
  sendProgressEncouragementEmail, 
  emailEnabled 
} = require('../utils/email');

// Function to calculate the current week and day for a user
const getUserCurrentTasks = (startDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0); // Normalize to start of day
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(now - start);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const currentWeekIndex = Math.floor(diffDays / 7);
  const currentDayIndex = diffDays % 7;

  // Check if out of bounds (e.g., plan only has 8 weeks)
  if (currentWeekIndex >= PLAN.length) {
    return null; // Plan completed
  }

  const weekData = PLAN[currentWeekIndex];
  if (!weekData || !weekData.days || !weekData.days[currentDayIndex]) {
    return null;
  }

  return {
    dayName: `${weekData.days[currentDayIndex].name} (Week ${weekData.week})`,
    tasks: weekData.days[currentDayIndex].tasks,
    weekIndex: currentWeekIndex,
    dayIndex: currentDayIndex,
    diffDays: diffDays
  };
};

const startDailyTaskJob = () => {
  if (!emailEnabled()) {
    console.log('⚠️ Brevo API key missing. Twice-daily task emails are disabled.');
    return;
  }

  // 1. Morning Dispatch: 7:30 AM (Asia/Kolkata)
  cron.schedule('30 7 * * *', async () => {
    console.log(`[CRON] Starting morning daily tasks email job at ${new Date().toLocaleString()}`);
    try {
      const users = await User.find({ isVerified: true });
      let sentCount = 0;

      for (const user of users) {
        const userPlan = getUserCurrentTasks(user.startDate);
        if (userPlan && userPlan.tasks && userPlan.tasks.length > 0) {
          try {
            await sendDailyTasksEmail(user.email, user.name, userPlan.dayName, userPlan.tasks);
            sentCount++;
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (emailErr) {
            console.error(`[CRON] Morning email failed for ${user.email}:`, emailErr.message);
          }
        }
      }
      console.log(`[CRON] Finished morning daily tasks email job. Sent ${sentCount} emails.`);
    } catch (err) {
      console.error('[CRON] Error in morning daily tasks job:', err);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });

  // Helper to calculate active streak
  const calculateStreak = (tasks, diffDays) => {
    let streak = 0;
    const tkey = (w, d, t) => `w${w}d${d}t${t}`;
    for (let d = diffDays; d >= 0; d--) {
      const dw = Math.min(Math.floor(d / 7), PLAN.length - 1);
      const dd = d % 7;
      const dayTasks = PLAN[dw]?.days[dd]?.tasks || [];
      const anyDone = dayTasks.some((_, ti) => tasks[tkey(dw, dd, ti)]);
      if (anyDone) streak++;
      else if (d < diffDays) break;
    }
    return streak;
  };

  // 2. Evening Check-in: 7:00 PM (Asia/Kolkata)
  cron.schedule('0 19 * * *', async () => {
    console.log(`[CRON] Starting evening streak check-in email job at ${new Date().toLocaleString()}`);
    try {
      const users = await User.find({ isVerified: true });
      let warningSent = 0;
      let encouragementSent = 0;

      for (const user of users) {
        const userPlan = getUserCurrentTasks(user.startDate);
        if (!userPlan || !userPlan.tasks || userPlan.tasks.length === 0) continue;

        let progress = await Progress.findOne({ userId: user._id });
        const tasks = progress ? Object.fromEntries(progress.tasks || {}) : {};

        // Check if any of today's tasks are done
        const tkey = (w, d, t) => `w${w}d${d}t${t}`;
        const dayTasks = userPlan.tasks;
        const anyDone = dayTasks.some((_, ti) => tasks[tkey(userPlan.weekIndex, userPlan.dayIndex, ti)]);

        // Calculate streak
        const streak = calculateStreak(tasks, userPlan.diffDays);

        try {
          if (anyDone) {
            await sendProgressEncouragementEmail(user.email, user.name, userPlan.dayName, dayTasks.length);
            encouragementSent++;
          } else {
            await sendStreakWarningEmail(user.email, user.name, userPlan.dayName, streak);
            warningSent++;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (emailErr) {
          console.error(`[CRON] Evening email failed for ${user.email}:`, emailErr.message);
        }
      }
      console.log(`[CRON] Finished evening email job. Sent ${encouragementSent} encouragements and ${warningSent} warnings.`);
    } catch (err) {
      console.error('[CRON] Error in evening streak check-in job:', err);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });

  console.log('✅ Daily task cron job scheduled for 7:30 AM & Evening streak safeguard scheduled for 7:00 PM (Asia/Kolkata)');
};

module.exports = startDailyTaskJob;
