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

const app = express();

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PlacementOS API running 🚀', env: process.env.NODE_ENV });
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

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
