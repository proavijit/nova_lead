const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { globalLimiter } = require('./middleware/rateLimit.middleware');
const { getEnv } = require('./config/env');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');
const apiRouter = require('./routes');

const app = express();

/**
 * =========================================
 * CORS (MUST BE FIRST - VERCEL SAFE)
 * =========================================
 */

const allowedOrigins = [
  'https://novaleadclient.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow Postman / server-to-server (no origin)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false); // Just return false instead of Error to avoid breaking preflight
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));

// Handle preflight explicitly for all routes
app.options('*', cors());

/**
 * =========================================
 * SECURITY
 * =========================================
 */

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

/**
 * =========================================
 * MIDDLEWARE
 * =========================================
 */

app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));
app.use(globalLimiter);

/**
 * =========================================
 * ROUTES
 * =========================================
 */

app.use('/api/v1', apiRouter);

/**
 * =========================================
 * HEALTH CHECK
 * =========================================
 */

app.get('/api/v1/health', (req, res) => {
  const e = getEnv();

  const mask = (key) =>
    key ? `${key.slice(0, 8)}...${key.slice(-4)} (len=${key.length})` : '(missing)';

  res.json({
    status: 'ok',
    env: {
      NODE_ENV: e.NODE_ENV,
      VERCEL: process.env.VERCEL || '(not set)',
      OPENROUTER_API_KEY: mask(e.OPENROUTER_API_KEY),
      OPENROUTER_MODEL: e.OPENROUTER_MODEL,
      SUPABASE_URL: e.SUPABASE_URL ? 'set' : '(missing)'
    }
  });
});

/**
 * =========================================
 * ERROR HANDLER
 * =========================================
 */

app.use(errorHandler);

module.exports = app;