/**
 * PlacementOS — Cluster Entry Point
 * 
 * Forks one worker per CPU core for production.
 * Falls back to single-process mode in development.
 * 
 * Usage:
 *   Production:  NODE_ENV=production node cluster.js
 *   Development: node index.js (or npm run dev)
 */

const cluster = require('cluster');
const os = require('os');

const NUM_CPUS = os.cpus().length;
const IS_PROD = process.env.NODE_ENV === 'production';

if (!IS_PROD) {
  // In development, just run the server directly (no clustering)
  console.log('🔧 Development mode — running single process');
  require('./index');
} else if (cluster.isPrimary) {
  console.log(`🚀 Primary process ${process.pid} starting...`);
  console.log(`📊 Forking ${NUM_CPUS} workers (one per CPU core)`);

  // Fork workers
  for (let i = 0; i < NUM_CPUS; i++) {
    cluster.fork();
  }

  // Track worker lifecycle
  cluster.on('online', (worker) => {
    console.log(`  ✅ Worker ${worker.process.pid} is online`);
  });

  // Graceful restart on worker crash
  cluster.on('exit', (worker, code, signal) => {
    const reason = signal || `exit code ${code}`;
    console.warn(`  ⚠️ Worker ${worker.process.pid} died (${reason}). Restarting...`);

    // Small delay to avoid rapid restart loops
    setTimeout(() => {
      cluster.fork();
    }, 1000);
  });

  // Graceful shutdown for primary
  const shutdown = () => {
    console.log('\n🛑 Primary received shutdown signal. Stopping workers...');
    for (const id in cluster.workers) {
      cluster.workers[id].process.kill('SIGTERM');
    }
    // Give workers 5 seconds to finish, then force exit
    setTimeout(() => {
      console.log('💀 Force killing remaining workers');
      process.exit(0);
    }, 5000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

} else {
  // Worker process — start the Express server
  console.log(`  🏗️ Worker ${process.pid} starting...`);
  require('./index');
}
