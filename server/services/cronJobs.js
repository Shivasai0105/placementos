const cron = require('node-cron');
const User = require('../models/User');
const PLAN = require('../data/plan');
const { sendDailyTasksEmail, emailEnabled } = require('../utils/email');

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
    tasks: weekData.days[currentDayIndex].tasks
  };
};

const startDailyTaskJob = () => {
  if (!emailEnabled()) {
    console.log('⚠️ Brevo API key missing. Daily task emails are disabled.');
    return;
  }

  const runJob = async () => {
    console.log(`[CRON] Starting daily tasks email job at ${new Date().toLocaleString()}`);
    try {
      // Find all verified users
      const users = await User.find({ isVerified: true });
      let sentCount = 0;

      for (const user of users) {
        const userPlan = getUserCurrentTasks(user.startDate);
        
        if (userPlan && userPlan.tasks && userPlan.tasks.length > 0) {
          try {
            await sendDailyTasksEmail(user.email, user.name, userPlan.dayName, userPlan.tasks);
            sentCount++;
            // Small delay to prevent rate hitting limits on Brevo if many users
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (emailErr) {
            console.error(`[CRON] Error sending email to ${user.email}:`, emailErr.message);
          }
        }
      }

      console.log(`[CRON] Finished daily tasks email job. Sent ${sentCount} emails.`);
    } catch (err) {
      console.error('[CRON] Error in daily tasks job:', err);
    }
  };

  // Schedule to run every day at 6:30 PM IST (Asia/Kolkata)
  cron.schedule('30 18 * * *', runJob, {
    timezone: 'Asia/Kolkata'
  });
  
  console.log('✅ Daily task cron job scheduled for 6:30 PM (Asia/Kolkata)');
};

module.exports = startDailyTaskJob;
