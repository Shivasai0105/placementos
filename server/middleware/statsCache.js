/**
 * In-Memory Stats Cache
 * 
 * Caches the expensive /api/progress/stats response per userId
 * with a configurable TTL (default 30 seconds).
 * 
 * This avoids re-computing streak maps, weekly breakdowns,
 * and category breakdowns on every dashboard load.
 */

const CACHE_TTL_MS = 30 * 1000; // 30 seconds
const MAX_CACHE_SIZE = 500; // Max cached users to prevent memory leaks

const cache = new Map();

/**
 * Middleware: serve from cache if available and fresh.
 * Attach `res.cacheStats(data)` for the route handler to store results.
 */
function statsCacheMiddleware(req, res, next) {
  const userId = req.userId;
  if (!userId) return next();

  const entry = cache.get(userId);
  if (entry && (Date.now() - entry.timestamp) < CACHE_TTL_MS) {
    return res.json(entry.data);
  }

  // Attach helper to store response in cache
  res.cacheStats = (data) => {
    // Evict oldest entries if cache is too large
    if (cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    cache.set(userId, { data, timestamp: Date.now() });
  };

  next();
}

/**
 * Invalidate cache for a specific user.
 * Call this after any progress write (task toggle, problem toggle, etc.)
 */
function invalidateStatsCache(userId) {
  cache.delete(userId);
}

/**
 * Clear entire cache. Useful for testing or admin resets.
 */
function clearStatsCache() {
  cache.clear();
}

/**
 * Get current cache stats (for monitoring).
 */
function getStatsCacheInfo() {
  return {
    size: cache.size,
    maxSize: MAX_CACHE_SIZE,
    ttlMs: CACHE_TTL_MS,
  };
}

module.exports = {
  statsCacheMiddleware,
  invalidateStatsCache,
  clearStatsCache,
  getStatsCacheInfo,
};
