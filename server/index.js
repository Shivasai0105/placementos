const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const applicationRoutes = require('./routes/applications');
const aiRoutes = require('./routes/ai');
const startDailyTaskJob = require('./services/cronJobs');
const { getStatsCacheInfo } = require('./middleware/statsCache');
const { getAiQueueInfo } = require('./middleware/aiQueue');

const app = express();

// ─── Trust Render's proxy (fixes express-rate-limit X-Forwarded-For warning) ──
app.set('trust proxy', 1);

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow Vercel frontend
}));

// ─── Gzip Compression ─────────────────────────────────────────────────────────
app.use(compression());

// ─── HTTP Request Logging (Morgan) ───────────────────────────────────────────
// Use 'combined' in production for full Apache-style logs, 'dev' for coloured short logs
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── CORS ────────────────────────────────────────────────────────────────────
// Set ALLOWED_ORIGINS on Render as a comma-separated list, e.g.:
//   https://placementos-kappa.vercel.app,http://localhost:5173
const rawOrigins = process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser tools (Postman, curl) that send no Origin header
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`CORS blocked: ${origin}`);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

// ⚠️ OPTIONS pre-flight MUST come BEFORE app.use(cors(...))
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // limit body size to prevent large payloads

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PlacementOS API running 🚀', env: process.env.NODE_ENV });
});

// ─── Server Monitoring Endpoint ──────────────────────────────────────────────
app.get('/api/monitor', (req, res) => {
  res.json({
    status: 'ok',
    pid: process.pid,
    uptime: Math.round(process.uptime()),
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    },
    statsCache: getStatsCacheInfo(),
    aiQueue: getAiQueueInfo(),
  });
});

// ─── 404 Handler (always JSON, never HTML) ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─── Global Error Handler (always JSON, never HTML) ──────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
});

// ─── MongoDB Connection Options ──────────────────────────────────────────────
const mongoOptions = {
  maxPoolSize: 50,    // Max concurrent connections (up from default 100 → tuned to 50 for efficiency)
  minPoolSize: 5,     // Keep 5 connections warm
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
let server;

mongoose
  .connect(process.env.MONGODB_URI, mongoOptions)
  .then(() => {
    console.log('✅ MongoDB connected');
    console.log(`   Pool: min=${mongoOptions.minPoolSize}, max=${mongoOptions.maxPoolSize}`);
    startDailyTaskJob();
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (pid: ${process.pid})`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);

  // 1. Stop accepting new connections
  if (server) {
    server.close(() => {
      console.log('   ✅ HTTP server closed');
    });
  }

  // 2. Close MongoDB connection
  try {
    await mongoose.connection.close();
    console.log('   ✅ MongoDB connection closed');
  } catch (err) {
    console.error('   ❌ Error closing MongoDB:', err);
  }

  // 3. Exit
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

