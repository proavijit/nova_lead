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
 * ======================================
 * CORS CONFIG (PROPER FIX)
 * ======================================
 */

const allowedOrigins = [
  'https://novaleadclient.vercel.app',
];

// Dev mode এ localhost allow করতে চাইলে:
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000');
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  })
);

// Preflight
app.options('*', cors());

/**
 * ======================================
 * SECURITY
 * ======================================
 */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/**
 * ======================================
 * MIDDLEWARE
 * ======================================
 */

app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));
app.use(globalLimiter);

/**
 * ======================================
 * ROUTES
 * ======================================
 */

app.use('/api/v1', apiRouter);

/**
 * ======================================
 * HEALTH CHECK
 * ======================================
 */

app.get('/api/v1/health', (req, res) => {
  const e = getEnv();

  const mask = (key) =>
    key ? `${key.slice(0, 8)}...${key.slice(-4)} (len=${key.length})` : '(missing)';

  const rawMask = (key) => {
    const raw = process.env[key];
    if (!raw) return '(missing from process.env)';
    return `len=${raw.length} startsWithQuote=${raw.startsWith('"') || raw.startsWith("'")
      } hasNewline=${/[\r\n]/.test(raw)}`;
  };

  res.json({
    status: 'ok',
    env: {
      NODE_ENV: e.NODE_ENV,
      VERCEL: process.env.VERCEL || '(not set)',
      OPENROUTER_API_KEY: mask(e.OPENROUTER_API_KEY),
      OPENROUTER_API_KEY_raw: rawMask('OPENROUTER_API_KEY'),
      OPENROUTER_API_KEY_valid_prefix: e.OPENROUTER_API_KEY
        ? e.OPENROUTER_API_KEY.startsWith('sk-or-')
        : false,
      OPENROUTER_MODEL: e.OPENROUTER_MODEL,
      EXPLORIUM_API_KEY: mask(e.EXPLORIUM_API_KEY),
      SUPABASE_URL: e.SUPABASE_URL ? 'set' : '(missing)',
    },
  });
});

/**
 * ======================================
 * ERROR HANDLER
 * ======================================
 */

app.use(errorHandler);

module.exports = app;