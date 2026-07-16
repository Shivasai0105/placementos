/**
 * AI Request Queue / Concurrency Limiter
 * 
 * Limits concurrent Gemini API calls to prevent:
 * 1. Flooding the external API (rate limits / billing)
 * 2. Holding too many open connections simultaneously
 * 3. Event loop starvation from many pending promises
 * 
 * Uses a semaphore pattern: requests beyond the limit
 * are queued and served FIFO as slots free up.
 */

const MAX_CONCURRENT = parseInt(process.env.AI_MAX_CONCURRENT, 10) || 5;
const QUEUE_TIMEOUT_MS = 30 * 1000; // 30 seconds max wait in queue

let activeCount = 0;
const queue = [];

function aiQueueMiddleware(req, res, next) {
  if (activeCount < MAX_CONCURRENT) {
    // Slot available — proceed immediately
    activeCount++;
    attachCleanup(res);
    return next();
  }

  // No slot — queue the request
  const timeoutId = setTimeout(() => {
    // Remove from queue on timeout
    const idx = queue.findIndex((item) => item.id === entry.id);
    if (idx !== -1) queue.splice(idx, 1);
    res.status(503).json({
      message: 'AI service is busy. Please try again in a few seconds.',
      queuePosition: queue.length,
    });
  }, QUEUE_TIMEOUT_MS);

  const entry = {
    id: Date.now() + Math.random(),
    resolve: () => {
      clearTimeout(timeoutId);
      activeCount++;
      attachCleanup(res);
      next();
    },
  };

  queue.push(entry);
}

/**
 * Attach a cleanup hook that decrements the active count
 * when the response finishes (success or error).
 */
function attachCleanup(res) {
  const onFinish = () => {
    activeCount--;
    res.removeListener('finish', onFinish);
    res.removeListener('close', onFinish);

    // Serve next queued request if any
    if (queue.length > 0) {
      const nextEntry = queue.shift();
      nextEntry.resolve();
    }
  };

  res.on('finish', onFinish);
  res.on('close', onFinish);
}

/**
 * Get current queue stats (for monitoring / health checks).
 */
function getAiQueueInfo() {
  return {
    active: activeCount,
    maxConcurrent: MAX_CONCURRENT,
    queued: queue.length,
    queueTimeoutMs: QUEUE_TIMEOUT_MS,
  };
}

module.exports = { aiQueueMiddleware, getAiQueueInfo };
