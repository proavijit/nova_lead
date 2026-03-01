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

// Enable CORS at the very beginning of the middleware chain
app.use(
  cors({
    origin: (origin, callback) => callback(null, true), // Reflect request origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    optionsSuccessStatus: 200, // Important for some older browsers/clients
  })
);

// Explicitly handle preflight requests for all routes
app.options('*', cors());

app.use(helmet({
  crossOriginResourcePolicy: false, // Essential for cross-origin API access
}));

app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

app.use(globalLimiter);

app.use('/api/v1', apiRouter);

// Health check endpoint - verifies env vars are loaded correctly (no secrets exposed)
app.get('/api/v1/health', (req, res) => {
  const e = getEnv();
  const mask = (key) => (key ? `${key.slice(0, 8)}...${key.slice(-4)} (len=${key.length})` : '(missing)');
  const rawMask = (key) => {
    const raw = process.env[key];
    if (!raw) return '(missing from process.env)';
    return `len=${raw.length} startsWithQuote=${raw.startsWith('"') || raw.startsWith("'")} hasNewline=${/[\r\n]/.test(raw)}`;
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
      SUPABASE_URL: e.SUPABASE_URL ? 'set' : '(missing)'
    }
  });
});

app.use(errorHandler);

module.exports = app;
